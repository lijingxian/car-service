<template>
  <div class="product-vr-file-uploader">
    <el-upload accept="application/zip,video/*" :name="uploadName" :action="uploadAction" :data="uploadData" :file-list="fileList"
      :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeAvatarUpload">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-button v-show="hasFile()" size="small" type="primary" @click.stop="handlePreview" :disabled="!preview" :loading="loading">
      预览</el-button>
    <el-button v-show="hasFile()" size="small" type="primary" @click.stop="handlePreview" :disabled="preview">取消预览</el-button>
    <iframe class="vrframe" ref="vrFrame" v-show="!preview" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductVrFileUploader',
  data() {
    return {
      preview: true,
      loading: false,
      url: ''
    };
  },
  props: {
    isTestDrive: {
      type: Boolean,
      default: false
    },
    productId: String,
    open: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.url = '';
        this.preview = true;
      }
    }
  },
  computed: {
    uploadAction() {
      if (!this.isTestDrive) {
        return '/admin/baseData/baseDataVrZip.jhtml';
      } else {
        return '/admin/file/uploads.jhtml';
      }
    },
    uploadName() {
      if (!this.isTestDrive) {
        return 'uploadFile0';
      } else {
        return 'file';
      }
    },
    uploadData() {
      if (!this.isTestDrive) {
        return { productId: this.productId, name: 'uploadFile0' };
      } else {
        return { type: '2', name: 'file' };
      }
    }
  },
  methods: {
    handlePreview() {
      if (this.isTestDrive) {
        if (this.preview === true) {
          this.url = this.getFilePath();
          setTimeout(() => {
            this.preview = false;
          }, 800);
        } else {
          this.url = '';
          this.preview = true;
        }
      } else if (this.preview === true) {
        let url = this.getFilePath();
        this.loading = true;
        axios
          .get(url)
          .then(res => {
            this.loading = false;
            this.url = this.getFilePath();
            this.$refs.vrFrame.contentWindow.location.reload(true);
            setTimeout(() => {
              this.preview = false;
            }, 800);
            console.log('url请求成功');
          })
          .catch(e => {
            this.loading = false;
            if (e.response.status === 404) {
              this.$message.warning('文件解析,十分钟后可预览');
            } else {
              console.log('url请求失败:', e.response);
            }
          });
      } else {
        this.url = '';
        this.loading = false;
        this.preview = true;
      }
    },
    handleRemove(file, fileList) {
      this.$emit('remove-success', file, fileList);
      this.url = '';
      this.preview = true;
    },
    handleSuccess(res, file, fileList) {
      this.$emit('upload-success', res, file, fileList);
      this.url = '';
      this.preview = true;
    },
    beforeAvatarUpload(file) {
      if (!this.isTestDrive) {
        const isZip = file.type === 'application/zip';
        if (!isZip) {
          let type = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
          if (type !== '.zip') {
            this.$message.error('请选择zip格式的VR资源包!');
            return isZip;
          }
        }

        const isLt200M = file.size / 1024 / 1024 <= 200;
        if (!isLt200M) {
          this.$message.error('请上传小于200M的文件!');
        }
        return isLt200M;
      } else {
        const isVideo = /^video\/(.*)$/.test(file.type);
        if (!isVideo) {
          this.$message.error('请选择符合视频格式的文件上传!');
        }
        return isVideo;
      }
    },
    handleError(err, file, fileList) {
      if (err) {
        this.$message.warning(err);
      } else {
        this.$message.warning('发生错误');
      }
    },
    hasFile() {
      return this.fileList.length !== 0;
    },
    getFilePath() {
      if (this.fileList.length !== 0) {
        let index = this.fileList[0].url.indexOf('/upload/');

        if (index === -1) {
          console.log('文件路径错误', this.fileList[0].url);
          return '';
        }

        let header = location.protocol + '//' + location.host;
        let url = this.fileList[0].url.substr(index);
        let src = header + url;

        if (!this.isTestDrive) {
          src = src + '/index.html';
        }

        console.log('src', src);
        return src;
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="scss">
.product-vr-file-uploader {
  width: 90%;
  margin-top: 5px;
  .vrframe {
    width: 460px;
    height: 260px;
  }
}
</style>
