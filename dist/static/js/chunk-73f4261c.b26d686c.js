(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-73f4261c"],{"15d7":function(e,t,a){"use strict";var r=a("eb66"),n=a.n(r);n.a},2497:function(e,t,a){"use strict";var r=a("4360"),n=a("a18c");t["a"]=function(e,t){return function(a){var i=a.data;"100"===i.resultCode?e(i):"709"===i.resultCode?(r["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",r["a"].getters.currentUser),n["a"].push("/login")):t(i)}}},"2bee":function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{staticClass:"series-base-info"},[e.isEdit?a("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}):e._e(),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"100px",size:"small",disabled:!e.isEdit}},[a("el-form-item",{attrs:{label:"系列名称",prop:"name"}},[a("el-autocomplete",{attrs:{placeholder:"请输入系列名称","fetch-suggestions":e.querySearchAsync},on:{select:e.handleSelect},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"Logo",prop:"image"}},[a("BrandSeriesUploader",{attrs:{title:"建议尺寸3:2"},on:{handleUploadSuccess:e.handleUploadSuccess},model:{value:e.form.image,callback:function(t){e.$set(e.form,"image",t)},expression:"form.image"}})],1)],1)],1)},n=[],i=(a("b0c0"),a("b85c")),o=(a("96cf"),a("1da1")),s=a("8330"),c=a("f36f"),l=a("3555"),d=a("f7f7"),u=a("c596"),f=a("bc3a"),m=a.n(f),p={name:"SeriesBaseInfo",data:function(){return{isCreated:!0,loading:!1,list:[],operations:[{label:"保存",name:"save",type:"primary",auth:["admin:shopBrand.edit"]}],form:{id:"",name:"",image:""},rules:{name:[{required:!0,message:"请输入系列名称",trigger:"blur"}],image:[{required:!0,message:"请添加系列Logo",trigger:"blur"}]}}},components:{BizSaveButton:s["a"],BizGrid:c["a"],BrandSeriesUploader:l["a"]},props:{id:{type:String,default:""},isEdit:{type:Boolean,default:function(){return!0}},brandId:{type:String,default:""},refreshSign:Boolean},watch:{id:function(e){""===e&&(this.isCreated=!0,this.form.name="",this.form.image="")},refreshSign:function(){this.isCreated=!1,this.$refs.form.clearValidate(),this.refresh()}},created:function(){},computed:{},methods:{operate:function(e){this[e]()},save:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;e.isCreated?e.createSeries():e.updateSeries()}))},refresh:function(){var e=this,t={id:this.id,shopId:window.top.SHOP_ID||""};d["a"].queryBySeries(t,(function(t){e.form.name=t.seriesData.name,e.form.image=t.seriesData.image,e.brandId=t.brandData.id}),(function(e){console.log(e)}))},createSeries:function(){var e=this,t={brandId:this.brandId,name:this.form.name,image:this.form.image};d["a"].createSeries(t,(function(t){e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.$message.warning(t.errorMessage)}))},updateSeries:function(){var e=this,t={id:this.id,name:this.form.name,image:this.form.image,brandId:this.brandId};d["a"].updateSeries(t,(function(t){e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.$message.warning(t.errorMessage)}))},handleUploadSuccess:function(e){this.form.image=e,this.$refs.form.clearValidate(["image"])},querySearchAsync:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,a){var r,n,o,s,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r={shopId:window.top.SHOP_ID||"",bid:this.brandId},e.prev=1,e.next=4,m.a.get(u["g"].commodity.querySeries,{params:r});case 4:n=e.sent,o=Object(i["a"])(n.data.seriesData);try{for(o.s();!(s=o.n()).done;)c=s.value,c.value=c.name}catch(t){o.e(t)}finally{o.f()}this.list=n.data.seriesData,a(this.list),e.next=14;break;case 11:e.prev=11,e.t0=e["catch"](1),console.error(e.t0);case 14:case"end":return e.stop()}}),e,this,[[1,11]])})));function t(t,a){return e.apply(this,arguments)}return t}(),handleSelect:function(e){var t,a=Object(i["a"])(this.list);try{for(a.s();!(t=a.n()).done;){var r=t.value;r.id===e.id&&(this.form.image=r.image)}}catch(n){a.e(n)}finally{a.f()}console.log(e)},clear:function(){this.isCreated=!0,this.form={id:"",name:"",image:""}}}},h=p,g=(a("15d7"),a("2877")),b=Object(g["a"])(h,r,n,!1,null,null,null);t["a"]=b.exports},3555:function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"brand-series-uploader"},[a("el-upload",{ref:"upload",staticClass:"avatar-uploader",style:e.avatarStyle,attrs:{"show-file-list":!1,accept:"image/*",name:"file","on-success":e.handleSuccess,action:"/admin/file/uploads.jhtml",data:e.fileData}},[e.value?a("div",{staticClass:"avatar"},[a("img",{attrs:{src:e.value,onerror:e.defaultImg}})]):a("i",{staticClass:"el-icon-plus avatar-uploader-icon",style:e.plusStyle}),a("div",{directives:[{name:"show",rawName:"v-show",value:e.value,expression:"value"}],staticClass:"operate",on:{click:function(t){return t.stopPropagation(),e.doThis(t)}}},[a("i",{staticClass:"el-icon-zoom-in",on:{click:function(t){return t.stopPropagation(),e.zoomIn(t)}}}),a("i",{staticClass:"el-icon-plus",on:{click:e.upload}}),a("i",{staticClass:"el-icon-delete",on:{click:e.remove}})])]),a("el-dialog",{staticClass:"avatar-preview-dialog",attrs:{"append-to-body":!0,visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("div",{staticClass:"review"},[a("img",{attrs:{src:e.value,onerror:e.defaultImg}})])])],1)},n=[],i={name:"BrandSeriesUploader",data:function(){return{dialogVisible:!1,fileData:{type:"0"},avatar:"",defaultImg:'this.src="'+a("b89e")+'"'}},props:{size:{type:Object,default:function(){return{width:120,height:120}}},value:{type:String,default:""}},computed:{plusStyle:function(){return{"line-height":this.size.height+"px"}},avatarStyle:function(){return{height:this.size.height+"px",width:this.size.width+"px"}}},methods:{handleSuccess:function(e){this.$emit("input",e.fis[0].url),this.$emit("handleUploadSuccess",e.fis[0].url)},zoomIn:function(){this.dialogVisible=!0},doThis:function(){},upload:function(){this.$refs.upload.$refs["upload-inner"].$refs.input.click()},remove:function(){this.$emit("input","")}}},o=i,s=(a("d3be"),a("2877")),c=Object(s["a"])(o,r,n,!1,null,null,null);t["a"]=c.exports},b89e:function(e,t,a){e.exports=a.p+"static/img/pic_default_fail.876971c2.png"},d3be:function(e,t,a){"use strict";var r=a("d7bb"),n=a.n(r);n.a},d7bb:function(e,t,a){},d86a:function(e,t,a){},e88f:function(e,t,a){"use strict";var r=a("d86a"),n=a.n(r);n.a},e9c2:function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("biz-grid",{staticClass:"brand-base-info"},[e.isEdit?a("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operate},slot:"top"}):e._e(),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"100px",size:"small",disabled:!e.isEdit}},[a("el-form-item",{attrs:{label:"品牌名称",prop:"name"}},[a("el-autocomplete",{attrs:{"trigger-on-focus":!1,placeholder:"请输入品牌名称","fetch-suggestions":e.querySearchAsync},on:{select:e.handleSelect},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{prop:"parentId",label:"上级品牌"}},[a("el-select",{attrs:{filterable:""},model:{value:e.form.parentId,callback:function(t){e.$set(e.form,"parentId",t)},expression:"form.parentId"}},e._l(e.parentBrandList,(function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})})),1)],1),a("el-form-item",{attrs:{label:"Logo",prop:"logo"}},[a("BrandSeriesUploader",{on:{handleUploadSuccess:e.handleUploadSuccess},model:{value:e.form.logo,callback:function(t){e.$set(e.form,"logo",t)},expression:"form.logo"}})],1)],1)],1)},n=[],i=(a("b0c0"),a("b85c")),o=(a("96cf"),a("1da1")),s=a("8330"),c=a("f36f"),l=a("3555"),d=a("f7f7"),u=a("c596"),f=a("bc3a"),m=a.n(f),p=a("1ab1"),h={name:"BrandBaseInfo",data:function(){return{isCreated:!0,loading:!1,list:[],parentBrandList:[],operations:[{label:"保存",name:"save",type:"primary",auth:["admin:shopBrand.edit"]}],form:{id:"",name:"",logo:"",parentId:""},rules:{name:[{required:!0,message:"请输入品牌名称",trigger:"blur"}],logo:[{required:!0,message:"请输入品牌Logo",trigger:"blur"}]}}},components:{BizSaveButton:s["a"],BizGrid:c["a"],BrandSeriesUploader:l["a"]},props:{id:{type:String,default:""},isEdit:{type:Boolean,default:function(){return!0}},refreshSign:Boolean},watch:{id:function(e){this.$refs.form.clearValidate(),""===e&&(this.isCreated=!0,this.form.name="",this.form.logo="")},refreshSign:function(){this.isCreated=!1,this.refresh()}},created:function(){this.getParentBrand()},computed:{},methods:{operate:function(e){this[e]()},save:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;e.isCreated?e.createBrand():e.updateBrand()}))},getParentBrand:function(){var e=this,t={};p["a"].get("/admin/shopBrand/topBrandList.jhtml",t).then((function(t){e.parentBrandList=t.Brand})).catch((function(t){e.loading=!1,e.$message.warning(t.errorMessage||"操作出现错误")}))},refresh:function(){var e=this,t={id:this.id};d["a"].queryByBrand(t,(function(t){e.form.name=t.brandData.name,e.form.parentId=t.brandData.parentId,e.form.logo=t.brandData.logo}),(function(e){console.log(e)}))},createBrand:function(){var e=this,t={name:this.form.name,logo:this.form.logo,type:"image",parentId:this.form.parentId};d["a"].createBrand(t,(function(t){e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.$message.warning(t.errorMessage)}))},updateBrand:function(){var e=this,t={id:this.id,name:this.form.name,logo:this.form.logo,parentId:this.form.parentId};d["a"].updateBrand(t,(function(t){e.$message.success("操作成功"),e.$emit("created")}),(function(t){e.$message.warning(t.errorMessage)}))},handleUploadSuccess:function(e){this.form.logo=e,this.$refs.form.clearValidate(["logo"])},querySearchAsync:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,a){var r,n,o,s,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r={shopId:window.top.SHOP_ID||"",q:t},e.prev=1,e.next=4,m.a.get(u["g"].commodity.queryBrand,{params:r});case 4:n=e.sent,o=Object(i["a"])(n.data.brandNames);try{for(o.s();!(s=o.n()).done;)c=s.value,c.value=c.brand}catch(l){o.e(l)}finally{o.f()}this.list=n.data.brandNames,a(this.list),e.next=14;break;case 11:e.prev=11,e.t0=e["catch"](1),console.error(e.t0);case 14:case"end":return e.stop()}}),e,this,[[1,11]])})));function t(t,a){return e.apply(this,arguments)}return t}(),handleSelect:function(e){var t,a=Object(i["a"])(this.list);try{for(a.s();!(t=a.n()).done;){var r=t.value;r.id===e.id&&(this.form.logo=r.logo)}}catch(n){a.e(n)}finally{a.f()}console.log(e)},clear:function(){this.isCreated=!0,this.form={id:"",name:"",logo:"",parentId:""}}}},g=h,b=(a("e88f"),a("2877")),v=Object(b["a"])(g,r,n,!1,null,null,null);t["a"]=v.exports},eb66:function(e,t,a){},f7f7:function(e,t,a){"use strict";var r=a("2497"),n=a("bc3a"),i=a.n(n),o=a("c596");t["a"]={createBrand:function(e,t,a){i.a.post(o["g"].commodity.createBrand,e).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},updateBrand:function(e,t,a){i.a.put(o["g"].commodity.updateBrand,e).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},queryByBrand:function(e,t,a){i.a.get(o["g"].commodity.queryByBrand,{params:e}).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},createSeries:function(e,t,a){i.a.post(o["g"].commodity.createSeries,e).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},updateSeries:function(e,t,a){i.a.put(o["g"].commodity.updateSeries,e).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},queryBySeries:function(e,t,a){i.a.get(o["g"].commodity.queryBySeries,{params:e}).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},queryBrand:function(e,t,a){i.a.get(o["g"].commodity.queryBrand,{params:e}).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))},querySeries:function(e,t,a){i.a.get(o["g"].commodity.querySeries,{params:e}).then(Object(r["a"])(t,a)).catch((function(e){console.error(e)}))}}}}]);