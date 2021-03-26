<template>
  <biz-grid class="communi-mgmt-card-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form
      :rules="rules"
      :model="form"
      ref="form"
      label-width="125px"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="电信运营商" prop="name">
        <el-input placeholder="请输入运营商名称" :value="currentPackage.operatorName" disabled></el-input>
      </el-form-item>
      <el-form-item label="运营商套餐编号" prop="sn">
        <el-input placeholder="请输入套餐编号" :value="currentPackage.packageNumber" disabled></el-input>
      </el-form-item>
      <el-form-item label="卡号" prop="number">
        <el-input placeholder="请输入卡号" v-model="form.number" :disabled="!isCreate"></el-input>
      </el-form-item>
      <el-form-item label="卡密" prop="code">
        <el-input type="password" placeholder="请输入密码" v-model="form.code" :disabled="!isCreate"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderSn">
        <el-input placeholder="请输入订单号" v-model="form.orderSn" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input placeholder="请输入状态" :value="stateValue" disabled></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';

import service from '@/service/communi-mgmt/communiOperator';

export default {
  name: 'CardMgmtBaseInfo',
  props: {
    item: {
      type: Object,
      default() {
        return {
          code: '',
          id: '',
          number: '',
          orderSn: '',
          state: ''
        };
      }
    }
  },
  data () {
    return {
      loading: false,
      rules: {
        number: [
          { required: true, message: '请输入卡号', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      // 运营商信息
      operatorInfo: {},
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
        code: '',
        id: '',
        number: '',
        orderSn: '',
        state: ''
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.create();
        } else {
          return false;
        }
      });
    },
    create() {
      this.loading = true;
      let params = Object.assign({}, this.form, { rechargePackageId: this.currentPackage.packageId });
      service.createCardBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
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
  },
  watch: {
    item(newVal, oldVal) {
      this.clear();
      this.form = Object.assign({}, newVal);
    }
  },
  computed: {
    ...mapGetters('CommunicationCard', ['currentPackage']),
    operations() {
      if (this.isCreate) {
        return [
          { label: '保存', name: 'save', type: 'primary' }
        ];
      } else {
        return [];
      }
    },
    isCreate() {
      if (this.item.id) {
        return false;
      } else {
        return true;
      }
    },
    stateValue() {
      switch (this.form.state) {
        case '1':
          return '已使用';
        default:
          return '未使用';
      }
    }
  }
};
</script>

<style lang="scss">
.communi-mgmt-card-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
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
