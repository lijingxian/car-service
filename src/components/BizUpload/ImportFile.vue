<template>
  <div class="biz-import-file">
    <el-upload :show-file-list="false" :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProgress"
      :before-upload="handleBeforeUpload" :data="data" :name="name" :action="action"
      accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <el-button size="mini" type="" :loading="loading" v-if="disabled" @click.stop="handleImport">
        <div v-if="$slots.content || content" class="biz-card__header">
          <slot name="content">{{ content }}</slot>
        </div>
      </el-button>
      <el-button size="mini" type="" :loading="loading" v-if="!disabled">
        <div v-if="$slots.content || content" class="biz-card__header">
          <slot name="content">{{ content }}</slot>
        </div>
      </el-button>
    </el-upload>

    <el-dialog :title="title" class="biz-import-file__uploading-dialog" :visible.sync="uploadingVisible" @close="clearTimeOut"
      append-to-body>
      <div class="info" v-show="showInfo">
        <span class="success">成功导入：{{count}}条</span>
        <span class="error">共计：{{total}}条</span>
      </div>
      <el-progress class="biz-import-file__uploading-dialog__progress" :stroke-width="12" :percentage="percentage"></el-progress>
      <div class="info" v-show="showCurrentInfo">
        <span class="success">正在导入：{{stepkey}}</span>
      </div>
    </el-dialog>

    <el-dialog title="导入结果" class="biz-import-file__importing-dialog" :visible.sync="importingVisible" append-to-body>
      <div class="importing-dialog__content">
        <el-table size="small" ref="table" stripe border :height="400" :data="tableData" tooltip-effect="dark" style="width: 100%"
          v-loading="importLoading" element-loading-text="导入中，请稍后">
          <slot></slot>
        </el-table>

        <!-- <div class="info" v-show="showInfo">
          共
          <span class="success">{{total}}</span> 条，已导入
          <span class="error">{{count}}</span> 条
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImportFile',
  props: {
    showInfo: {
      type: Boolean,
      default() {
        return true;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    showProcess: {
      type: Boolean,
      default() {
        return false;
      }
    },
    content: {
      type: String,
      default() {
        return '导入';
      }
    },
    data: {
      type: Object,
      default() {
        return {
          type: '3'
        };
      }
    },
    name: {
      type: String,
      default() {
        return 'file';
      }
    },
    action: {
      type: String,
      default() {
        return '/admin/file/uploads.jhtml';
      }
    },
    tableData: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      default() {
        return 0;
      }
    },
    count: {
      type: Number,
      default() {
        return 0;
      }
    },
    percentage: {
      type: Number,
      default() {
        return 0;
      }
    },
    stepkey: {
      type: String,
      default() {
        return '';
      }
    },
    importLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      loading: false,
      t: '',
      title: '导入中',
      showCurrentInfo: true,
      uploadingVisible: false,
      importingVisible: false
    };
  },
  // watch: {
  //   percentage(nVal, oVal) {
  //     if (!this.textEl) {
  //       this.textEl = document.querySelector('.el-progress__text');
  //       this.textEl.style.left = this.percentage + '%';
  //     }
  //   }
  // },
  methods: {
    handleBeforeUpload(file) {
      this.clearTimeOut();
      if (file.name.indexOf('.') !== -1) {
        let ldot = file.name.lastIndexOf('.');
        let type = file.name.substring(ldot + 1);
        if (!/(?:xls|xlsx)$/i.test(type)) {
          this.$message.warning('请确认上传文件为Excel扩展类型(.xls/.xlsx)');
          return false;
        }
        // this.loading = true;
        // this.uploadingVisible = true;
        // this.percentage = 0;
        if (this.textEl) this.textEl.style.left = 0;
      } else {
        this.$message.warning('请确认上传文件为Excel扩展类型(.xls/.xlsx)');
        return false;
      }
    },
    handleProgress(e, file, fileList) {
      console.log('导入中');
      this.uploadingVisible = true;
      this.$emit('restProcess');
      let that = this;
      setTimeout(function() {
        that.handleImport();
      }, 2000);
      // this.percentage = Number.parseInt(e.percent);
      // if (!this.textEl) this.textEl = document.querySelector('.el-progress__text');
      // this.textEl.style.left = this.percentage + '%';
      // this.percentage = this.percentage + 1;
      // if (this.percentage === 50) {
      //   window.clearTimeout(this.t);
      //   return;
      // }
      // this.t = setTimeout(this.handleProgress, 1000);
      // if (!this.textEl) {
      //   this.textEl = document.querySelector('.el-progress__text');
      //   this.textEl.style.left = this.percentage + '%';
      // }
    },
    handleSuccess(res, file, fileList) {
      console.log('导入完成');
      if (res.resultCode === '100') {
        setTimeout(() => {
          if (res.fis) {
            let url = res.fis[0].url;
            if (url) {
              this.doImport(url, res);
            } else {
              this.$message.warning('请确认上传文件为Excel扩展类型(.xls/.xlsx)');
            }
          } else {
            // this.handleImport(res);
          }
        }, 600);
      } else {
        console.log('失败1');
        this.$message.warning('发生错误');
        this.uploadingVisible = false;
        // this.clearTimeOut();
        // this.loading = false;
      }
    },
    handleError(err, file, fileList) {
      console.log('失败');

      // this.clearTimeOut();
      // window.clearTimeout(this.t);
      // this.loading = false;

      if (err) {
        this.$message.warning(err);
      } else {
        this.uploadingVisible = false;
        this.$message.warning('发生错误');
      }
    },
    clearTimeOut() {
      this.$emit('clearTimeOut');
    },
    handleImport(res) {
      this.uploadingVisible = true;
      this.$emit('handle-import', res);
    },
    doImport(url, res) {
      setTimeout(() => {
        this.importingVisible = true;
      }, 0);
      this.$emit('on-import', url, res);
    }
  }
};
</script>

<style lang="scss">
$biz-import-file__uploading-dialog-width: 560px;
$biz-import-file__uploading-dialog-height: 256px;
$biz-import-file__uploading-dialog-border-radius: 12px;

$biz-import-file__progress-bar-width: 460px;
$biz-import-file__progress-bar-text-font-size: 14px;
$biz-import-file__progress-bar-text-width: 54px;

.biz-import-file__uploading-dialog {
  .el-dialog {
    width: $biz-import-file__uploading-dialog-width;
    height: $biz-import-file__uploading-dialog-height;
    border-radius: $biz-import-file__uploading-dialog-border-radius;

    .el-dialog__header {
      font-size: 16px;
      color: #1a1a1a;
      padding-left: 50px;
      text-align: center;
      .el-dialog__title {
        display: inline-block;
      }
    }

    .el-dialog__body {
      .info {
        display: flex;
        justify-content: space-between;
        text-align: left;

        > span {
          font-weight: bold;

          &.error {
            margin-right: 30px;
          }

          &.success {
            margin-left: 30px;
          }
        }
      }
      .biz-import-file__uploading-dialog__progress {
        position: relative;
        width: $biz-import-file__progress-bar-width;
        margin: (($biz-import-file__uploading-dialog-height - 54) / 2 - 42) auto
          (($biz-import-file__uploading-dialog-height - 54) / 2 - 62);

        .el-progress-bar {
          padding: 0;
        }

        .el-progress__text {
          display: inline-block;
          position: absolute;
          left: 0;
          bottom: 150%;
          width: $biz-import-file__progress-bar-text-width;
          margin-left: (-1 * $biz-import-file__progress-bar-text-width / 2);
          border-radius: 3px;
          padding: 5px 0;
          text-align: center;
          font-size: $biz-import-file__progress-bar-text-font-size !important;
          color: #fff;
          background: #ff7300;

          &:after {
            content: ' ';
            display: block;
            position: absolute;
            left: 50%;
            margin-left: -4px;
            top: 100%;
            border-color: #ff7300 transparent transparent;
            border-style: solid;
            border-width: 4px 4px 0 4px;
          }
        }
      }
    }
  }
}

.biz-import-file__importing-dialog {
  .el-dialog {
    width: $biz-import-file__uploading-dialog-width;
    border-radius: $biz-import-file__uploading-dialog-border-radius;

    .el-dialog__body {
      padding: 0 20px 20px;
      .el-table__header {
        .is-leaf {
          padding: 5px 0;
        }
        .el-table-column--selection {
          .cell {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        th {
          background-color: rgb(245, 245, 245);
        }
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #fef3e5;
      }
      .el-table--striped,
      .el-table {
        .el-table__body-wrapper {
          .el-table-column--selection {
            .cell {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .biz-customcol {
            display: flex;
            align-items: center;
            .biz-two-row {
              display: flex;
              flex-direction: column;
            }
          }
          tr {
            &:hover > td {
              background-color: #fef3e5;
            }
            &.el-table__row--striped.current-row > td,
            &.current-row > td {
              background-color: #ffd6a0;
            }
          }
        }
      }
    }
  }
}
</style>
