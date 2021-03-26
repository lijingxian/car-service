<template>
  <biz-grid class="promotion-participant">
    <el-table height="100%" :data="tableData" border>
      <el-table-column min-width="140" prop="attendDate" label="参与时间">
      </el-table-column>
      <el-table-column width="80" prop="member.nickname" label="参与用户">
      </el-table-column>
      <el-table-column width="80" prop="couponName" label="促销手段">
      </el-table-column>
      <!-- <el-table-column width="200" prop="attendShop.name" label="店铺">
      </el-table-column> -->
      <el-table-column v-if="isYHQ" key="kqm" width="140" prop="couponCode.code" label="卡券码">
      </el-table-column>
      <el-table-column width="80" prop="orderAmount" label="订单金额">
      </el-table-column>
      <el-table-column min-width="180" prop="orderSn" label="订单号">
        <div slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="orderDetail(scope.row)">
            {{scope.row.orderSn}}
          </el-button>
        </div>
      </el-table-column>
      <!-- <el-table-column v-if="isYHQ" key="sysj" width="140" prop="couponCode.usedDate" label="使用时间">
      </el-table-column> -->
      <biz-empty-table-tab slot="empty"></biz-empty-table-tab>
    </el-table>
    <div class="biz-pagination" slot="bottom">
       <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
import BizEmptyTableTab from '@/components/BizTable/BizEmptyTableTab';
import { BizPagination } from '@/components/BizTable';
export default {
  name: 'PromotionParticipant',
  data() {
    return {
      height: '100%',
      promotion: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      tableData: []
    };
  },
  props: {},
  components: { BizGrid, BizEmptyTableTab, BizPagination },
  created() {
    this.resize();
  },
  computed: {
    isYHQ() {
      return this.promotion.typeStr === '1';
    }
  },
  methods: {
    resize() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 95);
    },
    orderDetail(row) {
      this.$router.push({
        path: `/order/product/${row.order.orderType}`,
        query: { id: row.order.id }
      });
    },
    refresh(promotion) {
      if (promotion) {
        this.promotion = promotion;
      }
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        promotionId: this.promotion.id
      };
      Service.getPromotionParticipant(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
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
    }
  }
};
</script>

<style lang="scss">
.promotion-participant {
  padding-top: 40px;
  .el-table .cell {
    font-size: 12px;
  }
}
</style>
