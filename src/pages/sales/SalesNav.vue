<template>
  <div class="sales-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';

export default {
  name: 'SalesMgmtNav',
  data() {
    return {
      navUrl: '/admin/customer/queryDayKpi.jhtml',
      form: {
        dayCount: '0',
        failureCount: '0',
        intentionCount: '0',
        lastFailedStatistical: '',
        lastReviewStatistical: '',
        planCount: '0',
        signedCount: '0',
        totalCount: '0'
      }
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: '/sales/finance/plan',
            title: '创建金融方案',
            content: '创建/编辑贷款购车金融方案',
            bottom: [
              {
                content: '已有金融方案',
                value: this.form.planCount,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/sales/potential',
            title: '潜客管理',
            content: '创建并维护潜客档案，包括购买意向、回访记录、体验记录以及签约/战败情况，流程化、规范化潜客管理',
            bottom: [
              {
                content: '累计潜客记录',
                value: this.form.totalCount,
                unit: '条'
              },
              {
                content: '今日新增潜客',
                value: this.form.dayCount,
                unit: '人'
              },
              {
                content: '今日意向客户',
                value: this.form.intentionCount,
                unit: '人'
              },
              {
                content: '今日签约',
                value: this.form.signedCount,
                unit: '人'
              },
              {
                content: '今日战败',
                value: this.form.failureCount,
                unit: '人'
              }
            ]
          }
        ],
        [
          {
            link: '/sales/statistics-analysis/general',
            title: '数据洞察',
            content: '战败客户统计，定期分析战败原因，提高成交率；客户回访统计，抓好回访率，客户不流失。'
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
        .get(this.navUrl, { shopId: window.top.SHOP_ID || '', viewMode: 'merge' })
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
.sales-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
