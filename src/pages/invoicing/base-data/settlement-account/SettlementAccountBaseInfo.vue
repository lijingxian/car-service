<template>
  <biz-grid class="settlement-account-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="账户名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入账户名称"></el-input>
      </el-form-item>
      <el-form-item label="开户银行/金融机构" prop="accountBank">
        <el-input v-model="formModel.accountBank" placeholder="请输入开户银行/金融机构"></el-input>
      </el-form-item>
      <el-form-item label="账户编号" prop="accountNum">
        <el-input v-model="formModel.accountNum" placeholder="请输入账户编号"></el-input>
      </el-form-item>
      <el-form-item label="当前余额" prop="currentAmount">
        <el-input v-model="formModel.currentAmount" :disabled="!!itemId.id"></el-input>
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-switch v-model="formModel.isDefault" active-value="1" inactive-value="0" active-color="#ff7300" inactive-color="#d9d9d9" :disabled="disabled"></el-switch>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  disabled: false,
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    name: '',
    shopId: '',
    accountBank: '',
    accountNum: '',
    isDefault: '0',
    currentAmount: '',
    initialAmount: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    initModel(model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    query() {
      this.loading = true;
      http
        .get(urls.invoicing.settlementAccountMgmt.shopAccount, { shopId: window.top.SHOP_ID || '', id: this.itemId.id })
        .then(data => {
          // 列表
          this.initModel(data.data);
          if (data.data.isDefault === '1') {
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },
    getSaveParams() {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        accountBank: this.formModel.accountBank,
        accountNum: this.formModel.accountNum,
        currentAmount: this.formModel.currentAmount,
        isDefault: this.formModel.isDefault,
        initialAmount: this.formModel.initialAmount,
        remark: this.formModel.remark,
        shopId: this.formModel.shopId || window.top.SHOP_ID || ''
      };
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');
            if (!this.formModel.id) {
              this.formModel.id = data.id;
            }
            this.$emit('operationSuccess', this.formModel.id);
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          if (this.formModel.id) {
            http
              .put(urls.invoicing.settlementAccountMgmt.shopAccount, this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post(urls.invoicing.settlementAccountMgmt.shopAccount, this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'SettlementAccountBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    const isCurrentAmount = (rule, rules, callback) => {
      if (
        this.formModel.currentAmount === '' ||
        this.formModel.currentAmount === '0.00' ||
        Number(this.formModel.currentAmount)
      ) {
        callback();
      } else {
        callback(new Error('当前余额必须为数字值'));
      }
    };
    return {
      ...initData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        currentAmount: [
          {
            required: false,
            trigger: 'blur',
            validator: isCurrentAmount
          }
        ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      this.disabled = false;
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.settlement-account-mgmt__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-checkbox-group {
      .el-checkbox {
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

    .golden-cudgel {
      transition: height 0.3s;
      height: 518px;
      overflow: hidden;

      &.collapsed {
        height: 32px;
      }
    }
  }
}
</style>
