<template>
  <div class="biz-chart">
    <div class="search-property" v-if="showSearch">
      <el-radio-group v-model="date" @change="dateSwich(date)" size="mini" v-if="showTimeRange">
        <el-radio-button label="day">本日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="quarter">本季</el-radio-button>
        <el-radio-button label="year">半年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        type="daterange"
        class="biz-date-range"
        v-model="defaultDate"
        size="mini"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="dateChange"
        v-if="showDateRange"
      ></el-date-picker>
      <el-date-picker v-model="singleDate" type="date" placeholder="选择日期" @change="beginDateChange" value-format="yyyy-MM-dd" v-if="showTimeDate" size="mini"></el-date-picker>
      <slot name="extraContent"></slot>
      <el-radio-group v-model="viewType" @change="queryType(viewType)" size="mini" v-if="showViewType">
        <el-radio-button label="day">按日</el-radio-button>
        <el-radio-button label="week">按周</el-radio-button>
        <el-radio-button label="month">按月</el-radio-button>
      </el-radio-group>
      <el-button type="text" size="mini" v-popover:codePop v-if="showDescription">
        统计说明
        <i class="iconfont el-icon-question"></i>
      </el-button>
      <el-popover ref="codePop" placement="bottom-start" width="300" trigger="hover">
        <slot name="description"></slot>
      </el-popover>
      <el-button type="primary" size="mini" @click="exportExcle">导出</el-button>
    </div>
    <div class="filter-area" v-if="filters.length > 0">
      <biz-filter v-if="filters.length > 0" :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
    </div>
    <slot name="indicators"></slot>
    <div class="chart-area">
      <ve-histogram
        ref="chart"
        v-if="chartData.type === 'histogram'"
        :data="chartData.data"
        :loading="loading"
        :data-empty="isEmpty"
        :legend-visible="chartData.legendVisible"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
        :settings="chartData.settings"
        :data-zoom="dataZoom"
        :set-option-opts="true"
        :extend="chartExtend"
        :colors="chartColors"
        :events="events"
        :width="chartWidth"
        :height="chartHeight"
      ></ve-histogram>
      <ve-line
        ref="chart"
        v-if="chartData.type === 'line'"
        :data="chartData.data"
        :loading="loading"
        :data-empty="isEmpty"
        :legend-visible="chartData.legendVisible"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
        :settings="chartData.settings"
        :data-zoom="dataZoom"
        :set-option-opts="true"
        :extend="chartExtend"
        :colors="chartColors"
        :events="events"
        :width="chartWidth"
        :height="chartHeight"
      ></ve-line>
      <ve-line
        ref="chart"
        v-if="chartData.type === 'lineNew'"
        :data="chartData.data"
        :loading="loading"
        :data-empty="isEmpty"
        :legend-visible="chartData.legendVisible"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
        :settings="chartData.settings"
        :data-zoom="dataZoom"
        :colors="radarColors"
        :events="events"
        :width="chartWidth"
        :height="chartHeight"
      ></ve-line>
      <biz-histogram v-if="chartData.type === 'echarts'" :data="chartData.data" :height="chartHeight" :width="chartWidth"></biz-histogram>
      <ve-ring
        ref="chart"
        v-if="chartData.type === 'pie'"
        :data-empty="isEmpty"
        :data="chartData.data"
        :settings="chartData.settings"
        :colors="pieColors"
        :events="chartData.events"
        :width="chartWidth"
        :height="chartHeight"
        :legend-visible="chartData.legendVisible"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
        :extend="chartExtendPie"
      ></ve-ring>
      <ve-pie
        ref="chart"
        v-if="chartData.type === 'pieNew'"
        :data-empty="isEmpty"
        :data="chartData.data"
        :settings="chartData.settings"
        :colors="pieColorsNew"
        :width="chartWidth"
        :height="chartHeight"
        :legend-visible="false"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
      ></ve-pie>
      <ve-gauge ref="chart" v-if="chartData.type === 'gauge'" :data="chartData.data" :settings="chartData.settings" :width="chartWidth" :height="chartHeight"></ve-gauge>
      <el-button type="primary" size="mini" @click="buttonClick" v-show="showBackButton">返回上一级</el-button>
      <ve-map
        v-if="chartData.type==='map'"
        :data="chartData.data"
        :settings="chartData.settings"
        :width="chartWidth"
        :height="chartHeight"
        :visual-map="visualMap"
        :events="chartData.events"
        :legend-visible="chartData.legendVisible"
        v-show="showMap"
        style="margin-left:auto;"
      ></ve-map>
      <div ref="mapChart" style="height:600px;width:600px" v-show="showMapChart"></div>
      <ve-radar
        v-if="chartData.type==='radar'"
        :data="chartData.data"
        :settings="chartData.settings"
        :legend-visible="false"
        :width="chartWidth"
        :extend="radarExtend"
        :height="chartHeight"
        :colors="radarColors"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
      ></ve-radar>
      <ve-radar
        v-if="chartData.type==='radarShop'"
        :data="chartData.data"
        :settings="chartData.settings"
        :legend-visible="false"
        :width="chartWidth"
        :extend="radarExtendByShop"
        :height="chartHeight"
        :colors="radarColors"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
      ></ve-radar>
      <ve-funnel
        v-if="chartData.type==='funnel'"
        :data="chartData.data"
        :settings="chartData.settings"
        :legend-visible="false"
        :width="chartWidth"
        :height="chartHeight"
        :legend-position="chartData.legendPosition === undefined ? 'top' : chartData.legendPosition"
      ></ve-funnel>
    </div>
    <slot name="chart"></slot>
    <slot name="list"></slot>
    <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" v-if="showSearch&&showPagination"></biz-pagination>
  </div>
</template>

<script>
import BizFilter from '@/components/BizTable/BizFilter.vue';
import BizPagination from '@/components/BizTable/BizPagination.vue';
import BizHistogram from './ECharts.vue';
import VeHistogram from 'v-charts/lib/histogram';
import VeGauge from 'v-charts/lib/gauge';
import VeLine from 'v-charts/lib/line';
import 'echarts/lib/component/visualMap';
import VeMap from 'v-charts/lib/map';
import VePie from 'v-charts/lib/pie';
import VeFunnel from 'v-charts/lib/funnel';
import VeRadar from 'v-charts/lib/radar';
import VeRing from 'v-charts/lib/ring';
import 'v-charts/lib/style.css';
import 'echarts/lib/component/dataZoom';
import dateTime from '@/utils/dateTime';
export default {
  name: 'BizChart',
  props: {
    // 是否在Y轴显示状态
    isState: {
      type: Boolean,
      default: false
    },
    showTimeRange: {
      type: Boolean,
      default: true
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showDateRange: {
      type: Boolean,
      default: true
    },
    showTimeDate: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    filters: {
      type: Array,
      default: function() {
        return [];
      }
    },
    chartData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    chartWidth: {
      type: String,
      default: '100%'
    },
    chartHeight: {
      type: String,
      default: '100%'
    },
    // 是否可滑动
    isSlide: {
      type: Boolean,
      default() {
        return false;
      }
    },
    pagination: {
      type: Object,
      default() {
        return {};
      }
    },
    showViewType: {
      type: Boolean,
      default() {
        return true;
      }
    },
    axisLabelRotate: {
      type: Number,
      default() {
        return 0;
      }
    },
    showMap: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showMapChart: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showBackButton: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    visualMap() {
      let ary = [
        {
          min: 0,
          max: this.chartData.maxRangeValue,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['white', 'yellow', 'orangered']
          }
        }
      ];
      return ary;
    },
    dataZoom() {
      if (this.isSlide) {
        return {
          type: 'slider'
        };
      } else {
        return {
          disabled: true,
          type: 'inside'
        };
      }
    },
    chartExtend() {
      let that = this;
      let rotate = '';
      let time = new Date();
      if (this.chartData.data.rows.length > 8) {
        rotate = '45';
      } else {
        rotate = '';
      }
      let extend = {
        // 设置图表位置
        grid: [{ left: '40px', right: '40px' }],
        xAxis: {
          name: this.chartData.settings.xAxisName || '', // x轴名称
          nameLocation: 'end', // x轴名称位置
          nameGap: 10, // x轴名称与坐标轴间距
          axisLine: { show: true }, // 显示横轴轴线
          axisLabel: {
            interval: this.chartData.settings.interval,
            rotate: rotate,
            formatter: function(value, index) {
              if (value.length > 7 && value.substring(0, 5) !== (time.getFullYear() + '-')) {
                return value.substr(0, 4) + '...';
              } else {
                return value;
              }
            }
          }
        },
        yAxis(axis) {
          axis.forEach((item, index) => {
            // 右Y轴
            if (index) {
              Object.assign(item, {
                splitLine: { show: false }, // 显示横向分割线
                axisLine: {
                  show: that.ifShowRightYAxisLine() // 是否显示y轴
                },
                minInterval: 0 // y轴最小刻度间隔,设置为1可以显示整数
              });
            } else {
              // 左Y轴
              Object.assign(item, {
                splitLine: { show: false },
                axisLine: {
                  show: true
                }
                // minInterval: 1,
                // axisLabel: {
                //   // y轴刻度标签
                //   formatter: value => {
                //     if (that.isState) {
                //       if (String(value) === '0') {
                //         return '关闭';
                //       } else if (String(value) === '1') {
                //         return '开启';
                //       }
                //     } else {
                //       return value;
                //     }
                //   }
                // }
              });
            }
          });
          return axis;
        },
        series: {
          smooth: false, // 折线平滑度,false为不平滑
          barMaxWidth: '28px' // 柱最大宽度
        }
      };
      if (that.chartData.tooltip) {
        this.$set(extend, 'tooltip', {
          trigger: 'axis',
          formatter: function(params) {
            console.log(params);
            // params.length > 1为自定义tooltip内容的情况
            if (that.chartData.type === 'histogram') {
              let result = params[0].name;
              params.forEach(function(item) {
                result += '<br/>';
                result += item.seriesName + '：';
                result += item.value;
              });
              return result;
            } else {
              let result = params[1].name;
              params[1].value[1].forEach(function(item) {
                result += '<br/>';
                result += item.indicator + '：';
                result += item.yValue;
              });
              return result;
            }
          },
          axisPointer: {
            type: 'cross' // 坐标轴指示器类型
          },
          backgroundColor: 'rgba(0,0,0,0.7)' // 提示框背景色
        });
      }
      if (this.axisLabelRotate) {
        this.$set(extend, 'xAxis', {
          name: this.chartData.settings.xAxisName || '', // x轴名称
          nameLocation: 'end', // x轴名称位置
          nameGap: 10, // x轴名称与坐标轴间距
          axisLine: { show: true }, // 显示横轴轴线
          axisLabel: {
            rotate: this.axisLabelRotate
          }
        });
      }
      if (this.chartData.settings.area) {
        this.$set(extend, 'areaStyle', {
          normal: {
            color: {
              type: 'linear', // 线性渐变
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#548CD1' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'white' // 100% 处的颜色
                }
              ]
            }
          }
        });
      }
      return extend;
    },
    chartExtendPie() {
      let radius = ['20%', '60%'];
      if (this.chartData.settings.radius) {
        radius = this.chartData.settings.radius;
      }
      let extend = {
        series: {
          radius // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
        }
      };
      return extend;
    },
    radarExtend() {
      let extend = {
        // 设置图表位置
        grid: {
          position: 'center'
        },
        tooltip: {
          // 雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
          confine: true,
          enterable: true // 鼠标是否可以移动到tooltip区域内
        },
        radar: {
          shape: 'polygon',
          nameGap: 12,
          indicator: [
            { name: '消费能力', max: 10 },
            { name: '消费品质', max: 10 },
            { name: '消费状况', max: 10 },
            { name: '价格敏感度', max: 10 }
          ]
        },
        series: {
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
                opacity: 0.4
              }
            }
          }
        }
      };
      return extend;
    },
    radarExtendByShop() {
      let indicators = [];
      this.chartData.data.data.map(item => {
        indicators.push({ name: item.lable, max: 10 });
      });
      console.log(indicators);
      let extend = {
        // 设置图表位置
        grid: {
          position: 'center'
        },
        tooltip: {
          // 雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
          confine: true,
          enterable: true // 鼠标是否可以移动到tooltip区域内
        },
        radar: {
          shape: 'polygon',
          nameGap: 12,
          indicator: indicators
          // name: {
          //   formatter: text => {
          //     let strlength = text.length;
          //     if (strlength % 2 === 1) {
          //       text = text.replace(/\S{2}/g, function(match) {
          //         console.log(match);
          //         return match + '\n';
          //       });
          //     } else {
          //       text = text.replace(/\S{2}/g, function(match) {
          //         console.log(match);
          //         return match + '\n';
          //       });
          //       strlength = text.length;
          //       text = text.substring(0, strlength - 1);
          //     }
          //     return text;
          //   }
          // }
        },
        series: {
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
                opacity: 0.4
              }
            }
          }
        }
      };
      return extend;
    }
  },
  data() {
    return {
      // 是否显示空值信息
      isEmpty: false,
      defaultDate: this.getFormatDate(),
      mapName: '',
      viewType: 'month',
      date: 'month',
      singleDate: '',
      chartColors: ['#548CD1', '#f9b600', '#aed57f', '#FF7993', '#0071B6', '#df4567', '#784536', '#ed4579', '#bc7829', '#dc8732'], // 柱形-折线图表颜色
      pieColors: ['#CB4043', '#FD5052', '#FD770A', '#FDC60A', '#74BB81', '#89C5EA', '#8E89EA', '#EE8FB7', '#0090D5', '#dc8732'], // 饼图颜色
      pieColorsNew: [
        '#1093FF',
        '#7C6AF2',
        '#C95FF2',
        '#FF6383',
        '#FF4608',
        '#FF7600',
        '#FFD536',
        '#2DD99F',
        '#51E279',
        '#5BD745',
        '#A7DA22',
        '#FFF321',
        '#FFBC3D',
        '#E3ACFF',
        '#BA95FF',
        '#E39B63',
        '#EB328D',
        '#02A9A9',
        '#00BCFF',
        '#2D6AFF'
      ],
      radarColors: ['#0088F8']
    };
  },
  created() {
    let me = this;
    // 点击事件
    this.events = {
      click: e => {
        me.$emit('events', e);
      }
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.isEmpty = !this.chartData.data.rows.length;
        this.ifShowRightYAxisLine();
      }
    }
  },
  methods: {
    getFormatDate() {
      return [dateTime.getMonthStartDate(), dateTime.getMonthEndDate()];
    },
    dateChange(value) {
      this.$emit('refreshHandle', {
        date: this.defaultDate,
        viewType: this.viewType
      });
    },
    beginDateChange(value) {
      this.$emit('refreshHandle', {
        date: this.singleDate
      });
    },
    dateSwich(type) {
      console.log(this);
      switch (type) {
        case 'day':
          this.viewType = 'day';
          this.defaultDate = [dateTime.today(), dateTime.today()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'day';
          break;
        case 'week':
          this.viewType = 'week';
          this.defaultDate = [dateTime.getWeekStartDate(), dateTime.getWeekEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'week';
          break;
        case 'month':
          this.viewType = 'month';
          this.defaultDate = [dateTime.getMonthStartDate(), dateTime.getMonthEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'month';
          break;
        case 'quarter':
          this.defaultDate = [dateTime.getQuarterStartDate(), dateTime.getQuarterEndDate()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'quarter';
          break;
        case 'year':
          this.defaultDate = [dateTime.getQuarterHalfYearStart(), dateTime.getQuarterHalfYearEnd()];
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: this.viewType
          });
          this.date = 'year';
          break;
        default:
          break;
      }
    },
    queryType(type) {
      switch (type) {
        case 'day':
          this.viewType = 'day';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'day'
          });
          break;
        case 'week':
          this.viewType = 'week';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'week'
          });
          break;
        case 'month':
          this.viewType = 'month';
          this.$emit('refreshHandle', {
            date: this.defaultDate,
            viewType: 'month'
          });
          break;
        default:
          break;
      }
    },
    exportExcle() {
      this.$emit('exportExcle');
    },
    resize() {
      this.$refs.chart.resize();
    },
    ifShowRightYAxisLine() {
      if (this.chartData.settings) {
        if (this.chartData.settings.axisSite && this.chartData.settings.axisSite.right) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    filterDataChange(filters) {
      this.$emit('filterDataChange', filters);
    },
    chartEvent(params) {
      this.$emit('events', params);
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    buttonClick() {
      this.$emit('buttonClick');
    }
  },
  components: {
    BizFilter,
    BizHistogram,
    VeHistogram,
    VeGauge,
    VeLine,
    VeRing,
    VePie,
    VeFunnel,
    BizPagination,
    VeMap,
    VeRadar
  }
};
</script>

<style lang="scss">
.biz-chart {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  padding: 10px;
  height: 100%;
  .chart-area {
    margin-top: 10px;
    height: 50vh;
    min-height: 50%;
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
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border: none;
    border-radius: 15px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 15px;
  }
  .el-checkbox-button,
  .el-checkbox-button__inner {
    padding: 0px 10px;
    border-radius: 15px;
  }
  .el-checkbox-button__inner {
    border: none;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #f8d6ad;
    border-color: #fff;
    box-shadow: -1px 0 0 0 #fff;
    color: #ff7300;
  }
  .indicators-search {
    border-bottom: 1px solid #ebeef5;
  }
  .biz-date-range {
    &.el-date-editor--daterange.el-input__inner,
    &.el-date-editor--timerange.el-input__inner {
      width: 220px;
    }
    span {
      padding: 0;
      width: 15px;
    }
  }
}
</style>
