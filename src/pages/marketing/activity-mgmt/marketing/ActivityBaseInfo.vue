<template>
  <biz-grid class="activity-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="activity" label-width="110px" size="small" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="活动类型">
        <el-select v-model="activity.typeStr" :disabled="!isCreated" @change="typeChange" popper-class="selectClass">
          <el-option :label="activityType.label" :value="activityType.value" :key="index" v-for="(activityType,index) of activityTypes"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称" prop="title">
        <el-input placeholder="请输入活动名称" maxlength="15" v-model="activity.title" size></el-input>
      </el-form-item>
      <el-form-item label="所属店铺" prop="name">
        <el-input disabled v-model="activity.shop.name"></el-input>
      </el-form-item>
      <el-form-item :label="activity.typeStr==='9'?'报名开始时间':'开始时间'" prop="beginDate" v-if="activity.typeStr!=='11'&&activity.typeStr!=='12'">
        <el-date-picker v-model="activity.beginDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item :label="activity.typeStr==='9'?'报名结束时间':'结束时间'" prop="endDate" v-if="activity.typeStr!=='11'&&activity.typeStr!=='12'">
        <el-date-picker v-model="activity.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动开始时间" prop="attendBeginDate" v-if="activity.typeStr==='9'||activity.typeStr==='11'||activity.typeStr==='12'">
        <el-date-picker v-model="activity.attendBeginDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间" prop="attendEndDate" v-if="activity.typeStr==='9'||activity.typeStr==='11'||activity.typeStr==='12'">
        <el-date-picker v-model="activity.attendEndDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动地点" prop="lngBaidu" v-if="activity.typeStr==='9'">
        <biz-map-pointer v-model="point" :address="activity.address" @addressChange="handleAddressChange"></biz-map-pointer>
      </el-form-item>
      <el-form-item label="是否收费" v-if="activity.typeStr==='9'">
        <el-radio v-model="isFee" label="1">是</el-radio>
        <el-radio v-model="isFee" label="0">否</el-radio>
      </el-form-item>
      <el-form-item v-show="isFee === '1'&&activity.typeStr==='9'" prop="amount">
        <el-input placeholder="请输入活动金额" v-model="activity.fee" type="number" min="0">
          <template slot="append">元/位</template>
        </el-input>
      </el-form-item>
      <el-form-item label="表单必填" prop="options" :value="activity.options" v-if="activity.typeStr==='9'">
        <tag-manager v-model="activity.options" :removeHandler="removeHandler" @change="change"></tag-manager>
      </el-form-item>
      <el-form-item label="活动封面" prop="cover" v-show="activity.typeStr==='9'">
        <BizAvatarUploaderNew v-model="activity.cover"  @uploadSuccess="uploadSuccess"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="活动封面" prop="cover" v-show="activity.typeStr==='11'||activity.typeStr==='12'" class="isRequired">
        <BizAvatarUploaderNew v-model="activity.cover" @uploadSuccess="uploadSuccess"></BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="是否扫描本店铺二维码" v-if="activity.typeStr!=='11'||activity.typeStr!=='12'">
        <div class="isScan">
          <el-radio v-model="activity.isScan" label="1">是</el-radio>
          <el-radio v-model="activity.isScan" label="0">否</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="活动状态">
        <el-select :disabled="isCreated" v-model="activity.stateStr">
          <el-option :label="status.label" :value="status.value" :key="index" :disabled="status.disabled" v-for="(status,index) of activitiStatus"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="!isCreated" label="创建时间" prop="createDate" v-if="activity.typeStr!=='11'||activity.typeStr!=='12'">
        <el-input disabled v-model="activity.createDate"></el-input>
      </el-form-item>

      <el-form-item v-show="!isCreated&&(activity.typeStr!=='11'||activity.typeStr!=='12')" label="地址">
        <el-input type="textarea" :rows="2" disabled :value="activityUrl"></el-input>
      </el-form-item>
      <el-form-item label="是否计入潜客" v-if="activity.typeStr!=='11'||activity.typeStr!=='12'">
        <el-radio v-model="activity.isCreatPConsumer" label="1">是</el-radio>
        <el-radio v-model="activity.isCreatPConsumer" label="0">否</el-radio>
      </el-form-item>
      <el-form-item v-if="activity.typeStr!=='11'&&activity.typeStr!=='12'" label="活动说明"></el-form-item>
      <div class="e-wrapper" v-if="activity.typeStr!=='11'&&activity.typeStr!=='12'">
        <biz-editor ref="editor" height="400px" width="430px" v-model="activity.content"></biz-editor>
      </div>
      <!-- <div class="e-wrapper-i" v-show="activity.typeStr==='11'">
        <iframe v-if="activity.content" :src="activity.content" frameborder="0" scrolling="auto" width="350px" height="450px" style="float:right"></iframe>
      </div>-->
    </el-form>

    <biz-dialog-selector
      title="选择活动"
      selectionMode="single"
      :visibility="dialogVisible"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
      @confirmed="selectActivity"
      @filterDataChange="doalogFilterDataChange"
    >
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column :formatter="getType" label="活动类型"></el-table-column>
      <el-table-column width="150" prop="beginDate" label="发布时间"></el-table-column>
      <el-table-column width="150" prop="endDate" label="结束时间"></el-table-column>
      <el-table-column width="150" prop="type" :formatter="getState" label="状态"></el-table-column>
    </biz-dialog-selector>

    <el-dialog
      append-to-body
      class="marketing-preview"
      title="预览"
      :visible="previewDialogOpen"
      :open="previewDialogOpen"
      @close="previewDialogOpen=false"
      width="450px"
    >
      <!-- <div class="bg" :style="{ background: background}"> -->
      <div align="center">
        <el-select size="mini" @change="sizeChange" v-model="value">
          <el-option label="iphone6/7/8" value="0"></el-option>
          <el-option label="iPhone6/7/8 Plus" value="1"></el-option>
          <el-option label="华为P30" value="2"></el-option>
          <el-option label="华为P30 Pro" value="3"></el-option>
          <el-option label="华为Mate20" value="4"></el-option>
          <el-option label="华为Mate20 Pro" value="5"></el-option>
        </el-select>
      </div>
      <div class="cpreview">
        <q-h-b-preview v-if="activity.typeStr==='0'" :activity="activity" :width="width" :height="height"></q-h-b-preview>
        <y-y-y-preview v-if="activity.typeStr==='1'" :activity="activity" :width="width" :height="height"></y-y-y-preview>
        <c-j-y-preview v-if="activity.typeStr==='2'&& activity.shape==='0' && isCreated===false" :activity="activity" :width="width" :height="height"></c-j-y-preview>
        <c-j-f-preview v-if="activity.typeStr==='2'&&activity.shape==='1' && isCreated===false" :activity="activity" :width="width" :height="height"></c-j-f-preview>
        <p-t-g-preview v-if="activity.typeStr==='3'" :activity="activity" :width="width" :height="height"></p-t-g-preview>
        <n-y-q-g-preview v-if="activity.typeStr==='4'" :activity="activity" :width="width" :height="height"></n-y-q-g-preview>
        <x-s-m-s-preview v-if="activity.typeStr==='5'" :activity="activity" :width="width" :height="height"></x-s-m-s-preview>
        <b-k-j-preview v-if="activity.typeStr==='6'" :activity="activity" :width="width" :height="height"></b-k-j-preview>
        <t-j-y-l-preview v-if="activity.typeStr==='7'" :activity="activity" :width="width" :height="height"></t-j-y-l-preview>
        <f-x-y-l-preview v-if="activity.typeStr==='8'" :activity="activity" :width="width" :height="height"></f-x-y-l-preview>
        <z-m-preview v-if="activity.typeStr==='9'" :activity="activity" :width="width" :height="height"></z-m-preview>
      </div>
      <!-- </div> -->
    </el-dialog>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizEditor } from '@/components/BizEditorH';
import Service from '@/service/activity-mgmt/marketing/activityMgmt';
import YYYPreview from './preview/YYYPreview';
import PTGPreview from './preview/PTGPreview';
import CJFPreview from './preview/CJFPreview';
import QHBPreview from './preview/QHBPreview';
import CJYPreview from './preview/CJYPreview';
import XSMSPreview from './preview/XSMSPreview';
import NYQGPreview from './preview/NYQGPreview';
import BKJPreview from './preview/BKJPreview';
import TJYLPreview from './preview/TJYLPreview';
import FXYLPreview from './preview/FXYLPreview';
import ZMPreview from './preview/ZMPreview';
import phoneB from '@/assets/images/iphone-b.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import { BizMapPointer } from '@/components/BizMapPointer';
import { TagManager } from '@/pages/marketing/activity-mgmt/components/BizTagManager';
import { VueCropper } from '@/components/BizForm';
import http from '@/common/http';
// import http from '@/common/http';
export default {
  name: 'ActivityBaseInfo',
  data() {
    const addressValid = (rule, rules, callback) => {
      if (this.activity.address.indexOf('市') > 0) {
        callback();
      } else {
        callback(new Error('地址中必须包含所在城市'));
      }
    };
    return {
      openV: false,
      picUrl: '',
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      previewDialogOpen: false,
      isCreated: true,
      loading: false,
      modelType: '0',
      value: '0',
      isFee: '0',
      width: '375',
      height: '567',
      dialogVisible: false,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      fileData: {
        type: '0'
      },
      togetherActivity: {
        id: '',
        title: ''
      },
      size: {
        width: 120,
        height: 60
      },
      urlArray: [
        'eve_robRedPacket',
        'eve_shakes',
        ['eve_luckyDraw_two', 'eve_luckyDraw'],
        'eve_groupShopping',
        'eve_robBuy',
        'eve_timeSpike',
        'eve_helpBargain',
        'eve_recommend'
      ],
      removeHandler: tag => {
        if (tag.isAttend === '1') {
          this.$message.warning('该字段已经有人报名使用，无法删除');
          return false;
        } else {
          return true;
        }
      },
      activity: {
        memberRanks: [],
        id: '',
        title: '',
        content: '',
        images: [],
        typeStr: '0',
        cover: '/resources/admin/images/default/qhb.png',
        beginDate: '',
        endDate: '',
        latBaidu: '',
        lngBaidu: '',
        fee: '',
        attendBeginDate: '',
        attendEndDate: '',
        options: [],
        // 是否扫描本店铺二维码
        isScan: '0',
        // 是否搭配活动
        isTogetherActivity: '0',
        // 是否计入潜客
        isCreatPConsumer: '0',
        stateStr: '3',
        // 形状
        shape: '0',
        togetherActivity: {
          id: '',
          title: ''
        },
        shopId: '',
        shop: {
          id: '',
          name: '',
          address: ''
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          disabled: false,
          type: 'primary',
          auth: ['admin:activity.edit']
        },
        {
          disabled: false,
          label: '预览',
          name: 'preview',
          type: '',
          class: 'show'
        }
      ],
      activitiStatus: [
        {
          label: '已发布',
          value: '0',
          disabled: false
        },
        {
          label: '进行中',
          value: '1',
          disabled: true
        },
        {
          label: '已结束',
          value: '2',
          disabled: true
        },
        {
          label: '已创建',
          value: '3',
          disabled: false
        },
        { label: '已提交', value: '4', disabled: true },
        { label: '已取消', value: '5', disabled: true }
      ],
      activityTypes: [
        {
          label: '抢红包',
          value: '0'
        },
        {
          label: '摇一摇',
          value: '1'
        },
        {
          label: '抽奖',
          value: '2'
        },
        {
          label: '拼团购',
          value: '3'
        },
        {
          label: 'N元抢购',
          value: '4'
        },
        {
          label: '限时秒杀',
          value: '5'
        },
        {
          label: '帮砍价',
          value: '6'
        },
        {
          label: '推荐有礼',
          value: '7'
        },
        {
          label: '分享有礼',
          value: '8'
        },
        {
          label: '活动招募',
          value: '9'
        },
        {
          label: '潜客活动',
          value: '11'
        },
        {
          label: '推广活动',
          value: '12'
        }
      ],
      rules: {
        title: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }
        ],
        lngBaidu: [
          {
            required: true,
            message: '请输入正确的活动地点',
            trigger: 'blur'
          },
          {
            validator: addressValid,
            trigger: 'blur'
          }
        ],
        beginDate: [
          {
            required: true,
            message: '请输入开始时间',
            trigger: 'blur'
          }
        ],
        endDate: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ],
        options: [
          {
            required: true,
            message: '请输入表单必填项',
            trigger: 'blur'
          }
        ],
        attendBeginDate: [
          {
            required: true,
            message: '请输入活动开始时间',
            trigger: 'blur'
          }
        ],
        attendEndDate: [
          {
            required: true,
            message: '请输入活动结束时间',
            trigger: 'blur'
          }
        ]
      },
      dialogOperations: [
        {
          label: '选择',
          name: 'selectActivity',
          type: 'primary'
        }
      ],
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入活动标题搜索',
          name: 'searchValue',
          value: ''
        }
      ],
      defaultImages: {
        qhb: '/resources/admin/images/default/qhb.png',
        yyy: '/resources/admin/images/default/yyy.png',
        cj: '/resources/admin/images/default/cj.png',
        ptg: '/resources/admin/images/default/ptg.png',
        nyqg: '/resources/admin/images/default/nyqg.png',
        xsms: '/resources/admin/images/default/xsms.png',
        bkj: '/resources/admin/images/default/bkj.png',
        tjyl: '/resources/admin/images/default/tjyl.png',
        fxyl: '/resources/admin/images/default/fxyl.png',
        zm: '/resources/admin/images/default/zm.png',
        qkhd: '/resources/admin/images/default/qkhd.jpg'
      },
      importResult: [],
      importLoading: false,
      disabled: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: ''
    };
  },
  props: {
    memberRankList: Array,
    open: {
      type: Boolean
    },
    defaultShop: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          address: ''
        };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    BizEditor,
    BizDialogSelector,
    YYYPreview,
    PTGPreview,
    CJFPreview,
    QHBPreview,
    CJYPreview,
    XSMSPreview,
    NYQGPreview,
    BKJPreview,
    TJYLPreview,
    FXYLPreview,
    ZMPreview,
    BizMapPointer,
    TagManager,
    VueCropper
  },
  created() {
    this.getDefaultUrl();
  },
  mounted() {},
  computed: {
    // dateRange: {
    //   get() {
    //     if (this.activity.attendBeginDate && this.activity.attendEndDate) {
    //       return [this.activity.attendBeginDate, this.activity.attendEndDate];
    //     } else {
    //       return [];
    //     }
    //   },
    //   set(newValue) {
    //     if (newValue) {
    //       this.activity.attendBeginDate = newValue[0];
    //       this.activity.attendEndDate = newValue[1];
    //     } else {
    //       this.activity.attendBeginDate = '';
    //       this.activity.attendEndDate = '';
    //     }
    //   }
    // },
    point: {
      get() {
        return {
          lng: this.activity.lngBaidu,
          lat: this.activity.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.activity.lngBaidu = nVal.lng;
          this.activity.latBaidu = nVal.lat;
        }
      }
    },
    vipRankList() {
      let memberRankList = this.memberRankList;

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          vip.checked = false;
        }
      }

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          for (const iterator of this.activity.memberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    },
    activityUrl() {
      return window.location.origin + '/resources/admin/ecStatic/index.html#/' + this.getUrl() + '/' + this.activity.id;
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.$el.scrollTop = 0;
      this.$refs.form.clearValidate();
      if (nVal.id) {
        if (nVal.id !== oVal.id) {
          this.refresh(nVal.id);
        }
      } else {
        if (nVal.id !== oVal.id) {
          this.clear();
        }
      }
    },
    open(val) {
      if (val) {
        this.refresh(val);
      }
    }
  },
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.activity.cover = url;
    },
    getDefaultUrl() {
      http
        .get('/admin/settings/settings.jhtml', { type: '1' })
        .then(data => {
          if (data.settingList.defaultRedPacketImage) {
            this.defaultImages.qhb = data.settingList.defaultRedPacketImage;
          }
          if (data.settingList.defaultShakeImage) {
            this.defaultImages.yyy = data.settingList.defaultShakeImage;
          }
          if (data.settingList.defaultLotteryImage) {
            this.defaultImages.cj = data.settingList.defaultLotteryImage;
          }
          if (data.settingList.defaultGroupBuyingImage) {
            this.defaultImages.ptg = data.settingList.defaultGroupBuyingImage;
          }
          if (data.settingList.defaultPanicBuyingImage) {
            this.defaultImages.nyqg = data.settingList.defaultPanicBuyingImage;
          }
          if (data.settingList.defaultSeckillImage) {
            this.defaultImages.xsms = data.settingList.defaultSeckillImage;
          }
          if (data.settingList.defaultBargainImage) {
            this.defaultImages.bkj = data.settingList.defaultBargainImage;
          }
          if (data.settingList.defaultRecommendRewardImage) {
            this.defaultImages.tjyl = data.settingList.defaultRecommendRewardImage;
          }
          if (data.settingList.defaultShareImage) {
            this.defaultImages.fxyl = data.settingList.defaultShareImage;
          }
          if (data.settingList.defaultRecruitImage) {
            this.defaultImages.zm = data.settingList.defaultRecruitImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    doalogFilterDataChange() {
      this.getMatchActivityList();
    },
    handleAddressChange(val) {
      this.$refs.form.clearValidate('lngBaidu');
      this.$set(this.activity, 'address', val);
    },
    change() {
      this.$refs.form.clearValidate('options');
    },
    sizeChange(value) {
      switch (value) {
        case '0':
          this.width = '375px';
          this.height = '567px';
          break;
        case '1':
          this.width = '414px';
          this.height = '636px';
          break;
        case '2':
          this.width = '395px';
          this.height = '597px';
          break;
        case '3':
          this.width = '414px';
          this.height = '636px';
          break;
        case '4':
          this.width = '395px';
          this.height = '597px';
          break;
        case '5':
          this.width = '414px';
          this.height = '636px';
          break;
        default:
          break;
      }
    },
    // 正则筛选富文本中的图片
    getImgs(content) {
      let tmp = [];
      let reg = new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/, 'g');
      let flag = true;
      while (flag) {
        flag = reg.exec(content);
        if (flag) {
          tmp.push(flag[1]);
        }
      }
      return tmp;
    },
    getUrl() {
      let url = this.urlArray[this.activity.typeStr];
      if (Array.isArray(url)) {
        if (this.activity.shape === '0') {
          // 原形
          return url[0];
        }
        return url[1];
      }
      return url;
    },
    vipChange(val) {
      if (val.checked) {
        this.activity.memberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.activity.memberRanks.splice(index, 1);
          }
        });
      } else {
        this.activity.memberRanks.push({ id: val.id });
      }
    },
    selectActivity(val, val2) {
      this.activity.togetherActivity.id = val2[0].id;
      this.activity.togetherActivity.title = val2[0].title;
      this.dialogVisible = false;
    },
    getMatchActivityList() {
      this.dialogVisible = true;
      let params = {
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      Service.getMatchActivityList(
        params,
        data => {
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    rowClick(val) {
      this.togetherActivity.id = val.id;
      this.togetherActivity.title = val.title;
    },
    handleSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getMatchActivityList();
    },
    handleCurrentChange(val) {
      this.dialogPagination.currentPage = val;
      this.getMatchActivityList();
    },
    operate(name) {
      this[name]();
    },
    typeChange() {
      this.activity.shape = '0';
      this.setValiedPreview(this.activity);
      this.operations[1].class = 'show';
      if (this.activity.typeStr === '11' || this.activity.typeStr === '12') {
        this.operations[1].class = 'hidden';
      }
      this.activity.cover = '';
      switch (this.activity.typeStr) {
        case '0':
          this.activity.content = `<img src="${this.defaultImages.qhb}"><br><p>天上掉红包，不抢白不抢！呼朋唤友加入抢红包队伍!</p>`;
          break;
        case '1':
          this.activity.content = `<img src="${this.defaultImages.yyy}"><br><p>摇一摇，赢大奖，high翻全场，根本停不下来！</p>`;
          break;
        case '2':
          this.activity.content = `<img src="${this.defaultImages.cj}"><br><p>豪礼免费领啦，惊不惊喜，意不意外，想不想要！想要还不来参加幸运大抽奖！</p>`;
          break;
        case '3':
          this.activity.content = `<img src="${this.defaultImages.ptg}"><br><p>每一天都在帮你省钱，这不，我们又来了啦~ 这次的团购商品又是什么呢，还不快来看看！</p>`;
          break;
        case '4':
          this.activity.content = `<img src="${this.defaultImages.nyqg}"><br><p>你心心念念的商品已经开始抢购啦，快来领走呗！只要1元钱，它就可能是你的喽~</p>`;
          break;
        case '5':
          this.activity.content = `<img src="${this.defaultImages.xsms}"><br><p>本店为答谢广大客户长期的支持与厚爱，特组织了本次秒杀活动。秒杀商品数量有限，手快一点哦，不然喜欢的商品会被别人抢走喽......</p>`;
          break;
        case '6':
          this.activity.content = `<img src="${this.defaultImages.bkj}"><br><p>多少钱？您标价！凑够人数就能享受相应折扣，便宜到爆！大伙都在叫你呢，还不快来参加！</p>`;
          break;
        case '7':
          this.activity.content = `<img src="${this.defaultImages.tjyl}"><br><p>分享V服爱车APP，推荐有礼拿奖品。快动动手指邀请好友加入我们！</p>`;
          break;
        case '8':
          this.activity.content = `<img src="${this.defaultImages.fxyl}"><br><p>诺诺诺，看这里，一大波奖品等着你领取，想要的话就去发起分享呗~</p>`;
          break;
        case '9':
          this.activity.content = `<img src="${this.defaultImages.zm}"><br><p>全城的热门轰趴就在这里了我们什么都不缺，就缺你，还不快点加入一起GO GO GO~</p>`;
          break;
        case '11':
          this.activity.content = '';
          this.activity.cover = this.defaultImages.qkhd;
          break;
        case '12':
          this.activity.content = '';
          this.activity.cover = this.defaultImages.qkhd;
          break;
        default:
          break;
      }
    },
    clear() {
      this.$refs.form.clearValidate();
      this.isCreated = true;
      this.activity = {
        memberRanks: [],
        id: '',
        title: '',
        typeStr: '0',
        images: [],
        beginDate: '',
        endDate: '',
        latBaidu: '',
        lngBaidu: '',
        fee: '',
        attendBeginDate: '',
        attendEndDate: '',
        options: [],
        cover: '',
        // 是否扫描本店铺二维码
        isScan: '0',
        // 是否搭配活动
        isTogetherActivity: '0',
        // 是否计入潜客
        isCreatPConsumer: '0',
        stateStr: '3',
        // 形状
        shape: '0',
        togetherActivity: {
          id: '',
          title: ''
        },
        shopId: '',
        shop: {
          id: this.defaultShop.id,
          name: this.defaultShop.name,
          address: this.defaultShop.address
        }
      };
      this.activity.content = `<img src="${this.defaultImages.qhb}"><br><p>天上掉红包，不抢白不抢！呼朋唤友加入抢红包队伍!</p>`;
      this.operations[0].disabled = false;
      this.operations[1].disabled = false;
    },
    selectModel(activityModel) {
      this.clear();
      this.activity.typeStr = activityModel.marketingType;
      this.typeChange();
      console.log(this.$refs.form.$el.scrollTop);
      this.$nextTick(() => {
        this.$refs.form.$el.scrollTop = 0;
      });
    },
    save() {
      if (this.activity.typeStr === '9' && this.activity.endDate > this.activity.attendBeginDate) {
        this.$message.warning('活动开始时间不能早于报名结束时间');
        return;
      }
      if ((this.activity.typeStr === '11' || this.activity.typeStr === '12') && !this.activity.cover) {
        this.$message.warning('请选择封面图片');
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activity.images = this.getImgs(this.activity.content);
          if (this.isCreated) {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    create() {
      let params = {
        title: this.activity.title,
        typeStr: this.activity.typeStr,
        content: this.activity.content,
        images: this.activity.images,
        beginDate: this.activity.beginDate,
        endDate: this.activity.endDate,
        latBaidu: this.activity.latBaidu,
        lngBaidu: this.activity.lngBaidu,
        address: this.activity.address,
        fee: this.isFee === '1' ? this.activity.fee : '',
        attendBeginDate: this.activity.attendBeginDate,
        attendEndDate: this.activity.attendEndDate,
        options: this.activity.options,
        cover: this.activity.cover,
        isScan: this.activity.isScan,
        // isTogetherActivity: this.activity.isTogetherActivity,
        isCreatPConsumer: this.activity.isCreatPConsumer,
        stateStr: this.activity.stateStr,
        // 形状
        shape: this.activity.shape,
        // memberRanks: this.activity.memberRanks,
        togetherActivity: this.activity.togetherActivity
      };
      this.loading = true;
      Service.createActivity(
        params,
        data => {
          this.$message.success('添加成功');
          // this.$notify({
          //   title: '成功',
          //   message: '添加成功',
          //   type: 'success'
          // });
          this.loading = false;
          console.log(this.activity.shopId);
          this.$emit('created', {
            id: data.id,
            shopId: this.activity.shopId,
            typeStr: this.activity.typeStr,
            stateStr: this.activity.stateStr
          });
          this.refresh(data.id);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          // this.$notify({
          //   title: '警告',
          //   message: ErrorData.errorMessage,
          //   type: 'warning'
          // });
        }
      );
    },
    update() {
      let params = {
        id: this.activity.id,
        title: this.activity.title,
        typeStr: this.activity.typeStr,
        content: this.activity.content,
        images: this.activity.images,
        beginDate: (this.activity.typeStr !== '11' || this.activity.typeStr !== '12') ? this.activity.beginDate : '',
        endDate: (this.activity.typeStr !== '11' || this.activity.typeStr !== '12') ? this.activity.endDate : '',
        latBaidu: this.activity.latBaidu,
        lngBaidu: this.activity.lngBaidu,
        address: this.activity.address,
        fee: this.isFee === '1' ? this.activity.fee : '',
        attendBeginDate: this.activity.attendBeginDate,
        attendEndDate: this.activity.attendEndDate,
        options: this.activity.options,
        cover: this.activity.cover,
        isScan: this.activity.isScan,
        // isTogetherActivity: this.activity.isTogetherActivity,
        isCreatPConsumer: this.activity.isCreatPConsumer,
        stateStr: this.activity.stateStr,
        // 形状
        shape: this.activity.shape,
        memberRanks: this.activity.memberRanks,
        togetherActivity: this.activity.togetherActivity
      };
      this.loading = true;
      Service.updateActivity(
        params,
        data => {
          this.$message.success('更新成功');
          // this.$notify({
          //   title: '成功',
          //   message: '更新成功',
          //   type: 'success',
          //   duration: 1500
          // });
          this.loading = false;
          this.$emit('base-info-updated');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          // this.$notify({
          //   title: '警告',
          //   message: ErrorData.errorMessage,
          //   type: 'warning',
          //   duration: 1500
          // });
        }
      );
    },
    preview() {
      this.previewDialogOpen = true;
    },
    refresh(id) {
      this.isCreated = false;
      this.loading = true;
      let params = {
        id: id
      };
      this.$refs.form.clearValidate();
      Service.getActivity(
        params,
        data => {
          if (!data.activity.togetherActivity) {
            data.activity.togetherActivity = {
              id: '',
              title: ''
            };
          }
          this.activity = Object.assign(this.activity, data.activity);
          if (data.activity.fee) {
            this.isFee = '1';
          } else {
            this.isFee = '0';
          }
          this.setValiedPreview(this.activity);
          this.operations[0].disabled = false;
          this.loading = false;
          this.operations[1].class = 'show';
          if (this.activity.typeStr === '11' || this.activity.typeStr === '12') {
            this.operations[1].class = 'hidden';
          }
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    setValiedPreview(row) {
      this.operations[1].disabled = !this.isValiedPreview(row);
    },
    isValiedPreview(row) {
      switch (row.typeStr) {
        case '0':
          return true;
        case '1':
          return true;
        case '2':
          if (row.prizes && row.prizes.length >= 3) {
            return true;
          }
          return false;
        case '3':
          if (row.product) {
            return true;
          }
          return false;
        case '4':
          if (row.product) {
            return true;
          }
          return false;
        case '5':
          if (row.product) {
            return true;
          }
          return false;
        case '6':
          if (row.product) {
            return true;
          }
          return false;
        case '7':
          return true;
        case '8':
          return false;
        case '9':
          return true;
        case '11':
          return false;
        case '12':
          return false;
        default:
          break;
      }
    },
    copy(id) {
      this.isCreated = true;
      let params = {
        id: id
      };
      Service.getActivity(
        params,
        data => {
          if (!data.activity.togetherActivity) {
            data.activity.togetherActivity = {
              id: '',
              title: ''
            };
          }
          this.activity = data.activity;
          this.activity.id = '0';
          this.activity.title = this.activity.title + ' ' + '-' + ' ' + '复制';
          this.activity.beginDate = '';
          this.activity.endDate = '';
          if (this.activity.typeStr === '11' || this.activity.typeStr === '12') {
            this.activity.attendBeginDate = '';
            this.activity.attendEndDate = '';
          }
          this.activity.stateStr = '3';
          this.setValiedPreview(this.activity);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    onUpload(url) {
      this.activity.cover = url;
    },
    getType(row) {
      switch (row.typeStr) {
        case '0':
          return '抢红包';
        case '1':
          return '摇一摇';
        case '2':
          return '抽奖';
        case '3':
          return '拼团购';
        case '4':
          return 'N元抢购';
        case '5':
          return '限时秒杀';
        case '6':
          return '帮砍价';
        case '7':
          return '推荐有礼';
        case '8':
          return '分享有礼';
        case '9':
          return '活动招募';
        case '11':
          return '潜客活动';
        case '12':
          return '推广活动';
        default:
          break;
      }
    },
    getState(row) {
      switch (row.stateStr) {
        case '0':
          return '未开始';
        case '1':
          return '进行中';
        case '2':
          return '已结束';
        case '3':
          return '已创建';
        case '4':
          return '已提交';
        case '5':
          return '已取消';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss">
.selectClass {
  z-index: 1999 !important;
}
.activity-base-info {
  .biz-save-button {
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: flex-start;
  }
  textarea[name='editorValue'] {
    display: none;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .el-input__inner {
      width: 200px;
    }
    .isScan {
      line-height: 64px;
      height: 64px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .vip-level {
      .vip-container {
        display: flex;
        flex-wrap: wrap;
        .vip {
          min-width: 110px;
        }
      }
    }
    .e-wrapper {
      margin-left: 10px;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}

.marketing-preview {
  .el-dialog__body {
    padding: 10px 0;
    border-radius: 10px;
  }
  .cpreview {
    padding: 10px;
    margin: 0 auto;
  }
  .bg {
    margin: 0 auto;
    position: relative;
    width: 390px;
    height: 653px;
    .cpreview {
      overflow: auto;
      position: absolute;
      padding: 10px;
      width: 354px;
      height: 500px;
      top: 76px;
      left: 18px;
      outline: none;
      background-color: #fff;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #c2c2c2;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
    }
  }
}

.activity-base-info-choose-activity {
  > .el-dialog {
    width: 840px;
  }
  .el-dialog__body {
    padding-top: 10px;
    .el-button {
      margin-bottom: 5px;
    }
  }
}
</style>
