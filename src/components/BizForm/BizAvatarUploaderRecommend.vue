<template>
  <div class="biz-avatar-uploader-recommend">
    <!-- 多图片上传&预览 -->
    <!-- 仅通过URL预览 -->
    <div class="el-upload-list el-upload-list--picture-card">
      <div tabindex="0" class="el-upload-list__item is-success" v-for="(img,index) in value" :key="index">
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
        :before-upload="beforeAvatarUpload"
        @handleImageHL="handleImageHL"
        @handleImageBDL="handleImageBDL"
        @handleImageBDS="handleImageBDS"
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
  components: {
    VueCropper
  },
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
    handleSuccess(msg) {
      let list = this.value.concat(msg.fis[0].url);
      this.$emit('input', list);
    },
    // handleSuccess(url) {
    //   // let list = this.value.concat(url);
    //   // this.$emit('input', list);
    //   this.open = true;
    //   this.picUrl = url.fis[0].url;
    // },
    // 多图片上传预览
    handelSuccessUpload(msg) {
      let list = this.value.concat(msg);
      this.$emit('input', list);
    },
    beforeAvatarUpload(file) {
      const isImage = /^image\/(.*)$/.test(file.type);
      if (!isImage) {
        this.$message.error('请选择符合图片格式的文件上传!');
        return false;
      }
      const isLt500K = true;
      const isLt200K = true;
      const isLt2M = true;
      for (let i = 0; i < this.imageForm.length; i++) {
        if (this.imageForm[i].type === '8' && this.imageForm[i].isChecked === '1') {
          if (!isLt500K) {
            this.$message.warning('上传图片大小不能超过 500K!');
            return false;
          }
        }
        if (this.imageForm[i].type === '9' && this.imageForm[i].setting.showType === '0' && this.imageForm[i].isChecked === '1') {
          if (!(file.size / 1024 <= 500)) {
            this.$message.warning('上传图片大小不能超过 500K!');
            // isLt200K = true;
            return false;
          }
        }
        if (
          this.imageForm[i].type === '9' &&
          (this.imageForm[i].setting.showType === '1' || this.imageForm[i].setting.showType === '2') &&
          this.imageForm[i].isChecked === '1'
        ) {
          if (!(file.size / 1024 <= 200)) {
            this.$message.warning('上传图片大小不能超过 200K!');
            return false;
          }
        }
        if (this.imageForm[i].type === '10' && this.imageForm[i].isChecked === '1') {
          if (!(file.size / 1024 / 1024 < 2)) {
            this.$message.warning('上传图片大小不能超过 2M!');
            return false;
          }
        }
      }

      this.getImg(file)
        .then(value => {
          for (let i = 0; i < this.imageForm.length; i++) {
            if (this.imageForm[i].type === '8') {
              this.handleImageHL(value);
            }
            if (this.imageForm[i].type === '9') {
              this.handleImageBDL(value);
            }
            if (this.imageForm[i].type === '10') {
              this.handleImageBDS(value);
            }
          }
        })
        .catch(res => {
          console.log(res + 'res');
          return res;
        });
      return isImage && isLt500K && isLt200K && isLt2M;
    },
    // 获取上传图片宽高
    getImgInfo(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(e) {
          let data = e.target.result;
          let img = new Image();
          img.src = data;
          img.onload = function() {
            resolve({
              width: img.width,
              height: img.height
            });
          };
        };
        reader.readAsDataURL(file);
      });
    },
    async getImg(file) {
      let img = await this.getImgInfo(file);
      return img;
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
    },
    handleImageHL(img) {
      this.$emit('handleImageHL', img);
    },
    handleImageBDL(img) {
      this.$emit('handleImageBDL', img);
    },
    handleImageBDS(img) {
      this.$emit('handleImageBDS', img);
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
  }
};
</script>

<style lang="scss">
.biz-avatar-uploader-recommend {
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
