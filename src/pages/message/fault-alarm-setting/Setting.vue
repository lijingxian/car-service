<template>
  <biz-grid class="setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" size="small" label-width="120px" :inline-message="true">
      <el-form-item label="推送时间" prop="dailyTime">
        <el-select v-model="form.dailyTime" placeholder="请选推送时间" size="mini">
          <el-option v-for="(date,index) in dateList" :key="index" :value="date.value" :label="date.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否发送" prop="canSendMsg">
        <el-radio v-model="form.canSendMsg" label="true" style="margin-left: 10px;">是</el-radio>
        <el-radio v-model="form.canSendMsg" label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="故障频次" prop="faultFrequency">
        <el-input v-model="form.faultFrequency" placeholder="请输入故障频次" style="width:150px;" type="number" max="10" min="1"></el-input>
        <label>次</label>
      </el-form-item>
      <el-form-item label="时间范围" prop="timeRange">
        <el-input v-model="form.timeRange" placeholder="请输入时间范围" style="width:150px;" type="number" max="365" min="1"></el-input>
        <label>天</label>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import FaultAlarmSettingService from '@/service/fault-alarm-setting/faultAlarmSetting';
import { mapGetters } from 'vuex';
export default {
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      operations: [{ label: '保存', name: 'saveAlarmSetting', type: 'primary' }],
      dateList: [
        { value: '18:00', label: '当日18:00' },
        { value: '19:00', label: '当日19:00' },
        { value: '20:00', label: '当日20:00' },
        { value: '21:00', label: '当日21:00' },
        { value: '22:00', label: '当日22:00' },
        { value: '08:00', label: '次日8:00' },
        { value: '09:00', label: '次日9:00' },
        { value: '10:00', label: '次日10:00' }
      ],
      form: {
        id: '',
        canSendMsg: '',
        faultFrequency: '',
        timeRange: '',
        dailyTime: ''
      },
      rules: {
        dailyTime: [{ required: true, message: '请选择推送时间', trigger: 'blur' }],
        canSendMsg: [{ required: true, message: '请选择发送方式', trigger: 'blur' }],
        faultFrequency: [
          { required: true, message: '请输入数字1~10!', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!/^\d+$/.test(this.form.faultFrequency)) {
                this.form.faultFrequency = '';
              }
              if (Number(this.form.faultFrequency) > 10 || Number(this.form.faultFrequency) < 1) {
                callback(new Error('请输入数字1~10!'));
              } else {
                callback();
              }
            }
          }
        ],
        timeRange: [
          { required: true, message: '请输入数字1~365!', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!/^\d+$/.test(this.form.timeRange)) {
                this.form.timeRange = '';
              }
              if (Number(this.form.timeRange) > 365 || Number(this.form.timeRange) < 1) {
                callback(new Error('请输入数字1~365!'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  props: {},
  computed: {
    ...mapGetters(['getUser'])
  },
  created() {
    this.getAlarmSetting();
  },
  watch: {},
  methods: {
    operate(name) {
      this[name]();
    },
    saveAlarmSetting() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateAlarmSetting();
        } else {
          return false;
        }
      });
    },
    // 获取故障警告设置（基本设置）
    getAlarmSetting() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      FaultAlarmSettingService.getAlarmSetting(
        params,
        data => {
          this.form.dailyTime = data.FaultAlarmSettingData.dailyTime;
          this.form.canSendMsg = data.FaultAlarmSettingData.canSendMsg;
          this.form.faultFrequency = data.FaultAlarmSettingData.faultFrequency;
          this.form.timeRange = data.FaultAlarmSettingData.timeRange;
          this.form.id = data.FaultAlarmSettingData.id;
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 修改故障警告设置（基本设置）
    updateAlarmSetting() {
      let params = {
        id: this.form.id,
        dailyTime: this.form.dailyTime,
        canSendMsg: this.form.canSendMsg,
        faultFrequency: this.form.faultFrequency,
        timeRange: this.form.timeRange
      };
      FaultAlarmSettingService.updateAlarmSetting(
        params,
        data => {
          this.$message.success('保存成功');
          this.getAlarmSetting();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>
<style lang="scss">
.setting {
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
