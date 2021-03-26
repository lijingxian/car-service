<template>
  <biz-grid class="staff-mgmt-admin-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="用户名" prop="userName" :error="errUserName">
        <el-input placeholder="请输入用户名" v-model="form.userName" :disabled="id === '' ? false : true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :error="errName">
        <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
          <el-radio label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" :error="errorMobile">
        <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item v-if="id ===''" label="密码" prop="pass">
        <input type="password" name="pwd" v-show="false">
        <el-input type="text" auto-complete="off" placeholder="请输入6-16位密码" v-model="form.pass"></el-input>
      </el-form-item>
      <el-form-item v-if="id ===''" label="确认密码" prop="checkpass">
        <el-input type="text" auto-complete="off" placeholder="再次确认密码" v-model="form.checkpass"></el-input>
      </el-form-item>
      <el-form-item label="用户头像" prop="head">
        <biz-avatar-uploader-new v-model="form.head" v-if="isEdit"></biz-avatar-uploader-new>
        <img :src="form.head" v-if="!isEdit" width="80px" height="80px">
      </el-form-item>
      <!-- 角色列表 -->
      <el-form-item label="角色" prop="role" class="isRequired">
        <div class="tag-container">
          <el-tag v-for="tag in selectRoles" :key="tag.id" closable size="small" @close="onClose(tag)" style="margin-right:10px">
            {{tag.name}}</el-tag>
          <el-button type="primary" size="small" @click="onClickHandle" style="padding: 5px 10px;">+</el-button>
        </div>
      </el-form-item>
      <el-form-item label="用户权限" v-if="this.id!==''">
        <el-button size="small" type="primary" @click="userPermissions" style="padding: 7px 15px;">查看</el-button>
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-switch v-model="form.isEnabled" active-value='1' active-color="#87d068" inactive-value='0' inactive-color="#d9d9d9">
        </el-switch>
      </el-form-item>
      <el-form-item label="所属运营商" prop="company" class="isRequired">
        <!-- 一级运营商选择栏 -->
        <el-select v-model="list[0]" @change="listChange1" placeholder="请选择运营商"
          :disabled="((this.id === '' || this.form.companyId === '') && this.isOperatorAdminFlg === '1') && (this.type === 'operator' || this.type === '') ? false : true"
          clearable>
          <el-option v-for="item in companyList1" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <!-- 二级运营商选择栏 -->
        <el-select v-if="companyList2.length !== 0" v-model="list[1]" @change="listChange2" placeholder="请选择运营商"
          :disabled="isOperatorAdminFlg === '0' || this.type === 'store' || this.id !== ''" clearable>
          <el-option v-for="item in companyList2" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <!-- 三级运营商选择栏 -->
        <el-select v-if="companyList3.length !== 0" v-model="list[2]" @change="listChange3" placeholder="请选择运营商"
          :disabled="isOperatorAdminFlg === '0' || this.type === 'store' || this.id !== ''" clearable>
          <el-option v-for="item in companyList3" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 店铺选择栏 -->
      <el-form-item label="所属店铺" prop="shop" class="isRequired">
        <el-select v-model="shop" placeholder="请选择所属店铺" @change="shopListChange"
          :disabled="isOperatorAdminFlg === '0' || this.type === 'store' || id !== ''" clearable>
          <el-option v-for="item in allShops" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <!-- 子店铺选择栏 -->
        <el-select v-model="childShop" v-if="childShopList.length !== 0" @change="childShopListChange" placeholder="请选择所属店铺"
          :disabled="id === '' ? false : true" clearable>
          <el-option v-for="item in childShopList" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-dialog title="角色" :visible.sync="dialogRoles" width="700px" append-to-body custom-class="role-dialog">
      <div class="line">系统预置</div>
      <el-checkbox-group v-model="roleArr" style="padding-top:10px">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index<=3" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <el-checkbox-group v-model="roleArr">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index<=7 && index>3" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <el-checkbox-group v-model="roleArr">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index<=11 && index>7" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <el-checkbox-group v-model="roleArr">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index<=13 && index>11" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <el-checkbox-group v-model="roleArr">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index<=18 && index>13" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <el-checkbox-group v-model="roleArr" style="padding-bottom:10px">
        <template>
          <el-checkbox v-for="(role,index) in allRoles" v-if="role.hierarchy==='0' && index>18" :label="role.id" name="role" :key="index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <div class="line">自定义</div>
      <el-checkbox-group v-model="roleArr">
        <template>
          <el-checkbox v-for="role in allRoles" v-if="role.hierarchy!=='0'" :label="role.id" name="role" :key="role.index">
            {{role.name}}</el-checkbox>
        </template>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogRoles = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirmed">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisible" width="30%" append-to-body>
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
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogAdminVisible" width="30%" append-to-body>
      <span>该用户是其他店铺管理员，确认成为本店铺管理员</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdminVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="create" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="功能权限" :visible.sync="dialogPermissions" width="60%" append-to-body custom-class="permissions-dialog">
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane class="role-pane" v-for="(list, index) in authorityTree" :key="list.id" :label="list.name" :name="String(index)">
          <el-tree
            ref="tree"
            node-key="id"
            :props="treeProps"
            :data="list.children">
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import AdminMgmtInfo from '@/service/staff-mgmt/adminMgmtInfo';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import uuid from '@/utils/uuid';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'BaseInfo',
  props: {
    shopId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean
    },
    itemId: {
      type: String,
      default: ''
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
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    // 密码校验End
    return {
      defaultAvatar: '/resources/admin/images/Avatar.png',
      id: '',
      masterId: '',
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '用户名只能为数字或字母',
            trigger: 'blur'
          },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          },
          { max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '请选择性别' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 16,
            message: '长度在6-16个字符',
            trigger: 'blur'
          }
        ],
        checkpass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      },
      // 店铺角色列表
      allRoles: [],
      // 运营商列表
      parentCompany: [], // 父级运营商列表
      companyList1: [], // 一级运营商
      companyList2: [], // 二级运营商
      companyList3: [], // 三级运营商
      // 运营商选择器的值
      list: ['', '', ''],
      // 店铺列表
      allShops: [],
      newRoles: ['销售主管', '销售', '试驾专员', '门卫', '售后主管', '售后', '救援人员', '技工', '客服主管', '客服', '市场主管', '市场', '财务主管', '财务', '采购主管', '采购', '供应商', '代理商', '库管', '总经理', '店铺运营'],
      holeRoles: [],
      // 店铺选择器的值
      shop: '',
      // 子店铺列表
      childShopList: [],
      // 子店铺选择器的值
      childShop: '',
      // 登录用户是否为管理员(0:不是,1:是)
      isOperatorAdminFlg: '',
      // 用户信息
      form: {
        userName: '',
        name: '',
        // 性别(0: 男, 1: 女, 2: 未知)
        gender: '2',
        mobile: '',
        pass: '123456',
        checkpass: '123456',
        head: '/resources/admin/images/Avatar.png',
        role: [],
        companyId: '',
        shopId: '',
        isEnabled: '1',
        isMemberConvert: '',
        isManageThisStore: ''
      },
      dialogRoles: false,
      dialogPermissions: false,
      authorityTree: [],
      treeProps: {
        label: 'name',
        children: 'children'
      },
      activeTab: '0',
      roleArr: [],
      selectRoles: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:admin.edit']
        }
      ],
      count: '',
      code: '',
      imgSrc: '',
      validImg: '',
      validCode: '',
      timer: null,
      loading: false,
      dialogVisible: false,
      dialogAdminVisible: false,
      isCreate: true,
      show: true,
      userId: '',
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: '',
      currentCompany: {}
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizAvatarUploaderNew
  },
  methods: {
    operate(name) {
      this[name]();
    },
    onClickHandle() {
      if (this.selectRoles.length > 0) {
        this.roleArr = [];
        this.selectRoles.forEach(item => {
          this.roleArr.push(item.id);
        });
      }
      this.dialogRoles = true;
    },
    onClose(tag) {
      let ary = this.selectRoles;
      let len = ary.length;
      for (let i = 0; i < len; i++) {
        if (ary[i] === tag) {
          ary.splice(i, 1);
          break;
        }
      }
    },
    confirmed() {
      if (this.roleArr.length === 0) {
        this.$message.info('请选择角色');
      } else {
        this.selectRoles = [];
        this.allRoles.forEach(item => {
          this.roleArr.forEach(role => {
            if (item.id === role) {
              this.selectRoles.push(item);
            }
          });
        });
        this.dialogRoles = false;
      }
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
    getUserPermissions() {
      let params = {
        id: this.id,
        masterId: this.masterId
      };
      AdminMgmtInfo.get(
        params,
        data => {
          this.loading = false;
          this.authorityTree = this.formatAuthList(data.authorityTree);
          this.authorityTree.forEach((list, index) => {
            let child = [];
            if (list.children) {
              list.children.forEach((subList, subindex) => {
                for (const selected of data.authorities) {
                  if (subList.id === selected.id) {
                    child.push(subList);
                  }
                }
                if (subList.children) {
                  let subChild = [];
                  subList.children.forEach((subsubList, subsubindex) => {
                    for (const selected of data.authorities) {
                      if (subsubList.id === selected.id) {
                        subChild.push(subsubList);
                      }
                    }
                    if (subsubList.children) {
                      let subsubChild = [];
                      subsubList.children.forEach((subsubsubList, subsubsubindex) => {
                        for (const selected of data.authorities) {
                          if (subsubsubList.id === selected.id) {
                            subsubChild.push(subsubsubList);
                          }
                        }
                      });
                      subsubList.children = subsubChild;
                    }
                  });
                  subList.children = subChild;
                }
              });
              list.children = child;
            }
          });
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_GET_INFO : ', ErrorData);
        }
      );
    },
    formatAuthList(authList) {
      let listCopy = authList.concat();
      const formatList = listArr => {
        listArr.forEach(list => {
          if (!list.keyword) {
            // 非权限id格式修改, 防止与权限id重复
            // list.id = `+${list.id}`;
          }
          let children = [];
          let childArr = ['child', 'authorities', 'subAuthority'];
          for (let index in childArr) {
            if (list[childArr[index]]) {
              children = children.concat(list[childArr[index]]);
              delete list[childArr[index]];
            }
          }
          if (children.length) {
            list.children = children;
            formatList(list.children);
          }
        });
      };
      formatList(authList);
      return listCopy;
    },
    userPermissions() {
      this.activeTab = '0';
      this.authorityTree = [];
      this.getUserPermissions();
      this.dialogPermissions = true;
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
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 运营商列表三级联动
    listChange1(value) {
      // 第一个选择器触发
      console.log('一级运营商', value);
      this.companyList2 = [];
      this.companyList3 = [];
      this.list[1] = ''; // 第二个选择器清空
      this.shop = '';
      if (value) {
        this.getShops(value);
        this.getCompanies(value, 1);
      }
      // this.shopListChange(value);
    },
    listChange2(value) {
      // 第二个选择器触发
      this.companyList3 = [];
      this.list[2] = ''; // 第三个选择器清空
      this.shop = '';
      if (value || this.list[0]) {
        this.getShops(value || this.list[0]);
        if (value) {
          this.getCompanies(value, 2);
        }
      }
      // this.shopListChange(value === '' ? this.list[0] : value);
    },
    listChange3(value) {
      // 第三个选择器触发
      this.shop = '';
      if (value || this.list[1]) {
        this.getShops(value || this.list[1]);
      }
      // this.shopListChange(value === '' ? this.list[1] : value);
    },
    shopListChange(value) {
      // 店铺选择器触发
      // 这里的value是运营商列表传进来的
      this.form.role = [];
      this.selectRoles = [];
      this.getChildShops(value);
      this.getAllRoles(value);
    },
    childShopListChange(value) {
      // 子店铺选择器触发
      this.form.role = [];
      this.selectRoles = [];
      this.getAllRoles(value);
    },
    // 按钮'保存'
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.checkMobile(this.form.mobile);
        } else {
          return false;
        }
      });
    },
    checkMobile(mobile) {
      http
        .post('/admin/admin/checkMobile.jhtml', { mobile: mobile })
        .then(data => {
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
            this.dialogVisible = true;
          } else {
            this.userId = '';
            this.form.isMemberConvert = '';
            this.form.isManageThisStore = '';
            this.submit();
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
      this.submit();
    },
    submit() {
      this.validCode = '';
      this.code = '';
      this.dialogVisible = false;
      this.form.companyId =
        this.list[2] === ''
          ? this.list[1] === ''
            ? this.list[0] === ''
              ? this.form.companyId
              : this.list[0]
            : this.list[1]
          : this.list[2];
      this.form.shopId = this.childShop === '' ? this.shop : this.childShop;
      console.log('shopId: ', this.form.shopId);
      this.form.role = [];
      this.selectRoles.map(item => {
        this.form.role.push(item.id);
      });
      if (this.isCreate) {
        this.create();
      } else {
        this.update();
      }
    },
    // 新建管理员
    create() {
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
        roleIds: this.form.role,
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
      this.dialogAdminVisible = false;
      AdminMgmtInfo.create(
        params,
        data => {
          this.loading = false;
          this.$emit('created');
          this.refresh(data.AdminData.id, data.AdminData.masterId);
          this.$message.success('管理员创建成功');
        },
        ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1070') {
            this.form.gender = ErrorData.AdminData.gender;
            this.form.head = ErrorData.AdminData.head;
            this.form.id = ErrorData.AdminData.id;
            this.form.isEnabled = ErrorData.AdminData.isEnabled;
            this.form.loginAddress = ErrorData.AdminData.loginAddress;
            this.form.loginDate = ErrorData.AdminData.loginDate;
            this.form.mobile = ErrorData.AdminData.mobile;
            this.form.name = ErrorData.AdminData.name;
            this.form.nickname = ErrorData.AdminData.nickname;
            this.form.userName = ErrorData.AdminData.userName;
            this.form.isManageThisStore = '1';
            this.dialogAdminVisible = true;
          } else {
            this.$message.warning({ message: ErrorData.errorMessage });
            console.log('ERR_CREATE:', ErrorData);
          }
        }
      );
    },
    // 更新管理员信息
    update() {
      let params = {
        id: this.id,
        masterId: this.masterId,
        userName: this.form.userName,
        mobile: this.form.mobile,
        gender: this.form.gender,
        name: this.form.name,
        nickname: this.form.nickname,
        head: this.form.head,
        isEnabled: this.form.isEnabled,
        roleIds: this.form.role,
        compy: { id: this.form.companyId },
        shop: { id: this.form.shopId },
        isMemberConvert: this.form.isMemberConvert
      };
      this.loading = true;
      AdminMgmtInfo.save(
        params,
        data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$emit('created');
          this.refresh(data.AdminData.id, data.AdminData.masterId);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning({ message: ErrorData.errorMessage });
          console.log('ERR_UPDATE: ', ErrorData);
        }
      );
    },
    // 获取子运营商列表
    getCompanies(val, index) {
      let params = {
        parentId: val
      };
      AdminMgmtInfo.getCompanies(
        params,
        data => {
          if (val === undefined) {
            // 初始化时未选择运营商
            this.companyList1 = this.formatList(data.content);
          } else if (index === 1) {
            // 选择第一栏运营商,获取第二栏数据
            this.companyList2 = this.formatList(data.content);
          } else if (index === 2) {
            // 选择第二栏运营商,获取第三栏数据
            this.companyList3 = this.formatList(data.content);
          }
        },
        ErrorData => {
          console.log('ERR_GET_COMPANY_LIST: ', ErrorData);
        }
      );
    },
    // 获取店铺列表
    getShops(val) {
      let params = {
        companyId: val
      };
      // this.loading = true;
      AdminMgmtInfo.getShops(
        params,
        data => {
          this.loading = false;
          this.allShops = data.shopDatas;
          if (this.shop === '' && this.allShops[0] !== undefined) {
            if (!this.itemId && window.Company_ID) {
              this.shop = '';
            } else {
              this.shop = this.allShops[0].id;
              this.getChildShops(this.shop);
            }
          }
          this.getAllRoles(this.shop);
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_GET_SHOPS: ', ErrorData);
        }
      );
    },
    // 获取当前店铺的子店铺
    getChildShops(value) {
      this.childShop = '';
      this.childShopList = [];
      let params = {
        shopId: value
      };
      if (value) {
        // this.loading = true;
        AdminMgmtInfo.getChildShops(
          params,
          data => {
            this.loading = false;
            this.childShopList = data.dataList;
            // console.log('childList: ', this.childShopList);
          },
          ErrorData => {
            this.loading = false;
            console.log('ERR_GET_CHILD_SHOP_LIST: ', ErrorData.errorMessage);
          }
        );
      }
    },
    // 获取角色列表
    getAllRoles(value) {
      let params = {
        // id: this.id,
        companyId:
          this.list[2] === ''
            ? this.list[1] === ''
              ? this.list[0] === ''
                ? this.form.companyId
                : this.list[0]
              : this.list[1]
            : this.list[2],
        shopId: this.childShop === '' ? this.shop : this.childShop
      };
      AdminMgmtInfo.getAllRoles(
        params,
        data => {
          this.holeRoles = data.allRoles;
          this.allRoles = [];
          let unroles = [];
          for (let i = 0; i < this.newRoles.length; i++) {
            data.allRoles.forEach((item, index) => {
              if (this.newRoles[i] === item.name) {
                this.allRoles.push(item);
              }
            });
          }
          this.allRoles.forEach(item => {
            data.allRoles.forEach((role, index) => {
              if (item.name === role.name) {
                this.holeRoles.splice(index, 1);
              }
            });
          });
          unroles = this.holeRoles;
          this.allRoles = this.allRoles.concat(unroles);
          console.log(this.allRoles);
          if (!this.id) {
            this.roleArr = [];
            this.allRoles.map(item => {
              if (item.type === '15' || item.type === '16') {
                this.roleArr.push(item.id);
              }
            });
          }
        },
        ErrorData => {
          console.log('ERR_GET_ROLES: ', ErrorData);
        }
      );
    },
    // 刷新
    refresh(id = '', masterId = '') {
      this.id = id;
      this.masterId = masterId;
      let params = {
        id: id,
        masterId: masterId
      };
      this.loading = true;
      if (id === '') {
        this.isCreate = true;
        // id为空,初始化列表
        if (this.shopId) {
          // 查询店铺父运营商
          this.queryParent(this.shopId);
        }
        AdminMgmtInfo.add(
          params,
          data => {
            this.loading = false;
            this.$refs.form.resetFields();
            this.list = ['', '', ''];
            this.shop = '';
            this.companyList1 = [];
            this.companyList2 = [];
            this.companyList3 = [];
            this.childShopList = [];
            this.isOperatorAdminFlg = data.isOperatorAdminFlg; // 是否为管理员
            this.allShops = data.allShops ? data.allShops : [];
            // this.form.shopId = this.shop = this.isOperatorAdminFlg === '1' ? '' : (data.shop === undefined ? '' : data.shop.id); // 设置店铺初始值
            this.form.shopId = this.shop =
              this.shopId === '' || this.type === 'operator' ? (data.shop === undefined ? '' : data.shop.id) : this.shopId; // 获取从管理员列表中传入的shopId
            console.log('this.shop: ', this.shop);
            if (this.shop) {
              this.getChildShops(this.shop);
            }
            this.form.companyId =
              this.isOperatorAdminFlg === '1' ? this.form.companyId : data.company === undefined ? '' : data.company.id;
            // 平台运营登录选择一个二级运营商后点击其用户管理进入添加管理员
            console.log(this.companyList1);
            console.log(this.form.companyId);
            if (data.company) {
              this.companyList1.push(data.company);
            } else if (this.currentCompany.id) {
              this.companyList1.push(this.currentCompany);
            } else {
              this.getCompanies();
            }
            this.getAllRoles(); // 获取角色列表
            this.selectRoles = [];
            this.allRoles.map(item => {
              if (item.type === '15' || item.type === '16') {
                this.selectRoles.push({ id: item.id, name: item.name });
              }
            });
            this.companyList1.forEach(item => {
              console.log(item.id);
              if (this.form.companyId === item.id) {
                this.$set(this.list, 0, this.form.companyId);
              }
            });
            // 店铺运营登录添加
            if (this.isOperatorAdminFlg === '0') {
              this.$set(this.list, 0, this.form.companyId);
            }
          },
          ErrorData => {
            this.loading = false;
            console.log('ERR_ADD_NEW_ADMIN: ', ErrorData);
          }
        );
      } else {
        // 获取管理员信息
        this.shop = '';
        AdminMgmtInfo.get(
          params,
          data => {
            this.loading = false;
            this.form.userName = data.admin.userName;
            this.form.name = data.admin.name;
            this.form.mobile = data.admin.mobile;
            this.form.nickname = data.admin.nickname;
            this.form.gender = data.admin.gender;
            this.form.head = data.admin.head || this.defaultAvatar;
            this.form.pass = '';
            this.form.checkpass = '';
            this.form.isEnabled = data.admin.isEnabled;
            this.form.companyId = data.admin.compy ? data.admin.compy.id : '';
            this.isCreate = false;
            this.list = ['', '', '']; // 将父运营商推进选择器列表
            for (let i = 0; i < data.companyTrees.length; i++) {
              this.list[i] = data.companyTrees[i].id;
            }
            this.getCompanies();
            this.companyList2 = [];
            this.companyList3 = [];
            this.childShopList = [];
            for (let i = 0; i < this.list.length; i++) {
              // 获取运营商列表
              if (this.list[i] !== '') {
                this.getCompanies(this.list[i], i + 1);
              }
            }
            console.log(this.form.companyId);
            this.getShops(this.form.companyId); // 获取店铺列表
            this.form.shopId = this.shop = data.admin.shop ? data.admin.shop.id : ''; // 设置店铺初始值
            this.childShop = '';
            this.getChildShops(this.shop); // 获取子店铺列表
            // this.form.shopId = this.shop = this.shopId;
            this.selectRoles = data.admin.roleDatas;
            this.form.role = [];
            data.admin.roleDatas.map(item => {
              // 管理员所属角色
              this.form.role.push(item.id);
            });
            this.getAllRoles();
            // this.allShops = data.allShops;
          },
          ErrorData => {
            this.loading = false;
            console.log('ERR_GET_INFO : ', ErrorData);
          }
        );
      }
      // this.getCompanies(); // 获取一级运营商列表
    },
    // 格式化运营商列表
    formatList(data) {
      let list = [];
      let keys = Object.keys(data);
      let values = Object.values(data);
      for (let i = 0; i < keys.length; i++) {
        list.push({ id: keys[i], name: values[i] });
      }
      return list;
    },
    // 查询店铺父运营商
    queryParent(shopId) {
      if (shopId) {
        let params = {
          type: this.type,
          id: this.shopId
        };
        let url = 'admin/store/affiliatedOperator.jhtml';
        http
          .get(url, params)
          .then(data => {
            // 如果不是一级运营商
            if (data.data.id) {
              this.form.companyId = data.data.id;
              this.$set(this.list, 0, data.data.id);
              this.currentCompany = data.data;
            } else {
              this.form.companyId = shopId;
              this.$set(this.list, 0, shopId);
            }
            this.listChange1(data.data.id);
          })
          .catch(ErrorData => {
            console.log('ERR_GET_PARENT: ', ErrorData.errorMessage);
          });
      }
    }
  },
  watch: {
    // id变化时,重置角色,刷新
    // 'id': function() {
    // this.form.role = [];
    // this.refresh();
    // },
    id: function(newVal, oldVal) {
      if (newVal) {
        this.$refs.form.clearValidate();
      }
    },
    // 店铺变化时查询子店铺
    itemId: function(newVal, oldVal) {
      this.$refs.form.$el.scrollTop = 0;
    },
    shop: function(newVal, oldVal) {
      if (oldVal) {
        this.shopListChange(newVal);
      }
    }
  },
  computed: {},
  mounted() {
    this.refresh();
    this.getVerificationImg();
  }
};
</script>

<style lang="scss">
.valid-div {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .el-input--mini {
    margin-right: 5px;
  }
}
.code-div {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .el-input--mini {
    margin-right: 5px;
  }
}
.role-dialog {
  .line {
    border-bottom: 1px solid #e1e1e1;
    width: 100%;
    color: #999999;
  }
  .el-checkbox-group {
   .el-checkbox {
      width: 120px;
      margin: 0;
      padding: 3px;
      .el-checkbox__label {
        width: 120px;
        white-space: normal;
        text-overflow: ellipsis;
      }
    }
  }
}
.staff-mgmt-admin-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  img {
    width: 80px !important;
    height: 80px !important;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-select.el-select--small {
    width: 100%;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-checkbox-group .el-checkbox {
    width: 160px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
      text-overflow: ellipsis;
    }
  }
}
</style>
