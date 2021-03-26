<template>
  <biz-popup-tabs :open="open" :value="tabName" @close="close">
    <el-tab-pane label="分类" name="Category">
      <category-setting :open="open" :isEdit="isEdit" :itemId="itemId" @operationSuccess="operationSuccess" @createdCategorySuccess="createdCategorySuccess">
      </category-setting>
    </el-tab-pane>
    <el-tab-pane label="参数" name="Parameter" v-if="itemId">
      <parameter-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </parameter-setting>
    </el-tab-pane>
    <el-tab-pane label="资料" name="Attribute" v-if="itemId">
      <attribute-setting :itemId="itemId" :itemType="itemType" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </attribute-setting>
    </el-tab-pane>
    <el-tab-pane label="分期" name="Specification" v-if="itemId">
      <specification-setting :itemId="itemId" :itemType="itemType" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </specification-setting>
    </el-tab-pane>
    <el-tab-pane label="计算" name="Compute" v-if="itemId">
      <compute-setting :itemId="itemId" :itemType="itemType" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </compute-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import CategorySetting from './CategorySetting';
import ParameterSetting from './ParameterSetting';
import AttributeSetting from './AttributeSetting';
import SpecificationSetting from './SpecificationSetting';
import ComputeSetting from './ComputeSetting';
export default {
  name: 'CategoryMgmtPopup',
  components: {
    BizPopupTabs,
    CategorySetting,
    ParameterSetting,
    AttributeSetting,
    SpecificationSetting,
    ComputeSetting
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
    },
    itemType: {
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
      console.log('CategoryMgmtPopup::watch() Val:', Val);
    }
  }
};
</script>

<style lang="scss">
</style>
