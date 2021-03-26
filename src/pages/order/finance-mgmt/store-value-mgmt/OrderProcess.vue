<template>
  <biz-grid class="order-log-info">
    <el-steps direction="vertical" space="auto">
      <el-step title="新订单" :status="active==='1'?'finish':'wait '">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='create'">
            <p>
              待商家确认
            </p>
            <p>
              {{orderLog.createTime}}
            </p>
          </div>
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='confirm'">
            <p>
              商家已确认
            </p>
            <p>
              {{orderLog.createTime}}
            </p>
          </div>
        </div>
      </el-step>
      <template v-if="paymentMethodName!=='在线支付'">
        <el-step title="执行" :status="active==='2'?'finish':'wait '">
          <div slot="description">
            <div v-if="memberRescueStates.length>0">
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
                  <p>
                    自动派单
                  </p>
                  <div v-if="memberRescueState.refuseRecord">
                    <p style="color:#c60007">
                      拒绝理由：{{memberRescueState.refuseRecord.reason}}
                    </p>
                  </div>
                  <div v-if="memberRescueState.refuseRecord">
                    <p style="color:#c60007">
                      自动派单
                    </p>
                  </div>
                </div>
                <div v-if="memberRescueState.state==='7'">
                  任务发给
                  <div v-if="memberRescueState.dispatchRecord">
                    用户：{{memberRescueState.dispatchRecord.worker.nickname}}电话：{{memberRescueState.dispatchRecord.worker.mobile}}
                  </div>
                  <div v-if="memberRescueState.dispatchRecord">
                    {{memberRescueState.dispatchRecord.createDate}}
                  </div>
                  <div v-if="memberRescueState.refuseRecord">
                    {{memberRescueState.refuseRecord.reason}}
                  </div>
                </div>
                <div v-if="memberRescueState.state==='5'">
                  已拒绝
                  <p style="color:#c60007" v-if="memberRescueState.refuseRecord">
                    拒绝理由：{{memberRescueState.refuseRecord.reason}}{{memberRescueState.refuseRecord.remarks}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='1'">
                  <p v-if="memberRescueState.member">
                    {{memberRescueState.member.nickname}}已出发
                  </p>
                  <p>
                    {{memberRescueState.location}}
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='2'">
                  <p v-if="memberRescueState.member">
                    {{memberRescueState.member.nickname}}已到达
                  </p>
                  <p>
                    {{memberRescueState.location}}
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='3'">
                  <p>
                    完成救援任务
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='4'">
                  <p>
                    取消救援任务
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
              </div>
            </div>
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='service'">
              <p>
                订单已执行
              </p>
              <p>
                {{orderLog.createTime}}
              </p>
            </div>
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='shipping'">
              <p>
                订单已执行
              </p>
              <p>
                {{orderLog.createTime}}
              </p>
              <p>
                物流公司：{{deliveryCorp}}
              </p>
              <p>
                物流单号：{{trackingNo}}
              </p>
              <p>
                收货人：{{operator}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button @click="devProcess" size="small">物流进度</el-button>
              </p>
              <div class="devProcess" ref="devProcess">
                <div v-for="(shippingTrace,index) in shippings.shippingTraces" :key="index" class="shippingTrace">
                  <li calss="station">
                    {{shippingTrace.station}}
                  </li>
                  <li class="happenTime">
                    {{shippingTrace.happenTime}}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </el-step>
        <el-step title="付款" :status="active==='3'?'finish':'wait '">
          <div slot="description">
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='payment'">
              <p>
                买家已付款
              </p>
              <div v-if="payments&&payments.length===2">
                <p>
                  订金已支付
                </p>
                <p>
                  {{payments[0].paymentDate}}
                </p>
                <p>
                  买家已付款
                </p>
                <p>
                  {{payments[0].paymentDate}}
                </p>
                <p>
                  尾款已支付
                </p>
                <p>
                  {{payments[1].paymentDate}}
                </p>
                <p>
                  买家已付款
                </p>
                <p>
                  {{payments[1].paymentDate}}
                </p>
                <p>
                  实付金额：{{amountpaid}}
                </p>
              </div>
              <div v-else>
                <p>
                  {{orderLog.createTime}}
                </p>
                <p>
                  付款金额：￥{{amount}}
                </p>
                <p>
                  支付方式：{{paymentMethodName}}
                </p>
                <p>
                  付款方式：{{paymentType}}
                </p>
                <p>
                  手续费：{{fee}}
                </p>
                <p>
                  交易号：{{sn}}
                </p>
              </div>
            </div>
          </div>
        </el-step>
      </template>
      <template v-if="paymentMethodName==='在线支付'">
        <el-step title="付款" :status="active==='3'?'finish':'wait '">
          <div slot="description">
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='payment'">
              <p>
                买家已付款
              </p>
              <div v-if="payments&&payments.length===2">
                <p>
                  订金已支付
                </p>
                <p>
                  {{payments[0].paymentDate}}
                </p>
                <p>
                  买家已付款
                </p>
                <p>
                  {{payments[0].paymentDate}}
                </p>
                <p>
                  尾款已支付
                </p>
                <p>
                  {{payments[1].paymentDate}}
                </p>
                <p>
                  买家已付款
                </p>
                <p>
                  {{payments[1].paymentDate}}
                </p>
                <p>
                  实付金额：{{amountpaid}}
                </p>
              </div>
              <div v-else>
                <p>
                  {{orderLog.createTime}}
                </p>
                <p>
                  付款金额：￥{{amount}}
                </p>
                <p>
                  支付方式：{{paymentMethodName}}
                </p>
                <p>
                  付款方式：{{paymentType}}
                </p>
                <p>
                  手续费：{{fee}}
                </p>
                <p>
                  交易号：{{sn}}
                </p>
              </div>
            </div>
          </div>
        </el-step>
        <!-- <el-step title="执行" :status="active==='2'?'finish':'wait '">
          <div slot="description">
            <div v-if="memberRescueStates.length>0">
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
                  <p>
                    自动派单
                  </p>
                  <div v-if="memberRescueState.refuseRecord">
                    <p style="color:#c60007">
                      拒绝理由：{{memberRescueState.refuseRecord.reason}}
                    </p>
                  </div>
                  <div v-if="memberRescueState.refuseRecord">
                    <p style="color:#c60007">
                      自动派单
                    </p>
                  </div>
                </div>
                <div v-if="memberRescueState.state==='7'">
                  任务发给
                  <div v-if="memberRescueState.dispatchRecord">
                    用户：{{memberRescueState.dispatchRecord.worker.nickname}}电话：{{memberRescueState.dispatchRecord.worker.mobile}}
                  </div>
                  <div v-if="memberRescueState.dispatchRecord">
                    {{memberRescueState.dispatchRecord.createDate}}
                  </div>
                  <div v-if="memberRescueState.refuseRecord">
                    {{memberRescueState.refuseRecord.reason}}
                  </div>
                </div>
                <div v-if="memberRescueState.state==='5'">
                  已拒绝
                  <p style="color:#c60007" v-if="memberRescueState.refuseRecord">
                    拒绝理由：{{memberRescueState.refuseRecord.reason}}{{memberRescueState.refuseRecord.remarks}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='1'">
                  <p v-if="memberRescueState.member">
                    {{memberRescueState.member.nickname}}已出发
                  </p>
                  <p>
                    {{memberRescueState.location}}
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='2'">
                  <p v-if="memberRescueState.member">
                    {{memberRescueState.member.nickname}}已到达
                  </p>
                  <p>
                    {{memberRescueState.location}}
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='3'">
                  <p>
                    完成救援任务
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
                <div v-if="memberRescueState.state==='4'">
                  <p>
                    取消救援任务
                  </p>
                  <p>
                    {{memberRescueState.happenDate}}
                  </p>
                </div>
              </div>
            </div>
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='service'">
              <p>
                订单已执行
              </p>
              <p>
                {{orderLog.createTime}}
              </p>
            </div>
            <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='shipping'">
              <p>
                订单已执行
              </p>
              <p>
                {{orderLog.createTime}}
              </p>
              <p>
                物流公司：{{deliveryCorp}}
              </p>
              <p>
                物流单号：{{trackingNo}}
              </p>
              <p>
                收货人：{{operator}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button @click="devProcess" size="small">物流进度</el-button>
              </p>
              <div class="devProcess" ref="devProcess">
                <div v-for="(shippingTrace,index) in shippings.shippingTraces" :key="index" class="shippingTrace">
                  <li calss="station">
                    {{shippingTrace.station}}
                  </li>
                  <li class="happenTime">
                    {{shippingTrace.happenTime}}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </el-step> -->
      </template>
      <el-step title="完成" :status="active==='4'?'finish':'wait '">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='complete'">
            <p>
              交易完成
            </p>
            <p>
              {{orderLog.createTime}}
            </p>
          </div>
        </div>
      </el-step>
      <el-step title="评价" v-if="isReview" :status="active==='5'?'finish':'wait '">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='review'">
            <p>
              买家已评价
            </p>
            <div v-for="(review,index) in reviews" :key="index">
              <div v-if="review.reviewType==='0'">
                <p>
                  {{review.happenDate}}
                </p>
                <p>
                  商品：{{review.product.name}}
                </p>
                <p>
                  评分：{{review.score}}分
                </p>
                <p>
                  评语：{{review.content}}
                </p>
                <div v-for="(images,index) in review.images" :key="index" style="display:inline">
                  <img src="images" width="50" />
                </div>
              </div>
              <div v-if="review.reviewType==='1'">
                <p>
                  店铺评分
                </p>
                <p>
                  服务态度：{{review.serviceAttitude}}分
                </p>
                <p>
                  服务速度：{{review.serviceSpeed}}分
                </p>
                <p>
                  专业技能：{{review.professional}}分
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-step>
      <el-step v-if="isCancel" title="关闭" :status="active==='6'?'finish':'wait '">
        <div slot="description">
          <div v-for="orderLog in orderLogs" :key="orderLog.id" v-if="orderLog.type==='cancel'">
            <p>
              订单已关闭
            </p>
            <p>
              关闭理由：{{orderLog.content}}
            </p>
            <p>
              备注：{{orderLog.memo}}
            </p>
            <p>
              {{orderLog.createTime}}
            </p>
          </div>
        </div>
      </el-step>
    </el-steps>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
export default {
  name: 'NewsMgmt',
  props: {
    itemId: {
      type: String
    },
    paymentMethodName: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      open: false,
      active: '',
      orderLogs: [],
      reviews: [],
      shippings: '',
      payments: [],
      memberRescueStates: [],
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
    BizGrid
  },
  watch: {
    itemId(val) {
      if (this.$route.params.orderType === 'rescue') {
        this.getRescueList();
      } else {
        this.getList();
      }
    }
  },
  created() {
    if (this.$route.params.orderType === 'rescue') {
      this.getRescueList();
    } else {
      this.getList();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    devProcess() {
      if (this.$refs.devProcess[0].style.display === 'block') {
        this.$refs.devProcess[0].style.display = 'none';
      } else {
        this.$refs.devProcess[0].style.display = 'block';
      }
    },
    getList() {
      this.loading = true;
      let params = {
        orderId: this.itemId
      };
      service.viewOrderlogs(
        params,
        data => {
          this.loading = false;
          this.orderLogs = data.orderLogs;
          this.reviews = data.reviews;
          this.payments = data.payments;
          this.amountpaid =
            data.payments.length > 1
              ? Number(data.payments[0].amount) +
                Number(data.payments[1].amount)
              : '';
          this.shippings = data.shippings && data.shippings[0];
          this.paymentType = data.payments.length
            ? data.payments[0].paymentType
            : '';
          this.sn = data.payments.length ? data.payments[0].sn : '';
          this.amount = data.payments.length ? data.payments[0].amount : '';
          this.fee = data.payments.length ? data.payments[0].fee : '';
          this.deliveryCorp = data.shippings.length
            ? data.shippings[0].logistics
            : '';
          this.trackingNo = data.shippings.length
            ? data.shippings[0].expressSn
            : '';
          this.operator = data.shippings.length
            ? data.shippings[0].consignee
            : '';
          this.consignee = data.order.consignee || '';
          this.currentState = data.orderLogs[data.orderLogs.length - 1].type;
          if (data.orderLogs.length > 1) {
            this.preState = data.orderLogs[data.orderLogs.length - 2].type;
          }
          if (
            this.currentState === 'create' ||
            this.currentState === 'confirm'
          ) {
            this.active = '1';
          } else if (
            this.currentState === 'service' ||
            this.currentState === 'shipping'
          ) {
            this.active = '2';
          } else if (this.currentState === 'payment') {
            this.active = '3';
          } else if (this.currentState === 'complete') {
            this.active = '4';
          } else if (this.currentState === 'review') {
            this.active = '5';
          } else if (this.currentState === 'cancel') {
            this.active = '6';
          }
          this.isCreate = false;
          this.isPayment = false;
          this.isComplete = false;
          this.isReview = false;
          this.isCancel = false;
          this.isService = false;
          this.orderLogs.forEach(item => {
            item.type === 'create' && (this.isCreate = true);
            item.type === 'payment' && (this.isPayment = true);
            item.type === 'complete' && (this.isComplete = true);
            item.type === 'review' && (this.isReview = true);
            item.type === 'cancel' && (this.isCancel = true);
            item.type === 'service' && (this.isService = true);
            item.type === 'shipping' && (this.isService = true);
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getRescueList() {
      this.loading = true;
      let params = {
        orderId: this.itemId
      };
      service.rescueOrderLogs(
        params,
        data => {
          this.loading = false;
          this.orderLogs = data.orderLog;
          this.reviews = data.reviews;
          this.payments = data.payments;
          if (data.payments && data.payments.length > 1) {
            this.amountpaid =
              Number(data.payments[0].amount) + Number(data.payments[1].amount);
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
            this.paymentType =
              data.order.payments.length > 0
                ? data.order.payments[0].paymentType
                : '';
            this.amount =
              data.order.payments.length > 0
                ? data.order.payments[0].amount
                : '';
            this.fee =
              data.order.payments.length > 0 ? data.order.payments[0].fee : '';
            this.sn =
              data.order.payments.length > 0 ? data.order.payments[0].sn : '';
          }
          if (data.order.shippings) {
            this.deliveryCorp =
              data.order.shippings.length > 0
                ? data.order.shippings[0].logistics
                : '';
            this.trackingNo =
              data.order.shippings.length > 0
                ? data.order.shippings[0].expressSn
                : '';
            this.operator =
              data.order.shippings.length > 0
                ? data.order.shippings[0].consignee
                : '';
          }
          this.consignee = data.order.consignee || '';
          this.currentState = data.orderLog[data.orderLog.length - 1].type;
          if (data.orderLog.length > 1) {
            this.preState = data.orderLog[data.orderLog.length - 2].type;
          }
          if (
            this.currentState === 'create' ||
            this.currentState === 'confirm'
          ) {
            this.active = '1';
          } else if (
            this.currentState === 'service' ||
            this.currentState === 'shipping'
          ) {
            this.active = '2';
          } else if (this.currentState === 'payment') {
            this.active = '3';
          } else if (this.currentState === 'complete') {
            this.active = '4';
          } else if (this.currentState === 'review') {
            this.active = '5';
          } else if (this.currentState === 'cancel') {
            this.active = '6';
          }
          if (
            this.latestMemberRescueState.state === '0' ||
            this.dispathType === '1'
          ) {
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
          data.orderLog.forEach(item => {
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
              this.orderLogs = data.orderLog;
              this.reviews = data.reviews;
              this.memberRescueStates = data.memberRescueStates;
              this.latestMemberRescueState = data.latestMemberRescueState;
              this.workers = data.workers;
              this.orderId = data.orderId;
              this.dispathType = data.dispathType;
              if (
                this.latestMemberRescueState.state === '0' ||
                this.dispathType === '1'
              ) {
                this.dispathButton = false;
              } else {
                this.dispathButton = true;
              }
              if (
                this.latestMemberRescueState.state === '0' ||
                this.latestMemberRescueState.state === '7'
              ) {
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
          this.orderLogs = data.orderLog;
          this.reviews = data.reviews;
          this.memberRescueStates = data.memberRescueStates;
          this.latestMemberRescueState = data.latestMemberRescueState;
          this.workers = data.workers;
          this.orderId = data.orderId;
          this.dispathType = data.dispathType;
          if (
            this.latestMemberRescueState.state === '0' ||
            this.dispathType === '1'
          ) {
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
