<template>
  <biz-grid class="import-brand-series" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form label-width="80px" size="small">
      <el-form-item label="品牌：">
        <el-select v-model="brandId" placeholder="请选择品牌" @change="getSeriesName" filterable>
          <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <div class="font">请选择品牌，并选择其下的系列进行数据导入。当前平台支持导入的整车品牌/系列数据</div>
      </el-form-item>
      <el-form-item label="系列：">
        <el-table ref="table" size="small" :data="seriesDataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
        </el-table>
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
          :action="'/admin/shopProduct/importProduct.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport"
          style="margin-left: 10px;" v-show="false">
          <el-table-column label="编号" prop="line" width="50">
          </el-table-column>
          <el-table-column label="消息" prop="result">
          </el-table-column>
        </import-file>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
// import { BizList } from '@/components/BizTable';
import { setTimeout } from 'timers';
// import ImportProductService from '@/service/commodity/commodity-mgmt/importProduct';
import { ImportFile } from '@/components/BizUpload';
export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
    return {
      heightList: '300',
      multipleSelection: [],
      modeList: [],
      operations: [
        {
          label: '确定',
          name: 'save',
          type: 'primary',
          auth: ['admin:shopBrand.edit']
        }
      ],
      rules: {
        topProductCategoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 品牌列表
      brandOptions: [],
      // 系列列表
      brandId: '',
      seriesId: [],
      seriesDataList: [],
      importLoading: false,
      importResult: [],
      disabled: false,
      show: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      loading: false
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.brandId = '';
        this.brandOptions = [];
        this.seriesId = [];
        this.seriesDataList = [];

        this.importResult = [];
        this.successCount = 0;
        this.failCount = 0;
      } else {
        this.getBrandName();
      }
    }
  },
  components: { BizGrid, BizSaveButton, ImportFile },
  created() {
    this.getBrandName();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      let url = '/admin/shopBrand/importProgress.jhtml';
      http
        .get(url, { type: '13' })
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.$refs.importFile.uploadingVisible = true;
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
              this.$emit('operationSuccess');
            }
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          } else {
            this.$refs.importFile.uploadingVisible = false;
            this.$emit('openPoup');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getUploadProductFileParam(url) {
      return {
        shopId: window.top.SHOP_ID || '',
        filePath: url
      };
    },
    getBrandName() {
      this.brandId = '';
      this.brandOptions = [];
      this.seriesIds = [];
      this.seriesDataList = [];

      http
        .get('/admin/brand/brandList.jhtml', {})
        .then(data => {
          this.brandOptions = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
        });
    },
    getSeriesName() {
      this.seriesId = [];
      this.seriesDataList = [];
      http
        .get('/admin/series/seriesList.jhtml', { brandId: this.brandId })
        .then(data => {
          this.seriesDataList = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
        });
    },
    save() {
      let seriesDataList = [];
      this.multipleSelection.map(item => {
        seriesDataList.push({ id: item.id });
      });
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.brandId,
        seriesDataList: seriesDataList
      };
      this.operations[0].disabled = true;
      this.$emit('closePoup');
      setTimeout(() => {
        this.handleImport();
      }, 200);
      http
        .post('/admin/shopBrand/brandSeries/import.jhtml', params)
        .then(data => {
          // this.$message({
          //   type: 'success',
          //   message: '导入成功!'
          // });
          this.loading = false;
          this.operations[0].disabled = false;
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          this.loading = false;
          this.$refs.importFile.uploadingVisible = false;
          this.operations[0].disabled = false;
          console.log(errData);
        });
    }
  }
};
</script>

<style lang="scss">
.import-brand-series {
  .checkbox-group {
    font-size: 14px;
  }
  .font {
    font-size: 12px;
    color: #666666;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
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
    width: 160px;
    margin: 0;
    .checkbox-group-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .biz-list {
    margin-top: 10px;
  }
  .el-radio {
    width: 60px;
  }
  .biz-save-button {
    margin-top: 5px;
  }
  .radio {
    margin-left: 150px;
  }
  .importFile {
    margin-left: 140px;
    margin-top: 50px;
  }
  .downloadButton {
    margin-left: 80px;
    margin-top: -33px;
  }
  .checkbox-group {
    font-size: 14px;
  }
}
</style>
