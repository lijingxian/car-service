<!-- 商品选择 -->
<template>
  <div class="product-selector">
    <el-button type="primary" @click="addProducts">添加</el-button>
    <el-table ref="productTable" size="small" :data="products" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;">
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column v-if="items[0] && items[0].price" prop="price" label="价格"></el-table-column>
      <el-table-column v-else prop="value" label="价格"></el-table-column>
      <el-table-column prop="option" label="操作" width="70">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: red" :disabled="disabled" @click.stop="delProduct(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <biz-dialog-selector title="选择商品" :visibility.sync="showProductSelector" :tableData="productTableData" :pagination="null"
      :filters="productFilters" :selectionKeys="selectedProductIds" :max="5" @confirmed="confirmedProduct" @filterDataChange="productFilterDataChange">
      <el-table-column property="sn" label="商品信息">
        <template slot-scope="scope">
          <div class="dialog-column">
            <div style="width:100%">
              <div>编号：{{scope.row.sn}}</div>
              <div>{{scope.row.name}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="items[0] && items[0].price" property="price" label="销售价"></el-table-column>
      <el-table-column v-else property="value" label="销售价"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
// import http from '@/common/http';
import defaultImg from '@/assets/images/commodity/pic_default_none_100.png';

export default {
  name: 'ProductSelector',
  model: {
    prop: 'items'
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultImg,
      showProductSelector: false,
      products: [],
      selectedProductIds: [],
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入商品名',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  components: {
    BizDialogSelector
  },
  computed: {
    productTableData() {
      return this.items.filter(item => new RegExp(`${this.productFilters[0].value}`, 'i').test(item.name));
    }
  },
  watch: {
    items() {
      this.selectedProductIds = this.items.filter(item => item.isSelected === '1').map(item => item.id);
      this.products = this.items.filter(item => item.isSelected === '1');
    }
  },
  mounted() {
  },
  methods: {
    addProducts() {
      this.showProductSelector = true;
    },
    delProduct(id) {
      const index = this.selectedProductIds.findIndex(productId => productId === id);
      this.selectedProductIds.splice(index, 1);
      this.products = this.items.filter(item => this.selectedProductIds.includes(item.id));
      this.items.find(i => i.id === id).isSelected = '0';
      this.$emit('input', this.items);
    },
    confirmedProduct(selectedIds) {
      this.selectedProductIds = selectedIds;
      this.products = this.items.filter(item => selectedIds.includes(item.id));
      this.items.forEach(i => {
        if (selectedIds.includes(i.id)) {
          i.isSelected = '1';
        }
      });
      this.$emit('input', this.items);
    },
    productFilterDataChange() {}
  }
};
</script>

<style lang="scss">
.product-selector {
  .el-button {
    margin-bottom: 10px;
  }
}
</style>
