<template>
  <biz-grid class="category-mgmt__input-category-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-tree ref="tree" :data="inputCategoryData" show-checkbox node-key="id" :props="defaultProps" @check-change="handleCheckChange">
    </el-tree>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';

export default {
  name: 'InputCategorySetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '确定导入',
          name: 'save',
          type: 'primary',
          disabled: true,
          auth: ['admin:PurchaseSaleStorage.productCategory.edit']
        }
      ],
      inputCategoryData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    };
  },
  computed: {},
  props: {
    open: {
      type: Boolean
    }
  },
  created() {
    // this.query();
  },
  methods: {
    operateHandler(name) {
      this[name]();
    },
    query() {
      this.inputCategoryData = this.getInputCategoryDataList();
    },
    getInputCategoryDataList() {
      let table = [];
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      CategoryMgmtService.getInputProductCategoryList(
        params,
        data => {
          data.rootCategoryDatas.forEach((element, i) => {
            table.push({
              id: element.id,
              name: element.name,
              children: element.childrenProductCategoryDataList,
              parentId: element.parentId
            });
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
      return table;
    },
    save() {
      CategoryMgmtService.saveInputProductCategoryList(
        this.getSaveParams(),
        data => {
          this.$message.success('导入成功');
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getSaveParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        productCategoryIds: this.getCheckedIds()
      };
    },
    getCheckedIds() {
      return this.$refs.tree.getCheckedKeys();
    },
    handleCheckChange() {
      this.operations[0].disabled = !this.getCheckedIds().length;
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.query();
      }
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__input-category-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
