<template>
  <div class="coupon-wrap">
    <div class="check">
      <el-checkbox :value="item.checked" @input="checkChanged"></el-checkbox>
    </div>
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
          <span v-if="item.issueMode==='0'">发放周期：单次发放{{item.quantity}}张</span>
          <span v-if="item.issueMode==='1'">发放周期：周期发放</span>
          <span v-if="item.issueMode==='2'">发放周期：不限次数</span>
        </div>
      </div>
    </div>
    <el-input-number v-model="item.quantity" :min="1" controls-position="right" style="width:80px"></el-input-number>
  </div>
</template>

<script>
import ticket from '@/assets/images/pic_ticket_bg_y.png';
export default {
  name: 'CouponItem',
  components: {
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
      coupon: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    checkChanged(value) {
      this.$emit('check-change', value);
    },
    editRightCoupon(item) {
      this.coupon = item;
      this.rightDialog = true;
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
}
</style>
