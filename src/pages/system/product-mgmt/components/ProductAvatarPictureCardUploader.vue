<template>
  <div class="product-avatar-picture-card-uploader">
    <el-upload class="avatar-uploader" ref="upload" accept="image/*" list-type="picture-card" :file-list="imageList" name="uploadFile0"
      :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :action="uploadAction"
      :data="uploadData" multiple>
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="imgUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductAvatarPictureCardUploader',
  data() {
    return {
      imgUrl: {
        type: String,
        default: ''
      },
      dialogVisible: false
    };
  },
  props: {
    parentElementName: String,
    shopId: window.top.SHOP_ID || '',
    productId: String,
    isMainPicture: {
      type: Boolean,
      default() {
        return false;
      }
    },
    imageList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    uploadAction() {
      if (this.isMainPicture) {
        return '/admin/baseData/baseDataImagesFile.jhtml';
      } else {
        return '/admin/vrMedia/uploadVrImage.jhtml';
      }
    },
    uploadData() {
      console.log('uploadData');
      return {
        shopId: window.top.SHOP_ID || '',
        productId: this.productId,
        type: '0'
      };
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('remove-success', file);
    },
    handlePreview(file) {
      this.imgUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      this.$emit('upload-success', res, file, this.parentElementName);
    },
    beforeAvatarUpload(file) {
      const isImage = /^image\/(.*)$/.test(file.type);
      if (!isImage) {
        this.$message.error('请选择符合图片格式的文件上传!');
        return false;
      }

      const isLt200K = file.size / 1024 <= 200;
      if (!isLt200K) {
        this.$message.error('上传图片大小不能超过 200K!');
        return false;
      }

      if (this.isMainPicture) {
        if (this.$refs.upload.$refs['upload-inner'].fileList.length <= 5) {
          return true;
        } else {
          this.$message.error('轮播主图最多可添加5个');
          return false;
        }
      }

      return true;
    }
  }
};
</script>

<style lang="scss">
.product-avatar-picture-card-uploader {
  .avatar-uploader {
    margin-bottom: 5px;
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
