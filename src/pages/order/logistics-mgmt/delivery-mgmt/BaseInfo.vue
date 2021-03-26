<template>
  <biz-grid class="delivery-mgmt-base-info">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button> -->
    <el-form :rules="rules" :model="form" ref="form" disabled label-width="125px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="编号" prop="sn">
        <el-input placeholder="请输入编号" v-model="form.sn"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderSn">
        <el-input placeholder="请输入订单号" v-model="form.orderSn"></el-input>
      </el-form-item>
      <el-form-item label="物流公司" prop="logistics">
        <el-input placeholder="请输入物流公司" v-model="form.logistics"></el-input>
      </el-form-item>
      <el-form-item label="运单号" prop="expressSn">
        <el-input placeholder="请输入运单号" v-model="form.expressSn"></el-input>
      </el-form-item>
      <el-form-item label="物流费用" prop="freight">
        <el-input placeholder="请输入物流费用" v-model="form.freight"></el-input>
      </el-form-item>
      <el-form-item label="收货人" prop="consignee">
        <el-input placeholder="请输入收货人" v-model="form.consignee"></el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
        <el-input placeholder="请输入收货地址" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input placeholder="请输入电话" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="发货日期" prop="shippingDate">
        <el-date-picker value-format="yyyy-MM-dd" placeholder="请选择日期" v-model="form.shippingDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="操作员" prop="operator">
        <el-input placeholder="请输入操作员" v-model="form.operator"></el-input>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="memo">
        <el-input placeholder="请输入备注" v-model="form.memo"></el-input>
      </el-form-item> -->
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';

import { logisticsMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'DeliveryBaseInfo',
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
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        name: [{ required: true, message: '请填写电信运营商名称', trigger: 'blur' }]
      },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        sn: '',
        orderSn: '',
        logistics: '',
        expressSn: '',
        freight: '',
        consignee: '',
        address: '',
        phone: '',
        shippingDate: '',
        operator: '',
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
        .get(logisticsMgmt.delivery.baseInfo.query, params)
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
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.itemId.id && this.refresh();
  },
  watch: {
    itemId(newVal, oldVal) {
      console.log(1111);
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.delivery-mgmt-base-info {
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
