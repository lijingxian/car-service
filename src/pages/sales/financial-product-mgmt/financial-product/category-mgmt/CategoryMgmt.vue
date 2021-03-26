<template>
  <biz-grid class="category-mgmt">
    <biz-header :operations="operations" @operate="operate" slot="top"></biz-header>
    <expand-table
      ref="expandTable"
      :data="tableData"
      :loading="loading"
      @expand-change="expandChange"
      @deleteCategory="deleteCategory"
      @moveUp="moveUp"
      @moveDown="moveDown"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    ></expand-table>
    <category-mgmt-popup
      slot="float"
      :open="open"
      :isEdit="isEdit"
      :itemId="itemId"
      :itemType="itemType"
      :tabName="tabName"
      @close="open = false;itemId = ''"
      @operationSuccess="operationSuccess"
      @createdCategorySuccess="createdCategorySuccess"
    ></category-mgmt-popup>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
// import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import { mapGetters } from 'vuex';
import CategoryMgmtPopup from './CategoryMgmtPopup';
import http from '@/common/http';
// import { global } from '@/common/urls';
import ExpandTable from './components/ExpandTable';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'CategoryMgmt',
  data() {
    return {
      expands: [],
      maxLevel: '1',
      loading: false,
      categoryId: '',
      refreshSign: true,
      open: false,
      isEdit: true,
      itemId: '',
      itemType: '',
      tabName: 'Category',
      multipleSelection: [],
      sonSelections: [],
      editShopIds: [],
      inputPopupOpen: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      tableData: [],
      dataList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      separator: '、'
    };
  },
  computed: {
    handleTableData() {
      let table = [];
      for (const iterator of this.tableData) {
        table.push({
          id: iterator.id,
          name: iterator.name,
          childrenProductCategoryData: {
            id: iterator.id,
            name: '',
            sort: iterator.sort === 'null' ? '' : iterator.sort,
            parameterGroupDataList: iterator.parameterGroupDataList,
            attributeDataList: iterator.attributeDataList,
            specificationDataList: iterator.specificationDataList
          }
        });
      }
      return table;
    }
  },
  components: {
    BizHeader,
    CategoryMgmtPopup,
    ExpandTable,
    BizGrid
  },
  created() {
    this.getKpi();
    this.refresh();
    this.getEditableStores();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    rowKeys(row) {
      return row.id;
    },
    setClassName({ row, index }) {
      return row.childrenProductCategoryDataList.length > 0 ? 'expand' : 'noexpand';
    },
    expandChange(row, expandedRows) {},
    operate(name) {
      this[name]();
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
    refresh() {
      this.getList();
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
    sonClassSelectionChange(val) {
      this.sonSelections = val;
    },
    getKpi() {
      http
        .get('/admin/financialProductCategory/financialCategoryCountQuery.jhtml', { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          let msg = '已创建产品分类' + data.createdFinancialCategory + '个';
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
    getList() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/financialProductCategory/queryFinancialProductCategoryList.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          this.loading = false;
          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 快捷操作-删除
    deleteCategory(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        let params = {
          ids: ids
        };
        http
          .delete('/admin/financialProductCategory/deleteFinancialProductCategory.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 添加分类
    add() {
      this.itemId = '';
      this.tabName = 'Category';
      this.open = true;
    },
    handleSelectionChange(val) {},
    rowClick(row) {
      console.log('rowClick:', row.id);
      this.open = true;
      this.itemId = row.id;
      this.itemType = row.type === 'finance' ? '0' : '1';
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
    handleAddParameter(id) {
      console.log('CategoryMgmt::handleAddParameter() AddParameter:', id);
      this.tabName = 'Parameter';
      this.open = true;
      this.itemId = id;
    },
    handleAddAttribute(id) {
      console.log('CategoryMgmt::handleAddAttribute() AddAttribute:', id);
      this.tabName = 'Attribute';
      this.open = true;
      this.itemId = id;
    },
    handleAddSpecification(id) {
      console.log('CategoryMgmt::handleAddSpecification() AddSpecification:', id);
      this.tabName = 'Specification';
      this.open = true;
      this.itemId = id;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
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
    },
    importFromPlatForm() {
      console.log('CategoryMgmt::importFromPlatForm()');
      this.inputPopupOpen = true;
    }
  }
};
</script>

<style lang="scss">
.noexpand {
  .el-table__expand-icon {
    visibility: hidden;
  }
}
.category-mgmt {
  .biz-popup .popup-content {
    width: 600px;
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
    border-left: 1px solid #e1e1e1;
  }
  .cell {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
  }
}
</style>
