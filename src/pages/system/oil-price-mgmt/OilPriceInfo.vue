<template>
  <biz-grid class="insurance-company-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="城市：" prop="city">
        <el-input placeholder="请输入城市" v-model="form.city"></el-input>
      </el-form-item>
      <el-form-item label="89号：" prop="b90">
        <el-input placeholder="请输入89号油价" v-model="form.b90"></el-input>
      </el-form-item>
      <el-form-item label="92号：" prop="b93">
        <el-input placeholder="请输入92号油价" v-model="form.b93"></el-input>
      </el-form-item>
      <el-form-item label="95号：" prop="b97">
        <el-input placeholder="请输入95号油价" v-model="form.b97"></el-input>
      </el-form-item>
      <el-form-item label="0号：" prop="b0">
        <el-input placeholder="请输入0号油价" v-model="form.b0"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/system-setting/oil-price-mgmt/oilPriceMgmt';

export default {
  name: 'InsuranceCompanyInfo',
  data() {
    const is90PriceValid = (rule, rules, callback) => {
      if (this.form.b90 !== '' && Number(this.form.b90) >= 0) {
        callback();
      } else {
        callback(new Error('请输入有效油价 如:7.1'));
      }
    };
    const is93PriceValid = (rule, rules, callback) => {
      if (this.form.b93 !== '' && Number(this.form.b93) >= 0) {
        callback();
      } else {
        callback(new Error('请输入有效油价 如:7.1'));
      }
    };
    const is97PriceValid = (rule, rules, callback) => {
      if (this.form.b97 !== '' && Number(this.form.b97) >= 0) {
        callback();
      } else {
        callback(new Error('请输入有效油价 如:7.1'));
      }
    };
    const is0PriceValid = (rule, rules, callback) => {
      if (this.form.b0 !== '' && Number(this.form.b0) >= 0) {
        callback();
      } else {
        callback(new Error('请输入有效油价 如:7.1'));
      }
    };
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        city: '',
        b90: '',
        b93: '',
        b97: '',
        b0: ''
      },
      rules: {
        city: [{ required: true, message: '请输入城市', trigger: 'change' }],
        b90: [{ required: true, trigger: 'change', validator: is90PriceValid }],
        b93: [{ required: true, trigger: 'change', validator: is93PriceValid }],
        b97: [{ required: true, trigger: 'change', validator: is97PriceValid }],
        b0: [{ required: true, trigger: 'change', validator: is0PriceValid }]
      },
      editorStyle: {
        height: '190px',
        width: '350px'
      }
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
    id(Val) {
      if (this.open === true) {
        this.refresh();
      }
    },
    open(val) {
      this.$refs.form.clearValidate();
      if (!val) {
        this.clearFormData();
      } else {
        if (this.id === '') {
          this.refresh();
        }
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
          if (this.id === '') {
            this.add();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      Service.query(
        params,
        data => {
          this.form.city =
            data.oilPrice !== undefined ? data.oilPrice.city : '';
          this.form.b90 = data.oilPrice !== undefined ? data.oilPrice.b90 : '';
          this.form.b93 = data.oilPrice !== undefined ? data.oilPrice.b93 : '';
          this.form.b97 = data.oilPrice !== undefined ? data.oilPrice.b97 : '';
          this.form.b0 = data.oilPrice !== undefined ? data.oilPrice.b0 : '';
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    add() {
      let params = {
        city: this.form.city,
        b90: this.form.b90,
        b93: this.form.b93,
        b97: this.form.b97,
        b0: this.form.b0
      };
      Service.add(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.$emit('addSuccessNotification', data.id);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        city: this.form.city,
        b90: this.form.b90,
        b93: this.form.b93,
        b97: this.form.b97,
        b0: this.form.b0
      };
      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.city = '';
      this.form.b90 = '';
      this.form.b93 = '';
      this.form.b97 = '';
      this.form.b0 = '';
    }
  }
};
</script>

<style lang="scss">
.insurance-company-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
}
</style>
