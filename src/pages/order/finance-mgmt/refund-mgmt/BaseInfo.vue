<template>
  <biz-grid class="payment-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" disabled label-width="125px" size="small" v-loading="loading">
      <el-form-item label="退款单号" prop="sn">
        <el-input placeholder="" v-model="form.sn"></el-input>
      </el-form-item>
      <el-form-item label="收款人" prop="payee">
        <el-input placeholder="" v-model="form.payee"></el-input>
      </el-form-item>
      <el-form-item label="退款金额" prop="amount">
        <el-input placeholder="" v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="订单" prop="orderData">
        <el-input placeholder="" v-model="form.orderData.sn"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select placeholder="请选择状态" v-model="form.state">
          <el-option value="0" label="未确认"></el-option>
          <el-option value="1" label="拒绝退款退货申请"></el-option>
          <el-option value="2" label="同意退货申请"></el-option>
          <el-option value="3" label="买家发货"></el-option>
          <el-option value="4" label="卖家拒收"></el-option>
          <el-option value="5" label="卖家退款"></el-option>
          <el-option value="6" label="取消退款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentMethod">
        <el-select placeholder="" v-model="form.paymentMethod">
          <el-option label="在线支付" value="在线支付"></el-option>
          <el-option label="线下支付" value="线下支付"></el-option>
          <el-option label="预存款支付" value="预存款支付"></el-option>
          <el-option label="到店支付" value="到店支付"></el-option>
          <el-option label="货到付款" value="货到付款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式" prop="paymentType">
        <el-input placeholder="" v-model="form.paymentType">
          <el-option label="支付宝支付" value="支付宝支付"></el-option>
          <el-option label="微信支付" value="微信支付"></el-option>
          <el-option label="会员卡余额" value="会员卡余额"></el-option>
          <el-option label="现金" value="现金"></el-option>
          <el-option label="刷卡" value="刷卡"></el-option>
          <el-option label="汇款" value="汇款"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="付款银行" prop="payBank">
        <el-input placeholder="" v-model="form.payBank"></el-input>
      </el-form-item>
      <el-form-item label="付款账号" prop="payAccount">
        <el-input placeholder="" v-model="form.payAccount"></el-input>
      </el-form-item> -->
      <el-form-item label="操作员" prop="operator">
        <el-input placeholder="" v-model="form.operator"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="createDate">
        <el-date-picker value-format="yyyy-MM-dd" placeholder="" v-model="form.createDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="退款日期" prop="createDate">
        <el-date-picker value-format="yyyy-MM-dd" placeholder="" v-model="form.createDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" placeholder="" v-model="form.memo"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { financeMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'LogisticsBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [
        // { label: '保存', name: 'save', type: 'primary' }
      ],
      rules: {},
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        sn: '',
        payee: '',
        amount: '',
        orderData: {
          sn: ''
        },
        status: '',
        paymentMethod: '',
        operator: '',
        createDate: '',
        memo: ''
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    refresh() {
      this.loading = true;
      let params = this.itemId;
      http
        .get(financeMgmt.refund.baseInfo.query, params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.resetForm(), data.content);
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    save() {
      this.$refs.form.validate(result => {
        if (result) {
          this.submit();
        }
      });
    },
    submit() {
      if (this.itemId.id) {
        this.update();
      } else {
        this.create();
      }
    },
    create() {
      this.loading = true;
      let params = this.form;
      http
        .post(financeMgmt.refund.baseInfo.create, params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('update');
          this.form = this.resetForm();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      let params = Object.assign(this.form, this.itemId);
      http
        .put(financeMgmt.refund.baseInfo.update, params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('update');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {},
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.payment-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
