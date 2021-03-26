<!-- 服务订购 -->
<template>
  <biz-grid class="service-subscribe">
    <biz-header slot="top" :filters="filters" :operations="operations" @operate="handleOperate"  @on-switch="onSwitch" @cascader-change="handleCascaderChange"
      @filter-data-change="filterDataChange">
    </biz-header>
    <table-view :data="tableData" v-show="views[1].actived" @row-click="handleClick" ref="tableView">
      <el-table-column label="服务名称" prop="name">
        <span slot-scope="scope">
          {{ scope.row.businessService.name }}
        </span>
      </el-table-column>
      <el-table-column label="服务简介" prop="description">
        <span slot-scope="scope">
          <div v-html="scope.row.businessService.description"></div>
        </span>
      </el-table-column>
      <el-table-column label="服务价格" prop="price">
        <span slot-scope="scope">
          ￥ {{ scope.row.price }}
        </span>
      </el-table-column>
      <el-table-column label="服务状态" prop="subscribeState">
        <span slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.businessService.subscribeState | formatState }}</span>
        </span>
      </el-table-column>
      <el-table-column label="有效期" prop="endDate">
        <span slot-scope="scope">
          {{ scope.row.businessService.endDate || '--'}}
        </span>
      </el-table-column>
    </table-view>
    <card-view :dataFn="tableDataFn" :data="tableData" @click="handleClick" ref="cardView"></card-view>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
    <biz-popup-tabs slot="float" :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <order-base-info v-if="businessServiceType==='platform'" :isFn="isFn" :itemId="itemId" @refresh="refresh" @subscribe-service="subscribeService" @closePoup="close" @confirmOrderInfo="confirmOrderInfo"></order-base-info>
        <sms-base-info v-if="businessServiceType==='sms'" :itemId="itemId" @refresh="refresh" @subscribe-service="subscribeService" @closePoup="close" @confirmOrderInfo="confirmOrderInfo"></sms-base-info>
      </el-tab-pane>
      <el-tab-pane label="购买记录" name="second">
        <order-history-list :itemId="itemId" :isFn="isFn"></order-history-list>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs slot="float" :open="openList" @close="openList=false" v-model="tabName">
      <el-tab-pane label="订阅清单" name="first">
      <cart ref="cart" @confirmOrderInfo="confirmOrderInfo"></cart>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs slot="float" :open="openInfo" @close="openInfo=false" v-model="tabName">
      <el-tab-pane label="提交订阅" name="first">
        <confirm-order-info :data="data" ref="confirm"></confirm-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

import TableView from './TableView';
import CardView from './CardView';

import OrderBaseInfo from './OrderBaseInfo';
import SmsBaseInfo from './SmsBaseInfo';
import ConfirmOrderInfo from './ConfirmOrderInfo';
import OrderHistoryList from './OrderHistoryList';
import Cart from './Cart';
export default {
  name: 'ServiceSubscribe',
  filters: {
    formatState(value) {
      const stateList = ['未订购', '已订购'];
      return stateList[value];
    }
  },
  data() {
    return {
      tabName: 'first',
      open: false,
      isFn: false,
      openList: false,
      openInfo: false,
      selectedClassName: '',
      businessServiceType: 'platform',
      itemId: { id: '' },
      data: [],
      selections: [],
      list: [],
      tableDataFn: [],
      operations: [
        {
          label: '购物车',
          name: 'myList',
          type: 'primary'
        }
      ],
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
      filters: [
        {
          type: 'cascader',
          changeOnSelect: true,
          label: '分类',
          value: [''],
          options: []
        },
        {
          type: 'select',
          label: '状态',
          value: '',
          options: [{ value: '', label: '全部' }, { value: '0', label: '未订购' }, { value: '1', label: '已订购' }]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入服务名称',
          name: 'searchValue',
          value: ''
        }
        // {
        //   type: 'checkBox',
        //   label: '状态',
        //   checkAll: false,
        //   showMore: false,
        //   isIndeterminate: true,
        //   value: [],
        //   options: [{ value: '0', label: '未订购' }, { value: '1', label: '已订购' }]
        // }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: []
    };
  },
  components: {
    BizGrid,
    BizHeader,
    BizPagination,
    BizPopupTabs,
    TableView,
    CardView,
    OrderBaseInfo,
    SmsBaseInfo,
    OrderHistoryList,
    Cart,
    ConfirmOrderInfo
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {},
  created() {
    this.getClassifyList();
  },
  mounted() {
    if (this.$route.query.id) {
      this.itemId = { id: this.$route.query.id };
      this.open = true;
    }
    // 短信充值跳转
    if (this.$route.query.businessServiceClassify) {
      let params = {
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || '',
        businessServiceClassify: this.$route.query.businessServiceClassify,
        subscribeState: this.filters[1].value,
        businessServiceName: this.filters[2].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/businessOrder/listService/v201901.jhtml', params)
        .then(data => {
          this.tableData = data.businessProducts;
          if (data.businessProducts.length > 0 && data.businessProducts[0].businessServiceClassifyPathId.indexOf('/') !== -1) {
            this.filters[0].value = [
              data.businessProducts[0].businessServiceClassifyPathId.split('/')[0],
              data.businessProducts[0].businessServiceClassifyPathId.split('/')[1]
            ];
            this.getClassifyList(data.businessProducts[0].businessServiceClassifyPathId.split('/')[0]);
          }
          this.pagination.total = data.total;
        })
        .catch(err => {
          console.log('ERR_REFRESH: ', err);
          this.$message.warning(err.errorMessage || '操作出现错误');
        });
    } else {
      this.refresh();
    }
  },
  methods: {
    handleOperate(name) {
      this[name]();
    },
    close() {
      this.open = false;
      this.tabName = 'first';
    },
    stateColor(row) {
      if (row.businessService.subscribeState === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    confirmOrderInfo(data) {
      this.data = data;
      this.open = false;
      this.openList = false;
      this.openInfo = true;
      this.tabName = 'first';
      this.$nextTick(() => {
        console.log(data);
        this.$refs.confirm.getShop();
      });
    },
    getList() {
      let params = {
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || '',
        userId: this.currentUser.id
      };
      http
        .get('/admin/subscribeList/subscribeLists.jhtml', params)
        .then(data => {
          this.list = data.dataList;
        })
        .catch(err => {
          console.log('ERR_REFRESH: ', err);
          this.$message.warning(err.errorMessage || '操作出现错误');
        });
    },
    handleItemClick() {

    },
    handleCount() {

    },
    handleRefresh() {

    },
    myList() {
      this.openList = true;
      this.$refs.cart.query();
    },
    subscribeService(id) {
      this.close();
      this.itemId = { id };
      this.$nextTick(() => {
        this.open = true;
      });
    },
    onSwitch(name) {
      this.views.forEach(view => {
        if (view.name === name) {
          view.actived = true;
        } else {
          view.actived = false;
        }
      });
    },
    async handleCascaderChange(val = ['']) {
      const parent = val[val.length - 1];
      this.getClassifyList(parent);
      this.filters[0].value = val;
      if (val.length === 1) {
        this.selectedClassName = this.filters[0].options.find(item => item.value === val[0]).label;
      } else if (val.length === 2) {
        this.selectedClassName = this.filters[0].options
          .find(item => item.value === val[0])
          .children.find(child => child.value === val[1]).label;
      }
      if (this.selectedClassName === '全部') {
        this.selectedClassName = '';
      }
      this.refresh();
    },
    handleCascaderItemChange(val) {
      const parent = val[val.length - 1];
      this.getClassifyList(parent);
    },
    filterDataChange(filters) {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.$refs.tableView.$el.scrollTop = 0;
      this.$refs.cardView.$refs.divContent.scrollTop = 0;
      this.refresh();
    },
    handleClick(item, isFn) {
      this.isFn = isFn;
      console.log(item.id);
      this.itemId = { id: item.id };
      this.businessServiceType = item.businessServiceType || 'platform';
      this.$nextTick(() => {
        this.open = true;
      });
    },
    getClassifyList(val) {
      let params = {
        parent: val
      };
      http
        .get(urls.servicesMgmt.serviceClassifyList, params)
        .then(data => {
          if (!data.businessServiceClassifyList.length) return;
          if (!val) {
            this.filters[0].options = [
              {
                label: '全部',
                value: ''
              }
            ].concat(
              data.businessServiceClassifyList.map(item => {
                return {
                  label: item.name,
                  value: item.id,
                  children: []
                };
              })
            );
          } else {
            this.filters[0].options.find(item => {
              return item.value === val;
            }).children = data.businessServiceClassifyList.map(item => {
              return {
                label: item.name,
                value: item.id
              };
            });
          }
        })
        .catch(err => {
          console.log('ERR_GET_CLASS: ', err);
        });
    },
    refresh() {
      let params = {
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || '',
        businessServiceClassify: this.selectedClassName,
        subscribeState: this.filters[1].value,
        businessServiceName: this.filters[2].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.servicesMgmt.getServiceOrders, params)
        .then(data => {
          this.tableData = data.businessProducts;
          this.pagination.total = data.total;
        })
        .catch(err => {
          console.log('ERR_REFRESH: ', err);
          this.$message.warning(err.errorMessage || '操作出现错误');
        });
      http
        .get('/admin/solution/subscribe/list.jhtml', { shopId: this.currentUser.shop.id || window.top.SHOP_ID || '' })
        .then(data => {
          this.tableDataFn = data.dataList;
          // this.pagination.total = data.total;
        })
        .catch(err => {
          console.log('ERR_REFRESH: ', err);
          this.$message.warning(err.errorMessage || '操作出现错误');
        });
    }
  }
};
</script>

<style lang="scss">
</style>
