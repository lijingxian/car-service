<template>
  <biz-grid class="black-list-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :model="form" label-width="125px" size="small" v-loading="loading" :disabled="true" :inline-message="true">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.member.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="form.member.mobile" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="拉黑日期" prop="blackDate">
        <el-input v-model="form.blackDate" placeholder="请输入拉黑日期"></el-input>
      </el-form-item>
      <el-form-item label="用户来源" prop="userSource">
        <el-input :value="form.member.userSource==='0'?'推荐注册':form.member.userSource==='1'?'潜客转化':form.member.userSource==='2'?'正常注册':form.member.userSource==='3'?'后台创建':'其他'" placeholder="请输入用户来源"></el-input>
      </el-form-item>
      <el-form-item label="原因说明" prop="remarks">
        <el-input v-model="form.remarks" placeholder="请输入原因说明"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input :value="form.state==='0'?'未审核':'已审核'" placeholder="请输入状态"></el-input>
      </el-form-item>
      <el-form-item label="操作者" prop="name">
        <el-input v-model="form.admin.name" placeholder="请输入操作者"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import csService from '@/service/customer-service/csMgmt';

export default {
  name: 'BlackListBaseInfo',
  components: {
    BizGrid,
    BizSaveButton
  },
  props: {},
  data() {
    return {
      operations: [
        {
          label: '通过',
          name: 'passBlack',
          type: 'primary',
          class: 'show'
        },
        {
          label: '拒绝',
          name: 'recover',
          type: 'primary',
          class: 'show'
        },
        {
          label: '恢复',
          name: 'recover',
          type: 'primary',
          class: 'show'
        }
      ],
      form: this.setOriginFormData(),
      loading: false
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    setOriginFormData() {
      return {
        member: {
          nickname: '',
          mobile: '',
          userSource: ''
        },
        blackDate: '',
        remarks: '',
        state: '',
        admin: {
          name: ''
        }
      };
    },
    refresh(row) {
      if (row.state === '0') {
        this.operations[0].class = 'show';
        this.operations[1].class = 'show';
        this.operations[2].class = 'hidden';
      } else {
        this.operations[0].class = 'hidden';
        this.operations[1].class = 'hidden';
        this.operations[2].class = 'show';
      }
      this.form = row;
    },
    recover() {
      this.$confirm('是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(this.form.id);
          let params = {
            ids: ids
          };
          csService.recoverBlack(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '成功!'
              });
              this.$emit('operationSuccess');
            },
            ErrorData => {
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
            }
          );
        })
        .catch(() => {});
    },
    passBlack() {
      this.$confirm('是否确认通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(this.form.id);
          let params = {
            ids: ids
          };

          csService.passBlack(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '通过成功!'
              });
              this.$emit('operationSuccess');
            },
            ErrorData => {
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
            }
          );
        })
        .catch(() => {});
    }
  },
  computed: {},
  mounted() {},
  watch: {}
};
</script>

<style lang="scss">
.black-list-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
}
</style>
