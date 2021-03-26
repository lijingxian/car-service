<template>
  <div class="finance-mgmt-nav">
    <div class="image">
      <img :src="cw" style="width:915px"/>
      <!-- <div class="title1">业务处理</div>
      <div class="title2">财务查询</div> -->
      <div class="square2 step1" v-popover:codePop @click="link('/operating/product/car')" v-if="currentAuth().includes('admin:carOrder')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="orderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">订单管理</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.orderCount}}个</span>
        </div>
      </div>
      <div class="square2 step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:carOrder')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="orderPendingDeal===1"></i>
        <div class="top">订单管理</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.orderCount}}个</span>
        </div>
      </div>
      <div class="square2 step2" v-popover:codePop1 @click="link('/finance/payment-mgmt')" v-if="currentAuth().includes('admin:finance.refunds')">
        <div class="top">付款管理</div>
        <div class="bottom">
          今日新增付款单
          <span>{{this.form.accountOutCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:finance.refunds')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">付款管理</div>
        <div class="bottom">
          今日新增付款单
          <span>{{this.form.accountOutCount}}个</span>
        </div>
      </div>
      <div class="square2 step3" v-popover:codePop2 @click="link('/finance/receipt-mgmt')" v-if="currentAuth().includes('admin:finance.payment')">
        <div class="top">收款管理</div>
        <div class="bottom">
          今日新增收款单
          <span>{{this.form.accountInCount}}个</span>
        </div>
      </div>
      <div class="square2 step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:finance.payment')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">收款管理</div>
        <div class="bottom">
          今日新增收款单
          <span>{{this.form.accountInCount}}个</span>
        </div>
      </div>
      <div class="square2 step4" v-popover:codePop3 @click="link('/invoicing/purchase-order-new')" v-if="currentAuth().includes('admin:purchaseOrder')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchasePendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">采购订单</div>
        <div class="bottom-2">
          今日新增采购订单
          <span>{{this.form.purchaseTodayCount}}个</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          本月累计采购订单
          <span>{{this.form.purchaseMonthCount}}个</span>
        </div>
      </div>
      <div class="square2 step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:purchaseOrder')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchasePendingDeal===1"></i>
        <div class="top">采购订单</div>
        <div class="bottom-2">
          今日新增采购订单
          <span>{{this.form.purchaseTodayCount}}个</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          本月累计采购订单
          <span>{{this.form.purchaseMonthCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step5"
        v-popover:codePop4
        @click="link('/finance/supplier-check-acount')"
        v-if="currentAuth().includes('admin:finance.reconciliation')"
      >
        <div class="top">供应商对账</div>
        <div class="bottom">
          今日新增供应商对账单
          <span>{{this.form.supplierCount}}</span>
        </div>
      </div>
      <div class="square1 step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:finance.reconciliation')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">供应商对账</div>
        <div class="bottom">
          今日新增供应商对账单
          <span>{{this.form.supplierCount}}</span>
        </div>
      </div>
      <div class="square2 step6" v-popover:codePop5 @click="link('/invoicing/sale/sale-order')" v-if="currentAuth().includes('admin:saleOrder')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="salesPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">销售订单</div>
        <div class="bottom-2">
          今日新增销售订单
          <span>{{this.form.salesTodayCount}}个</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          本月累计销售订单
          <span>{{this.form.salesMonthCount}}个</span>
        </div>
      </div>
      <div class="square2 step6 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:saleOrder')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="salesPendingDeal===1"></i>
        <div class="top">销售订单</div>
        <div class="bottom-2">
          今日新增销售订单
          <span>{{this.form.salesTodayCount}}个</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          本月累计销售订单
          <span>{{this.form.salesMonthCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step7"
        v-popover:codePop6
        @click="link('/finance/agent-check-acount')"
        v-if="currentAuth().includes('admin:finance.reconciliation.agent')"
      >
        <div class="top">代理商对账</div>
        <div class="bottom">
          今日新增代理商对账单
          <span>{{this.form.agentCount}}</span>
        </div>
      </div>
      <div class="square1 step7 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:finance.reconciliation.agent')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">代理商对账</div>
        <div class="bottom">
          今日新增代理商对账单
          <span>{{this.form.agentCount}}</span>
        </div>
      </div>
      <!-- <div
        class="square step8"
        v-popover:codePop8
        @click="link('/invoicing/store-house-mgmt/depot-in-mgmt')"
        v-if="currentAuth().includes('admin:inport')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="inStockPendingDeal===1"></i>
        <div class="top">入库</div>
        <div class="bottom">
          新增入库单
          <span>{{this.form.inStockDayNewCount}}</span>
        </div>
      </div>
      <div class="square step8 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:inport')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="inStockPendingDeal===1"></i>
        <div class="top">入库</div>
        <div class="bottom">
          新增入库单
          <span>{{this.form.inStockDayNewCount}}</span>
        </div>
      </div> -->
      <div
        class="square step9"
        v-popover:codePop9
        @click="link('/finance/invoice-mgmt')"
        v-if="currentAuth().includes('admin:finance.invoice')"
      >
        <div class="top">发票管理</div>
        <div class="bottom-2">
          今日新增采购发票
          <span>{{this.form.purchaseInvoiceRecordCount}}</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          今日新增销售发票
          <span>{{this.form.salesInvoiceRecordCount}}</span>
        </div>
      </div>
      <div class="square step9 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:finance.invoice')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发票管理</div>
        <div class="bottom-2">
          今日新增采购发票
          <span>{{this.form.purchaseInvoiceRecordCount}}</span>
        </div>
        <div class="bottom-2" style="border-radius: 0px 0px 10px 10px;">
          今日新增销售发票
          <span>{{this.form.salesInvoiceRecordCount}}</span>
        </div>
      </div>
      <!-- <div
        class="square step10"
        v-popover:codePop10
        @click="link('/invoicing/store-house-mgmt/depot-out-mgmt')"
        v-if="currentAuth().includes('admin:export')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="outStockPendingDeal===1"></i>
        <div class="top">出库</div>
        <div class="bottom">
          新增出库单
          <span>{{this.form.outStockDayNewCount}}</span>
        </div>
      </div>
      <div class="square step10 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:export')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="outStockPendingDeal===1"></i>
        <div class="top">出库</div>
        <div class="bottom">
          新增出库单
          <span>{{this.form.outStockDayNewCount}}</span>
        </div>
      </div> -->
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">订单管理</div>
          <div class="middle-font">管理订单，进行确认、发货/执行、收款、开票等处理。</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.orderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">付款管理</div>
          <div class="middle-font">店铺的付款情况查询</div>
          <div class="bottom-font">
            今日新增付款单
            <span>{{this.form.accountOutCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">收款管理</div>
          <div class="middle-font">店铺的收款情况查询</div>
          <div class="bottom-font">
            今日新增收款单
            <span>{{this.form.accountInCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">采购订单</div>
          <div class="middle-font">当发现库存不足需要补货时可直接创建采购订单</div>
          <div class="bottom-font">
            今日新增采购订单
            <span>{{this.form.purchaseTodayCount}}个</span>
          </div>
          <div class="bottom-font">
            本月累计采购订单
            <span>{{this.form.purchaseMonthCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">供应商对账</div>
          <div class="middle-font">供应商的付款情况查询</div>
          <div class="bottom-font">
            今日新增供应商对账单
            <span>{{this.form.supplierCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">销售订单</div>
          <div class="middle-font">您可在管理代理商下的销售订单，进行审核、发货、开票等操作</div>
          <div class="bottom-font">
            今日新增销售订单
            <span>{{this.form.salesTodayCount}}个</span>
          </div>
          <div class="bottom-font">
            本月累计销售订单
            <span>{{this.form.salesMonthCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">代理商对账</div>
          <div class="middle-font">代理商的收款情况查询</div>
          <div class="bottom-font">
            今日新增代理商对账单
            <span>{{this.form.agentCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">入库</div>
          <div class="middle-font">采购/销售/盘点/调拨需要从仓库入库时创建入库单作为入库凭证</div>
          <div class="bottom-font">
            今日新增入库单
            <span>{{this.form.inStockDayNewCount}}</span>
          </div>
          <div class="bottom-font">
            本月累计入库单
            <span>{{this.form.inStockMonthNewCount}}</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">发票管理</div>
          <div class="middle-font">店铺的发票采购、销售发票信息</div>
          <div class="bottom-font">
            今日新增采购发票
            <span>{{this.form.purchaseInvoiceRecordCount}}个</span>
          </div>
          <div class="bottom-font">
            今日新增销售发票
            <span>{{this.form.salesInvoiceRecordCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">出库</div>
          <div class="middle-font">销售/采购退货/盘点/调拨需要从仓库出库时创建出库单作为出库凭证</div>
          <div class="bottom-font">
            今日新增出库单
            <span>{{this.form.outStockDayNewCount}}</span>
          </div>
          <div class="bottom-font">
            本月累计出库单
            <span>{{this.form.outStockMonthNewCount}}</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import cw from '@/assets/images/nav/cw.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        orderCount: 0,
        purchaseTodayCount: 0,
        purchaseMonthCount: 0,
        salesTodayCount: 0,
        salesMonthCount: 0,
        accountOutCount: 0,
        accountInCount: 0,
        supplierCount: 0,
        agentCount: 0,
        inStockDayNewCount: 0,
        inStockMonthNewCount: 0,
        outStockDayNewCount: 0,
        outStockMonthNewCount: 0,
        purchaseInvoiceRecordCount: 0,
        salesInvoiceRecordCount: 0
      },
      orderPendingDeal: 0,
      purchasePendingDeal: 0,
      salesPendingDeal: 0,
      inStockPendingDeal: 0,
      outStockPendingDeal: 0,
      cw: cw
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
        .get('/admin/store/navigation/kpi/finance.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.orderPendingDeal = data.orderPendingDeal;
          this.purchasePendingDeal = data.purchasePendingDeal;
          this.salesPendingDeal = data.salesPendingDeal;
          this.inStockPendingDeal = data.inStockPendingDeal;
          this.outStockPendingDeal = data.outStockPendingDeal;
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
.finance-mgmt-nav {
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
      left: 125px;
      width: 120px;
    }
    .title2 {
      top: 26px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 572px;
      width: 120px;
    }
    .step1 {
      top: 155px;
      left: 136px;
    }
    .step2 {
      top: 140px;
      left: 438px;
    }
    .step3 {
      top: 140px;
      left: 602px;
    }
    .step4 {
      top: 287px;
      left: 136px;
    }
    .step5 {
      top: 290px;
      left: 438px;
    }
    .step6 {
      top: 412px;
      left: 136px;
    }
    .step7 {
      top: 290px;
      left: 605px;
    }
    .step8 {
      top: 720px;
      left: 22px;
    }
    .step9 {
      top: 422px;
      left: 435px;
    }
    .step10 {
      top: 875px;
      left: 22px;
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
      .bottom-2 {
        background: #FFFDFD;
        font-size: 12px;
        line-height: 19px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        span {
          color: #ff7300;
          margin-left: 5px;
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
      .bottom-2 {
        background: #FFFDFD;
        font-size: 12px;
        line-height: 19px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        span {
          color: #ff7300;
          margin-left: 5px;
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
      .bottom-2 {
        background: #FFFDFD;
        font-size: 12px;
        line-height: 19px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        span {
          color: #ff7300;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
