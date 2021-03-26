<template>
  <biz-grid class="agent-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="上级功能" prop="parentName">
        <el-input v-model="formModel.parentName" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="功能级别" prop="grade">
        <el-input v-model="formModel.grade" :disabled="true"></el-input>
      </el-form-item> -->
      <el-form-item label="功能名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入门店名称"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keyWords" class="isRequired">
        <div class="add-tag">
          <el-input v-model="newMarketTagName" :maxlength="18" placeholder="请输入自定义关键字"></el-input>
          <el-button @click="addRecommendMarketTagByButton" type="primary">添加</el-button>
        </div>
        <div class="tag-group">
          <el-tag v-for="(tag ,index) of tags" :key="index" closable size="mini" @close="removeMarketTag(tag)">
            {{ tag }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="启用" prop="state">
        <el-switch v-model="formModel.valiable" active-value="1" inactive-value="0" active-color="#ff7300"
          inactive-color="#d9d9d9"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="state">
        <el-input v-model="formModel.address" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="state">
        <el-input v-model="formModel.address" disabled></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formModel.remark" placeholder="请输入备注"></el-input>
      </el-form-item> -->
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const initData = {
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      auth: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  },
  newMarketTagName: '',
  tags: []
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    parentId: '',
    parentName: '',
    grade: '',
    name: '',
    keys: '',
    valiable: '1'
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
      this.tags = this.formModel.keys ? this.formModel.keys.split(',') : [];
    },
    addRecommendMarketTagByButton(tag) {
      if (this.newMarketTagName === '') {
        this.$message.warning('请输入自定义关键字');
        return;
      }
      tag = this.newMarketTagName;
      for (const iterator of this.tags) {
        if (iterator === tag) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    removeMarketTag(tag) {
      let index = 0;
      for (; index < this.tags.length; index++) {
        const element = this.tags[index];
        if (element === tag) {
          break;
        }
      }
      this.tags = this.tags.slice(0, index).concat(this.tags.slice(index + 1));
    },
    query() {
      this.initModel(this.row);
      // this.loading = true;
      // http
      //   .get(urls.invoicing.supplierMgmt.shopSupplier, {
      //     shopId: window.top.SHOP_ID || '',
      //     id: this.itemId.id,
      //     cooperationType: '1'
      //   })
      //   .then(data => {
      //     // 列表
      //     this.initModel(data.data);
      //   })
      //   .catch(errData => {
      //     console.log(errData);
      //     console.log('code错误');
      //     if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      let keys = this.tags.join(',');
      return {
        id: this.formModel.id,
        parentId: this.parentId,
        grade: this.grade,
        name: this.formModel.name,
        keys: keys,
        valiable: this.formModel.valiable
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
              .put('/admin/reception/receptionBusseniessFunction.jhtml', this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post('/admin/reception/receptionBusseniessFunction.jhtml', this.getSaveParams())
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
    row: {
      type: Object,
      default() {
        return {};
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
    float: left;
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
