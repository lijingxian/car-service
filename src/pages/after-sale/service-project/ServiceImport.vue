<template>
  <biz-grid class="service-handbook-item">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :model="formModel" label-width="100px" size="small" v-loading="loading">
      <el-form-item label="品牌">
        <el-select v-model="formModel.brand" placeholder="请选择" filterable style="width: 100%;" @change="handleBrandChange">
          <el-option v-for="(item,index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <biz-list ref="list" :height="height" :tableData="seriesList" @handleSelectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="name" label="系列">
      </el-table-column>
    </biz-list>
    <el-dialog :title="title" class="biz-import-file__uploading-dialog" :visible.sync="uploadingVisible" @close="clearTimeOut"
      append-to-body>
      <div class="info">
        <span class="success">成功导入：{{count}}条</span>
        <span class="error">共计：{{total}}条</span>
      </div>
      <el-progress class="biz-import-file__uploading-dialog__progress" :stroke-width="12" :percentage="percentage"></el-progress>
      <div class="info" v-show="showCurrentInfo">
        <span class="success">正在导入：{{stepkey}}</span>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizList } from '@/components/BizTable';
import serviceProjectService from '@/service/maintenance/serviceProject';
import { mapGetters } from 'vuex';
export default {
  name: 'ServiceHandbookItem',
  data() {
    return {
      isCreated: true,
      height: '500',
      loading: false,
      uploadingVisible: false,
      disabled: false,
      showCurrentInfo: true,
      percentage: 0,
      count: 0,
      total: 0,
      stepkey: '',
      t: '',
      title: '导入中',
      importingVisible: false,
      multipleSelection: [],
      brandList: [],
      seriesList: [],
      formModel: {},
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ]
    };
  },
  components: { BizGrid, BizSaveButton, BizList },
  created() {
    // this.queryBrandList();
    this.baseData('0');
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  props: {
    type: String,
    refId: String
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    handleImport() {
      serviceProjectService.queryImportProgress(
        {},
        data => {
          this.$emit('created');
          if (data.data && data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.title = data.data.title;
          } else {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          this.uploadingVisible = true;
          this.t = setTimeout(this.handleImport, 2000);
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.title = '导入完成';
            this.showCurrentInfo = false;
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            this.uploadingVisible = true;
            this.showCurrentInfo = true;
            this.title = data.data.title;
            this.disabled = true;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    save() {
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一个系列');
        return;
      }
      if (!this.disabled) {
        serviceProjectService.queryImportProgress(
          {},
          data => {
            if (data.data && data.data.rate && data.data.rate !== '100') {
              this.handleImport();
            } else {
              this.importBooklet();
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.handleImport();
      }
    },
    importBooklet() {
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一个系列');
        return;
      }
      this.handleImport();
      serviceProjectService.importBooklet(
        {
          series: ids,
          shopId: this.getUser().shop.id,
          userId: this.getUser().id
        },
        data => {},
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.error(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      serviceProjectService.queryBrandList(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      serviceProjectService.querySeriesList(
        { brandId: val },
        data => {
          this.seriesList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    baseData(type, brandId, seriesId) {
      serviceProjectService.bookletbaseData(
        {
          type: type,
          brandId: brandId,
          seriesId: seriesId
        },
        data => {
          if (type === '0') {
            this.brandList = data.dataList;
          }
          if (type === '1') {
            this.seriesList = data.dataList;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleBrandChange(val) {
      this.baseData('1', val);

      this.$set(this.formModel, 'series', '');
      this.$set(this.formModel, 'type', '');
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.service-handbook-item {
  padding: 10px 0;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
  }
  .biz-list {
    margin: 0 5px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
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
</style>
