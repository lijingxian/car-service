<template>
  <biz-grid class="staff-mgmt-role-edit">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" v-loading="loading" label-position="right" :inline-message="true">
      <div class="block-title">角色基本信息</div>
      <div class="form-item-container item-border">
        <el-form-item label="角色类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择角色类别" @change="typeChange" size="small">
            <el-option v-for="item in typeList" :key="item.index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input placeholder="请输入角色名称" v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" :rows="4" placeholder="请输入角色描述" v-model="form.description"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优先级" prop="level">
          <el-input placeholder="请输入优先级" v-model="form.level" size="small"></el-input>
        </el-form-item> -->
      </div>
      <div class="block-title">角色权限设置</div>
      <el-form-item prop="authorityIds" class="authority">
        <el-checkbox-group v-model="form.authorityIds" class="item-border">
          <div v-for="platform in authorityList" :key="platform.index">
            <div class="platform">
              {{platform.name}}
            </div>
            <div v-for="authCategory in platform.child" :key="authCategory.index" class="auth-group">
              <label for="auth" class="auth-category">
                {{authCategory.name}}
              </label>
              <div class="checkbox-box">
                <div class="check-box-line" v-for="auth in authCategory.authorities" :key="auth.id">
                  <el-checkbox class="keep-left" :label="auth.id">
                    {{auth.name}}
                  </el-checkbox>
                  <div class="sub-auth" v-if="auth.subAuthority">
                    <el-checkbox class="sub-auth-checkbox" v-for="sub in auth.subAuthority" :key="sub.index" :label="sub.id">
                      {{sub.name}}
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import RoleMgmt from '@/service/staff-mgmt/roleMgmt';

export default {
  name: 'RoleEdit',
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      rules: {
        type: [{ required: true, message: '请选择角色类别', trigger: 'submit' }],
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { max: 20, message: '长度不大于20位', trigger: 'blur' }
        ],
        description: [{ max: 100, message: '不多于100字', trigger: 'blur' }],
        // level: [
        //   {pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur'}
        // ],
        authorityIds: [{ required: true, message: '您还未选择角色权限', trigger: 'submit' }]
      },
      form: {
        type: '',
        name: '',
        description: '',
        // level: '',
        authorityIds: []
      },
      typeList: [],
      authorityList: [],
      loading: false,
      isSave: false // 是否按下保存按钮(true: 按下保存, false: 按下继续)
    };
  },
  computed: {
    operations() {
      if (this.id === undefined || this.id === '') {
        return [
          { label: '保存', name: 'save', type: 'primary', auth: ['admin:role.edit'] },
          { label: '保存并添加', name: 'continue', type: 'primary', auth: ['admin:role.edit'] },
          { label: '返回', name: 'back', type: 'primary' }
        ];
      } else {
        return [
          { label: '保存', name: 'save', type: 'primary', auth: ['admin:role.edit'] },
          { label: '返回', name: 'back', type: 'primary' }
        ];
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    refresh() {
      if (this.id === undefined || this.id === '') {
        // 新建
        let params = {};
        RoleMgmt.init(
          params,
          data => {
            this.$refs.form.resetFields();
            this.typeList = data.types;
            this.authorityList = data.authorityList;
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else {
        let params = {
          id: this.id
        };
        RoleMgmt.get(
          params,
          data => {
            this.typeList = data.types;
            this.id = data.role.id;
            this.form.name = data.role.name;
            this.form.description = data.role.description;
            // this.form.level = data.role.level;
            this.form.type = data.role.roleTypeData.type;
            this.form.authorityIds = [];
            data.authority.map(item => {
              this.form.authorityIds.push(item.id);
            });
            this.authorityList = data.authorityList;
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      }
    },
    save() {
      this.isSave = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          if (!this.form.authorityIds.length) {
            this.$message.warning('请选择角色权限');
          }
          return false;
        }
      });
    },
    submit() {
      if (this.id === undefined || this.id === '') {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      let params = {
        name: this.form.name,
        type: this.form.type,
        description: this.form.description,
        // level: this.form.level,
        authorityIds: this.form.authorityIds
      };
      RoleMgmt.create(
        params,
        data => {
          if (this.isSave === true) {
            this.$message.success('操作成功');
            this.back();
          } else {
            this.$message.success('操作成功');
            this.refresh();
          }
          this.isSave = false;
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        name: this.form.name,
        type: this.form.type,
        description: this.form.description,
        // level: this.form.level,
        authorityIds: this.form.authorityIds
      };
      RoleMgmt.update(
        params,
        data => {
          if (this.isSave === true) {
            this.$message.success('操作成功');
            this.back();
          } else {
            this.$message.success('操作成功');
            this.refresh();
          }
          this.isSave = false;
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 保存并继续添加
    continue() {
      this.isSave = false;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          if (!this.form.authorityIds.length) {
            this.$message.warning('请选择角色权限');
          }
          return false;
        }
      });
    },
    // 获取权限列表
    getAuthority(type) {
      let params = {
        roleType: type
      };
      RoleMgmt.getAuthority(
        params,
        data => {
          this.form.authorityIds = [];
          data.authority.map(item => {
            this.form.authorityIds.push(item.id);
          });
          this.authorityList = data.authorityList;
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 角色类型改变
    typeChange(value) {
      this.getAuthority(value);
    }
  },
  mounted() {
    this.refresh();
  },
  watch: {},
  components: {
    BizSaveButton,
    BizGrid
  }
};
</script>

<style lang="scss">
.staff-mgmt-role-edit {
  padding: 5px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .block-title {
    height: 18px;
    margin-left: 20px;
    margin-top: 20px;
    padding-left: 10px;
    line-height: 18px;
    font-size: 18px;
    border-left: 3px solid #ff7300;
  }
  .block-title:nth-of-type(3) {
    margin-top: 75px;
  }
  .item-border {
    width: 906px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding-top: 22px;
    padding-left: 10px;
    padding-bottom: 22px;
    margin-bottom: 20px;
    margin-top: 22px;
    margin-left: 20px;
  }
  .form-item-container {
    padding-right: 456px;
    padding-left: 30px;
    padding-top: 44px;
    padding-bottom: 44px;
  }
  .form-item-container .el-form-item__label {
    width: 80px;
  }
  .el-form-item__content {
    margin-left: 80px;
  }
  .authority > .el-form-item__content {
    margin-left: 0px;
  }
  .el-form-item:nth-last-of-type(1) {
    margin-bottom: 0;
  }
  .el-checkbox-group {
    font-size: 14px;
  }
  .keep-left.el-checkbox {
    margin-left: 0;
  }
  .el-checkbox__label {
    display: inline-block;
    width: 130px;
    font-size: 13px;
  }
  .check-box-line {
    display: inline-block;
    width: 220px;
    vertical-align: top;
  }
  .sub-auth {
    height: 13px;
    border-left: 2px solid #ff7300;
    margin-top: -10px;
    margin-left: 6px;
    margin-right: 15px;
    margin-bottom: 20px;
  }
  .el-checkbox.sub-auth-checkbox {
    width: 70px;
    margin-left: -8px;
    line-height: 16px;
    background-color: #fff;
    .el-checkbox__label {
      width: 46px;
      line-height: 13px;
    }
  }
  .checkbox-box {
    display: inline-block;
    margin-left: 100px;
    vertical-align: top;
  }
  .auth-category {
    vertical-align: top;
    margin-right: -105px;
    width: 100px;
    display: inline-block;
    color: #1a1a1a;
    text-align: right;
    padding-right: 10px;
  }
  .platform {
    width: 30px;
    height: 33px;
    padding-bottom: 3px;
    margin-left: 25px;
    margin-top: 22px;
    margin-bottom: 25px;
    color: #ff7300;
    border-bottom: 2px solid #ff7300;
    font-size: 14px;
    text-align: right;
    font-weight: bold;
  }
}
</style>
