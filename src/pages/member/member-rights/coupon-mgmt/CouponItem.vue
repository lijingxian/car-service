<template>
  <div class="coupon-item" @click="query(item)">
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
      </div>
    </div>
    <div class="content">
      使用规则:
      <br />
      <span>{{item.description}}</span>
    </div>
    <div class="bottom">
      <el-button size="mini" type="primary" @click.stop="copyItem" v-if="hasAuthEdit">复制</el-button>
      <el-button size="mini" @click.stop="deleteItem" v-if="hasAuthDel">删除</el-button>
      <el-button size="mini" type="primary" @click.stop="use">去使用</el-button>
    </div>
  </div>
</template>
<script>
import ticket from '@/assets/images/pic_ticket_bg_y.png';
import { mapGetters } from 'vuex';
export default {
  name: 'CouponItem',
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ticket: ticket
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:member.memberBenefits.coupon.delete');
    },
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:member.memberBenefits.coupon.edit');
    }
  },
  watch: {},
  created() {},
  methods: {
    query(item) {
      this.$emit('query', item);
    },
    copyItem() {
      this.$emit('copy', this.item.id);
    },
    use() {
      this.$router.push({ path: '/member/member-rights-mgmt/rights-mgmt' });
    },
    deleteItem() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('delete-item', this.item.id);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.coupon-item {
  width: 350px;
  background-color: #f7f6f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 20px;
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  .coupon {
    height: 80px;
    display: flex;
    background: #fff;
    .before {
      background: #ffac30;
      width: 130px;
      height: 100%;
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
      }
    }
  }
  .content {
    height: 80px;
    font-size: 13px;
    color: #101010;
    padding: 5px 5px 0 5px;
    word-break: break-all;
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 340px;
      white-space: nowrap
    }
  }
  .bottom {
    height: 40px;
    padding: 5px 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
  }
}
</style>
