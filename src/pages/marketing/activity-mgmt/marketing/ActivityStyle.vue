<template>
  <biz-grid class="activity-style">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <div class="site-preview">
      <el-radio-group :value="previewType" size="mini" @input="modeChange">
        <el-radio-button label="vertical">纵版</el-radio-button>
        <el-radio-button label="horizontal">横版</el-radio-button>
      </el-radio-group>
      <div class="page">
        <iframe ref="iframe" @load="onLoad" :src="src" frameborder="0" v-show="hasContent" width="375px" height="560px"></iframe>
        <div v-if="!hasContent" :style="styleObjectContent"></div>
      </div>
    </div>
    <el-dialog append-to-body :visible.sync="dialogVisible" width="80%" custom-class="content-site">
      <div class="layout">
        <div v-for="activityModel in activityModelList" :key="activityModel.index" class="content">
          <div class="button-class">
            <el-button type="primary" size="mini" @click="use(activityModel)">使用</el-button>
          </div>
          <iframe ref="iframeModel" @load="onLoadModel"
            :src="'/#/template-single-page?id='+activityModel.id" frameborder="0"
            width="375px" height="560px"></iframe>
        </div>
        <div v-if="activityModelList.length === 0" :style="styleObject"></div>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NoContent from '@/assets/images/emptyGray.png';
import http from '@/common/http';
import urls from '@/common/urls';
export default {
  name: 'ContentSite',
  data() {
    return {
      previewType: 'vertical',
      activityId: '',
      activityModelList: [],
      dialogVisible: false,
      hasContent: true,
      operations: [
        {
          label: '刷新',
          name: 'reLoad',
          type: 'primary',
          auth: ['admin:activity.edit']
        },
        {
          label: '编辑',
          name: 'edit',
          type: 'primary',
          auth: ['admin:activity.edit']
        },
        {
          label: '从平台选择',
          name: 'select',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ]
    };
  },
  props: {
    activity: {
      type: Object,
      default() {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  computed: {
    ...mapGetters('Site', ['bricks']),
    src() {
      return (
        '/#/template-single-page?activityId=' +
        this.activityId +
        '&mode=' +
        this.previewType
      );
    },
    styleObject() {
      return {
        height: '50vh',
        width: '60vh',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    },
    styleObjectContent() {
      return {
        height: '100%',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  created() {},
  components: {
    BizSaveButton,
    BizGrid
  },
  methods: {
    ...mapMutations('Site', ['updateActivityId']),
    ...mapMutations('Site', ['updateActivityModelId']),
    ...mapActions('Site', ['setTemplateToContent']),
    operate(name) {
      this[name]();
    },
    modeChange(val) {
      this.previewType = val;
      if (val === 'horizontal') {
        this.$refs.iframe.height = '207px';
      } else {
        this.$refs.iframe.height = '560px';
      }
      setTimeout(() => {
        this.$refs.iframe.contentWindow.location.reload(true);
      }, 200);
    },
    isHasContent() {
      http
        .get(urls.activityMgmt.SiteContent, { id: this.activityId })
        .then(data => {
          this.hasContent = !!data.data.content;
        })
        .catch(error => {
          console.error(error);
        });
    },
    onLoadModel() {
      setTimeout(() => {
        this.$refs.iframeModel.contentWindow.document.documentElement.style.fontSize = '37.5px';
      }, 200);
    },
    onLoad() {
      setTimeout(() => {
        if (this.previewType === 'horizontal') {
          this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '13px';
        } else {
          this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '37.5px';
        }
      }, 200);
    },
    async use(activityModel) {
      const res = await http.get('/admin/activityTemplate/json/query.jhtml', { id: activityModel.id });
      const params = {
        id: this.activityId,
        verticalContent: res.data.content,
        horizontaiContent: res.data.content,
        shareImage: res.data.shareImage,
        shareContent: res.data.shareContent
      };
      await http.put('/admin/marketing/activityStyle.jhtml', params);
      this.reLoad();
      this.dialogVisible = false;
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    },
    edit() {
      let link = document.createElement('a');
      link.setAttribute('href', '/#/template-editor?activityId=' + this.activityId);
      link.target = '_blink';
      let evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true);
      link.dispatchEvent(evt);
    },
    select() {
      let params = {
        marketingType: this.activity.type,
        pageNumber: 1,
        pageSize: 1000
      };

      http.get('/admin/activityTemplate/json/list.jhtml', params)
        .then(data => {
          this.activityModelList = data.content;
          this.dialogVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    refresh(activity) {
      this.activityId = activity.id;
      this.isHasContent();
    },
    reLoad() {
      this.$refs.iframe.contentWindow.location.reload(true);
    }
  }
};
</script>

<style lang="scss">
.activity-style {
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .layout {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .content {
      position: relative;
      .button-class {
        position: absolute;
        top: 50%;
        left: 155px;
      }
    }
  }
  .site-preview {
    margin-left: 50px;
    width: 375px;
  }
}
</style>
