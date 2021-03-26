<template>
  <biz-grid class="car-fault-code-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref='form' :model="form" size="small" :rules="rules" label-width="85px">
      <el-form-item label="故障码" prop="faultCode">
        <el-input v-model="form.faultCode" class="code-input"></el-input>
      </el-form-item>
      <el-form-item label="故障类型">
        <el-select v-model="form.faultTypeId" placeholder="请选择" class="code-input" @change="tagTypeChange">
          <el-option v-for="(item,index) in faultTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPM">
        <el-input v-model="form.faultSpn" class="code-input"></el-input>
      </el-form-item>
      <el-form-item label="FMI">
        <el-input v-model="form.faultFmi" class="code-input"></el-input>
      </el-form-item>
      <el-form-item label="DTCM">
        <el-input v-model="form.faultDtcm" class="code-input"></el-input>
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input v-model="form.faultDescription" class="code-input"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'car-fault-code-info',
  data() {
    return {
      loading: false,
      form: {
        faultCode: '',
        faultDescription: '',
        faultTypeId: '',
        faultSpn: '',
        faultFmi: '',
        faultDtcm: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        faultCode: [{ required: true, message: '请输入故障码', trigger: 'blur' }]
      },
      faultTypeList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  components: { BizGrid, BizSaveButton },
  computed: {},
  watch: {
    itemId(newValue, oldValue) {
      this.resetModel();
      if (newValue.id) {
        this.getFaultType();
        this.showInfo();
      } else {
        this.getFaultType();
      }
    }
  },
  methods: {
    tagTypeChange() {},
    resetModel() {
      this.form = this.getDefaultModel();
      this.$refs.form.resetFields();
    },
    getDefaultModel() {
      return {
        faultCode: '',
        faultDescription: '',
        faultTypeId: '',
        faultSpn: '',
        faultFmi: '',
        faultDtcm: ''
      };
    },
    operateHandler() {
      if (this.itemId.id) {
        this.updateCode();
      } else {
        this.addCode();
      }
    },
    showInfo() {
      this.loading = true;
      let param = {
        id: this.itemId.id
      };

      http
        .get(urls.systemSetting.carFaultCodeOperate, param)
        .then(data => {
          this.loading = false;
          console.log(data);
          this.form.faultCode = data.data.faultCode;
          this.form.faultDescription = data.data.faultDescription;
          this.form.faultDtcm = data.data.faultDtcm;
          this.form.faultFmi = data.data.faultFmi;
          this.form.faultSpn = data.data.faultSpn;

          this.faultTypeList.forEach(element => {
            if (data.data.faultTypeId === element.id) {
              this.form.faultTypeId = element.name;
              return false;
            }
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    addCode() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            faultCode: this.form.faultCode,
            faultDescription: this.form.faultDescription,
            faultTypeId: this.form.faultTypeId,
            faultSpn: this.form.faultSpn,
            faultFmi: this.form.faultFmi,
            faultDtcm: this.form.faultDtcm
          };

          http
            .post(urls.systemSetting.carFaultCodeOperate, param)
            .then(data => {
              console.log(data);
              this.loading = false;
              this.$message.success('创建成功');
              this.$emit('operationSuccess');
            })
            .catch(error => {
              this.loading = false;
              this.$message({
                title: '警告',
                message: error.errorMessage,
                type: 'warning'
              });
            })
            .finally(() => {});
        }
      });
    },
    updateCode() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            id: this.itemId.id,
            faultCode: this.form.faultCode,
            faultDescription: this.form.faultDescription,
            faultTypeId: this.form.faultTypeId,
            faultSpn: this.form.faultSpn,
            faultFmi: this.form.faultFmi,
            faultDtcm: this.form.faultDtcm
          };

          http
            .put(urls.systemSetting.carFaultCodeOperate, param)
            .then(data => {
              console.log(data);
              this.loading = false;
              this.$message.success('更新成功');
              this.$emit('operationSuccess');
            })
            .catch(error => {
              this.loading = false;
              this.$message({
                title: '警告',
                message: error.errorMessage,
                type: 'warning'
              });
            })
            .finally(() => {});
        }
      });
    },
    getFaultType() {
      http
        .get(urls.systemSetting.faultType)
        .then(data => {
          console.log('故障类型', data);
          this.faultTypeList = data.faultTypeList;
          this.refresh();
        })
        .catch(() => {})
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss">
.car-fault-code-info {
  padding: 20px 20px 20px 10px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .code-input {
    width: 95%;
  }
}
</style>
