<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-instrument">
    <biz-chart :chartData="chartData" :chartWidth="'460px'" :chartHeight="'220px'" :showSearch="false"></biz-chart>
    <div class="table">
      <div class="table-row">
        <div class="table-cell color-grey">当前车速</div>
        <div class="table-cell">{{data.speed ? data.speed : '--'}}km/h</div>
        <div class="table-cell color-grey">发动机转速</div>
        <div class="table-cell">{{data.rotatedSpeed ? data.rotatedSpeed : '--'}}rpm</div>
      </div>
      <div class="table-row">
        <div class="table-cell color-grey">瞬时油耗</div>
        <div class="table-cell">{{data.oil ? data.oil : '--'}}L/km</div>
        <div class="table-cell color-grey">剩余油量</div>
        <div class="table-cell">{{data.remainingOil ? data.remainingOil : '--'}}%</div>
      </div>
      <div class="table-row">
        <div class="table-cell color-grey">耗油量</div>
        <div class="table-cell">{{data.totalOil ? data.totalOil : '--'}}L</div>
        <div class="table-cell color-grey">总行驶里程</div>
        <div class="table-cell">{{data.totalMiles ? data.totalMiles : '--'}}km</div>
      </div>
      <div class="table-row">
        <div class="table-cell color-grey">平均油耗</div>
        <div class="table-cell">{{data.avgOil ? data.avgOil : '--'}}L/100km</div>
        <div class="table-cell color-grey">电瓶电压</div>
        <div class="table-cell">{{data.voltage ? data.voltage : '--'}}V</div>
      </div>
      <div class="table-row">
        <div class="table-cell color-grey">发动机运行时间</div>
        <div class="table-cell">{{data.engineRunningTime ? data.engineRunningTime : '--'}}s</div>
        <div class="table-cell color-grey">发动机水温</div>
        <div class="table-cell">{{data.engineWaterTemperature ? data.engineWaterTemperature : '--'}}℃</div>
      </div>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizChart from '@/components/BizChart';

import service from '@/service/vehicle-mgmt/VehicleInstrument';

export default {
  name: 'VehicleInstrument',
  components: {
    BizGrid,
    BizChart
  },
  data() {
    return {
      data: {},
      chartData: {
        type: 'gauge',
        data: {
          columns: ['type', 'value'],
          rows: [{ type: '车速', value: '0' }, { type: '转速', value: '0' }]
        },
        settings: {
          dataName: {
            车速: 'km/h',
            转速: 'x1000r/min'
          },
          seriesMap: {
            车速: {
              center: ['25%', '50%'],
              min: 0,
              max: 240,
              splitNumber: 12,
              radius: '100%'
            },
            转速: {
              center: ['76%', '50%'],
              radius: '100%',
              min: 0,
              max: 8,
              splitNumber: 8
            }
          }
        }
      }
    };
  },
  computed: {},
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  created() {},
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.formModel = this.getDefaultModel();
      }
    },
    query() {
      let params = {
        carId: this.itemId.id,
        terminalId: this.itemId.id
      };
      service.query(
        params,
        data => {
          this.data = data.data;
          this.$set(this.chartData.data, 'rows', [
            {
              type: '车速',
              value: data.data.speed === '--' ? '0' : data.data.speed
            },
            {
              type: '转速',
              value:
                data.data.rotatedSpeed === '--'
                  ? '0'
                  : data.data.rotatedSpeed / 1000
            }
          ]);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getDefaultModel() {
      return {};
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__vehicle-instrument {
  height: 100%;
  .biz-chart .chart-area {
    margin-top: 0;
  }
  .biz-chart {
    margin: 20px 0;
    min-width: 200px;
  }
  .table {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #606266;
    border: 1px solid #ebeef5;
    text-align: center;
    .table-row {
      display: flex;
      flex-direction: row;
      // border: 1px solid #ebeef5;
      .table-cell {
        flex-basis: 100%;
        flex-grow: 1;
        padding: 8px 10px;
        border: 1px solid #ebeef5;
      }
      .color-grey {
        background-color: #fafafa;
      }
    }
  }
  .biz-scroller {
  }
}
</style>
