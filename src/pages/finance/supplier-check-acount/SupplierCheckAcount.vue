<template>
  <biz-grid class="supplier-check-acount" v-loading="loading">
    <div slot="top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
      <div class="toggle-btn" @click="isShow">
        {{ toggleRecommendTxt }}
        <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
      </div>
      <div style="font-size: 14px;margin-bottom: 10px;">
        单据金额总和：
        <template>￥{{totalAmount}}</template>
      </div>
    </div>
    <biz-list ref="table" :tableData="tableData" @selection-change="handleSelectionChange" size="small" height="100%">
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column label="订单" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sn}}
            </div>
            <div>
              状态：<span :style="{color: stateColor(scope.row)}">{{scope.row.stateName}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%;color:#ff7300" @click.stop="supplierClick(scope.row)">
            <div class="overflow">
              {{scope.row.supplier?scope.row.supplier.name:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付" min-width="100">
        <template slot-scope="scope">
          <div>
            <div>
              支付方式：{{scope.row.paymentMethodName?scope.row.paymentMethodName:'--'}}
            </div>
            <div>
              付款方式：{{scope.row.paymentTypeName?scope.row.paymentTypeName:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">￥{{scope.row.amount?scope.row.amount:'--'}}</template>
      </el-table-column>
      <el-table-column label="商品" min-width="220px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.orderItems.length>0?[scope.row.orderItems[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div>{{orderItem.product?orderItem.product.barCode:''}}</div>
                    <div>单价(含税)：{{orderItem.price}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <biz-popup-tabs :open="openSupplier" v-model="tabSelection" @close="openSupplier=false">
      <el-tab-pane label="基本信息" name="0">
        <supplier-base-info
          :itemId="supplierId"
          :isEdit="isEdit"
        ></supplier-base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination, BizList } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import SupplierBaseInfo from '@/pages/invoicing/base-data/supplier/SupplierBaseInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import axios from 'axios';
import { BizPopupTabs } from '@/components/BizPopup';
import { ExportFileNew } from '@/components/BizUpload';

export default {
  name: 'SupplierCheckAcount',
  data() {
    return {
      isEdit: true,
      loading: false,
      selections: [],
      showRecommend: false,
      tabSelection: '0',
      openSupplier: false,
      supplierId: { id: '' },
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '导出',
          name: 'exportStart',
          type: '',
          auth: ['admin:finance.reconciliation.export']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '供应商',
          name: 'supplier',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          label: '订单状态',
          type: 'select',
          value: '',
          name: 'state',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '1', label: '待商家确认' },
            { value: '2', label: '商家已确认' },
            { value: '3', label: '买家已付款' },
            { value: '4', label: '订单已执行' },
            { value: '5', label: '交易完成' },
            { value: '6', label: '订单关闭' },
            { value: '7', label: '已评价' },
            { value: '9', label: '退款退货中' }
          ]
        },
        {
          label: '支付方式',
          type: 'select',
          value: '',
          name: '',
          class: 'hidden',
          options: []
        },
        {
          label: '付款方式',
          type: 'select',
          value: '',
          name: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'daterange',
          label: '',
          name: 'publishDate',
          value: []
        }
      ],
      tableData: [],
      totalAmount: '',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      itemId: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizGrid,
    BizHeader,
    BizList,
    BizPagination,
    SupplierBaseInfo,
    BizPopupTabs,
    ExportFileNew
  },
  created() {
    this.queryFilters();
    this.getPaymentMethods();
    this.getPaymentType();
    this.refresh();
  },
  watch: {},
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    supplierClick(row) {
      this.supplierId = { id: row.supplier.id };
      this.isEdit = false;
      this.openSupplier = true;
    },
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
    refresh() {
      this.getList();
    },
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        supplierId: this.filters[0].value,
        orderStatus: this.filters[1].value,
        paymentMethod: this.filters[2].value,
        paymentType: this.filters[3].value,
        beginDate: this.filters[4].value[0] ? this.filters[4].value[0] + ' ' + '00:00:00' : '',
        endDate: this.filters[4].value[1] ? this.filters[4].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/purchaseOrderManage/supplierBill/exportStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/purchaseOrderManage/supplierBill/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        supplierId: this.filters[0].value,
        orderStatus: this.filters[1].value,
        paymentMethod: this.filters[2].value,
        paymentType: this.filters[3].value,
        beginDate: this.filters[4].value[0] ? this.filters[4].value[0] + ' ' + '00:00:00' : '',
        endDate: this.filters[4].value[1] ? this.filters[4].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .get(urls.finance.supplierCheckAcount.list, params)
        .then(data => {
          this.tableData = data.content;
          this.totalAmount = data.totalAmount;
          this.pagination.total = Number(data.total);
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
    queryFilters() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        state: '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
          // this.filters[0].value = this.filters[0].options[0].value;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    getPaymentMethods() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.finance.receiptMgmt.getPaymentMethods, params)
        .then(data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.paymentMethods.map(item => {
              return { label: item.name, value: item.name };
            })
          );
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {});
    },
    stateColor(row) {
      if (row.stateName === '交易完成' || row.stateName === '已评价') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getPaymentType() {
      let params = {};
      http
        .get('/admin/payment_method/paymentTypes.jhtml', params)
        .then(data => {
          this.filters[3].options = [{ label: '全部', value: '' }].concat(
            data.paymentTypeList.map(item => {
              return { label: item.label, value: item.label };
            })
          );
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {});
    },
    handleSelectionChange(val) {
      this.selections = val;
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
    },
    getOrderStatus(row) {
      switch (row.type) {
        case '11':
          return '卖家已发货';
        case '10':
          return '退款退货完成';
        case '9':
          return '退款退货中';
        case '8':
          return '已过期';
        case '7':
          return '已评价';
        case '6':
          return '订单关闭';
        case '5':
          return '交易完成';
        case '4':
          return '订单已执行';
        case '3':
          return '买家已付款';
        case '2':
          return '商家已确认';
        case '1':
          return '待商家确认';
        default:
          return '无';
      }
    }
  }
};
</script>

<style lang="scss">
// .supplier-check-acount {
//   .biz-input {
//     width: 220px;
//   }
//   .biz-table-filter .filter-wrap .biz-select .el-select {
//     width: auto !important;
//   }
// }
.supplier-check-acount {
  .biz-popup .popup-content {
    width: 600px;
  }
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .product-info-content {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    img {
      float: left;
      width: 48px;
      height: 48px;
    }
    .wrapper {
      width: 160px;
      padding: 0px 20px;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
      }
    }
    .amount {
      width: 25px;
    }
  }
  .tel-style {
    color: #ff7300;
    cursor: pointer;
  }
  .product-info {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    img {
      float: left;
      width: 48px;
      height: 48px;
    }
    .wrapper {
      margin-left: 56px;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
  .info-bottom {
    display: flex;
    justify-content: space-between;
  }
  .biz-date-range {
    position: absolute;
    top: 15px;
    right: 105px;
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
  .biz-header .biz-header__filter-wrapper {
    justify-content: flex-start;
  }
}
</style>
