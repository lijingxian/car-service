<template>
  <biz-grid class="terminal-mgmt-membership-base-info" v-loading="loading">
    <!-- <biz-save-button
      slot="top"
      :operations="operations"
      @operate="handleOperate"
    >
    </biz-save-button> -->
    <el-form
      ref="form"
      size="small"
      :disabled="true"
      label-width="110px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formModel.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formModel.mobile" type="phone" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.realName"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formModel.nickname"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formModel.gender">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birth">
        <el-date-picker
          v-model="formModel.birth"
          format="yyyy-MM-dd"
          format-value="yyyy-MM-dd"
          :picker-options="pickerOptions"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="地址">
        <biz-area-select :areaId="formModel.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
      </el-form-item>
      <!-- <el-form-item label="邮编" prop="zipCode">
        <el-input v-model="formModel.zipCode" type="number"></el-input>
      </el-form-item> -->
      <el-form-item label="启用" prop="enableState">
        <el-switch
          v-model="formModel.enableState"
          active-value="1"
          inactive-value="0"
          inactive-color="#d9d9d9"
          active-color="#87d068"
        ></el-switch>
      </el-form-item>
      <el-form-item v-if="!itemId.id" label="密码" prop="password">
        <el-input v-model="formModel.password" type="password"></el-input>
      </el-form-item>
      <el-form-item v-if="!itemId.id" label="确认密码" prop="rePassword">
        <el-input v-model="formModel.rePassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="name" v-show="!!formModel.id">
        <span class="form-static">{{formModel.createDate}}</span>
      </el-form-item>
      <el-form-item label="最后登录IP" prop="name" v-show="!!formModel.id">
        <span class="form-static">{{formModel.lastLoginIp}}</span>
      </el-form-item>
      <el-form-item label="最后登录日期" prop="name" v-show="!!formModel.id">
        <span class="form-static">{{formModel.lastLoginDate}}</span>
      </el-form-item>
      <el-form-item label="用户来源" prop="userSource">
        <el-select
          v-model="formModel.userSource"
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option
            v-for="item in sourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizAreaSelect from '@/components/BizAreaSelect';

import { membershipMgmt as service } from '@/common/urls';
import http from '@/common/http';
import urlUtil from '@/utils/url';
import dateUtil from '@/utils/date';

// 初始化时需要的一些数据
const initData = {
  data: {
    operations: [
      {
        label: '保存',
        name: 'save',
        type: 'primary'
      }
    ],
    sourceList: [
      { value: '0', label: '推荐注册' },
      { value: '1', label: '潜客转化' },
      { value: '2', label: '正常注册' },
      { value: '3', label: '后台创建' },
      { value: '4', label: '其他' }
    ]
  },
  events: {
    handleOperate (name) {
      this[name]();
    }
  },
  methods: {

  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    gender: '2',
    enableState: '0',
    area: { id: '1568' }
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    pickerOptions: {
      disabledDate (time) {
        return time.getTime() > Date.now();
      }
    }
  },
  events: {
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    }
  },
  methods: {
    initModel (model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return getDefaultModel();
    },

    query () {
      this.loading = true;

      http.get(
        service.baseInfo.query,
        { id: this.itemId.id }
      )
        .then(data => {
          // 设置相关列表
          this.initModel(data.memberData);
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

    getSaveParams () {
      return {
        token: '',
        shopId: window.top.SHOP_ID || '',

        id: this.formModel.id,
        areaId: this.formModel.area.id,
        userName: this.formModel.userName,
        mobile: this.formModel.mobile,
        password: this.formModel.password,
        realName: this.formModel.realName,
        nickname: this.formModel.nickname,
        gender: this.formModel.gender,
        birth: dateUtil.dateConverter(this.formModel.birth),
        zipCode: this.formModel.zipCode,
        enableState: this.formModel.enableState,
        userSource: this.formModel.userSource
      };
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');

            this.$emit('operationSuccess');
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          let params = this.getSaveParams();
          http.post(
            (this.formModel.id
              ? service.baseInfo.update
              : service.baseInfo.create) + urlUtil.toURLParams(params)
          )
            .then(success)
            .catch(failed)
            .finally(final);
        } else {
          this.$message.warning('表单验证失败');
          return false;
        }
      });
    }
  }
};

export default {
  name: 'TerminalMgmtMembershipBaseInfo',
  components: {
    BizGrid,
    BizAreaSelect
  },
  data () {
    return {
      ...initData.data,
      ...formData.data,

      rules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为数字或字母', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '请输入手机号' }
        ],
        nickname: [
          { required: true, trigger: 'blur', message: '请输入昵称' }
        ],
        gender: [
          { required: true, trigger: 'blur', message: '请选择性别' }
        ],
        birth: [
          { required: true, trigger: 'blur', message: '请选择出生日期' }
        ],
        zipCode: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.zipCode) {
                if (
                  isNaN(Number(this.formModel.zipCode)) ||
                  Number(this.formModel.zipCode) < 0
                ) {
                  callback(new Error('请输入数字'));
                } else if (this.formModel.zipCode.length !== 6) {
                  callback(new Error('请输入6位数字'));
                } else callback();
              } else {
                callback();
              }
            }
          }
        ],
        enableState: [
          { required: true, trigger: 'blur', message: '请选择是否启用' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ],
        rePassword: [
          { required: true, trigger: 'blur', message: '请再次输入密码' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.password === this.formModel.rePassword) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'));
              }
            }
          }
        ],
        userSource: [
          { required: true, trigger: 'blur', message: '请选择用户来源' }
        ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  methods: {
    ...formData.methods,
    ...formData.events,

    ...initData.methods,
    ...initData.events
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  computed: {
    dateRange: {
      get() {
        return [this.formModel.beginDate, this.formModel.endDate];
      },
      set(newValue) {
        if (newValue) {
          this.formModel.beginDate = newValue[0];
          this.formModel.endDate = newValue[1];
        } else {
          this.formModel.beginDate = '';
          this.formModel.endDate = '';
        }
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.terminal-mgmt-membership-base-info {
  padding-top: 20px;

  .biz-scroller {

    .form-static {
      color: #606266;
    }
  }
}
</style>
