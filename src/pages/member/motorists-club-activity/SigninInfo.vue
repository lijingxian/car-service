<template>
  <div class="motorists-club-activity__signin-info">
    <biz-flex-table :operations="operations"
               :tableData="tableData"
               :pagination="pagination"

               @operate="operate"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :checkable="checkable"
               >
      <el-table-column prop="name" label="姓名" width="150">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column prop="plate" label="车牌">
      </el-table-column>
      <el-table-column prop="signin" label="签到信息" :formatter="getStatus">
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

export default {
  name: 'SigninInfo',
  data () {
    return {
      tableData: [],
      filters: [],
      operations: [],
      checkable: false,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  props: {
    cardId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  created () {
    setTimeout(() => {
      this.tableData = [
        { name: '张三', mobile: '18686668888', plate: '吉AAA888', signin: '1' },
        { name: '张三', mobile: '18686668888', plate: '吉AAA888' },
        { name: '张三', mobile: '18686668888', plate: '吉AAA888', signin: '1' },
        { name: '张三', mobile: '18686668888', plate: '吉AAA888' },
        { name: '张三', mobile: '18686668888', plate: '吉AAA888', signin: '1' },
        { name: '张三', mobile: '18686668888', plate: '吉AAA888', signin: '1' }
      ];
    }, 500);
  },
  methods: {
    operate (name) {

    },
    handleSizeChange (val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    getStatus (row) {
      switch (row.signin) {
        case '0':
          return '';
        case '1':
          return '已签到';
      }

      return '';
    }
  },
  watch: {

  },
  components: {
    BizFlexTable
  }
};
</script>

<style lang="scss">

</style>
