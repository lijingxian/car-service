<template>
  <biz-grid class="rights-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="权益分类" prop="categoryId">
        <el-select v-model="formModel.categoryId" placeholder="请选择权益分类">
          <el-option v-for="item in classifies" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入权益名称"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="inDateType">
        <el-select v-model="formModel.inDateType" @change="clear">
          <el-option label="请选择" value=""></el-option>
          <el-option label="不限" value="unlimited"></el-option>
          <el-option label="一个月" value="one_month"></el-option>
          <el-option label="三个月" value="three_months"></el-option>
          <el-option label="六个月" value="six_months"></el-option>
          <el-option label="一年" value="one_year"></el-option>
          <el-option label="两年" value="two_years"></el-option>
          <el-option label="自定义" value="user_define"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="截止时间" v-if="formModel.inDateType==='user_define'" prop="limitDate">
        <el-date-picker v-model="formModel.limitDate" placeholder="请选择" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="次数限制" prop="countLimit">
        <el-radio-group v-model="formModel.countLimit">
          <el-radio label="limit">限制</el-radio>
          <el-radio label="no_limit">不限制</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="权益图标" prop="logo">
        <BizAvatarUploaderNew v-model="formModel.logo" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="权益说明" prop="description">
        <el-input v-model="formModel.description" type="textarea" placeholder="请输入权益说明"></el-input>
      </el-form-item>
      <el-form-item label="使用说明" prop="memo">
        <el-input v-model="formModel.memo" type="textarea" placeholder="请输入使用说明"></el-input>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { VueCropper } from '@/components/BizForm';
export default {
  name: 'MemberBaseInfo',
  props: {
    classId: {
      type: String
    },
    rightsId: {
      type: String
    }
  },
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    VueCropper
  },
  data() {
    return {
      openV: false,
      picUrl: '',
      loading: false,
      formLoading: false,
      classifies: [],
      // 用户信息
      formModel: {
        categoryId: '',
        name: '',
        inDateType: '',
        countLimit: '',
        logo: '/resources/admin/images/icon_vip.png',
        description: '',
        memo: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入权益名称', trigger: 'blur' }],
        inDateType: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
        limitDate: [{ required: true, message: '请输入截止日期', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.init();
  },
  watch: {
    rightsId(nVal, oVal) {
      this.$refs.form.resetFields();
      this.rightsId && this.query();
      if (!this.rightsId) {
        this.formModel = { grade: '1', categoryId: this.classId, logo: '/resources/admin/images/icon_vip.png' };
      }
    },
    classId(nVal, oVal) {
      this.init();
      if (!this.rightsId) {
        this.formModel = { grade: '1', categoryId: this.classId, logo: '/resources/admin/images/icon_vip.png' };
      }
    }
  },
  mounted() {},
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.formModel.logo = url;
    },
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
    clear() {
      this.$refs.form.clearValidate(['inDateType']);
    },
    query() {
      this.rightsId &&
        service.queryrightsClass(
          {
            id: this.rightsId,
            grade: '1',
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.loading = false;
            this.formModel = data.content;
            if (!this.formModel.logo) {
              this.formModel.logo = '/resources/admin/images/icon_vip.png';
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.rightsId &&
            service.editRightsClass(
              this.formModel,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('createRights', this.rightsId);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          !this.rightsId &&
            service.createRightsClass(
              this.formModel,
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.$emit('createRights', data.id);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
        }
      });
    },
    init() {
      this.loading = true;
      service.getFirstClassifies(
        {
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.loading = false;
          this.classifies = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.rights-base-info {
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
