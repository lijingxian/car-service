<template>
  <biz-grid class="vehicle-mgmt-motorcade__base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="130px" :model="formModel" :rules="rules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="所属店铺" prop="shop">
        <el-select v-model="formModel.shop.id" placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车队名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入车队名称"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="formModel.remark" type="textarea" maxlength="100" placeholder="请输入车队简介"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="lngBaidu" :value="formModel.lngBaidu">
        <biz-area-select :areaId="formModel.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
      </el-form-item>
      <el-form-item label="头像" prop="head" :value="formModel.head">
        <biz-avatar-uploader-new v-model="formModel.head">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="成员" prop="memberIds" :value="formModel.memberIds">
        <el-input v-model="formModel.memberIds.length" readonly>
          <el-button slot="append" @click="handleMemberClick">选择</el-button>
        </el-input>

        <member-vehicle-picker v-show="false" ref="memberPicker" :fleetId="fleetId" @on-confirm="handleConfirm" :title="'成员选择'" :all="false"></member-vehicle-picker>
      </el-form-item>
      <el-form-item>
        <div slot="label">
          开启费用审核
          <el-button type="text" size="small" v-popover:onTimePop><i class="iconfont el-icon-question"></i></el-button>
          <el-popover ref="onTimePop" placement="bottom-start" width="300" trigger="hover" content="开启费用审核后该车队人员提交用车账单时需要管理员确认是否审核通过，关闭费用审核则所有用车账单自动设置为审核通过">
          </el-popover>
        </div>
        <el-switch v-model="formModel.needVerify" active-value="1" inactive-value="0" inactive-color="#d9d9d9" active-color="#87d068">
        </el-switch>
      </el-form-item>
      <el-form-item label="群二维码">
        <div>
          <img :src="formModel.qrCode" v-show="formModel.id" style="width: 210px; position: relative;" />
        </div>
        <span style="color: #999;" v-show="!formModel.id">建立车队后系统生成车队唯一二维码标识</span>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import MemberVehiclePicker from '../component/MemberVehiclePicker';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import BizAreaSelect from '@/components/BizAreaSelect';

import service from '@/service/vehicle-mgmt/MotorcadeBaseInfo';

export default {
  name: 'MotorcadeBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew,
    BizAreaSelect,
    MemberVehiclePicker
  },
  data() {
    return {
      loading: false,
      fleetId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['caradmin:operateFleet.edit']
        }
      ],
      rules: {
        shop: [
          {
            required: true,
            validator: (rule, rules, callback) => {
              if (this.formModel.shop.id) {
                callback();
              } else {
                callback(new Error('请选择所属店铺'));
              }
            }
          }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      shopList: [],
      formModel: this.getDefaultModel()
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
    this.queryShopList();
  },
  methods: {
    query() {
      service.query(
        {
          id: this.itemId.id,
          terminalTypeId: '2'
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.content);
          // obj.memberIds = obj.memberIds.map(item => {
          //   return item.toString();
          // });
          this.formModel = obj;
          this.fleetId = this.formModel.id;
          let flag = true;
          this.shopList.map(item => {
            if (item.id === this.formModel.shop.id) {
              flag = false;
            }
          });
          if (flag) {
            this.shopList = this.shopList.concat([{ name: this.formModel.shop.name, id: this.formModel.shop.id }]);
          }
          this.$refs.form.resetFields();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryShopList() {
      service.queryShopList(
        {},
        data => {
          this.shopList = data.storeList;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams() {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        head: this.formModel.head,
        remark: this.formModel.remark,
        areaId: this.formModel.area.id,
        needVerify: this.formModel.needVerify,
        shopId: this.formModel.shop.id,
        memberIds: this.formModel.memberIds
      };
    },
    resetModel() {
      let obj = this.getDefaultModel();
      obj.shop.id = this.shopList[0] && this.shopList[0].id ? this.shopList[0].id : '';
      this.formModel = obj;
    },
    getDefaultModel() {
      return {
        head: '',
        memberIds: [],
        shop: { id: '' },
        area: { id: '1568' } // 默认北京
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },
    handleMemberClick(e) {
      this.$refs.memberPicker.selectionKeys = this.formModel.memberIds;
      this.$refs.memberPicker.showDialog = true;
    },
    handleConfirm(keys) {
      this.$set(this.formModel, 'memberIds', keys);
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');

                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);

                this.loading = false;
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');

                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);

                this.loading = false;
              }
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    point: {
      get() {
        return {
          lng: this.formModel.lngBaidu,
          lat: this.formModel.latBaidu
        };
      },
      set(nVal) {
        if (nVal) {
          this.formModel.lngBaidu = nVal.lng;
          this.formModel.latBaidu = nVal.lat;
        }
      }
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.form.$el.scrollTop = 0;
      if (nVal.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-motorcade__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
  }
  .biz-scroller {

    fieldset {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-bottom: 20px;
      padding-bottom: 20px;

      legend {
        font-size: 14px;
        color: #999;
      }

      .el-form-item--small.el-form-item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
