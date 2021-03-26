<template>
  <div class="order-mgmt-list-agent">
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
      class="order-mgmt-tabel"
    >
      <div slot="operation" class="operate-container">
        <el-radio-group v-model="curSelectDateType" @change="onChangeDateType" size="mini">
          <el-radio-button v-for="item in dateTypeList" :label="item" :key="item">{{ item }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table-column label="订单" min-width="160px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.orderTime}}</div>
            <div class="overflow">状态：<span :style="{color: stateColor(scope.row)}">{{getOrderStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="120px" prop="amount">
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
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:''}}</div>
                    <div class="overflow">单价(不含税)：{{orderItem.priceWithoutTax?orderItem.priceWithoutTax:'--'}}</div>
                    <div class="overflow">单价(含税)：{{orderItem.price?orderItem.price:'--'}}</div>
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
            <el-button
              type="text"
              size="mini"
              @click.stop="confirmOrder(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&
                (scope.row.state === '4' && scope.row.shippingWay === '0') ||
                  (scope.row.state === '3' && scope.row.shippingWay === '1')
              "
            >确认收货</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="logisticsHandler(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&((scope.row.shippings.length > 0 && scope.row.state !== '5' && scope.row.state !== '6' && scope.row.state !== '7')||(scope.row.shippings.length > 0&&scope.row.state==='13'))"
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
              v-if="scope.row.hasSyncOrder === '0'&&(scope.row.state === '2' || scope.row.state === '1')"
            >取消</el-button>
            <el-button type="text" size="mini" @click.stop="certificate(scope.row)" v-if="scope.row.hasSyncOrder === '0'">凭证</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="invoiceHandler(scope.row)"
              v-if="scope.row.hasSyncOrder === '0'&&scope.row.state !== '6'"
            >申请发票</el-button>
            <el-button type="text" size="mini" @click.stop="review(scope.row)" v-if="scope.row.hasSyncOrder === '0'&&scope.row.state === '5'">评价</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="hasAuthCopy&&scope.row.hasSyncOrder === '0'&&getUser().agent.grade === '0'"
              @click.stop="copy(scope.row)"
            >商品复制</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="openAdd" @close="openAdd = false" v-model="tabName">
      <el-tab-pane label="添加订单" name="addinfo">
        <add-step-2 v-if="step2" @step2Confirm="step2Confirm" :step2Data="step2Data" :step2SubTotal="step2SubTotal" ref="step2"></add-step-2>
        <add-step-3 v-if="step3" @step3Confirm="step3Confirm" @stepToTwo="stepToTwo" @complate="complate"></add-step-3>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <order-info :orderId="itemId" ref="info" @closeTabByLogistics="closeTabByLogistics" @closeTabByEvaluate="closeTabByEvaluate" :category="'0'" :buyerType="'2'" :buyer="getUser().shop.id" :sellerType="'5'" :seller="getUser().shop.id"></order-info>
      </el-tab-pane>
      <el-tab-pane label="子订单信息" name="orderChild" v-if="mergeState === '1'">
        <order-child-info :itemId="itemId" ref="orderChild"></order-child-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openLogistics" @close="openLogistics = false" v-model="tabName">
      <el-tab-pane label="物流追踪" name="loginfo" v-if="sn">
        <logistics-following :orderId="orderId" :sn="sn" ref="logistics"></logistics-following>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPay" @close="openPay = false" v-model="tabName">
      <el-tab-pane label="付款" name="payinfo">
        <pay-info :orderId="orderId" @operateSuccess="operateSuccess" :amountPaid="amountPaid" :amount="amount" :amountPayable="amountPayable"></pay-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openInvoice" @close="openInvoice = false" v-model="tabName">
      <el-tab-pane label="发票" name="invoiceinfo">
        <invoice-info @close="close" :orderIds="orderIds" :invoiceAmount="invoiceAmount" :category="'0'" :buyerType="'2'" :buyer="getUser().shop.id" :sellerType="'5'" :seller="getUser().shop.id"></invoice-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openReview" @close="openReview = false" v-model="tabName">
      <el-tab-pane label="评价" name="reviewinfo">
        <my-evaluate :orderId="orderId" ref="reviewinfo" :editable="editable" @operationSuccess="operationSuccess"></my-evaluate>
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
            <div class="p-title">{{ title }}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{ formatDate(new Date().getTime()) }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">订单编号：{{ form.sn }}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">下单时间：{{ form.orderTime }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收件人：{{ form.consignee }}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">收件人电话：{{ form.phone }}</div>
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
                <div v-else>{{ scope.$index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column property="fullName" label="商品名称">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{ scope.row.fullName }}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="商品条码">
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">￥{{ scope.row.subTotal }}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="3">
              <div class="grid-content bg-purple">运费：￥{{ form.freight }}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple">优惠金额：￥{{ form.couponDiscount }}</div>
            </el-col>
            <!-- <el-col :span="5">
              <div class="grid-content bg-purple">V豆抵扣：￥{{form.beanDiscount}}</div>
            </el-col>-->
            <el-col :span="5">
              <div class="grid-content bg-purple">调整金额：￥{{ form.offsetAmount }}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">实收金额：￥{{ form.amountPaid }}</div>
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
      <apply-invoice :invoiceAmount="invoiceAmount" :orderIds="orderIds" ref="applyInvoice" :category="'0'" :buyerType="'2'" :buyer="getUser().shop.id" :sellerType="'5'" :seller="getUser().shop.id"  @close="showApplyInvoice=false"></apply-invoice>
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
    <el-dialog :visible.sync="showConfirm" center append-to-body custom-class="close-order-dialog">
      <div>
        <div style="font-size:16px;font-weight:bold;">
          <i class="el-icon-warning" style="padding:10px;color:#ff7300"></i>所选商品您店铺已存在，确认重复创建？
        </div>
        <div style="margin-top:10px;margin-left:35px">您所选的商品中有商品已在您店铺存在，商品名称一致。</div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showConfirm = false" size="mini" type>取消</el-button>
        <el-button @click="confirmCopy" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showProductCopyOrder" center append-to-body custom-class="close-order-dialog" @close="colseDialog">
      <div>
        <div>是否需要将以下商品复制商品到您的门店？如有需要请选择需要复制的数据，并点击确认。</div>
        <div class="reson-container">
          <span class="start">*</span>
          <span>复制到门店：</span>
          <el-select v-model="shop" class="order-select" size="mini">
            <el-option v-for="shop in shopList" :key="shop.id" :label="shop.name" :value="shop.id"></el-option>
          </el-select>
          <el-table size="small" :data="productList.orderItems" @selection-change="productSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品信息" min-width="200px">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;width:100%" class="product-info-p">
                  <div style="width:100%;margin-right:30px">
                    <img v-if="scope.row.thumbnail && scope.row.thumbnail !== ' '" :src="scope.row.thumbnail" :onerror="errorImg" />
                    <img v-else src="/resources/admin/images/default/product-default-100.png" />
                    <div class="wrapper">
                      <div class="titleClass" :title="scope.row.fullName">{{ scope.row.fullName }}</div>
                    </div>
                    <div class="info-bottom">
                      <div style="margin-left:7px">{{ scope.row.sn }}</div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="cancelClose" size="mini" type="primary">取消</el-button>
        <el-button @click="confirm" size="mini" type="primary">确定</el-button>
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
import dateTime from '@/utils/dateTime';
import LogisticsFollowing from './LogisticsFollowing';
import OrderInfo from './OrderInfo';
import PayInfo from './PayInfo';
import InvoiceInfo from './InvoiceInfo';
import MyEvaluate from './MyEvaluate';
import AddStep2 from './AddStep2';
import AddStep3 from './AddStep3';
import OrderChildInfo from './OrderChildInfo';
import axios from 'axios';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
import ApplyInvoice from '@/pages/invoicing/purchase-mgmt/purchase-order/components/ApplyInvoice';
export default {
  name: 'OrderMgmtList',
  data() {
    return {
      seller: '',
      sn: '',
      shop: '',
      amountPaid: '',
      amount: '',
      amountPayable: '',
      closeDeccription: '',
      curSelectCloseReason: '',
      showApplyInvoice: false,
      editable: true,
      step2: true,
      step3: false,
      taskId: '',
      t: '',
      percentage: 0,
      showProductCopyOrder: false,
      showConfirm: false,
      productList: {
        orderItems: []
      },
      shopList: [],
      mergeState: '',
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
      errorImg: 'this.src="' + require('../../../assets/images/commodity/pic_default_fail.png') + '"',
      showCloseOrder: false,
      curSelectDateType: '全部',
      dateTypeList: ['全部', '今日订单', '近一周订单', '近一月订单', '近三月订单'],
      tabName: 'info',
      itemId: '',
      invoiceAmount: 0,
      invoiceInfoId: '',
      invoiceId: '',
      orderId: '',
      orderIds: [],
      title: '',
      form: {},
      userCard: {},
      orderType: '',
      orderState: '',
      invoiceState: '',
      price: '',
      realName: '',
      defaultTab: '0',
      activeNames: ['1'],
      loading: false,
      open: false,
      dialogTableVisible: false,
      openPay: false,
      openLogistics: false,
      openInvoice: false,
      openReview: false,
      openAdd: false,
      selections: [],
      isConfirm: '0',
      productSelections: [],
      step2Data: [],
      step2SubTotal: '',
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          class: 'show'
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
        },
        {
          label: '合并发票',
          name: 'mergerInvoice',
          type: '',
          disabled: true
        }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
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
            { value: '8', label: '已过期' },
            { value: '9', label: '退款退货中' },
            { value: '10', label: '退款退货完成' },
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
      showRecommend: false,
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
    MyEvaluate,
    AddStep2,
    AddStep3,
    OrderChildInfo,
    ApplyInvoice,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryKpi();
    this.getShopList();
  },
  mounted() {
    this.getIsEdit();
  },
  mixins: [ColumnsMixin],
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  watch: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthCopy() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.product');
    },
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
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Order', ['updateOrderInfo', 'updateOrderId', 'updateApplySaleItem', 'updateClickItemSelect']),
    operate(name) {
      this[name]();
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    getIsEdit() {
      http
        .get('/admin/invoicing/config/setting.jhtml', { shopId: this.getUser().shop.id })
        .then(data => {
          if (data.saleOrder === '0') {
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
    copy(row) {
      this.productList = row;
      this.showProductCopyOrder = true;
    },
    colseDialog() {
      this.showProductCopyOrder = false;
      this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: {} });
    },
    add() {
      this.itemId = '';
      this.tabName = 'addinfo';
      this.step2 = true;
      this.step3 = false;
      this.openAdd = true;
    },
    step2Confirm(data, subTotal) {
      this.step2 = false;
      this.step3 = true;
      this.step2Data = data;
      this.step2SubTotal = subTotal;
    },
    step3Confirm(orderId, amount) {
      this.tabName = 'payinfo';
      this.orderId = orderId;
      this.openAdd = false;
      this.amountPaid = '0.00';
      this.amount = amount;
      this.amountPayable = amount;
      this.openPay = true;
    },
    stepToTwo() {
      this.step2 = true;
      this.step3 = false;
      this.$nextTick(() => {
        this.$refs.step2.query();
      });
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    close() {
      this.openInvoice = false;
      this.getList();
    },
    operationSuccess() {
      this.openPay = false;
      this.openReview = false;
      this.getList();
    },
    operateSuccess() {
      this.openPay = false;
      this.openReview = false;
      let params = {
        orderId: this.$route.query.id || '',
        dateType: 'createTime',
        searchValue: this.filters[2].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.hypermarketMgmt.purchaseOrderListAgent, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
          this.productList = this.tableData[0];
          // this.showProductCopyOrder = true;
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
          this.loading = false;
        });
    },
    onChangeDateType(val) {
      switch (val) {
        case '今日订单':
          this.filters[1].value = [dateTime.today(), dateTime.today()];
          break;
        case '近一周订单':
          this.filters[1].value = [dateTime.getBeforeWeek(), dateTime.today()];
          break;
        case '近一月订单':
          this.filters[1].value = [dateTime.getPreOneMonthDay(), dateTime.today()];
          break;
        case '近三月订单':
          this.filters[1].value = [dateTime.getPreThreeMonthDay(), dateTime.today()];
          break;
        default:
          this.filters[1].value = [];
          break;
      }
      this.getList();
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
    complate(orderId) {
      this.openAdd = false;
      this.getList();
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
    mergerInvoice() {
      this.orderIds = [];
      this.invoiceAmount = 0;
      this.selections.forEach(element => {
        this.orderIds.push(element.id);
        this.invoiceAmount = Number(this.invoiceAmount) + Number(element.amount);
      });
      this.showApplyInvoice = true;
      this.showApplyInvoice = true;
      this.$nextTick(() => {
        this.$refs.applyInvoice.reset();
        this.$refs.applyInvoice.getOrderList();
      });
      // this.tabName = 'invoiceinfo';
      // this.openInvoice = true;
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
    setting() {
      this.$refs.settingInfo.getList();
      this.openSetting = true;
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
        dateType: 'createTime',
        searchValue: this.filters[2].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .post('/admin/purchaseOrder/agent/order/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/purchaseOrder/agent/order/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    rowClick(model, e, column) {
      this.tabName = 'info';
      this.orderState = model.state;
      this.mergeState = model.isMerged;
      this.itemId = model.id;
      this.open = true;
      this.price = model.price;
      this.$nextTick(() => {
        this.$refs.info.getOrderInfo();
        this.$refs.info.getInvoiceList();
      });
    },
    getShopList() {
      this.loading = true;
      let params = {};
      http
        .get('/admin/admin/manageShops.jhtml', params)
        .then(data => {
          this.shopList = data.dataList;
          // 修改bug 34115
          // for (let i = 0; i < data.dataList.length; i++) {
          //   if (data.dataList[i].id === this.getUser().shop.id) {
          //     this.shopList.splice(i, 1);
          //   }
          // }
          this.shop = this.shopList[0].id;
          this.loading = false;
        })
        .catch(errData => {
          errData.errorMessage !== '店铺不存在' && this.$message.warning(errData.errorMessage);
          this.loading = false;
        });
    },
    getList() {
      this.loading = true;
      let params = {
        orderId: this.$route.query.id || '',
        dateType: 'createTime',
        searchValue: this.filters[2].value,
        orderType: this.orderType,
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] ? this.filters[1].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[1].value[1] ? this.filters[1].value[1] + ' ' + '23:59:59' : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.hypermarketMgmt.purchaseOrderListAgent, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          if (this.$route.query.isShowDialog && this.getUser().agent.grade === '0' && this.hasAuthCopy) {
            let that = this;
            setTimeout(() => {
              that.productList = this.tableData[0];
              that.showProductCopyOrder = true;
            }, 500);
          }
          this.loading = false;
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
          this.loading = false;
        });
    },
    queryKpi() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/purchaseOrder/agent/queryAgentPurchaseKpi.jhtml', params)
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
    paymentHandler(row) {
      this.tabName = 'payinfo';
      this.orderId = row.id;
      this.openLogistics = false;
      this.openReview = false;
      this.openInvoice = false;
      this.amountPaid = row.amountPaid;
      this.amount = row.amountPayable;
      this.amountPayable = row.amountPayable;
      this.openPay = true;
    },
    logisticsHandler(row) {
      this.tabName = 'loginfo';
      this.sn = row.shippings[0].sn;
      this.orderId = row.id;
      this.openPay = false;
      this.openReview = false;
      this.openInvoice = false;
      this.openLogistics = true;
      this.$nextTick(() => {
        this.$refs.logistics.getLogisticsInfo();
      });
    },
    invoiceHandler(row) {
      // this.tabName = 'invoiceinfo';
      this.orderId = row.id;
      this.invoiceAmount = Number(row.amount);
      this.updateOrderInfo(row);
      this.updateClickItemSelect(true);
      this.openPay = false;
      this.openLogistics = false;
      this.openReview = false;
      // this.openInvoice = true;
      this.orderIds = [row.id];
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
            this.loading = false;
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
      this.showProductCopyOrder = false;
      this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: {} });
    },
    confirmCopy() {
      this.isConfirm = '1';
      this.confirm();
      this.showConfirm = false;
    },
    confirm() {
      if (this.productSelections.length === 0) {
        this.$message.warning('请选择商品');
        return;
      }
      if (this.shop === '') {
        this.$message.warning('请选择店铺');
        return;
      }
      this.loading = true;
      let ids = [];
      this.productSelections.map(item => {
        ids.push(item.product.id);
      });
      let params = {
        shopIds: [this.shop],
        ids: ids,
        isConfirmed: this.isConfirm
      };
      http
        .post('/admin/shopProduct/purchse/clone.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.showProductCopyOrder = false;
          this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: {} });
          this.loading = false;
        })
        .catch(ErrorData => {
          // this.$message.warning(ErrorData.errorMessage);
          this.showConfirm = true;
          this.loading = false;
        })
        .finally(() => {});
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
          this.loading = false;
        })
        .finally(() => {});
    },
    handleSelectionChange(val) {
      this.operations[3].disabled = true;
      this.selections = val;
      if (val.length > 0) {
        this.operations[3].disabled = false;
      }
    },
    productSelectionChange(val) {
      this.productSelections = val;
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
.product-info-p {
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
.order-mgmt-list-agent {
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
