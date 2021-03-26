<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <motor-club-base-info :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess" @hasMemberIds="hasMemberIds"></motor-club-base-info>
    </el-tab-pane>
    <el-tab-pane label="公告" name="1" v-if="itemId.id">
      <motor-club-notice :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></motor-club-notice>
    </el-tab-pane>
    <el-tab-pane label="成员信息" name="2" v-if="itemId.id">
      <motor-club-member-info :itemId="itemId" :isEdit="isEdit" :memberIds="memberIds" @operationSuccess="operationSuccess"></motor-club-member-info>
    </el-tab-pane>
    <el-tab-pane label="签到管理" name="3" v-if="itemId.id">
      <motor-club-member-sign ref="sign" :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess"></motor-club-member-sign>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import MotorClubBaseInfo from './MotorClubBaseInfo';
import MotorClubNotice from './MotorClubNotice';
import MotorClubMemberInfo from './MotorClubMemberInfo';
import MotorClubMemberSign from './MotorClubMemberSign';
export default {
  name: 'MotorClubPopup',
  components: {
    BizPopupTabs,
    MotorClubBaseInfo,
    MotorClubNotice,
    MotorClubMemberInfo,
    MotorClubMemberSign
  },
  props: {
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    memberIds: {
      type: Array,
      default() {
        return [];
      }
    },
    itemId: {
      type: Object,
      default() {
        return { id: '' };
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
    hasMemberIds(val) {
      this.$emit('hasMemberIds', val);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
      this.$refs.sign.queryMemberList();
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
