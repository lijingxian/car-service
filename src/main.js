import './style/style.scss';
// import './plugins/element.js';
import VueClipboard from 'vue-clipboard2';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './common/style/element-variables.scss';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Vue2OrgTree from 'vue2-org-tree';
import 'vue2-org-tree/dist/style.css';
// import 'swiper/swiper-bundle.css';
import 'swiper/dist/css/swiper.css';

import App from './App';
import Vue from 'vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.prototype.$map = window.BMap;
VueClipboard.config.autoSetContainer = true;
Vue.use(ElementUI);
// 修改$notify, 下移100像素
Vue.prototype.$notify = function(options) {
  Notification(Object.assign({ offset: 100 }, options));
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

Vue.use(VueClipboard);
Vue.use(VueAwesomeSwiper);
Vue.use(Vue2OrgTree);
