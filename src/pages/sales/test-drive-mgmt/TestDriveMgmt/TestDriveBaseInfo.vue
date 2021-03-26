<template>
  <biz-grid class="test-drive-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="商品" prop="product">
        <el-select v-model="form.product.id" placeholder="请选择商品" filterable style="width: 100%;" @change="productChange">
            <el-option v-for="(item,index) in productData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="车辆" prop="plateNumber" v-if="category">
        <el-input :value="form.car?form.car.plateNumber:''" :disabled="!!this.itemId">
          <div slot="append" class="input-append" v-if="!itemId.id">
            <el-button type="text" @click="addCar">
              <i class="el-icon-circle-plus-outline" style="color: #ff7300;padding-left:5px"></i>
            </el-button>
            <img src="../../../../assets/images/car.png" style="float:right;padding-left:5px;cursor: pointer;" @click="selectCar"/>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="车型" prop="carType" v-if="category">
        <el-input placeholder="请选择车型" v-model="form.car.type" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="车辆识别代号" prop="carVin" v-if="category">
        <el-input placeholder="请选择车辆识别代号" v-model="form.car.vin" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="终端" prop="terminals" v-if="category">
        <div class="terminalInput" v-for="(item,index) in form.car.terminals" :key="index">
          <el-input placeholder="请选择设备" v-model="item.name" :disabled="true"> </el-input>
        </div>
        <el-input v-show="form.car.terminals.length===0" :disabled="true"> </el-input>
      </el-form-item>

      <el-form-item label="状态" prop="state" v-if="itemId">
        <el-select placeholder="请输入状态" v-model="form.state" :disabled="true">
          <el-option label="空闲中" value="0">
          </el-option>
          <el-option label="服务中" value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="体验时长" prop="drivingTimes" v-if="itemId">
        <el-input placeholder="请输入体验时长" v-model="form.drivingTimes" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="体验距离" prop="drivingRange" v-if="itemId">
        <el-input placeholder="请输入体验距离" v-model="form.drivingRange" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" @close="dialogVisible=false" title="添加车辆" append-to-body custom-class="car-dialog">
      <vehicle-base-info-content ref="content" @confirmAddCar="confirmAddCar" :itemId="diagId"></vehicle-base-info-content>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="createCar()" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <store-vehicle-picker v-show="false" ref="vehiclePicker" :shopId="shopId" @on-confirm="handleConfirm"></store-vehicle-picker>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { testDriveMgmt as service } from '@/common/urls';
import http from '@/common/http';
import VehicleBaseInfoContent from './components/VehicleBaseInfoContent';
// import MemberVehiclePicker from '@/pages/operating/vehicle-mgmt/component/MemberVehiclePicker';
import StoreVehiclePicker from '@/pages/sales/test-drive-mgmt/TestDriveMgmt/StoreVehiclePicker';

export default {
  name: 'TestDriveBaseInfo',
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogVisible: false,
      selectedDriverId: [],
      diagId: { id: '' },
      shopId: '',
      productData: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:testdriveManagment.edit']
        }
      ],
      category: true,
      categoryName: '',
      form: {
        id: '',
        shopId: window.top.SHOP_ID || '',
        product: {
          id: ''
        },
        car: {
          plateNumber: '',
          type: '',
          terminals: [{ name: '' }],
          member: {
            mobile: '',
            name: '',
            id: ''
          },
          vin: '',
          id: ''
        },
        state: '0',
        adviser: {
          mobile: '',
          name: '',
          id: ''
        },
        drivingTimes: '0min',
        drivingRange: '0km'
      },
      rules: {
        product: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!this.form.product.id) {
                callback(new Error('请选择商品'));
              } else {
                callback();
              }
            }
          }
        ],
        plateNumber: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!this.form.car.plateNumber) {
                callback(new Error('请选择车辆'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  components: {
    BizSaveButton,
    BizGrid,
    StoreVehiclePicker,
    VehicleBaseInfoContent
  },
  props: {
    itemId: {
      type: String,
      default: ''
    }
  },
  watch: {
    itemId(nVal, oVal) {
      console.log('itemId Changed: ', nVal);
      this.form = this.clear();
      this.category = true;
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        if (nVal !== oVal) {
          this.form.product.id = '';
          this.form.car.plateNumber = '';
          this.form.car.member = { name: '' };
          this.form.car.type = '';
          this.form.car.vin = '';
          this.form.car.terminals = [{ name: '' }];
        }
      }
    }
  },
  created() {
    this.queryProduct();
  },
  computed: {},
  methods: {
    clear() {
      this.$refs.form.clearValidate();
      return {
        id: '',
        shopId: window.top.SHOP_ID || '',
        product: {
          id: ''
        },
        car: {
          plateNumber: '',
          type: '',
          vin: '',
          terminals: [{ name: '' }],
          member: {
            mobile: '',
            name: '',
            id: ''
          },
          id: ''
        },
        state: '0',
        adviser: {
          mobile: '',
          name: '',
          id: ''
        },
        drivingTimes: '0min',
        drivingRange: '0km'
      };
    },
    operate(name) {
      this[name]();
    },
    createCar() {
      this.$refs.content.save();
    },
    confirmAddCar(row, carId) {
      this.dialogVisible = false;
      this.form.car.plateNumber = row.plateNumber;
      this.form.car.type = row.type;
      this.form.car.vin = row.vin || '';
      this.form.car.terminals = row.terminals;
      this.form.car.id = carId;
      this.form.car.member.mobile = row.member.mobile;
      this.form.car.member.name = row.member.name;
      this.form.car.member.id = row.member.id;
    },
    addCar() {
      this.diagId = { id: '' };
      this.dialogVisible = true;
    },
    productChange(val) {
      this.productData.forEach(item => {
        if (val === item.id) {
          if (item.categoryName.includes('整车')) {
            this.category = true;
          } else {
            this.category = false;
          }
          this.shopId = item.shopId;
        }
      });
    },
    // disableState() {
    //   console.log(this.itemId);
    //   console.log('itemid==========' + this.itemId);
    //   return Boolean(this.itemId);
    // },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.itemId) {
            this.create();
          } else {
            // this.$message.success('更新成功');
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        id: this.itemId
      };
      http
        .get(service.testDrive.testDriveCrud, params)
        .then(data => {
          this.form = Object.assign(this.clear(), data.data);
          this.productData.forEach(item => {
            if (item.id === this.form.product.id) {
              if (item.categoryName.includes('整车')) {
                this.category = true;
              } else {
                this.category = false;
              }
              this.shopId = item.shopId;
            }
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    create() {
      http
        .post(service.testDrive.testDriveCrud, this.form)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
          this.$emit('update:itemId', data.id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      // TODO 没有更新处理（预留）
      http
        .put(service.testDrive.testDriveCrud, this.form)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    selectCar() {
      console.log('showDialog true');
      // 点击车主输入框
      this.showDialog = true;
      this.$refs.vehiclePicker.showDialog = true;
    },
    handleConfirm(key, value) {
      console.log('showDialog false');
      this.showDialog = false;
      this.$refs.vehiclePicker.showDialog = false;

      this.selectedDriverId = key;
      this.form.car.plateNumber = value.plateNumber;
      this.form.car.member = value.member;
      this.form.car.type = value.type;
      this.form.car.vin = value.vin || '';
      this.form.car.terminals = value.terminals;
      this.form.car.id = value.id;
      this.$refs.form.clearValidate();
    },
    queryProduct() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/product/union/list.jhtml', params)
        .then(data => {
          this.productData = data.content;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.test-drive-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-input-group__append {
    padding-right: 10px;
  }
  // line-height: 2rem;
}
// .base-info-url {
//   .biz-save-button {
//     margin-top: 5px;
//   }
//   .el-input {
//     width: 60%;
//   }
//   .el-select {
//     width: 100%;
//   }
//   .avatar {
//     width: 178px;
//     height: 178px;
//     display: block;
//   }
// }
</style>
