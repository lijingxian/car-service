<template>
  <biz-grid class="payment-method-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="支付方式：" prop="paymentMethod.name">
        <div>
          <div class="biz-customcol">
            {{form.paymentMethod.name}}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="付款方式：">
        <el-scrollbar>
          <el-checkbox-group v-model="form.selectedPaymentTypes" @change="handleCheckedChange">
            <div class="checkbox-group">
              <el-checkbox v-for="item in form.paymentMethod.paymengTypes" :key="item.id" :label="item.id">
                <div class="checkbox-group-item">{{item.name}}</div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="排序:" prop="paymentMethod.order">
        <el-input placeholder="请输入排序" v-model="form.paymentMethod.order"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/system-setting/payment-method-mgmt/paymentMethodMgmt';

export default {
  name: 'PaymentMethodInfo',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        selectedPaymentTypes: [],
        paymentMethod: this.getDefaultPaymentMethod()
      },
      rules: {}
    };
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.clearFormData();
      } else {
        this.refresh();
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      this.isCreated4Editor = true;
      Service.query(
        params,
        data => {
          this.form.paymentMethod =
            data.paymentMethod !== undefined
              ? data.paymentMethod
              : this.getDefaultPaymentMethod();
          this.form.selectedPaymentTypes = this.getSelectedPaymentTypes(
            data.paymentMethod.paymengTypes
          );
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        order: this.form.paymentMethod.order,
        paymengTypes: this.form.paymentMethod.paymengTypes
      };
      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.selectedPaymentTypes = [];
      this.form.paymentMethod = this.getDefaultPaymentMethod();
    },
    getDefaultPaymentMethod() {
      return {
        id: '',
        name: '',
        method: '',
        icon: '',
        description: '',
        content: '',
        valid: '',
        order: '',
        paymengTypes: []
      };
    },
    getSelectedPaymentTypes(paymentTypes) {
      let types = [];
      if (paymentTypes === undefined) {
        return types;
      }
      paymentTypes.forEach(paymentType => {
        if (paymentType.systemValid === true) {
          types.push(paymentType.id);
        }
      });
      return types;
    },
    handleCheckedChange(checkedIds) {
      this.form.paymentMethod.paymengTypes.forEach((paymentType, i) => {
        let index = checkedIds.findIndex(id => id === paymentType.id);
        if (index === -1) {
          this.form.paymentMethod.paymengTypes[i].systemValid = false;
        } else {
          this.form.paymentMethod.paymengTypes[i].systemValid = true;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.payment-method-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .checkbox-group {
    font-size: 14px;
  }
  .el-checkbox-group .el-checkbox {
    width: 150px;
    margin: 0;
    .checkbox-group-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
