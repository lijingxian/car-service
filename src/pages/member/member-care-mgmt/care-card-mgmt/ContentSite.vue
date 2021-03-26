<template>
  <biz-grid class="content-site">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <div class="site-preview">
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
            :src="'/#/site/single-page?shopId=10&channel=10&activityId='+activityModel.id+'_memberCareTemp'" frameborder="0"
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
// import urls from '@/common/urls';
export default {
  name: 'ContentSite',
  data() {
    return {
      activity: {},
      activityId: '',
      activityModelList: [],
      dialogVisible: false,
      hasContent: true,
      operations: [
        {
          label: '刷新',
          name: 'reLoad',
          type: 'primary'
        },
        {
          label: '编辑',
          name: 'edit',
          type: 'primary'
        },
        {
          label: '使用模板',
          name: 'select',
          type: 'primary'
        }
      ]
    };
  },
  props: {
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
        'http://' +
        window.location.host +
        '/#/site/single-page?shopId=10&channel=10&activityId=' +
        this.activityId + '_memberCare'
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
    isHasContent() {
      http
        .get('/admin/memberCare/manage/memberCare.jhtml', { id: this.activityId })
        .then(data => {
          this.hasContent = !!data.data.content;
          if (!data.data.content) {
            this.setDefault();
          }
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
        this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '37.5px';
      }, 200);
    },
    use(activityModel) {
      this.updateActivityModelId(activityModel.id);
      this.updateActivityId(this.activityId);
      this.setTemplateToContent(() => {
        this.$message({
          customClass: 'site-form-message',
          message: '保存成功',
          type: 'success',
          center: true
        });
        this.hasContent = true;
      });
    },
    edit() {
      let link = document.createElement('a');
      link.setAttribute('href', '/#/site/index?activityId=' + this.activityId + '_memberCare');
      link.target = '_blink';
      let evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true);
      link.dispatchEvent(evt);
    },
    select() {
      let params = {
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/memberCareTemplate/list.jhtml', params)
        .then(data => {
          this.activityModelList = data.dataList;
          this.dialogVisible = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    setDefault() {
      let params = {
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/memberCareTemplate/list.jhtml', params)
        .then(data => {
          this.activityModelList = data.dataList;
          this.activityModelList.length > 0 && this.use(this.activityModelList[0].id);
        })
        .catch(error => {
          console.error(error);
        });
    },
    refresh(activity) {
      this.activityId = activity.id;
      this.isHasContent();
    },
    reLoad() {
      http
        .get('/admin/memberCare/manage/memberCare.jhtml', { id: this.activityId })
        .then(data => {
          if (data.data.content) {
            this.$refs.iframe.contentWindow.location.reload(true);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style lang="scss">
.content-site {
  .biz-save-button {
    margin-top: 10px;
    float: left;
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
    height: 667px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: 1px solid #eee;
    .page {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      scrollbar-width: none;
      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
