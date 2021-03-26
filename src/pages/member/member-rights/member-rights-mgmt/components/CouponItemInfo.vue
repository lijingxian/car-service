<template>
  <div class="coupon-wrap">
    <div class="coupon-item">
      <div class="coupon">
        <div class="before">
          <span class="amount">￥{{item.amount}}</span>
           <span>{{item.isRequirement === '1' ? '满' + item.minimumPrice + '减' + item.amount : '无限制'}}</span>
        </div>
        <div style="height:80px;">
          <img :src="ticket" style="height:100%;" />
        </div>
        <div class="after">
          <span>{{item.name}}</span>
          <span style="font-size:13px;color:#888888" v-if="item.dateLimitWay==='0'">使用时间：长期有效</span>
          <span style="font-size:13px;color:#888888" v-if="item.dateLimitWay==='1'">使用时间：获得后{{item.limitDays}}天内有效</span>
          <span style="font-size:13px;color:#888888" v-if="item.dateLimitWay==='2'">使用时间：截止{{item.endDate}}</span>
        </div>
      </div>
      <div>
        <span v-if="item.issueMode==='0'">发放规则：单次发放，发放数量{{item.quantity}}</span>
        <span v-if="item.issueMode==='1'">发放规则：周期发放，发放周期{{item.cycleDay}}天，发放数量{{item.quantity}}</span>
        <span v-if="item.issueMode==='2'">发放规则：不限次数</span>
      </div>
    </div>
    <div style="width:80px">
      <el-button type="text" size="mini" @click="editRightCoupon(item, 'coupon')">编辑卡券</el-button>
      <el-button type="text" size="mini" @click="editRightCoupon(item, 'issueMode')">编辑发放规则</el-button>
      <el-button type="text" size="mini" @click="deleteRight(item)">删除</el-button>
    </div>
    <right-dialog :visibility.sync="rightDialog" @update="createdRight" :mode="mode" :couponModel="coupon" :title="title"></right-dialog>
  </div>
</template>

<script>
import ticket from '@/assets/images/pic_ticket_bg_y.png';
import RightDialog from './RightDialog';
export default {
  name: 'CouponItem',
  components: {
    RightDialog
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ticket: ticket,
      rightDialog: false,
      coupon: {},
      mode: '',
      title: '卡券编辑'
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    checkChanged(value) {
      this.$emit('check-change', value);
    },
    editRightCoupon(item, val) {
      this.coupon = item;
      this.mode = val;
      if (val === 'issueMode') {
        this.title = '发放规则';
      } else {
        this.title = '卡券编辑';
      }
      this.rightDialog = true;
    },
    deleteRight(item) {
      this.$emit('deleteRight', item);
    },
    createdRight(id) {
      this.$emit('update', id);
    }
  }
};
</script>

<style lang="scss">
.coupon-wrap {
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 20px;
  .check {
    width: 20px;
  }
  .coupon-item {
    width: 350px;
    background-color: #f7f6f6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    margin-right: 10px;
    .coupon {
      display: flex;
      background: #fff;
      img {
        position: relative;
      }
      .after {
        background: #fff;
        height: 80px;
        line-height: 80px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .validity {
          color: #888888;
          font-size: 12px;
          margin-left: 10px;
        }
        span {
          font-size: 15px;
          margin-left: 20px;
          line-height: 40px;
          display: block;
        }
      }
      .before {
        background: #ffac30;
        width: 130px;
        height: 80px;
        .amount {
          font-size: 22px;
        }
        span {
          display: block;
          text-align: center;
          line-height: 40px;
          color: #fff;
          font-size: 14px;
        }
      }
    }
    .content {
      height: 250px;
      font-size: 13px;
      color: #101010;
      padding: 5px 5px 0 5px;
    }
    .bottom {
      padding: 5px 0;
      display: flex;
      justify-content: center;
      background-color: #fff;
    }
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
