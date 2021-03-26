<template>
  <div class="communi-card-recharge-records">
    <biz-flex-table
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :filters="filters"
      :checkable="false"
      @sort-change="handleSortChange"
      @filter-data-change="filterDataChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :operations="operations"
      @operate="operate"
    >
      <!-- 表格内容 -->
      <el-table-column label="商品" prop="number" min-width="200">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.rechargePackageName}}
            </div>
            <div class="overflow">
              运营商：{{scope.row.telecomOperatorName}}
            </div>
            <div class="overflow">
              充值日期：{{scope.row.rechargeTime}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="SIM" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.simNumber }}
            </div>
            <div class="overflow">
              卡类型：{{scope.row.simType}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="terminalTypeName" label="所有者" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.ownerName||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="金额" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.balance ||'0' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <span :style="{color: stateColor(scope.row)}">{{ formatState(scope.row) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="支付方式" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.payment||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import date from '@/utils/date';
import { communiMgmt } from '@/common/urls';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'CommuniCardRechargeRecords',
  data () {
    return {
      orderProperty: '',
      orderDirection: '',
      operations: [
        { label: '导出', name: 'export', type: '' }
      ],
      filters: [
        {
          label: '卡类型',
          type: 'select',
          placeholder: '请选择卡类型',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '移动', value: '移动' },
            { label: '联通', value: '联通' },
            { label: '电信', value: '电信' }
          ]
        },
        {
          label: '电信运营商',
          type: 'select',
          placeholder: '请选择电信运营商',
          value: '',
          options: []
        },
        {
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '充值失败', value: '0' },
            { label: '充值成功', value: '1' }
          ]
        },
        {
          label: '日期范围',
          type: 'daterange',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          label: '',
          type: 'input',
          value: '',
          placeholder: '请输入所有者/商品名'
        }
      ],
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      }
    };
  },
  components: {
    BizFlexTable
  },
  methods: {
    getKpi() {
      http
        .get('/admin/sim/rechargeRecord/navigation.jhtml', {
          shopId: window.top.shopId
        })
        .then(data => {
          this.showMessage(
            `今日新增充值订单${data.data.dayRechargeCount}，今日充值金额合计${data.data.dayRechargeOrderCost}元`,
            'info'
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    operate(name) {
      this[name]();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    // 获取电信运营商列表
    queryTeleOperator() {
      let params = {};
      http.get(communiMgmt.Card_queryTeleOperatorList, params)
        .then(data => {
          this.filters[1].options = [{ label: '全部', value: '' }].concat(data.content.map(operator => {
            return { label: operator.name, value: operator.id };
          }));
        })
        .catch(ErrorData => {});
    },
    filterDataChange(filters) {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    async export() {
      let params = {
        type: this.filters[0].value,
        telecomOperatorId: this.filters[1].value,
        state: this.filters[2].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginDate: this.filters[3].value[0] ? this.filters[3].value[0] + ' 00:00:00' : '',
        endDate: this.filters[3].value[1] ? this.filters[3].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[4].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      try {
        let response = await axios.post('/admin/sim/rechargeRecord/export.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
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
    // 排序
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? 'createDate' : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 格式化状态
    formatState(row, column) {
      const STATE = {
        '0': '充值失败',
        '1': '充值成功'
      };
      return STATE[row.state];
    },
    refresh() {
      this.loading = true;
      let params = {
        type: this.filters[0].value,
        telecomOperatorId: this.filters[1].value,
        state: this.filters[2].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginDate: this.filters[3].value[0] ? this.filters[3].value[0] + ' 00:00:00' : '',
        endDate: this.filters[3].value[1] ? this.filters[3].value[1] + ' 23:59:59' : '',
        searchValue: this.filters[4].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      http.get(communiMgmt.rechargeRecords.query, params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          if (ErrorData.errorMessage) {
            this.$message.warning(ErrorData.errorMessage);
          }
        });
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.queryTeleOperator();
    this.refresh();
    this.getKpi();
  },
  computed: {
  },
  watch: {
    open(newVal, oldVal) {
      if (!newVal) {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.communi-card-recharge-records {
  .biz-table-filter {
    .filter-wrap {
      &:nth-child(2) {
        .biz-select {
          .el-select {
            width: 100px;
          }
        }
      }
      .biz-input {
        .el-input-group__prepend {
          .el-select:nth-child(2) {
            .el-input {
              width: 50px;
              .el-input__inner {
                padding-left: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
