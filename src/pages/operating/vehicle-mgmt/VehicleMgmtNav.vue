<template>
  <div class="car-mgmt-nav">
    <div class="image">
      <img :src="car" style="width:915px"/>
      <!-- <div class="title1">车辆管理</div>
      <div class="title2">数据洞察</div> -->
      <div class="square step1" v-popover:codePop @click="link('/car/vehicle-mgmt/vehicle')" v-if="currentAuth().includes('admin:car')">
        <div class="top">车辆信息</div>
        <div class="bottom">
          车辆数量
          <span>{{this.form.carCount}}辆</span>
        </div>
      </div>
      <div class="square step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:car')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">车辆信息</div>
        <div class="bottom">
          车辆数量
          <span>{{this.form.carCount}}辆</span>
        </div>
      </div>
      <div class="square2 step2" v-popover:codePop1 @click="link('/car/vehicle-mgmt/fleet')" v-if="currentAuth().includes('caradmin:operateFleet')">
        <div class="top">运营车队</div>
        <div class="bottom">
          车队数量
          <span>{{this.form.carFleetCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('caradmin:operateFleet')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">运营车队</div>
        <div class="bottom">
          车队数量
          <span>{{this.form.carFleetCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step3"
        v-popover:codePop2
        @click="link('/car/statistics-analysis/vehicleStatic')"
        v-if="currentAuth().includes('admin:operatorStatistics.car')"
      >
        <div class="top">车辆分析</div>
        <div class="bottom">
          本月新增车辆
          <span>{{this.form.carMonthCount}}辆</span>
        </div>
      </div>
      <div class="square1 step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:operatorStatistics.car')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">车辆分析</div>
        <div class="bottom">
          本月新增车辆
          <span>{{this.form.carMonthCount}}辆</span>
        </div>
      </div>
      <div
        class="square1 step4"
        v-popover:codePop3
        @click="link('/car/terminal-mgmt/terminal-all')"
        v-if="currentAuth().includes('caradmin:operateDevice.manage')"
      >
        <div class="top">终端信息</div>
        <div class="bottom">
          已有终端
          <span>{{this.form.terminalCount}}个</span>
        </div>
      </div>
      <div class="square1 step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('caradmin:operateDevice.manage')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">终端信息</div>
        <div class="bottom">
          已有终端
          <span>{{this.form.terminalCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step5"
        v-popover:codePop4
        @click="link('/car/statistics-analysis/terminal-statistics')"
        v-if="currentAuth().includes('admin:terminalStatistics')"
      >
        <div class="top">终端分析</div>
        <div class="bottom">
          在线/离线设备
          <span>{{this.form.terminalOnLineCount}}/{{this.form.terminalOffLineCount}}个</span>
        </div>
      </div>
      <div class="square2 step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:terminalStatistics')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">终端分析</div>
        <div class="bottom">
          在线/离线设备
          <span>{{this.form.terminalOnLineCount}}/{{this.form.terminalOffLineCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">车辆信息</div>
          <div class="middle-font">新建/维护车辆信息，进行体检、定位、轨迹查询、油耗分析、驾驶分析等</div>
          <div class="bottom-font">
            车辆数量
            <span>{{this.form.carCount}}辆</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">运营车队</div>
          <div class="middle-font">新建/维护车队，管理车队车辆，设置电子围栏，发布公告等</div>
          <div class="bottom-font">
            车队数量
            <span>{{this.form.carFleetCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">车辆分析</div>
          <div class="middle-font">运营车辆情况、状态、异常、费用一目了然</div>
          <div class="bottom-font">
            本月新增车辆
            <span>{{this.form.carMonthCount}}辆</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">终端信息</div>
          <div class="middle-font">新建/维护终端基本信息、通讯信息，进行体检、定位、轨迹查询等</div>
          <div class="bottom-font">
            已有终端
            <span>{{this.form.terminalCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">终端分析</div>
          <div class="middle-font">多维度分析终端情况</div>
          <div class="bottom-font">
            在线/离线设备
            <span>{{this.form.terminalOnLineCount}}/{{this.form.terminalOffLineCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import car from '@/assets/images/nav/car.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        carCount: 0,
        carFleetCount: 0,
        terminalCount: 0,
        carMonthCount: 0,
        terminalOffLineCount: 0,
        terminalOnLineCount: 0
      },
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
    },
    getNavInfo() {
      http
        .get('/admin/store/navigation/kpi/car.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    this.getNavInfo();
  }
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
    width: 1000px;
    height: auto;
    margin: 0 auto;
    position: relative;
    .title1 {
      top: 20px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 185px;
      width: 90px;
    }
    .title2 {
      top: 20px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 722px;
      width: 90px;
    }
    .step1 {
      top: 138px;
      left: 52px;
    }
    .step2 {
      top: 138px;
      left: 230px;
    }
    .step3 {
      top: 138px;
      left: 580px;
    }
    .step4 {
      top: 382px;
      left: 52px;
    }
    .step5 {
      top: 382px;
      left: 588px;
    }
    .disabled {
      border: 1px solid #f4f4f4 !important;
      background: #B3B3B3 !important;
      .top {
        color: #fff !important;
      }
      span {
        color: #666666 !important;
      }
    }
    .square {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FF7300;
      z-index: 10;
      background:#FF7300;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square1 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFA800;
      z-index: 10;
      background:#FFA800;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square2 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFCF06;
      z-index: 10;
      background:#FFCF06;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
