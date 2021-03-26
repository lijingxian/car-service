<template>
  <biz-grid class="customer-service-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="125px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="itemId.id === ''">
        <el-input v-model="form.password" type="password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass" v-if="itemId.id === ''">
        <el-input v-model="form.checkpass" type="password" auto-complete="off" placeholder="请确认密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="receptnumber">
        <span slot="label">最大接待人数
          <el-popover
            placement="bottom"
            width="120"
            trigger="hover"
            content="客服同一时间可接入的用户数">
            <i slot="reference" class="iconfont biz-icon-bangzhuyushuoming" style="font-size: 14px;"></i>
          </el-popover>
        </span>
        <el-input v-model.number="form.receptnumber" placeholder="请输入最大接待人数"></el-input>
      </el-form-item> -->
      <el-form-item label="头像设置" prop="head">
        <BizAvatarUploaderNew v-model="form.head">
        </BizAvatarUploaderNew>
      </el-form-item>
      <el-form-item label="角色设置" prop="level">
        <el-radio v-model="form.level" label="0">客服</el-radio>
        <el-radio v-model="form.level" label="1">主管</el-radio>
      </el-form-item>
      <el-collapse v-model="activeName">
        <el-collapse-item name="1">
          <template slot="title">
            <span style="margin-left: 38px">群组设置</span>
          </template>
          <el-form-item>
            <el-checkbox-group v-model="selectedGroup">
              <el-checkbox v-for="group in groupList" :key="group.index" :label="group.id">{{group.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <el-form-item label="接待数" prop="receptnumber" class="recept-number">
        <el-input type="number" v-model="form.receptnumber" :max="1000" :min="0"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/customer-service/csMgmt.js';

export default {
  name: 'CustomerServiceBaseInfo',
  components: {
    BizGrid,
    BizSaveButton,
    BizAvatarUploaderNew
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    // 密码校验Start
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkpass !== '') {
          this.$refs.form.validateField('checkpass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validateRecept = (rule, value, callback) => {
      if (parseInt(value) > 1000) {
        callback(new Error('最大接待人数不能大于1000'));
      } else {
        callback();
      }
    };
    // 密码校验End
    return {
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为数字或字母', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ],
        receptnumber: [
          { required: true, message: '请输入最大接待人数', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' },
          { validator: validateRecept, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 16, message: '长度在6-16个字符', trigger: 'blur' }
        ],
        checkpass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        level: [{ required: true, message: '您还未选择角色', trigger: 'change' }]
      },
      id: '',
      activeName: '1',
      groupList: [],
      selectedGroup: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:customerServiceMember.edit']
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
        csGroupList: [],
        username: '',
        password: '',
        checkpass: '',
        name: '',
        nickname: '',
        mobile: '',
        receptnumber: 0,
        head: '/resources/admin/images/Avatar.png',
        level: '0'
      };
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    clear() {
      this.selectedGroup = [];
      this.form = this.setOriginFormData();
      this.$refs.form.resetFields();
    },
    refresh() {
      this.clear();
      let params = {
        id: this.itemId.id,
        shopId: window.top.SHOP_ID || ''
      };
      this.loading = true;
      service.query(
        params,
        data => {
          this.loading = false;
          this.form = data.data;
          this.form.receptnumber = Number(data.data.receptnumber);
          this.selectedGroup = data.data.csGroupList.map(group => {
            return group.id;
          });
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
    },
    // 查询群组列表
    queryGroup() {
      let params = {
        pageSize: 200,
        pageNumber: 1,
        shopId: window.top.SHOP_ID || ''
      };
      service.queryGroup(
        params,
        data => {
          this.groupList = data.dataList;
        },
        ErrorData => {
          console.log('ERR_QUERY_GROUP: ', ErrorData);
        }
      );
    },
    // 按钮'保存'
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (!this.itemId.id) {
        this.create();
      } else {
        this.update();
      }
    },
    // 创建客服信息
    create() {
      this.form.receptnumber.toString();
      let params = Object.assign(this.form, { csGroupList: this.csGroupList });
      this.loading = true;
      service.create(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_CREATE: ', ErrorData);
        }
      );
    },
    // 更新客服信息
    update() {
      this.form.receptnumber.toString();
      let params = Object.assign({ id: this.itemId.id }, this.form, { csGroupList: this.csGroupList });
      this.loading = true;
      service.update(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_UPDATE: ', ErrorData);
        }
      );
    },
    handleUploadSuccess(url) {
      this.form.head = url;
    }
  },
  computed: {
    csGroupList() {
      return this.selectedGroup.map(groupId => {
        return { id: groupId };
      });
    }
  },
  mounted() {
    this.queryGroup();
    // this.refresh();
  },
  watch: {
    itemId() {
      this.$refs.form.$el.scrollTop = 0;
      if (this.itemId.id) {
        this.refresh();
      } else {
        this.clear();
      }
    }
  }
};
</script>

<style lang="scss">
.customer-service-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-checkbox-group .el-checkbox {
    width: 155px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .recept-number {
    margin-top: 15px;
  }
}
</style>
