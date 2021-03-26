<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <terminal-base-info :itemId="itemId" @operationSuccess="operationSuccess">
      </terminal-base-info>
    </el-tab-pane>
    <el-tab-pane label="通信信息" name="1" v-if="itemId.id">
      <communication-info :itemId="itemId" @operationSuccess="operationSuccess">
      </communication-info>
    </el-tab-pane>
    <!-- <el-tab-pane label="车辆分享" name="1" v-if="itemId.id">
      <vehicle-share :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-share>
    </el-tab-pane> -->
    <el-tab-pane label="车辆标定" name="2" v-if="itemId.id && hasAbility('19')">
      <vehicle-demarcate :itemId="itemId" :isEdit="isEdit" :terminalId="terminalId" @operationSuccess="operationSuccess"></vehicle-demarcate>
    </el-tab-pane>
    <el-tab-pane label="报警信息" name="3" v-if="itemId.id && hasAbility('26')">
      <vehicle-alert-info :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-alert-info>
    </el-tab-pane>
    <el-tab-pane label="驾驶成就" name="6" v-if="itemId.id && hasAbility('7')">
      <vehicle-driving-info :itemId="itemId" :isEdit="isEdit" :plateNumber="plateNumber" :number="number" @operationSuccess="operationSuccess"></vehicle-driving-info>
    </el-tab-pane>
    <el-tab-pane label="数据流" name="4" v-if="itemId.id && hasAbility('18')">
      <vehicle-data-stream ref="dataStreamTab" :itemId="itemId" :isEdit="isEdit" :carState="carState" @operationSuccess="operationSuccess"></vehicle-data-stream>
    </el-tab-pane>
    <el-tab-pane label="车况检测" name="5" v-if="itemId.id && hasAbility('17')">
      <vehicle-state-check :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess" @triggerTabChange="handleTriggerTabChange"></vehicle-state-check>
    </el-tab-pane>
    <el-tab-pane label="电子围栏" name="9" v-if="itemId.id">
      <vehicle-elec-fence :itemId="itemId" :isEdit="isEdit" :carState="carState" :icon="icon" @operationSuccess="operationSuccess" :isCar="true"></vehicle-elec-fence>
    </el-tab-pane>
    <el-tab-pane label="车辆仪表" name="7" v-if="itemId.id && hasAbility('31')">
      <vehicle-instrument :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-instrument>
    </el-tab-pane>
    <el-tab-pane label="行车记录" name="8" v-if="itemId.id && hasAbility('32')">
      <vehicle-driving-record :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></vehicle-driving-record>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import TerminalBaseInfo from './TerminalBaseInfo';
import CommunicationInfo from './CommunicationInfo';
// import VehicleShare from './VehicleShare';
import VehicleDemarcate from './VehicleDemarcate';
import VehicleAlertInfo from './VehicleAlertInfo';
import VehicleDataStream from './VehicleDataStream';
import VehicleStateCheck from './VehicleStateCheck';
import VehicleElecFence from './VehicleElecFence';
import VehicleDrivingInfo from './VehicleDrivingInfo';
import VehicleInstrument from './VehicleInstrument';
import VehicleDrivingRecord from './VehicleDrivingRecord';
export default {
  name: 'TerminalPopup',
  components: {
    BizPopupTabs,
    TerminalBaseInfo,
    CommunicationInfo,
    // VehicleShare,
    VehicleDemarcate,
    VehicleAlertInfo,
    VehicleDataStream,
    VehicleStateCheck,
    VehicleElecFence,
    VehicleDrivingInfo,
    VehicleInstrument,
    VehicleDrivingRecord
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
      default () {
        return { id: '' };
      }
    },
    plateNumber: {
      type: String,
      default () {
        return '';
      }
    },
    number: {
      type: String,
      default () {
        return '';
      }
    },
    terminalId: {
      type: String,
      default () {
        return '';
      }
    },
    abilities: {
      type: Object,
      default () {
        return {};
      }
    },
    carState: {
      type: Object,
      default () {
        return {};
      }
    },
    icon: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data() {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    hasAbility (ability) {
      if (this.abilities && this.abilities[ability]) return true;
      else return false;
    },

    handleTriggerTabChange (tab, type) {
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
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss">
</style>
