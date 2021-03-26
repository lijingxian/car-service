<template>
  <div class="biz-avatar-uploader">
    <el-upload ref="upload" :show-file-list="false" accept="image/*" :class="fileData.type==='0'?'avatar-uploader':''" :style="fileData.type==='0'?avatarStyle:''"
      name="file" :on-success="handleSuccess" action="/admin/file/wechatResource.jhtml" :data="fileData">
      <div style="height: 100%;" v-if="fileData.type==='0'">
        <div v-if="value" class="avatar">
          <img :src="value">
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon" :style="plusStyle"></i>
        <div v-show="value" @click.stop="doThis" class="operate">
          <i @click.stop="zoomIn" class="el-icon-zoom-in"></i>
          <i @click="upload" class="el-icon-plus"></i>
          <i @click="edit" class="el-icon-edit"></i>
        </div>
      </div>
      <div v-if="fileData.type==='3'" class="avatar">
        <div class="name" :title="name || value.substring(value.lastIndexOf('/') + 1, value.length)">{{name || value.substring(value.lastIndexOf('/') + 1, value.length)}}</div>
        <el-button v-show="!name && !value" size="small" type="primary">点击上传</el-button>
        <!-- <el-button v-show="name || value" size="small" @click.stop="removeHandler" type="primary">删除</el-button> -->
        <i v-show="name || value" @click.stop="removeHandler" class="el-icon-delete"></i>
      </div>
    </el-upload>
    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="value" alt="">
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
      fileData: {
        type: '0',
        subType: '4'
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
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: '0'
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
  },
  methods: {
    handleSuccess(res) {
      this.$emit('input', res.fis[0].url);
      this.name = res.fis ? res.fis[0].name : '';
      this.$emit('uploadSuccess', res.fis[0].url);
    },
    zoomIn() {
      this.dialogVisible = true;
    },
    doThis() {},
    upload() {
      this.$refs.upload.$refs['upload-inner'].$refs.input.click();
    },
    remove() {
      this.$emit('input', '');
    },
    edit() {
      console.log('edit');
      this.$emit('uploadSuccess', this.value);
    },
    removeHandler() {
      this.name = '';
      this.$emit('input', '');
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
