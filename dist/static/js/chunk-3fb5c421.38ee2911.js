(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3fb5c421"],{"50f0":function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"invoicing-mgmt-nav"},[e("div",{staticClass:"image"},[e("img",{attrs:{src:t.jxc}}),e("div",{staticClass:"title1"},[t._v("基础数据")]),e("div",{staticClass:"title2"},[t._v("业务处理")]),e("div",{staticClass:"title3"},[t._v("数据洞察")]),t.currentAuth().includes("admin:Supplier")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop",arg:"codePop"}],staticClass:"square step11",on:{click:function(s){return t.link("/invoicing/base-data/supplier")}}},[e("div",{staticClass:"top"},[t._v("供应商")]),e("div",{staticClass:"bottom"},[t._v(" 已有供应商 "),e("span",[t._v(t._s(this.form.supplierCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:Supplier")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop",arg:"codePop"}],staticClass:"square step11 disabled"},[e("div",{staticClass:"top"},[t._v("供应商")]),e("div",{staticClass:"bottom"},[t._v(" 已有供应商 "),e("span",[t._v(t._s(this.form.supplierCount)+"个")])])]),t.currentAuth().includes("admin:purchaseApplication")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop7",arg:"codePop7"}],staticClass:"square step12",on:{click:function(s){return t.link("/invoicing/purchase-apply")}}},[1===t.purchaseApplyPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购申请")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购申请 "),e("span",[t._v(t._s(this.form.purchaseApplyDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:purchaseApplication.agent")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop7",arg:"codePop7"}],staticClass:"square step12",on:{click:function(s){return t.link("/invoicing/agency/agency-purchase-apply")}}},[1===t.purchaseApplyPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购申请")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购申请 "),e("span",[t._v(t._s(this.form.purchaseApplyDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:purchaseApplication")||t.currentAuth().includes("admin:purchaseApplication.agent")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop7",arg:"codePop7"}],staticClass:"square step12 disabled"},[1===t.purchaseApplyPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购申请")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购申请 "),e("span",[t._v(t._s(this.form.purchaseApplyDayNewCount)+"单")])])]),t.currentAuth().includes("admin:purchaseOrder")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop8",arg:"codePop8"}],staticClass:"square step13",on:{click:function(s){return t.link("/invoicing/purchase-order-new")}}},[1===t.purchaseOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购订单 "),e("span",[t._v(t._s(this.form.purchaseOrderDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:purchaseOrder.agent")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop8",arg:"codePop8"}],staticClass:"square step13",on:{click:function(s){return t.link("/invoicing/agency/agency-purchase-order")}}},[1===t.purchaseOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购订单 "),e("span",[t._v(t._s(this.form.purchaseOrderDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:purchaseOrder")||t.currentAuth().includes("admin:purchaseOrder.agent")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop8",arg:"codePop8"}],staticClass:"square step13 disabled"},[1===t.purchaseOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("采购订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增采购订单 "),e("span",[t._v(t._s(this.form.purchaseOrderDayNewCount)+"单")])])]),t.currentAuth().includes("admin:Statistic.purchase")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop15",arg:"codePop15"}],staticClass:"square step14",on:{click:function(s){return t.link("/invoicing/statistics-analysis/purchase")}}},[e("div",{staticClass:"top"},[t._v("采购")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.purchase")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop15",arg:"codePop15"}],staticClass:"square step14 disabled"},[e("div",{staticClass:"top"},[t._v("采购")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:agent")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop1",arg:"codePop1"}],staticClass:"square step21",on:{click:function(s){return t.link("/invoicing/base-data/agent")}}},[e("div",{staticClass:"top"},[t._v("代理商")]),e("div",{staticClass:"bottom"},[t._v(" 已有代理商 "),e("span",[t._v(t._s(this.form.agentCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:agent")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop1",arg:"codePop1"}],staticClass:"square step21 disabled"},[e("div",{staticClass:"top"},[t._v("代理商")]),e("div",{staticClass:"bottom"},[t._v(" 已有代理商 "),e("span",[t._v(t._s(this.form.agentCount)+"个")])])]),t.currentAuth().includes("admin:saleApplication")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop9",arg:"codePop9"}],staticClass:"square step22",on:{click:function(s){return t.link("/invoicing/sale/sale-apply")}}},[1===t.saleApplyPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售申请")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售申请 "),e("span",[t._v(t._s(this.form.saleApplyDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:saleApplication")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop9",arg:"codePop9"}],staticClass:"square step22 disabled"},[1===t.saleApplyPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售申请")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售申请 "),e("span",[t._v(t._s(this.form.saleApplyDayNewCount)+"单")])])]),t.currentAuth().includes("admin:saleOrder")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step23",on:{click:function(s){return t.link("/invoicing/sale/sale-order")}}},[1===t.saleOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售订单 "),e("span",[t._v(t._s(this.form.saleOrderDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:saleOrder.supplier")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step23",on:{click:function(s){return t.link("/invoicing/supplier/order-supplier")}}},[1===t.saleOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售订单 "),e("span",[t._v(t._s(this.form.saleOrderDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:saleOrder.agent")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step23",on:{click:function(s){return t.link("/invoicing/sale-agent/agency-sale-order")}}},[1===t.saleOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售订单 "),e("span",[t._v(t._s(this.form.saleOrderDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:saleOrder")||t.currentAuth().includes("admin:saleOrder.supplier")||t.currentAuth().includes("admin:saleOrder.agent")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step23 disabled"},[1===t.saleOrderPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("销售订单")]),e("div",{staticClass:"bottom"},[t._v(" 新增销售订单 "),e("span",[t._v(t._s(this.form.saleOrderDayNewCount)+"单")])])]),t.currentAuth().includes("admin:Statistic.sale")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop16",arg:"codePop16"}],staticClass:"square step24",on:{click:function(s){return t.link("/invoicing/statistics-analysis/sale")}}},[e("div",{staticClass:"top"},[t._v("销售")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.sale")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop16",arg:"codePop16"}],staticClass:"square step24 disabled"},[e("div",{staticClass:"top"},[t._v("销售")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:Warehouse")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop2",arg:"codePop2"}],staticClass:"square step31",on:{click:function(s){return t.link("/invoicing/base-data/store-house")}}},[e("div",{staticClass:"top"},[t._v("仓库")]),e("div",{staticClass:"bottom"},[t._v(" 已有仓库 "),e("span",[t._v(t._s(this.form.stockCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:Warehouse")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop2",arg:"codePop2"}],staticClass:"square step31 disabled"},[e("div",{staticClass:"top"},[t._v("仓库")]),e("div",{staticClass:"bottom"},[t._v(" 已有仓库 "),e("span",[t._v(t._s(this.form.stockCount)+"个")])])]),t.currentAuth().includes("admin:check")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop13",arg:"codePop13"}],staticClass:"square step32",on:{click:function(s){return t.link("/invoicing/store-house-mgmt/inventory")}}},[e("div",{staticClass:"top"},[t._v("盘点")]),e("div",{staticClass:"bottom"},[t._v(" 新增盘点单 "),e("span",[t._v(t._s(this.form.inventoryDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:check")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop13",arg:"codePop13"}],staticClass:"square step32 disabled"},[e("div",{staticClass:"top"},[t._v("盘点")]),e("div",{staticClass:"bottom"},[t._v(" 新增盘点单 "),e("span",[t._v(t._s(this.form.inventoryDayNewCount)+"单")])])]),t.currentAuth().includes("admin:inport")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop11",arg:"codePop11"}],staticClass:"square step33",on:{click:function(s){return t.link("/invoicing/store-house-mgmt/depot-in-mgmt")}}},[1===t.inStockPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("入库")]),e("div",{staticClass:"bottom"},[t._v(" 新增入库单 "),e("span",[t._v(t._s(this.form.inStockDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:inport")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop11",arg:"codePop11"}],staticClass:"square step33 disabled"},[1===t.inStockPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("入库")]),e("div",{staticClass:"bottom"},[t._v(" 新增入库单 "),e("span",[t._v(t._s(this.form.inStockDayNewCount)+"单")])])]),t.currentAuth().includes("admin:Statistic.warehouse")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop17",arg:"codePop17"}],staticClass:"square step34",on:{click:function(s){return t.link("/invoicing/statistics-analysis/store")}}},[e("div",{staticClass:"top"},[t._v("仓库")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.warehouse")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop17",arg:"codePop17"}],staticClass:"square step34 disabled"},[e("div",{staticClass:"top"},[t._v("仓库")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:PurchaseSaleStorage.productCategory")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop3",arg:"codePop3"}],staticClass:"square step41",on:{click:function(s){return t.link("/invoicing/base-data/category")}}},[e("div",{staticClass:"top"},[t._v("商品分类")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品分类 "),e("span",[t._v(t._s(this.form.prodectCategoryCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:PurchaseSaleStorage.productCategory")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop3",arg:"codePop3"}],staticClass:"square step41 disabled"},[e("div",{staticClass:"top"},[t._v("商品分类")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品分类 "),e("span",[t._v(t._s(this.form.prodectCategoryCount)+"个")])])]),t.currentAuth().includes("admin:PurchaseSaleStorage.product")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop5",arg:"codePop5"}],staticClass:"square step45",on:{click:function(s){return t.link("/invoicing/base-data/product")}}},[e("div",{staticClass:"top"},[t._v("商品")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品 "),e("span",[t._v(t._s(this.form.productCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:product.supplier")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop5",arg:"codePop5"}],staticClass:"square step45",on:{click:function(s){return t.link("/invoicing/supplier/product/product-supplier")}}},[e("div",{staticClass:"top"},[t._v("商品")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品 "),e("span",[t._v(t._s(this.form.productCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:PurchaseSaleStorage.product")||t.currentAuth().includes("admin:product.supplier")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop5",arg:"codePop5"}],staticClass:"square step45 disabled"},[e("div",{staticClass:"top"},[t._v("商品")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品 "),e("span",[t._v(t._s(this.form.productCount)+"个")])])]),t.currentAuth().includes("admin:storage.transfer")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop14",arg:"codePop14"}],staticClass:"square step42",on:{click:function(s){return t.link("/invoicing/store-house-mgmt/allotted-mgmt")}}},[e("div",{staticClass:"top"},[t._v("调拨")]),e("div",{staticClass:"bottom"},[t._v(" 新增调拨单 "),e("span",[t._v(t._s(this.form.allocationDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:storage.transfer")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop14",arg:"codePop14"}],staticClass:"square step42 disabled"},[e("div",{staticClass:"top"},[t._v("调拨")]),e("div",{staticClass:"bottom"},[t._v(" 新增调拨单 "),e("span",[t._v(t._s(this.form.allocationDayNewCount)+"单")])])]),t.currentAuth().includes("admin:export")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop12",arg:"codePop12"}],staticClass:"square step43",on:{click:function(s){return t.link("/invoicing/store-house-mgmt/depot-out-mgmt")}}},[1===t.outStockPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("出库")]),e("div",{staticClass:"bottom"},[t._v(" 新增出库单 "),e("span",[t._v(t._s(this.form.outStockDayNewCount)+"单")])])]):t._e(),t.currentAuth().includes("admin:export")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop12",arg:"codePop12"}],staticClass:"square step43 disabled"},[1===t.outStockPendingDeal?e("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),e("div",{staticClass:"top"},[t._v("出库")]),e("div",{staticClass:"bottom"},[t._v(" 新增出库单 "),e("span",[t._v(t._s(this.form.outStockDayNewCount)+"单")])])]),t.currentAuth().includes("admin:Statistic.product")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop18",arg:"codePop18"}],staticClass:"square step44",on:{click:function(s){return t.link("/invoicing/statistics-analysis/single")}}},[e("div",{staticClass:"top"},[t._v("单品")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.product")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop18",arg:"codePop18"}],staticClass:"square step44 disabled"},[e("div",{staticClass:"top"},[t._v("单品")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:Statistic.finance")?e("div",{staticClass:"square step71",on:{click:function(s){return t.link("/invoicing/statistics-analysis/finance")}}},[e("div",{staticClass:"top"},[t._v("财务")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.finance")?t._e():e("div",{staticClass:"square step71 disabled"},[e("div",{staticClass:"top"},[t._v("财务")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:Statistic.mouthreport")?e("div",{staticClass:"square step81",on:{click:function(s){return t.link("/invoicing/statistics-analysis/report")}}},[e("div",{staticClass:"top"},[t._v("进销存月报")]),e("div",{staticClass:"bottom"})]):t._e(),t.currentAuth().includes("admin:Statistic.mouthreport")?t._e():e("div",{staticClass:"square step81 disabled"},[e("div",{staticClass:"top"},[t._v("进销存月报")]),e("div",{staticClass:"bottom"})]),t.currentAuth().includes("admin:PurchaseSaleStorage.brand")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop4",arg:"codePop4"}],staticClass:"square step51",on:{click:function(s){return t.link("/invoicing/base-data/brand")}}},[e("div",{staticClass:"top"},[t._v("商品品牌")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品品牌 "),e("span",[t._v(t._s(this.form.brandCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:PurchaseSaleStorage.brand")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop4",arg:"codePop4"}],staticClass:"square step51 disabled"},[e("div",{staticClass:"top"},[t._v("商品品牌")]),e("div",{staticClass:"bottom"},[t._v(" 已有商品品牌 "),e("span",[t._v(t._s(this.form.brandCount)+"个")])])]),t.currentAuth().includes("admin:setting.processSettings")?e("div",{directives:[{name:"popover",rawName:"v-popover:codePop6",arg:"codePop6"}],staticClass:"square step61",on:{click:function(s){return t.link("/invoicing/process-setting/sale-setting")}}},[e("div",{staticClass:"top"},[t._v("流程配置")]),e("div",{staticClass:"bottom"},[t._v(" 已有流程 "),e("span",[t._v(t._s(this.form.processCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:setting.processSettings")?t._e():e("div",{directives:[{name:"popover",rawName:"v-popover:codePop6",arg:"codePop6"}],staticClass:"square step61 disabled"},[e("div",{staticClass:"top"},[t._v("流程配置")]),e("div",{staticClass:"bottom"},[t._v(" 已有流程 "),e("span",[t._v(t._s(this.form.processCount)+"个")])])]),e("el-popover",{ref:"codePop",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("供应商")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺的供应商信息以及供应商管理员账号")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有供应商 "),e("span",[t._v(t._s(this.form.supplierCount)+"个")])])])]),e("el-popover",{ref:"codePop1",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("代理商")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺的代理商信息，代理商代理商品范围及价格，代理商管理员账号")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有代理商 "),e("span",[t._v(t._s(this.form.agentCount)+"个")])])])]),e("el-popover",{ref:"codePop2",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("仓库")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺的仓库信息")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有仓库 "),e("span",[t._v(t._s(this.form.stockCount)+"个")])])])]),e("el-popover",{ref:"codePop3",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("商品分类")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺的商品分类、规格、属性信息")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有商品分类 "),e("span",[t._v(t._s(this.form.prodectCategoryCount)+"个")])])])]),e("el-popover",{ref:"codePop4",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("商品品牌")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺商品的品牌信息")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有品牌 "),e("span",[t._v(t._s(this.form.brandCount)+"个")])])])]),e("el-popover",{ref:"codePop5",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("商品")]),e("div",{staticClass:"middle-font"},[t._v("设置店铺商品信息")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有商品 "),e("span",[t._v(t._s(this.form.productCount)+"个")])])])]),e("el-popover",{ref:"codePop6",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("流程设置")]),e("div",{staticClass:"middle-font"},[t._v("设置进销存的销售、采购、发货流程")]),e("div",{staticClass:"bottom-font"},[t._v(" 已有流程 "),e("span",[t._v(t._s(this.form.processCount)+"个")])])])]),e("el-popover",{ref:"codePop7",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("采购申请")]),e("div",{staticClass:"middle-font"},[t._v("当发现库存不足需要补货时可提交采购申请单，申请单审核通过后形成采购订单")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增采购申请 "),e("span",[t._v(t._s(this.form.purchaseApplyDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计采购申请 "),e("span",[t._v(t._s(this.form.purchaseApplyMonthCount)+"单")])])])]),e("el-popover",{ref:"codePop8",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("采购订单")]),e("div",{staticClass:"middle-font"},[t._v("当发现库存不足需要补货时可直接创建采购订单")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增采购订单 "),e("span",[t._v(t._s(this.form.purchaseOrderDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计采购订单 "),e("span",[t._v(t._s(this.form.purchaseOrderMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop9",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("销售申请")]),e("div",{staticClass:"middle-font"},[t._v("您可以审批代理商创建的销售申请，申请通过后形成销售订单")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增销售申请 "),e("span",[t._v(t._s(this.form.saleApplyDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计销售申请 "),e("span",[t._v(t._s(this.form.saleApplyMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop10",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("销售订单")]),e("div",{staticClass:"middle-font"},[t._v("您可在管理代理商下的销售订单，进行审核、发货、开票等操作")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增销售订单 "),e("span",[t._v(t._s(this.form.saleOrderDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计销售订单 "),e("span",[t._v(t._s(this.form.saleOrderMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop11",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("入库")]),e("div",{staticClass:"middle-font"},[t._v("采购/销售/盘点/调拨需要从仓库入库时创建入库单作为入库凭证")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增入库单 "),e("span",[t._v(t._s(this.form.inStockDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计入库单 "),e("span",[t._v(t._s(this.form.inStockMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop12",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("出库")]),e("div",{staticClass:"middle-font"},[t._v("销售/采购退货/盘点/调拨需要从仓库出库时创建出库单作为出库凭证")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增出库单 "),e("span",[t._v(t._s(this.form.outStockDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计出库单 "),e("span",[t._v(t._s(this.form.outStockMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop13",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("盘点")]),e("div",{staticClass:"middle-font"},[t._v("定期盘点仓库的库存数量，保证系统记录的数据准确性")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增盘点单 "),e("span",[t._v(t._s(this.form.inventoryDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计盘点单 "),e("span",[t._v(t._s(this.form.inventoryMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop14",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("调拨")]),e("div",{staticClass:"middle-font"},[t._v("当仓库缺货时，可从其他仓库进行商品调拨调整")]),e("div",{staticClass:"bottom-font"},[t._v(" 今日新增调拨单 "),e("span",[t._v(t._s(this.form.allocationDayNewCount)+"单")])]),e("div",{staticClass:"bottom-font"},[t._v(" 本月累计调拨单 "),e("span",[t._v(t._s(this.form.allocationMonthNewCount)+"单")])])])]),e("el-popover",{ref:"codePop15",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("采购")]),e("div",{staticClass:"middle-font"},[t._v("对店铺的采购情况进行分析，了解订单/商品/供应商的具体采购情况")])])]),e("el-popover",{ref:"codePop16",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("销售")]),e("div",{staticClass:"middle-font"},[t._v("对店铺的销售情况进行分析，了解订单/商品/代理商的具体销售情况")])])]),e("el-popover",{ref:"codePop17",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("仓库")]),e("div",{staticClass:"middle-font"},[t._v("对店铺的库存情况进行分析，了解库存/出库/入库/盘点/调拨的情况")])])]),e("el-popover",{ref:"codePop18",attrs:{placement:"bottom-start",trigger:"hover"}},[e("div",{staticClass:"pop-div"},[e("div",{staticClass:"top-font"},[t._v("单品")]),e("div",{staticClass:"middle-font"},[t._v("对店铺的商品采购/销售/库存的分析")])])])],1)])},o=[],i=(e("caad"),e("ac1f"),e("2532"),e("1276"),e("5530")),n=e("6b25"),r=e.n(n),c=e("2f62"),p=e("fedf"),d=e("1ab1"),v={name:"CustomerServiceNav",data:function(){return{form:{supplierCount:0,agentCount:0,stockCount:0,prodectCategoryCount:0,brandCount:0,productCount:0,processCount:0,purchaseApplyDayNewCount:0,purchaseApplyMonthCount:0,purchaseOrderDayNewCount:0,purchaseOrderMonthNewCount:0,saleApplyDayNewCount:0,saleApplyMonthNewCount:0,saleOrderDayNewCount:0,saleOrderMonthNewCount:0,inStockDayNewCount:0,inStockMonthNewCount:0,outStockDayNewCount:0,outStockMonthNewCount:0,inventoryDayNewCount:0,inventoryMonthNewCount:0,allocationDayNewCount:0,allocationMonthNewCount:0},purchaseApplyPendingDeal:0,purchaseOrderPendingDeal:0,saleApplyPendingDeal:0,saleOrderPendingDeal:0,inStockPendingDeal:0,outStockPendingDeal:0,jxc:r.a}},computed:{},components:{},methods:Object(i["a"])(Object(i["a"])(Object(i["a"])(Object(i["a"])({},Object(c["c"])(["getUser"])),Object(c["d"])("Menu",["updateRoutes"])),Object(c["c"])("Authority",["currentAuth"])),{},{link:function(t){this.updateRoutes({routes:p["a"]["".concat(t.split("/")[1])]}),this.$router.push(t)},getNavSupplierInfo:function(){var t=this;d["a"].get("/admin/store/navigation/kpi/purchase.jhtml",{type:"1"}).then((function(s){Object.assign(t.form,s),t.purchaseApplyPendingDeal=s.purchaseApplyPendingDeal,t.purchaseOrderPendingDeal=s.purchaseOrderPendingDeal,t.saleApplyPendingDeal=s.saleApplyPendingDeal,t.saleOrderPendingDeal=s.saleOrderPendingDeal,t.inStockPendingDeal=s.inStockPendingDeal,t.outStockPendingDeal=s.outStockPendingDeal})).catch((function(s){t.$message.warning(s.errorMessage)}))},getNavSalesInfo:function(){var t=this;d["a"].get("/admin/store/navigation/kpi/purchase.jhtml",{type:"2"}).then((function(s){Object.assign(t.form,s),t.purchaseApplyPendingDeal=s.purchaseApplyPendingDeal,t.purchaseOrderPendingDeal=s.purchaseOrderPendingDeal,t.saleApplyPendingDeal=s.saleApplyPendingDeal,t.saleOrderPendingDeal=s.saleOrderPendingDeal,t.inStockPendingDeal=s.inStockPendingDeal,t.outStockPendingDeal=s.outStockPendingDeal})).catch((function(s){t.$message.warning(s.errorMessage)}))},getNavAgencyInfo:function(){var t=this;d["a"].get("/admin/store/navigation/kpi/purchase.jhtml",{type:"3"}).then((function(s){Object.assign(t.form,s),t.purchaseApplyPendingDeal=s.purchaseApplyPendingDeal,t.purchaseOrderPendingDeal=s.purchaseOrderPendingDeal,t.saleApplyPendingDeal=s.saleApplyPendingDeal,t.saleOrderPendingDeal=s.saleOrderPendingDeal,t.inStockPendingDeal=s.inStockPendingDeal,t.outStockPendingDeal=s.outStockPendingDeal})).catch((function(s){t.$message.warning(s.errorMessage)}))}}),mounted:function(){this.currentAuth().includes("admin:purchase")?this.getNavSalesInfo():this.currentAuth().includes("admin:purchase.agent")?this.getNavAgencyInfo():this.currentAuth().includes("admin:purchaseSaleStorage.sale.supplier")&&this.getNavSupplierInfo()}},l=v,u=(e("90c9"),e("2877")),m=Object(u["a"])(l,a,o,!1,null,null,null);s["default"]=m.exports},"6b25":function(t,s,e){t.exports=e.p+"static/img/jxc.c8e6a578.png"},"90c9":function(t,s,e){"use strict";var a=e("a09f"),o=e.n(a);o.a},a09f:function(t,s,e){}}]);