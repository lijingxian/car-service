<template>
  <div class="vehicle-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';
import { merchantsMgmt } from '@/common/urls';
export default {
  name: 'VehicleMgmtNav',
  data() {
    return {
      form: {
        total: '0',
        todayAdd: '0',
        untreated: '0',
        info_total: '0',
        info_todayAdd: '0',
        info_untreated: '0'
      }
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: '/operating/merchants-mgmt/investment',
            title: '店铺申请加盟',
            content:
              '有加盟意向的商家可通过发布的招商加盟申请，添加基本的意向信息',
            bottom: [
              {
                content: '招商加盟申请',
                value: this.form.total,
                unit: '个'
              },
              {
                content: '今日新增申请',
                value: this.form.todayAdd,
                unit: '个'
              },
              {
                content: '待处理申请',
                value: this.form.untreated,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/operating/merchants-mgmt/investment',
            title: '审核店铺资质',
            content:
              '加盟申请信息验证真实有效后，且经过沟通用户意向也较为明确的，发送邮件附赠链接，在此链接的基础上提交进一步开店前的资质审核信息。',
            bottom: [
              {
                content: '已提交的资质',
                value: this.form.info_total,
                unit: '个'
              },
              {
                content: '今日提交',
                value: this.form.info_todayAdd,
                unit: '个'
              },
              {
                content: '待处理',
                value: this.form.info_untreated,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/operating/federation-mgmt',
            title: '创建店铺',
            content: '资质审核通过后，直接创建店铺及分配店铺初始账号。'
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
        .get(merchantsMgmt.queryNavigationKpi, {})
        .then(data => {
          Object.assign(this.form, data.data);
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
.vehicle-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
