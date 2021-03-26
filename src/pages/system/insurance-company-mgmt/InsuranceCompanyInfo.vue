<template>
  <biz-grid class="insurance-company-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="公司名称：" prop="name">
        <el-input placeholder="请输入公司名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="phoneNumber">
        <el-input placeholder="请输入电话" v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="logo" prop="logo">
        <biz-avatar-uploader-new v-model="form.logo" @uploadSuccess="uploadSuccess">
        </biz-avatar-uploader-new>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import Service from '@/service/system-setting/insurance-company-mgmt/insuranceCompanyMgmt';

export default {
  name: 'InsuranceCompanyInfo',
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        phoneNumber: '',
        logo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'change' }],
        phoneNumber: [
          {
            required: true,
            message: '电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        logo: [{ required: true, message: '请上传logo', trigger: 'change' }]
      },
      editorStyle: {
        height: '190px',
        width: '350px'
      }
    };
  },
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    id(Val) {
      if (this.open === true) {
        this.refresh();
      }
    },
    open(val) {
      if (!val) {
        this.clearFormData();
      } else {
        this.$refs.form.clearValidate();
        if (this.id === '') {
          this.refresh();
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    uploadSuccess() {
      this.$refs.form.clearValidate('logo');
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id === '') {
            this.add();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      Service.query(
        params,
        data => {
          this.form.name =
            data.insurance !== undefined ? data.insurance.name : '';
          this.form.phoneNumber =
            data.insurance !== undefined ? data.insurance.phoneNumber : '';
          this.form.logo =
            data.insurance !== undefined ? data.insurance.logo : '';
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    add() {
      let params = {
        name: this.form.name,
        phoneNumber: this.form.phoneNumber,
        logo: this.form.logo
      };
      Service.add(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.$emit('addSuccessNotification', data.id);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        name: this.form.name,
        phoneNumber: this.form.phoneNumber,
        logo: this.form.logo
      };
      Service.update(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshNotification');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.name = '';
      this.form.phoneNumber = '';
      this.form.logo = '';
    }
  }
};
</script>

<style lang="scss">
.insurance-company-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 50%;
  }
}
</style>
