<template>
  <biz-grid class="process-qa-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="流程名称" prop="name">
        <el-input placeholder="请输入流程名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="describe">
        <el-input placeholder="请输入流程描述" v-model="form.describe"></el-input>
      </el-form-item>
    </el-form>
    <div class="process" v-show="itemObjId.id">
      <node-tree :flowId="itemObjId.id" :tree="tree" :isRoot="true" @refresh="refresh"></node-tree>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import NodeTree from './NodeTree';
import http from '@/common/http';
import { customerService } from '@/common/urls';

export default {
  name: 'base-info',
  components: {
    BizGrid,
    BizSaveButton,
    NodeTree
  },
  props: {
    itemObjId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        id: '',
        name: '',
        describe: ''
      },
      rules: {
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        describe: [{ required: true, message: '请输入流程描述', trigger: 'blur' }]
      },
      tree: {}
    };
  },
  computed: {},
  watch: {
    itemObjId(itemObjId) {
      if (itemObjId.id) {
        this.query();
        this.queryNodeList();
      } else {
        this.clear();
      }
    }
  },
  created() {},
  methods: {
    operate(name) {
      this[name]();
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.itemObjId.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      let params = {
        name: this.form.name,
        describe: this.form.describe
      };

      this.loading = true;
      http
        .post(customerService.processQA.flow, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('success', data.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      let params = {
        id: this.itemObjId.id,
        name: this.form.name,
        describe: this.form.describe
      };

      this.loading = true;
      http
        .put(customerService.processQA.flow, params)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('success');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    query() {
      let params = {
        id: this.itemObjId.id
      };

      this.loading = true;
      http
        .get(customerService.processQA.flow, params)
        .then(data => {
          this.form.name = data.data.name;
          this.form.describe = data.data.describe;
          this.$nextTick(() => {
            this.$refs.form.validate();
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    queryNodeList() {
      let params = {
        flowId: this.itemObjId.id
      };
      http
        .get(customerService.processQA.nodeList, params)
        .then(data => {
          this.tree = data.data || {};
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    refresh() {
      this.queryNodeList();
    },
    clear() {
      this.form.name = '';
      this.form.describe = '';
    }
  }
};
</script>

<style lang="scss">
.process-qa-base-info {
  .process {
    width: 100%;
    overflow: scroll;
    display: inline-block;
    text-align: center;
  }
}
</style>
