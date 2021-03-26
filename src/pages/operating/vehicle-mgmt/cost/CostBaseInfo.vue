<template>
  <biz-grid class="vehicle-mgmt-cost__base-info">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     v-if="itemId.needVerify==='1'"
                     >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
      :disabled="itemId.needVerify==='0'"
    >
      <el-form-item label="日期">
        <span>{{formModel.happenDate}}</span>
      </el-form-item>
      <el-form-item label="车牌">
        <span>{{formModel.car.plateNumber}}</span>
      </el-form-item>
      <el-form-item label="驾驶员">
        <span>{{formModel.member.name || formModel.member.nickname}}</span>
      </el-form-item>
      <el-form-item label="费用类型">
        <span>{{typeConverter(formModel.type) + ' ' + (formModel.userDefineAlias || '')}}</span>
      </el-form-item>
      <el-form-item label="金额">
        <span>{{formModel.cost}}</span>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formModel.verifyState" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <span>{{formModel.operator.name}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formModel.verifyRemarks" placeholder="请输入备注信息" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="凭证">
        <img
          class="uploaded-image"
          v-for="(item, index) in formModel.images"
          :key="index"
          :src="item"
          @click="handleImageClick($event, item)"
        />
      </el-form-item>
    </el-form>

    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="imgUrl" alt="">
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/vehicle-mgmt/CostBaseInfo';

export default {
  name: 'CostBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data () {
    return {
      dialogVisible: false,
      imgUrl: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ]
      },
      stateList: [],
      formModel: this.getDefaultModel(),
      activeNames: ['1'],
      typeList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  created() {
    this.stateList = [
      { id: '0', name: '未审核' },
      { id: '1', name: '审核通过' },
      { id: '2', name: '审核未通过' }
    ];

    this.queryTypeList();
  },
  methods: {
    getSaveParams () {
      return {
        id: this.formModel.id,
        verifyState: this.formModel.verifyState,
        remarks: this.formModel.verifyRemarks
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        car: {},
        member: {},
        operator: {},
        list: []
      };
    },

    operateHandler (name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleUploadSuccess(url) {
      this.formModel.cover = url;
    },
    handleImageClick (e, model) {
      this.dialogVisible = true;

      this.imgUrl = model;
    },

    typeConverter (type) {
      if (this.typeList.length > 0) {
        return this.typeList[Number(type)]
          ? this.typeList[Number(type)].label
          : '';
      } else { return type; }
    },
    queryTypeList () {
      service.queryTypeList(
        {},
        data => {
          this.typeList = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
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
      get () {
        return {
          lng: this.formModel.lngBaidu,
          lat: this.formModel.latBaidu
        };
      },
      set (nVal) {
        if (nVal) {
          this.formModel.lngBaidu = nVal.lng;
          this.formModel.latBaidu = nVal.lat;
        }
      }
    }
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal.id) {
        service.query(
          {
            id: nVal.id
          },
          data => {
            let obj = Object.assign(this.getDefaultModel(), data.content);
            this.formModel = obj;

            this.$refs.form.resetFields();
            this.activeNames = ['1'];
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
        this.activeNames = ['1'];
      }
    }
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-cost__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    padding: 20px;

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

  $uploaded-image-size: 96px;

  .uploaded-image {
    display: inline-block;
    width: $uploaded-image-size;
    height: $uploaded-image-size;
    margin-right: 10px;
    border-radius: 6px;
    cursor: pointer;
  }
}

.avatar-preview-dialog {
  .review {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
