<template>
  <biz-grid class="financial-program-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="机构类型" prop="type">
        <el-select v-model="formModel.type" placeholder="请选择机构类型" style="width: 100%;" @change="typeChange" :disabled="!!itemId.id">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formModel.mobile" type="phone" placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formModel.address" placeholder="请输入地址" maxlength="100"></el-input>
        <!-- <biz-map-pointer v-model="point" :address="formModel.address" @addressChange="handleAddressChange">
        </biz-map-pointer> -->
      </el-form-item>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="接口配置" name="baseinfo">
          <el-form-item label="接收接口" prop="receive">
            <el-input v-model="formModel.receive" placeholder="请输入接收接口"></el-input>
          </el-form-item>
          <el-form-item label="发送接口" prop="post">
            <el-input v-model="formModel.post" placeholder="请输入发送接口"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
// import { BizMapPointer } from '@/components/BizMapPointer';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const listData = {
  typeList: [{ value: '0', label: '金融' }, { value: '1', label: '保险' }],
  areaList: [],
  activeNames: ['baseinfo'],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    name: '',
    mobile: '',
    address: '',
    type: '0',
    isEnabled: '0',
    receive: '',
    post: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    typeChange() {
      this.$refs.form.clearValidate('type');
    },
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    initModel(model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    query() {
      this.loading = true;

      http
        .get('/admin/financialInstitution/queryFinancialInstitution.jhtml', { id: this.itemId.id })
        .then(data => {
          // 设置相关列表
          this.initModel(data.content);
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },
    handleAddressChange(val, city) {
      this.$set(this.formModel, 'address', val);
      this.$refs.form.clearValidate('address');
    },
    getSaveParams() {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        type: this.formModel.type,
        mobile: this.formModel.mobile,
        address: this.formModel.address,
        isEnabled: this.formModel.isEnabled,
        receive: this.formModel.receive,
        post: this.formModel.post
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.loading = false;
            this.$message.success('保存成功');
            if (!this.formModel.id) {
              this.formModel.id = data.id;
            }
            this.$emit('operationSuccess', this.formModel.id);
          };
          const failed = errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            this.loading = false;
          };
          const final = data => {
            this.loading = false;
          };

          if (this.formModel.id) {
            http
              .put('/admin/financialInstitution/updateFinancialInstitution.jhtml', this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post('/admin/financialInstitution/createFinancialInstitution.jhtml', this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'FinacialProgramBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
    // BizMapPointer
  },
  data() {
    return {
      ...listData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择机构类型', trigger: 'blur' }],
        mobile: [
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ]
      }
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
  computed: {},
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      this.activeNames = ['baseinfo'];
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.financial-program-mgmt__base-info {
  margin-top: 40px;
  padding: 40px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-checkbox-group {
      .el-checkbox {
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

    .golden-cudgel {
      transition: height 0.3s;
      height: 518px;
      overflow: hidden;

      &.collapsed {
        height: 32px;
      }
    }
  }
}
</style>
