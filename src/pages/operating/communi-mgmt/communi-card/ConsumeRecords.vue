<template>
  <div class="communi-card-consume-records">
    <biz-flex-table ref="table" :tableData="tableData" :checkable="false">
      <el-table-column label="扣费项目" prop="consumeName"></el-table-column>
      <el-table-column label="余额" prop="balance"></el-table-column>
      <el-table-column label="时间" prop="consumeTime"></el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          {{ formatState(scope.row.state) }}
        </template>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

import service from '@/service/communi-mgmt/communiCard';

export default {
  name: 'CommuniCardConsumeRecords',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      tableData: []
    };
  },
  components: {
    BizFlexTable
  },
  methods: {
    refresh() {
      let params = {
        simId: this.itemId.id,
        pageSize: 500,
        pageNumber: 1
      };
      service.queryConsumeList(
        params,
        data => {
          this.tableData = data.content;
        },
        ErrorData => {}
      );
    },
    formatState(state) {
      switch (state) {
        case '0':
          return '扣费失败';
        case '1':
          return '扣费成功';
        default:
          return '';
      }
    },
    setHeight () {
      setTimeout(() => {
        this.$refs.table.doHeight();
      }, 100);
    }
  },
  mounted() {
    this.refresh();
  },
  watch: {
    itemId() {
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
</style>
