<template>
  <biz-grid class="market-activity-activity-notice">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :model="formModel" :rules="rules" size="small" label-width="110px" v-loading="loading">
      <el-form-item label="通知方式" class="is-required" prop="noticeMethod">
        <div class="notify-type">
          <div class="item">
            <el-checkbox v-model="formModel.isAppNotice" true-label="1" false-label="0">App消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isAppNotice === '1'">
              <el-input v-model="formModel.appMsgContent" placeholder="请输入通知内容，不超过100字符" type="textarea" :rows="3" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="formModel.isWechatNotice" true-label="1" false-label="0">微信消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isWechatNotice === '1'">
              <el-input type="textarea" v-model="formModel.wechatMsgTitle" :rows="3" :maxlength="100" placeholder="请输入通知内容，不超过100字符"></el-input>
              <div>活动主题：
                <span class="custom-c">{{ formModel.wechatMsgSubject }}</span>
              </div>
              <div>通知时间：
                <span class="custom-c">{{formModel.wechatMsgTime}}</span>
              </div>
              <el-input type="textarea" v-model="formModel.wechatMsgContent" placeholder="请输入通知内容，不超过100字符" :rows="3" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="formModel.isSmsNotice" true-label="1" false-label="0">短信消息</el-checkbox>
            <div class="preview-content" v-show="formModel.isSmsNotice === '1'">
              {{ formModel.smsMsgContent }}
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

const getFormModel = () => {
  return {
    isAppNotice: '0',
    isWechatNotice: '0',
    isSmsNotice: '0',
    appMsgContent: '',
    wechatMsgContent: '',
    wechatMsgSubject: '',
    wechatMsgTime: '',
    wechatMsgTitle: '',
    smsMsgContent: ''
  };
};

export default {
  name: 'CareCardNotice',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      loading: false,
      activity: {},
      formModel: getFormModel(),
      originForm: {},
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:member.memberCare.care.edit']
        }
      ],
      rules: {
        noticeMethod: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateMethod
          }
        ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    itemId(newVal, oldVal) {
      if (newVal.id) {
        this.refresh();
      }
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    validateMethod(rules, value, callback) {
      const { formModel } = this;
      const { isAppNotice, appMsgContent, isWechatNotice, wechatMsgTitle, wechatMsgContent, isSmsNotice } = formModel;
      if (!Number(isWechatNotice + isAppNotice + isSmsNotice)) return callback(new Error('请选择通知方式'));
      if (Number(isAppNotice) && (!appMsgContent)) return callback(new Error('请填写APP消息内容'));
      if (Number(isWechatNotice) && (!wechatMsgTitle || !wechatMsgContent)) return callback(new Error('请填写微信消息内容'));
      callback();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        const { isAppNotice, appMsgContent, isWechatNotice, wechatMsgTitle, wechatMsgContent, isSmsNotice } = this.formModel;
        const params = {
          memberCareId: this.itemId.id,
          isAppNotice,
          isWechatNotice,
          isSmsNotice,
          appMsgContent,
          wechatMsgTitle,
          wechatMsgContent
        };
        if (isAppNotice === '0') {
          Object.assign(params, { appMsgContent: this.originForm.appMsgContent });
        }
        if (isWechatNotice === '0') {
          Object.assign(params, { wechatMsgTitle: this.originForm.wechatMsgTitle, wechatMsgContent: this.originForm.wechatMsgContent });
        }
        http.put(urls.memberCareMgmt.careNotice, params)
          .then(data => {
            this.$message.success('更新成功');
          })
          .catch(err => {
            this.$message.warning(err.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    refresh() {
      if (!this.itemId.id) return;
      const params = {
        memberCareId: this.itemId.id
      };
      this.loading = true;
      http.get(urls.memberCareMgmt.careNotice, params)
        .then(data => {
          this.formModel = Object.assign({}, data.data);
          this.originForm = Object.assign({}, data.data);
        })
        .catch()
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.promotion-dialog {
  width: 800px;
  height: 80%;
  padding: 20px;
  .biz-grid {
    top: 45px;
    height: 85%;
  }
  > .el-dialog__body {
    width: 100%;
    height: 98%;
    position: relative;
    flex-grow: 1;
    padding: 0;
  }
  .container {
    padding: 20px;
    margin: 20px;
    width: 100%;
    height: 100%;
  }
  .el-dialog__header {
    text-align: center;
  }
  .el-pagination {
    margin: 10px 0;
  }
  .dialog-footer {
    display: none;
  }
}
.rank-dialog {
  .content {
    min-height: 300px;
    height: 500px;
    overflow-y: auto;
    .vip-name {
      margin: 10px 0;
    }
    .vip-container {
      display: flex;
      flex-wrap: wrap;
      .vip {
        min-width: 110px;
        padding: 0 20px;
      }
    }
  }
  .el-dialog__footer {
    text-align: right;
  }
}
.notice-dialog-selector {
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
.market-activity-activity-notice {
  .biz-save-button {
    margin-top: 10px;
    float: left;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 10px;
    .el-radio + .el-radio {
      // margin-left: 15px;
    }
    .preview-content {
      background-color: #f5f7fa;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 5px;
      line-height: 1.5;
      color: #c0c4cc;
      .custom-c {
        color: #606266;
      }
    }
    .nick-name-container {
      max-height: 60px;
      overflow: hidden;
      .nick-name-title {
        float: left;
        width: 100px;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .color {
      color: #ff7300;
      cursor: pointer;
    }
    .nick-name-container-show {
      .nick-name-title {
        float: left;
        width: 100px;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .btn-style {
      margin-right: 10px;
    }
  }
}
</style>
