<template>
 <div class="communi-mgmt-nav">
   <biz-nav-card :cardData="cardData"></biz-nav-card>
 </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import { communiMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'CommuniMgmtNav',
  data () {
    return {
      form: {
        companyCount: '0',
        productCount: '0',
        simCount: '0',
        validCardCount: '0'
      }
    };
  },
  computed: {
    cardData: function () {
      return [
        [{
          link: '/operating/communication-mgmt/operator',
          title: '创建电信运营商',
          content: '平台运营维护电信运营商信息和对接接口',
          bottom: [
            {
              content: '电信运营商数量',
              value: this.form.companyCount,
              unit: '个'
            }
          ]
        }],
        [{
          title: '维护运营商套餐',
          content: '管理充值商品（话费包、流量包），设置商品名称、售价、上下架，进行卡密管理',
          bottom: [
            {
              content: '套餐数量',
              value: this.form.productCount,
              unit: '个'
            }
          ]
        }],
        [{
          title: '维护套餐卡密',
          content: '充值商品进行卡密管理，保证用户正常进行充值',
          bottom: [
            {
              content: '可用卡密数量',
              value: this.form.validCardCount,
              unit: '个'
            }
          ]
        }],
        [{
          link: '/operating/communication-mgmt/card',
          title: '管理通讯卡',
          content: '添加和管理通讯卡，维护卡基本信息，短信提醒余额和流量不足的用户',
          bottom: [
            {
              content: '通讯卡数量',
              value: this.form.simCount,
              unit: '个'
            }
          ]
        }],
        [{
          title: '数据洞察',
          content: '了解通讯卡增长情况、充值业务的收益情况'
        }]
      ];
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      http.get(communiMgmt.Communication_nav, {})
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
.communi-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
