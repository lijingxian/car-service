<template>
  <biz-grid class="applicable-product">
    <biz-flex-table :loading="loading" ref="table" class="class-mgmt-tabel" :operations="operations" @operate="operateHandler" :tableData="tableData">
      <el-table-column prop="fullName" label="商品名称"></el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column prop="brandName" label="品牌"></el-table-column>
      <el-table-column prop="seriesName" label="系列"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="deleteHandler($event, scope)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-dialog-selector
      title="选择商品"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      :selectionKeys="selectedGiftIds"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="product-info-dailog"
      @confirmed="confirmedProduct"
      @filterDataChange="dialogFilterDataChange"
      @selectionChange="selectionChange"
      :checkTable="checkTable"
    >
      <el-table-column property="fullName" label="商品名称" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px" class="titleClass" :title="scope.row.fullName">{{scope.row.fullName}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column label="库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.realStock}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'ApplicableProduct',
  data() {
    return {
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      selectedGiftList: [],
      selectedGiftIds: [],
      checkTable: [],
      showDialog: false,
      DefaultImg: DefaultImg,
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      dialogFilters: [
        {
          type: 'input',
          placeholder: '请输入编号或商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      giftList: [],
      loading: false,
      tableData: [],
      selections: [],
      selectionList: [],
      addProduct: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ]
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    }
  },
  components: { BizGrid, BizFlexTable, BizDialogSelector },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    id(nVal, oVal) {
      if (nVal) {
        this.refresh();
      }
    }
  },
  methods: {
    add() {
      this.getGiftList();
      this.checkTable = this.tableData;
      this.selectedGiftIds.splice(0, this.selectedGiftIds.length);
      this.selectedGiftList.splice(0, this.selectedGiftList.length);
      this.showDialog = true;
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    getGiftList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.commodity.getCommodityList, params)
        .then(data => {
          this.giftList = data.content;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedProduct(val) {
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
    },
    handleSelect(val) {
      let contain = false;
      val.productId = val.id;
      if (this.tableData.length === 0) {
        this.tableData.push(val);
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableData.push(val);
      }
    },
    refresh() {
      this.getList();
    },
    operateHandler(name) {
      this[name]();
    },
    deleteHandler(e, model) {
      e.stopPropagation();
      this.deleteItem(model);
    },
    deleteItem(val) {
      if (val.row.id === '') {
        this.tableData.splice(val.$index, 1);
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http
            .delete('/admin/productShippingFinancialController/delectProductShippingFinancial.jhtml', {
              financialPlanId: this.id,
              productIds: [val.row.id]
            })
            .then(data => {
              this.loading = false;
              this.$message.success('删除成功');
              this.getList();
            })
            .catch(errData => {
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        });
      }
    },
    getList() {
      let params = {
        id: this.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/productShippingFinancialController/queryFinancialShippingProduct.jhtml', params)
        .then(data => {
          this.tableData = data.products;
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    save() {
      let productIds = [];
      this.tableData.map(item => {
        productIds.push(item.id);
      });
      let params = {
        financialPlanId: this.id,
        productIds: productIds
      };
      http
        .post('/admin/productShippingFinancialController/saveProductShippingFinancial.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.getList();
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
.applicable-product {
  height: 100%;
  overflow-x: hidden;
  img {
    height: 50px;
    width: 50px;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
