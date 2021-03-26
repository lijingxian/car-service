<template>
  <div class="biz-import-file">
    <el-dialog :title="title" class="biz-import-file__uploading-dialog" :visible.sync="uploadingVisible" @close="clearTimeOut"
      append-to-body>
      <div class="info" v-show="showInfo">
        <span class="success">成功导出：{{count}}条</span>
        <span class="error">共计：{{total}}条</span>
      </div>
      <el-progress class="biz-import-file__uploading-dialog__progress" :stroke-width="12" :percentage="percentage"></el-progress>
      <div class="info" v-show="showCurrentInfo">
        <span class="success">正在导出：{{stepkey}}</span>
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
    }
  },
  data() {
    return {
      loading: false,
      t: '',
      title: '导出中',
      showCurrentInfo: true,
      uploadingVisible: false
    };
  },
  methods: {
    clearTimeOut() {
      this.$emit('clearTimeOut');
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
        text-align: right;

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
