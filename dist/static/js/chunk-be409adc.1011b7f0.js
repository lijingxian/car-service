(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-be409adc"],{"0785":function(e,t,a){"use strict";var i=a("23f2"),n=a.n(i);n.a},"0d91":function(e,t,a){"use strict";var i=a("3696"),n=a.n(i);n.a},"23f2":function(e,t,a){},2497:function(e,t,a){"use strict";var i=a("4360"),n=a("a18c");t["a"]=function(e,t){return function(a){var o=a.data;"100"===o.resultCode?e(o):"709"===o.resultCode?(i["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",i["a"].getters.currentUser),n["a"].push("/login")):t(o)}}},3696:function(e,t,a){},"41af":function(e,t,a){},"4caf":function(e,t,a){"use strict";var i=a("2497"),n=a("bc3a"),o=a.n(n),r=a("c596");t["a"]={add:function(e,t,a){o.a.get(r["g"].staffMgmt.adminAdd,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},get:function(e,t,a){o.a.get(r["g"].staffMgmt.adminSelect,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},create:function(e,t,a){o.a.post(r["g"].staffMgmt.adminCreate,e).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},save:function(e,t,a){o.a.put(r["g"].staffMgmt.adminEdit,e).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},getCompanies:function(e,t,a){o.a.get(r["g"].staffMgmt.getCompanyList,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},getShops:function(e,t,a){o.a.get(r["g"].staffMgmt.getShopList,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},getChildShops:function(e,t,a){o.a.get(r["g"].staffMgmt.getChildShopList,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},getAllRoles:function(e,t,a){o.a.get(r["g"].staffMgmt.getAllRoles,{params:e}).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))},editPass:function(e,t,a){o.a.put(r["g"].staffMgmt.editPass,e).then(Object(i["a"])(t,a)).catch((function(e){console.error(e)}))}}},"4f25":function(e,t,a){"use strict";var i=a("41af"),n=a.n(i);n.a},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,a){var i=a("1d80"),n=a("5899"),o="["+n+"]",r=RegExp("^"+o+o+"*"),s=RegExp(o+o+"*$"),l=function(e){return function(t){var a=String(i(t));return 1&e&&(a=a.replace(r,"")),2&e&&(a=a.replace(s,"")),a}};e.exports={start:l(1),end:l(2),trim:l(3)}},"5b8e":function(e,t,a){"use strict";var i=a("9678"),n=a.n(i);n.a},7132:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:"biz-fade-t"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"biz-popup",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[a("transition",{attrs:{name:"biz-fade-t-right"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"popup-content",style:e.contentStyle},[e._t("default")],2)])],1)])},n=[],o={name:"BizPopup",props:{open:{type:Boolean,default:function(){return!1}},contentStyle:{type:Object,default:function(){return{}}}},data:function(){return{}},methods:{close:function(){this.$emit("close")}}},r=o,s=(a("5b8e"),a("2877")),l=Object(s["a"])(r,i,n,!1,null,null,null),c=l.exports,d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"biz-popup-tabs"},[a("biz-popup",{attrs:{open:e.open,contentStyle:e.contentStyle},on:{close:e.close}},[a("el-tabs",{attrs:{type:"border-card",value:e.value},on:{"tab-click":e.tabClick}},[e._t("default")],2)],1)],1)},m=[],u=(a("b0c0"),{name:"BizPopupTabs",data:function(){return{}},props:{open:{type:Boolean,default:!1},value:{type:String,required:!0},contentStyle:{type:Object,default:function(){return{}}}},components:{BizPopup:c},methods:{close:function(){var e=this;this.$confirm("是否保存当前页面?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$emit("close")}))},tabClick:function(e){this.$emit("input",e.name)}}}),f=u,p=(a("d4c2"),Object(s["a"])(f,d,m,!1,null,null,null)),g=p.exports;a.d(t,"a",(function(){return g}))},7145:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"admin-mgmt"},[a("biz-flex-table",{ref:"table",attrs:{operations:e.operations,filters:e.filters,tableData:e.tableData,loading:e.loading,pagination:e.pagination},on:{operate:e.handleOperate,"size-change":e.handlePageSizeChange,"current-change":e.handleCurrentPageChange,"filter-data-change":e.handleFilterDataChange,"row-click":e.handleRowClick}},[a("el-table-column",{attrs:{label:"用户",prop:"name"},scopedSlots:e._u([{key:"default",fn:function(t){return a("div",{},[a("div",{staticClass:"customer-info"},[a("img",{attrs:{src:t.row.head?t.row.head:e.Img,alt:""}}),a("div",{staticClass:"wrapper"},[a("div",{staticClass:"title"},[e._v(e._s(t.row.name))]),a("div",{staticClass:"gender"},["0"===t.row.gender?a("i",{staticClass:"male iconfont biz-icon-i-web-m"}):e._e(),"1"===t.row.gender?a("i",{staticClass:"female iconfont biz-icon-i-web-f"}):e._e(),"2"===t.row.gender?a("i",{staticClass:"none iconfont biz-icon-i-web-bm"}):e._e(),a("span",[e._v(e._s(t.row.mobile))])])])])])}}])}),a("el-table-column",{attrs:{prop:"isEnabled",label:"状态","min-width":"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{style:{color:e.stateColor(t.row)}},[e._v(e._s("1"===t.row.isEnabled?"启用":"停用"))])]}}])}),a("el-table-column",{attrs:{"min-width":"100",prop:"loginAddress",label:"最后登录地址"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s("null"===t.row.loginAddress?"":t.row.loginAddress))]}}])}),a("el-table-column",{attrs:{"min-width":"150",prop:"loginDate",label:"最后登录日期",sortable:"custom"}}),a("el-table-column",{attrs:{prop:"tag",label:"操作",width:"130"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return a.stopPropagation(),e.handleAdminDelete(a,t.row)}}},[e._v("删除")]),"0"===t.row.opeateState?a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return a.stopPropagation(),e.handleAdminSetting(a,t.row)}}},[e._v("设置为管理员")]):e._e(),"1"===t.row.opeateState?a("el-button",{attrs:{type:"text",size:"mini",disabled:!0}},[e._v("已设置")]):e._e()]}}])})],1),a("div",{attrs:{slot:"float"},slot:"float"},[a("biz-popup-tabs",{attrs:{open:e.openBaseInfo},on:{close:function(t){e.openBaseInfo=!1}},model:{value:e.tabNameBase,callback:function(t){e.tabNameBase=t},expression:"tabNameBase"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"0"}},[a("new-user",{attrs:{itemId:e.itemId,masterId:e.masterId,isEdit:e.isEdit},on:{operationSuccess:e.handleOperationSuccessNew}})],1)],1),a("biz-popup-tabs",{attrs:{open:e.open},on:{close:function(t){e.open=!1}},model:{value:e.tabName,callback:function(t){e.tabName=t},expression:"tabName"}},[a("el-tab-pane",{attrs:{label:"选择已注册用户",name:"1"}},[a("platform-user",{ref:"platformUser",attrs:{itemId:e.itemId},on:{operationSuccess:e.handleOperationSuccessPlat}})],1),a("el-tab-pane",{attrs:{label:"注册新用户",name:"2"}},[a("new-user",{ref:"newUser",attrs:{itemId:e.itemId,masterId:e.masterId},on:{operationSuccess:e.handleOperationSuccessNew}})],1)],1)],1)],1)},n=[],o=(a("d81d"),a("a9e3"),a("d3b7"),a("5530")),r=a("04d3"),s=a("7132"),l=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"supplier-mgmt__platform-info"},[i("div",{attrs:{slot:"top"},slot:"top"},[i("biz-filter",{attrs:{filters:e.filters},on:{filterDataChange:e.filterDataChange}})],1),i("biz-list",{key:Math.random(),ref:"table",attrs:{tableData:e.tableData,height:"100%"}},[i("el-table-column",{attrs:{prop:"name",label:"用户"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("div",{staticClass:"customer-info"},[t.row.head?i("img",{attrs:{src:t.row.head}}):i("img",{attrs:{src:a("624d")}}),i("div",{staticClass:"wrapper"},[i("div",{staticClass:"title"},[e._v(e._s(t.row.name))]),i("div",{staticClass:"mobile"},[i("span",[e._v(e._s(t.row.mobile))])])])])]}}])}),i("el-table-column",{attrs:{prop:"date",label:"操作",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return i("div",{},[i("div",{staticClass:"biz-customcol"},["0"===t.row.opeateState?i("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.addHandeler(t.row)}}},[e._v("添加为管理员 ")]):e._e(),"1"===t.row.opeateState?i("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.deleteHandeler(t.row.masterId)}}},[e._v("移除 ")]):e._e()],1)])}}])})],1),i("div",{attrs:{slot:"bottom"},slot:"bottom"},[i("biz-pagination",{attrs:{pagination:e.pagination},on:{handleSizeChange:e.handleSizeChange,handleCurrentChange:e.handleCurrentChange}})],1)],1)},c=[],d=(a("b0c0"),a("f36f")),m=a("7558"),u=a("5c40"),f=a("8c35"),p=a("c596"),g=a("1ab1"),h=a("2f62"),b={name:"SupplierPlatformInfo",components:{BizGrid:d["a"],BizList:m["a"],BizPagination:u["a"],BizFilter:f["a"]},data:function(){return{loading:!1,tableData:[],tableDataAdmin:[],role:{id:"",name:"",type:""},filters:[{type:"input",placeholder:"请输入用户姓名/电话",name:"searchbar",value:""}],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0}}},props:{},mounted:function(){this.getRole()},methods:Object(o["a"])(Object(o["a"])({},Object(h["c"])(["getUser"])),{},{filterDataChange:function(e){this.filters=e,this.getList()},clearSearchValue:function(){this.filters[0].value=""},deleteHandeler:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var a={masterIds:Array(e)};g["a"].delete("/admin/admin/mgmt/admin.jhtml",a).then((function(e){t.$message.success("操作成功"),t.getList()})).catch((function(e){console.log(e),console.log("code错误"),t.$message.error(e.errorMessage)}))}))},getList:function(){var e=this;this.loading=!0;var t={companyId:window.Company_ID||"",shopId:window.top.SHOP_ID||"",pageNumber:this.pagination.currentPage,pageSize:this.pagination.pageSize,searchValue:this.filters[0].value,position:"agent"};g["a"].get(p["g"].invoicing.supplierMgmt.adminByKeyword,t).then((function(t){e.loading=!1,e.tableData=t.dataList,e.pagination.total=Number(t.total)})).catch((function(t){e.loading=!1,t.errorMessage&&console.log(t.errorMessage)}))},getRole:function(){var e=this;g["a"].get("/admin/role/getRoleByType.jhtml",{roleType:"agent"}).then((function(t){e.role=t.data})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)}))},addHandeler:function(e){var t=this;this.loading=!0;var a={id:e.id,roleIds:[this.role.id],shop:{id:this.getUser().shop.id,name:this.getUser().shop.name},compy:{id:this.getUser().compy.id,name:this.getUser().compy.name},agent:{id:this.$route.query.cooperationId}};g["a"].post(p["g"].invoicing.supplierMgmt.transfer,a).then((function(e){t.loading=!1,t.$message.success("添加成功"),t.getList(),t.$emit("operationSuccess",e.id,e.masterId)})).catch((function(e){t.loading=!1,t.$message({message:e.errorMessage,type:"warning"})})).finally((function(e){t.loading=!1}))},handleSizeChange:function(e){this.pagination.pageSize=e,this.getList()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.getList()},getQueryParams:function(){return{shopId:window.top.SHOP_ID||"",cooperationType:"1",cooperationId:this.$route.query.cooperationId,pageSize:this.pagination.pageSize,pageNumber:this.pagination.currentPage}},refresh:function(){var e=this;this.loading=!0,g["a"].get(p["g"].invoicing.supplierMgmt.adminList,this.getQueryParams()).then((function(t){e.loading=!1,e.tableData=[],t.dataList.map((function(t){"0"===t.opeateState&&e.tableData.push(t)})),e.pagination.total=Number(e.tableData.length)})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)})).finally((function(){e.loading=!1}))}})},v=b,w=(a("4f25"),a("2877")),y=Object(w["a"])(v,l,c,!1,null,null,null),I=y.exports,C=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{staticClass:"new-user-info"},[e.isEdit?a("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}):e._e(),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"120px",size:"small",disabled:!e.isEdit,"inline-message":!0}},[a("el-form-item",{attrs:{label:"手机号",prop:"mobile",error:e.errorMobile}},[a("el-input",{attrs:{placeholder:"请输入手机号"},model:{value:e.form.mobile,callback:function(t){e.$set(e.form,"mobile",t)},expression:"form.mobile"}})],1),a("el-form-item",{attrs:{label:"用户名",prop:"userName",error:e.errUserName}},[a("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.form.userName,callback:function(t){e.$set(e.form,"userName",t)},expression:"form.userName"}})],1),a("el-form-item",{attrs:{label:"姓名",prop:"name",error:e.errName}},[a("el-input",{attrs:{placeholder:"请输入姓名"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"性别",prop:"gender"}},[a("el-radio-group",{model:{value:e.form.gender,callback:function(t){e.$set(e.form,"gender",t)},expression:"form.gender"}},[a("el-radio",{attrs:{label:"0"}},[e._v("男")]),a("el-radio",{attrs:{label:"1"}},[e._v("女")]),a("el-radio",{attrs:{label:"2"}},[e._v("保密")])],1)],1),""===e.itemId.id?a("el-form-item",{attrs:{label:"密码",prop:"pass"}},[a("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],attrs:{type:"password",name:"pwd"}}),a("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入6-16位密码"},model:{value:e.form.pass,callback:function(t){e.$set(e.form,"pass",t)},expression:"form.pass"}})],1):e._e(),""===e.itemId.id?a("el-form-item",{attrs:{label:"确认密码",prop:"checkpass"}},[a("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"再次确认密码"},model:{value:e.form.checkpass,callback:function(t){e.$set(e.form,"checkpass",t)},expression:"form.checkpass"}})],1):e._e(),a("el-form-item",{attrs:{label:"头像",prop:"head"}},[a("biz-avatar-uploader-new",{model:{value:e.form.head,callback:function(t){e.$set(e.form,"head",t)},expression:"form.head"}})],1),a("el-form-item",{attrs:{label:"状态",prop:"isEnabled"}},[a("el-switch",{attrs:{"active-value":"1","inactive-value":"0","active-color":"#ff7300","inactive-color":"#d9d9d9"},model:{value:e.form.isEnabled,callback:function(t){e.$set(e.form,"isEnabled",t)},expression:"form.isEnabled"}})],1)],1),a("el-dialog",{attrs:{title:"",visible:e.dialogVisible,width:"30%","append-to-body":""},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("span",[e._v(e._s(e.form.mobile)+"手机号已注册，确定添加此手机号为管理员请点击获取验证码，验证成功后自动添加")]),a("div",{staticClass:"valid-div"},[a("el-input",{attrs:{placeholder:"请输入验证码",size:"mini",maxlength:"4"},model:{value:e.validImg,callback:function(t){e.validImg=t},expression:"validImg"}}),a("img",{attrs:{src:e.imgSrc,alt:""},on:{click:e.getVerificationImg}})],1),a("div",{staticClass:"code-div"},[a("el-input",{attrs:{placeholder:"请输入手机验证码",size:"mini",maxlength:"6"},model:{value:e.code,callback:function(t){e.code=t},expression:"code"}}),a("el-button",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],attrs:{type:"primary",size:"mini"},on:{click:e.getVerification}},[e._v("获取验证码")]),a("el-button",{directives:[{name:"show",rawName:"v-show",value:!e.show,expression:"!show"}],attrs:{type:"primary",disabled:"",size:"mini"}},[e._v(e._s(e.count)+"秒后重新获取")])],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.confirm}},[e._v("确 定")])],1)]),a("el-dialog",{attrs:{title:"",visible:e.dialogAdminVisible,width:"30%","append-to-body":""},on:{"update:visible":function(t){e.dialogAdminVisible=t}}},[a("span",[e._v("该用户是其他店铺管理员，确认成为本店铺管理员")]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"mini"},on:{click:function(t){e.dialogAdminVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.create}},[e._v("确 定")])],1)])],1)},S=[],_=a("8330"),N=a("c17f"),x=a("4caf"),z=a("4e29"),k=a("bc3a"),M=a.n(k),$=function(){return{id:"",userName:"",name:"",gender:"2",mobile:"",pass:"",checkpass:"",companyId:"",head:"/resources/admin/images/Avatar.png",shopId:"",isEnabled:"1",isMemberConvert:"",isManageThisStore:"",agent:[]}},D={name:"BaseInfo",props:{itemId:{type:Object,default:function(){return{id:""}}},masterId:{type:String,default:function(){return""}},isEdit:{type:Boolean,default:function(){return!0}}},data:function(){var e=this,t=function(t,a,i){""===a?i(new Error("请输入密码")):(""!==e.form.checkpass&&e.$refs.form.validateField("checkpass"),i())},a=function(t,a,i){""===a?i(new Error("请再次输入密码")):a!==e.form.pass?i(new Error("两次输入密码不一致!")):i()};return{defaultAvatar:"/resources/admin/images/Avatar.png",rules:{userName:[{required:!0,message:"用户名不能为空",trigger:"blur"},{pattern:/^[0-9a-zA-Z]+$/,message:"用户名只能为数字或字母",trigger:"blur"},{min:4,max:20,message:"长度在4-20位",trigger:"blur"}],name:[{required:!0,message:"姓名不能为空",trigger:"blur"},{max:20,message:"长度不能大于20位",trigger:"blur"}],mobile:[{required:!0,message:"请输入手机号码",trigger:"blur"},{len:11,message:"手机号位数错误",trigger:"blur"},{pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message:"手机号格式错误",trigger:"blur"}],gender:[{required:!0,message:"请选择性别"}],pass:[{validator:t,trigger:"blur"},{required:!0,min:6,max:16,message:"长度在6-16个字符",trigger:"blur"}],checkpass:[{required:!0,validator:a,trigger:"blur"}],head:[{required:!0,message:"请选择头像"}]},form:$(),operations:[{label:"保存",name:"save",type:"primary"}],loading:!1,dialogVisible:!1,dialogAdminVisible:!1,show:!0,role:{id:"",name:"",type:""},count:"",code:"",imgSrc:"",validImg:"",validCode:"",timer:null,userId:"",errorMobile:"",errUserName:"",errName:""}},components:{BizGrid:d["a"],BizSaveButton:_["a"],BizAvatarUploaderNew:N["b"]},methods:Object(o["a"])(Object(o["a"])({},Object(h["c"])(["getUser"])),{},{operate:function(e){this[e]()},resetModel:function(){this.form=this.getDefaultModel()},getDefaultModel:function(){return $()},getCode:function(){var e=this,t=60;this.timer||(this.count=t,this.show=!1,this.timer=setInterval((function(){e.count>0&&e.count<=t?e.count--:(e.show=!0,clearInterval(e.timer),e.timer=null)}),1e3))},getVerificationImg:function(){var e=this;this.uid=z["a"].getUuid("xxxxxxxxxxxxxxxx");var t={uid:this.uid,clientType:"2",methodName:"QueryCaptcha"},a="/rest/member/captcha.jhtml?req="+encodeURIComponent(JSON.stringify(t));g["a"].get(a).then((function(t){e.imgSrc="data:image/png;base64,"+t.captchaImage,e.uid=t.uid})).catch((function(e){}))},getVerification:function(){var e=this,t={uid:this.uid,captcha:this.validImg,clientType:"2",methodName:"SendValidateCode",phoneNumber:this.form.mobile,type:"7"},a="/rest/member/sendValidateCode.jhtml";M.a.post(a,t).then((function(t){"100"===t.data.resultCode?(e.validCode=t.data.validateCode,e.show=!0,e.getCode()):e.$message({message:t.data.errorMessage,type:"warning"})})).catch((function(e){console.log(e)}))},showNotify:function(e,t){this.$notify({showClose:!0,message:e,type:t})},getRole:function(){var e=this;g["a"].get("/admin/role/getRoleByType.jhtml",{roleType:"agent"}).then((function(t){e.role=t.data,console.log(e.role)})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)}))},save:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;e.getRole(),e.checkMobile(e.form.mobile)}))},checkMobile:function(e){var t=this;g["a"].post("/admin/admin/checkMobile.jhtml",{mobile:e}).then((function(e){""!==e.userId?(t.userId=e.userId,t.form.id=e.userId,t.form.userName=e.memberData.userName,t.form.nickname=e.memberData.nickname,t.form.name=e.memberData.name||t.form.name,t.form.gender=e.memberData.gender,t.form.mobile=e.memberData.mobile,t.form.head=e.memberData.head,t.form.isEnabled=e.memberData.enableState,t.form.isMemberConvert="1",t.dialogVisible=!0):(t.userId="",t.form.isMemberConvert="",t.form.isManageThisStore="",t.submit())})).catch((function(e){t.loading=!1,e.errorMessage&&t.$message.warning(e.errorMessage)})).finally((function(e){t.loading=!1}))},confirm:function(){return""===this.validImg?(this.$message.warning("请输入验证码"),!1):""===this.code?(this.$message.warning("请输入手机验证码"),!1):this.code!==this.validCode?(this.$message.warning("请输入正确的验证码"),!1):void this.submit()},submit:function(){this.validCode="",this.code="",this.dialogVisible=!1,this.create()},create:function(){var e=this,t={id:this.userId,head:this.form.head,userName:this.form.userName,password:this.form.pass,mobile:this.form.mobile,gender:this.form.gender,name:this.form.name,nickname:this.form.mobile,isEnabled:this.form.isEnabled,roleIds:[this.role.id],shop:{id:this.getUser().shop.id,name:this.getUser().shop.name},compy:{id:this.getUser().compy.id,name:this.getUser().compy.name},isMemberConvert:this.form.isMemberConvert,isManageThisStore:this.form.isManageThisStore,agent:{id:this.$route.query.cooperationId}};this.loading=!0,this.dialogAdminVisible=!1,x["a"].create(t,(function(t){e.loading=!1,e.$emit("operationSuccess",t.AdminData.id,t.AdminData.masterId),e.$message.success("管理员创建成功")}),(function(t){e.loading=!1,"1070"===t.resultCode?(e.form.gender=t.AdminData.gender,e.form.head=t.AdminData.head,e.form.id=t.AdminData.id,e.form.isEnabled=t.AdminData.isEnabled,e.form.loginAddress=t.AdminData.loginAddress,e.form.loginDate=t.AdminData.loginDate,e.form.mobile=t.AdminData.mobile,e.form.name=t.AdminData.name,e.form.nickname=t.AdminData.nickname,e.form.userName=t.AdminData.userName,e.form.isManageThisStore="1",e.dialogAdminVisible=!0):(e.$message.warning({message:t.errorMessage}),console.log("ERR_CREATE:",t))}))},refresh:function(){var e=this,t={id:this.itemId.id,masterId:this.masterId};this.loading=!0,x["a"].get(t,(function(t){e.loading=!1,e.form.userName=t.admin.userName,e.form.name=t.admin.name,e.form.mobile=t.admin.mobile,e.form.nickname=t.admin.nickname,e.form.gender=t.admin.gender,e.form.head=t.admin.head||e.defaultAvatar,e.form.pass="",e.form.checkpass="",e.form.isEnabled=t.admin.isEnabled,e.form.companyId=t.admin.compy?t.admin.compy.id:"",e.isCreate=!1,e.form.shopId=e.shop=t.admin.shop?t.admin.shop.id:"",e.role={},e.form.supplier=t.admin.supplier,e.form.agent=t.admin.agent,t.admin.roleDatas.map((function(t){"24"===t.type&&(e.role.id=t.id,e.role.name=t.name)}))}),(function(t){e.loading=!1,console.log("ERR_GET_INFO : ",t)}))}}),watch:{itemId:function(e,t){e.id?this.refresh():this.resetModel()}},created:function(){this.getRole(),this.getVerificationImg()},computed:{},mounted:function(){}},E=D,A=(a("0785"),Object(w["a"])(E,C,S,!1,null,null,null)),O=A.exports,j=a("624d"),B=a.n(j),P={itemId:{id:""},masterId:"",role:{id:"",name:"",type:""},selections:[],Img:B.a,tabName:"1",tabNameBase:"0",isEdit:!0,open:!1,openBaseInfo:!1},T={loading:!1,tableData:[],operations:[{label:"添加管理员",name:"add",type:"primary"},{label:"刷新",name:"refresh",type:""},{label:"返回",name:"back",type:""}],filters:[{type:"select",placeholder:"请选择状态",label:"状态",value:"",options:[{label:"全部",value:""},{label:"启用",value:"1"},{label:"停用",value:"0"}]},{type:"input",label:"",placeholder:"请输入姓名/手机号",name:"searchValue",value:""}],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0}},V={getQueryParams:function(){return{shopId:window.top.SHOP_ID||"",cooperationType:"1",cooperationId:this.$route.query.cooperationId,pageSize:this.pagination.pageSize,pageNumber:this.pagination.currentPage,searchValue:this.filters[1].value,isEnabled:this.filters[0].value}},query:function(){var e=this;this.loading=!0,g["a"].get(p["g"].invoicing.supplierMgmt.adminList,this.getQueryParams()).then((function(t){e.loading=!1,e.tableData=[],t.dataList.map((function(t){"1"===t.opeateState&&e.tableData.push(t)})),e.pagination.total=Number(t.total)})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)})).finally((function(){e.loading=!1}))},stateColor:function(e){return"1"===e.isEnabled?"#67c23a":"#f56c6c"},refresh:function(){this.query()},add:function(){this.itemId={id:""},this.masterId="",this.tabName="1",this.$refs.platformUser.clearSearchValue(),this.$refs.platformUser.refresh(),this.$refs.newUser.resetModel(),this.open=!0},back:function(){this.$router.go(-1)}},U={handleOperationSuccessNew:function(e,t){this.itemId={id:String(e)},this.masterId=String(t),this.query()},handleOperationSuccessPlat:function(e,t){this.query()},handleOperate:function(e){this[e]()},handlePageSizeChange:function(e){this.pagination.pageSize=e,this.pagination.currentPage=1,this.query()},handleCurrentPageChange:function(e){this.pagination.currentPage=e,this.query()},handleFilterDataChange:function(){this.query()},handleRowClick:function(e,t,a){this.itemId={id:String(e.id)},this.masterId=e.masterId,this.tabNameBase="0",this.openBaseInfo=!0,this.isEdit=!1},getRole:function(){var e=this;g["a"].get("/admin/role/getRoleByType.jhtml",{roleType:"agent"}).then((function(t){e.role=t.data})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)}))},handleAdminSetting:function(e,t){var a=this;this.loading=!0;var i={id:t.id,roleIds:[this.role.id],shop:{id:window.top.SHOP_ID||""},compy:{id:window.Company_ID||""},agent:{id:this.$route.query.cooperationId}};g["a"].post(p["g"].invoicing.supplierMgmt.transfer,i).then((function(e){a.loading=!1,a.$message.success("管理员设置成功"),a.refresh()})).catch((function(e){a.loading=!1,a.$message({message:e.errorMessage,type:"warning"})})).finally((function(e){a.loading=!1}))},handleAdminDelete:function(e,t){var a=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){a.loading=!0;var e={ids:[t.id],cooperationId:a.$route.query.cooperationId};g["a"].delete("/admin/cooperationInfo/mgmt/admin.jhtml",e).then((function(e){a.loading=!1,a.$message.success("操作成功"),a.refresh()})).catch((function(e){a.loading=!1,e.errorMessage&&a.$message.warning(e.errorMessage)})).finally((function(){a.loading=!1}))}))}},R={name:"SupplierMgmt",components:{BizFlexTable:r["c"],BizPopupTabs:s["a"],PlatformUser:I,NewUser:O},props:{},data:function(){return Object(o["a"])(Object(o["a"])({},P),T)},methods:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(h["c"])(["getUser"])),V),U),created:function(){this.query(),this.getRole()}},q=R,L=(a("0d91"),Object(w["a"])(q,i,n,!1,null,null,null));t["default"]=L.exports},9678:function(e,t,a){},a9e3:function(e,t,a){"use strict";var i=a("83ab"),n=a("da84"),o=a("94ca"),r=a("6eeb"),s=a("5135"),l=a("c6b6"),c=a("7156"),d=a("c04e"),m=a("d039"),u=a("7c73"),f=a("241c").f,p=a("06cf").f,g=a("9bf2").f,h=a("58a8").trim,b="Number",v=n[b],w=v.prototype,y=l(u(w))==b,I=function(e){var t,a,i,n,o,r,s,l,c=d(e,!1);if("string"==typeof c&&c.length>2)if(c=h(c),t=c.charCodeAt(0),43===t||45===t){if(a=c.charCodeAt(2),88===a||120===a)return NaN}else if(48===t){switch(c.charCodeAt(1)){case 66:case 98:i=2,n=49;break;case 79:case 111:i=8,n=55;break;default:return+c}for(o=c.slice(2),r=o.length,s=0;s<r;s++)if(l=o.charCodeAt(s),l<48||l>n)return NaN;return parseInt(o,i)}return+c};if(o(b,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var C,S=function(e){var t=arguments.length<1?0:e,a=this;return a instanceof S&&(y?m((function(){w.valueOf.call(a)})):l(a)!=b)?c(new v(I(t)),a,S):I(t)},_=i?f(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),N=0;_.length>N;N++)s(v,C=_[N])&&!s(S,C)&&g(S,C,p(v,C));S.prototype=w,w.constructor=S,r(n,b,S)}},d4c2:function(e,t,a){"use strict";var i=a("e725"),n=a.n(i);n.a},e725:function(e,t,a){}}]);