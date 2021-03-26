<template>
  <div class="shop-publicity-video-upload">
    <div class="video-wrap" v-show="url">
      <Xgplayer :config="config" @player="Player = $event" />
    </div>
    <el-upload accept="video/*" name="file" :action="uploadAction" :data="uploadData" :file-list="fileList"
      :on-success="handleSuccess" :on-error="handleError" :limit="1" :before-upload="beforeUpload" :show-file-list="true">
      <el-button size="small" type="primary">{{btnString}}</el-button>
    </el-upload>
    <el-button size="small" type="" @click="select">选封面</el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body custom-class="cover-class" width="80%" center>
      <img :src="coverUrl" width="500px">
      <div class="card-carousel-wrapper" v-loading="loading">
        <div class="card-carousel--nav__left" @click="moveCarousel(-1)" :disabled="atHeadOfList"></div>
        <div class="card-carousel">
          <div class="card-carousel--overflow-container">
            <div class="card-carousel-cards" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
              <div class="card-carousel--card" v-for="item in items" :key="item.index">
                <img :src="item" width="100px" @click="check(item)" />
              </div>
            </div>
          </div>
        </div>
        <div class="card-carousel--nav__right" @click="moveCarousel(1)" :disabled="atEndOfList"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Xgplayer from 'xgplayer-vue';
import http from '@/common/http';
export default {
  name: 'ShopPublicityVideoUpload',
  components: { Xgplayer },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    titleImage: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      loading: true,
      uploadAction: '/admin/file/uploads.jhtml',
      uploadData: {
        type: '2'
      },
      Player: null,
      coverUrl: '',
      currentOffset: 0,
      windowSize: 6,
      paginationFactor: 120,
      items: []
    };
  },
  computed: {
    btnString() {
      if (this.url) {
        return '重新上传';
      }
      return '上传视频';
    },
    config() {
      return {
        width: 4,
        height: 3,
        id: 'shop-publicity-video-upload',
        fluid: true,
        poster: this.titleImage || this.url.replace(/\.\w+$/, '.jpg'),
        url: this.url
      };
    },
    atEndOfList() {
      return this.currentOffset <= this.paginationFactor * -1 * (this.items.length - this.windowSize);
    },
    atHeadOfList() {
      return this.currentOffset === 0;
    }
  },
  watch: {
    open(val, old) {
      if (!val) {
        console.log('关闭');
        this.Player.pause();
      }
    }
  },
  created() {},
  mounted() {
    console.log(1111);
    this.Player.once('complete', () => {
      console.log('complete');
    });
  },
  methods: {
    confirm() {
      http
        .post('/rest/common/upload.jhtml', {
          type: 0,
          data: this.coverUrl.substring(this.coverUrl.indexOf(',') + 1),
          extension: '.jpg'
        })
        .then(data => {
          console.log('data' + data);
          this.Player.config.poster = data.url;
          // console.log(document.querySelector('.xgplayer-poster').style.backgroundImage);
          document.querySelector('.xgplayer-poster').style.backgroundImage = 'url(' + data.url + ')';
          this.$emit('setCover', data.url);
          this.dialogVisible = false;
        })
        .catch();
    },
    check(item) {
      console.log(this.Player);
      this.coverUrl = item;
    },
    select() {
      this.coverUrl = this.Player.config.poster;
      this.Player.start(this.url);
      console.log(this.Player.video.duration);
      this.items = [];
      let that = this;
      this.loading = true;
      setTimeout(function() {
        that.genRandomCapture(that.Player.video.duration, that.Player.video);
        that.dialogVisible = true;
      }, 500);
    },
    /**
     * 截取视频方法
     *
     * @param {HTMLVideoElement} video 视频dom
     * @param {number} timePoint 截取时间点
     * @param {(imgUrl) => void} callback  截取成功回调
     * @param {Object} options  可选项
     * @param {number} options.imgQuality 图片质量 默认为3
     */
    captureVideo(video, timePoint, callback, options = {}) {
      let videoWidth = 0;
      let videoHeight = 0;

      const ndVideo = document.createElement('video');
      const ndCanvas = document.createElement('canvas');
      const context = ndCanvas.getContext('2d');

      ndVideo.currentTime = timePoint;
      ndVideo.addEventListener('canplay', function() {
        videoWidth = ndVideo.videoWidth;
        videoHeight = ndVideo.videoHeight;
        ndCanvas.width = videoWidth;
        ndCanvas.height = videoHeight;

        context.drawImage(ndVideo, 0, 0, videoWidth, videoHeight, 0, 0, videoWidth, videoHeight);

        const dataURL = ndCanvas.toDataURL('image/jpeg', options.imgQuality);
        callback && callback(dataURL);
      });

      ndVideo.src = video.src;
    },

    /**
     * X>30，取值间隔=X/30
     *
     */
    genRandomNumber(number) {
      if (number > 30) {
        return (number - 29) * 30;
      } else {
        return number;
      }
    },

    /** -----your logic------ */
    /**
     * 随机截取图片
     *
     * @param {number} [number=1]
     * @param {HTMLVideoElement} video
     */
    genRandomCapture(number = 1, video) {
      // 视频时长X，X>30，取值间隔=X/30的整数，四舍五入
      if (number > 30) {
        let x = Math.floor((number - 30) / 30);
        number = 30 + x;
      }
      for (let i = 1; i < number; i++) {
        let randomNum = this.genRandomNumber(i);
        console.log(randomNum);
        let that = this;
        this.captureVideo(video, randomNum, function(src) {
          that.items.push(src);
          console.log(that.items.length);
          if (that.items.length > number - 2) {
            that.loading = false;
          }
        });
      }
    },
    moveCarousel(direction) {
      // Find a more elegant way to express the :style. consider using props to make it truly generic
      if (direction === 1 && !this.atEndOfList) {
        this.currentOffset -= this.paginationFactor;
      } else if (direction === -1 && !this.atHeadOfList) {
        this.currentOffset += this.paginationFactor;
      }
    },
    beforeUpload(file) {
      const isVideo = /^video\/(.*)$/.test(file.type);
      if (!isVideo) {
        this.$message.error('请选择符合视频格式的文件上传!');
        return isVideo;
      }

      const isLt200M = file.size / 1024 / 1024 <= 200;
      if (!isLt200M) {
        this.$message.error('请上传小于200M的文件!');
      }
      return isLt200M;
    },
    handleSuccess(res, file, fileList) {
      this.$emit('upload-video', res.fis[0].url);
      document.querySelector('.xgplayer-poster').style.backgroundImage = '';
    },
    handleError(err, file, fileList) {
      if (err) {
        this.$message.warning(err);
      } else {
        this.$message.warning('发生错误');
      }
    }
  }
};
</script>

<style lang="scss">
.shop-publicity-video-upload {
  display: flex;
  align-items: center;
  .video-wrap {
    width: 400px;
    height: 300px;
    .xgplayer-poster {
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  .el-button {
    margin-left: 10px;
  }
}
.cover-class {
  .el-dialog__body {
    text-align: center;
  }
  .card-carousel-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 40px;
    color: #666a73;
  }

  .card-carousel {
    display: flex;
    justify-content: center;
    width: 740px;
  }
  .card-carousel--overflow-container {
    overflow: hidden;
  }
  .card-carousel--nav__left,
  .card-carousel--nav__right {
    display: inline-block;
    width: 15px;
    height: 15px;
    padding: 10px;
    box-sizing: border-box;
    border-top: 2px solid #42b883;
    border-right: 2px solid #42b883;
    cursor: pointer;
    margin: 0 10px;
    transition: transform 150ms linear;
  }
  .card-carousel--nav__left[disabled],
  .card-carousel--nav__right[disabled] {
    opacity: 0.2;
    border-color: black;
  }
  .card-carousel--nav__left {
    transform: rotate(-135deg);
  }
  .card-carousel--nav__left:active {
    transform: rotate(-135deg) scale(0.9);
  }
  .card-carousel--nav__right {
    transform: rotate(45deg);
  }
  .card-carousel--nav__right:active {
    transform: rotate(45deg) scale(0.9);
  }

  .card-carousel-cards {
    display: flex;
    transition: transform 150ms ease-out;
    transform: translatex(0px);
  }
  .card-carousel-cards .card-carousel--card {
    margin: 0 10px;
    cursor: pointer;
    box-shadow: 0 4px 15px 0 rgba(40, 44, 53, 0.06), 0 2px 2px 0 rgba(40, 44, 53, 0.08);
    background-color: #fff;
    border-radius: 4px;
    z-index: 3;
    margin-bottom: 2px;
  }
  .card-carousel-cards .card-carousel--card:first-child {
    margin-left: 0;
  }
  .card-carousel-cards .card-carousel--card:last-child {
    margin-right: 0;
  }
  .card-carousel-cards .card-carousel--card img {
    vertical-align: bottom;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    transition: opacity 150ms linear;
    user-select: none;
  }
  .card-carousel-cards .card-carousel--card img:hover {
    opacity: 0.5;
  }
  .card-carousel-cards .card-carousel--card--footer {
    border-top: 0;
    padding: 7px 15px;
  }
  .card-carousel-cards .card-carousel--card--footer p {
    padding: 3px 0;
    margin: 0;
    margin-bottom: 2px;
    font-size: 19px;
    font-weight: 500;
    color: #2c3e50;
    user-select: none;
  }
  .card-carousel-cards .card-carousel--card--footer p:nth-of-type(2) {
    font-size: 12px;
    font-weight: 300;
    padding: 6px;
    background: rgba(40, 44, 53, 0.06);
    display: inline-block;
    position: relative;
    margin-left: 4px;
    color: #666a73;
  }
  .card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):before {
    content: '';
    float: left;
    position: absolute;
    top: 0;
    left: -12px;
    width: 0;
    height: 0;
    border-color: transparent rgba(40, 44, 53, 0.06) transparent transparent;
    border-style: solid;
    border-width: 12px 12px 12px 0;
  }
  .card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):after {
    content: '';
    position: absolute;
    top: 10px;
    left: -1px;
    float: left;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background: white;
    box-shadow: -0px -0px 0px #004977;
  }
}
</style>
