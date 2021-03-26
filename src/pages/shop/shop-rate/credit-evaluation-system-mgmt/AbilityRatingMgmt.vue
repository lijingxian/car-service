<template>
  <biz-grid class="ability-rating-mgmt">
    <div slot="top" class="page-top">
      <el-tabs v-model="selectedTab">
        <el-tab-pane label="指标管理" name="0"></el-tab-pane>
        <el-tab-pane label="等级管理" name="1"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 指标管理 -->
    <biz-flex-table v-show="selectedTab === '0'" ref="table" :operations="operations" :tableData="tableData" :loading="loading"
      @operate="operateHandler" @selection-change="selectionChangeHandler" @filter-data-change="filterDataChangeHandler"
      @row-click="rowOperationClickHandler">
      <el-table-column prop="name" label="指标名称"></el-table-column>
      <el-table-column prop="baseScore" label="指标基础分"></el-table-column>
      <el-table-column prop="tagCount" label="标签数"></el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>

    <!-- 等级管理 -->
    <biz-flex-table v-show="selectedTab === '1'" ref="levelTable" :operations="operationsLevel" :tableData="tableDataLevel"
      :loading="loadingLevel" @operate="operateHandler" @selection-change="selectionChangeHandlerLevel" @filter-data-change="filterDataChangeHandlerLevel"
      @row-click="rowOperationClickHandlerLevel">
      <el-table-column prop="name" label="等级"></el-table-column>
      <el-table-column v-for="(column, index) in tableColumns" :key="index" :label="column.name">
        <template slot-scope="scope">
          {{scope.row.indicators[index] && scope.row.indicators[index].weight ? scope.row.indicators[index].weight + '%' : '0%'}}
        </template>
      </el-table-column>
      <el-table-column label="总计">
        <template slot-scope="scope">
          {{scope.row.total?'100%':'100%'}}
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandlerLevel($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>

    <div slot="float">
      <right-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></right-popup>
      <level-popup :open="openLevel" :itemId="itemIdLevel" @close="openLevel = false;" @operationSuccess="operationSuccess"></level-popup>
    </div>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import rightPopup from './AbilityRatingMgmt/IndicatorMgmtPopup';
import levelPopup from './AbilityRatingMgmt/LevelMgmtPopup';

import service from '@/service/shop-rate/AbilityRatingMgmt';

let dataLevel = {
  itemIdLevel: { id: '' },
  selectionsLevel: [],

  // 右侧弹窗
  openLevel: false,

  loadingLevel: false,
  tableDataLevel: [],
  tableColumns: [],
  operationsLevel: [
    {
      label: '新增',
      name: 'addLevel',
      type: 'primary'
    },
    {
      label: '删除',
      name: 'deleteLevel',
      type: '',
      disabled: true
    },
    {
      label: '刷新',
      name: 'refreshLevel',
      type: ''
    },
    {
      label: '导出评价指标表',
      name: 'exportLevel',
      type: ''
    }
  ],
  paginationLevel: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  }
};
let methodsLevel = {
  deleteItemLevel(ids) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      service.deleteLevel(
        {
          ids: ids
        },
        data => {
          this.loading = false;
          this.$message.success('删除成功');
          this.queryLevel();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    });
  },
  getQueryParamsLevel() {
    return {
      shopId: window.top.SHOP_ID || ''
    };
  },
  queryColumns() {
    this.loadingLevel = true;
    service.queryColumns(
      { shopId: window.top.SHOP_ID || '' },
      data => {
        this.loadingLevel = false;
        this.tableColumns = data.content;

        this.queryLevel();
      },
      // result_code 不是100的处理
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');
        this.loadingLevel = false;
        this.$message.warning(ErrorData.errorMessage);
      }
    );
  },
  queryLevel() {
    this.loadingLevel = true;
    service.queryLevel(
      this.getQueryParamsLevel(),
      data => {
        this.tableDataLevel = data.content;

        // this.$set(this.paginationLevel, 'total', Number.parseInt(data.total));
        this.loadingLevel = false;
      },
      // result_code 不是100的处理
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');
        this.loadingLevel = false;
        this.$message.warning(ErrorData.errorMessage);
      }
    );
  },
  addLevel() {
    this.openLevel = true;
    this.itemIdLevel = { id: '' };
  },
  refreshLevel() {
    // this.$set(this.paginationLevel, 'currentPage', 1);
    this.queryColumns();
  },
  exportLevel() {
    window.open('/admin/grade/export.jhtml');
  },
  deleteLevel() {
    if (this.selectionsLevel && this.selectionsLevel.length > 0) {
      let ids = [];
      this.selectionsLevel.forEach(element => {
        ids.push(element.id);
      });
      this.deleteItemLevel(ids);
    } else {
      this.$message('请选择一个等级');
    }
  },
  weightConverter(index, row) {
    console.log(arguments);
    return row.indicators[index].weight + '%';
  }
};
let eventsLevel = {
  pageSizeChangeLevel(val) {
    this.paginationLevel.pageSize = val;
    this.paginationLevel.currentPage = 1;
    this.query();
  },
  currentPageChangeLevel(val) {
    this.paginationLevel.currentPage = val;
    this.query();
  },
  rowOperationClickHandlerLevel(model, e, column) {
    if (column.label === '操作') return;

    this.itemIdLevel = { id: String(model.id) };
    this.openLevel = true;
  },
  selectionChangeHandlerLevel(val) {
    this.operationsLevel[1].disabled = true;
    if (val.length > 0) {
      this.operationsLevel[1].disabled = false;
    }
    this.selectionsLevel = val;
  },
  filterDataChangeHandlerLevel() {
    this.queryLevel();
  },
  deleteHandlerLevel(e, model) {
    e.stopPropagation();

    this.deleteItemLevel([model.id]);
  }
};

export default {
  name: 'TagClassMgmt',
  components: {
    BizGrid,
    BizFlexTable,
    rightPopup,
    levelPopup
  },
  props: {},
  data() {
    return {
      // 控件
      selectedTab: '0',
      itemId: { id: '' },
      selections: [],

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },

      ...Object.assign(dataLevel)
    };
  },
  methods: {
    ...methodsLevel,

    ...eventsLevel,

    deleteItem(ids) {
      this.$confirm('删除后可能导致各等级下权重不足100%，是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delete(
          {
            ids: ids
          },
          data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          }
        );
      });
    },

    operationSuccess() {
      this.open = false;
      this.openLevel = false;
      this.query();
      this.queryLevel();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model, e, column) {
      if (column.label === '操作') return;

      this.itemId = { id: String(model.id) };
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChangeHandler() {
      this.query();
    },
    deleteHandler(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },

    getQueryParams() {
      return {};
    },
    query() {
      this.loading = true;
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.content;

          // this.$set(this.pagination, 'total', Number.parseInt(data.total));
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
        }
      );
    },
    add() {
      this.open = true;
      this.itemId = { id: '' };
    },
    refresh() {
      this.query();
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    }
  },
  watch: {
    selectedTab(val) {
      if (val === '1') {
        this.queryColumns();
      }
    }
  },
  created() {
    this.query();
  },
  mounted() {
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: '您可建立店铺的评价体系，先设置评价指标，后设置各等级的权重',
      duration: 3000
    });
  }
};
</script>

<style lang="scss">
.ability-rating-mgmt {
  .page-top {
    .el-tabs {
      .el-tabs__header {
        padding: 0 20px;
        margin: 0 0 5px;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: #e4e7ed;
          z-index: 1;
        }
      }
    }
  }
}
</style>
