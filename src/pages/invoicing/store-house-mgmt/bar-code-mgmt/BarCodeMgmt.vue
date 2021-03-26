<template>
  <div class="bar-code-mgmt">
    <biz-flex-table v-loading="loading" ref="table" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @sort-change="handleSortChange" @active-item-change="activeItemChange"
      @cascader-change="cascaderChange">
      <el-table-column width="400" prop="name" label="规则"></el-table-column>
      <el-table-column prop="productCategoryName" label="商品分类"></el-table-column>
      <el-table-column prop="rule" label="条码规则">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" v-if="hasAuthComfirm" @click.stop="apply(scope.row)">应用</el-button>
            <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="deleteRecommend(scope.row.id)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="importtabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="baseinfo">
        <base-info :open="open" @operationSuccess="refresh" :itemId="itemId" :refreshSign="refreshSign"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import { mapGetters } from 'vuex';
import { BizPopupTabs } from '@/components/BizPopup';
import { invoicing } from '@/common/urls';
import http from '@/common/http';
import BaseInfo from './BaseInfo';
export default {
  name: 'CommodityMgmt',
  data() {
    return {
      productCategoryId: '',
      rowBaseInfo: {},
      loading: false,
      importtabName: 'baseinfo',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      itemId: '',
      open: false,
      isEdit: true,
      dialogTableVisible: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:storage.barCode.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: '',
          auth: ['admin:storage.barCode.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入规则名称',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      categoryDatas: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      sortInfo: {}
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo
  },
  created() {
    this.queryFilters();
    this.refresh();
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthComfirm() {
      return this.currentAuth.includes('admin:storage.barCode.application');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:storage.barCode.delete');
      // return true;
    }
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
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.refresh();
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser().shop.id,
        parentId: val.toString()
      };
      http
        .get('/admin/shopProduct/productCategorys.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.filters[0].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.dateList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    setCategoryFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
        // if (category.parentId === '') {
        //   options.push({ value: category.id, label: category.name });
        // }
      });

      this.filters[0].options = options;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.itemId = row.id;
      this.rowBaseInfo = row;
      this.open = true;
    },
    getList() {
      this.loading = true;
      let params = {
        productCategoryId: this.productCategoryId,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[1].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(invoicing.barCode.list, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
        });
    },
    apply(row) {
      this.$confirm('确认将【' + row.productCategoryName + '】下商品按照规则更新商品条码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        };
        this.loading = true;
        http
          .post(invoicing.barCode.batchUpdate, params)
          .then(data => {
            this.loading = false;
            this.$message.success('操作成功');
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
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    lead() {},
    add() {
      this.itemId = '';
      this.isEdit = true;
      this.open = true;
    },
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        });
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 快捷操作-删除
    deleteRecommend(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          http
            .delete(invoicing.barCode.barCode, params)
            .then(data => {
              this.loading = false;
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
        })
        .catch(() => {});
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
          http
            .delete(invoicing.barCode.barCode, params)
            .then(data => {
              this.loading = false;
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
        })
        .catch(() => {});
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
    }
  }
};
</script>

<style lang="scss">
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
}
.bar-code-mgmt {
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  img {
    height: 100px;
    width: 100px;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100px;
        white-space: nowrap;
      }
    }
  }
  .selection-column {
    text-align: center;
  }
  .biz-table-filter {
    flex: none;
  }
}
</style>
