(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2cb69c5d"],{"1daf":function(A,e,t){"use strict";var n=t("4a90"),i=t.n(n);i.a},"4a90":function(A,e,t){},5118:function(A,e,t){(function(A){var n="undefined"!==typeof A&&A||"undefined"!==typeof self&&self||window,i=Function.prototype.apply;function o(A,e){this._id=A,this._clearFn=e}e.setTimeout=function(){return new o(i.call(setTimeout,n,arguments),clearTimeout)},e.setInterval=function(){return new o(i.call(setInterval,n,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(A){A&&A.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(n,this._id)},e.enroll=function(A,e){clearTimeout(A._idleTimeoutId),A._idleTimeout=e},e.unenroll=function(A){clearTimeout(A._idleTimeoutId),A._idleTimeout=-1},e._unrefActive=e.active=function(A){clearTimeout(A._idleTimeoutId);var e=A._idleTimeout;e>=0&&(A._idleTimeoutId=setTimeout((function(){A._onTimeout&&A._onTimeout()}),e))},t("6017"),e.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof A&&A.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof A&&A.clearImmediate||this&&this.clearImmediate}).call(this,t("c8ba"))},6017:function(A,e,t){(function(A,e){(function(A,t){"use strict";if(!A.setImmediate){var n,i=1,o={},a=!1,s=A.document,c=Object.getPrototypeOf&&Object.getPrototypeOf(A);c=c&&c.setTimeout?c:A,"[object process]"==={}.toString.call(A.process)?f():d()?m():A.MessageChannel?E():s&&"onreadystatechange"in s.createElement("script")?I():Q(),c.setImmediate=g,c.clearImmediate=r}function g(A){"function"!==typeof A&&(A=new Function(""+A));for(var e=new Array(arguments.length-1),t=0;t<e.length;t++)e[t]=arguments[t+1];var a={callback:A,args:e};return o[i]=a,n(i),i++}function r(A){delete o[A]}function u(A){var e=A.callback,n=A.args;switch(n.length){case 0:e();break;case 1:e(n[0]);break;case 2:e(n[0],n[1]);break;case 3:e(n[0],n[1],n[2]);break;default:e.apply(t,n);break}}function l(A){if(a)setTimeout(l,0,A);else{var e=o[A];if(e){a=!0;try{u(e)}finally{r(A),a=!1}}}}function f(){n=function(A){e.nextTick((function(){l(A)}))}}function d(){if(A.postMessage&&!A.importScripts){var e=!0,t=A.onmessage;return A.onmessage=function(){e=!1},A.postMessage("","*"),A.onmessage=t,e}}function m(){var e="setImmediate$"+Math.random()+"$",t=function(t){t.source===A&&"string"===typeof t.data&&0===t.data.indexOf(e)&&l(+t.data.slice(e.length))};A.addEventListener?A.addEventListener("message",t,!1):A.attachEvent("onmessage",t),n=function(t){A.postMessage(e+t,"*")}}function E(){var A=new MessageChannel;A.port1.onmessage=function(A){var e=A.data;l(e)},n=function(e){A.port2.postMessage(e)}}function I(){var A=s.documentElement;n=function(e){var t=s.createElement("script");t.onreadystatechange=function(){l(e),t.onreadystatechange=null,A.removeChild(t),t=null},A.appendChild(t)}}function Q(){n=function(A){setTimeout(l,0,A)}}})("undefined"===typeof self?"undefined"===typeof A?this:A:self)}).call(this,t("c8ba"),t("4362"))},"74be":function(A,e,t){"use strict";t.r(e);var n=function(){var A=this,e=A.$createElement,t=A._self._c||e;return t("div",{attrs:{id:"qrcode-print"}},[t("img",{staticClass:"logo",attrs:{src:A.logo,alt:"logo"}}),t("img",{attrs:{src:A.img,alt:"qrCode"}}),t("h6",[A._v(A._s(A.shopName))]),t("img",{staticClass:"scan-note",attrs:{src:A.qr,alt:"qrscan note"}})])},i=[],o=t("ddb3"),a=t.n(o),s=t("d682"),c=t.n(s),g=t("5118"),r={data:function(){return{img:"",shopName:"",qr:a.a,logo:c.a,show:!0}},created:function(){this.img=this.$route.query.img,this.shopName=this.$route.query.shopName},mounted:function(){var A=this;Object(g["setTimeout"])((function(){A.print()}),100)},methods:{print:function(){window.print()}}},u=r,l=(t("1daf"),t("2877")),f=Object(l["a"])(u,n,i,!1,null,null,null);e["default"]=f.exports},d682:function(A,e,t){A.exports=t.p+"static/img/logo.f849b11c.png"},ddb3:function(A,e){A.exports="data:image/jpeg;base64,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"}}]);