(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bb5f27a6"],{"0215":function(t,e,a){},"1c78":function(t,e,a){"use strict";var n=a("8990"),i=a.n(n);i.a},"49ad":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("biz-grid",{staticClass:"tag-mgmt"},[a("biz-flex-table",{ref:"table",attrs:{loading:t.loading,operations:t.operations,checkable:!1,filters:t.filters,pagination:t.pagination,tableData:t.handleTableData},on:{operate:t.operateHandler,"filter-data-change":t.filterDataChangeHandler,"selection-change":t.selectionChangeHandler,"row-click":t.rowOperationClickHandler,"size-change":t.pageSizeChange,"current-change":t.currentPageChange,"cascader-change":t.cascaderChange}},[a("template",{slot:"operation"},[a("import-file",{ref:"importFile",staticStyle:{"margin-left":"10px"},attrs:{tableData:t.importResult,importLoading:t.importLoading,total:t.total,disabled:t.disabled,count:t.count,percentage:t.percentage,stepkey:t.stepkey,action:"/admin/tag/importPlatformTag.jhtml",name:"uFile"},on:{clearTimeOut:t.clearTimeOut,restProcess:t.restProcess,"handle-import":t.handleImport}},[a("el-table-column",{attrs:{label:"标签",width:"50",prop:"row"}}),a("el-table-column",{attrs:{label:"数据类型",width:"150",prop:"result"}}),a("el-table-column",{attrs:{label:"分类",prop:"message"}}),a("el-table-column",{attrs:{label:"结果",prop:"message"}})],1)],1),a("el-table-column",{attrs:{prop:"fullName",label:"分类","class-name":"first-category-name"}}),a("el-table-column",{attrs:{prop:"platformTags",label:"平台标签","class-name":"first-category-name"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",t._l(e.row.platformTags,(function(e,n){return a("span",{key:n,staticClass:"platform-tags"},[t._v(t._s(e.name))])})),0)]}}])}),a("el-table-column",{attrs:{prop:"storeTags",label:"店铺标签","class-name":"first-category-name"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",t._l(e.row.storeTags,(function(e,n){return a("span",{key:n,staticClass:"platform-tags"},[t._v(t._s(e.name))])})),0)]}}])})],2),a("div",{attrs:{slot:"float"},slot:"float"},[a("tag-mgmt-pop",{attrs:{open:t.open,itemId:t.itemId},on:{close:function(e){t.open=!1},operationSuccess:t.operationSuccess}})],1)],1)},i=[],o=(a("4160"),a("b0c0"),a("a9e3"),a("d3b7"),a("25f0"),a("159b"),a("04d3")),s=a("f36f"),r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("biz-popup-tabs",{attrs:{open:t.open},on:{close:t.close},model:{value:t.tabSelection,callback:function(e){t.tabSelection=e},expression:"tabSelection"}},[a("el-tab-pane",{attrs:{label:"平台标签",name:"0"}},[a("plat-tag-info",{ref:"platform",attrs:{itemId:t.itemId,typeStr:"platform"},on:{operationSuccess:t.operationSuccess}})],1),a("el-tab-pane",{attrs:{label:"店铺标签",name:"1"}},[a("plat-tag-info",{ref:"shop",attrs:{itemId:t.itemId,typeStr:"shop"},on:{operationSuccess:t.operationSuccess}})],1)],1)},l=[],c=a("7132"),g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"plat-tag-info"},[a("div",{staticClass:"top-container"},[t.getAddBtnShow?a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.onAdd}},[t._v("新增")]):t._e(),a("el-input",{staticClass:"search-input",attrs:{placeholder:"请输入标签名称",size:"small","suffix-icon":"el-icon-search"},on:{change:t.onChange},model:{value:t.serchValue,callback:function(e){t.serchValue=e},expression:"serchValue"}})],1),a("div",{staticClass:"tag-container"},[0!==t.tagList.length||t.showSetting?t._e():a("div",{staticClass:"empty",style:t.styleObject}),t._l(t.tagList,(function(e){return a("div",{key:e.name,staticClass:"tag"},[a("el-tag",{attrs:{closable:!("shop"===t.getUser.roleLevel&&"platform"===t.typeStr)},on:{click:function(a){return t.showSet(a,e)},close:function(a){return t.handleClose(e)}}},[t._v(t._s(e.name))])],1)}))],2),a("div",{directives:[{name:"show",rawName:"v-show",value:t.showSetting,expression:"showSetting"}],staticClass:"set-container"},[t.formBtnShow?a("biz-save-button",{attrs:{slot:"top",operations:t.operations},on:{operate:t.operateHandler},slot:"top"}):t._e(),a("el-form",{ref:"form",attrs:{size:"small","label-width":"80px",model:t.form,rules:t.rules,disabled:"shop"===t.getUser.roleLevel&&"platform"===t.typeStr}},[a("el-form-item",{attrs:{label:"标签名称",prop:"name"}},[a("el-input",{attrs:{placeholder:"请输入标签名称"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"数据类型",prop:"type"}},[a("el-select",{attrs:{placeholder:"默认无"},model:{value:t.form.type,callback:function(e){t.$set(t.form,"type",e)},expression:"form.type"}},t._l(t.typeList,(function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})})),1)],1),a("el-form-item",{attrs:{label:"标签说明",prop:"description"}},[a("el-input",{attrs:{placeholder:"请输入该标签的意义，比如评定标准等",type:"textarea",rows:"4"},model:{value:t.form.description,callback:function(e){t.$set(t.form,"description",e)},expression:"form.description"}})],1)],1)],1)])},p=[],h=(a("a4d3"),a("e01a"),a("5530")),u=a("8330"),f=a("2f62"),d=a("1ab1"),m=a("c596"),b=a("f260"),y=a.n(b),v={name:"plat-tag-info",data:function(){return{serchValue:"",loading:!1,showSetting:!1,curTagId:"",formBtnShow:!0,typeList:[{label:"文本型",value:"文本型"},{label:"数值型",value:"数值型"},{label:"浮点型",value:"浮点型"}],operations:[{label:"取消",name:"cancel",type:""},{label:"保存",name:"save",type:"primary"}],form:{name:"",type:"",description:""},rules:{name:[{required:!0,message:"请输入标签名称",trigger:"change"}]},tagList:[]}},props:{itemId:{type:Object,default:function(){return{id:""}}},typeStr:{type:String}},components:{BizGrid:s["a"],BizSaveButton:u["a"]},computed:Object(h["a"])(Object(h["a"])({},Object(f["c"])(["getUser"])),{},{styleObject:function(){return{position:"absolute",top:"65px",bottom:0,left:0,right:0,margin:"auto",background:"url("+y.a+") 50% 50% / 50% no-repeat"}},getAddBtnShow:function(){if("platform"===this.getUser.roleLevel){if("platform"===this.typeStr)return!0;if("shop"===this.typeStr)return!1;if("member"===this.typeStr)return!1}else if("shop"===this.getUser.roleLevel){if("platform"===this.typeStr)return!1;if("shop"===this.typeStr)return!0;if("member"===this.typeStr)return!1}return!1},getType:function(){var t=this,e="";return this.typeList.forEach((function(a,n){a.value===t.form.type&&(e=n.toString())})),e}}),watch:{itemId:function(t){t.id&&this.getTagList()},typeStr:function(t){t&&this.getTagList()}},methods:{clearForm:function(){this.$refs.form.resetFields(),this.showSetting=!1},onChange:function(){this.getTagList()},setFormBtnShow:function(){"platform"===this.getUser.roleLevel?("platform"===this.typeStr?(this.operations[1].label="保存",this.operations[1].name="save"):("shop"===this.typeStr||"member"===this.typeStr)&&(this.operations[1].label="转化为平台标签",this.operations[1].name="tansformPlatTag"),this.formBtnShow=!0):"shop"===this.getUser.roleLevel&&("platform"===this.typeStr?(this.operations[1].label="保存",this.operations[1].name="save",this.formBtnShow=!1):"shop"===this.typeStr?(this.operations[1].label="保存",this.operations[1].name="save",this.formBtnShow=!0):"member"===this.typeStr&&(this.operations[1].label="转化为店铺标签",this.operations[1].name="tansformShopTag",this.formBtnShow=!0))},cancel:function(){this.showSetting=!1},showSet:function(t,e){console.log("123"),this.curTagId=e.id,this.$refs.form.resetFields(),this.getInfo(),this.showSetting=!0},onAdd:function(){this.curTagId="",this.$refs.form.resetFields(),this.showSetting=!0},operateHandler:function(t){this[t]()},save:function(){var t=this;this.$refs.form.validate((function(e){e&&(t.curTagId?t.updateTag():t.addTag())}))},handleClose:function(t){this.deleteTag(t)},tansformPlatTag:function(){var t=this;this.$refs.form.validate((function(e){e&&(t.showSetting=!1,t.transfromToPlatform())}))},tansformShopTag:function(){},transfromToPlatform:function(){var t=this;this.loading=!0;var e={id:this.curTagId,name:this.form.name,type:this.form.type,description:this.form.description,tagCategory:{id:this.itemId.id}};d["a"].post(m["g"].systemSetting.transfromToPlatform,e).then((function(e){console.log(e),t.loading=!1,t.$message.success("操作成功"),t.getTagList(),t.$emit("operationSuccess")})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)}))},getInfo:function(){var t=this;this.loading=!0;var e={id:this.curTagId};d["a"].get(m["g"].systemSetting.deleteTag,e).then((function(e){console.log("获取标签信息",e),t.loading=!1,t.form.name=e.data.name,t.form.type=e.data.type?t.typeList[parseInt(e.data.type)].value:"",t.form.description=e.data.description})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)}))},updateTag:function(){var t=this;this.loading=!0;var e={id:this.curTagId,name:this.form.name,type:this.getType,description:this.form.description};d["a"].put(m["g"].systemSetting.deleteTag,e).then((function(e){t.loading=!1,t.$message.success("操作成功"),t.$emit("operationSuccess"),t.getTagList()})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)}))},addTag:function(){var t=this;this.loading=!0;var e={name:this.form.name,type:this.getType,description:this.form.description,hierarchy:this.getHierarchy(),shopId:this.getUser.shop.id||"",tagCategory:{id:this.itemId.id}};d["a"].post(m["g"].systemSetting.deleteTag,e).then((function(e){t.loading=!1,t.$message.success("操作成功"),t.$emit("operationSuccess"),t.getTagList()})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)}))},deleteTag:function(t){var e=this;this.loading=!0;var a={ids:[t.id]};d["a"].delete(m["g"].systemSetting.deleteTag,a).then((function(t){e.loading=!1,console.log(t),e.$message.success("操作成功"),e.$emit("operationSuccess"),e.getTagList()})).catch((function(t){e.loading=!1,e.$message(t.errorMessage)}))},getHierarchy:function(){switch(this.typeStr){case"platform":return"0";case"shop":return"1";case"member":return"4";default:return"0"}},getTagList:function(){var t=this;this.loading=!0,this.showSetting=!1,this.tagList=[];var e={tagCategoryId:this.itemId.id,searchValue:this.serchValue,hierarchy:this.getHierarchy(),shopId:window.top.SHOP_ID||""};d["a"].get(m["g"].systemSetting.tagList,e).then((function(e){console.log("标签分类下标签列表",e),t.loading=!1,t.tagList=e.content})).catch((function(e){t.loading=!1,t.$message.warning(e.errorMessage)}))}},created:function(){this.setFormBtnShow()}},S=v,T=(a("1c78"),a("2877")),I=Object(T["a"])(S,g,p,!1,null,null,null),w=I.exports,C={name:"class-mgmt-pop",components:{BizPopupTabs:c["a"],PlatTagInfo:w},props:{open:{type:Boolean},itemId:{type:Object,default:function(){return{id:""}}}},data:function(){return{tabSelection:"0"}},methods:{close:function(t){this.$emit("close",t)},operationSuccess:function(t){this.$emit("operationSuccess",t)}},watch:{open:function(t){var e=this;t&&setTimeout((function(){e.tabSelection="0"}),500)},tabSelection:function(t){if(t)switch(t){case"0":this.$refs.platform.clearForm();break;case"1":this.$refs.shop.clearForm();break;case"2":this.$refs.member.clearForm();break;default:break}}}},L=C,$=Object(T["a"])(L,r,l,!1,null,null,null),k=$.exports,x=a("ccf0"),_={name:"tag-mgmt",data:function(){return{stepkey:"",t:"",percentage:0,disabled:!1,count:0,total:0,tagCatrgoryId:"",importResult:[],importLoading:!1,successCount:0,failCount:0,itemId:{id:""},selections:[],open:!1,loading:!1,tableData:[{name:"哈哈哈",platTag:"咨询文章",shopTag:"咨询文章",memberTag:"说明说过"},{name:"哈哈哈",platTag:"咨询文章",shopTag:"咨询文章",memberTag:"说明说过"}],operations:[{label:"刷新",name:"refresh",type:""},{label:"模板下载",name:"download",type:""}],filters:[{type:"cascader",label:"分类",name:"searchValue",changeOnSelect:!0,filterable:!1,value:[],options:[]}],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:0}}},props:{},components:{BizFlexTable:o["c"],BizGrid:s["a"],TagMgmtPop:k,ImportFile:x["b"]},computed:{handleTableData:function(){var t=this.tableData;return t.forEach((function(t){t.platformTags&&t.platformTags.forEach((function(e,a){a!==t.platformTags.length-1&&(e.name+="、")})),t.storeTags&&t.storeTags.forEach((function(e,a){a!==t.storeTags.length-1&&(e.name+="、")})),t.memberTags&&t.memberTags.forEach((function(e,a){a!==t.memberTags.length-1&&(e.name+="、")}))})),t}},watch:{},methods:{cascaderChange:function(t){console.log(t),this.pagination.currentPage=1,this.tagCatrgoryId=t[t.length-1],this.getList()},clearTimeOut:function(){window.clearTimeout(this.t)},restProcess:function(){this.total=0,this.count=0,this.stepkey="",this.percentage=0},handleImport:function(){var t=this,e="/admin/tag/importProgress.jhtml";d["a"].get(e,{}).then((function(e){e.data.total||(t.total=0,t.count=0,t.stepkey="",t.percentage=0),e.data.total&&(t.total=Number(e.data.total||0),t.count=Number(e.data.count||0),t.stepkey=e.data.remark,t.percentage=Number(e.data.rate),t.$refs.importFile.title=e.data.title),e.data&&e.data.rate&&"100"===e.data.rate?(t.clearTimeOut(),t.$refs.importFile.showCurrentInfo=!1,t.$refs.importFile.title="导入完成",t.disabled=!1,t.getTagList()):e.data&&e.data.rate&&"100"!==e.data.rate&&(t.t&&t.clearTimeOut(),t.t=setTimeout(t.handleImport,2e3),t.$refs.importFile.uploadingVisible=!0,t.$refs.importFile.showCurrentInfo=!0,t.disabled=!0)})).catch((function(t){console.log(t),console.log("code错误")}))},download:function(){window.open("/upload/mode/V服爱车_标签导入模板.xlsx")},import:function(){},add:function(){console.log("新增"),this.itemId={id:""},this.open=!0},delete:function(){var t=this;if(this.selections&&this.selections.length>0){var e=[];this.selections.forEach((function(a){e.push(t.getDeleteTagId(a))})),this.deleteItem(e)}else this.$message("请选择一个分类")},operationSuccess:function(){this.getList()},refresh:function(){this.getList()},getList:function(){var t=this;this.loading=!0;var e={tagCategoryId:this.tagCatrgoryId,pageNumber:this.pagination.currentPage.toString(),pageSize:this.pagination.pageSize.toString(),searchValue:this.filters[0].value};d["a"].get(m["g"].systemSetting.tagMgList,e).then((function(e){console.log("标签管理列表",e),t.loading=!1,t.tableData=e.content,t.pagination.pageSize=parseInt(e.pageSize),t.pagination.currentPage=parseInt(e.pageNumber),t.pagination.total=parseInt(e.total)})).catch((function(e){t.loading=!1,console.log(e.errorMessage)}))},operateHandler:function(t){console.log("operate"),this[t]()},pageSizeChange:function(t){this.pagination.pageSize=t,console.log("pageSizeChange"),this.getList()},currentPageChange:function(t){this.pagination.currentPage=t,console.log("currentPageChange"),this.getList()},selectionChangeHandler:function(t){console.log("selectionChange"),this.selections=t},filterDataChangeHandler:function(){console.log("filterDataChange"),this.pagination.currentPage=1,this.getList()},rowOperationClickHandler:function(t){console.log(t),this.itemId={id:t.id},this.open=!0},deleteHandler:function(t,e){var a=this.getDeleteTagId(e);this.deleteItem([a]),t.stopPropagation(),t.preventDefault()},deleteItem:function(t){var e=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.loading=!0;var a={ids:t};d["a"].delete(m["g"].systemSetting.deleteTag,a).then((function(t){e.loading=!1,console.log(t),e.$message.success("删除成功"),e.getList()})).catch((function(t){e.loading=!1,e.$message(t.errorMessage)})).finally((function(){}))}))},getTagClassList:function(){var t=this;this.loading=!0;var e={tagCatrgoryId:""};d["a"].get(m["g"].systemSetting.getTagCategories,e).then((function(e){console.log("系统标签分类管理",e),t.loading=!1;var a,n=e.content;t.filters[0].options=[],a={},a.label="全部",a.value="",t.filters[0].options.push(a),n.forEach((function(e){a={},a.label=e.name,a.value=e.id,t.filters[0].options.push(a),e.children&&e.children.length&&(a.children=[],e.children.forEach((function(t){var e={};e.label=t.name,e.value=t.id,a.children.push(e),t.children&&t.children.length&&(e.children=[],t.children.forEach((function(t){var a={};a.label=t.name,a.value=t.id,e.children.push(a),t.children&&t.children.length&&(a.children=[],t.children.forEach((function(t){var e={};e.label=t.name,e.value=t.id,a.children.push(e)})))})))})))}))})).catch((function(){})).finally((function(){}))}},created:function(){this.getList(),this.getTagClassList()}},O=_,E=(a("7133"),Object(T["a"])(O,n,i,!1,null,null,null));e["default"]=E.exports},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,a){var n=a("1d80"),i=a("5899"),o="["+i+"]",s=RegExp("^"+o+o+"*"),r=RegExp(o+o+"*$"),l=function(t){return function(e){var a=String(n(e));return 1&t&&(a=a.replace(s,"")),2&t&&(a=a.replace(r,"")),a}};t.exports={start:l(1),end:l(2),trim:l(3)}},7133:function(t,e,a){"use strict";var n=a("0215"),i=a.n(n);i.a},8990:function(t,e,a){},a9e3:function(t,e,a){"use strict";var n=a("83ab"),i=a("da84"),o=a("94ca"),s=a("6eeb"),r=a("5135"),l=a("c6b6"),c=a("7156"),g=a("c04e"),p=a("d039"),h=a("7c73"),u=a("241c").f,f=a("06cf").f,d=a("9bf2").f,m=a("58a8").trim,b="Number",y=i[b],v=y.prototype,S=l(h(v))==b,T=function(t){var e,a,n,i,o,s,r,l,c=g(t,!1);if("string"==typeof c&&c.length>2)if(c=m(c),e=c.charCodeAt(0),43===e||45===e){if(a=c.charCodeAt(2),88===a||120===a)return NaN}else if(48===e){switch(c.charCodeAt(1)){case 66:case 98:n=2,i=49;break;case 79:case 111:n=8,i=55;break;default:return+c}for(o=c.slice(2),s=o.length,r=0;r<s;r++)if(l=o.charCodeAt(r),l<48||l>i)return NaN;return parseInt(o,n)}return+c};if(o(b,!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var I,w=function(t){var e=arguments.length<1?0:t,a=this;return a instanceof w&&(S?p((function(){v.valueOf.call(a)})):l(a)!=b)?c(new y(T(e)),a,w):T(e)},C=n?u(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),L=0;C.length>L;L++)r(y,I=C[L])&&!r(w,I)&&d(w,I,f(y,I));w.prototype=v,v.constructor=w,s(i,b,w)}},baa5:function(t,e,a){var n=a("23e7"),i=a("e58c");n({target:"Array",proto:!0,forced:i!==[].lastIndexOf},{lastIndexOf:i})},e58c:function(t,e,a){"use strict";var n=a("fc6a"),i=a("a691"),o=a("50c4"),s=a("a640"),r=a("ae40"),l=Math.min,c=[].lastIndexOf,g=!!c&&1/[1].lastIndexOf(1,-0)<0,p=s("lastIndexOf"),h=r("indexOf",{ACCESSORS:!0,1:0}),u=g||!p||!h;t.exports=u?function(t){if(g)return c.apply(this,arguments)||0;var e=n(this),a=o(e.length),s=a-1;for(arguments.length>1&&(s=l(s,i(arguments[1]))),s<0&&(s=a+s);s>=0;s--)if(s in e&&e[s]===t)return s||0;return-1}:c}}]);