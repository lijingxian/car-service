(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0d90fb0b"],{2973:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"afterSale-report"},[e("div",{staticClass:"top"},[e("div",{staticClass:"block"},[e("div",{staticClass:"demonstration"},[t._v("月份")]),e("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"month",placeholder:"选择月",size:"mini","picker-options":t.pickerOptions},on:{change:t.dateChange},model:{value:t.endDate,callback:function(a){t.endDate=a},expression:"endDate"}}),e("div",{staticClass:"demonstration"},[t._v("店铺")]),e("el-select",{attrs:{placeholder:"请选择",size:"mini"},on:{change:t.shopChange},model:{value:t.checkedShops,callback:function(a){t.checkedShops=a},expression:"checkedShops"}},t._l(t.shopsList,(function(t){return e("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),e("div",[e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.printView}},[t._v("打印")]),e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.save}},[t._v("导出")])],1)]),e("div",{ref:"imageWrapper"},[e("div",{staticClass:"title-header"},[e("span",[t._v(t._s(t.shopName))]),e("span",[t._v("售后月报")]),e("span",[t._v("|")]),e("span",[t._v(t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"1-"+t._s(t.lastDate)+"日")])]),e("div",{staticClass:"content"},[t._m(0),e("div",{staticClass:"des"},[e("p",[t._v(" "+t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"， 车辆售后进厂台次共"+t._s(t.indicators.intelligentAccessNumInc)+"台，同比增加"+t._s(t.indicators.intelligentAccessNumIncYoy)+"%，环比增加"+t._s(t.indicators.intelligentAccessNumIncMon)+"%； "),t._v(" 人均接待次数"+t._s(t.indicators.avgIntelligentAccessNumInc)+"次，同比增加"+t._s(t.indicators.avgIntelligentAccessNumIncYoy)+"%，环比增加"+t._s(t.indicators.avgIntelligentAccessNumIncMon)+"%。 ")]),e("p",[t._v(" 售后收入共"+t._s(t.indicators.afterSaleAmountInc)+"万元，同比增加"+t._s(t.indicators.afterSaleAmountIncYoy)+"%，环比增加"+t._s(t.indicators.afterSaleAmountIncMon)+"%； 按服务项目统计分别为：维修产值"+t._s(t.repairData[0].yValue)+"，同比增加"+t._s(t.repairData[0].yoyRate)+"%，环比增加"+t._s(t.repairData[0].momRate)+"%; 保养产值"+t._s(t.maintainceData[0].yValue)+"，同比增加"+t._s(t.maintainceData[0].yoyRate)+"%，环比增加"+t._s(t.maintainceData[0].momRate)+"% 事故车产值"+t._s(t.instanteData[0].yValue)+"，同比增加"+t._s(t.instanteData[0].yoyRate)+"%，环比增加"+t._s(t.instanteData[0].momRate)+"% ")]),e("p",[t._v(" 单车产值"+t._s(t.indicators.singleAfterSaleAmountInc)+"元，同比增加"+t._s(t.indicators.singleAfterSaleAmountIncYoy)+"%，环比增加"+t._s(t.indicators.singleAfterSaleAmountIncMon)+"%。 ")])]),e("div",{staticClass:"chart-area"},[e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartData,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("进厂台次变化趋势图")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfAppreciation,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("售后产值趋势图")])],1)])]),e("div",{staticClass:"content"},[t._m(1),e("div",{staticClass:"des"},[t.topCarX.length>0?e("p",[t._v(" "+t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"进厂台次排行前五的车型是"+t._s(t.topCarX.join("、"))+"，分别是"+t._s(t.topCarY.join("、"))+"台；售后收入排行前五的车型是"+t._s(t.topCarAmountX.join("、"))+"，分别是"+t._s(t.topCarAmountY.join("、"))+"万元。 ")]):t._e(),t.topConsultantX.length>0?e("p",[t._v(" "+t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"售后接待次数排行前五的销售顾问是"+t._s(t.topConsultantX.join("、"))+"，分别是"+t._s(t.topConsultantY.join("、"))+"台；售后收入排行前五的销售顾问是"+t._s(t.topConsultantAmountX.join("、"))+"，分别是"+t._s(t.topConsultantAmountY.join("、"))+"万元。 ")]):t._e(),e("p",[t._v(" "+t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"用户满意度评分，其中服务态度"+t._s(t.indicators.satisfactionInc)+"分，服务速度"+t._s(t.indicators.serviceAttitudeSatisfactionInc)+"分，专业技能"+t._s(t.indicators.professionalSatisfactionInc)+"分。 售后投诉数"+t._s(t.indicators.aftersaleComplaintInc)+"个，同比增加"+t._s(t.indicators.aftersaleComplaintIncYoy)+"%，环比增加"+t._s(t.indicators.aftersaleComplaintIncMon)+"%； ")])]),e("div",{staticClass:"chart-area"},[e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfCarType,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("售后收入排行前五车型")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfConsultant,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("售后收入排行前五顾问")])],1)])]),e("div",{staticClass:"content"},[t._m(2),e("div",{staticClass:"des"},[t._l(t.indicators.advise,(function(a,i){return e("p",{directives:[{name:"show",rawName:"v-show",value:t.indicators.advise&&t.indicators.advise.length>0,expression:"indicators.advise && indicators.advise.length > 0"}],key:i},[t._v(" "+t._s(a.join(","))+" ")])})),e("p",{directives:[{name:"show",rawName:"v-show",value:!t.indicators.advise||0===t.indicators.advise.length,expression:"!indicators.advise || indicators.advise.length === 0"}]},[t._v(" 您的店铺当月经营良好，暂无明显需要改善的地方。 ")])],2)])]),e("el-dialog",{attrs:{visible:t.dialogTableVisible,center:"",width:"1200px","append-to-body":""},on:{"update:visible":function(a){t.dialogTableVisible=a}}},[e("div",{attrs:{align:"right"}},[e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.print}},[t._v("打印")])],1),e("vue-easy-print",{ref:"easyPrint",attrs:{tableShow:""}},[e("img",{attrs:{src:t.url,width:"100%"}})])],1)],1)},n=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("一、进厂台次与产值情况")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("二、分车型/顾问售后情况")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("三、结论建议")])])}],s=(e("d81d"),e("b0c0"),e("d3b7"),e("ac1f"),e("1276"),e("5530")),o=e("562e"),r=e("2f62"),c=e("fedf"),h=e("1ab1"),d=e("c466"),p=e("ce0c"),l=e("225d"),u=e("c0e9"),g=e.n(u),m=e("e511"),f=e.n(m),D={name:"CustomerServiceNav",data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},companyCount:0,storeCount:0,unionCount:0,beginDate:p["a"].getMonthStartDate(),endDate:d["a"].nowDate(),addOperator:"",addStore:"",storeList:"",url:"",isIndeterminateShops:!0,dialogTableVisible:!1,loading:!1,checkAllShops:!0,checkedShops:this.getUser().shop.id,shopsList:[],chartData:{},chartDataOfAppreciation:{},chartDataOfCarType:{},chartDataOfConsultant:{},topCarX:[],topCarY:[],topCarAmountX:[],topCarAmountY:[],topConsultantX:[],topConsultantY:[],topConsultantAmountX:[],topConsultantAmountY:[],maintainceData:[],repairData:[],instanteData:[],indicators:{advise:[]},imgUrl:"",kpiName:["本期","同比","环比"]}},computed:{shopName:function(){var t=this,a=this.getUser().shop.name;return this.shopsList.map((function(e){t.checkedShops===e.id&&(a=e.name)})),a},lastDate:function(){return d["a"].getMonthDays(this.endDate)}},components:{BizChart:o["a"],vueEasyPrint:l["a"]},created:function(){this.getShopList()},methods:Object(s["a"])(Object(s["a"])(Object(s["a"])(Object(s["a"])({},Object(r["c"])(["getUser"])),Object(r["d"])("Menu",["updateRoutes"])),Object(r["c"])("Authority",["currentAuth"])),{},{print:function(){this.$refs.easyPrint.print()},dateChange:function(){this.beginDate=this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-01",this.query()},init:function(){var t=this,a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopId:this.checkedShops};h["a"].post("/admin/ecommerce/kpi/aftersales/summary/report.jhtml",a).then((function(a){t.indicators=a.indicators})).catch((function(a){a.errorMessage&&t.$message.warning(a.errorMessage)}))},printView:function(){var t=this,a=this;window.pageYOffset=0,document.documentElement.scrollTop=0,document.body.scrollTop=0,setTimeout((function(){g()(t.$refs.imageWrapper).then((function(t){a.url=t.toDataURL(),a.dialogTableVisible=!0}))}),500)},save:function(){var t=this,a=this;window.pageYOffset=0,document.documentElement.scrollTop=0,document.body.scrollTop=0,setTimeout((function(){g()(t.$refs.imageWrapper).then((function(t){var e=t.width,i=t.height,n=e/592.28*841.89,s=i,o=0,r=595.28,c=592.28/e*i,h=t.toDataURL("image/jpeg",1),d=new f.a("","pt","a4");if(s<n)d.addImage(h,"JPEG",0,0,r,c);else while(s>0)d.addImage(h,"JPEG",0,o,r,c),s-=n,o-=841.89,s>0&&d.addPage();d.save("售后月报.pdf"),a.loading=!1}))}),500)},link:function(t){this.updateRoutes({routes:c["a"]["".concat(t.split("/")[1])]}),this.$router.push(t)},query:function(){this.getGraphData(),this.getGraphAppreciationData(),this.getGraphCarTypeData(),this.getGraphGeneralData(),this.getGraphCarTypeAmountData(),this.getGraphGeneralAmountData(),this.getMaintainceData(),this.getRepairData(),this.getInstanteData(),this.init()},shopChange:function(t){this.query()},getShopList:function(){var t=this,a={sourceType:"5"};h["a"].get("/admin/member/json/findEShops.jhtml",a).then((function(a){t.shopsList=a.shops,t.query()})).catch((function(a){a.errorMessage&&t.$message.warning(a.errorMessage)}))},getGraphGeneralData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"4",indicator:"0",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.chartDataOfConsultant=t.dataConsultantFormat(a),t.topConsultantX=[],a.indicators.map((function(a,e){e<5&&t.topConsultantX.push(a.xValue)})),t.topConsultantY=[],a.indicators.map((function(a,e){e<5&&t.topConsultantY.push(a.yValue)}))})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphGeneralAmountData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"4",indicator:"1",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.topConsultantAmountX=[],a.indicators.map((function(a,e){e<5&&t.topConsultantAmountX.push(a.xValue)})),t.topConsultantAmountY=[],a.indicators.map((function(a,e){e<5&&t.topConsultantAmountY.push(a.yValue)}))})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataConsultantFormat:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({"顾问":t.indicators[e].xValue,"台":t.indicators[e].yValue});var i={legendVisible:!1,type:"histogram",data:{columns:["顾问","台"],rows:a},settings:{}};return i},getGraphCarTypeData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"3",indicator:"1",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.chartDataOfCarType=t.dataCarTypeFormat(a),t.topCarX=[],a.indicators.map((function(a,e){e<5&&t.topCarX.push(a.xValue)})),t.topCarY=[],a.indicators.map((function(a,e){e<5&&t.topCarY.push(a.yValue)}))})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphCarTypeAmountData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"2",indicator:"1",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.topCarAmountX=[],a.indicators.map((function(a,e){e<5&&t.topCarAmountX.push(a.xValue)})),t.topCarAmountY=[],a.indicators.map((function(a,e){e<5&&t.topCarAmountY.push(a.yValue)}))})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataCarTypeFormat:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({"车型":t.indicators[e].xValue,"辆":t.indicators[e].yValue});var i={legendVisible:!1,type:"histogram",data:{columns:["车型","辆"],rows:a},settings:{}};return i},getGraphData:function(){var t=this;this.loading=!0;var a={viewType:"month",indicator:"0",type:"0",beginDate:d["a"].halfYearAgo(this.endDate),endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.chartData=t.dataFormat(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataFormat:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({"日期":t.indicators[e].xValue,"本期":t.indicators[e].yValue,"同比":t.indicators[e].yoyRate,"环比":t.indicators[e].momRate});var i={type:"histogram",data:{columns:["日期",this.kpiName[0],this.kpiName[1],this.kpiName[2]],rows:a},settings:{axisSite:{right:["同比","环比"]},yAxisType:["KMB","KMB"],yAxisName:["","%"],showLine:[this.kpiName[1],this.kpiName[2]]}};return i},getGraphAppreciationData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"1",beginDate:d["a"].halfYearAgo(this.endDate),endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),indicator:"0",shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.chartDataOfAppreciation=t.dataAppreciationFormat(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getMaintainceData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"2",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),indicator:"0",shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.maintainceData=a.indicators})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getRepairData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"2",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),indicator:"1",shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.repairData=a.indicators})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getInstanteData:function(){var t=this;this.loading=!0;var a={viewType:"month",type:"2",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+d["a"].getMonthDays(this.endDate),indicator:"2",shopIds:[this.checkedShops||this.getUser().shop.id]};h["a"].post("/admin/ecommerce/kpi/afterSales/graph.jhtml",a).then((function(a){t.instanteData=a.indicators})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataAppreciationFormat:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({"日期":t.indicators[e].xValue,"本期":t.indicators[e].yValue,"同比":t.indicators[e].yoyRate,"环比":t.indicators[e].momRate});var i={type:"histogram",data:{columns:["日期",this.kpiName[0],this.kpiName[1],this.kpiName[2]],rows:a},settings:{axisSite:{right:["同比","环比"]},yAxisType:["KMB","KMB"],yAxisName:["","%"],showLine:[this.kpiName[1],this.kpiName[2]]}};return i}}),mounted:function(){}},v=D,y=(e("7a92"),e("2877")),C=Object(y["a"])(v,i,n,!1,null,null,null);a["default"]=C.exports},"7a92":function(t,a,e){"use strict";var i=e("bf04"),n=e.n(i);n.a},bf04:function(t,a,e){}}]);