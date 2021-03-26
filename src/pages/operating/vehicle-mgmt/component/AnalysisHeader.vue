<template>
  <div class="vehicle-mgmt-analysis-header">
    <div class="table">
      <div class="table-row first-row">
        <div class="table-cell">总里程<div class="color-primary">{{headerData.totalMiles || '0'}}</div><span class="unit-font">km</span></div>
        <div class="table-cell">总油耗<div class="color-primary">{{headerData.totalOil || '0'}}</div><span class="unit-font">L</span></div>
        <div class="table-cell">平均油耗<div class="color-primary">{{headerData.avgOil || '0'}}</div><span class="unit-font">L/100km</span></div>
        <div class="table-cell">总时长<div class="color-primary">{{headerData.driveTimes || '0'}}</div><span class="unit-font">h</span></div>
        <div class="table-cell">平均速度<div class="color-primary">{{headerData.avgSpeed || '0'}}</div><span class="unit-font">km/h</span></div>
      </div>
      <div class="table-row">
        <div class="table-cell">入围栏/出围栏
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.fenceinReminder || '0'}}/{{headerData.fenceoutReminder || '0'}}</span>次</div>
        <div class="table-cell">故障
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.faultTimes || '0'}}</span>次</div>
        <div class="table-cell">碰撞
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.collision || '0'}}</span>次</div>
        <div class="table-cell">欠压
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.underVoltage || '0'}}</span>次</div>
      </div>
      <div class="table-row">
        <div class="table-cell">点火/熄火
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.ignitionTimes || '0'}}/{{headerData.flameoutTimes || '0'}}</span>次</div>
        <div class="table-cell">插电/拔出
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.pluginDevice || '0'}}/{{headerData.plugoutDevice || '0'}}</span>次</div>
        <div class="table-cell">高温
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.highTemperature || '0'}}</span>次</div>
        <div class="table-cell">被拖吊
        <!-- </div>
        <div class="table-cell"> -->
          <span class="color-primary">{{headerData.towaway || '0'}}</span>次</div>
      </div>
      <div class="table-row last-row">
        <div class="table-cell-panel"><i class="iconfont biz-icon-msnui-dashboard-copy"></i><div>急减速<span class="color-primary">{{headerData.drivingActionMap[3] || '0'}}</span>次</div></div>
        <div class="table-cell-panel"><i class="iconfont biz-icon-msnui-dashboard"></i><div>急加速<span class="color-primary">{{headerData.drivingActionMap[2] || '0'}}</span>次</div></div>
        <div class="table-cell-panel"><i class="iconfont biz-icon-ic_turn_left_back"></i><div>急转弯<span class="color-primary">{{headerData.drivingActionMap['7'] || '0'}}</span>次</div></div>
        <div class="table-cell-panel"><i class="iconfont biz-icon-xinxinicon"></i><div>急刹车<span class="color-primary">{{headerData.drivingActionMap[5] || '0'}}</span>次</div></div>
        <div class="table-cell-panel"><i class="iconfont biz-icon-zuigaochesu"></i><div>高转速<span class="color-primary">{{headerData.drivingActionMap[9] || '0'}}</span>次</div></div>
        <div class="table-cell-panel"><i class="iconfont biz-icon-daisu"></i><div>长怠速<span class="color-primary">{{headerData.drivingActionMap[4] || '0'}}</span>次</div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisHeader',
  props: {
    headerData: {
      type: Object
    }
  },
  data () {
    return {
    };
  },
  created() {
    if (!this.headerData.drivingActionMap) {
      this.$set(
        this.headerData,
        'drivingActionMap',
        {
          0: '0',
          1: '0',
          2: '0',
          3: '0',
          4: '0',
          5: '0',
          6: '0',
          7: '0',
          8: '0',
          9: '0'
        }
      );
    }
  },
  components: {
  },
  watch: {
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-analysis-header {
  width: 1100px;
  height: 400px;
  margin: 20px auto;
  padding: 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  i {
    display: block;
    margin: 0 auto;
    // width: 50px;
    // height: 50px;
  }
  .iconfont {
    font-family:"iconfont" !important;
    font-size:50px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;}
  .table {
    width: 100%;
    display: flex;
    flex-direction: column;
    // font-size: 12px;
    color: #666666;
    // border: 1px solid #ebeef5;
    text-align: center;
    .table-row {
      display: flex;
      flex-direction: row;
      // border: 1px solid #ebeef5;
      .table-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-basis: 100%;
        flex-grow: 1;
        padding: 8px 10px;
        margin: 10px 0;
        border-right: 2px solid #ebeef5;
        // border: 1px solid #ebeef5;
      }
      .table-cell:nth-of-type(2n + 1) {
        // justify-content: center;
        // border-right: none;
      }
      .table-cell:nth-last-of-type(1) {
        border-right: none;
      }
      .table-cell-panel {
        flex-basis: 100%;
        flex-grow: 1;
        padding: 10px 0;
      }
      .color-grey {
        background-color: #fafafa;
      }
      .color-primary {
        // display: inline-block;
        padding: 0 5px;
        color: #ff7300;
        // font-size: 26px;
        font-size: 24px;
        // font-weight: bold;
      }
      .color-red {
        display: inline-block;
        padding: 0 5px;
        color: #F56C6C;
        font-size: 14px;
        font-weight: bold;
      }
    }
    .table-row.first-row{
      // border: 1px solid #409EFF;
      border-bottom: 2px solid #EBEEF5;
      border-left: none;
      border-right: none;
      margin-bottom: 10px;
      .unit-font {
        font-size: 12px;
        color: #929292;
      }
      .table-cell:last-child {
        border-right: none;
      }
      .table-cell {
        border: none;
        display: flex;
        flex-direction: column;
        border-right: 2px solid #ebeef5;
      }
    }
    .table-row.last-row {
      border-top: 2px solid #ebeef5;
      border-left: none;
      border-right: none;
      .iconfont {
        color: #c1c1c1;
      }
    }
  }
}
</style>
