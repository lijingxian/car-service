<template>
  <div class="smart-to-shop-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import { customerService } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'SmartToShopNav',
  data() {
    return {
      form: {
        accessCount: '0',
        lastTime: '2018-06-29 09:41:30',
        memberCount: '0',
        memberReceptionCount: '0',
        money: '0.00',
        rate: '0%',
        receptionCount: '0',
        resultCode: '100',
        templateCount: '0',
        totalCount: '0'
      }
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: '/service/smart-to-shop/reception-mgmt?showTemplate=true',
            // tree: ['serviceManageContent', 'smartToShop', 'opratemanage'],
            title: '消息模板设置',
            content:
              '您可以更改店端车牌识别终端语音播报及文字显示消息模板，让贵店的到店提醒更个性化',
            bottom: [
              {
                content: '消息模板',
                value: this.form.templateCount,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: '/service/smart-to-shop/reception-mgmt',
            // tree: ['staffContent', 'staff', 'roleManage'],
            title: '接待管理',
            content:
              '您可以编辑接待信息等；选中自动离店，则客户离店时自动开闸。',
            bottom: [
              {
                content: '今日到店',
                value: this.form.accessCount,
                unit: '人'
              },
              {
                content: '其中会员',
                value: this.form.memberCount,
                unit: '人'
              },
              {
                content: '已接待',
                value: this.form.memberReceptionCount,
                unit: '人'
              },
              {
                content: '累计消费',
                value: this.form.money,
                unit: '元'
              }
            ]
          }
        ],
        // ifShowFence = 1
        [
          {
            link: '/service/smart-to-shop/reception-mgmt?showDialog=true',
            // tree: ['staffContent', 'staff', 'roleManage'],
            title: '道闸控制',
            content:
              '您可以手动控制道闸开启：点击某个道闸按钮即可手动开启道闸。'
          }
        ],
        [
          {
            link: '/service/statistics-analysis/generalViewAnalysis',
            // tree: ['staffContent', 'staff', 'roleManage'],
            title: '到店统计',
            content: '查看近期到店情况，可生成报表或进行图表分析',
            bottom: [
              {
                content: '上次统计时间',
                value: this.form.lastTime
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
        .get(customerService.SmartToShop.nav, {
          shopId: window.top.SHOP_ID || ''
        })
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
.smart-to-shop-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
