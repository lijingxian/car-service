<template>
  <biz-grid class="activity-promotion-mgmt">
    <div slot="top">
      <div class="activity-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"
          :views="views" @onSwitch="onViewSwitch"></biz-header>
      </div>
      <div class="toggle-btn" @click="isShow" v-if="this.activedView!=='model'">
        {{ toggleRecommendTxt }}
        <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <activity-mgmt-model-view v-show="this.activedView==='model'" :activityModelList="promotionModelList" @select="selectModel">
      </activity-mgmt-model-view>
      <promotion-mgmt-card-view v-show="this.activedView==='card'" :promotionList="promotionList" @select="rowClick"
        @deleted="deleted"></promotion-mgmt-card-view>
      <promotion-mgmt-list-view :height="height" v-show="this.activedView==='list'" @handleSelectionChange="handleSelectionChange"
        @rowClick="rowClick" :promotionList="promotionList" @deleted="deleted" @handleSortChange="handleSortChange">
      </promotion-mgmt-list-view>
      <promotion-statistics ref="statistics" v-show="this.activedView==='chart'"></promotion-statistics>
    </div>
    <div class="m-pagination" v-show="this.activedView!=='chart'" slot="bottom">
      <div class="limit-pagination">
        <biz-pagination v-show="this.activedView!=='chart' && this.activedView!=='model'" :pagination="pagination"
          @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" name="baseinfo">
          <promotion-mgmt-base-info ref="baseInfo" :isEdit="isEdit" :previewItem="previewItem" :itemId="currentRowId"
            :isCreated="isCreated" :memberRankList="initInfo.memberRankList" @updated="isUpdate = true" @created="pCreated">
          </promotion-mgmt-base-info>
        </el-tab-pane>
        <!-- <el-tab-pane v-if="!isCreated" label="推送设置" name="publishSetting">
          <biz-publish-setting :itemId="itemId" :isEdit="isEdit && hasAuthEdit" :article="modifiedForm" :articleType="'3'"
            :isDisabled="false"></biz-publish-setting>
        </el-tab-pane> -->
        <el-tab-pane v-if="!isCreated" label="活动参与" name="participant">
          <promotion-participant ref="participant" :isEdit="isEdit"></promotion-participant>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" label="活动通知" name="notice">
          <promotion-notice ref="notice" :isEdit="isEdit" :memberRankList="initInfo.memberRankList" :defaultShop="user.shop">
          </promotion-notice>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" key="hdxy" label="活动效益" name="activityGet">
          <activity-benefit :info="activePromotion" actType="promotion"></activity-benefit>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import date from '@/utils/date';
import http from '@/common/http';
import ActivityMgmtModelView from '../marketing/ActivityMgmtModelView';
import PromotionMgmtCardView from './PromotionMgmtCardView';
import PromotionMgmtListView from './PromotionMgmtListView';
import PromotionStatistics from './PromotionStatistics';
import PromotionMgmtService from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
import service from '@/service/activity-mgmt/promotion-mgmt/ActivityPromotionMgmtBaseInfo.js';
import PromotionMgmtBaseInfo from './PromotionMgmtBaseInfo';
import PromotionParticipant from './PromotionParticipant';
import PromotionNotice from './PromotionNotice';
// import BizPublishSetting from '@/components/BizPublishSetting';
import { mapGetters } from 'vuex';
import ActivityBenefit from '../marketing/ActivityBenefit';

import { global } from '@/common/urls';
export default {
  name: 'ActivityPromotionMgmt',
  data() {
    return {
      modifiedForm: {
        title: '',
        titleImage: '',
        seoDescription: '',
        author: '',
        createDate: '',
        images: [],
        promotionType: ''
      },
      orderProperty: '',
      orderDirection: '',
      itemId: { id: '' },
      // 是否刷新
      showRecommend: false,
      isUpdate: false,
      loading: false,
      currentRowId: { id: '' },
      previewItem: {},
      user: {},
      initInfo: {},
      height: '100%',
      openPopup: false,
      popupTabName: 'baseinfo',
      activePromotion: {},
      isCreated: true,
      promotionList: [],
      promotionModelList: [],
      multipleSelection: [],
      editShopIds: [],
      isEdit: true,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      modelPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'card',
          title: '卡片视图'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        }
      ],
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary'
        },
        {
          label: '复制',
          name: 'copy',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        }
      ],
      filters: [
        {
          type: 'select',
          label: '类型',
          name: 'type',
          value: '',
          class: 'hidden',
          options: [
            {
              label: '全部',
              value: ''
            },
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
          ]
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          class: 'hidden',
          disabled: false,
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已结束', value: '2' },
            { label: '已创建', value: '3' },
            { label: '已提交', value: '4' },
            { label: '已取消', value: '5' }
          ]
        },
        {
          type: 'select',
          label: '店铺名称',
          name: 'shopId',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'daterange',
          label: '创建时间',
          name: 'publishDate',
          class: 'hidden',
          value: [date.lastYearDate(), date.nowDate()]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入活动名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizPopupTabs,
    BizPagination,
    BizHeader,
    ActivityMgmtModelView,
    PromotionMgmtCardView,
    PromotionMgmtListView,
    PromotionStatistics,
    PromotionMgmtBaseInfo,
    PromotionParticipant,
    PromotionNotice,
    // BizPublishSetting,
    ActivityBenefit
  },
  created() {
    this.getShopList();
    this.getInitInfo();
    this.refresh();
    this.getKPI();
    this.getEditableStores();
  },
  mounted() {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:promotion.edit');
    },
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
    },
    styleObject() {
      return {
        height: this.height + 'px'
      };
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    getKPI() {
      PromotionMgmtService.getKPI(
        { shopId: window.top.SHOP_ID || '' },
        data => {
          let msg =
            '通过该功能管理线上的各种促销活动，持续活跃会员，促销利器，当前累计活动' +
            data.data.promotionAll +
            '，进行中' +
            data.data.promotionContinue +
            '，未开始' +
            data.data.promotionNotBegin +
            '，未发布' +
            data.data.promotionCreated +
            '，已结束' +
            data.data.promotionEnded +
            '。';
          this.$message({
            showClose: true,
            message: msg
          });
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '3'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getInitInfo: async function() {
      this.user = this.getUser();
      let params = {
        shopId: window.top.SHOP_ID || ''
      };

      PromotionMgmtService.queryBaseInfo(
        params,
        data => {
          this.initInfo = data;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 促销内容更新
    contentUpdate(previewItem) {
      this.previewItem = previewItem;
      console.log('preview: ', this.previewItem);
    },
    operate(name) {
      this[name]();
    },
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      // if (this.views[3].actived) {
      //   this.getStatisticsAnalysis();
      // } else {
      this.getPromotionList();
      // }
    },
    onViewSwitch(name) {
      document.querySelectorAll('.biz-header__operation-wrapper')[0].style.display = '';
      document.querySelectorAll('.biz-table-filter')[0].style.display = '';
      if (name === 'chart') {
        this.operations = [];
      } else {
        this.operations = [
          {
            label: '新增',
            name: 'create',
            type: 'primary'
          },
          {
            label: '复制',
            name: 'copy',
            type: '',
            disabled: true
          },
          {
            label: '刷新',
            name: 'refresh',
            type: ''
          },
          {
            label: '删除',
            name: 'delete',
            type: '',
            disabled: true
          }
        ];
      }
      this.views = [].concat(
        this.views.map(view => {
          view.actived = view.name === name;
          return view;
        })
      );
      if (this.views[0].actived === true) {
        this.modelPagination = {
          pageSize: 20,
          currentPage: 1,
          pageSizes: [10, 20, 50, 100],
          total: 0
        };
      } else {
        this.filters[1].options = [
          { label: '全部', value: '' },
          { label: '未开始', value: '0' },
          { label: '进行中', value: '1' },
          { label: '已结束', value: '2' },
          { label: '已创建', value: '3' },
          { label: '已提交', value: '4' },
          { label: '已取消', value: '5' }
        ];
        this.$set(this.filters[1], 'disabled', false);
        this.getPromotionList();
      }
    },
    refresh() {
      this.getPromotionList();
    },
    pCreated(id) {
      console.warn(id);
      let params = {
        id: id
      };
      service.queryAdmin(
        params,
        data => {
          console.log(data.data);
          this.activePromotion = data.data;
          this.itemId = { id: id };
          this.isCreated = false;
          this.popupTabName = 'baseinfo';
          // 等待DOM更新
          this.$nextTick(() => {
            this.$refs.participant.refresh(this.activePromotion);
            this.$refs.notice.refresh(this.activePromotion);
            // this.$refs[this.activePromotion.promotionType].refresh(this.activePromotion.id);
          });
          this.$refs.baseInfo.refresh(this.activePromotion.id);
          this.openPopup = true;
        },
        ErrorData => {
          console.log('ERR_QUERY: ', ErrorData);
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getPromotionList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getPromotionList();
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.getPromotionList();
    },
    getPromotionList() {
      this.loading = true;
      let params = {
        typeStr: this.filters[0].value,
        stateStr: this.filters[1].value,
        shopId: this.filters[2].value || window.top.SHOP_ID || '',
        beginDate: this.filters[3].value[0],
        endDate: this.filters[3].value[1],
        searchValue: this.filters[4].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };

      PromotionMgmtService.getPromotionListAdmin(
        params,
        data => {
          this.loading = false;
          this.promotionList = data.dataList;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
    },
    getShopList() {
      PromotionMgmtService.getShopList(
        { shopId: window.top.SHOP_ID || '', sourceType: '3' },
        data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.shops.map(shop => {
              return { label: shop.name, value: shop.id };
            })
          );
        },
        ErrorData => {}
      );
    },
    deleted() {
      this.getPromotionList();
    },
    delete() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }

          let params = {
            ids: ids
          };
          PromotionMgmtService.deletePromotionList(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
            }
          );
        })
        .catch(() => {});
    },
    selectModel(activityModel) {
      this.popupTabName = 'baseinfo';
      this.$refs.baseInfo.selectModel(activityModel);
      this.isCreated = true;
      this.openPopup = true;
    },
    rowClick(val) {
      console.log(val);
      this.isCreated = false;
      this.currentRowId = { id: val.id };
      this.popupTabName = 'baseinfo';
      this.activePromotion = val;
      this.getActivity(val.id);
      // if (this.getUser().roleLevel === 'shop' && val.unionConfig.editable === '0') {
      //   this.isEdit = false;
      // } else {
      //   this.isEdit = true;
      // }
      // 等待DOM更新
      this.$nextTick(() => {
        this.$refs.participant.refresh(val);
        this.$refs.notice.refresh(val);
        // this.$refs[val.promotionType].refresh(val.id);
      });
      this.$refs.baseInfo.refresh(val.id);
      this.itemId = { id: val.id };
      this.openPopup = true;
    },
    // 去掉内容中的标签及图片/视频
    formatContent(content) {
      let tmp = content.replace(/<script[^>]*?>.*<\/script>/g, '');
      tmp = tmp.replace(/<style[^>]*?>.*<\/style>/g, '');
      tmp = tmp.replace(/<[^>]+>/g, '');
      tmp = tmp.replace(/\\&[a-zA-Z]{1,10};/g, '');
      return tmp;
    },
    getActivity(val) {
      let url = ' /admin/promotion/platform/promotion.jhtml';
      let params = { id: val, shopId: window.top.SHOP_ID || '' };
      http
        .get(url, params)
        .then(data => {
          this.modifiedForm.title = data.data.title;
          this.modifiedForm.titleImage = data.data.cover || data.data.images[0];
          this.modifiedForm.seoDescription = data.data.content ? this.formatContent(data.data.content) : '';
          this.modifiedForm.author = data.data.shopData.name;
          this.modifiedForm.createDate = data.data.createDate.slice(0, 10);
          this.modifiedForm.images = data.data.images;
          this.modifiedForm.content = data.data.content;
          this.modifiedForm.promotionType = data.data.promotionType;
          this.modifiedForm.beginDate = data.data.beginDate;
          this.modifiedForm.endDate = data.data.endDate;
          this.modifiedForm.state = data.data.stateStr;
          this.modifiedForm = Object.assign({}, this.modifiedForm);
        })
        .catch();
    },
    copy() {
      let row = this.multipleSelection[0];
      let url = '/admin/promotion/clonePromotion.jhtml';
      let params = { id: row.id };
      http
        .post(url, params)
        .then(data => {
          this.refresh();
          this.isCreated = true;
          this.popupTabName = 'baseinfo';
          this.$refs.baseInfo.clear();
          this.$refs.baseInfo.copy(row.id);
          this.openPopup = true;
        })
        .catch();
    },
    create() {
      this.isCreated = true;
      this.currentRowId = { id: '' };
      this.popupTabName = 'baseinfo';
      this.$refs.baseInfo.clear();
      this.openPopup = true;
    },
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'copy' || item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        });
        if (val.length === 1) {
          this.operations.map(item => {
            if (item.name === 'copy') {
              item.disabled = false;
            }
          });
        }
      }
      this.multipleSelection = val;
    }
  },
  watch: {
    openPopup(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.refresh();
      }
    },
    popupTabName(val) {
      if (val === 'notice') {
        this.$refs.notice.refresh(this.activePromotion);
      }
    }
  }
};
</script>

<style lang="scss">
.activity-promotion-mgmt {
  padding: 5px 0px 5px 15px !important;
  .content {
    height: 100%;
  }
  .m-pagination {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .limit-pagination {
      margin-right: 10px;
      display: flex;
      justify-content: center;
    }
  }
  .biz-header .biz-header__filter-wrapper .biz-header__switch {
    position: absolute;
    top: 15px;
    right: 5px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 100px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 50px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    // width: 25%;
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
