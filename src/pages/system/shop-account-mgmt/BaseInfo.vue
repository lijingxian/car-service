<template>
  <biz-grid class="msg-mgmt-base-info">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true" disabled>
      <el-form-item label="项目" prop="itemName">
        <el-input v-model="form.itemName"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-input :value="form.createDate"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="credit">
        <el-input  v-model="form.credit"></el-input>
      </el-form-item>
      <el-form-item label="账户余额" prop="balance">
        <el-input v-model="form.balance"></el-input>
      </el-form-item>
      <el-form-item label="交易单号" prop="orderSn">
        <el-input v-model="form.orderSn"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" prop="paymentMethod">
        <el-input v-model="form.paymentMethod"></el-input>
      </el-form-item>
      <el-form-item label="操作者" prop="operator">
        <el-input v-model="form.operator"></el-input>
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
          operator: {}
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
