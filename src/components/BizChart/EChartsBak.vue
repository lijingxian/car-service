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
    legendVisible: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String,
      default: 'top'
    },
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '600px'
    },
    options: {
      type: Object,
      default() {
        return {
          metrics: [''],
          yAxisType: ['normal', 'percent'],
          yAxisName: ['']
        };
      }
    }
  },
  data () {
    return {
      // domID
      id: 'echart' + String(Math.floor(Math.random() * 10000000)),
      // echarts实例
      vCharts: null,
      // echarts属性
      chartOptions: {},
      // 假数据
      fakeData: {
        data: {
          columns: ['日期', '左y轴', '右y轴'],
          rows: [
            { '日期': '2018-05-06', '左y轴': 2, '右y轴': 8 },
            { '日期': '2018-05-07', '左y轴': 3, '右y轴': 7 },
            { '日期': '2018-05-08', '左y轴': 4, '右y轴': 6 },
            { '日期': '2018-05-09', '左y轴': 5, '右y轴': 5 },
            { '日期': '2018-05-10', '左y轴': 6, '右y轴': 4 },
            { '日期': '2018-05-11', '左y轴': 7, '右y轴': 3 }
          ]
        },
        settings: {
          metrics: ['左y轴', '右y轴'],
          showLine: '右y轴',
          yAxisType: ['normal', 'percent'],
          yAxisName: ['左边', '右边'],
          axisSite: { right: ['右y轴'] }
        }
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
      // 监听点击事件
      this.vCharts.on('click', params => {
        this.$emit('events', params);
      });
      this.setCharts(this.formatData(this.data));
    },
    // 绘制图表
    setCharts(data) {
      // 设置属性
      this.setChartOptions();
      Object.assign(this.chartOptions, { series: data });
      console.log('chartOpt: ', this.chartOptions);
      this.vCharts.setOption(this.chartOptions);
    },
    // 设置初始属性
    setChartOptions() {
      this.chartOptions = {
        title: {},
        legend: {
          // 图例项目
          data: this.options.metrics || this.setLegends(),
          // 是否显示图例
          show: this.legendVisible !== false,
          // 图例排列方式,默认水平排列
          orient: 'horizontal',
          // 图例对齐方式,默认居中
          align: this.options.legend ? this.options.legend.align : 'auto' || 'auto'
        },
        xAxis: {
          // 设置刻度
          axisTick: {
            alignWithLabel: true
          },
          data: this.setXAxisData()
        },
        yAxis: this.setYAxis(),
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              backgroundColor: 'rgba(0,0,0,0.7)' // 提示框背景色
            }
          },
          formatter: params => {
            let tmp = params.map(data => {
              if (this.options.axisSite && data.seriesName === this.options.axisSite.right[0] && this.options.yAxisType[1] === 'percent') {
                return `${data.seriesName} :  ${data.value * 100}%`;
              } else {
                return `${data.seriesName} :  ${data.value}`;
              }
            });
            return `${params[0].name}<br>${tmp.join('<br>')}`;
          }
        },
        // 柱状图样式
        series: [{
          barMaxWidth: '98px' // 柱最大宽度
        }],
        color: ['#548CD1', '#f9b600', '#aed57f'] // 图表颜色
      };
      switch (this.legendPosition) {
        case 'left':
          this.chartOptions.legend.left = 'left';
          this.chartOptions.legend.top = 'middle';
          this.chartOptions.legend.orient = 'vertical';
          break;
        case 'bottom':
          this.chartOptions.legend.left = 'middle';
          this.chartOptions.legend.top = 'bottom';
          break;
        case 'right':
          this.chartOptions.legend.left = 'right';
          this.chartOptions.legend.top = 'middle';
          this.chartOptions.legend.orient = 'vertical';
          break;
        default:
          break;
      }
    },
    // 从columns第二项开始设为图例
    setLegends() {
      let tmp = this.data.columns.map(legend => {
        return legend;
      });
      [, ...tmp] = tmp.concat();
      return tmp;
    },
    // 设置x轴数据
    setXAxisData() {
      let tmpData = [];
      for (let i = 0; i < this.data.rows.length; i++) {
        tmpData.push(this.data.rows[i][this.data.columns[0]]);
      }
      return tmpData;
    },
    // 设置y轴
    setYAxis() {
      let leftY = {
        // category: 类目, value: 数值
        type: this.options.yAxis ? this.options.yAxis.type[0] || 'value' : 'value',
        name: this.options.yAxisName ? this.options.yAxisName[0] : '',
        minInterval: this.options.yAxis ? this.options.yAxis.minInterval ? this.options.yAxis.minInterval[0] : 1 : 1,
        splitLine: { show: false },
        axisLabel: {
          formatter: this.options.yAxis ? this.options.yAxis.formatter ? this.options.yAxis.formatter[0] : '{value}' : '{value}'
        }
      };
      if (this.options.axisSite && this.options.axisSite.right) {
        let rightY = {
          // category: 类目, value: 数值
          // 如果有单独设置的yType
          type: this.options.yAxis ? this.options.yAxis.type[1] || 'value' : 'value',
          name: this.options.metrics[1],
          minInterval: this.options.yAxis ? this.options.yAxis.minInterval ? this.options.yAxis.minInterval[1] : 0 : 0,
          splitLine: { show: false },
          axisLabel: {
            formatter: this.options.yAxis ? this.options.yAxis.formatter ? this.options.yAxis.formatter[1] : '{value}' : '{value}'
          }
        };
        if (this.options.yAxisType && this.options.yAxisType[1] === 'percent') {
          rightY.axisLabel.formatter = '{value}%';
        }
        return [leftY, rightY];
      } else {
        return leftY;
      }
    },
    // 格式化图表数据
    formatData(data) {
      // console.log('data: ', data);
      let tmpSeries = [];
      if (this.options.metrics) {
        for (let i = 0; i < this.options.metrics.length; i++) {
          tmpSeries.push({ name: this.options.metrics[i], type: 'bar', data: [] });
          if (this.options.axisSite ? tmpSeries[i].name === this.options.axisSite.right[0] : false) {
            tmpSeries[i].type = 'line';
            tmpSeries[i].yAxisIndex = 1;
          }
        }
        for (let i = 0; i < data.rows.length; i++) {
          for (let j = 0; j < this.options.metrics.length; j++) {
            tmpSeries[j].data.push(data.rows[i][this.options.metrics[j]]);
          }
        }
      } else if (this.data.columns) {
        console.log('columns');
        // 如果没有metrics,就从columns第二项开始取值作为series的name
        for (let i = 1; i < this.data.columns.length; i++) {
          tmpSeries.push({ name: this.data.columns[i], type: 'bar', data: [] });
          // showLine[]
          if (this.options.showLine && tmpSeries[i - 1].name === this.options.showLine[0]) {
            tmpSeries[i - 1].type = 'line';
          }
          // axisSite, [限定: 只有一类数据在右侧y轴上]
          if (this.options.right && this.options.right[0] === tmpSeries[i - 1].name) {
            tmpSeries[i - 1].yAxisIndex = 1;
          }
        }
        for (let i = 0; i < data.rows.length; i++) {
          for (let j = 1; j < this.data.columns.length; j++) {
            tmpSeries[j - 1].data.push(data.rows[i][this.data.columns[j]]);
          }
        }
      }
      console.log('tmpSeries: ', tmpSeries);
      return tmpSeries;
    },
    // 图表点击事件
    chartClick() {
      this.vCharts.on('click', params => {
        console.log('click: ', params);
      });
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
    options: {
      deep: true,
      handler: function() {
        this.setChartOptions(this.options);
        this.vCharts.setOption(this.chartOptions);
      }
    },
    data: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.setCharts(this.formatData(this.data));
      }
    }
  },
  mounted() {
    // this.data = this.fakeData.data;
    // this.options = this.fakeData.settings;
    // this.setChartOptions();
    console.log('data: ', this.data);
    console.log('options: ', this.options);
    this.createECharts();
  }
};
</script>

<style lang="scss">
</style>
