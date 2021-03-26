<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <vehicle-base-info ref="record" :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-base-info>
    </el-tab-pane>
    <el-tab-pane label="维保记录" name="10" v-if="itemId.id&&getUser().roleLevel==='shop'&&row.plateNumber">
      <records-list ref="baseInfo" :itemId="itemId" :isEdit="isEdit" :row="row" @operationSuccess="operationSuccess">
      </records-list>
    </el-tab-pane>
    <el-tab-pane label="车辆分享" name="1" v-if="itemId.id">
      <vehicle-share :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-share>
    </el-tab-pane>
    <el-tab-pane label="车辆标定" name="2" v-if="itemId.id && hasAbility('19')">
      <vehicle-demarcate :itemId="itemId" :isEdit="isEdit" :terminalId="terminalId" @operationSuccess="operationSuccess">
      </vehicle-demarcate>
    </el-tab-pane>
    <el-tab-pane label="报警信息" name="3" v-if="itemId.id && hasAbility('26')">
      <vehicle-alert-info :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-alert-info>
    </el-tab-pane>
    <el-tab-pane label="数据流" name="4" v-if="itemId.id && hasAbility('18')">
      <vehicle-data-stream ref="dataStreamTab" :itemId="itemId" :isEdit="isEdit" :carState="carState"
        @operationSuccess="operationSuccess"></vehicle-data-stream>
    </el-tab-pane>
    <el-tab-pane label="车况检测" name="5" v-if="itemId.id && hasAbility('17')">
      <vehicle-state-check :itemId="itemId" ref="check" :isEdit="isEdit" @operationSuccess="operationSuccess"
        @triggerTabChange="handleTriggerTabChange"></vehicle-state-check>
    </el-tab-pane>
    <el-tab-pane label="电子围栏" name="6" v-if="itemId.id">
      <vehicle-elec-fence :itemId="itemId" :isEdit="isEdit" :carState="carState" :icon="icon" :isCar="true"
        @operationSuccess="operationSuccess"></vehicle-elec-fence>
    </el-tab-pane>
    <el-tab-pane label="驾驶成就" name="7" v-if="itemId.id && hasAbility('7')">
      <vehicle-driving-info :itemId="itemId" :isEdit="isEdit" :plateNumber="plateNumber" :number="number"
        @operationSuccess="operationSuccess">
      </vehicle-driving-info>
    </el-tab-pane>
    <el-tab-pane label="车辆仪表" name="8" v-if="itemId.id && hasAbility('31')">
      <vehicle-instrument :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-instrument>
    </el-tab-pane>
    <el-tab-pane label="行车记录" name="9" v-if="itemId.id && hasAbility('32')">
      <vehicle-driving-record :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-driving-record>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import VehicleBaseInfo from './VehicleBaseInfo';
import VehicleShare from './VehicleShare';
import VehicleDemarcate from './VehicleDemarcate';
import VehicleAlertInfo from './VehicleAlertInfo';
import VehicleDataStream from './VehicleDataStream';
import VehicleStateCheck from './VehicleStateCheck';
import VehicleElecFence from './VehicleElecFence';
import VehicleDrivingInfo from './VehicleDrivingInfo';
import VehicleInstrument from './VehicleInstrument';
import VehicleDrivingRecord from './VehicleDrivingRecord';
import RecordsList from './RecordsList';
import messageBox from '@/utils/messagebox';
import { mapGetters } from 'vuex';
export default {
  name: 'VehiclePopup',
  components: {
    BizPopupTabs,
    VehicleBaseInfo,
    VehicleShare,
    VehicleDemarcate,
    VehicleAlertInfo,
    VehicleDataStream,
    VehicleStateCheck,
    VehicleElecFence,
    VehicleDrivingInfo,
    VehicleInstrument,
    VehicleDrivingRecord,
    RecordsList
  },
  props: {
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    plateNumber: {
      type: String
    },
    number: {
      type: String
    },
    terminalId: {
      type: String
    },
    abilities: {
      type: Object
    },
    carState: {
      type: Object
    },
    icon: {
      type: Object
    }
  },
  data() {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    close(e) {
      this.$emit('close', e);
      if (this.$refs.dataStreamTab) this.$refs.dataStreamTab.clearInterval();
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    hasAbility(ability) {
      if (this.abilities && this.abilities[ability]) return true;
      else return false;
    },

    handleTriggerTabChange(tab, type) {
      console.log(tab, type);
      this.tabSelection = tab;
      if (tab === '0') {
        switch (type) {
          case '6':
            this.$refs.baseInfo.activeNames = ['1'];
            break;
          case '7':
            this.$refs.baseInfo.activeNames = ['6'];
            break;
          case '8':
            this.$refs.baseInfo.activeNames = ['5'];
            break;
        }
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
          messageBox.clearMessageBoxes();
          this.$message({
            showClose: true,
            message: '维护车辆信息，信息越全面越好哦'
          });
        }, 500);
      } else {
        this.$emit('closeOpen');
      }
    },
    tabSelection(nVal) {
      if (this.$refs.dataStreamTab) this.$refs.dataStreamTab.clearInterval();

      messageBox.clearMessageBoxes();

      switch (nVal) {
        case '0':
          this.$message({
            showClose: true,
            message: '维护车辆信息，信息越全面越好哦'
          });
          break;
        case '1':
          this.$message({
            showClose: true,
            message: '设置其他成员为车辆驾驶员，帮助您分配人员进行快速排班，合理使用车辆资源'
          });
          break;
        case '2':
          this.$message({
            showClose: true,
            message: '绑定设备后，可配置设备的通信信息进行标定'
          });
          break;
        case '3':
          this.$message({
            showClose: true,
            message: '车辆出现的故障时将会已报警信息提示到您，部分故障可以直接清除哦。'
          });
          break;
        case '4':
          this.$message({
            showClose: true,
            message: '车数据流信息可在此查看哦。'
          });
          break;
        case '5':
          this.$message({
            showClose: true,
            message: '定期车况检测可及时发现车辆存在的故障，及时排除避免危险发生'
          });
          this.$refs.check.getBeforResult({ carId: this.itemId.id, type: '0' });
          break;
        case '6':
          this.$message({
            showClose: true,
            message: '新建、删除、修改电子围栏，实现对车辆的监控'
          });
          break;
        case '7':
          this.$message({
            showClose: true,
            message: '通过驾驶成就，可了解自己的驾驶习惯，更正不良习惯，安全驾驶'
          });
          break;
        case '8':
          this.$message({
            showClose: true,
            message: '帮助您远程了解车辆仪表的数据。'
          });
          break;
        case '9':
          this.$message({
            showClose: true,
            message: '可进行车辆的拍照和摄像，远程了解车辆情况'
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
