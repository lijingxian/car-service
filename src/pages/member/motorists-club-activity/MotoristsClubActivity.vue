<template>
  <biz-grid class="motorists-club-activity" v-loading="loading">
    <div slot="top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
      </biz-header>
    </div>

    <activity-card-list :activities="activities" @deleteItem="deleteItem" @cardClicked="cardClicked" @topClicked="topClicked">
    </activity-card-list>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
    <biz-popup-tabs slot="float" :open="open" v-model="tabSelection" @close="open = false;">
      <el-tab-pane label="活动信息" name="0">
        <activity-info :cardId="activityInfoModel" @operationSuccess="operationSuccess"></activity-info>
      </el-tab-pane>
      <el-tab-pane label="报名详情" name="1" v-if="!isCreate">
        <signup-info :cardId="activityInfoModel" ref="signupInfo"></signup-info>
      </el-tab-pane>
      <el-tab-pane label="签到信息" name="2" v-if="false">
        <signin-info :cardId="activityInfoModel"></signin-info>
      </el-tab-pane>
      <el-tab-pane label="活动通知" name="3" v-if="!isCreate">
        <activity-notification :cardId="activityInfoModel" @operationSuccess="operationSuccess"></activity-notification>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import ActivityCardList from './components/ActivityCardList';
import ActivityInfo from './ActivityInfo';
import SignupInfo from './SignupInfo';
import SigninInfo from './SigninInfo';
import ActivityNotification from './ActivityNotification';
import date from '@/utils/date';

import motoristsClubActivityService from '@/service/motorists-club-activity/motoristsClubActivity';

export default {
  name: 'MotoristsClubActivity',
  components: {
    BizPopupTabs,
    BizHeader,
    BizGrid,
    ActivityCardList,
    ActivityInfo,
    SignupInfo,
    SigninInfo,
    ActivityNotification,
    BizPagination
  },
  data() {
    return {
      loading: false,
      isCreate: false,
      actiivtyCreated: 0,
      actiivtyNotBegin: 0,
      actiivtyContinue: 0,
      tabSelection: '0',
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:fleetActivity.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'select',
          label: '车友会',
          name: 'publisher',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'status',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '0',
              label: '未开始'
            },
            {
              value: '1',
              label: '进行中'
            },
            {
              value: '2',
              label: '已结束'
            },
            {
              value: '3',
              label: '已创建 (未发布)'
            }
          ]
        },
        {
          type: 'daterange',
          label: '创建时间',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        }
      ],
      activities: [],
      activityInfoModel: {},
      open: false
    };
  },
  created() {
    this.initDims();

    this.queryActivities();
    this.queryActivityInfo();
  },
  methods: {
    initDims() {
      let params = {};
      if (window.top.SHOP_ID) params.shopId = window.top.SHOP_ID;

      motoristsClubActivityService.getClubList(
        params,
        data => {
          data.content.forEach(item => {
            item.label = item.name;
            item.value = item.id;
          });
          data.content.unshift({ label: '全部', value: '' });
          this.$set(this.filters[0], 'options', data.content);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);

          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    convertState(state) {
      switch (state) {
        case '0':
          return 'notStart';
        case '1':
          return 'continued';
        case '2':
          return 'ended';
        case '3':
          return 'created';
      }
    },
    getQueryParams() {
      let params = {
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };

      if (this.filters[1].value) params.state = this.convertState(this.filters[1].value);
      if (this.filters[0].value) params.fleetId = this.filters[0].value;

      return params;
    },
    queryActivities() {
      let params = this.getQueryParams();
      this.loading = true;

      motoristsClubActivityService.getActivityList(
        params,
        data => {
          this.activities = data.content;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.$message.warning(ErrorData.errorMessage);

          this.loading = false;
        }
      );
    },
    queryActivityInfo() {
      motoristsClubActivityService.getActivityInfo(
        this.getQueryParams(),
        data => {
          let msg =
            '未发布活动 ' +
            data.data.actiivtyCreated +
            ', ' +
            '未开始活动 ' +
            data.data.actiivtyNotBegin +
            ', ' +
            '进行中活动 ' +
            data.data.actiivtyContinue +
            ', ' +
            '已结束活动 ' +
            data.data.actiivtyEnded;
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },

    operationSuccess() {
      this.open = false;
      this.pagination.currentPage = 1;
      this.queryActivities();
    },

    operate(name) {
      this[name]();
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.queryActivities();
    },
    add() {
      this.isCreate = true;
      this.activityInfoModel = {};
      this.tabSelection = '0';
      this.open = true;
    },
    refresh() {
      this.queryActivities();
    },
    deleteItem(e, index) {
      motoristsClubActivityService.delete(
        {
          ids: [this.activities[index].id]
        },
        data => {
          this.$message.success('删除成功');

          this.pagination.currentPage = 1;
          this.queryActivities();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);

          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    cardClicked(e, model) {
      this.isCreate = false;
      this.activityInfoModel = Object.assign({}, model);
      this.tabSelection = '0';
      this.open = true;
    },
    topClicked(e, model) {
      motoristsClubActivityService.swtichTop(
        {
          activityId: model.id
        },
        data => {
          this.pagination.currentPage = 1;
          this.queryActivities();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);

          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.queryActivities();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryActivities();
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.motorists-club-activity__kpi {
  top: 45px;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
}
</style>
