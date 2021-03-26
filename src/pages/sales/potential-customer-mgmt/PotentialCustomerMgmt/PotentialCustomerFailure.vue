<template>
  <biz-grid class="potential-customer-mgmt__failure" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="跟踪结果">
        <span v-if="formModel.failureTrackingResult === '0'">未战败</span>
        <span v-if="formModel.failureTrackingResult === '1'">已战败</span>
      </el-form-item>
      <el-form-item label="战败结果">
        <el-select v-model="formModel.failureResult" placeholder="请选择" :disabled="failure" style="width: 100%;" @change="handleResultChange">
          <el-option v-for="item in failureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="战败日期">
        <el-date-picker type="date" placeholder="选择下次回访日" format="yyyy-MM-dd" value-format="yyyy-MM-dd hh:mm:ss" v-model="formModel.failureTime" :disabled="failure"
          style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="战败原因">
        <el-select v-model="formModel.failureReason" placeholder="请选择" :disabled="failure" style="width: 100%;">
          <el-option v-for="item in reasonList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="战败详情">
        <el-input v-model="formModel.failureDesc" :disabled="failure" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="formModel.failureBrandId" placeholder="请选择" filterable style="width: 100%;" :disabled="failure" @change="handleBrandChange">
          <el-option v-for="(item,index) in brandList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列">
        <el-select v-model="formModel.failureSeriesId" placeholder="请选择" filterable :disabled="failure" style="width: 100%;" @change="handleSeriesChange">
          <el-option v-for="(item,index) in seriesList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车型">
        <el-select v-model="formModel.failureProductId" placeholder="请选择" filterable :disabled="failure" style="width: 100%;">
          <el-option v-for="(item,index) in modeList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="战败经销商">
        <el-input v-model="formModel.distributor" :disabled="failure" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="战败确认者">
        <span>{{formModel.failureSalesAdvisor.name}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formModel.failureRemarks" :disabled="failure" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
import { ROLE } from '@/utils/dims';

// 初始化时需要的一些数据
const listData = {
  failureList: [
    { label: '请选择', value: '' },
    { label: '放弃', value: 'giveup' },
    { label: '调级', value: 'adjust' }
  ],
  reasonList: [],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      disabled: false,
      auth: ['admin:potential.edit']
    }
  ]
};
// 车辆相关
const vehicleData = {
  data: {
    brandList: [],
    seriesList: [],
    modeList: []
  },
  methods: {
    queryBrandList() {
      http
        .get(potentialCustomerMgmt.failure.queryBrandList, {
          brandId: '',
          seriesId: ''
        })
        .then(data => {
          this.brandList = data.dataList;
        })
        .catch(errData => {
          this.brandList = errData;
        });
    },
    querySeriesList(val) {
      http
        .get(potentialCustomerMgmt.failure.querySeriesList, { brandId: val })
        .then(data => {
          this.seriesList = data.dataList;
        })
        .catch(errData => {
          this.seriesList = errData;
        });
    },
    queryTypeList(val) {
      http
        .get(potentialCustomerMgmt.failure.queryModeList, {
          brandId: this.formModel.failureBrandId,
          seriesId: val
        })
        .then(data => {
          this.modeList = data.dataList;
        })
        .catch(errData => {
          this.modeList = errData;
        });
    }
  },
  events: {
    handleBrandChange(val) {
      this.querySeriesList(val);

      this.$set(this.formModel, 'failureSeriesId', '');
      this.$set(this.formModel, 'failureProductId', '');
    },
    handleSeriesChange(val) {
      this.queryTypeList(val);

      this.$set(this.formModel, 'failureProductId', '');
    }
  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    failureResult: '',
    failureSalesAdvisor: { id: '', name: '' }
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    failure: false
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    handleResultChange(val) {
      // 如果为未选择，战败日期为空
      // 如果为其他，则战败日期默认选中当天
      if (val) {
        if (!this.formModel.failureTime) {
          this.$set(this.formModel, 'failureTime', new Date());
        }
      } else {
        this.$set(this.formModel, 'failureTime', '');
      }
    }
  },
  methods: {
    query() {
      let data = JSON.parse(JSON.stringify(this.consumerInfo));
      // 设置对象的默认值，并且整理字段
      let obj = data.potentialConsumer;
      obj.failureTime = obj.failureTime ? new Date(obj.failureTime) : undefined;
      obj.failureBrandId = obj.failureBrand ? obj.failureBrand.toString() : '';
      obj.failureSeriesId = obj.failureSeries
        ? obj.failureSeries.toString()
        : '';
      obj.failureProductId = obj.failureProduct
        ? obj.failureProduct.toString()
        : '';
      // 如果是战败，并且已经有确认者，则不可编辑保存
      if (
        obj.failureTrackingResult === '1' &&
        obj.failureSalesAdvisor &&
        obj.failureSalesAdvisor.id
      ) {
        this.failure = true;
        this.$set(this.operations[0], 'disabled', true);
      } else {
        this.failure = false;
        this.$set(this.operations[0], 'disabled', false);

        // 如果没有确认者，则根据当前用户的权限，如果是主管，则可以进行确认
        let user = this.getUser();
        obj.failureSalesAdvisor = this.checkRole(
          user.roleDatas,
          ROLE.salesmanAdmin
        )
          ? { id: user.id, name: user.realName }
          : { id: '', name: '' };
      }
      this.formModel = Object.assign(this.getDefaultModel(), obj);

      if (obj.failureBrandId) {
        this.querySeriesList(this.formModel.failureBrandId);
      }
      if (obj.failureSeriesId) {
        this.queryTypeList(this.formModel.failureSeriesId);
      }
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        token: '',
        id: this.formModel.id || this.itemId.id,
        failureResult: this.formModel.failureResult,
        failureTime: dateUtil.dateConverter(this.formModel.failureTime),
        failureReason: this.formModel.failureReason,
        failureDesc: this.formModel.failureDesc,
        distributor: this.formModel.distributor,
        failureRemarks: this.formModel.failureRemarks,
        failureBrandId: this.formModel.failureBrandId,
        failureSeriesId: this.formModel.failureSeriesId,
        failureProductId: this.formModel.failureProductId,
        failureSalesAdvisorId: this.formModel.failureSalesAdvisor.id,
        isFailure: !!this.formModel.failureResult
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = this.getSaveParams();
          http
            .post(potentialCustomerMgmt.failure.save, params)
            .then(data => {
              this.$message.success('保存成功');

              this.$emit('operationSuccess');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) {
                this.$message.warning(errData.errorMessage);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};

// 辅助
const utilData = {
  methods: {
    checkRole(list, role) {
      if (!list) return false;

      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].type) === role) return true;
      }

      return false;
    }
  }
};

export default {
  name: 'PotentialCustomerFailure',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...listData,
      ...formData.data,
      ...vehicleData.data,

      rules: {}
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo'])
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events,

    ...vehicleData.methods,
    ...vehicleData.events,

    ...utilData.methods
  },
  watch: {
    itemId(nVal, oVal) {
      // 设置相关列表
      this.reasonList = this.potentialInfo.failureReasons;
      this.$refs.form.resetFields();
      if (nVal.id) {
        this.query();
      }
    }
  },
  created() {
    this.queryBrandList();
    this.reasonList = this.potentialInfo.failureReasons;
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__failure {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    span {
      color: #606266;
    }
  }
}
</style>
