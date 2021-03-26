<template>
  <biz-grid class="activity-market-mgmt">
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
      <activity-mgmt-model-view v-show="this.activedView==='model'" :activityModelList="activityModelList" @select="selectModel">
      </activity-mgmt-model-view>
      <activity-mgmt-list-view v-if="this.activedView==='list'" :height="height" :activityList="activityList" @created="refresh"
        @rowClick="rowClick" @handleSelectionChange="handleSelectionChange" @sort-change="sortChange"></activity-mgmt-list-view>
      <activity-mgmt-card-view v-show="this.activedView==='card'" :activityList="activityList" @created="refresh"
        @select="rowClick"></activity-mgmt-card-view>
      <statistics-analysis v-show="this.activedView==='chart'" ref="statistics"></statistics-analysis>
    </div>
    <div v-show="this.activedView!='chart'" class="m-pagination" slot="bottom">
      <div class="limit-pagination">
        <biz-pagination v-show="this.activedView!='model'&&this.activedView!='chart'" :pagination="pagination"
          @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
        <biz-pagination v-show="this.activedView==='model'" :pagination="modelPagination"
          @handleSizeChange="modelHandleSizeChange" @handleCurrentChange="modelHandleCurrentChange"></biz-pagination>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" key="jbxx" name="baseinfo">
          <base-info ref="baseInfo" :defaultShop="user.shop" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            @base-info-updated="baseInfoUpdated" @created="baseInfoCreated" :itemId="itemId"></base-info>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" label="活动内容" key="hdnr" name="content">
          <content-y-y-y v-if="activeActivity.typeStr === '0'||activeActivity.typeStr ==='1'" :isEdit="isEdit"
            :memberRankList="initInfo.memberRankList" ref="activityContent"></content-y-y-y>
          <content-c-j v-if="activeActivity.typeStr === '2'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-c-j>
          <content-p-t-g v-if="activeActivity.typeStr === '3'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-p-t-g>
          <content-n-y-q-g v-if="activeActivity.typeStr === '4'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-n-y-q-g>
          <content-x-s-m-s v-if="activeActivity.typeStr === '5'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-x-s-m-s>
          <content-b-k-j v-if="activeActivity.typeStr === '6'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-b-k-j>
          <content-t-j-y-l v-if="activeActivity.typeStr === '7'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-t-j-y-l>
          <content-f-x-y-l v-if="activeActivity.typeStr === '8'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-f-x-y-l>
          <content-z-m v-if="activeActivity.typeStr === '9'" :isEdit="isEdit" :memberRankList="initInfo.memberRankList"
            ref="activityContent"></content-z-m>
          <content-site v-if="activeActivity.typeStr === '11' || activeActivity.typeStr === '12'" :isEdit="isEdit" ref="activityContent"></content-site>
        </el-tab-pane>
        <el-tab-pane v-if="!isAward&&!isCreated" key="hdjp" label="活动奖品" name="award">
          <activity-award ref="award" :isEdit="isEdit" :activity="activeActivity" @awardSuccess="awardSuccess"></activity-award>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated&&['0', '1', '2'].includes(activeActivity.type)" key="hdys" label="活动样式" name="style">
          <activity-style ref="style" :activity="activeActivity"></activity-style>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" key="cyyh" label="参与用户" name="parti">
          <ActivityParticipant ref="participant" :isEdit="isEdit" :itemId="itemId"></ActivityParticipant>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" key="hdxy" label="活动效益" name="activityGet">
          <activity-benefit :info="activeActivity"></activity-benefit>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated" key="hdtz" label="消息通知" name="notice">
          <activity-notice ref="notice" :defaultShop="user.shop" :isEdit="isEdit" :memberRankList="initInfo.memberRankList">
          </activity-notice>
        </el-tab-pane>
        <el-tab-pane v-if="!isCreated&&activeActivity.typeStr !== '8'" label="广告推送" key="tssz" name="publishSetting">
          <biz-publish-setting :itemId="itemId" :articleType="'2'" :isEdit="isEdit && hasAuthEdit" :article="modifiedForm"
            :isDisabled="false" :activeNames="activeNames" :stypeSetting="stypeSetting"></biz-publish-setting>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import date from '@/utils/date';
import http from '@/common/http';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
import modelService from '@/service/activity-mgmt/marketing/model-mgmt/activityMgmtModelMgmt';
import { BizGrid } from '@/components/BizGrid';
import ActivityMgmtModelView from './ActivityMgmtModelView';
import ActivityMgmtListView from './ActivityMgmtListView';
import ActivityMgmtCardView from './ActivityMgmtCardView';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './ActivityBaseInfo';
import ContentCJ from './activity-content/ContentCJ';
import ContentBKJ from './activity-content/ContentBKJ';
import ContentFXYL from './activity-content/ContentFXYL';
import ContentNYQG from './activity-content/ContentNYQG';
import ContentPTG from './activity-content/ContentPTG';
import ContentTJYL from './activity-content/ContentTJYL';
import ContentXSMS from './activity-content/ContentXSMS';
import ContentYYY from './activity-content/ContentYYY';
import ContentZM from './activity-content/ContentZM';
import ContentSite from './activity-content/ContentSite';
import ActivityAward from './ActivityAward';
import ActivityStyle from './ActivityStyle';
import ActivityParticipant from './ActivityParticipant';
import ActivityNotice from './ActivityNotice';
import StatisticsAnalysis from './StatisticsAnalysis';
import BizPublishSetting from '@/components/BizPublishSetting';
import { mapGetters } from 'vuex';
import ActivityBenefit from './ActivityBenefit.vue';
import { global } from '@/common/urls';
import PromotionMgmtService from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
export default {
  name: 'ActivityMarketingMgmt',
  data() {
    return {
      modifiedForm: {},
      itemId: { id: '' },
      loading: false,
      activeActivity: {},
      initInfo: {
        memberRankList: []
      },
      orderProperty: '',
      orderDirection: '',
      activeNames: ['1'],
      stypeSetting: ['7', '8', '9'],
      defaultId: '',
      height: '100%',
      isCreated: false,
      isAward: false,
      showRecommend: false,
      popupTabName: 'baseinfo',
      openPopup: false,
      editShopIds: [],
      isEdit: true,
      shopList: [],
      activityModelList: [],
      activityList: [],
      multipleSelection: [],
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
          actived: false,
          class: 'iconfont biz-icon-qiapianshitu1',
          name: 'model',
          title: '模版视图',
          style: {
            'font-size': '18px'
          }
        },
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
        // {
        //   actived: false,
        //   class: 'iconfont biz-icon-tongjishitu',
        //   name: 'chart',
        //   title: '统计视图'
        // }
      ],
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary',
          auth: ['admin:activity.add']
        },
        {
          label: '复制',
          name: 'copy',
          type: '',
          disabled: true,
          auth: ['admin:activity.edit']
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
          disabled: true,
          auth: ['admin:activity.delete']
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
          ]
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          class: 'hidden',
          disabled: false,
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
          type: 'daterange',
          label: '创建时间',
          name: 'publishDate',
          class: 'hidden',
          value: [date.lastYearDate(), date.nowDate()]
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
    BizHeader,
    BizPagination,
    ActivityMgmtModelView,
    BizPopupTabs,
    BaseInfo,
    ContentCJ,
    ContentBKJ,
    ContentFXYL,
    ContentNYQG,
    ContentPTG,
    ContentTJYL,
    ContentXSMS,
    ContentYYY,
    ContentZM,
    ContentSite,
    ActivityMgmtListView,
    ActivityMgmtCardView,
    ActivityAward,
    ActivityStyle,
    ActivityParticipant,
    ActivityNotice,
    StatisticsAnalysis,
    BizPublishSetting,
    ActivityBenefit
  },
  created() {
    this.getInitInfo();
    this.getKPI();
    this.refresh();
    this.getEditableStores();
    this.getShopList();
    this.isEdit = true;
  },
  mounted() {
    // this.resize();
    this.popupTabName = 'baseinfo';
    this.$refs.baseInfo.clear();
    this.isCreated = true;
    this.isAward = true;
  },
  watch: {
    popupTabName(val) {
      if (val === 'notice') {
        this.$refs.notice.refresh(this.activeActivity);
      }
    }
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:activity.edit');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.unpublish');
    },
    hasAuthCommit() {
      // return true;
      return this.currentAuth.includes('admin:activity.commit');
    },
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
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
    awardSuccess() {
      this.$refs.baseInfo.refresh(this.activeActivity.id);
    },
    resize() {
      this.$nextTick(() => {
        let height = document.documentElement.clientHeight || window.innerHeight;
        this.height = String(height - 206);
      });
    },
    getShopList() {
      PromotionMgmtService.getShopList(
        { shopId: window.top.SHOP_ID || '', sourceType: '3' },
        data => {
          this.filters[3].options = [{ label: '全部', value: '' }].concat(
            data.shops.map(shop => {
              return { label: shop.name, value: shop.id };
            })
          );
        },
        ErrorData => {}
      );
    },
    sortChange({ column, prop, order }) {
      if (order) {
        if (order === 'descending') {
          this.orderDirection = 'desc';
        } else if (order === 'ascending') {
          this.orderDirection = 'asc';
        }
        this.orderProperty = prop;
      } else {
        this.orderDirection = '';
        this.orderProperty = '';
      }
      this.getActivityList();
    },
    create() {
      this.popupTabName = 'baseinfo';
      // this.$refs.baseInfo.clear();
      this.itemId = { id: '' };
      this.isEdit = true;
      this.isCreated = true;
      this.openPopup = true;
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
    refresh() {
      this.getActivityModelList();
      this.getActivityList();
      this.getShopList();
      this.getStatisticsAnalysis();
    },
    baseInfoUpdated() {
      this.isCreated = false;
      this.getActivityList();
      this.getShopList();
      this.getStatisticsAnalysis();
    },
    baseInfoCreated(val) {
      this.isCreated = false;
      this.getActivityList();
      this.getShopList();
      this.getStatisticsAnalysis();
      this.rowClick(val);
      this.modifiedForm = {};
    },
    operate(name) {
      this[name]();
    },
    getKPI() {
      activityMgmtService.getKPI(
        { shopId: window.top.SHOP_ID || '' },
        data => {
          let msg =
            '通过该功能管理线上的各种营销活动，持续活跃会员，营销利器，当前累计活动' +
            data.data.marketingAll +
            '，进行中' +
            data.data.marketingContinue +
            '，未开始' +
            data.data.marketingNotBegin +
            '，未发布' +
            data.data.marketingCreated +
            '，已结束' +
            data.data.marketingEnded +
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
    delete() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(this.multipleSelection);
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }

          let params = {
            ids: ids,
            shopId: window.top.SHOP_ID || ''
          };
          activityMgmtService.deleteActivity(
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
    copy() {
      let row = this.multipleSelection[0];
      let params = {
        id: row.id
      };
      http
        .post('/admin/marketing/copyActivity.jhtml', params)
        .then(data => {
          this.popupTabName = 'baseinfo';
          this.isAward = false;
          this.isCreated = true;
          this.activeActivity = row;
          if (this.getUser().roleLevel === 'shop' && row.unionConfig && row.unionConfig.editable === '0') {
            this.isEdit = false;
          } else {
            this.isEdit = true;
          }
          if (['0', '1', '2', '7', '8'].indexOf(this.activeActivity.typeStr) === -1) {
            this.isAward = true;
          }
          this.$nextTick(() => {
            this.isCreated = false;
            let that = this;
            setTimeout(function() {
              if (['0', '1', '2', '7', '8'].indexOf(row.typeStr) !== -1) {
                that.$refs.award.refresh(data);
              }
              that.$refs.activityContent.refresh(data);
            }, 100);
          });
          this.itemId = { id: data.id };
          this.openPopup = true;
          this.$message.success('复制成功');
          this.getActivityList();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getInitInfo: async function() {
      this.user = this.getUser();
      let params = {
        shopId: window.top.SHOP_ID || ''
      };

      activityMgmtService.getInitInfo(
        params,
        data => {
          this.initInfo = data;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getActivityList();
      this.getStatisticsAnalysis();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getActivityList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getActivityList();
    },
    modelHandleSizeChange(val) {
      this.modelPagination.pageSize = val;
      this.getActivityModelList();
    },
    modelHandleCurrentChange(val) {
      this.modelPagination.currentPage = val;
      this.getActivityModelList();
    },
    onViewSwitch(name) {
      document.querySelectorAll('.biz-header__operation-wrapper')[0].style.display = '';
      document.querySelectorAll('.biz-table-filter')[0].style.display = '';
      if (name === 'chart') {
        this.filters[1].options = [
          { label: '已结束', value: '' },
          { label: '已结束', value: '0' },
          { label: '已结束', value: '1' },
          { label: '已结束', value: '2' },
          { label: '已结束', value: '3' },
          { label: '已结束', value: '4' },
          { label: '已结束', value: '5' }
        ];
        this.filters[1].disabled = true;
        this.operations = [];
      } else if (name === 'model') {
        document.querySelectorAll('.biz-header__operation-wrapper')[0].style.display = 'none';
        document.querySelectorAll('.biz-table-filter')[0].style.display = 'none';
        document.querySelectorAll('.biz-header')[0].style.padding = '20px';
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
        this.filters[1].disabled = false;
        this.operations = [
          {
            label: '新增',
            name: 'create',
            type: 'primary',
            auth: ['admin:activity.add']
          },
          {
            label: '复制',
            name: 'copy',
            type: '',
            disabled: true,
            auth: ['admin:activity.edit']
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
            disabled: true,
            auth: ['admin:activity.delete']
          }
        ];
      }
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
          if (view.name !== 'list' && this.operations.length > 0) {
            this.operations.map(item => {
              if (item.name === 'copy' || item.name === 'delete') {
                item.disabled = true;
              }
            });
          } else {
            if (this.multipleSelection.length > 0 && this.operations.length > 0) {
              this.operations.map(item => {
                if (item.name === 'delete') {
                  item.disabled = false;
                }
              });
              if (this.multipleSelection.length === 1 && this.operations.length > 0) {
                this.operations.map(item => {
                  if (item.name === 'copy') {
                    item.disabled = false;
                  }
                });
              }
            }
          }
        }
      }
      this.refresh();
    },
    rowClick(val) {
      this.isCreated = true;
      this.popupTabName = 'baseinfo';
      this.activeActivity = val;
      this.isAward = false;
      if (this.getUser().roleLevel === 'shop' && val.unionConfig && val.unionConfig.editable === '0') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      if (['0', '1', '2', '7', '8'].indexOf(this.activeActivity.typeStr) === -1) {
        this.isAward = true;
      }
      this.getActivity(val.id);
      this.$nextTick(() => {
        this.isCreated = false;
        let that = this;
        // 为了修改20625的bug
        setTimeout(function() {
          that.$refs.style && that.$refs.style.refresh(val);
          if (['0', '1', '2', '7', '8'].indexOf(val.typeStr) !== -1) {
            that.$refs.award.refresh(val);
          }
          that.$refs.participant.refresh(val);
          that.$refs.activityContent.refresh(val);
          that.$refs.notice.refresh(val);
        }, 100);
      });
      this.itemId = { id: val.id };
      this.activeNames = ['1'];
      this.stypeSetting = ['7', '8', '9'];
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
      let url = '/admin/marketing/activity.jhtml';
      let params = { id: val, shopId: window.top.SHOP_ID || '' };
      http
        .get(url, params)
        .then(data => {
          this.modifiedForm.id = data.activity.id;
          this.modifiedForm.title = data.activity.title;
          this.modifiedForm.titleImage = data.activity.cover || data.activity.images[0];
          this.modifiedForm.seoDescription = data.activity.content ? this.formatContent(data.activity.content) : '';
          this.modifiedForm.author = data.activity.shopname;
          this.modifiedForm.createDate = data.activity.createDate.slice(0, 10);
          this.modifiedForm.images = data.activity.images;
          this.modifiedForm.content = data.activity.content;
          this.modifiedForm.typeStr = data.activity.typeStr;
          this.modifiedForm.shop = data.activity.shop;
          this.modifiedForm.activityType = '0';
          this.$refs.baseInfo.activity.stateStr = data.activity.stateStr;
        })
        .catch();
    },
    selectModel(activityModel) {
      this.popupTabName = 'baseinfo';
      this.$refs.baseInfo.selectModel(activityModel);
      this.isCreated = true;
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
    },
    // 获取活动列表
    getActivityList() {
      this.loading = true;
      let params = {
        orderDirection: this.orderDirection,
        orderProperty: this.orderProperty,
        typeStr: this.filters[0].value,
        stateStr: this.filters[1].value,
        beginDate: this.filters[2].value[0],
        endDate: this.filters[2].value[1],
        searchValue: this.filters[4].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: this.filters[3].value || window.top.SHOP_ID || ''
      };

      activityMgmtService.getActivityList(
        params,
        data => {
          this.loading = false;
          this.activityList = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 获取模板列表
    getActivityModelList() {
      let params = {
        type: '0',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.modelPagination.currentPage,
        pageSize: this.modelPagination.pageSize
      };

      modelService.getList(
        params,
        data => {
          this.activityModelList = data.content;
          this.modelPagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 获取统计信息
    getStatisticsAnalysis() {
      let params = {
        orderDirection: this.orderDirection,
        orderProperty: this.orderProperty,
        shopId: this.filters[3].value || window.top.SHOP_ID || '',
        activityType: this.filters[0].value,
        state: this.filters[1].value,
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1],
        searchValue: this.filters[4].value
      };
      this.$nextTick(() => {
        this.$refs.statistics.paramschange(params);
      });
    }
  }
};
</script>

<style lang="scss">
.activity-market-mgmt {
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
  .biz-popup .popup-content {
    width: 600px;
  }
  .biz-header .biz-header__filter-wrapper .biz-header__switch {
    position: absolute;
    top: 15px;
    right: 5px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 145px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 100px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
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
