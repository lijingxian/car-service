<template>
 <div class="shop-rate-nav">
   <biz-nav-card :cardData="cardData"></biz-nav-card>
 </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/shop-rate/shopRateNav';

export default {
  name: 'ShopRateNav',
  data () {
    return {
      gradeCount: '0',
      indicatorCount: '0',
      promiseCount: '0',
      storeCount: '0',
      updateTime: ''
    };
  },
  computed: {
    cardData: function () {
      return [
        [{
          link: '/union/product-settings/shop-rate/ability',
          title: '创建能力评价体系',
          content: '若您已创建了联盟，您可设置能力评价体系对店铺进行分值评定',
          bottom: [
            {
              content: '已有评价指标',
              value: this.indicatorCount,
              unit: '个'
            },
            {
              content: '已有等级',
              value: this.gradeCount,
              unit: '个'
            }
          ]
        }],
        [{
          link: '/union/product-settings/shop-rate/promise',
          title: '创建承诺评价体系',
          content: '若您已创建联盟，您可设置承诺评价体系，为联盟内店铺提供信用背书。',
          bottom: [
            {
              content: '已有承诺',
              value: this.promiseCount,
              unit: '个'
            }
          ]
        }],
        [{
          link: '/union/product-settings/shop-rate/recommend',
          title: '设置店铺推荐规则',
          content: '您可设置店铺推荐规则，符合规则的店铺将在身边店功能中优先展示。',
          bottom: [
            {
              content: '规则更新时间',
              value: this.updateTime,
              unit: ''
            }
          ]
        }]
      ];
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      service.query(
        params,
        data => {
          this.gradeCount = data.data.gradeCount;
          this.indicatorCount = data.data.indicatorCount;
          this.promiseCount = data.data.promiseCount;
          this.storeCount = data.data.storeCount;
          this.updateTime = data.data.updateTime;
        },
        ErrorData => {
          console.log('ERR_GET_INFO: ', ErrorData);
        }
      );
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.shop-rate-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
