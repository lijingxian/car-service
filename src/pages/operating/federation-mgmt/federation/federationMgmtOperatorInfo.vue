<template>
  <biz-grid class="fedration-mgmt-operator-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="上级运营商">
        <el-input :value="parentName || name" disabled=""></el-input>
      </el-form-item>
      <el-form-item label="运营商名称" prop="name">
        <el-input placeholder="请输入运营商名称" v-model="form.name" maxlength="20" minlength="1"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <biz-map-pointer v-model="point" :address="form.address" @addressChange="handleAddressChange">
        </biz-map-pointer>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="logo" prop="head">
        <BizAvatarUploaderNew v-model="form.head">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-radio-group v-model="form.isEnabled">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizMapPointer } from '@/components/BizMapPointer';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/federation-mgmt/federationMgmt';
export default {
  name: 'FederationMgmtInfo',
  props: {
    itemId: {
      type: String
    },
    type: {
      type: String,
      default: ''
    },
    parent: {
      type: String,
      default: ''
    },
    parentType: {
      type: String,
      default: ''
    },
    parentName: {
      type: String,
      default: ''
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizMapPointer,
    BizAvatarUploaderNew
  },
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
  data() {
    return {
      showSetting: false,
      showUnionType: true,
      name: '',
      rules: {
        name: [{ max: 20, message: '长度不能大于20位', trigger: 'blur', required: true }],
        address: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      // 用户信息
      form: {
        id: '',
        name: '',
        parent: '',
        address: '',
        latBaidu: '',
        lngBaidu: '',
        phone: '',
        head: '',
        remark: '',
        isEnabled: '1'
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:union.manage.edit']
        }
      ],
      loading: false,
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: ''
    };
  },
  created() {
    if (this.itemId && this.type === 'operator') {
      this.queryStoreOrOperator();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal && this.type === 'operator') {
        this.queryStoreOrOperator();
      } else {
        this.form = {
          id: '',
          name: '',
          parent: '',
          address: '',
          latBaidu: '',
          lngBaidu: '',
          phone: '',
          head: '',
          remark: '',
          isEnabled: '1'
        };
      }
    }
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    queryStoreOrOperator() {
      service.query(
        {
          id: this.itemId || '',
          type: 'operator'
        },
        data => {
          this.form = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryParentOperator(id) {
      service.query(
        {
          id: id || '',
          type: 'operator'
        },
        data => {
          this.name = data.content.name;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.name = '';
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    save() {
      if (this.form.name === '') {
        this.$message.warning('请填写运营商名称');
        this.loading = false;
        return false;
      }
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.itemId) {
            service.updateOperator(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess', {
                  id: this.parent,
                  userType: this.parentType
                });
                this.$nextTick(() => {
                  if (!this.parent) {
                    this.$emit('operationSuccess', {
                      id: this.itemId,
                      userType: this.type
                    });
                  }
                });
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            if (this.form.address === '') {
              this.$message.warning('请填写地址');
              this.loading = false;
              return false;
            }
            service.addOperator(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess', {
                  id: this.parent,
                  userType: this.parentType
                });
                this.$nextTick(() => {
                  if (!this.parent) {
                    this.$emit('operationSuccess', {
                      id: this.itemId,
                      userType: this.type
                    });
                  }
                });
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          }
        }
      });
    },
    getSaveParams() {
      return {
        id: this.itemId,
        name: this.form.name,
        parent: this.form.parent || this.parent,
        address: this.form.address,
        latBaidu: this.form.latBaidu,
        lngBaidu: this.form.lngBaidu,
        phone: this.form.phone,
        head: this.form.head,
        remark: this.form.remark,
        isEnabled: this.form.isEnabled
      };
    },
    isShow(showSetting) {
      this.showSetting = !showSetting;
    },
    showPeoplePicker(e) {
      this.showDialog = true;
    },
    handleAddressChange(val) {
      this.$set(this.form, 'address', val);
      this.$refs.form.clearValidate('address');
    },
    handleUploadSuccess(url) {
      this.$set(this.form, 'head', url);
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ];
      // this.queryPeople(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    dialogFilterDataChange(filters) {
      // this.queryPeople(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      // this.queryPeople(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      // this.queryPeople(this.getDialogQueryParams());
    },
    print() {
      window.open(
        document.location.protocol +
          '//' +
          window.location.host +
          '/#/qrcode-print?img=' +
          this.form.qrCodePath +
          '&shopName=' +
          this.form.name
      );
    },
    view() {
      window.open('http://' + window.location.host + this.form.qrCodePath);
    },
    dialogOperate(name) {}
  }
};
</script>

<style lang="scss">
.fedration-mgmt-operator-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input {
    width: 70%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
