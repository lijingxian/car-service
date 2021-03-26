<template>
  <div class="purchase-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';

export default {
  name: 'PurchaseMgmtNav',
  data() {
    return {
      navUrl: '/admin/invoicing/purchase/queryStoreSalesManagerKpi.jhtml',
      form: {
        currentDayCreatedSalesOrder: 0,
        currentDayCreatedSalesApply: 0,
        currentMonthSalesOrder: 0,
        currentMonthPurchaseSalesApply: 0
      },
      authorities: []
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: this.authorities.includes('admin:saleApplication') ? '/invoicing/sale/sale-apply' : '',
            title: '管理销售申请',
            content: ['您可以审批客户创建的销售申请，申请通过后方可产生销售订单'],
            bottom: [
              {
                content: '今日新增销售申请单',
                value: this.form.currentDayCreatedSalesApply,
                unit: '个'
              },
              {
                content: '本月累计销售申请单',
                value: this.form.currentMonthPurchaseSalesApply,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: this.authorities.includes('admin:saleOrder') ? '/invoicing/sale/sale-order' : '',
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
            link: this.authorities.includes('admin:saleStatistic') ? '/invoicing/sale/sale-static' : '',
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
.purchase-mgmt-nav {
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
