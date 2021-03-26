<template>
  <div class="care-card-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  name: 'ShopMgmtNav',
  data() {
    return {
      authorities: [],
      form: {
        total: '0',
        enable: '0'
      }
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    cardData: function() {
      return [
        [
          {
            link: this.authorities.includes('admin:member.memberCare.category') ? '/member/member-care-mgmt/category' : '',
            title: '创建关怀卡分类',
            content: '创建关怀卡分类，对关怀卡进行分类管理'
          }
        ],
        [
          {
            link: this.authorities.includes('admin:member.memberCare.care') ? '/member/member-care-mgmt/care' : '',
            title: '创建关怀卡',
            content: '创建关怀卡，关怀卡在用户生日、节假日等发放给客户，关怀卡可包含权益、V豆、积分',
            bottom: [
              {
                content: '已有关怀卡',
                value: this.form.total,
                unit: '个'
              },
              {
                content: '其中已启用',
                value: this.form.enable,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            // link: this.authorities.includes('admin:member.statistics') ? '/member/statistics-analysis/member' : '',
            title: '设置关怀卡福利',
            content: '添加会员关怀卡福利，发放给符合要求的会员'
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
        .get(urls.memberCareMgmt.cardKpi, { shopId: ((this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || '') })
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
.care-card-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
