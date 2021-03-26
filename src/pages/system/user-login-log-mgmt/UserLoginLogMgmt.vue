<template>
  <div class="user-login-log-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      :filters="filters" @filter-data-change="filterDataChange" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :checkable="checkable">
      <el-table-column prop="username" label="账号" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="nickname" label="昵称" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="name" label="姓名" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="logDate" label="登录时间" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="logonType" label="登录类型" :formatter="getLogonType" class="biz-customcol" width="90px"></el-table-column>
      <el-table-column prop="clientType" label="登录客户端" :formatter="getClientType" class="biz-customcol" width="90px"></el-table-column>
      <el-table-column prop="logIp" label="IP地址" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="logExplore" label="浏览器" class="biz-customcol"></el-table-column>
      <el-table-column prop="address" label="登录地址" class="biz-customcol" width="240px"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import Service from '@/service/system-setting/user-login-log-mgmt/userLoginLogMgmt';

export default {
  name: 'UserLoginLogMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
      checkable: false,
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: 'primary'
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入账号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  components: {
    BizFlexTable
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        searchProperty: 'username',
        searchValue: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      Service.getList(
        params,
        data => {
          this.tableData = data.sessionInfoList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    getLogonType(row) {
      switch (row.logonType) {
        case '0':
          return '登入';
        case '1':
          return '登出';
        default:
          break;
      }
    },
    getClientType(row) {
      switch (row.clientType) {
        case '0':
          return '安卓';
        case '1':
          return '苹果';
        case '2':
          return 'Web';
        case '3':
          return '微信';
        case '4':
          return 'PC应用程序';
        default:
          break;
      }
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.user-login-log-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
}
</style>
