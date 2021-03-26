<template>
  <div class="sales-mgmt-nav">
    <div class="image">
      <img :src="xs" style="width:915px"/>
      <!-- <div class="title1">销售引导阶段</div>
      <div class="title2">线索及成交</div>
      <div class="title3">数据洞察</div> -->
      <div class="square1 step11" v-popover:codePop6 @click="link('/sales/testDrive/testDrive')" v-if="currentAuth().includes('admin:testdrive')">
        <div class="top">体验商品</div>
        <div class="bottom">
          已有体验商品
          <span>{{this.form.drivingCarCount}}个</span>
        </div>
      </div>
      <div class="square1 step11 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:testdrive')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">体验商品</div>
        <div class="bottom">
          已有体验商品
          <span>{{this.form.drivingCarCount}}个</span>
        </div>
      </div>
      <div class="square1 step12" v-popover:codePop5 @click="link('/sales/product/ride')" v-if="currentAuth().includes('admin:testAppointment.sale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="drivingOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">预约体验订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.drivingOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step12 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:testAppointment.sale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="drivingOrderPendingDeal===1"></i>
        <div class="top">预约体验订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.drivingOrderCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step13"
        v-popover:codePop14
        @click="link('/sales/statistics-analysis/general')"
        v-if="currentAuth().includes('admin:potentialStatistics')"
      >
        <div class="top">潜客分析</div>
        <div class="bottom">
          本月新增潜客
          <span>{{this.form.potentialConsumerMonthCount}}人</span>
        </div>
      </div>
      <div class="square1 step13 disabled" v-popover:codePop14 v-if="!currentAuth().includes('admin:potentialStatistics')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">潜客分析</div>
        <div class="bottom">
          本月新增潜客
          <span>{{this.form.potentialConsumerMonthCount}}人</span>
        </div>
      </div>
      <div class="square2 step14" v-popover:codePop17 @click="link('/sales/statistics-analysis/potentialReport')" v-if="currentAuth().includes('admin:statistics.mouthreport.potential')">
        <div class="top">潜客月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step14 disabled" v-popover:codePop17 v-if="!currentAuth().includes('admin:statistics.mouthreport.potential')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">潜客月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step21" v-popover:codePop7 @click="link('/sales/product/replace')" v-if="currentAuth().includes('admin:replacementAppointment.sale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="changePendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">预约置换订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.changeCount}}个</span>
        </div>
      </div>
      <div class="square2 step21 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:replacementAppointment.sale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="changePendingDeal===1"></i>
        <div class="top">预约置换订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.changeCount}}个</span>
        </div>
      </div>
      <div class="square step22" v-popover:codePop10 @click="link('/sales/potential/potential')" v-if="currentAuth().includes('admin:potential')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="potentialCustomerPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">潜客管理</div>
        <div class="bottom">
          今日新增潜客
          <span>{{this.form.potentialCustomerCount}}个</span>
        </div>
      </div>
      <div class="square step22 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:potential')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="potentialCustomerPendingDeal===1"></i>
        <div class="top">潜客管理</div>
        <div class="bottom">
          今日新增潜客
          <span>{{this.form.potentialCustomerCount}}个</span>
        </div>
      </div>
      <div class="square1 step23" v-popover:codePop11 @click="link('/sales/product/car')" v-if="currentAuth().includes('admin:carOrder.sale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="wholeCarPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">整车订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.wholeCarCount}}个</span>
        </div>
      </div>
      <div class="square1 step23 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:carOrder.sale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="wholeCarPendingDeal===1"></i>
        <div class="top">整车订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.wholeCarCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step24"
        v-popover:codePop15
        @click="link('/sales/statistics-analysis/sale')"
        v-if="currentAuth().includes('admin:potential.statistics')"
      >
        <div class="top">销售分析</div>
        <div class="bottom">
          本月销售额
          <span>{{this.form.orderAmountPaidInc}}元</span>
        </div>
      </div>
      <div class="square1 step24 disabled" v-popover:codePop15 v-if="!currentAuth().includes('admin:potential.statistics')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">销售分析</div>
        <div class="bottom">
          本月销售额
          <span>{{this.form.orderAmountPaidInc}}元</span>
        </div>
      </div>
      <div
        class="square2 step31"
        v-popover:codePop1
        @click="link('/sales/financeProduct/category')"
        v-if="currentAuth().includes('admin:system.finnancialcategory')||currentAuth().includes('admin:finnancialcategory')"
      >
        <div class="top">维护产品分类</div>
        <div class="bottom">
          已有产品分类
          <span>{{this.form.financeCategoryCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step31 disabled"
        v-popover:codePop1
        v-if="!currentAuth().includes('admin:system.finnancialcategory')&&!currentAuth().includes('admin:finnancialcategory')"
       @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护产品分类</div>
        <div class="bottom">
          已有产品分类
          <span>{{this.form.financeCategoryCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step32"
        v-popover:codePop3
        @click="link('/sales/financeProduct/finance')"
        v-if="currentAuth().includes('admin:finnancialPlan')||currentAuth().includes('admin:system.finnancialPlan')"
      >
        <div class="top">维护金融方案</div>
        <div class="bottom">
          已有金融方案
          <span>{{this.form.financialPlanCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step32 disabled"
        v-popover:codePop3
        v-if="!currentAuth().includes('admin:finnancialPlan')&&!currentAuth().includes('admin:system.finnancialPlan')"
       @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护金融方案</div>
        <div class="bottom">
          已有金融方案
          <span>{{this.form.financialPlanCount}}个</span>
        </div>
      </div>
      <div class="square2 step33" v-popover:codePop8 @click="link('/sales/product/finance/finance/finance')" v-if="currentAuth().includes('admin:sale.financeOrder')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="loanCarOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">金融订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.loanCarOrderCount}}个</span>
        </div>
      </div>
      <div class="square2 step33 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:sale.financeOrder')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="loanCarOrderPendingDeal===1"></i>
        <div class="top">金融订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.loanCarOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step34" v-popover:codePop12 @click="link('/sales/product/product')" v-if="currentAuth().includes('admin:carProductOrder.sale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="carProductPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">车品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.carProductCount}}个</span>
        </div>
      </div>
      <div class="square1 step34 disabled" v-popover:codePop12 v-if="!currentAuth().includes('admin:carProductOrder.sale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="carProductPendingDeal===1"></i>
        <div class="top">车品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.carProductCount}}个</span>
        </div>
      </div>
      <div class="square2 step35" v-popover:codePop16 @click="link('/sales/statistics-analysis/saleReport')" v-if="currentAuth().includes('admin:statistics.mouthreport.potential')">
        <div class="top">销售月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step35 disabled" v-popover:codePop16 v-if="!currentAuth().includes('admin:statistics.mouthreport.potential')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">销售月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <!-- <div
        class="square step41"
        v-popover:codePop2
        @click="link('/sales/financeMgmt/company/mgmt')"
        v-if="currentAuth().includes('admin:finnancialinstitution')"
      >
        <div class="top">维护金融机构</div>
        <div class="bottom">
          已有金融机构
          <span>{{this.form.financialInstitutionCount}}个</span>
        </div>
      </div>
      <div class="square step41 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:finnancialinstitution')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护金融机构</div>
        <div class="bottom">
          已有金融机构
          <span>{{this.form.financialInstitutionCount}}个</span>
        </div>
      </div> -->
      <div
        class="square2 step42"
        v-popover:codePop4
        @click="link('/sales/financeProduct/insurance')"
        v-if="currentAuth().includes('admin:insurancePlan')||currentAuth().includes('admin:system.insurancePlan')"
      >
        <div class="top">维护保险方案</div>
        <div class="bottom">
          已有保险方案
          <span>{{this.form.insurancePlanCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step42 disabled"
        v-popover:codePop4
        v-if="!currentAuth().includes('admin:insurancePlan')&&!currentAuth().includes('admin:system.insurancePlan')"
       @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">维护保险方案</div>
        <div class="bottom">
          已有保险方案
          <span>{{this.form.insurancePlanCount}}个</span>
        </div>
      </div>
      <div class="square2 step43" v-popover:codePop9 @click="link('/sales/product/insurance/insurance/insurance')" v-if="currentAuth().includes('admin:sale.insuranceOrder')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="insuranceOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">保险订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.insuranceOrderCount}}个</span>
        </div>
      </div>
      <div class="square2 step43 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:sale.insuranceOrder')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="insuranceOrderPendingDeal===1"></i>
        <div class="top">保险订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.insuranceOrderCount}}个</span>
        </div>
      </div>
      <div class="square1 step44" v-popover:codePop13 @click="link('/sales/product/general')" v-if="currentAuth().includes('admin:commonorder.sale')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="normalProductPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">普通产品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.normalProductCount}}个</span>
        </div>
      </div>
      <div class="square1 step44 disabled" v-popover:codePop13 v-if="!currentAuth().includes('admin:commonorder.sale')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="normalProductPendingDeal===1"></i>
        <div class="top">普通产品订单</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.normalProductCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">维护产品分类</div>
          <div class="middle-font">创建/维护产品分类</div>
          <div class="bottom-font">
            已有产品分类
            <span>{{this.form.financeCategoryCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">维护金融机构</div>
          <div class="middle-font">创建/维护金融机构</div>
          <div class="bottom-font">
            已有金融机构
            <span>{{this.form.financialInstitutionCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">维护金融方案</div>
          <div class="middle-font">创建/维护金融方案</div>
          <div class="bottom-font">
            已有金融方案
            <span>{{this.form.financialPlanCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">保险金融方案</div>
          <div class="middle-font">创建/维护保险方案</div>
          <div class="bottom-font">
            已有保险方案
            <span>{{this.form.insurancePlanCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">预约体验订单</div>
          <div class="middle-font">处理体验订单，跟进销售线索</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.drivingOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">体验商品</div>
          <div class="middle-font">管理体验商品</div>
          <div class="bottom-font">
            已有体验商品
            <span>{{this.form.drivingCarCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">预约置换订单</div>
          <div class="middle-font">处理置换订单，跟进销售线索</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.changeCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">金融订单</div>
          <div class="middle-font">处理贷款购车订单，跟进销售线索</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.loanCarOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">保险订单</div>
          <div class="middle-font">创建/维护保险订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.insuranceOrderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">潜客管理</div>
          <div class="middle-font">创建/维护潜客记录</div>
          <div class="bottom-font">
            今日新增潜客
            <span>{{this.form.potentialCustomerCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">整车订单</div>
          <div class="middle-font">创建/维护整车订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.wholeCarCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop12">
        <div class="pop-div">
          <div class="top-font">车品订单</div>
          <div class="middle-font">创建/维护车品订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.carProductCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop13">
        <div class="pop-div">
          <div class="top-font">普通产品订单</div>
          <div class="middle-font">创建/维护普通产品订单</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.normalProductCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop14">
        <div class="pop-div">
          <div class="top-font">潜客分析</div>
          <div class="middle-font">潜客回访、战败、成交分析等</div>
          <div class="bottom-font">
            本月新增潜客
            <span>{{this.form.potentialConsumerMonthCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop15">
        <div class="pop-div">
          <div class="top-font">销售分析</div>
          <div class="middle-font">多维度分析新车及关联产品销售业绩</div>
          <div class="bottom-font">
            本月销售额
            <span>{{this.form.orderAmountPaidInc}}元</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop16">
        <div class="pop-div">
          <div class="top-font">销售月报</div>
          <div class="middle-font">按月分析销售数据，并给出相应建议</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop17">
        <div class="pop-div">
          <div class="top-font">潜客月报</div>
          <div class="middle-font">按月分析潜客数据，并给出相应建议</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import xs from '@/assets/images/nav/xs.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        financeCategoryCount: 0,
        financialInstitutionCount: 0,
        financialPlanCount: 0,
        insurancePlanCount: 0,
        drivingOrderCount: 0,
        drivingCarCount: 0,
        changeCount: 0,
        loanCarOrderCount: 0,
        insuranceOrderCount: 0,
        potentialCustomerCount: 0,
        wholeCarCount: 0,
        carProductCount: 0,
        normalProductCount: 0,
        potentialConsumerMonthCount: 0,
        orderAmountPaidInc: 0
      },
      drivingOrderPendingDeal: 0,
      changePendingDeal: 0,
      loanCarOrderPendingDeal: 0,
      insuranceOrderPendingDeal: 0,
      potentialCustomerPendingDeal: 0,
      wholeCarPendingDeal: 0,
      carProductPendingDeal: 0,
      normalProductPendingDeal: 0,
      xs: xs
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
        .get('/admin/store/navigation/kpi/sales.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.drivingOrderPendingDeal = data.drivingOrderPendingDeal;
          this.changePendingDeal = data.changePendingDeal;
          this.loanCarOrderPendingDeal = data.loanCarOrderPendingDeal;
          this.insuranceOrderPendingDeal = data.insuranceOrderPendingDeal;
          this.potentialCustomerPendingDeal = data.potentialCustomerPendingDeal;
          this.wholeCarPendingDeal = data.wholeCarPendingDeal;
          this.carProductPendingDeal = data.carProductPendingDeal;
          this.normalProductPendingDeal = data.normalProductPendingDeal;
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
.sales-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 23px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 165px;
      width: 120px;
    }
    .title2 {
      top: 23px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 602px;
      width: 120px;
    }
    .title3 {
      top: 23px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1118px;
      width: 90px;
    }
    .step11 {
      top: 153px;
      left: 145px;
    }
    .step12 {
      top: 153px;
      left: 295px;
    }
    .step13 {
      top: 196px;
      left: 784px;
    }
    .step14 {
      top: 90px;
      left: 784px;
    }
    .step21 {
      top: 274px;
      left: 295px;
    }
    .step22 {
      top: 370px;
      left: 460px;
    }
    .step23 {
      top: 280px;
      left: 617px;
    }
    .step24 {
      top: 406px;
      left: 782px;
    }
    .step31 {
      top: 470px;
      left: 0px;
    }
    .step32 {
      top: 410px;
      left: 156px;
    }
    .step33 {
      top: 410px;
      left: 304px;
    }
    .step34 {
      top: 410px;
      left: 617px;
    }
    .step35 {
      top: 540px;
      left: 782px;
    }
    .step41 {
      top: 640px;
      left: 10px;
    }
    .step42 {
      top: 540px;
      left: 156px;
    }
    .step43 {
      top: 540px;
      left: 304px;
    }
    .step44 {
      top: 539px;
      left: 617px;
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
