<template>
  <biz-grid class="sales-info" v-loading="loading">
    <div slot="top">
      <biz-header
        @operate="operate"
        :filters="filters"
        @filterDataChange="filterDataChange"
      ></biz-header>
      <div style="font-size: 14px;margin-bottom: 10px;display:flex;">
        <div>
          <template>{{totalSum || total}}</template>单，
        </div>
        <div>
          成交额：
          <template>￥{{sumPurchaseFee || totalAmount}}</template>（含税）<template>￥{{totalAmountWithoutTax}}</template>（不含税）
        </div>
      </div>
    </div>
    <biz-list ref="table" :tableData="tableData" size="small" height="100%">
      <el-table-column label="订单" min-width="160px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.productSn || scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate || scope.row.orderTime}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="200px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">金额(不含税)：{{(scope.row.purchaseFee-scope.row.purchaseFeeTax)||scope.row.amountWithoutTax}}</div>
            <div class="overflow">税额(含税)：{{scope.row.purchaseFeeTax||scope.row.tax}}</div>
            <div class="overflow">金额(含税)：{{scope.row.purchaseFee||scope.row.amount}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品" min-width="290px" v-if="!isFrom">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                  <img v-if="scope.row.thumbnail&&orderItem.thumbnail!==' '" :src="scope.row.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div style="width:100%">
                    <div class="titleClass" :title="scope.row.specValue">{{scope.row.specValue?scope.row.specValue:'--'}}</div>
                    <div class="overflow">{{scope.row.barCode?scope.row.barCode:'--'}}</div>
                    <div class="overflow">单价(不含税)：{{scope.row.priceWithoutTax}}</div>
                    <div class="overflow">单价(含税)：{{scope.row.price}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品" min-width="290px" v-if="isFrom">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.orderItems.length>0?[scope.row.orderItems[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper" style="width:200px">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div>{{orderItem.product?orderItem.product.barCode:'-'}}</div>
                    <div class="overflow">单价(不含税)：{{orderItem.priceWithoutTax?orderItem.priceWithoutTax:'--'}}</div>
                    <div>单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination, BizList } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import date from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  name: 'PurchaseStatistics',
  data() {
    return {
      title: '',
      loading: false,
      totalSum: '0',
      isEdit: true,
      sumPurchaseFee: '',
      totalAmountWithoutTax: '',
      totalAmount: '',
      total: '',
      sumReturnFee: '',
      filters: [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: ['1', '2', '3', '4', '5', '7', '9', '11', '12', '13'],
          filterable: true,
          multiple: true,
          collapseTags: true,
          options: [
            { value: '1', label: '待商家确认' },
            { value: '2', label: '商家已确认' },
            { value: '3', label: '买家已付款' },
            { value: '4', label: '订单已执行' },
            { value: '5', label: '交易完成' },
            { value: '6', label: '订单关闭' },
            { value: '7', label: '已评价' },
            { value: '9', label: '退款退货中' },
            { value: '11', label: '已确认收货' },
            { value: '12', label: '部分支付' },
            { value: '13', label: '部分发货' }
          ]
        },
        {
          type: 'daterange',
          label: '',
          name: 'publishDate',
          value: [new Date().getFullYear() + '-01-01', date.nowDate()]
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
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
    isFrom: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {
    BizHeader,
    BizPagination,
    BizList,
    BizGrid
  },
  created() {
    this.getList();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.refresh();
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage
        },
        shopId: window.top.SHOP_ID || '',
        agentIds: [this.itemId.id],
        states: this.filters[0].value || '',
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        // .post(this.isFrom ? '/admin/purchaseOrderManage/storeSalesOrders.jhtml' : '/admin/invoicing/purchase/storeSalesReports.jhtml', params)
        .post('/admin/purchaseOrderManage/storeSalesOrders.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.sumPurchaseFee = data.sumPurchaseFee;
          this.totalAmountWithoutTax = data.totalAmountWithoutTax;
          this.totalAmount = data.totalAmount;
          this.total = Number(data.total);
          this.pagination.total = Number(data.total);
          this.totalSum = data.total;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.selections = val;
      console.log(this.selections);
    },
    filterDataChange(filters) {
      this.filters = filters;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.sales-info {
  .biz-input {
    width: 220px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: auto !important;
  }
  .biz-header .biz-header__filter-wrapper {
    float: right !important;
  }
  .biz-pagination .el-pagination {
    .el-pagination__sizes {
      display: initial !important;
    }
    .el-pagination__jump {
      display: initial !important;
    }
  }
}
.sales-info {
  .tel-style {
    color: #ff7300;
    cursor: pointer;
  }
  .operate-container {
    margin-left: 10px;
  }
  .row {
    padding: 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-date-editor {
    width: 210px;
  }
  .info-bottom {
    display: flex;
    justify-content: space-between;
  }
  .price-info {
    width: 120px;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
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
      .titleMember {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
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
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
}
</style>
