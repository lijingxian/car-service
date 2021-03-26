<template>
  <biz-grid class="create-vehicle">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" label-width="100px" :model="form" size="small" v-loading="loading">
      <el-form-item label="品牌：" prop="brandId">
        <el-select v-model="form.brandId" @change="getVehicleSeries" clearable style="width: 80%;">
          <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列：">
        <el-select v-model="form.seriesId" @change="getVehicleNames" clearable style="width: 80%;">
          <el-option v-for="item in seriesOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：">
        <el-select v-model="form.nameId" clearable style="width: 80%;">
          <el-option v-for="item in nameOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/commodity/commodity-mgmt/createVehicle';

export default {
  name: 'CreatVehicle',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:product.edit']
        }
      ],

      rules: {
        brandId: [{ required: true, message: '请选择品牌', trigger: ['blur', 'change'] }]
      },

      brandOptions: [],
      seriesOptions: [],
      nameOptions: [],

      form: {
        brandId: '',
        seriesId: '',
        nameId: ''
      }
    };
  },
  props: {
    open: {
      type: Boolean
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.brandOptions = [];
        this.seriesOptions = [];
        this.nameOptions = [];

        this.form.brandId = '';
        this.form.seriesId = '';
        this.form.nameId = '';
      } else {
        this.getVehicleBrands();
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    getVehicleBrands() {
      this.form.brandId = '';
      this.form.seriesId = '';
      this.form.nameId = '';

      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      service.getVehicleBrands(
        params,
        data => {
          this.brandOptions = data.brands;
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取品牌失败:', params);
        }
      );
    },
    getVehicleSeries() {
      this.form.seriesId = '';
      this.form.nameId = '';

      // 清空所选的品牌时,同时清空系列和名称列表
      if (this.form.brandId === '') {
        this.seriesOptions = [];
        this.nameOptions = [];
        return;
      }

      let params = {
        shopBrandId: this.form.brandId
      };
      service.getVehicleSeries(
        params,
        data => {
          this.seriesOptions = data.series;
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取系列失败:', params);
        }
      );
    },
    getVehicleNames() {
      this.form.nameId = '';

      // 清空所选的系列时,同时清空名称列表
      if (this.form.seriesId === '') {
        this.nameOptions = [];
        return;
      }

      let params = {
        brandId: this.form.brandId,
        seriesId: this.form.seriesId
      };
      service.getVehicleNames(
        params,
        data => {
          this.nameOptions = data.CarTypes;
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取名称失败:', params);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          let params = {
            shopId: window.top.SHOP_ID || '',
            brandId: this.form.brandId,
            seriesId: this.form.seriesId,
            type: this.form.nameId
          };
          service.createVehicle(
            params,
            data => {
              this.loading = false;
              this.$emit('operationSuccess');
              this.$message.success('创建整车成功');
            },
            // result_code 不是100的处理
            ErrorData => {
              this.loading = false;
              if (ErrorData.errorMessage !== '') {
                this.$message.warning(ErrorData.errorMessage);
              }
              console.log('创建整车失败');
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.create-vehicle {
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
