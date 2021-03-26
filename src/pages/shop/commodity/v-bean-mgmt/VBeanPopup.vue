<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="baseinfo">
      <BaseInfo
        :open="open"
        :id="id"
        :isEdit="isEdit"
        :baseInfo="baseInfo"
        :tabSelection="tabSelection"
        @operationSuccess="operationSuccess"
        @createdProductSuccess="createdProductSuccess"
      ></BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="详情" name="detail" v-if="id">
      <Detail :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"></Detail>
    </el-tab-pane>
    <el-tab-pane label="参数" name="parameter" v-if="id">
      <Parameter :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"></Parameter>
    </el-tab-pane>
    <el-tab-pane label="属性" name="attribute" v-if="id">
      <Attribute :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"></Attribute>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import Detail from './Detail';
import Parameter from './Parameter';
import Attribute from './Attribute';

export default {
  name: 'TerminalClassPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    Detail,
    Parameter,
    Attribute
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {
          shop: {
            name: ''
          }
        };
      }
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabSelection: 'baseinfo'
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    createdProductSuccess(id, type) {
      this.$emit('createdProductSuccess', id, type);
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.tabSelection = 'baseinfo';
      }
    }
  }
};
</script>

<style lang="scss">
</style>
