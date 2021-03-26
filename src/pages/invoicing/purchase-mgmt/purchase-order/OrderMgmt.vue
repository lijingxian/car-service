<template>
  <div class="order-purchase">
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
      :isMergeInvoice="true"
      :showSummary="true"
      @current-change="handleCurrentChange"
      class="order-mgmt-tabel"
    >
    <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column label="订单" min-width="160px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.orderTime}}</div>
            <div class="overflow">状态：
              <span :style="{color: stateColor(scope.row)}">{{getOrderStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="100px">
        <template slot-scope="scope">
          <div style="width:100%;color:#ff7300" @click.stop="supplierClick(scope.row)">
            <div class="overflow">
              {{scope.row.supplier?scope.row.supplier.name:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联单据" min-width="170">
        <template slot-scope="scope">
          <div style="width:100%">
            <div v-for="(relateBill,index) in scope.row.relateBills" :key="index" class="overflow">
              <div style="color:#ff7300;cursor:pointer" class="shop-over overflow" :title="relateBill.relateBillSn ? relateBill.relateBillSn : ''" @click="clickRelateBill($event, relateBill)" v-if="relateBill.relateBillSn">
                {{ relateBill.relateBillSn }}
              </div>
              <div v-else>
                {{ '--' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="150px" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ¥{{scope.row.amount?scope.row.amount:'--'}}
            </div>
            <div class="overflow">
              已收款：{{scope.row.amountPaid?scope.row.amountPaid:'--'}}
            </div>
            <div class="overflow">
              待收款：{{scope.row.amount-scope.row.amountPaid}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="260px" prop="count">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.orderItems.length>0?[scope.row.orderItems[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.name">{{orderItem.name}}</div>
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:'-'}}</div>
                    <div class="overflow">单价(不含税)：{{orderItem.priceWithoutTax?orderItem.priceWithoutTax:'--'}}</div>
                    <div class="overflow">单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="confirmOrderShipping(scope.row)" v-if="scope.row.hasSyncOrder === '0'&&scope.row.state==='4'">确认收货</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="logisticsHandler(scope.row)"
              v-if="scope.row.shippings.length>0&&((scope.row.hasSyncOrder === '0'&&scope.row.state!=='5'&&scope.row.state!=='6'&&scope.row.state!=='7')||scope.row.state==='13')"
            >物流跟踪</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="paymentHandler(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&((scope.row.state === '2' && scope.row.shippingWay === '0')||(scope.row.state === '12' && scope.row.shippingWay === '0'))"
            >付款</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="closeOrder(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&(scope.row.state==='2'&&scope.row.shippingWay==='0')"
            >取消</el-button>
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)" v-if="scope.row.hasSyncOrder === '0'">凭证</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="invoiceHandler(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&scope.row.state!=='6'"
            >申请发票</el-button>
            <el-button type="text" size="mini" @click.stop="review(scope.row)" v-if="scope.row.hasSyncOrder === '0'&&scope.row.state==='5'">评价</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="scope.row.hasSyncOrder === '0'&&scope.row.state==='1'&&((scope.row.auditState==='1'&& scope.row.audit==='1') || (scope.row.auditState==='2'&& scope.row.audit==='1'))"
              @click.stop="toPass(scope.row)"
            >审核</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">驳回</el-radio>
          <div style="padding:5px 0px;margin-top:15px;" v-show="auditState==='2'">
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
    <biz-popup-tabs :open="openAdd" @close="openAdd=false" v-model="tabName">
      <el-tab-pane label="添加订单" name="addinfo">
        <add-step-1 v-if="step1" @step1Confirm="step1Confirm" ref="step1" :step1Data="step1Data"></add-step-1>
        <add-step-2
          v-if="step2"
          :supplierId="supplierId"
          ref="step2"
          :step2Data="step2Data"
          :step2SubTotal="step2SubTotal"
          @step2Confirm="step2Confirm"
          @stepToOne="stepToOne"
        ></add-step-2>
        <add-step-3 v-if="step3" :supplierId="supplierId" @step3Confirm="step3Confirm" @stepToTwo="stepToTwo" @complate="complate"></add-step-3>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <order-info
          :orderId="itemId"
          ref="info"
          :isPend="isPend"
          :isRalateBill="isRalateBill"
          :category="'0'" :buyerType="'5'" :buyer="getUser().shop.id" :sellerType="'0'" :seller="seller"
          :hasSyncOrder="hasSyncOrder"
          @closeTabByLogistics="closeTabByLogistics"
          @closeTabByEvaluate="closeTabByEvaluate"
        ></order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openLogistics" @close="openLogistics=false" v-model="tabName">
      <el-tab-pane label="物流追踪" name="loginfo" v-if="sn">
        <logistics-following :orderId="itemId" :sn="sn" ref="logistics"></logistics-following>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPay" @close="openPay=false" v-model="tabName">
      <el-tab-pane label="付款" name="payinfo">
        <pay-info :orderId="itemId" @operateSuccess="operateSuccess" :amountPaid="amountPaid" :amount="amount" :amountPayable="amountPayable"></pay-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openInvoice" @close="openInvoice=false" v-model="tabName">
      <el-tab-pane label="发票" name="invoiceinfo">
        <invoice-info @close="close" :orderIds="orderIds" :invoiceAmount="invoiceAmount"></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openReview" @close="openReview=false" v-model="tabName">
      <el-tab-pane label="评价" name="reviewinfo">
        <my-evaluate :orderId="orderId" ref="reviewinfo" :editable="editable" @operationSuccess="operationSuccess"></my-evaluate>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPurchase" @close="openPurchase = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <purchase-apply-info :itemId="purchaseId" :isEdit="isEdit" @operationSuccess="operationSuccess"></purchase-apply-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPurchaseOrder" @close="openPurchaseOrder=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <purchase-order-info :orderId="purchaseOrderId" :isRalateBill="isRalateBill" ref="orderinfo" :isEdit="isEdit" @closeTabByLogistics="closeTabByLogistics"></purchase-order-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrderSale" @close="openOrderSale = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="orderinfo">
        <order-sale-info ref="orderSaleInfo" :itemId="orderSaleId" :isEdit="isEdit" @operationSuccess="refresh"></order-sale-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="OrderSaleProductInfo">
        <order-sale-product-info ref="OrderSaleProductInfo" :itemId="orderSaleId" :isEdit="isEdit" @operationSuccess="refresh"></order-sale-product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openSupplier" v-model="tabSelection" @close="openSupplier=false">
      <el-tab-pane label="基本信息" name="0">
        <supplier-base-info
          :itemId="supplierId1"
          :isEdit="isEdit"
          @operationSuccess="operationSuccess"
        ></supplier-base-info>
      </el-tab-pane>
      <el-tab-pane label="采购记录" name="1">
        <purchase-info
          :itemId="supplierId1"
          @operationSuccess="operationSuccess"
        ></purchase-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="printExport" size="mini">导出</el-button>
            <el-button type="primary" @click="print" size="mini">打印</el-button>
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
              <div class="grid-content bg-purple">订单编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">下单时间：{{form.orderTime}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收件人：{{form.consignee}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">收件人电话：{{form.phone}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple">收件人地址：{{form.areaName? form.areaName + form.address : form.address}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="fullName" label="商品名称">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.fullName}}</template>
            </el-table-column>
            <el-table-column property="barCode" label="条码">
              <template slot-scope="scope" v-if="scope.row.product">{{scope.row.product.barCode}}</template>
            </el-table-column>
            <el-table-column property="price" label="原价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.originalPrice}}</template>
            </el-table-column>
            <el-table-column property="price" label="现价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="现价小计">
              <template slot-scope="scope">￥{{scope.row.subTotal}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple" align="right">运费：￥{{form.freight}}</div>
            </el-col>
            <!-- <el-col :span="5">
              <div class="grid-content bg-purple">优惠金额：￥{{form.couponDiscount}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">V豆抵扣：￥{{form.beanDiscount}}</div>
            </el-col>
            <el-col :span="5" v-if="form.offsetAmountMethod==='0'">
              <div class="grid-content bg-purple">调整金额：￥{{form.offsetAmount}}</div>
            </el-col>
            <el-col :span="5" v-if="form.offsetAmountMethod==='1'">
              <div class="grid-content bg-purple">调整比率：{{form.offsetAmountRate}}%</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">订单原价：￥{{form.originalPrice}}</div>
            </el-col> -->
            <el-col :span="10">
              <div class="grid-content bg-purple" align="right">订单总额：{{form.amount}}</div>
            </el-col>
          </el-row>
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
    <el-dialog :visible.sync="showApplyInvoice" center append-to-body custom-class="apply-invoice-dialog" width="1000px">
      <apply-invoice :invoiceAmount="invoiceAmount" :orderIds="orderIds" ref="applyInvoice" :category="'0'" :buyerType="'5'" :buyer="getUser().shop.id" :sellerType="'0'" :seller="seller"  @close="showApplyInvoice=false"></apply-invoice>
    </el-dialog>
    <el-dialog :visible.sync="showCloseOrder" center append-to-body custom-class="close-order-dialog">
      <div>
        <div>取消订单后，本订单享有的优惠将一并取消，是否继续</div>
        <div class="reson-container">
          <span class="start">*</span>
          <span>请选择取消订单的理由：</span>
          <el-select v-model="curSelectCloseReason" placeholder="请选择取消理由" class="order-select" size="mini">
            <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="cancelClose" size="mini" type="primary">取消</el-button>
        <el-button @click="confirmClose" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/order-mgmt/orderMgmt';
import http from '@/common/http';
import { mapGetters, mapMutations } from 'vuex';
import urls from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import LogisticsFollowing from './LogisticsFollowing';
import MyEvaluate from '@/pages/invoicing/agency-purchase-order/MyEvaluate';
import OrderInfo from './OrderInfo';
import PayInfo from './PayInfo';
import InvoiceInfo from './InvoiceInfo';
import AddStep1 from './AddStep1';
import AddStep2 from './AddStep2';
import AddStep3 from './AddStep3';
import ApplyInvoice from './components/ApplyInvoice';
import axios from 'axios';
import PurchaseApplyInfo from '@/pages/invoicing/purchase-mgmt/purchase-apply/ApplyInfo';
import PurchaseOrderInfo from '@/pages/invoicing/purchase-mgmt/purchase-order/OrderInfo';
import OrderSaleInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/BaseInfo';
import OrderSaleProductInfo from '@/pages/invoicing/sale-mgmt/sale-order/OrderMgmt/ProductInfo';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import dateTime from '@/utils/dateTime';
import SupplierBaseInfo from '@/pages/invoicing/base-data/supplier/SupplierBaseInfo';
import PurchaseInfo from '@/pages/invoicing/base-data/supplier/PurchaseInfo';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'OrderMgmtList',
  data() {
    return {
      sn: '',
      auditState: '1',
      remarks: '',
      row: {},
      isPend: false,
      openOrder: false,
      amountPaid: '',
      amount: '',
      amountPayable: '',
      isRalateBill: false,
      taskId: '',
      t: '',
      percentage: 0,
      seller: '',
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
      closeDeccription: '',
      curSelectCloseReason: '',
      supplierId: '',
      reasonList: [
        {
          label: '我不想买了',
          value: '我不想买了'
        },
        {
          label: '信息填写有误, 重新拍',
          value: '信息填写有误, 重新拍'
        },
        {
          label: '卖家缺货',
          value: '卖家缺货'
        },
        {
          label: '忘记使用优惠券',
          value: '忘记使用优惠券'
        },
        // {
        //   label: '忘记使用优惠券, V豆',
        //   value: '忘记使用优惠券, V豆'
        // },
        {
          label: '重复下单,误下单',
          value: '重复下单,误下单'
        },
        {
          label: '支付方式有误,无法支付',
          value: '支付方式有误,无法支付'
        }
      ],
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      showCloseOrder: false,
      showApplyInvoice: false,
      curSelectDateType: '全部',
      dateTypeList: ['全部', '今日订单', '近一周订单', '近一月订单', '近三月订单'],
      tabName: 'info',
      itemId: '',
      invoiceInfoId: '',
      invoiceId: '',
      title: '',
      form: {},
      userCard: {},
      orderType: '',
      orderState: '',
      invoiceState: '',
      price: '',
      realName: '',
      orderId: '',
      invoiceAmount: 0,
      defaultTab: '0',
      activeNames: ['1'],
      orderIds: [],
      hasSyncOrder: '',
      tabSelection: '0',
      openSupplier: false,
      supplierId1: { id: '' },
      editable: true,
      loading: false,
      open: false,
      openPurchase: false,
      purchaseId: '',
      purchaseOrderId: '',
      openPurchaseOrder: false,
      openOrderSale: false,
      orderSaleId: '',
      isEdit: true,
      dialogTableVisible: false,
      openReview: false,
      openPay: false,
      openLogistics: false,
      openInvoice: false,
      openAdd: false,
      showRecommend: false,
      step1: true,
      step2: false,
      step3: false,
      step2Data: [],
      step1Data: {},
      step2SubTotal: '',
      showPassOrder: false,
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          class: 'show',
          auth: ['admin:purchaseOrder.add']
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
          auth: ['admin:purchaseOrder.export']
        },
        {
          label: '合并发票',
          name: 'mergeInvoice',
          type: '',
          disabled: true
        }
      ],
      filters: [
        {
          type: 'select',
          label: '供应商',
          name: 'name',
          value: [],
          class: 'hidden',
          filterable: true,
          multiple: true,
          collapseTags: true,
          options: []
        },
        {
          type: 'select',
          label: '代理商',
          name: 'shop',
          value: [],
          class: 'hidden',
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
          type: 'select',
          label: '订单状态',
          name: 'state',
          value: '',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '2', label: '商家已确认' },
            { value: '3', label: '买家已付款' },
            { value: '4', label: '订单已执行' },
            { value: '5', label: '交易完成' },
            { value: '6', label: '订单关闭' },
            { value: '7', label: '已评价' },
            { value: '9', label: '退款退货中' },
            { value: '10', label: '退款退货完成' },
            { value: '11', label: '已确认收货' },
            { value: '12', label: '部分支付' },
            { value: '13', label: '部分发货' }
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
          placeholder: '请输入订单编号/条码',
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
        total: 0
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    vueEasyPrint,
    LogisticsFollowing,
    OrderInfo,
    PayInfo,
    InvoiceInfo,
    AddStep1,
    AddStep2,
    AddStep3,
    MyEvaluate,
    PurchaseOrderInfo,
    PurchaseApplyInfo,
    OrderSaleInfo,
    OrderSaleProductInfo,
    SupplierBaseInfo,
    ApplyInvoice,
    PurchaseInfo,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryKpi();
    this.getEditableStoresByAgent();
    this.getSupplier();
    this.getIsEdit();
  },
  mixins: [ColumnsMixin],
  watch: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  computed: {
    // 是否显示发票列
    showInvoice() {
      let orderTypeList = ['service', 'product', 'car', 'general', 'rescue', 'couponOrder'];
      return orderTypeList.indexOf(this.$route.params.orderType) !== -1;
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mounted() {
    setTimeout(() => {
      document.querySelectorAll('.el-table__footer')[0].rows[0].cells[5].children[0].style.marginLeft = '200px';
      console.log(document.querySelectorAll('.el-table__footer')[0].rows[0].cells[5].children[0].style.marginLeft);
    }, 1000);
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Order', ['updateOrderInfo', 'updateOrderId', 'updateApplySaleItem', 'updateClickItemSelect']),
    operate(name) {
      this[name]();
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    supplierClick(row) {
      this.supplierId1 = { id: row.supplier.id };
      this.tabSelection = '0';
      this.isEdit = false;
      this.openSupplier = true;
    },
    clickRelateBill(e, row) {
      e.stopPropagation();
      if (row.relateBillSn) {
        if (row.relateBillType === '0') {
          this.tabName = 'info';
          this.purchaseId = row.relateBill;
          this.openPurchase = true;
          this.isEdit = false;
        } else if (row.relateBillType === '2') {
          this.purchaseOrderId = row.relateBill;
          this.openPurchaseOrder = true;
          this.$nextTick(() => {
            this.$refs.orderinfo.getOrderInfo();
          });
          this.isEdit = false;
          this.isRalateBill = true;
        } else {
          this.tabName = 'orderSaleInfo';
          this.orderSaleId = row.relateBill;
          this.openOrderSale = true;
          this.$nextTick(() => {
            this.$refs.orderSaleInfo.init();
          });
          this.isEdit = false;
        }
      }
    },
    getEditableStoresByAgent() {
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', {
          cooperationType: '1',
          pageSize: 1000,
          pageNumber: 1
        })
        .then(data => {
          this.filters[1].options = [{ value: '', label: '全部' }].concat(
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
    getIsEdit() {
      http
        .get('/admin/invoicing/config/setting.jhtml', { shopId: this.getUser().shop.id })
        .then(data => {
          if (data.purchaseOrder === '0') {
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
    toPass(row, state) {
      this.remarks = '';
      this.row = row;
      this.showPassOrder = true;
    },
    mergeInvoice() {
      this.orderIds = [];
      this.invoiceAmount = 0;
      this.selections.forEach(element => {
        this.orderIds.push(element.id);
        this.invoiceAmount += Number(element.amount);
      });
      this.showApplyInvoice = true;
      this.seller = this.selections[0].supplier.id;
      this.$nextTick(() => {
        this.$refs.applyInvoice.reset();
        this.$refs.applyInvoice.getOrderList();
      });
      // this.tabName = 'invoiceinfo';
      // this.openInvoice = true;
    },
    closeTabByLogistics(sn) {
      this.open = false;
      this.tabName = 'loginfo';
      this.sn = sn;
      this.openPay = false;
      this.openLogistics = true;
      this.$nextTick(() => {
        this.$refs.logistics.getLogisticsInfo();
      });
    },
    closeTabByEvaluate(id, state) {
      this.open = false;
      this.tabName = 'reviewinfo';
      this.itemId = '';
      if (state !== '5') {
        this.editable = false;
      }
      this.openReview = true;
      this.$nextTick(() => {
        this.$refs.reviewinfo.getOrderInfo(id);
      });
    },
    operateSuccess() {
      this.getList();
      this.openPay = false;
    },
    close() {
      this.getList();
      this.openInvoice = false;
    },
    add() {
      this.tabName = 'addinfo';
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.openAdd = true;
    },
    step1Confirm(data) {
      this.supplierId = data.relatePartnerId;
      this.step1 = false;
      this.step2 = true;
      this.step1Data = data;
    },
    step2Confirm(data, subTotal) {
      this.step2 = false;
      this.step3 = true;
      this.step2Data = data;
      this.step2SubTotal = subTotal;
    },
    step3Confirm(orderId, amount) {
      this.tabName = 'payinfo';
      this.itemId = orderId;
      this.openAdd = false;
      this.amountPaid = '0.00';
      this.amount = amount;
      this.amountPayable = amount;
      this.openPay = true;
    },
    stepToOne(data) {
      this.step1 = true;
      this.step2 = false;
      this.$nextTick(() => {
        this.$refs.step1.query();
      });
    },
    stepToTwo() {
      this.step2 = true;
      this.step3 = false;
      this.$nextTick(() => {
        this.$refs.step2.query();
      });
    },
    complate(orderId) {
      this.openAdd = false;
      this.getList();
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    operationSuccess() {
      // this.open = false;
      this.getList();
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
          .post('/admin/purchaseOrderManage/audit.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
      //  + ' ' +
      // (hour < 10 ? '0' + hour : hour) +
      // ':' +
      // (min < 10 ? '0' + min : min) +
      // ':' +
      // (sec < 10 ? '0' + sec : sec);

      return newTime;
    },
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    async printExport() {
      let params = {
        orderId: this.orderId
      };
      try {
        let response = await axios.post('/admin/purchaseOrder/voucher/export/Purchase.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
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
    certificate(row) {
      window.dType = 'purchaseOrder';
      service.certificate(
        {
          orderId: row.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '采购单' : '采购单';
          this.form = data.order;
          this.orderId = row.id;
          this.realName = data.adminCurrent ? data.adminCurrent.realName : '';
          this.userCard = data.userCard;
          this.gridData = data.order.orderItems;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    onChangeDateType(val) {
      switch (val) {
        case '今日订单':
          this.filters[3].value = [dateTime.today(), dateTime.today()];
          break;
        case '近一周订单':
          this.filters[3].value = [dateTime.getBeforeWeek(), dateTime.today()];
          break;
        case '近一月订单':
          this.filters[3].value = [dateTime.getPreOneMonthDay(), dateTime.today()];
          break;
        case '近三月订单':
          this.filters[3].value = [dateTime.getPreThreeMonthDay(), dateTime.today()];
          break;
        default:
          this.filters[3].value = [];
          break;
      }
      this.getList();
    },
    setting() {
      this.$refs.settingInfo.getList();
      this.openSetting = true;
    },
    confirmExport() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        supplierIds: this.filters[0].value,
        dateType: 'createTime',
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[4].value
        },
        orderType: this.orderType,
        agentIds: this.filters[1].value,
        state: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/purchaseOrder/purchaser/order/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/purchaseOrder/purchaser/order/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
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
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      if (ids.length > 0) {
        this.$confirm('您将导出所选记录，共' + ids.length + '条', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmExport();
        });
      } else {
        this.$confirm('您将导出全部记录，共' + this.pagination.total + '条', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmExport();
        });
      }
    },
    rowClick(model, e, column) {
      this.tabName = 'info';
      this.seller = model.supplier.id;
      this.orderState = model.state;
      this.itemId = model.id;
      this.open = true;
      this.price = model.price;
      this.hasSyncOrder = model.hasSyncOrder;
      this.$nextTick(() => {
        this.$refs.info.getOrderInfo();
        this.$refs.info.getInvoiceList();
      });
      this.isPend = false;
      this.isRalateBill = false;
    },
    getSupplier() {
      this.loading = true;
      let params = {
        pageSize: 1000,
        pageNumber: 1,
        searchValue: this.filters[4].value,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0'
      };
      http
        .get(urls.hypermarketMgmt.cooperationInfos, params)
        .then(data => {
          this.loading = false;
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getList() {
      this.loading = true;
      let params = {
        supplierIds: this.filters[0].value,
        dateType: 'createTime',
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[4].value
        },
        orderType: this.orderType,
        agentIds: this.filters[1].value,
        state: this.filters[2].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post(urls.hypermarketMgmt.purchaseOrderList, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    queryKpi() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/purchaseOrder/queryPurchaseOrderKpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待发货${data.data.waitDeliver}条`,
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
    service(row) {
      this.orderState = row.state;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['2'];
      this.open = true;
    },
    paymentHandler(row) {
      this.tabName = 'payinfo';
      this.itemId = row.id;
      this.openLogistics = false;
      this.amountPaid = row.amountPaid;
      this.amount = row.amountPayable;
      this.amountPayable = row.amountPayable;
      this.openPay = true;
    },
    logisticsHandler(row) {
      this.tabName = 'loginfo';
      this.sn = row.shippings[0].sn;
      this.itemId = row.id;
      this.openPay = false;
      this.openLogistics = true;
      this.$nextTick(() => {
        this.$refs.logistics.getLogisticsInfo();
      });
    },
    invoiceHandler(row) {
      console.log('row' + row);
      this.seller = row.supplier.id;
      // this.tabName = 'invoiceinfo';
      this.invoiceAmount = Number(row.amount);
      this.orderIds = [row.id];
      this.updateOrderInfo(row);
      this.updateClickItemSelect(true);
      // this.openPay = false;
      // this.openLogistics = false;
      // this.openInvoice = true;
      this.showApplyInvoice = true;
      this.$nextTick(() => {
        this.$refs.applyInvoice.reset();
        this.$refs.applyInvoice.getOrderList();
      });
    },
    review(row) {
      this.tabName = 'reviewinfo';
      this.orderId = row.id;
      this.openPay = false;
      this.openLogistics = false;
      this.openInvoice = false;
      this.openReview = true;
    },
    confirmOrder(row) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.dType = row.dType;
        service.confirmOrder(
          {
            orderId: row.id,
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.getList();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    confirmOrderShipping(row) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          clientType: '2',
          methodName: 'UpdateOrder',
          shopId: this.getUser().shop.id,
          userId: this.getUser().id,
          orderId: row.id,
          type: '1'
        };
        http
          .put(urls.hypermarketMgmt.purchaseOrder, param)
          .then(data => {
            this.$message.success('操作成功');
            this.getList();
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          })
          .finally(() => {});
      });
    },
    closeOrder(row) {
      this.itemId = row.id;
      this.showCloseOrder = true;
      this.curSelectCloseReason = '';
      this.closeDeccription = '';
    },
    cancelClose() {
      this.showCloseOrder = false;
    },
    confirmClose() {
      if (!this.curSelectCloseReason) {
        this.$message.warning('请选择关闭理由');
        return;
      }
      this.showCloseOrder = false;
      this.loading = true;
      let param = {
        clientType: '2',
        methodName: 'UpdateOrder',
        shopId: this.getUser().shop.id,
        userId: this.getUser().id,
        orderId: this.itemId,
        type: 0,
        content: this.curSelectCloseReason
      };
      http
        .put(urls.hypermarketMgmt.purchaseOrder, param)
        .then(data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.getList();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {});
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
      this.operations[3].disabled = true;
      if (val.length > 0) {
        this.operations[3].disabled = false;
      }
      let newArr = [];
      for (let i in this.selections) {
        if (newArr.indexOf(this.selections[i].supplier.id) === -1) {
          newArr.push(this.selections[i].supplier.id);
        }
      }
      if (newArr.length > 1) {
        this.operations[3].disabled = true;
      }
    },
    filterDataChange(filters) {
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
    stateColor(row) {
      if (row.state === '5' || row.state === '7') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getOrderStatus(row) {
      switch (row.state) {
        case '13':
          return '部分发货';
        case '12':
          return '部分支付';
        case '11':
          return '已确认收货';
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
.grid18 {
  height: 20px;
}
.apply-invoice-dialog {
  min-height: 500px;
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
.order-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
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
.order-purchase {
  .biz-popup .popup-content {
    width: 600px;
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
  .el-table__footer {
    .el-table_9_column_52 {
      .cell {
        margin-left: 210px;
      }
    }
  }
  .product-info-content {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    img {
      float: left;
      width: 48px;
      height: 48px;
    }
    .wrapper {
      margin-left: 6px;
      width: 160px;
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
      margin-left: 6px;
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
