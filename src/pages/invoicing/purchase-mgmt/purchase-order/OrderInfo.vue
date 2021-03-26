<template>
  <biz-grid class="order-info">
    <div class="order-info-div">
      <div class="order-info-content">
        <div class="order-top-content">
          <div class="order-follow-up" @click="onOrderTrack(orderInfo.id)">
            <span>订单跟踪</span>
            <div class="order-state">
              <span>{{getOrderPaymentState}}</span>
              <i style="margin-left:10px;color:#808080;" class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="receiver-info" v-if="orderInfo.consignee">
            <span>{{orderInfo.consignee}}</span>
            <span>{{orderInfo.phone}}</span>
            <p>
              <i style="margin-right:5px;" class="el-icon-location-outline"></i>
              {{orderInfo.areaName?orderInfo.areaName+orderInfo.address:orderInfo.address}}
            </p>
          </div>
          <div class="order-num" v-if="orderInfo.appointmentEndDate">
            <span>到店时间：</span>
            <span>{{orderInfo.appointmentDate}}-{{orderInfo.appointmentEndDate.slice(11, 20)}}</span>
          </div>
          <div v-if="orderInfo.orderType === '6'" class="buy-car">
            <div class="buy-car-detail">
              <span>心仪车型</span>
              <span>{{orderInfo.orderItems[0].appointment?orderInfo.orderItems[0].appointment.productName:''}}</span>
            </div>
            <div class="buy-car-detail">
              <span>已有车型</span>
              <span>{{orderInfo?orderInfo.orderItems[0].appointment.car.type:''}}</span>
            </div>
          </div>
          <div v-if="orderInfo.orderType === '7'" class="buy-car">
            <div class="buy-car-detail">
              <span>心仪车型</span>
              <span>{{orderInfo.orderItems[0].appointment?orderInfo.orderItems[0].appointment.productName:''}}</span>
            </div>
            <div class="buy-car-detail">
              <span>裸车价格</span>
              <span>￥{{orderInfo.orderItems[0].appointment.product.price}}</span>
            </div>
            <div class="buy-car-detail">
              <span style="white-space:nowrap;">首付{{getDownPayment}}</span>
              <span>￥{{getInitPay}}</span>
            </div>
            <div class="buy-car-detail">
              <span>月供</span>
              <span>￥{{getMonthPaidNum}}</span>
            </div>
          </div>
          <div v-if="orderInfo.orderType === '8'" class="buy-car">
            <div class="buy-car-detail">
              <span>体验车型</span>
              <span>{{orderInfo.orderItems[0].appointment?orderInfo.orderItems[0].appointment.productName:''}}</span>
            </div>
            <div class="buy-car-detail">
              <span>预约时间</span>
              <span>{{orderInfo.orderItems[0].appointment?orderInfo.orderItems[0].appointment.appontmentDate.slice(0,10):''}}</span>
            </div>
          </div>
          <!-- <div class="order-follow-up" v-if="orderInfo.invoiceTitle" @click="selectInvoice">
            <span>发票抬头</span>
            <div class="order-state" style="color:#808080;">
              <span>{{orderInfo.invoiceTitle?orderInfo.invoiceTitle:'无'}}</span>
              <i style="margin-left:10px;color:#808080;" class="el-icon-arrow-right"></i>
            </div>
          </div> -->
        </div>
        <div class="order-info-new">
          <div class="shop-name" @click="goShop">
            <img :src="iconShop" />
            <span style="fontSize:14px">{{orderInfo.shop?orderInfo.shop.name:''}}</span>
          </div>
          <div v-for="(item, index) of orderInfo.orderItems" :key="index">
            <div class="good-info" @click="onClickProduct(item)">
              <div class="goods-img">
                <img :src="item.thumbnail&&item.thumbnail.indexOf('/')>=0?item.thumbnail:defaultImg" @error="imgError(index)" class="img" ref="img" />
              </div>
              <div class="good-right">
                <div class="good-name">
                  <span style="flex:1">{{item.fullName}}</span>
                  <div class="btn-group-div" v-if="showRefund[index]&&!isRalateBill">
                    <div class="btn-group">
                      <span class="btn-good-pay" @click.stop="onRefund(item)" v-if="showRefund[index]&&hasAuthEdit">{{refundsLabel[index]}}</span>
                    </div>
                  </div>
                </div>
                <div style="margin-bottom:10px">
                  <span v-if="item.product.barCode" style="font-size: 14px;margin-right:10px">{{item.product.barCode}}</span>
                </div>
                <div class="good-price">
                  <span>￥{{item.price}}</span>
                  <span>X{{item.quantity}}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="orderInfo.isSubscription==='1'&&!activity.activityId" class="subscription">
            <p>
              阶段1：订金￥{{orderInfo.amountPrepay}} &nbsp;&nbsp;
              <span
                :class="{'tips':parseFloat(orderInfo.amountPaid)<=0}"
              >{{parseFloat(orderInfo.amountPaid)>0?'已支付':'未支付'}}</span>
            </p>
            <p>
              阶段2：尾款￥{{orderInfo.amountFinalpay}} &nbsp;&nbsp;
              <span
                :class="{'tips':parseFloat(orderInfo.amountPayable)!==0}"
              >{{parseFloat(orderInfo.amountPayable)===0?'已支付':'未支付'}}</span>
            </p>
          </div>
        </div>
        <div class="price-info-content">
          <div class="total-price">
            <span>产品总额</span>
            <span>￥{{getAmount}}</span>
          </div>
          <div class="total-price">
            <span>邮费</span>
            <span>+ ￥{{orderInfo.freight}}</span>
          </div>
          <div class="total-price" v-if="parseFloat(orderInfo.couponDiscount)>0">
            <span>优惠</span>
            <span>- ￥{{orderInfo.couponDiscount}}</span>
          </div>
          <div class="total-price" v-if="parseFloat(getOffsetAmount)>0">
            <span>商家调整</span>
            <span>{{getOffsetAmount}}</span>
          </div>
          <!-- <div class="total-price" v-if="parseFloat(orderInfo.beanDiscount)>0">
            <span>V豆</span>
            <span>- ￥{{orderInfo.beanDiscount}}</span>
          </div>-->
          <div class="total-price" v-if="orderInfo.type==='1'">
            <span>需付款</span>
            <span class="color">￥{{orderInfo.amountPayable}}</span>
          </div>
          <div class="total-price" v-else>
            <span>已付款</span>
            <span class="color">￥{{orderInfo.amountPaid}}</span>
          </div>
        </div>
        <div class="pay-type">
          <span>订单编号：{{orderInfo.sn}}</span>
          <span v-if="orderInfo.paymentMethodName">支付方式：{{orderInfo.paymentMethodName}}</span>
          <span v-if="orderInfo.shippingMethodName">配送方式：{{orderInfo.shippingMethodName}}</span>
          <div v-if="orderInfo.memo" class="message">
            <span class="label">买家留言：</span>
            <span class="buy-message" style="margin-left:-3px">{{orderInfo.memo}}</span>
          </div>
          <span>下单时间：{{orderInfo.orderTime}}</span>
          <span v-if="orderInfo.payments&&orderInfo.payments.length">付款时间：{{orderInfo.payments[0].paymentDate}}</span>
          <span v-if="orderInfo.deliverDate">预计到货时间：{{orderInfo.deliverDate}}</span>
        </div>
        <!-- <v-shop-info :shop="orderInfo.shop" :action="!isShare">
        </v-shop-info>-->
        <el-card v-for="(invoice) in invoiceList" :key="invoice.id" class="invoice-content">
          <div style="display:flex;justify-content: space-between;">
            <div class="radio-i">
              <div>
                <div class="default">
                  <span>发票抬头：</span>
                  <span>{{invoice.invoiceTitle}}</span>
                </div>
                <div style="padding-top:10px">
                  <span>发票类型：</span>
                  <span>{{invoice.type==='0'?'个人':invoice.type==='1'?'增值税普通发票':invoice.type==='2'?'增值税专用发票':''}}</span>
                </div>
                <div style="padding:10px 0px">
                  <span>发票金额：</span>
                  <span>{{invoice.price}}</span>
                </div>
                <div>
                  <span>发票状态：</span>
                  <span>{{invoice.state==='0'?'未开票':'已开票'}}</span>
                </div>
              </div>
            </div>
            <div class="bottom-d">
              <span @click.stop="query(invoice)">详情</span>
              <!-- <span @click.stop="deleteItem(invoice.id)" v-if="invoice.state==='1'">删除</span> -->
            </div>
          </div>
        </el-card>
      </div>
      <div class="order-bottom">
        <!-- <div class="footer-left">
          <div class="call-service" @click="onConsultation">
            <span class="iconfont icon-i-sh-man-kf"></span>
            <span>联系客服</span>
          </div>
          <div class="call-service" @click="handleCartClick">
            <span class="iconfont icon-i-ec-man-gwc"></span>
            <span>购物车</span>
          </div>
        </div>-->
      </div>
      <!-- <hy-dialog :show.sync="showDialog" type="confirm" @confirm="confirmReceive">
          <template slot="content">
            <div style="text-align:center;padding-top:10px;">
              请确认是否已经收到货物
            </div>
          </template>
      </hy-dialog>-->
    </div>
    <div slot="bottom" style="float: right;" v-if="hasAuthEdit">
      <el-button type="primary" size="mini" @click.stop="onLookLogistics(orderInfo.shippings?orderInfo.shippings[0].sn:'')" v-if="showLogistics">物流跟踪</el-button>
      <el-button
        type="primary"
        size="mini"
        @click.stop="confirmOrder(orderInfo)"
        v-if="((orderInfo.state==='4'&&orderInfo.shippingWay==='0')||(orderInfo.state==='3'&&orderInfo.shippingWay==='1')) && orderInfo.hasSyncOrder === '0'"
      >确认收货</el-button>
      <el-button type="primary" size="mini" @click.stop="onReview(orderInfo.id,orderInfo.state)" v-if="this.hasSyncOrder==='0'&&orderInfo.state==='5'">立即评价</el-button>
      <el-button type="primary" size="mini" @click.stop="onLookEvaluate(orderInfo.id,orderInfo.state)" v-if="showLookEvaluate">查看评价</el-button>
    </div>
    <div slot="bottom" v-if="isPend" style="float: right;">
      <el-button
        type="primary"
        size="mini"
        v-if="orderInfo.state==='1'&&((orderInfo.auditState==='1'&& orderInfo.audit==='1') || (orderInfo.auditState==='2'&& orderInfo.audit==='1'))"
        @click.stop="toPass(orderInfo)"
      >审核</el-button>
    </div>
    <el-dialog :visible.sync="showInvoiceExpress" append-to-body custom-class="close-invoice-dialog" title="发票详情" v-loading="loading" width="800px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-form :model="formModel" :inline="true" ref="form" label-width="125px" size="small">
            <el-form-item label="发票类型：" prop="">
              {{formModel.type==='0'?'个人':formModel.type==='1'?'增值税普通发票':formModel.type==='2'?'增值税专用发票':''}}
            </el-form-item>
            <el-form-item label="发票抬头：" prop="">
              {{formModel.invoiceTitle}}
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="" v-if="formModel.type!=='0'">
              {{formModel.code}}
            </el-form-item>
            <el-form-item label="电话：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.registerMobile||formModel.mobile}}
            </el-form-item>
            <el-form-item label="开户行：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.bank}}
            </el-form-item>
            <el-form-item label="账号：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.account}}
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="2" title="获取方式">
          <el-form :model="formModel" :inline="true" ref="form" label-width="125px" size="small">
            <el-form-item label="获取方式：" prop="invoiceMode">
              {{formModel.obtainType==='0'?'纸质发票':'电子发票'}}
            </el-form-item>
            <el-form-item label="是否邮寄：" prop="needMail">
              {{formModel.needMail==='1'?'是':'否'}}
            </el-form-item>
            <el-form-item label="联系人：" prop="contacts" v-if="formModel.needMail==='1'">
              {{formModel.contacts}}
            </el-form-item>
            <el-form-item label="联系电话：" prop="mobile" v-if="formModel.needMail==='1'">
              {{formModel.mobile}}
            </el-form-item>
            <el-form-item label="所在地" prop="area" v-if="formModel.needMail==='1'">
              {{formModel.areaName}}{{formModel.address}}
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="3" title="发票明细">
          <el-table :data="tableData" height="450" border style="width: 100%" size="small">
            <el-table-column prop="orderSn" label="订单编号" min-width="100">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    {{scope.row.orderSn}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品" min-width="100">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    {{scope.row.name}}
                  </div>
                  <div class="overflow">
                    {{scope.row.product.barCode}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量" min-width="60px">
              <template slot-scope="scope">
                {{scope.row.quantity}}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" min-width="140px">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    不含税单价：{{scope.row.priceWithoutTax}}
                  </div>
                  <div class="overflow">
                    含税单价：{{scope.row.price}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率" min-width="50px">
            </el-table-column>
            <el-table-column prop="" label="金额" min-width="140px">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    不含税金额：{{scope.row.quantity?scope.row.quantity*scope.row.priceWithoutTax:''}}
                  </div>
                  <div class="overflow">
                    税额：{{scope.row.tax}}
                  </div>
                  <div class="overflow">
                    含税金额：{{scope.row.quantity?scope.row.quantity*scope.row.price:''}}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
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
    <el-dialog :visible.sync="dialogVisiable" append-to-body custom-class="bill-dialog">
      <my-invoice ref="invoice"></my-invoice>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiableLog" append-to-body custom-class="bill-dialog">
      <order-track ref="track"></order-track>
    </el-dialog>
    <el-dialog :visible.sync="dialogApplaySale" title="售后" center append-to-body>
      <apply-sale @operationSuccess="operationSuccess" ref="applySale" :itemId="orderItemId" :isEditable="isEditable"></apply-sale>
    </el-dialog>
    <el-dialog :visible.sync="dialogApplayRefundInfo" append-to-body>
      <refund-info
        @operationSuccess="operationSuccess"
        ref="refundInfo"
        :itemId="itemId"
        :dialogApplayRefundInfo="dialogApplayRefundInfo"
        @applySaleHanlder="applySaleHanlder"
      ></refund-info>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import defaultImg from '@/assets/images/commodity/pic_default_none.png';
import defaultFailImg from '@/assets/images/commodity/pic_default_fail_100.png';
import iconShop from '@/assets/images/store.png';
import MyInvoice from './MyInvoice';
import OrderTrack from './OrderTrack';
import ApplySale from './ApplySale';
import RefundInfo from './RefundInfo';
export default {
  name: 'order-info',
  data() {
    return {
      auditState: '1',
      remarks: '',
      row: {},
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
      activeNames: ['1'],
      invoiceList: [],
      formModel: this.resetForm(),
      showInvoiceExpress: false,
      tableData: [],
      iconShop: iconShop,
      defaultImg: defaultImg,
      defaultFailImg: defaultFailImg,
      maxlength: 6,
      passValue: '',
      loading: false,
      dialogVisiable: false,
      openCancel: false,
      open: false,
      showPayment: false,
      showPayDeposit: false,
      showFinalPayment: false,
      showCancelOrder: false,
      showBalancePay: true,
      thirdPay: true,
      showRefund: [],
      showLogistics: false,
      showReceive: false,
      showLookEvaluate: false,
      showEvaluate: false,
      showDialog: false,
      refundsLabel: [],
      showCreatInvoice: false,
      dialogVisiableLog: false,
      dialogApplaySale: false,
      dialogApplayRefundInfo: false,
      showPassOrder: false,
      isEditable: true,
      itemId: '',
      orderItemId: ''
    };
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    isPend: {
      type: Boolean,
      default: false
    },
    hasSyncOrder: {
      type: String,
      default: ''
    },
    isRalateBill: {
      type: Boolean,
      default: false
    },
    openOrder: {
      type: Boolean,
      default: false
    },
    category: {
      type: String
    },
    buyerType: {
      type: String
    },
    buyer: {
      type: String
    },
    seller: {
      type: String
    },
    sellerType: {
      type: String
    }
  },
  watch: {},
  mounted() {
    this.getInvoiceList();
  },
  components: { BizGrid, MyInvoice, OrderTrack, ApplySale, RefundInfo },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('RecentActivity', ['activity', 'shop', 'product']),
    ...mapGetters('Order', ['orderConfim', 'orderInfo', 'routerFrom', 'curApplySaleItem']),
    ...mapGetters('Order', ['orderInfo', 'curInvoice']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:purchaseOrder.edit');
    },
    hasAuthExamine() {
      // return true;
      return this.currentAuth.includes('admin:purchaseOrder.examine');
    },
    getOffsetAmount() {
      let amount = this.orderInfo.offsetAmount;
      if (amount) {
        if (Number(amount) >= 0) {
          return '+ ￥' + amount;
        } else {
          return '- ￥' + amount.substr(1, amount.length - 1);
        }
      }
      return '';
    },
    getAmount() {
      let ary = this.orderInfo.orderItems;
      let len;
      let amount = 0;

      if (ary) {
        len = ary.length;
      }
      for (let i = 0; i < len; i++) {
        amount += ary[i].price * ary[i].quantity;
      }

      return amount.toFixed(2);
    },
    getOrderPaymentState() {
      if (this.orderInfo.afterSaleStatus === '1') {
        return '退货退款中';
      }

      switch (this.orderInfo.type) {
        case '1':
          return '待付款';
        case '2':
          return '待收货';
        case '3':
          return '已完成';
        case '5':
          if (
            this.orderInfo.orderType === '4' ||
            this.orderInfo.orderType === '5' ||
            this.orderInfo.orderType === '6' ||
            this.orderInfo.orderType === '7' ||
            this.orderInfo.orderType === '8'
          ) {
            return '商家已确认';
          } else {
            return '待发货';
          }
        case '6':
          return '已完成';
        case '7':
          return '已关闭';
        case '8':
          return '订单过期';
        case '9':
          return '退款退货中';
        case '10':
          return '退款退货完成';
        case '11':
          return '待商家确认';
        default:
          return '';
      }
    },
    getDownPayment() {
      let appointment = this.orderInfo.orderItems[0].appointment;
      let downPayment = parseFloat(appointment.downPayment) + '%';
      return downPayment;
    },
    getInitPay() {
      let appointment = this.orderInfo.orderItems[0].appointment;
      let count = parseFloat(appointment.product.price);
      let initPay = parseFloat(appointment.downPayment) * count * 0.01;
      return initPay.toFixed(2);
    },
    getMonthPaidNum() {
      let appointment = this.orderInfo.orderItems[0].appointment;
      let count = parseFloat(appointment.product.price);
      let initPay = parseFloat(appointment.downPayment) * count * 0.01;
      let monthNum = parseInt(appointment.year) * 12;
      let loanAmount = count - initPay;
      let monthRat = parseFloat(parseFloat(appointment.rate) / 12);
      let denominator = Math.pow(1 + monthRat, monthNum) - 1;
      if (denominator === 0) {
        return (0.0).toFixed(2);
      }
      let monthPay = (loanAmount * monthRat * Math.pow(1 + monthRat, monthNum)) / (Math.pow(1 + monthRat, monthNum) - 1);
      return monthPay.toFixed(2);
    }
  },
  methods: {
    ...mapMutations('Order', ['updateOrderInfo', 'updateOrderId', 'updateApplySaleItem', 'updateClickItemSelect']),
    // 加载失败，替换为默认图片
    imgError(index) {
      if (this.$refs.img && this.$refs.img[index]) {
        this.$refs.img[index].src = this.defaultFailImg;
      }
    },
    resetForm() {
      return {
        id: '',
        invoiceCode: '',
        invoiceNum: '',
        type: '1',
        category: '0',
        buyerType: '',
        relateUnitBank: '1',
        buyer: '',
        buyerName: '',
        state: '0',
        sellerType: '0',
        seller: '',
        invoiceDate: '',
        remarks: ''
      };
    },
    // 查询发票信息
    query(row) {
      this.loading = true;
      let params = {
        id: row.id
      };
      http
        .get('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.loading = false;
          this.formModel = Object.assign(this.resetForm(), data.data);
          this.tableData = data.data.items || [];
          this.showInvoiceExpress = true;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
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
          .delete('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', { ids: [ids] })
          .then(data => {
            this.$message.success('删除成功');
            this.getInvoiceList();
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
    getInvoiceList() {
      let params = {
        pageSize: 1000,
        pageNumber: 1,
        seller: this.seller,
        buyer: this.buyer,
        category: this.category,
        orderId: this.orderId
      };
      http
        .get('/admin/invoicing/invoiceRecord/list.jhtml', params)
        .then(data => {
          this.invoiceList = data.dataList;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          this.loading = false;
        });
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
          .post('/admin/purchaseOrderManage/audit.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.$emit('closeTabByAudit');
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
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
          })
          .finally(() => {});
      });
    },
    applySaleHanlder(val, id) {
      this.isEditable = val;
      this.dialogApplaySale = true;
      this.$nextTick(() => {
        this.$refs.applySale.getParams(id);
      });
    },
    operationSuccess() {
      this.dialogApplaySale = false;
      this.dialogApplayRefundInfo = false;
      this.getOrderInfo();
    },
    // 跳转到店铺介绍页面
    goShop() {
      // this.$router.push({
      //   path: `/shop-about/${this.orderInfo.shop.id}`
      // });
    },
    // 跳转到购物车页面
    handleCartClick(e) {
      this.$router.push({
        path: '/cart'
      });
    },
    // toast提示
    showToast(str) {
      this.$createToast({
        time: 1000, // 显示的时间
        txt: str, // 提示信息
        type: 'warn' // 提示类型
      }).show(); // 显示提示信息
    },
    selectInvoice() {
      if (!this.orderInfo.invoiceTitle && this.orderInfo.type === '1') {
        this.$message.warning('本订单暂无发票信息，付款后支持补开发票');
      } else {
        this.dialogVisiable = true;
        this.$nextTick(() => {
          this.$refs.invoice.getInvoiceInfo();
          // if (this.curInvoice.expressCode) {
          //   this.$refs.invoice.expressInfo();
          // }
        });
      }
    },
    hideCancel() {
      this.openCancel = false;
    },
    onCancel() {
      this.open = false;
    },
    successHandle(data) {
      this.getOrderInfo();
    },
    onOrderTrack(id) {
      this.dialogVisiableLog = true;
      this.$nextTick(() => {
        this.$refs.track.getLogs(id);
      });
    },
    onConsultation() {
      this.$router.push({ path: '/custom-service' });
    },
    onPay() {
      this.open = true;
    },
    onCancelPay() {
      this.openCancel = true;
    },
    onConfirm(selected) {
      let param = {
        clientType: '2',
        methodName: 'UpdateOrder',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderInfo.id,
        type: 0,
        content: selected
      };

      http
        .put(urls.order.cancelOrder, param)
        .then(data => {
          if (this.routerFrom) {
            this.$router.replace({ path: this.routerFrom });
          } else {
            this.openCancel = false;
            this.$router.go(-1);
            this.getOrderInfo();
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
    getOrderInfo() {
      this.updateOrderId(this.orderId);
      this.open = false;
      let param = {
        clientType: '2',
        methodName: 'QueryOrderDetail',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderInfo.id
      };

      http
        .get(urls.hypermarketMgmt.queryOrder, param)
        .then(data => {
          console.log('订单信息1', data);
          this.updateOrderInfo(data.order);

          // 充值类订单不显示会员卡余额支付
          if (this.orderInfo.orderType === '1' || this.orderInfo.orderType === '13') {
            this.showBalancePay = false;
          } else {
            this.showBalancePay = true;
          }
          // 支付金额为0的订单不显示第三方支付
          if (!parseFloat(this.orderInfo.amountPayable)) {
            this.thirdPay = false;
          } else {
            this.thirdPay = true;
          }

          // 补开发票按钮的显隐
          if (
            (this.orderInfo.paymentStatus === '2' || this.orderInfo.paymentStatus === '3') &&
            parseFloat(this.orderInfo.amount) > 0 &&
            !this.orderInfo.invoiceTitle
          ) {
            this.showCreatInvoice = true;
          } else {
            this.showCreatInvoice = false;
          }

          this.showRefund = [];
          let item = data.order;
          let ary = item.orderItems;
          let len = ary.length;
          let i;
          for (i = 0; i < len; i++) {
            this.showRefund.push(false);
            this.refundsLabel.push('');
          }

          // 物流跟踪按钮显示
          if (item.shippings.length > 0 && item.state !== '5' && item.state !== '6' && item.state !== '7') {
            this.showLogistics = true;
          } else {
            this.showLogistics = false;
          }

          for (i = 0; i < len; i++) {
            // 取消订单按钮的显隐
            if (
              ((item.method === '0' || item.method === '2') &&
                item.type === '1' &&
                (item.orderType === '0' ||
                  item.orderType === '2' ||
                  item.orderType === '9' ||
                  item.orderType === '10' ||
                  item.orderType === '3' ||
                  item.orderType === '6' ||
                  item.orderType === '7' ||
                  item.orderType === '8')) ||
              ((item.method === '0' || item.method === '') &&
                (item.orderType === '1' || item.orderType === '13' || item.orderType === '17') &&
                item.type === '1') ||
              ((item.type === '11' || item.type === '5') && (item.orderType === '4' || item.orderType === '5'))
            ) {
              this.showCancelOrder = true;
            } else {
              this.showCancelOrder = false;
            }

            // 立即支付按钮的显隐
            if (
              (item.method === '0' || item.method === '') &&
              (item.orderType === '1' || item.orderType === '13' || item.orderType === '17') &&
              item.type === '1'
            ) {
              this.showPayment = true;
            } else {
              this.showPayment = false;
            }

            if (
              item.method === '0' &&
              (item.orderType === '0' ||
                item.orderType === '2' ||
                item.orderType === '4' ||
                item.orderType === '5' ||
                item.orderType === '9' ||
                item.orderType === '10')
            ) {
              // 待付款
              if (item.type === '1') {
                this.showPayment = false;
                this.showPayDeposit = false;
                this.showFinalPayment = false;
                // 定金订单
                if (item.isSubscription === '1' && !this.activity.activityId) {
                  // 未支付定金
                  if (Number(item.amountPaid) === 0) {
                    this.showPayDeposit = true;
                  } else {
                    if (Number(item.amountPayable) > 0) {
                      this.showFinalPayment = true; // 支付尾款
                      this.showCancelOrder = false;
                    }

                    // 最大可退金额大于0才可退款
                    if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                      this.showRefund[i] = true; // 申请退款
                      this.refundsLabel[i] = '申请售后';
                    }
                  }
                } else {
                  this.showPayment = true;
                }
              } else if (item.type === '2') {
                // 待收货
                // if (item.shippingMethod.isNeedDelivery === '1') {
                //   this.showLogistics = true;
                // } else {
                //   this.showLogistics = false;
                // }
                this.showReceive = true;
                // 最大可退金额大于0才可退款
                if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                  this.showRefund[i] = true; // 申请退款
                  this.refundsLabel[i] = '申请售后';
                }
              } else if (item.type === '3') {
                // 待评价
                this.showEvaluate = true;
                this.showCancelOrder = false;
                this.showReceive = false;
                // this.showLogistics = false;
                // 最大可退金额大于0才可退款
                if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                  this.showRefund[i] = true; // 申请退款
                  this.refundsLabel[i] = '申请售后';
                }
              } else if (item.type === '5') {
                // 最大可退金额大于0才可退款
                if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                  this.showRefund[i] = true; // 申请退款
                  this.refundsLabel[i] = '申请售后';
                }
                this.showFinalPayment = false;
                // this.showLogistics = false;
              } else if (item.type === '6') {
                // 已评价
                // 最大可退金额大于0才可退款
                if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                  this.showRefund[i] = true; // 申请退款
                  this.refundsLabel[i] = '申请售后';
                }
                // this.showLogistics = false;
              }
            }

            if (
              /*  item.method === '2' && */
              item.type === '3' &&
              (item.orderType === '0' ||
                item.orderType === '1' ||
                item.orderType === '2' ||
                item.orderType === '9' ||
                item.orderType === '10' ||
                item.orderType === '3' ||
                item.orderType === '4' ||
                item.orderType === '5' ||
                item.orderType === '6' ||
                item.orderType === '7' ||
                item.orderType === '8' ||
                item.orderType === '13' ||
                item.orderType === '17')
            ) {
              this.showEvaluate = true;
              this.showCancelOrder = false;
              // this.showLogistics = false;
            }

            if (item.isReviewed === '1') {
              this.showLookEvaluate = true;
            } else {
              this.showLookEvaluate = false;
            }

            // 储值订单没有退货功能
            if (this.orderInfo.orderType !== '1' && this.orderInfo.orderType !== '13' && this.orderInfo.orderType !== '17') {
              if (this.orderInfo.type === '6') {
                this.showRefund[i] = true;
                this.refundsLabel[i] = '申请售后';
              } else {
                if (ary[i].refundsState === '0' || ary[i].refundsState === '2' || ary[i].refundsState === '3') {
                  // 退货退款中
                  this.showRefund[i] = true;
                  this.refundsLabel[i] = '退款中';
                } else if (ary[i].refundsState === '5') {
                  // 卖家(收货并)｛退款｝
                  this.showRefund[i] = true;
                  this.refundsLabel[i] = '退款成功';
                } else if (ary[i].refundsState === '6') {
                  // 最大可退金额大于0才可退款
                  if (parseFloat(this.orderInfo.orderItems[i].maxAmountRefundable) > 0) {
                    this.showRefund[i] = true; // 申请退款
                  }
                  this.refundsLabel[i] = '申请售后';
                } else if (ary[i].refundsState === '1' || ary[i].refundsState === '4') {
                  this.showRefund[i] = true;
                  this.refundsLabel[i] = '退款失败';
                }
              }
            }
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
    queryRefunds() {
      this.$router.push({ path: this.$route.path + '/myOrder' });
    },
    // 点击退款回调函数
    onRefund(item) {
      this.updateApplySaleItem(item);
      console.log('申请退款的信息', item);
      if (item.refundsState && item.refundsState !== '6') {
        this.itemId = this.curApplySaleItem.id;
        this.dialogApplayRefundInfo = true;
        this.$nextTick(() => {
          this.$refs.refundInfo.getLogisticsInfo();
        });
      } else {
        this.orderItemId = item.id;
        this.dialogApplaySale = true;
        this.isEditable = true;
        this.$nextTick(() => {
          this.$refs.applySale.getParams();
        });
      }
    },
    // 查看物流回调函数
    onLookLogistics(sn) {
      // this.$router.push({ path: this.$route.fullPath + '/logistics-following' });
      this.$emit('closeTabByLogistics', sn);
    },
    // 确认收货回调函数
    onConfirmReceive() {
      this.showDialog = true;
    },
    // 评价回调函数
    onEvaluate() {
      this.$router.push({ path: '/my-evaluate/' + this.orderInfo.id + '/true' });
    },
    // 查看评价回调函数
    onLookEvaluate(id, state) {
      // this.$router.push({ path: '/my-evaluate/' + this.orderInfo.id + '/false' });
      // this.updateOrderInfo({});
      console.log(1213);
      this.$emit('closeTabByEvaluate', id, state);
    },
    // 立即评价回调
    onReview(id, state) {
      this.$emit('closeTabByEvaluate', id, state);
    },
    onClickProduct(item) {
      // if (item.product) {
      //   this.$router.push({ path: '/vshop/goods/' + item.product.id });
      // }
    },
    confirmReceive() {
      let param = {
        clientType: '2',
        methodName: 'UpdateOrder',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderInfo.id,
        type: '1'
      };

      http
        .put(urls.order.cancelOrder, param)
        .then(data => {
          console.log('确认收货', data);
          this.getOrderInfo();
        })
        .catch(() => {})
        .finally(() => {});
    },
    // 补开发票回调函数
    onCreateInvoice() {
      this.updateClickItemSelect(true);
      this.$router.push({ path: this.$route.fullPath + '/invoiceInfo' });
    }
  },
  created() {}
};
</script>

<style lang="scss">
@mixin flexStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bill-dialog {
  height: 80%;
}
.order-info {
  .btn-group {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .invoice-content {
    font-size: 12px;
    .el-card {
      width: 380px;
      margin: 5px 10px 5px 0px;
      .el-card__body {
        padding: 10px;
      }
    }
    .bottom-d {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      span {
        margin: 0px 10px;
        color: #ff7300;
      }
    }
  }
  .order-info-div {
    height: 100%;
    padding-bottom: 45px;
    .btn-serv {
      padding: 8px 9px;
      border: #808080 solid 1px;
      color: #808080;
      border-radius: 5px;
      display: inline-block;
      font-size: 13px;
    }
    .btn-good-pay {
      padding: 8px 9px;
      border: #ff7300 solid 1px;
      color: #ff7300;
      border-radius: 5px;
      display: inline-block;
      font-size: 13px;
    }
    .btn-pay {
      background: #ff7300;
      color: #fff;
      display: inline-block;
      font-size: 14px;
      min-height: 50px;
      min-width: 80px;
      text-align: center;
      line-height: 50px;
    }
    .btn-orange-pay {
      background: #fddcb3;
      color: #ff7300;
      display: inline-block;
      font-size: 14px;
      min-height: 50px;
      min-width: 80px;
      text-align: center;
      line-height: 50px;
    }

    .order-info-content {
      width: 100%;
      height: 100%;
      .order-top-content {
        background: #fff;
        margin-bottom: 10px;
        .order-follow-up {
          font-size: 15px;
          padding: 10px;
          border-bottom: 1px solid #e3e3e3;
          @include flexStyle;

          .order-state {
            color: #ff7300;
            @include flexStyle;
          }
        }

        .receiver-info {
          padding: 10px;
          border-bottom: 1px solid #e3e3e3;
          span {
            display: inline-block;
            font-size: 13px;
            margin: 0 0 10px 15px;
          }

          p {
            font-size: 13px;
            color: #808080;
            display: flex;
            align-items: center;
          }
        }
        .order-num {
          padding: 10px;
          color: #808080;
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .invoice-info {
          .selecet-invoive {
            padding: 0px 10px;
            min-height: 34px;
            line-height: 34px;
            position: relative;
            font-size: 15px;
            background-color: #fff;
            .link {
              display: flex;
              justify-content: space-between;
              width: 100%;
              color: #808080;
              text-decoration: none;
              outline: 0;
            }

            span {
              position: absolute;
              right: 25px;
            }
          }
        }

        .buy-car {
          padding: 10px 20px 2px 20px;
          color: #808080;
          font-size: 14px;

          .buy-car-detail {
            display: flex;
            align-items: flex-start;

            span:nth-child(1) {
              display: block;
              // text-align: justify;
              width: 73px;
              height: 20px;
              margin-right: 10px;
              &:after {
                content: '';
                display: inline-block;
                width: 100%;
              }
            }

            span:nth-child(2) {
              display: block;
              width: 79%;
            }
          }
        }
      }

      .order-info-new {
        width: 100%;
        font-size: 14px;
        padding: 10px;
        background: #fff;
        margin-bottom: 10px;
        border-bottom: 1px solid #e3e3e3;
        .shop-name {
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e3e3e3;
          img {
            width: 18px;
            margin-right: 10px;
          }
        }

        .good-info {
          width: 100%;
          display: flex;
          align-items: center;
          margin-top: 10px;

          .goods-img {
            width: 80px;
            height: 80px;
            overflow: hidden;
            display: flex;
            flex-grow: 0;
            flex-direction: row;
            align-items: center;
            margin-right: 10px;
            img {
              display: inline-block;
              width: 80px;
              height: 70px;
              vertical-align: middle;
            }
          }

          .good-right {
            width: calc(100% - 80px);

            .good-name {
              margin-bottom: 10px;
              display: block;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .color-mater {
              color: #808080;
              font-size: 12px;
              margin-bottom: 10px;
            }

            .good-price {
              @include flexStyle;

              span:nth-child(1) {
                color: red;
                display: inline-block;
              }

              span:nth-child(2) {
                color: #808080;
                display: inline-block;
              }
            }
          }
        }

        .subscription {
          font-size: 14px;
          padding: 10px 0;
          color: #808080;
          p {
            display: block;

            span {
              position: absolute;
              right: 10px;
            }
          }

          p:nth-child(1) {
            margin-bottom: 8px;
          }

          .tips {
            color: red;
          }
        }
      }
      .price-info-content {
        font-size: 16px;
        background: #fff;
        margin-bottom: 10px;
        padding: 5px 10px;
        border-bottom: 1px solid #e3e3e3;
        .total-price {
          @include flexStyle;
          line-height: 22px;

          .color {
            color: red;
          }

          span {
            display: inline-block;
            color: #808080;
            font-size: 14px;
          }
        }
      }
      .pay-type {
        color: #808080;
        font-size: 14px;
        padding: 5px 10px;
        background: #fff;
        margin-bottom: 10px;

        .message {
          display: flex;
          align-items: flex-start;
          .label {
            width: 70px;
            margin-right: 4px;
          }
          .buy-message {
            flex: 1;
            display: block;
          }
        }

        span {
          display: block;
          line-height: 22px;
        }
      }

      .pass-popup {
        text-align: center;
        background: #ffffff;
        width: 80vw;
        height: 48vw;
        border-radius: 8px;
        font-size: 16px;
        padding: 10px;

        .input-label {
          display: block;
          margin: 10px;
        }

        .btn-group {
          display: flex;
          justify-content: space-around;
          color: #ff7300;
        }

        .forget-pass {
          display: block;
          float: right;
          color: #ff7300;
          font-size: 12px;
          margin: 10px 0 20px 0;
        }
      }
    }

    // .order-bottom {
    //   background: #ffffff;
    //   width: 100%;
    //   z-index: 10;
    //   position: absolute;
    //   bottom: 0;
    //   display: flex;
    //   justify-content: space-between;
    //   height: 50px;
    //   .footer-left {
    //     width: 50vw;
    //     display: flex;
    //     justify-content: space-around;
    //     align-items: center;
    //     .call-service {
    //       border-radius: 4px;
    //       color: #666;
    //       // padding: 4px 0 4px 10px;
    //       span {
    //         display: block;
    //         text-align: center;
    //         &:last-child {
    //           margin-top: 3px;
    //           font-size: 12px;
    //         }
    //       }

    //       .iconfont {
    //         font-size: 24px;
    //       }
    //     }

    //     .call-service + .call-service {
    //       margin-left: 5px;
    //     }
    //   }
    // }

    .recommend-dialog {
      text-align: center;
    }
  }
}
</style>
