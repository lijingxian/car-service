(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1cb1817b"],{"032b":function(t,e,o){"use strict";var a=o("5b9a"),n=o.n(a);n.a},"04ee":function(t,e,o){},"19e9":function(t,e,o){"use strict";var a=o("5a71"),n=o.n(a);n.a},"25b9":function(t,e,o){"use strict";var a=o("5f1a"),n=o.n(a);n.a},"5a71":function(t,e,o){},"5b9a":function(t,e,o){},"5f1a":function(t,e,o){},8697:function(t,e,o){},9147:function(t,e,o){"use strict";var a=o("8697"),n=o.n(a);n.a},"926c":function(t,e,o){"use strict";var a=o("f32c"),n=o.n(a);n.a},"92cdc":function(t,e,o){},a9fc:function(t,e,o){"use strict";var a=o("92cdc"),n=o.n(a);n.a},f32c:function(t,e,o){},ff2f:function(t,e,o){"use strict";var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("section",{staticClass:"brick",style:t.styleObject},t._l(t.brickData.children,(function(e){return o("com-item",{key:e.id,attrs:{"com-data":e,isEdit:t.isEdit}})})),1)},n=[],i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"com-item",style:t.styleObject},["simple-text"===t.comData.type?o("simple-text",{attrs:{"com-data":t.comData}}):t._e(),"image"===t.comData.type?o("image-com",{attrs:{"com-data":t.comData}}):t._e(),"form"===t.comData.type?o("form-com",{attrs:{"com-data":t.comData}}):t._e(),"tel"===t.comData.type?o("tel-com",{attrs:{"com-data":t.comData}}):t._e(),"btn"===t.comData.type?o("btn-com",{attrs:{"com-data":t.comData}}):t._e(),t.isEdit?o("div",{staticClass:"line-wrapper",on:{mousedown:function(e){return e.stopPropagation(),t.onPositionChange(e)},click:function(e){return e.stopPropagation(),t.onChoose(e)}}},[o("div",{staticClass:"line",class:t.classObject}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isActivited,expression:"isActivited"}],staticClass:"operator"},[o("div",{directives:[{name:"show",rawName:"v-show",value:t.isSimpleText,expression:"isSimpleText"}],staticClass:"knob left",on:{mousedown:function(e){return e.stopPropagation(),t.onSimpleTextMousedown("left",e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isSimpleText,expression:"isSimpleText"}],staticClass:"knob right",on:{mousedown:function(e){return e.stopPropagation(),t.onSimpleTextMousedown("right",e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob top",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob right-top",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob right",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob right-bottom",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob bottom",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob bottom-left",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob left",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}}),o("div",{directives:[{name:"show",rawName:"v-show",value:t.isImage||t.isTel||t.isBtn,expression:"isImage||isTel||isBtn"}],staticClass:"knob left-top",on:{mousedown:function(e){return e.stopPropagation(),t.onImageMousedown(e)}}})])]):t._e()],1)},s=[],c=o("5530"),r=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{ref:"text",staticClass:"simple-text",style:t.styleObject},[t._v(t._s(t.comData.content))])},m=[],u=(o("45fc"),o("2f62")),l={name:"SimpleText",components:{},props:{comData:{}},data:function(){return{data:{}}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])("Site",["selectedCom"])),{},{content:function(){return this.comData.content},styleObject:function(){var t={color:this.comData.color,"font-size":this.comData.fontSize/37.5+"rem","letter-spacing":this.comData.letterSpacing/37.5+"rem","line-height":this.comData.lineHeight,"text-align":this.comData.textAlign,"font-weight":this.comData.fontStyle.some((function(t){return"bold"===t}))?"bold":"","font-style":this.comData.fontStyle.some((function(t){return"italic"===t}))?"italic":"","text-decoration":this.comData.fontStyle.some((function(t){return"underline"===t}))?"underline":""};return t}}),watch:{content:function(){var t=this;setTimeout((function(){t.comData.height!==t.$refs.text.clientHeight&&t.updateSimpleTextHeight(t.$refs.text.clientHeight)}),50)}},created:function(){},methods:Object(c["a"])({},Object(u["d"])("Site",["updateSimpleTextHeight"]))},d=l,h=(o("926c"),o("2877")),p=Object(h["a"])(d,r,m,!1,null,null,null),f=p.exports,v=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"site-image"},[o("img",{attrs:{src:t.comData.src.url},on:{click:t.onClick}})])},b=[],g={name:"ImageCom",components:{},props:{comData:{}},data:function(){return{}},computed:{},watch:{},created:function(){},methods:{onClick:function(){this.comData.content&&(location.href=this.comData.content)}}},D=g,w=(o("19e9"),Object(h["a"])(D,v,b,!1,null,null,null)),C=w.exports,y=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-form",{ref:"form",staticClass:"form-com",attrs:{model:t.form,"status-icon":"","label-width":"100px",rules:t.rules}},[t._l(t.comData.formData.elements,(function(e,a){return o("el-form-item",{key:a,attrs:{label:e.label,prop:e.key,required:t.rules[e.key]?void 0:e.required}},[o("el-input",{attrs:{type:e.type,placeholder:"请输入"+e.label,value:t.form[e.key],autocomplete:"off"},on:{input:function(o){return t.onInput(e.key,o)}}})],1)})),o("el-form-item",[o("el-button",{style:t.styleObject,attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v(t._s(t.comData.formData.submitText))])],1)],2)},k=[],T=(o("b0c0"),o("b85c")),I=o("c596"),j=o("1ab1"),x={name:"FormCom",components:{},props:{comData:{}},data:function(){return{activityId:"",params:{},form:{},rules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"}],mobile:[{required:!0,message:"请输入电话",trigger:"blur"}],productName:[{required:!0,message:"请输入意向车型",trigger:"blur"}]}}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])("Site",["selectedCom"])),{},{styleObject:function(){var t={color:this.comData.buttonForeColor,"background-color":this.comData.buttonBackColor};return t}}),watch:{},created:function(){var t,e={},o=Object(T["a"])(this.comData.formData.elements);try{for(o.s();!(t=o.n()).done;){var a=t.value;e[a.key]=a.value}}catch(n){o.e(n)}finally{o.f()}this.form=e,this.getParams()},methods:Object(c["a"])(Object(c["a"])({},Object(u["d"])("Site",["updateSimpleTextHeight","updateComFormLabel"])),{},{onInput:function(t,e){this.form[t]=e},onSubmit:function(){var t=this;this.$refs.form.validate((function(e){if(e){if(!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(t.form.mobile))return void t.$message({customClass:"site-form-message",message:"请输入正确的手机号",center:!0});t.submitForm()}}))},submitForm:function(){var t=this;if(1===this.comData.version){var e={shopId:this.params.shopId,channel:this.params.channel,mobile:this.form.mobile,name:this.form.name,intentionCars:[{productName:this.form.productName}]};console.log(e),j["a"].post(I["w"].potentialConsumer,e).then((function(){t.$message({customClass:"site-form-message",message:t.comData.successTip,type:"success",center:!0}),"toutiao"===t.params.target&&t.submitTouTiao()})).catch((function(t){console.log(t)}));var o={id:this.activityId,data:{shopId:this.params.shopId,channel:this.params.channel,mobile:this.form.mobile,name:this.form.name,intentionCars:[{productName:this.form.productName}]}};console.log(o),j["a"].post(I["w"].memberPartake,o).then((function(){})).catch((function(t){console.log(t)}))}},getParams:function(){1===this.comData.version&&(this.params.channel=this.$route.query.channel||"",this.params.shopId=this.$route.query.shopId||"",this.params.target=this.$route.query.target||"",this.activityId=this.$route.query.activityId||"")},submitTouTiao:function(){meteor.track("view",{convert_id:"1650537132072973"})}})},O=x,S=(o("a9fc"),Object(h["a"])(O,y,k,!1,null,null,null)),_=S.exports,E=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-button",{staticClass:"tel-com",style:t.styleObject,attrs:{type:"primary",round:""},on:{click:t.onClick}},[t._v(t._s(t.comData.label))])},B=[],P={name:"TelCom",components:{},props:{comData:{}},data:function(){return{data:{}}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])("Site",["selectedCom"])),{},{styleObject:function(){var t={color:this.comData.color,"font-size":this.comData.fontSize/37.5+"rem",backgroundColor:this.comData.backgroundColor,"border-radius":this.comData.borderRadius/37.5+"rem"};return t}}),watch:{},created:function(){},methods:{onClick:function(){var t=document.createElement("a");t.setAttribute("href","tel:"+this.comData.content);var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0),t.dispatchEvent(e)}}},$=P,N=(o("9147"),Object(h["a"])($,E,B,!1,null,null,null)),M=N.exports,L=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("el-button",{staticClass:"btn-com",style:t.styleObject,attrs:{type:"primary",round:""},on:{click:t.onClick}},[t._v(t._s(t.comData.label))])},q=[],z={name:"BtnCom",components:{},props:{comData:{}},data:function(){return{data:{}}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])("Site",["selectedCom"])),{},{styleObject:function(){var t={color:this.comData.color,"font-size":this.comData.fontSize/37.5+"rem",backgroundColor:this.comData.backgroundColor,"border-radius":this.comData.borderRadius/37.5+"rem"};return t}}),watch:{},created:function(){},methods:{onClick:function(){this.comData.content&&(location.href=this.comData.content)}}},H=z,X=(o("25b9"),Object(h["a"])(H,L,q,!1,null,null,null)),A=X.exports,F={name:"ComItem",components:{TelCom:M,BtnCom:A,FormCom:_,ImageCom:C,SimpleText:f},props:{comData:{},isEdit:{type:Boolean,default:function(){return!0}}},data:function(){return{}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])("Site",["selectedType","selectedComId"])),{},{isActivited:function(){return this.comData.id===this.selectedComId&&this.selectedType===this.comData.type},isSimpleText:function(){return"simple-text"===this.comData.type},isImage:function(){return"image"===this.comData.type},isTel:function(){return"tel"===this.comData.type},isBtn:function(){return"btn"===this.comData.type},styleObject:function(){var t={width:this.comData.width/37.5+"rem",height:this.comData.height/37.5+"rem",left:this.comData.x/37.5+"rem",top:this.comData.y/37.5+"rem",backgroundColor:this.comData.backgroundColor||"","border-radius":this.comData.borderRadius/37.5+"rem"};return t},classObject:function(){return{active:this.comData.id===this.selectedComId&&this.selectedType===this.comData.type}}}),watch:{},created:function(){},methods:Object(c["a"])(Object(c["a"])({},Object(u["d"])("Site",["updateSelectedType","updateselectedComId","updateComWidth","updateComHeight","updateComX","updateComY"])),{},{onChoose:function(){this.updateselectedComId({brickId:this.comData.parentId,comId:this.comData.id}),this.updateSelectedType(this.comData.type)},onSimpleTextMousedown:function(t,e){var o=this,a=e.clientX,n=this.comData.width,i="",s="";i=(new Date).getTime();var c=function(e){e.stopPropagation(),e.preventDefault();var i=e.clientX,s="right"===t?n+i-a:n+a-i;o.updateComWidth({width:s,direction:t})},r=function t(){s=(new Date).getTime(),s-i>200&&o.$emit("resize"),document.removeEventListener("mousemove",c,!0),document.removeEventListener("mouseup",t,!0)};return document.addEventListener("mousemove",c,!0),document.addEventListener("mouseup",r,!0),!0},onImageMousedown:function(t){var e=this,o=t.clientX,a=t.clientY,n=this.comData.width,i=this.comData.height,s="",c="";s=(new Date).getTime();var r=function(t){t.stopPropagation(),t.preventDefault();var s=t.clientX,c=t.clientY,r=n+s-o,m=i+c-a;e.updateComWidth({width:r}),e.updateComHeight({height:m})},m=function t(){c=(new Date).getTime(),c-s>200&&e.$emit("resize"),document.removeEventListener("mousemove",r,!0),document.removeEventListener("mouseup",t,!0)};return document.addEventListener("mousemove",r,!0),document.addEventListener("mouseup",m,!0),!0},onPositionChange:function(t){var e=this;this.isActivited||this.onChoose();var o=t.clientX,a=t.clientY,n=this.comData.x,i=this.comData.y,s="",c="";s=(new Date).getTime();var r=function(t){t.stopPropagation(),t.preventDefault();var s=n+t.clientX-o,c=i+t.clientY-a;e.updateComX(s),e.updateComY(c)},m=function t(){c=(new Date).getTime(),c-s>200&&e.$emit("resize"),document.removeEventListener("mousemove",r,!0),document.removeEventListener("mouseup",t,!0)};return document.addEventListener("mousemove",r,!0),document.addEventListener("mouseup",m,!0),!0}})},Y=F,R=(o("ff40"),Object(h["a"])(Y,i,s,!1,null,null,null)),W=R.exports,J={name:"Brick",components:{ComItem:W},props:{brickData:{},isEdit:{type:Boolean,default:function(){return!0}}},data:function(){return{}},computed:{styleObject:function(){var t={height:this.brickData.height/37.5+"rem"};return"color"===this.brickData.bgType?t["background-color"]=this.brickData.bgColor:"image"===this.brickData.bgType&&(t["background-image"]="url(".concat(this.brickData.bgImage.src,")")),t}},watch:{},created:function(){},methods:{}},G=J,K=(o("032b"),Object(h["a"])(G,a,n,!1,null,null,null));e["a"]=K.exports},ff40:function(t,e,o){"use strict";var a=o("04ee"),n=o.n(a);n.a}}]);