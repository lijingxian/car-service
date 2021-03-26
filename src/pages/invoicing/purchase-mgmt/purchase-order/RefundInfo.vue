<template>
  <div class="refund-info">
    <div class="o-refund-info">
      <div class="info-list">
        <div class="info-item">
          <div class="t">退货类型：</div>
          <div class="des">{{typeStr}}</div>
        </div>
        <div class="info-item">
          <div class="t">退款金额：</div>
          <div class="des">{{amount}}</div>
        </div>
        <div class="info-item">
          <div class="t">退款原因：</div>
          <div class="des">{{reason}}</div>
        </div>
        <div class="info-item">
          <div class="t">退款说明：</div>
          <div class="des">{{explain}}</div>
        </div>
        <div class="info-item" v-if="curRefundsInfo&&curRefundsInfo.returns&&curRefundsInfo.returns[0].type==='3'">
          <span style="white-space:nowrap;">退货地址：</span>
          <div class="des">{{type==='1'?curRefundsInfo.returns[0].address:''}}</div>
        </div>
        <div class="refunds-img" v-if="curRefundsInfo && curRefundsInfo.images && curRefundsInfo.images.length">
          <span style="white-space:nowrap;">上传图片：</span>
          <img v-for="image in curRefundsInfo.images" :key="image" :src="image" width="80px" height="80px"
            style="margin: 0px 5px" />
        </div>
        <div class="order-track-content">
          <ul class="trace-info">
            <template v-for="(log, index) in logs">
              <li :class="log.status" :key="index">
                <p v-html="log.title"></p>
                <span>{{log.time}}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="bottom-action">
        <!-- <span @click="touchCS" class="half-action">联系客服</span> -->
        <span @click="selectLogistics" class="half-action" v-if="btnLabel">{{getBtnLabel}}</span>
        <span @click="modefyApply" class="half-action" v-if="showModefyBtn">修改申请</span>
        <span @click="cancelApply" class="half-action" v-if="showCancelBtn">取消申请</span>
        <span @click="reApplyHandle" class="half-action" v-if="showReApply">重新申请</span>
        <span @click="confirmShipping" class="half-action" v-if="showShipping">确认收货</span>
      </div>
    </div>
    <el-dialog :visible.sync="dialogInfo" append-to-body>
      <logistic-info :refundsId="id" @operationSuccess="operationSuccess"></logistic-info>
    </el-dialog>
    <el-dialog :visible.sync="dialogFollowing" append-to-body>
      <logistics-following :sn="shippingSn" ref="following"></logistics-following>
    </el-dialog>
  </div>
</template>

<script>
// 退款详情

import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import LogisticInfo from './LogisticInfo';
import LogisticsFollowing from './LogisticsFollowing';
export default {
  name: 'refund-info',
  props: {
    itemId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderItemId: '',
      type: '',
      amount: '',
      reason: '',
      explain: '',
      shippingSn: '',
      btnLabel: false,
      dialogInfo: false,
      dialogFollowing: false,
      id: '', // 退货退款id
      showDialog: false,
      showModefyBtn: null,
      showCancelBtn: null,
      showReApply: null,
      showShipping: false,
      deliveryCorp: '',
      trackingNo: '',
      orderId: ''
    };
  },
  components: { LogisticInfo, LogisticsFollowing },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderInfo', 'curRefundsInfo']),
    typeStr() {
      switch (this.type) {
        case '0':
          return '我要退款(无需退货)';
        case '1':
          return '我要退货退款';
        case '2':
          return '我要换货(无需退款)';
        case '3':
          return '我要退货(无需退款)';
        default:
          return '';
      }
    },
    getBtnLabel() {
      if (this.curRefundsInfo.returns[0].type === '2') {
        return '填写物流';
      } else if (
        (this.curRefundsInfo.returns[0].type === '3' ||
          this.curRefundsInfo.returns[0].type === '4' ||
          this.curRefundsInfo.returns[0].type === '5') &&
        (this.type === '1' || this.type === '2')
      ) {
        return '查看物流';
      }
      return '';
    },
    logs() {
      let ary = [];
      if (this.curRefundsInfo && this.curRefundsInfo.returns) {
        this.curRefundsInfo.returns.forEach((element, index) => {
          let obj = {};
          obj.time = element.happenDate;
          switch (element.type) {
            case '0':
              if (this.type === '0') {
                obj.title = '提交退款(无需退货)申请';
              } else if (this.type === '2') {
                obj.title = '提交换货申请';
              } else if (this.type === '3') {
                obj.title = '提交退货(无需退款)';
              } else {
                obj.title = '提交退货退款申请';
              }
              break;
            case '2':
              obj.title = '卖家同意售后申请，等待买家发货给卖家<br/>退货地址：' + this.curRefundsInfo.returns[0].address || '';
              break;
            case '3':
              obj.title =
                '买家已退货，等待卖家收货<br/>物流公司：' + element.deliveryCorp + '<br/>物流单号：' + element.trackingNo;
              break;
            case '7':
              obj.title = '卖家已收到买家的换货商品，待发出换货商品';
              break;
            case '8':
              obj.title =
                '卖家已发货，等待买家收货<br/>物流公司：' + element.deliveryCorp + '<br/>物流单号：' + element.trackingNo;
              obj.type = '8';
              break;
            case '1':
            case '4':
              obj.title =
                '退款失败<br/>拒绝原因：' +
                this.curRefundsInfo.returns[0].details +
                '<br/>备注：' +
                this.curRefundsInfo.returns[0].remarks;
              break;
            case '5':
              obj.title = '退款成功';
              break;
            case '9':
              obj.title = '换货完成';
              break;
            default:
              break;
          }

          if (index === 0) {
            obj.status = 'cur';
          } else {
            obj.status = 'no-started';
          }
          ary.unshift(obj);
        });
      }

      return ary;
    }
  },
  watch: {
    itemId(nval, oval) {
      this.getLogisticsInfo();
    }
  },
  created() {
    this.getLogisticsInfo();
  },
  methods: {
    ...mapMutations('Order', ['updateRefundsInfo', 'updateApplySaleItem']),
    confirmShipping() {
      let param = {
        refundsId: this.curRefundsInfo.id,
        state: '2'
      };
      http
        .put('/admin/invoicing/purchase/refunds/takeOver.jhtml', param)
        .then(data => {
          this.$message.success('操作成功');
        })
        .catch(() => {})
        .finally(() => {});
    },
    getOrderInfo() {
      let param = {
        clientType: '2',
        methodName: 'QueryOrderDetail',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderId
      };
      http
        .get(urls.hypermarketMgmt.queryOrder, param)
        .then(data => {
          data.order.orderItems.map(item => {
            if (item.id === this.itemId) {
              this.updateApplySaleItem(item);
            }
          });
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    // 修改申请回调函数
    modefyApply() {
      this.$emit('applySaleHanlder', false, this.id);
    },
    reApplyHandle() {
      this.$emit('applySaleHanlder', true);
    },
    operationSuccess() {
      this.dialogInfo = false;
      this.getLogisticsInfo();
    },
    // 取消申请回调函数
    cancelApply() {
      this.$confirm('请确认是否取消退款申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmReceive();
      });
    },
    confirmReceive() {
      let param = {
        clientType: '2',
        methodName: 'DeleteRefunds',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderItemId: this.itemId
      };

      http
        .delete(urls.hypermarketMgmt.refunds, param)
        .then(data => {
          this.$message.success('取消申请成功');
          this.$emit('operationSuccess');
        })
        .catch(() => {})
        .finally(() => {});
    },
    getLogisticsInfo() {
      let param = {
        methodName: 'QueryRefunds',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderItemId: this.itemId
      };
      http
        .get(urls.hypermarketMgmt.refundsByOrderItemId, param)
        .then(data => {
          console.log('退款详情', data);
          this.type = data.refunds.type;
          this.amount = data.refunds.amount;
          this.reason = data.refunds.reason;
          this.explain = data.refunds.explain;
          this.id = data.refunds.id;
          this.orderId = data.refunds.orderItem.orderId;

          if (this.orderInfo && this.orderInfo.orderItems) {
            this.orderInfo.orderItems.map(item => {
              if (item.id === this.itemId) {
                this.updateApplySaleItem(item);
              }
            });
          } else {
            this.getOrderInfo();
          }

          // 查询物流公司和物流单号
          data.refunds.returns.forEach(element => {
            if (element.type === '3') {
              this.deliveryCorp = element.deliveryCorp;
              this.trackingNo = element.trackingNo;
              this.shippingSn = element.shippingSn;
              return false;
            }
          });
          if (
            (data.refunds.returns[0].type === '2' ||
              data.refunds.returns[0].type === '3' ||
              data.refunds.returns[0].type === '4' ||
              data.refunds.returns[0].type === '5') &&
            this.type !== '0'
          ) {
            this.btnLabel = true;
          } else {
            this.btnLabel = false;
          }
          this.updateRefundsInfo(data.refunds);
          // 设置修改退款，取消退款按钮的显隐
          if (data.refunds.returns[0].type === '3' || data.refunds.returns[0].type === '5') {
            this.showModefyBtn = false;
            this.showCancelBtn = false;
            this.showShipping = false;
          } else if (data.refunds.returns[0].type === '4') {
            this.showModefyBtn = false;
            this.showCancelBtn = false;
            this.showShipping = false;
            this.showReApply = true;
          } else if (data.refunds.returns[0].type === '2') {
            this.showModefyBtn = false;
            this.showShipping = false;
            this.showCancelBtn = true;
          } else if (data.refunds.returns[0].type === '1') {
            this.showModefyBtn = false;
            this.showCancelBtn = false;
            this.showShipping = false;
            this.showReApply = true;
          } else if (data.refunds.returns[0].type === '8') {
            this.showShipping = true;
          } else {
            this.showModefyBtn = true;
            this.showCancelBtn = true;
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    touchCS() {
      this.$router.push({ path: '/custom-service' });
    },
    selectLogistics() {
      if (this.curRefundsInfo.returns[0].type === '2') {
        this.dialogInfo = true;
      } else if (
        this.curRefundsInfo.returns[0].type === '3' ||
        this.curRefundsInfo.returns[0].type === '4' ||
        this.curRefundsInfo.returns[0].type === '5'
      ) {
        this.dialogFollowing = true;
        this.$nextTick(() => {
          this.$refs.following.getLogisticsInfo();
        });
      }
    }
  }
};
</script>

<style lang="scss">
.refund-info {
  background: #fff;
  .o-refund-info {
    height: 100%;
    padding-top: 5px;
    font-size: 14px;
    padding: 0 15px;
    margin-top: 15px;
    .title {
      height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .h {
        font-size: 16px;
      }
    }
    .info-list {
      .info-item {
        margin-bottom: 10px;
        display: flex;
        .des {
          color: #b5b5b7;
        }
      }

      .refunds-img {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 10px 0 10px;
        .hy-images {
          flex-wrap: wrap;
        }
      }

      .order-track-content {
        height: 100%;
        padding-top: 10px;

        .trace-info {
          padding: 0 20px 0 50px;
          font-size: 14px;

          li {
            list-style-type: none;
            height: 100%;
            position: relative;
            padding: 10px 0;

            span {
              font-size: 12px;
            }
          }

          li:last-child {
            border-bottom: none;
          }

          li:last-child:after {
            display: none !important;
          }

          li.cur:before {
            background: #ff7300;
            border: #ffc37c solid 3px;
            border-radius: 50%;
            display: block;
            content: ' ';
            width: 14px;
            height: 14px;
            position: absolute;
            top: 21px;
            left: -33px;
            z-index: 1;
          }

          li.cur:after {
            background: #ccc;
            display: block;
            content: ' ';
            width: 2px;
            height: 100%;
            position: absolute;
            top: 16px;
            left: -24px;
          }

          li:before {
            background: #ccc;
            border-radius: 50%;
            display: block;
            content: '';
            width: 14px;
            height: 14px;
            position: absolute;
            top: 13px;
            left: -30px;
          }

          li:after {
            background: #ccc;
            display: block;
            content: ' ';
            width: 2px;
            height: 100%;
            position: absolute;
            top: 16px;
            left: -24px;
          }
        }
      }
    }
    .bottom-action {
      position: absolute;
      bottom: 20px;
      right: 0px;
      clear: both;
      cursor: pointer;
      .half-action {
        margin-right: 5px;
        padding: 8px 9px;
        border: #ff7300 solid 1px;
        color: #ff7300;
        border-radius: 5px;
      }
    }
  }
}
</style>
