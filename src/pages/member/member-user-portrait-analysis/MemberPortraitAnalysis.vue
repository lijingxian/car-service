<template>
  <div class="member-portrait-analysis">
    <div class="operator">
      <div class="filter-portrait" v-if="filters.length > 0">
        <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
      </div>
    </div>
    <div class="member-info">
      <div class="header">
        <span>用户信息</span>
        <span><el-button @click="memberSelected" type="text" size="mini">切换</el-button></span>
      </div>
      <div class="container">
        <div class="header-img">
          <img v-if="userPortrait.head" :src="userPortrait.head" alt />
          <img v-else :src="DefaultAvatar" />
          <div class="wrapper">
            <div class="gender">
              <i class="male iconfont biz-icon-i-web-m" v-if="userPortrait.gender === '0'"></i>
              <i class="female iconfont biz-icon-i-web-f" v-if="userPortrait.gender === '1'"></i>
              <i class="none iconfont biz-icon-i-web-bm" v-if="userPortrait.gender === '2'"></i>
            </div>
          </div>
        </div>
        <div class="info-con">
          <div class="base-info" :title="userPortrait.name">用户姓名：{{userPortrait.name}}</div>
          <div class="base-info">会员卡级别：{{userPortrait.cardInfo}}</div>
          <div class="base-info">
            会员标签：
            <span v-for="(item, index) in userPortrait.shopTags" :key="index">
              {{item.name}}
              <i v-if="index < userPortrait.shopTags.length - 1">{{separator}}</i>
            </span>
          </div>
          <div class="base-info" :title="userPortrait.address">联系地址：{{userPortrait.address}}</div>
          <div class="base-info">联系方式：{{userPortrait.mobile}}</div>
          <div class="base-info" :title="userPortrait.carInfo">车辆信息：{{userPortrait.carInfo}}</div>
          <div class="dec-info">{{userPortrait.summarize}}</div>
        </div>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>消费价值分布</span>
        </div>
        <biz-chart :chartData="radarChartData" :showSearch="false" :chartHeight="chartHeight" style="padding-bottom:40px;"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>消费次数趋势/月</span>
        </div>
        <biz-chart :chartData="timesGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>消费金额趋势/月</span>
        </div>
        <biz-chart :chartData="amountGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <div class="graph-container">
      <div class="left-graph">
        <div class="header">
          <span>文章类型偏好</span>
          <span class="font">阅读量：{{readTotalCount}}</span>
        </div>
        <biz-chart :chartData="articlePreferenceGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="between-graph">
        <div class="header">
          <span>商品类型偏好</span>
          <span class="font">购买商品数：{{buyTotalCount}}</span>
        </div>
        <biz-chart :chartData="productPreferenceGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
      <div class="right-graph">
        <div class="header">
          <span>用户登录时区偏好</span>
          <span class="font">总登录次数：{{loginTotalCount}}</span>
        </div>
        <biz-chart :chartData="loginGraphData" :showSearch="false" :chartHeight="chartHeight"></biz-chart>
      </div>
    </div>
    <biz-dialog-selector
      title="选择会员"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange"
      class="notice-dialog-selector"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      @cascaderChange="cascaderChange"
    >
      <el-table-column prop="name" label="会员信息" width="200">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="@/assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="enableState" label="状态" :formatter="getStatus"></el-table-column>
      <el-table-column prop="shop.name" label="所属店铺">
        <template slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shopTags" label="会员标签" width="210">
        <template slot-scope="scope">
          <div>
            <div v-for="(item, index) in scope.row.shopTags" :key="index">{{item.name}}</div>
          </div>
          <!-- <span class="show-more" v-if="scope.row.shopTags&&scope.row.shopTags.length===3">更多</span> -->
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';
import BizFilter from '@/components/BizTable/BizFilter.vue';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import BizChart from '@/components/BizChart';
import BizDialogSelector from '@/components/BizDialogSelector';
import ActivityNotificationService from '@/service/motorists-club-activity/ActivityNotification';

// 组合tag，两个纯函数
const getOption = function(ary) {
  let options = [];
  for (const iterator of ary) {
    let obj = {
      value: { name: iterator.name, id: iterator.id },
      label: iterator.name
    };
    if (iterator.children.length > 0) {
      obj.children = getOption(iterator.children);
    }
    if (iterator.tags && iterator.tags.length > 0) {
      if (!obj.hasOwnProperty('children')) {
        obj.children = [];
      }
      obj.children = obj.children.concat([{ label: '全部', value: '' }]);
      let tags = getTags(iterator.tags);
      for (const tag of tags) {
        obj.children.push(tag);
      }
    }
    if (iterator.children.length === 0 && !iterator.tags) {
      obj.disabled = true;
    }
    options.push(obj);
  }
  return options;
};
const getTags = function(array) {
  let tags = [];
  for (const iterator of array) {
    tags.push({
      label: iterator.name,
      value: { name: iterator.name, id: iterator.id }
    });
  }
  return tags;
};

export default {
  name: 'MemberProtraitAnalysis',
  data() {
    return {
      date: '',
      chartHeight: '100%',
      DefaultAvatar: DefaultAvatar,
      userPortrait: [],
      showDialog: false,
      timesGraphData: {},
      amountGraphData: {},
      articlePreferenceGraphData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      },
      radarChartData: {},
      productPreferenceGraphData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      },
      loginGraphData: {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: ['20%', '60%'],
          offsetY: '50%'
        }
      },
      filters: [
        {
          type: 'input',
          value: '',
          name: 'search',
          placeholder: '请输入手机号码'
        }
      ],
      dialogLoading: true,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'cascader',
          label: '会员标签',
          name: 'memberTag',
          changeOnSelect: false,
          filterable: false,
          value: [''],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      memberMobileData: [],
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      curTagName: '',
      memberId: '',
      readTotalCount: 0,
      buyTotalCount: 0,
      loginTotalCount: 0,
      separator: '、'
    };
  },
  props: {},
  watch: {
    showDialog(showDialog) {
      this.getTagClassList();
      if (!showDialog) {
        this.dialogFilters[1].value = '';
      }
    }
  },
  components: {
    BizFilter,
    BizChart,
    BizDialogSelector
  },
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    refresh(id) {
      this.memberId = id;
      this.getMemberInfo(id);
      this.getTimesGraphData(id);
      this.getAmountGraphData(id);
      this.getLoginGraphData(id);
      this.getArticlePreferenceGraphData(id);
      this.getProductPreferenceGraphData(id);
      this.getRadarGraphData(id);
    },
    queryMembers() {
      this.dialogLoading = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[1].value,
        tag: this.curTagName
      };
      ActivityNotificationService.queryPeople(
        params,
        data => {
          console.log(data);
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
          this.dialogLoading = false;
        },
        ErrorData => {
          this.dialogLoading = false;
          console.log(ErrorData);
        }
      );
    },
    getTagClassList() {
      let param = {
        categoryType: '会员标签',
        shopId: window.top.SHOP_ID || '',
        isIncludeTag: '1'
      };

      http
        .get(urls.systemSetting.storeTagcategories, param)
        .then(data => {
          let ary = data.content;
          let options = [
            {
              label: '全部',
              value: ''
            }
          ];
          options = options.concat(getOption(ary));
          this.dialogFilters[0].options = options;
          this.dialogFilters[0].value = [''];
        })
        .catch(error => {
          if (error.errorMessage !== '店铺不存在') {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    getMemberInfo(id) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id
      };
      http
        .get(urls.membersMgmt.statisticsAnalysis.memberInfo, param)
        .then(data => {
          this.userPortrait = data.member;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    searchByMobile() {
      console.log(1111);
      let param = {
        searchValue: this.filters[0].value,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/member/members.jhtml', param)
        .then(data => {
          this.userPortrait = data.content.length > 0 ? data.content[0] : {};
          this.refresh(this.userPortrait.id);
        })
        .catch(error => {
          if (error.errorInfo) {
            this.$message.warning(error.errorInfo);
          }
        });
    },
    getArticlePreferenceGraphData(id) {
      this.readTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post(urls.membersMgmt.statisticsAnalysis.articlePreferenceGraphData, param)
        .then(data => {
          for (const item of data.indicators) {
            this.readTotalCount += Number(item.value);
          }
          this.articlePreferenceGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getProductPreferenceGraphData(id) {
      this.buyTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      http
        .post(urls.membersMgmt.statisticsAnalysis.productPreferenceGraphData, param)
        .then(data => {
          for (const item of data.indicators) {
            this.buyTotalCount += Number(item.value);
          }
          this.productPreferenceGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getLoginGraphData(id) {
      this.loginTotalCount = 0;
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id
      };
      http
        .get('/admin/ecommerce/kpi/graph/member/loginTimePreference.jhtml', param)
        .then(data => {
          for (const item of data.indicators) {
            this.loginTotalCount += Number(item.value);
          }
          this.loginGraphData.data.rows = data.indicators.map(item => {
            return { type: item.lable, value: item.value };
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getRadarGraphData(id) {
      let param = {
        userId: id || this.$route.query.userId || this.getUser().id
      };
      http
        .post(urls.membersMgmt.statisticsAnalysis.consumePreferenceAndLoyalty, param)
        .then(data => {
          this.radarChartData = this.radarFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    radarFormat(data) {
      let tmpData = [];
      tmpData.push({
        会员消费偏好分布和忠诚度属性: '会员消费偏好分布和忠诚度属性',
        消费能力: data.indicators[0].value,
        消费品质: data.indicators[1].value,
        消费状况: data.indicators[2].value,
        价格敏感度: data.indicators[3].value
      });
      let radarChartData = {
        type: 'radar',
        data: {
          columns: ['会员消费偏好分布和忠诚度属性', '消费能力', '消费品质', '消费状况', '价格敏感度'],
          rows: tmpData
        },
        settings: {}
      };
      return radarChartData;
    },
    getTimesGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id
      };
      http
        .get('/admin/ecommerce/kpi/graph/member/orderConsumeTimes.jhtml', param)
        .then(data => {
          this.timesGraphData = this.dataTimesFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataTimesFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          次数: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['日期', '次数'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    getAmountGraphData(id) {
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: id || this.$route.query.userId || this.getUser().id
      };
      http
        .get('/admin/ecommerce/kpi/graph/member/orderConsumeAmount.jhtml', param)
        .then(data => {
          this.amountGraphData = this.dataAmountFormat(data);
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    dataAmountFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          金额: data.indicators[i].yValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'histogram',
        data: {
          columns: ['日期', '金额'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    memberSelected() {
      this.showDialog = true;
      this.curTagName = '';
      this.queryMembers();
    },
    cascaderChange(val) {
      this.curTagName = val[val.length - 1].id;
      if (val.length > 1 && !this.curTagName) {
        let tagCategoryId = val[val.length - 2].id;
        http
          .get('/admin/tag/storeTags.jhtml', { tagCategoryId: tagCategoryId })
          .then(data => {
            let temp = [];
            data.content.map(item => {
              temp.push(item.id);
            });
            this.curTagName = temp.join(',');
            this.queryMembers();
          })
          .catch(error => {
            if (error.errorMessage !== '店铺不存在') {
              this.$message.warning(error.errorMessage);
            }
          })
          .finally(() => {});
      } else {
        this.queryMembers();
      }
    },
    filterDataChange(val) {
      this.filters = val;
      this.searchByMobile();
    },
    handleConfirmed(selectionKeys, selections) {
      this.showDialog = false;
      this.refresh(selections[0].id);
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.queryMembers();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryMembers();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryMembers();
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }
      return '';
    }
  },
  created() {},
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.member-portrait-analysis {
  width: 100%;
  height: 100%;
  overflow: auto;
  color: #606266;
  font-size: 14px;
  overflow-x: hidden;
  .header {
    background-color: #f7f7f7;
    height: 40px;
    font-weight: 700;
    justify-content: flex-start;
    display: flex;
    span:first-child {
      padding: 10px;
      display: block;
      font-weight: bold;
      float: left;
    }
    .time-portrait {
      float: right;
    }
  }
  .filter-portrait {
    float: right;
    margin-bottom: 10px;
    display: flex;
  }
  .operator {
    padding: 10px;
  }
  .member-info {
    margin: 10px;
    width: 98%;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    clear: both;
    .container {
      width: 98%;
      height: 140px;
      display: flex;
      padding: 10px;
      .header-img {
        width: 80px;
        height: 80px;
        margin-right: 50px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        .wrapper {
          margin-left: 56px;
          position: relative;
          .gender {
            .iconfont {
              position: absolute;
              left: 8px;
              bottom: -2px;
              font-size: 24px;
            }

            .male {
              color: #2069cb;
            }
            .female {
              color: #f935d1;
            }
            .none {
              color: #ff7300;
            }
          }
        }
      }
      .info-con {
        width: 100%;
        .base-info {
          width: 33%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 30px;
          float: left;
          text-align: left;
          line-height: 30px;
        }
        .dec-info {
          float: left;
          width: 100%;
          line-height: 30px;
          -webkit-text-fill-color: darkgray;
        }
      }
    }
  }
  .graph-container {
    width: 100%;
    display: flex;
    .left-graph {
      width: 34%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 5px 10px 5px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 85%!important
        }
      }
    }
    .between-graph {
      width: 33%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 85%!important
        }
      }
    }
    .right-graph {
      width: 33%;
      height: 22vw;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin: 20px 10px 10px 10px;
      .font {
        color: #666666;
        font-weight: normal;
        padding: 10px;
      }
      .biz-chart {
        min-width: 33% !important;
        .chart-area {
          margin-top: 0px !important;
          height: 85%!important
        }
      }
    }
  }
}
.notice-dialog-selector {
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
  .platform-tags {
    display: block;
    float: left;
  }
  .show-more {
    color: coral;
  }
}
</style>
