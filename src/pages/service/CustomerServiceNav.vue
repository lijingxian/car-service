<template>
  <div class="customer-service-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/customer-service/workSheetMgmt.js';
import { mapGetters } from 'vuex';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      waitWorkSheets: 0,
      replies: 0,
      dayWaitCustoms: 0,
      dayEndSessions: 0,
      knowledges: 0
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    cardData: function() {
      return [
        [
          {
            link: this.currentAuth.indexOf('admin:autoReply') !== -1 ? '/service/robot/reply' : '',
            title: '设置自动回复',
            content: '设置问题库，智能答疑，提高工作效率',
            bottom: [
              {
                content: '当前已设置自动回复',
                link: this.currentAuth.indexOf('admin:autoReply') !== -1 ? '/service/robot/reply' : '',
                value: this.replies,
                unit: '条'
              },
              {
                content: '已创建问题知识库',
                link: this.currentAuth.indexOf('admin:autoReply') !== -1 ? '/service/robot/konwledge-base' : '',
                value: this.knowledges,
                unit: '条'
              }
            ]
          }
        ],
        [
          {
            link: this.currentAuth.indexOf('admin:onlineReply') !== -1 ? '/service/service-mgmt/online-response' : '',
            title: '在线应答',
            content:
              '在线答复客户问题，帮助客户解决问题；客服人员、排班管理、质检管理等',
            bottom: [
              {
                content: '今日待接入客户数',
                value: this.dayWaitCustoms,
                unit: '人'
              },
              {
                content: '今日会话结束',
                value: this.dayEndSessions,
                unit: '人'
              }
            ]
          }
        ],
        [
          {
            link: this.currentAuth.indexOf('admin:workRecord') !== -1 ? '/service/worksheet/worksheet-mgmt' : '',
            title: '处理客服工单',
            content: '创建、处理工单，如需他人处理，可转交；完成后查看用户评价',
            bottom: [
              {
                content: '待处理工单数',
                value: this.waitWorkSheets,
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
      let params = {
        params: ''
      };
      service.getNavInfo(params, data => {
        Object.assign(this.$data, data.data);
      });
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.customer-service-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
