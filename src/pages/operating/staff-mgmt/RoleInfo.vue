<template>
  <biz-grid class="staff-mgmt-role-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" v-loading="loading" size="small" :inline-message="true">
      <el-form-item label="角色类别" prop="type">
        <el-select v-model="form.type" placeholder="请选择角色类别" @change="typeChange">
          <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input placeholder="请输入角色名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" :rows="4" placeholder="请输入角色描述" v-model="form.description"></el-input>
      </el-form-item>
      <!-- <el-form-item label="优先级" prop="level">
          <el-input placeholder="请输入优先级" v-model="form.level" size="small"></el-input>
        </el-form-item> -->
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import RoleMgmt from '@/service/staff-mgmt/roleMgmt';

export default {
  name: 'RoleInfo',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        type: [
          { required: true, message: '请选择角色类别', trigger: 'submit' }
        ],
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { max: 20, message: '长度不大于20位', trigger: 'blur' }
        ],
        description: [{ max: 100, message: '不多于100字', trigger: 'blur' }]
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
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      loading: false,
      isSave: false // 是否按下保存按钮(true: 按下保存, false: 按下继续)
    };
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
    roleChange() {
      this.$refs.form.clearValidate('type');
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
            this.form.authorityIds = [];
            data.authority.map(item => {
              this.form.authorityIds.push(item.id);
            });
            // this.form.level = data.role.level;
            this.form.type = data.role.roleTypeData.type;
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
          // if (!this.form.authorityIds.length) {
          //   this.showMessage('请选择角色权限', 'warning');
          // }
          // return false;
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
          this.$emit('created');
          this.$message.success('保存成功');
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
        authorityIds: this.form.authorityIds,
        description: this.form.description
      };
      RoleMgmt.update(
        params,
        data => {
          this.$emit('created');
          this.$message.success('更新成功');
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
      this.$refs.form.clearValidate('type');
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      if (newVal) {
        this.$refs.form.clearValidate();
        this.refresh();
      }
    }
  },
  created() {
    this.refresh();
  },
  components: {
    BizSaveButton,
    BizGrid
  }
};
</script>

<style lang="scss">
.staff-mgmt-role-info {
  padding: 5px;
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
