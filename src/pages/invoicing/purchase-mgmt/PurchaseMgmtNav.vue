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
      navUrl: '/admin/invoicing/purchase/queryPurchaseKpi.jhtml',
      form: {
        currentDayCreatedPurchaseApply: 0,
        currentMonthPurchaseOrder: 0,
        currentMonthPurchaseApply: 0,
        currentDayCreatedPurchaseOrder: 0
      },
      authorities: []
    };
  },
  computed: {
    cardData: function() {
      let arr = [];
      if (this.authorities.includes('admin:purchaseApplication')) {
        arr.push([{
          link: this.authorities.includes('admin:purchaseApplication') ? '/invoicing/purchase-mgmt/purchase-apply' : '',
          title: '创建采购申请单',
          content: ['当发现库存不足需要补货时可提交采购申请单，申请单审核通过后自动产生采购订单。'],
          show: this.authorities.includes('admin:purchaseApplication'),
          bottom: [
            {
              content: '今日新增采购申请单',
              value: this.form.currentDayCreatedPurchaseApply,
              unit: '个'
            },
            {
              content: '本月累计采购申请单',
              value: this.form.currentMonthPurchaseApply,
              unit: '个'
            }
          ]
        }]);
      }
      if (this.authorities.includes('admin:purchaseOrder')) {
        arr.push([{
          link: this.authorities.includes('admin:purchaseOrder') ? '/invoicing/purchase-mgmt/purchase-order-new' : '',
          title: '创建采购订单',
          content: ['当发现库存不足需要补货时可直接创建采购申请单。'],
          show: this.authorities.includes('admin:purchaseOrder'),
          bottom: [
            {
              content: '今日新增采购订单',
              value: this.form.currentDayCreatedPurchaseOrder,
              unit: '个'
            },
            {
              content: '本月累计采购订单',
              value: this.form.currentMonthPurchaseOrder,
              unit: '个'
            }
          ]
        }]);
      }
      if (this.authorities.includes('admin:purchaseStatistic')) {
        arr.push([{
          link: this.authorities.includes('admin:purchaseStatistic') ? '/invoicing/purchase-mgmt/purchase-statistics' : '',
          title: '数据洞察',
          content: ['分析各个商品的采购情况和退货情况'],
          show: this.authorities.includes('admin:purchaseStatistic')
        }]);
      }
      return arr;
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
