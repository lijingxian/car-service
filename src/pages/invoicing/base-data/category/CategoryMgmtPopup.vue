<template>
  <biz-popup-tabs :open="open" :value="tabName" @close="close">
    <el-tab-pane label="分类信息" name="Category">
      <category-setting :open="open" :isEdit="isEdit" :itemId="itemId" @operationSuccess="operationSuccess" @createdCategorySuccess="createdCategorySuccess">
      </category-setting>
    </el-tab-pane>
    <el-tab-pane label="规格信息" name="Specification" v-if="itemId">
      <specification-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </specification-setting>
    </el-tab-pane>
    <el-tab-pane label="参数" name="Parameter" v-if="itemId">
      <parameter-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </parameter-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import CategorySetting from './CategorySetting';
import SpecificationSetting from './SpecificationSetting';
import ParameterSetting from './ParameterSetting';

export default {
  name: 'CategoryMgmtPopup',
  components: {
    BizPopupTabs,
    CategorySetting,
    SpecificationSetting,
    ParameterSetting
  },
  props: {
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    itemId: {
      type: String
    },
    tabName: {
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    close(e) {
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
      this.tabName = 'Category';
      console.log('CategoryMgmtPopup::watch() Val:', Val);
    }
  }
};
</script>

<style lang="scss">
</style>
