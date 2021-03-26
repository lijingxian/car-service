<template>
  <div class="site-single-page" v-loading="loading">
    <brick v-for="brick of bricks" :brick-data="brick" :key="brick.id" :isEdit="false"></brick>
  </div>
</template>

<script>
import Brick from './components/center-panel/Brick';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'SiteSinglePage',
  components: { Brick },
  props: {},
  data() {
    return {
      loading: true,
      target: '',
      activityId: ''
    };
  },
  computed: {
    ...mapGetters('Site', ['bricks'])
  },
  watch: {},
  created() {},
  mounted() {
    this.createRem();
    this.getParams();
    let that = this;
    setTimeout(() => {
      that.loading = false;
    }, 500);
  },
  methods: {
    ...mapMutations('Site', ['updateActivityId']),
    ...mapActions('Site', ['getSiteContent']),
    ...mapActions('Site', ['getActivityContent']),
    getParams() {
      this.target = this.$route.query.target || '';
      if (this.target === 'toutiao') {
        this.createTouTiaoJs();
      }
      this.activityId = this.$route.query.activityId || '';
      if (this.activityId) {
        this.updateActivityId(this.activityId);
        if (this.activityId.indexOf('_') > 0) {
          this.getActivityContent();
        } else {
          this.getSiteContent();
        }
      }
    },
    createRem() {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = `!function(e){var t=375,n=1,i=0;function o(t){var n=2;!function i()
    {if(e.Raven&&e.Raven.captureMessage)e.Raven.captureMessage(t,{level:"error"});else{if(n<=0)return;n--,setTimeout(function(){i()},2e3)}}()}
    function d(t){var d=function(t){var n=0,i=e.document.documentElement,d=e.document.body,u=[{key:"boundingWidth",value:i&&i.getBoundingClientRect&&i.getBoundingClientRect().width},
    {key:"screenWidth",value:e.screen.width}];d&&u.splice(1,0,{key:"clienWdith",value:d&&d.clientWidth},{key:"offsetWidth",value:d&&d.offsetWidth});
    for(var c=0;c<u.length;c++){var r=u[c].key,a=u[c].value||0;if(0!==a){n=a;break}o("flexible_"+t+"_"+r+"_0")}return n}(t)/10/n;
    d!==i&&(i=d,e.document.documentElement.style.fontSize=i+"px"),0===i&&o("flexible_"+t+"_html_rem_0")}function u(){e.document.body&&(e.document.body.style.fontSize=14/(t/10)+"rem",n=function(){
      var t=e.document.createElement("div");t.style.width="1rem",e.document.body.appendChild(t);var n=t.clientWidth/i;return e.document.body.removeChild(t),n>1.05||n<.95?n:1}())}
      !function(){d("init"),"complete"===e.document.readyState?(u(),d("domReady")):e.document.addEventListener("DOMContentLoaded",function(){u(),d("domReady")},!1);var t=null;
      e.addEventListener("resize",function(){clearTimeout(t),t=setTimeout(function(){d("resize")},300)},!1)}()}(window);`;
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    createTouTiaoJs() {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = `(function(r,d,s,l){var meteor=r.meteor=r.meteor||[];meteor.methods=["track","off","on"];meteor.factory=function(method){return function(){
      var args=Array.prototype.slice.call(arguments);args.unshift(method);meteor.push(args);return meteor}};for(var i=0;i<meteor.methods.length;i++){
      var key=meteor.methods[i];meteor[key]=meteor.factory(key)}meteor.load=function(){var js,fjs=d.getElementsByTagName(s)[0];js=d.createElement(s);
      js.src="https://analytics.snssdk.com/meteor.js/v1/"+l+"/sdk";fjs.parentNode.insertBefore(js,fjs)};meteor.load();if(meteor.invoked){return}
      meteor.invoked=true;meteor.track("pageview")})(window,document,"script","104408910954");`;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
};
</script>

<style lang="scss">
.site-single-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
