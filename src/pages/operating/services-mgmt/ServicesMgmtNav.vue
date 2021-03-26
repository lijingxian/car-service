<template>
  <div class="member-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'ServicesMgmtNav',
  data() {
    return {
      navUrl: '/admin/businessProduct/queryNavigationKpi.jhtml',
      form: {
        businessCount: '0',
        specificationCount: '0',
        smsPackageCount: '0',
        businessOrderCount: '0',
        smsOrderCount: '0',
        subscribeCount: '0',
        noSubscribeCount: '0',
        leaveCount: '0',
        serviceIncome: '0'
      }
    };
  },
  computed: {
    cardData: function() {
      if (
        this.getUser().roleLevel === 'platform' ||
        this.getUser().roleLevel === 'company'
      ) {
        return [
          [
            {
              link: '/union/service-mgmt/manage',
              title: '创建平台服务',
              content: '维护平台在售的服务各规格的价格',
              bottom: [
                {
                  content: '已有服务',
                  value: this.form.businessCount,
                  unit: '个'
                }
              ]
            },
            {
              link: '/union/service-mgmt/message-mgmt',
              title: '续增平台短信',
              content:
                '维护平台在售的短信服务可使用短信数',
              bottom: [
                {
                  content: '可使用短信数',
                  value: this.form.smsPackageCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/union/service-mgmt/manage/order',
              title: '查看订单',
              content: '店铺的所有服务订购记录均在此进行管理',
              bottom: [
                {
                  content: '今日新增服务订单',
                  value: this.form.businessOrderCount,
                  unit: '个'
                },
                {
                  content: '今日新增服务收入',
                  value: this.form.serviceIncome,
                  unit: '元'
                }
              ]
            }
          ]
        ];
      } else {
        return [
          [
            {
              link:
                '/union/service-mgmt/subscribe',
              title: '订阅服务',
              content: '您可在此进行平台服务的订阅，订阅后即可使用对应功能。',
              bottom: [
                {
                  content: '已订阅服务',
                  value: this.form.subscribeCount,
                  unit: '个'
                },
                {
                  content: '可订阅服务',
                  value: this.form.noSubscribeCount,
                  unit: '个'
                }
              ]
            },
            {
              link: '/union/service-mgmt/subscribe',
              title: '充值短信',
              content:
                '您可进行短信充值，活动、文章等推广时可采用短信及时通知到会员',
              bottom: [
                {
                  content: '可用短信数量',
                  value: this.form.leaveCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/union/service-mgmt/manage/order',
              title: '查看订单',
              content: '您可查看您的服务订阅记录',
              bottom: []
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
    ...mapGetters(['getUser']),
    getNavInfo() {
      http
        .get(this.navUrl, {})
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
.member-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
