<template>
  <div class="activity-mgmt-model-item">
    <div class="title">{{activityModel.name}}</div>
    <div class="image">
      <img :src="previewImg" alt="" width="200px" v-if="activityModel.marketingType!=='11'">
      <div style="width:180px;height:356px;position:absolute" v-if="activityModel.marketingType==='11'&&!activityModel.content">
        <div :style="styleObject" v-if="activityModel.marketingType==='11'&&!activityModel.content"></div>
      </div>
       <iframe ref="iframe" @load="onLoad" :src="'/#/site/single-page?shopId=10&channel=10&activityId='+activityModel.id+'_template'" frameborder="0" v-if="activityModel.marketingType==='11'&&activityModel.content" width="200px" height="356px"></iframe>
      <div class="btn" @click="select">立即创建</div>
    </div>
  </div>
</template>

<script>
import QHBImage from '@/assets/images/activity-model/qhb.png';
import YYYImage from '@/assets/images/activity-model/yyy.png';
import CJYImage from '@/assets/images/activity-model/cjy.png';
import CJFImage from '@/assets/images/activity-model/cjf.png';
import PTGImage from '@/assets/images/activity-model/ptg.png';
import NYQGImage from '@/assets/images/activity-model/nyqg.png';
import XSMSImage from '@/assets/images/activity-model/xsms.png';
import BKJImage from '@/assets/images/activity-model/bkj.png';
import TJYLImage from '@/assets/images/activity-model/tjyl.png';
import FXYLImage from '@/assets/images/activity-model/fxyl.png';
import ZMImage from '@/assets/images/activity-model/zm.png';
import BYImage from '@/assets/images/activity-model/by.png';
import CXImage from '@/assets/images/activity-model/cx.png';
import MJImage from '@/assets/images/activity-model/mj.png';
import MSImage from '@/assets/images/activity-model/ms.png';
import TCImage from '@/assets/images/activity-model/tc.png';
import YHQImage from '@/assets/images/activity-model/yhq.png';
import ZKImage from '@/assets/images/activity-model/zk.png';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'ActivityMgmtModelItem',
  data() {
    return {};
  },
  created() {},
  components: {},
  props: {
    activityModel: {}
  },
  computed: {
    styleObject() {
      return {
        height: '100%',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    },
    previewImg() {
      if (this.activityModel.templateType === '0') {
        switch (this.activityModel.marketingType) {
          case '0':
            return QHBImage;
          case '1':
            return YYYImage;
          case '2':
            if (this.activityModel.shape === '0') {
              return CJYImage;
            } else if (this.activityModel.shape === '1') {
              return CJFImage;
            } else {
            }
            return '';
          case '3':
            return PTGImage;
          case '4':
            return NYQGImage;
          case '5':
            return XSMSImage;
          case '6':
            return BKJImage;
          case '7':
            return TJYLImage;
          case '8':
            return FXYLImage;
          case '9':
            return ZMImage;
          default:
            return '';
        }
      } else if (this.activityModel.templateType === '1') {
        switch (this.activityModel.marketingType) {
          case '0':
            return BYImage;
          case '1':
            return YHQImage;
          case '2':
            return CXImage;
          case '3':
            return MJImage;
          case '4':
            return ZKImage;
          case '5':
            return MSImage;
          case '6':
            return TCImage;
          default:
            return '';
        }
      }
      return '';
    }
  },
  methods: {
    select() {
      this.$emit('select', this.activityModel);
    },
    onLoad() {
      setTimeout(() => {
        this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '18px';
      }, 200);
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-model-item {
  margin: 40px 20px;
  .title {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
  }
  .image {
    position: relative;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    img {
      width: 200px;
    }
  }
  .btn {
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    color: #ff7300;
    &:hover {
      color: lighten(#ff7300, 20%);
      cursor: pointer;
    }
  }
}
</style>
