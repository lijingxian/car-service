<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-state-check">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     v-if="isEdit"
                     >
    </biz-save-button>
    <div
      class="vehicle-state-check__score"
    >
      <img src="@/assets/images/jianche.gif" v-show="loading" />
      <img src="@/assets/images/end-01.png" v-show="!loading && score >= 90" />
      <img src="@/assets/images/end-02.png" v-show="!loading && score >= 70 && score < 90" />
      <img src="@/assets/images/end-03.png" v-show="!loading && score < 70" />
      <span class="value" v-show="!loading">{{scoreComputed}}</span>
    </div>

    <el-rate
      v-model="rate"
      disabled>
    </el-rate>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="检查项"
        >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="rowClickHandler($event, scope.row)"
            v-show="checked"
            >
            {{scope.row.name}}
          </el-button>
          <span v-show="!checked">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结果"
        width="80"
        >
        <template slot-scope="scope">
          <span class="badge" v-show="checked && scope.row.count > 0 && scope.row.type !== '5' && scope.row.type !== '6' && scope.row.type !== '7' && scope.row.type !== '8'">{{scope.row.count}}</span>
          <span class="badge" v-show="checked && scope.row.count === '2' && (scope.row.type === '5' || scope.row.type === '6' || scope.row.type === '7' || scope.row.type === '8')">!</span>
          <span class="badge" v-show="checked && scope.row.count === '1' && (scope.row.type === '5' || scope.row.type === '6' || scope.row.type === '7' || scope.row.type === '8')" style="background: orange;">!</span>
          <span class="success iconfont biz-icon-70chenggong" v-show="checked && Number(scope.row.count) === 0"></span>
          <span style="color: #999;" v-show="!checked">未检测</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      slot="float"
      :title="model.title"
      class="vehicle-state-check__details-dialog"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <div class="details-dialog__content">
        <el-table
          size="small"
          ref="table"
          stripe
          border
          :height="400"
          :data="model.tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="dialogLoading"
          v-show="this.type !== '0' && this.type !== '6' && this.type !== '7' && this.type !== '8'"
        >
          <el-table-column
            prop="name"
            label="检测项目"
          ></el-table-column>
          <el-table-column
            label="检测值"
            width="80"
            >
            <template slot-scope="scope">
              <span style="color: #f00; font-weight: bold;" v-if="checked && scope.row.isErrorState">{{scope.row.value}}</span>
              <span style="color: #999;" v-else>{{scope.row.value}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="正常值"
          >
            <template slot-scope="scope">
              <span>{{scope.row.min}}</span>
              <span>-</span>
              <span>{{scope.row.max}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          size="small"
          ref="table"
          stripe
          border
          :height="400"
          :data="model.tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="dialogLoading"
          v-show="this.type === '0'"
        >
          <el-table-column
            prop="code"
            label="PCODE"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="definitionCn"
            label="故障描述"
          ></el-table-column>
          <el-table-column
            prop="category"
            label="故障类型"
          ></el-table-column>
        </el-table>
        <el-form
          size="small"
          label-width="110px"
          v-show="this.type === '6'"
        >
          <el-form-item label="当前日期">
            <span>{{ruleModel.currentDate}}</span>
          </el-form-item>
          <el-form-item label="年检到期">
            <span>{{ruleModel.annualInspectDate}}</span>
          </el-form-item>
          <div style="text-align: right;">
            <el-button size="small" type="primary" @click="handleCommit('0', $event)">已年检</el-button>
          </div>
        </el-form>
        <el-form
          size="small"
          label-width="110px"
          v-show="this.type === '7'"
        >
          <el-form-item label="当前里程(km)">
            <span>{{ruleModel.nowDrivingRange}}</span>
          </el-form-item>
          <el-form-item label="保养里程(km)">
            <span>{{ruleModel.drivingRange}}</span>
          </el-form-item>
          <div style="text-align: right;">
            <el-button size="small" type="primary" @click="handleCommit('1', $event)">已保养</el-button>
          </div>
        </el-form>
        <el-form
          size="small"
          label-width="110px"
          v-show="this.type === '8'"
        >
          <el-form-item label="当前日期">
            <span>{{ruleModel.currentDate}}</span>
          </el-form-item>
          <el-form-item label="保险到期">
            <span>{{ruleModel.policyExpiryDate}}</span>
          </el-form-item>
          <div style="text-align: right;">
            <el-button size="small" type="primary" @click="handleCommit('2', $event)">已保险</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/vehicle-mgmt/VehicleStateCheck';
import date from '@/utils/date';

export default {
  name: 'VehicleStateCheck',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '开始检测',
          name: 'startCheck',
          type: 'primary',
          auth: ['caradmin:operateDevice.manage.edit']
        }
      ],
      tableData: [],
      score: '0',
      rate: 0,
      checked: false,
      loading: false,

      dialogVisible: false,
      model: this.getDefaultModel(),
      ruleModel: {},
      dialogLoading: false,
      type: ''
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {

  },
  methods: {
    init () {
      this.loading = false;
      this.resetModel();
    },
    query () {
      service.query(
        {
          activityId: this.itemId.id
        },
        data => {
          this.tableData = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getDefaultModel () {
      return {
        title: '',
        tableData: []
      };
    },
    resetModel () {
      this.score = 0;
      this.rate = 0;

      this.tableData = [];
      this.checked = false;
      this.$set(this.operations[0], 'label', '开始检测');
    },

    operateHandler (name) {
      this[name]();
    },
    rowClickHandler (e, model) {
      /**
       * 0:故障诊断
       * 1:发动机控制系统
       * 2:电气系统
       * 3:冷却系统
       * 4:润滑系统
       * 5:驾驶成就
       * 6:车辆年检
       * 7:车辆保养
       * 8:车辆保险
       * 9:进气系统
       * 10:排放控制系统
       * 11:燃油系统
       * 12:点火系统
       * 13:启动系统
       *
       * [0:故障诊断] 显示时，使用[PCODE+故障描述+故障类型]的展示方式
       * [5:驾驶成就] 跳转到驾驶成就Tab页
       * [6:车辆年检][7:车辆保养][8:车辆保险] 根据count值进行判断：
       *   1. count-0 正常。点击不做操作
       *   2. count-1 信息未填写。跳转到相应Tab页进行填写
       *   3. count-2 已过期。弹出提示信息
       * 其他：使用[检测项目+检测值+正常值]的展示方式
       */
      switch (model.type) {
        case '5':
          this.$emit('triggerTabChange', '7', model.type);
          break;
        case '6':
        case '7':
        case '8':
          if (model.count === '1') {
            this.$emit('triggerTabChange', '0', model.type);
          } else if (model.count === '2') {
            this.queryResultDetails(model);
          }
          break;
        default:
          this.queryResultDetails(model);
      }
    },
    handleCommit (type, e) {
      service.checkExpire(
        {
          carId: this.itemId.id,
          terminalId: this.itemId.id,
          type: type
        },
        data => {
          this.$message.success('操作成功');
          this.dialogVisible = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },

    /**
     * 调用检测接口（type值为0），根据resultCode的值，进行不同的处理
     * 100: 无异常，获取最新结果（type值为1） 注：发送检测指令后需要15s之后进行结果获取
     * 281: 行驶中，确认是否继续，继续检测则重新调用检测接口（type值为1），然后获取最新结果
     * 202：熄火，则获取上次的检测结果（type值为0）
     */
    startCheck () {
      this.beginDate = new Date();
      this.queryState({
        carId: this.itemId.id,
        terminalId: this.itemId.id,
        type: '0'
      });
    },
    queryState (params) {
      this.loading = true;

      service.queryState(
        params,
        data => {
          // 15s之后向后台获取数据
          setTimeout(() => {
            this.queryResult({
              carId: this.itemId.id,
              terminalId: this.itemId.id,
              type: '1'
            });
          }, 15000);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;

          if (ErrorData.resultCode === '202') {
            this.$confirm('车辆在（熄火，未知）状态下，您将获得最近一次检测结果', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.queryResult({
                carId: this.itemId.id,
                terminalId: this.itemId.id,
                type: '0'
              });
            }).catch(() => {
              this.loading = false;
            });
          } else if (ErrorData.resultCode === '281') {
            this.$confirm('车辆行驶中，建议不要进行车辆检测，点击确定继续检测', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.queryState({
                carId: this.itemId.id,
                terminalId: this.itemId.id,
                type: '1'
              });
            }).catch(() => {
              this.loading = false;
            });
          } else {
            this.loading = false;

            this.$message.warning(ErrorData.errorMessage);
          }
        }
      );
    },
    queryResult (params) {
      params.beginTime = date.dateTimeConverter(this.beginDate);

      service.check(
        params,
        data => {
          this.loading = false;
          console.log(data);

          this.score = data.total;
          this.rate = data.total / 100 * 5;

          this.tableData = data.dataList;
          this.checked = true;
          this.$set(this.operations[0], 'label', '重新检测');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    queryResultDetails (model) {
      this.dialogVisible = true;
      this.dialogLoading = true;
      let obj = this.getDefaultModel();
      obj.title = model.title;
      this.model = obj;
      this.type = model.type;

      service.checkDetail(
        {
          carId: this.itemId.id,
          terminalId: this.itemId.id,
          type: model.type
        },
        data => {
          // this.$set(this.model, 'tableData', data.content);
          // this.dialogLoading = false;
          console.log(data);
          let obj;
          switch (this.type) {
            case '7':
              this.ruleModel = Object.assign({}, data[data.type]);
              this.$set(this.model, 'tableData', []);
              break;
            case '6':
            case '8':
              obj = Object.assign({}, data[data.type]);
              obj.currentDate = date.dateConverter(new Date());
              this.ruleModel = obj;
              this.$set(this.model, 'tableData', []);
              break;
            default:
              this.$set(this.model, 'tableData', data[data.type]);
          }
          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    }
  },
  computed: {
    scoreComputed () {
      return Math.floor(Number(this.score)) ? this.score : '--';
    }
  },
  watch: {
    itemId (nVal, oVal) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="scss">
$vehicle-mgmt-all-vehicle__score-size:        144px;

.vehicle-mgmt-all-vehicle__vehicle-state-check {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    .badge {
      display: inline-block;
      height: 20px;
      min-width: 20px;
      border-radius: 10px;
      background: #f56c6c;
      color: #fff;
      font-size: 14px;
      padding: 0 5px;
      line-height: 20px;
      text-align: center;
    }

    .success {
      position: relative;
      left: -2px;
      color: #67c23a;
      font-size: 23px;
    }

    .vehicle-state-check__score {
      display: inline-block;
      position: relative;
      width: $vehicle-mgmt-all-vehicle__score-size;
      height: $vehicle-mgmt-all-vehicle__score-size;
      overflow: hidden;
      text-align: center;
      line-height: $vehicle-mgmt-all-vehicle__score-size;
      margin-bottom: 20px;
      margin-left: 20px;

      img {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .value {
        position: relative;
        z-index: 1;
        font-size: 40px;
        color: #fff;
        font-weight: bold;
      }
      .unit {
        font-size: 14px;
        color: #999;
      }
    }

    .el-rate {
      float: right;
      margin-top: 40px;
      margin-right: 80px;

      .el-rate__icon {
        font-size: 24px;
      }
    }
  }

  .panel-title {
    color: #606266;
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
