<template>
  <div class="vehicle-mgmt-vehicle__people-picker">
    <el-input placeholder="请选择用户" v-model="value[contentField]" readonly="readonly">
      <el-button slot="append" type="primary" style="color:#fa9f33;padding: 10px;" @click="addMember" class="el-icon-circle-plus-outline"></el-button>
      <el-button slot="append" style="padding: 2px 10px;color:#fa9f33" @click="clickHandler" class="iconfont biz-icon-man" type="primary"></el-button>
    </el-input>
    <el-dialog title="添加所有者" :visible.sync="dialogVisible" width="50%" :appendToBody="true">
      <el-form :model="formMember" label-width="120px" ref="dialogFormModel" size="small" :rules="dialogRules" :inline-message="true">
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
          <el-select v-model="formMember.defaultCarInfo.brand" placeholder="请选择，如宝马" filterable style="width: 100%;" @change="brandChange">
            <el-option v-for="(item,index) in brandData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="formMember.defaultCarInfo.series" placeholder="请选择，如宝马3系" filterable style="width: 100%;" @change="seriesChange">
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
        <el-button type="primary" @click="createMember()" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <biz-dialog-selector
      slot="float"
      :visibility.sync="showDialog"
      :loading="dialogLoading"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogFilters"
      @confirmed="confirmedHandler"
      @open="openedHandler"
      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
    >
      <el-table-column prop="userName" label="会员信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../../../assets/images/default_user.png" />
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
          {{scope.row.enableState==='1'?'启用':'停用'}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="店铺">
        <template slot-scope="scope">
          {{scope.row.shop.name}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="最后登录">
        <template slot-scope="scope">
          {{scope.row.lastLoginDate}}
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';

import service from '@/service/vehicle-mgmt/Component';
import vehicleBaseInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import serviceMember from '@/service/order-mgmt/orderMgmt';

export default {
  name: 'VehicleMgmtPeoplePicker',
  components: {
    BizDialogSelector
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Object
    },
    contentField: {
      type: String,
      default() {
        return 'name';
      }
    }
  },
  data() {
    return {
      text: '',
      showDialog: false,
      dialogLoading: false,
      dialogTableData: [],
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
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
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
              let obj = {
                defaultCarInfo: {
                  id: data.data.defaultCarInfo ? data.data.defaultCarInfo.id : '',
                  brand: data.data.defaultCarInfo ? data.data.defaultCarInfo.brand : '',
                  plateNumber: data.data.defaultCarInfo ? data.data.defaultCarInfo.plateNumber : '',
                  series: data.data.defaultCarInfo ? data.data.defaultCarInfo.series : '',
                  type: data.data.defaultCarInfo ? data.data.defaultCarInfo.type : ''
                },
                gender: data.data.gender,
                id: data.data.id,
                mobile: data.data.mobile,
                name: data.data.name,
                userName: data.data.name
              };
              this.$emit('input', obj);
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
    queryPeople(params) {
      this.dialogLoading = true;

      service.queryPeople(
        params,
        data => {
          this.dialogTableData = data.content;

          this.$set(this.dialogPagination, 'total', parseInt(data.total));

          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
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

    clickHandler(e) {
      this.showDialog = true;
    },
    confirmedHandler(selectionKeys, selections) {
      let obj = selections[0];
      this.text = obj.name;
      this.$emit('input', obj);
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || ''
      };
    },
    openedHandler() {
      this.dialogPagination.currentPage = 1;
      this.dialogPagination.pageSize = 20;
      this.dialogFilters = [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ];
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogFilterDataChange(filters) {
      this.$set(this.dialogPagination, 'currentPage', 1);
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryPeople(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryPeople(this.getDialogQueryParams());
    }
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
</style>
