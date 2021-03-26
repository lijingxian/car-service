<template>
  <div class="template-single-page">
    <component :is="templateType" :type="pageType" :mode="mode" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import http from '@/common/http';
import styleList from './config.js';

export default {
  name: '',
  data () {
    return {
      marketingType: '0',
      templateData: {},
      pageType: '1',
      mode: 'vertical'
    };
  },
  components: {
  },
  computed: {
    templateType() {
      if (this.pageType === 'prize') return () => import('./templates/Prize.vue');
      if (this.pageType === 'share') return () => import('./templates/Share.vue');
      if (!this.marketingType) return '';
      // '0': 抢红包, '1': 摇一摇, '2': 抽奖, '3': 拼团购, '4': N元抢购, '5': 限时秒杀, '6': 帮砍价, '7': TJYL, '8': FXYL, '9': 招募活动, '11': 潜客活动
      const componentPath = {
        '0': 'RedPacket.vue',
        '1': 'Shake.vue',
        '2': 'Lottery.vue'
      };
      const index = () => import('./templates/' + componentPath[this.marketingType]);
      return index;
    }
  },
  watch: {
  },
  async created() {
    this.mode = this.$route.query.mode || 'vertical';
    if (this.$route.query.activityId) {
      await this.queryActivity();
    }
    this.queryTemplateData();
  },
  mounted() {
  },
  methods: {
    ...mapMutations('TemplateEditor', ['updatePageStyle']),
    queryActivity() {
      const params = {
        id: this.$route.query.activityId
      };
      return new Promise((resolve, reject) => {
        http.get('/admin/marketing/activity.jhtml', params)
          .then(data => {
            this.marketingType = data.activity.type;
            resolve();
          })
          .catch(err => {
            console.log('ERR: ', err);
            reject(err);
          });
      });
    },
    queryTemplateData() {
      // '0': 抢红包, '1': 摇一摇, '2': 抽奖, '3': 拼团购, '4': N元抢购, '5': 限时秒杀, '6': 帮砍价, '7': TJYL, '8': FXYL, '9': 招募活动, '11': 潜客活动
      const defaultStyleList = [
        'defaultPacketStyle',
        'defaultShakeStyle',
        'defaultLotteryStyle'
      ];
      if (this.$route.query.activityId) {
        const params = {
          id: this.$route.query.activityId
        };
        http.get('/admin/marketing/activityStyle.jhtml', params)
          .then(data => {
            // verticalContent horizontalContent shareImage shareEffectContent
            this.templateData = data;
            if (!data.verticalContent) {
              this.updatePageStyle(styleList[defaultStyleList[this.marketingType]]);
            } else {
              this.updatePageStyle(JSON.parse(data.verticalContent));
            }
          })
          .catch();
      } else {
        const params = {
          id: this.$route.query.id
        };
        http.get('/admin/activityTemplate/json/query.jhtml', params)
          .then(data => {
            this.marketingType = data.data.marketingType;
            this.templateData = data.data;
            if (!data.data.content) {
              this.isCreate = true;
              this.updatePageStyle(styleList[defaultStyleList[this.marketingType]]);
            } else {
              this.isCreate = false;
              this.updatePageStyle(JSON.parse(data.data.content));
            }
          })
          .catch();
      }
    }
  }
};
</script>

<style lang="scss">
.template-single-page {
  width: 100%;
  height: 100%;
}
</style>
