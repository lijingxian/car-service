<template>
  <biz-grid class="msg-mgmt-base-info">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true" disabled>
      <el-form-item label="使用类型" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="使用详情">
        <el-input :value="form.remarks"></el-input>
      </el-form-item>
      <el-form-item label="用量" prop="count">
        <el-input  v-model="form.count"></el-input>
      </el-form-item>
      <el-form-item label="店铺信息" prop="count">
        <el-input v-model="form.shop.name"></el-input>
      </el-form-item>
      <el-form-item label="操作者" prop="count">
        <el-input v-model="form.operator.name"></el-input>
      </el-form-item>
      <el-form-item label="日期" prop="createDate">
        <el-input v-model="form.createDate"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'MsgIncreaseOrder',
  props: {
    form: {
      type: Object,
      default() {
        return {
          operator: {},
          shop: {}
        };
      }
    }
  },
  data () {
    return {
      loading: false,
      operations: [
        { label: '续增', name: 'submit', type: 'primary' }
      ],
      rules: {
        count: [
          { required: true, message: '续增数量不能为空', trigger: 'blur' },
          { pattern: /^-?\d+$/, message: '续增数量必须为整数', trigger: 'blur' }
        ]
      }
    };
  },
  components: {
    BizGrid
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    operate(name) {
      this[name]();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.createIncrease();
        }
      });
    },
    createIncrease() {
      let params = {
        count: this.form.count
      };
      http.post(urls.servicesMgmt.increase, params)
        .then(data => {
          this.$message.success('续增成功');
          this.$emit('refresh');
        })
        .catch(err => {
          this.$message.warning('操作出现错误');
          console.log('ERR_INCREASE: ', err);
        });
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
.msg-mgmt-increase {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
}
</style>
