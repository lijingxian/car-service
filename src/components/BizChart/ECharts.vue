<template>
  <div class="biz-e-charts">
    <div :id="id" :style="chartStyle"></div>
  </div>
</template>

<script>
// eCharts => 柱形图 + 折线图
// 引入echarts基础模板
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';

export default {
  name: 'BizECharts',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '400px'
    }
  },
  data () {
    return {
      // domID
      id: 'echart_' + String(Math.floor(Math.random() * 10000000)),
      // echarts实例
      vCharts: null,
      // echarts属性
      chartOptions: {
        dataZoom: [
          {
            realtime: true,
            type: 'inside',
            start: this.data.series[0].data.length > 30 ? this.data.series[0].data.length - 30 : 0,
            end: 100,
            rangeMode: ['value', 'percent']
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross' // 坐标轴指示器类型
          },
          backgroundColor: 'rgba(0,0,0,0.7)' // 提示框背景色
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          boundaryGap: [0, '50%'],
          type: 'value',
          minInterval: 1,
          axisLabel: { // y轴刻度标签
            formatter: value => {
              if (this.isState) {
                if (String(value) === '0') {
                  return '关闭';
                } else if (String(value) === '1') {
                  return '开启';
                }
              } else {
                return value;
              }
            }
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            smooth: false,
            areaStyle: {
              normal: {
                color: {
                  type: 'linear', // 线性渐变
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#548CD1' // 0% 处的颜色
                  },
                  {
                    offset: 1, color: 'white' // 100% 处的颜色
                  }]
                }
              }
            },
            data: []
          }
        ],
        color: ['#548CD1', '#f9b600', '#aed57f'] // 图表颜色
      }
    };
  },
  components: {
  },
  methods: {
    createECharts() {
      // 注册主题
      // echarts.registerTheme();
      // 初始化实例
      this.vCharts = echarts.init(document.getElementById(this.id));
      // 监听缩放事件
      this.vCharts.on('dataZoom', params => {
        // this.$emit('events', params);
        console.log('zoom');
        if (params.end === 100 && this.data.series[0].data.length > 30) {
          this.vCharts.setOption({ dataZoom: this.chartOptions.dataZoom });
        }
      });
      this.vCharts.setOption(this.chartOptions);
    }
  },
  computed: {
    chartStyle() {
      return {
        width: this.width,
        height: this.height
      };
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function(newVal, oldVal) {
        console.log('change===> ');
        this.vCharts.setOption(newVal);
      }
    }
  },
  mounted() {
    this.createECharts();
  }
};
</script>

<style lang="scss">
</style>
