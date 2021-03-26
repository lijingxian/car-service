<template>
  <biz-grid class="full-screen-dialog" v-loading="loading">
    <div class="content" v-show="showScreen">
      <div class="left">
        <div class="left_content">
          <span>{{date?date.split(' ')[1]:''}}</span>
          <span>{{plateNumber}} {{rank}} {{name}} 到店</span>
          <span>请顾问 {{adminName}} 前往接待</span>
        </div>
      </div>
      <div class="right">
        <div class="top" v-if="date">
          {{date.split(' ')[0].split('-')[0]}}年{{date.split(' ')[0].split('-')[1]}}月{{date.split(' ')[0].split('-')[2]}}日
          {{date.split(' ')[1]}}</div>
        <div class="center">
          <span>{{plateNumber}} {{rank}} {{name}} 到店</span>
          <span>请顾问 {{adminName}} 前往接待</span>
        </div>
        <div class="img"><img :src="image" /></div>
      </div>
    </div>
    <div v-show="!showScreen" align="center">
      <video id="myvideo" height="auto" controls="controls" autoplay v-if="showVideo">
        你的浏览器不支持HTML5播放此视频
        <source :src="video[0].path" type='video/mp4' />
      </video>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { mapGetters, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    duration: {
      type: String
    },
    content: {
      type: String
    },
    video: {
      type: Array
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {
    BizGrid
  },
  data() {
    return {
      curr: 1,
      isOpen: false,
      loading: false,
      dialogVisible: false,
      fullscreen: false,
      showScreen: false,
      showVideo: true,
      plateNumber: '',
      name: '',
      date: '',
      rank: '',
      image: '',
      adminName: '',
      t: ''
    };
  },
  created() {},
  watch: {
    // 大屏内容
    'screenData.id'(nVal, oVal) {
      console.log('id' + nVal);
      if (nVal && nVal !== oVal) {
        window.clearTimeout(this.t);
        let that = this;
        setTimeout(() => {
          that.query(nVal);
          that.showScreen = true;
        }, 3000);
        this.t = setTimeout(() => {
          that.showScreen = false;
        }, this.duration);
      }
    },
    open(nVal, oVal) {
      console.log(111);
      console.log(this.video);
      if (nVal) {
        this.showScreen = false;
        this.showVideo = true;
        this.$nextTick(() => {
          let video = document.getElementById('myvideo');
          video.play();
        });
      } else {
        let video = document.getElementById('myvideo');
        video.pause();
        this.showVideo = false;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let that = this;
      let video = document.getElementById('myvideo');
      video.addEventListener('ended', function() {
        that.play();
      });
    });
  },
  computed: {
    ...mapGetters('Screen', ['screenData']),
    isScreenData() {
      console.log('监听数据' + this.screenData.id);
      return this.screenData ? this.screenData.id : ''; // 需要监听的数据
    }
  },
  methods: {
    ...mapMutations('Screen', ['updateScreenData']),
    play() {
      let video = document.getElementById('myvideo');
      if (this.video.length > 1) {
        video.src = this.video[this.curr].path;
      }
      video.load();
      video.play();
      this.curr++;
      if (this.curr >= this.video.length) {
        this.curr = 0;
      }
    },
    query(id) {
      http
        .get('/admin/intelligent/edit.jhtml', { id: id })
        .then(data => {
          this.plateNumber = data.data.plateNumber;
          this.name = data.data.member ? data.data.member.name : '';
          this.rank = data.data.member ? data.data.member.rank : '';
          this.date = data.data.accessTime;
          this.image = data.data.accessImage;
          this.adminName = data.data.adminName;
          let str = this.content.replace('(', '').replace(')', '').replace('车牌', data.data.plateNumber).replace('等级', data.data.member ? data.data.member.rank : '').replace('会员姓名', data.data.adminName);
          let url = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + encodeURI(str);
          let audio = new Audio(url);
          audio.src = url;
          audio.play();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.full-screen-dialog {
  .content {
    display: flex;
    .left {
      background: #ff7300;
      width: 350px;
      .left_content {
        padding: 150px 15px 0px 15px;
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
        span {
          display: block;
          padding: 10px 0px;
        }
      }
    }
    .right {
      text-align: center;
      color: #ff7300;
      .top {
        font-size: 20px;
        padding-top: 20px;
      }
      .center {
        font-size: 32px;
        padding: 20px 0px;
        font-weight: bold;
        span {
          display: block;
        }
      }
    }
  }
}
</style>
