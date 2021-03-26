<template>
  <div class="finacial-company-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';

export default {
  name: 'FinancialCompanyNav',
  data() {
    return {
      navUrl: '/admin/customer/queryDayKpi.jhtml',
      form: {
        companyCount: '0'
      }
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: '/sales/finance/plan',
            title: '创建产品分类',
            content: '创建/编辑/配置金融机构',
            bottom: [
              {
                content: '已有产品分类',
                value: this.form.companyCount,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/sales/finance/plan',
            title: '创建金融方案',
            content: '创建/编辑/配置金融方案',
            bottom: [
              {
                content: '已有金融方案',
                value: this.form.companyCount,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/sales/finance/plan',
            title: '创建保险方案',
            content: '创建/编辑/配置保险方案',
            bottom: [
              {
                content: '已有保险方案',
                value: this.form.companyCount,
                unit: '个'
              }
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
        .get(this.navUrl, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          Object.assign(this.form, data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.finacial-company-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
