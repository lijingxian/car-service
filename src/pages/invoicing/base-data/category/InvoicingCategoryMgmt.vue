<template>
  <biz-grid class="invoicing-category-mgmt">
    <div slot="top" class="invoicing-category-mgmt-header">
      <biz-header :operations="operations" @operate="operate"></biz-header>
    </div>
    <expand-table
      ref="expandTable"
      :data="tableData"
      :loading="loading"
      @expand-change="expandChange"
      :isSearch="isSearch"
      @delete="handleDelete"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      @moveUp="moveUp"
      @moveDown="moveDown"
    ></expand-table>
    <biz-pagination slot="bottom" :pagination="pagination"></biz-pagination>
    <category-mgmt-popup
      slot="float"
      :open="open"
      :isEdit="isEdit"
      :itemId="itemId"
      :tabName="tabName"
      @close="open = false;itemId = '';"
      @operationSuccess="operationSuccess"
      @createdCategorySuccess="createdCategorySuccess"
    ></category-mgmt-popup>
    <category-mgmt-input-popup slot="float" :open="inputPopupOpen" @close="inputPopupOpen = false;" @operationSuccess="operationSuccess"></category-mgmt-input-popup>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import ExpandTable from './components/ExpandTable';
import { BizGrid } from '@/components/BizGrid';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import CategoryMgmtPopup from './CategoryMgmtPopup';
import CategoryMgmtInputPopup from './CategoryMgmtInputPopup';
import http from '@/common/http';
import { global } from '@/common/urls';

export default {
  name: 'InvoicingCategoryMgmt',
  data() {
    return {
      loading: false,
      categoryId: '',
      refreshSign: true,
      open: false,
      isEdit: true,
      itemId: '',
      tabName: 'Category',
      isSearch: true,
      currentRow: {},
      multipleSelection: [],
      editShopIds: [],
      inputPopupOpen: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:PurchaseSaleStorage.productCategory.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '从平台导入',
          name: 'importFromPlatForm',
          type: '',
          auth: ['admin:PurchaseSaleStorage.productCategory.import']
        }
      ],
      tableData: [],
      dataList: [],
      pagination: {
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [1000],
        total: 9
      }
    };
  },
  computed: {},
  components: {
    ExpandTable,
    BizGrid,
    BizHeader,
    CategoryMgmtPopup,
    CategoryMgmtInputPopup,
    BizPagination
  },
  created() {
    this.refresh();
    this.getKpi();
    this.getEditableStores();
  },
  mounted() {
    if (this.$route.query.id) {
      console.log(this.$route.query.from);
      if (this.$route.query.from === 'parameter') {
        this.tabName = 'Parameter';
      } else {
        this.tabName = 'Specification';
      }
      this.itemId = this.$route.query.id;
      this.open = true;
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    expandChange(row) {
      this.currentRow = row;
      this.getList(row);
    },
    getChildren(child, row, type) {
      let sort = row.sort;
      child.map(item => {
        if (item.id === row.id) {
          if (type === 'up') {
            child[child.indexOf(row)].sort = child[child.indexOf(row) - 1].sort;
            child[child.indexOf(row) - 1].sort = sort;
            this.dataList = [child[child.indexOf(row)], child[child.indexOf(row) - 1]];
          } else {
            child[child.indexOf(row)].sort = child[child.indexOf(row) + 1].sort;
            child[child.indexOf(row) + 1].sort = sort;
            this.dataList = [child[child.indexOf(row)], child[child.indexOf(row) + 1]];
          }

          this.sort();
        } else {
          if (item.childrenProductCategoryDataList) {
            this.getChildren(item.childrenProductCategoryDataList, row, type);
          }
        }
      });
    },
    moveUp(row) {
      this.loading = true;
      let sort = row.sort;
      this.tableData.map(item => {
        if (item.id === row.id) {
          this.tableData[this.tableData.indexOf(row)].sort = this.tableData[this.tableData.indexOf(row) - 1].sort;
          this.tableData[this.tableData.indexOf(row) - 1].sort = sort;
          this.dataList = [this.tableData[this.tableData.indexOf(row)], this.tableData[this.tableData.indexOf(row) - 1]];
          this.sort();
        } else {
          if (item.childrenProductCategoryDataList) {
            this.getChildren(item.childrenProductCategoryDataList, row, 'up');
          }
        }
      });
    },
    moveDown(row) {
      this.loading = true;
      let sort = row.sort;
      this.dataList = [];
      this.tableData.map(item => {
        if (item.id === row.id) {
          this.tableData[this.tableData.indexOf(row)].sort = this.tableData[this.tableData.indexOf(row) + 1].sort;
          this.tableData[this.tableData.indexOf(row) + 1].sort = sort;
          this.dataList = [this.tableData[this.tableData.indexOf(row)], this.tableData[this.tableData.indexOf(row) + 1]];
          this.sort();
        } else {
          this.getChildren(item.childrenProductCategoryDataList, row, 'down');
        }
      });
    },
    sort() {
      http
        .put('/admin/product_category/categorySort.jhtml', this.dataList)
        .then(data => {
          this.getList();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    refresh() {
      this.getList();
    },
    getKpi() {
      http
        .get('/admin/product/queryNavigationKpi.jhtml', {})
        .then(data => {
          let msg = '维护店铺商品分类。已维护分类' + data.data.productCategoryCount + '个';
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '2'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList(row) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.open !== true && this.inputPopupOpen !== true) {
        this.loading = true;
      }
      CategoryMgmtService.getProductCategoryList(
        params,
        data => {
          this.tableData = data.ProductCategoryManage;
          for (const iterator of this.tableData) {
            if (iterator.childrenProductCategoryDataList.length > 0) {
              iterator.hasChild = '1';
              let table = [];
              for (const item of iterator.childrenProductCategoryDataList) {
                table.push({
                  id: item.id ? item.id : '',
                  name: item.name,
                  sort: item.sort === 'null' ? '' : item.sort,
                  specificationDataList: item.specificationDataList,
                  parentId: item.parentId,
                  hasChild: '0'
                });
              }
            }
          }
          // console.log(data);
          this.pagination.total = Number(data.dataSum);
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
      // this.refresh();
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
          CategoryMgmtService.deleteProductCategory(
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
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          let params = {
            ids: ids
          };
          CategoryMgmtService.deleteProductCategory(
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
    // 添加分类
    add() {
      this.open = true;
      this.itemId = '';
      this.tabName = 'Category';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.open = true;
      this.itemId = row.id;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    operationSuccess() {
      this.refresh();
    },
    createdCategorySuccess(categoryId) {
      this.itemId = categoryId;
    },
    importFromPlatForm() {
      this.inputPopupOpen = true;
    }
  }
};
</script>

<style lang="scss">
.invoicing-category-mgmt {
  .biz-customcol {
    height: 100%;
    overflow-x: hidden;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }

  .class-mgmt-tabel {
    .el-table__expanded-cell[class*='cell'] {
      padding: 10px 0 10px 50px;
    }
  }
  .first-category-name {
    .el-table__expand-icon {
      display: none;
    }
  }
  .biz-pagination .el-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
}
</style>
