<template>
  <biz-grid class="service-project-item">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operate">
    </biz-save-button>
    <el-form :rules="rules"
             ref="form"
             :model="form"
             label-width="100px"
             size="small"
             v-loading="loading" :inline-message="true">
      <el-form-item label="项目"
                    prop="name">
        <el-input placeholder="请输入项目名称"
                  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="价格"
                    prop="price">
        <el-input placeholder="请输入价格"
                  v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input placeholder="请填写描述"
                  type="textarea"
                  :rows="2"
                  v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

export default {
  name: 'ServiceProjectItem',
  data() {
    let checkPrice = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 0) {
          callback(new Error('必须输入正数'));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      form: {
        name: '',
        price: '',
        remark: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入项目价格', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    projectId: String
  },
  components: { BizGrid, BizSaveButton },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.loading = true;
      let params = {
        id: this.projectId
      };
      serviceProjectService.getServiceProject(
        params,
        data => {
          this.form.name = data.appointmentItem.name;
          this.form.price = data.appointmentItem.price;
          this.form.remark = data.appointmentItem.remark;
          this.loading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    clear() {
      this.form.name = '';
      this.form.price = '';
      this.form.remark = '';
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.projectId) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        name: this.form.name,
        price: this.form.price,
        remark: this.form.remark
      };
      serviceProjectService.createServiceProject(
        params,
        data => {
          this.$emit('created');
          this.loading = false;
          this.$message.success('操作成功');
          this.clear();
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      this.loading = true;
      let params = {
        id: this.projectId,
        shopId: window.top.SHOP_ID || '',
        name: this.form.name,
        price: this.form.price,
        remark: this.form.remark
      };
      serviceProjectService.updateServiceProject(
        params,
        data => {
          this.$emit('created');
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.service-project-item {
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
