<template>
  <biz-grid class="shipping-method-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small" @submit.native.prevent="onPrevent">
      <el-form-item label="名称：" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="获取配送地址：" prop="isNeedReceiver">
        <el-switch :value="isNeedReceiver" @input="updateIsNeedReceiver" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="填写物流信息：" prop="isNeedDelivery">
        <el-switch :value="isNeedDelivery" @input="updateIsNeedDelivery" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="启用：" prop="isValid">
        <el-switch :value="isValid" @input="updateIsValid" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="介绍：">
        <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'ShippingMethodInfo',
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: ' ',
        description: '',
        isNeedDelivery: '1',
        isNeedReceiver: '1',
        isValid: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      }
    };
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    obj: Object
  },
  watch: {
    obj({ id }) {
      if (id === '') {
        this.clearFormData();
      } else {
        this.refresh();
      }
    }
  },
  created() {},
  computed: {
    isNeedDelivery() {
      return this.form.isNeedDelivery === '1';
    },
    isNeedReceiver() {
      return this.form.isNeedReceiver === '1';
    },
    isValid() {
      return this.form.isValid === '1';
    }
  },
  methods: {
    updateIsNeedDelivery(value) {
      if (value) {
        this.form.isNeedDelivery = '1';
        return;
      }
      this.form.isNeedDelivery = '0';
    },
    updateIsNeedReceiver(value) {
      if (value) {
        this.form.isNeedReceiver = '1';
        return;
      }
      this.form.isNeedReceiver = '0';
    },
    updateIsValid(value) {
      if (value) {
        this.form.isValid = '1';
        return;
      }
      this.form.isValid = '0';
    },
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.obj.id === '') {
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
        id: this.obj.id
      };
      this.loading = true;
      http
        .get(urls.shippingMethodMgmt.shippingMethod, params)
        .then(data => {
          let shippingMethod = data.data;
          this.form.name = shippingMethod.name;
          this.form.isValid = shippingMethod.isValid;
          this.form.isNeedDelivery = shippingMethod.isNeedDelivery;
          this.form.isNeedReceiver = shippingMethod.isNeedReceiver;
          this.form.description = shippingMethod.description || '';
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      this.loading = true;
      let params = {
        name: this.form.name,
        description: this.form.description,
        isNeedDelivery: this.form.isNeedDelivery,
        isNeedReceiver: this.form.isNeedReceiver,
        isValid: this.form.isValid
      };
      http
        .post(urls.shippingMethodMgmt.shippingMethod, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('add-success', data.id);
          this.$emit('refresh');
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
        isValid: this.form.isValid
      };
      http
        .put(urls.shippingMethodMgmt.shippingMethod, params)
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
    clearFormData() {
      this.form.name = '';
      this.form.isValid = '1';
      this.form.isNeedDelivery = '1';
      this.form.isNeedReceiver = '1';
      this.form.description = '';
    },
    onPrevent() {
      console.log('onPrevent');
    }
  }
};
</script>

<style lang="scss">
.shipping-method-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .biz-grid__content {
    margin-right: 5px;
  }
  .el-input {
    width: 50%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-select {
    width: 100%;
  }
}
</style>
