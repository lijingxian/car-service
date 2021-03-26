<template>
  <div class="product-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :filters="filters" :tableData="tableData" :pagination="pagination "
      @filter-data-change="filterDataChange " @selection-change="handleSelectionChange " @row-click="rowClick" @size-change="handleSizeChange "
      @current-change="handleCurrentChange ">
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="cost" label="成本价">
      </el-table-column>
      <el-table-column prop="marketPrice" label="市场价">
      </el-table-column>
      <el-table-column prop="image" label="展示图片">
        <div slot-scope="scope">
          <img :src="scope.row.image" style="width:50px;height:50px;" alt="" />
        </div>
      </el-table-column>
      <!-- <el-table-column prop="unit" label="单位">
      </el-table-column> -->
      <el-table-column prop="weight" label="重量">
      </el-table-column>
      <el-table-column prop="category" label="分类" :formatter="categoryFormatter">
      </el-table-column>
      <!-- <el-table-column prop="introduction" label="介绍">
      </el-table-column>
      <el-table-column prop="memo" label="备注">
      </el-table-column> -->
      <el-table-column width="50" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="deleteProduct(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <product-mgmt-popup slot="float" :open="openPopup" :id="productId" @close="openPopup = false;productId = '';" @refreshProduct="refresh"
      @createdProductSuccess="createdProductSuccess">
    </product-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/system-setting/product-mgmt/productMgmt';
import { mapGetters } from 'vuex';
import ProductMgmtPopup from './ProductMgmtPopup';

export default {
  name: 'ProductMgmt',
  data() {
    return {
      loading: false,
      productId: '',
      refreshSign: true,
      openPopup: false,
      multipleSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    ProductMgmtPopup
  },
  created() {
    this.getUser();
    this.refresh();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchProperty: 'name',
        searchValue: this.filters[0].value
      };
      if (this.openPopup !== true) {
        this.loading = true;
      }
      service.getProductList(
        params,
        data => {
          this.tableData = data.sessionLogList;
          // console.log(data);
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    // 过滤 T.B.D
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 批量操作-删除
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids
          };
          service.deleteBasicData(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-删除
    deleteProduct(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          service.deleteBasicData(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    categoryFormatter(row) {
      switch (row.category) {
        case '1':
          return '车品';
        case '2':
          return '汽车服务';
        default:
          break;
      }
    },
    // 添加分类
    add() {
      this.openPopup = true;
      this.productId = '';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.openPopup = true;
      this.productId = row.id;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    typeFilterHandler(value, row) {
      return row.type === value;
    },
    statusFilterHandler(value, row) {
      return row.state === value;
    },
    createdProductSuccess(productId) {
      this.productId = productId;
    }
  }
};
</script>

<style lang="scss">
.product-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .biz-two-row {
    display: flex;
    flex-wrap: wrap;
  }
  .selection-column {
    text-align: center;
  }
  .first-category-name {
    padding-top: 11px;
    vertical-align: text-top;
  }
  img[src=''] {
    opacity: 0;
  }
}
</style>
