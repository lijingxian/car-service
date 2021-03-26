<template>
  <div class="activity-model-item" v-loading="((activity.marketingType==='11'||['0', '1', '2'].includes(activity.marketingType))&&activity.content)?load:false">
    <div class="title" @click="select">{{activity.name}}</div>
    <div class="image" @click="select">
      <i class="el-icon-error" @click.stop="$emit('remove',activity.id)"></i>
      <img :src="previewImg" alt="" width="200px" v-if="activity.marketingType!=='11'&&!activity.content">
      <div style="width:180px;height:356px;position:absolute" v-if="activity.marketingType==='11'&&!activity.content">
        <div :style="styleObject" v-if="activity.marketingType==='11'&&!activity.content"></div>
      </div>
      <iframe ref="iframe" @load="onLoad" :src="'/#/site/single-page?shopId=10&channel=10&activityId='+activity.id+'_template'" frameborder="0" v-if="activity.marketingType==='11'&&activity.content" width="200px" height="356px"></iframe>
      <iframe ref="iframe" @load="onLoad" :src="'/#/template-single-page?shopId=10&channel=10&id='+activity.id" frameborder="0" v-if="['0', '1', '2'].includes(activity.marketingType)&&activity.content" width="200px" height="356px"></iframe>
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
  name: 'ActivityModelItem',
  data() {
    return {
      load: true
    };
  },
  created() {},
  components: {},
  props: {
    activity: {}
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
      if (this.activity.templateType === '0') {
        switch (this.activity.marketingType) {
          case '0':
            return QHBImage;
          case '1':
            return YYYImage;
          case '2':
            if (this.activity.shape === '0') {
              return CJYImage;
            } else if (this.activity.shape === '1') {
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
      } else if (this.activity.templateType === '1') {
        switch (this.activity.marketingType) {
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
      console.log('select');
      this.$emit('select', this.activity);
      console.log('select');
    },
    onLoad() {
      console.log('select');
      setTimeout(() => {
        this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '18px';
        this.load = false;
      }, 200);
    },
    check() {
      console.log('check');
    }
  }
};
</script>

<style lang="scss">
.activity-model-item {
  margin: 40px 20px;
  .title {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .image {
    position: relative;
    width: 200px;
    i {
      font-size: 25px;
      color: #666;
      transition: all 0.3s;
      position: absolute;
      top: 5px;
      right: 5px;
      opacity: 0;
      z-index: 10;
    }
    &:hover {
      i {
        opacity: 1;
      }
      cursor: pointer;
    }
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 356px;
  }
}
</style>
