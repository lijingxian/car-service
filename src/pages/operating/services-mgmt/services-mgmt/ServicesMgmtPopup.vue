<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="first">
      <BaseInfo :open="open" :id="id" :classfiy="classfiy" :categoryType="categoryType" :tabSelection="tabSelection" @operationSuccess="operationSuccess" @createdServicesSuccess="createdServicesSuccess">
      </BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="功能" name="four" v-if="categoryType === '0' && id !== ''">
      <RolePermissions :open="open" :id="id" :tabSelection="tabSelection" @operationSuccess="operationSuccess" @createdServicesSuccess="createdServicesSuccess">
      </RolePermissions>
    </el-tab-pane>
    <el-tab-pane v-if="id !== ''" label="详情" name="three">
      <ServiceIntroduce :open="open" :id="id" :categoryType="categoryType" :tabSelection="tabSelection" @operationSuccess="operationSuccess" @createdServicesSuccess="createdServicesSuccess">
      </ServiceIntroduce>
    </el-tab-pane>
    <el-tab-pane v-if="id !== ''" label="服务价格" name="second">
      <ServiceInfo :id="id" :tabSelection="tabSelection" :categoryType="categoryType" @operationSuccess="operationSuccess"></ServiceInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import ServiceInfo from './ServiceInfo';
import ServiceIntroduce from './ServiceIntroduce';
import RolePermissions from './RolePermissions';
export default {
  name: 'ServicesMgmtPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    ServiceInfo,
    ServiceIntroduce,
    RolePermissions
  },
  props: {
    open: {
      type: Boolean
    },
    id: {
      type: String,
      default: ''
    },
    classfiy: {
      type: String,
      default: ''
    },
    categoryType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      tabSelection: 'first'
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    createdServicesSuccess(id, type) {
      this.$emit('createdServicesSuccess', id, type);
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.tabSelection = 'first';
      }
    }
  }
};
</script>

<style lang="scss">
</style>
