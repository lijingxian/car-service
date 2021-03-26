<template>
  <div class="base-info" v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" size="small" :inline-message="true">
      <el-form-item label="关怀卡分类名称：" prop="name">
        <el-input placeholder="请输入分类名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input placeholder="请输入分类描述" v-model="form.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    name: '',
    description: ''
  };
};
export default {
  name: 'BaseInfo',
  components: { BizSaveButton },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '取消',
          name: 'cancel',
          type: ''
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:member.memberCare.category.edit']
        }
      ],
      form: getDefaultModel(),
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5A-z0-9]+$/, message: '分类名称只能由中文/英文/数字组成', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {
    itemId(val) {
      this.$refs.form.clearValidate();
      this.form = getDefaultModel();
      if (val.id !== '') {
        this.refresh();
      }
    }
  },
  created() {},
  methods: {
    cancel() {
      this.$emit('close');
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      let params = {
        id: this.itemId.id
      };
      this.loading = true;
      http
        .get(urls.memberCareMgmt.categoryCard, params)
        .then(data => {
          this.form = Object.assign({}, getDefaultModel(), data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    create() {
      this.loading = true;
      let params = {
        name: this.form.name,
        description: this.form.description
      };
      http
        .post(urls.memberCareMgmt.categoryCard, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('refresh', data.data.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      this.loading = true;
      let params = {
        id: this.itemId.id,
        name: this.form.name,
        description: this.form.description
      };
      http
        .put(urls.memberCareMgmt.categoryCard, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('refresh');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.itemId.id) {
            this.update();
          } else {
            this.create();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.base-info {
  .biz-save-button {
    margin-top: 5px;
  }
  .biz-grid__content {
    margin-right: 5px;
  }
}
</style>
