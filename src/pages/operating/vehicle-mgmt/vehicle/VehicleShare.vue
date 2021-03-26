<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-share">
    <div>
      <biz-header v-if="isEdit" :operations="ruleTableOperations" @operate="operateHandler">
      </biz-header>
      <el-table :data="tableData" style="width: 100%" height="350" @selection-change="selectionChangeHandler" size="mini">
        <el-table-column type="selection" width="30">
        </el-table-column>
        <el-table-column prop="userName" label="用户名">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="isDriver" label="驾驶员" :formatter="driverConverter" min-width="80"></el-table-column>
        <el-table-column prop="title" label="操作" min-width="90">
          <template slot-scope="scope" v-if="isEdit">
            <el-button type="text" size="mini" @click="rowStartClickHandler($event, scope.row)" v-show="scope.row.isDriver === '0'">
              启用
            </el-button>
            <el-button type="text" size="mini" @click="rowStopClickHandler($event, scope.row)" v-show="scope.row.isDriver === '1'">
              停用
            </el-button>
            <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog class="box-card" :visible.sync="showRule" center append-to-body width="500px">
        <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="rules">
          <el-form-item label="用户名" prop="memberData">
            <people-picker v-model="ruleModel.memberData" contentField="userName"></people-picker>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="ruleModel.memberData.realName" readonly></el-input>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;">
        </biz-save-button>
      </el-dialog>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';
import PeoplePicker from '../component/PeoplePicker';

import service from '@/service/vehicle-mgmt/VehicleShare';

export default {
  name: 'VehicleShare',
  components: {
    BizSaveButton,
    BizHeader,
    BizGrid,
    PeoplePicker
  },
  data() {
    return {
      ruleTableOperations: [
        {
          label: '新增',
          name: 'addOperate',
          type: 'primary',
          auth: ['admin:car.edit']
        },
        {
          label: '删除',
          name: 'deleteOperate',
          type: '',
          disabled: true,
          auth: ['admin:car.edit']
        },
        {
          label: '启用',
          name: 'startOperate',
          type: '',
          disabled: true,
          auth: ['admin:car.edit']
        },
        {
          label: '停用',
          name: 'stopOperate',
          type: '',
          disabled: true,
          auth: ['admin:car.edit']
        }
      ],
      tableData: [],
      showRule: false,
      ruleModel: this.getDefaultModel(),
      rules: {
        memberData: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, rules, callback) => {
              if (this.ruleModel.memberData.id) {
                callback();
              } else {
                callback(new Error('请选择用户'));
              }
            }
          }
        ]
      },
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
      ]
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
  created() {},
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.tableData = [];
      }
    },
    query() {
      service.query(
        {
          carId: this.itemId.id
        },
        data => {
          this.tableData = data.content;

          // reset
          this.selections = [];
          this.showRule = false;
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
        shares: [
          {
            id: this.ruleModel.memberData.id
          }
        ],
        id: this.itemId.id
      };
    },
    resetModel() {
      this.ruleModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        typeId: '',
        signId: '',
        memberData: {
          id: '',
          name: ''
        }
      };
    },
    deleteRule(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.deleteRule(
          {
            ids: ids
          },
          data => {
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    switchStatus(ids, start) {
      service.switchStatus(
        {
          ids: ids,
          state: start,
          shopId: window.top.SHOP_ID
        },
        data => {
          this.$message.success('设置成功');
          this.query();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    driverConverter(row) {
      if (row.isDriver === '1') {
        return '是';
      } else {
        return '否';
      }
    },

    operateHandler(name) {
      this[name]();
    },
    addOperate() {
      this.resetModel();
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    deleteOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.memberCarId);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个用户进行删除');
      }
    },
    startOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.memberCarId);
        });
        this.switchStatus(ids, '1');
      } else {
        this.$message('请选择一个用户进行启用');
      }
    },
    stopOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.memberCarId);
        });
        this.switchStatus(ids, '0');
      } else {
        this.$message('请选择一个用户进行停用');
      }
    },
    cancelRuleOperate() {
      this.showRule = false;
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          service.addRule(
            this.getSaveParams(),
            data => {
              this.$message.success('保存成功');
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          return false;
        }
      });
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.ruleTableOperations[1].disabled = true;
      this.ruleTableOperations[2].disabled = true;
      this.ruleTableOperations[3].disabled = true;
      if (val.length > 0) {
        this.ruleTableOperations[1].disabled = false;
        this.ruleTableOperations[2].disabled = false;
        this.ruleTableOperations[3].disabled = false;
      }
    },
    rowDeleteClickHandler(e, model) {
      this.deleteRule([model.memberCarId]);
    },
    rowStartClickHandler(e, model) {
      this.switchStatus([model.memberCarId], '1');
    },
    rowStopClickHandler(e, model) {
      this.switchStatus([model.memberCarId], '0');
    }
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__vehicle-share {
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .biz-scroller {

    .box-card {
      margin-top: 20px;

      .el-card__body {
        padding: 20px 20px;
      }
    }
  }
}
</style>
