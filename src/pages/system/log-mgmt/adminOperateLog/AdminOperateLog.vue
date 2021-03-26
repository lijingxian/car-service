<template>
  <div class="admin-operate-log">
    <biz-flex-table ref="table" :loading="loading" :tableData="tableDataHandle" :pagination="pagination" :operations="operations" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :filters="filters" @filter-data-change="filterDataChange" @operate="operate"
    :checkable="checkable">
      <el-table-column prop="operation" label="操作"></el-table-column>
      <el-table-column prop="operator" label="操作管理员"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="clientType" label="操作途径"></el-table-column>
      <el-table-column prop="result" label="操作结果"></el-table-column>
      <el-table-column prop="createDate" label="时间"></el-table-column>
    </biz-flex-table>
    <admin-operate-popup slot="float" :open="openPopup" @close="closePopup" :id="curId" @refreshNotification="refresh"></admin-operate-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import AdminOperatePopup from './AdminOperatePopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'admin-operate-log',
  data() {
    return {
      curId: '',
      openPopup: false,
      loading: false,
      tableData: [],
      selections: [],
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
          placeholder: '请输入操作/操作管理员',
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
  components: { BizFlexTable, AdminOperatePopup },
  computed: {
    tableDataHandle() {
      let ary = this.tableData;
      if (ary) {
        ary.forEach(element => {
          switch (element.clientType) {
            case 'android':
              element.clientType = '安卓';
              break;
            case 'ios':
              element.clientType = '苹果';
              break;
            case 'weixin':
              element.clientType = '微信';
              break;
            case 'applicaton':
              element.clientType = 'pc应用程序';
              break;
            case 'defaultClientType':
              element.clientType = '缺省';
              break;
            case 'wechatMini':
              element.clientType = '微信小程序';
              break;
            case 'robot':
              element.clientType = '机器人';
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
        type: '3'
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
          console.log('管理员操作日志列表', data);
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
.admin-operate-log {
}
</style>
