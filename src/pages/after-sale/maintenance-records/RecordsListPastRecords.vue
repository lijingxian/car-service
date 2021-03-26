<template>
  <biz-grid class="maintenance-records-list-past-records">
    <el-date-picker slot="top"
      class="inline"
      unlink-panels
      size="small"
      v-model="date"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"></el-date-picker>
    <biz-save-button slot="top" class="inline" :operations="operations" @operate="operate">
    </biz-save-button>
    <biz-list ref="table" :tableData="tableData" v-if="showListFlag">
      <el-table-column prop="faultCode" label="故障代码"></el-table-column>
      <el-table-column prop="happenDate" label="发生时间"></el-table-column>
      <el-table-column prop="definition" label="描述"></el-table-column>
    </biz-list>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizList from '@/components/BizTable/BizList';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';

export default {
  name: 'RecordsListPastRecords',
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      showListFlag: false,
      date: ['', ''],
      operations: [
        {
          label: '搜索',
          name: 'search',
          type: 'primary'
        }
      ],
      tableData: []
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    search() {
      this.showListFlag = false;
      let params = {
        // carId: '772'
        carId: this.id,
        beginDate: this.date ? this.date[0] : '',
        endDate: this.date ? this.date[1] : ''
      };
      MaintenanceRecords.search(
        params,
        data => {
          this.showListFlag = true;
          this.tableData = data.dataList;
          // this.$refs.table.doLayout();
        },
        ErrorData => {
          this.showListFlag = true;
        }
      );
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      // this.date[1] = date;
      this.date[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()}`;
      };
      // this.date[0] = date.setDate(date.getDate() - 30);
      this.date[0] = halfYearAgo();
      console.log('date: ', this.date);
      console.log('date: ', date);
    }
  },
  created() {
    this.getFormatDate();
    this.search();
  },
  watch: {
    id() {
      this.search();
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizList
  }
};
</script>

<style lang="scss">
.maintenance-records-list-past-records {
  padding: 20px;
  .biz-grid__top {
    display: flex;
    justify-content: space-between;
  }
  .el-date-editor {
    margin-top: 1px;
    .el-range-separator {
      padding: 0px;
    }
  }
}
</style>
