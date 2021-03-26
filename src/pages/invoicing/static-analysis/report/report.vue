<template>
  <div class="invoicing-report">
    <div class="top">
      <div class="block">
        <div class="demonstration">月份</div>
        <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" type="month" placeholder="选择月" size="mini"
          :picker-options="pickerOptions" :clearable="false" @change="dateChange">
        </el-date-picker>
        <div class="demonstration" style="padding-left:10px">店铺</div>
        <el-select v-model="checkedShops" placeholder="请选择" @change="shopChange" size="mini">
          <el-option v-for="item in shopsList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <!-- <el-button type="text" size="mini" v-popover:codePop class="description">
          统计说明
          <i class="iconfont el-icon-question"></i>
        </el-button>
        <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover">
          <div></div>
        </el-popover> -->
        <el-button type="primary" size="mini" @click="printView">打印</el-button>
        <el-button type="primary" size="mini" @click="save">导出</el-button>
      </div>
    </div>
    <div ref="imageWrapper">
      <div class="title-header">
        <span>{{shopName}}</span><span>进销存月报</span><span>|</span><span>{{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}1-{{lastDate}}日</span>
      </div>
      <div class="content">
        <div class="title-header">
          <span>一、进销存概述</span>
        </div>
        <div class="des">
          <p>
            {{endDate.split('-')[0]+'年'+endDate.split('-')[1]+'月'}}，
            本店共产生采购订单{{indicators.purchaseOrderNum.increase}}张，采购金额{{indicators.purchaseOrderAmount.increase}}，实际完成采购商品{{indicators.purchaseProductNum.increase}}件；
            <span v-if="indicators.purchaseOrderNum.increase>0">从供应商来看，从供应商{{topSupplierAmount.length>0?topSupplierAmount[0].xValue:''}}采购商品最多，金额{{topSupplierAmount.length>0?topSupplierAmount[0].yValue:''}}万元。</span>
          </p>
          <p>
            本店共产生销售订单{{indicators.salesOrderNum.increase}}，销售商品{{indicators.salesProductNum.increase}}件，
             <span v-if="indicators.salesOrderNum.increase>0">从代理商来看，要货{{topAgentAmount.length>0?topAgentAmount[0].xValue:''}}最多，金额{{topAgentAmount.length>0?topAgentAmount[0].yValue:''}}万元。</span>
          </p>
          <p>
            本店共产生入库单{{indicators.depotInNum.increase}}，入库商品{{indicators.depotInProductNum.increase}}件，
            共产生出库单{{indicators.depotOutNum.increase}}，出库商品{{indicators.depotOutProductNum.increase}}件，本月库存盘点{{indicators.depotInventoryNum.increase}}，
            调拨商品{{indicators.depotTransferProductNum.increase}}次。
          </p>
        </div>
        <div style="text-align: -webkit-center;">
          <div align="center" style="margin-bottom:10px">进销存统计表</div>
          <el-table :data="tableData" border size="small" style="width:600px">
            <el-table-column prop="name" label="指标项" width="180">
            </el-table-column>
            <el-table-column prop="increase" label="值" width="180">
            </el-table-column>
            <el-table-column prop="yearOnYear" label="趋势">
              <template slot-scope="scope">
                同比： {{scope.row.yearOnYear}}% 环比： {{scope.row.monthOnMonth}}%
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>二、采购情况</span>
        </div>
        <div class="des">
          <p>
            本月采购订单、采购商品数量情况如下图所示。与上月相比，采购订单数量环比增长{{indicators.purchaseOrderNum.monthOnMonth}}%，采购订单金额环比增长{{indicators.purchaseOrderAmount.monthOnMonth}}%，
            <span v-if="topPurchaseOrder.length>0">采购商品最多的是{{topPurchaseOrder.length>0?topPurchaseOrder[0].xValue:''}}，数量{{topPurchaseOrder.length>0?topPurchaseOrder[0].y[0].yValue:''}}，
            采购金额最高的是{{topPurchaseOrderAmount.length>0?topPurchaseOrderAmount[0].xValue:''}}，采购金额{{topPurchaseOrderAmount.length>0?topPurchaseOrderAmount[0].y[1].yValue/10000:''}}万元。</span>
          </p>
          <p v-if="topSupplierNum.length>0">
            供应商{{topSupplierNum.length>0?topSupplierNum[0].xValue:''}}供货最多，共计{{topSupplierNum.length>0?topSupplierNum[0].yValue:''}}单，
            供应商{{topSupplierAmount.length>0?topSupplierAmount[0].xValue:''}}金额最高，共计{{topSupplierAmount.length>0?topSupplierAmount[0].yValue:''}}万元。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartDataOfPurchaseOrder" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">采购订单数量(金额)</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfPurchaseProduct" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">采购商品数量(金额)排行</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfSupplier" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">供应商供货周期排行</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>三、销售情况</span>
        </div>
        <div class="des">
          <p>
            本月销售订单、销售商品数量情况如下图所示。与上月相比，销售订单数量环比增长{{indicators.salesOrderNum.monthOnMonth}}%，销售订单金额环比增长{{indicators.salesOrderAmount.monthOnMonth}}%，
            <span v-if="topSalesOrder.length>0">销售商品最多的是{{topSalesOrder.length>0?topSalesOrder[0].xValue:''}}，数量{{topSalesOrder.length>0?topSalesOrder[0].y[0].yValue:''}}，
            销售金额最高的是{{topSalesOrderAmount.length>0?topSalesOrderAmount[0].xValue:''}}，销售金额{{topSalesOrderAmount.length>0?topSalesOrderAmount[0].y[1].yValue/10000:''}}万元。</span>
          </p>
          <p v-if="topAgentNum.length>0">
            代理商{{topAgentNum.length>0?topAgentNum[0].xValue:''}}要货最多，共计{{topAgentNum.length>0?topAgentNum[0].yValue:''}}单，
            代理商{{topAgentAmount.length>0?topAgentAmount[0].xValue:''}}金额最高，共计{{topAgentAmount.length>0?topAgentAmount[0].yValue:''}}万元。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartDataOfSalesOrder" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">销售订单数量(金额)</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfSalesProduct" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">销售商品数量(金额)排行</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfAgent" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">代理商付款周期排行</div>
          </div>
        </div>
      </div>
      <div style="page-break-after:always"></div>
      <div class="content">
        <div class="title-header">
          <span>四、仓库情况</span>
        </div>
        <div class="des">
          <p>
            目前仓库库存最多的商品为{{topStore.length>0?topStore[0].xValue:''}}。本月共调拨{{indicators.depotTransferNum.increase}}次，环比增长{{indicators.depotTransferNum.monthOnMonth}}%。
            本月共盘点{{indicators.depotInventoryNum.increase}}次，盘盈{{checkY}}次，盘亏{{checkK}}次。
          </p>
        </div>
        <div class="chart-area">
          <div class="graph">
            <biz-chart :chartData="chartDataOfStore" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">库存分布</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfAllocate" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">调拨</div>
          </div>
          <div class="graph">
            <biz-chart :chartData="chartDataOfCheck" :loading="loading" :showSearch="false"></biz-chart>
            <div align="center" class="des">盘点分布</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title-header">
          <span>五、结论建议</span>
        </div>
        <div class="des">
          <p v-for="(advise, index) in indicators.advise" :key="index" v-show="indicators.advise && indicators.advise.length > 0">
            {{advise.join(',')}}
          </p>
          <p v-show="!indicators.advise || indicators.advise.length === 0">
            您的店铺当月经营良好，暂无明显需要改善的地方。
          </p>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" center width="1000px" append-to-body>
      <div align="right">
        <el-button type="primary" @click="print" size="mini">打印</el-button>
      </div>
      <vue-easy-print tableShow ref="easyPrint">
        <img :src="url" width="100%">
      </vue-easy-print>
    </el-dialog>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
import date from '@/utils/date';
import dateTime from '@/utils/dateTime';
import vueEasyPrint from 'vue-easy-print';
import html2canvas from 'html2canvas';
// import JsPdf from 'jspdf';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      companyCount: 0,
      storeCount: 0,
      unionCount: 0,
      beginDate: dateTime.getMonthStartDate(),
      endDate: date.nowDate(),
      addOperator: '',
      addStore: '',
      storeList: '',
      url: '',
      tableData: [],
      isIndeterminateShops: true,
      dialogTableVisible: false,
      loading: false,
      checkAllShops: true,
      checkedShops: this.getUser().shop.id,
      shopsList: [],
      chartData: {},
      chartDataOfSupplier: {},
      chartDataOfPurchaseProduct: {},
      chartDataOfPurchaseOrder: {},
      chartDataOfAgent: {},
      chartDataOfSalesProduct: {},
      chartDataOfSalesOrder: {},
      chartDataOfStore: {},
      chartDataOfAllocate: {},
      chartDataOfCheck: {},
      topPurchaseOrder: [],
      topPurchaseOrderAmount: [],
      topSupplierNum: [],
      topSupplierAmount: [],
      topSalesOrder: [],
      topSalesOrderAmount: [],
      topAgentNum: [],
      topAgentAmount: [],
      topStore: [],
      checkK: '0',
      checkY: '0',
      indicators: {
        advise: [],
        purchaseProductNum: { increase: '' },
        salesProductNum: { increase: '' },
        salesOrderAmount: { increase: '' },
        depotOutNum: { increase: '' },
        depotTransferProductNum: { increase: '' },
        purchaseOrderAmount: { increase: '' },
        depotInventoryNum: { increase: '' },
        salesOrderNum: { increase: '' },
        depotOutProductNum: { increase: '' },
        depotTransferNum: { increase: '' },
        depotInProductNum: { increase: '' },
        depotInNum: { increase: '' },
        purchaseOrderNum: { increase: '' }
      },
      imgUrl: '',
      kpiName: ['本期', '同比', '环比']
    };
  },
  computed: {
    shopName() {
      let temp = this.getUser().shop.name;
      this.shopsList.map(item => {
        if (this.checkedShops === item.id) {
          temp = item.name;
        }
      });
      return temp;
    },
    lastDate() {
      return date.getMonthDays(this.endDate);
    }
  },
  components: {
    BizChart,
    vueEasyPrint
  },
  created() {
    this.getShopList();
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapGetters('Authority', ['currentAuth']),
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    dateChange() {
      this.beginDate = this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-01';
      this.query();
    },
    init() {
      let param = {
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/stock/summary/report.jhtml', param)
        .then(data => {
          this.indicators = data.indicators;
          this.tableData = [
            Object.assign(data.indicators.purchaseOrderNum, { increase: data.indicators.purchaseOrderNum.increase + '单' }, { name: '采购订单数量' }),
            Object.assign(data.indicators.purchaseOrderAmount, { increase: data.indicators.purchaseOrderAmount.increase + '万元' }, { name: '采购订单金额' }),
            Object.assign(data.indicators.salesOrderNum, { increase: data.indicators.salesOrderNum.increase + '单' }, { name: '销售订单数量' }),
            Object.assign(data.indicators.salesOrderAmount, { increase: data.indicators.salesOrderAmount.increase + '万元' }, { name: '销售订单金额' }),
            Object.assign(data.indicators.depotInNum, { increase: data.indicators.depotInNum.increase + '单' }, { name: '入库单' }),
            Object.assign(data.indicators.depotOutNum, { increase: data.indicators.depotOutNum.increase + '单' }, { name: '出库单' }),
            Object.assign(data.indicators.depotTransferNum, { increase: data.indicators.depotTransferNum.increase + '单' }, { name: '调拨单' }),
            Object.assign(data.indicators.depotInventoryNum, { increase: data.indicators.depotInventoryNum.increase + '单' }, { name: '盘点单' })
          ];
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    query() {
      this.getGraphPurchaseOrderData();
      this.getGraphPurchaseProductData();
      this.getGraphDataSupplier();
      this.getGraphSalesOrderData();
      this.getGraphSalesProductData();
      this.getGraphDataAgent();
      this.getGraphDataStore();
      this.getGraphAllocateData();
      this.getGraphCheckData();
      this.getGraphDataStoreProduct();
      this.init();
    },
    shopChange(val) {
      this.query();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.shopsList = data.shops;
          this.query();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    // 采购订单数量金额
    getGraphPurchaseOrderData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['purchaseOrderNum', 'purchaseOrderAmount'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/lineGraph.jhtml', params)
        .then(data => {
          this.chartDataOfPurchaseOrder = this.dataPurchaseOrderFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 采购商品数量金额
    getGraphPurchaseProductData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['purchaseProductTop'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfPurchaseProduct = this.dataPurchaseOrderFormat(data);
          this.topPurchaseOrder = data.indicators;
          this.getGraphPurchaseAmountData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 采购商品数量金额
    getGraphPurchaseAmountData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['purchaseProductAmountTop'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.topPurchaseOrderAmount = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 供应商供货周期排行
    getGraphDataSupplier() {
      this.loading = true;
      let params = {
        indicators: ['supplierShippingCycle'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfSupplier = this.dataFormatCricle(data);
          this.getSupplierNum();
          this.getSupplierAmount();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 供应商订单数量
    getSupplierNum() {
      this.loading = true;
      let params = {
        indicators: ['supplierOrderNum'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.topSupplierNum = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 供应商订单金额
    getSupplierAmount() {
      this.loading = true;
      let params = {
        indicators: ['supplierOrderAmount'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.topSupplierAmount = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 销售订单数量金额
    getGraphSalesOrderData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['salesOrderNum', 'salesOrderAmount'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/lineGraph.jhtml', params)
        .then(data => {
          this.chartDataOfSalesOrder = this.dataPurchaseOrderFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 销售商品数量金额
    getGraphSalesProductData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['salesProductTop'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfSalesProduct = this.dataPurchaseOrderFormat(data);
          this.topSalesOrder = data.indicators;
          this.getGraphSalesAmountData();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 销售商品数量金额
    getGraphSalesAmountData() {
      this.loading = true;
      let params = {
        viewType: 'month',
        indicators: ['salesProductAmountTop'],
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.topSalesOrderAmount = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 代理商付款周期排行
    getGraphDataAgent() {
      this.loading = true;
      let params = {
        indicators: ['agentPaymentCycle'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphMults.jhtml', params)
        .then(data => {
          this.chartDataOfAgent = this.dataFormatCricle(data);
          this.getAgentNum();
          this.getAgentAmount();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 代理商订单数量
    getAgentNum() {
      this.loading = true;
      let params = {
        indicators: ['agentOrderNum'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.topAgentNum = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 代理商订单金额
    getAgentAmount() {
      this.loading = true;
      let params = {
        indicators: ['agentOrderAmount'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate),
        shopIds: [this.checkedShops]
      };
      http
        .post('/admin/ecommerce/kpi/purchase/graph/columnGraphRank.jhtml', params)
        .then(data => {
          this.topAgentAmount = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 库存-商品分类
    getGraphDataStore() {
      this.loading = true;
      let params = {
        indicators: ['depotProductDist'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotDist.jhtml', params)
        .then(data => {
          this.chartDataOfStore = this.dataFormatWork(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 库存-商品排行
    getGraphDataStoreProduct() {
      this.loading = true;
      let params = {
        indicators: ['depotProductRank'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotRank.jhtml', params)
        .then(data => {
          this.topStore = data.indicators;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 调拨分析
    getGraphAllocateData() {
      this.loading = true;
      let params = {
        indicators: ['depotTransferNum'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotColumn.jhtml', params)
        .then(data => {
          this.chartDataOfAllocate = this.dataFormat(data);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 盘点数量分布
    getGraphCheckData() {
      this.loading = true;
      let params = {
        indicators: ['depotInventoryDepotStateDist'],
        viewType: 'month',
        beginDate: this.beginDate,
        endDate: this.endDate.split('-')[0] + '-' + this.endDate.split('-')[1] + '-' + date.getMonthDays(this.endDate)
      };
      http
        .post('/admin/ecommerce/kpi/stock/graph/depotDist.jhtml', params)
        .then(data => {
          this.chartDataOfCheck = this.dataFormatWork(data);
          data.indicators.map(item => {
            if (item.lable === '盘盈') {
              this.checkY = item.value;
            }
            if (item.lable === '盘亏') {
              this.checkK = item.value;
            }
          });
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    dataPurchaseOrderFormat(data) {
      let tmpData = [];
      console.log(data.indicators);
      for (let i = 0; i < (data.indicators.length > 5 ? 5 : data.indicators.length); i++) {
        tmpData.push({
          时间: data.indicators[i].xValue,
          数量: data.indicators[i].y[0].yValue,
          金额: data.indicators[i].y[1].yValue
        });
      }
      let chartData = {
        legendVisible: true,
        type: 'histogram',
        data: {
          columns: ['时间', '数量', '金额'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataFormatCricle(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.length > 5 ? 5 : data.indicators.length); i++) {
        tmpData.push({
          供应商: data.indicators[i].xValue,
          天: data.indicators[i].y[0].yValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['供应商', '天'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          日期: data.indicators[i].xValue,
          本期: data.indicators[i].yValue,
          同比: data.indicators[i].yoyRate,
          环比: data.indicators[i].momRate
        });
      }
      let chartData = {
        type: 'histogram',
        data: {
          columns: ['日期', this.kpiName[0], this.kpiName[1], this.kpiName[2]],
          rows: tmpData
        },
        settings: {
          axisSite: { right: ['同比', '环比'] },
          yAxisType: ['KMB', 'KMB'],
          yAxisName: ['', '%'],
          showLine: [this.kpiName[1], this.kpiName[2]]
        }
      };
      return chartData;
    },
    dataFormatWork(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.length; i++) {
        tmpData.push({
          type: data.indicators[i].lable,
          value: data.indicators[i].value
        });
      }
      let chartData = {
        type: 'pie',
        legendVisible: false,
        data: {
          columns: ['type', 'value'],
          rows: tmpData
        },
        settings: {
          adius: [30, 30],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    printView() {
      let that = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        html2canvas(this.$refs.imageWrapper).then(canvas => {
          that.url = canvas.toDataURL();
          that.dialogTableVisible = true;
        });
      }, 500);
    },
    save() {
      let that = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        html2canvas(this.$refs.imageWrapper).then(canvas => {
          let oA = document.createElement('a');
          oA.download = '进销存月报'; // 设置下载的文件名，默认是'下载'
          oA.href = canvas.toDataURL('image/png');
          document.body.appendChild(oA);
          oA.click();
          oA.remove(); // 下载之后把创建的元素删除
          // let contentWidth = canvas.width;
          // let contentHeight = canvas.height;
          // // 一页pdf显示html页面生成的canvas高度;
          // let pageHeight = (contentWidth / 592.28) * 841.89;
          // // 未生成pdf的html页面高度
          // let leftHeight = contentHeight;
          // // 页面偏移
          // let position = 0;
          // // a4纸的尺寸[595.28,595.28]，html页面生成的canvas在pdf中图片的宽高
          // let imgWidth = 595.28;
          // let imgHeight = (592.28 / contentWidth) * contentHeight;
          // let pageData = canvas.toDataURL('image/jpeg', 1.0);
          // // element.append(canvas)
          // let pdf = new JsPdf('', 'pt', 'a4');
          // // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          // // 当内容未超过pdf一页显示的范围，无需分页
          // if (leftHeight < pageHeight) {
          //   pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
          // } else {
          //   // 分页
          //   while (leftHeight > 0) {
          //     pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          //     leftHeight -= pageHeight;
          //     position -= 841.89;
          //     // 避免添加空白页
          //     if (leftHeight > 0) {
          //       pdf.addPage();
          //     }
          //   }
          // }
          // pdf.save('进销存月报.pdf');
          that.loading = false;
        });
      }, 500);
    },
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.invoicing-report {
  padding: 20px;
  font-size: 12px;
  height: 100%;
  overflow: auto;
  .el-table .cell {
    min-height: 10px !important;
  }
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    .block {
      .demonstration {
        height: 20px;
        line-height: 30px;
        margin-right: 10px;
      }
      display: flex;
    }
    .description {
      margin-right: 30px;
    }
  }
  .title-header {
    height: 40px;
    background: #f7f7f7;
    line-height: 40px;
    span {
      padding: 0px 10px;
    }
  }
  .content {
    margin: 20px 0px;
    p {
      padding-left: 20px;
    }
  }
}
.chart-area {
  margin-top: 10px !important;
  display: flex;
  .graph {
    margin-right: 5px;
    width: 49%;
    height: 18vw;
    .biz-chart {
      background: #ffffff;
    }
    .des {
      margin-top: -10px;
    }
    .header {
      height: 40px;
      background-color: #f7f7f7;
      font-size: 13px;
      padding: 10px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      .font {
        color: #666666;
        font-weight: normal;
      }
      .iconfont {
        font-size: 26px;
        cursor: pointer;
      }
    }
    .filterSeach {
      margin-top: 10px;
      .type-range {
        float: right;
      }
    }
  }
}
.indicators-search {
  display: -webkit-box;
  height: auto;
  .hardShopGroup {
    display: flex;
  }
  .el-checkbox-button {
    padding: 15px;
  }
  .el-checkbox-button__inner {
    padding: 10px;
    font-size: 12px;
    border: none;
  }
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border: none;
    border-radius: 15px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 15px;
  }
  .el-checkbox-button,
  .el-checkbox-button__inner {
    border-radius: 15px;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #f8d6ad;
    border-color: #fff;
    box-shadow: -1px 0 0 0 #fff;
    color: #ff7300;
  }
  .title {
    padding: 20px 0px;
    font-size: 12px;
    height: 100%;
  }
  .hardGroup {
    display: flex;
    width: calc(100% - 90px);
  }
  .hardSeriesGroup {
    display: flex;
    width: calc(100% - 90px);
  }
}
</style>
