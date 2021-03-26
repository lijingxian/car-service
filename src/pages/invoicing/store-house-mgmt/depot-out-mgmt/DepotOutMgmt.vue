<template>
  <div class="depot-out-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="depot-out-mgmt-tabel"
    >
      <el-table-column label="订单" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate}}</div>
            <div class="overflow">状态：
              <span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="往来方" min-width="100px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.relatePartnerName?scope.row.relatePartnerName:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" min-width="80px" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{getBusinessType(scope.row)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联单据" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div style="color:#ff7300;cursor:pointer" class="shop-over overflow" @click="clickRelateBill($event, scope.row)">
              {{ scope.row.relateBillSn ? scope.row.relateBillSn : '--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="220px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.itemDatas.length>0?[scope.row.itemDatas[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail"/>
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.specValue">{{orderItem.specValue?orderItem.specValue:'--'}}</div>
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:''}}</div>
                  </div>
                  <div class="amount">{{orderItem.amount}}{{scope.row.itemDatas.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="120">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" v-if="(scope.row.state==='0'||scope.row.state==='2')&&hasAuthComfirm" @click.stop="statusChange(scope.row)">确认出库</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='0'&&hasAuthDel" @click.stop="deleteApply($event,scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click.stop="printApply(scope.row)">凭证</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <base-info :itemId="itemId" :isEdit="isEdit" @setOrderItems="setOrderItems" ref="baseInfo" @operationSuccess="createdSuccess"></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo" v-if="isCreate">
        <product-info :itemId="itemId" :isEdit="isEdit" :returnId="returnId" ref="productInfo" @operationSuccess="operationSuccess"></product-info>
      </el-tab-pane>
      <el-tab-pane label="出库信息" name="depotoutinfo" v-if="isCreate">
        <depot-out-info :itemId="itemId" :isEdit="isEdit" ref="depotoutinfo" @operationSuccess="operationSuccess" :tabSelection="tabName"></depot-out-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPurchaseOrder" @close="openPurchaseOrder=false" v-model="relateBillPurchase">
      <el-tab-pane label="基本信息" name="info">
        <purchase-order-info :orderId="purchaseOrderId" :isRalateBill="isRalateBill" ref="orderinfo" @closeTabByEvaluate="closeTabByEvaluate" @closeTabByLogistics="closeTabByLogistics"></purchase-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openAllottedOrder" @close="openAllottedOrder=false" v-model="relateBillAttolled">
      <el-tab-pane label="基本信息" name="info">
        <allotted-order-info :itemId="allottedOrderId" :shopDepots="shopDepots" ref="allottedOrderinfo"></allotted-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openReview" @close="openReview=false" v-model="tabNameReview">
      <el-tab-pane label="评价" name="reviewinfo">
        <my-evaluate :orderId="orderId" ref="reviewinfo" :editable="editable" @operationSuccess="operationSuccess"></my-evaluate>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openRelateBillOrder" @close="openRelateBillOrder=false" v-model="relateBillOrder">
      <el-tab-pane label="基本信息" name="baseinfo">
        <order-base-info :itemId="relateBillOrderId" :isEdit="isEdit" @operationSuccess="refresh"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <order-product-info :itemId="relateBillProductId" :isEdit="isEdit" @operationSuccess="refresh"></order-product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openInventory" @close="openInventory=false" v-model="tabInventoryName">
      <el-tab-pane label="基本信息" name="info">
        <inventory-base-info :itemId="inventoryId" :isEdit="isEdit" ref="baseInfo" @operationSuccess="refresh"></inventory-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <inventory-product-info :itemId="inventoryId" :isEdit="isEdit" ref="productinfo" @operationSuccess="refresh"></inventory-product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openLogistics" @close="openLogistics = false" v-model="tabNameLogistics">
      <el-tab-pane label="物流追踪" name="loginfo">
        <logistics-following :orderId="orderId" :sn="sn" ref="logistics"></logistics-following>
      </el-tab-pane>
    </biz-popup-tabs>

    <!-- 打印 -->
    <el-dialog :visible.sync="dialogTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
            <el-button type="primary" @click="exportInvoice" size="mini">导出</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">往来方：{{form.relatePartnerName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">状态：{{form.state}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">业务类型：{{formatType(form.businessType)}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建人：{{form.creatorName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple">备注：{{form.remark}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class" show-summary size="small">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column property="productName" label="商品">
              <template slot-scope="scope">{{(scope.row.product?scope.row.product.fullName:'') || scope.row.productName}}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="商品条码"></el-table-column>
            <el-table-column property="amount" label="出库数量"></el-table-column>
            <el-table-column label="仓库">
              <template slot-scope="scope">{{scope.row.depotName}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import DepotOutInfo from './DepotOutInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import axios from 'axios';
import vueEasyPrint from 'vue-easy-print';
import PurchaseOrderInfo from '@/pages/invoicing/purchase-mgmt/purchase-order/OrderInfo';
import OrderBaseInfo from '@/pages/order/finance-mgmt/base-info/OrderBaseInfo';
import OrderProductInfo from '@/pages/order/OrderMgmt/ProductInfo';
import InventoryBaseInfo from '@/pages/invoicing/store-house-mgmt/inventory/BaseInfo';
import InventoryProductInfo from '@/pages/invoicing/store-house-mgmt/inventory/ProductInfo';
import AllottedOrderInfo from '@/pages/invoicing/store-house-mgmt/allotted-mgmt/BaseInfo';
import LogisticsFollowing from '@/pages/invoicing/agency-purchase-order/LogisticsFollowing';
import MyEvaluate from '@/pages/invoicing/agency-purchase-order/MyEvaluate';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'DepotOutMgmtList',
  data() {
    return {
      tabName: 'info',
      tabNameLogistics: 'loginfo',
      relateBillPurchase: 'info',
      relateBillOrder: 'baseinfo',
      tabInventoryName: 'info',
      relateBillAttolled: 'info',
      itemId: '',
      allottedOrderId: '',
      purchaseOrderId: '',
      relateBillOrderId: { id: '' },
      relateBillProductId: '',
      orderId: '',
      sn: '',
      inventoryId: '',
      returnId: '',
      title: '',
      isEdit: true,
      isCreate: false,
      openReview: false,
      tabNameReview: 'reviewinfo',
      form: {},
      formDate: {},
      loading: false,
      visiable: false,
      open: false,
      showRecommend: false,
      isRalateBill: false,
      openPurchaseOrder: false,
      openRelateBillOrder: false,
      openInventory: false,
      dialogTableVisible: false,
      openAllottedOrder: false,
      editable: false,
      openLogistics: false,
      selections: [],
      shopDepots: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:export.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:export.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'exportStart',
          type: '',
          auth: ['admin:export.export']
        }
      ],
      filters: [
        {
          type: 'checkBox',
          label: '业务类型',
          name: 'businessType',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: [
            { value: '0', label: '采购退货' },
            { value: '1', label: '销售出库' },
            { value: '2', label: '其他出库' },
            { value: '3', label: '盘点调整' },
            { value: '4', label: '调拨' }
          ]
        },
        {
          type: 'checkBox',
          label: '订单状态',
          name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: [
            { value: '0', label: '未确认' },
            { value: '1', label: '已确认' },
            { value: '2', label: '部分确认' }
          ]
        },
        {
          type: 'daterange',
          label: '创建日期',
          name: 'publishDate',
          class: 'hidden',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入编号/往来方名称/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      taskId: '',
      t: '',
      percentage: 0,
      gridData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    DepotOutInfo,
    vueEasyPrint,
    ProductInfo,
    PurchaseOrderInfo,
    OrderBaseInfo,
    OrderProductInfo,
    InventoryBaseInfo,
    InventoryProductInfo,
    AllottedOrderInfo,
    LogisticsFollowing,
    MyEvaluate,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryKpi();
    this.getDepots();
  },
  watch: {},
  mixins: [ColumnsMixin],
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthComfirm() {
      return this.currentAuth.includes('admin:export.comfirm');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:export.delete');
      // return true;
    },
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
    createdSuccess(id) {
      if (id) {
        this.itemId = String(id);
        this.tabName = 'productinfo';
        this.isCreate = true;
      } else {
        this.refresh();
      }
    },
    refresh() {
      this.getList();
    },
    operationSuccess(id) {
      if (!id) {
        this.open = false;
      }
      this.itemId = id;
      this.refresh();
    },
    closeTabByEvaluate(id, state) {
      console.log(111);
      this.editable = false;
      this.openPurchaseOrder = false;
      this.tabNameReview = 'reviewinfo';
      this.orderId = id;
      this.$nextTick(() => {
        this.openReview = true;
        this.$refs.reviewinfo.getOrderInfo(id);
      });
    },
    formatType(type) {
      if (type === '0') {
        return '采购退货';
      } else if (type === '1') {
        return '销售出库';
      } else if (type === '2') {
        return '其它出库';
      } else if (type === '3') {
        return '盘点调整';
      } else if (type === '4') {
        return '调拨';
      }
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    getDepots() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageSize: '1000',
        pageNumber: 1
      };
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml', params)
        .then(data => {
          this.shopDepots = data.dataList;
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
    statusChange(model) {
      // let flag = false;
      // model.itemDatas.forEach(item => {
      //   if (item.amount < item.leftQuantity) {
      //     flag = true;
      //   }
      // });
      // if (flag) {
      //   this.$confirm('您本次出库的商品数量小于关联单据的需出库数量，确认出库?', '确认出库？', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.confrim(model, state);
      //   });
      // } else {
      //   this.confrim(model, state);
      // }
      this.tabName = 'productinfo';
      this.open = true;
      this.isCreate = true;
      this.$nextTick(() => {
        this.itemId = model.id;
      });
      if (model.state === '0' || model.state === '2') {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    confrim(model, state) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: model.id,
        actionType: state
      };
      http
        .get(urls.invoicing.depotOutMgmt.state, params)
        .then(data => {
          this.$message.success('操作成功！');
          this.refresh();
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    deleteApply(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    // 删除
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete(urls.invoicing.depotOutMgmt.shopDepotOut, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    printApply(row) {
      let params = {
        id: row.id
      };
      http
        .get(urls.invoicing.depotOutMgmt.print, params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop.name + '出库单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '未确认';
          } else if (this.form.state === '1') {
            this.form.state = '已确认';
          } else {
            this.form.state = '';
          }
          this.gridData = data.data.itemDatas;
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
    print() {
      this.$refs.easyPrint.print();
    },
    async exportInvoice() {
      let params = {
        id: this.form.id
      };
      try {
        let response = await axios.post('/admin/invoicing/stock/voucher/depotOut/export.jhtml', params, {
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
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
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
        // searchValue: this.filters[3].value,
        businessIds: this.filters[0].value,
        states: this.filters[1].value,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/stock/shopDepotOuts/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/stock/shopDepotOuts/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    add() {
      this.tabName = 'info';
      this.open = true;
      this.isEdit = true;
      this.isCreate = false;
      this.itemId = '';
      this.$refs.baseInfo.resetModel();
    },
    rowClick(model, e, column) {
      this.tabName = 'info';
      this.open = true;
      this.isCreate = true;
      this.$nextTick(() => {
        this.itemId = model.id;
      });
      if (model.state === '0') {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    getList() {
      let params = {
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[3].value
        },
        shopId: window.top.SHOP_ID || '',
        businessIds: this.filters[0].value,
        states: this.filters[1].value,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .post(urls.invoicing.depotOutMgmt.shopDepotOutList, params)
        .then(data => {
          console.log(data);
          this.tableData = data.dataList;
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
    queryKpi() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/invoicing/stock/queryShopDepotOutsKpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待确认出库${data.data.unConfirm}条`,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    clickRelateBill(e, row) {
      e.stopPropagation();
      if (row.businessType === '0' || (row.businessType === '1' && row.relatePartnerType === '2')) {
        this.purchaseOrderId = row.relateBill;
        this.openPurchaseOrder = true;
        this.$nextTick(() => {
          this.$refs.orderinfo.getOrderInfo();
        });
        this.isRalateBill = true;
      } else if (row.businessType === '1' && row.relatePartnerType === '1') {
        this.relateBillOrderId = { id: row.relateBill };
        this.relateBillProductId = row.relateBill;
        this.openRelateBillOrder = true;
        this.isEdit = false;
      } else if (row.businessType === '3') {
        this.inventoryId = String(row.relateBill);
        this.openInventory = true;
        this.isEdit = false;
      } else if (row.businessType === '4') {
        this.allottedOrderId = String(row.relateBill);
        this.openAllottedOrder = true;
        this.isEdit = false;
      } else {
      }
    },
    closeTabByLogistics(sn) {
      this.tabName = 'loginfo';
      this.sn = sn;
      this.openLogistics = true;
      this.openPurchaseOrder = false;
      this.$nextTick(() => {
        this.$refs.logistics.getLogisticsInfo();
      });
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '未确认';
        case '1':
          return '已确认';
        case '2':
          return '部分确认';
        default:
          return '--';
      }
    },
    getBusinessType(row) {
      switch (row.businessType) {
        case '0':
          return '采购退货';
        case '1':
          return '销售出库';
        case '2':
          return '其他出库';
        case '3':
          return '盘点调整';
        case '4':
          return '调拨';
        default:
          return '--';
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        });
      }
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
    setOrderItems(id) {
      this.isCreate = true;
      this.tabName = 'productinfo';
      this.$nextTick(() => {
        this.returnId = String(id);
      });
    }
  }
};
</script>

<style lang="scss">
.grid18 {
  height: 20px;
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 260px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
}
.depot-out-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.depot-out-mgmt {
  .biz-popup .popup-content {
    width: 600px;
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
  .biz-header .biz-header__filter-wrapper {
    float: left;
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
  .operate-container {
    margin-left: 10px;
  }
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
  .product-info {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    .wrapper {
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 200px;
        white-space: nowrap;
      }
    }
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
