<template>
  <biz-grid class="lead-base-info-product">
    <div class='importFile' slot="top">
      <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
        :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
        :action="'/admin/invoicingProduct/importProduct.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport"
        style="margin-left: 10px;" v-show="showType === '文件导入'">
        <el-table-column label="编号" prop="line" width="50">
        </el-table-column>
        <el-table-column label="消息" prop="result">
        </el-table-column>
      </import-file>
      <div class="downloadButton" v-show="showType === '文件导入'">
        <el-button type="primary" @click="downloadTemplate" size="mini">模板下载</el-button>
      </div>
      <biz-save-button slot="top" :operations="operations" @operate="operate" v-show="showType === '平台导入'"></biz-save-button>
    </div>
    <el-form ref="form" :rules="rules" size="small" v-loading="loading" :inline-message="true">
      <div class="radio">
        <el-radio-group v-model="showType" @change="handleShowTypeChange">
          <el-radio label="文件导入">从本地文件导入</el-radio>
          <el-radio label="平台导入">从平台导入</el-radio>
        </el-radio-group>
      </div>
      <div>
        <el-form-item v-show="showType === '平台导入'">
          <template>
            <div class="category-select">
              <el-form label-width="120px" size="small" :inline-message="true">
                <el-form-item label="分类：" prop="topProductCategoryId">
                  <el-select v-model="topProductCategoryId" placeholder="请选择分类" @change="topCategoryChange">
                    <el-option v-for="item in topCategoryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-select v-model="subProductCategoryId" placeholder="请选择二级分类" @change="subCategoryChange" v-show="subCategoryOptions.length !== 0">
                    <el-option v-for="item in subCategoryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="品牌：" v-if="show">
                  <el-select v-model="brandId" placeholder="请选择品牌" @change="getSeriesName" filterable>
                    <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="系列：" v-if="show">
                  <el-checkbox-group v-model="seriesId">
                    <div class="checkbox-group">
                      <el-checkbox v-for="item in seriesOptions" :key="item.id" :label="item.id" @change="conditionChange">
                        <div class="checkbox-group-item">{{item.name}}</div>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="销售状态：" v-if="show">
                  <el-checkbox-group v-model="saleStates" @change="conditionChange">
                    <div class="checkbox-group">
                      <el-checkbox label="1">
                        <div class="checkbox-group-item">在售</div>
                      </el-checkbox>
                      <el-checkbox label="0">
                        <div class="checkbox-group-item">停售</div>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="show?'车型':'商品'">
                  <biz-list ref="table" :height="heightList" :tableData="modeList" @handleSelectionChange="handleSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                  </biz-list>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-form-item>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { ImportFile } from '@/components/BizUpload';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import http from '@/common/http';
import { BizList } from '@/components/BizTable';
// import ImportProductService from '@/service/commodity/commodity-mgmt/importProduct';

export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
    return {
      heightList: '300',
      multipleSelection: [],
      modeList: [],
      operations: [
        {
          label: '导入',
          name: 'save',
          type: 'primary',
          disabled: true,
          auth: ['admin:PurchaseSaleStorage.product.edit']
        }
      ],
      rules: {
        topProductCategoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 商品分类列表
      allCategory: [],
      // 一级商品分类列表
      topCategoryOptions: [],
      // 二级商品分类列表
      subCategoryOptions: [],
      // 品牌列表
      brandOptions: [],
      // 系列列表
      seriesOptions: [],
      showType: '文件导入',
      topProductCategoryId: '',
      subProductCategoryId: '',
      brandId: '',
      seriesId: [],
      saleStates: [],
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
        this.allCategory = [];

        this.topProductCategoryId = '';
        this.subProductCategoryId = '';
        this.topCategoryOptions = [];
        this.subCategoryOptions = [];

        this.brandId = '';
        this.brandOptions = [];
        this.seriesId = [];
        this.seriesOptions = [];

        this.importResult = [];
        this.successCount = 0;
        this.failCount = 0;
        this.modeList = [];
        this.show = false;
        this.showType = '文件导入';
      } else {
        this.query();
      }
    }
  },
  components: { BizGrid, BizSaveButton, ImportFile, BizList },
  created() {
    this.handleImport();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    downloadTemplate() {
      window.open('/upload/mode/V服爱车_进销存_商品导入模板.xlsx');
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    conditionChange() {
      let productIds = [];
      this.multipleSelection.map(item => {
        productIds.push(item.id);
      });
      let params = {
        productCategoryId: this.subProductCategoryId === '' ? this.topProductCategoryId : this.subProductCategoryId,
        brandIds: this.brandId,
        seriesIds: this.seriesId.join('&seriesIds='),
        saleStates: this.saleStates.join('&saleStates=')
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/shopProduct/queryPlatformImportInfo/v2.jhtml?' + paramsArr.join('&'))
        .then(data => {
          this.modeList = data.data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    handleShowTypeChange(type) {
      if (type === '平台导入') {
        this.operations[0].disabled = false;
      } else {
        this.operations[0].disabled = true;
      }
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
      let url = '/admin/invoicingProduct/importProgress.jhtml';
      http
        .get(url, { type: '16' })
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
            this.$emit('operationSuccess');
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
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
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    handleImportCar() {
      let url = '/admin/shopProduct/importProgress.jhtml';
      http
        .get(url, { type: '12' })
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
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImportCar, 2000);
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
    query() {
      this.queryPlatformCategoryTree();
    },
    queryPlatformCategoryTree() {
      this.allCategory = [];

      this.topProductCategoryId = '';
      this.subProductCategoryId = '';
      this.topCategoryOptions = [];
      this.subCategoryOptions = [];

      this.brandId = '';
      this.brandOptions = [];
      this.seriesId = [];
      this.seriesOptions = [];

      let params = {};
      CommodityMgmtService.queryPlatformCategoryTree(
        params,
        data => {
          this.allCategory = data.platformCategoryTree;
          this.setTopCategoryOptions();
          this.setSubCategoryOptions();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    setTopCategoryOptions() {
      let options = [];
      this.allCategory.forEach(category => {
        if (category.topCategory) {
          options.push(category);
        }
      });
      this.topCategoryOptions = options;
    },
    setSubCategoryOptions() {
      let options = [];
      if (this.topProductCategoryId !== '') {
        this.allCategory.forEach(category => {
          if (category.parentId === this.topProductCategoryId) {
            options.push(category);
          }
        });
      }

      this.subCategoryOptions = options;
    },
    topCategoryChange() {
      this.setSubCategoryOptions();
      this.subProductCategoryId = '';
      this.getBrandName();
    },
    subCategoryChange() {
      this.getBrandName();
    },
    getBrandName() {
      this.brandId = '';
      this.brandOptions = [];
      this.seriesId = [];
      this.seriesOptions = [];

      let params = {
        productCategoryId: this.subProductCategoryId === '' ? this.topProductCategoryId : this.subProductCategoryId
      };
      CommodityMgmtService.queryPlatformImportInfo(
        params,
        data => {
          let type = '';
          this.topCategoryOptions.map(item => {
            if (item.id === this.topProductCategoryId) {
              type = item.type;
            }
          });
          this.modeList = [];
          if (type === 'car') {
            this.show = true;
            this.brandOptions = data.data;
          } else {
            this.show = false;
            // 非整车分类
            this.conditionChange();
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getSeriesName() {
      this.seriesId = [];
      this.seriesOptions = [];
      this.modeList = [];
      let params = {
        productCategoryId: this.subProductCategoryId === '' ? this.topProductCategoryId : this.subProductCategoryId,
        brandIds: this.brandId
      };
      CommodityMgmtService.queryPlatformImportInfo(
        params,
        data => {
          this.seriesOptions = data.data;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      let productIds = [];
      this.multipleSelection.map(item => {
        productIds.push(item.id);
      });
      let params = {
        shopId: window.top.SHOP_ID || '',
        productCategoryId: this.subProductCategoryId === '' ? this.topProductCategoryId : this.subProductCategoryId,
        productIds: productIds
      };
      if (productIds.length === 0) {
        this.$message.warning('请选择待导入的车型或者商品');
        return;
      }
      this.operations[0].disabled = true;
      this.$emit('closePoup');
      setTimeout(() => {
        this.handleImportCar();
      }, 100);
      http
        .post('/admin/shopProduct/importPlatformProduct/v2.jhtml', params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '导入成功!'
          });
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
.lead-base-info-product {
  .checkbox-group {
    font-size: 14px;
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
    width: 100px;
  }
  .biz-save-button {
    margin-top: 5px;
    margin-bottom: 0px;
    justify-content: flex-start;
  }
  .radio {
    margin-left: 150px;
  }
  .importFile {
    margin-top: 10px;
    display: flex;
    float: right;
  }
  .downloadButton {
    margin-left: 10px;
  }
  .checkbox-group {
    font-size: 14px;
  }
}
</style>
