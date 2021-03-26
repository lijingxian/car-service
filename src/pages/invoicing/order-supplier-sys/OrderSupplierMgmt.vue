<template>
  <div class="order-mgmt-list-supplier">
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
      @select="select"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      :isMergeInvoice="true"
      @current-change="handleCurrentChange"
      class="order-mgmt-tabel"
    >
      <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column label="订单信息" min-width="215px">
        <template slot-scope="scope">
          <div class="order-content">
            <div style="display:flex">
              <div class="customer-info">{{scope.row.sn}}</div>
              <i class="iconfont biz-icon-i-web-md" style="font-size:32px;color:#ff7300"
                v-if="scope.row.dType==='purchaseOrder'"></i>
              <i class="iconfont biz-icon-i-web-bing" style="font-size:30px;color:#ff7300" v-if="scope.row.isMerged ==='1'"></i>
              <i class="iconfont biz-icon-i-web-zhuan" style="font-size:30px;color:rgb(135, 208, 104)"
                v-if="scope.row.isTransfered ==='1'"></i>
            </div>
            <div>创建日期：{{scope.row.orderTime}}</div>
            <div>状态：
              <span :style="{color: stateColor(scope.row)}">{{getOrderStatus(scope.row)}}</span></div>
            <div class="shop-over">所属店铺：{{scope.row.shop.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="100px" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              不含税：{{scope.row.amountWithoutTax?scope.row.amountWithoutTax:'--'}}
            </div>
            <div class="overflow">
              税额：{{scope.row.tax?scope.row.tax:'--'}}
            </div>
            <div class="overflow">
              含税：{{scope.row.amount?scope.row.amount:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="220px">
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
                    <div class="overflow">单价(不含税)：{{orderItem.priceWithoutTax?orderItem.priceWithoutTax:'--'}}</div>
                    <div>单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.orderItems.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="80">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" v-if="scope.row.type==='9'" @click.stop="refundsHandler(scope.row)">退款</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.type==='11'&&scope.row.shippingWay==='1')||(scope.row.type==='12'&&scope.row.shippingWay==='1')"
              @click.stop="paymentHandler(scope.row)"
            >付款</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="((scope.row.type==='3'&&scope.row.shippingWay==='0')||(scope.row.type==='2'&&scope.row.shippingWay==='1')||(scope.row.type==='13'))"
              @click.stop="shippingHandler(scope.row)"
            >发货</el-button>
            <el-button type="text" size="mini" v-if="scope.row.type!=='6'&&!scope.row.invoiceId" @click.stop="invoiceHandler(scope.row)">开票</el-button>
            <el-button type="text" size="mini" v-if="scope.row.type=='1'||scope.row.type=='2'" @click.stop="closeOrder(scope.row)">关闭</el-button>
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)">凭证</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-popover ref="confirmOrder" placement="top-start" min-width="300" v-model="visiable">
      <p>
        <i class="el-icon-warning" style="color:#ff7300;margin-right:10px"></i>您要确认此订单么?
      </p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text">确定</el-button>
      </div>
    </el-popover>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <base-info
          @xrorder="xrorder"
          :itemId="itemId"
          :isEdit="isEdit"
          :isPend="isPend"
          ref="baseInfo"
          :handler="handler"
          :open="open"
          :activeNames="activeNames"
          @operationSuccess="operationSuccess"
        ></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <product-info :itemId="itemId" :isEdit="isEdit" :open="open" ref="productinfo" @setOrderItems="setOrderItems" @operationSuccess="operationSuccess"></product-info>
      </el-tab-pane>
      <el-tab-pane label="订单进度" name="loginfo" v-if="itemId">
        <order-logs :itemId="itemId" :isEdit="isEdit" ref="loginfo" :paymentMethodName="paymentMethodName" @logistics="logistics"></order-logs>
      </el-tab-pane>
      <el-tab-pane label="物流信息" name="logisticsinfo" v-if="itemId">
        <logistics-info
          :itemId="itemId"
          ref="logisticsinfo"
          :open="open"
          :handler="handler"
          :shippings="shippings"
          @operationSuccess="getList"
          @goToOrderLogs="goToOrderLogs"
        ></logistics-info>
      </el-tab-pane>
      <el-tab-pane label="售后进度" name="afterprocess" v-if="itemId">
        <after-process :itemId="itemId" :isEdit="isEdit" ref="afterprocess" @operationSuccess="operationSuccess"></after-process>
      </el-tab-pane>
      <el-tab-pane label="发票" name="invoice" v-if="itemId&&orderState!=='6'">
        <invoice-info
          :itemId="itemId"
          :invoiceInfoId="invoiceInfoId"
          :invoiceId="invoiceId"
          :price="price"
          :open="open"
          :userId="userId"
          :isEdit="isEdit"
          :orderIds="orderIds"
          ref="invoice"
          @operationSuccess="refreshList"
          :category="'1'"
          :buyerType="'5'" :buyer="getUser().shop.id" :sellerType="'0'" :seller="seller"
        ></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openInvocie" @close="openInvocie=false" v-model="tabName">
      <el-tab-pane label="发票" name="invoice">
        <invoice-info
          :itemId="itemId"
          :invoiceInfoId="invoiceInfoId"
          :invoiceId="invoiceId"
          :price="price"
          :open="openInvocie"
          :userId="userId"
          :isEdit="isEdit"
          :orderIds="orderIds"
          ref="invoice"
          @operationSuccess="refreshList"
          :category="'1'"
          :buyerType="'5'" :buyer="getUser().shop.id" :sellerType="'0'" :seller="seller"
        ></invoice-info>
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
              <div class="grid-content bg-purple">结算时间：{{form.orderTime}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员姓名：{{form.member?form.member.name:''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员电话：{{form.member?form.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.sn" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">会员卡号：{{userCard.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">会员卡余额：{{userCard.balance}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.sn" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">赠送V豆：{{form.giftBean}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">赠送积分：{{form.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="userCard.bean" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">V豆总和：{{userCard.bean}}</div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">积分总和：{{userCard.point}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple" v-if="userCard.sn">抵扣V豆：{{form.bean}}</div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="fullName" label="商品名">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.fullName}}</template>
            </el-table-column>
            <el-table-column property="barCode" label="条码" min-width="200">
              <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
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
    <el-dialog :visible.sync="showCloseOrder" center append-to-body custom-class="close-order-dialog">
      <div>
        <div>请您在与客户沟通一致的前提下使用此功能，订单关闭后，不能恢复</div>
        <div class="reson-container">
          <span class="start">*</span>
          <span>请选择关闭订单的理由：</span>
          <el-select v-model="curSelectCloseReason" placeholder="请选择关闭理由" class="order-select">
            <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
          </el-select>
        </div>
        <div class="deccription">
          <span class="dec-label">备注：</span>
          <el-input v-model="closeDeccription" placeholder="请输入备注" type="textarea" :rows="4"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="cancelClose">取消</el-button>
        <el-button @click="confirmClose">确定关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showIframe" center width="1200px" append-to-body>
      <iframe :src="iframeSrc" frameborder="0" style="height: 600px;width:100%;"></iframe>
    </el-dialog>
    <el-dialog :visible.sync="showApplyInvoice" center append-to-body custom-class="apply-invoice-dialog" width="1000px">
      <apply-invoice :invoiceAmount="invoiceAmount" :orderIds="orderIds" ref="applyInvoice" :category="'1'" :buyerType="'5'" :buyer="getUser().shop.id" :sellerType="'0'" :seller="seller"  @close="showApplyInvoice=false"></apply-invoice>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/order-mgmt/orderMgmt';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import AfterProcess from './AfterProcess';
import OrderLogs from './OrderLogs';
import InvoiceInfo from './InvoiceInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import vueEasyPrint from 'vue-easy-print';
import dateTime from '@/utils/dateTime';
import axios from 'axios';
import LogisticsInfo from './LogisticsInfo';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
import ApplyInvoice from '@/pages/invoicing/purchase-mgmt/purchase-order/components/ApplyInvoice';
export default {
  name: 'OrderMgmtList',
  data() {
    return {
      showApplyInvoice: false,
      invoiceAmount: '',
      iframeSrc: '',
      shippings: '',
      showIframe: false,
      seller: '',
      closeDeccription: '',
      taskId: '',
      t: '',
      percentage: 0,
      curSelectCloseReason: '',
      errorImg: 'this.src="' + require('../../../assets/images/commodity/pic_default_fail.png') + '"',
      curSelectDateType: '全部',
      dateTypeList: ['全部', '今日订单', '近一周订单', '近一月订单', '近三月订单'],
      reasonList: [
        { label: '长时间联系不到客户，交易不成功', value: '长时间联系不到客户，交易不成功' },
        { label: '客户购买意向不明确，取消交易', value: '客户购买意向不明确，取消交易' },
        { label: '客户已通过其他渠道支付款项', value: '客户已通过其他渠道支付款项' },
        { label: '客户不想买了', value: '客户不想买了' },
        { label: '重复订单', value: '重复订单' },
        { label: '缺货，订单无法完成', value: '缺货，订单无法完成' },
        { label: '其他理由', value: '其他理由' }
      ],
      tabName: 'info',
      memberInfo: false,
      openInvocie: false,
      itemId: '',
      userId: '',
      title: '',
      handler: '',
      memberId: { id: '' },
      editShopIds: [],
      isEdit: true,
      isPend: false,
      form: {},
      userCard: {},
      paymentMethodName: '',
      orderType: '',
      orderState: '',
      invoiceState: '',
      invoiceInfoId: '',
      invoiceId: '',
      price: '',
      realName: '',
      defaultTab: '0',
      activeNames: ['1'],
      orderIds: [],
      loading: false,
      visiable: false,
      open: false,
      openSetting: false,
      dialogTableVisible: false,
      selections: [],
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        },
        {
          label: '合并开票',
          name: 'mergeInvioce',
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
          label: '状态',
          name: 'state',
          value: '',
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
            { value: '9', label: '退款退货中' },
            { value: '12', label: '部分支付' },
            { value: '13', label: '部分发货' }
          ]
        },
        {
          type: 'select',
          label: '发票',
          name: 'invoiceState',
          value: '',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '待开票' },
            { value: '1', label: '待邮寄' }
            // { value: 'expressed', label: '已邮寄' },
            // { value: 'completed', label: '已签收' }
          ]
        },
        {
          type: 'select',
          label: '时间类型',
          name: 'dateType',
          value: '0',
          class: 'hidden',
          options: [
            { value: '0', label: '创建时间' },
            { value: '1', label: '完成时间' }
          ]
        },
        {
          type: 'daterange',
          label: '日期',
          class: 'hidden',
          name: 'publishDate',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入订单编号/商品条码/商品名称',
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
      },
      showCloseOrder: false,
      showRecommend: false
    };
  },
  mixins: [ColumnsMixin],
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    ProductInfo,
    vueEasyPrint,
    AfterProcess,
    OrderLogs,
    InvoiceInfo,
    LogisticsInfo,
    ApplyInvoice,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryOrderKpi();
    this.getEditableStores();
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
    goToOrderLogs() {
      this.tabName = 'loginfo';
      this.open = true;
    },
    xrorder() {
      this.iframeSrc = 'http://122.143.21.152/xymx/userinajLoginAction.action?name=jianwl&&pwd=123456';
      this.showIframe = true;
    },
    logistics(vin) {
      this.iframeSrc = 'http://122.143.21.152/xymx/getzaitupageDeliveryAction.action?num=' + vin;
      this.showIframe = true;
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.flag = true;
      this.itemId = '';
      this.getList();
    },
    operationSuccess() {
      this.open = false;
      this.getList();
    },
    getType(orderType) {
      switch (orderType) {
        case '0':
          return '车品订单';
        case '1':
          return '充值订单';
        case '2':
          return '服务订单';
        case '3':
          return '一键救援订单';
        case '4':
          return '服务订单';
        case '5':
          return '服务订单';
        case '6':
          return '预约置换订单';
        case '7':
          return '贷款购车订单';
        case '8':
          return '预约体验订单';
        case '9':
          return '整车订单';
        case '10':
          return '普通订单';
        case '17':
          return '优惠券订单';
        default:
          return '';
      }
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
    getEditableStores() {
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', {
          cooperationType: '0'
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
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    setOrderItems(val) {
      this.tabName = 'info';
      this.$refs.baseInfo.setOrderItems(val);
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
      service.closeOrder(
        {
          orderId: this.itemId,
          shopId: window.top.SHOP_ID || '',
          reason: this.curSelectCloseReason,
          memo: this.closeDeccription
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
    },
    print() {
      this.$refs.easyPrint.print();
    },
    async printExport() {
      let params = {
        orderId: this.orderId
      };
      try {
        let response = await axios.post('/admin/purchaseOrder/voucher/export/settlement.jhtml', params, { responseType: 'blob' });
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
      window.dType = row.dType;
      service.certificate(
        {
          orderId: row.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '结算单' : '结算单';
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
    queryOrderKpi() {
      let params = {
        type: '1',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/purchaseOrderManage/kpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待审核${data.data.dayUnconfirmed}条，待发货${data.data.dayConfirmed}条`,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
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
        orderId: this.$route.query.id || '',
        supplierIds: this.filters[0].value,
        dateType: this.filters[2].value,
        searchValue: this.filters[4].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        invoiceState: this.filters[1].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .post('/admin/purchaseOrderManage/supplierSalesOrders/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/purchaseOrderManage/supplierSalesOrders/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    rowClick(model, e, column) {
      this.seller = model.supplier.id;
      this.tabName = 'info';
      this.orderState = model.type;
      this.itemId = model.id;
      this.userId = model.member.id;
      this.activeNames = ['1'];
      this.open = true;
      this.handler = '';
      this.orderIds = [model.id];
      this.price = 0;
      this.price = (Number(model.amount) + Number(this.price)).toFixed(2);
      this.invoiceInfoId = model.invoiceInfoId;
      this.invoiceId = model.invoiceId;
      window.dType = 'purchaseOrder';
      this.paymentMethodName = model.paymentMethodName;
      this.$nextTick(() => {
        this.$refs.loginfo.refresh(this.itemId);
      });
      this.isPend = false;
      this.shippings = model.shippings;
    },
    getList() {
      let params = {
        orderId: this.$route.query.id || '',
        supplierIds: this.filters[0].value,
        dateType: this.filters[2].value,
        searchValue: this.filters[4].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        invoiceState: this.filters[1].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      http
        .get('/admin/purchaseOrderManage/manage/supplierSalesOrders.jhtml', params)
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
    refreshList() {
      let params = {
        orderId: this.$route.query.id || '',
        // agentId: this.filters[0].value,
        dateType: this.filters[2].value,
        searchValue: this.filters[4].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        invoiceState: this.filters[1].value || '',
        // paymentMethod: this.filters[1].value,
        beginTime: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/purchaseOrderManage/supplierSalesOrders.jhtml', params)
        .then(data => {
          console.log(data);
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    paymentHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['3'];
      this.handler = 'payment';
      this.open = true;
    },
    refundsHandler(row) {
      window.dType = 'purchaseOrder';
      this.orderState = row.type;
      this.itemId = row.id;
      this.tabName = 'afterprocess';
      this.open = true;
      this.$nextTick(() => {
        this.$refs.afterprocess.initData();
      });
    },
    serviceHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'productinfo';
      this.itemId = row.id;
      this.activeNames = ['2'];
      this.handler = 'service';
      this.open = true;
    },
    excuteHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'info';
      this.itemId = row.id;
      this.activeNames = ['2'];
      this.handler = 'service';
      this.open = true;
    },
    // 发货
    shippingHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.tabName = 'logisticsinfo';
      this.itemId = row.id;
      // this.activeNames = ['5'];
      this.handler = 'shipping';
      this.open = true;
      this.$nextTick(() => {
        this.$refs.logisticsinfo.init();
      });
    },
    invoiceHandler(row) {
      window.dType = row.dType;
      this.orderState = row.type;
      this.seller = row.supplier.id;
      this.invoiceAmount = Number(row.amount);
      // this.open = true;
      // this.tabName = 'invoice';
      this.orderIds = [row.id];
      this.itemId = row.id;
      this.userId = row.member.id;
      this.invoiceInfoId = row.invoiceInfoId;
      this.invoiceId = row.invoiceId;
      this.price = row.amount;
      this.showApplyInvoice = true;
      this.$nextTick(() => {
        this.$refs.applyInvoice.reset();
        this.$refs.applyInvoice.getOrderList();
      });
    },
    mergeInvioce() {
      window.dType = 'purchaseOrder';
      this.itemId = this.selections[0].id;
      this.invoiceInfoId = this.selections[0].invoiceInfoId;
      this.invoiceId = this.selections[0].invoiceId;
      this.userId = this.selections[0].member.id;
      this.orderState = '1';
      // this.openInvocie = true;
      this.tabName = 'invoice';
      this.orderIds = [];
      this.price = 0;
      this.selections.forEach(element => {
        this.orderIds.push(element.id);
        this.price = Number(element.amount) + Number(this.price);
      });
      this.price = this.price.toFixed(2);
      this.showApplyInvoice = true;
      this.buyer = this.selections[0].agent.id;
      this.showApplyInvoice = true;
      this.$nextTick(() => {
        this.$refs.applyInvoice.reset();
        this.$refs.applyInvoice.getOrderList();
      });
    },
    closeOrder(row) {
      window.dType = row.dType;
      this.itemId = row.id;
      this.showCloseOrder = true;
      this.curSelectCloseReason = '';
      this.closeDeccription = '';
    },
    select(val, row) {
      console.log(row);
    },
    handleSelectionChange(val) {
      this.operations[2].disabled = true;
      this.selections = val;
      if (val.length > 0) {
        this.operations[2].disabled = false;
      }
      let newArr = [];
      for (let i in this.selections) {
        if (newArr.indexOf(this.selections[i].supplier.id) === -1) {
          newArr.push(this.selections[i].supplier.id);
        }
      }
      if (newArr.length > 1) {
        this.operations[2].disabled = true;
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
      if (row.type === '5' || row.type === '7') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getOrderStatus(row) {
      switch (row.type) {
        case '13':
          return '部分发货';
        case '12':
          return '部分支付';
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
    },
    getInvoiceStatus(row) {
      switch (row.invoiceState) {
        case '5':
          return '已开票';
        case '4':
          return '已撤销';
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
    }
  }
};
</script>

<style lang="scss">
.apply-invoice-dialog {
  min-height: 500px;
}
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
.order-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.order-mgmt-list-supplier {
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
    // width: 25%;
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
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
