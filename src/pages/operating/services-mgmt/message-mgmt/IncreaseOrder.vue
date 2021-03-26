<template>
  <biz-grid class="msg-mgmt-increase">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="续增数量" prop="count">
        <!-- <el-input-number :precision="0" :min="0" :controls="false" placeholder="请输入续增数量" v-model="form.count"></el-input-number> -->
        <el-input placeholder="请输入续增数量" v-model="form.count"></el-input>
      </el-form-item>
      <el-form-item label="操作者">
        <el-input :value="currentUser.userName" disabled></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'MsgIncreaseOrder',
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
      },
      form: {
        count: 0
      }
    };
  },
  components: {
    BizGrid,
    BizSaveButton
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
