<template>
  <biz-grid class="platform-category-mgmt">
    <biz-header :operations="operations" @operate="operate" slot="top">
    </biz-header>
    <expand-table ref="expandTable" :data="tableData" :loading="loading" @expand-change="expandChange" @deleteCategory="deleteCategory"
      @moveUp="moveUp" @moveDown="moveDown" @row-click="rowClick" @selection-change="handleSelectionChange">
    </expand-table>
    <biz-pagination slot="bottom" :pagination="pagination"></biz-pagination>
    <platform-category-mgmt-popup slot="float" :open="open" :itemId="itemId" :tabName="tabName" @close="open = false;itemId = '';"
      @operationSuccess="operationSuccess" @createdCategorySuccess="createdCategorySuccess">
    </platform-category-mgmt-popup>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import service from '@/service/system-setting/category-mgmt/platformCategoryMgmt';
import { mapGetters } from 'vuex';
import PlatformCategoryMgmtPopup from './PlatformCategoryMgmtPopup';
import ExpandTable from './components/ExpandTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
export default {
  name: 'PlatformCategoryMgmt',
  data() {
    return {
      loading: false,
      categoryId: '',
      refreshSign: true,
      open: false,
      itemId: '',
      tabName: 'Category',
      dataList: [],
      multipleSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        // {
        //   disabled: true,
        //   label: '删除',
        //   name: 'deleteList',
        //   type: ''
        // },
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
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [1000],
        total: 9
      }
    };
  },
  computed: {},
  components: {
    PlatformCategoryMgmtPopup,
    BizHeader,
    ExpandTable,
    BizGrid,
    BizPagination
  },
  created() {
    // this.initDate();
    this.getUser();
    this.refresh();
  },
  // initDate() {
  //   this.filters[0].value[0] = date.lastMonthDate();
  //   this.filters[0].value[1] = date.nowDate();
  // },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    expandChange(row, expandedRows) {},
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
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
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.open !== true) {
        this.loading = true;
      }
      service.getPlatformCategoryList(
        params,
        data => {
          this.tableData = data.ProductCategoryManage;
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
            ids.push(iterator.childrenProductCategoryData.id);
          }
          let params = {
            ids: ids
          };
          service.deletePlatformCategory(
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
    deleteCategory(row) {
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
          service.deletePlatformCategory(
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
      this.itemId = '';
      this.tabName = 'Category';
      this.open = true;
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
      this.tabName = 'Category';
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // console.log('row id:', row.id);
        // console.log('category id:', row.childrenProductCategoryData.id);
        if (this.isHead(row.id, row.childrenProductCategoryData.id)) {
          return {
            rowspan: this.getRows(row.id),
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    getRows(id) {
      for (const iterator of this.tableData) {
        if (iterator.id === id) {
          return iterator.childrenProductCategoryDataList.length + 1;
        }
      }
    },
    isHead(id, typeId) {
      if (id === typeId) {
        return true;
      } else {
        return false;
      }
    },
    operationSuccess() {
      this.refresh();
    },
    createdCategorySuccess(categoryId) {
      this.itemId = categoryId;
    }
  }
};
</script>

<style lang="scss">
.platform-category-mgmt {
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }
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
