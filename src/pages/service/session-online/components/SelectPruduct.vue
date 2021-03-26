<template>
  <div class="session-select-product">
    <biz-dialog-selector
      title="选择商品"
      class="session-select-product"
      :visibility="visibility"
      :tableData="tableData"
      :selectionKeys="selectionKeys"
      :pagination="pagination"
      :filters="dialogFilters"
      @close="onClose"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
      @confirmed="confirmedProduct"
      @selectionChange="selectionChange"
      @filterDataChange="productFilterDataChange"
    >
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <div class="session-online-column">
            <img :src="scope.row.image || DefaultImg" class="product-img" />
            <div style="width:120px;">{{scope.row.fullName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" :formatter="getType" label="商品分类"></el-table-column>
      <el-table-column width="150" prop="price" label="价格"></el-table-column>
      <el-table-column width="80" prop="stock" label="库存"></el-table-column>
      <el-table-column width="80" prop="sales" label="销量"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'session-select-product',
  components: {
    BizDialogSelector
  },
  props: {
    visibility: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      DefaultImg: DefaultImg,
      tableData: [],
      selectionKeys: [],
      selectionList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getProductList();
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getProductList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getProductList();
    },
    getProductList() {
      let params = {
        state: '2', // 要上架的商品
        shopId: window.top.SHOP_ID || '',
        searchValue: this.dialogFilters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.commodity.getCommodityList, params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(error => {
          console.error(error);
        });
    },
    confirmedProduct(val) {
      this.selectionKeys = val.concat();
      this.$emit('select', this.selectionKeys);
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.pagination.currentPage = 1;
      this.getProductList();
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    productFilterDataChange() {
      this.pagination.currentPage = 1;
      this.getProductList();
    },
    onClose() {
      this.$emit('update:visibility', false);
    },
    getType(row) {
      switch (row.categoryType) {
        case '0':
          return '整车';
        case '1':
          return '车品';
        case '2':
          return '服务';
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.session-select-product {
  .session-online-column {
    display: flex;
    align-items: center;
    .product-img {
      display: block;
      width: 50px;
      height: 50px;
      margin-right: 5px;
    }
  }
}
</style>
