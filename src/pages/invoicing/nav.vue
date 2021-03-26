<template>
  <div class="invoicing-mgmt-nav">
    <div class="image">
      <img :src="jxc" style="width:915px"/>
      <!-- <div class="title1">基础数据</div>
      <div class="title2">业务处理</div>
      <div class="title3">数据洞察</div> -->
      <div class="square1 step11" v-popover:codePop @click="link('/invoicing/base-data/supplier')" v-if="currentAuth().includes('admin:Supplier')">
        <div class="top">供应商</div>
        <div class="bottom">
          已有供应商
          <span>{{this.form.supplierCount}}个</span>
        </div>
      </div>
      <div class="square1 step11 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:Supplier')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">供应商</div>
        <div class="bottom">
          已有供应商
          <span>{{this.form.supplierCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step12"
        v-popover:codePop7
        @click="link('/invoicing/purchase-apply')"
        v-if="currentAuth().includes('admin:purchaseApplication')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseApplyPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">采购申请</div>
        <div class="bottom">
          新增采购申请
          <span>{{this.form.purchaseApplyDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step12"
        v-popover:codePop7
        @click="link('/invoicing/agency/agency-purchase-apply')"
        v-if="currentAuth().includes('admin:purchaseApplication.agent')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseApplyPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">采购申请</div>
        <div class="bottom">
          新增采购申请
          <span>{{this.form.purchaseApplyDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step12 disabled"
        v-popover:codePop7
        v-if="!currentAuth().includes('admin:purchaseApplication')&&!currentAuth().includes('admin:purchaseApplication.agent')"
       @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseApplyPendingDeal===1"></i>
        <div class="top">采购申请</div>
        <div class="bottom">
          新增采购申请
          <span>{{this.form.purchaseApplyDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step13"
        v-popover:codePop8
        @click="link('/invoicing/purchase-order-new')"
        v-if="currentAuth().includes('admin:purchaseOrder')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">采购订单</div>
        <div class="bottom">
          新增采购订单
          <span>{{this.form.purchaseOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step13"
        v-popover:codePop8
        @click="link('/invoicing/agency/agency-purchase-order')"
        v-if="currentAuth().includes('admin:purchaseOrder.agent')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">采购订单</div>
        <div class="bottom">
          新增采购订单
          <span>{{this.form.purchaseOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step13 disabled"
        v-popover:codePop8
        v-if="!currentAuth().includes('admin:purchaseOrder')&&!currentAuth().includes('admin:purchaseOrder.agent')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="purchaseOrderPendingDeal===1"></i>
        <div class="top">采购订单</div>
        <div class="bottom">
          新增采购订单
          <span>{{this.form.purchaseOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step14"
        v-popover:codePop15
        @click="link('/invoicing/statistics-analysis/purchase')"
        v-if="currentAuth().includes('admin:Statistic.purchase')"
      >
        <div class="top">采购</div>
        <div class="bottom">
          本月累计采购订单
          <span>{{this.form.purchaseOrderMonthNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step14 disabled"
        v-popover:codePop15
        v-if="!currentAuth().includes('admin:Statistic.purchase')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">采购</div>
        <div class="bottom">
          本月累计采购订单
          <span>{{this.form.purchaseOrderMonthNewCount}}单</span>
        </div>
      </div>
      <div class="square2 step21" v-popover:codePop1 @click="link('/invoicing/base-data/agent')" v-if="currentAuth().includes('admin:agent')">
        <div class="top">代理商</div>
        <div class="bottom">
          已有代理商
          <span>{{this.form.agentCount}}个</span>
        </div>
      </div>
      <div class="square2 step21 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:agent')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">代理商</div>
        <div class="bottom">
          已有代理商
          <span>{{this.form.agentCount}}个</span>
        </div>
      </div>
      <div class="square2 step22" v-popover:codePop9 @click="link('/invoicing/sale/sale-apply')" v-if="currentAuth().includes('admin:saleApplication')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleApplyPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">销售申请</div>
        <div class="bottom">
          新增销售申请
          <span>{{this.form.saleApplyDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step22 disabled"
        v-popover:codePop9
        v-if="!currentAuth().includes('admin:saleApplication')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleApplyPendingDeal===1"></i>
        <div class="top">销售申请</div>
        <div class="bottom">
          新增销售申请
          <span>{{this.form.saleApplyDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step23"
        v-popover:codePop10
        @click="link('/invoicing/sale/sale-order')"
        v-if="currentAuth().includes('admin:saleOrder')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">销售订单</div>
        <div class="bottom">
          新增销售订单
          <span>{{this.form.saleOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step23"
        v-popover:codePop10
        @click="link('/invoicing/supplier/order-supplier')"
        v-if="currentAuth().includes('admin:saleOrder.supplier')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">销售订单</div>
        <div class="bottom">
          新增销售订单
          <span>{{this.form.saleOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step23"
        v-popover:codePop10
        @click="link('/invoicing/sale-agent/agency-sale-order')"
        v-if="currentAuth().includes('admin:saleOrder.agent')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleOrderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">销售订单</div>
        <div class="bottom">
          新增销售订单
          <span>{{this.form.saleOrderDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step23 disabled"
        v-popover:codePop10
        v-if="!currentAuth().includes('admin:saleOrder')&&!currentAuth().includes('admin:saleOrder.supplier')&&!currentAuth().includes('admin:saleOrder.agent')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="saleOrderPendingDeal===1"></i>
        <div class="top">销售订单</div>
        <div class="bottom">
          新增销售订单
          <span>{{this.form.saleOrderDayNewCount}}单</span>
        </div>
      </div>
      <div class="square2 step24" v-popover:codePop16 @click="link('/invoicing/statistics-analysis/sale')" v-if="currentAuth().includes('admin:Statistic.sale')">
        <div class="top">销售</div>
        <div class="bottom">
          本月累计销售订单
          <span>{{this.form.saleOrderMonthNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step24 disabled"
        v-popover:codePop16
        v-if="!currentAuth().includes('admin:Statistic.sale')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">销售</div>
        <div class="bottom">
          本月累计销售订单
          <span>{{this.form.saleOrderMonthNewCount}}单</span>
        </div>
      </div>
      <div class="square1 step31" v-popover:codePop2 @click="link('/invoicing/base-data/store-house')" v-if="currentAuth().includes('admin:Warehouse')">
        <div class="top">仓库</div>
        <div class="bottom">
          已有仓库
          <span>{{this.form.stockCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step31 disabled"
        v-popover:codePop2
        v-if="!currentAuth().includes('admin:Warehouse')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">仓库</div>
        <div class="bottom">
          已有仓库
          <span>{{this.form.stockCount}}个</span>
        </div>
      </div>
      <div class="square1 step32" v-popover:codePop13 @click="link('/invoicing/store-house-mgmt/inventory')" v-if="currentAuth().includes('admin:check')">
        <div class="top">盘点</div>
        <div class="bottom">
          新增盘点单
          <span>{{this.form.inventoryDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square1 step32 disabled"
        v-popover:codePop13
        v-if="!currentAuth().includes('admin:check')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">盘点</div>
        <div class="bottom">
          新增盘点单
          <span>{{this.form.inventoryDayNewCount}}单</span>
        </div>
      </div>
      <div class="square step33" v-popover:codePop11 @click="link('/invoicing/store-house-mgmt/depot-in-mgmt')" v-if="currentAuth().includes('admin:inport')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="inStockPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">入库</div>
        <div class="bottom">
          新增入库单
          <span>{{this.form.inStockDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step33 disabled"
        v-popover:codePop11
        v-if="!currentAuth().includes('admin:inport')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="inStockPendingDeal===1"></i>
        <div class="top">入库</div>
        <div class="bottom">
          新增入库单
          <span>{{this.form.inStockDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step34"
        v-popover:codePop17
        @click="link('/invoicing/statistics-analysis/store')"
        v-if="currentAuth().includes('admin:Statistic.warehouse')"
      >
        <div class="top">仓库</div>
        <div class="bottom">
          本月累计入库单
          <span>{{this.form.inStockMonthNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step34 disabled"
        v-popover:codePop17
        v-if="!currentAuth().includes('admin:Statistic.warehouse')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">仓库</div>
        <div class="bottom">
          本月累计入库单
          <span>{{this.form.inStockMonthNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step41"
        v-popover:codePop3
        @click="link('/invoicing/base-data/category')"
        v-if="currentAuth().includes('admin:PurchaseSaleStorage.productCategory')"
      >
        <div class="top">商品分类</div>
        <div class="bottom">
          已有商品分类
          <span>{{this.form.prodectCategoryCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step41 disabled"
        v-popover:codePop3
        v-if="!currentAuth().includes('admin:PurchaseSaleStorage.productCategory')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">商品分类</div>
        <div class="bottom">
          已有商品分类
          <span>{{this.form.prodectCategoryCount}}个</span>
        </div>
      </div>
      <div
        class="square step45"
        v-popover:codePop5
        @click="link('/invoicing/base-data/product')"
        v-if="currentAuth().includes('admin:PurchaseSaleStorage.product')"
      >
        <div class="top">商品</div>
        <div class="bottom">
          已有商品
          <span>{{this.form.productCount}}个</span>
        </div>
      </div>
      <div
        class="square step45"
        v-popover:codePop5
        @click="link('/invoicing/supplier/product/product-supplier')"
        v-if="currentAuth().includes('admin:product.supplier')"
      >
        <div class="top">商品</div>
        <div class="bottom">
          已有商品
          <span>{{this.form.productCount}}个</span>
        </div>
      </div>
      <div
        class="square step45 disabled"
        v-popover:codePop5
        v-if="!currentAuth().includes('admin:PurchaseSaleStorage.product')&&!currentAuth().includes('admin:product.supplier')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">商品</div>
        <div class="bottom">
          已有商品
          <span>{{this.form.productCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step42"
        v-popover:codePop14
        @click="link('/invoicing/store-house-mgmt/allotted-mgmt')"
        v-if="currentAuth().includes('admin:storage.transfer')"
      >
        <div class="top">调拨</div>
        <div class="bottom">
          新增调拨单
          <span>{{this.form.allocationDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square1 step42 disabled"
        v-popover:codePop14
        v-if="!currentAuth().includes('admin:storage.transfer')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">调拨</div>
        <div class="bottom">
          新增调拨单
          <span>{{this.form.allocationDayNewCount}}单</span>
        </div>
      </div>
      <div class="square step43" v-popover:codePop12 @click="link('/invoicing/store-house-mgmt/depot-out-mgmt')" v-if="currentAuth().includes('admin:export')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="outStockPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">出库</div>
        <div class="bottom">
          新增出库单
          <span>{{this.form.outStockDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square step43 disabled"
        v-popover:codePop12
        v-if="!currentAuth().includes('admin:export')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="outStockPendingDeal===1"></i>
        <div class="top">出库</div>
        <div class="bottom">
          新增出库单
          <span>{{this.form.outStockDayNewCount}}单</span>
        </div>
      </div>
      <div
        class="square2 step44"
        v-popover:codePop18
        @click="link('/invoicing/statistics-analysis/single')"
        v-if="currentAuth().includes('admin:Statistic.product')"
      >
        <div class="top">单品</div>
        <div class="bottom">
          已生成单品分析
          <span>{{this.form.itemAnalysis}}个</span>
        </div>
      </div>
      <div
        class="square2 step44 disabled"
        v-popover:codePop18
        v-if="!currentAuth().includes('admin:Statistic.product')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单品</div>
        <div class="bottom">
          已生成单品分析
          <span>{{this.form.itemAnalysis}}个</span>
        </div>
      </div>
      <div
        class="square2 step71"
        v-popover:codePop19
        @click="link('/invoicing/statistics-analysis/finance')"
        v-if="currentAuth().includes('admin:Statistic.finance')"
      >
        <div class="top">财务</div>
        <div class="bottom">
          本月收款
          <span>{{this.form.accountIn}}元</span>
        </div>
      </div>
      <div
        class="square2 step71 disabled"
        v-popover:codePop19
        v-if="!currentAuth().includes('admin:Statistic.finance')"
        @click="$message.warning('您无操作权限，请管理员增加权限')"
      >
        <div class="top">财务</div>
        <div class="bottom">
          本月收款
          <span>{{this.form.accountIn}}元</span>
        </div>
      </div>
      <div
        class="square2 step81"
        v-popover:codePop20
        @click="link('/invoicing/statistics-analysis/report')"
        v-if="currentAuth().includes('admin:Statistic.mouthreport')"
      >
        <div class="top">进销存月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div
        class="square2 step81 disabled"
        v-popover:codePop20
        v-if="!currentAuth().includes('admin:Statistic.mouthreport')"
        @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">进销存月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div
        class="square2 step51"
        v-popover:codePop4
        @click="link('/invoicing/base-data/brand')"
        v-if="currentAuth().includes('admin:PurchaseSaleStorage.brand')"
      >
        <div class="top">商品品牌</div>
        <div class="bottom">
          已有商品品牌
          <span>{{this.form.brandCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step51 disabled"
        v-popover:codePop4
        v-if="!currentAuth().includes('admin:PurchaseSaleStorage.brand')"
      @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">商品品牌</div>
        <div class="bottom">
          已有商品品牌
          <span>{{this.form.brandCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step61"
        v-popover:codePop6
        @click="link('/invoicing/process-setting/purchase-setting')"
        v-if="currentAuth().includes('admin:setting.processSettings')"
      >
        <div class="top">采购流程配置</div>
        <div class="bottom">
          已有流程
          <span>{{this.form.purchaseProcessCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step61 disabled"
        v-popover:codePop6
        v-if="!currentAuth().includes('admin:setting.processSettings')"
        @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">采购流程配置</div>
        <div class="bottom">
          已有流程
          <span>{{this.form.purchaseProcessCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step01"
        v-popover:codePop01
        @click="link('/invoicing/process-setting/sale-setting')"
        v-if="currentAuth().includes('admin:setting.processSettings')"
      >
        <div class="top">销售流程配置</div>
        <div class="bottom">
          已有流程
          <span>{{this.form.saleProcessCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step01 disabled"
        v-popover:codePop01
        v-if="!currentAuth().includes('admin:setting.processSettings')"
        @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">销售流程配置</div>
        <div class="bottom">
          已有流程
          <span>{{this.form.saleProcessCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">供应商</div>
          <div class="middle-font">设置店铺的供应商信息以及供应商管理员账号</div>
          <div class="bottom-font">
            已有供应商
            <span>{{this.form.supplierCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">代理商</div>
          <div class="middle-font">设置店铺的代理商信息，代理商代理商品范围及价格，代理商管理员账号</div>
          <div class="bottom-font">
            已有代理商
            <span>{{this.form.agentCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">仓库</div>
          <div class="middle-font">设置店铺的仓库信息</div>
          <div class="bottom-font">
            已有仓库
            <span>{{this.form.stockCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">商品分类</div>
          <div class="middle-font">设置店铺的商品分类、规格、属性信息</div>
          <div class="bottom-font">
            已有商品分类
            <span>{{this.form.prodectCategoryCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">商品品牌</div>
          <div class="middle-font">设置店铺商品的品牌信息</div>
          <div class="bottom-font">
            已有品牌
            <span>{{this.form.brandCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">商品</div>
          <div class="middle-font">设置店铺商品信息</div>
          <div class="bottom-font">
            已有商品
            <span>{{this.form.productCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">采购流程配置</div>
          <div class="middle-font">设置进销存的采购流程</div>
          <div class="bottom-font">
            已有流程
            <span>{{this.form.purchaseProcessCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop01">
        <div class="pop-div">
          <div class="top-font">销售流程配置</div>
          <div class="middle-font">设置进销存的销售流程</div>
          <div class="bottom-font">
            已有流程
            <span>{{this.form.saleProcessCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">采购申请</div>
          <div class="middle-font">当发现库存不足需要补货时可提交采购申请单，申请单审核通过后形成采购订单</div>
          <div class="bottom-font">
            今日新增采购申请
            <span>{{this.form.purchaseApplyDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计采购申请
            <span>{{this.form.purchaseApplyMonthCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">采购订单</div>
          <div class="middle-font">当发现库存不足需要补货时可直接创建采购订单</div>
          <div class="bottom-font">
            今日新增采购订单
            <span>{{this.form.purchaseOrderDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计采购订单
            <span>{{this.form.purchaseOrderMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">销售申请</div>
          <div class="middle-font">您可以审批代理商创建的销售申请，申请通过后形成销售订单</div>
          <div class="bottom-font">
            今日新增销售申请
            <span>{{this.form.saleApplyDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计销售申请
            <span>{{this.form.saleApplyMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">销售订单</div>
          <div class="middle-font">您可在管理代理商下的销售订单，进行审核、发货、开票等操作</div>
          <div class="bottom-font">
            今日新增销售订单
            <span>{{this.form.saleOrderDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计销售订单
            <span>{{this.form.saleOrderMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">入库</div>
          <div class="middle-font">采购/销售/盘点/调拨需要从仓库入库时创建入库单作为入库凭证</div>
          <div class="bottom-font">
            今日新增入库单
            <span>{{this.form.inStockDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计入库单
            <span>{{this.form.inStockMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop12">
        <div class="pop-div">
          <div class="top-font">出库</div>
          <div class="middle-font">销售/采购退货/盘点/调拨需要从仓库出库时创建出库单作为出库凭证</div>
          <div class="bottom-font">
            今日新增出库单
            <span>{{this.form.outStockDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计出库单
            <span>{{this.form.outStockMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop13">
        <div class="pop-div">
          <div class="top-font">盘点</div>
          <div class="middle-font">定期盘点仓库的库存数量，保证系统记录的数据准确性</div>
          <div class="bottom-font">
            今日新增盘点单
            <span>{{this.form.inventoryDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计盘点单
            <span>{{this.form.inventoryMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop14">
        <div class="pop-div">
          <div class="top-font">调拨</div>
          <div class="middle-font">当仓库缺货时，可从其他仓库进行商品调拨调整</div>
          <div class="bottom-font">
            今日新增调拨单
            <span>{{this.form.allocationDayNewCount}}单</span>
          </div>
          <div class="bottom-font">
            本月累计调拨单
            <span>{{this.form.allocationMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop15">
        <div class="pop-div">
          <div class="top-font">采购</div>
          <div class="middle-font">对店铺的采购情况进行分析，了解订单/商品/供应商的具体采购情况</div>
          <div class="bottom-font">
            本月累计采购订单
            <span>{{this.form.purchaseOrderMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop16">
        <div class="pop-div">
          <div class="top-font">销售</div>
          <div class="middle-font">对店铺的销售情况进行分析，了解订单/商品/代理商的具体销售情况</div>
          <div class="bottom-font">
            本月累计销售订单
            <span>{{this.form.saleOrderMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop17">
        <div class="pop-div">
          <div class="top-font">仓库</div>
          <div class="middle-font">对店铺的库存情况进行分析，了解库存/出库/入库/盘点/调拨的情况</div>
          <div class="bottom-font">
            本月累计入库单
            <span>{{this.form.inStockMonthNewCount}}单</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop18">
        <div class="pop-div">
          <div class="top-font">单品</div>
          <div class="middle-font">对店铺的商品采购/销售/库存的分析</div>
          <div class="bottom-font">
            已生成单品分析
            <span>{{this.form.itemAnalysis}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop19">
        <div class="pop-div">
          <div class="top-font">财务</div>
          <div class="middle-font">对店铺的财务分析</div>
          <div class="bottom-font">
            本月收款
            <span>{{this.form.accountIn}}元</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop20">
        <div class="pop-div">
          <div class="top-font">进销存月报</div>
          <div class="middle-font">按月分析进销存数据，并给出相应建议</div>
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
import jxc from '@/assets/images/nav/jxc.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        supplierCount: 0,
        agentCount: 0,
        stockCount: 0,
        saleProcessCount: 0,
        purchaseProcessCount: 0,
        prodectCategoryCount: 0,
        brandCount: 0,
        productCount: 0,
        processCount: 0,
        purchaseApplyDayNewCount: 0,
        purchaseApplyMonthCount: 0,
        purchaseOrderDayNewCount: 0,
        purchaseOrderMonthNewCount: 0,
        saleApplyDayNewCount: 0,
        saleApplyMonthNewCount: 0,
        saleOrderDayNewCount: 0,
        saleOrderMonthNewCount: 0,
        inStockDayNewCount: 0,
        inStockMonthNewCount: 0,
        outStockDayNewCount: 0,
        outStockMonthNewCount: 0,
        inventoryDayNewCount: 0,
        inventoryMonthNewCount: 0,
        allocationDayNewCount: 0,
        allocationMonthNewCount: 0
      },
      purchaseApplyPendingDeal: 0,
      purchaseOrderPendingDeal: 0,
      saleApplyPendingDeal: 0,
      saleOrderPendingDeal: 0,
      inStockPendingDeal: 0,
      outStockPendingDeal: 0,
      purchaseOrderMonthNewCount: 0,
      saleOrderMonthNewCount: 0,
      accountIn: 0,
      itemAnalysis: 0,
      jxc: jxc
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
    getNavSupplierInfo() {
      http
        .get('/admin/store/navigation/kpi/purchase.jhtml', { type: '1' })
        .then(data => {
          Object.assign(this.form, data);
          this.purchaseApplyPendingDeal = data.purchaseApplyPendingDeal;
          this.purchaseOrderPendingDeal = data.purchaseOrderPendingDeal;
          this.saleApplyPendingDeal = data.saleApplyPendingDeal;
          this.saleOrderPendingDeal = data.saleOrderPendingDeal;
          this.inStockPendingDeal = data.inStockPendingDeal;
          this.outStockPendingDeal = data.outStockPendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getNavSalesInfo() {
      http
        .get('/admin/store/navigation/kpi/purchase.jhtml', { type: '2' })
        .then(data => {
          Object.assign(this.form, data);
          this.purchaseApplyPendingDeal = data.purchaseApplyPendingDeal;
          this.purchaseOrderPendingDeal = data.purchaseOrderPendingDeal;
          this.saleApplyPendingDeal = data.saleApplyPendingDeal;
          this.saleOrderPendingDeal = data.saleOrderPendingDeal;
          this.inStockPendingDeal = data.inStockPendingDeal;
          this.outStockPendingDeal = data.outStockPendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getNavAgencyInfo() {
      http
        .get('/admin/store/navigation/kpi/purchase.jhtml', { type: '3' })
        .then(data => {
          Object.assign(this.form, data);
          this.purchaseApplyPendingDeal = data.purchaseApplyPendingDeal;
          this.purchaseOrderPendingDeal = data.purchaseOrderPendingDeal;
          this.saleApplyPendingDeal = data.saleApplyPendingDeal;
          this.saleOrderPendingDeal = data.saleOrderPendingDeal;
          this.inStockPendingDeal = data.inStockPendingDeal;
          this.outStockPendingDeal = data.outStockPendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    if (this.currentAuth().includes('admin:purchase')) {
      this.getNavSalesInfo();
    } else if (this.currentAuth().includes('admin:purchase.agent')) {
      this.getNavAgencyInfo();
    } else if (this.currentAuth().includes('admin:purchaseSaleStorage.sale.supplier')) {
      this.getNavSupplierInfo();
    }
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
.invoicing-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 105px;
      width: 120px;
    }
    .title2 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 552px;
      width: 120px;
    }
    .title3 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1020px;
      width: 90px;
    }
    .step11 {
      top: 115px;
      left: 155px;
    }
    .step12 {
      top: 115px;
      left: 320px;
    }
    .step13 {
      top: 115px;
      left: 475px;
    }
    .step14 {
      top: 55px;
      left: 754px;
    }
    .step21 {
      top: 243px;
      left: 155px;
    }
    .step22 {
      top: 247px;
      left: 320px;
    }
    .step23 {
      top: 247px;
      left: 475px;
    }
    .step24 {
      top: 160px;
      left: 754px;
    }
    .step31 {
      top: 605px;
      left: 3px;
    }
    .step32 {
      top: 563px;
      left: 332px;
    }
    .step33 {
      top: 563px;
      left: 478px;
    }
    .step34 {
      top: 610px;
      left: 754px;
    }
    .step35 {
      top: 439px;
      left: 990px;
    }
    .step41 {
      top: 373px;
      left: 3px;
    }
    .step42 {
      top: 670px;
      left: 332px;
    }
    .step43 {
      top: 670px;
      left: 478px;
    }
    .step44 {
      top: 480px;
      left: 754px;
    }
    .step45 {
      top: 435px;
      left: 165px;
    }
    .step51 {
      top: 492px;
      left: 3px;
    }
    .step61 {
      top: 115px;
      left: 3px;
    }
    .step01 {
      top: 245px;
      left: 3px;
    }
    .step71 {
      top: 267px;
      left: 754px;
    }
    .step81 {
      top: 374px;
      left: 754px;
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
