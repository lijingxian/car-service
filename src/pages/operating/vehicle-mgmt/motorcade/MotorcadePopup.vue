<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
    >
    <el-tab-pane label="基本信息" name="0">
      <motorcade-base-info
        :itemId="itemId"
        @operationSuccess="operationSuccess" :isEdit="isEdit"
      ></motorcade-base-info>
    </el-tab-pane>
    <el-tab-pane label="公告" name="1" v-if="itemId.id">
      <motorcade-notice
        :itemId="itemId"
        @operationSuccess="operationSuccess" :isEdit="isEdit"
      ></motorcade-notice>
    </el-tab-pane>
    <el-tab-pane label="电子围栏" name="2" v-if="itemId.id">
      <vehicle-elec-fence
        :itemId="itemId"
        :isMotorcade="true"
        :motorcadeId="itemId"
        @operationSuccess="operationSuccess" :isEdit="isEdit"
      ></vehicle-elec-fence>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import MotorcadeBaseInfo from './MotorcadeBaseInfo';
import MotorcadeNotice from './MotorcadeNotice';
import VehicleElecFence from '../vehicle/VehicleElecFence';

import messageBox from '@/utils/messagebox';

export default {
  name: 'MotorcadePopup',
  components: {
    BizPopupTabs,
    MotorcadeBaseInfo,
    MotorcadeNotice,
    VehicleElecFence
  },
  props: {
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close (e) {
      this.$emit('close', e);
    },
    operationSuccess (e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open (val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
          this.$message({
            showClose: true,
            message: this.itemId.id ? '车队名称、简介、地址、头像等基本信息均在此修改哦' : '填写车队基本信息、选择车辆至车队后点击保存，车队就创建成功啦'
          });
        }, 500);
      }
    },
    tabSelection (nVal) {
      if (this.$refs.dataStreamTab) this.$refs.dataStreamTab.clearInterval();

      messageBox.clearMessageBoxes();

      switch (nVal) {
        case '0':
          this.$message({
            showClose: true,
            message: this.itemId.id ? '车队名称、简介、地址、头像等基本信息均在此修改哦' : '填写车队基本信息、选择车辆至车队后点击保存，车队就创建成功啦'
          });
          break;
        case '1':
          this.$message({
            showClose: true,
            message: '您可在此发布公告，车队成员将在群聊中查看到此公告'
          });
          break;
        case '2':
          this.$message({
            showClose: true,
            message: '新建、删除、修改电子围栏，实现对车队车辆的监控'
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">

</style>
