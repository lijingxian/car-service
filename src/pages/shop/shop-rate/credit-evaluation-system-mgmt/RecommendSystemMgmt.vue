<template>
  <div class="recommend-mgmt">
    <biz-flex-table
      ref="table"
      :tableData="tableData"
      :loading="loading"
      :checkable="false"

      @row-click="handleRowOperationClick"
    >
      <el-table-column prop="name" label="等级"></el-table-column>
      <el-table-column prop="distance" label="距离" :formatter="distanceConverter"></el-table-column>
      <el-table-column prop="score" label="评分" :formatter="scoreConverter"></el-table-column>
      <el-table-column
        v-for="(column, index) in tableColumns"
        :key="index"
        :label="column.name"
      >
        <template slot-scope="scope">
          {{scope.row.gradeIndicators[index] && scope.row.gradeIndicators[index].recommendScore && ['一星', '二星', '三星', '四星', '五星'][Number(scope.row.gradeIndicators[index].recommendScore) - 1] ? '>= ' + ['一星', '二星', '三星', '四星', '五星'][Number(scope.row.gradeIndicators[index].recommendScore) - 1] : '--'}}
        </template>
      </el-table-column>
    </biz-flex-table>

    <div slot="float">
      <right-popup
        :open="open"
        :itemId="itemId"
        @close="open = false;"
        @operationSuccess="handleOperationSuccess"
      ></right-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import rightPopup from './RecommendMgmt/RecommendSystemMgmtPopup';

import service from '@/service/shop-rate/RecommendMgmt';

let data = {
  itemId: { id: '' },
  selections: [],

  // 右侧弹窗
  open: false,

  loading: false,
  tableData: [],
  tableColumns: []
};
let methods = {
  distanceConverter (row) {
    if (row.distance) {
      return '<=' + row.distance + 'km';
    } else {
      return '--';
    }
  },
  scoreConverter (row) {
    if (row.score) {
      let arr = ['一星', '二星', '三星', '四星', '五星'];
      return '>= ' + arr[Number(row.score) - 1];
    } else {
      return '--';
    }
  },

  deleteItem (ids) {
    this.$confirm('是否确认删除?', '提示', {
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
          this.queryColumns();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    });
  },
  getQueryParams () {
    return {
      shopId: window.top.SHOP_ID || ''
    };
  },
  query () {
    this.loading = true;
    service.query(
      this.getQueryParams(),
      data => {
        this.tableData = data.content;

        this.loading = false;
      },
      // result_code 不是100的处理
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');
        this.loading = false;
        this.$message.warning(ErrorData.errorMessage);
      }
    );
  },
  queryColumns () {
    this.loadingLevel = true;
    service.queryColumns(
      { shopId: window.top.SHOP_ID || '' },
      data => {
        this.tableColumns = data.content;

        this.query();
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
  add () {
    this.open = true;
    this.itemId = { id: '' };
  },
  refresh () {
    this.queryColumns();
  },
  export () {
    console.log('export');
  },
  delete () {
    if (this.selections && this.selections.length > 0) {
      let ids = [];
      this.selections.forEach(element => {
        ids.push(element.id);
      });
      this.deleteItem(ids);
    } else {
      this.$message('请选择一个等级');
    }
  }
};
let events = {
  handleOperationSuccess () {
    this.open = false;
    this.openLevel = false;
    this.queryColumns();
  },
  handleOperate (name) {
    this[name]();
  },
  handleRowOperationClick (model, e, column) {
    if (column.label === '操作') return;

    this.itemId = JSON.parse(JSON.stringify(model));
    this.open = true;
  }
};

export default {
  name: 'RecommendMgmt',
  components: {
    BizFlexTable,
    rightPopup
  },
  props: {

  },
  data () {
    return {
      ...Object.assign(data)
    };
  },
  methods: {
    ...methods,

    ...events
  },
  watch: {

  },
  created () {
    this.queryColumns();
  },
  mounted () {
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: '您可在此设置联盟店铺的推荐规则，符合规则的将会优先推荐',
      duration: 3000
    });
  }
};
</script>

<style lang="scss">

</style>
