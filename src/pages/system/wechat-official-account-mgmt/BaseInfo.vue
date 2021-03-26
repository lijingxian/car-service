<template>
  <biz-grid class="base-info-url">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-select v-model="form.type" placeholder="请选择类别">
          <el-option label="网页" value="0"></el-option>
          <el-option label="小程序" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input placeholder="请输入链接" v-model="form.url"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { systemSetting } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        type: '',
        name: '',
        url: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        if (nVal !== oVal) {
          this.form.id = '';
          this.form.name = '';
          this.form.url = '';
          this.form.type = '0';
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
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.id) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        id: this.id
      };
      http
        .get(systemSetting.menu, params)
        .then(data => {
          this.form = data.data;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    create() {
      http
        .post(systemSetting.menu, this.form)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('created');
          this.form.name = '';
          this.form.url = '';
          this.form.type = '0';
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      http
        .put(systemSetting.menu, this.form)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.base-info-url {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-input {
    width: 60%;
  }
  .el-select {
    width: 100%;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
