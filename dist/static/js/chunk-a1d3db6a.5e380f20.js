(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a1d3db6a"],{1952:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"member-report"},[e("div",{staticClass:"top"},[e("div",{staticClass:"block"},[e("div",{staticClass:"demonstration"},[t._v("月份")]),e("el-date-picker",{attrs:{"value-format":"yyyy-MM",type:"month",placeholder:"选择月",size:"mini","picker-options":t.pickerOptions},on:{change:t.dateChange},model:{value:t.endDate,callback:function(a){t.endDate=a},expression:"endDate"}}),e("div",{staticClass:"demonstration"},[t._v("店铺")]),e("el-select",{attrs:{placeholder:"请选择",size:"mini"},on:{change:t.shopChange},model:{value:t.checkedShops,callback:function(a){t.checkedShops=a},expression:"checkedShops"}},t._l(t.shopsList,(function(t){return e("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),e("div",[e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.printView}},[t._v("打印")]),e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.save}},[t._v("导出")])],1)]),e("div",{ref:"imageWrapper"},[e("div",{staticClass:"title-header"},[e("span",[t._v(t._s(t.shopName))]),e("span",[t._v("会员月报")]),e("span",[t._v("|")]),e("span",[t._v(t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"1-"+t._s(t.lastDate)+"日")])]),e("div",{staticClass:"content"},[t._m(0),e("div",{staticClass:"des"},[e("p",[t._v(" 截至"+t._s(t.endDate.split("-")[0]+"年"+t.endDate.split("-")[1]+"月")+"，累计会员"+t._s(t.indicators.memberCnt)+"人。 其中，消费会员"+t._s(t.indicators.consumeMemberInc)+"人，占会员总数的"+t._s(100*t.indicators.consumeMemberIncProportion)+"%； 活跃会员"+t._s(t.indicators.activeMemberInc)+"人，占会员总数的"+t._s(100*t.indicators.activeMemberIncProportion)+"%。 新增会员"+t._s(t.indicators.memberInc)+"人，同比增加"+t._s(t.indicators.memberIncYoy)+"%，环比增加"+t._s(t.indicators.memberIncMon)+"%。 ")]),e("p",[t._v(" 从消费与价值特性来看，所有会员中，"),t._l(t.indicators.activeTags,(function(a,i){return e("span",{key:i},[t._v(t._s(a[0])+t._s(a[1])+"人，占比"+t._s(Math.round(100*a[2]))+"%；")])}))],2),e("p",[t._v(" 本月新增会员人数，消费会员人数，活跃会员人数变化情况如下图所示。 ")])]),e("div",{staticClass:"chart-area"},[e("div",{staticClass:"graph"},[e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("新增会员人数变化-按月")]),e("biz-chart",{attrs:{chartData:t.chartDataOfInc,loading:t.loading,showSearch:!1}})],1),e("div",{staticClass:"graph"},[e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("消费会员人数变化-按月")]),e("biz-chart",{attrs:{chartData:t.chartDataOfConsume,loading:t.loading,showSearch:!1}})],1),e("div",{staticClass:"graph"},[e("div",{staticClass:"des",attrs:{align:"center"}},[t._v("活跃会员人数变化-按月")]),e("biz-chart",{attrs:{chartData:t.chartDataOfActive,loading:t.loading,showSearch:!1}})],1)])]),e("div",{staticClass:"content"},[t._m(1),e("div",{staticClass:"des"},[e("p",[t._v(" 会员属性分布如下图所示。 男女会员比例为"+t._s(t.genderData.length>0?t.genderData[0].value:"")+"："+t._s(t.genderData[1].value)+"； 从年龄结构来看，"+t._s(t.ageData[0].lable)+"岁的会员最多，占比"+t._s(0!==t.countTotal?(t.ageData[0].value/t.countTotal*100).toFixed(2):t.ageData[1].value)+"%；其次为"+t._s(t.ageData[1].lable)+"岁会员，占比达"+t._s(0!==t.countTotal?(t.ageData[1].value/t.countTotal*100).toFixed(2):t.ageData[1].value)+"%； 从婚育状况来看，"+t._s(t.marryData.length>0?t.marryData[0].lable:"")+"会员最多，"+t._s(t.marryData.length>0?t.marryData[1].lable:"")+"次之； 从学历来看，"+t._s(t.genData[0].lable)+"学历的会员最多； 从收入状况来看，"+t._s(t.incomeData[0].lable)+"收入的会员最多； 从拥有车辆价格来看，"+t._s(t.carData[0].lable)+"价格的车辆占比最高。 ")])]),e("div",{staticClass:"chart-area"},[e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfAge,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("年龄分布")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfGender,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("性别分布")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfMarry,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("婚育分布")])],1)]),e("div",{staticClass:"chart-area"},[e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfGen,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("学历分布")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfIncome,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("收入分布")])],1),e("div",{staticClass:"graph"},[e("biz-chart",{attrs:{chartData:t.chartDataOfCar,loading:t.loading,showSearch:!1}}),e("div",{staticClass:"chart-title"},[t._v("拥有车辆分布")])],1)])]),e("div",{staticClass:"content"},[t._m(2),e("div",{staticClass:"des"},[t._l(t.indicators.advise,(function(a,i){return e("p",{directives:[{name:"show",rawName:"v-show",value:t.indicators.advise&&t.indicators.advise.length>0,expression:"indicators.advise && indicators.advise.length > 0"}],key:i},[t._v(" "+t._s(a.join(","))+" ")])})),e("p",{directives:[{name:"show",rawName:"v-show",value:!t.indicators.advise||0===t.indicators.advise.length,expression:"!indicators.advise || indicators.advise.length === 0"}]},[t._v(" 您的店铺当月经营良好，暂无明显需要改善的地方。 ")])],2)])]),e("el-dialog",{attrs:{visible:t.dialogTableVisible,center:"",width:"1200px","append-to-body":""},on:{"update:visible":function(a){t.dialogTableVisible=a}}},[e("div",{attrs:{align:"right"}},[e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.print}},[t._v("打印")])],1),e("vue-easy-print",{ref:"easyPrint",attrs:{tableShow:""}},[e("img",{attrs:{src:t.url,width:"100%"}})])],1)],1)},n=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("一、会员概述")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("二、会员属性")])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"title-header"},[e("span",[t._v("三、结论建议")])])}],s=(e("99af"),e("a15b"),e("d81d"),e("b0c0"),e("a9e3"),e("d3b7"),e("ac1f"),e("1276"),e("b85c")),r=e("5530"),o=e("562e"),c=e("2f62"),h=e("fedf"),d=e("1ab1"),l=e("c466"),g=e("ce0c"),p=e("225d"),m=e("c0e9"),u=e.n(m),D=e("e511"),v=e.n(D),f={name:"CustomerServiceNav",data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},companyCount:0,storeCount:0,unionCount:0,countTotal:0,carData:[],ageData:[],genderData:[],genData:[],marryData:[],incomeData:[],beginDate:g["a"].getMonthStartDate(),endDate:l["a"].nowDate(),addOperator:"",addStore:"",storeList:"",url:"",isIndeterminateShops:!0,dialogTableVisible:!1,loading:!1,checkAllShops:!0,checkedShops:this.getUser().shop.id,shopsList:[],chartData:{},chartDataOfInc:{},chartDataOfConsume:{},chartDataOfActive:{},chartDataOfAge:{},chartDataOfGender:{},chartDataOfMarry:{},chartDataOfGen:{},chartDataOfIncome:{},chartDataOfCar:{},topCarX:[],topCarY:[],topCarAmountX:[],topCarAmountY:[],topConsultantX:[],topConsultantY:[],topConsultantAmountX:[],topConsultantAmountY:[],indicators:{advise:[]},imgUrl:"",kpiName:["本期","同比","环比"]}},computed:{shopName:function(){var t=this,a=this.getUser().shop.name;return this.shopsList.map((function(e){t.checkedShops===e.id&&(a=e.name)})),a},lastDate:function(){return l["a"].getMonthDays(this.endDate)}},components:{BizChart:o["a"],vueEasyPrint:p["a"]},created:function(){this.getShopList()},methods:Object(r["a"])(Object(r["a"])(Object(r["a"])(Object(r["a"])({},Object(c["c"])(["getUser"])),Object(c["d"])("Menu",["updateRoutes"])),Object(c["c"])("Authority",["currentAuth"])),{},{print:function(){this.$refs.easyPrint.print()},dateChange:function(){this.beginDate=this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-01",this.query()},init:function(){var t=this,a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),shopIds:[this.checkedShops]};d["a"].post("/admin/ecommerce/kpi/summary/member/report.jhtml",a).then((function(a){t.indicators=a.indicators})).catch((function(a){a.errorMessage&&t.$message.warning(a.errorMessage)}))},printView:function(){var t=this,a=this;window.pageYOffset=0,document.documentElement.scrollTop=0,document.body.scrollTop=0,setTimeout((function(){u()(t.$refs.imageWrapper).then((function(t){a.url=t.toDataURL(),a.dialogTableVisible=!0}))}),500)},save:function(){var t=this,a=this;window.pageYOffset=0,document.documentElement.scrollTop=0,document.body.scrollTop=0,setTimeout((function(){u()(t.$refs.imageWrapper).then((function(t){var e=t.width,i=t.height,n=e/592.28*841.89,s=i,r=0,o=595.28,c=592.28/e*i,h=t.toDataURL("image/jpeg",1),d=new v.a("","pt","a4");if(s<n)d.addImage(h,"JPEG",0,0,o,c);else while(s>0)d.addImage(h,"JPEG",0,r,o,c),s-=n,r-=841.89,s>0&&d.addPage();d.save("会员月报.pdf"),a.loading=!1}))}),500)},link:function(t){this.updateRoutes({routes:h["a"]["".concat(t.split("/")[1])]}),this.$router.push(t)},query:function(){this.getGraphIncData(),this.getGraphConsumeData(),this.getGraphActiveData(),this.getGraphAgeData(),this.getGraphGenderData(),this.getGraphMarryData(),this.getGraphGenData(),this.getGraphIncomeData(),this.getGraphCarData(),this.init()},shopChange:function(t){this.query()},getShopList:function(){var t=this,a={sourceType:"5"};d["a"].get("/admin/member/json/findEShops.jhtml",a).then((function(a){t.shopsList=a.shops,t.query()})).catch((function(a){a.errorMessage&&t.$message.warning(a.errorMessage)}))},getGraphIncData:function(){var t=this;this.loading=!0;var a={viewType:"month",indicator:"memberIns",searchShopIds:this.checkedShops,beginDate:l["a"].halfYearAgo(this.endDate),endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate)},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/member.jhtml?"+e.join("&")).then((function(a){t.chartDataOfInc=t.dataFormat(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphConsumeData:function(){var t=this;this.loading=!0;var a={viewType:"month",indicator:"orderConsumeMemberCount",searchShopIds:this.checkedShops,beginDate:l["a"].halfYearAgo(this.endDate),endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate)},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/member.jhtml?"+e.join("&")).then((function(a){t.chartDataOfConsume=t.dataFormat(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphActiveData:function(){var t=this;this.loading=!0;var a={viewType:"month",indicator:"activityQuantity",searchShopIds:this.checkedShops,beginDate:l["a"].halfYearAgo(this.endDate),endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate)},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/member.jhtml?"+e.join("&")).then((function(a){t.chartDataOfActive=t.dataFormat(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataFormat:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({"日期":t.indicators[e].xValue,"本期":t.indicators[e].yValue,"同比":t.indicators[e].yoyRate,"环比":t.indicators[e].momRate});var i={type:"histogram",data:{columns:["日期",this.kpiName[0],this.kpiName[1],this.kpiName[2]],rows:a},settings:{axisSite:{right:["同比","环比"]},yAxisType:["KMB","KMB"],yAxisName:["","%"],showLine:[this.kpiName[1],this.kpiName[2]]}};return i},getGraphAgeData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"age",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.ageData=a.indicators,t.chartDataOfAge=t.dataFormatPie(a),t.countTotal=0;var e,i=Object(s["a"])(a.indicators);try{for(i.s();!(e=i.n()).done;){var n=e.value;t.countTotal+=Number(n.value)}}catch(r){i.e(r)}finally{i.f()}})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphGenderData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"gender",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.genderData=a.indicators,t.chartDataOfGender=t.dataFormatPie(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphMarryData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"emotionalState",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.marryData=a.indicators,t.chartDataOfMarry=t.dataFormatPie(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphGenData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"education",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.genData=a.indicators,t.chartDataOfGen=t.dataFormatPie(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphIncomeData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"incomeState",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.incomeData=a.indicators,t.chartDataOfIncome=t.dataFormatPie(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},getGraphCarData:function(){var t=this;this.loading=!0;var a={viewType:"month",beginDate:this.beginDate,endDate:this.endDate.split("-")[0]+"-"+this.endDate.split("-")[1]+"-"+l["a"].getMonthDays(this.endDate),indicator:"carPrice",searchShopIds:this.checkedShops},e=[];for(var i in a)e.push("".concat(i,"=").concat(a[i]));d["a"].get("/admin/ecommerce/kpi/graph/member/attributeDistribution.jhtml?"+e.join("&")).then((function(a){t.carData=a.indicators,t.chartDataOfCar=t.dataFormatPie(a)})).catch((function(a){t.loading=!1,a.errorMessage&&t.$message.warning(a.errorMessage)})).finally((function(a){t.loading=!1}))},dataFormatPie:function(t){for(var a=[],e=0;e<t.indicators.length;e++)a.push({type:t.indicators[e].lable,value:t.indicators[e].value});var i={type:"pie",legendVisible:!1,data:{columns:["type","value"],rows:a},settings:{offsetY:"50%"}};return i}}),mounted:function(){}},b=f,y=(e("6133"),e("2877")),_=Object(y["a"])(b,i,n,!1,null,null,null);a["default"]=_.exports},2334:function(t,a,e){},6133:function(t,a,e){"use strict";var i=e("2334"),n=e.n(i);n.a}}]);