<template>
  <biz-grid class="rescue-org-item">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input placeholder="请输入电话" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <biz-map-pointer v-model="point" :address="form.address" @addressChange="handleAddressChange">
        </biz-map-pointer>
      </el-form-item>
      <el-form-item label="营业执照号" prop="bussinessLicenseCode">
        <el-input placeholder="请输入营业执照号" v-model="form.bussinessLicenseCode"></el-input>
      </el-form-item>
      <el-form-item label="注册资金(万元)" prop="registeredCapital">
        <el-input-number :min="min" :precision="precision" placeholder="请输入注册资金" v-model="form.registeredCapital">
        </el-input-number>
      </el-form-item>
      <el-form-item label="营业范围" prop="bussinessScope">
        <el-input placeholder="请填写营业范围" type="textarea" :rows="2" v-model="form.bussinessScope"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizMapPointer } from '@/components/BizMapPointer';
export default {
  name: 'RescueOrgItem',
  data() {
    // let checkPhone = (rule, value, callback) => {
    //   if (!Number.isInteger(Number(value))) {
    //     callback(new Error('请输入数字值'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      precision: 2,
      min: 0,
      isCreated: true,
      loading: false,
      form: {
        id: '',
        name: '',
        phone: '',
        address: '',
        registeredCapital: '50',
        bussinessLicenseCode: '',
        bussinessScope: '汽车维修、汽车养护、汽车装饰、汽车美容、汽车清洗、汽车改装、汽车租赁……',
        lngBaidu: '',
        latBaidu: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:cooperaRescueOrg.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      }
    };
  },
  components: { BizGrid, BizSaveButton, BizMapPointer },
  computed: {
    point: {
      get() {
        return {
          lng: this.form.lngBaidu,
          lat: this.form.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.form.lngBaidu = nVal.lng;
          this.form.latBaidu = nVal.lat;
        }
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      if (this.isCreated) {
        this.create();
      } else {
        this.update();
      }
    },
    handleAddressChange(val) {
      this.$set(this.form, 'address', val);
      this.$refs.form.clearValidate('address');
    },
    refresh(id) {
      this.isCreated = false;
      this.$refs.form.clearValidate();
      let params = {
        id: id,
        shopId: window.top.SHOP_ID || ''
      };
      serviceProjectService.getRescueOrg(
        params,
        data => {
          this.form.address = data.company.address;
          this.form.id = data.company.id;
          this.form.bussinessLicenseCode = data.company.bussinessLicenseCode;
          this.form.bussinessScope = data.company.bussinessScope;
          this.form.name = data.company.name;
          this.form.phone = data.company.phone;
          this.form.registeredCapital = data.company.registeredCapital;
          this.form.lngBaidu = data.company.lngBaidu;
          this.form.latBaidu = data.company.latBaidu;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    create() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = {
            shopId: window.top.SHOP_ID || '',
            bussinessScope: this.form.bussinessScope,
            registeredCapital: this.form.registeredCapital,
            bussinessLicenseCode: this.form.bussinessLicenseCode,
            name: this.form.name,
            address: this.form.address,
            phone: this.form.phone,
            lngBaidu: this.form.lngBaidu,
            latBaidu: this.form.latBaidu
          };
          serviceProjectService.createRescueOrg(
            params,
            data => {
              this.$emit('created');
              this.loading = false;
              this.$message.success('添加成功');
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    update() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = {
            id: this.form.id,
            shopId: window.top.SHOP_ID || '',
            bussinessScope: this.form.bussinessScope,
            registeredCapital: this.form.registeredCapital,
            bussinessLicenseCode: this.form.bussinessLicenseCode,
            name: this.form.name,
            address: this.form.address,
            phone: this.form.phone,
            lngBaidu: this.form.lngBaidu,
            latBaidu: this.form.latBaidu
          };
          serviceProjectService.updateRescueOrg(
            params,
            data => {
              this.$emit('created');
              this.loading = false;
              this.$message.success('更新成功');
            },
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    clear() {
      this.isCreated = true;
      this.form.name = '';
      this.form.id = '';
      this.form.phone = '';
      this.form.address = '';
      this.form.registeredCapital = '50';
      this.form.bussinessLicenseCode = '';
      this.form.bussinessScope = '汽车维修、汽车养护、汽车装饰、汽车美容、汽车清洗、汽车改装、汽车租赁……';
    }
  }
};
</script>

<style lang="scss">
.rescue-org-item {
  margin-top: 10px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
  }
}
</style>
