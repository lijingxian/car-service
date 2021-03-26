<template>
  <div class="store-value-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      :operations="operations"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :filters="filters"
      :checkable="false"
      @filter-data-change="filterDataChange"
      @operate="operate"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
    >
      <!-- 表格内容 -->
      <!-- <el-table-column v-for="(col,index) of columns" :key="col.id" :label="col.name" :min-width="getWidth(col)">
        <template slot-scope="scope">
          <div v-if="col.id === '1'">{{scope.row.sn}}</div>
          <div v-else-if="col.id === '2'">{{ scope.row.orderItems[0].name }}</div>
          <div v-else-if="col.id === '3'">
            实付金额: ￥{{ scope.row.amountPaid || '0.00' }}
            <br />
            (订单金额: ￥{{ scope.row.amount || '0.00' }})
          </div>
          <div v-else-if="col.id === '4'" class="customer-info">
            <img :src="scope.row.member.head ? scope.row.member.head : defaultHeader" alt />
            <div class="wrapper">
              <div class="title" @click="clickMember($event, scope.row)">{{scope.row.member.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                <span>{{scope.row.member.mobile}}</span>
              </div>
            </div>
          </div>
          <div v-else-if="col.id === '5'">{{scope.row.paymentMethodName}}</div>
          <div v-else-if="col.id === '6'">{{formatStatus(scope.row.type)}}</div>
        </template>
        <template #header>
          <div class="custom-header">
            <div>{{col.name}}</div>
            <i v-show="index===(columns.length - 1)" @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template>
      </el-table-column> -->
      <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column prop="shop.name" label="订单信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div class="overflow">
              创建日期：{{scope.row.orderTime}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{formatStatus(scope.row.type)}}</span>
            </div>
            <div class="overflow">
              所属店铺：{{scope.row.shop.name}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="客户信息" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%" class="customer-info" @click.stop="memberClick(scope.row)">
            <div class="overflow">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="titleMember" :title="scope.row.member.name">{{scope.row.member.name}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="充值金额" min-width="70">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ￥{{scope.row.amount}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="支付" min-width="70">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              支付方式：{{scope.row.paymentMethodName}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="会员基本信息" name="first" v-if="openMember">
        <member-base-info :itemId="memberId" @update="isUpdate = true"></member-base-info>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="first" v-if="!openMember">
        <base-info :itemId="currentRowId" @update="isUpdate = true"></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="second" v-if="!openMember">
        <product-info ref="second" :itemId="currentRowId" @update="isUpdate = true"></product-info>
      </el-tab-pane>
      <el-tab-pane label="订单进度" name="third" v-if="!openMember">
        <order-process :itemId="currentRowId.id" @update="isUpdate = true" ref="process" :paymentMethodName="paymentMethodName"></order-process>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import MemberBaseInfo from '../base-info/MembershipBaseInfo';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import OrderProcess from './OrderProcess';
import defaultHeader from '@/assets/images/default_user.png';
import { financeMgmt } from '@/common/urls';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import axios from 'axios';
import dateTime from '@/utils/dateTime';
export default {
  name: 'StoreValueMgmt',
  data() {
    return {
      tableId: '17',
      defaultHeader: defaultHeader,
      // 侧栏会员信息,订单信息
      openMember: false,
      memberId: { id: '' },
      // 排序
      orderProperty: '',
      orderDirection: '',
      invoiceState: '',
      price: '',
      paymentMethodName: '',
      curSelectDateType: '全部',
      dateTypeList: ['全部', '今日订单', '近一周订单', '近一月订单', '近三月订单'],
      // 导出
      exportFile: false,
      currentRowId: { id: '' },
      operations: [
        // { label: '新增', name: 'add', type: 'primary' },
        // { label: '删除', name: 'del', type: 'primary' },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '导出', name: 'export', type: '' }
      ],
      filters: [
        {
          label: '状态',
          type: 'select',
          class: 'hidden',
          value: '0',
          placeholder: '请选择状态',
          options: [
            { value: '0', label: '全部' },
            // { value: '1', label: '待商家确认' },
            { value: '2', label: '商家已确认' },
            { value: '3', label: '买家已付款' },
            // { value: '4', label: '订单已执行' },
            { value: '5', label: '交易完成' },
            { value: '6', label: '交易关闭' },
            { value: '7', label: '已评价' },
            { value: '8', label: '订单过期' }
            // { value: '9', label: '退款退货中' }
            // { value: '10', label: '退款退货完成' }
          ]
        },
        {
          label: '支付方式',
          type: 'select',
          value: '',
          class: 'hidden',
          placeholder: '请选择支付方式',
          options: [
            { value: '', label: '全部' },
            { value: 'online', label: '在线支付' },
            { value: 'atShop', label: '到店支付' }
            // { value: 'afterReceipt', label: '货到付款' }
          ]
        },
        {
          label: '日期范围',
          type: 'daterange',
          class: 'hidden',
          value: []
        },
        {
          type: 'input',
          value: '',
          placeholder: '请输入订单编号/会员'
        }
      ],
      loading: false,
      showRecommend: false,
      tableData: [],
      multiSelected: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      // 侧栏
      open: false,
      // 侧栏更新后刷新
      isUpdate: false,
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    MemberBaseInfo,
    BaseInfo,
    ProductInfo,
    OrderProcess
  },
  mixins: [ColumnsMixin],
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  methods: {
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    onChangeDateType(val) {
      switch (val) {
        case '今日订单':
          this.filters[2].value = [dateTime.today(), dateTime.today()];
          break;
        case '近一周订单':
          this.filters[2].value = [dateTime.getBeforeWeek(), dateTime.today()];
          break;
        case '近一月订单':
          this.filters[2].value = [dateTime.getPreOneMonthDay(), dateTime.today()];
          break;
        case '近三月订单':
          this.filters[2].value = [dateTime.getPreThreeMonthDay(), dateTime.today()];
          break;
        default:
          this.filters[2].value = [];
          break;
      }
      this.refresh();
    },
    getWidth(col) {
      switch (col.id) {
        case '1':
          return '150';
        case '2':
          return '100';
        case '4':
          return '200';
        case '5':
          return '130';
        case '6':
          return '130';

        default:
          return '';
      }
    },
    operate(name) {
      this[name]();
    },
    // 添加
    add() {
      this.currentRowId = { id: '' };
      this.open = true;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        this.loading = true;
        http
          .post(financeMgmt.store.delete, params)
          .then(data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    // 导出
    async export() {
      let params = {
        state: this.filters[0].value,
        orderType: 'deposit',
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' 00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[3].value,
        ids: this.multiSelected
      };
      try {
        let response = await axios.post('/admin/order/export.jhtml', params, {
          responseType: 'blob'
        });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    close() {
      this.open = false;
      this.openMember = false;
    },
    clickMember(e, row) {
      this.openMember = true;
      this.memberId = { id: row.member.id };
      this.open = true;
    },
    getInvoiceStatus(row) {
      switch (row.invoiceState) {
        case '3':
          return '已签收';
        case '2':
          return '已邮寄';
        case '1':
          return '待邮寄';
        case '0':
          return '待开票';
        default:
          return '未申请';
      }
    },
    filterDataChange(value) {
      this.filters = value;
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
      this.paymentMethodName = row.paymentMethodName;
      this.tabName = 'first';
      this.invoiceState = row.invoiceState;
      this.price = row.price;
      this.open = true;
      this.$refs.process.refresh();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    refresh() {
      this.loading = true;
      let params = {
        orderType: 'deposit',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        state: this.filters[0].value,
        paymentMethod: this.filters[1].value,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' 00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[3].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      http
        .get(financeMgmt.store.queryList, params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    stateColor(row) {
      if (row.state === '5' || row.state === '7') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态
    formatStatus(state) {
      let stateList = {
        0: '全部',
        1: '待商家确认',
        2: '商家已确认',
        3: '买家已付款',
        4: '订单已执行',
        5: '交易完成',
        6: '交易关闭',
        7: '已评价',
        8: '订单过期',
        9: '退款退货中',
        10: '退款退货完成'
      };
      return stateList[state];
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    },
    // 页面提示语
    queryInfo() {
      let params = {
        type: 'deposit'
      };
      http
        .get(financeMgmt.store.queryInfo, params)
        .then(data => {
          this.showMessage(
            `今日新增储值${data.data.dayDepositCount}条,共储值${data.data.dayDepositAmount}元,本月累计储值${data.data.monthDepositCount}条,共储值${data.data.monthDepositAmount}元`,
            'info'
          );
        })
        .catch();
    }
  },
  mounted() {
    this.queryInfo();
    this.refresh();
  },
  watch: {
    open(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.refresh();
        this.isUpdate = false;
      }
    },
    tabName(newVal, oldVal) {
      if (newVal === 'second') {
        this.$refs.second.updateHeight();
      }
    }
  }
};
</script>

<style lang="scss">
.store-value-mgmt {
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 18px;
    }
  }
  .biz-table-filter {
    .filter-wrap {
      .biz-select .el-select.el-select--small {
        width: 160px;
      }
    }
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
   .biz-header__filter-wrapper {
    width: 100%;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-left: 0px;
    margin: 5px 0px;
    .filter-label {
      width: 60px;
      text-align: right;
    }
    .el-select {
      width: 100%;
    }
    .biz-date-range {
      width: 200px;
    }
  }
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
}
</style>
