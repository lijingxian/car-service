<template>
  <biz-grid class="function-defination-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="功能名称" prop="name">
        <el-input placeholder="请输入功能名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select :disabled="!showAdd" placeholder="请输入功能类型" v-model="form.type">
          <!-- 0模块1功能2操作 -->
          <el-option label="模块" value="0"></el-option>
          <el-option label="功能" value="1"></el-option>
          <el-option label="操作" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属上级" prop="parent">
        <!-- <el-input placeholder="请输入功能名称" v-model="form.parent"></el-input> -->
        <el-cascader change-on-select placeholder="请选择所属上级" :options="parentList" v-model="selectedParent"
          :props="{ value: 'id', label: 'name', children: 'subAuthority' }">
        </el-cascader>
      </el-form-item>
      <el-form-item label="key" prop="keyword">
        <el-input :disabled="!showAdd" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入key"
          v-model="form.keyword"></el-input>
      </el-form-item>
      <!-- <el-form-item label="排序" prop="orderNum" v-if="showAdd">
        <el-input-number :controls="false" :min="0" :max="999" :precision="0" placeholder="请输入排序" v-model="form.orderNum">
        </el-input-number>
      </el-form-item> -->
      <el-form-item label="平台可用" prop="isPlatform">
        <el-switch v-model="form.isPlatform" :active-value="1" :inactive-value="0" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="运营商可用" prop="isOperator">
        <el-switch v-model="form.isOperator" :active-value="1" :inactive-value="0" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="店铺可用" prop="isShop">
        <el-switch v-model="form.isShop" :active-value="1" :inactive-value="0" active-color="#87d068"></el-switch>
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
  name: 'FunDefinationBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    pathId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        keyword: [{ required: true, message: 'key不能为空', trigger: 'blur' }]
      },
      form: {
        id: '',
        name: '',
        type: '',
        parent: '',
        keyword: '',
        orderNum: '',
        isPlatform: '0',
        isShop: '0',
        isOperator: '0'
      },
      selectedParent: [],
      parentList: [
        {
          value: '0',
          label: '123',
          children: [
            {
              value: '2',
              label: '321'
            }
          ]
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {
    id() {
      return this.itemId.id || '';
    },
    showAdd() {
      // return /function-defination-admin/.test(this.$route.path);
      return !this.itemId.id;
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      if (!newVal.id) {
        this.selectedParent = [];
        this.form = this.originForm();
      } else {
        this.selectedParent = [...this.pathId.id.split(',').map(i => Number(i))];
      }
      this.refresh();
    },
    open(newVal, oldVal) {
      this.getAllFun();
    }
  },
  mounted() {
    this.getAllFun();
  },
  methods: {
    originForm() {
      return {
        id: '',
        name: '',
        type: '',
        parent: '',
        keyword: '',
        orderNum: '',
        isPlatform: '0',
        isShop: '0',
        isOperator: '0'
      };
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.$refs.form.resetFields();
      if (this.id) {
        this.getFunDetail();
      }
    },
    getFunDetail() {
      let params = { id: this.id };
      http
        .get(urls.functionDefination.getFun, params)
        .then(data => {
          this.form = Object.assign({}, this.originForm(), data.functionData);
        })
        .catch(err => {
          console.log('ERR_GET_DETAIL: ', err);
        });
    },
    getAllFun() {
      const format = list => {
        list.forEach(item => {
          if (!item.subAuthority.length) {
            delete item.subAuthority;
          } else {
            format(item.subAuthority);
          }
        });
      };
      http
        .get(urls.functionDefination.getAllFun, {})
        .then(data => {
          format(data.authorityList);
          this.parentList = data.authorityList;
        })
        .catch(err => {
          console.log('ERR_GET_FUN: ', err);
        });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    async submit() {
      this.form.parent = this.selectedParent[this.selectedParent.length - 1] || '';
      let params = Object.assign({}, this.form);
      try {
        if (this.id) {
          params = Object.assign({}, params, this.itemId);
          await http.put(urls.functionDefination.getFun, params);
          this.$message.success('更新成功');
        } else {
          await http.post(urls.functionDefination.getFun, params);
          this.$message.success('创建成功');
        }
        this.$emit('refresh');
      } catch (e) {
        this.$message.warning(e.errorMessage);
        console.log('ERR_SUBMIT: ', e);
      }
    },
    // 显示消息提示
    showNotify(msg, type = 'success') {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    }
  }
};
</script>

<style lang="scss">
.function-defination-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    .el-input-number--small {
      width: 100px;
    }
  }
}
</style>
