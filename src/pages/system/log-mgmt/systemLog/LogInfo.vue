<template>
  <biz-grid class="log-info" v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="70px" size="small">
      <el-form-item label="操作" prop="operation">
        <el-input v-model="form.operation" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作用户" prop="operator">
        <el-input v-model="form.operator" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input v-model="form.ip" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="请求参数" prop="parameter">
        <el-input v-model="form.parameter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作结果" prop="result">
        <el-input v-model="form.result" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="createDate">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'LogInfo',
  data() {
    return {
      loading: false,
      form: {
        operation: '',
        operator: '',
        result: '',
        parameter: '',
        ip: '',
        createDate: ''
      },
      rules: {}
    };
  },
  components: {
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
      if (val) {
        this.refresh();
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    refresh() {
      this.loading = true;
      let params = {
        id: this.id,
        type: '0'
      };
      http
        .get(urls.systemSetting.logUpdate, params)
        .then(data => {
          this.loading = false;
          console.log('信息', data);
          this.form.operation = data.data !== undefined ? data.data.operation : '';
          this.form.operator = data.data !== undefined ? data.data.operator : '';
          this.form.result = data.data !== undefined ? (data.data.result !== undefined ? data.data.result : '-') : '-';
          this.form.parameter = data.data !== undefined ? data.data.parameter : '';
          this.form.ip = data.data !== undefined ? data.data.ip : '';
          this.form.createDate = data.data !== undefined ? data.data.createDate : '';
        })
        .catch(error => {
          this.loading = false;
          console.log(error.errorMessage);
        })
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss">
.log-info {
  padding: 40px 0 20px 20px;
  .el-input {
    margin-left: 0%;
    width: 90%;
  }
  .el-select {
    width: 100%;
  }
  .input-nomal-width {
    width: 340px;
    .el-textarea__inner {
      padding-left: 0px;
    }
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
