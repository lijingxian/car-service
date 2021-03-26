# 图表说明  
### Attributes
参数 | 说明 | 类型
---|---|---
cardData | 传入的图表数据 | Object
filters | 过滤器 | Array

### 参数格式  
#### cardData 
```html
cardData: {
  legendPosition: 'top' // 图例位置,默认为top
  type: 'histogram', // 图表类型(histogram: 柱状图 / line: 折线图 / pie: 饼图)
  data: {
    columns: ['日期', '销售额', '占比', '其他'],
    rows: [ // 图表数据
      { '日期': '1月4日', '销售额': 4123, '占比': 0.31 },
      { '日期': '1月5日', '销售额': 3123, '占比': 0.12 },
      { '日期': '1月6日', '销售额': 7200, '占比': 0.65 }
    ]
  },
  // 柱状/折线图settings
  settings: {
    metrics: ['销售额', '占比'], // 图例
    yAxisType: ['normal', 'percent'], // 两边y轴的数据格式
    yAxisName: ['销售额', '占比'], // 两边y轴数据名称
    axisSite: {right: ['占比']}, // 右侧y轴数据
    max: ['10000', '1'] // 左右标尺最大值
  }
  // 饼图settings
  settings: {
    dimension: '日期', // 维度(图例项目), 默认columns第一项
    metrics: '销售额-1季度', // 指标(图例数值), 默认columns第二项
    offsetY: 200 // 纵向偏移
    radius: [50, 150] // 半径(内, 外)
  }
  // 仪表盘
  chartData: {
    type: 'gauge',
    data: {
      columns: ['type', 'value'],
      rows: [
        {type: '车速', value: '666'},
        {type: '转速', value: '777'}
      ]
    },
    settings: {
      dataName: {
        '车速': 'km/h',
        '转速': 'x1000r/min'
      },
      seriesMap: {
        '车速': {
          min: 0,
          max: 240,
          splitNumber: 12,
          radius: '45%'
        },
        '转速': {
          center: ['35%', '50%'],
          radius: '45%',
          min: 0,
          max: 8,
          splitNumber: 8
        }
      }
    }
  }
}
```