(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-64b4445c"],{2497:function(e,t,n){"use strict";var r=n("4360"),a=n("a18c");t["a"]=function(e,t){return function(n){var i=n.data;"100"===i.resultCode?e(i):"709"===i.resultCode?(r["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",r["a"].getters.currentUser),a["a"].push("/login")):t(i)}}},"3bbb":function(e,t,n){"use strict";var r=n("5b2c"),a=n.n(r);a.a},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var r=n("1d80"),a=n("5899"),i="["+a+"]",o=RegExp("^"+i+i+"*"),c=RegExp(i+i+"*$"),s=function(e){return function(t){var n=String(r(t));return 1&e&&(n=n.replace(o,"")),2&e&&(n=n.replace(c,"")),n}};e.exports={start:s(1),end:s(2),trim:s(3)}},"5b2c":function(e,t,n){},a9b3:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"vehicle-mgmt-sign-up"},[n("biz-flex-table",{attrs:{operations:e.operations,filters:e.filters,tableData:e.tableData,pagination:e.pagination},on:{operate:e.operate,"filter-data-change":e.filterDataChange,"selection-change":e.handleSelectionChange,"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[n("el-table-column",{attrs:{prop:"name",label:"驾驶员",formatter:e.driverFormatter,filters:e.driverFilter,"filter-method":e.filterHandler}}),n("el-table-column",{attrs:{prop:"carNumber",label:"车牌号",filters:e.plateFilter,"filter-method":e.filterHandler}}),n("el-table-column",{attrs:{prop:"memberPosition",label:"签到地址"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.memberPosition||(t.row.signTime?"未知":"--"))+" ")]}}])}),n("el-table-column",{attrs:{prop:"signTime",label:"签到时间",sortable:""}})],1)],1)},a=[],i=(n("99af"),n("d81d"),n("b0c0"),n("a9e3"),n("d3b7"),n("ac1f"),n("6062"),n("3ca3"),n("466d"),n("1276"),n("ddb0"),n("2b3d"),n("2909")),o=(n("96cf"),n("1da1")),c=n("04d3"),s=(n("4160"),n("a15b"),n("159b"),n("2497")),l=n("bc3a"),u=n.n(l),f=n("c596"),h={query:function(e,t,n){u.a.get(f["g"].vehicleMgmt.VehicleMgmtSignUp_query,{params:e}).then(Object(s["a"])(t,n)).catch((function(e){console.error(e)}))},signUpExport:function(e,t,n){console.log(e);var r=[f["g"].vehicleMgmt.VehicleMgmtSignUp_export,"?"];r.push("fleetId="),r.push(e.fleetId),r.push("&beginDateStr="),r.push(e.beginDateStr),r.push("&endDateStr="),r.push(e.endDateStr),e.ids&&e.ids.forEach((function(e){r.push("&ids="),r.push(e)})),window.open(r.join(""))}},p=n("1ab1"),g={name:"SignUp",data:function(){return{operations:[{label:"导出",name:"export",type:""},{label:"返回",name:"goBack",type:""}],filters:[{type:"daterange",label:"日期区间：",value:["2011-11-11","2012-12-12"]}],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0},tableData:[],multiSelected:[]}},methods:{operate:function(e){this[e]()},goBack:function(){this.$router.go(-1)},handleSelectionChange:function(e){var t=this;this.multiSelected=[],e.map((function(e){t.multiSelected=t.multiSelected.concat(e.signId)}))},handleSizeChange:function(e){this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.refresh()},filterDataChange:function(e){this.filters=e,this.refresh()},export:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var n,r,a,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n={fleetId:e.$route.query.id?e.$route.query.id:e.$route.query.fleetId||"",ids:e.multiSelected.length>0?e.multiSelected:[],beginDateStr:e.filters[0].value[0],endDateStr:e.filters[0].value[1]},t.prev=1,t.next=4,u.a.post(f["s"].signUp.export,n,{responseType:"blob"});case 4:return r=t.sent,console.log("response => ",r),a=new Blob([r.data],{type:"application/vnd.ms-excel"}),i=decodeURI(r.headers["content-disposition"].split("filename=")[1]),o=document.createElement("a"),o.download=i.match(/"(\S*)"/)[1],o.style.display="none",o.href=URL.createObjectURL(a),document.body.appendChild(o),o.click(),URL.revokeObjectURL(o.href),document.body.removeChild(o),t.abrupt("return");case 19:throw t.prev=19,t.t0=t["catch"](1),new Error(t.t0);case 22:case"end":return t.stop()}}),t,null,[[1,19]])})))()},driverFormatter:function(e){return e.name||e.nickname},refresh:function(){var e=this,t={pageSize:this.pagination.pageSize,pageNumber:this.pagination.currentPage,fleetId:this.$route.query.id?this.$route.query.id:this.$route.query.fleetId||"",beginDateStr:this.filters[0].value[0],endDateStr:this.filters[0].value[1]};h.query(t,(function(t){e.tableData=t.content,e.pagination.total=Number(t.total)}),(function(t){console.log("ERR_REFRESH: ",t),e.$message({message:t.errorMessage,type:"warning"})}))},filterBuilder:function(e){var t=[],n=[];this.tableData.map((function(n){t=t.concat(n[e])}));var r=new Set(t);return t=Object(i["a"])(r),t=t.map((function(e){""===e?n.unshift({text:"无",value:""}):n=n.concat({text:e,value:e})})),n},filterHandler:function(e,t,n){var r=n.property;return t[r]===e},getFormatDate:function(){var e=new Date;this.filters[0].value[1]="".concat(e.getFullYear(),"-").concat(e.getMonth()<9?"0"+(e.getMonth()+1):e.getMonth()+1,"-").concat(e.getDate()<10?"0"+e.getDate():e.getDate());var t=function(){var e=new Date;return e.setDate(e.getDate()-30),"".concat(e.getFullYear(),"-").concat(e.getMonth()<9?"0"+(e.getMonth()+1):e.getMonth()+1,"-").concat(e.getDate()<10?"0"+e.getDate():e.getDate())};this.filters[0].value[0]=t()},queryKPI:function(){var e=this;p["a"].get(f["B"].kpi_signup,{fleetId:this.$route.query.id?this.$route.query.id:this.$route.query.fleetId||""}).then((function(t){e.$message({customClass:"motorists-club-activity__kpi",showClose:!0,message:"今日新增签到".concat(t.count,"条，您可按时间删选后导出记录进行签到管理统计哦 "),duration:3e3})})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)}))}},computed:{driverFilter:function(){var e=this.filterBuilder("name");return e},plateFilter:function(){var e=this.filterBuilder("carNumber");return e}},created:function(){this.getFormatDate(),this.refresh()},mounted:function(){this.queryKPI()},components:{BizFlexTable:c["c"]}},d=g,m=(n("3bbb"),n("2877")),b=Object(m["a"])(d,r,a,!1,null,null,null);t["default"]=b.exports},a9e3:function(e,t,n){"use strict";var r=n("83ab"),a=n("da84"),i=n("94ca"),o=n("6eeb"),c=n("5135"),s=n("c6b6"),l=n("7156"),u=n("c04e"),f=n("d039"),h=n("7c73"),p=n("241c").f,g=n("06cf").f,d=n("9bf2").f,m=n("58a8").trim,b="Number",v=a[b],S=v.prototype,I=s(h(S))==b,y=function(e){var t,n,r,a,i,o,c,s,l=u(e,!1);if("string"==typeof l&&l.length>2)if(l=m(l),t=l.charCodeAt(0),43===t||45===t){if(n=l.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:r=2,a=49;break;case 79:case 111:r=8,a=55;break;default:return+l}for(i=l.slice(2),o=i.length,c=0;c<o;c++)if(s=i.charCodeAt(c),s<48||s>a)return NaN;return parseInt(i,r)}return+l};if(i(b,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var D,w=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof w&&(I?f((function(){S.valueOf.call(n)})):s(n)!=b)?l(new v(y(t)),n,w):y(t)},N=r?p(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;N.length>E;E++)c(v,D=N[E])&&!c(w,D)&&d(w,D,g(v,D));w.prototype=S,S.constructor=w,o(a,b,w)}}}]);