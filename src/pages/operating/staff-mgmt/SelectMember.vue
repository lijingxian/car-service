<template>
  <div class="select-member">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :checkable="false">
      <el-table-column label="用户">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title" :title="scope.row.name">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="setting(scope.row)" v-if="scope.row.opeateState==='0'">添加为管理员</el-button>
          <span v-if="scope.row.opeateState==='1'">已添加</span>
        </template>
      </el-table-column>
    </biz-flex-table>

    <el-dialog title="设置用户信息" append-to-body :visible.sync="dlgVisible" @close="dlgVisible = false">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" class="dialog-form">
        <el-form-item label>
          <div class="customer-info">
            <img v-if="formModel.head" :src="formModel.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title" :title="formModel.name">{{formModel.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="formModel.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="formModel.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="formModel.gender === '2'"></i>
                <span>{{formModel.mobile}}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="角色" prop="role" :error="errorRole">
          <el-checkbox-group v-model="formModel.role">
            <template>
              <el-checkbox v-for="role in allRoles" :label="role.id" name="role" :key="role.index">{{role.name}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="operate" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisibleMobile" width="30%" append-to-body>
      <span>{{form.mobile}}手机号已注册，确定添加此手机号为管理员请点击获取验证码，验证成功后自动添加</span>
      <div class="valid-div">
        <el-input v-model="validImg" placeholder="请输入验证码" size="mini" maxlength="4"></el-input>
        <img :src="imgSrc" alt="" @click="getVerificationImg">
      </div>
      <div class="code-div">
        <el-input v-model="code" placeholder="请输入手机验证码" size="mini" maxlength="6"></el-input>
        <el-button type="primary" v-show="show" @click="getVerification" size="mini">获取验证码</el-button>
        <el-button type="primary" disabled v-show="!show" size="mini">{{count}}秒后重新获取</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMobile = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import uuid from '@/utils/uuid';
import http from '@/common/http';
import axios from 'axios';
import AdminMgmtInfo from '@/service/staff-mgmt/adminMgmtInfo';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
export default {
  name: 'SelectMember',
  data() {
    return {
      checkable: false,
      bargainAttendId: '',
      dlgTitle: '帮砍记录',
      dlgVisible: false,
      dialogVisibleMobile: false,
      dlgLoading: false,
      loading: false,
      show: true,
      height: '',
      errorRole: '',
      formModel: {
        role: [],
        roleLevel: ''
      },
      rules: {
        role: [{ required: true, message: '您还未选择角色', trigger: 'change' }]
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      allRoles: [],
      operations: [],
      count: '',
      code: '',
      imgSrc: '',
      validImg: '',
      validCode: '',
      userId: '',
      form: {
        userName: '',
        name: '',
        // 性别(0: 男, 1: 女, 2: 未知)
        gender: '',
        mobile: '',
        pass: '',
        checkpass: '',
        head: '/resources/admin/images/Avatar.png',
        role: [],
        companyId: '',
        shopId: '',
        isEnabled: '1',
        isMemberConvert: '',
        isManageThisStore: ''
      },
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '确定',
          name: 'save',
          type: 'primary',
          auth: ['admin:admin.edit']
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    id: {
      type: String
    }
  },
  components: { BizFlexTable, BizSaveButton },
  created() {
    this.getList();
  },
  computed: {},
  watch: {
    id(nVal, oVal) {}
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    getVerificationImg() {
      this.uid = uuid.getUuid('xxxxxxxxxxxxxxxx');
      let params = {
        uid: this.uid,
        clientType: '2',
        methodName: 'QueryCaptcha'
      };
      let url = '/rest/member/captcha.jhtml?req=' + encodeURIComponent(JSON.stringify(params));
      http
        .get(url)
        .then(data => {
          this.imgSrc = 'data:image/png;base64,' + data.captchaImage;
          // console.log(data);
          this.uid = data.uid;
        })
        .catch(errorCode => {});
    },
    clearSearchValue() {
      this.filters[0].value = '';
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
    },
    // 获取角色列表
    getAllRoles() {
      let params = {
        shopId: window.top.SHOP_ID || this.getUser().shop.id,
        companyId: window.top.Company_ID || ''
      };
      AdminMgmtInfo.getAllRoles(
        params,
        data => {
          this.allRoles = data.allRoles;
          this.formModel.role = [];
          this.allRoles.map(item => {
            if (item.type === '15' || item.type === '16') {
              this.formModel.role.push(item.id);
            }
          });
          // this.form.role = this.form.role.concat();
        },
        ErrorData => {
          console.log('ERR_GET_ROLES: ', ErrorData);
        }
      );
    },
    cancelForm() {
      this.dlgVisible = false;
    },
    confirm() {
      if (this.validImg === '') {
        this.$message.warning('请输入验证码');
        return false;
      }
      if (this.code === '') {
        this.$message.warning('请输入手机验证码');
        return false;
      }
      if (this.code !== this.validCode) {
        this.$message.warning('请输入正确的验证码');
        return false;
      }
      this.dlgVisible = true;
    },
    getVerification() {
      let params = {
        uid: this.uid,
        captcha: this.validImg,
        clientType: '2',
        methodName: 'SendValidateCode',
        phoneNumber: this.form.mobile,
        type: '9'
      };
      let url = '/rest/member/sendValidateCode.jhtml';
      axios
        .post(url, params)
        .then(response => {
          if (response.data.resultCode === '100') {
            this.validCode = response.data.validateCode;
            this.show = true;
            this.getCode();
          } else {
            this.$message({
              message: response.data.errorMessage,
              type: 'warning'
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    save() {
      if (this.formModel.roleLevel) {
        this.submitAdmin();
      } else {
        this.submitMember();
      }
    },
    submitAdmin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            id: this.formModel.id,
            roleIds: this.formModel.role || '',
            shop: { id: window.top.SHOP_ID || '' },
            compy: { id: window.top.Company_ID || '' }
          };
          http
            .post('/admin/admin/mgmt/admin/transfer.jhtml', params)
            .then(data => {
              this.$message.success('添加成功');
              this.getList();
              this.$emit('created');
              this.dlgVisible = false;
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            });
        }
      });
    },
    checkMobile(mobile) {
      http
        .post('/admin/admin/checkMobile.jhtml', { mobile: mobile })
        .then(data => {
          this.getVerificationImg();
          if (data.userId !== '') {
            this.userId = data.userId;
            this.id = data.userId;
            this.form.userName = data.memberData.userName;
            this.form.nickname = data.memberData.nickname;
            this.form.name = data.memberData.name || this.form.name;
            this.form.gender = data.memberData.gender;
            this.form.mobile = data.memberData.mobile;
            this.form.head = data.memberData.head;
            this.form.isEnabled = data.memberData.enableState;
            this.form.isMemberConvert = '1';
            this.dialogVisibleMobile = true;
            this.validImg = '';
          } else {
            this.userId = '';
            this.form.isMemberConvert = '';
            this.form.isManageThisStore = '';
            this.form.userName = this.formModel.userName;
            this.form.nickname = this.formModel.nickname;
            this.form.name = this.formModel.name;
            this.form.gender = this.formModel.gender;
            this.form.mobile = this.formModel.mobile;
            this.form.head = this.formModel.head;
            this.dlgVisible = true;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    // 新建管理员
    submitMember() {
      let params = {
        id: this.userId,
        head: this.form.head,
        userName: this.form.userName,
        password: this.form.pass,
        mobile: this.form.mobile,
        gender: this.form.gender,
        name: this.form.name,
        nickname: this.form.mobile,
        isEnabled: this.form.isEnabled,
        roleIds: this.formModel.role,
        compy: { id: this.form.companyId },
        shop: { id: this.form.shopId },
        isMemberConvert: this.form.isMemberConvert,
        isManageThisStore: this.form.isManageThisStore
      };
      // if (this.form.companyId === '') {
      //   this.$message.warning('请选择运营商');
      //   return false;
      // }
      this.loading = true;
      this.dialogVisibleMobile = false;
      AdminMgmtInfo.create(
        params,
        data => {
          this.loading = false;
          this.$message.success('添加成功');
          this.getList();
          this.$emit('created');
          this.dialogVisibleMobile = false;
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning({ message: ErrorData.errorMessage });
          console.log('ERR_CREATE:', ErrorData);
        }
      );
    },
    setting(row) {
      if (row.roleLevel && row.roleLevel !== this.getUser().roleLevel) {
        this.$message.warning('管理员不可以跨层级添加');
        return;
      }
      this.formModel = Object.assign(this.formModel, row);
      this.getAllRoles();
      // 会员的情况
      if (!row.roleLevel) {
        this.checkMobile(row.mobile);
        // 管理员的情况
      } else {
        this.dlgVisible = true;
      }
    },
    getList() {
      let params = {
        companyId: window.top.Company_ID || '',
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/admin/membersByKeyword.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {});
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.getList();
    },
    refresh() {},
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
$biz-dialog-selector-height: 80;

.select-member {
  .biz-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
}
.select-member,
.dialog-form {
  .el-checkbox__label {
    width: 100px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 100%;
    overflow: auto;
    .el-button {
      margin-left: 10px;
    }
  }
  .customer-info {
    img {
      position: absolute;
      top: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .title {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
