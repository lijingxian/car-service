<template>
  <div class="logistics-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';
import { orderMgmt } from '@/common/urls';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { mapGetters } from 'vuex';

export default {
  name: 'LogisticsMgmtNav',
  data() {
    return {
      // 已有物流公司
      deliveryCorp_shop: 0,
      // 累计发货记录
      monthShippingCount: 0,
      // 新增发货记录
      dayShippingCount: 0,
      deliveryCorp_platform: 0,
      authorities: []
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    cardData: function() {
      if (this.getUser.roleLevel !== 'shop') {
        return [
          [
            {
              link: this.authorities.includes('admin:deliveryCorp') ? '/order/logistics_new/delivery' : '',
              title: '维护物流公司',
              content: ['此处管理物流公司的信息，您可设置平台支持的物流公司'],
              bottom: [{ content: '已有物流公司', value: this.deliveryCorp_platform, unit: '个' }]
            }
          ]
        ];
      } else {
        return [
          [
            {
              link: this.authorities.includes('admin:deliveryCorp.shop') ? '/order/logistics_new/delivery_shop' : '',
              title: '维护物流公司',
              content: ['此处管理物流公司的信息，您可设置店铺常用的物流公司'],
              bottom: [{ content: '已有物流公司', value: this.deliveryCorp_shop, unit: '个' }]
            }
          ],
          [
            {
              link: this.authorities.includes('admin:shipping') ? '/order/logistics_new/shipping' : '',
              title: '查看发货记录',
              content: ['此处查看您的发货记录，您可在此打印快递单'],
              bottom: [
                { content: '今日新增发货记录', value: this.dayShippingCount, unit: '个' },
                { content: '本月累计发货记录', value: this.monthShippingCount, unit: '个' }
              ]
            }
          ]
        ];
      }
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
          // 物流公司数量
          this.deliveryCorp_platform = data.data.deliveryCorp;
          // 今日发货
          this.dayShippingCount = data.data.dayShippingCount;
          // 本月发货
          this.monthShippingCount = data.data.monthShippingCount;
        })
        .catch();
    },
    getLogisticsInfo() {
      http
        .get('/admin/shop_delivery_corp/json/count.jhtml', {})
        .then(data => {
          // 物流公司数量
          this.deliveryCorp_shop = data.deliverCorpCount;
        })
        .catch();
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
    this.listAuthority();
    this.getNavInfo();
    this.getLogisticsInfo();
  }
};
</script>

<style lang="scss">
.logistics-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
