<template>
  <biz-grid class="terminal-mgmt-terminal__terminal-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-collapse v-model="activeTab" ref="collapse">
      <el-collapse-item title="基本信息" name="baseInfo">
        <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
          <el-form-item label="终端名称" prop="name">
            <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="产品序列号" prop="number">
            <el-input v-model="formModel.number" placeholder="请输入产品序列号"></el-input>
          </el-form-item>
          <el-form-item label="终端分类" prop="terminalType">
            <el-select v-model="formModel.terminalTypeData.id" :disabled="!!formModel.id" placeholder="请选择" style="width: 100%;"
              @change="terminalChange">
              <el-option v-for="item in terminalTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!-- <span>{{formModel.terminalTypeData.name}}</span> -->
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="formModel.supplier" placeholder="请输入供应商"></el-input>
          </el-form-item>
          <el-form-item label="版本">
            <el-input v-model="formModel.version" placeholder="请输入版本"></el-input>
          </el-form-item>
          <el-form-item label="出厂时间">
            <el-date-picker type="date" placeholder="选择出厂时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" v-model="formModel.saleDate"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="所属运营商" prop="operator">
        <biz-operator-picker v-model="formModel.operator" @input="handleOperatorChange"></biz-operator-picker>
      </el-form-item>
      <el-form-item label="所属店铺" prop="storeData">
        <biz-shop-picker v-model="formModel.storeData.id" :operatorId="operatorId"></biz-shop-picker>
      </el-form-item> -->
          <el-form-item label="所有者">
            <people-picker v-model="formModel.memberData" @on-confirm="onConfirm"></people-picker>
          </el-form-item>
          <el-form-item label="绑定车辆">
            <el-input v-model="formModel.carPlateNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="位置" prop="position" v-if="isLpr">
            <el-select v-model="formModel.position" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in positionList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用" prop="status">
            <el-switch v-model="formModel.status" active-value="1" inactive-value="0" inactive-color="#d9d9d9"
              active-color="#87d068">
            </el-switch>
          </el-form-item>
          <el-form-item label="自动切换模式">
            <el-switch v-model="formModel.isAutoSwitch" inactive-color="#d9d9d9"
              active-color="#87d068">
            </el-switch>
          </el-form-item>
          <el-form-item label="模式" prop="terminalMode">
            <el-radio-group v-model="formModel.terminalMode">
              <el-radio label="0">工程模式</el-radio>
              <el-radio label="1">安装模式</el-radio>
              <el-radio label="2">用户模式</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="所属店铺" name="shopInfo">
        <el-table size="small" :data="formModel.shopDatas">
          <el-table-column label="店铺名称" prop="name"></el-table-column>
          <el-table-column label="详细地址" prop="address"></el-table-column>
          <el-table-column label="销售电话" prop="mobile"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDeleteClick(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import service from '@/service/terminal-mgmt/BaseInfo';
import PeoplePicker from '../component/PeoplePicker';
export default {
  name: 'TerminalBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,
    PeoplePicker
  },
  data() {
    return {
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
          auth: ['caradmin:operateDevice.manage.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入产品序列号', trigger: 'blur' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
        terminalMode: [{ required: true, message: '请选择工程模式', trigger: 'blur' }],
        terminalType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(this.formModel.terminalTypeData.id);
              if (this.formModel.terminalTypeData.id) {
                callback();
              } else {
                callback(new Error('请选择终端分类'));
              }
            }
          }
        ],
        operator: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(this.formModel.operator);
              if (
                this.formModel.operator &&
                this.formModel.operator.length > 0 &&
                this.formModel.operator[0]
                // 运营商最后一位可以为空
              ) {
                callback();
              } else {
                callback(new Error('请选择所属运营商'));
              }
            }
          }
        ],
        storeData: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.formModel.storeData.id) {
                callback(new Error('请选择所属店铺'));
              } else {
                callback();
              }
            }
          }
        ],
        position: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.formModel.position) {
                callback(new Error('请选择位置'));
              } else {
                callback();
              }
            }
          }
        ]
        // status: [{ required: true, message: '请选择启用状态', trigger: 'blur' }]
      },
      terminalTypeList: [],
      shopList: [],
      companyData: {},
      storeData: {},
      activeTab: 'baseInfo',
      positionList: [
        { name: '进口', value: '0' },
        { name: '出口', value: '1' }
      ],
      formModel: this.getDefaultModel(),
      isLpr: false
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  created() {
    this.queryTypeList();
    this.queryShopList();
  },
  methods: {
    onConfirm(row) {
      // this.formModel.carPlateNumber = row.defaultCarInfo.plateNumber;
    },
    handleDeleteClick(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete('/admin/terminal/relateShop.jhtml', { shopId: row.id, id: this.itemId.id })
          .then(data => {
            this.formModel.shopDatas.splice(this.formModel.shopDatas.indexOf(row), 1);
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    queryTypeList() {
      service.queryTypeList(
        {},
        data => {
          this.terminalTypeList = data.data;
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
          this.shopList = data.shopDatas;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams() {
      let companyId = '';
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] === ''
      ) {
        companyId = this.formModel.operator[this.formModel.operator.length - 2];
      }
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] !== ''
      ) {
        companyId = this.formModel.operator[this.formModel.operator.length - 1];
      }
      return {
        terminalTypeId: this.formModel.terminalTypeData.id,
        id: this.formModel.id,
        storeTerminalId: this.formModel.storeTerminalId,
        name: this.formModel.name,
        number: this.formModel.number,
        supplier: this.formModel.supplier,
        version: this.formModel.version,
        saleDate: this.formModel.saleDate,
        companyId: companyId || '',
        shopId: this.formModel.storeData.id,
        memberData: this.formModel.memberData,
        position: this.formModel.position,
        status: this.formModel.status,
        isAutoSwitch: this.formModel.isAutoSwitch,
        terminalMode: this.formModel.terminalMode,
        carPlateNumber: this.formModel.carPlateNumber || ''
      };
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        terminalTypeData: { id: this.itemId.terminalTypeId },
        memberData: {
          id: '',
          name: ''
        },
        storeData: {
          id: '',
          name: ''
        },
        operator: [],
        position: '',
        status: '0',
        isAutoSwitch: true,
        terminalMode: '0',
        carPlateNumber: ''
      };
    },

    operateHandler(name) {
      this[name]();
    },
    handleOperatorChange(val) {
      let companyId = '';
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] === ''
      ) {
        companyId = this.formModel.operator[this.formModel.operator.length - 2];
      }
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] !== ''
      ) {
        companyId = this.formModel.operator[this.formModel.operator.length - 1];
      }
      if (this.companyData.id === companyId) {
        if (this.storeData) {
          this.formModel.storeData = this.storeData;
        }
      } else {
        this.formModel.storeData = {
          id: '',
          name: ''
        };
      }
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            service.update_new(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.formModel.id = data.data.id;
                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                if (ErrorData.errorMessage) {
                  this.$message.warning(ErrorData.errorMessage);
                } else {
                  this.$message.warning('保存失败');
                }
              }
            );
          } else {
            service.add_new(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                if (ErrorData.errorMessage) {
                  this.$message.warning(ErrorData.errorMessage);
                } else {
                  this.$message.warning('保存失败');
                }
              }
            );
          }
        } else {
          this.$message.warning('请输入必填项');
          return false;
        }
      });
    },
    terminalChange() {
      this.isLpr = false;
      this.terminalTypeList.map(item => {
        if (item.id === this.formModel.terminalTypeData.id && item.name === 'LPR') {
          this.isLpr = true;
        }
      });
    },
    query(nVal) {
      service.query_new(
        {
          id: nVal.id,
          storeTerminalId: nVal.storeTerminalId,
          terminalTypeId: nVal.terminalTypeId
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          console.log(data.companyTrees);
          this.storeData = data.data.shopData;
          this.companyData = data.data.companyData;
          if (data.data.companyTrees) {
            let arr = [];
            data.data.companyTrees.forEach(item => {
              arr.push(item.id);
            });
            obj.operator = arr;
          } else {
            obj.operator = [];
          }
          this.formModel = obj;

          this.$refs.form.resetFields();
          this.terminalChange();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    }
  },
  computed: {
    operatorId() {
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] === ''
      ) {
        return this.formModel.operator[this.formModel.operator.length - 2];
      }
      if (
        this.formModel.operator &&
        this.formModel.operator.length > 0 &&
        this.formModel.operator[this.formModel.operator.length - 1] !== ''
      ) {
        return this.formModel.operator[this.formModel.operator.length - 1];
      }
      return '';
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.$refs.collapse.$el.scrollTop = 0;
      if (nVal.id) {
        this.query(nVal);
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  }
};
</script>

<style lang="scss">
.terminal-mgmt-terminal__terminal-base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    padding: 20px;
  }
  .el-collapse {
    height: 100%;
    overflow: auto;
  }
}
</style>
