<template>
  <div class="maintenance-records-list-base-info">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading"
      :disabled="form.mode === '1' || id === '' ? false : true" :inline-message="true">
      <el-form-item label="车主" prop="userId">
        <!-- <el-select filterable
        default-first-option
        :loading="queryLoading"
        @change="queryPlateNameList"
        :filter-method="queryMemberNameList"
        placeholder="请输入车主姓名" v-model="form.userId">
          <el-option v-for="item in nameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> -->
        <el-input placeholder="请输入车主姓名" @focus="selectOwner" v-model="form.memberName" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input placeholder="请输入手机号" v-model="form.mobile" disabled></el-input>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-select filterable allow-create placeholder="请选择车牌号" v-model="form.plateNumber" @change="changeCarType" disabled>
          <el-option v-for="item in plateList" :key="item.id" :label="item.plateNumber" :value="item.plateNumber"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车型" prop="carType">
        <el-input placeholder="选择车牌号后自动显示" v-model="form.carType" disabled></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select placeholder="请选择类型" v-model="form.type" @change="typeChange">
          <el-option label="保养" value="0"></el-option>
          <el-option label="维修" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-collapse v-model="collapseGroup" class="collapse">
        <el-collapse-item name="1">
          <template slot="title">
            <span style="margin-left: 38px">维保项目</span>
          </template>
          <el-form-item prop="implementedItems" label-width="100px">
            <product-selector :disabled="form.mode === '1' || id === '' ? false : true" :items="form.implementedItems" @input="updateImplementedItems"></product-selector>
          </el-form-item>
        </el-collapse-item>
        <!-- <el-collapse-item name="2">
          <template slot="title">
            <span style="margin-left: 25px">未实施项目</span>
          </template>
          <el-form-item prop="unImplementedItems" label-width="100px">
            <el-checkbox-group v-model="selectedUnimplementedItems">
              <el-checkbox v-for="item in form.unimplementedItems" :key="item.index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-collapse-item>-->
      </el-collapse>
      <el-form-item label="费用(元)" prop="cost">
        <el-input-number v-model="form.cost" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="行驶里程(km)" prop="drivingRange">
        <el-input-number v-model="form.drivingRange" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="日期" prop="happenDate">
        <el-date-picker v-model="form.happenDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="图片" prop="pic">
        <biz-avatar-uploader-multi v-model="form.images" :disabled="form.mode === '1' || id === '' ? false : true">
        </biz-avatar-uploader-multi>
      </el-form-item>
    </el-form>
    <biz-save-button slot="bottom" :operations="operations" @operate="operate">
    </biz-save-button>
    <biz-car-owner-selector :visibility.sync="showDialog" :selectionKeys="selectedDriverId" @confirmed="confirmSelectedOwner">
    </biz-car-owner-selector>
  </div>
</template>

<script>
// import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
// 单张上传
import { BizAvatarUploaderMulti } from '@/components/BizForm';

// 车主选择弹出框
import BizCarOwnerSelector from '@/components/BizDialogSelector/BizCarOwnerSelector.vue';

import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';

import ProductSelector from '../components/ProductSelector.vue';

export default {
  name: 'RecordsListBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      id: '',
      // 折叠面板数组
      collapseGroup: ['1', '2'],
      // 显示车主选择弹出框
      showDialog: false,
      // 选中车主id
      selectedDriverId: [],
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
        cost: [{ required: true, message: '请输入费用', trigger: 'blur' }],
        drivingRange: [{ required: true, message: '请输入行驶里程', trigger: 'blur' }],
        happenDate: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      operations: [
        {
          label: '取消',
          name: 'cancle',
          type: 'primary',
          disabled: false
        },
        {
          label: '确定',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      loading: false,
      mobile: '',
      // 加载车主列表
      queryLoading: false,
      form: this.getOriginFormData(),
      // 车主列表
      nameList: [],
      // 车牌号列表
      plateList: [],
      // 维保项目Map
      implementedMap: null,
      // selectedImplementedItems: [],
      selectedUnimplementedItems: [],
      isOperator: '0',
      // 维保项目是否显示
      show1: true,
      // 未实施项目是否显示
      show2: true,
      // 预约项目是否显示
      show3: true
    };
  },
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    typeChange() {
      this.$refs.form.clearValidate('type');
    },
    updateImplementedItems(value) {
      this.$set(this.form, 'implementedItems', value);
      // 维保项目选中时自动计算总价格
      if (this.form.cost === '' || typeof this.form.cost === 'number') {
        this.form.cost = 0;
        this.form.implementedItems.forEach(i => {
          if (i.isSelected === '1') {
            this.form.cost += Number(i.value);
          }
        });
      }
    },
    getOriginFormData() {
      return {
        memberName: this.row.member ? this.row.member.name : '',
        userId: this.row.member ? this.row.member.id : '',
        mobile: this.row.member ? this.row.member.mobile : '',
        carId: this.row.id,
        plateNumber: this.row.plateNumber,
        carType: this.row.type,
        type: '',
        implementedItems: [],
        unimplementedItems: [],
        cost: 0,
        drivingRange: '',
        happenDate: '',
        images: []
      };
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
    handleLogoSuccess(url) {
      if (this.form.images) {
        // this.form.images[0] = url;
        this.$set(this.form.images, 0, url);
      } else {
        this.form.images = [];
        // this.form.images[0] = url;
        this.$set(this.form.images, 0, url);
      }
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.form.happenDate > this.getToday()) {
            this.$message.warning('维保记录不可选择晚于当天日期');
            return;
          }
          if (valid) {
            this.submit();
          } else {
            return false;
          }
        }
      });
    },
    cancle() {
      this.$emit('cancle');
    },
    // 提交
    submit() {
      if (this.id === '') {
        this.create();
      } else {
        this.update();
      }
    },
    formatImplement(val) {
      return val.filter(i => i.isSelected === '1').map(i => ({ id: i.id }));
    },
    // 创建
    create() {
      let params = {
        userId: this.form.userId,
        mobile: this.form.mobile,
        carId: this.form.carId,
        plateNumber: this.form.plateNumber,
        carType: this.form.carType,
        type: this.form.type,
        implementedItems: this.formatImplement(this.form.implementedItems),
        unimplementedItems: this.formatImplement(this.selectedUnimplementedItems),
        cost: this.form.cost,
        drivingRange: this.form.drivingRange,
        happenDate: this.form.happenDate,
        images: this.form.images
      };
      this.loading = true;
      MaintenanceRecords.create(
        params,
        data => {
          this.loading = false;
          this.$message.success('创建成功');
          setTimeout(() => {
            this.$emit('created');
          }, 200);
          // this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    // 更新
    update() {
      let params = {
        id: this.form.id,
        userId: this.form.userId,
        mobile: this.form.mobile,
        carId: this.form.carId,
        plateNumber: this.form.plateNumber,
        carType: this.form.carType,
        type: this.form.type,
        implementedItems: this.formatImplement(this.form.implementedItems),
        unimplementedItems: this.formatImplement(this.selectedUnimplementedItems),
        cost: this.form.cost,
        drivingRange: this.form.drivingRange,
        happenDate: this.form.happenDate,
        images: this.form.images
      };
      this.loading = true;
      MaintenanceRecords.update(
        params,
        data => {
          this.loading = false;
          this.$message.success('更新成功');
          setTimeout(() => {
            this.$emit('created');
          }, 200);
          // this.$emit('created');
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    // 初始化
    refresh(val = this.id) {
      this.collapseGroup = ['1', '2'];
      let params = {
        id: val,
        shopId: window.top.SHOP_ID || ''
      };
      // this.loading = true;
      this.form = this.getOriginFormData();
      if (this.id) {
        MaintenanceRecords.query(
          params,
          data => {
            this.loading = false;
            this.form = Object.assign(this.getOriginFormData(), data.carMaintainData);
            let tmp = new Map();
            this.form.implementedItems.map(item => {
              tmp.set(item.id, item.value);
            });
            this.implementedMap = tmp;
            this.selectedDriverId = Array(this.form.userId);
            // this.queryMemberNameList(this.form.memberName);
            // this.form.userId = this.nameList.length === 0 ? '' : this.nameList[0].id;
            this.queryPlateNameList(this.form.userId);
            this.mobile = data.carMaintainData.mobile;
            this.setItems();
            this.operations[0].disabled = true;
            if (this.form.mode === '1') {
              this.operations[0].disabled = false;
            }
          },
          ErrorData => {
            this.loading = false;
          }
        );
      } else {
        this.operations[0].disabled = false;
        MaintenanceRecords.query(
          params,
          data => {
            this.loading = false;
            this.form = Object.assign(this.getOriginFormData(), data.carMaintainData);
            let tmp = new Map();
            this.form.implementedItems.map(item => {
              tmp.set(item.id, item.value);
            });
            this.implementedMap = tmp;
            this.form.images = [];
            // this.selectedImplementedItems = [];
            this.selectedUnimplementedItems = [];
            this.setItems();
          },
          ErrorData => {
            this.loading = false;
          }
        );
      }
    },
    // 点击车主输入框
    selectOwner() {
      this.showDialog = true;
    },
    confirmSelectedOwner(key, value) {
      this.showDialog = false;
      // this.form.memberName = value[0].name;
      this.$set(this.form, 'memberName', value[0].name);
      this.form.userId = value[0].id;
      this.selectedDriverId = key;
      this.form.plateNumber = '';
      this.form.carType = '';
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
            // this.plateList.map(plate => {
            //   if (plate.id === this.form.carId) {
            //     // trigger = true;
            //     this.form.carType = plate.type === undefined ? '' : plate.type;
            //   }
            // });
            // 如果为创建则默认第一个车牌
            if (!this.itemId.id) {
              this.form.carId = this.plateList[0].id;
              this.form.plateNumber = this.plateList[0].plateNumber;
              this.form.carType = this.plateList[0].type === undefined ? '' : this.plateList[0].type;
            }
          }
          this.form.mobile = this.mobile ? this.mobile : data.member;
        },
        ErrorData => {
          console.log('ERR_GET_PLATE_LIST: ', ErrorData);
        }
      );
    },
    // 重置并刷新维保项目和未实施项目选择id
    setItems() {
      // this.selectedImplementedItems = [];
      // this.form.implementedItems.map(data => {
      //   if (data.isSelected === '1') {
      //     this.selectedImplementedItems.push(data.id);
      //   }
      // });
      this.selectedUnimplementedItems = [];
      this.form.unimplementedItems.map(data => {
        if (data.isSelected === '1') {
          this.selectedUnimplementedItems.push(data.id);
        }
      });
    },
    // 设置当前日期
    getToday() {
      let date = new Date();
      return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      }`;
    }
  },
  watch: {
    form() {
      console.log('form: ', this.form);
    },
    // id变化时,重置角色,刷新
    itemId(newVal, oldVal) {
      this.id = newVal.id || '';
      this.nameList = [];
      this.plateList = [];
      this.selectedDriverId = [];
      this.refresh();
    },
    // 维保项目选中时自动计算总价格
    // selectedImplementedItems(newVal, oldVal) {
    //   if (this.form.cost === '' || typeof this.form.cost === 'number') {
    //     this.form.cost = 0;
    //     newVal.map(item => {
    //       this.form.cost += Number(this.implementedMap.get(item));
    //     });
    //   }
    // },
    'form.memberName': function(newVal, oldVal) {
      if (newVal) {
        this.$refs.form.clearValidate();
      }
      if (this.form.userId) {
        this.queryPlateNameList(this.form.userId);
      }
    }
  },
  created() {
    this.refresh();
  },
  components: {
    // BizGrid,
    BizSaveButton,
    BizAvatarUploaderMulti,
    BizCarOwnerSelector,
    ProductSelector
  }
};
</script>

<style lang="scss">
.maintenance-records-list-base-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .collapse {
    margin-left: 20px;
    margin-bottom: 18px;
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
