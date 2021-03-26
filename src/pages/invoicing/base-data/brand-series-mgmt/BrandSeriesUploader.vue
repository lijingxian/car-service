<template>
  <div class="brand-series-uploader">
    <el-upload ref="upload" :show-file-list="false" accept="image/*" class="avatar-uploader" :style="avatarStyle" name="file"
      :on-success="handleSuccess" action="/admin/file/uploads.jhtml" :data="fileData">
      <div v-if="value" class="avatar">
        <img :src="value" :onerror="defaultImg">
      </div>
        <i v-else class="el-icon-plus avatar-uploader-icon" :style="plusStyle"></i>
        <div v-show="value" @click.stop="doThis" class="operate">
          <i @click.stop="zoomIn" class="el-icon-zoom-in"></i>
          <i @click="upload" class="el-icon-plus"></i>
          <i @click="remove" class="el-icon-delete"></i>
        </div>
    </el-upload>
    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="value" :onerror="defaultImg">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BrandSeriesUploader',
  data() {
    return {
      dialogVisible: false,
      fileData: {
        type: '0'
      },
      avatar: '',
      defaultImg:
        'this.src="' +
        require('../../../../assets/images/commodity/pic_default_fail.png') +
        '"'
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
  methods: {
    handleSuccess(res) {
      this.$emit('input', res.fis[0].url);
      this.$emit('handleUploadSuccess', res.fis[0].url);
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
    }
  }
};
</script>

<style lang="scss">
.brand-series-uploader {
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
