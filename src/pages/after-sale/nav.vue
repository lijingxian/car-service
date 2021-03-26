<template>
  <div class="after-sale-mgmt-nav">
    <div class="image">
      <img :src="sh" style="width:915px"/>
      <!-- <div class="title1">售后准备</div>
      <div class="title2">业务处理</div>
      <div class="title3">数据洞察</div> -->
      <div class="square2 step11" v-popover:codePop1 @click="link('/after-sale/booklet')" v-if="currentAuth().includes('admin:aftersale.booklet')">
        <div class="top">维护服务手册</div>
        <div class="bottom">
          已有品牌
          <span>{{this.form.manualCount}}个</span>
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:aftersale.booklet')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护服务手册</div>
        <div class="bottom">
          已有品牌
          <span>{{this.form.manualCount}}个</span>
        </div>
      </div>
      <div class="square2 step12" v-popover:codePop3 @click="link('/after-sale/appointment')" v-if="currentAuth().includes('admin:aftersale.appointment')">
        <div class="top">预约设置及确认</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.appointmentCount}}个</span>
        </div>
      </div>
      <div class="square2 step12 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:aftersale.appointment')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">预约设置及确认</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.appointmentCount}}个</span>
        </div>
      </div>
      <div class="square step13" v-popover:codePop4 @click="link('/after-sale/product/service')" v-if="currentAuth().includes('admin:normalService.aftersale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="serviceOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">服务订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.serviceOrderCount}}个</span>
        </div>
      </div>
      <div class="square step13 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:normalService.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="serviceOrderPendingDeal===1"></i>
        <div class="top">服务订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.serviceOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step14" v-popover:codePop6 @click="link('/after-sale/maintenance')" v-if="currentAuth().includes('admin:aftersale.maintain')">
        <div class="top">维保记录</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.maintenanceOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step14 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:aftersale.maintain')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维保记录</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.maintenanceOrderCount}}个</span>
        </div>
      </div>
      <div class="square2 step21" v-popover:codePop2 @click="link('/after-sale/service/rescue')" v-if="currentAuth().includes('admin:cooperaRescueOrg')">
        <div class="top">维护救援机构</div>
        <div class="bottom">
          已有救援机构
          <span>{{this.form.rescueCount}}个</span>
        </div>
      </div>
      <div class="square2 step21 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:cooperaRescueOrg')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护救援机构</div>
        <div class="bottom">
          已有救援机构
          <span>{{this.form.rescueCount}}个</span>
        </div>
      </div>
      <div class="square1 step22" v-popover:codePop5 @click="link('/after-sale/product/rescue')" v-if="currentAuth().includes('admin:rescue.aftersale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="rescueOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">救援订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.rescueOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step22 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:rescue.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="rescueOrderPendingDeal===1"></i>
        <div class="top">救援订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.rescueOrderCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step23"
        v-popover:codePop10
        @click="link('/after-sale/statistics-analysis/aftersale')"
        v-if="currentAuth().includes('admin:aftersale.statistics')"
      >
        <div class="top">售后分析</div>
        <div class="bottom">
          本月售后产值
          <span>{{this.form.aftersaleAmount}}元</span>
        </div>
      </div>
      <div class="square1 step23 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:aftersale.statistics')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">售后分析</div>
        <div class="bottom">
          本月售后产值
          <span>{{this.form.aftersaleAmount}}元</span>
        </div>
      </div>
      <div
        class="square1 step31"
        v-popover:codePop8
        @click="link('/after-sale/product/product')"
        v-if="currentAuth().includes('admin:carProductOrder.aftersale')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="carProductOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">车品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.carProductOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step31 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:carProductOrder.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="carProductOrderPendingDeal===1" ></i>
        <div class="top">车品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.carProductOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step32" v-popover:codePop9 @click="link('/after-sale/product/general')" v-if="currentAuth().includes('admin:commonorder.aftersale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="normalProductOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">产品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.normalProductOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step32 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:commonorder.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="normalProductOrderPendingDeal===1"></i>
        <div class="top">产品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.normalProductOrderCount}}个</span>
        </div>
      </div>
      <div class="square2 step33" v-popover:codePop11 v-if="currentAuth().includes('admin:statistics.mouthreport.aftersale')" @click="link('/after-sale/statistics-analysis/report')">
        <div class="top">售后月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step33 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:statistics.mouthreport.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">售后月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div
        class="square2 step41"
        v-popover:codePop7
        @click="link('/after-sale/product/couponOrder')"
        v-if="currentAuth().includes('admin:couponOrder.aftersale')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="couponOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">优惠券订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.couponOrderCount}}个</span>
        </div>
      </div>
      <div class="square2 step41 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:couponOrder.aftersale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="couponOrderPendingDeal===1"></i>
        <div class="top">优惠券订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.couponOrderCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">维护服务手册</div>
          <div class="middle-font">维护店端各车型服务手册</div>
          <div class="bottom-font">
            已有品牌
            <span>{{this.form.manualCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">维护救援机构</div>
          <div class="middle-font">维护店端救援机构</div>
          <div class="bottom-font">
            已有救援机构
            <span>{{this.form.rescueCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">预约设置及确认</div>
          <div class="middle-font">管理车辆预约维保记录</div>
          <div class="bottom-font">
            今日新增记录
            <span>{{this.form.appointmentCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">服务订单</div>
          <div class="middle-font">管理车辆售后维保服务订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.serviceOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">救援订单</div>
          <div class="middle-font">处理车辆售后救援订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.rescueOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">维保记录</div>
          <div class="middle-font">管理客户车辆维保记录，设置维保提醒规则</div>
          <div class="bottom-font">
            今日新增记录
            <span>{{this.form.maintenanceOrderCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">优惠券订单</div>
          <div class="middle-font">创建/维护优惠券订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.couponOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">车品订单</div>
          <div class="middle-font">创建/维护车品订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.carProductOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">产品订单</div>
          <div class="middle-font">创建/维护普通产品订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.normalProductOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">售后分析</div>
          <div class="middle-font">多维度分析售后维保业绩</div>
          <div class="bottom-font"></div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">售后月报</div>
          <div class="middle-font">按月分析售后维保数据，并给出相应建议</div>
          <div class="bottom-font"></div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import sh from '@/assets/images/nav/sh.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        manualCount: 0,
        rescueCount: 0,
        appointmentCount: 0,
        serviceOrderCount: 0,
        rescueOrderCount: 0,
        maintenanceOrderCount: 0,
        couponOrderCount: 0,
        carProductOrderCount: 0,
        normalProductOrderCount: 0,
        aftersaleAmount: 0
      },
      serviceOrderPendingDeal: 0,
      rescueOrderPendingDeal: 0,
      couponOrderPendingDeal: 0,
      carProductOrderPendingDeal: 0,
      normalProductOrderPendingDeal: 0,
      sh: sh
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
        .get('/admin/store/navigation/kpi/afterSales.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.serviceOrderPendingDeal = data.serviceOrderPendingDeal;
          this.rescueOrderPendingDeal = data.rescueOrderPendingDeal;
          this.couponOrderPendingDeal = data.couponOrderPendingDeal;
          this.carProductOrderPendingDeal = data.carProductOrderPendingDeal;
          this.normalProductOrderPendingDeal = data.normalProductOrderPendingDeal;
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
.after-sale-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 26px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 135px;
      width: 90px;
    }
    .title2 {
      top: 26px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 560px;
      width: 90px;
    }
    .title3 {
      top: 26px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1010px;
      width: 90px;
    }
    .step11 {
      top: 225px;
      left: 30px;
    }
    .step12 {
      top: 105px;
      left: 30px;
    }
    .step13 {
      top: 100px;
      left: 323px;
    }
    .step14 {
      top: 100px;
      left: 556px;
    }
    .step21 {
      top: 340px;
      left: 30px;
    }
    .step22 {
      top: 330px;
      left: 323px;
    }
    .step23 {
      top: 335px;
      left: 760px;
    }
    .step31 {
      top: 470px;
      left: 323px;
    }
    .step32 {
      top: 470px;
      left: 520px;
    }
    .step33 {
      top: 490px;
      left: 760px;
    }
    .step41 {
      top: 605px;
      left: 323px;
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
