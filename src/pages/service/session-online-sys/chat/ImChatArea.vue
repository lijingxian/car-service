<template>
  <div class="im-chat-area">
    <div class="im-edit-toolbar">
      <div class="left">
        <el-popover ref="popover" width="430" placement="top-start" trigger="click">
          <i class="iconfont biz-icon-biaoqing" slot="reference" title="表情"></i>
          <biz-emoji-picker @choosed="chooseEmoji"></biz-emoji-picker>
        </el-popover>
        <i @click="uploadPicture" class="iconfont el-icon-picture" title="图片"></i>
        <i @click="uploadVideo" class="iconfont biz-icon-i-web-sp" title="视频"></i>
        <i @click="sendProduct" class="iconfont biz-icon-shangpin" title="商品"></i>
        <!-- 图片上传组件辅助-->
        <el-upload
          ref="upload"
          :accept="accept"
          class="image-uploader"
          :action="serverUrl"
          :show-file-list="false"
          :name="name"
          :data="fileData0"
          :on-success="uploadSuccess"
        ></el-upload>
      </div>
      <div class="right" v-show="activatedRoom.imType === 'client'">
        <i class="iconfont biz-icon-pingjia" @click="sendEvaluation" title="邀请评价"></i>
        <i class="iconfont biz-icon-jieshu" title="结束会话" @click="endSession"></i>
        <i class="iconfont biz-icon-tag12" @click="rollOut" title="转出"></i>
        <i class="iconfont biz-icon-lahei" @click="defriend" title="拉黑"></i>
      </div>
    </div>
    <el-input type="textarea" :rows="3" ref="elinput" placeholder="请输入内容" :value="activatedRoom.input" @input="typing"></el-input>
    <el-button size="small" type="primary" @click="sendText">发送</el-button>
    <el-dialog class="im-chat-black-dialog" :width="dialogWidth" title="拉黑原因" :visible.sync="dialogBlackVisible">
      <el-form :model="form" ref="blackRule" :rules="rules">
        <el-form-item label prop="reason" label-width="150">
          <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogBlackVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="createBalck">确 定</el-button>
      </div>
    </el-dialog>
    <select-product :visibility.sync="visibility" @select="selectProduct"></select-product>
  </div>
</template>

<script>
import SelectProduct from '../components/SelectPruduct';
import BizEmojiPicker from '@/components/BizEmojiPicker';
import IoService from '@/service/customer-service/session-online/imIoSys';
import csService from '@/service/customer-service/csMgmt';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ImChatArea',
  data() {
    return {
      accept: '',
      visibility: false,
      serverUrl: '/admin/file/uploads.jhtml',
      fileData0: {
        type: '0'
      },
      name: 'file',
      dialogBlackVisible: false,
      dialogWidth: '450px',
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' },
          { max: 120, message: '最多输入120个字', trigger: 'change' }
        ]
      }
    };
  },
  created() {},
  components: { BizEmojiPicker, SelectProduct },
  computed: {
    ...mapGetters('CustomService', ['activatedRoom', 'csData']),
    ...mapGetters(['currentUser'])
  },
  methods: {
    ...mapMutations('CustomService', [
      'updateTabType',
      'updateChatAreaMessage',
      'newMessageToClientList',
      'updateClientSessionState',
      'clearActivateRoomInput'
    ]),
    // 发送文本消息
    sendText() {
      if (this.activatedRoom.input === '') {
        this.$message.warning('不能发空消息');
        return;
      }
      console.log(this.activatedRoom.id);
      IoService.sendMessage({
        to: { id: this.activatedRoom.id },
        from: {
          id: this.currentUser.id, name: this.currentUser.name, head: this.csData.head
        },
        chat_type: 'chat',
        chat_with: 'client',
        payload: {
          body: {
            msg: this.activatedRoom.input, // 消息内容
            type: 'txt' // 文本消息类型
          },
          ext: {}
        }
      });
      this.clearActivateRoomInput();
    },
    uploadPicture() {
      this.accept = 'image/*';
      this.fileData0.type = '0';
      this.$nextTick(() => {
        this.$refs.upload.$refs['upload-inner'].$refs.input.click();
      });
    },
    uploadVideo() {
      this.accept = 'video/*';
      this.fileData0.type = '2';
      this.$nextTick(() => {
        this.$refs.upload.$refs['upload-inner'].$refs.input.click();
      });
    },
    selectProduct(ids) {
      for (const id of ids) {
        IoService.sendMessage({
          msg_id: '',
          timestamp: '', // 消息发送时间
          direction: '',
          to: { id: this.activatedRoom.id },
          from: { id: this.currentUser.id, name: this.currentUser.name, head: this.csData.head },
          chat_type: this.getChatType(),
          chat_with: this.getChatWith(),
          payload: {
            body: {
              id,
              type: 'product'
            },
            ext: {
              shopId: ''
            }
          }
        });
      }
    },
    uploadSuccess(res) {
      IoService.sendMessage({
        msg_id: '',
        timestamp: '', // 消息发送时间
        direction: '',
        to: { id: this.activatedRoom.id },
        from: { id: this.currentUser.id, name: this.currentUser.name, head: this.csData.head },
        chat_type: this.getChatType(),
        chat_with: this.getChatWith(),
        payload: {
          body: {
            url: res.fis[0].url, // 地址
            type: this.fileData0.type === '0' ? 'img' : 'video'
          },
          ext: {
            shopId: ''
          }
        }
      });
    },
    sendProduct() {
      this.visibility = true;
    },
    // 发送评价邀请
    sendEvaluation() {
      IoService.sendEvaluation({
        to: { id: this.activatedRoom.id },
        from: {
          id: this.currentUser.id,
          name: this.currentUser.name,
          head: this.csData.head
        },
        chat_type: this.getChatType(),
        chat_with: this.getChatWith(),
        payload: {
          body: {
            msg: '',
            type: 'evaluation' // 消息类型
          },
          ext: {}
        }
      });
      this.$message.success('评价邀请已发送');
    },
    typing(val) {
      this.updateChatAreaMessage({ input: val });
    },
    getChatWith() {
      switch (this.activatedRoom.imType) {
        case 'cs':
          return 'cs';
        case 'client':
          return 'client';
        case 'clientEnd':
          return 'client';
        case 'group':
          return 'group';

        default:
          break;
      }
    },
    getChatType() {
      switch (this.activatedRoom.imType) {
        case 'cs':
          return 'chat';
        case 'client':
          return 'chat';
        case 'clientEnd':
          return 'chat';
        case 'group':
          return 'groupchat';

        default:
          break;
      }
    },
    chooseEmoji(val) {
      let start = this.$refs.elinput.$refs.textarea.selectionStart;
      let end = this.$refs.elinput.$refs.textarea.selectionEnd;
      this.updateChatAreaMessage({
        input: this.activatedRoom.input.slice(0, start) + val + this.activatedRoom.input.slice(end)
      });

      this.$refs.popover.doClose();
    },
    endSession() {
      this.$confirm('是否确认结束会话?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.newMessageToClientList({
            isReaded: true,
            id: this.activatedRoom.id,
            fromName: '',
            body: {
              msg: '会话已结束，发送消息后重新接入',
              type: 'session_end'
            },
            isMyself: false
          });
          this.updateClientSessionState({
            clientId: this.activatedRoom.id
          });
          IoService.dispatcherSession(this.activatedRoom.id);
        })
        .catch(() => {});
    },
    defriend() {
      // this.$parent.$parent.$refs.rightSidebar.$refs.workSheetBase.defriend({
      //   clientId: this.activatedRoom.id,
      //   name: this.activatedRoom.name
      // });
      // this.$parent.$parent.$refs.rightSidebar.defriend();
      this.dialogBlackVisible = true;
    },
    rollOut() {
      this.updateTabType({ tabType: 'roll-out' });
    },
    createBalck() {
      this.$refs.blackRule.validate(valid => {
        if (valid) {
          csService.createBlack(
            {
              ids: [this.activatedRoom.id],
              remarks: this.form.reason
            },
            data => {
              this.$message({
                type: 'success',
                message: '创建黑名单成功'
              });
              this.dialogBlackVisible = false;
            },
            ErrorData => {
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
              this.dialogBlackVisible = false;
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss">
.im-chat-area {
  width: 438px;
  height: 125px;
  border-top: 1px solid #e2e2e2;
  position: relative;
  > .im-edit-toolbar {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      margin: 0 10px;
      color: #c2c2c2;
      font-size: 20px;
      cursor: pointer;
      border: #fff solid 1px;
      &:hover {
        color: #ff7300;
      }
      &.biz-icon-i-web-sp {
        font-size: 18px;
      }
      &.biz-icon-shangpin {
        font-size: 22px;
      }
    }
    .image-uploader {
      display: none;
    }
  }
  > .el-textarea {
    .el-textarea__inner {
      resize: none;
      border-radius: 0;
      border-width: 0;
      padding-right: 100px;
    }
  }
  > .el-button {
    position: absolute;
    right: 10px;
    top: 85px;
  }
  > .el-dropdown {
    position: absolute;
    right: 10px;
    top: 85px;
  }
}

.im-chat-black-dialog {
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
