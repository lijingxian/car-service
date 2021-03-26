<template>
  <biz-popup-tabs :open="open" v-model="tabName" @close="close">
    <el-tab-pane label="分类" name="Category">
      <category-setting :open="open" :isEdit="isEdit" :itemId="itemId" @operationSuccess="operationSuccess"
        @createdCategorySuccess="createdCategorySuccess">
      </category-setting>
    </el-tab-pane>
    <el-tab-pane label="参数" name="Parameter" v-if="itemId">
      <parameter-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </parameter-setting>
    </el-tab-pane>
    <!-- <el-tab-pane label="属性" name="Attribute" v-if="itemId">
      <attribute-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </attribute-setting>
    </el-tab-pane> -->
    <el-tab-pane label="规格" name="Specification" v-if="itemId">
      <specification-setting :itemId="itemId" :isEdit="isEdit" @operationSuccess="operationSuccess">
      </specification-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import CategorySetting from './CategorySetting';
import ParameterSetting from './ParameterSetting';
// import AttributeSetting from './AttributeSetting';
import SpecificationSetting from './SpecificationSetting';

export default {
  name: 'CategoryMgmtPopup',
  components: {
    BizPopupTabs,
    CategorySetting,
    ParameterSetting,
    // AttributeSetting,
    SpecificationSetting
  },
  props: {
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemId: {
      type: String
    }
    // tabName: {
    //   type: String,
    //   default () {
    //     return 'Category';
    //   }
    // }
  },
  data() {
    return {
      tabName: 'Category'
    };
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
