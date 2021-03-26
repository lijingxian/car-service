<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="baseinfo">
      <BaseInfo :open="open" :id="id" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection"
        @operationSuccess="operationSuccess" @createdProductSuccess="createdProductSuccess"></BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="车辆识别码" name="code" v-if="id&&categoryType==='0'">
      <vin-code :open="open" :itemId="id" :isEdit="isEdit" :tabSelection="tabSelection">
      </vin-code>
    </el-tab-pane>
    <el-tab-pane label="详情" name="detail" v-if="id">
      <Detail :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"></Detail>
    </el-tab-pane>
    <el-tab-pane label="参数" name="parameter" v-if="id && baseInfo.productType!=='7'">
      <Parameter :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Parameter>
    </el-tab-pane>
    <el-tab-pane label="图片" name="pictureInfo" v-if="id">
      <PictureInfo :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </PictureInfo>
    </el-tab-pane>
    <el-tab-pane label="规格" name="specification" v-if="id">
      <specification :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </specification>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import Specification from './Specification';
import Detail from './Detail';
import PictureInfo from './PictureInfo';
import Parameter from './Parameter';
import VinCode from './VinCode';
export default {
  name: 'ProductPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    Specification,
    Detail,
    PictureInfo,
    Parameter,
    VinCode
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
    },
    categoryType: {
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
