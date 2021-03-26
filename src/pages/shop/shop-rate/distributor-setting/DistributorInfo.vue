<template>
  <div class="distributor-info" v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="名称：" prop="name">
        <el-input :disabled="true" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="配送费用：" prop="freight" v-show="form.isNeedDelivery==='0'">
        <el-input placeholder="请输入配送费用" v-model="form.freight">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="首重费用：" :rules="[{required: true}]" v-show="form.isNeedDelivery==='1'" :error="firstError">
        <div class="cus-first">
          <el-input v-model="form.firstPrice" @input="verifiesFirstPrice">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="form.firstWeight" @input="verifiesFirstPrice">
            <template slot="append">KG</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="续重费用：" :rules="[{ required: true}]" v-show="form.isNeedDelivery==='1'" :error="continueError">
        <div class="cus-first">
          <el-input v-model="form.continuePrice" @input="verifiesContinuePrice">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="form.continueWeight" @input="verifiesContinuePrice">
            <template slot="append">KG</template>
          </el-input>
        </div>
      </el-form-item>
      <!-- <el-form-item label="排序：" prop="order">
        <el-input placeholder="请输入正整数" v-model="form.order"></el-input>
      </el-form-item> -->
      <el-form-item label="启用：" prop="isValid">
        <el-switch :value="isValid" @input="updateIsValid"  active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="介绍：">
        <el-input type="textarea" :disabled="true" :value="description"></el-input>
      </el-form-item>
    </el-form>
    <biz-save-button slot="bottom" :operations="operations" @operate="operate"></biz-save-button>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
// import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

const integerValid = value => {
  let reg = new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
  return reg.test(value);
};

const decimalValid = value => {
  let reg = new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
  return reg.test(value);
};

export default {
  name: 'SistributorInfo',
  components: { BizSaveButton },
  props: {
    obj: Object
  },
  data() {
    const freightValid = (rule, rules, callback) => {
      let reg = new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
      if (this.form.freight !== '') {
        if (reg.test(this.form.freight)) {
          callback();
        } else {
          callback(new Error('请输入正整数或两位小数'));
        }
      }
      callback();
    };

    const orderValid = (rule, rules, callback) => {
      let reg = new RegExp('^(([1-9]*[1-9][0-9]*)|(0))$');
      if (this.form.order !== '') {
        if (reg.test(this.form.order)) {
          callback();
        } else {
          callback(new Error('必须为正整数或零'));
        }
      }
      callback();
    };
    return {
      firstError: '',
      continueError: '',
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        isValid: '1',
        isNeedDelivery: '0',
        isNeedReceiver: '1',
        continuePrice: '3',
        continueWeight: '1',
        firstPrice: '10',
        firstWeight: '1',
        freight: '30',
        order: '0',
        description: ''
      },
      rules: {
        freight: [
          { required: true, message: '请输入配送费用', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: freightValid
          }
        ],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          {
            required: true,
            trigger: 'blur',
            validator: orderValid
          }
        ]
      }
    };
  },
  computed: {
    description() {
      let reg = /<\/?.+?\/?>/g;
      return this.form.description.replace(reg, '');
    },
    isValid() {
      return this.form.isValid === '1';
    }
  },
  watch: {
    obj() {
      this.refresh();
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    verifiesFirstPrice() {
      if (!decimalValid(this.form.firstPrice) || !decimalValid(this.form.firstWeight)) {
        this.firstError = '请输入合理数值';
        return;
      }
      this.firstError = '';
    },
    verifiesContinuePrice() {
      if (!decimalValid(this.form.continuePrice) || !decimalValid(this.form.continueWeight)) {
        this.continueError = '请输入合理数值';
        return;
      }
      this.continueError = '';
    },
    operate(name) {
      this[name]();
    },
    updateIsValid(value) {
      if (value) {
        this.form.isValid = '1';
        return;
      }
      this.form.isValid = '0';
    },
    refresh() {
      let params = {
        id: this.obj.id
      };
      this.loading = true;
      http
        .get(urls.distributorMgmt.Distributor, params)
        .then(data => {
          let distributor = data.data;
          this.form.name = distributor.name;
          this.form.isValid = distributor.isValid;
          this.form.isNeedDelivery = distributor.isNeedDelivery;
          this.form.isNeedReceiver = distributor.isNeedReceiver;
          this.form.continuePrice = distributor.continuePrice || '0';
          this.form.continueWeight = distributor.continueWeight || '0';
          this.form.firstPrice = distributor.firstPrice || '0';
          this.form.firstWeight = distributor.firstWeight || '0';
          this.form.freight = distributor.freight || '0';
          this.form.order = distributor.order;
          this.form.description = distributor.description || '';
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      this.loading = true;
      let params = {
        id: this.obj.id,
        name: this.form.name,
        description: this.form.description,
        isNeedDelivery: this.form.isNeedDelivery,
        isNeedReceiver: this.form.isNeedReceiver,
        isValid: this.form.isValid,
        continuePrice: this.form.continuePrice,
        continueWeight: this.form.continueWeight,
        firstPrice: this.form.firstPrice,
        firstWeight: this.form.firstWeight,
        freight: this.form.freight,
        order: this.form.order
      };
      http
        .put(urls.distributorMgmt.Distributor, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('refresh');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    validParams() {
      if (this.form.isNeedDelivery === '1') {
        if (!decimalValid(this.form.firstPrice)) {
          return false;
        }
        if (!decimalValid(this.form.firstWeight)) {
          return false;
        }
        if (!decimalValid(this.form.continuePrice)) {
          return false;
        }
        if (!decimalValid(this.form.continueWeight)) {
          return false;
        }
        return true;
      }
      if (this.form.isNeedDelivery === '0') {
        if (!integerValid(this.form.freight)) {
          return false;
        }
      }
      return true;
    },
    save() {
      if (!this.validParams()) {
        this.$message.warning('请正确填写表单');
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.update();
      });
    }
  }
};
</script>

<style lang="scss">
.distributor-info {
  // .biz-save-button {
  //   margin-top: 5px;
  //   float: right;
  // }
  .biz-grid__content {
    margin-right: 5px;
  }
  .cus-first {
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 170px;
      margin-right: 10px;
    }
  }
}
</style>
