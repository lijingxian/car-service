<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="baseinfo">
      <BaseInfo :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"
        @createdProductSuccess="createdProductSuccess">
      </BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="优惠券信息" name="specification" v-if="id && baseInfo.productType==='7'">
      <coupon-product :id="id" :baseInfo="baseInfo"></coupon-product>
    </el-tab-pane>
    <el-tab-pane label="详情" name="detail" v-if="id">
      <Detail :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Detail>
    </el-tab-pane>
    <el-tab-pane label="参数" name="parameter" v-if="id && baseInfo.productType!=='7'">
      <Parameter :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Parameter>
    </el-tab-pane>
    <el-tab-pane label="图片" name="pictureInfo" v-if="id">
      <PictureInfo :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </PictureInfo>
    </el-tab-pane>
    <el-tab-pane label="属性" name="attribute" v-if="id && baseInfo.productType!=='7'">
      <Attribute :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Attribute>
    </el-tab-pane>
    <el-tab-pane label="规格" name="specification" v-if="id && baseInfo.productType!=='7'">
      <specification :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"
        @close="close">
      </specification>
    </el-tab-pane>
    <el-tab-pane label="适用商品" name="applicableProduct" v-if="id && baseInfo.productType!=='7'">
      <ApplicableProduct :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess"
        @close="close">
      </ApplicableProduct>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import Detail from './Detail';
import PictureInfo from './PictureInfo';
import Parameter from './Parameter';
import Attribute from './Attribute';
import Specification from './Specification';
import CouponProduct from './CouponProduct';
import ApplicableProduct from './ApplicableProduct';

export default {
  name: 'TerminalClassPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    Detail,
    PictureInfo,
    Parameter,
    Attribute,
    Specification,
    CouponProduct,
    ApplicableProduct
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
