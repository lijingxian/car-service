<template>
  <div class="car-mgmt-nav">
    <div class="image">
      <img :src="car">
      <div class="square step1"  v-popover:codePop @click="link('/car/vehicle-mgmt/vehicle')" v-if="currentAuth().includes('admin:car')">
        <div class="top">车辆信息</div>
        <div class="bottom">车辆数量<span>4辆</span></div>
      </div>
      <div class="square step1 disabled"  v-popover:codePop v-if="!currentAuth().includes('admin:car')">
        <div class="top">车辆信息</div>
        <div class="bottom">车辆数量<span>4辆</span></div>
      </div>
      <div class="square step2"  v-popover:codePop1 @click="link('/car/vehicle-mgmt/fleet')" v-if="currentAuth().includes('caradmin:operateFleet')">
        <div class="top">运营车队</div>
        <div class="bottom">车队数量<span>5个</span></div>
      </div>
      <div class="square step2 disabled"  v-popover:codePop1  v-if="currentAuth().includes('caradmin:operateFleet')">
        <div class="top">运营车队</div>
        <div class="bottom">车队数量<span>5个</span></div>
      </div>
      <div class="square step3"  v-popover:codePop2 @click="link('/car/statistics-analysis/vehicleStatic')" v-if="currentAuth().includes('admin:operatorStatistics.car')">
        <div class="top">车辆分析</div>
      </div>
      <div class="square step3 disabled"  v-popover:codePop2  v-if="currentAuth().includes('admin:operatorStatistics.car')">
        <div class="top">车辆分析</div>
      </div>
      <div class="square step4"  v-popover:codePop3 @click="link('/car/terminal-mgmt/terminal-all')" v-if="currentAuth().includes('caradmin:operateDevice.manage')">
        <div class="top">终端信息</div>
        <div class="bottom">已有终端<span>23个</span></div>
      </div>
      <div class="square step4 disabled"  v-popover:codePop3 v-if="currentAuth().includes('caradmin:operateDevice.manage')">
        <div class="top">终端信息</div>
        <div class="bottom">已有终端<span>23个</span></div>
      </div>
      <div class="square step5"  v-popover:codePop4 @click="link('/car/statistics-analysis/terminal-statistics')" v-if="currentAuth().includes('admin:terminalStatistics')">
        <div class="top">终端分析</div>
      </div>
      <div class="square step5"  v-popover:codePop4 v-if="currentAuth().includes('admin:terminalStatistics')">
        <div class="top">终端分析</div>
      </div>
      <el-popover
        placement="bottom-start"
        trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">车辆信息</div>
          <div class="middle-font">新建/维护车辆信息，进行体检、定位、轨迹查询、油耗分析、驾驶分析等</div>
          <div class="bottom-font">车辆数量<span>4辆</span></div>
        </div>
      </el-popover>
      <el-popover
        placement="bottom-start"
        trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">运营车队</div>
          <div class="middle-font">新建/维护车队，管理车队车辆，设置电子围栏，发布公告等</div>
          <div class="bottom-font">车队数量<span>5个</span></div>
        </div>
      </el-popover>
      <el-popover
        placement="bottom-start"
        trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">车辆分析</div>
          <div class="middle-font">运营车辆情况、状态、异常、费用一目了然</div>
        </div>
      </el-popover>
      <el-popover
        placement="bottom-start"
        trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">终端信息</div>
          <div class="middle-font">新建/维护终端基本信息、通讯信息，进行体检、定位、轨迹查询等</div>
          <div class="bottom-font">已有终端<span>23个</span></div>
        </div>
      </el-popover>
      <el-popover
        placement="bottom-start"
        trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">终端信息</div>
          <div class="middle-font">多维度分析终端情况</div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import car from '@/assets/images/nav/car.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      companyCount: 0,
      storeCount: 0,
      unionCount: 0,
      addOperator: '',
      addStore: '',
      storeList: '',
      car: car
    };
  },
  computed: {},
  components: {},
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapGetters('Authority', ['currentAuth']),
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.pop-div {
  border-radius: 5px;
  text-align: left;
  padding: 10px;
  .top-font {
    font-size: 16px;
  }
  .middle-font {
    padding: 10px 0px;
    font-size: 12px;
  }
  .bottom-font {
    font-size: 14px;
    span {
      color: #ff7300;
      margin-left: 10px;
    }
  }
}
.car-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1088px;
    height: 905px;
    position: relative;
    .step1 {
      top: 180px;
      left: 42px;
    }
    .step2 {
      top: 180px;
      left: 252px;
    }
    .step3 {
      top: 180px;
      left: 622px;
    }
    .step4 {
      top: 437px;
      left: 42px;
    }
    .step5 {
      top: 437px;
      left: 626px
    }
    .disabled {
      border: 1px solid #f4f4f4!important;
      span {
        color: #666666!important;
      }
    }
    .square {
      width: 140px;
      height: 140px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #ff7300;
      z-index: 10;
      background: #fff;
      cursor: pointer;
      .top {
        height: 80px;
        line-height: 80px;
        width: 140px;
        font-size: 16px;
        color: #000;
        text-align: center;
      }
      .bottom {
        height: 57px;
        background: #f7f7f7;
        font-size: 12px;
        line-height: 57px;
        text-align: center;
        color: #666666;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px
        }
      }
    }
  }
}
</style>
