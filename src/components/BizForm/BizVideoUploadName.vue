<template>
  <div class="product-video-uploader">
    <el-upload accept="application/zip,video/*" name="file" :action="uploadAction" :data="uploadData" :file-list="fileList"
      :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeAvatarUpload"
      :disabled="disabled" :limit="5">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <!-- <el-button v-show="hasFile()" size="small" type="primary" @click.stop="handlePreview" :disabled="!preview" :loading="loading">
      预览</el-button>
    <el-button v-show="hasFile()" size="small" type="primary" @click.stop="handlePreview" :disabled="preview">取消预览</el-button>
    <iframe class="vrframe" ref="vrFrame" v-show="!preview" :src="url" frameborder="0"></iframe> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      preview: true,
      loading: false,
      fileList: [],
      url: ''
    };
  },
  props: {
    isTestDrive: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    productId: String,
    open: {
      type: Boolean,
      default: false
    },
    value: {
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
    },
    value(newVal, oldVal) {
      console.log('value: ', this.value);
      this.fileList = newVal.map(item => {
        return { name: item.name, url: item.url };
      });
    }
  },
  computed: {
    uploadAction() {
      return '/admin/file/uploads.jhtml';
    },
    uploadData() {
      return { type: '2' };
    }
  },
  methods: {
    handlePreview() {
      if (this.preview === true) {
        this.url = this.getFilePath();
        setTimeout(() => {
          this.preview = false;
        }, 800);
      } else {
        this.url = '';
        this.preview = true;
      }
    },
    handleRemove(file, fileList) {
      // this.$emit('remove-success', file, fileList);
      let list = this.value;
      console.log(file);
      for (let i = 0; i < list.length; i++) {
        if (list[i].name === file.name) {
          list.splice(i, 1);
        }
      }
      this.$emit('input', list);
      this.url = '';
      this.preview = true;
    },
    handleSuccess(res) {
      // this.$emit('upload-success', res, file, fileList);
      this.$set(res.fis[0], 'path', res.fis[0].url);
      this.$emit('input', this.value.concat(res.fis));
      this.$emit('handleSuccess');
      this.url = '';
      this.preview = true;
    },
    beforeAvatarUpload(file) {
      const isVideo = /^video\/(.*)$/.test(file.type);
      if (!isVideo) {
        this.$message.error('请选择符合视频格式的文件上传!');
      }
      return isVideo;
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
.product-video-uploader {
  width: 90%;
  margin-top: 5px;
  .vrframe {
    width: 460px;
    height: 260px;
  }
}
</style>
