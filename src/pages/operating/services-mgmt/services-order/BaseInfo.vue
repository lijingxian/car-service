<template>
  <biz-grid class="services-mgmt-order-base-info">
    <el-form ref="form" label-width="120px" size="small" v-loading="loading" disabled :inline-message="true">
      <el-form-item label="订单编号" prop="sn">
        <el-input v-model="form.sn"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="stateFormatter">
        <el-input :value="stateFormatter"></el-input>
      </el-form-item>
      <el-form-item label="订单价格" prop="amount">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="订阅店铺" prop="shopName">
        <el-input v-model="form.shopName"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" prop="paymentTypeName">
        <el-input v-model="form.paymentTypeName"></el-input>
      </el-form-item>
      <el-form-item label="订购服务" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="name">
        <el-input :value="form.purchaseSpecification+(form.name==='短信充值'?'条':'个月')"></el-input>
      </el-form-item>
      <el-form-item label="有效期截至" prop="endTime">
        <el-input v-model="form.endTime"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BaseInfoService from '@/service/services-mgmt/services-order/baseInfo';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      form: {}
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case 'unpaid':
          return '买家未付款';
        case 'paid':
          return '交易完成';
        case 'cancelled':
          return '交易关闭';
        default:
          return '';
      }
    }
  },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = Number(value).toFixed(2);
      // num.toFixed(2)获取的是字符串
      return Number(realVal);
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    refreshSign: Boolean
  },
  components: {
    BizGrid
  },
  watch: {
    refreshSign: function() {
      this.refresh();
    }
  },
  methods: {
    refresh() {
      BaseInfoService.queryBusinessOrder(
        this.getSaveParams(),
        data => {
          this.form = data.data;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getSaveParams() {
      return {
        businessOrderId: this.id
      };
    }
  }
};
</script>

<style lang="scss">
.services-mgmt-order-base-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
