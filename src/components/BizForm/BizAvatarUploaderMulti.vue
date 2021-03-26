<template>
  <div class="biz-avatar-uploader-multi">
    <!-- 多图片上传&预览 -->
    <!-- 仅通过URL预览 -->
    <div class="el-upload-list el-upload-list--picture-card">
      <div tabindex="0" class="el-upload-list__item is-success" v-for="img in value" :key="img.index">
        <img :src="img" alt class="el-upload-list__item-thumbnail" />
        <!---->
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(img)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(img)" v-show="isShowDelete">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <el-upload
        multiple
        ref="upload"
        :show-file-list="false"
        accept="image/*"
        :class="disabled?'avatar-uploader-disabled':'avatar-uploader'"
        :limit="Number(limit)"
        :file-list="fileList"
        :data="fileData"
        :style="avatarStyle"
        :on-success="handleSuccess"
        :on-exceed="handleExceed"
        name="file"
        action="/admin/file/uploads.jhtml"
        :disabled="disabled"
        v-if="showUploader"
      >
        <i class="el-icon-plus avatar-uploader-icon" :style="plusStyle"></i>
      </el-upload>
    </div>

    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <VueCropper :open="open" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccessUpload" :showMode="showMode"></VueCropper>
  </div>
</template>

<script>
import VueCropper from './VueCropper';
export default {
  name: 'ImgUploader',
  props: {
    // value结构: ['/xxxx', '/xxx']
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    imageForm: {
      type: Array,
      default() {
        return [];
      }
    },
    showUploader: {
      type: Boolean,
      default() {
        return true;
      }
    },
    size: {
      type: Object,
      default: function() {
        return {
          width: 100,
          height: 100
        };
      }
    },
    limit: {
      // type: String,
      default: '9'
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isShowDelete: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showMode: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      // 图片预览
      fileData: {
        type: '0'
      },
      open: false,
      picUrl: '',
      // 图片列表
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: ''
    };
  },
  methods: {
    close() {
      this.open = false;
    },
    handleSuccess(url) {
      // let list = this.value.concat(url);
      // this.$emit('input', list);
      this.open = true;
      this.picUrl = url.fis[0].url;
    },
    // 多图片上传预览
    handelSuccessUpload(msg) {
      let list = this.value.concat(msg);
      this.$emit('input', list);
    },
    // 上传超出数量
    handleExceed(files, fileList) {
      // this.$emit('on-exceed', files.length, files.length + fileList.length);
      this.$message.warning(`只能上传${this.limit}张图片`);
    },
    handleRemove(url) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removePic(url);
      });
    },
    removePic(url) {
      let list = this.value;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === url) {
          list.splice(i, 1);
        }
      }
      this.$emit('input', list);
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
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
  watch: {
    value(newVal, oldVal) {
      console.log('value: ', this.value);
      this.fileList = newVal.map(url => {
        return { name: url.split('/')[url.split('/').length - 1], url: url };
      });
    }
  },
  components: {
    VueCropper
  }
};
</script>

<style lang="scss">
.biz-avatar-uploader-multi {
  margin-top: 10px;
  .el-upload-list.el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
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
      display: block;
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
        .el-icon-zoom-in,
        .el-icon-plus {
          cursor: pointer;
        }
      }
    }
  }
  .avatar-uploader-disabled {
    position: relative;
    border: 1px dashed #d9d9d9;
    background: #f5f7fa;
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
      display: block;
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
        .el-icon-zoom-in,
        .el-icon-plus {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
