<template>
  <biz-grid class="activity-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="activity" label-width="110px" size="small" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="活动名称" prop="title">
        <el-input placeholder="请输入活动名称" maxlength="15" v-model="activity.title"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginDate">
        <el-date-picker v-model="activity.beginDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker v-model="activity.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动打赏">
        <el-radio v-model="activity.rewardSwitchs" label="1">是</el-radio>
        <el-radio v-model="activity.rewardSwitchs" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="活动状态" prop="state">
        <el-select v-model="activity.state" @change="stateChange">
          <el-option :label="status.label" :value="status.value" :key="index" :disabled="status.disabled" v-for="(status,index) of activitiStatus"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否计入潜客">
        <el-radio v-model="activity.isCreatPConsumer" label="1">是</el-radio>
        <el-radio v-model="activity.isCreatPConsumer" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="活动说明">
      </el-form-item>
      <div class="e-wrapper">
        <biz-editor ref="editor" height="400px" width="430px" v-model="activity.content"></biz-editor>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor } from '@/components/BizEditorH';
import phoneB from '@/assets/images/iphone-b.png';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
export default {
  name: 'ActivityBaseInfo',
  data() {
    return {
      background: 'url(' + phoneB + ') no-repeat no-repeat',
      isCreated: true,
      loading: false,
      isFee: '0',
      size: {
        width: 120,
        height: 60
      },
      activity: {
        id: '',
        title: '',
        typeStr: '0',
        images: [],
        beginDate: '',
        endDate: '',
        // 是否计入潜客
        isCreatPConsumer: '0',
        rewardSwitchs: '0',
        state: '3',
        content: '<img src="/resources/admin/images/default/xxhd.jpg"><br><p>只要你来，我就有奖 ~ 丰富多彩的互动小游戏等你参与，奖品多多哦！</p>',
        shop: {
          id: '',
          name: '',
          address: ''
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          disabled: false,
          type: 'primary'
        }
      ],
      activitiStatus: [
        {
          label: '已发布',
          value: '0',
          disabled: false
        },
        {
          label: '进行中',
          value: '1',
          disabled: true
        },
        {
          label: '已结束',
          value: '2',
          disabled: true
        },
        {
          label: '已创建',
          value: '3',
          disabled: false
        },
        { label: '已提交', value: '4', disabled: true },
        { label: '已取消', value: '5', disabled: true }
      ],
      rules: {
        title: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }
        ],
        beginDate: [
          {
            required: true,
            message: '请输入开始时间',
            trigger: 'blur'
          }
        ],
        endDate: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ],
        state: [
          {
            required: true,
            message: '请选择活动状态',
            trigger: 'blur'
          }
        ]
      },
      defaultImages: {
        xxhd: '/resources/admin/images/default/xxhd.jpg'
      }
    };
  },
  props: {
    defaultShop: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          address: ''
        };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    itemId: {
      type: String
    }
  },
  components: {
    BizSaveButton,
    BizGrid,
    BizEditor
  },
  created() {},
  mounted() {},
  computed: {
    activityUrl() {
      return window.location.origin + '/resources/admin/ecStatic/index.html#/' + this.getUrl() + '/' + this.activity.id;
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.$el.scrollTop = 0;
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.refresh(nVal);
        }
      } else {
        if (nVal !== oVal) {
          this.activity = this.clear();
        }
      }
    }
  },
  methods: {
    stateChange() {
      this.$refs.form.clearValidate('state');
    },
    // 正则筛选富文本中的图片
    getImgs(content) {
      let tmp = [];
      let reg = new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/, 'g');
      let flag = true;
      while (flag) {
        flag = reg.exec(content);
        if (flag) {
          tmp.push(flag[1]);
        }
      }
      return tmp;
    },
    getUrl() {
      let url = this.urlArray[this.activity.typeStr];
      if (Array.isArray(url)) {
        if (this.activity.shape === '0') {
          // 原形
          return url[0];
        }
        return url[1];
      }
      return url;
    },
    operate(name) {
      this[name]();
    },
    clear() {
      this.$refs.form.clearValidate();
      return {
        id: '',
        title: '',
        typeStr: '0',
        beginDate: '',
        endDate: '',
        images: [],
        // 是否计入潜客
        isCreatPConsumer: '0',
        rewardSwitchs: '0',
        state: '3',
        content: `<img src="${
          this.defaultImages.xxhd
        }"><br><p>只要你来，我就有奖 ~ 丰富多彩的互动小游戏等你参与，奖品多多哦！</p>`,
        shop: {
          id: '',
          name: '',
          address: ''
        }
      };
    },
    save() {
      if (this.activity.endDate < this.activity.beginDate) {
        this.$message.warning('活动开始时间不能晚于结束时间');
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.activity.images = this.getImgs(this.activity.content);
          if (!this.itemId) {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    create() {
      this.loading = true;
      http
        .post(activityMgmt.CreateLocalActivity, this.activity)
        .then(data => {
          this.$message.success('创建成功');
          this.$emit('created', data.id);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      // let params = Object.assign(this.clear(), this.activity);
      // if (this.activity.state === '1') {
      //   params.state = '0';
      // }
      http
        .put(activityMgmt.QueryBasicInfo, this.activity)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('base-info-updated');
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    preview() {
      this.previewDialogOpen = true;
    },
    refresh(id) {
      http
        .get(activityMgmt.QueryBasicInfo, { id: id })
        .then(data => {
          this.activity = Object.assign(this.clear(), data.data);
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    copy(id) {
      http
        .get(activityMgmt.QueryBasicInfo, { id: id })
        .then(data => {
          this.activity = Object.assign(this.clear(), data.data);
          this.activity.id = '';
          this.activity.beginDate = '';
          this.activity.endDate = '';
          this.activity.state = '3';
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    getState(row) {
      switch (row.state) {
        case '0':
          return '未开始';
        case '1':
          return '进行中';
        case '2':
          return '已结束';
        case '3':
          return '已创建';
        case '4':
          return '已提交';
        case '5':
          return '已取消';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss">
.selectClass {
  z-index: 1999 !important;
}
.activity-base-info {
  .biz-save-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .isScan {
      line-height: 64px;
      height: 64px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .vip-level {
      .vip-container {
        display: flex;
        flex-wrap: wrap;
        .vip {
          min-width: 110px;
        }
      }
    }
    .e-wrapper {
      margin-left: 10px;
    }
  }
}

.marketing-preview {
  .el-dialog__body {
    padding: 10px 0;
    border-radius: 10px;
  }
  .bg {
    margin: 0 auto;
    position: relative;
    width: 390px;
    height: 653px;
    .cpreview {
      overflow: auto;
      position: absolute;
      padding: 10px;
      width: 354px;
      height: 500px;
      top: 76px;
      left: 18px;
      outline: none;
      background-color: #fff;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #c2c2c2;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
      }
    }
  }
}

.activity-base-info-choose-activity {
  > .el-dialog {
    width: 840px;
  }
  .el-dialog__body {
    padding-top: 10px;
    .el-button {
      margin-bottom: 5px;
    }
  }
}
</style>
