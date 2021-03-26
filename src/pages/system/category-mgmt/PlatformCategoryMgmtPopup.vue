<template>
  <biz-popup-tabs :open="open" v-model="tabName" @close="close">
    <el-tab-pane label="分类" name="Category">
      <platform-category-setting :open="open" :itemId="itemId" @operationSuccess="operationSuccess"
        @createdCategorySuccess="createdCategorySuccess">
      </platform-category-setting>
    </el-tab-pane>
    <el-tab-pane label="参数" name="Parameter" v-if="itemId">
      <parameter-setting :itemId="itemId" @operationSuccess="operationSuccess">
      </parameter-setting>
    </el-tab-pane>
    <el-tab-pane label="属性" name="Attribute" v-if="itemId">
      <attribute-setting :itemId="itemId" @operationSuccess="operationSuccess">
      </attribute-setting>
    </el-tab-pane>
    <el-tab-pane label="规格" name="Specification" v-if="itemId">
      <specification-setting :itemId="itemId" @operationSuccess="operationSuccess">
      </specification-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import PlatformCategorySetting from './PlatformCategorySetting';
import ParameterSetting from './ParameterSetting';
import AttributeSetting from './AttributeSetting';
import SpecificationSetting from './SpecificationSetting';
export default {
  name: 'PlatformCategoryMgmtPopup',
  components: {
    BizPopupTabs,
    PlatformCategorySetting,
    ParameterSetting,
    AttributeSetting,
    SpecificationSetting
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: String
    }
    // tabName: {
    //   type: String
    // }
  },
  data() {
    return {
      tabName: 'Category'
    };
  },
  computed: {
    // tabName: {
    //   get: function() {
    //     return this.tabName;
    //   },
    //   set: function() {}
    // }
  },
  methods: {
    close(e) {
      this.tabName = 'Category';
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    createdCategorySuccess(categoryId) {
      this.$emit('createdCategorySuccess', categoryId);
    }
  },
  watch: {
    itemId(Val) {
      console.log('CategoryMgmtPopup::watch() Val:', Val);
    }
  }
};
</script>

<style lang="scss">
</style>
