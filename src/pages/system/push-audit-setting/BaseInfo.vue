<template>
  <biz-grid class="push-audit-setting__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="handleOperate"></biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="formModel">
      <el-form-item label="投放位置" prop="name" class="isRequired">
        <span style="color:#606266;">{{formModel.position}}</span>
      </el-form-item>
      <el-form-item label="审核方式" class="isRequired">
        <el-radio v-model="formModel.way" label="0" size="mini">系统审核</el-radio>
        <el-radio v-model="formModel.way" label="1" size="mini">人工审核</el-radio>
      </el-form-item>
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
  position: '',
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ]
};

// 获取默认表单项
const getDefaultModel = () => {
  return {
    id: '',
    way: '0',
    position: ''
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
    query() {
      this.loading = true;
      http
        .get('/admin/recommendApproval/config.jhtml', { store: this.getUser().shop.id || window.top.SHOP_ID, id: this.itemId.id })
        .then(data => {
          // 列表
          this.formModel = data.data;
          this.position = data.data.position;
          if (data.data.position === '0') {
            this.formModel.position = '服务推荐';
          } else if (data.data.position === '1') {
            this.formModel.position = 'App启动';
          } else if (data.data.position === '2') {
            this.formModel.position = '爱车频道';
          } else if (data.data.position === '5') {
            this.formModel.position = '领优惠券';
          } else if (data.data.position === '6') {
            this.formModel.position = 'V商宣传';
          } else if (data.data.position === '8') {
            this.formModel.position = '百度信息流';
          } else if (data.data.position === '9') {
            this.formModel.position = '百度搜索推广';
          } else if (data.data.position === '10') {
            this.formModel.position = '今日头条';
          } else {
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        id: this.formModel.id,
        way: this.formModel.way,
        position: this.position
      };
    },

    save() {
      this.loading = true;
      http
        .put('/admin/recommendApproval/config.jhtml', this.getSaveParams())
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
          if (ErrorData.errorMessage) this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};

export default {
  name: 'PushAuditBaseInfo',
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      ...initData,
      ...formData.data
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
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
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.push-audit-setting__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding-right: 20px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
