<template>
  <div class="terminal-log">
    <biz-flex-table ref="table" :loading="loading" :tableData="tableDataHandle" :pagination="pagination" :operations="operations" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :filters="filters" @filter-data-change="filterDataChange" @operate="operate"
    :checkable="checkable">
      <el-table-column prop="operation" label="操作" class="biz-customcol"></el-table-column>
      <el-table-column prop="terminalType" label="终端类型" class="biz-customcol"></el-table-column>
      <el-table-column prop="ip" label="IP" class="biz-customcol"></el-table-column>
      <el-table-column prop="terminalNumber" label="终端编号" class="biz-customcol"></el-table-column>
      <el-table-column prop="result" label="操作结果" class="biz-customcol"></el-table-column>
      <el-table-column prop="createDate" label="时间" class="biz-customcol"></el-table-column>
    </biz-flex-table>
    <terminal-popup slot="float" :open="openPopup" @close="closePopup" :id="curId" @refreshNotification="refresh"></terminal-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import TerminalPopup from './TerminalPopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'terminal-log',
  data() {
    return {
      curId: '',
      openPopup: false,
      loading: false,
      tableData: [],
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '操作结果',
          name: 'operateResultValue',
          value: '成功',
          options: [
            {
              label: '成功',
              value: '成功'
            },
            {
              label: '失败',
              value: '失败'
            }
          ]
        },
        {
          type: 'daterange',
          label: '时间',
          name: 'selectTime',
          value: [],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入操作/终端',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      checkable: false
    };
  },
  props: {},
  components: { BizFlexTable, TerminalPopup },
  computed: {
    tableDataHandle() {
      let ary = this.tableData;
      if (ary) {
        ary.forEach(element => {
          switch (element.terminalType) {
            case '0':
              element.terminalType = 'OBD';
              break;
            case '1':
              element.terminalType = '行车记录仪';
              break;
            case '2':
              element.terminalType = '车载主机';
              break;
            case '3':
              element.terminalType = '无钥匙启动系统';
              break;
            case '4':
              element.terminalType = '蓝牙OBD';
              break;
            case '5':
              element.terminalType = 'T-BOX';
              break;
            case '6':
              element.terminalType = '定位器';
              break;
            case '7':
              element.terminalType = '首航设备7';
              break;
            case '8':
              element.terminalType = '首航设备8';
              break;
            case '9':
              element.terminalType = '车牌识别设备';
              break;
            case '10':
              element.terminalType = '奥威车辆控制设备';
              break;
            case '11':
              element.terminalType = '深圳北斗车辆控制设备';
              break;
            case '12':
              element.terminalType = '卡欧自主研发的tbox设备 ';
              break;
            case '13':
              element.terminalType = '卡欧自主研发的乐行宝盒';
              break;
            case '14':
              element.terminalType = '智能接待机器人';
              break;
            default:
              break;
          }
        });

        return ary;
      }
      return [];
    }
  },
  watch: {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    closePopup() {
      this.openPopup = false;
    },
    rowClick(row) {
      console.log('rowClick');
      this.openPopup = true;
      this.curId = row.id;
    },
    handleSelectionChange() {
      console.log('handleSelectionChange');
      this.refresh();
    },
    handleSizeChange(val) {
      console.log('handleSizeChange');
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      console.log('handleCurrentChange');
      this.refresh();
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      console.log('filterDataChange');
      this.refresh();
    },
    getList() {
      let params = {
        searchValue: this.filters[2].value,
        beginTimeStr: this.filters[1].value[0],
        endTimeStr: this.filters[1].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        result: this.filters[0].value,
        type: '4'
      };

      if (!params.beginTimeStr || !params.endTimeStr) {
        this.$message({
          showClose: true,
          message: '请选择开始时间与截止时间'
        });
        return;
      }

      this.loading = true;
      http
        .get(urls.systemSetting.getLogsList, params)
        .then(data => {
          console.log('终端操作日志列表', data);
          this.tableData = data.contents;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        })
        .finally(() => {});
    }
  },
  created() {
    let today = new Date();
    let time = today.getFullYear() + '-' + parseInt(parseInt(today.getMonth()) + 1) + '-' + today.getDate();
    this.filters[1].value.push(time);
    this.filters[1].value.push(time);
    this.refresh();
  }
};
</script>

<style lang="scss">
.terminal-log {
}
</style>
