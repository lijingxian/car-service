(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ed6b28c4"],{2119:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"biz-avatar-uploader-multi"},[a("div",{staticClass:"el-upload-list el-upload-list--picture-card"},[e._l(e.value,(function(t){return a("div",{key:t.index,staticClass:"el-upload-list__item is-success",attrs:{tabindex:"0"}},[a("img",{staticClass:"el-upload-list__item-thumbnail",attrs:{src:t,alt:""}}),a("span",{staticClass:"el-upload-list__item-actions"},[a("span",{staticClass:"el-upload-list__item-preview",on:{click:function(a){return e.handlePictureCardPreview(t)}}},[a("i",{staticClass:"el-icon-zoom-in"})]),a("span",{directives:[{name:"show",rawName:"v-show",value:e.isShowDelete,expression:"isShowDelete"}],staticClass:"el-upload-list__item-delete",on:{click:function(a){return e.handleRemove(t)}}},[a("i",{staticClass:"el-icon-delete"})])])])})),e.showUploader?a("el-upload",{ref:"upload",class:e.disabled?"avatar-uploader-disabled":"avatar-uploader",style:e.avatarStyle,attrs:{multiple:"","show-file-list":!1,accept:"image/*",limit:Number(e.limit),"file-list":e.fileList,data:e.fileData,"on-success":e.handleSuccess,"on-exceed":e.handleExceed,name:"file",action:"/admin/file/uploads.jhtml",disabled:e.disabled}},[a("i",{staticClass:"el-icon-plus avatar-uploader-icon",style:e.plusStyle})]):e._e()],2),a("el-dialog",{attrs:{visible:e.dialogVisible,"append-to-body":!0},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1)},n=[],o=(a("99af"),a("d81d"),a("a434"),a("ac1f"),a("1276"),{name:"ImgUploader",props:{value:{type:Array,default:function(){return[]}},imageForm:{type:Array,default:function(){return[]}},showUploader:{type:Boolean,default:function(){return!0}},size:{type:Object,default:function(){return{width:100,height:100}}},limit:{default:"9"},disabled:{type:Boolean,default:function(){return!1}},isShowDelete:{type:Boolean,default:function(){return!0}}},data:function(){return{fileData:{type:"0"},fileList:[],dialogVisible:!1,dialogImageUrl:""}},methods:{handleSuccess:function(e){var t=this.value.concat(e.fis[0].url);this.$emit("input",t)},handleExceed:function(e,t){this.$message.warning("只能上传".concat(this.limit,"张图片"))},handleRemove:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.removePic(e)}))},removePic:function(e){for(var t=this.value,a=0;a<t.length;a++)t[a]===e&&t.splice(a,1);this.$emit("input",t)},handlePictureCardPreview:function(e){this.dialogImageUrl=e,this.dialogVisible=!0}},computed:{plusStyle:function(){return{"line-height":this.size.height+"px"}},avatarStyle:function(){return{height:this.size.height+"px",width:this.size.width+"px"}}},watch:{value:function(e,t){console.log("value: ",this.value),this.fileList=e.map((function(e){return{name:e.split("/")[e.split("/").length-1],url:e}}))}},components:{}}),s=o,l=(a("d74a"),a("2877")),r=Object(l["a"])(s,i,n,!1,null,null,null);t["a"]=r.exports},"21c5":function(e,t,a){},8046:function(e,t,a){"use strict";var i=a("f4eb"),n=a.n(i);n.a},"8f7f":function(e,t,a){},c0a6a:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"purchase-statistics-agency"},[a("div",{attrs:{slot:"top"},slot:"top"},[a("biz-header",{attrs:{operations:e.operations,filters:e.filters},on:{operate:e.operate,filterDataChange:e.filterDataChange,"active-item-change":e.activeItemChange,"cascader-change":e.cascaderChange}}),a("div",{staticStyle:{"font-size":"14px","margin-bottom":"10px",display:"flex"}},[a("div",[e._v(" 采购金额： "),[e._v("￥"+e._s(e.sumPurchaseFee))]],2),a("div",{staticStyle:{"margin-left":"15px"}},[e._v(" 退货金额： "),[e._v("￥"+e._s(e.sumReturnFee))]],2)])],1),a("biz-list",{ref:"table",attrs:{tableData:e.tableData,size:"small",height:"100%"},on:{handleSelectionChange:e.handleSelectionChange,rowClick:e.rowClick}},[a("el-table-column",{attrs:{type:"selection",width:"50"}}),a("el-table-column",{attrs:{label:"商品","min-width":"260px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticStyle:{display:"flex","justify-content":"space-between",width:"100%"}},[a("div",{staticStyle:{width:"100%"}},[a("div",{staticClass:"product-info-content"},[t.row.thumbnail&&" "!==e.orderItem.thumbnail?a("img",{attrs:{src:t.row.thumbnail,onerror:e.errorImg}}):a("img",{attrs:{src:"/resources/admin/images/default/product-default-100.png"}}),a("div",{staticStyle:{width:"100%"}},[a("div",{staticClass:"titleClass",attrs:{title:t.row.specValue}},[e._v(e._s(t.row.specValue))]),a("div",{staticClass:"overflow"},[e._v(e._s(t.row.barCode))]),a("div",{staticClass:"overflow"},[e._v("单价(不含税)：")]),a("div",{staticClass:"overflow"},[e._v("单价(含税)：")])])])])])]}}])}),a("el-table-column",{attrs:{label:"采购","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticStyle:{width:"100%"}},[a("div",{staticClass:"overflow"},[e._v("商品数量："+e._s(t.row.purchaseAmount))]),a("div",{staticClass:"overflow"},[e._v("金额(不含税)：")]),a("div",{staticClass:"overflow"},[e._v("税额(含税)：")]),a("div",{staticClass:"overflow"},[e._v("金额(含税)："+e._s(t.row.purchaseFee))])])]}}])}),a("el-table-column",{attrs:{label:"采购退货","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{staticStyle:{width:"100%"}},[a("div",{staticClass:"overflow"},[e._v("商品数量："+e._s(t.row.returnAmount))]),a("div",{staticClass:"overflow"},[e._v("金额(不含税)：")]),a("div",{staticClass:"overflow"},[e._v("税额(含税)：")]),a("div",{staticClass:"overflow"},[e._v("金额(含税)："+e._s(t.row.returnFee))])])]}}])})],1),a("div",{attrs:{slot:"float"},slot:"float"},[a("biz-popup-tabs",{attrs:{open:e.open},on:{close:function(t){e.open=!1}},model:{value:e.tabName,callback:function(t){e.tabName=t},expression:"tabName"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"info"}},[a("base-info",{ref:"baseinfo",attrs:{itemId:e.itemId,beginTime:e.filters[2].value[0]?this.filters[1].value[0]+" 00:00:00":"",endTime:e.filters[2].value[1]?e.filters[1].value[1]+" 23:59:59":""},on:{openOrderTab:e.openOrderTab}})],1)],1),a("biz-popup-tabs",{attrs:{open:e.openRelateBill},on:{close:function(t){e.openRelateBill=!1}},model:{value:e.relateBillSn,callback:function(t){e.relateBillSn=t},expression:"relateBillSn"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"baseinfo"}},[a("purchase-order-info",{ref:"orderinfo",attrs:{orderId:e.relateBillId,isEdit:e.isEdit}})],1)],1)],1),a("div",{attrs:{slot:"bottom"},slot:"bottom"},[a("biz-pagination",{attrs:{pagination:e.pagination},on:{handleSizeChange:e.handleSizeChange,handleCurrentChange:e.handleCurrentChange}})],1)],1)},n=[],o=(a("99af"),a("4160"),a("d81d"),a("b0c0"),a("a9e3"),a("d3b7"),a("ac1f"),a("25f0"),a("3ca3"),a("466d"),a("1276"),a("159b"),a("ddb0"),a("2b3d"),a("96cf"),a("1da1")),s=a("5530"),l=a("04d3"),r=a("f36f"),c=a("7132"),u=a("1ab1"),d=a("2f62"),p=a("5eb4"),h=a("bc3a"),f=a.n(h),g=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{staticClass:"purchase-item"},[a("biz-flex-table",{ref:"table",attrs:{tableData:e.tableData,loading:e.loading,pagination:e.pagination,checkable:!1},on:{operate:e.operate,"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-table-column",{attrs:{prop:"orderSn",label:"订单编号"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){return e.clickRelateBill(a,t.row)}}},[a("span",{staticStyle:{"white-space":"normal"}},[e._v(e._s(t.row.orderSn?t.row.orderSn:""))])])]}}])}),a("el-table-column",{attrs:{prop:"productName",label:"类型"}}),a("el-table-column",{attrs:{prop:"purchaseAmount",label:"数量"}}),a("el-table-column",{attrs:{prop:"purchaseFee",label:"金额"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("￥"+e._s(t.row.purchaseFee))]}}])}),a("el-table-column",{attrs:{prop:"createDate",label:"时间"}})],1)],1)},m=[],v={name:"BaseInfo",components:{BizFlexTable:l["c"],BizGrid:r["a"]},props:{itemId:{type:String,default:function(){return""}},beginTime:{type:String,default:function(){return""}},endTime:{type:String,default:function(){return""}}},data:function(){return{loading:!1,tableData:[],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:9}}},created:function(){},computed:{},mounted:function(){},watch:{itemId:function(e,t){e&&this.getList()}},methods:{operate:function(e){this[e]()},clickRelateBill:function(e,t){e.stopPropagation(),this.$emit("openOrderTab",t)},getList:function(){var e=this,t={pageNumber:this.pagination.currentPage,pageSize:this.pagination.pageSize,shopId:window.top.SHOP_ID||"",productId:this.itemId,beginTime:this.beginTime,endTime:this.endTime};u["a"].get("/admin/invoicing/purchase/agentPurchaseReport.jhtml",t).then((function(t){e.tableData=t.dataList,e.pagination.total=Number(t.total),e.loading=!1})).catch((function(t){e.loading=!1,t.errorMessage&&e.$message.warning(t.errorMessage)})).finally((function(t){e.loading=!1}))},handleSizeChange:function(e){this.pagination.pageSize=e,this.getList()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.getList()}}},b=v,w=(a("f838"),a("2877")),y=Object(w["a"])(b,g,m,!1,null,null,null),C=y.exports,S={name:"PurchaseStatistics",data:function(){return{title:"",itemId:"",loading:!1,visiable:!1,open:!1,relateBillSn:"baseinfo",openRelateBill:!1,relateBillId:"",isEdit:!0,tabName:"info",selections:[],categoryDatas:[],sumPurchaseFee:"",sumReturnFee:"",productCategoryId:"",operations:[{label:"导出",name:"export",type:""}],filters:[{type:"select",label:"供应商",name:"supplier",value:"",options:[]},{type:"cascader",label:"商品分类",name:"category",filterable:!1,value:[],options:[]},{type:"daterange",label:"创建日期",name:"publishDate",value:[]},{type:"input",label:"",placeholder:"请输入商品名称",name:"searchValue",value:""}],tableData:[],pagination:{pageSize:20,currentPage:1,pageSizes:[10,20,50,100],total:9}}},components:{BizHeader:l["d"],BizPagination:l["f"],BizList:l["e"],BizGrid:r["a"],BaseInfo:C,BizPopupTabs:c["a"],PurchaseOrderInfo:p["a"]},created:function(){this.getList(),this.querySupplierList(),this.queryCategoryList()},watch:{},computed:{},mounted:function(){},methods:Object(s["a"])(Object(s["a"])({},Object(d["c"])(["getUser"])),{},{operate:function(e){this[e]()},refresh:function(){this.getList()},openOrderTab:function(e){var t=this;this.relateBillId=e.orderId,this.openRelateBill=!0,this.open=!1,this.$nextTick((function(){t.$refs.orderinfo.getOrderInfo()})),this.isEdit=!1},queryFilters:function(){var e=this,t={shopId:window.top.SHOP_ID||""};u["a"].get("/admin/toB/product/productCategories.jhtml",t).then((function(t){e.categoryDatas=t.productCategorys,e.setCategoryFilters()})).catch((function(){}))},setCategoryFilters:function(){var e=[{value:"",label:"全部"}];this.categoryDatas.forEach((function(t){e.push({value:t.id,label:t.name,children:[{label:"全部",value:""}]})})),this.filters[1].options=e},cascaderChange:function(e){this.productCategoryId=e[e.length-1],e.length>1&&""===this.productCategoryId&&(this.productCategoryId=e[e.length-2]),this.refresh()},activeItemChange:function(e){var t=this,a={shopId:this.getUser().shop.id,parentId:e.toString()};u["a"].get("/admin/toB/product/productCategories.jhtml",a).then((function(a){var i;t.setCategoryFilters(),t.filters[1].options.forEach((function(t){t.value===e[0]&&(i=t.children)})),a.childrenProductCategoryDataList.forEach((function(e){i.push({value:e.id,label:e.name})}))})).catch((function(){}))},export:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var a,i,n,o,s,l;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=[],e.selections&&e.selections.length>0&&e.selections.forEach((function(e){a.push(e.productId)})),i={ids:a,pageSize:e.pagination.pageSize,supplierId:e.filters[0].value,pageNumber:e.pagination.currentPage,shopId:window.top.SHOP_ID||"",searchValue:e.filters[3].value,categoryId:e.productCategoryId,beginTime:e.filters[2].value[0]?e.filters[2].value[0]+" 00:00:00":"",endTime:e.filters[2].value[1]?e.filters[2].value[1]+" 23:59:59":""},t.prev=3,t.next=6,f.a.post("/admin/invoicing/purchase/agentPurchaseReports/export.jhtml",i,{responseType:"blob"});case 6:return n=t.sent,console.log("response => ",n),o=new Blob([n.data],{type:"application/vnd.ms-excel"}),console.log(decodeURI(n.headers["content-disposition"])),s=decodeURI(n.headers["content-disposition"].split("filename=")[1]),l=document.createElement("a"),l.download=s.match(/"(\S*)"/)[1],l.style.display="none",l.href=URL.createObjectURL(o),document.body.appendChild(l),l.click(),URL.revokeObjectURL(l.href),document.body.removeChild(l),t.abrupt("return");case 22:throw t.prev=22,t.t0=t["catch"](3),new Error(t.t0);case 25:case"end":return t.stop()}}),t,null,[[3,22]])})))()},getList:function(){var e=this,t={pageSize:this.pagination.pageSize,pageNumber:this.pagination.currentPage,shopId:window.top.SHOP_ID||"",supplierId:this.filters[0].value,searchValue:this.filters[3].value,categoryId:this.productCategoryId,beginTime:this.filters[2].value[0]?this.filters[2].value[0]+" 00:00:00":"",endTime:this.filters[2].value[1]?this.filters[2].value[1]+" 23:59:59":""};this.loading=!0,u["a"].get("/admin/invoicing/purchase/agentPurchaseReports.jhtml",t).then((function(t){e.tableData=t.dataList,e.sumPurchaseFee=t.sumPurchaseFee,e.sumReturnFee=t.sumReturnFee,e.pagination.total=Number(t.total),e.loading=!1})).catch((function(t){e.$message.warning(t.errorMessage),console.log("ERR_REFRESH: ",t)})).finally((function(t){e.loading=!1}))},querySupplierList:function(){var e=this;this.loading=!0;var t={shopId:window.top.SHOP_ID||"",cooperationType:"0",state:""};u["a"].get("/admin/cooperationInfo/agent/supplierStores.jhtml",t).then((function(t){e.filters[0].options=[{label:"全部",value:""}].concat(t.dataList.map((function(e){return{label:e.shop.name,value:e.shop.id}})))})).catch((function(t){console.log(t),console.log("code错误"),t.errorMessage&&e.$message.warning(t.errorMessage)})).finally((function(){e.loading=!1}))},queryCategoryList:function(){var e=this,t={shopId:this.getUser().shop.id};u["a"].get("/admin/toB/product/productCategories.jhtml",t).then((function(t){e.filters[1].options=[{label:"全部",value:""}].concat(t.productCategorys.map((function(e){return{label:e.name,value:e.id}})))})).catch((function(t){e.$message.warning(t.errorMessage),console.log("ERR_REFRESH: ",t)})).finally((function(e){}))},handleSelectionChange:function(e){this.selections=e},filterDataChange:function(e){this.filters=e,this.pagination.currentPage=1,this.refresh()},handleSizeChange:function(e){this.pagination.pageSize=e,this.refresh()},handleCurrentChange:function(e){this.pagination.currentPage=e,this.refresh()},rowClick:function(e,t,a){var i=this;this.itemId=e.productId,this.tabName="info",this.open=!0,this.$nextTick((function(){i.$refs.baseinfo.getList()}))}})},_=S,I=(a("8046"),Object(w["a"])(_,i,n,!1,null,null,null));t["default"]=I.exports},d74a:function(e,t,a){"use strict";var i=a("21c5"),n=a.n(i);n.a},f4eb:function(e,t,a){},f838:function(e,t,a){"use strict";var i=a("8f7f"),n=a.n(i);n.a}}]);