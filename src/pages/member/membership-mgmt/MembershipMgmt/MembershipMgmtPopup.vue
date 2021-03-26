<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
  >
    <el-tab-pane label="基础画像" name="0" v-if="!isAssets">
      <membership-mgmt-base-info
        :itemId="itemId" :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></membership-mgmt-base-info>
    </el-tab-pane>
    <el-tab-pane label="社会画像" name="11" v-if="!isAssets">
      <membership-mgmt-society-info
        :itemId="itemId" :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></membership-mgmt-society-info>
    </el-tab-pane>
    <el-tab-pane label="车辆信息" name="1" v-if="itemId.id!==''&&isAssets">
      <membership-mgmt-vehicle-info
        :itemId="itemId" :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></membership-mgmt-vehicle-info>
    </el-tab-pane>
    <el-tab-pane label="实名认证" name="2" v-if="getUser.roleLevel !== 'shop'&& itemId.id!==''&&!isAssets">
      <membership-certification
        :itemId="itemId" :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></membership-certification>
    </el-tab-pane>
    <el-tab-pane label="终端信息" name="3" v-if="itemId.id!==''&&isAssets">
      <membership-mgmt-terminal
        :itemId="itemId" :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></membership-mgmt-terminal>
    </el-tab-pane>
    <el-tab-pane label="电子围栏" name="4" v-if="itemId.id!==''&&isAssets">
      <vehicle-elec-fence
        :itemId="itemId"
        :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></vehicle-elec-fence>
    </el-tab-pane>
    <el-tab-pane label="权益画像" name="5" v-if="itemId.id!==''&&!isAssets">
      <member-rights :itemId="itemId" :isEdit="isEdit" :storeId="storeId" @adjustment="adjustment"></member-rights>
    </el-tab-pane>
    <el-tab-pane label="行为画像" name="6" v-if="itemId.id!==''&&!isAssets">
      <member-news :itemId="itemId" :isEdit="isEdit"></member-news>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import MembershipMgmtBaseInfo from './MembershipMgmtBaseInfo';
import MembershipMgmtSocietyInfo from './MembershipMgmtSocietyInfo';
import MembershipMgmtVehicleInfo from './MembershipMgmtVehicleInfo';
import MembershipMgmtTerminal from './MembershipMgmtTerminal';
import MembershipCertification from './MembershipMgmtCertification';
import VehicleElecFence from '@/pages/operating/vehicle-mgmt/vehicle/VehicleElecFence';
import { mapGetters } from 'vuex';
import MemberRights from './MemberRights';
import MemberNews from './MemberNews';

export default {
  name: 'MembershipMgmtPopup',
  components: {
    MemberNews,
    MemberRights,
    BizPopupTabs,
    MembershipMgmtBaseInfo,
    MembershipMgmtSocietyInfo,
    MembershipMgmtVehicleInfo,
    MembershipCertification,
    MembershipMgmtTerminal,
    VehicleElecFence
  },
  props: {
    storeId: {
      type: Array
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    isAssets: {
      type: Boolean,
      default () {
        return false;
      }
    },
    itemId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    },
    chargeId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    },
    memberId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  data () {
    return {
      tabSelection: '0',
      alertId: { id: '' },

      showFailure: true,
      showSign: true
    };
  },
  methods: {
    close (e) {
      this.$emit('close', e);
      this.tabSelection = '0';
    },
    adjustment(val, row) {
      console.log(row + '11');
      this.$emit('adjustment', val, row);
    },
    operationSuccess (e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.tabSelection = '0';
      }
    }
  }
};
</script>

<style lang="scss">

</style>
