<template>
  <biz-grid class="order-history">
    <biz-list ref="table" :tableData="tableData" :loading="loading" :height="height">
      <el-table-column prop="orderTime" label="时间">
      </el-table-column>
      <el-table-column prop="plateNumber" label="会员车辆">
      </el-table-column>
      <el-table-column prop="price" label="服务分类">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.orderType==='2'?'普通服务':'普通服务'}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="quantity" label="服务项目">
        <div slot-scope="scope">
          <div class="biz-customcol" v-for="orderItem in scope.row.orderItems" :key="orderItem.id">
            {{orderItem.fullName}}
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
  </biz-grid>
</template>
<script>
import BizList from '@/components/BizTable/BizList';
import BizPagination from '@/components/BizTable/BizPagination';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
export default {
  name: 'OrderHistory',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  data() {
    return {
      loading: false,
      height: '90%',
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizList,
    BizPagination,
    BizGrid
  },
  created() {
    this.getList();
  },
  watch: {
    itemId(val) {
      this.itemId && this.getList();
    }
  },
  methods: {
    getList() {
      this.loading = true;
      let params = {
        orderId: this.itemId,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.repairMaintainHistory(
        params,
        data => {
          this.loading = false;
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
        }
      );
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
