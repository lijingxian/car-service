(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-deda9888"],{"5b8e":function(e,t,a){"use strict";var n=a("9678"),o=a.n(n);o.a},"5f6e":function(e,t,a){},7132:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:"biz-fade-t"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"biz-popup",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[a("transition",{attrs:{name:"biz-fade-t-right"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"popup-content",style:e.contentStyle},[e._t("default")],2)])],1)])},o=[],i={name:"BizPopup",props:{open:{type:Boolean,default:function(){return!1}},contentStyle:{type:Object,default:function(){return{}}}},data:function(){return{}},methods:{close:function(){this.$emit("close")}}},l=i,r=(a("5b8e"),a("2877")),s=Object(r["a"])(l,n,o,!1,null,null,null),c=s.exports,p=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"biz-popup-tabs"},[a("biz-popup",{attrs:{open:e.open,contentStyle:e.contentStyle},on:{close:e.close}},[a("el-tabs",{attrs:{type:"border-card",value:e.value},on:{"tab-click":e.tabClick}},[e._t("default")],2)],1)],1)},u=[],f=(a("b0c0"),{name:"BizPopupTabs",data:function(){return{}},props:{open:{type:Boolean,default:!1},value:{type:String,required:!0},contentStyle:{type:Object,default:function(){return{}}}},components:{BizPopup:c},methods:{close:function(){var e=this;this.$confirm("是否保存当前页面?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$emit("close")}))},tabClick:function(e){this.$emit("input",e.name)}}}),d=f,m=(a("d4c2"),Object(r["a"])(d,p,u,!1,null,null,null)),h=m.exports;a.d(t,"a",(function(){return h}))},"809f":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"user-operate-log"},[a("biz-flex-table",{ref:"table",attrs:{loading:e.loading,tableData:e.tableDataHandle,operations:e.operations,pagination:e.pagination,filters:e.filters,checkable:e.checkable},on:{"row-click":e.rowClick,"selection-change":e.handleSelectionChange,"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"filter-data-change":e.filterDataChange,operate:e.operate}},[a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"operation",label:"操作"}}),a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"operator",label:"操作用户"}}),a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"ip",label:"IP"}}),a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"clientType",label:"操作途径"}}),a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"result",label:"操作结果"}}),a("el-table-column",{staticClass:"biz-customcol",attrs:{prop:"createDate",label:"时间"}})],1),a("user-operate-popup",{attrs:{slot:"float",open:e.openPopup,id:e.curId},on:{close:e.closePopup,refreshNotification:e.refresh},slot:"float"})],1)},o=[],i=(a("4160"),a("d3b7"),a("159b"),a("04d3")),l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-popup-tabs",{attrs:{open:e.open},on:{close:e.close},model:{value:e.activeTabName,callback:function(t){e.activeTabName=t},expression:"activeTabName"}},[a("el-tab-pane",{attrs:{label:"日志信息",name:"0"}},[a("user-operate-info",{attrs:{open:e.open,id:e.id},on:{refreshNotification:e.refreshNotification}})],1)],1)},r=[],s=a("7132"),c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"user-operate-info"},[a("el-form",{attrs:{model:e.form,size:"small","label-width":"70px"}},[a("el-form-item",{attrs:{label:"操作"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.operation,callback:function(t){e.$set(e.form,"operation",t)},expression:"form.operation"}})],1),a("el-form-item",{attrs:{label:"操作用户"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.operator,callback:function(t){e.$set(e.form,"operator",t)},expression:"form.operator"}})],1),a("el-form-item",{attrs:{label:"IP"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.ip,callback:function(t){e.$set(e.form,"ip",t)},expression:"form.ip"}})],1),a("el-form-item",{attrs:{label:"操作途径"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.clientType,callback:function(t){e.$set(e.form,"clientType",t)},expression:"form.clientType"}})],1),a("el-form-item",{attrs:{label:"请求参数"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.parameter,callback:function(t){e.$set(e.form,"parameter",t)},expression:"form.parameter"}})],1),a("el-form-item",{attrs:{label:"操作结果"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.result,callback:function(t){e.$set(e.form,"result",t)},expression:"form.result"}})],1),a("el-form-item",{attrs:{label:"时间"}},[a("el-input",{attrs:{disabled:!0},model:{value:e.form.createDate,callback:function(t){e.$set(e.form,"createDate",t)},expression:"form.createDate"}})],1)],1)],1)},p=[],u=a("f36f"),f=a("1ab1"),d=a("c596"),m={name:"user-operate-info",data:function(){return{loading:!1,form:{ip:"",parameter:"",operator:"",operation:"",createDate:"",result:"",clientType:""}}},props:{open:{type:Boolean},id:{type:String,default:function(){return""}}},components:{BizGrid:u["a"]},computed:{},watch:{open:function(e){e&&this.refresh()}},methods:{refresh:function(){var e=this;this.loading=!0;var t={id:this.id,type:"2"};f["a"].get(d["g"].systemSetting.logUpdate,t).then((function(t){switch(e.loading=!1,console.log("信息",t),e.form.operation=void 0!==t.data?t.data.operation:"",e.form.operator=void 0!==t.data?t.data.operator:"",e.form.result=void 0!==t.data&&void 0!==t.data.result?t.data.result:"-",e.form.parameter=void 0!==t.data?t.data.parameter:"",e.form.ip=void 0!==t.data?t.data.ip:"",e.form.createDate=void 0!==t.data?t.data.createDate:"",e.form.clientType=void 0!==t.data?t.data.clientType:"-",e.form.clientType){case"android":e.form.clientType="安卓";break;case"ios":e.form.clientType="苹果";break;case"weixin":e.form.clientType="微信";break;case"applicaton":e.form.clientType="pc应用程序";break;case"defaultClientType":e.form.clientType="缺省";break;case"wechatMini":e.form.clientType="微信小程序";break;case"robot":e.form.clientType="机器人";break;default:break}})).catch((function(t){e.loading=!1,console.log(t.errorMessage)})).finally((function(){}))}}},h=m,b=(a("9b57"),a("2877")),g=Object(b["a"])(h,c,p,!1,null,null,null),v=g.exports,y={name:"user-operate-popup",data:function(){return{activeTabName:"0"}},props:{open:{type:Boolean},id:{type:String,default:function(){return""}}},components:{BizPopupTabs:s["a"],UserOperateInfo:v},computed:{},watch:{},methods:{close:function(e){this.$emit("close",e)},refreshNotification:function(e){this.$emit("refreshNotification",e)}}},T=y,k=(a("b4777"),Object(b["a"])(T,l,r,!1,null,null,null)),C=k.exports,w={name:"user-operate-log",data:function(){return{curId:"",openPopup:!1,loading:!1,tableData:[],selections:[],operations:[{label:"刷新",name:"refresh",type:""}],filters:[{type:"select",label:"操作结果",name:"operateResultValue",value:"成功",options:[{label:"成功",value:"成功"},{label:"失败",value:"失败"}]},{type:"daterange",label:"时间",name:"selectTime",value:[],startPlaceholder:"开始时间",endPlaceholder:"结束时间"},{type:"input",label:"",placeholder:"请输入操作/操作用户",name:"searchValue",value:""}],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0},checkable:!1}},props:{},components:{BizFlexTable:i["c"],UserOperatePopup:C},computed:{tableDataHandle:function(){var e=this.tableData;return e?(e.forEach((function(e){switch(e.clientType){case"android":e.clientType="安卓";break;case"ios":e.clientType="苹果";break;case"weixin":e.clientType="微信";break;case"applicaton":e.clientType="pc应用程序";break;case"defaultClientType":e.clientType="缺省";break;case"wechatMini":e.clientType="微信小程序";break;case"robot":e.clientType="机器人";break;default:break}})),e):[]}},watch:{},methods:{operate:function(e){this[e]()},refresh:function(){this.getList()},closePopup:function(){this.openPopup=!1},rowClick:function(e){console.log("rowClick"),this.openPopup=!0,this.curId=e.id},handleSelectionChange:function(e){console.log("handleSelectionChange"),this.selections=e},handleSizeChange:function(e){console.log("handleSizeChange"),this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,console.log("handleCurrentChange"),this.refresh()},filterDataChange:function(){this.pagination.currentPage=1,console.log("filterDataChange"),this.refresh()},getList:function(){var e=this,t={searchValue:this.filters[2].value,beginTimeStr:this.filters[1].value[0],endTimeStr:this.filters[1].value[1],pageNumber:this.pagination.currentPage,pageSize:this.pagination.pageSize,result:this.filters[0].value,type:"2"};t.beginTimeStr&&t.endTimeStr?(this.loading=!0,f["a"].get(d["g"].systemSetting.getLogsList,t).then((function(t){console.log("用户操作日志列表",t),e.tableData=t.contents,e.pagination.pageSize=parseInt(t.pageSize),e.pagination.currentPage=parseInt(t.pageNumber),e.pagination.total=parseInt(t.total),e.loading=!1})).catch((function(t){console.log(t),e.loading=!1})).finally((function(){}))):this.$message({showClose:!0,message:"请选择开始时间与截止时间"})},delete:function(){if(this.selections&&this.selections.length>0){var e=[];this.selections.forEach((function(t){e.push(t.id)})),this.deleteItem(e)}else this.$message("请选择一个分类")},deleteItem:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.loading=!0;var a={ids:e,type:"2"};f["a"].delete(d["g"].systemSetting.logUpdate,a).then((function(e){console.log(e),t.loading=!1,t.$message.success("删除成功"),t.refresh()})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)})).finally((function(){}))}))}},created:function(){var e=new Date,t=e.getFullYear()+"-"+parseInt(parseInt(e.getMonth())+1)+"-"+e.getDate();this.filters[1].value.push(t),this.filters[1].value.push(t),this.refresh()}},z=w,S=(a("fb06"),Object(b["a"])(z,n,o,!1,null,null,null));t["default"]=S.exports},9678:function(e,t,a){},"9b57":function(e,t,a){"use strict";var n=a("b313"),o=a.n(n);o.a},b313:function(e,t,a){},b4777:function(e,t,a){"use strict";var n=a("ee69"),o=a.n(n);o.a},d4c2:function(e,t,a){"use strict";var n=a("e725"),o=a.n(n);o.a},e725:function(e,t,a){},ee69:function(e,t,a){},fb06:function(e,t,a){"use strict";var n=a("5f6e"),o=a.n(n);o.a}}]);