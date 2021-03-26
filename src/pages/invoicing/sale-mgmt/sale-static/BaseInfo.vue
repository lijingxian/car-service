<template>
  <biz-grid class="sale-item">
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
      <el-table-column prop="orderSn" label="订单编号">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="clickRelateBill($event, scope.row)">
            <span style="white-space:normal">{{ scope.row.orderSn? scope.row.orderSn : '' }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="depotName" label="客户"></el-table-column>
      <el-table-column prop="productName" label="类型"></el-table-column>
      <el-table-column prop="purchaseAmount" label="数量"></el-table-column>
      <el-table-column prop="purchaseFee" label="金额">
        <template slot-scope="scope">￥{{ scope.row.purchaseFee }}</template>
      </el-table-column>
      <el-table-column prop="createDate" label="时间"></el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';

export default {
  name: 'BaseInfo',
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
    },
    beginTime: {
      type: String,
      default() {
        return '';
      }
    },
    endTime: {
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
    clickRelateBill(e, row) {
      e.stopPropagation();
      this.$emit('openOrderTab', row);
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        productId: this.itemId,
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      http
        .get('/admin/invoicing/purchase/storeSalesReport.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
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
.sale-item {
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
