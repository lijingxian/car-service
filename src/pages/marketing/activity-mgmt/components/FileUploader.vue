<template>
  <div class="file-uploader" v-loading="loading">
    <div style="display:flex;margin-bottom: 10px;">
      <el-upload
        accept="application/zip, video/*"
        :name="uploadName"
        :action="'/admin/marketing/potentialCustomerZip.jhtml'"
        :show-file-list="false"
        :data="uploadData"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeAvatarUpload"
      >
        <el-button size="small" type>上传</el-button>
      </el-upload>
      <el-button style="margin-left:10px" type size="small" @click="downloadTemplate">模板下载</el-button>
    </div>
    <iframe :src="url" v-if="url" frameborder="0" scrolling="auto" width="350px" height="450px" style="float:right"></iframe>
  </div>
</template>

<script>
// import axios from 'axios';
import { setTimeout } from 'timers';

export default {
  name: 'FileUploader',
  data() {
    return {
      loading: false
    };
  },
  props: {
    isUploader: {
      type: Boolean,
      default: false
    },
    itemId: String,
    open: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    url: String
  },
  watch: {},
  computed: {
    uploadName() {
      if (!this.isUploader) {
        return 'uploadFile0';
      } else {
        return 'file';
      }
    },
    uploadData() {
      if (!this.isUploader) {
        return { name: 'uploadFile0' };
      } else {
        return { type: '2', name: 'file' };
      }
    }
  },
  methods: {
    downloadTemplate() {
      window.open('/upload/mode/activity_page_template.zip');
    },
    handleSuccess(res, file, fileList) {
      this.$emit('upload-success', res, file, fileList);
      this.loading = true;
      setTimeout(() => {
        this.url = res.path;
        this.loading = false;
      }, 10000);
    },
    beforeAvatarUpload(file) {
      const isZip = file.type === 'application/zip';
      if (!isZip) {
        let type = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (type !== '.zip') {
          this.$message.error('请选择zip格式的文件上传!');
          return isZip;
        }
      }

      const isLt200M = file.size / 1024 / 1024 <= 200;
      if (!isLt200M) {
        this.$message.error('请上传小于200M的文件!');
      }
      return isLt200M;
    },
    handleError(err, file, fileList) {
      if (err) {
        this.$message.warning(err);
      } else {
        this.$message.warning('发生错误');
      }
    }
  }
};
</script>

<style lang="scss">
.file-uploader {
  margin-right: 10px;
}
textarea {
  display: none;
}
</style>
