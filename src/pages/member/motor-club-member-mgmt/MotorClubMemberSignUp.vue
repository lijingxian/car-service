<template>
  <div class="motor-club-member-signup">
    <biz-flex-table
      :checkable="false"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      :loading="loading"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
       @sort-change="handleSortChange"
    >
      <!-- 表格内容 -->
      <el-table-column label="用户昵称" prop="nickname"></el-table-column>
      <el-table-column label="签到地址" prop="memberPosition"></el-table-column>
      <el-table-column label="签到时间" prop="signTime" sortable="custom"></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

import date from '@/utils/date';
import { motorClubMemberMgmt as service } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'MotorClubMemberSignUp',
  data () {
    return {
      orderProperty: '',
      orderDirection: '',
      loading: false,
      operations: [
        { label: '导出', name: 'export', type: '' },
        { label: '返回', name: 'goBack', type: '' }
      ],
      filters: [
        { type: 'select', label: '用户昵称', value: '', options: [] },
        { type: 'daterange', label: '日期区间', value: [date.lastMonthDate(), date.nowDate()] }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: []
    };
  },
  components: {
    BizFlexTable
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.filters = val;
      this.refresh();
    },
    // 导出
    export() {
      let params = {
        beginDateStr: this.filters[1].value[0] || '',
        endDateStr: this.filters[1].value[1] || '',
        fleetId: this.$route.params.fleetId || ''
      };
      http.get(service.signUp.export, params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = `${service.signUp.export}?` + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              window.open(linkedUrl);
            // location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          }
        );
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 排序
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    // 查询
    refresh() {
      let params = {
        beginDateStr: this.filters[1].value[0] || '',
        endDateStr: this.filters[1].value[1] || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        fleetId: this.$route.params.fleetId || '',
        memberId: this.filters[0].value || '',
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      this.loading = true;
      http.get(service.signUp.query, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    queryInfo() {
      http.get(service.signUp.queryInfo, { fleetId: this.$route.params.fleetId })
        .then(data => {
          this.showMessage(`今日新增签到${data.count}条，您可按时间删选后导出记录进行签到管理统计哦`, 'info');
        })
        .catch();
    },
    // 查询用户列表
    queryMemberList() {
      let params = {
        fleetId: this.$route.params.fleetId,
        pageSize: 1000
      };
      http.get(service.listPage.list, params)
        .then(data => {
          let tmp = [{ value: '', label: '全部' }];
          data.memberList.map(member => {
            tmp.push({ value: member.id, label: member.nickname });
          });
          this.filters[0].options = tmp;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.queryInfo();
    this.queryMemberList();
    this.refresh();
  },
  watch: {}
};
</script>

<style lang="scss">
.motor-club-member-signup {
  height: 100%;
  .biz-input {
    width: 280px;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
}
</style>
