(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1bf60642"],{"1e8b":function(e,t,n){},"24e9":function(e,t,n){e.exports=n.p+"static/img/add.e60f5d26.svg"},"393d":function(e,t,n){},5118:function(e,t,n){(function(e){var a="undefined"!==typeof e&&e||"undefined"!==typeof self&&self||window,i=Function.prototype.apply;function s(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new s(i.call(setTimeout,a,arguments),clearTimeout)},t.setInterval=function(){return new s(i.call(setInterval,a,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},s.prototype.unref=s.prototype.ref=function(){},s.prototype.close=function(){this._clearFn.call(a,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout((function(){e._onTimeout&&e._onTimeout()}),t))},n("6017"),t.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof e&&e.clearImmediate||this&&this.clearImmediate}).call(this,n("c8ba"))},"517a":function(e,t,n){e.exports=n.p+"static/img/pic_default_fail_100.b6b0849d.png"},"51b3":function(e,t,n){"use strict";var a=n("aa4c"),i=n.n(a);i.a},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var a=n("1d80"),i=n("5899"),s="["+i+"]",r=RegExp("^"+s+s+"*"),o=RegExp(s+s+"*$"),c=function(e){return function(t){var n=String(a(t));return 1&e&&(n=n.replace(r,"")),2&e&&(n=n.replace(o,"")),n}};e.exports={start:c(1),end:c(2),trim:c(3)}},6017:function(e,t,n){(function(e,t){(function(e,n){"use strict";if(!e.setImmediate){var a,i=1,s={},r=!1,o=e.document,c=Object.getPrototypeOf&&Object.getPrototypeOf(e);c=c&&c.setTimeout?c:e,"[object process]"==={}.toString.call(e.process)?f():m()?h():e.MessageChannel?g():o&&"onreadystatechange"in o.createElement("script")?b():I(),c.setImmediate=l,c.clearImmediate=d}function l(e){"function"!==typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var r={callback:e,args:t};return s[i]=r,a(i),i++}function d(e){delete s[e]}function u(e){var t=e.callback,a=e.args;switch(a.length){case 0:t();break;case 1:t(a[0]);break;case 2:t(a[0],a[1]);break;case 3:t(a[0],a[1],a[2]);break;default:t.apply(n,a);break}}function p(e){if(r)setTimeout(p,0,e);else{var t=s[e];if(t){r=!0;try{u(t)}finally{d(e),r=!1}}}}function f(){a=function(e){t.nextTick((function(){p(e)}))}}function m(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}function h(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"===typeof n.data&&0===n.data.indexOf(t)&&p(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),a=function(n){e.postMessage(t+n,"*")}}function g(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;p(t)},a=function(t){e.port2.postMessage(t)}}function b(){var e=o.documentElement;a=function(t){var n=o.createElement("script");n.onreadystatechange=function(){p(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function I(){a=function(e){setTimeout(p,0,e)}}})("undefined"===typeof self?"undefined"===typeof e?this:e:self)}).call(this,n("c8ba"),n("4362"))},a516:function(e,t,n){"use strict";var a=n("2497"),i=n("bc3a"),s=n.n(i),r=n("c596");t["a"]={getBrandManageList:function(e,t,n){s.a.get(r["g"].commodity.getBrandManageList,{params:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},deleteBrand:function(e,t,n){s.a.delete(r["g"].commodity.deleteBrand,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))},deleteSeries:function(e,t,n){s.a.delete(r["g"].commodity.deleteSeries,{data:e}).then(Object(a["a"])(t,n)).catch((function(e){console.error(e)}))}}},a9e3:function(e,t,n){"use strict";var a=n("83ab"),i=n("da84"),s=n("94ca"),r=n("6eeb"),o=n("5135"),c=n("c6b6"),l=n("7156"),d=n("c04e"),u=n("d039"),p=n("7c73"),f=n("241c").f,m=n("06cf").f,h=n("9bf2").f,g=n("58a8").trim,b="Number",I=i[b],v=I.prototype,y=c(p(v))==b,S=function(e){var t,n,a,i,s,r,o,c,l=d(e,!1);if("string"==typeof l&&l.length>2)if(l=g(l),t=l.charCodeAt(0),43===t||45===t){if(n=l.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:a=2,i=49;break;case 79:case 111:a=8,i=55;break;default:return+l}for(s=l.slice(2),r=s.length,o=0;o<r;o++)if(c=s.charCodeAt(o),c<48||c>i)return NaN;return parseInt(s,a)}return+l};if(s(b,!I(" 0o1")||!I("0b1")||I("+0x1"))){for(var B,_=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof _&&(y?u((function(){v.valueOf.call(n)})):c(n)!=b)?l(new I(S(t)),n,_):S(t)},C=a?f(I):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;C.length>w;w++)o(I,B=C[w])&&!o(_,B)&&h(_,B,m(I,B));_.prototype=v,v.constructor=_,r(i,b,_)}},aa4c:function(e,t,n){},b019:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"product-column"},[n("div",{staticClass:"flex"},[e._l(e.seriesDataList,(function(t,a){return n("div",{key:a,staticClass:"rights_card"},[n("div",{staticClass:"logo"},[n("div",{staticClass:"image"},[n("img",{attrs:{src:t.image,onerror:e.defaultImg},on:{click:function(n){return n.stopPropagation(),e.seriesIconHandeler(e.id,t.id)}}})]),n("i",{staticClass:"el-icon-close",on:{click:function(n){return n.stopPropagation(),e.deleteHandler(t.id)}}})]),n("span",{staticStyle:{color:"#1a1a1a","font-size":"12px","margin-left":"15px"}},[e._v(e._s(t.name))])])})),n("div",{staticClass:"rights_card_add",on:{click:function(t){return t.stopPropagation(),e.addHandeler(e.id)}}},[e._m(0),n("span",{staticClass:"label"},[e._v("添加系列 ")])])],2)])},i=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"image"},[a("img",{staticClass:"addImg",attrs:{src:n("24e9"),alt:""}})])}],s=n("24e9"),r=n.n(s),o={name:"brandSeriesMgmtList",props:{seriesDataList:{type:Array,default:function(){return[]}},id:{type:String}},data:function(){return{addButton:r.a,defaultImg:'this.src="'+n("b89e")+'"'}},methods:{deleteHandler:function(e){this.$emit("deleteSeries",e)},addHandeler:function(e){this.$emit("addButtonClick",e)},seriesIconHandeler:function(e,t){this.$emit("seriesIconClick",e,t)}}},c=o,l=(n("c747"),n("2877")),d=Object(l["a"])(c,a,i,!1,null,null,null),u=d.exports;n.d(t,"a",(function(){return u}))},baa5:function(e,t,n){var a=n("23e7"),i=n("e58c");a({target:"Array",proto:!0,forced:i!==[].lastIndexOf},{lastIndexOf:i})},c747:function(e,t,n){"use strict";var a=n("1e8b"),i=n.n(a);i.a},e58c:function(e,t,n){"use strict";var a=n("fc6a"),i=n("a691"),s=n("50c4"),r=n("a640"),o=n("ae40"),c=Math.min,l=[].lastIndexOf,d=!!l&&1/[1].lastIndexOf(1,-0)<0,u=r("lastIndexOf"),p=o("indexOf",{ACCESSORS:!0,1:0}),f=d||!u||!p;e.exports=f?function(e){if(d)return l.apply(this,arguments)||0;var t=a(this),n=s(t.length),r=n-1;for(arguments.length>1&&(r=c(r,i(arguments[1]))),r<0&&(r=n+r);r>=0;r--)if(r in t&&t[r]===e)return r||0;return-1}:l},eb33:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"brand-series-mgmt"},[n("biz-flex-table",{ref:"table",attrs:{loading:e.loading,operations:e.operations,tableData:e.tableData,filters:e.filters,pagination:e.pagination,rowKeys:e.rowKeys},on:{operate:e.operate,"filter-data-change":e.filterDataChange,"selection-change":e.handleSelectionChange,"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[n("el-table-column",{attrs:{width:"260",prop:"Brand",label:"品牌"},scopedSlots:e._u([{key:"default",fn:function(t){return n("div",{staticStyle:{position:"relative"},on:{click:function(n){return n.stopPropagation(),e.brandClick(t.row)}}},[n("img",{staticStyle:{width:"50px",height:"50px","vertical-align":"middle",margin:"0px 15px 0px 20px",cursor:"pointer"},attrs:{src:t.row.logo,onerror:e.defaultImg}}),n("span",{staticStyle:{color:"#1a1a1a","font-size":"12px"}},[e._v(e._s(t.row.name))])])}}])}),n("el-table-column",{attrs:{label:"系列",prop:"Brand.seriesDataList"},scopedSlots:e._u([{key:"default",fn:function(t){return n("div",{staticStyle:{width:"100%"}},[n("biz-column-table",{attrs:{seriesDataList:t.row.seriesDataList,id:t.row.id},on:{addButtonClick:e.addButtonClick,seriesIconClick:e.seriesIconClick,deleteSeries:e.deleteSeries}})],1)}}])}),n("el-table-column",{attrs:{width:"100",prop:"date",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return e.hasAuthDel?n("div",{},[n("div",{staticClass:"biz-customcol"},[n("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(n){return n.stopPropagation(),e.deleteCommodity(t.row.id)}}},[e._v(" 删除 ")])],1)]):e._e()}}],null,!0)})],1),n("biz-popup-tabs",{attrs:{open:e.openBrand},on:{close:function(t){e.openBrand=!1}},model:{value:e.tabName_brand,callback:function(t){e.tabName_brand=t},expression:"tabName_brand"}},[n("el-tab-pane",{attrs:{label:"品牌信息",name:"brandBaseinfo"}},[n("BrandBaseInfo",{ref:"brandBaseInfo",attrs:{id:e.brandId,isEdit:e.isEdit,refreshSign:e.refreshSign},on:{created:e.refresh}})],1)],1),n("biz-popup-tabs",{attrs:{open:e.openSeries},on:{close:function(t){e.openSeries=!1}},model:{value:e.tabName_series,callback:function(t){e.tabName_series=t},expression:"tabName_series"}},[n("el-tab-pane",{attrs:{label:"系列信息",name:"seriesBaseinfo"}},[n("SeriesBaseInfo",{ref:"seriesBaseInfo",attrs:{id:e.seriesId,isEdit:e.isEdit,brandId:e.brandId,refreshSign:e.refreshSign},on:{created:e.refresh}})],1)],1),n("biz-popup-tabs",{attrs:{open:e.open},on:{close:function(t){e.open=!1}},model:{value:e.tabName,callback:function(t){e.tabName=t},expression:"tabName"}},[n("el-tab-pane",{attrs:{label:"导入品牌/系列",name:"import"}},[n("ImportBrandSeries",{ref:"import",attrs:{open:e.open},on:{closePoup:e.closePoup,openPoup:e.openPoup,operationSuccess:e.operationSuccess}})],1)],1)],1)},i=[],s=(n("caad"),n("d81d"),n("b0c0"),n("a9e3"),n("2532"),n("b85c")),r=n("5530"),o=n("7132"),c=n("04d3"),l=n("b019"),d=n("e9c2"),u=n("2bee"),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"import-brand-series"},[n("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}),n("el-form",{attrs:{"label-width":"80px",size:"small"}},[n("el-form-item",{attrs:{label:"品牌："}},[n("el-select",{attrs:{placeholder:"请选择品牌",filterable:""},on:{change:e.getSeriesName},model:{value:e.brandId,callback:function(t){e.brandId=t},expression:"brandId"}},e._l(e.brandOptions,(function(e){return n("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})})),1),n("div",{staticClass:"font"},[e._v("请选择品牌，并选择其下的系列进行数据导入。当前平台支持导入的整车品牌/系列数据")])],1),n("el-form-item",{attrs:{label:"系列："}},[n("biz-list",{ref:"table",attrs:{height:e.heightList,tableData:e.seriesDataList},on:{handleSelectionChange:e.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"50"}}),n("el-table-column",{attrs:{prop:"name",label:"名称"}})],1),n("import-file",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"importFile",staticStyle:{"margin-left":"10px"},attrs:{tableData:e.importResult,importLoading:e.importLoading,total:e.total,disabled:e.disabled,count:e.count,percentage:e.percentage,stepkey:e.stepkey,action:"/admin/shopProduct/importProduct.jhtml",name:"uFile"},on:{clearTimeOut:e.clearTimeOut,restProcess:e.restProcess,"handle-import":e.handleImport}},[n("el-table-column",{attrs:{label:"编号",prop:"line",width:"50"}}),n("el-table-column",{attrs:{label:"消息",prop:"result"}})],1)],1)],1)],1)},f=[],m=n("8330"),h=n("f36f"),g=n("1ab1"),b=n("5118"),I=n("ccf0"),v={name:"CommodityMgmtBaseInfo",data:function(){return{heightList:"300",multipleSelection:[],modeList:[],operations:[{label:"确定",name:"save",type:"primary",auth:["admin:shopBrand.edit"]}],rules:{topProductCategoryId:[{required:!0,message:"请选择分类",trigger:"blur"}]},brandOptions:[],brandId:"",seriesId:[],seriesDataList:[],importLoading:!1,importResult:[],disabled:!1,show:!1,total:0,count:0,t:"",percentage:0,stepkey:"",loading:!1}},props:{open:{type:Boolean,default:!1}},watch:{open:function(e){e?this.getBrandName():(this.brandId="",this.brandOptions=[],this.seriesId=[],this.seriesDataList=[],this.importResult=[],this.successCount=0,this.failCount=0)}},components:{BizGrid:h["a"],BizSaveButton:m["a"],BizList:c["e"],ImportFile:I["b"]},created:function(){this.getBrandName()},computed:{},methods:{operate:function(e){this[e]()},handleSelectionChange:function(e){this.multipleSelection=e},clearTimeOut:function(){window.clearTimeout(this.t)},restProcess:function(){this.total=0,this.count=0,this.stepkey="",this.percentage=0},handleImport:function(){var e=this,t="/admin/shopBrand/importProgress.jhtml";g["a"].get(t,{type:"13"}).then((function(t){t.data.total||(e.total=0,e.count=0,e.stepkey="",e.percentage=0),t.data.total&&(e.total=Number(t.data.total||0),e.count=Number(t.data.count||0),e.stepkey=t.data.remark,e.percentage=Number(t.data.rate),e.$refs.importFile.title=t.data.title),t.data&&t.data.rate&&"100"===t.data.rate?(e.clearTimeOut(),e.$refs.importFile.showCurrentInfo=!1,e.$refs.importFile.title="导入完成",e.$refs.importFile.uploadingVisible=!0,t.data&&t.data.results&&t.data.results.length>0&&(e.importResult=t.data.results,e.$refs.importFile.uploadingVisible=!1,e.$refs.importFile.importingVisible=!0,e.$emit("operationSuccess")),e.disabled=!1):t.data&&t.data.rate&&"100"!==t.data.rate?(e.t&&e.clearTimeOut(),e.t=Object(b["setTimeout"])(e.handleImport,2e3),e.$refs.importFile.uploadingVisible=!0,e.$refs.importFile.showCurrentInfo=!0,e.disabled=!0):(e.$refs.importFile.uploadingVisible=!1,e.$emit("openPoup"))})).catch((function(e){console.log(e),console.log("code错误")}))},getUploadProductFileParam:function(e){return{shopId:window.top.SHOP_ID||"",filePath:e}},getBrandName:function(){var e=this;this.brandId="",this.brandOptions=[],this.seriesIds=[],this.seriesDataList=[],g["a"].get("/admin/brand/brandList.jhtml",{}).then((function(t){e.brandOptions=t.dataList})).catch((function(e){console.log(e)}))},getSeriesName:function(){var e=this;this.seriesId=[],this.seriesDataList=[],g["a"].get("/admin/series/seriesList.jhtml",{brandId:this.brandId}).then((function(t){e.seriesDataList=t.dataList})).catch((function(e){console.log(e)}))},save:function(){var e=this,t=[];this.multipleSelection.map((function(e){t.push({id:e.id})}));var n={shopId:window.top.SHOP_ID||"",id:this.brandId,seriesDataList:t};this.operations[0].disabled=!0,this.$emit("closePoup"),Object(b["setTimeout"])((function(){e.handleImport()}),200),g["a"].post("/admin/shopBrand/brandSeries/import.jhtml",n).then((function(t){e.loading=!1,e.operations[0].disabled=!1,e.$emit("operationSuccess")})).catch((function(t){e.loading=!1,e.$refs.importFile.uploadingVisible=!1,e.operations[0].disabled=!1,console.log(t)}))}}},y=v,S=(n("51b3"),n("2877")),B=Object(S["a"])(y,p,f,!1,null,null,null),_=B.exports,C=n("a516"),w=n("2f62"),x=n("c596"),k={name:"CommodityMgmt",data:function(){return{loading:!1,refreshSign:!0,editShopIds:[],isEdit:!0,brandId:"",seriesId:"",tabName:"import",tabName_brand:"brandBaseinfo",tabName_series:"seriesBaseinfo",openBrand:!1,openSeries:!1,open:!1,multipleSelection:[],operations:[{label:"添加品牌",name:"add",type:"primary",auth:["admin:shopBrand.add"]},{disabled:!0,label:"删除",name:"deleteList",type:"",auth:["admin:shopBrand.delete"]},{label:"刷新",name:"refresh",type:""},{label:"导入",name:"import",type:"",auth:["admin:shopBrand.import"]}],filters:[{type:"input",label:"",placeholder:"请输入关键字",name:"searchValue",value:""}],tableData:[],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:9},defaultImg:'this.src="'+n("517a")+'"'}},components:{BizPopupTabs:o["a"],BizFlexTable:c["c"],BrandBaseInfo:d["a"],SeriesBaseInfo:u["a"],BizColumnTable:l["a"],ImportBrandSeries:_},computed:Object(r["a"])(Object(r["a"])({},Object(w["c"])("Authority",["currentAuth"])),{},{hasAuthDel:function(){return this.currentAuth.includes("admin:product.delete")}}),created:function(){this.getUser(),this.refresh(),this.getKpi(),this.getEditableStores()},mounted:function(){},methods:Object(r["a"])(Object(r["a"])({},Object(w["c"])(["getUser"])),{},{operate:function(e){this[e]()},rowKeys:function(e){return e.name+e.fullName},refresh:function(){this.getList()},import:function(){this.$refs.import.handleImport()},closePoup:function(){this.open=!1},openPoup:function(){this.open=!0},operationSuccess:function(){this.refresh()},getKpi:function(){var e=this;g["a"].get("/admin/product/queryNavigationKpi.jhtml",{}).then((function(t){var n="您可创建或者导入品牌及系列，当前已维护品牌"+t.data.shopBrandsCount+"个";e.$message({customClass:"motorists-club-activity__kpi",showClose:!0,message:n,duration:3e3})})).catch((function(t){e.$message.warning(t.errorMessage||"操作出现错误")}))},getEditableStores:function(){var e=this;g["a"].get(x["j"].editableStores,{resourceType:"2"}).then((function(t){e.editShopIds=[],t.dataList.map((function(t){e.editShopIds.push(t.id)}))})).catch((function(e){console.log(e),console.log("code错误")}))},getList:function(){var e=this,t={searchProperty:"name",searchValue:this.filters[0].value,shopId:window.top.SHOP_ID||"",pageNumber:this.pagination.currentPage,pageSize:this.pagination.pageSize};!0!==this.openBrand&&!0!==this.openSeries&&(this.loading=!0),C["a"].getBrandManageList(t,(function(t){e.tableData=t.Brand,e.pagination.total=Number(t.total),e.loading=!1}),(function(t){console.log(t),e.loading=!1}))},filterDataChange:function(e){this.pagination.currentPage=1,this.refresh()},deleteList:function(){var e=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t,n=[],a=Object(s["a"])(e.multipleSelection);try{for(a.s();!(t=a.n()).done;){var i=t.value;n.push(i.id)}}catch(o){a.e(o)}finally{a.f()}var r={ids:n};C["a"].deleteBrand(r,(function(t){e.$message({type:"success",message:"删除成功!"}),e.refresh()}),(function(t){e.$message.warning(t.errorMessage)}))})).catch((function(){}))},deleteCommodity:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var n=[];n.push(e);var a={ids:n};C["a"].deleteBrand(a,(function(e){t.$message({type:"success",message:"删除成功!"}),t.refresh()}),(function(e){t.$message.warning(e.errorMessage)}))})).catch((function(){}))},deleteSeries:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var n=[];n.push(e);var a={ids:n};C["a"].deleteSeries(a,(function(e){t.$message({type:"success",message:"删除成功!"}),t.refresh()}),(function(e){t.$message.warning(e.errorMessage)}))})).catch((function(){}))},add:function(){this.openBrand=!0,this.$refs.brandBaseInfo.clear(),this.brandId=""},handleSelectionChange:function(e){this.operations.map((function(t){"deleteList"===t.name&&(t.disabled=!0),e.length>0&&"deleteList"===t.name&&(t.disabled=!1)})),this.multipleSelection=e},handleSizeChange:function(e){this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.refresh()},typeFilterHandler:function(e,t){return t.type===e},statusFilterHandler:function(e,t){return t.state===e},addButtonClick:function(e){this.openBrand=!1,this.openSeries=!0,this.brandId=e,this.$refs.seriesBaseInfo.clear(),this.seriesId=""},seriesIconClick:function(e,t){this.refreshSign=!this.refreshSign,this.seriesId=t,this.openSeries=!0},brandClick:function(e){this.refreshSign=!this.refreshSign,this.brandId=e.id,this.openBrand=!0}})},N=k,T=(n("fcd4d"),Object(S["a"])(N,a,i,!1,null,null,null));t["default"]=T.exports},fcd4d:function(e,t,n){"use strict";var a=n("393d"),i=n.n(a);i.a}}]);