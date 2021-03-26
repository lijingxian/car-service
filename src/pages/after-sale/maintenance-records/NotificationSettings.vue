<template>
  <biz-grid class="maintenance-notification-settings">
    <biz-save-button slot="top" class="inline" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" size="small">
      <el-form-item :error="error">
          <el-checkbox v-model="mileageEnable">
            按里程
            <el-select v-model="mileageType">
              <el-option label="5000km" value="0"></el-option>
              <el-option label="7500km" value="1"></el-option>
              <el-option label="10000km" value="2"></el-option>
              <el-option label="12000km" value="3"></el-option>
              <el-option label="20000km" value="4"></el-option>
            </el-select>
          </el-checkbox>
          <el-checkbox v-model="timeEnable">
            按时间
            <el-select v-model="timeType">
              <el-option label="90天" value="0"></el-option>
              <el-option label="180天" value="1"></el-option>
              <el-option label="360天" value="2"></el-option>
            </el-select>
          </el-checkbox>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';

export default {
  name: 'NotificationSettings',
  data () {
    return {
      error: '',
      mileageEnable: true,
      timeEnable: false,
      mileageType: '0',
      timeType: '0',
      operations: [
        { label: '保存', name: 'save', type: 'primary', auth: ['admin:aftersale.maintain.edit'] }
      ]
    };
  },
  computed: {
    'Notification': function () {
      let tmp = [];
      if (this.mileageEnable) {
        tmp[0] = this.mileageType;
      } else {
        tmp[0] = '';
      }
      if (this.timeEnable) {
        tmp[1] = this.timeType;
      } else {
        tmp[1] = '';
      }
      return tmp;
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      if (this.Notification[0] === '' && this.Notification[1] === '') {
        this.error = '请至少选择一项';
        return;
      }
      this.error = '';
      let params = {
        mileageType: this.mileageType,
        timeType: this.timeType,
        mileageEnable: this.mileageEnable === true ? '1' : '0',
        timeEnable: this.timeEnable === true ? '1' : '0'
      };
      MaintenanceRecords.saveSettings(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {}
      );
    },
    refresh() {
      let params = {};
      MaintenanceRecords.getSettings(
        params,
        data => {
          this.mileageType = data.data.mileageType === '' ? '0' : data.data.mileageType;
          this.timeType = data.data.timeType === '' ? '0' : data.data.timeType;
          this.mileageEnable = data.data.mileageEnable === '1';
          this.timeEnable = data.data.timeEnable === '1';
        },
        ErrorData => {}
      );
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  watch: {
  },
  created() {
    this.refresh();
  },
  components: {
    BizGrid,
    BizSaveButton
  }
};
</script>

<style lang="scss">
.maintenance-notification-settings {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-form-item__content .el-checkbox {
    margin-left: 0;
  }
}
</style>
