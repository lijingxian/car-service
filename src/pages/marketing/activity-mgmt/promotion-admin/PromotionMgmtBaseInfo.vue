<template>
  <biz-grid class="activity-promotion-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit"
      :inline-message="true">
      <el-form-item label="所属店铺" prop="shopName" v-if="promotionId">
        <el-input v-model="baseInfo.shop.name" disabled></el-input>
      </el-form-item>
      <el-form-item prop="stateStr" label="活动状态" v-if="promotionId">
        <el-select v-model="form.stateStr" :disabled="!promotionId" placeholder="请选择活动状态">
          <el-option v-for="stateStr in activitiStatus" :disabled="stateStr.disabled || false" :key="stateStr.index"
            :value="stateStr.value" :label="stateStr.label"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="促销类型" prop="typeStr">
        <el-select v-model="form.typeStr" :disabled="!!promotionId" placeholder="请选择促销类型">
          <el-option v-for="type in typeStrs" :key="type.value" :value="type.value" :label="type.label"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item v-show="promotionId" label="创建时间" prop="createDate">
        <el-input disabled v-model="form.createDate"></el-input>
      </el-form-item>
      <el-form-item label="活动名称" prop="title">
        <el-input placeholder="请输入活动名称" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="活动封面" prop="cover">
        <biz-avatar-uploader-new v-model="form.cover">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginDate">
        <el-date-picker v-model="form.beginDate" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker v-model="form.endDate" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动链接" v-if="promotionId">
        <el-input type="textarea" disabled placeholder="活动保存后自动生成" :value="promotionUrl"></el-input>
      </el-form-item>
      <el-form-item label="参与会员">
        <rank-item ref="rank" :rankData="rankData"></rank-item>
      </el-form-item>
      <el-form-item label="活动包含">
        <el-button size="mini" @click="addContent">添加</el-button>
        <el-table size="small" :data="tableData">
          <el-table-column prop="type" label="类型" :formatter="getType">
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button type="text" size="mini" @click="eidtHandler(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="deleteHandler(scope.row)">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="活动介绍">
      </el-form-item>
      <div style="margin-left:40px">
        <biz-editor ref="editor" height="400px" width="410px" v-model="form.content" @video-oversize="checkVideo"
          @video-wrong-format="checkVideo"></biz-editor>
      </div>
    </el-form>
    <el-dialog :append-to-body="true" class="marketing-preview" title="预览" :visible="previewDialogOpen"
      @close="previewDialogOpen=false" width="450px">
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
        <!-- <coupon-preview v-if="form.typeStr === '1'" :preview="previewContent" :width="width" :height="height">
        </coupon-preview>
        <discount-preview v-if="form.typeStr === '4'" :preview="previewContent" :width="width" :height="height">
        </discount-preview>
        <free-shipping-preview v-if="form.typeStr === '0'" :preview="previewContent" :width="width" :height="height">
        </free-shipping-preview>
        <full-cut-preview v-if="form.typeStr === '3'" :preview="previewContent" :width="width" :height="height">
        </full-cut-preview>
        <product-preview v-if="form.typeStr === '2'" :preview="previewContent" :width="width" :height="height">
        </product-preview>
        <full-gift-preview v-if="form.typeStr === '5'" :preview="previewContent" :width="width" :height="height">
        </full-gift-preview>
        <package-preview v-if="form.typeStr === '6'" :preview="previewContent" :width="width" :height="height">
        </package-preview> -->
        <iframe :src="promotionUrl" id="iframe" frameborder="0" scrolling="no" :width="width" :height="height"></iframe>
      </div>
      <!-- </div> -->
    </el-dialog>
    <el-dialog append-to-body title="内容信息" :visible="contentDialogOpen" @close="contentDialogOpen=false"
      custom-class="promotionDialog">
      <biz-grid>
        <div slot="top" style="margin-top:50px">
          <el-form :model="form" label-width="120px" size="small">
            <el-form-item label="促销手段">
              <el-select v-model="form.type" @change="typeChange">
                <el-option label="包邮" value="FreeShipping"></el-option>
                <el-option label="折扣" value="Discount"></el-option>
                <el-option label="满减" value="FullCut"></el-option>
                <el-option label="满送" value="FullGift"></el-option>
                <el-option label="套餐" value="Package"></el-option>
                <el-option label="促销" value="product"></el-option>
                <el-option label="优惠券" value="Coupon"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="促销名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <promotion-content-free-shipping ref="FreeShipping" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'FreeShipping'">
          </promotion-content-free-shipping>
          <promotion-content-discount ref="Discount" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'Discount'">
          </promotion-content-discount>
          <promotion-content-full-cut ref="FullCut" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'FullCut'"></promotion-content-full-cut>
          <promotion-content-full-gift ref="FullGift" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'FullGift'">
          </promotion-content-full-gift>
          <promotion-content-package ref="Package" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'Package'"></promotion-content-package>
          <promotion-content-coupon ref="Coupon" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'Coupon'"></promotion-content-coupon>
          <promotion-content-promotion ref="product" :isEdit="isEdit" @updated="setForm" :memberRankList="memberRankList"
            v-show="form.type === 'product'">
          </promotion-content-promotion>
        </div>
      </biz-grid>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor } from '@/components/BizEditorH';
import { BizAvatarUploaderNew } from '@/components/BizForm';
// 预览
// import CouponPreview from './preview/CouponPreview';
// import DiscountPreview from './preview/DiscountPreview';
// import FreeShippingPreview from './preview/FreeShippingPreview';
// import ProductPreview from './preview/ProductPreview';
// import FullCutPreview from './preview/FullCutPreview';
// import FullGiftPreview from './preview/FullGiftPreview';
// import PackagePreview from './preview/PackagePreview';
import PromotionContentFreeShipping from './promotion-content/FreeShipping';
import PromotionContentDiscount from './promotion-content/Discount';
import PromotionContentFullCut from './promotion-content/FullCut';
import PromotionContentFullGift from './promotion-content/FullGift';
import PromotionContentPackage from './promotion-content/Package';
import PromotionContentCoupon from './promotion-content/Coupon';
import PromotionContentPromotion from './promotion-content/Promotion';
import phoneB from '@/assets/images/iphone-b.png';
import date from '@/utils/date.js';
import service from '@/service/activity-mgmt/promotion-mgmt/ActivityPromotionMgmtBaseInfo.js';
import RankItem from '@/pages/marketing/activity-mgmt/promotion-admin/components/RankItem';
import http from '@/common/http';
export default {
  name: 'PromotionMgmtBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    memberRankList: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    // 预览内容
    previewItem: {
      type: Object
    }
  },
  data() {
    return {
      promotionId: '',
      showListFlag: false,
      contentDialogOpen: false,
      isCreated: true,
      tableData: [],
      // 预览背景
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      previewDialogOpen: false,
      // 预览内容
      previewContent: {},
      // promotionId: true,
      // 参与商品方式Flag,为false则不重置,防止组件创建时刷新
      participationWayFlag: false,
      // 允许参与商品错误信息
      errAdmit: '',
      rules: {
        title: [
          {
            required: true,
            message: '请输入活动标题',
            trigger: ['blur', 'change']
          }
        ],
        typeStr: [
          {
            required: true,
            message: '请选择促销类型',
            trigger: ['blur', 'change']
          }
        ],
        shop: [{ required: true, message: '请选择店铺', trigger: ['blur', 'change'] }],
        beginDate: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: ['blur', 'change']
          }
        ],
        endDate: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: ['blur', 'change']
          }
        ]
      },
      typeStrs: [
        {
          label: '包邮',
          value: '0'
        },
        {
          label: '优惠券',
          value: '1'
        },
        {
          label: '促销',
          value: '2'
        },
        {
          label: '满减',
          value: '3'
        },
        {
          label: '折扣',
          value: '4'
        },
        {
          label: '满送',
          value: '5'
        },
        {
          label: '套餐',
          value: '6'
        }
      ],
      activitiStatus: [
        {
          label: '已创建',
          value: '3'
        },
        {
          label: '已发布',
          value: '0'
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
        { label: '已提交', value: '4', disabled: true },
        { label: '已取消', value: '5', disabled: true }
      ],
      form: this.setOriginForm(),
      width: '375',
      height: '567',
      value: '0',
      memberRanks: [],
      products: [],
      shopBrands: [],
      productCategories: [],
      // 从服务器获取的基本数据
      baseInfo: {
        shop: {
          name: ''
        }
      },
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '0',
        memberRanks: [],
        members: []
      },
      index: 0,
      loading: false,
      showProductSelector: false,
      showBrandSelector: false,
      showClassSelector: false,
      brandListHeight: '45',
      productListHeight: '45',
      classListHeight: '45',
      // 获得的品牌列表
      brandList: [],
      // 弹出框选中的品牌项
      brandArr: [],
      // 类别列表
      classList: [],
      // 选中的分类项
      classArr: [],
      // 商品列表
      productTableData: [],
      // 选中的商品id列表
      selectedProducts: [],
      productPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        },
        {
          label: '预览',
          name: 'preview',
          type: '',
          disabled: false
        }
      ],
      // 促销类型模板
      FreeShipping: '/resources/admin/images/default/by.png',
      Discount: '/resources/admin/images/default/xszk.png',
      FullCut: '/resources/admin/images/default/mj.png',
      FullGift: '/resources/admin/images/default/ms.png',
      Package: '/resources/admin/images/default/tc.png',
      coupon: '/resources/admin/images/default/yhq.png',
      product: '/resources/admin/images/default/promotion.png'
    };
  },
  computed: {
    promotionUrl() {
      return window.location.origin + '/resources/admin/ecStatic/index.html/#/recent-promotion/' + this.promotionId;
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
          for (const iterator of this.content.memberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    }
  },
  created() {
    this.getDefaultUrl();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    eidtHandler(row) {
      console.log(row);
      let refId = row.type;
      this.form.type = refId;
      this.form.name = row.name;
      this.index = this.tableData.indexOf(row);
      this.$nextTick(() => {
        this.$refs[refId].refresh(row);
      });
      this.isCreated = false;
      this.contentDialogOpen = true;
    },
    deleteHandler(row) {
      this.tableData.splice(this.tableData.indexOf(row), 1);
    },
    addContent() {
      this.form.type = 'Coupon';
      this.form.name = '优惠券活动';
      this.isCreated = true;
      this.contentDialogOpen = true;
      this.$nextTick(() => {
        this.$refs.Coupon.clear();
      });
    },
    getDefaultUrl() {
      http
        .get('/admin/settings/settings.jhtml', { type: '1' })
        .then(data => {
          if (data.settingList.defaultFreeShippingImage) {
            this.FreeShipping = data.settingList.defaultFreeShippingImage;
          }
          if (data.settingList.defaultDiscountImage) {
            this.Discount = data.settingList.defaultDiscountImage;
          }
          if (data.settingList.defaultFullCutImage) {
            this.FullCut = data.settingList.defaultFullCutImage;
          }
          if (data.settingList.defaultPackageImage) {
            this.Package = data.settingList.defaultPackageImage;
          }
          if (data.settingList.defaultCouponImage) {
            this.coupon = data.settingList.defaultCouponImage;
          }
          if (data.settingList.defaultPromotionImage) {
            this.product = data.settingList.defaultPromotionImage;
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
    setOriginForm() {
      return {
        title: '促销活动' + date.nowDate(),
        cover: this.product,
        typeStr: '',
        shopName: '',
        beginDate: '',
        endDate: '',
        stateStr: '3',
        content: `<img src="${this.product}"><br><p>惊不惊喜，意不意外！这么多商品在促销啊，那还不快下手！</p>`,
        images: [],
        type: 'Coupon',
        name: '优惠券活动',
        publishTarget: '0',
        memberRanks: [],
        members: [],
        couponDatas: []
      };
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
    setForm(form) {
      console.log(form);
      let params = Object.assign(form, { name: this.form.name, type: this.form.type });
      if (this.isCreated) {
        this.form.couponDatas.push(params);
      } else {
        this.form.couponDatas[this.index] = params;
      }
      this.tableData = this.form.couponDatas;
      console.log(this.tableData);
      this.contentDialogOpen = false;
    },
    getType(row) {
      switch (row.type) {
        case 'FreeShipping':
          return '包邮';
        case 'Coupon':
          return '优惠券';
        case 'product':
          return '促销';
        case 'FullCut':
          return '满减';
        case 'Discount':
          return '折扣';
        case 'FullGift':
          return '满送';
        case 'Package':
          return '套餐';
        default:
          return '';
      }
    },
    typeChange(val) {
      switch (val) {
        case 'FreeShipping':
          this.form.name = '包邮活动';
          return;
        case 'Coupon':
          this.form.name = '优惠券活动';
          return;
        case 'product':
          this.form.name = '促销活动';
          return;
        case 'FullCut':
          this.form.name = '满减活动';
          return;
        case 'Discount':
          this.form.name = '折扣活动';
          return;
        case 'FullGift':
          this.form.name = '满送活动';
          return;
        case 'Package':
          this.form.name = '套餐活动';
          return;
        default:
          return '';
      }
    },
    // 预览
    preview() {
      if (this.form.typeStr === 'coupon') {
        this.previewContent = Object.assign({ shopName: this.baseInfo.shop.name }, this.previewItem);
        // this.previewContent = Object.assign({}, this.form);
      } else if (this.form.typeStr === 'Package') {
        this.previewContent = Object.assign({ amount: this.previewItem.amount }, this.form);
      } else {
        // this.previewContent = Object.assign({title: this.form.title}, this.previewItem);
        this.previewContent = Object.assign({}, this.form);
      }
      console.log('content: ', this.previewContent);
      console.log('typeStr: ', this.baseInfo.shop.name);
      this.previewDialogOpen = true;
    },
    // 按钮'保存'
    save() {
      if (this.form.beginDate > this.form.endDate) {
        this.$message.warning('开始时间不能晚于结束时间');
        return;
      }
      this.errAdmit = '';
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      this.form.images = this.getImgs(this.form.content);
      this.form.memberRanks = this.rankData.memberRanks;
      this.form.members = this.rankData.members;
      this.form.publishTarget = this.rankData.publishTarget;
      if (!this.promotionId) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      let params = Object.assign({}, this.form);
      service.createAdmin(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('updated');
          this.$emit('created', data.id);
          this.refresh(data.id);
        },
        ErrorData => {
          console.log('ERR_CREATE: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = Object.assign(this.form, { id: this.promotionId });
      service.updateAdmin(
        params,
        data => {
          this.$message.success('更新成功');
          this.$emit('updated');
          this.refresh(this.form.id);
        },
        ErrorData => {
          console.log('ERR_UPDATE: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    showStateOption(value) {
      if (!this.itemId) {
        if (value === 'continued' || value === 'ended') {
          return false;
        }
      }
      return true;
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
      console.log('reg==> ', tmp);
      return tmp;
    },
    getBaseInfo() {
      service.queryBaseInfoAdmin(
        { shopId: window.top.SHOP_ID || '' },
        data => {
          this.baseInfo = data;
        },
        ErrorData => {
          console.log('ERR_GET_BASE_INFO: ', ErrorData);
          // this.$notify.warning({ message: ErrorData.errorMessage });
        }
      );
    },
    refresh(id) {
      // this.clear();
      this.$refs.form.clearValidate();
      console.log(this.$refs.form.$el.scrollTop);
      this.rankData.memberRankList = this.memberRankList;
      this.$nextTick(() => {
        this.$refs.form.$el.scrollTop = 0;
      });
      this.showListFlag = false;
      this.operations[1].disabled = false;
      this.promotionId = id;
      let params = {
        id: id,
        shopId: window.top.SHOP_ID || ''
      };
      service.queryAdmin(
        params,
        data => {
          // console.log(data);
          // data.data.isSubmit = '0';
          this.showListFlag = true;
          this.form = Object.assign(this.setOriginForm(), data.data);
          if (!this.promotionId) {
            this.$set(this.form, 'stateStr', '3');
          }
          this.operations[0].disabled = false;
          this.form.couponDatas = data.data.couponDatas;
          this.tableData = data.data.couponDatas;
          this.rankData.publishTarget = data.data.publishTarget || '0';
          this.rankData.memberRanks = data.data.memberRanks ? data.data.memberRanks : [];
          this.rankData.members = data.data.members ? data.data.members : [];
          if (this.rankData.publishTarget === '0') {
            this.$refs.rank.getVipCount();
          }
          if (this.rankData.memberRanks.length) {
            this.$refs.rank.memberRankHandle();
          }
        },
        ErrorData => {
          this.showListFlag = true;
          console.log('ERR_QUERY: ', ErrorData);
          this.$message.warning({ message: ErrorData.errorMessage });
        }
      );
    },
    selectModel(activityModel) {
      this.clear();
      this.form.typeStr = activityModel.marketingType;
      this.$nextTick(() => {
        this.$refs.form.$el.scrollTop = 0;
      });
    },
    clear() {
      this.showListFlag = false;
      this.$nextTick(() => {
        this.showListFlag = true;
      });
      this.tableData = [];
      this.promotionId = '';
      this.form = this.setOriginForm();
      this.$refs.form.resetFields();
      this.operations[0].disabled = false;
      this.operations[1].disabled = true;
    },
    copy(id) {
      let params = {
        id: id
      };
      service.queryAdmin(
        params,
        data => {
          console.log(data);
          this.baseInfo.shop.name = data.data.shopData.name;
          this.form.title = data.data.title;
          this.form.typeStr = data.data.typeStr;
          this.form.stateStr = '3';
          this.form.beginDate = '';
          this.form.endDate = '';
          this.$nextTick(() => {
            this.form.content = data.data.content;
          });
          this.operations[0].disabled = false;
          this.operations[1].disabled = false;
        },
        ErrorData => {
          this.$message.warning({ message: ErrorData.errorMessage });
        }
      );
    },
    formatData(val) {
      let tmp = [];
      val.map(value => {
        tmp.push({ id: value.id ? value.id : value });
      });
      return tmp;
    },
    checkVideo(msg) {
      this.$message(msg);
    }
  },
  mounted() {
    this.getBaseInfo();
  },
  // watch: {
  //   'form.typeStr': function(newVal, oldVal) {
  //     if (!this.promotionId) {
  //       this.$refs.form.$el.scrollTop = 0;
  //       this.form.content = `<img src="${this.product}"><br><p>惊不惊喜，意不意外！这么多商品在促销啊，那还不快下手！</p>`;
  //       switch (newVal) {
  //         case '0':
  //           this.form.content = `<img src="${this.FreeShipping}"><br><p>这个日子我们陪你狂欢，指定商品满额包邮，就是这么任性~</p>`;
  //           break;
  //         case '4':
  //           this.form.content = `<img src="${this.Discount}"><br><p>N多商品享受折上折！还不快来抄底购买！</p>`;
  //           break;
  //         case '3':
  //           this.form.content = `<img src="${this.FullCut}"><br><p>优惠不间断~爆款好货，享受满减活动啦，品类多多任你挑~装点新生活，从现在开始。</p>`;
  //           break;
  //         case '5':
  //           this.form.content = `<img src="${this.FullGift}"><br><p>限时满赠：N多热销商品享受低价买赠啦~</p>`;
  //           break;
  //         case '6':
  //           this.form.content = `<img src="${this.Package}"><br><p>再说一遍，搭配套餐购买更划算哦~</p>`;
  //           break;
  //         case '1':
  //           this.form.content = `<img src="${this.coupon}"><br><p>N多商品享受特价福利，领券可更优惠哦，马上领取你的专属优惠券吧！</p>`;
  //           break;
  //         case '2':
  //           this.form.content = `<img src="${this.product}"><br><p>惊不惊喜，意不意外！这么多商品在促销啊，那还不快下手！</p>`;
  //           break;
  //         default:
  //           break;
  //       }
  //       this.$refs.editor.setContent(this.form.content);
  //     }
  //   }
  // },
  components: {
    BizGrid,
    BizSaveButton,
    // CouponPreview,
    // DiscountPreview,
    // FreeShippingPreview,
    // FullCutPreview,
    // FullGiftPreview,
    // PackagePreview,
    // ProductPreview,
    BizEditor,
    RankItem,
    PromotionContentFreeShipping,
    PromotionContentDiscount,
    PromotionContentFullCut,
    PromotionContentFullGift,
    PromotionContentPackage,
    PromotionContentCoupon,
    PromotionContentPromotion,
    BizAvatarUploaderNew
  }
};
</script>

<style lang="scss">
.promotionDialog {
  height: 70vh;
  .el-form {
    .el-input--small {
      width: 80%;
    }
    .el-table {
      width: 80% !important;
    }
  }
  .el-dialog__header {
    .el-dialog__headerbtn {
      z-index: 10;
    }
  }
}
.promotion-dialog-checkbox {
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
.activity-promotion-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .checkbox-group {
    font-size: 14px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
  }
  .el-input__inner {
    width: 200px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .biz-list {
    margin-top: 10px;
  }
  // .el-radio {
  //   width: 60px;
  // }
}
.marketing-preview {
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
</style>
