<template>
  <div class="order-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';
import { orderMgmt } from '@/common/urls';

export default {
  name: 'OrderMgmtNav',
  data() {
    return {
      // 今日新增订单
      dayOrderCount: '',
      // 本月累计订单
      monthOrderCount: '',
      // 今日新增储值记录
      dayDepositCount: '',
      // 今日新增收款记录
      dayPaymentCount: '',
      // 今日新增退款记录
      dayRefundsCount: '',
      // 本月累计售后记录
      monthRefundsCount: '',
      // 发货点
      deliveryCenter: '',
      // 物流公司数量
      deliveryCorp: '',
      // 今日发货
      dayShippingCount: '',
      // 本月发货
      monthShippingCount: ''
      // 上次统计时间
      // lastQuery: '';
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: '/operating/product/car',
            title: '处理产品/服务订单',
            content: [
              '管理订单，进行确认、发货/执行、收款等处理。',
              '在线支付：新订单→发货/执行',
              '到店支付：新订单→确认→执行→收款'
            ],
            bottom: [
              { content: '今日新增订单', value: this.dayOrderCount, unit: '个' },
              { content: '本月累计订单', value: this.monthOrderCount, unit: '个' }
            ]
          }
        ],
        [
          {
            link: '/operating/finance/refund',
            title: '查看售后记录',
            content: '查看和分析店铺退款、退货退款记录',
            bottom: [
              { content: '今日新增售后记录', link: '/operating/finance/refund', value: this.dayRefundsCount, unit: '个' },
              { content: '本月累计售后记录', link: '/operating/finance/refund', value: this.monthRefundsCount, unit: '个' }
            ]
          },
          {
            link: '/operating/logistics/shipping',
            title: '查看物流记录',
            content: '查看和分析店铺的发货情况',
            bottom: [
              { content: '今日新增发货记录', link: '/operating/logistics/shipping', value: this.dayShippingCount, unit: '个' },
              { content: '本月累计发货记录', link: '/operating/logistics/shipping', value: this.monthShippingCount, unit: '个' }
            ]
          }
        ],
        // [
        //   {
        //     link: '/order/finance/payment',
        //     title: '查看收付款记录',
        //     content: '店铺的收款记录、退款记录、储值记录均在此进行管理',
        //     bottom: [
        //       { content: '今日新增储值记录', link: '/order/finance/deposit', value: this.dayDepositCount, unit: '个' },
        //       { content: '今日新增收款记录', link: '/order/finance/payment', value: this.dayPaymentCount, unit: '个' },
        //       { content: '今日新增退款记录', link: '/order/finance/refund', value: this.dayRefundsCount, unit: '个' }
        //     ]
        //   }
        // ],
        [
          {
            link: '/order/statistics-analysis',
            tree: ['orderStatisticsContent', 'orderStatistics', 'orderAccount'],
            title: '数据洞察',
            content: '分析订单成交情况和售后情况',
            bottom: [
              // { content: '物流公司数量',
              //   value: this.deliveryCorp,
              //   unit: '个'
              // },
              // { content: '今日发货', link: '/order/logistics/shipping', value: this.dayShippingCount, unit: '个' },
              // { content: '本月发货', link: '/order/logistics/shipping', value: this.monthShippingCount, unit: '个' }
            ]
          }
        ]
      ];
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      http
        .get(orderMgmt.navInfo, {})
        .then(data => {
          // 今日新增订单
          this.dayOrderCount = data.data.dayOrderCount;
          // 本月累计订单
          this.monthOrderCount = data.data.monthOrderCount;
          // 今日新增储值记录
          this.dayDepositCount = data.data.dayDepositCount;
          // 今日新增收款记录
          this.dayPaymentCount = data.data.dayPaymentCount;
          // 今日新增退款记录
          this.dayRefundsCount = data.data.dayRefundsCount;
          // 本月累计售后记录
          this.monthRefundsCount = data.data.monthRefundsCount;
          // 发货点
          this.deliveryCenter = data.data.deliveryCenter;
          // 物流公司数量
          this.deliveryCorp = data.data.deliveryCorp;
          // 今日发货
          this.dayShippingCount = data.data.dayShippingCount;
          // 本月发货
          this.monthShippingCount = data.data.monthShippingCount;
          // 上次统计时间
          // this.lastQuery = '';
        })
        .catch();
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.order-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
