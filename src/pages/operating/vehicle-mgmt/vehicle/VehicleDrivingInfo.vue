<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-driving-info">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     v-if="isEdit"
                     >
    </biz-save-button>
    <div class="panel-title">本月管控分析</div>
    <el-form
      size="small"
      label-width="110px"
      :model="formModel"
      :disabled="!isEdit"
    >
      <el-form-item label="总里程">
        <div>{{formModel.totalMiles}}</div>
      </el-form-item>
      <el-form-item label="总油耗">
        <div>{{formModel.totalOil}}</div>
      </el-form-item>
      <el-form-item label="平均油耗">
        <div>{{formModel.avgOil}}</div>
      </el-form-item>
      <el-form-item label="总时长">
        <div>{{formModel.driveTimes}}</div>
      </el-form-item>
      <el-form-item label="平均速度">
        <div>{{formModel.avgSpeed}}</div>
      </el-form-item>
      <el-form-item label="参考油费">
        <div>{{formModel.oilCost}}</div>
      </el-form-item>
      <el-form-item label="出/入围栏">
        <div>{{formModel.fenceoutReminder}} / {{formModel.fenceinReminder}}</div>
      </el-form-item>
      <el-form-item label="故障">
        <div>{{formModel.faultTimes}}</div>
      </el-form-item>
      <el-form-item label="点/熄火">
        <div>{{formModel.ignitionTimes}} / {{formModel.flameoutTimes}}</div>
      </el-form-item>
      <el-form-item label="设备插电/拔出">
        <div>{{formModel.pluginDevice}} / {{formModel.plugoutDevice}}</div>
      </el-form-item>
      <el-form-item label="碰撞">
        <div>{{formModel.collision}}</div>
      </el-form-item>
      <el-form-item label="欠压">
        <div>{{formModel.underVoltage}}</div>
      </el-form-item>
      <el-form-item label="高温">
        <div>{{formModel.highTemperature}}</div>
      </el-form-item>
      <el-form-item label="被拖吊">
        <div>{{formModel.towaway}}</div>
      </el-form-item>
    </el-form>
    <div class="panel-title">本月驾驶习惯分析</div>
    <el-form
      size="small"
      label-width="110px"
      :model="formModel"
    >
      <el-form-item label="急减速">
        <div>{{formModel.drivingActionMap['3']}}</div>
      </el-form-item>
      <el-form-item label="急加速">
        <div>{{formModel.drivingActionMap['2']}}</div>
      </el-form-item>
      <el-form-item label="急转弯">
        <div>{{formModel.drivingActionMap['7']}}</div>
      </el-form-item>
      <el-form-item label="急刹车">
        <div>{{formModel.drivingActionMap['5']}}</div>
      </el-form-item>
      <el-form-item label="高转速">
        <div>{{formModel.drivingActionMap['9']}}</div>
      </el-form-item>
      <el-form-item label="长怠速">
        <div>{{formModel.drivingActionMap['4']}}</div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/vehicle-mgmt/VehicleDrivingInfo';

export default {
  name: 'VehicleDrivingInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '图表分析',
          name: 'toChart',
          type: 'success',
          auth: ['admin:car.edit']
        }
      ],
      formModel: this.getDefaultModel()
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
    },
    plateNumber: {
      type: String
    },
    number: {
      type: String
    }
  },
  created() {

  },
  methods: {
    init () {
      if (this.itemId.id) {
        this.query();
      } else {
        this.resetModel();
      }
    },
    query () {
      service.query(
        {
          id: this.itemId.id
        },
        data => {
          this.formModel = Object.assign(this.getDefaultModel(), data.totalData);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        drivingActionMap: {}
      };
    },

    operateHandler (name) {
      this[name]();
    },

    toChart () {
      console.log('jump to chart');
      this.$router.push(
        {
          path: '/car/vehicle-mgmt/statistics-analysis/marketing-cars',
          query: {
            id: this.itemId.id,
            plateNumber: this.plateNumber,
            number: this.number
          }
        }
      );
      console.log('plateNumber: ', this.plateNumber);
    }
  },
  computed: {

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
.vehicle-mgmt-all-vehicle__vehicle-driving-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }

  .panel-title {
    color: #606266;
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
