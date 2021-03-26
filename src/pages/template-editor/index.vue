<template>
  <el-container class="template-editor">
    <el-header>
      <editor-header v-model="mode" @save="handleSave" @preview="handlePreview"></editor-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <editor-side-bar :list="sideBarList" @btn-click="sideBarClick"></editor-side-bar>
      </el-aside>
      <el-main>
        <editor-main-panel ref="mainPanel" :mode="mode" :pageType="curPageType" :activityType="marketingType"></editor-main-panel>
      </el-main>
      <el-aside width="361px">
        <control-panel></control-panel>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import { EditorHeader, EditorSideBar, EditorMainPanel } from './components';
import styleList from './config.js';
import ControlPanel from './components/control-panel/ControlPanel';
import http from '@/common/http';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'TemplateEditor',
  data () {
    return {
      // 是否已创建模板
      isCreate: false,
      mode: 'vertical',
      marketingType: '0',
      curPageType: '1',
      templateData: {}
    };
  },
  components: {
    EditorHeader,
    EditorSideBar,
    EditorMainPanel,
    ControlPanel
  },
  computed: {
    ...mapGetters('TemplateEditor', ['pageStyle']),
    sideBarList() {
      if (this.marketingType === '0') {
        return [
          { name: '首页', type: '1' },
          { name: '中奖页面', type: '2' },
          { name: '没中奖页', type: '3' },
          { name: '我的奖品', type: 'prize' },
          { name: '分享效果', type: 'share' }
        ];
      }
      return [
        { name: '首页', type: '1' },
        { name: '我的奖品', type: 'prize' },
        { name: '分享效果', type: 'share' }
      ];
    }
  },
  watch: {
    $route(newVal) {
      if (this.$route.query.mode) {
        this.mode = this.$route.query.mode;
      }
    }
  },
  async created() {
    this.mode = this.$route.query.mode || 'vertical';
    if (this.$route.query.activityId) {
      await this.queryActivity();
      this.queryActivityTemplate();
    } else {
      this.queryTemplateData();
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations('TemplateEditor', ['updatePageType', 'updateSelectedType', 'updatePageStyle']),
    sideBarClick(type) {
      this.curPageType = String(type);
      this.updateSelectedType('');
      this.updatePageType(String(type));
    },
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
    queryActivityTemplate() {
      // '0': 抢红包, '1': 摇一摇, '2': 抽奖, '3': 拼团购, '4': N元抢购, '5': 限时秒杀, '6': 帮砍价, '7': TJYL, '8': FXYL, '9': 招募活动, '11': 潜客活动
      const defaultStyleList = [
        'defaultPacketStyle',
        'defaultShakeStyle',
        'defaultLotteryStyle'
      ];
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
    },
    queryTemplateData() {
      // '0': 抢红包, '1': 摇一摇, '2': 抽奖, '3': 拼团购, '4': N元抢购, '5': 限时秒杀, '6': 帮砍价, '7': TJYL, '8': FXYL, '9': 招募活动, '11': 潜客活动
      const defaultStyleList = [
        'defaultPacketStyle',
        'defaultShakeStyle',
        'defaultLotteryStyle'
      ];
      const params = {
        id: this.$route.query.id
      };
      http.get('/admin/activityTemplate/json/query.jhtml', params)
        .then(data => {
          this.marketingType = data.data.marketingType;
          this.templateData = data.data;
          if (!data.data.content) {
            // this.isCreate = true;
            this.updatePageStyle(styleList[defaultStyleList[this.marketingType]]);
          } else {
            // this.isCreate = false;
            this.updatePageStyle(JSON.parse(data.data.content));
          }
        })
        .catch();
    },
    handleModeChange(val) {
      this.mode = val;
    },
    handlePreview() {
      this.$refs.mainPanel.preview();
    },
    async handleSave() {
      let params = null;
      if (this.$route.query.activityId) {
        params = {
          id: this.$route.query.activityId,
          verticalContent: JSON.stringify(this.pageStyle),
          horizontaiContent: JSON.stringify(this.pageStyle),
          shareImage: this.pageStyle.share.img.url,
          shareContent: this.pageStyle.share.txt.content
        };
        await http.put('/admin/marketing/activityStyle.jhtml', params);
        this.queryActivityTemplate();
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        return;
      }
      // /** 模板名称 */
      // private String name;
      // /** 模板内容 */
      // private String content;
      // /** 活动模板类型： 0 营销活动、1 促销活动、2 广告 */
      // private String templateType;
      // /** 活动类型 */
      // private String marketingType;
      // /** 抽奖活动: 0: 圆形；1：方形 */
      // private String shape;
      // /**横版模板**/
      // private String horizontalContent;
      // /**分享效果image**/
      // private String shareImage;
      // /**分享内容**/
      // private String shareContent;
      params = Object.assign({}, this.templateData, {
        content: JSON.stringify(this.pageStyle),
        verticalContent: JSON.stringify(this.pageStyle),
        horizontaiContent: JSON.stringify(this.pageStyle),
        shareImage: this.pageStyle.share.img.url,
        shareContent: this.pageStyle.share.txt.content
      });
      try {
        if (this.isCreate) {
          await http.post('/admin/activityTemplate/json/create.jhtml', params);
        } else {
          await http.put('/admin/activityTemplate/json/update.jhtml', params);
        }
        this.queryTemplateData();
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      } catch (e) {
        this.$message({
          message: e.errorMessage,
          type: 'warning'
        });
        console.log('SAVE_ERR: ', e);
      }
    }
  }
};
</script>

<style lang="scss">
.template-editor {
  height: 100vh;
  .el-header {
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    z-index: 5;
  }
  .el-main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
