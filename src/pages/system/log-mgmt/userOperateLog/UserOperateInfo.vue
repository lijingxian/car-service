<template>
  <biz-grid class="user-operate-info" v-loading="loading">
    <el-form :model="form" size="small" label-width="70px">
      <el-form-item label="操作">
        <el-input v-model="form.operation" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作用户">
        <el-input v-model="form.operator" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="IP">
        <el-input v-model="form.ip" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作途径">
        <el-input v-model="form.clientType" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="form.parameter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作结果">
        <el-input v-model="form.result" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="时间">
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
  name: 'user-operate-info',
  data() {
    return {
      loading: false,
      form: {
        ip: '',
        parameter: '',
        operator: '',
        operation: '',
        createDate: '',
        result: '',
        clientType: ''
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
        this.refresh();
      }
    }
  },
  methods: {
    refresh() {
      this.loading = true;
      let params = {
        id: this.id,
        type: '2'
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
          this.form.clientType = data.data !== undefined ? data.data.clientType : '-';

          switch (this.form.clientType) {
            case 'android':
              this.form.clientType = '安卓';
              break;
            case 'ios':
              this.form.clientType = '苹果';
              break;
            case 'weixin':
              this.form.clientType = '微信';
              break;
            case 'applicaton':
              this.form.clientType = 'pc应用程序';
              break;
            case 'defaultClientType':
              this.form.clientType = '缺省';
              break;
            case 'wechatMini':
              this.form.clientType = '微信小程序';
              break;
            case 'robot':
              this.form.clientType = '机器人';
              break;
            default:
              break;
          }
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
.user-operate-info {
  padding: 40px 20px 20px 20px;
}
</style>
