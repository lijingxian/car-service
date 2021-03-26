<template>
  <biz-grid class="system-setting-mgmt" v-loading="loading">
    <div class="other-setting">
      <div slot="top" class="header-button">
        <biz-header :operations="operations" @operate="operate">
        </biz-header>
      </div>
      <el-form ref="form" :rules="rules" :model="form" size="small">
        <el-form-item label="货币符号：" prop="currencySign">
          <el-input placeholder="请输入货币符号" v-model="form.currencySign" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="货币单位：" prop="currencyUnit">
          <el-input placeholder="请输入货币单位" v-model="form.currencyUnit" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="库存警告数：" prop="stockAlertCount">
          <el-input placeholder="请输入库存警告数" v-model="form.stockAlertCount" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="库存分配时间点：" prop="stockAllocationTime">
          <el-select v-model="form.stockAllocationTime" placeholder="请选择库存分配时间点">
            <el-option v-for="option of stockAllocationTimes" :key="option.id" :label="option.name" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认积分换算比例：" prop="defaultPointScale">
          <el-input placeholder="请输入默认积分换算比例" v-model="form.defaultPointScale" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="是否开启开发模式：" prop="isDevelopmentEnabled ">
          <el-radio v-model="form.isDevelopmentEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isDevelopmentEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否开启评论：" prop="isReviewEnabled">
          <el-radio v-model="form.isReviewEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isReviewEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否审核评论：" prop="isReviewCheck">
          <el-radio v-model="form.isReviewCheck" label="true">是</el-radio>
          <el-radio v-model="form.isReviewCheck" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="评论权限：" prop="reviewAuthority">
          <el-select v-model="form.reviewAuthority" placeholder="请选择评论权限">
            <el-option v-for="option of reviewAuthorities" :key="option.id" :label="option.name" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启咨询：" prop="isConsultationEnabled">
          <el-radio v-model="form.isConsultationEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isConsultationEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否审核咨询：" prop="isConsultationCheck">
          <el-radio v-model="form.isConsultationCheck" label="true">是</el-radio>
          <el-radio v-model="form.isConsultationCheck" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="咨询权限：" prop="consultationAuthority">
          <el-select v-model="form.consultationAuthority" placeholder="请选择咨询权限">
            <el-option v-for="option of consultationAuthorities" :key="option.id" :label="option.name" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启发票功能：" prop="isInvoiceEnabled">
          <el-radio v-model="form.isInvoiceEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isInvoiceEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否开启含税价：" prop="isTaxPriceEnabled">
          <el-radio v-model="form.isTaxPriceEnabled" label="true">是</el-radio>
          <el-radio v-model="form.isTaxPriceEnabled" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="税率：" prop="taxRate">
          <el-input placeholder="请输入税率" v-model="form.taxRate" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="Cookie路径：" prop="cookiePath">
          <el-input placeholder="请输入Cookie路径" v-model="form.cookiePath" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="Cookie作用域：" prop="cookieDomain">
          <el-input placeholder="请输入Cookie作用域" v-model="form.cookieDomain" class="input-nomal-width"></el-input>
        </el-form-item>
        <el-form-item label="快递100授权KEY：" prop="kuaidi100Key">
          <el-input placeholder="请输入快递100授权KEY" v-model="form.kuaidi100Key" class="input-nomal-width"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import Service from '@/service/system-setting/system-setting-mgmt/systemSettingMgmt';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'OtherSetting',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      loading: false,
      form: {
        currencySign: '',
        currencyUnit: '',
        stockAlertCount: '',
        stockAllocationTime: '',
        defaultPointScale: '',
        isDevelopmentEnabled: 'false',
        isReviewEnabled: 'false',
        isReviewCheck: 'false',
        reviewAuthority: '',
        isConsultationEnabled: 'false',
        isConsultationCheck: 'false',
        consultationAuthority: '',
        isInvoiceEnabled: 'false',
        isTaxPriceEnabled: 'false',
        taxRate: '',
        cookiePath: '/',
        cookieDomain: '',
        kuaidi100Key: ''
      },
      rules: {
        currencySign: [
          {
            required: true,
            message: '请输入货币符号',
            trigger: 'focus'
          }
        ],
        currencyUnit: [
          {
            required: true,
            message: '请输入货币单位',
            trigger: 'focus'
          }
        ],
        stockAlertCount: [
          {
            required: true,
            message: '请输入库存警告数',
            trigger: 'focus'
          }
        ],
        defaultPointScale: [
          {
            required: true,
            message: '请输入默认积分换算比例',
            trigger: 'focus'
          }
        ],
        taxRate: [{ required: true, message: '请输入税率', trigger: 'focus' }],
        cookiePath: [
          { required: true, message: '请输入Cookie路径', trigger: 'focus' }
        ]
      },
      stockAllocationTimes: [],
      reviewAuthorities: [],
      consultationAuthorities: []
    };
  },
  components: {
    BizHeader,
    BizGrid
  },
  props: {},
  watch: {},
  created() {
    this.refresh();
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        name: 'otherSetting'
      };
      Service.query(
        params,
        data => {
          this.form.currencySign =
            data.settingList !== undefined ? data.settingList.currencySign : '';
          this.form.currencyUnit =
            data.settingList !== undefined ? data.settingList.currencyUnit : '';
          this.form.stockAlertCount =
            data.settingList !== undefined
              ? data.settingList.stockAlertCount
              : '';
          this.form.stockAllocationTime =
            data.settingList !== undefined
              ? data.settingList.stockAllocationTime
              : '';
          this.form.defaultPointScale =
            data.settingList !== undefined
              ? data.settingList.defaultPointScale
              : '';
          this.form.isDevelopmentEnabled =
            data.settingList !== undefined
              ? data.settingList.isDevelopmentEnabled
              : '';
          this.form.isReviewEnabled =
            data.settingList !== undefined
              ? data.settingList.isReviewEnabled
              : '';
          this.form.isReviewCheck =
            data.settingList !== undefined
              ? data.settingList.isReviewCheck
              : '';
          this.form.reviewAuthority =
            data.settingList !== undefined
              ? data.settingList.reviewAuthority
              : '';
          this.form.isConsultationEnabled =
            data.settingList !== undefined
              ? data.settingList.isConsultationEnabled
              : '';
          this.form.isConsultationCheck =
            data.settingList !== undefined
              ? data.settingList.isConsultationCheck
              : '';
          this.form.consultationAuthority =
            data.settingList !== undefined
              ? data.settingList.consultationAuthority
              : '';
          this.form.isInvoiceEnabled =
            data.settingList !== undefined
              ? data.settingList.isInvoiceEnabled
              : '';
          this.form.isTaxPriceEnabled =
            data.settingList !== undefined
              ? data.settingList.isTaxPriceEnabled
              : '';
          this.form.taxRate =
            data.settingList !== undefined ? data.settingList.taxRate : '';
          this.form.cookiePath =
            data.settingList !== undefined ? data.settingList.cookiePath : '';
          this.form.cookieDomain =
            data.settingList !== undefined ? data.settingList.cookieDomain : '';
          this.form.kuaidi100Key =
            data.settingList !== undefined ? data.settingList.kuaidi100Key : '';

          this.stockAllocationTimes = data.stockAllocationTimes;
          this.reviewAuthorities = data.reviewAuthorities;
          this.consultationAuthorities = data.consultationAuthorities;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        currencySign: this.form.currencySign,
        currencyUnit: this.form.currencyUnit,
        stockAlertCount: this.form.stockAlertCount,
        stockAllocationTime: this.form.stockAllocationTime,
        defaultPointScale: this.form.defaultPointScale,
        isDevelopmentEnabled: this.form.isDevelopmentEnabled,
        isReviewEnabled: this.form.isReviewEnabled,
        isReviewCheck: this.form.isReviewCheck,
        reviewAuthority: this.form.reviewAuthority,
        isConsultationEnabled: this.form.isConsultationEnabled,
        isConsultationCheck: this.form.isConsultationCheck,
        consultationAuthority: this.form.consultationAuthority,
        isInvoiceEnabled: this.form.isInvoiceEnabled,
        isTaxPriceEnabled: this.form.isTaxPriceEnabled,
        taxRate: this.form.taxRate,
        cookiePath: this.form.cookiePath,
        cookieDomain: this.form.cookieDomain,
        kuaidi100Key: this.form.kuaidi100Key
      };
      Service.update(
        params,
        data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        },
        ErrorData => {
          this.$message({
            title: '警告',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
        }
      );
    },
    clearFormData() {
      this.form.currencySign = '';
      this.form.currencyUnit = '';
      this.form.stockAlertCount = '';
      this.form.stockAllocationTime = '';
      this.form.defaultPointScale = '';
      this.form.isDevelopmentEnabled = 'false';
      this.form.isReviewEnabled = 'false';
      this.form.isReviewCheck = 'false';
      this.form.reviewAuthority = '';
      this.form.isConsultationEnabled = 'false';
      this.form.isConsultationCheck = 'false';
      this.form.consultationAuthority = '';
      this.form.isInvoiceEnabled = 'false';
      this.form.isTaxPriceEnabled = 'false';
      this.form.taxRate = '';
      this.form.cookiePath = '/';
      this.form.cookieDomain = '';
      this.form.kuaidi100Key = '';
    }
  }
};
</script>

<style lang="scss">
.other-setting {
  .header-button {
    margin-top: 5px;
    margin-left: 15px;
  }
  .biz-save-button {
    margin-top: 5px;
  }
  .el-input {
    width: 40%;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    margin-top: 0px;
    margin-left: 0%;
  }
  .el-form-item__label {
    width: 200px;
    text-align: right;
    vertical-align: middle;
    float: left;
    padding: 0 12px 0 0;
  }
  .input-picture-setting {
    width: 100px;
  }
  .input-nomal-width {
    width: 360px;
  }
  .el-select {
    width: 360px;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-col {
    width: 200px;
  }
}
</style>
