<template>
  <biz-grid class="sale-item">
    <biz-flex-table ref="table" @operate="operate" :tableData="tableData" :loading="loading" :pagination="pagination"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" :checkable="false">
      <el-table-column prop="sn" label="订单编号"></el-table-column>
      <el-table-column prop="type" label="状态" :formatter="getOrderStatus"></el-table-column>
      <el-table-column prop="orderItems" label="商品" min-width="200px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id" class="product-info">
                <div class="wrapper">
                  <div class="titleClass" :title="orderItem.fullName">{{orderItem.fullName}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品价格&数量" min-width="120px">
        <template slot-scope="scope">
          <div>
            <div v-for="orderItem in scope.row.orderItems" :key="orderItem.id">
              ￥{{orderItem.price}}&nbsp;&nbsp;&nbsp;x{{orderItem.quantity}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseFee" label="金额">
        <template slot-scope="scope">￥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column prop="orderTime" label="时间"></el-table-column>
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
    agentId: {
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
    agentId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    getOrderStatus(row) {
      switch (row.type) {
        case '11':
          return '已确认发货';
        case '10':
          return '退款退货完成';
        case '9':
          return '退款退货中';
        case '8':
          return '已过期';
        case '7':
          return '已评价';
        case '6':
          return '订单关闭';
        case '5':
          return '交易完成';
        case '4':
          return '订单已执行';
        case '3':
          return '买家已付款';
        case '2':
          return '商家已确认';
        case '1':
          return '待商家确认';
        default:
          return '无';
      }
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        agentId: this.agentId
      };
      http
        .get('/admin/invoicing/purchase/agentView/agentSalesReport.jhtml', params)
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
.product-info {
  min-height: 48px;
  margin: 5px 0px;
  width: 100%;
  img {
    float: left;
    width: 48px;
    height: 48px;
  }
  .wrapper {
    margin-left: 56px;
    .titleClass {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
    }
  }
}
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
