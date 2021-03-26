<template>
  <biz-grid class="base-data-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="baseData" :rules="rules" v-loading="loading">
      <el-form-item label="品牌:" prop="brandId">
        <el-select v-model="baseData.brandId" placeholder="请选择品牌" style="width: 80%;" filterable @change="changeBrandId">
          <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列:" prop="seriesId">
        <el-select v-model="baseData.seriesId" placeholder="请选择系列" style="width: 80%;" filterable @change="changeSeriesId">
          <el-option v-for="item in serieses" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年款:" prop="noticDate">
        <el-select v-model="baseData.noticDate" placeholder="请选择或输入年款" style="width: 80%;" filterable allow-create clearable @change="changeNoticDate">
          <el-option v-for="item in noticDates" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号:" prop="type">
        <el-select v-model="baseData.type" placeholder="请选择或输入型号" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in types" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="燃油编号:" prop="gas">
        <el-select v-model="baseData.gas" placeholder="请选择或输入燃油编号" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in gases" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市区工况:" prop="urbanCondition">
        <el-input v-model="baseData.urbanCondition" clearable style="width: 80%;" placeholder="请输入市区工况"></el-input>
      </el-form-item>
      <el-form-item label="市郊工况:" prop="suburbanCondition">
        <el-input v-model="baseData.suburbanCondition" clearable style="width: 80%;" placeholder="请输入市郊工况"></el-input>
      </el-form-item>
      <el-form-item label="综合工况:" prop="comprehensiveCondition">
        <el-input v-model="baseData.comprehensiveCondition" clearable style="width: 80%;" placeholder="请输入综合工况"></el-input>
      </el-form-item>
      <el-form-item label="整备质量:" prop="weight">
        <el-input v-model="baseData.weight" clearable style="width: 80%;" placeholder="请输入整备质量"></el-input>
      </el-form-item>
      <el-form-item label="排量:" prop="pl">
        <el-input v-model="baseData.pl" clearable style="width: 80%;" placeholder="请输入排量">
          <template slot="append">ml</template>
        </el-input>
      </el-form-item>
      <el-form-item label="档位个数:" prop="gearboxes">
        <el-select v-model="baseData.gearboxes" placeholder="请选择或输入档位个数" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in gearboxesList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变速箱类型:" prop="gearboxesType">
        <el-select v-model="baseData.gearboxesType" placeholder="请选择或输入变速箱类型" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in gearboxesTypes" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前轮胎规格:" prop="tiresFront">
        <el-select v-model="baseData.tiresFront" placeholder="请选择或输入前轮胎规格" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in tiresFrontList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="后轮胎规格:" prop="tiresRear">
        <el-select v-model="baseData.tiresRear" placeholder="请选择或输入后轮胎规格" style="width: 80%;" filterable allow-create clearable>
          <el-option v-for="item in tiresRearList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-input v-model="baseData.status" clearable style="width: 80%;" placeholder="请输入状态"></el-input>
      </el-form-item>
      <el-form-item label="邮箱容积:" prop="oilVolume">
        <el-input v-model="baseData.oilVolume" clearable style="width: 80%;" placeholder="请输入邮箱容积"></el-input>
      </el-form-item>
      <el-form-item label="启停:" prop="startStop">
        <el-input v-model="baseData.startStop" clearable style="width: 80%;" placeholder="请输入启停"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/system-setting/base-data-mgmt/baseDataSetting';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  name: 'BaseDataSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    const isNoticDateValid = (rule, rules, callback) => {
      if (
        this.baseData.noticDate === '' ||
        (Number(this.baseData.noticDate) >= 1886 &&
          Number(this.baseData.noticDate) <= 9999)
      ) {
        callback();
      } else {
        callback(new Error('请输入有效年份 如:2018'));
      }
    };

    const isGearboxesValid = (rule, rules, callback) => {
      if (
        this.baseData.gearboxes === '' ||
        Number(this.baseData.gearboxes) >= 0
      ) {
        callback();
      } else {
        callback(new Error('请输入有效数字 如:3'));
      }
    };

    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        brandId: [{ required: true, message: '请选择品牌', trigger: ['blur', 'change'] }],
        seriesId: [{ required: true, message: '请选择系列', trigger: ['blur', 'change'] }],
        noticDate: [
          { required: false, trigger: 'blur', validator: isNoticDateValid }
        ],
        type: [{ required: true, message: '型号不能为空', trigger: ['blur', 'change'] }],
        gearboxes: [
          { required: false, trigger: 'blur', validator: isGearboxesValid }
        ]
      },
      loading: false,
      baseData: this.getDefaultBaseData(),
      brands: [],
      serieses: [],
      types: [],
      gases: [],
      noticDates: [],
      gearboxesList: [],
      gearboxesTypes: [],
      tiresFrontList: [],
      tiresRearList: []
    };
  },
  props: {
    itemId: {
      type: String
    },
    open: {
      type: Boolean
    }
  },
  created() {},
  methods: {
    query() {
      console.log('BaseDataSetting::query() itemId:', this.itemId);
      if (this.itemId) {
        this.queryWidthId(Number(this.itemId));
      } else {
        this.queryWidthOutId();
      }
    },
    queryWidthId(id) {
      this.loading = true;
      let params = {
        id: id
      };
      service.queryBaseData(
        params,
        data => {
          this.baseData = data.baseData;
          this.brands = data.brands;
          this.serieses = data.serieses;
          this.types = this.sortList(data.types);
          this.gases = this.sortList(data.gases);
          this.noticDates = this.sortList(data.noticDates);
          this.gearboxesList = this.sortList(data.gearboxesList);
          this.gearboxesTypes = this.sortList(data.gearboxesTypes);
          this.tiresFrontList = this.sortList(data.tiresFrontList);
          this.tiresRearList = this.sortList(data.tiresRearList);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log('queryWidthId', id);
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取基础数据详情失败', params);
        }
      );
    },
    queryWidthOutId() {
      this.loading = true;
      let params = {
        id: ''
      };
      service.queryBaseData(
        params,
        data => {
          this.baseData = data.baseData;
          this.brands = data.brands;
          this.serieses = data.serieses;
          this.types = this.sortList(data.types);
          this.gases = this.sortList(data.gases);
          this.noticDates = this.sortList(data.noticDates);
          this.gearboxesList = this.sortList(data.gearboxesList);
          this.gearboxesTypes = this.sortList(data.gearboxesTypes);
          this.tiresFrontList = this.sortList(data.tiresFrontList);
          this.tiresRearList = this.sortList(data.tiresRearList);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log('queryWidthOutId');
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取基础数据详情失败', params);
        }
      );
    },
    getDefaultBaseData() {
      return {
        id: '',
        brandId: '',
        brandEnglish: '',
        brandName: '',
        brandLogo: '',
        seriesId: '',
        seriesName: '',
        type: '',
        gas: '',
        noticDate: '',
        urbanCondition: '',
        suburbanCondition: '',
        comprehensiveCondition: '',
        weight: '',
        pl: '',
        gearboxes: '',
        gearboxesType: '',
        tiresFront: '',
        tiresRear: '',
        status: '',
        oilVolume: '',
        startStop: ''
      };
    },
    operate(name) {
      this[name]();
    },
    save() {
      console.log('save:', this.baseData);
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = this.getSaveParams();

          this.loading = true;
          if (this.baseData.id) {
            service.updateBaseData(
              params,
              data => {
                this.loading = false;
                this.$message.success('更新基础数据成功');
                this.$emit('operationSuccess');
                this.query();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                if (ErrorData.errorMessage !== '') {
                  this.$message.warning(ErrorData.errorMessage);
                }
                console.log('更新基础数据失败 id:', this.baseData.id);
              }
            );
          } else {
            service.saveBaseData(
              params,
              data => {
                this.loading = false;
                this.$message.success('添加基础数据成功');
                this.$emit('operationSuccess');
                this.$emit('createdBaseDataSuccess', data.id);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                if (ErrorData.errorMessage !== '') {
                  this.$message.warning(ErrorData.errorMessage);
                }
                console.log('添加基础数据失败');
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    getSaveParams() {
      return {
        id: this.baseData.id,
        brandId: this.baseData.brandId,
        brandEnglish: '',
        brandName: '',
        brandLogo: '',
        seriesId: this.baseData.seriesId,
        seriesName: '',
        type: this.baseData.type,
        gas: this.baseData.gas,
        noticDate: this.baseData.noticDate,
        urbanCondition: this.baseData.urbanCondition,
        suburbanCondition: this.baseData.suburbanCondition,
        comprehensiveCondition: this.baseData.comprehensiveCondition,
        weight: this.baseData.weight,
        pl: this.baseData.pl,
        gearboxes: this.baseData.gearboxes,
        gearboxesType: this.baseData.gearboxesType,
        tiresFront: this.baseData.tiresFront,
        tiresRear: this.baseData.tiresRear,
        status: this.baseData.status,
        oilVolume: this.baseData.oilVolume,
        startStop: this.baseData.startStop
      };
    },
    changeBrandId: async function() {
      if (this.baseData.brandId === '') {
        return;
      }
      this.loading = true;
      let params = {
        brandId: this.baseData.brandId
      };
      try {
        let response = await axios.get(
          urls.systemSetting.getBaseDataSeriesList,
          {
            params: params
          }
        );

        this.baseData.seriesId = '';
        this.baseData.type = '';
        this.baseData.gas = '';
        this.baseData.noticDate = '';
        this.baseData.gearboxes = '';
        this.baseData.gearboxesType = '';
        this.baseData.tiresFront = '';
        this.baseData.tiresRear = '';

        this.serieses = response.data.serieses;
        this.types = [];
        this.gases = [];
        this.noticDates = [];
        this.gearboxesList = [];
        this.gearboxesTypes = [];
        this.tiresFrontList = [];
        this.tiresRearList = [];
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log('获取系列失败', error);
      }
    },
    changeSeriesId: async function() {
      if (this.baseData.seriesId === '') {
        return;
      }
      this.loading = true;
      let params = {
        seriesId: this.baseData.seriesId
      };
      try {
        let response = await axios.get(
          urls.systemSetting.getBaseDataOptionList,
          {
            params: params
          }
        );

        this.baseData.type = '';
        this.baseData.gas = '';
        this.baseData.noticDate = '';
        this.baseData.gearboxes = '';
        this.baseData.gearboxesType = '';
        this.baseData.tiresFront = '';
        this.baseData.tiresRear = '';

        this.types = this.sortList(response.data.types);
        this.gases = this.sortList(response.data.gases);
        this.noticDates = this.sortList(response.data.noticDates);
        this.gearboxesList = this.sortList(response.data.gearboxesList);
        this.gearboxesTypes = this.sortList(response.data.gearboxesTypes);
        this.tiresFrontList = this.sortList(response.data.tiresFrontList);
        this.tiresRearList = this.sortList(response.data.tiresRearList);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log('获取其它属性失败', error);
      }
    },
    changeNoticDate: async function() {
      if (this.baseData.seriesId === '') {
        return;
      }
      this.loading = true;
      let params = {
        seriesId: this.baseData.seriesId,
        noticDate: this.baseData.noticDate
      };
      try {
        let response = await axios.post(
          urls.systemSetting.getBaseDataTypeList,
          params
        );

        this.baseData.type = '';
        this.types = this.sortList(response.data.types);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log('获取型号失败', error);
      }
    },
    sortList(list) {
      let arr = [];
      if (list.length !== 0) {
        arr = list;
      }

      arr.sort(function(a, b) {
        return a.localeCompare(b);
      });

      return arr;
    }
  },
  computed: {},
  watch: {
    itemId(Val) {
      if (this.open === true) {
        this.query();
      }
    },
    open(val) {
      if (!val) {
        this.baseData = this.getDefaultBaseData();
        this.brands = [];
        this.serieses = [];
        this.types = [];
        this.gases = [];
        this.noticDates = [];
        this.gearboxesList = [];
        this.gearboxesTypes = [];
        this.tiresFrontList = [];
        this.tiresRearList = [];
      } else {
        if (this.itemId === '') {
          this.query();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.base-data-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
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
    width: 100px;
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
}
</style>
