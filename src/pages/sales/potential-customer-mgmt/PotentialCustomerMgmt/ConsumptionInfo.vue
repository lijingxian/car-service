<template>
  <biz-grid class="potential-customer-mgmt__test-drive" v-loading="loading">
    <biz-list
      ref="table"
      :tableData="tableData"
      :key="Math.random()"
      :height="'100%'"
    >
      <el-table-column label="日期" prop="orderTime"></el-table-column>
      <el-table-column label="消费商品" prop="product">
        <template slot-scope="scope">
          {{scope.row.orderItems.length>0?scope.row.orderItems[0].fullName : ''}}
        </template>
      </el-table-column>
      <el-table-column label="消费金额" prop="amount">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ￥{{scope.row.amount}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单" prop="sn">
        <template slot-scope="scope">
          <div style="width:100%">
            <div style="color:#ff7300;cursor:pointer" class="shop-over overflow" :title="scope.row.sn?scope.row.sn : ''" @click="clickRelateBill($event, scope.row)">
              {{ scope.row.sn ? scope.row.sn : '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizList from '@/components/BizTable/BizList';
import { BizPagination } from '@/components/BizTable';
import http from '@/common/http';
// 基础内容
export default {
  name: 'ActivityBaseInfo',
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    phoneNumber: {
      type: String
    }
  },
  components: {
    BizGrid,
    BizPagination,
    BizList
  },
  created() {
    this.query();
  },
  mounted() {},
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      }
    }
  },
  methods: {
    clickRelateBill(e, row) {
      e.stopPropagation();
      this.$emit('showOrderTab', row);
    },
    query() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        searchValue: this.phoneNumber,
        orderType: 'car',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/order/list.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.query();
    }
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__test-drive {
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
