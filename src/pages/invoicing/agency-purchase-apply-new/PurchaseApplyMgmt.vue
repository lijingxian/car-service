<template>
  <div class="purchase-apply-mgmt-ae">
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
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="purchase-apply-mgmt-tabel-ae"
    >
      <el-table-column label="订单" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate}}</div>
            <div class="overflow">状态：<span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人" min-width="80px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.applierName?scope.row.applierName:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="120px" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              不含税：{{scope.row.amountWithoutTax?scope.row.amountWithoutTax:'--'}}
            </div>
            <div>
              税额：{{scope.row.tax?scope.row.tax:'--'}}
            </div>
            <div>
              含税：{{scope.row.totalFee?scope.row.totalFee:'--'}}
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
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:''}}</div>
                    <div class="overflow">单价(不含税)：{{orderItem.price?orderItem.priceWithoutTax:'--'}}</div>
                    <div class="overflow">单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
                  </div>
                  <div class="amount">{{orderItem.amount}}{{scope.row.itemDatas.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="130">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.state==='1'&& scope.row.audit==='1') || (scope.row.state==='2'&& scope.row.audit==='1')"
              @click.stop="toPass(scope.row,'1')"
            >审核</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='0'" @click.stop="statusChange(scope.row,'0')">提交</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='1'&&scope.row.isApplier==='1'" @click.stop="statusChange(scope.row,'3')">撤回</el-button>
            <!-- <el-button
              type="text"
              size="mini"
              v-if="(scope.row.state==='1'&& scope.row.audit==='1') || (scope.row.state==='2'&& scope.row.audit==='1')"
              @click.stop="reject(scope.row,'2')"
            >驳回</el-button>-->
            <el-button type="text" size="mini" v-if="scope.row.state === '0'" @click.stop="deleteApply($event,scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click.stop="printApply(scope.row)">凭证</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="openAdd" @close="openAdd=false" v-model="tabName">
      <el-tab-pane label="添加申请单" name="addinfo">
        <base-info v-if="step1" @step1Confirm="step1Confirm" :backForm="backForm" ref="step1Info"></base-info>
        <product-info v-if="step2" @step2Confirm="step2Confirm" :formData="formData" @operationSuccess="operationSuccess"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabNameInfo">
      <el-tab-pane label="基本信息" name="info">
        <apply-info :itemId="itemId" :isPend="isPend" ref="info"></apply-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrderStore" @close="openOrderStore = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="orderStoreInfo">
        <order-store-info ref="orderStoreInfo" :orderId="orderStoreId"></order-store-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrderSale" @close="openOrderSale = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="orderSaleInfo">
        <order-sale-info
          ref="orderSaleInfo"
          :itemId="orderSaleId"
          :isEdit="isEdit"
          @operationSuccess="refresh"
          :handler="handlerName"
          :activeNames="activeNames"
        ></order-sale-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="OrderSaleProductInfo">
        <order-sale-product-info ref="OrderSaleProductInfo" :itemId="orderSaleId" :isEdit="isEdit" @operationSuccess="refresh" :handler="handlerName"></order-sale-product-info>
      </el-tab-pane>
    </biz-popup-tabs>
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
              <div class="grid-content bg-purple">申请人：{{form.applierName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">总金额(元)：{{form.totalFee}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remark}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">状态：{{form.state}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class" show-summary>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column property="productName" label="商品名称" min-width="200">
              <template slot-scope="scope">{{scope.row.specValue}}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="条码"></el-table-column>
            <el-table-column property="amount" label="采购数量"></el-table-column>
            <el-table-column property="price" label="金额(元)">
              <template slot-scope="scope">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="totalFee" label="小计">
              <template slot-scope="scope">￥{{scope.row.totalFee}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div style="float:right;padding-right:100px">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <!-- <el-dialog :visible.sync="showCloseOrder" center append-to-body custom-class="close-order-dialog" title="驳回信息">
      <div>
        <div>您正在进行审核驳回操作，确定后将不能修改。</div>
        <div class="reson-container">
          <span class="start">*</span>
          <span>驳回理由：</span>
          <el-select v-model="curSelectCloseReason" placeholder="请选择驳回理由" class="order-select" size="mini">
            <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
          </el-select>
          <el-input v-model="remarks" type="textarea"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showCloseOrder=false" size="mini" type="primary">取消</el-button>
        <el-button @click="statusChange(row,'2')" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>-->
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">驳回</el-radio>
          <div style="padding: 5px 0px;margin-top:15px;" v-show="auditState==='2'">
            <span>驳回理由：</span>
            <el-select v-model="curSelectAjectReason" placeholder="请选择驳回理由" class="order-select" size="mini">
              <el-option v-for="reason in reasonAjectList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
            </el-select>
          </div>
          <el-input v-model="remarks" type="textarea" style="margin-top:15px;"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showPassOrder=false" size="mini" type="primary">取消</el-button>
        <el-button @click="statusChange(row,auditState)" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import ApplyInfo from './ApplyInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
import OrderStoreInfo from '@/pages/invoicing/purchase-mgmt/purchase-order/OrderInfo';
import OrderSaleInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/BaseInfo';
import OrderSaleProductInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/ProductInfo';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'PurchaseApplyMgmtList',
  data() {
    return {
      tabName: 'addinfo',
      tabNameInfo: 'info',
      curSelectAjectReason: '申报的商品与实际需要采购的商品不符',
      reasonAjectList: [
        {
          label: '申报的商品与实际需要采购的商品不符',
          value: '申报的商品与实际需要采购的商品不符'
        },
        {
          label: '送达仓库地址填写错误',
          value: '送达仓库地址填写错误'
        },
        {
          label: '申报的商品供应方已停售或缺货',
          value: '申报的商品供应方已停售或缺货'
        },
        {
          label: '申报的商品数量有误',
          value: '申报的商品数量有误'
        },
        {
          label: '已与部分商品供应商终止合作',
          value: '已与部分商品供应商终止合作'
        },
        {
          label: '其他原因',
          value: '其他原因'
        }
      ],
      taskId: '',
      t: '',
      percentage: 0,
      itemId: '',
      title: '',
      remarks: '',
      auditState: '1',
      isEdit: true,
      isPend: false,
      returnId: '',
      form: {},
      row: {},
      formData: {},
      loading: false,
      open: false,
      openAdd: false,
      showRecommend: false,
      dialogTableVisible: false,
      showCloseOrder: false,
      step1: true,
      step2: false,
      backForm: {},
      showPassOrder: false,
      activeNames: ['1'],
      handlerName: '',
      orderStoreId: '',
      orderSaleId: '',
      openOrderStore: false,
      openOrderSale: false,
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          class: 'show'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '申请人',
          name: 'people',
          class: 'hidden',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '申请状态',
          name: 'state',
          class: 'hidden',
          value: '',
          options: []
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
          placeholder: '请输入采购申请单编号/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
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
    vueEasyPrint,
    ProductInfo,
    ApplyInfo,
    OrderStoreInfo,
    OrderSaleInfo,
    OrderSaleProductInfo,
    ExportFileNew
  },
  mixins: [ColumnsMixin],
  created() {
    this.getList();
    this.queryKpi();
    this.queryFilters();
  },
  watch: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mounted() {
    this.getIsEdit();
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
    clickRelateBill(e, row) {
      e.stopPropagation();
      if (row.relateBillType === '2') {
        this.tabName = 'orderStoreInfo';
        this.orderStoreId = row.relateBill;
        this.openOrderStore = true;
        this.open = false;
        this.$nextTick(() => {
          this.$refs.orderStoreInfo.getOrderInfo();
        });
      } else {
        this.tabName = 'orderSaleInfo';
        this.isEdit = false;
        this.orderSaleId = row.relateBill;
        this.openOrderSale = true;
        this.open = false;
        this.$nextTick(() => {
          this.$refs.orderSaleInfo.init();
        });
      }
    },
    getIsEdit() {
      http
        .get('/admin/invoicing/config/setting.jhtml', { shopId: this.getUser().shop.id })
        .then(data => {
          if (data.saleApply === '0') {
            this.operations[0].class = 'hidden';
          } else {
            this.operations[0].class = 'show';
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    step1Confirm(data) {
      this.step1 = false;
      this.step2 = true;
      this.formData = data;
    },
    step2Confirm(data) {
      this.step1 = true;
      this.step2 = false;
      this.backForm = data;
      this.$nextTick(() => {
        this.$refs.step1Info.query();
      });
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.openAdd = false;
      this.refresh();
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    reject(row, state) {
      this.remarks = '';
      this.row = row;
      this.showCloseOrder = true;
    },
    toPass(row, state) {
      this.remarks = '';
      this.row = row;
      this.showPassOrder = true;
    },
    statusChange(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          shopId: window.top.SHOP_ID || '',
          id: model.id,
          actionType: state,
          details: state === '2' ? this.curSelectAjectReason : '',
          remarks: this.remarks
        };
        http
          .post('/admin/invoicing/purchase/agentPurchaseApplyState.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            this.loading = false;
          })
          .finally(() => {});
      });
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
          .delete('/admin/invoicing/purchase/agentPurchaseApply.jhtml', { ids: ids })
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
        .get('/admin/invoicing/purchase/voucher/agentPurchaseApply.jhtml', params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop.name + '采购申请单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '已创建';
          } else if (this.form.state === '1') {
            this.form.state = '已提交';
          } else if (this.form.state === '2') {
            this.form.state = '审核中';
          } else if (this.form.state === '3') {
            this.form.state = '已通过';
          } else if (this.form.state === '4') {
            this.form.state = '已驳回';
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
        id: this.form.id,
        //  0:采购；1：销售
        type: '0'
      };
      try {
        let response = await axios.post('/admin/invoicing/purchase/voucher/agentPurchaseApply/export.jhtml', params, {
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
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[3].value,
        applierId: this.filters[0].value,
        applyState: this.filters[1].value,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/purchase/agentPurchaseApplies/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/purchase/agentPurchaseApplies/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      this.tabName = 'addinfo';
      this.itemId = '';
      this.step1 = true;
      this.step2 = false;
      this.openAdd = true;
      this.$nextTick(() => {
        this.$refs.step1Info.getDepotList();
      });
    },
    rowClick(model, e, column) {
      this.tabNameInfo = 'info';
      this.open = true;
      this.$nextTick(() => {
        this.itemId = model.id;
      });
      this.isPend = false;
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[3].value,
        applierId: this.filters[0].value,
        applyState: this.filters[1].value,
        beginTime: this.filters[2].value[0] ? this.filters[2].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[2].value[1] ? this.filters[2].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      http
        .get('/admin/invoicing/purchase/agentPurchaseApplies.jhtml', params)
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
        .get('/admin/invoicing/purchase/queryAgentPurchaseKpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待审核${data.data.waitAuditing}条`,
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
    queryFilters() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        businessOwnerType: '1'
      };
      http
        .get(urls.invoicing.purchaseApplyMgmt.queryInfos, params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.applierList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.stateList.map(item => {
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
    stateColor(row) {
      if (row.state === '3') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        case '2':
          return '审核中';
        case '3':
          return '已通过';
        case '4':
          return '已驳回';
        default:
          return '--';
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
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
    width: 300px;
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
.purchase-apply-mgmt-tabel-ae {
  .biz-input {
    width: 220px;
  }
}
.purchase-apply-mgmt-ae {
  .biz-popup .popup-content {
    width: 600px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 100px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 50px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    // width: 25%;
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
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
        width: 250px;
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
