<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基础画像" name="baseinfo">
      <BaseInfo :open="open" :id="id" :isEdit="isEdit" :categoryId="categoryId" :baseInfo="baseInfo" :tabSelection="tabSelection"
        @operationSuccess="operationSuccess" @createdProductSuccess="createdProductSuccess">
      </BaseInfo>
    </el-tab-pane>
    <el-tab-pane label="车辆识别码" name="code" v-if="id&&categoryType==='0'">
      <vin-code :open="open" :itemId="id" :isEdit="isEdit" :tabSelection="tabSelection">
      </vin-code>
    </el-tab-pane>
    <el-tab-pane label="优惠券" name="specification" v-if="id && baseInfo.productType==='7'">
      <coupon-product :id="id" :baseInfo="baseInfo"></coupon-product>
    </el-tab-pane>
    <!-- <el-tab-pane label="详情" name="detail" v-if="id">
      <Detail :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" :categoryName="categoryName" :baseInfo="baseInfo" @operationSuccess="operationSuccess">
      </Detail>
    </el-tab-pane>
    <el-tab-pane label="参数" name="parameter" v-if="id && baseInfo.productType!=='7'">
      <Parameter :open="open" :id="id" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Parameter>
    </el-tab-pane> -->
    <el-tab-pane label="图文画像" name="pictureInfo" v-if="id">
      <PictureInfo :open="open" :id="id" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </PictureInfo>
    </el-tab-pane>
    <!-- <el-tab-pane label="属性" name="attribute" v-if="id && baseInfo.productType!=='7'">
      <Attribute :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </Attribute>
    </el-tab-pane> -->
    <el-tab-pane label="规格画像" name="specification" v-if="id && baseInfo.productType!=='7'">
      <specification :open="open" :id="id" :isEdit="isEdit" :categoryId="categoryId" :tabSelection="tabSelection" :specName="specName" :categoryName="categoryName" @operationSuccess="operationSuccess"
        @close="close">
      </specification>
    </el-tab-pane>
    <el-tab-pane label="销售画像" name="sales" v-if="id && baseInfo.productType!=='7'">
      <sales-info :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" :specName="specName" :categoryName="categoryName" @operationSuccess="operationSuccess"
        @close="close">
      </sales-info>
    </el-tab-pane>
    <el-tab-pane label="VR画像" name="vr" v-if="id && baseInfo.productType!=='7'">
      <vr-info :open="open" :id="id" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </vr-info>
    </el-tab-pane>
    <el-tab-pane label="营销画像" name="highLights" v-if="id && baseInfo.productType!=='7' && categoryName==='整车'">
      <high-lights :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" :categoryName="categoryName" :baseInfo="baseInfo" @operationSuccess="operationSuccess">
      </high-lights>
    </el-tab-pane>
    <el-tab-pane label="竞品画像" name="competingProducts" v-if="id && baseInfo.productType!=='7' && categoryName==='整车'">
      <CompetingProducts :open="open" :id="id" :isEdit="isEdit" :tabSelection="tabSelection" :categoryName="categoryName" :baseInfo="baseInfo" @operationSuccess="operationSuccess">
      </CompetingProducts>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
// import Detail from './Detail';
import HighLights from './HighLights';
import CompetingProducts from './CompetingProducts';
import PictureInfo from './PictureInfo';
import VrInfo from './VrInfo';
import SalesInfo from './SalesInfo';
// import Parameter from './Parameter';
// import Attribute from './Attribute';
import Specification from './Specification';
import CouponProduct from './CouponProduct';
import VinCode from './VinCode';
export default {
  name: 'TerminalClassPopup',
  components: {
    BizPopupTabs,
    BaseInfo,
    // Detail,
    PictureInfo,
    // Parameter,
    // Attribute,
    SalesInfo,
    Specification,
    CouponProduct,
    VinCode,
    VrInfo,
    HighLights,
    CompetingProducts
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
    categoryName: {
      type: String
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
    },
    categoryId: {
      type: String,
      default: ''
    },
    specName: {
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
