<template>
  <biz-grid class="vehicle-base-info__terminal">
    <biz-header :operations="ruleTableOperations" @operate="operateHandler">
    </biz-header>
    <el-table :data="terminalData" ref="terminalTable" style="width: 100%" class="cp-table" size="mini">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="terminalTypeName" label="设备类型">
      </el-table-column>
      <el-table-column prop="number" label="设备编号">
      </el-table-column>
      <el-table-column prop="bindCar.plateNumber" label="关联车辆">
      </el-table-column>
      <el-table-column prop="title" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row, $event)">
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="box-card" :visible.sync="showRule" center append-to-body width="500px">
      <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="ruleRules" :inline-message="true">
        <el-form-item label="设备编号" prop="number">
          <el-autocomplete :value="ruleModel.number" :fetch-suggestions="handleRemote" placeholder="请输入设备编号" :trigger-on-focus="false"
            @select="handleNumberChange" @input="handleNumberInput" value-key="number" style="width: 100%;"></el-autocomplete>
        </el-form-item>
        <el-form-item label="通讯方式">
          <el-select v-model="ruleModel.communicationType" placeholder="请选择" style="width: 100%;">
            <el-option v-for="(item,index) in commTypeList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/vehicle-mgmt/VehicleBaseInfo';
import http from '@/common/http';
export default {
  name: 'VehicleBaseInfoContent',
  components: {
    BizSaveButton,
    BizHeader,
    BizGrid
  },
  data() {
    return {
      rules: {},
      shopList: [],
      commTypeList: [],
      insuranceList: [],
      selections: [],
      terminalData: [],
      ruleTableOperations: [
        {
          label: '新增',
          name: 'addOperate',
          type: 'primary'
        }
      ],
      showRule: false,
      ruleModel: this.getDefaultRuleModel(),
      ruleOperations: [
        {
          label: '取消',
          name: 'cancelRuleOperate'
        },
        {
          label: '保存',
          name: 'saveRuleOperate',
          type: 'primary'
        }
      ],
      ruleRules: {
        number: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.ruleModel.number) {
                callback();
              } else {
                callback(new Error('请选择终端'));
              }
            }
          }
          // {
          //   trigger: ['blur'],
          //   validator: (rule, rules, callback) => {
          //     this.checkNumber(this.ruleModel.number, callback);
          //   }
          // }
        ]
      },

      selectLoading: false,
      terminalList: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    memberId: {
      type: Object
    }
  },
  created() {
    this.effluentStandardList = ['国Ⅰ', '国Ⅱ', '国Ⅲ', '国Ⅳ', '国Ⅴ', '国Ⅵ', '欧Ⅰ', '欧Ⅱ', '欧Ⅲ', '欧Ⅳ', '欧Ⅴ'];
    this.commTypeList = [
      { id: '0', name: '自动切换' },
      { id: '1', name: '网络' },
      { id: '2', name: '蓝牙' },
      { id: '3', name: 'WIFI' },
      { id: '4', name: 'GPRS' },
      { id: '5', name: '3G' },
      { id: '6', name: '4G' }
    ];
    this.getTerminalList();
    this.deletedRules = [];
  },
  methods: {
    getTerminalList() {
      http
        .get('/admin/terminal/memberTerminals.jhtml', {
          userId: this.itemId ? this.itemId.id : '',
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.terminalData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    operateHandler(name) {
      this[name]();
    },
    addOperate() {
      this.resetRuleModel();
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    getDefaultRuleModel() {
      return {
        number: '',
        diagnoseType: '',
        communicationType: '0',
        userId: this.itemId ? this.itemId.id : ''
      };
    },
    rowEditClickHandler(model, e, column) {
      e.stopPropagation();

      this.terminalList = [];
      this.ruleModel = Object.assign({}, model);
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    rowDeleteClickHandler(e, model) {
      // this.deleteRule([model.id]);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete('/admin/terminal/memberTerminal.jhtml', { ids: [model.id], userId: this.itemId.id })
          .then(data => {
            this.$message.success('删除成功');
            this.getTerminalList();
          })
          .catch(errData => {
            console.log(errData);
            this.$message.warning(errData.errorMessage);
          });
      });
    },
    resetRuleModel() {
      this.terminalList = [];
      this.ruleModel = this.getDefaultRuleModel();
    },
    cancelRuleOperate() {
      this.showRule = false;
    },
    getSaveParams() {
      return {
        number: this.ruleModel.number,
        diagnoseType: this.ruleModel.diagnoseType,
        communicationType: this.ruleModel.communicationType,
        userId: this.itemId ? this.itemId.id : ''
      };
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          // 判断是否存在终端编号
          // 如果存在，则进行修改操作，否则，执行添加
          if (this.ruleModel.id) {
            http
              .put('/admin/terminal/memberTerminal.jhtml', this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.getTerminalList();
              })
              .catch(errData => {
                console.log(errData);
                this.$message.warning(errData.errorMessage);
              });
          } else {
            http
              .post('/admin/terminal/memberTerminal.jhtml', this.getSaveParams())
              .then(data => {
                this.$message.success('保存成功');
                this.getTerminalList();
              })
              .catch(errData => {
                console.log(errData);
                this.$message.warning(errData.errorMessage);
              });
          }

          this.showRule = false;
        } else {
          return false;
        }
      });
    },
    getRuleParams() {
      return Object.assign({}, this.ruleModel);
    },
    checkNumber(val, callback) {
      // 根据设备编号查询
      service.queryTerminalInfo(
        {
          sn: val,
          carId: this.itemId.id,
          shopId: window.top.SHOP_ID
        },
        data => {
          Object.assign(this.ruleModel, data);

          callback();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('ERROR_QUERY', ErrorData);

          // this.$message.warning(ErrorData.errorMessage);
          // 失败后清空相关信息
          this.$set(this.ruleModel, 'diagnoseType', '');
          callback(new Error(ErrorData.errorMessage));
        }
      );
    },

    handleNumberChange(val) {
      this.$set(this.ruleModel, 'number', val.number);
      this.$refs.ruleForm.clearValidate();
      // this.checkNumber(val.number);
    },
    handleNumberInput(val) {
      this.$set(this.ruleModel, 'number', val);
    },
    handleRemote(query, cb) {
      if (query) {
        this.queryTerminalList(query, cb);
      } else {
        this.terminalList = [];
      }
    },
    queryTerminalList(searchKey, cb) {
      this.$emit('on-loading', true);

      service.queryTerminalList(
        {
          number: searchKey
        },
        data => {
          // this.terminalList = data.dataList;
          cb(data.dataList);

          this.$emit('on-loading', false);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.$emit('on-loading', false);
        }
      );
    }
  },
  computed: {},
  watch: {
    'itemId.id'(nVal, oVal) {
      this.showRule = false;
      this.getTerminalList();
    }
  }
};
</script>

<style lang="scss">
.vehicle-base-info__terminal {
  height: 100%;
  overflow: auto;
  .biz-header .biz-header__operation-wrapper{
    float: left;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    .image-content {
      display: flex;
      justify-content: space-between;
    }
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .cp-table {
    .el-table__empty-block {
      line-height: 60px;
    }
  }
  .zbxx {
    display: flex;
    .el-input__inner {
      width: 80px;
    }
  }
  fieldset {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 20px;
    padding-bottom: 20px;

    legend {
      font-size: 14px;
      color: #999;
    }
    .el-input-number--small {
      width: 100%;
    }
    .el-form-item--small.el-form-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
