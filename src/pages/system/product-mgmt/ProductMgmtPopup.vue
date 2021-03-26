<template>
  <biz-popup-tabs :open="open" v-model="clickTabName" @close="close">
    <el-tab-pane label="基本信息" name="Product">
      <product-setting :open="open" :id="id" @refreshProduct="refreshProduct" @createdProductSuccess="createdProductSuccess">
      </product-setting>
    </el-tab-pane>
    <el-tab-pane label="详情" name="detail" v-if="id">
      <Detail :open="open" :id="id"  @operationSuccess="refreshProduct">
      </Detail>
    </el-tab-pane>
    <el-tab-pane label="图片" name="pictureInfo" v-if="id">
      <PictureInfo :open="open" :id="id"  @operationSuccess="refreshProduct">
      </PictureInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import ProductSetting from './ProductSetting';
import Detail from './Detail';
import PictureInfo from './PictureInfo';
export default {
  name: 'ProductMgmtPopup',
  components: {
    BizPopupTabs,
    ProductSetting,
    Detail,
    PictureInfo
  },
  props: {
    open: {
      type: Boolean
    },
    id: {
      type: String
    },
    tabName: {
      type: String
    }
  },
  data() {
    return {
      openPopup: false,
      clickTabName: 'Product'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.clickTabName = 'Product';
      this.$emit('close', e);
    },
    refreshProduct(e) {
      this.$emit('refreshProduct', e);
    },
    createdProductSuccess(productId) {
      this.$emit('createdProductSuccess', productId);
    }
  },
  watch: {}
};
</script>

<style lang="scss">
</style>
