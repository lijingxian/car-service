<template>
  <biz-grid class="order-log-info">
    <el-steps direction="vertical" space="auto" v-if="paymentMethodName!=='在线支付'">
      <el-step title="新订单" :status="active==='1'?'finish':'wait '" :class="(this.currentState==='create'||this.currentState==='confirm'||this.currentState==='AuditPassed')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='create'">
            <p>待商家确认</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='confirm'">
            <p>商家已确认</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='AuditPassed'">
            <span style="font-size: 58px;margin-left: -15px;vertical-align: text-bottom;">·</span>
            <span>审核者：{{orderLog.operator}}</span>
            <p>{{orderLog.createTime}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="执行" :status="active2==='1'?'finish':'wait '" :class="(this.currentState==='service'||this.currentState==='shipping')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-if="memberRescueStates&&memberRescueStates.length>0">
            <div>
              <el-button @click="dispath(orderId)" v-show="!dispathButton" size="small">派单</el-button>
              <el-button @click="rdispath(orderId)" v-show="!redispathButton" size="small">重新派单</el-button>
            </div>
            <div>
              <div class="cbp_tmlabel" id="cbp_tmlabel" v-if="cbp_tmlabel">
                <p style="color:#bababa">
                  任务分派给
                  <el-select v-model="workerId">
                    <el-option v-for="(worker,index) in workers" :key="index" :label="worker.name" :value="worker.id"></el-option>
                  </el-select>
                </p>
              </div>
            </div>
            <div v-for="(memberRescueState,index) in memberRescueStates" :key="index">
              <div v-if="memberRescueState.state==='6'">
                <p>自动派单</p>
                <div v-if="memberRescueState.refuseRecord">
                  <p style="color:#c60007">拒绝理由：{{memberRescueState.refuseRecord.reason}}</p>
                </div>
                <div v-if="memberRescueState.refuseRecord">
                  <p style="color:#c60007">自动派单</p>
                </div>
              </div>
              <div v-if="memberRescueState.state==='7'">
                任务发给
                <div
                  v-if="memberRescueState.dispatchRecord"
                >用户：{{memberRescueState.dispatchRecord.worker.nickname}}电话：{{memberRescueState.dispatchRecord.worker.mobile}}</div>
                <div v-if="memberRescueState.dispatchRecord">{{memberRescueState.dispatchRecord.createDate}}</div>
                <div v-if="memberRescueState.refuseRecord">{{memberRescueState.refuseRecord.reason}}</div>
              </div>
              <div v-if="memberRescueState.state==='5'">
                已拒绝
                <p
                  style="color:#c60007"
                  v-if="memberRescueState.refuseRecord"
                >拒绝理由：{{memberRescueState.refuseRecord.reason}}{{memberRescueState.refuseRecord.remarks}}</p>
              </div>
              <div v-if="memberRescueState.state==='1'">
                <p v-if="memberRescueState.member">{{memberRescueState.member.nickname}}已出发</p>
                <p>{{memberRescueState.location}}</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='2'">
                <p v-if="memberRescueState.member">{{memberRescueState.member.nickname}}已到达</p>
                <p>{{memberRescueState.location}}</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='3'">
                <p>完成救援任务</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='4'">
                <p>取消救援任务</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
            </div>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='service'">
            <p>订单已执行</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="shipping in shippings" :key="shipping.id" v-if="shippings&&shippings.length>0">
            <p v-if="shipping.shippingStatus==='1'">订单已部分发货</p>
            <p v-if="shipping.shippingStatus!=='1'">订单已执行</p>
            <p>{{shipping.shippingDate}}</p>
            <p>物流公司：{{shipping.logistics}}</p>
            <p>物流单号：{{shipping.expressSn}}</p>
            <p>
              收货人：{{shipping.consignee}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="devProcess" size="small">物流进度</el-button>
              <el-button @click="certificate(shipping.id)" size="small" style="margin-left:10px">凭证</el-button>
            </p>
            <p v-for="(product,index) in shipping.shippingItems" :key="index">{{product.name}}*{{product.quantity}}</p>
            <div class="devProcess" ref="devProcess" v-if="devProcessShippings&&devProcessShippings.shippingTraces">
              <div v-for="(shippingTrace,index) in devProcessShippings.shippingTraces" :key="index" class="shippingTrace">
                <li calss="station">{{shippingTrace.station}}</li>
                <li class="happenTime">{{shippingTrace.happenTime}}</li>
              </div>
              <div v-if="devProcessShippings.shippingTraces.length === 0" style="text-align:center;">暂无轨迹</div>
            </div>
          </div>
        </div>
      </el-step>
      <el-step title="付款" :status="active1==='1'?'finish':'wait '" :class="this.currentState==='payment'?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-if="payments.length>0">
            <p>支付方式：{{paymentMethodName}}</p>
            <p>付款方式：{{paymentType}}</p>
            <div v-for="payment in payments" :key="payment.id">
              <span style="font-size: 58px;margin-left: -15px;vertical-align: text-bottom;">·</span>
              <span>{{payment.paymentStatus==='0'?'未支付':payment.paymentStatus==='1'?'部分支付':'已支付'}}</span>
              <p>{{payment.paymentDate}}</p>
              <p>付款金额：￥{{payment.amount}}</p>
              <p>手续费：{{payment.fee}}</p>
              <p>交易号：{{payment.sn}}</p>
            </div>
          </div>
        </div>
      </el-step>
      <el-step title="完成" :status="active3==='1'||active4==='1'?'finish':'wait '" :class="(this.currentState==='complete'||this.currentState==='cancel')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='complete'">
            <p>交易完成</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='cancel'">
            <p>订单已关闭</p>
            <p>关闭理由：{{orderLog.content}}</p>
            <p>备注：{{orderLog.memo}}</p>
            <p>{{orderLog.createTime}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="评价" :status="active5==='1'?'finish':'wait '" :class="this.currentState==='review'?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='review'">
            <p>买家已评价</p>
            <div v-for="(review,index) in reviews" :key="index">
              <div v-if="review.reviewType==='0'">
                <p>{{review.happenDate}}</p>
                <p>商品：{{review.product.name}}</p>
                <p>评分：{{review.score}}分</p>
                <p>评语：{{review.content}}</p>
                <div v-for="(images,index) in review.images" :key="index" style="display:inline">
                  <img :src="images" width="50" @click="enlarge(images)" />
                </div>
              </div>
              <div v-if="review.reviewType==='1'">
                <p>店铺评分</p>
                <p>服务态度：{{review.serviceAttitude}}分</p>
                <p>服务速度：{{review.serviceSpeed}}分</p>
                <p>专业技能：{{review.professional}}分</p>
              </div>
            </div>
          </div>
        </div>
      </el-step>
    </el-steps>
    <el-steps direction="vertical" space="auto" v-if="paymentMethodName==='在线支付'">
      <el-step title="新订单" :status="active==='1'?'finish':'wait '" :class="(this.currentState==='create'||this.currentState==='confirm'||this.currentState==='AuditPassed')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='create'">
            <p>待商家确认</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='confirm'">
            <p>商家已确认</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='AuditPassed'">
            <span style="font-size: 58px;margin-left: -15px;vertical-align: text-bottom;">·</span>
            <span>审核者：{{orderLog.operator}}</span>
            <p>{{orderLog.createTime}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="付款" :status="active1==='1'?'finish':'wait '" :class="this.currentState==='payment'?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-if="payments.length>0">
            <p>支付方式：{{paymentMethodName}}</p>
            <p>付款方式：{{paymentType}}</p>
            <div v-for="payment in payments" :key="payment.id">
              <span style="font-size: 58px;margin-left: -15px;vertical-align: text-bottom;">·</span>
              <span>{{payment.paymentStatus==='0'?'未支付':payment.paymentStatus==='1'?'部分支付':'已支付'}}</span>
              <p>{{payment.paymentDate}}</p>
              <p>付款金额：￥{{payment.amount}}</p>
              <p>手续费：{{payment.fee}}</p>
              <p>交易号：{{payment.sn}}</p>
            </div>
          </div>
        </div>
      </el-step>
      <el-step title="执行" :status="active2==='1'?'finish':'wait '" :class="(this.currentState==='service'||this.currentState==='shipping')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-if="memberRescueStates&&memberRescueStates.length>0">
            <div>
              <el-button @click="dispath(orderId)" v-show="!dispathButton" size="small">派单</el-button>
              <el-button @click="rdispath(orderId)" v-show="!redispathButton" size="small">重新派单</el-button>
            </div>
            <div>
              <div class="cbp_tmlabel" id="cbp_tmlabel" v-if="cbp_tmlabel">
                <p style="color:#bababa">
                  任务分派给
                  <el-select v-model="workerId">
                    <el-option v-for="(worker,index) in workers" :key="index" :label="worker.name" :value="worker.id"></el-option>
                  </el-select>
                </p>
              </div>
            </div>
            <div v-for="(memberRescueState,index) in memberRescueStates" :key="index">
              <div v-if="memberRescueState.state==='6'">
                <p>自动派单</p>
                <div v-if="memberRescueState.refuseRecord">
                  <p style="color:#c60007">拒绝理由：{{memberRescueState.refuseRecord.reason}}</p>
                </div>
                <div v-if="memberRescueState.refuseRecord">
                  <p style="color:#c60007">自动派单</p>
                </div>
              </div>
              <div v-if="memberRescueState.state==='7'">
                任务发给
                <div
                  v-if="memberRescueState.dispatchRecord"
                >用户：{{memberRescueState.dispatchRecord.worker.nickname}}电话：{{memberRescueState.dispatchRecord.worker.mobile}}</div>
                <div v-if="memberRescueState.dispatchRecord">{{memberRescueState.dispatchRecord.createDate}}</div>
                <div v-if="memberRescueState.refuseRecord">{{memberRescueState.refuseRecord.reason}}</div>
              </div>
              <div v-if="memberRescueState.state==='5'">
                已拒绝
                <p
                  style="color:#c60007"
                  v-if="memberRescueState.refuseRecord"
                >拒绝理由：{{memberRescueState.refuseRecord.reason}}{{memberRescueState.refuseRecord.remarks}}</p>
              </div>
              <div v-if="memberRescueState.state==='1'">
                <p v-if="memberRescueState.member">{{memberRescueState.member.nickname}}已出发</p>
                <p>{{memberRescueState.location}}</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='2'">
                <p v-if="memberRescueState.member">{{memberRescueState.member.nickname}}已到达</p>
                <p>{{memberRescueState.location}}</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='3'">
                <p>完成救援任务</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
              <div v-if="memberRescueState.state==='4'">
                <p>取消救援任务</p>
                <p>{{memberRescueState.happenDate}}</p>
              </div>
            </div>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='service'">
            <p>订单已执行</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="shipping in shippings" :key="shipping.id" v-if="shippings&&shippings.length>0">
            <p v-if="shipping.shippingStatus==='1'">订单已部分发货</p>
            <p v-if="shipping.shippingStatus!=='1'">订单已执行</p>
            <p>{{shipping.shippingDate}}</p>
            <p>物流公司：{{shipping.logistics}}</p>
            <p>物流单号：{{shipping.expressSn}}</p>
            <p>
              收货人：{{shipping.consignee}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="devProcess" size="small">物流进度</el-button>
              <el-button @click="certificate(shipping.id)" size="small" style="margin-left:10px">凭证</el-button>
            </p>
            <p v-for="(product,index) in shipping.shippingItems" :key="index">{{product.name}}*{{product.quantity}}</p>
            <div class="devProcess" ref="devProcess" v-if="devProcessShippings&&devProcessShippings.shippingTraces">
              <div v-for="(shippingTrace,index) in devProcessShippings.shippingTraces" :key="index" class="shippingTrace">
                <li calss="station">{{shippingTrace.station}}</li>
                <li class="happenTime">{{shippingTrace.happenTime}}</li>
              </div>
              <div v-if="devProcessShippings.shippingTraces.length === 0" style="text-align:center;">暂无轨迹</div>
            </div>
          </div>
        </div>
      </el-step>
      <el-step title="完成" :status="active3==='1'||active4==='1'?'finish':'wait '" :class="(this.currentState==='complete'||this.currentState==='cancel')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='complete'">
            <p>交易完成</p>
            <p>{{orderLog.createTime}}</p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='cancel'">
            <p>订单已关闭</p>
            <p>关闭理由：{{orderLog.content}}</p>
            <p>备注：{{orderLog.memo}}</p>
            <p>{{orderLog.createTime}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="评价" :status="active5==='1'?'finish':'wait '" :class="this.currentState==='review'?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='review'">
            <p>买家已评价</p>
            <div v-for="(review,index) in reviews" :key="index">
              <div v-if="review.reviewType==='0'">
                <p>{{review.happenDate}}</p>
                <p>商品：{{review.product.name}}</p>
                <p>评分：{{review.score}}分</p>
                <p>评语：{{review.content}}</p>
                <div v-for="(images,index) in review.images" :key="index" style="display:inline">
                  <img :src="images" width="50" @click="enlarge(images)" />
                </div>
              </div>
              <div v-if="review.reviewType==='1'">
                <p>店铺评分</p>
                <p>服务态度：{{review.serviceAttitude}}分</p>
                <p>服务速度：{{review.serviceSpeed}}分</p>
                <p>专业技能：{{review.professional}}分</p>
              </div>
            </div>
          </div>
        </div>
      </el-step>
    </el-steps>
    <el-dialog title :visible.sync="outerVisible" append-to-body>
      <img :src="larImg" width="100%" />
    </el-dialog>
    <el-dialog :visible.sync="dialogShipping" center width="1200px" append-to-body custom-class="printDialog">
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
              <div class="grid-content bg-purple">订单状态：{{shippingsPrint.shippingStatus==='1'?'订单已部分发货':'订单已执行'}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">发货时间：{{shippingsPrint.shippingDate?shippingsPrint.shippingDate.split(' ')[0]:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">物流公司：{{shippingsPrint.logistics}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">物流单号：{{shippingsPrint.expressSn}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">物流费用：{{shippingsPrint.freight}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收货人：{{shippingsPrint.consignee}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">电话：{{shippingsPrint.phone}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收货地址：{{shippingsPrint.address}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="name" label="商品名">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column property="barCode" label="条码">
              <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">￥{{scope.row.subTotal}}</template>
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
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import http from '@/common/http';
import vueEasyPrint from 'vue-easy-print';
// import NoContent from '@/assets/images/emptyGray.png';
import { mapGetters } from 'vuex';
import axios from 'axios';
export default {
  name: 'NewsMgmt',
  props: {
    itemId: {
      type: String
    },
    paymentMethodName: {
      type: String,
      default: '在线支付'
    }
  },
  data() {
    return {
      orderItems: [],
      loading: false,
      open: false,
      outerVisible: false,
      active: '',
      active1: '',
      active2: '',
      active3: '',
      active4: '',
      active5: '',
      larImg: '',
      orderLogs: [],
      reviews: [],
      shippings: [],
      payments: [],
      dialogShipping: false,
      form: {},
      title: '',
      gridData: [],
      shippingsPrint: '',
      devProcessShippings: '',
      memberRescueStates: [],
      paymentMethodNameReal: '',
      type: '',
      amount: '',
      amountpaid: '',
      paymentType: '',
      latestMemberRescueState: '',
      workers: [],
      sn: '',
      consignee: '',
      fee: '',
      operator: '',
      trackingNo: '',
      deliveryCorp: '',
      orderId: '',
      workerId: '',
      dispathButton: false,
      redispathButton: false,
      cbp_tmlabel: false,
      imgStyle: '',
      imageValue: '',
      currentState: '',
      shippingId: '',
      preState: '',
      create: false,
      cancel: false,
      confirm: false,
      service: false,
      shipping: false,
      payment: false,
      complete: false,
      review: false,
      isCreate: false,
      isConfirm: false,
      isService: false,
      isPayment: false,
      isComplete: false,
      isReview: false,
      isCancel: false
    };
  },
  components: {
    BizGrid,
    vueEasyPrint
  },
  watch: {
    itemId(val) {
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  computed: {
    // styleObject() {
    //   return {
    //     height: '200px',
    //     top: 0,
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    //     margin: 'auto',
    //     background: 'url(' + NoContent + ') 50% 50% / 200px no-repeat'
    //   };
    // }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    async printExport() {
      let params = {
        shippingId: this.shippingId
      };
      try {
        let response = await axios.post('/admin/purchaseOrder/voucher/export/shipping.jhtml', params, { responseType: 'blob' });
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
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    devProcess() {
      if (this.deliveryCorp === '新悦物流') {
        this.$emit('logistics', this.orderItems[0].product.vins[0].number);
      }
      if (this.$refs.devProcess[0].style.display === 'block') {
        this.$refs.devProcess[0].style.display = 'none';
      } else {
        this.$refs.devProcess[0].style.display = 'block';
      }
    },
    // 发货凭证
    certificate(shippingId) {
      let param = {
        shippingId: shippingId
      };
      http
        .get('/admin/purchaseOrder/voucher/shipping.jhtml', param)
        .then(data => {
          this.dialogShipping = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '发货单' : '发货单';
          this.form = data.order;
          this.shippingId = shippingId;
          this.shippingsPrint = data.shipping;
          this.gridData = data.shipping.shippingItems;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    enlarge(image) {
      this.larImg = image;
      this.outerVisible = true;
    },
    getList(id) {
      this.loading = true;
      let params = {
        orderId: id || this.itemId
      };
      service.viewOrderlogs(
        params,
        data => {
          this.orderItems = data.order.orderItems;
          this.loading = false;
          this.orderLogs = data.orderLogs;
          this.reviews = data.reviews;
          this.payments = data.payments;
          if (data.payments && data.payments.length > 1) {
            this.amountpaid = Number(data.payments[0].amount) + Number(data.payments[1].amount);
          } else {
            this.amountpaid = '';
          }
          this.memberRescueStates = data.memberRescueStates;
          this.latestMemberRescueState = data.latestMemberRescueState;
          this.workers = data.workers;
          this.orderId = data.orderId;
          this.dispathType = data.dispathType;
          this.shippings = data.shippings;
          this.devProcessShippings = data.shippings && data.shippings[0];
          if (data.payments) {
            this.paymentType = data.payments.length > 0 ? data.payments[0].paymentType : '';
            this.amount = data.payments.length > 0 ? data.payments[0].amount : '';
            this.fee = data.payments.length > 0 ? data.payments[0].fee : '';
            this.sn = data.payments.length > 0 ? data.payments[0].sn : '';
          }
          if (data.shippings) {
            this.deliveryCorp = data.shippings.length > 0 ? data.shippings[0].logistics : '';
            this.trackingNo = data.shippings.length > 0 ? data.shippings[0].expressSn : '';
            this.operator = data.shippings.length > 0 ? data.shippings[0].consignee : '';
          }
          this.consignee = data.order.consignee || '';
          this.currentState = data.orderLogs[data.orderLogs.length - 1].type;
          if (data.orderLogs.length > 1) {
            this.preState = data.orderLogs[data.orderLogs.length - 2].type;
          }
          this.active = '';
          this.active1 = '';
          this.active2 = '';
          this.active3 = '';
          this.active4 = '';
          this.active5 = '';
          data.orderLogs.forEach(item => {
            if (item.type === 'create' || item.type === 'confirm') {
              this.active = '1';
            }
            if (item.type === 'service' || item.type === 'shipping') {
              this.active2 = '1';
            }
            if (item.type === 'payment') {
              this.active1 = '1';
            }
            if (item.type === 'complete') {
              this.active3 = '1';
            }
            if (item.type === 'review') {
              this.active5 = '1';
            }
            if (this.currentState === 'cancel') {
              this.active4 = '1';
            }
          });
          if (this.latestMemberRescueState && (this.latestMemberRescueState.state === '0' || this.dispathType === '1')) {
            this.dispathButton = false;
            this.cbp_tmlabel = true;
          } else {
            this.dispathButton = true;
            this.cbp_tmlabel = false;
          }
          if (
            this.latestMemberRescueState &&
            this.latestMemberRescueState.state !== '3' &&
            this.latestMemberRescueState.state !== '8' &&
            this.latestMemberRescueState.state !== '9' &&
            this.latestMemberRescueState.state !== '4' &&
            this.latestMemberRescueState.state !== '0'
          ) {
            this.redispathButton = false;
          } else {
            this.redispathButton = true;
          }
          this.isCreate = false;
          this.isPayment = false;
          this.isComplete = false;
          this.isReview = false;
          this.isCancel = false;
          this.isService = false;
          data.orderLogs.forEach(item => {
            item.type === 'create' && (this.isCreate = true);
            item.type === 'payment' && (this.isPayment = true);
            item.type === 'complete' && (this.isComplete = true);
            item.type === 'review' && (this.isReview = true);
            item.type === 'cancel' && (this.isCancel = true);
            item.type === 'service' && (this.isService = true);
            item.type === 'shipping' && (this.isService = true);
            item.type === 'confirm' && (this.isService = true);
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getRescueList(id) {
      this.loading = true;
      let params = {
        orderId: id || this.itemId
      };
      service.rescueOrderLogs(
        params,
        data => {
          this.loading = false;
          this.orderLogs = data.orderLog;
          this.reviews = data.reviews;
          this.payments = data.payments;
          if (data.payments && data.payments.length > 1) {
            this.amountpaid = Number(data.payments[0].amount) + Number(data.payments[1].amount);
          } else {
            this.amountpaid = '';
          }
          this.memberRescueStates = data.memberRescueStates;
          this.latestMemberRescueState = data.latestMemberRescueState;
          this.workers = data.workers;
          this.orderId = data.orderId;
          this.dispathType = data.dispathType;
          this.shippings = data.order.shippings && data.order.shippings[0];
          if (data.order.payments) {
            this.paymentType = data.order.payments.length > 0 ? data.order.payments[0].paymentType : '';
            this.amount = data.order.payments.length > 0 ? data.order.payments[0].amount : '';
            this.fee = data.order.payments.length > 0 ? data.order.payments[0].fee : '';
            this.sn = data.order.payments.length > 0 ? data.order.payments[0].sn : '';
          }
          if (data.order.shippings) {
            this.deliveryCorp = data.order.shippings.length > 0 ? data.order.shippings[0].logistics : '';
            this.trackingNo = data.order.shippings.length > 0 ? data.order.shippings[0].expressSn : '';
            this.operator = data.order.shippings.length > 0 ? data.order.shippings[0].consignee : '';
          }
          this.consignee = data.order.consignee || '';
          this.currentState = data.orderLogs[data.orderLogs.length - 1].type;
          if (data.orderLogs.length > 1) {
            this.preState = data.orderLogs[data.orderLogs.length - 2].type;
          }
          this.active = '';
          this.active1 = '';
          this.active2 = '';
          this.active3 = '';
          this.active4 = '';
          this.active5 = '';
          data.orderLogs.forEach(item => {
            if (item.type === 'create' || item.type === 'confirm') {
              this.active = '1';
            }
            if (item.type === 'service' || item.type === 'shipping') {
              this.active2 = '1';
            }
            if (item.type === 'payment') {
              this.active1 = '1';
            }
            if (item.type === 'complete') {
              this.active3 = '1';
            }
            if (item.type === 'review') {
              this.active5 = '1';
            }
            if (this.currentState === 'cancel') {
              this.active4 = '1';
            }
          });
          if (this.latestMemberRescueState.state === '0' || this.dispathType === '1') {
            this.dispathButton = false;
            this.cbp_tmlabel = true;
          } else {
            this.dispathButton = true;
            this.cbp_tmlabel = false;
          }
          if (
            this.latestMemberRescueState.state !== '3' &&
            this.latestMemberRescueState.state !== '8' &&
            this.latestMemberRescueState.state !== '9' &&
            this.latestMemberRescueState.state !== '4' &&
            this.latestMemberRescueState.state !== '0'
          ) {
            this.redispathButton = false;
          } else {
            this.redispathButton = true;
          }
          this.isCreate = false;
          this.isPayment = false;
          this.isComplete = false;
          this.isReview = false;
          this.isCancel = false;
          this.isService = false;
          data.orderLogs.forEach(item => {
            item.type === 'create' && (this.isCreate = true);
            item.type === 'payment' && (this.isPayment = true);
            item.type === 'complete' && (this.isComplete = true);
            item.type === 'review' && (this.isReview = true);
            item.type === 'cancel' && (this.isCancel = true);
            item.type === 'service' && (this.isService = true);
            item.type === 'shipping' && (this.isService = true);
            item.type === 'confirm' && (this.isService = true);
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    dispath(id) {
      this.id = this.itemId || '';
      service.rescuerDispath(
        { orderId: this.id, workerId: this.workerId },
        data => {
          service.rescueOrderLogs(
            { orderId: this.id, dispathType: '0' },
            data => {
              this.orderLogs = data.orderLogs;
              this.reviews = data.reviews;
              this.memberRescueStates = data.memberRescueStates;
              this.latestMemberRescueState = data.latestMemberRescueState;
              this.workers = data.workers;
              this.orderId = data.orderId;
              this.dispathType = data.dispathType;
              if (this.latestMemberRescueState.state === '0' || this.dispathType === '1') {
                this.dispathButton = false;
              } else {
                this.dispathButton = true;
              }
              if (this.latestMemberRescueState.state === '0' || this.latestMemberRescueState.state === '7') {
                this.redispathButton = false;
              } else {
                this.redispathButton = true;
              }
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    rdispath(id) {
      this.id = this.itemId || '';
      service.rescueOrderLogs(
        { orderId: this.id, dispathType: '1' },
        data => {
          this.orderLogs = data.orderLogs;
          this.reviews = data.reviews;
          this.memberRescueStates = data.memberRescueStates;
          this.latestMemberRescueState = data.latestMemberRescueState;
          this.workers = data.workers;
          this.orderId = data.orderId;
          this.dispathType = data.dispathType;
          if (this.latestMemberRescueState.state === '0' || this.dispathType === '1') {
            this.dispathButton = false;
          } else {
            this.dispathButton = true;
          }
          this.cbp_tmlabel = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.order-log-info {
  padding: 20px;
  .el-step.is-vertical {
    display: -webkit-box;
  }
  .el-step__description {
    color: #000000;
  }
  .style-isfinish {
    .el-step__title.is-finish {
      color: #ff7300;
    }
    .el-step__icon {
      background: #ff7300;
    }
    .el-step__icon.is-text {
      color: #f7f7f7;
    }
  }
  .style-new {
    .el-step__title.is-finish {
      color: #000000;
    }
    .el-step__icon {
      background: #ffffff;
    }
  }
  .devProcess {
    background-color: #f7f7f7;
    border: 1px solid #c1c1c1;
    display: none;
    .shippingTrace {
      padding: 10px;
    }
    li {
      list-style-type: none;
      padding: 5px 0px 0px 5px;
    }
    .happenTime {
      border-bottom: 1px solid #c1c1c1;
    }
    .close {
      display: none;
    }
  }
}
</style>
