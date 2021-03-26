<template>
  <biz-grid class="screen-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="125px" size="small" v-loading="loading">
      <el-form-item label="屏保">
        <el-upload
          name="file"
          :data="data"
          action="/admin/file/uploads.jhtml"
          :on-change="handleChange"
          list-type="picture-card"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { customerService } from '@/common/urls';
import http from '@/common/http';
export default {
  name: 'ScreenSetting',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      fileList: [],
      fileListShow: [],
      rules: {},
      robotMediaProductDatas: [],
      data: { type: '2' },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {},
  watch: {
    itemId(nweVal, oldVal) {
      if (nweVal) {
        this.query();
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {};
    },
    beforeUpload(file) {
      if (file.type && file.type.split('/')[0] === 'image') {
        this.data.type = '0';
      } else {
        this.$message.warning('请上传符合的图片');
        return false;
      }
    },
    query() {
      this.loading = true;
      this.fileList = [];
      http
        .get(customerService.smartReception.queryRobotInfo, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId
        })
        .then(data => {
          this.loading = false;
          if (data.data.operationMedia && data.data.operationMedia.length > 0) {
            data.data.operationMedia.map(item => {
              this.fileList.push({
                url: item.path,
                path: item.path,
                name: item.name,
                position: '0',
                robotMediaId: item.robotMediaId
              });
            });
          }
        })
        .catch(errData => {
          console.log(errData);
          this.loading = false;
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      this.loading = true;
      this.robotMediaProductDatas = this.fileList.map(item => {
        return {
          robotMediaId: item.robotMediaId || '',
          path: item.path,
          position: '0',
          terminalId: this.itemId,
          name: item.name,
          products: []
        };
      });
      http
        .put('/admin/reception/robotMediaProduct.jhtml', this.robotMediaProductDatas)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.$emit('created');
        })
        .catch(errData => {
          console.log(errData);
          this.loading = false;
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleRemove(file, fileList) {
      let list = fileList;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === fileList) {
          list.splice(i, 1);
        }
      }
      this.fileList = list;
    },
    handleSuccess(file, fileList) {
      if (file.resultCode === '100') {
        this.fileList.push({
          url: file.fis[0].url,
          path: file.fis[0].url,
          name: file.fis[0].name,
          position: '0',
          robotMediaId: ''
        });
      }
    },
    handleError(file, fileList) {
      this.$message.warning('发生错误');
    },
    handleChange(file, fileList) {
      // debugger
      // this.fileList = fileList.splice(this.fileList.indexOf(fileList), 1);
    }
  }
};
</script>

<style lang="scss">
.screen-setting {
  .biz-save-button {
    float: left;
  }
  .product-list {
    // 图片预览
    .el-upload-list.el-upload-list--picture-card {
      display: flex;
      flex-wrap: wrap;
    }
    .content_class {
      height: 100%;
      overflow: auto;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 300px;
      height: 100px;
      .detail_info {
        margin-left: 20px;
      }
    }
    .el-upload-list--picture-card .el-upload-list__item-thumbnail {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .avatar-uploader {
    cursor: pointer;
    width: 150px;
    height: 150px;
    text-align: center;
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
      line-height: 150px;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  img {
    margin-top: 10px;
    max-width: 100%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .el-radio {
    width: 70px;
  }
}
</style>
