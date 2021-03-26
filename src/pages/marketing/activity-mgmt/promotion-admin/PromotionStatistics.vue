<template>
  <div class="promotion-statistics">
    <div class="top-area">
      <biz-chart :chartData="chartData" :chartWidth="'650px'" :chartHeight="'500px'" :showSearch="false"></biz-chart>
      <div class="sale">
        <div class="sale-title">活动分析指标</div>
        <div class="sale-content">
          <div class="sale-block">
            <h4>订单数量:
              <span>{{totalOrderCount || '0'}}</span>
            </h4>
          </div>
          <div class="sale-block">
            <h4>订单总金额:
              <span>{{totalOrderAmount || '0'}}</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <biz-table-body :tableData="tableData" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" @sort-change="handleSortChange" :checkable="false">
      <el-table-column prop="title" label="活动标题"></el-table-column>
      <el-table-column prop="promotionType" :formatter="getType" label="促销类型"></el-table-column>
      <el-table-column prop="shopData" label="店铺名称" :formatter="getShop"></el-table-column>
      <el-table-column prop="beginDate" label="开始时间" sortable="custom"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" sortable="custom"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="orderCount" label="订单数量"></el-table-column>
      <el-table-column prop="orderAmount" label="订单总金额">
        <template slot-scope="scope">
          ￥{{ scope.row.orderAmount }}
        </template>
      </el-table-column>
    </biz-table-body>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import BizTableBody from '@/components/BizTable/BizTableBody';

import { activityMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'PromotionStatistics',
  data() {
    return {
      // 排序
      orderProperty: '',
      orderDirection: '',
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      totalOrderCount: '',
      totalOrderAmount: '',
      params: {},
      chartData: {
        legendPosition: 'right',
        type: 'pie',
        data: {
          columns: ['type', 'value'],
          rows: []
        },
        settings: {
          radius: [60, 150],
          offsetY: 250
        }
      }
    };
  },
  computed: {
  },
  methods: {
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
    refresh(params) {
      if (params) {
        this.params = params;
      }
      let innerParams = Object.assign({}, this.params, {
        pageSize: this.pagination.pageSize,
        pageNumber: params ? 1 : this.pagination.currentPage,
        orderDirection: this.orderDirection,
        orderProperty: this.orderProperty
      });
      http.get(activityMgmt.PromotionKpi, innerParams)
        .then(data => {
          this.tableData = data.statistics;
          this.chartData.data.rows = [];
          for (let name in data) {
            if (['resultCode', 'statistics', 'totalOrderAmount', 'totalOrderCount', 'total'].indexOf(name) === -1) {
              this.chartData.data.rows.push({ 'type': this.getChartRowType(name), 'value': data[name] });
            }
          }
          this.totalOrderCount = data.totalOrderCount;
          this.totalOrderAmount = data.totalOrderAmount;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          console.log(ErrorData);
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
    getShop(row) {
      return row.shop.name;
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '包邮';
        case '1':
          return '优惠券';
        case '2':
          return '促销';
        case '3':
          return '满减';
        case '4':
          return '折扣';
        case '5':
          return '满送';
        case '6':
          return '套餐';
        default:
          break;
      }
    },
    getChartRowType(name) {
      switch (name) {
        case 'couponCount':
          return '优惠券';
        case 'fullGiftCount':
          return '满送';
        case 'discountCount':
          return '折扣';
        case 'fullCutCount':
          return '满减';
        case 'packageCount':
          return '套餐';
        case 'productCount':
          return '促销';
        case 'freeShippingCount':
          return '包邮';
        default:
          break;
      }
    }
  },
  components: {
    BizChart,
    BizTableBody
  }
};
</script>

<style lang="scss">
.promotion-statistics {
  .top-area {
    display: flex;
    flex-flow: row;
    flex-basis: 100%;
    flex-grow: 1;
    height: 500px;
    .chart-area {
      margin-top: 0;
    }
    .sale {
      height: 230px;
      margin-top: 100px;
      margin-left: 80px;
      display: flex;
      flex-flow: column;
      flex-basis: 100%;
      flex-grow: 1;
      font-size: 20px;
      color: #606266;
      font-weight: bold;
      .sale-title {
        height: 35px;
        text-align: center;
        background-color: #ebeef5;
      }
      .sale-content {
        padding: 10px;
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
      }
      .sale-block {
        align-items: center;
        width: 100%;
        height: 50%;
        span {
          color: #ff7300;
        }
      }
    }
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
