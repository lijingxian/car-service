<template>
  <div class="general-view-analysis-info-s">
    <div slot="top">
      <show-search-grid @refreshHandle="refreshHandle" ref="search">
        <div slot="description" class="description-pover">
          <p>统计增值服务订购情况</p>
        </div>
      </show-search-grid>
    </div>
    <div class="indicators-search" :class="{'showHide2' : showHideShop1}" v-if="conditionData.shopsList.length>1">
      <div class="title">店铺</div>
      <div class="hardShopGroup1" :class="{'showHideShop1' : showHideShop1}" ref="shopGroup">
        <el-checkbox-button v-model="checkAllShops" @change="handleCheckAllShops" :indeterminate="isIndeterminateShops">全部
        </el-checkbox-button>
        <el-checkbox-group :min="1" v-model="checkedShops" @change="shopsChange">
          <el-checkbox-button v-for="(item,index) in conditionData.shopsList" :label="item.id" :key="index" size="mini">
            {{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div class="swichShop1" v-if="showShopSwich1&&conditionData.shopsList.length>1">
      <i :class="classNameShop1" @click="swichShop1"></i>
    </div>
    <div class="chart-area">
      <div class="graph">
        <div class="filterSeach">
          <div class="filter-area">
            <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
          </div>
          <div class="type-range">
            <el-radio-group @change="indicatorChanged" v-model="radioValue" size="mini">
              <el-radio-button label="0">视图</el-radio-button>
              <el-radio-button label="1">列表</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <biz-chart :chartData="chartData" :loading="loading" :showSearch="false" v-if="isShow"></biz-chart>
        <biz-list ref="list" :height="height" :tableData="tableData" style="width: 100%" v-if="!isShow">
          <el-table-column prop="statisticsColumnDatas[1].columnValue" label="用户"></el-table-column>
          <el-table-column prop="statisticsColumnDatas[5].columnValue" label="服务名称"></el-table-column>
          <el-table-column prop="statisticsColumnDatas[13].columnValue" label="点击次数"></el-table-column>
          <el-table-column prop="statisticsColumnDatas[8].columnValue" label="订购时间"></el-table-column>
        </biz-list>
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
          v-if="!isShow"></biz-pagination>
        <div align="right" v-if="radioValue==='1'">
          <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BizChart from '@/components/BizChart';
import { BizList, BizPagination } from '@/components/BizTable';
import BizFilter from '@/components/BizTable/BizFilter';
import dateTime from '@/utils/dateTime';
import http from '@/common/http';
import ShowSearchGrid from '../components/ShowSearchGrid';
import dateUtil from '@/utils/date';
import axios from 'axios';
export default {
  name: 'GeneralViewAnalysis',
  data() {
    return {
      loading: true,
      height: '350',
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      viewType: 'month',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      hardGroupHeight: 0,
      isIndeterminateShops: true,
      checkAllShops: false,
      checkedShops: [],
      className: 'el-icon-caret-bottom',
      classNameShop1: 'el-icon-caret-bottom',
      showHideShop1: false,
      showShopSwich1: false,
      hardGroupShopHeight1: 0,
      showRecommend: false,
      summary: {},
      conditionData: {
        shopsList: []
      },
      filters: [
        {
          type: 'single',
          label: '',
          value: '0',
          options: [
            { value: '0', label: '服务介绍' },
            { value: '1', label: '新增服务' }
          ]
        }
      ],
      kpiName: ['本期', '同比', '环比'],
      chartData: {},
      isShow: 'false',
      radioValue: '0'
    };
  },
  props: {
    params: {
      type: Object
    }
  },
  methods: {
    handleCheckAllShops(val) {
      this.checkedShops = val ? this.conditionData.shopsList.map(item => { return item.id; }) : [];
      this.getGraphData();
      this.getTable();
    },
    shopsChange(val) {
      let checkedCount = val.length;
      this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
      this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
      this.getGraphData();
      this.getTable();
    },
    getShopList() {
      let param = {
        sourceType: '5'
      };
      http
        .get('/admin/member/json/findEShops.jhtml', param)
        .then(data => {
          this.conditionData.shopsList = data.shops;
          this.checkedShops = this.params.checkedShops || this.conditionData.shopsList.map(item => { return item.id; }) || [];
          let checkedCount = this.checkedShops.length;
          this.checkAllShops = checkedCount === this.conditionData.shopsList.length;
          this.isIndeterminateShops = checkedCount > 0 && checkedCount < this.conditionData.shopsList.length;
          this.$nextTick(() => {
            this.hardGroupShopHeight1 = document.getElementsByClassName('hardShopGroup1')[1].offsetHeight;
            console.log(this.hardGroupShopHeight1);
            if (this.hardGroupShopHeight1 > 54) {
              this.showShopSwich1 = true;
              this.showHideShop1 = true;
            } else {
              this.showShopSwich1 = false;
              this.showHideShop1 = false;
            }
          });
          this.getGraphData();
          this.getTable();
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swichShop1() {
      this.classNameShop1 = this.classNameShop1 === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHideShop1 = this.classNameShop1 === 'el-icon-caret-bottom';
      if (!this.showHideShop1) {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardShopGroup1')[0].style.height = '55px';
      }
    },
    load() {
      this.viewType = this.params.viewType || 'month';
      console.log(this.params);
      this.$refs.search.viewType = this.params.viewType || 'month';
      this.$refs.search.date = this.params.dateType || 'month';
      this.$refs.search.defaultDate = [dateTime.getPreThreeMonthDay(), dateTime.today()];
      if (this.params.beginDate) {
        this.beginDate = this.params.beginDate;
        this.endDate = this.params.endDate;
        this.$refs.search.defaultDate = [this.params.beginDate, this.params.endDate];
      }
      this.getShopList();
    },
    indicatorChanged() {
      if (this.radioValue === '0') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    getGraphData() {
      this.loading = true;
      let params = {};
      if (this.filters[0].value === '0') {
        params = {
          group: ['target_name'],
          sort: ['target_name desc'],
          table: ['dw_operation_log'],
          page: {
            pageNum: '1',
            pageSize: '10'
          },
          showColumn: [
            {
              fieldName: 'target_name'
            },
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'operate_type',
                value: 'view',
                compare: '='
              },
              {
                name: 'biz_code',
                value: 'serviceincrement',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      } else {
        params = {
          group: ['service_name'],
          table: ['dw_business_subscribe'],
          page: {
            pageNum: '1',
            pageSize: '10'
          },
          showColumn: [
            {
              fieldName: 'service_name'
            },
            {
              formula: 'count(1)',
              as: 'num'
            }
          ],
          filter: {
            and: [
              {
                name: 'create_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'create_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      }
      http
        .post('/admin/statistics/common/statisticsDatas.jhtml', params)
        .then(data => {
          if (this.filters[0].value === '0') {
            this.chartData = this.dataFormat(data);
          } else {
            this.chartData = this.dataFormatPie(data);
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getTable() {
      let params = {};
      if (this.filters[0].value === '0') {
        params = {
          table: ['dw_operation_log'],
          sort: ['operate_date'],
          group: ['user_name', 'service_name'],
          page: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'biz_code',
                value: 'serviceincrement',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      } else {
        params = {
          table: ['dw_business_subscribe'],
          sort: ['create_date'],
          page: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          filter: {
            and: [
              {
                name: 'create_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'create_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'biz_code',
                value: 'serviceincrement',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      }
      http
        .post('/admin/statistics/common/statisticsDatas/list', params)
        .then(data => {
          this.tableData = data.data.statisticsRowDatas;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      let params = {};
      if (this.filters[0].value === '0') {
        params = {
          table: ['dw_operation_log'],
          sort: ['operate_date'],
          group: ['user_name', 'service_name'],
          page: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          filter: {
            and: [
              {
                name: 'operate_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'operate_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'biz_code',
                value: 'serviceincrement',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      } else {
        params = {
          table: ['dw_business_subscribe'],
          sort: ['create_date'],
          page: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          filter: {
            and: [
              {
                name: 'create_date',
                value: this.beginDate + ' ' + '00:00:00',
                compare: '>='
              },
              {
                name: 'create_date',
                value: this.endDate + ' ' + '23:59:59',
                compare: '<='
              },
              {
                name: 'biz_code',
                value: 'serviceincrement',
                compare: '='
              },
              {
                name: 'shop_id',
                value: this.checkedShops,
                compare: 'in'
              }
            ]
          }
        };
      }
      try {
        let response = await axios.post('/admin/statistics/common/statisticsDatas/Export', params, { responseType: 'blob' });
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
    refreshHandle(val) {
      this.viewType = val.viewType;
      this.beginDate = val.date[0];
      this.endDate = val.date[1];
      this.getGraphData();
      this.getTable();
    },
    filterDataChange(val) {
      this.filters = val;
      this.getGraphData();
      this.getTable();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTable();
    },
    dataFormat(data) {
      let tmpData = [];
      for (let i = 0; i < data.indicators.statisticsRowDatas.length; i++) {
        tmpData.push({
          日期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          本期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        type: 'histogram',
        legendVisible: false,
        data: {
          columns: ['日期', '本期'],
          rows: tmpData
        },
        settings: {}
      };
      return chartData;
    },
    dataFormatPie(data) {
      let tmpData = [];
      for (let i = 0; i < (data.indicators.statisticsRowDatas.length > 40 ? 40 : data.indicators.statisticsRowDatas.length); i++) {
        tmpData.push({
          日期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[0].columnValue,
          本期: data.indicators.statisticsRowDatas[i].statisticsColumnDatas[1].columnValue
        });
      }
      let chartData = {
        legendVisible: false,
        type: 'pie',
        data: {
          columns: ['日期', '本期'],
          rows: tmpData
        },
        settings: {
          radius: [40, 120],
          offsetY: '50%'
        }
      };
      return chartData;
    },
    purposeConverter(row) {
      return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
    },
    createDateConverter(row) {
      if (!row.entryDate) return '';

      let date = new Date(row.entryDate);
      return dateUtil.dateConverter(date);
    }
  },
  created() {},
  components: {
    BizChart,
    BizList,
    BizFilter,
    ShowSearchGrid,
    BizPagination
  }
};
</script>

<style lang="scss">
.general-view-analysis-info-s {
  height: 100%;
  overflow: auto;
  margin: 20px 0px 20px 20px;
  padding-bottom: 20px;
  padding-right: 10px;
  min-width: 560px;
  .indicators-search {
    display: -webkit-box;
    height: auto;
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
      padding: 20px 10px;
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
  .swich {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .swichShop1 {
    text-align: center;
    font-size: 24px;
    cursor: pointer;
    margin-top: -10px;
  }
  .showHideOperator1 {
    height: 55px;
    overflow-y: hidden;
  }
  .showHideShop1 {
    height: 55px;
    overflow-y: hidden;
  }
  .hardShopGroup1 {
    display: flex;
    width: calc(100% - 90px);
  }
  .showHide2 {
    height: 55px;
  }
  .total {
    display: flex;
    margin-top: 20px;
    .column1 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 20px 0px 0px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column2 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 0px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
    .column3 {
      border: 1px solid #d9d9d9;
      padding: 20px;
      width: 350px;
      height: 155px;
      line-height: 40px;
      margin: 0px 5px 0px 20px;
      .table-cell {
        font-size: 15px;
      }
      .color-primary {
        font-size: 13px;
        .font {
          font-size: 32px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
  .chart-area {
    margin-top: 10px;
    display: flex;
    .graph {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      margin-right: 5px;
      width: 100%;
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
  .description-pover {
    max-height: 500px;
    overflow: auto;
  }
  .yellow {
    color: #ff7300;
  }
  .search-property {
    display: flex;
    justify-content: space-between;
    .el-input--prefix .el-input__inner {
      height: 35px;
    }
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 150px;
  }
  .toggle {
    height: 40px;
    background-color: rgb(247, 247, 247);
    margin-bottom: 20px;
    padding: 10px;
    .toggle-btn {
      cursor: pointer;
      font-size: 12px;
      display: flex;
      z-index: 1;
      justify-content: center;
      align-items: center;
      .rotate-180 {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
