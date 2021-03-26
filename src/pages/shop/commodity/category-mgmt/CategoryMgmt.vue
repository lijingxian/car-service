<template>
  <biz-grid class="category-mgmt">
    <biz-header :operations="operations" @operate="operate" slot="top" :views="views" @onSwitch="onViewSwitch">
    </biz-header>
    <category-tree v-if="this.activedView==='chart'"></category-tree>
    <expand-table ref="expandTable" :data="tableData" :loading="loading" @expand-change="expandChange" @deleteCategory="deleteCategory"
      @moveUp="moveUp" @moveDown="moveDown" @row-click="rowClick" @selection-change="handleSelectionChange" v-if="this.activedView==='list'">
    </expand-table>
    <category-mgmt-popup slot="float" :open="open" :isEdit="isEdit" :itemId="itemId" :tabName="tabName" @close="open = false;itemId = ''"
      @operationSuccess="operationSuccess" @createdCategorySuccess="createdCategorySuccess">
    </category-mgmt-popup>
    <category-mgmt-input-popup slot="float" :open="inputPopupOpen" @close="inputPopupOpen = false;" @operationSuccess="operationSuccess">
    </category-mgmt-input-popup>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import { mapGetters } from 'vuex';
import CategoryMgmtPopup from './CategoryMgmtPopup';
import CategoryMgmtInputPopup from './CategoryMgmtInputPopup';
import CategoryTree from './CategoryTree';
import http from '@/common/http';
import { global } from '@/common/urls';
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
      tabName: 'Category',
      multipleSelection: [],
      sonSelections: [],
      editShopIds: [],
      inputPopupOpen: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:productCategory.add']
        },
        {
          label: '从平台导入',
          name: 'importFromPlatForm',
          type: '',
          auth: ['admin:productCategory.import']
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
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'chart',
          title: '结构视图'
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
        // for (const childrenProductCategoryData of iterator.childrenProductCategoryDataList) {
        //   table.push({
        //     id: iterator.id,
        //     name: iterator.name,
        //     childrenProductCategoryData: {
        //       id: childrenProductCategoryData.id,
        //       name: childrenProductCategoryData.name,
        //       sort: childrenProductCategoryData.sort === 'null' ? '' : childrenProductCategoryData.sort,
        //       parameterGroupDataList: childrenProductCategoryData.parameterGroupDataList,
        //       attributeDataList: childrenProductCategoryData.attributeDataList,
        //       specificationDataList: childrenProductCategoryData.specificationDataList
        //     }
        //   });
        // }
      }
      return table;
    },
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
    }
  },
  components: {
    BizHeader,
    CategoryMgmtPopup,
    CategoryMgmtInputPopup,
    ExpandTable,
    BizGrid,
    CategoryTree
  },
  created() {
    // this.initDate();
    this.getUser();
    this.refresh();
    this.getKpi();
    this.getEditableStores();
  },
  // initDate() {
  //   this.filters[0].value[0] = date.lastMonthDate();
  //   this.filters[0].value[1] = date.nowDate();
  // },
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
    onViewSwitch(name) {
      document.querySelectorAll('.biz-header__operation-wrapper')[0].style.display = '';
      document.querySelectorAll('.biz-table-filter')[0].style.display = '';
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
        }
      }
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
    getList() {
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
      this.tabName = 'Category';
      this.open = true;
      this.itemId = '';
    },
    handleSelectionChange(val) {},
    rowClick(row) {
      console.log('rowClick:', row.id);
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
