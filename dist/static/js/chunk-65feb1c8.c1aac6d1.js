(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-65feb1c8"],{"0b9a":function(e,t,r){},"18a1":function(e,t,r){"use strict";var a=r("0b9a"),n=r.n(a);n.a},2497:function(e,t,r){"use strict";var a=r("4360"),n=r("a18c");t["a"]=function(e,t){return function(r){var o=r.data;"100"===o.resultCode?e(o):"709"===o.resultCode?(a["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",a["a"].getters.currentUser),n["a"].push("/login")):t(o)}}},"46c0":function(e,t,r){},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,r){var a=r("1d80"),n=r("5899"),o="["+n+"]",i=RegExp("^"+o+o+"*"),s=RegExp(o+o+"*$"),c=function(e){return function(t){var r=String(a(t));return 1&e&&(r=r.replace(i,"")),2&e&&(r=r.replace(s,"")),r}};e.exports={start:c(1),end:c(2),trim:c(3)}},"5b8e":function(e,t,r){"use strict";var a=r("9678"),n=r.n(a);n.a},7132:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("transition",{attrs:{name:"biz-fade-t"}},[r("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"biz-popup",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[r("transition",{attrs:{name:"biz-fade-t-right"}},[r("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"popup-content",style:e.contentStyle},[e._t("default")],2)])],1)])},n=[],o={name:"BizPopup",props:{open:{type:Boolean,default:function(){return!1}},contentStyle:{type:Object,default:function(){return{}}}},data:function(){return{}},methods:{close:function(){this.$emit("close")}}},i=o,s=(r("5b8e"),r("2877")),c=Object(s["a"])(i,a,n,!1,null,null,null),l=c.exports,u=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"biz-popup-tabs"},[r("biz-popup",{attrs:{open:e.open,contentStyle:e.contentStyle},on:{close:e.close}},[r("el-tabs",{attrs:{type:"border-card",value:e.value},on:{"tab-click":e.tabClick}},[e._t("default")],2)],1)],1)},m=[],p=(r("b0c0"),{name:"BizPopupTabs",data:function(){return{}},props:{open:{type:Boolean,default:!1},value:{type:String,required:!0},contentStyle:{type:Object,default:function(){return{}}}},components:{BizPopup:l},methods:{close:function(){var e=this;this.$confirm("是否保存当前页面?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$emit("close")}))},tabClick:function(e){this.$emit("input",e.name)}}}),f=p,d=(r("d4c2"),Object(s["a"])(f,u,m,!1,null,null,null)),h=d.exports;r.d(t,"a",(function(){return h}))},"926b":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"customer-service-cs-mgmt"},[a("biz-flex-table",{attrs:{operations:e.operations,filters:e.filters,tableData:e.tableData,pagination:e.pagination},on:{operate:e.operate,"filter-data-change":e.filterDataChange,"selection-change":e.handleSelectionChange,"row-click":e.rowClick,"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-table-column",{attrs:{width:"250",prop:"info",label:"客服信息"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticClass:"customer-info"},[t.row.head?a("img",{attrs:{src:t.row.head}}):a("img",{attrs:{src:r("624d")}}),a("div",{staticClass:"wrapper"},[a("div",{staticClass:"title"},[e._v(e._s(t.row.name))]),a("div",{staticClass:"gender"},["0"===t.row.gender?a("i",{staticClass:"male iconfont biz-icon-i-web-m"}):e._e(),"1"===t.row.gender?a("i",{staticClass:"female iconfont biz-icon-i-web-f"}):e._e(),"2"===t.row.gender?a("i",{staticClass:"none iconfont biz-icon-i-web-bm"}):e._e(),a("span",[e._v(e._s(t.row.mobile))])])])])]}}])}),a("el-table-column",{attrs:{width:"150",prop:"level",label:"权限"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s("0"===t.row.level?"客服":"主管")+" ")]}}])}),a("el-table-column",{attrs:{"min-width":"150",prop:"group",label:"分组"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticStyle:{width:"100%"}},[a("div",{staticClass:"overflow"},[e._v(" "+e._s(e.groupFormatter(t.row))+" ")])])]}}])}),a("el-table-column",{attrs:{width:"150",prop:"receptnumber",label:"接待数"}}),a("el-table-column",{attrs:{prop:"option",label:"操作",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return e.hasAuthDel?[a("el-button",{staticStyle:{color:"red"},attrs:{size:"mini",type:"text"},on:{click:function(r){return r.stopPropagation(),e.del(t.row.id)}}},[e._v("删除")])]:void 0}}],null,!0)})],1),a("biz-popup-tabs",{attrs:{open:e.open},on:{close:e.close},model:{value:e.tabName,callback:function(t){e.tabName=t},expression:"tabName"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"first"}},[a("base-info",{ref:"baseInfo",attrs:{itemId:e.currentRowId},on:{created:e.refresh}})],1)],1)],1)},n=[],o=(r("99af"),r("caad"),r("a15b"),r("d81d"),r("b0c0"),r("a9e3"),r("2532"),r("5530")),i=r("7132"),s=r("04d3"),c=r("624d"),l=r.n(c),u=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("biz-grid",{staticClass:"customer-service-base-info"},[r("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}),r("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"125px",size:"small","inline-message":!0}},[r("el-form-item",{attrs:{label:"用户名",prop:"username"}},[r("el-input",{attrs:{placeholder:"请输入账号"},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),""===e.itemId.id?r("el-form-item",{attrs:{label:"密码",prop:"password"}},[r("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入密码"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1):e._e(),""===e.itemId.id?r("el-form-item",{attrs:{label:"确认密码",prop:"checkpass"}},[r("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请确认密码"},model:{value:e.form.checkpass,callback:function(t){e.$set(e.form,"checkpass",t)},expression:"form.checkpass"}})],1):e._e(),r("el-form-item",{attrs:{label:"姓名",prop:"name"}},[r("el-input",{attrs:{placeholder:"请输入姓名"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("el-form-item",{attrs:{label:"昵称",prop:"nickname"}},[r("el-input",{attrs:{placeholder:"请输入昵称"},model:{value:e.form.nickname,callback:function(t){e.$set(e.form,"nickname",t)},expression:"form.nickname"}})],1),r("el-form-item",{attrs:{label:"手机号",prop:"mobile"}},[r("el-input",{attrs:{placeholder:"请输入手机号"},model:{value:e.form.mobile,callback:function(t){e.$set(e.form,"mobile",t)},expression:"form.mobile"}})],1),r("el-form-item",{attrs:{label:"头像设置",prop:"head"}},[r("BizAvatarUploaderNew",{model:{value:e.form.head,callback:function(t){e.$set(e.form,"head",t)},expression:"form.head"}})],1),r("el-form-item",{attrs:{label:"角色设置",prop:"level"}},[r("el-radio",{attrs:{label:"0"},model:{value:e.form.level,callback:function(t){e.$set(e.form,"level",t)},expression:"form.level"}},[e._v("客服")]),r("el-radio",{attrs:{label:"1"},model:{value:e.form.level,callback:function(t){e.$set(e.form,"level",t)},expression:"form.level"}},[e._v("主管")])],1),r("el-collapse",{model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[r("el-collapse-item",{attrs:{name:"1"}},[r("template",{slot:"title"},[r("span",{staticStyle:{"margin-left":"38px"}},[e._v("群组设置")])]),r("el-form-item",[r("el-checkbox-group",{model:{value:e.selectedGroup,callback:function(t){e.selectedGroup=t},expression:"selectedGroup"}},e._l(e.groupList,(function(t){return r("el-checkbox",{key:t.index,attrs:{label:t.id}},[e._v(e._s(t.name))])})),1)],1)],2)],1),r("el-form-item",{staticClass:"recept-number",attrs:{label:"接待数",prop:"receptnumber"}},[r("el-input",{attrs:{type:"number",max:1e3,min:0},model:{value:e.form.receptnumber,callback:function(t){e.$set(e.form,"receptnumber",t)},expression:"form.receptnumber"}})],1)],1)],1)},m=[],p=(r("d3b7"),r("25f0"),r("f36f")),f=r("8330"),d=r("c17f"),h=r("ef20"),g={name:"CustomerServiceBaseInfo",components:{BizGrid:p["a"],BizSaveButton:f["a"],BizAvatarUploaderNew:d["b"]},props:{itemId:{type:Object,default:function(){return{id:""}}}},data:function(){var e=this,t=function(t,r,a){""===r?a(new Error("请输入密码")):(""!==e.form.checkpass&&e.$refs.form.validateField("checkpass"),a())},r=function(t,r,a){""===r?a(new Error("请再次输入密码")):r!==e.form.password?a(new Error("两次输入密码不一致!")):a()},a=function(e,t,r){parseInt(t)>1e3?r(new Error("最大接待人数不能大于1000")):r()};return{rules:{username:[{required:!0,message:"账号不能为空",trigger:"blur"},{pattern:/^[0-9a-zA-Z]+$/,message:"用户名只能为数字或字母",trigger:"blur"},{min:4,max:20,message:"长度在4-20位",trigger:"blur"}],name:[{required:!0,message:"请输入姓名",trigger:"blur"},{max:20,message:"长度不能大于20位",trigger:"blur"}],nickname:[{required:!0,message:"请输入昵称",trigger:"blur"},{max:20,message:"长度不能大于20位",trigger:"blur"}],receptnumber:[{required:!0,message:"请输入最大接待人数",trigger:"blur"},{pattern:/^\d+$/,message:"请输入整数",trigger:"blur"},{validator:a,trigger:"blur"}],mobile:[{required:!0,message:"请输入手机号码",trigger:"blur"},{len:11,message:"手机号位数错误",trigger:"blur"},{pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message:"手机号格式错误",trigger:"blur"}],password:[{validator:t,trigger:"blur"},{required:!0,min:6,max:16,message:"长度在6-16个字符",trigger:"blur"}],checkpass:[{required:!0,validator:r,trigger:"blur"}],level:[{required:!0,message:"您还未选择角色",trigger:"change"}]},id:"",activeName:"1",groupList:[],selectedGroup:[],operations:[{label:"保存",name:"save",type:"primary",auth:["admin:customerServiceMember.edit"]}],form:this.setOriginFormData(),loading:!1}},methods:{operate:function(e){this[e]()},setOriginFormData:function(){return{csGroupList:[],username:"",password:"",checkpass:"",name:"",nickname:"",mobile:"",receptnumber:0,head:"/resources/admin/images/Avatar.png",level:"0"}},showMessage:function(e,t){this.$notify({showClose:!0,message:e,type:t})},clear:function(){this.selectedGroup=[],this.form=this.setOriginFormData(),this.$refs.form.resetFields()},refresh:function(){var e=this;this.clear();var t={id:this.itemId.id,shopId:window.top.SHOP_ID||""};this.loading=!0,h["a"].query(t,(function(t){e.loading=!1,e.form=t.data,e.form.receptnumber=Number(t.data.receptnumber),e.selectedGroup=t.data.csGroupList.map((function(e){return e.id}))}),(function(t){e.loading=!1,e.$message.warning(t.errorMessage),console.log("ERR_REFRESH: ",t)}))},queryGroup:function(){var e=this,t={pageSize:200,pageNumber:1,shopId:window.top.SHOP_ID||""};h["a"].queryGroup(t,(function(t){e.groupList=t.dataList}),(function(e){console.log("ERR_QUERY_GROUP: ",e)}))},save:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;e.submit()}))},submit:function(){this.itemId.id?this.update():this.create()},create:function(){var e=this;this.form.receptnumber.toString();var t=Object.assign(this.form,{csGroupList:this.csGroupList});this.loading=!0,h["a"].create(t,(function(t){e.loading=!1,e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.loading=!1,e.$message.warning(t.errorMessage),console.log("ERR_CREATE: ",t)}))},update:function(){var e=this;this.form.receptnumber.toString();var t=Object.assign({id:this.itemId.id},this.form,{csGroupList:this.csGroupList});this.loading=!0,h["a"].update(t,(function(t){e.loading=!1,e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.loading=!1,e.$message.warning(t.errorMessage),console.log("ERR_UPDATE: ",t)}))},handleUploadSuccess:function(e){this.form.head=e}},computed:{csGroupList:function(){return this.selectedGroup.map((function(e){return{id:e}}))}},mounted:function(){this.queryGroup(),this.refresh()},watch:{itemId:function(){this.$refs.form.$el.scrollTop=0,this.itemId.id?this.refresh():this.clear()}}},b=g,v=(r("18a1"),r("2877")),w=Object(v["a"])(b,u,m,!1,null,null,null),S=w.exports,k=r("2f62"),y={name:"CSMgmt",data:function(){return{Img:l.a,open:!1,tabName:"first",currentRowId:{id:""},operations:[{label:"添加",name:"add",type:"primary",auth:["admin:customerServiceMember.add"]},{label:"删除",name:"del",type:"",disabled:!0,auth:["admin:customerServiceMember.delete"]}],filters:[],tableData:[],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0},multiSelected:[]}},computed:Object(o["a"])(Object(o["a"])({},Object(k["c"])("Authority",["currentAuth"])),{},{hasAuthDel:function(){return this.currentAuth.includes("admin:customerServiceMember.delete")}}),methods:{operate:function(e){this[e]()},add:function(){this.currentRowId={id:""},this.tabName="first",this.open=!0},del:function(e){var t=this,r=e?Array(e):this.multiSelected;0!==r.length?this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var e={ids:r};console.log("params: ",e),h["a"].delete(e,(function(e){t.$message.success("操作成功"),t.refresh()}),(function(e){t.$message.warning(e.errorMessage),console.log("ERR_DELETE: ",e)}))})):this.$message.warning("未选择删除条目")},refresh:function(){var e=this,t={pageSize:this.pagination.pageSize,pageNumber:this.pagination.currentPage,searchValue:this.$route.query?this.$route.name:"",shopId:window.top.SHOP_ID||""};h["a"].queryList(t,(function(t){e.tableData=t.content,e.pagination.total=Number(t.total)}),(function(t){"店铺不存在"!==t.errorMessage&&(e.$message.warning(t.errorMessage),console.log("ERR_REFRESH: ",t))}))},showMessage:function(e,t){this.$message({message:e,type:t,showClose:!0})},handleSelectionChange:function(e){var t=this;this.multiSelected=[],e.map((function(e){t.multiSelected=t.multiSelected.concat(e.id)})),this.operations.map((function(t){"del"===t.name&&(t.disabled=!0),e.length>0&&"del"===t.name&&(t.disabled=!1)}))},rowClick:function(e){this.currentRowId={id:e.id},this.shopId=e.shopId,this.tabName="first",this.open=!0},close:function(){this.open=!1},handleSizeChange:function(e){this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.refresh()},groupFormatter:function(e,t){var r=e.csGroupList.map((function(e){return e.name}));return r.join()},filterDataChange:function(){}},mounted:function(){this.showMessage("对客服人员进行增删改","info"),this.refresh()},components:{BizPopupTabs:i["a"],BizFlexTable:s["c"],BaseInfo:S}},_=y,C=(r("a27b"),Object(v["a"])(_,a,n,!1,null,null,null));t["default"]=C.exports},9678:function(e,t,r){},a27b:function(e,t,r){"use strict";var a=r("46c0"),n=r.n(a);n.a},a9e3:function(e,t,r){"use strict";var a=r("83ab"),n=r("da84"),o=r("94ca"),i=r("6eeb"),s=r("5135"),c=r("c6b6"),l=r("7156"),u=r("c04e"),m=r("d039"),p=r("7c73"),f=r("241c").f,d=r("06cf").f,h=r("9bf2").f,g=r("58a8").trim,b="Number",v=n[b],w=v.prototype,S=c(p(w))==b,k=function(e){var t,r,a,n,o,i,s,c,l=u(e,!1);if("string"==typeof l&&l.length>2)if(l=g(l),t=l.charCodeAt(0),43===t||45===t){if(r=l.charCodeAt(2),88===r||120===r)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:a=2,n=49;break;case 79:case 111:a=8,n=55;break;default:return+l}for(o=l.slice(2),i=o.length,s=0;s<i;s++)if(c=o.charCodeAt(s),c<48||c>n)return NaN;return parseInt(o,a)}return+l};if(o(b,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var y,_=function(e){var t=arguments.length<1?0:e,r=this;return r instanceof _&&(S?m((function(){w.valueOf.call(r)})):c(r)!=b)?l(new v(k(t)),r,_):k(t)},C=a?f(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),I=0;C.length>I;I++)s(v,y=C[I])&&!s(_,y)&&h(_,y,d(v,y));_.prototype=w,w.constructor=_,i(n,b,_)}},d4c2:function(e,t,r){"use strict";var a=r("e725"),n=r.n(a);n.a},e725:function(e,t,r){},ef20:function(e,t,r){"use strict";var a=r("2497"),n=r("bc3a"),o=r.n(n),i=r("c596");t["a"]={queryList:function(e,t,r){o.a.get(i["g"].customerService.CSList,{params:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},queryGroup:function(e,t,r){o.a.get(i["g"].customerService.CSGroupList,{params:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},query:function(e,t,r){o.a.get(i["g"].customerService.CSQuery,{params:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},update:function(e,t,r){o.a.put(i["g"].customerService.CSQuery,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},create:function(e,t,r){o.a.post(i["g"].customerService.CSQuery,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},delete:function(e,t,r){o.a.delete(i["g"].customerService.CSQuery,{data:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},getManhour:function(e,t,r){o.a.get(i["g"].customerService.manhour,{params:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},updateManhour:function(e,t,r){o.a.post(i["g"].customerService.manhour,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},createBlack:function(e,t,r){o.a.post(i["g"].customerService.CreateBlack,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},passBlack:function(e,t,r){o.a.post(i["g"].customerService.PassBlack,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},getBlackList:function(e,t,r){o.a.get(i["g"].customerService.BlackList,{params:e}).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))},recoverBlack:function(e,t,r){o.a.post(i["g"].customerService.RecoverBlack,e).then(Object(a["a"])(t,r)).catch((function(e){console.error(e)}))}}}}]);