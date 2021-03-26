<template>
  <biz-grid class="interface-info" v-loading="loading">
    <el-form :model="form" size="small" label-width="70px">
      <el-form-item label="接口">
        <el-input v-model="form.api" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作结果">
        <el-input v-model="form.result" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="请求时间">
        <el-input v-model="form.reqTime" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="form.parameter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="响应时间">
        <el-input v-model="form.respTime" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="响应参数">
        <el-input v-model="form.responseParameter" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'interface-info',
  data() {
    return {
      loading: false,
      form: {
        api: '',
        result: '',
        reqTime: '',
        parameter: '',
        respTime: '',
        responseParameter: ''
      }
    };
  },
  props: {
    open: {
      type: Boolean
    },
    id: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: { BizGrid },
  computed: {},
  watch: {
    open(value) {
      if (value) {
        this.getInfo();
      }
    }
  },
  methods: {
    getInfo() {
      this.loading = true;
      let params = {
        id: this.id,
        type: '1'
      };
      http
        .get(urls.systemSetting.logUpdate, params)
        .then(data => {
          this.loading = false;
          console.log('信息', data);
          this.form.api = data.data !== undefined ? data.data.api : '';
          this.form.reqTime = data.data !== undefined ? data.data.reqTime : '';
          this.form.result = data.data !== undefined ? (data.data.result !== undefined ? data.data.result : '-') : '-';
          this.form.parameter = data.data !== undefined ? data.data.parameter : '';
          this.form.responseParameter = data.data !== undefined ? data.data.responseParameter : '';
          this.form.respTime = data.data !== undefined ? data.data.respTime : '';
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
.interface-info {
  padding: 40px 20px 20px 20px;
}
</style>
