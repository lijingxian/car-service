<template>
  <biz-grid class="rescue-org-item">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="下单金额" prop="isLimit">
        <el-radio-group v-model="form.isLimit">
          <el-radio label="0">不限制</el-radio>
          <el-radio label="1">限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="限制金额" prop="minSalesOrderAmount" v-if="form.isLimit==='1'">
        <el-input placeholder="请输入限制金额" v-model="form.minSalesOrderAmount"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { mapGetters } from 'vuex';
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
        isLimit: '0',
        minSalesOrderAmount: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
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
  components: { BizGrid, BizSaveButton },
  computed: {},
  created() {
    this.refresh();
    console.log(123123);
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      let params = {
        shopId: this.getUser().shop.id || ''
      };
      http
        .get('/admin/store/storeProfile.jhtml', params)
        .then(data => {
          this.form.minSalesOrderAmount = data.data.minSalesOrderAmount;
          this.form.isLimit = (data.data.minSalesOrderAmount ? '1' : '0');
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      this.$set(this.form, 'store', this.getUser().shop.id);
      http
        .put('/admin/store/salesOrderAmount.jhtml', this.form)
        .then(data => {
          this.$message.success('保存成功');
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
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
