(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1ad48a47"],{"98a1":function(t,s,o){"use strict";var e=o("cdfa"),i=o.n(e);i.a},b409:function(t,s,o){t.exports=o.p+"static/img/yy.75d385bb.png"},cdfa:function(t,s,o){},de66:function(t,s,o){"use strict";o.r(s);var e=function(){var t=this,s=t.$createElement,o=t._self._c||s;return o("div",{staticClass:"operate-mgmt-nav"},[o("div",{staticClass:"image"},[o("img",{attrs:{src:t.yy}}),o("div",{staticClass:"title1"},[t._v("基础设置")]),o("div",{staticClass:"title2"},[t._v("电商运营")]),o("div",{staticClass:"title3"},[t._v("数据洞察")]),o("div",{directives:[{name:"popover",rawName:"v-popover:codePop",arg:"codePop"}],staticClass:"square step1"},[o("div",{staticClass:"top"},[t._v("设置支付方式")]),o("div",{staticClass:"bottom"},[t._v(" 支持支付方式 "),o("span",[t._v(t._s(this.form.paymentCurrentCount)+"/"+t._s(this.form.paymentTotalCount)+"个")])])]),t.currentAuth().includes("admin:shop.shippingMethod")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop1",arg:"codePop1"}],staticClass:"square step2",on:{click:function(s){return t.link("/union/shop/product-settings/distributor-setting")}}},[o("div",{staticClass:"top"},[t._v("设置配送方式")]),o("div",{staticClass:"bottom"},[t._v(" 支持配送方式 "),o("span",[t._v(t._s(this.form.shippingMethodCurrentCount)+"/"+t._s(this.form.shippingMethodTotalCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:shop.shippingMethod")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop1",arg:"codePop1"}],staticClass:"square step2 disabled"},[o("div",{staticClass:"top"},[t._v("设置配送方式")]),o("div",{staticClass:"bottom"},[t._v(" 支持配送方式 "),o("span",[t._v(t._s(this.form.shippingMethodCurrentCount)+"/"+t._s(this.form.shippingMethodTotalCount)+"个")])])]),t.currentAuth().includes("admin:deliveryCorp.shop")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop2",arg:"codePop2"}],staticClass:"square step3",on:{click:function(s){return t.link("/union/shop/delivery_shop")}}},[o("div",{staticClass:"top"},[t._v("设置物流公司")]),o("div",{staticClass:"bottom"},[t._v(" 支持物流公司 "),o("span",[t._v(t._s(this.form.deliveryCompCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:deliveryCorp.shop")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop2",arg:"codePop2"}],staticClass:"square step3 disabled"},[o("div",{staticClass:"top"},[t._v("设置物流公司")]),o("div",{staticClass:"bottom"},[t._v(" 支持物流公司 "),o("span",[t._v(t._s(this.form.deliveryCompCount)+"个")])])]),t.currentAuth().includes("admin:product")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop3",arg:"codePop3"}],staticClass:"square step4",on:{click:function(s){return t.link("/operating/commodity-mgmt/commodity")}}},[o("div",{staticClass:"top"},[t._v("商品管理")]),o("div",{staticClass:"bottom"},[t._v(" 已有商品 "),o("span",[t._v(t._s(this.form.productCount)+"种")])])]):t._e(),t.currentAuth().includes("admin:product")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop3",arg:"codePop3"}],staticClass:"square step4 disabled"},[o("div",{staticClass:"top"},[t._v("商品管理")]),o("div",{staticClass:"bottom"},[t._v(" 已有商品 "),o("span",[t._v(t._s(this.form.productCount)+"种")])])]),t.currentAuth().includes("admin:order.order")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop4",arg:"codePop4"}],staticClass:"square step5",on:{click:function(s){return t.link("/operating/product/car")}}},[1===t.orderPendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("订单管理")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增订单 "),o("span",[t._v(t._s(this.form.orderCount)+"个")])])]):t._e(),t.currentAuth().includes("admin:order.order")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop4",arg:"codePop4"}],staticClass:"square step5 disabled"},[1===t.orderPendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("订单管理")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增订单 "),o("span",[t._v(t._s(this.form.orderCount)+"个")])])]),t.currentAuth().includes("admin:order.logistics")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop5",arg:"codePop5"}],staticClass:"square step6",on:{click:function(s){return t.link("/operating/logistics")}}},[1===t.shippingPendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("物流发货")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增发货记录 "),o("span",[t._v(t._s(this.form.shippingCount)+"条")])])]):t._e(),t.currentAuth().includes("admin:order.logistics")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop5",arg:"codePop5"}],staticClass:"square step6 disabled"},[1===t.shippingPendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("物流发货")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增发货记录 "),o("span",[t._v(t._s(this.form.shippingCount)+"条")])])]),t.currentAuth().includes("admin:refunds")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop6",arg:"codePop6"}],staticClass:"square step7",on:{click:function(s){return t.link("/operating/finance/refund")}}},[1===t.afterSalePendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("售后退款")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增售后记录 "),o("span",[t._v(t._s(this.form.afterSaleCount)+"条")])])]):t._e(),t.currentAuth().includes("admin:refunds")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop6",arg:"codePop6"}],staticClass:"square step7 disabled"},[1===t.afterSalePendingDeal?o("i",{staticClass:"iconfont el-icon-warning",staticStyle:{color:"#ff7300",float:"right"}}):t._e(),o("div",{staticClass:"top"},[t._v("售后退款")]),o("div",{staticClass:"bottom"},[t._v(" 今日新增售后记录 "),o("span",[t._v(t._s(this.form.afterSaleCount)+"条")])])]),t.currentAuth().includes("admin:order.statistics.catagory")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop7",arg:"codePop7"}],staticClass:"square step8",on:{click:function(s){return t.link("/operating/product-statistics/productCategoryAnalysis")}}},[o("div",{staticClass:"top"},[t._v("品类分析")])]):t._e(),t.currentAuth().includes("admin:order.statistics.catagory")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop7",arg:"codePop7"}],staticClass:"square step8 disabled"},[o("div",{staticClass:"top"},[t._v("品类分析")])]),t.currentAuth().includes("admin:order.statistics.product")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop8",arg:"codePop8"}],staticClass:"square step9",on:{click:function(s){return t.link("/operating/product-statistics/singleProductAnalysis")}}},[o("div",{staticClass:"top"},[t._v("单品分析")])]):t._e(),t.currentAuth().includes("admin:order.statistics.product")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop8",arg:"codePop8"}],staticClass:"square step9 disabled"},[o("div",{staticClass:"top"},[t._v("单品分析")])]),t.currentAuth().includes("admin:order.statistics.summary")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop9",arg:"codePop9"}],staticClass:"square step10",on:{click:function(s){return t.link("/operating/product-statistics/generalViewAnalysis")}}},[o("div",{staticClass:"top"},[t._v("运营概况")])]):t._e(),t.currentAuth().includes("admin:order.statistics.summary")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop9",arg:"codePop9"}],staticClass:"square step10 disabled"},[o("div",{staticClass:"top"},[t._v("运营概况")])]),t.currentAuth().includes("admin:order.statistics.buyer")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step11",on:{click:function(s){return t.link("/operating/product-statistics/OrderPopulationAnalysis")}}},[o("div",{staticClass:"top"},[t._v("下单人群分析")])]):t._e(),t.currentAuth().includes("admin:order.statistics.buyer")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop10",arg:"codePop10"}],staticClass:"square step11 disabled"},[o("div",{staticClass:"top"},[t._v("下单人群分析")])]),t.currentAuth().includes("admin:statistics.mouthreport.ecommerce")?o("div",{directives:[{name:"popover",rawName:"v-popover:codePop11",arg:"codePop11"}],staticClass:"square step12",on:{click:function(s){return t.link("/operating/product-statistics/report")}}},[o("div",{staticClass:"top"},[t._v("运营月报")])]):t._e(),t.currentAuth().includes("admin:statistics.mouthreport.ecommerce")?t._e():o("div",{directives:[{name:"popover",rawName:"v-popover:codePop11",arg:"codePop11"}],staticClass:"square step12 disabled"},[o("div",{staticClass:"top"},[t._v("运营月报")])]),o("el-popover",{ref:"codePop",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("设置支付方式")]),o("div",{staticClass:"middle-font"},[t._v("可设置店铺需要开通的支付方式")]),o("div",{staticClass:"bottom-font"},[t._v(" 支持支付方式 "),o("span",[t._v(t._s(this.form.paymentCurrentCount)+"/"+t._s(this.form.paymentTotalCount)+"个")])])])]),o("el-popover",{ref:"codePop1",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("设置配送方式")]),o("div",{staticClass:"middle-font"},[t._v("可设置店铺需要支持的配送方式，支持自定义配送方式的费用")]),o("div",{staticClass:"bottom-font"},[t._v(" 支持配送方式 "),o("span",[t._v(t._s(this.form.shippingMethodCurrentCount)+"/"+t._s(this.form.shippingMethodTotalCount)+"个")])])])]),o("el-popover",{ref:"codePop2",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("设置物流公司")]),o("div",{staticClass:"middle-font"},[t._v("可添加店铺合作的物流公司，订单发货将从设置的物流公司中选择")]),o("div",{staticClass:"bottom-font"},[t._v(" 支持物流公司 "),o("span",[t._v(t._s(this.form.deliveryCompCount)+"个")])])])]),o("el-popover",{ref:"codePop3",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("商品管理")]),o("div",{staticClass:"middle-font"},[t._v("维护商品分类信息、品牌信息、商品信息，维护V豆全额兑换商品")]),o("div",{staticClass:"bottom-font"},[t._v(" 已有商品 "),o("span",[t._v(t._s(this.form.productCount)+"种")])]),o("div",{staticClass:"bottom-font"},[t._v(" 已有品牌 "),o("span",[t._v(t._s(this.form.brandCount)+"种")])]),o("div",{staticClass:"bottom-font"},[t._v(" 已有分类 "),o("span",[t._v(t._s(this.form.productCategoryCount)+"种")])])])]),o("el-popover",{ref:"codePop4",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("订单管理")]),o("div",{staticClass:"middle-font"},[t._v("管理订单，进行确认、发货/执行、收款、开票等处理")]),o("div",{staticClass:"bottom-font"},[t._v(" 今日新增订单 "),o("span",[t._v(t._s(this.form.orderCount)+"个")])])])]),o("el-popover",{ref:"codePop5",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("物流发货")]),o("div",{staticClass:"middle-font"},[t._v("查看店铺的物流发货情况")]),o("div",{staticClass:"bottom-font"},[t._v(" 今日新增发货记录 "),o("span",[t._v(t._s(this.form.shippingCount)+"条")])])])]),o("el-popover",{ref:"codePop6",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("售后退款")]),o("div",{staticClass:"middle-font"},[t._v("查看店铺的售后退款情况")]),o("div",{staticClass:"bottom-font"},[t._v(" 今日新增售后记录 "),o("span",[t._v(t._s(this.form.afterSaleCount)+"条")])])])]),o("el-popover",{ref:"codePop7",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("品类分析")]),o("div",{staticClass:"middle-font"},[t._v("对商品进行分析，了解单个品类销售情况。")])])]),o("el-popover",{ref:"codePop8",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("单品分析")]),o("div",{staticClass:"middle-font"},[t._v("对商品进行分析，了解单个商品销售情况。")])])]),o("el-popover",{ref:"codePop9",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("运营概况")]),o("div",{staticClass:"middle-font"},[t._v("对电商情况进行分析，了解销售、转化、服务情况。")])])]),o("el-popover",{ref:"codePop10",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("下单人群分析")]),o("div",{staticClass:"middle-font"},[t._v("对下单人群进行分析，了解消费者的特性和消费价值。")])])]),o("el-popover",{ref:"codePop11",attrs:{placement:"bottom-start",trigger:"hover"}},[o("div",{staticClass:"pop-div"},[o("div",{staticClass:"top-font"},[t._v("运营月报")]),o("div",{staticClass:"middle-font"},[t._v("对运营的整体情况进行总结，并给出建议。")])])])],1)])},i=[],a=(o("ac1f"),o("1276"),o("5530")),r=o("b409"),n=o.n(r),c=o("2f62"),p=o("fedf"),d=o("1ab1"),v={name:"CustomerServiceNav",data:function(){return{form:{paymentTotalCount:0,paymentCurrentCount:0,shippingMethodTotalCount:0,shippingMethodCurrentCount:0,deliveryCompCount:0,productCount:0,brandCount:0,productCategoryCount:0,orderCount:0,shippingCount:0,afterSaleCount:0},orderPendingDeal:0,shippingPendingDeal:0,afterSalePendingDeal:0,yy:n.a}},computed:{},components:{},methods:Object(a["a"])(Object(a["a"])(Object(a["a"])(Object(a["a"])({},Object(c["c"])(["getUser"])),Object(c["d"])("Menu",["updateRoutes"])),Object(c["c"])("Authority",["currentAuth"])),{},{link:function(t){this.updateRoutes({routes:p["a"]["".concat(t.split("/")[1])]}),this.$router.push(t)},getNavInfo:function(){var t=this;d["a"].get("/admin/store/navigation/kpi/ecommerce.jhtml",{}).then((function(s){Object.assign(t.form,s),t.orderPendingDeal=s.orderPendingDeal,t.shippingPendingDeal=s.shippingPendingDeal,t.afterSalePendingDeal=s.afterSalePendingDeal})).catch((function(s){t.$message.warning(s.errorMessage)}))}}),mounted:function(){this.getNavInfo()}},l=v,u=(o("98a1"),o("2877")),m=Object(u["a"])(l,e,i,!1,null,null,null);s["default"]=m.exports}}]);