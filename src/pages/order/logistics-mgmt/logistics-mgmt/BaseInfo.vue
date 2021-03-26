<template>
  <biz-grid class="delivery-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form
      :rules="rules"
      :model="form"
      ref="form"
      label-width="125px"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="网址" prop="url">
        <el-input placeholder="请输入网址" v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input placeholder="请输入代码" v-model="form.code"></el-input>
      </el-form-item>
      <!-- <el-form-item label="排序" prop="sort">
        <el-input placeholder="请输入排序" v-model="form.sort"></el-input>
      </el-form-item> -->
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { logisticsMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'LogisticsBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      loading: false,
      operations: [
        { label: '保存', name: 'save', type: 'primary' }
      ],
      rules: {
        name: [
          { required: true, message: '请填写物流公司名称', trigger: 'blur' },
          { max: 10, message: '不超过10个字', trigger: 'blur' }
        ],
        sort: [
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetForm() {
      return {
        name: '',
        url: '',
        code: '',
        sort: ''
      };
    },
    clear() {
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    refresh() {
      this.loading = true;
      let params = this.itemId;
      http.get(logisticsMgmt.logistics.baseInfo.query, params)
        .then(
          data => {
            this.loading = false;
            this.form = Object.assign(this.resetForm(), data.content);
          }
        )
        .catch(
          ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    save() {
      this.$refs.form.validate(result => {
        if (result) {
          this.submit();
        }
      });
    },
    submit() {
      if (this.itemId.id) {
        this.update();
      } else {
        this.create();
      }
    },
    create() {
      this.loading = true;
      let params = this.form;
      console.log('params: ', params);
      http.post(logisticsMgmt.logistics.baseInfo.create, params)
        .then(
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.$emit('update');
            this.form = this.resetForm();
          }
        )
        .catch(
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    update() {
      this.loading = true;
      let params = Object.assign(this.form, this.itemId);
      http.put(logisticsMgmt.logistics.baseInfo.update, params)
        .then(
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.$emit('update');
            this.refresh();
          }
        )
        .catch(
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.delivery-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
