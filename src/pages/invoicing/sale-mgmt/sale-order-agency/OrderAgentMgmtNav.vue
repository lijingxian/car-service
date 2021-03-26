<template>
  <div class="order-agent-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';

export default {
  name: 'OrderAgentMgmtNav',
  data() {
    return {
      navUrl: '/admin/invoicing/purchase/queryAgentSalesKpi.jhtml',
      form: {
        currentDayCreatedSalesOrder: 0,
        currentMonthSalesOrder: 0
      },
      authorities: []
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: this.authorities.includes('admin:saleOrder.agent') ? '/invoicing/sale-agent/agency-sale-order' : '',
            title: '管理销售订单',
            content: ['您可在管理客户下的销售订单，进行收款、发货、开票等操作'],
            bottom: [
              {
                content: '今日新增销售订单',
                value: this.form.currentDayCreatedSalesOrder,
                unit: '个'
              },
              {
                content: '本月累计销售订单',
                value: this.form.currentMonthSalesOrder,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: this.authorities.includes('admin:saleStatistic.agent') ? '/invoicing/sale-agent/static-agency' : '',
            title: '数据洞察',
            content: ['分析各个商品的销售情况']
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
        .get(this.navUrl, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          Object.assign(this.form, data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          this.authorities = data.authorities;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    }
  },
  mounted() {
    this.getNavInfo();
    this.listAuthority();
  }
};
</script>

<style lang="scss">
.order-agent-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .biz-nav-card .nav-card {
    min-height: 37px;
  }
  .biz-nav-card .nav-card {
    min-height: 37px;
  }
  .biz-nav-card-isFourLine .nav-card {
    min-height: 37px;
  }
}
</style>
