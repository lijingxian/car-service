<template>
  <div class="online-user-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      :filters="filters" @filter-data-change="filterDataChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :checkable="checkable">
      <el-table-column prop="userName" label="用户名" class="biz-customcol"></el-table-column>
      <el-table-column prop="nickname" label="昵称" class="biz-customcol"></el-table-column>
      <el-table-column prop="name" label="姓名" class="biz-customcol"></el-table-column>
      <el-table-column prop="loginDate" label="登录时间" class="biz-customcol" width="150px"></el-table-column>
      <el-table-column prop="company" label="所属运营商" class="biz-customcol"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import Service from '@/service/system-setting/online-user-mgmt/onlineUserMgmt';

export default {
  name: 'OnlineUserMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: ''
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
          placeholder: '请输入用户名',
          name: 'searchValue',
          value: ''
        }
      ],
      checkable: false
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
          this.tableData = data.memberList;
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
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.online-user-mgmt {
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
