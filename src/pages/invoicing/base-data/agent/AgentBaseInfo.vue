<template>
  <biz-grid class="agent-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="上级代理商" prop="parentName">
        <el-input v-model="formModel.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="代理商级别" prop="grade">
        <el-input v-model="formModel.grade" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入门店名称"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formModel.address" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formModel.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formModel.phone" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formModel.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="启用" prop="state">
        <el-switch v-model="formModel.state" active-value="1" inactive-value="0" active-color="#ff7300" inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      auth: ['admin:agent.edit']
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  }
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    parentId: '',
    parentName: '',
    grade: '',
    name: '',
    shopId: '',
    address: '',
    contact: '',
    phone: '',
    email: '',
    state: '1',
    remark: '',
    sourceShopId: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
    handleOperate(name) {
      this[name]();
    }
  },
  methods: {
    initModel(model) {
      if (model) {
        model.parentName = this.parentName;
        this.formModel = Object.assign(this.getDefaultModel(), model);
        if (model.grade === '0') {
          this.formModel.grade = '一级';
        } else if (model.grade === '1') {
          this.formModel.grade = '二级';
        } else {
          this.formModel.grade = '三级';
        }
      } else {
        this.resetModel();
        this.formModel.parentId = this.parentId;
        this.formModel.parentName = this.parentName;
        this.formModel.grade = String(Number(this.grade) + 1);
        if (this.formModel.grade === '0') {
          this.formModel.grade = '一级';
        } else if (this.formModel.grade === '1') {
          this.formModel.grade = '二级';
        } else {
          this.formModel.grade = '三级';
        }
      }

      this.$refs.form.resetFields();
    },
    query() {
      this.loading = true;
      http
        .get(urls.invoicing.supplierMgmt.shopSupplier, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId.id,
          cooperationType: '1'
        })
        .then(data => {
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
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

    getSaveParams() {
      return {
        id: this.formModel.id,
        parentId: this.parentId,
        grade: this.grade,
        name: this.formModel.name,
        address: this.formModel.address,
        phone: this.formModel.phone,
        contact: this.formModel.contact,
        email: this.formModel.email,
        state: this.formModel.state,
        remark: this.formModel.remark,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '1',
        sourceShopId: this.formModel.sourceShopId
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');
            if (!this.formModel.id) {
              this.formModel.id = data.id;
            }
            this.$emit('operationSuccess', this.formModel.id);
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          if (this.formModel.id) {
            http
              .put(urls.invoicing.supplierMgmt.shopSupplier, this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post(urls.invoicing.supplierMgmt.shopSupplier, this.getSaveParams())
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
  name: 'AgentBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      ...initData,
      ...formData.data,

      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        phone: [
          {
            required: true,
            message: '电话不能少于5位,不能大于11位',
            trigger: 'blur',
            min: 5,
            max: 11
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
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
    },
    parentId: {
      type: String,
      default() {
        return '';
      }
    },
    parentName: {
      type: String
    },
    grade: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  created() {}
};
</script>

<style lang="scss">
.agent-mgmt__base-info {
  padding-top: 20px;
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
