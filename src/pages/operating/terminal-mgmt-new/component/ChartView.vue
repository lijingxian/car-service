<template>
  <div class="chart-view">
    <biz-chart v-for="item in userOptions"
      :key="item.id"
      :isSlide="true"
      v-if="selectedOption === item.id"
      :isState="item.dataType === '1' ? true : false"
      :chartData="chartData[item.id]"
      :chartHeight="chartHeight"
      :chartWidth="chartWidth"
      :showSearch="false"
    ></biz-chart>
  </div>
</template>

<script>
import BizChart from '@/components/BizChart';

export default {
  name: 'ChartView',
  props: {
    max: {
      type: Number,
      default() {
        return 0;
      }
    },
    userOptions: {
      type: Array,
      default: function () {
        return [];
      }
    },
    selectedOption: {
      type: String,
      default: '1'
    },
    streamData: {
      type: Array
    }
  },
  data () {
    return {
      // 是否显示状态
      isState: false,
      chartHeight: '300px',
      chartWidth: '400px',
      chartData: {}
    };
  },
  methods: {
    addOptions(item) {
      let id = item.id;
      // this.$set 修改对象的属性
      this.$set(this.chartData, id, {
        legendVisible: false,
        type: 'line',
        data: {
          columns: ['时间', 'value'],
          rows: []
        },
        settings: {
          area: true,
          showLine: ['value'],
          yAxisType: ['normal'],
          xAxisName: 's',
          yAxisName: [item.unit || '状态']
        }
      });
    },
    deleteOptions(item) {
      delete this.chartData[item.id];
    }
  },
  watch: {
    userOptions(newVal, oldVal) {
      // 找到newVal与oldVal不同的元素
      let diff = oldVal.filter(x => newVal.indexOf(x) === -1).concat(newVal.filter(x => oldVal.indexOf(x) === -1));
      // 这些元素有哪些是新加的
      diff.map(item => {
        if (this.chartData[item.id] !== undefined) {
          this.deleteOptions(item);
        } else if (this.chartData[item.id] === undefined) {
          this.addOptions(item);
        }
      });
    },
    streamData() {
      this.streamData.map(data => {
        let dateTime = data.dateTime;
        data.datas.map(item => {
          let itemData = this.chartData[item.pid].data.rows;
          if (this.max !== 0 && itemData.length > this.max) {
            itemData.shift();
          }
          // 上一波数据流获取结束,开始新数据流获取时把数据都清空
          if (Number(dateTime) === 0) {
            itemData = [];
          }
          itemData.push({ 时间: dateTime, value: item.value || '0' });
        });
      });
    }
  },
  components: {
    BizChart
  }
};
</script>

<style lang="scss">
.chart-view {
  .biz-chart {
    width: 400px;
    min-width: 0;
    .chart-area{
      margin-top: 5px;
    }
  }
}
</style>
