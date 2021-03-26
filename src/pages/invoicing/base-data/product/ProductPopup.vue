<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基础画像" name="baseinfo">
      <BaseInfo :open="open" :itemId="itemId" :isEdit="isEdit" :categoryId="categoryId" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess"
        @createdProductSuccess="createdProductSuccess">
      </BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="价格画像" name="price" v-if="itemId">
      <price :open="open" :itemId="itemId" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </price>
    </el-tab-pane>
    <el-tab-pane label="规格画像" name="specification" v-if="itemId">
      <specification :open="open" :itemId="itemId" :isEdit="isEdit" :categoryId="categoryId" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </specification>
    </el-tab-pane>
    <el-tab-pane label="车辆识别码" name="code" v-if="itemId&&categoryType==='0'">
      <vin-code :open="open" :itemId="itemId" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </vin-code>
    </el-tab-pane>
    <!-- <el-tab-pane label="详情" name="detail" v-if="itemId">
      <Detail :open="open" :itemId="itemId" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Detail>
    </el-tab-pane>
    <el-tab-pane label="参数" name="parameter" v-if="itemId">
      <Parameter :open="open" :itemId="itemId" :isEdit="isEdit" :categoryId="categoryId" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Parameter>
    </el-tab-pane> -->
    <el-tab-pane label="图文画像" name="pictureInfo" v-if="itemId">
      <PictureInfo :open="open" :itemId="itemId" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </PictureInfo>
    </el-tab-pane>
    <el-tab-pane label="VR画像" name="vr" v-if="itemId">
      <vr-info :open="open" :itemId="itemId" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </vr-info>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import Price from './Price';
import Specification from './Specification';
import VinCode from './VinCode';
import VrInfo from './VrInfo';
// import Detail from './Detail';
import PictureInfo from './PictureInfo';
// import Parameter from './Parameter';
export default {
  name: 'ProductPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    Specification,
    VinCode,
    VrInfo,
    // Detail,
    PictureInfo,
    // Parameter,
    Price
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
    itemId: {
      type: String,
      default: ''
    },
    categoryType: {
      type: String,
      default: ''
    },
    categoryId: {
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
