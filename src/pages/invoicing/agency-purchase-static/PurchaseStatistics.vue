<template>
  <biz-grid class="purchase-statistics-agency" v-loading="loading">
    <div slot="top">
      <biz-header
        :operations="operations"
        @operate="operate"
        :filters="filters"
        @filterDataChange="filterDataChange"
        @active-item-change="activeItemChange"
        @cascader-change="cascaderChange"
      ></biz-header>
      <div style="font-size: 14px;margin-bottom: 10px;display:flex;">
        <div>
          采购金额（含税）：
          <template>￥{{sumPurchaseFee}}</template>
        </div>
        <div style="margin-left:15px;">
          退货金额（含税）：
          <template>￥{{sumReturnFee}}</template>
        </div>
      </div>
    </div>
    <biz-list ref="table" :tableData="tableData" @handleSelectionChange="handleSelectionChange" @rowClick="rowClick" size="small" height="100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="商品" min-width="260px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                  <img v-if="scope.row.thumbnail&&orderItem.thumbnail!==' '" :src="scope.row.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div style="width:100%">
                    <div class="titleClass" :title="scope.row.specValue">{{scope.row.specValue}}</div>
                    <div class="overflow">{{scope.row.barCode}}</div>
                    <div class="overflow">单价(不含税)：{{scope.row.priceWithoutTax}}</div>
                    <div class="overflow">单价(含税)：{{scope.row.price}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.purchaseAmount}}</div>
            <div class="overflow">金额(不含税)：{{scope.row.purchaseFee-scope.row.purchaseFeeTax}}</div>
            <div class="overflow">税额(含税)：{{scope.row.purchaseFeeTax?scope.row.purchaseFeeTax:'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.purchaseFee?scope.row.purchaseFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购退货" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.returnAmount}}</div>
            <div class="overflow">金额(不含税)：{{scope.row.returnFee-scope.row.returnFeeTax}}</div>
            <div class="overflow">税额(含税)：{{scope.row.returnFeeTax?scope.row.returnFeeTax:'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.returnFee?scope.row.returnFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
        <el-tab-pane label="基本信息" name="info">
          <base-info :itemId="itemId" @openOrderTab="openOrderTab" :beginTime="filters[2].value[0] ? this.filters[1].value[0] + ' ' + '00:00:00' : ''"
          :endTime="filters[2].value[1] ? filters[1].value[1] + ' ' + '23:59:59' : ''" ref="baseinfo"></base-info>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openRelateBill" @close="openRelateBill=false" v-model="relateBillSn">
      <el-tab-pane label="基本信息" name="baseinfo">
        <purchase-order-info :orderId="relateBillId" ref="orderinfo" :isEdit="isEdit"></purchase-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    </div>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination, BizList } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import PurchaseOrderInfo from '@/pages/invoicing/agency-purchase-order/OrderInfo';
import axios from 'axios';
import BaseInfo from './BaseInfo';
import { ExportFileNew } from '@/components/BizUpload';

export default {
  name: 'PurchaseStatistics',
  data() {
    return {
      title: '',
      itemId: '',
      loading: false,
      visiable: false,
      open: false,
      relateBillSn: 'baseinfo',
      openRelateBill: false,
      relateBillId: '',
      isEdit: true,
      tabName: 'info',
      selections: [],
      categoryDatas: [],
      sumPurchaseFee: '',
      sumReturnFee: '',
      productCategoryId: '',
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '供应商',
          name: 'supplier',
          value: '',
          options: []
        },
        {
          type: 'cascader',
          label: '商品分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'daterange',
          label: '创建日期',
          name: 'publishDate',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
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
  components: {
    BizHeader,
    BizPagination,
    BizList,
    BizGrid,
    BaseInfo,
    BizPopupTabs,
    PurchaseOrderInfo,
    ExportFileNew
  },
  created() {
    this.getList();
    this.querySupplierList();
    this.queryCategoryList();
  },
  watch: {},
  computed: {},
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
    refresh() {
      this.getList();
    },
    openOrderTab(row) {
      this.relateBillId = row.orderId;
      this.openRelateBill = true;
      this.open = false;
      this.$nextTick(() => {
        this.$refs.orderinfo.getOrderInfo();
      });
      this.isEdit = false;
    },
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get('/admin/toB/product/productCategories.jhtml', params)
        .then(data => {
          this.categoryDatas = data.productCategorys;
          this.setCategoryFilters();
        })
        .catch(() => {});
    },
    setCategoryFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
        // if (category.parentId === '') {
        //   options.push({ value: category.id, label: category.name });
        // }
      });

      this.filters[1].options = options;
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.refresh();
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser().shop.id,
        parentId: val.toString()
      };
      http
        .get('/admin/toB/product/productCategories.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.filters[1].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.childrenProductCategoryDataList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.productId);
        });
      }
      let params = {
        ids: ids,
        pageSize: this.pagination.pageSize,
        supplierId: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[3].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/purchase/agentPurchaseReports/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/purchase/agentPurchaseReports/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        supplierId: this.filters[0].value,
        searchValue: this.filters[3].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .get('/admin/invoicing/purchase/agentPurchaseReports.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.sumPurchaseFee = data.sumPurchaseFee;
          this.sumReturnFee = data.sumReturnFee;
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
    querySupplierList() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        state: ''
      };
      http
        .get('/admin/cooperationInfo/agent/supplierStores.jhtml', params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.shop.name, value: item.shop.id };
            })
          );
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
    queryCategoryList() {
      let params = {
        shopId: this.getUser().shop.id
      };
      http
        .get('/admin/toB/product/productCategories.jhtml', params)
        .then(data => {
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.productCategorys.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
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
    rowClick(row, event, column) {
      this.itemId = row.productId;
      this.tabName = 'info';
      this.open = true;
      this.$nextTick(() => {
        this.$refs.baseinfo.getList();
      });
    }
  }
};
</script>

<style lang="scss">
.purchase-statistics-agency {
  .biz-input {
    width: 220px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: auto !important;
  }
}
.purchase-statistics-agency {
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
}
</style>
