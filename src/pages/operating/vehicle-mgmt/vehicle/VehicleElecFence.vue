<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-elec-fence">
    <biz-header :operations="ruleTableOperations" @operate="operateHandler" @rowClick="rowEditClickHandler" v-if="isEdit" slot="top">
    </biz-header>
    <el-table :data="tableData" style="width: 100%" height="100%" @selection-change="selectionChangeHandler" size="small">
      <biz-empty-table-tab slot="empty"></biz-empty-table-tab>
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="name" label="围栏名称"></el-table-column>
      <el-table-column prop="count" label="监控车辆数量" width="100"></el-table-column>
      <el-table-column prop="terminalCount" label="监控设备数量" width="100"></el-table-column>
      <el-table-column prop="title" label="操作" min-width="130">
        <template slot-scope="scope" v-if="isEdit">
          <el-button type="text" size="mini" @click.stop="monitorState(scope.row)" v-if="isCar">
            {{scope.row.state==='0'?'监控':'取消监控'}}
          </el-button>
          <el-button type="text" size="mini" @click="rowEditClickHandler(scope.row,$event)">
            编辑
          </el-button>
          <el-button type="text" size="mini" @click.stop="rowDeleteClickHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog slot="float" title="电子围栏" class="vehicle-elec-fence__details-dialog" :visible.sync="dialogVisible"
      :fullscreen="true" append-to-body>
      <div class="details-dialog__content">
        <div class="dialog-form">
          <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="rules" v-loading="ruleLoading" :inline-message="true">
            <el-form-item label="围栏名称" prop="name">
              <el-input v-model="ruleModel.name" placeholder="请输入围栏名称"></el-input>
            </el-form-item>
            <el-form-item label="启用" prop="isEnabled">
              <el-switch v-model="ruleModel.isEnabled" active-value="1" inactive-value="0" inactive-color="#d9d9d9"
                active-color="#87d068">
              </el-switch>
            </el-form-item>
            <el-form-item label="触发方式" prop="triggerMethod">
              <el-radio-group v-model="ruleModel.triggerMethod">
                <el-radio label="0">进围栏</el-radio>
                <el-radio label="1">出围栏</el-radio>
                <el-radio label="2">进出围栏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="围栏类型" prop="type">
              <el-radio-group v-model="ruleModel.type" @change="typeChange">
                <el-radio label="0">圆形</el-radio>
                <el-radio label="1">矩形</el-radio>
                <el-radio label="3">多边形</el-radio>
                <el-radio label="2">行政区划</el-radio>
              </el-radio-group>
              <biz-area-select :areaId="ruleModel.areaId" @areaChanged="areaChanged" v-show="ruleModel.type === '2'">
              </biz-area-select>
            </el-form-item>
            <el-form-item label="超速限制" prop="overspeed">
              <el-input v-model="ruleModel.overspeed" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="围栏种类" prop="category">
              <el-radio-group v-model="ruleModel.category">
                <el-radio label="0">个人</el-radio>
                <el-radio label="1" v-show="isMotorcadeMode()">车队</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="监控车辆">
              <vehicle-picker v-model="ruleModel.carIds" :motorcadeId="motorcadeId.id" :userId="itemId.userId"></vehicle-picker>
            </el-form-item>
            <el-form-item label="监控设备" v-show="!isMotorcadeMode()">
              <terminal-picker v-model="ruleModel.terminalIds" :motorcadeId="motorcadeId.id" :userId="itemId.userId">
              </terminal-picker>
            </el-form-item>
            <el-form-item prop="startTime">
              <div slot="label" style="display: inline-block;">
                开始时间
                <el-button type="text" size="small" v-popover:startTime>
                  <i class="iconfont el-icon-question"></i>
                </el-button>
                <el-popover ref="startTime" placement="bottom-start" width="300" trigger="hover"
                  content="您可设置开始时间和结束时间，在此时间段内车辆出发围栏报警时将提示到车主">
                </el-popover>
              </div>
              <el-time-select v-model="ruleModel.startTime" :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }" placeholder="选择时间"></el-time-select>
            </el-form-item>
            <el-form-item prop="endTime">
              <div slot="label" style="display: inline-block;">
                结束时间
                <el-button type="text" size="small" v-popover:endTime>
                  <i class="iconfont el-icon-question"></i>
                </el-button>
                <el-popover ref="endTime" placement="bottom-start" width="300" trigger="hover"
                  content="您可设置开始时间和结束时间，在此时间段内车辆出发围栏报警时将提示到车主">
                </el-popover>
              </div>
              <el-time-select v-model="ruleModel.endTime" :picker-options="{
                  start: '00:59',
                  step: '01:00',
                  end: '23:59'
                }" placeholder="选择时间"></el-time-select>
            </el-form-item>
          </el-form>
          <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;" v-if="isEdit">
          </biz-save-button>
        </div>
        <biz-fence-map :type="type" @paramsChange="paramsChange" ref="fenceMap" :carState="carState" :icon="icon">
        </biz-fence-map>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import { BizFenceMap } from '@/components/BizFenceMap';
import BizSaveButton from '@/components/BizSaveButton';
import VehiclePicker from '../component/VehiclePicker';
import TerminalPicker from '../component/TerminalPicker';
import BizAreaSelect from '@/components/BizAreaSelect';
import BizEmptyTableTab from '@/components/BizTable/BizEmptyTableTab';
import service from '@/service/vehicle-mgmt/VehicleElecFence';
import http from '@/common/http';
export default {
  name: 'VehicleElecFence',
  components: {
    BizSaveButton,
    BizHeader,
    BizFenceMap,
    BizGrid,
    VehiclePicker,
    TerminalPicker,
    BizAreaSelect,
    BizEmptyTableTab
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '', userId: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    motorcadeId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isMotorcade: {
      type: Boolean,
      default() {
        return false;
      }
    },
    carState: {
      type: Object,
      default() {
        return {};
      }
    },
    icon: {
      type: Object,
      default() {
        return {};
      }
    },
    isCar: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      isFirst: true,
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
        }
      ],
      tableData: [],
      type: '0',
      dialogVisible: false,
      ruleLoading: false,
      ruleModel: this.getDefaultModel(),
      rules: {
        name: [
          {
            required: true,
            message: '请输入围栏名称/长度不大于16位',
            max: 16,
            trigger: 'blur'
          }
        ],
        isEnabled: [{ required: true, message: '请选择启用状态', trigger: 'blur' }],
        triggerMethod: [{ required: true, message: '请选择触发方式', trigger: 'blur' }],
        type: [{ required: true, message: '请选择围栏类型', trigger: 'blur' }],
        overspeed: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (
                Number(this.ruleModel.overspeed) >= 1 ||
                typeof this.ruleModel.overspeed === 'undefined' ||
                this.ruleModel.overspeed === ''
              ) {
                callback();
              } else {
                callback(new Error('请输入大于0的正整数'));
              }
            }
          }
        ],
        category: [{ required: true, message: '请选择围栏种类', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
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
  created() {},
  methods: {
    isMotorcadeMode() {
      if (this.isMotorcade) return true;
      else return false;
    },
    monitorState(row) {
      http
        .put('/admin/fence/monitorState.jhtml', { fenceId: row.id, carId: this.itemId.id, state: row.state === '0' ? '1' : '0' })
        .then(data => {
          this.$message.success('操作成功');
          this.query();
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
    },
    init() {
      if (this.itemId.id) {
        if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
        this.query();
      } else {
        this.tableData = [];
      }
    },
    query() {
      service.query(
        {
          fleetId: this.isMotorcadeMode() ? this.itemId.id : '',
          userId: this.itemId.userId,
          category: this.isMotorcadeMode() ? '1' : '0',
          carId: !this.isMotorcadeMode() ? this.itemId.id : ''
        },
        data => {
          this.tableData = data.fences;

          // reset
          this.selections = [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryRule(id) {
      this.ruleLoading = true;
      service.queryRule(
        {
          id: id
        },
        data => {
          this.ruleModel = Object.assign(this.getDefaultModel(), data.fence);
          this.ruleModel.carIds = [];
          this.ruleModel.terminalIds = [];
          data.fence.cars.map(item => {
            this.ruleModel.carIds.push(item.id);
          });
          data.fence.terminals.map(item => {
            this.ruleModel.terminalIds.push(item.id);
          });
          this.$refs.fenceMap.initEditFenceMap(this.ruleModel);
          this.ruleLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.ruleLoading = false;
        }
      );
    },
    getSaveParams() {
      let cars = this.ruleModel.carIds.map(item => {
        return { id: item };
      });
      let terminals = this.ruleModel.terminalIds.map(item => {
        return { id: item };
      });
      return {
        fence: {
          id: this.ruleModel.id,
          name: this.ruleModel.name,
          category: this.ruleModel.category,
          fleetId: this.motorcadeId.id,
          type: this.ruleModel.type,
          triggerMethod: this.ruleModel.triggerMethod,
          overspeed: Number.parseInt(this.ruleModel.overspeed),
          cars: cars,
          terminals: terminals,
          startTime: this.ruleModel.startTime,
          endTime: this.ruleModel.endTime,
          isEnabled: this.ruleModel.isEnabled,
          areaId: this.ruleModel.areaId,

          // 以下为地图相关
          rectLng1: this.ruleModel.rectLng1,
          rectLat1: this.ruleModel.rectLat1,
          rectLng2: this.ruleModel.rectLng2,
          rectLat2: this.ruleModel.rectLat2,
          rectLng3: this.ruleModel.rectLng3,
          rectLat3: this.ruleModel.rectLat3,
          rectLng4: this.ruleModel.rectLng4,
          rectLat4: this.ruleModel.rectLat4,
          circleLng: this.ruleModel.circleLng,
          circleLat: this.ruleModel.circleLat,
          radius: this.ruleModel.radius,
          polygon: this.ruleModel.polygon,
          area: this.ruleModel.area,
          fullName: this.ruleModel.fullName
        },
        userId: this.itemId.userId
      };
    },
    paramsChange(params) {
      this.ruleModel.rectLng1 = params.rectLng1;
      this.ruleModel.rectLng2 = params.rectLng2;
      this.ruleModel.rectLng3 = params.rectLng3;
      this.ruleModel.rectLng4 = params.rectLng4;
      this.ruleModel.rectLat1 = params.rectLat1;
      this.ruleModel.rectLat2 = params.rectLat2;
      this.ruleModel.rectLat3 = params.rectLat3;
      this.ruleModel.rectLat4 = params.rectLat4;
      this.ruleModel.circleLng = params.circleLng;
      this.ruleModel.circleLat = params.circleLat;
      this.ruleModel.radius = params.radius;
      this.ruleModel.polygon = params.polygon;
    },
    typeChange(value) {
      this.type = value;
    },
    resetModel() {
      this.ruleModel = this.getDefaultModel();
    },
    getDefaultModel() {
      console.log(this.isMotorcadeMode());
      return {
        triggerMethod: '0',
        type: '0',
        category: this.isMotorcadeMode() ? '1' : '0',
        carIds: [],
        terminalIds: [],
        areaId: '1568',
        isEnabled: '0',
        overspeed: '60',
        startTime: '',
        endTime: ''
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
      console.log('switch to ' + start, ids);
    },

    operateHandler(name) {
      this[name]();
    },
    addOperate() {
      this.resetModel();
      this.dialogVisible = true;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      this.$nextTick(function() {
        this.$refs.fenceMap.initLocation(this.carState);
      });
    },
    deleteOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个用户进行删除');
      }
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.ruleTableOperations[1].disabled = true;
      if (val.length > 0) {
        this.ruleTableOperations[1].disabled = false;
      }
    },
    rowDeleteClickHandler(e, model) {
      this.deleteRule([model.id]);
    },
    rowEditClickHandler(model, e, column) {
      // if (column.label === '操作') return;
      this.dialogVisible = true;
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate();
      this.queryRule(model.id);
    },
    areaChanged(val) {
      this.ruleModel.areaId = val;
      // 默认北京
      if (this.isFirst) {
        this.ruleModel.areaId = '1568';
        this.isFirst = false;
      }
    },

    // Dialog
    cancelRuleOperate() {
      this.dialogVisible = false;
    },
    saveRuleOperate() {
      if (
        this.ruleModel.circleLng === undefined &&
        this.ruleModel.rectLat1 === undefined &&
        this.ruleModel.radius === undefined &&
        this.ruleModel.type !== '3'
      ) {
        this.$message.warning('请在地图上维护围栏数据');
        return;
      }
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.ruleModel.id) {
            service.updateRule(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.query();
                this.dialogVisible = false;
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          } else {
            service.addRule(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.query();
                this.dialogVisible = false;
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
.vehicle-mgmt-all-vehicle__vehicle-elec-fence {
  .biz-header .biz-header__operation-wrapper {
    justify-content: flex-start;
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

.vehicle-elec-fence__details-dialog {
  .el-dialog {
    display: flex;
    flex-direction: column;

    .el-dialog__body {
      flex-grow: 1;
      position: relative;
      padding: 0;

      .details-dialog__content {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;

        .dialog-form {
          float: right;
          width: 500px;
          padding: 0 20px;
        }

        .biz-fence-map {
          margin-right: 500px;
        }
      }
    }
  }
}
</style>
