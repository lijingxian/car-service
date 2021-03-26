<template>
  <biz-grid class="service-recommend__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules">
      <el-form-item label="状态" prop="state" v-if="itemId.id">
        <span class="form-static">{{formatterState()}}{{formModel.thirdState?'('+formModel.thirdState+')':''}}</span>
      </el-form-item>
      <el-form-item label="店铺" prop="shop.name" v-if="getUser().roleLevel !== 'shop'">
        <span class="form-static">{{formModel.shop?formModel.shop.name:''}}</span>
      </el-form-item>
      <el-form-item label="资讯" prop="title">
        <span class="form-static" style="margin-right:10px">{{formModel.title}}</span>
        <el-button
          type="text"
          style="font-size:14px"
          v-clipboard:copy="activityUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          v-if="getUser().roleLevel!=='shop'&&(this.position==='8'||this.position==='9'||this.position==='10')"
        >复制地址</el-button>
        <el-button v-if="!(this.position==='8'||this.position==='9'||this.position==='10')&&!itemId.id" size="mini" @click="addActive">选择</el-button>
      </el-form-item>
      <el-form-item label="资讯类型" prop="type">
        <span class="form-static">{{formatterType()}}</span>
      </el-form-item>
      <el-form-item label="推送样式" prop="showType" v-if="this.position !== '0'">
        <el-radio-group
          class="type-group"
          v-model="formModel.showType"
          :disabled="this.position === '1' || getUser().roleLevel !== 'shop'"
          @change="showTypeChange"
        >
          <el-radio v-for="showType in showTypeList[this.position]" :key="showType.index" :label="showType.type">
            <img :src="showType.img" alt style="height:100px;" />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题" prop="title" v-if="this.position === '8' || this.position === '9' || this.position === '10'">
        <el-input v-model="formModel.title" placeholder="请输入标题" :disabled="getUser().roleLevel !== 'shop'"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imagePaths" class="isRequired" v-if="(this.position === '0' || this.position === '1' || this.position=== '10')?false:true">
        <biz-avatar-uploader-multi
          v-model="formModel.imagePaths"
          :showUploader="formModel.imagePaths&&((formModel.showType==='1'&&formModel.imagePaths.length>=3) || ((formModel.showType==='0'||formModel.showType==='2'||(formModel.showType==='1'&&this.position==='2'))&&formModel.imagePaths.length>=1))?false:true"
          :disabled="getUser().roleLevel !== 'shop'"
          :isShowDelete="getUser().roleLevel !== 'platform'"
          :showMode="showModeValue()"
        ></biz-avatar-uploader-multi>
        <div
          v-if="this.position === '8'&&formModel.showType ==='0'"
          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px"
        >建议最佳：宽高比16:9,1280*720≤尺寸≤2560*1440,支持JPG、PNG等图片格式，图片不超过500K</div>
        <div
          v-if="this.position === '8'&&(formModel.showType ==='1'||formModel.showType ==='2')"
          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px"
        >建议最佳：宽高比1.52,456*300≤尺寸≤1368*900,支持JPG、PNG等图片格式，图片不超过500K</div>
        <div
          v-if="this.position==='9'&&formModel.showType==='0'"
          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
        >建议最佳：尺寸1140*640,支持JPG、PNG等图片格式，图片不超过500K</div>
        <div
          v-if="this.position==='9'&&(formModel.showType==='1'||formModel.showType==='2')"
          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
        >建议最佳：尺寸370*245,支持JPG、PNG等图片格式，图片不超过200K</div>
      </el-form-item>
      <el-form-item
        label="描述"
        prop="content"
        v-if="(formModel.showType === '1' && this.position==='2') || this.position === '3' || this.position === '4' || this.position === '6' || this.position === '10'"
      >
        <el-input v-model="formModel.content" type="textarea" placeholder="请输入描述" :disabled="getUser().roleLevel !== 'shop'"></el-input>
      </el-form-item>
      <el-form-item label="推送开始时间" prop="beginDate" v-if="this.position!=='10'">
        <el-date-picker v-model="formModel.beginDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="getUser().roleLevel !== 'shop'"></el-date-picker>
      </el-form-item>
      <el-form-item label="推送结束时间" prop="endDate" v-if="this.position!=='10'">
        <el-date-picker v-model="formModel.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="getUser().roleLevel !== 'shop'"></el-date-picker>
      </el-form-item>
      <el-form-item label="预算" prop="budget" v-if="this.position === '8'||this.position === '9'||this.position === '10'">
        <el-input v-model="formModel.budget" :disabled="getUser().roleLevel !== 'shop'">
          <template slot="append">元/天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="点击出价" prop="bid" v-if="this.position === '8' || this.position === '9'">
        <el-input v-model="formModel.bid" :disabled="getUser().roleLevel !== 'shop'">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="竞价关键词" prop="bidKeywords" v-if="this.position === '10'">
        <el-button type="primary" size="small" @click="addKeyWord" :disabled="getUser().roleLevel !== 'shop'">选择关键词模板</el-button>
        <el-table :data="formModel.bidKeywords" style="width: 100%;margin-top:10px" size="small">
          <el-table-column label="关键词" prop="name"></el-table-column>
          <el-table-column label="出价" prop="price">
            <div slot-scope="scope">
              <div class="biz-customcol" style="width: 80px;">
                <el-input size="mini" v-model="scope.row.price" :disabled="getUser().roleLevel !== 'shop'"></el-input>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="命中率" prop="hitRate">
            <template slot-scope="scope">{{scope.row.hitRate?scope.row.hitRate:'60'}}%</template>
          </el-table-column>
          <el-table-column prop="title" label="操作" min-width="90px">
            <template slot-scope="scope">
              <div class="biz-customcol">
                <el-button type="text" size="mini" :disabled="getUser().roleLevel !== 'shop'" @click="rowDeleteClickHandler(scope)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-tag" style="display:flex;margin-top:10px" v-if="getUser().roleLevel !== 'platform'">
          <el-input v-model="newTagName" :maxlength="18" placeholder="请输入自定义关键词"></el-input>
          <el-button @click="addNewTag" type="primary">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="创建时间" prop="name" v-if="(this.position !== '8' || this.position !== '9' || this.position !== '10')&&itemId.id">
        <span class="form-static">{{formModel.createDate}}</span>
      </el-form-item>
      <el-form-item label="审核时间" prop="name" v-if="(this.position === '8' || this.position === '9' || this.position === '10')&&formModel.state!=='0'">
        <span class="form-static">{{formModel.approvedDate}}</span>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="dec" style="margin-bottom:20px;">
          <span>说明：审核通过后系统将自动为您进行投放，投放不成功的情况下可再次手动投放。</span>
        </div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">不通过</el-radio>
          <div style="padding:5px 0px;margin-top:15px;" v-show="auditState==='2'">
            <span style="margin-left:25px">原因：</span>
            <el-select v-model="curSelectAjectReason" placeholder="请选择不通过原因" class="order-select" size="mini">
              <el-option v-for="reason in reasonAjectList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
            </el-select>
          </div>
          <div style="padding:5px 0px;margin-top:15px;">
            <span style="vertical-align:top;margin-left:25px">备注：</span>
            <el-input v-model="remark" type="textarea" style="width:80%"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showPassOrder=false" size="mini">取消</el-button>
        <el-button @click="auditConfirm(row,auditState)" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="授权提示" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成授权
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <div>
          <span v-popover:codePop class="helpClass">查看帮助</span>
        </div>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">授权遇到问题</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">授权完成</el-button>
      </span>
    </el-dialog>
    <biz-dialog-selector
      title="关键词包选择"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="product-info-dailog"
      @confirmed="confirmedSelect"
      @filterDataChange="dialogFilterDataChange"
    >
      <el-table-column label="关键词包" prop="name"></el-table-column>
      <el-table-column label="关键词举例">
        <template slot-scope="scope">
          <template v-for="(keyword,index) in scope.row.keywords">
            {{keyword.name}}
            <template v-if="index < scope.row.keywords.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="关键词个数">
        <template slot-scope="scope" v-if="scope.row.keywords">
          <div style="display: flex;align-items: center;">
            <div style="margin-right:15px;">{{getKeyWordNumber(scope.row.keywords)}}</div>
            <el-button type="text" size="mini" @click.stop="detail(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <el-dialog :visible.sync="showDetail" center append-to-body custom-class="detail-dialog">
      <el-button size="mini" type style="margin-bottom:10px;" @click.stop="backClick">返回</el-button>
      <el-table :data="detailData" size="small" ref="table" stripe tooltip-effect="dark" style="width: 100%" border highlight-current-row>
        <el-table-column label="关键词" prop="name"></el-table-column>
        <el-table-column label="推荐出价" prop="price">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <publish-preview :itemId="itemId" :previewDialog.sync="showPreview" :form="articleVfu" :formlist="articleVfu" :type="previewType" :open="showPreview"></publish-preview>
    <publish-preview-third :itemId="itemId" :previewDialog.sync="showPreviewThird" :formlist="article3" :type="previewType" :open="showPreviewThird"></publish-preview-third>
    <biz-dialog-selector title="资讯" :visibility.sync="showActiveDialog" :appendToBody="true" :tableData="dialogActiveTableData"
      :pagination="dialogActivePagination" :selectionMode="'single'" :isClear="false" :filters="dialogActiveFilters"
      @confirmed="handleActiveConfirmed"
      @filterDataChange="dialogActiveFilterDataChange" @pageSizeChange="dialogActivePageSizeChange"
      @currentPageChange="dialogActiveCurrentPageChange" class="activeDialog">
      <el-table-column label="名称" prop="">
        <div slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </div>
      </el-table-column>
      <el-table-column label="类型" prop=""
        v-if="dialogActiveFilters[0].value==='product'||dialogActiveFilters[0].value==='promotion'||dialogActiveFilters[0].value==='marketing'">
        <div slot-scope="scope">
          <span
            v-if="dialogActiveFilters[0].value==='promotion'||dialogActiveFilters[0].value==='marketing'">{{getType(scope.row)}}</span>
        </div>
      </el-table-column>
      <el-table-column label="店铺" prop="">
        <div slot-scope="scope">
          <span
            v-if="dialogActiveFilters[0].value==='product'||dialogActiveFilters[0].value==='shopPublicity'">{{scope.row.shop.name}}</span>
          <span v-if="dialogActiveFilters[0].value==='promotion'">{{scope.row.shopData.name}}</span>
          <span v-if="dialogActiveFilters[0].value==='marketing'">{{scope.row.shopname}}</span>
          <span v-if="dialogActiveFilters[0].value==='article'">{{scope.row.author}}</span>
        </div>
      </el-table-column>
      <el-table-column label="状态"
        :formatter="dialogActiveFilters[0].value==='marketing'||dialogActiveFilters[0].value==='promotion'?getStateStr:getState"
        :prop="dialogActiveFilters[0].value==='marketing'||dialogActiveFilters[0].value==='promotion'?'stateStr':'state'">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import { BizAvatarUploaderMulti } from '@/components/BizForm';
import { pushMgmt as service } from '@/common/urls';
import startA from '@/assets/images/push-preview/app-a.png';
import startB from '@/assets/images/push-preview/app-b.png';
import listA from '@/assets/images/push-preview/list-a.png';
import listB from '@/assets/images/push-preview/list-b.png';
import listC from '@/assets/images/push-preview/list-c.png';
import popB from '@/assets/images/push-preview/pop-b.png';
import slideA from '@/assets/images/push-preview/slide-a.png';
import listD from '@/assets/images/push-preview/word-list.png';
import listE from '@/assets/images/push-preview/big-pic.png';
import listF from '@/assets/images/push-preview/little-pic.png';
// import listG from '@/assets/images/push-preview/pic-word.png';
import listH from '@/assets/images/push-preview/group-pic.png';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import PublishPreview from '@/components/BizPublishSetting/PublishPreview';
import PublishPreviewThird from '@/components/BizPublishSetting/PublishPreviewThird';

// 初始化时需要的一些数据
const initData = {
  data: {
    separator: ',',
    showDialog: false,
    article3: {},
    articleVfu: {},
    article1: {},
    previewType: '',
    showPreview: false,
    showPassOrder: false,
    dialogVisible: false,
    showDetail: false,
    detailData: [],
    auditState: '1',
    remark: '',
    row: {},
    curSelectAjectReason: '涉嫌不实信息',
    reasonAjectList: [
      {
        label: '涉嫌不实信息',
        value: '涉嫌不实信息'
      },
      {
        label: '涉嫌侵权',
        value: '涉嫌侵权'
      },
      {
        label: '推广页有误',
        value: '推广页有误'
      },
      {
        label: '文案与实际不符',
        value: '文案与实际不符'
      },
      {
        label: '内容不符合规范',
        value: '内容不符合规范'
      },
      {
        label: '内容存在非法',
        value: '内容存在非法'
      },
      {
        label: '涉嫌诱导分享',
        value: '涉嫌诱导分享'
      },
      {
        label: '其他原因',
        value: '其他原因'
      }
    ],
    dialogActiveFilters: [
      {
        type: 'radio',
        label: '',
        name: 'type',
        value: 'promotion',
        options: [
          {
            label: '促销活动',
            value: 'promotion'
          },
          {
            label: '营销活动',
            value: 'marketing'
          },
          {
            label: '软文宣传',
            value: 'article'
          },
          {
            label: '商品推广',
            value: 'shopPublicity'
          }
        ]
      },
      {
        type: 'input',
        label: '商品',
        placeholder: '请输入商品名称',
        select: [],
        name: 'searchValue',
        value: '',
        class: 'show'
      },
      {
        type: 'inputValue',
        label: '外部地址',
        placeholder: '请输入外部地址',
        name: 'inputValue',
        value: '',
        class: 'hidden'
      }
    ],
    closeDeccription: '',
    activityId: '',
    curSelectCloseReason: '',
    showPreviewThird: false,
    showActiveDialog: false,
    dialogActiveTableData: [],
    giftList: [],
    urlArray: ['robRedPacket', 'shake', 'turntable', 'ptg', 'nyqg', 'xsms', 'bkj', 'recommend', '', 'recruit'],
    newTagName: '',
    dialogPagination: {
      pageSize: 20,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      total: 0
    },
    dialogActivePagination: {
      pageSize: 20,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      // 总条目数
      total: 0
    },
    dialogFilters: [
      {
        type: 'input',
        label: '',
        placeholder: '请输入关键词包名称',
        name: 'searchValue',
        value: ''
      }
    ],
    operations: [
      {
        label: '预览',
        name: 'preview',
        type: 'primary',
        class: 'show'
      },
      {
        label: '保存',
        name: 'savehandle',
        type: 'primary',
        class: 'show',
        disabled: false
      },
      {
        label: '投放',
        name: 'push',
        type: 'primary',
        class: 'hidden'
      },
      {
        label: '审核',
        name: 'audit',
        type: 'primary',
        class: 'hidden'
      }
    ],
    // 展示形式列表
    showTypeList: {
      // '0': [{ type: '0', img: listA }, { type: '1', img: listB }, { type: '2', img: listC }],
      '1': [{ type: '0', img: listA }, { type: '1', img: listB }, { type: '2', img: listC }],
      '2': [{ type: '0', img: startA }, { type: '1', img: startB }],
      '3': [{ type: '0', img: popB }],
      '4': [{ type: '0', img: popB }],
      '5': [{ type: '0', img: slideA }],
      '6': [{ type: '0', img: popB }],
      '7': [{ type: '0', img: listA }, { type: '1', img: listB }, { type: '2', img: listC }],
      '8': [{ type: '0', img: listE }, { type: '1', img: listH }, { type: '2', img: listF }],
      '9': [{ type: '0', img: listE }, { type: '1', img: listH }, { type: '2', img: listF }],
      '10': [{ type: '0', img: listD }]
      // '10': [{ type: '0', img: listG }, { type: '1', img: listD }]
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.dialogPagination.currentPage = 1;
      this.getKeyWordList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getKeyWordList();
    },
    dialogFilterDataChange() {
      this.getKeyWordList();
    }
  },
  methods: {}
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    name: '',
    shop: {},
    title: '',
    type: '',
    isTop: '',
    content: '',
    isOn: '',
    bid: '',
    imagePaths: [],
    bidKeywords: [],
    createDate: '',
    publishDate: '',
    approvedDate: '',
    beginDate: '',
    endDate: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    nameList: [{}]
  },
  events: {},
  methods: {
    showModeValue() {
      if (this.position === '8' && this.formModel.showType === '0') {
        return '2';
      } else if (this.position === '8' && (this.formModel.showType === '1' || this.formModel.showType === '2')) {
        return '3';
      } else if (this.position === '9' && this.formModel.showType === '0') {
        return '4';
      } else if (this.position === '9' && (this.formModel.showType === '1' || this.formModel.showType === '2')) {
        return '5';
      }
    },
    onCopy(e) {
      this.$message.success('复制成功！');
    },
    onError(e) {
      this.$message.warning('复制失败！');
    },
    initModel(model) {
      if (model) {
        if (model.content) {
          model.content = this.formatContent(model.content);
        }
        this.formModel = Object.assign(this.getDefaultModel(), model);
        this.nameList = [model.shop || {}];
        // 设置相关列表
        if (this.getUser().roleLevel !== 'platform') {
          this.operations[2].class = 'hidden';
          this.operations[3].class = 'hidden';
          this.operations[1].disabled = false;
        } else {
          this.operations[1].disabled = true;
          if (model.state === '0') {
            this.operations[3].class = 'show';
            this.operations[2].class = 'hidden';
          } else if (model.state === '1') {
            this.operations[3].class = 'hidden';
            this.operations[2].class = 'show';
          } else {
            this.operations[2].class = 'hidden';
            this.operations[3].class = 'hidden';
          }
        }
      } else {
        this.resetModel();
      }
    },
    getKeyWordNumber(keywords) {
      return keywords.length;
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {};
    },

    query() {
      this.loading = true;
      http
        .get(service.queryBaseInfo, { id: this.itemId.id })
        .then(data => {
          this.loading = false;
          this.initModel(data.recommend);
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    audit() {
      this.remark = '';
      this.auditState = '1';
      this.curSelectAjectReason = this.reasonAjectList[0].value;
      this.row = this.formModel;
      this.showPassOrder = true;
    },
    auditConfirm(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          ids: [model.id],
          state: state,
          reason: state === '2' ? this.curSelectAjectReason : '',
          remark: this.remark
        };
        http
          .post('/admin/recommend/updateApprovalState.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            this.loading = false;
            this.showPassOrder = false;
            if (errData.resultCode === '1201') {
              this.loading = true;
              this.dialogVisible = true;
              http
                .post('/admin/recommend/oauth.jhtml', {})
                .then(data => {
                  this.loading = false;
                  window.open(data.oauthURL);
                })
                .catch(() => {
                  this.loading = false;
                });
            }
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    push() {
      this.loading = true;
      http
        .post('/admin/recommend/updateApprovalState.jhtml', {
          ids: [this.formModel.id],
          state: '3'
        })
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1201') {
            this.dialogVisible = true;
            this.loading = true;
            http
              .post('/admin/recommend/oauth.jhtml', {})
              .then(data => {
                this.loading = false;
                window.open(data.oauthURL);
              })
              .catch(() => {
                this.loading = false;
              });
          }
          if (ErrorData.errorMessage) {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        });
    },
    showTypeChange(val) {
      if (this.position === '8') {
        if (val === '0' || val === '2') {
          if (this.formModel.imagePaths.length > 1) {
            this.formModel.imagePaths = this.formModel.imagePaths.slice(0, 1);
          }
        }
      }
    },
    // 预览
    preview() {
      console.log(this.formModel);
      let type = this.formModel.showType;
      switch (this.position) {
        case '0':
          this.previewType = 'list1-' + type;
          break;
        case '1':
          this.previewType = 'article-' + type;
          break;
        case '7':
          this.previewType = 'list-' + type;
          break;
        case '2':
          this.previewType = 'app-' + type;
          break;
        case '3':
        case '4':
          this.previewType = 'pop-' + type;
          break;
        case '6':
          this.previewType = 'pop-coupon-' + type;
          break;
        case '5':
          this.previewType = 'slide-' + type;
          break;
        case '8':
        case '9':
          this.previewType = 'list3-' + type;
          break;
        case '10':
          this.previewType = 'search-' + type;
          break;
        default:
          break;
      }
      console.log(this.previewType);
      if (this.position === '8' || this.position === '9' || this.position === '10') {
        this.article3.title = this.formModel.title;
        this.article3.showType = this.formModel.showType;
        this.article3.type = this.position;
        this.article3.content = this.formModel.content ? this.formModel.content.substr(0, 43) + '...' : '';
        this.$set(this.article3, 'beginDate', this.formModel.beginDate);
        this.$set(this.article3, 'imagePaths', this.formModel.imagePaths);
        this.showPreviewThird = true;
      } else {
        this.articleVfu.seoDescription = this.formModel.content ? this.formatContent(this.formModel.content) : '';
        this.articleVfu.author = this.formModel.shop.name;
        this.articleVfu.type = this.position;
        this.articleVfu.articleType = '0';
        if (this.formModel.article) {
          this.articleVfu.id = this.formModel.article.id;
        }
        this.articleVfu.createDate = this.formModel.createDate.slice(0, 10);
        this.articleVfu.images = this.formModel.imagePaths;
        this.articleVfu.content = this.formModel.content ? this.formatContent(this.formModel.content) : '';
        this.articleVfu.title = this.formModel.title;
        this.$set(this.articleVfu, 'imagePaths', this.formModel.imagePaths);
        this.articleVfu.showType = this.formModel.showType;
        this.$set(this.articleVfu, 'beginDate', this.formModel.beginDate);
        this.$set(this.articleVfu, 'endDate', this.formModel.endDate);
        this.showPreview = true;
      }
    },
    // 去掉内容中的标签及图片/视频
    formatContent(content) {
      let tmp = content.replace(/<[^>]+>|&[^>]+;/g, '');
      return tmp.substr(0, 43) + '...';
    },
    formatterType(type) {
      switch (this.formModel.type) {
        case '1':
          return '活动';
        case '2':
          return '促销';
        case '4':
          return '资讯(爱车频道)';
        case '5':
          return '广告';
        case '6':
          return '商品推广';
        case '7':
          return '车友会活动';
        default:
          return '--';
      }
    },
    formatterState() {
      switch (this.formModel.state) {
        case '0':
          return '审核中';
        case '1':
          return '审核通过';
        case '2':
          return '审核不通过';
        case '3':
          return '已投放';
        default:
          return '--';
      }
    },
    addKeyWord() {
      this.showDialog = true;
      this.giftList = [];
      this.getKeyWordList();
    },
    getKeyWordList() {
      this.loading = true;
      let params = {
        store: this.getUser().shop.id || window.top.SHOP_ID || '',
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      http
        .get('/admin/keyword/keywords.jhtml', params)
        .then(data => {
          this.giftList = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirmedSelect(selectionKeys, selections) {
      if (this.formModel.bidKeyWords.length > 0) {
        for (const select of selections[0].keywords) {
          for (const keyword of this.formModel.bidKeyWords) {
            if (select.name === keyword.name) {
              return false;
            } else {
              this.formModel.bidKeyWords = [...new Set(this.formModel.bidKeyWords.concat(select))];
            }
          }
        }
      } else {
        this.formModel.bidKeyWords = selections[0].keywords;
      }
    },
    addNewTag() {
      const newName = String(this.newTagName).trim();
      if (!newName) {
        this.$message.warning('请输入自定义关键词');
        return false;
      }
      for (const keyword of this.formModel.bidKeywords) {
        if (keyword.name === newName) {
          this.$message.warning('该关键词已存在，请重新添加');
          return false;
        }
      }
      this.formModel.bidKeywords = [
        ...new Set(this.formModel.bidKeywords.concat({ id: '', category: '', name: newName, price: '1.00', hitRate: '60' }))
      ];
      this.newTagName = '';
    },
    rowDeleteClickHandler(val) {
      this.formModel.bidKeywords.splice(val.$index, 1);
    },
    detail(row) {
      this.showDetail = true;
      this.detailData = row.keywords;
    },
    backClick() {
      this.showDetail = false;
      this.showDialog = true;
    },
    getSaveParams() {
      return {
        id: this.itemId.id,
        isTop: this.formModel.isTop,
        orders: this.formModel.orders,
        beginDate: this.formModel.beginDate,
        endDate: this.formModel.endDate,
        showType: this.formModel.showType,
        isOn: this.formModel.isOn,
        content: this.formModel.content,
        title: this.formModel.title,
        bid: this.formModel.bid,
        budget: this.formModel.budget,
        bidKeywords: this.formModel.bidKeywords,
        imagePaths: this.formModel.imagePaths
      };
    },
    savehandle() {
      if (this.itemId.id) {
        this.save();
      } else {
        if (this.dialogActiveFilters[0].value === 'marketing') {
          http
            .post('/admin/marketing/publish4add.jhtml', { id: this.activityId, recommendBeginDate: this.formModel.beginDate, recommendEndDate: this.formModel.endDate })
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            })
            .catch(ErrorData => {
              this.dialogLoading = false;
              this.$message.warning(ErrorData.errorMessage || '操作错误');
            });
        } else if (this.dialogActiveFilters[0].value === 'promotion') {
          http
            .post('/admin/marketing/publish4add.jhtml', { id: this.activityId, recommendBeginDate: this.formModel.beginDate, recommendEndDate: this.formModel.endDate })
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            })
            .catch(ErrorData => {
              this.dialogLoading = false;
              this.$message.warning(ErrorData.errorMessage || '操作错误');
            });
        } else if (this.dialogActiveFilters[0].value === 'article') {
          http
            .post('/admin/article/article/updatePublishState4add.jhtml', { id: this.activityId, recommendBeginDate: this.formModel.beginDate, recommendEndDate: this.formModel.endDate })
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            })
            .catch(ErrorData => {
              this.dialogLoading = false;
              this.$message.warning(ErrorData.errorMessage || '操作错误');
            });
        } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
          http
            .post('/admin/article/article/updatePublishState4add.jhtml', { id: this.activityId, recommendBeginDate: this.formModel.beginDate, recommendEndDate: this.formModel.endDate })
            .then(data => {
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            })
            .catch(ErrorData => {
              this.dialogLoading = false;
              this.$message.warning(ErrorData.errorMessage || '操作错误');
            });
        }
      }
    },
    save() {
      if (this.position !== '0' && this.position !== '1' && this.position !== '10' && this.formModel.imagePaths.length === 0) {
        this.$message.warning('请选择图片');
        return;
      }
      if (
        (this.position === '8' || this.position === '9') &&
        this.formModel.showType === '1' &&
        this.formModel.imagePaths.length < 3
      ) {
        this.$message.warning('请选择3张图片上传');
        return;
      }
      if (this.position === '10') {
        if (this.formModel.bidKeywords.length > 0) {
          for (const keyword of this.formModel.bidKeywords) {
            if (!keyword.price) {
              this.$message.warning('请输入出价');
              return;
            }
            if (!/^[0-9]+\.?[0-9]*$/.test(keyword.price)) {
              this.$message.warning('出价必须为数字值！');
              return;
            }
            if (!/^\d+\.?\d{0,2}$/.test(keyword.price)) {
              this.$message.warning('出价小数点后最多两位小数');
              return;
            }
          }
        } else {
          this.$message.warning('请选择竞价关键词');
          return;
        }
      }
      if (!this.formModel.beginDate) {
        this.$message.warning('请选择推送开始时间');
        return;
      }
      if (!this.formModel.endDate) {
        this.$message.warning('请选择推送结束时间');
        return;
      }
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');

            this.$emit('operationSuccess');
          };
          const failed = errData => {
            if (errData.resultCode === '1201') {
              this.dialogVisible = true;
              http
                .post('/admin/recommend/oauth.jhtml', {})
                .then(data => {
                  this.loading = false;
                  window.open(data.oauthURL);
                })
                .catch(() => {
                  this.loading = false;
                });
            }
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          };
          const final = data => {
            this.loading = false;
          };

          http
            .post(service.updateBaseInfo, this.getSaveParams())
            .then(success)
            .catch(failed)
            .finally(final);
        } else {
          return false;
        }
      });
    },
    handleActiveConfirmed(key, row) {
      console.log(row);
      this.activityId = row[0].id;
      if (this.dialogActiveFilters[0].value === 'marketing') {
        this.formModel.title = row[0].title;
      } else if (this.dialogActiveFilters[0].value === 'promotion') {
        this.formModel.title = row[0].title;
      } else if (this.dialogActiveFilters[0].value === 'article') {
        this.formModel.title = row[0].title;
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        this.formModel.title = row[0].title;
      }
    },
    queryLink() {
      let params = {
        searchValue: this.dialogActiveFilters[1].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogActivePagination.currentPage,
        pageSize: this.dialogActivePagination.pageSize
      };
      this.dialogLoading = true;
      let url = '/admin/product/union/list4add.jhtml';
      if (this.dialogActiveFilters[0].value === 'promotion') {
        this.dialogActiveFilters[1].placeholder = '请输入活动名称';
        url = '/admin/promotion/union/listPromotion4add.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        this.dialogActiveFilters[1].placeholder = '请输入活动名称';
        url = '/admin/marketing/union/listActivity4add.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'article') {
        this.dialogActiveFilters[1].placeholder = '请输入文章名称';
        url = '/admin/article//articles4add.jhtml';
        this.$set(params, 'articleType', '0');
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        this.dialogActiveFilters[1].placeholder = '请输入标题';
        url = '/admin/recommend/list4add.jhtml';
        this.$set(params, 'position', '0');
        this.$set(params, 'type', 'product');
      }
      http
        .get(url, params)
        .then(data => {
          this.dialogLoading = false;
          if (this.dialogActiveFilters[0].value === 'shopPublicity') {
            this.dialogActiveTableData = data.recommendList;
          } else {
            this.dialogActiveTableData = data.content;
          }
          this.dialogActivePagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 添加活动
    addActive() {
      this.dialogActivePagination.currentPage = 1;
      this.queryLink();
      this.showActiveDialog = true;
    },
    getType(row) {
      if (this.dialogActiveFilters[0].value === 'promotion') {
        switch (row.typeStr) {
          case '0':
            return '包邮';
          case '1':
            return '优惠券';
          case '2':
            return '促销';
          case '3':
            return '满减';
          case '4':
            return '折扣';
          case '5':
            return '满送';
          case '6':
            return '套餐';
          case '7':
            return '会员价';
          default:
            return '';
        }
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
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
          default:
            break;
        }
      }
    },
    getState(row) {
      if (this.dialogActiveFilters[0].value === 'product') {
        switch (row.state) {
          case '0':
            return '已创建';

          case '1':
            return '已提交';

          case '2':
            return '已上架';

          case '3':
            return '已下架';
          default:
            break;
        }
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        switch (row.state) {
          case '0':
            return '审核中';
          case '1':
            return '审核不通过';
          case '2':
            return '审核通过';
          case '3':
            return '已投放';
        }
      } else {
        switch (row.state) {
          case '0':
            return '已创建';
          case '1':
            return '已发布';
          // case '2':
          //   return '自动审核';
          case '3':
            return '审核通过';
          case '4':
            return '未审核';
        }
      }
    },
    getStateStr(row) {
      if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
              return '进行中';
            } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
              return '已结束';
            } else {
              return '进行中';
            }
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
      } else {
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
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    // dialog过滤器发生变动
    dialogActiveFilterDataChange(val) {
      // this.filters = val;
      this.dialogActivePagination.currentPage = 1;
      this.queryLink();
    },
    // 分页
    dialogActivePageSizeChange(val) {
      this.dialogActivePagination.pageSize = val;
      this.queryLink();
    },
    // 跳页
    dialogActiveCurrentPageChange(val) {
      this.dialogActivePagination.currentPage = val;
      this.queryLink();
    }
  }
};

export default {
  name: 'ServiceRecommendBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderMulti,
    BizDialogSelector,
    PublishPreview,
    PublishPreviewThird
  },
  data() {
    let checkBudget = (rule, value, callback) => {
      if (this.position === '8') {
        if (Number(this.formModel.budget) >= 100) {
          callback();
        } else {
          callback(new Error('预算为大于等于100的数'));
        }
      }
      if (this.position === '9') {
        if (Number(this.formModel.budget) <= 10000 && Number(this.formModel.budget) >= 100) {
          callback();
        } else {
          callback(new Error('预算为100-10000之间的数'));
        }
      }
      if (this.position === '10') {
        if (Number(this.formModel.budget) <= 10000 && Number(this.formModel.budget) >= 50) {
          callback();
        } else {
          callback(new Error('预算为50-10000之间的数'));
        }
      }
    };
    let checkBid = (rule, value, callback) => {
      if (Number(this.formModel.bid) <= 100 && Number(this.formModel.bid) >= 0.2) {
        callback();
      } else {
        callback(new Error('点击出价为0.2~100之间的数'));
      }
    };
    return {
      ...initData.data,
      ...formData.data,

      rules: {
        // orders: [{ pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        budget: [{ required: true, message: '请输入预算', trigger: 'blur' }, { validator: checkBudget, trigger: 'blur' }],
        bid: [{ required: true, message: '请输入点击出价', trigger: 'blur' }, { validator: checkBid, trigger: 'blur' }]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    position: {
      type: String
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events,

    ...initData.methods,
    ...initData.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  computed: {
    dateRange: {
      get() {
        if (this.formModel.beginDate && this.formModel.endDate) {
          return [this.formModel.beginDate, this.formModel.endDate];
        } else {
          return [];
        }
      },
      set(newValue) {
        if (newValue) {
          this.formModel.beginDate = newValue[0];
          this.formModel.endDate = newValue[1];
        } else {
          this.formModel.beginDate = '';
          this.formModel.endDate = '';
        }
      }
    },
    activityUrl() {
      if (this.formModel.type === '2') {
        return window.location.origin + '/resources/admin/ecStatic/index.html#/recent-promotion/' + this.formModel.promotion.id;
      } else if (this.formModel.type === '4') {
        return window.location.origin + '/resources/admin/ecStatic/index.html#/icar-channel/article/' + this.formModel.article.id;
      } else if (this.formModel.type === '1') {
        return (
          window.location.origin +
          '/resources/admin/ecStatic/index.html#/recent-activity/' +
          this.urlArray[this.formModel.marketing.type] +
          '/' +
          this.formModel.marketing.id
        );
      } else if (this.formModel.type === '6') {
        return (
          window.location.origin + '/resources/admin/ecStatic/index.html#/icar-channel/recommend/' + this.formModel.productList.id
        );
      } else {
        return '';
      }
    }
  },
  created() {
    // if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.service-recommend__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    padding: 20px;
    .el-select {
      width: 100%;
    }
    .form-static {
      color: #606266;
    }
  }
  .el-radio {
    margin-right: 20px;
  }
  .el-radio__input {
    vertical-align: top;
  }
  .el-radio-group {
    padding-top: 10px;
    display: flex;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.close-order-dialog {
  width: 600px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 300px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.detail-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 300px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.helpClass {
  color: #ff7300;
}
</style>
