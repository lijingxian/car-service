<template>
  <biz-grid class="shop-account">
    <div slot="top" class="message-mgmt-header">
      <div style="font-size: 14px;margin-bottom: 10px;display:flex;align-items: center;">
        <div>
          账户余额：
          ￥{{balance}}
        </div>
        <div style="padding: 0px 10px 0px 10px">
          可用余额：
          ￥{{availableAmount}}
        </div>
      </div>
    </div>
    <biz-flex-table
      ref="table"
      @operate="operate"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :checkable="false"
    >
      <el-table-column prop="createDate" label="日期"></el-table-column>
      <el-table-column prop="itemName" label="项目"></el-table-column>
      <el-table-column prop="credit" label="金额">
        <template slot-scope="scope">{{ getCredit(scope.row.credit) }}</template>
      </el-table-column>
      <el-table-column prop="operator" label="操作者"></el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';

export default {
  name: 'ShopRechargeBaseInfo',
  components: {
    BizFlexTable,
    BizGrid
  },
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      balance: '',
      availableAmount: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  created() {},
  computed: {},
  mounted() {},
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    getCredit(credit) {
      console.log(credit);
      let creditNew = '';
      creditNew = credit.slice(0, 1) + '￥' + credit.slice(1);
      return creditNew;
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        id: this.itemId
      };
      http
        .get('/admin/account/deposits.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.balance = data.data.balance;
          this.availableAmount = data.data.availableAmount;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.shop-account {
  .message-mgmt-header {
    padding: 20px 0px 10px 20px;
  }
  .biz-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
}
</style>
