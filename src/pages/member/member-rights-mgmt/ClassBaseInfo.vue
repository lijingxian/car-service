<template>
  <biz-grid class="class-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="memo">
        <el-input v-model="formModel.memo" type="textarea" placeholder="请输入分类描述"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
export default {
  name: 'MemberBaseInfo',
  props: {
    classId: {
      type: String
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      showForm: false,
      isCreated: false,
      level: '',
      totalPoint: '',
      // 用户信息
      formModel: {
        grade: '0',
        name: '',
        memo: '',
        id: this.classId || ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  created() {},
  watch: {
    classId(nVal, oVal) {
      this.$refs.form.clearValidate();
      this.classId && this.query();
      if (!this.classId) this.formModel = { grade: '0', name: '', memo: '' };
    },
    open(nVal, oVal) {
      if (nVal && this.isCreated && !this.classId) {
        this.formModel = { grade: '0', name: '', memo: '' };
      }
    }
  },
  mounted() {},
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    operate(name) {
      this[name]();
    },
    query() {
      this.loading = true;
      service.queryrightsClass(
        {
          id: this.classId,
          grade: '0',
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.loading = false;
          this.formModel = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.classId &&
            service.editRightsClass(
              this.formModel,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          !this.classId &&
            service.createRightsClass(
              this.formModel,
              data => {
                this.isCreated = true;
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
        }
      });
    }
  }
};
</script>

<style lang="scss">
.class-base-info {
  padding: 20px;
  .biz-save-button {
    float: left;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
