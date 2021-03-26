<template>
  <div class="activity-mgmt-model-mgmt-base-info">
    <biz-save-button :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="form" label-width="100px" size="small" :inline-message="true">
      <el-form-item label="模板名称" prop="title">
        <el-input placeholder="请输入模板名称" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="活动效果图">
      </el-form-item>
      <div class="activity-model-preview">
        <iframe ref="iframe" @load="onLoad" :src="'/#/site/single-page?shopId=10&channel=10&activityId='+form.id+'_memberCareTemplate'"
          frameborder="0" width="375px" height="560px"></iframe>
      </div>
    </el-form>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
export default {
  name: 'ActivityMgmtModelMgmtBaseInfo',
  data() {
    return {
      previewType: 'vertical',
      isCreated: true,
      loading: false,
      templateType: '0',
      form: {
        id: '',
        title: '',
        marketingType: '0',
        shape: '0'
      },
      operations: [
        {
          label: '刷新',
          name: 'reLoad',
          type: 'primary',
          class: 'show'
        },
        {
          label: '编辑',
          name: 'edit',
          type: 'primary',
          class: 'show'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        marketingType: [{ required: true, message: '请输入活动类型', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton },
  created() {},
  computed: {
  },
  methods: {
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
      this.$refs.iframe.src = `/#/template-single-page?id=${this.form.id}&mode=${val}`;
      this.$refs.iframe.contentWindow.location.reload(true);
    },
    reLoad() {
      this.$refs.iframe.contentWindow.location.reload(true);
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
    edit() {
      let link = document.createElement('a');
      link.setAttribute('href', '/#/site/index?activityId=' + this.form.id + '_memberCareTemplate');
      link.target = '_blink';
      let evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true);
      link.dispatchEvent(evt);
    },
    clear() {
      this.isCreated = true;
      this.$refs.form.clearValidate();
      this.form = {
        id: '',
        title: '',
        marketingType: '',
        shape: '0'
      };
    },
    save() {
      this.$refs.form.validate(isValid => {
        if (isValid) {
          if (this.isCreated) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    create() {
      let params = {
        name: this.form.title
      };

      this.loading = true;

      http
        .post('/admin/memberCareTemplate/template.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.$emit('created');
        })
        .catch();
    },
    update() {
      let params = {
        id: this.form.id,
        name: this.form.title
      };

      this.loading = true;
      http
        .put('/admin/memberCareTemplate/template.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.loading = false;
          this.$emit('created');
        })
        .catch();
    },
    refresh(activity) {
      this.$refs.form.clearValidate();
      this.isCreated = false;
      this.form.id = activity.id;
      this.form.title = activity.name;
      console.log(1111);
      this.$refs.iframe.src = '/#/site/single-page?shopId=10&channel=10&activityId=' + this.form.id + '_memberCareTemplate';
      this.$refs.iframe.contentWindow.location.reload(true);
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-model-mgmt-base-info {
  .biz-save-button {
    margin: 10px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .activity-model-preview {
      display: flex;
      flex-direction: column;
      margin-left: 100px;
    }
  }
}
</style>
