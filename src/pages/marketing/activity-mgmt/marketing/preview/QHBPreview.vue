<template>
  <div class="q-h-b-preview" :style="'width:'+width">
    <preview-header :headerTitle="activity.title" :width="width">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/robRedPacket/'+activity.id" id="iframe" frameborder="0"
      scrolling="no" :width="width" :height="height"></iframe>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';
import QHB from '@/assets/images/activity-preview/qhb.png';
import { setTimeout } from 'timers';

export default {
  name: 'QHBPreview',
  data() {
    return {};
  },
  props: {
    activity: Object,
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    height: {
      type: String,
      default() {
        return '667px';
      }
    },
    width: {
      type: String,
      default() {
        return '375px';
      }
    }
  },
  components: {
    PreviewHeader
  },
  mounted() {
    console.log('1111');
    setTimeout(() => {
      document.getElementById('iframe').contentWindow.document.getElementsByTagName('h1')[0].style.fontSize = '20px';
      document.getElementById('iframe').contentWindow.document.getElementsByClassName('btn-group')[0].style.margin = '12px';
    }, 1000);
  },
  watch: {
    open(nVal, oVal) {
      if (nVal) {
        setTimeout(() => {
          document.getElementById('iframe').contentWindow.document.getElementsByTagName('h1')[0].style.fontSize = '20px';
          document.getElementById('iframe').contentWindow.document.getElementsByClassName('btn-group')[0].style.margin = '12px';
        }, 1000);
      }
    }
  },
  computed: {
    styleObject() {
      return {
        background: 'url(' + QHB + ') no-repeat no-repeat',
        'background-size': '270px'
      };
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.RobRedPacket .r-p-content .red-packet-content .btn-group .btn-go-on,
.RobRedPacket .r-p-content .red-packet-content .btn-group .btn-my-prize {
  padding: 8px 22px;
}
.RobRedPacket .r-p-content .red-packet-content .red-packet-bg h1 {
  font-size: 16px;
}
.q-h-b-preview {
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .backg {
    height: 275px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-weight: 600;
      margin-top: 30px;
      font-size: 28px;
      color: #63441e;
    }
    .title-second {
      margin-top: 159px;
      font-size: 12px;
      color: #df5f41;
      width: 60px;
    }
  }
  .bottom {
    height: 100px;
    background-color: #f9f1cd;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item-btn {
      border-radius: 5px;
      color: #fff;
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 80px;
      background-color: #fcb71b;
      box-shadow: 2px 2px 1px #ccc;
      cursor: pointer;
    }
  }
}
</style>
