<template>
  <biz-grid class="purchase-statistics" v-loading="loading">
    <div slot="top">
      <biz-header
        :operations="operations"
        @operate="operate"
        :filters="filters"
        @filterDataChange="filterDataChange"
        @active-item-change="activeItemChange"
        @cascader-change="cascaderChange"
        :views="views"
        @onSwitch="onViewSwitch"
      ></biz-header>
      <div style="font-size: 14px;margin-bottom: 10px;display:flex;">
        <div>
          销售金额（含税）：
          <template>￥{{sumPurchaseFee}}</template>
        </div>
        <div style="margin-left:15px;">
          退货金额（含税）：
          <template>￥{{sumReturnFee}}</template>
        </div>
      </div>
    </div>
    <biz-list
      v-show="this.activedView==='list'"
      ref="table"
      :tableData="tableData"
      :showSummary="true"
      @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClick"
      size="small"
      height="100%"
    >
      <el-table-column type="selection" width="80"></el-table-column>
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
      <el-table-column label="销售" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.purchaseAmount?scope.row.purchaseAmount:'--'}}</div>
            <div class="overflow">金额(不含税)：{{scope.row.purchaseFee-scope.row.purchaseFeeTax}}</div>
            <div class="overflow">税额(含税)：{{scope.row.purchaseFeeTax?scope.row.purchaseFeeTax:'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.purchaseFee?scope.row.purchaseFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售退货" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.returnAmount?scope.row.returnAmount:'--'}}</div>
            <div class="overflow">金额(不含税)：{{scope.row.returnFee-scope.row.returnFeeTax}}</div>
            <div class="overflow">税额(含税)：{{scope.row.returnFeeTax?scope.row.returnFeeTax:'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.returnFee?scope.row.returnFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <biz-list
      v-show="this.activedView==='list1'"
      ref="table"
      :tableData="tableDataAgent"
      @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClickAgent"
      size="small"
      height="100%"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="客户" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.agentName?scope.row.agentName:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" min-width="60px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.orderQuantity?scope.row.orderQuantity:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.purchaseAmount?scope.row.purchaseAmount:'--'}}</div>
            <div class="overflow">金额(不含税)：{{'--'}}</div>
            <div class="overflow">税额(含税)：{{'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.purchaseFee?scope.row.purchaseFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售退货" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">商品数量：{{scope.row.returnAmount?scope.row.returnAmount:'--'}}</div>
            <div class="overflow">金额(不含税)：{{'--'}}</div>
            <div class="overflow">税额(含税)：{{'--'}}</div>
            <div class="overflow">金额(含税)：{{scope.row.returnFee?scope.row.returnFee:'--'}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
        <el-tab-pane label="基本信息" name="info">
          <base-info :itemId="itemId" @openOrderTab="openOrderTab" :beginTime="filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : ''"
          :endTime="filters[2].value[1] ? filters[2].value[1] + ' ' + '23:59:59' : ''" ref="info"></base-info>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openAgent" @close="openAgent=false" v-model="tabNameAgent">
        <el-tab-pane label="基本信息" name="baseinfo">
          <base-info-agent :agentId="agentId" :beginTime="filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : ''"
          :endTime="filters[2].value[1] ? filters[2].value[1] + ' ' + '23:59:59' : ''" ref="baseinfo"></base-info-agent>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openOrderSale" @close="openOrderSale = false" v-model="orderTabName">
        <el-tab-pane label="基本信息" name="orderSaleInfo">
          <order-sale-info ref="orderSaleInfo" :itemId="orderSaleId" :isEdit="isEdit" :handler="handlerName" :activeNames="activeNames"></order-sale-info>
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="OrderSaleProductInfo">
          <order-sale-product-info ref="OrderSaleProductInfo" :itemId="orderSaleId" :isEdit="isEdit" :handler="handlerName"></order-sale-product-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcleAgent"></export-file-new>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination, BizList } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import axios from 'axios';
import BaseInfo from './BaseInfo';
import BaseInfoAgent from './BaseInfoAgent';
import { ExportFileNew } from '@/components/BizUpload';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import OrderSaleInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/BaseInfo';
import OrderSaleProductInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/ProductInfo';

export default {
  name: 'PurchaseStatistics',
  data() {
    return {
      title: '',
      itemId: '',
      agentId: '',
      loading: false,
      visiable: false,
      open: false,
      isEdit: true,
      tabName: 'info',
      openAgent: false,
      tabNameAgent: 'baseinfo',
      openOrderSale: false,
      orderTabName: 'orderSaleInfo',
      orderSaleId: '',
      handlerName: '',
      activeNames: ['2'],
      selections: [],
      taskId: '',
      t: '',
      percentage: 0,
      productCategoryId: '',
      sumPurchaseFee: '',
      sumReturnFee: '',
      operations: [
        {
          label: '导出',
          name: 'exportStart',
          type: '',
          class: 'show',
          auth: ['admin:saleStatistic.export']
        },
        {
          label: '导出',
          name: 'exportAgentStart',
          type: '',
          class: 'hidden'
          // auth: ['admin:saleStatistic.export']
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
          label: '代理商',
          name: 'agency',
          value: [],
          filterable: true,
          multiple: true,
          collapseTags: true,
          options: [
            {
              value: '',
              label: '全部'
            }
          ]
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
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '商品视图'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list1',
          title: '代理商视图'
        }
      ],
      tableData: [],
      tableDataAgent: [],
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
    BizPopupTabs,
    BaseInfo,
    BaseInfoAgent,
    OrderSaleProductInfo,
    OrderSaleInfo,
    ExportFileNew
  },
  created() {
    this.refresh();
    this.queryFilters();
    this.queryAgency();
  },
  watch: {},
  computed: {
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
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
    openOrderTab(row) {
      this.openOrderTab = 'orderSaleInfo';
      this.orderSaleId = row.orderId;
      this.open = false;
      this.openOrderSale = true;
      this.$nextTick(() => {
        this.$refs.orderSaleInfo.init();
      });
      this.isEdit = false;
    },
    queryAgency() {
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', {
          cooperationType: '1',
          pageSize: 1000,
          pageNumber: 1
        })
        .then(data => {
          this.filters[0].options = [{ value: '', label: '全部' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    refresh() {
      if (this.activedView === 'list') {
        this.getSaleList();
      } else {
        this.getAgentList();
      }
    },
    onViewSwitch(name) {
      document.querySelectorAll('.biz-header__operation-wrapper')[0].style.display = '';
      document.querySelectorAll('.biz-table-filter')[0].style.display = '';
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
        }
      }
      if (name === 'list') {
        this.operations[0].class = 'show';
        this.operations[1].class = 'hidden';
        this.getSaleList();
      } else {
        this.operations[0].class = 'hidden';
        this.operations[1].class = 'show';
        this.getAgentList();
      }
    },
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
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
        .get('/admin/shopProduct/productCategorys.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.filters[1].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.dateList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    exportAgentStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.agentId);
        });
      }
      let params = {
        ids: ids,
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[3].value
        },
        shopId: window.top.SHOP_ID || '',
        agentIds: this.filters[0].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/purchase/agentView/storeSalesReports/exportStart.jhtml', params)
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
    async exportExcleAgent() {
      try {
        let response = await axios.get('/admin/invoicing/purchase/agentView/storeSalesReports/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[3].value,
        agentIds: this.filters[0].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/purchase/storeSalesReports/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/purchase/storeSalesReports/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getSaleList() {
      let params = {
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[3].value
        },
        shopId: window.top.SHOP_ID || '',
        agentIds: this.filters[0].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .post('/admin/invoicing/purchase/storeSalesReports.jhtml', params)
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
    getAgentList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[3].value
        },
        agentIds: this.filters[0].value,
        categoryId: this.productCategoryId,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .post('/admin/invoicing/purchase/agentView/storeSalesReports.jhtml', params)
        .then(data => {
          this.tableDataAgent = data.dataList;
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
    queryCategoryList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.commodity.getProductCategoryList, params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.ProductCategoryManage.map(item => {
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
        this.$refs.info.getList();
      });
    },
    rowClickAgent(row, event, column) {
      this.agentId = row.agentId;
      this.tabNameAgent = 'baseinfo';
      this.openAgent = true;
      this.$nextTick(() => {
        this.$refs.baseinfo.getList();
      });
    }
  }
};
</script>

<style lang="scss">
.purchase-statistics {
  .biz-input {
    width: 220px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: auto !important;
  }
}
.purchase-statistics {
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
