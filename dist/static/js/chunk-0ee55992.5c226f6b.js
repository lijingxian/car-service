(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0ee55992"],{"13d9":function(e,t,n){"use strict";var a=n("a41e"),o=n.n(a);o.a},2497:function(e,t,n){"use strict";var a=n("4360"),o=n("a18c");t["a"]=function(e,t){return function(n){var r=n.data;"100"===r.resultCode?e(r):"709"===r.resultCode?(a["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",a["a"].getters.currentUser),o["a"].push("/login")):t(r)}}},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var a=n("1d80"),o=n("5899"),r="["+o+"]",c=RegExp("^"+r+r+"*"),i=RegExp(r+r+"*$"),s=function(e){return function(t){var n=String(a(t));return 1&e&&(n=n.replace(c,"")),2&e&&(n=n.replace(i,"")),n}};e.exports={start:s(1),end:s(2),trim:s(3)}},"5b8e":function(e,t,n){"use strict";var a=n("9678"),o=n.n(a);o.a},7132:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"biz-fade-t"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"biz-popup",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[n("transition",{attrs:{name:"biz-fade-t-right"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"popup-content",style:e.contentStyle},[e._t("default")],2)])],1)])},o=[],r={name:"BizPopup",props:{open:{type:Boolean,default:function(){return!1}},contentStyle:{type:Object,default:function(){return{}}}},data:function(){return{}},methods:{close:function(){this.$emit("close")}}},c=r,i=(n("5b8e"),n("2877")),s=Object(i["a"])(c,a,o,!1,null,null,null),l=s.exports,u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"biz-popup-tabs"},[n("biz-popup",{attrs:{open:e.open,contentStyle:e.contentStyle},on:{close:e.close}},[n("el-tabs",{attrs:{type:"border-card",value:e.value},on:{"tab-click":e.tabClick}},[e._t("default")],2)],1)],1)},p=[],f=(n("b0c0"),{name:"BizPopupTabs",data:function(){return{}},props:{open:{type:Boolean,default:!1},value:{type:String,required:!0},contentStyle:{type:Object,default:function(){return{}}}},components:{BizPopup:l},methods:{close:function(){var e=this;this.$confirm("是否保存当前页面?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$emit("close")}))},tabClick:function(e){this.$emit("input",e.name)}}}),m=f,h=(n("d4c2"),Object(i["a"])(m,u,p,!1,null,null,null)),g=h.exports;n.d(t,"a",(function(){return g}))},9678:function(e,t,n){},a41e:function(e,t,n){},a77f:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"service-project"},[n("biz-table",{attrs:{operations:e.operations,tableData:e.tableData,pagination:e.pagination},on:{operate:e.operate,handleSelectionChange:e.handleSelectionChange,rowClick:e.rowClick,handleSizeChange:e.handleSizeChange,handleCurrentChange:e.handleCurrentChange}},[n("el-table-column",{attrs:{type:"selection",width:"50"}}),n("el-table-column",{attrs:{prop:"name",label:"项目"}}),n("el-table-column",{attrs:{prop:"price",label:"价格(元)"}}),n("el-table-column",{attrs:{prop:"remark",label:"描述"}}),n("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return n("div",{},[n("div",{staticClass:"biz-customcol"},[n("el-button",{staticClass:"delete-btn",attrs:{type:"text",size:"mini"},on:{click:function(n){return n.stopPropagation(),e.deleteProject(t.row.id)}}},[e._v(" 删除 ")])],1)])}}])})],1),n("biz-popup-tabs",{attrs:{open:e.open},on:{close:function(t){e.open=!1}},model:{value:e.tabName,callback:function(t){e.tabName=t},expression:"tabName"}},[n("el-tab-pane",{attrs:{label:"基本信息",name:"first"}},[n("service-project-item",{ref:"item",attrs:{projectId:e.projectId},on:{created:e.refresh}})],1)],1),n("el-dialog",{staticClass:"service-project-d",attrs:{title:"从平台导入",visible:e.dialogVisible,width:"700px"},on:{close:function(t){e.dialogVisible=!1}}},[n("el-button",{attrs:{size:"small",type:"primary",disabled:e.dialogValid},on:{click:e.save}},[e._v("保存")]),n("biz-list",{attrs:{tableData:e.dialogTableData,height:"500"},on:{handleSelectionChange:e.handleDialogSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"50"}}),n("el-table-column",{attrs:{prop:"name",label:"项目"}}),n("el-table-column",{attrs:{prop:"price",label:"价格(元)"}})],1)],1)],1)},o=[],r=(n("a9e3"),n("b85c")),c=n("5530"),i=n("ff65"),s=n("7132"),l=n("04d3"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("biz-grid",{staticClass:"service-project-item"},[n("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}),n("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"100px",size:"small","inline-message":!0}},[n("el-form-item",{attrs:{label:"项目",prop:"name"}},[n("el-input",{attrs:{placeholder:"请输入项目名称"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),n("el-form-item",{attrs:{label:"价格",prop:"price"}},[n("el-input",{attrs:{placeholder:"请输入价格"},model:{value:e.form.price,callback:function(t){e.$set(e.form,"price",t)},expression:"form.price"}})],1),n("el-form-item",{attrs:{label:"描述"}},[n("el-input",{attrs:{placeholder:"请填写描述",type:"textarea",rows:2},model:{value:e.form.remark,callback:function(t){e.$set(e.form,"remark",t)},expression:"form.remark"}})],1)],1)],1)},p=[],f=(n("b0c0"),n("f36f")),m=n("8330"),h={name:"ServiceProjectItem",data:function(){var e=function(e,t,n){isNaN(t)?n(new Error("请输入数字值")):t<0?n(new Error("必须输入正数")):n()};return{loading:!1,form:{name:"",price:"",remark:""},operations:[{label:"保存",name:"save",type:"primary"}],rules:{name:[{required:!0,message:"请输入项目名称",trigger:"blur"}],price:[{required:!0,message:"请输入项目价格",trigger:"blur"},{validator:e,trigger:"blur"}]}}},props:{projectId:String},components:{BizGrid:f["a"],BizSaveButton:m["a"]},methods:{operate:function(e){this[e]()},refresh:function(){var e=this;this.loading=!0;var t={id:this.projectId};i["a"].getServiceProject(t,(function(t){e.form.name=t.appointmentItem.name,e.form.price=t.appointmentItem.price,e.form.remark=t.appointmentItem.remark,e.loading=!1}),(function(t){console.log(t),e.loading=!1}))},clear:function(){this.form.name="",this.form.price="",this.form.remark=""},save:function(){var e=this;this.$refs.form.validate((function(t){t&&(e.projectId?e.update():e.create())}))},create:function(){var e=this;this.loading=!0;var t={shopId:window.top.SHOP_ID||"",name:this.form.name,price:this.form.price,remark:this.form.remark};i["a"].createServiceProject(t,(function(t){e.$emit("created"),e.loading=!1,e.$message.success("操作成功"),e.clear()}),(function(t){console.log(t),e.loading=!1,e.$message.warning(t.errorMessage)}))},update:function(){var e=this;this.loading=!0;var t={id:this.projectId,shopId:window.top.SHOP_ID||"",name:this.form.name,price:this.form.price,remark:this.form.remark};i["a"].updateServiceProject(t,(function(t){e.$emit("created"),e.loading=!1,e.$message.success("操作成功")}),(function(t){console.log(t),e.loading=!1}))}}},g=h,d=(n("db24"),n("2877")),b=Object(d["a"])(g,u,p,!1,null,null,null),v=b.exports,j=n("2f62"),S={name:"ServiceProject",data:function(){return{user:{},projectId:"",tabName:"first",tags:[],open:!1,dialogVisible:!1,dialogValid:!0,multipleSelection:[],multipleDialogSelection:[],operations:[{label:"添加",name:"add",type:"primary"},{label:"删除",name:"deleteOperate",type:"",disabled:!0},{label:"平台导入",name:"getPlatformService",type:"primary"}],tableData:[],dialogTableData:[],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:9}}},components:{BizList:l["e"],BizTable:l["g"],BizPopupTabs:s["a"],ServiceProjectItem:v},created:function(){this.getInitInfo(),this.refresh()},methods:Object(c["a"])(Object(c["a"])({},Object(j["c"])(["getUser"])),{},{operate:function(e){this[e]()},save:function(){var e,t=this,n=[],a=Object(r["a"])(this.multipleDialogSelection);try{for(a.s();!(e=a.n()).done;){var o=e.value;n.push(o.id)}}catch(s){a.e(s)}finally{a.f()}var c={shopId:window.top.SHOP_ID||"",ids:n};this.dialogVisible=!1,i["a"].importFromPlatform(c,(function(e){t.$message({type:"success",message:"导入成功!"}),t.refresh()}),(function(e){console.log(e),t.$message.warning(e.errorMessage)}))},getInitInfo:function(){this.user=this.getUser(),"shop"!==this.user.roleLevel&&this.operations.pop()},add:function(){var e=this;this.projectId="",this.$nextTick((function(){e.open=!0,e.$refs.item.clear()}))},deleteProject:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var n=[];n.push(e),t.delete(n)})).catch((function(){}))},deleteOperate:function(){var e=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t,n=[],a=Object(r["a"])(e.multipleSelection);try{for(a.s();!(t=a.n()).done;){var o=t.value;n.push(o.id)}}catch(c){a.e(c)}finally{a.f()}e.delete(n)})).catch((function(){}))},delete:function(e){var t=this,n={ids:e};i["a"].deleteServiceProject(n,(function(e){t.$message({type:"success",message:"删除成功!"}),t.refresh()}),(function(e){t.$message({type:"warning",message:e.errorMessage})}))},refresh:function(){var e=this,t={shopId:window.top.SHOP_ID||"",pageNumber:this.pagination.currentPage,pageSize:this.pagination.pageSize};i["a"].getServiceProjectList(t,(function(t){e.tableData=t.appointmentItemList,e.pagination.total=Number(t.total)}),(function(e){console.log(e)}))},getPlatformService:function(){var e=this,t={shopId:window.top.SHOP_ID||"",pageNumber:"1",pageSize:"999"};i["a"].getPlatformService(t,(function(t){e.dialogTableData=t.appointmentItemList,e.dialogVisible=!0}),(function(e){console.log(e)}))},handleSelectionChange:function(e){this.operations[1].disabled=!0,e.length>0&&(this.operations[1].disabled=!1),this.multipleSelection=e},handleDialogSelectionChange:function(e){this.dialogValid=!0,e.length>0&&(this.dialogValid=!1),this.multipleDialogSelection=e},rowClick:function(e){var t=this;this.projectId=e.id,this.$nextTick((function(){t.open=!0,t.$refs.item.refresh()}))},handleSizeChange:function(e){this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.refresh()}})},O=S,y=(n("13d9"),Object(d["a"])(O,a,o,!1,null,null,null));t["default"]=y.exports},a9e3:function(e,t,n){"use strict";var a=n("83ab"),o=n("da84"),r=n("94ca"),c=n("6eeb"),i=n("5135"),s=n("c6b6"),l=n("7156"),u=n("c04e"),p=n("d039"),f=n("7c73"),m=n("241c").f,h=n("06cf").f,g=n("9bf2").f,d=n("58a8").trim,b="Number",v=o[b],j=v.prototype,S=s(f(j))==b,O=function(e){var t,n,a,o,r,c,i,s,l=u(e,!1);if("string"==typeof l&&l.length>2)if(l=d(l),t=l.charCodeAt(0),43===t||45===t){if(n=l.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:a=2,o=49;break;case 79:case 111:a=8,o=55;break;default:return+l}for(r=l.slice(2),c=r.length,i=0;i<c;i++)if(s=r.charCodeAt(i),s<48||s>o)return NaN;return parseInt(r,a)}return+l};if(r(b,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var y,k=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof k&&(S?p((function(){j.valueOf.call(n)})):s(n)!=b)?l(new v(O(t)),n,k):O(t)},I=a?m(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),P=0;I.length>P;P++)i(v,y=I[P])&&!i(k,y)&&g(k,y,h(v,y));k.prototype=j,j.constructor=k,c(o,b,k)}},d4c2:function(e,t,n){"use strict";var a=n("e725"),o=n.n(a);o.a},db24:function(e,t,n){"use strict";var a=n("de34"),o=n.n(a);o.a},de34:function(e,t,n){},e725:function(e,t,n){},ff65:function(e,t,n){"use strict";var a=n("2497"),o=n("bc3a"),r=n.n(o),c=n("c596");t["a"]={getServiceProjectList:function(e,t,n){r.a.get(c["g"].maintenance.serviceProjectList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getServiceProject:function(e,t,n){r.a.get(c["g"].maintenance.serviceProject,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},createServiceProject:function(e,t,n){r.a.post(c["g"].maintenance.serviceProject,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},updateServiceProject:function(e,t,n){r.a.put(c["g"].maintenance.serviceProject,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},deleteServiceProject:function(e,t,n){r.a.delete(c["g"].maintenance.serviceProject,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},importFromPlatform:function(e,t,n){r.a.post(c["g"].maintenance.importFromPlatform,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},importFromExcel:function(e,t,n){r.a.post(c["g"].maintenance.importFromExcel,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},importBooklet:function(e,t,n){r.a.post(c["g"].maintenance.importBooklet,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getPlatformService:function(e,t,n){r.a.get(c["g"].maintenance.platformService,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getServiceProjectAllList:function(e,t,n){r.a.get(c["g"].maintenance.serviceProjectAllList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getServiceList:function(e,t,n){r.a.get(c["g"].maintenance.queryOrderList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getServiceHandbookList:function(e,t,n){r.a.get(c["g"].maintenance.serviceHandbookList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},createServiceHandbook:function(e,t,n){r.a.post(c["g"].maintenance.serviceHandbook,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getServiceHandbook:function(e,t,n){r.a.get(c["g"].maintenance.serviceHandbook,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},updateServiceHandbook:function(e,t,n){r.a.put(c["g"].maintenance.serviceHandbook,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},deleteServiceHandbook:function(e,t,n){r.a.delete(c["g"].maintenance.serviceHandbook,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},importServiceHandbook:function(e,t,n){r.a.post(c["g"].maintenance.importServiceHandbook,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getMotorcycleType:function(e,t,n){r.a.get(c["g"].maintenance.MotorcycleType,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},CreateMotorcycleType:function(e,t,n){r.a.post(c["g"].maintenance.CreateMotorcycleType,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getRescueOrgList:function(e,t,n){r.a.get(c["g"].maintenance.RescueOrgList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},createRescueOrg:function(e,t,n){r.a.post(c["g"].maintenance.RescueOrg,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getRescueOrg:function(e,t,n){r.a.get(c["g"].maintenance.RescueOrg,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},updateRescueOrg:function(e,t,n){r.a.put(c["g"].maintenance.RescueOrg,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},deleteRescueOrg:function(e,t,n){r.a.delete(c["g"].maintenance.RescueOrg,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},getUpkeepList:function(e,t,n){},listMaintainBooklet:function(e,t,n){r.a.get(c["g"].maintenance.listMaintainBooklet,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},maintainBookletQuery:function(e,t,n){r.a.get(c["g"].maintenance.maintainBooklet,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},maintainBookletUpdate:function(e,t,n){r.a.put(c["g"].maintenance.maintainBooklet,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},maintainBookletCreate:function(e,t,n){r.a.post(c["g"].maintenance.maintainBooklet,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},maintainBookletDelete:function(e,t,n){r.a.delete(c["g"].maintenance.maintainBooklet,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},queryBrandList:function(e,t,n){r.a.get(c["g"].maintenance.queryBrandList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},querySeriesList:function(e,t,n){r.a.get(c["g"].maintenance.querySeriesList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},queryModeList:function(e,t,n){r.a.get(c["g"].maintenance.queryModeList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},querySysBrandList:function(e,t,n){r.a.get(c["g"].maintenance.brandList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},querySysSeriesList:function(e,t,n){r.a.post(c["g"].maintenance.seriesList,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},querySysModeList:function(e,t,n){r.a.post(c["g"].maintenance.modelList,e).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},listCarType:function(e,t,n){r.a.get(c["g"].maintenance.queryModeList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},baseData:function(e,t,n){r.a.get(c["g"].maintenance.baseData,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},bookletbaseData:function(e,t,n){r.a.get(c["g"].maintenance.bookletbaseData,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},bookletShopData:function(e,t,n){r.a.get(c["g"].maintenance.bookletShopData,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},queryImportProgress:function(e,t,n){r.a.get(c["g"].maintenance.queryImportProgress,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},queryImportBaseProgress:function(e,t,n){r.a.get(c["g"].maintenance.queryImportBaseProgress,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))}}}}]);