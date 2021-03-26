<template>
  <div class="biz-avatar-uploader">
    <el-upload ref="upload" :show-file-list="false" accept="image/*" :class="fileData.type==='0'?'avatar-uploader':''" :style="fileData.type==='0'?avatarStyle:''"
      name="file" :on-success="handleSuccess" action="/admin/file/wechatResource.jhtml" :data="fileData">
      <div style="height: 100%;" v-if="fileData.type==='0'">
        <div v-if="value.path" class="avatar">
          <img :src="value.path">
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon" :style="plusStyle"></i>
        <div v-show="value.path" @click.stop="doThis" class="operate">
          <i @click.stop="zoomIn" class="el-icon-zoom-in"></i>
          <i @click="upload" class="el-icon-plus"></i>
          <i @click="remove" class="el-icon-delete"></i>
        </div>
      </div>
      <!-- <div v-if="fileData.type==='2'" class="avatar">
        <div class="name" :title="name">{{name}}</div>
        <el-button v-show="!name && !value.path" size="small" type="primary">点击上传</el-button>
        <i v-show="value.name || value.path" @click.stop="removeHandler" class="el-icon-delete"></i>
      </div> -->
    </el-upload>
    <el-upload v-if="fileData.type==='2'" class="upload-demo" action="/admin/file/wechatResource.jhtml" :on-success="handleSuccess"
      :limit="1" :data="fileData" :file-list="value.path?[value]:[]" :on-remove="handleRemove">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" v-if="type==='2'">格式支持mp3、amr，文件大小不超过2M，语音时长不超过60s</div>
      <div slot="tip" class="el-upload__tip" v-if="type==='3'">请上传小于10M的视频，支持MP4的视频格式</div>
    </el-upload>
    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="value.path" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BizAvatarUploaderNew',
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      fileData: {
        type: '0',
        subType: ''
      },
      avatar: '',
      name: ''
    };
  },
  props: {
    size: {
      type: Object,
      default: function() {
        return {
          width: 120,
          height: 120
        };
      }
    },
    value: {
      type: Object,
      default: function() {
        return {
          path: '',
          name: ''
        };
      }
    },
    fileType: {
      type: String,
      default: '0'
    },
    type: {
      type: String,
      default: '1'
    }
  },
  computed: {
    plusStyle() {
      return {
        'line-height': this.size.height + 'px'
      };
    },
    avatarStyle() {
      return {
        height: this.size.height + 'px',
        width: this.size.width + 'px'
      };
    }
  },
  created() {
    this.fileData.type = this.fileType;
    this.fileData.subType = this.type;
  },
  mounted() {},
  watch: {
    type(nVal, oVal) {
      if (nVal) {
        this.fileList = [];
        this.fileData.subType = nVal;
      }
    }
  },
  methods: {
    handleSuccess(res) {
      if (res.errorMessage) {
        this.$message.warning(res.errorMessage);
        this.$emit('input', { path: '', name: '' });
      } else {
        this.$emit('input', { path: res.fis[0].url, name: res.fis[0].name });
        this.name = res.fis ? res.fis[0].name : '';
        this.$emit('uploadSuccess');
      }
    },
    zoomIn() {
      this.dialogVisible = true;
    },
    doThis() {},
    upload() {
      this.$refs.upload.$refs['upload-inner'].$refs.input.click();
    },
    remove() {
      this.$emit('input', { path: '', name: '' });
    },
    handleRemove() {
      this.$emit('input', { path: '', name: '' });
    },
    removeHandler() {
      this.$emit('input', { path: '', name: '' });
    }
  }
};
</script>

<style lang="scss">
.biz-avatar-uploader {
  .name {
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
  }
  .upload-demo {
    margin-top: -32px;
  }
  .avatar-uploader {
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
    .el-upload--text {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .operate {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      opacity: 0;
      transition: all 0.3s;
      .el-icon-zoom-in,
      .el-icon-plus {
        margin: 0 5px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        cursor: pointer;
      }
    }
  }
}
.avatar-preview-dialog {
  .review {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
