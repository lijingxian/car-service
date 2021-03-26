<template>
  <div class="vehicle-mgmt-sign-up">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData"
      :pagination="pagination" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="name" label="驾驶员" :formatter="driverFormatter" :filters="driverFilter" :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="carNumber" label="车牌号" :filters="plateFilter" :filter-method="filterHandler"></el-table-column>
      <el-table-column prop="memberPosition" label="签到地址">
        <template slot-scope="scope">
          {{scope.row.memberPosition || (scope.row.signTime ? '未知' : '--')}}
        </template>
      </el-table-column>
      <el-table-column prop="signTime" label="签到时间" sortable></el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import service from '@/service/vehicle-mgmt/VehicleMgmtSignUp';
import { vehicleMgmt, motorClubMemberMgmt } from '@/common/urls';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'SignUp',
  data() {
    return {
      operations: [
        // {label: '搜索', name: 'refresh', type: 'primary'},
        { label: '导出', name: 'export', type: '' },
        { label: '返回', name: 'goBack', type: '' }
      ],
      filters: [{ type: 'daterange', label: '日期区间：', value: ['2011-11-11', '2012-12-12'] }],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      multiSelected: []
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.signId);
      });
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
    // 搜索
    filterDataChange(val) {
      this.filters = val;
      this.refresh();
    },
    async export() {
      let params = {
        fleetId: this.$route.query.id ? this.$route.query.id : this.$route.query.fleetId || '',
        // fleetId: '916',
        ids: this.multiSelected.length > 0 ? this.multiSelected : [],
        beginDateStr: this.filters[0].value[0],
        endDateStr: this.filters[0].value[1]
      };
      try {
        let response = await axios.post(motorClubMemberMgmt.signUp.export, params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 驾驶员
    driverFormatter(row) {
      return row.name || row.nickname;
    },
    refresh() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        fleetId: this.$route.query.id ? this.$route.query.id : this.$route.query.fleetId || '',
        // fleetId: '916',
        beginDateStr: this.filters[0].value[0],
        endDateStr: this.filters[0].value[1]
      };
      service.query(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    filterBuilder(value) {
      let tmp1 = [];
      let tmp2 = [];
      this.tableData.map(row => {
        tmp1 = tmp1.concat(row[value]);
      });
      const set = new Set(tmp1);
      tmp1 = [...set];
      tmp1 = tmp1.map(item => {
        // 将空值移到最前
        if (item === '') {
          tmp2.unshift({ text: '无', value: '' });
        } else {
          tmp2 = tmp2.concat({ text: item, value: item });
        }
      });
      return tmp2;
    },
    // 状态/店铺名过滤
    filterHandler(value, row, column) {
      const property = column.property;
      // if (property === 'memberName') {
      return row[property] === value;
      // } else if (property === 'shop.name') {
      // return row['shop'].name === value;
      // }
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[0].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[0].value[0] = halfYearAgo();
    },

    queryKPI() {
      http
        .get(vehicleMgmt.kpi_signup, { fleetId: this.$route.query.id ? this.$route.query.id : this.$route.query.fleetId || '' })
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增签到${data.count}条，您可按时间删选后导出记录进行签到管理统计哦 `,
            duration: 3000
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    }
  },
  computed: {
    driverFilter() {
      let tmp = this.filterBuilder('name');
      return tmp;
    },
    plateFilter() {
      let tmp = this.filterBuilder('carNumber');
      return tmp;
    }
  },
  created() {
    this.getFormatDate();
    this.refresh();
  },
  mounted() {
    this.queryKPI();
  },
  components: {
    BizFlexTable
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-sign-up {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
