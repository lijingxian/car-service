<template>
  <biz-grid class="terminal-info" v-loading="loading">
    <el-form :model="form" size="small" label-width="70px">
      <el-form-item label="操作">
        <el-input v-model="form.operation" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="终端类型">
        <el-input v-model="form.terminalType" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="终端编号">
        <el-input v-model="form.terminalNumber" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="form.parameter" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="操作结果">
        <el-input v-model="form.result" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="form.createDate" class="input-nomal-width" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'terminal-info',
  data() {
    return {
      loading: false,
      form: {
        operation: '',
        parameter: '',
        result: '',
        createDate: '',
        terminalType: '',
        terminalNumber: ''
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
    open(val) {
      if (val) {
        this.refresh();
      }
    }
  },
  methods: {
    refresh() {
      this.loading = true;
      let params = {
        id: this.id,
        type: '4'
      };
      http
        .get(urls.systemSetting.logUpdate, params)
        .then(data => {
          this.loading = false;
          console.log('信息', data);
          this.form.operation = data.data !== undefined ? data.data.operation : '';
          this.form.terminalType = data.data !== undefined ? data.data.terminalType : '';
          this.form.result = data.data !== undefined ? (data.data.result !== undefined ? data.data.result : '-') : '-';
          this.form.parameter = data.data !== undefined ? data.data.parameter : '';
          this.form.terminalNumber = data.data !== undefined ? data.data.terminalNumber : '';
          this.form.createDate = data.data !== undefined ? data.data.createDate : '';

          switch (this.form.terminalType) {
            case '0':
              this.form.terminalType = 'OBD';
              break;
            case '1':
              this.form.terminalType = '行车记录仪';
              break;
            case '2':
              this.form.terminalType = '车载主机';
              break;
            case '3':
              this.form.terminalType = '无钥匙启动系统';
              break;
            case '4':
              this.form.terminalType = '蓝牙OBD';
              break;
            case '5':
              this.form.terminalType = 'T-BOX';
              break;
            case '6':
              this.form.terminalType = '定位器';
              break;
            case '7':
              this.form.terminalType = '首航设备7';
              break;
            case '8':
              this.form.terminalType = '首航设备8';
              break;
            case '9':
              this.form.terminalType = '车牌识别设备';
              break;
            case '10':
              this.form.terminalType = '奥威车辆控制设备';
              break;
            case '11':
              this.form.terminalType = '深圳北斗车辆控制设备';
              break;
            case '12':
              this.form.terminalType = '卡欧自主研发的tbox设备 ';
              break;
            case '13':
              this.form.terminalType = '卡欧自主研发的乐行宝盒';
              break;
            case '14':
              this.form.terminalType = '智能接待机器人';
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
.terminal-info {
  padding: 40px 20px 20px 20px;
}
</style>
