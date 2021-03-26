<template>
  <biz-grid class="motorcycle-type">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="车型" v-if="isCreateModel" prop="name">
        <el-input :placeholder="title" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-select v-model="brandId" placeholder="选择品牌">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="text" v-if="brandList.length===0" primary @click="openBrand=true">创建</el-button>
      </el-form-item>
      <el-form-item label="系列" v-if="isCreateSeries||isCreateModel" prop="title">
        <el-select v-model="seriesId" placeholder="选择系列">
          <el-option v-for="item in seriesList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="text" v-if="seriesList.length===0" primary @click="openSeries=true">创建</el-button>
      </el-form-item>
      <el-form-item label="型号" v-if="isCreateModel" prop="title">
        <!-- <el-select v-model="modelId" placeholder="选择型号">
          <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select> -->
        <el-checkbox-group v-model="typeList">
          <el-checkbox v-for="item in modelList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <BrandBaseInfo @created="refreshBrand" v-show="openBrand"></BrandBaseInfo>
    <SeriesBaseInfo @created="refreshSeries" :brandId="brandId" v-show="openSeries"></SeriesBaseInfo>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BrandBaseInfo from '@/pages/shop/commodity/brand-series-mgmt/BrandBaseInfo';
import SeriesBaseInfo from '@/pages/shop/commodity/brand-series-mgmt/SeriesBaseInfo';
import serviceProjectService from '@/service/maintenance/serviceProject';

export default {
  name: 'MotorcycleType',
  data() {
    return {
      loading: false,
      isCreateBrand: false,
      isCreateSeries: false,
      isCreateModel: false,
      openBrand: false,
      openSeries: false,
      brandId: '',
      seriesId: '',
      modelId: '',
      typeList: [],
      form: {
        name: ''
      },
      brandList: [],
      seriesList: [],
      modelList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        brand: [{ required: true, message: '请选择品牌', trigger: ['blur', 'change'] }]
      }
    };
  },
  components: { BizGrid, BizSaveButton, BrandBaseInfo, SeriesBaseInfo },
  created() {
    this.getBrandList();
  },
  watch: {
    brandId(brandId) {
      if (this.isCreateSeries || this.isCreateModel) {
        this.getSeriesList();
      }
    },
    seriesId() {
      if (this.isCreateModel) {
        this.getModelList();
      }
    },
    $route(to, from) {
      this.isCreateBrand = false;
      this.isCreateSeries = false;
      this.isCreateModel = false;
      this.getBrandList();
      if (this.$route.query.brandId) {
        this.getSeriesList();
      }
      if (this.$route.query.seriesId) {
        this.getModelList();
      }
    }
  },
  computed: {
    title() {
      if (this.isCreateBrand) {
        return '品牌';
      }
      return '';
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refreshBrand() {
      this.openBrand = false;
      this.getBrandList();
      window.top.postMessage({ method: 'setServiceCarTree' }, window.top.location.origin);
    },
    refreshSeries() {
      this.openSeries = false;
      this.getSeriesList();
      window.top.postMessage({ method: 'setServiceCarTree' }, window.top.location.origin);
    },
    getInitInfo() {
      this.brandId = this.$route.query.brandId;
      if (!this.brandId) {
        // 创建品牌
        this.isCreateBrand = true;
        return;
      }
      // 可能创建系列
      this.isCreateSeries = true;
      this.seriesId = this.$route.query.seriesId;
      if (this.seriesId) {
        // 创建型号
        this.isCreateModel = true;
      }
    },
    getBrandList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        type: this.type || '',
        id: this.id || ''
      };
      serviceProjectService.getMotorcycleType(
        params,
        data => {
          this.brandList = data.list;
          this.getInitInfo();
          if (this.brandList.length > 0) {
            if (!this.isCreateSeries && !this.isCreateModel) {
              this.brandId = this.brandList[0].id;
            }
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getSeriesList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        type: 'carSeries',
        id: this.brandId
      };
      serviceProjectService.getMotorcycleType(
        params,
        data => {
          this.seriesList = data.list;
          if (this.seriesList.length > 0) {
            if (!this.isCreateModel) {
              this.seriesId = this.seriesList[0].id;
            }
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getModelList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        type: 'carType',
        id: this.seriesId
      };
      serviceProjectService.getMotorcycleType(
        params,
        data => {
          this.modelList = data.list;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      if (this.isCreateModel) {
        this.createModel();
      } else if (this.isCreateSeries) {
        this.createSeries();
      } else if (this.isCreateBrand) {
        this.createBrand();
      }
    },
    createBrand() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        brandId: this.brandId,
        seriesId: '',
        typeId: '',
        name: this.form.name
      };
      serviceProjectService.CreateMotorcycleType(
        params,
        data => {
          this.$message.success('操作成功');
          window.top.postMessage({ method: 'setServiceCarTree' }, window.top.location.origin);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    createSeries() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        brandId: this.brandId,
        seriesId: this.seriesId,
        typeId: '',
        name: this.form.name
      };
      serviceProjectService.CreateMotorcycleType(
        params,
        data => {
          this.$message.success('操作成功');
          window.top.postMessage({ method: 'setServiceCarTree' }, window.top.location.origin);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    createModel() {
      if (this.form.name === '') {
        this.$message.warning('请添加车型名称');
        return;
      }

      if (this.typeList.length === 0) {
        this.$message.warning('请选择车型');
        return;
      }

      let params = {
        shopId: window.top.SHOP_ID || '',
        brandId: this.brandId,
        seriesId: this.seriesId,
        typeId: this.typeList.join(','),
        name: this.form.name
      };
      serviceProjectService.CreateMotorcycleType(
        params,
        data => {
          this.$message.success('操作成功');
          window.top.postMessage({ method: 'setServiceCarTree' }, window.top.location.origin);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    create() {},
    update() {}
  }
};
</script>

<style lang="scss">
.motorcycle-type {
  margin-top: 10px;
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    position: relative;
    z-index: 1;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
  }
  .brand-base-info {
    padding-top: 50px;
    .biz-save-button {
      position: relative;
      z-index: 1;
      justify-content: flex-start;
    }
  }
  .series-base-info {
    padding-top: 50px;
    .biz-save-button {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
