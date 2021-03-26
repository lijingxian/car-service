<template>
  <biz-grid class="member-basic-info">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>-->
    <biz-header slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-header>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :rules="rules" :disabled="!isEdit"
      :inline-message="true">
      <el-form-item label="卡号" prop="sn" v-if="itemId.id">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="会员卡类型" prop="template">
        <el-select v-model="form.template.id" placeholder="请选择会员卡制式" :disabled="!!itemId.id" @change="templateChange">
          <el-option v-for="(template,index) in templateList" :key="index" :label="template.name" :value="template.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="等级" prop="memberRank" v-if="itemId.id">
        <el-input :value="form.memberRank?form.memberRank.name:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="member" v-if="form.member.memberType==='0'">
        <el-input :value="form.member?form.member.nickname:''" :disabled="true" style="width:76%">
          <div slot="append" class="input-append" v-if="!itemId.id">
            <el-button type="text" @click="addMember">
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-button type="text" @click="showStorePicker">
              <i class="iconfont biz-icon-man"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" v-if="form.member.memberType==='0'">
        <el-input :value="form.member?form.member.name:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话号" prop="mobile" v-if="form.member.memberType==='0'">
        <el-input :value="form.member?form.member.mobile:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="企业" prop="enterpriseName" v-if="form.member.memberType==='1'">
        <el-input :value="form.member?form.member.enterpriseName:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="contactMobile" v-if="form.member.memberType==='1'">
        <el-input :value="form.member?form.member.contactMobile:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="V豆" prop="bean">
        <el-input :value="form.bean" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="point">
        <el-input :value="form.point" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="余额" prop="balance">
        <el-input :value="form.balance" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="发卡时间" prop="createDate" v-if="itemId.id">
        <el-input :value="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="有效期截止" prop="endDate">
        <el-date-picker type="date" size="small" value-format="yyyy-MM-dd" v-model="form.endDate" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <!-- <el-radio-group v-model="form.state">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>-->
        <el-switch v-model="form.state" active-value="1" active-color="#87d068" inactive-value="0" inactive-color="#d9d9d9">
        </el-switch>
      </el-form-item>
    </el-form>
    <el-dialog title="添加会员" :visible.sync="dialogVisible" width="50%" :appendToBody="true">
      <el-form :model="formMember" label-width="120px" ref="dialogFormModel" size="small" :rules="dialogRules"
        :inline-message="true">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formMember.mobile" placeholder="请输入手机号，如1888888888" @blur="mobileBlur"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formMember.userName" placeholder="请输入用户名，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formMember.nickname" placeholder="请输入昵称，如1888888888"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formMember.name" placeholder="请输入姓名，如张三"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formMember.password" type="text" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formMember.gender">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="formMember.defaultCarInfo.plateNumber" placeholder="请输入车牌号，如浙12345"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="formMember.defaultCarInfo.brand" placeholder="请选择，如宝马" filterable style="width: 100%;"
            @change="brandChange">
            <el-option v-for="(item,index) in brandData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="formMember.defaultCarInfo.series" placeholder="请选择，如宝马3系" filterable style="width: 100%;"
            @change="seriesChange">
            <el-option v-for="(item,index) in seriesData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型">
          <el-select v-model="formMember.defaultCarInfo.type" placeholder="请选择，如宝马3系2016款" style="width: 100%;">
            <el-option v-for="(item,index) in modeData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆识别代码">
          <el-input v-model="formMember.defaultCarInfo.vin" placeholder="请输入车辆识别代码，如1G1BL52P7TR115520"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createMember" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <biz-dialog-selector title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'"
      :selectionKeys="selectionKeys" :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination"
      :selectionMode="'single'" :filters="dialogFilters" @confirmed="handleConfirmed" @open="opened" @operate="dialogOperate"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange">
      <el-table-column prop="userName" label="会员信息">
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
                <span>{{scope.row.mobile||scope.row.contactMobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="状态">
        <template slot-scope="scope">
          {{getStatus(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="店铺">
        <template slot-scope="scope">
          {{scope.row.shop.name}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="最后登录">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.lastLoginIp}}
            </div>
            <div class="overflow">
              {{scope.row.lastLoginDate}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import BizDialogSelector from './components/BizDialogSelector';
import vehicleBaseInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import serviceMember from '@/service/order-mgmt/orderMgmt';
import http from '@/common/http';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    templateId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizHeader,
    BizDialogSelector
  },
  data() {
    let validateTemplate = (rule, value, callback) => {
      if (!this.form.template.id) {
        callback(new Error('请选择会员卡类型'));
      } else {
        callback();
      }
    };
    let validateNickname = (rule, value, callback) => {
      if (!this.form.member.nickname) {
        callback(new Error('请选择会员'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      // 用户信息
      form: {
        id: '',
        state: '1',
        template: {
          state: '',
          id: ''
        },
        member: {
          id: '',
          contactMobile: '',
          enterpriseName: '',
          memberType: '0'
        },
        endDate: ''
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selectionKeys: [],
      dialogLoading: true,
      dialogTableData: [],
      templateList: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/昵称/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: '',
      rules: {
        template: [
          { required: true, message: '请选择会员卡类型', trigger: 'change' },
          { validator: validateTemplate, trigger: 'change' }
        ],
        member: [
          { required: true, message: '请选择会员', trigger: 'change' },
          { validator: validateNickname, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogRules: {
        userName: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '用户名只能为数字或字母', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在4-20位', trigger: 'blur' }
        ],
        mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        nickname: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 20, message: '密码应在6-20位之间', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, trigger: 'blur', message: '请再次输入密码' },
          {
            trigger: 'blur',
            validator: (rule, dialogRules, callback) => {
              if (this.formMember.password === this.formMember.rePassword) {
                callback();
              } else {
                callback(new Error('两次输入密码不一致'));
              }
            }
          }
        ]
      },
      formMember: {
        userName: '',
        mobile: '',
        name: '',
        password: '123456',
        nickname: '',
        gender: '2',
        defaultCarInfo: {
          plateNumber: '',
          brand: '',
          series: '',
          type: '',
          vin: ''
        }
      },
      brandData: [],
      seriesData: [],
      brandList: [],
      seriesList: [],
      modeData: []
    };
  },
  watch: {
    'itemId.id': {
      handler: function(nVal) {
        if (nVal) {
          this.$refs.form.resetFields();
          this.query();
        } else {
          this.form = {
            id: '',
            state: '1',
            template: {
              state: '',
              id: ''
            },
            member: {
              id: '',
              memberType: '0',
              enterpriseName: '',
              contactMobile: ''
            }
          };
        }
      }
    }
  },
  mounted() {
    this.getTemplateList();
  },
  methods: {
    addMember() {
      this.formMember = {
        userName: '',
        mobile: '',
        name: '',
        password: '123456',
        nickname: '',
        gender: '2',
        defaultCarInfo: {
          plateNumber: '',
          vin: '',
          brand: '',
          series: '',
          type: ''
        }
      };
      this.queryBrandList();
      this.getBrandList();
      this.dialogVisible = true;
    },
    createMember() {
      this.$refs.dialogFormModel.validate((valid, a) => {
        if (valid) {
          serviceMember.createMember(
            this.formMember,
            data => {
              this.loading = false;
              this.$message.success('保存成功');
              this.dialogVisible = false;
              this.form.member.id = data.data.id;
              this.form.member.nickname = data.data.nickname;
              this.form.member.name = data.data.name;
              this.form.member.nickname = data.data.mobile;
              this.form.member.mobile = data.data.mobile;
              this.form.bean = '0';
              this.form.point = '0';
              this.form.balance = '0';
            },
            // result_code 不是100的处理
            ErrorData => {
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    mobileBlur() {
      if (!this.formMember.id && !this.formMember.nickname) {
        this.$set(this.formMember, 'nickname', this.formMember.mobile);
      }
      if (!this.formMember.id && !this.formMember.userName) {
        this.$set(this.formMember, 'userName', this.formMember.mobile);
      }
    },
    brandChange(val) {
      this.getSeriesList(val);

      this.formMember.defaultCarInfo.series = '';
      this.formMember.defaultCarInfo.type = '';
    },
    seriesChange(val) {
      this.getModeList(val);

      this.formMember.defaultCarInfo.type = '';
    },
    queryBrandList() {
      vehicleBaseInfo.queryBrandList(
        {},
        data => {
          this.brandList = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      vehicleBaseInfo.querySeriesList(
        { brand: val },
        data => {
          this.seriesList = data.dataList ? data.dataList : [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getBrandList() {
      vehicleBaseInfo.queryBrandList(
        {},
        data => {
          this.brandData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSeriesList(val) {
      vehicleBaseInfo.querySeriesList(
        { brand: val },
        data => {
          this.seriesData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getModeList(val) {
      vehicleBaseInfo.queryTypeList(
        { series: val, brand: this.formMember.defaultCarInfo.brand },
        data => {
          this.modeData = data.dataList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    operate(name) {
      this[name]();
    },
    resetForm() {
      this.form = {
        id: '',
        template: {
          state: '',
          id: ''
        },
        member: {
          id: '',
          memberType: '0',
          enterpriseName: '',
          contactMobile: ''
        },
        endDate: ''
      };
    },
    templateChange(val) {
      for (const item of this.templateList) {
        if (val === item.id) {
          this.form.endDate = item.endDate;
        }
      }
    },
    getTemplateList() {
      let params = { dataType: 'current', shopId: window.top.SHOP_ID || '', state: '1' };
      http
        .get('/admin/memberCardTemplate/memberCardTemplates.jhtml', params)
        .then(data => {
          this.templateList = data.content;
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.member = selections[0];
      // this.form.state = selections[0].enableState;
      this.form.bean = '0';
      this.form.point = '0';
      this.form.balance = '0';
      this.form.memberType = selections[0].memberType;
      this.form.enterpriseName = selections[0].enterpriseName;
      this.form.contactMobile = selections[0].contactMobile;
      // this.$set(this.form, 'selectionKeys', selectionKeys);
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }

      return '';
    },
    query() {
      if (this.itemId.id) {
        this.loading = true;
        service.getVipCardInfo(
          {
            userCardId: this.itemId.id || '',
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.form = data.content;
            let flag = true;
            this.templateList.map(item => {
              if (item.id === this.form.template.id) {
                flag = false;
              }
            });
            if (flag) {
              this.templateList.push(this.form.template);
            }
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.itemId.id &&
            service.updateVipCardState(
              {
                ids: [this.itemId.id],
                state: this.form.state,
                endDate: this.form.endDate
              },
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          !this.itemId.id &&
            service.createVipCard(
              {
                member: { id: this.form.member.id },
                state: this.form.state,
                shopId: window.top.SHOP_ID || '',
                template: { id: this.form.template.id },
                endDate: this.form.endDate
              },
              data => {
                this.$message.success('保存成功');
                this.loading = false;
                this.$emit('operationSuccess', data.id);
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
        }
      });
    },
    showStorePicker(e) {
      this.showDialog = true;
    },
    queryPeople(params) {
      service.queryPeople(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    opened() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称/手机号',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryPeople(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogOperate(name) {}
  }
};
</script>

<style lang="scss">
.customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .title {
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
.member-basic-info {
  .el-form {
    overflow: auto;
    padding-right: 20px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
}
</style>
