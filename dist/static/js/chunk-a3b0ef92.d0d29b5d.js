(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a3b0ef92"],{"446c":function(e,t,n){},"7a7f":function(e,t,n){"use strict";var i=n("446c"),o=n.n(i);o.a},d92c:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"site-single-page"},e._l(e.bricks,(function(e){return n("brick",{key:e.id,attrs:{"brick-data":e,isEdit:!1}})})),1)},o=[],r=(n("c975"),n("5530")),a=n("ff2f"),c=n("2f62"),d={name:"SiteSinglePage",components:{Brick:a["a"]},props:{},data:function(){return{target:"",activityId:""}},computed:Object(r["a"])({},Object(c["c"])("Site",["bricks"])),watch:{},created:function(){},mounted:function(){this.createRem(),this.getParams()},methods:Object(r["a"])(Object(r["a"])(Object(r["a"])(Object(r["a"])({},Object(c["d"])("Site",["updateActivityId"])),Object(c["b"])("Site",["getSiteContent"])),Object(c["b"])("Site",["getActivityContent"])),{},{getParams:function(){this.target=this.$route.query.target||"","toutiao"===this.target&&this.createTouTiaoJs(),this.activityId=this.$route.query.activityId||"",this.activityId&&(this.updateActivityId(this.activityId),this.activityId.indexOf("_")>0?this.getActivityContent():this.getSiteContent())},createRem:function(){var e=document.createElement("script");e.type="text/javascript",e.text='!function(e){var t=375,n=1,i=0;function o(t){var n=2;!function i()\n    {if(e.Raven&&e.Raven.captureMessage)e.Raven.captureMessage(t,{level:"error"});else{if(n<=0)return;n--,setTimeout(function(){i()},2e3)}}()}\n    function d(t){var d=function(t){var n=0,i=e.document.documentElement,d=e.document.body,u=[{key:"boundingWidth",value:i&&i.getBoundingClientRect&&i.getBoundingClientRect().width},\n    {key:"screenWidth",value:e.screen.width}];d&&u.splice(1,0,{key:"clienWdith",value:d&&d.clientWidth},{key:"offsetWidth",value:d&&d.offsetWidth});\n    for(var c=0;c<u.length;c++){var r=u[c].key,a=u[c].value||0;if(0!==a){n=a;break}o("flexible_"+t+"_"+r+"_0")}return n}(t)/10/n;\n    d!==i&&(i=d,e.document.documentElement.style.fontSize=i+"px"),0===i&&o("flexible_"+t+"_html_rem_0")}function u(){e.document.body&&(e.document.body.style.fontSize=14/(t/10)+"rem",n=function(){\n      var t=e.document.createElement("div");t.style.width="1rem",e.document.body.appendChild(t);var n=t.clientWidth/i;return e.document.body.removeChild(t),n>1.05||n<.95?n:1}())}\n      !function(){d("init"),"complete"===e.document.readyState?(u(),d("domReady")):e.document.addEventListener("DOMContentLoaded",function(){u(),d("domReady")},!1);var t=null;\n      e.addEventListener("resize",function(){clearTimeout(t),t=setTimeout(function(){d("resize")},300)},!1)}()}(window);',document.getElementsByTagName("head")[0].appendChild(e)},createTouTiaoJs:function(){var e=document.createElement("script");e.type="text/javascript",e.text='(function(r,d,s,l){var meteor=r.meteor=r.meteor||[];meteor.methods=["track","off","on"];meteor.factory=function(method){return function(){\n      var args=Array.prototype.slice.call(arguments);args.unshift(method);meteor.push(args);return meteor}};for(var i=0;i<meteor.methods.length;i++){\n      var key=meteor.methods[i];meteor[key]=meteor.factory(key)}meteor.load=function(){var js,fjs=d.getElementsByTagName(s)[0];js=d.createElement(s);\n      js.src="https://analytics.snssdk.com/meteor.js/v1/"+l+"/sdk";fjs.parentNode.insertBefore(js,fjs)};meteor.load();if(meteor.invoked){return}\n      meteor.invoked=true;meteor.track("pageview")})(window,document,"script","104408910954");',document.getElementsByTagName("head")[0].appendChild(e)}})},u=d,s=(n("7a7f"),n("2877")),m=Object(s["a"])(u,i,o,!1,null,null,null);t["default"]=m.exports}}]);