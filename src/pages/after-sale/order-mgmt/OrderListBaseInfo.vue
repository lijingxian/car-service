<template>
  <biz-grid class="maintenance-order-list-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form
      :rules="rules"
      ref="form"
      :model="form"
      label-width="120px"
      size="small"
      v-loading="loading"
      :disabled="form.mode === '1' || id === '' ? false : true"
    >
      <el-form-item label="车主" prop="userId" :inline-message="true">
        <!-- <el-select filterable
        default-first-option
        :loading="queryLoading"
        @change="queryPlateNameList"
        :filter-method="queryMemberNameList"
        placeholder="请输入车主姓名" v-model="form.userId">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>-->
        <el-input v-model="form.memberName" placeholder="请输入车主姓名" @change="queryPlateNameList">
          <div slot="append" class="input-append">
            <el-button type="text" @click="addMember">
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-button type="text" @click="selectOwner">
              <i class="iconfont biz-icon-man"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-select filterable allow-create placeholder="请输入车牌号" v-model="form.plateNumber" @change="changeCarType">
          <el-option v-for="item in plateList" :key="item.id" :label="item.plateNumber" :value="item.plateNumber"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="品牌" prop="brand">
        <el-select placeholder="请选择品牌" v-model="form.brandId" @change="baseData('1',form.brandId)">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列" prop="series">
        <el-select placeholder="请选择系列" v-model="form.seriesId" @change="baseData('2',form.brandId,form.seriesId)">
          <el-option v-for="item in seriesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="车型" prop="carType">
        <el-select filterable allow-create placeholder="请选择车型" v-model="form.carType">
          <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select placeholder="请选择类型" v-model="form.type" @change="typeChange">
          <el-option label="保养" value="0"></el-option>
          <el-option label="维修" value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-collapse v-model="collapseGroup" class="collapse">
        <el-collapse-item name="1">
          <template slot="title">
            <span style="margin-left: 38px">预约项目</span>
          </template>
          <el-form-item label-width="100px" prop="orderItems">
            <el-checkbox-group v-model="selectedItems">
              <el-checkbox v-for="item in form.items" :key="item.index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>-->
      <el-form-item label="预约项目">
        <product-selector :disabled="form.mode === '1' || id === '' ? false : true" v-model="form.items"></product-selector>
      </el-form-item>
      <el-form-item label="预估费用(元)" prop="cost">
        <el-input placeholder="请输入预估费用" v-model="form.cost"></el-input>
      </el-form-item>
      <el-form-item label="行驶里程(km)" prop="drivingRange">
        <el-input placeholder="请输入行驶里程" v-model="form.drivingRange"></el-input>
      </el-form-item>
      <el-form-item label="预约到店日期" prop="happenDate">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" v-model="form.happenDate" type="datetime" placeholder="请选择预约到店日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否到店" prop="state">
        <el-select v-model="form.state">
          <el-option label="未到店" value="0"></el-option>
          <el-option label="已到店" value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-dialog title="添加会员" :visible.sync="dialogVisible" width="50%" :appendToBody="true">
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
        <el-button type="primary" @click="createMember" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <biz-car-owner-selector :visibility.sync="showDialog" :isClear="false" :selectionKeys="selectedDriverId" @confirmed="confirmSelectedOwner"></biz-car-owner-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import vehicleBaseInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import serviceMember from '@/service/order-mgmt/orderMgmt';
// 车主选择弹出框
import BizCarOwnerSelector from '@/components/BizDialogSelector/BizCarOwnerSelector.vue';
import OrderMgmt from '@/service/maintenance/orderMgmt';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';
import serviceProjectService from '@/service/maintenance/serviceProject';

import ProductSelector from '../components/ProductSelector.vue';

export default {
  name: 'OrderListBaseInfo',
  props: {
    itemId: {
      type: Object
    },
    currentRowType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      id: '',
      showDialog: false,
      // 选中车主id
      selectedDriverId: [],
      brandList: [],
      seriesList: [],
      typeList: [],
      collapseGroup: ['1'],
      rules: {
        userId: [{ required: true, message: '请输入车主姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        cost: [
          { required: true, message: '请输入费用', trigger: 'blur' },
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        drivingRange: [
          { required: true, message: '请输入行驶里程', trigger: 'blur' },
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        happenDate: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:aftersale.appointment.edit']
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      queryLoading: false,
      loading: false,
      form: {
        memberName: '',
        userId: '',
        mobile: '',
        plateNumber: '',
        carType: '',
        type: '0',
        items: [],
        cost: '',
        drivingRange: '',
        happenDate: '',
        state: '0'
      },
      isOperator: '0',
      // 预约项目是否显示
      show1: true,
      plateList: [],
      nameList: [],
      selectedItems: [],
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
      modeData: []
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
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
              this.form.userId = data.data.id;
              this.$set(this.form, 'memberName', data.data.name);
              this.$set(this.form, 'mobile', data.data.mobile);
              if (data.data.defaultCarInfo) {
                this.$set(this.form, 'plateNumber', data.data.defaultCarInfo.plateNumber);
                this.$set(this.form, 'carType', data.data.defaultCarInfo.type);
              }
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
    // 点击车主输入框
    selectOwner() {
      this.showDialog = true;
    },
    typeChange() {
      this.$refs.form.clearValidate('type');
    },
    confirmSelectedOwner(key, value) {
      this.showDialog = false;
      // this.form.memberName = value[0].name;
      this.form.userId = value[0].id;
      this.$set(this.form, 'memberName', value[0].name);
      this.selectedDriverId = key;
    },
    handleLogoSuccess(url) {
      this.form.logo[0] = url;
    },
    baseData(type, brandId, seriesId) {
      serviceProjectService.baseData(
        {
          type: type,
          brandId: brandId,
          seriesId: seriesId
        },
        data => {
          if (type === '0') {
            this.brandList = data.dataList;
          }
          if (type === '1') {
            this.seriesList = data.dataList;
          }
          if (type === '2') {
            this.typeList = data.dataList;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 设置当前日期
    getToday() {
      let date = new Date();
      return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      }`;
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    // 提交
    submit() {
      if (this.id === '') {
        if (this.form.happenDate < this.getToday()) {
          this.$message.warning('日期不得早于今天');
          return;
        }
        this.create();
      } else {
        this.update();
      }
    },
    // 创建
    create() {
      let params = {
        userId: this.form.userId,
        mobile: this.form.mobile,
        carId: this.checkCarId(this.form.plateNumber),
        plateNumber: this.form.plateNumber,
        brandId: this.form.brandId,
        seriesId: this.form.seriesId,
        carTypeId: this.form.carTypeId,
        carType: this.form.carType,
        type: this.form.type,
        items: this.formatItems(this.form.items),
        cost: this.form.cost,
        drivingRange: this.form.drivingRange,
        happenDate: this.form.happenDate,
        state: this.form.state
      };
      this.loading = true;
      OrderMgmt.create(
        params,
        data => {
          this.loading = false;
          this.$message.success('创建成功');
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 更新
    update() {
      let params = {
        id: this.form.id,
        userId: this.form.userId,
        mobile: this.form.mobile,
        carId: this.checkCarId(this.form.plateNumber),
        plateNumber: this.form.plateNumber,
        brandId: this.form.brandId,
        seriesId: this.form.seriesId,
        carTypeId: this.form.carTypeId,
        carType: this.form.carType,
        type: this.form.type,
        items: this.formatItems(this.form.items),
        cost: this.form.cost,
        drivingRange: this.form.drivingRange,
        happenDate: this.form.happenDate,
        state: this.form.state
      };
      this.loading = true;
      OrderMgmt.update(
        params,
        data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.$emit('created');
        },
        ErrorData => {
          this.loading = false;
        }
      );
    },
    // 初始化
    refresh() {
      this.collapseGroup = ['1'];
      this.selectedDriverId = [];
      let params = {
        id: this.id,
        type: this.currentRowType
      };
      // this.loading = true;
      if (this.id === '') {
        this.nameList = [];
        this.plateList = [];
        OrderMgmt.query(
          params,
          data => {
            this.loading = false;
            this.form = data.carMaintainData;
            this.$set(this.form, 'items', data.carMaintainData.items);
            this.setItems();
          },
          ErrorData => {
            this.loading = false;
          }
        );
      } else {
        OrderMgmt.query(
          params,
          data => {
            this.loading = false;
            this.form = data.carMaintainData;
            this.selectedDriverId = Array(this.form.userId);
            this.queryMemberNameList(this.form.memberName);
            // this.form.userId = this.nameList.length === 0 ? '' : this.nameList[0].id;
            this.queryPlateNameList(this.form.userId);
            this.setItems();
          },
          ErrorData => {
            this.loading = false;
          }
        );
      }
    },
    // 查询车主列表
    queryMemberNameList(val) {
      this.queryLoading = true;
      let params = {
        key: val
      };
      MaintenanceRecords.queryMemberNameList(
        params,
        data => {
          this.queryLoading = false;
          this.nameList = data.datas;
        },
        ErrorData => {
          this.queryLoading = false;
          console.log('ERR_GET_NAME_LIST: ', ErrorData);
        }
      );
    },
    // 查询车主名下车牌列表
    queryPlateNameList(val) {
      let params = {
        id: val
      };
      MaintenanceRecords.queryPlateNameList(
        params,
        data => {
          // let trigger = false;
          this.plateList = [];
          this.plateList = data.datas;
          if (this.plateList.length > 0) {
            this.plateList.map(plate => {
              if (plate.id === this.form.carId) {
                // trigger = true;
                this.form.carType = plate.type === undefined ? '' : plate.type;
                this.form.brandId = plate.brandId === undefined ? '' : plate.brandId;
                this.form.seriesId = plate.seriesId === undefined ? '' : plate.seriesId;
              }
            });
            // 如果为创建则默认第一个车牌
            if (!this.itemId.id) {
              this.form.carId = this.plateList[0].id;
              this.form.plateNumber = this.plateList[0].plateNumber;
              this.form.carType = this.plateList[0].type === undefined ? '' : this.plateList[0].type;
              this.form.brandId = this.plateList[0].brandId === undefined ? '' : this.plateList[0].brandId;
              this.form.seriesId = this.plateList[0].seriesId === undefined ? '' : this.plateList[0].seriesId;
            }
          }
          this.form.mobile = this.mobile ? this.mobile : data.member;
        },
        ErrorData => {
          console.log('ERR_GET_PLATE_LIST: ', ErrorData);
        }
      );
    },
    changeCarType(val) {
      if (this.plateList.length > 0) {
        this.plateList.map(item => {
          if (item.plateNumber === val) {
            this.form.carId = item.id;
            this.form.carType = item.type;
          }
        });
      }
      this.$refs.form.clearValidate('plateNumber');
    },
    // 重置并刷新预约项目选择id
    setItems() {
      this.selectedItems = [];
      this.form.items.map(data => {
        if (data.isSelected === '1') {
          this.selectedItems.push(data.id);
        }
      });
    },
    // 格式化预约id
    formatItems(items) {
      return items.filter(i => i.isSelected === '1').map(i => ({ id: i.id }));
    },
    // 车牌列表中查询对应carId
    checkCarId(number) {
      let carId = '';
      this.plateList.map(plate => {
        if (plate.plateNumber === number) {
          carId = plate.carId;
        }
      });
      return carId;
    }
  },
  created() {
    this.baseData('0');
  },
  watch: {
    // id变化时,重置角色,刷新
    itemId: function(newVal, oldVal) {
      this.$refs.form.$el.scrollTop = 0;
      this.id = newVal.id;
      this.form.role = [];
      this.selectedDriverId = [];
      this.refresh();
    },
    'form.memberName': function(newVal, oldVal) {
      if (newVal) {
        this.$refs.form.clearValidate();
      }
      if (this.form.userId) {
        this.queryPlateNameList(this.form.userId);
      }
    }
  },
  mounted() {
    this.refresh();
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizCarOwnerSelector,
    ProductSelector
  }
};
</script>

<style lang="scss">
.maintenance-order-list-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
    width: 100%;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .collapse {
    margin-left: 20px;
    margin-bottom: 18px;
    .el-collapse-item__content {
      padding-bottom: 0;
    }
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
