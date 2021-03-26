<template>
  <div class="video-uploader">
    <el-upload accept="video/*" ref="upload" list-type="picture" name="file" :action="uploadAction" :data="uploadData" :file-list="fileList" :on-remove="handleRemove"
      :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeAvatarUpload" :show-file-list="false" :disabled="disabled">
      <el-button size="small" type="primary" v-if="!hasFile" :class="{'disabled': disabled}">点击上传</el-button>
    </el-upload>
    <div class="video-container" v-if="hasFile">
      <div class="video-style" @mouseover="onMouseover" @mouseout="onMouseout">
        <video width="98" height="98" :controls="false" :src="fileList[0].url"></video>
        <i class="el-icon-caret-right zoom-video" @click="onClick"></i>
        <i class="el-icon-close delete-video" @click="onDelete" v-show="showDeleteIcon"></i>
      </div>
    </div>
    <el-dialog
      title="视频预览"
      :visible.sync="show"
      :append-to-body="true"
      center class="dialog-video" @open="onOpen">
      <div class="review">
        <video v-if="hasFile" ref="video" :controls="true" :src="fileList[0].url"></video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'video-uploader',
  data() {
    return {
      showDeleteIcon: false,
      show: false,
      loading: false
    };
  },
  props: {
    productId: String,
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    uploadAction() {
      return '/admin/file/uploads.jhtml';
    },
    uploadData() {
      return { type: '2' };
    },
    hasFile() {
      return this.fileList.length !== 0;
    }
  },
  methods: {
    onOpen() {
      this.$nextTick(() => {
        this.$refs.video.play();
      });
    },
    onMouseover() {
      if (!this.disabled) {
        this.showDeleteIcon = true;
      }
    },
    onMouseout() {
      if (!this.disabled) {
        this.showDeleteIcon = false;
      }
    },
    onClick() {
      this.show = true;
    },
    onDelete() {
      this.$refs.upload.clearFiles();
      this.$emit('remove-success');
    },
    handleRemove(file, fileList) {
      this.$emit('remove-success', file, fileList);
    },
    handleSuccess(res, file, fileList) {
      this.$emit('upload-success', res, file, fileList);
      console.log(res, file, fileList);
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
        this.$message.warning('视频上传异常');
      }
    }
  }
};
</script>

<style lang="scss">
.dialog-video{
  .review {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    video {
      width: 100%;
    }
  }
}
.video-uploader {
  width: 100px;
  margin-top: 5px;
  .disabled{
    pointer-events: none;
    background-color: #c0ccda;
    border: none;
  }
  .video-container{
    font-size: 35px;
    .zoom-video{
      position: absolute;
      left: 35%;
      top: 35%;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
    .delete-video{
      position: absolute;
      right: 0;
      top: 0;
      font-size: 22px;
      cursor: pointer;
      background-color: #fff;
      border-radius: 50%;
    }
    .video-style{
      position: relative;
      border: 1px solid #c0ccda;
      border-radius: 4px;
      margin-top: -26px;
    }
  }
}
</style>
