(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27010062"],{2497:function(e,t,n){"use strict";var o=n("4360"),a=n("a18c");t["a"]=function(e,t){return function(n){var r=n.data;"100"===r.resultCode?e(r):"709"===r.resultCode?(o["a"].commit("updateUser",{shop:{}}),console.log("未登录: ",o["a"].getters.currentUser),a["a"].push("/login")):t(r)}}},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var o=n("1d80"),a=n("5899"),r="["+a+"]",s=RegExp("^"+r+r+"*"),i=RegExp(r+r+"*$"),c=function(e){return function(t){var n=String(o(t));return 1&e&&(n=n.replace(s,"")),2&e&&(n=n.replace(i,"")),n}};e.exports={start:c(1),end:c(2),trim:c(3)}},"5b8e":function(e,t,n){"use strict";var o=n("9678"),a=n.n(o);a.a},7132:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"biz-fade-t"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"biz-popup",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[n("transition",{attrs:{name:"biz-fade-t-right"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}],staticClass:"popup-content",style:e.contentStyle},[e._t("default")],2)])],1)])},a=[],r={name:"BizPopup",props:{open:{type:Boolean,default:function(){return!1}},contentStyle:{type:Object,default:function(){return{}}}},data:function(){return{}},methods:{close:function(){this.$emit("close")}}},s=r,i=(n("5b8e"),n("2877")),c=Object(i["a"])(s,o,a,!1,null,null,null),l=c.exports,u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"biz-popup-tabs"},[n("biz-popup",{attrs:{open:e.open,contentStyle:e.contentStyle},on:{close:e.close}},[n("el-tabs",{attrs:{type:"border-card",value:e.value},on:{"tab-click":e.tabClick}},[e._t("default")],2)],1)],1)},d=[],m=(n("b0c0"),{name:"BizPopupTabs",data:function(){return{}},props:{open:{type:Boolean,default:!1},value:{type:String,required:!0},contentStyle:{type:Object,default:function(){return{}}}},components:{BizPopup:l},methods:{close:function(){var e=this;this.$confirm("是否保存当前页面?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.$emit("close")}))},tabClick:function(e){this.$emit("input",e.name)}}}),f=m,p=(n("d4c2"),Object(i["a"])(f,u,d,!1,null,null,null)),h=p.exports;n.d(t,"a",(function(){return h}))},9678:function(e,t,n){},a9e3:function(e,t,n){"use strict";var o=n("83ab"),a=n("da84"),r=n("94ca"),s=n("6eeb"),i=n("5135"),c=n("c6b6"),l=n("7156"),u=n("c04e"),d=n("d039"),m=n("7c73"),f=n("241c").f,p=n("06cf").f,h=n("9bf2").f,g=n("58a8").trim,b="Number",v=a[b],y=v.prototype,_=c(m(y))==b,S=function(e){var t,n,o,a,r,s,i,c,l=u(e,!1);if("string"==typeof l&&l.length>2)if(l=g(l),t=l.charCodeAt(0),43===t||45===t){if(n=l.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:o=2,a=49;break;case 79:case 111:o=8,a=55;break;default:return+l}for(r=l.slice(2),s=r.length,i=0;i<s;i++)if(c=r.charCodeAt(i),c<48||c>a)return NaN;return parseInt(r,o)}return+l};if(r(b,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var I,w=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof w&&(_?d((function(){y.valueOf.call(n)})):c(n)!=b)?l(new v(S(t)),n,w):S(t)},M=o?f(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),C=0;M.length>C;C++)i(v,I=M[C])&&!i(w,I)&&h(w,I,p(v,I));w.prototype=y,y.constructor=w,s(a,b,w)}},d4c2:function(e,t,n){"use strict";var o=n("e725"),a=n.n(o);a.a},e348:function(e,t,n){},e725:function(e,t,n){},e785:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"recommend-mgmt"},[n("biz-flex-table",{ref:"table",attrs:{tableData:e.tableData,loading:e.loading,checkable:!1},on:{"row-click":e.handleRowOperationClick}},[n("el-table-column",{attrs:{prop:"name",label:"等级"}}),n("el-table-column",{attrs:{prop:"distance",label:"距离",formatter:e.distanceConverter}}),n("el-table-column",{attrs:{prop:"score",label:"评分",formatter:e.scoreConverter}}),e._l(e.tableColumns,(function(t,o){return n("el-table-column",{key:o,attrs:{label:t.name},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.gradeIndicators[o]&&t.row.gradeIndicators[o].recommendScore&&["一星","二星","三星","四星","五星"][Number(t.row.gradeIndicators[o].recommendScore)-1]?">= "+["一星","二星","三星","四星","五星"][Number(t.row.gradeIndicators[o].recommendScore)-1]:"--")+" ")]}}],null,!0)})}))],2),n("div",{attrs:{slot:"float"},slot:"float"},[n("right-popup",{attrs:{open:e.open,itemId:e.itemId},on:{close:function(t){e.open=!1},operationSuccess:e.handleOperationSuccess}})],1)],1)},a=[],r=(n("4160"),n("a9e3"),n("159b"),n("5530")),s=n("04d3"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("biz-popup-tabs",{attrs:{open:e.open},on:{close:e.close},model:{value:e.tabSelection,callback:function(t){e.tabSelection=t},expression:"tabSelection"}},[n("el-tab-pane",{attrs:{label:"推荐规则",name:"0"}},[n("recommend-rule",{attrs:{itemId:e.itemId},on:{operationSuccess:e.operationSuccess}})],1)],1)},c=[],l=n("7132"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("biz-grid",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"promise-rating-mgmt__promise-base-info"},[n("biz-save-button",{attrs:{slot:"top",operations:e.operations},on:{operate:e.operateHandler},slot:"top"}),n("el-form",{ref:"form",attrs:{size:"small","label-width":"110px",model:e.formModel,rules:e.rules}},[n("el-form-item",{attrs:{label:"等级"}},[e._v(" "+e._s(e.formModel.name)+" ")]),n("el-form-item",{attrs:{label:"距离(km)",prop:"distance"}},[n("el-input",{model:{value:e.formModel.distance,callback:function(t){e.$set(e.formModel,"distance",t)},expression:"formModel.distance"}},[n("template",{slot:"prepend"},[e._v("<=")])],2)],1),n("el-form-item",{attrs:{label:"评分"}},[n("div",{staticClass:"el-input el-input--small el-input-group el-input-group--prepend"},[n("div",{staticClass:"el-input-group__prepend"},[e._v(">=")]),n("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"请选择"},model:{value:e.formModel.score,callback:function(t){e.$set(e.formModel,"score",t)},expression:"formModel.score"}},e._l(e.scoreList,(function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1)]),e._l(e.formModel.gradeIndicators,(function(t){return n("el-form-item",{key:t.id,attrs:{label:t.name}},[n("div",{staticClass:"el-input el-input--small el-input-group el-input-group--prepend"},[n("div",{staticClass:"el-input-group__prepend"},[e._v(">=")]),n("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"请选择"},model:{value:t.recommendScore,callback:function(n){e.$set(t,"recommendScore",n)},expression:"tag.recommendScore"}},e._l(e.scoreList,(function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1)])}))],2)],1)},d=[],m=n("f36f"),f=n("8330"),p=n("2497"),h=n("bc3a"),g=n.n(h),b=n("c596"),v={query:function(e,t,n){g.a.get(b["g"].shopRate.RecommendMgmt_recommend,{params:e}).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))},add:function(e,t,n){g.a.post(b["g"].shopRate.RecommendMgmt_recommend,e).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))},update:function(e,t,n){g.a.put(b["g"].shopRate.RecommendMgmt_recommend,e).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))}},y=function(){return{distance:""}},_={loading:!1,operations:[{label:"保存",name:"save",type:"primary"}],formModel:y(),scoreList:[{label:"一星",value:"1"},{label:"二星",value:"2"},{label:"三星",value:"3"},{label:"四星",value:"4"},{label:"五星",value:"5"}]},S={query:function(){this.formModel=Object.assign(this.getDefaultModel(),this.itemId),this.$refs.form&&this.$refs.form.resetFields()},getSaveParams:function(){return this.formModel},resetModel:function(){this.formModel=this.getDefaultModel()},getDefaultModel:function(){return y()},save:function(){var e=this;this.$refs.form.validate((function(t,n){if(!t)return!1;e.loading=!0,e.formModel.id?v.update(e.getSaveParams(),(function(t){e.$message.success("保存成功"),e.$emit("operationSuccess"),e.loading=!1}),(function(t){e.$message.warning(t.errorMessage),e.loading=!1})):v.add(e.getSaveParams(),(function(t){e.$message.success("保存成功"),e.$emit("operationSuccess"),e.loading=!1}),(function(t){e.$message.warning(t.errorMessage),e.loading=!1}))}))}},I={operateHandler:function(e){this[e]()},handleAddressChange:function(e){this.formModel.address=e},handleAreaChanged:function(e){this.formModel.area.id=e}},w={name:"RecommendRule",components:{BizSaveButton:f["a"],BizGrid:m["a"]},props:{itemId:{type:Object,default:function(){return{id:""}}}},data:function(){var e=this;return Object(r["a"])(Object(r["a"])({},_),{},{rules:{distance:[{trigger:"blur",validator:function(t,n,o){""!==e.formModel.distance&&(!Number(e.formModel.distance)||Number(e.formModel.distance)<0)?o(new Error("请输入一个大于0的数字")):o()}}]}})},methods:Object(r["a"])(Object(r["a"])({},S),I),watch:{itemId:function(e,t){e&&e.id?this.query():(this.resetModel(),this.$refs.form.resetFields())}},created:function(){this.itemId.id&&this.query()}},M=w,C=(n("fcbd"),n("2877")),O=Object(C["a"])(M,u,d,!1,null,null,null),$=O.exports,N={name:"RecommendSystemMgmtPopup",components:{BizPopupTabs:l["a"],RecommendRule:$},props:{open:{type:Boolean},itemId:{type:Object,default:function(){return{id:""}}}},data:function(){return{tabSelection:"0"}},methods:{close:function(e){this.$emit("close",e)},operationSuccess:function(e){this.$emit("operationSuccess",e)}},watch:{open:function(e){var t=this;e&&setTimeout((function(){t.tabSelection="0"}),500)}}},x=N,k=Object(C["a"])(x,i,c,!1,null,null,null),j=k.exports,R={query:function(e,t,n){g.a.get(b["g"].shopRate.RecommendMgmt_query,{params:e}).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))},queryColumns:function(e,t,n){g.a.get(b["g"].shopRate.AbilityRatingMgmt_queryColumns,{params:e}).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))},delete:function(e,t,n){g.a.delete(b["g"].shopRate.RecommendMgmt_recommend,{data:e}).then(Object(p["a"])(t,n)).catch((function(e){console.error(e)}))}},E={itemId:{id:""},selections:[],open:!1,loading:!1,tableData:[],tableColumns:[]},q={distanceConverter:function(e){return e.distance?"<="+e.distance+"km":"--"},scoreConverter:function(e){if(e.score){var t=["一星","二星","三星","四星","五星"];return">= "+t[Number(e.score)-1]}return"--"},deleteItem:function(e){var t=this;this.$confirm("是否确认删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.loading=!0,R.delete({ids:e},(function(e){t.loading=!1,t.$message.success("删除成功"),t.queryColumns()}),(function(e){t.$message.warning(e.errorMessage),t.loading=!1}))}))},getQueryParams:function(){return{shopId:window.top.SHOP_ID||""}},query:function(){var e=this;this.loading=!0,R.query(this.getQueryParams(),(function(t){e.tableData=t.content,e.loading=!1}),(function(t){console.log(t),console.log("code错误"),e.loading=!1,e.$message.warning(t.errorMessage)}))},queryColumns:function(){var e=this;this.loadingLevel=!0,R.queryColumns({shopId:window.top.SHOP_ID||""},(function(t){e.tableColumns=t.content,e.query()}),(function(t){console.log(t),console.log("code错误"),e.loadingLevel=!1,e.$message.warning(t.errorMessage)}))},add:function(){this.open=!0,this.itemId={id:""}},refresh:function(){this.queryColumns()},export:function(){console.log("export")},delete:function(){if(this.selections&&this.selections.length>0){var e=[];this.selections.forEach((function(t){e.push(t.id)})),this.deleteItem(e)}else this.$message("请选择一个等级")}},z={handleOperationSuccess:function(){this.open=!1,this.openLevel=!1,this.queryColumns()},handleOperate:function(e){this[e]()},handleRowOperationClick:function(e,t,n){"操作"!==n.label&&(this.itemId=JSON.parse(JSON.stringify(e)),this.open=!0)}},B={name:"RecommendMgmt",components:{BizFlexTable:s["c"],rightPopup:j},props:{},data:function(){return Object(r["a"])({},Object.assign(E))},methods:Object(r["a"])(Object(r["a"])({},q),z),watch:{},created:function(){this.queryColumns()},mounted:function(){this.$message({customClass:"motorists-club-activity__kpi",showClose:!0,message:"您可在此设置联盟店铺的推荐规则，符合规则的将会优先推荐",duration:3e3})}},P=B,T=Object(C["a"])(P,o,a,!1,null,null,null);t["default"]=T.exports},fcbd:function(e,t,n){"use strict";var o=n("e348"),a=n.n(o);a.a}}]);