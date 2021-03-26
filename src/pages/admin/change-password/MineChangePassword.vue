<template>
  <biz-grid class="mine__change-password" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate"></biz-header>
    <div class="title">修改密码</div>
    <el-row :gutter="20">
      <el-col :xs="20" :sm="18" :md="18" :lg="18" :xl="18">
        <el-card>
          <el-row :gutter="20">
            <el-col :xs="18" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
                <el-form-item label="原密码" prop="currentPassword">
                  <el-input v-model="formModel.currentPassword" type="password" placeholder="6-16个字符"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                  <el-input v-model="formModel.password" type="password" placeholder="6-16个字符"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword">
                  <el-input v-model="formModel.rePassword" type="password" placeholder="再次确认密码"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';

import { mineBaseInfo as service } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 初始化时需要的一些数据
const listData = {
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
    channel: 'net',
    entryDate: new Date(),
    salesAdvisor: { id: '' },
    gernder: 'unknown',
    customerType: 'personal'
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
        .get(service.baseInfo.profile, {})
        .then(data => {
          this.formModel = data.content;
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
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      let obj = this.formModel;
      if (obj.roleDatas) {
        obj.roleIds = obj.roleDatas.map(item => {
          return item.id;
        });
      }
      return Object.assign({}, obj);
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          http
            .put(service.baseInfo.profile, this.getSaveParams())
            .then(data => {
              this.$message.success('密码修改成功');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};

export default {
  name: 'MineChangePassword',
  components: {
    BizGrid,
    BizHeader
  },
  data() {
    return {
      ...listData,
      ...formData.data,

      // 内容
      content: {},
      rules: {
        currentPassword: [{ required: true, trigger: 'blur', min: 6, max: 16, message: '长度在6-16个字符' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur' }
        ],
        rePassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, cb) => {
              if (this.formModel.password === this.formModel.rePassword) {
                cb();
              } else {
                cb(new Error('两次输入不一致'));
              }
            }
          }
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
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events
  },
  watch: {
    itemId(nVal, oVal) {
      this.query();
      this.$refs.form.resetFields();
    }
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
.mine__change-password {

  .title {
    font-weight: bold;
    font-size: 16px;
    color: #606266;
    border-left: 3px solid #ff7300;
    margin-left: 20px;
    padding-left: 15px;
    margin-top: 30px;
    margin-bottom: 25px;
  }
}
</style>
