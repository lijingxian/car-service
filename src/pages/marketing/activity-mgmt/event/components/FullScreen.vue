<template>
  <biz-grid class="full-screen" v-loading="loading">
    <div class="title" slot="top">
      <div class="name"><img :src="formModel.shop.head" width="80px" height="80px" v-if="formModel.shop.head"><span>{{formModel.shop.name}}</span></div>
      <div class="activityName">{{formModel.title}}</div>
      <div class="sign">{{formModel.signedMembers}}人签到</div>
      <div class="img">
        <div v-if="formModel.openQrCodePath" style="margin-right:30px">
          <img :src="formModel.openQrCodePath" width="80" height="80"><span>微信</span>
        </div>
        <div v-if="formModel.qrCodePath">
          <img :src="formModel.qrCodePath" width="80" height="80"><span>app</span>
        </div>
      </div>
    </div>
    <div align="center" style="height:100%">
      <!-- <iframe src="resources/admin/screen/index.html" v-if="isSign"></iframe> -->
      <sign-in-wall v-if="isSign" :itemId="itemId" ref="SignInWall"></sign-in-wall>
      <img :src="formModel.background || background" v-if="!isSign&&!isBarrage" height="99%" width="100%">
      <!--弹幕-->
      <div class="screen" v-if="isBarrage" :style="'background-image:url('+formModel.background+')'">
        <div class="s_show" v-for="(barrageList,index) in barrageList" :key="index">
          <div class="magictime twisterInUp">{{barrageList.content}}</div>
        </div>
      </div>
      <!--评论-->
      <div v-if="isComment" class="sign-div">
        <div class="sign-content" v-for="(marqueeList,index) in marqueeList" :key="index" :class="{'marquee_top':animate}">
          <div class="sign-member">
            <img :src="marqueeList.member.head || DefaultImg" width="50px" height="50px"><span>{{marqueeList.member.userName}}</span>
          </div>
          <div class="sign-account">
            {{marqueeList.content}}
          </div>
        </div>
      </div>
      <!--大转盘抽奖-->
      <div v-if="form.lotteryWay==='3'" class="lottery">
        <img :src="dzp">
        <div class="_button">
          <el-button type="primary" size="small" @click="yyyStart" v-if="form.state==='0'">开始</el-button>
          <el-button type="primary" size="small" @click="yyyStop" v-if="form.state==='1'">停止</el-button>
        </div>
        <div class="dzp">
          <span>参与人数：{{attendMember}}</span><span>中奖人数：{{luckyMember}}/{{form.prizeCount}}</span>
        </div>
      </div>
      <!--摇一摇抽奖-->
      <div v-if="form.lotteryWay==='2'" class="lottery">
        <img :src="yyy">
        <div class="_button">
          <el-button type="primary" size="small" @click="yyyStart" v-if="form.state==='0'">开始</el-button>
          <el-button type="primary" size="small" @click="yyyStop" v-if="form.state==='1'">停止</el-button>
        </div>
        <div class="yyy">
          <span>参与人数：{{attendMember}}</span><span>中奖人数：{{luckyMember}}/{{form.prizeCount}}</span>
        </div>
      </div>
      <!--评论抽奖-->
      <div v-if="form.lotteryWay==='1'" class="lottery">
        <div style="height:600px;overflow:hidden">
          <div class="comment-content" v-for="(comment,index) in commentList" :key="index" :class="{'marquee_top':animate}">
            <div class="comment-member">
              <img :src="comment.member.head">
            </div>
            <div class="comment-account">
              <span>{{comment.member.userName}}</span>
              <span>{{index}}</span>
            </div>
          </div>
        </div>
        <el-button type="primary" size="small" @click="yyyStart" v-if="form.state==='0'">开始</el-button>
        <el-button type="primary" size="small" @click="yyyStop" v-if="form.state=='1'">停止</el-button>
      </div>
      <!--用户名抽奖-->
      <div v-if="form.lotteryWay==='0'" class="lottery">
        <div style="height:600px;overflow:hidden">
          <div class="comment-content" v-for="(sign,index) in tableData" :key="index" :class="{'marquee_top':animate}">
            <div class="comment-account">
              <span>{{sign.member.mobile}}</span>
            </div>
          </div>
        </div>
        <el-button type="primary" size="small" @click="yyyStart" v-if="form.state==='0'">开始</el-button>
        <el-button type="primary" size="small" @click="yyyStop" v-if="form.state=='1'">停止</el-button>
      </div>
    </div>
    <div align="center" slot="bottom">
      <div align="center">
        {{formModel.broadcast}}
      </div>
      <el-tooltip effect="dark" content="首页" placement="bottom">
        <el-button type="text" icon="iconfont biz-icon-i-web-bj" @click="home"></el-button>
      </el-tooltip>
      <!-- 弹幕 -->
      <el-tooltip effect="dark" content="弹幕" placement="bottom">
        <el-button type="text" icon="iconfont biz-icon-i-web-dmk" @click="home" v-if="isOpen"></el-button>
        <el-button type="text" icon="iconfont biz-icon-i-web-dmg" @click="barrage" v-if="!isOpen"></el-button>
      </el-tooltip>
      <!-- 评论 -->
      <el-tooltip effect="dark" content="评论" placement="bottom">
        <el-button type="text" icon="iconfont biz-icon-i-app-hd" @click="comment"></el-button>
      </el-tooltip>
      <!-- 签到 -->
      <el-tooltip effect="dark" content="签到" placement="bottom">
        <el-popover placement="top" width="220" trigger="click" popper-class="button-pop">
          <el-radio-group v-model="type" @change="sign" size="mini">
            <el-radio-button label="table">经典</el-radio-button>
            <el-radio-button label="sphere">球形</el-radio-button>
            <el-radio-button label="helix">螺旋</el-radio-button>
          </el-radio-group>
          <el-button type="text" icon="iconfont biz-icon-i-app-xxhd" slot="reference" @click="sign('table')" style="margin-left:10px"></el-button>
        </el-popover>
      </el-tooltip>
      <!-- 抽奖 -->
      <el-tooltip effect="dark" content="抽奖" placement="bottom">
        <el-button type="text" icon="iconfont biz-icon-i-web-jlsz" @click="lottery"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
        <el-button type="text" icon="iconfont el-icon-rank" @click="handleFullScreen"></el-button>
      </el-tooltip>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import code from '@/assets/images/promotion-preview/QRCode.png';
import dzp from '@/assets/images/dzp.png';
import yyy from '@/assets/images/yyy.jpg';
import { mapGetters, mapMutations } from 'vuex';
import screenService from '@/service/push/screen';
import SignInWall from './SignInWall';
import background from '@/assets/images/screen.png';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {
    BizGrid,
    SignInWall
  },
  data() {
    return {
      isOpen: false,
      loading: false,
      dialogVisible: false,
      fullscreen: false,
      isSign: false,
      isComment: false,
      isHome: true,
      isBarrage: false,
      animate: false,
      background: background,
      type: 'table',
      attendMember: '0',
      luckyMember: '0',
      dzp: dzp,
      yyy: yyy,
      DefaultImg: '/resources/admin/images/default/default_user.jpg',
      code: code,
      t: '',
      plPrize: '',
      yhmPrize: '',
      radio: '1',
      // 抽奖信息
      form: {
        id: '',
        title: '',
        state: '',
        itemType: '',
        lotteryWay: '',
        prizes: []
      },
      // 大屏幕信息
      formModel: {
        signedMembers: '',
        broadcast: '',
        background: '',
        qrCodePath: '',
        openQrCodePath: '',
        id: '',
        title: '',
        shop: {
          head: '/resources/admin/images/Avatar.png'
        },
        prizes: [],
        images: []
      },
      selections: [],
      tableData: [],
      marqueeList: [],
      commentList: [],
      barrageList: []
    };
  },
  created() {
    this.getList();
    this.commentMember();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    },
    open(nVal, oVal) {
      if (nVal) {
        this.getList();
        window.clearInterval(this.t);
        window.clearInterval(this.plPrize);
        window.clearInterval(this.yhmPrize);
        this.commentMember();
      }
    },
    // 评论内容
    isCommentData(nVal, oVal) {
      if (nVal && nVal !== oVal) {
        this.marqueeList.push(this.commentData);
        console.log(this.marqueeList);
      }
    },
    // 摇一摇
    isShakeData(nVal, oVal) {
      if (nVal) {
        console.log(nVal);
        this.luckyMember = this.shakeData.luckyMember;
        this.attendMember = this.shakeData.attendMember;
      }
    },
    // 抽奖
    isPrizeData(nVal, oVal) {
      if (nVal) {
        console.log(nVal);
        this.luckyMember = this.prizeData.luckyMember;
        this.attendMember = this.prizeData.attendMember;
      }
    },
    // 弹幕
    isBarrageData(nVal, oVal) {
      if (nVal) {
        console.log(nVal);
        this.barrageList.push(this.barrageData);
        this.$nextTick(() => {
          let aShowList = document.querySelectorAll('.s_show div'); // 获取元素 H5
          for (let i = 0; i < aShowList.length; i++) {
            this.init(aShowList[i]); // 执行初始化函数
          }
        });
      }
    }
  },
  mounted() {},
  computed: {
    ...mapGetters('LocalMarketing', ['commentData', 'prizeData', 'shakeData', 'barrageData']),
    isCommentData() {
      return this.commentData ? this.commentData.content : ''; // 需要监听的数据
    },
    isPrizeData() {
      return this.prizeData ? this.prizeData.luckyMember : ''; // 需要监听的数据
    },
    isShakeData() {
      return this.shakeData ? this.shakeData.luckyMember : ''; // 需要监听的数据
    },
    isBarrageData() {
      return this.barrageData ? this.barrageData.content : ''; // 需要监听的数据
    }
  },
  methods: {
    ...mapMutations('LocalMarketing', ['updateCommentData', 'updatePrizeData', 'updateShakeData', 'updateBarrageData']),
    home() {
      this.isOpen = false;
      this.isSign = false;
      this.isComment = false;
      this.isBarrage = false;
      this.isHome = true;
      this.form = this.clearForm;
      window.clearInterval(this.t);
      window.clearInterval(this.plPrize);
      window.clearInterval(this.yhmPrize);
    },
    barrage() {
      this.barrageList = [];
      this.isOpen = true;
      this.isSign = false;
      this.isComment = false;
      this.isHome = false;
      this.isBarrage = true;
      this.form = this.clearForm;
      // this.barrageMember(); // 开始进入加载有过的评论
      window.clearInterval(this.t);
      window.clearInterval(this.plPrize);
      window.clearInterval(this.yhmPrize);
    },
    comment() {
      this.isSign = false;
      this.isBarrage = false;
      this.isComment = true;
      this.isHome = true;
      this.form = this.clearForm;
      console.log(this.marqueeList);
      console.log(this.commentData);
      window.clearInterval(this.plPrize);
      window.clearInterval(this.yhmPrize);
      this.t = setInterval(this.showComment, 2000);
    },
    sign(type) {
      window.clearInterval(this.plPrize);
      window.clearInterval(this.yhmPrize);
      this.isSign = true;
      this.isBarrage = false;
      this.isComment = false;
      this.isHome = false;
      this.form = this.clearForm;
      this.$nextTick(() => {
        this.$refs.SignInWall.view(type);
      });
    },
    // 获取签到人员
    signMember() {
      http
        .get(activityMgmt.attends, {
          id: this.itemId || '',
          attendType: '0',
          pageNumber: 1,
          pageSize: 1000
        })
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    // 获取弹幕列表
    barrageMember() {
      http
        .get(activityMgmt.attends, {
          id: this.itemId || '',
          attendType: '2',
          pageNumber: 1,
          pageSize: 1000
        })
        .then(data => {
          this.barrageList = data.content;
          this.$nextTick(() => {
            let aShowList = document.querySelectorAll('.s_show div'); // 获取元素 H5
            for (let i = 0; i < aShowList.length; i++) {
              this.init(aShowList[i]); // 执行初始化函数
            }
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    yyyStart() {
      http
        .post(activityMgmt.lotteryStart, {
          id: this.form.id || ''
        })
        .then(data => {
          console.log('开始抽奖');
          this.form.state = '1';
          // 评论抽奖
          if (this.form.lotteryWay === '1') {
            this.plPrize = setInterval(this.showCommentPrize, 500);
          }
          // 用户名抽奖
          if (this.form.lotteryWay === '0') {
            this.yhmPrize = setInterval(this.showSign, 500);
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    yyyStop() {
      http
        .post(activityMgmt.lotteryStop, {
          id: this.form.id || ''
        })
        .then(data => {
          console.log('停止抽奖');
          if (this.form.lotteryWay === '1') {
            window.clearInterval(this.plPrize);
            this.commentList = data.data;
            this.form.state = '2';
          } else if (this.form.lotteryWay === '0') {
            window.clearInterval(this.yhmPrize);
            this.tableData = data.data;
            this.form.state = '2';
          } else {
            window.clearInterval(this.yhmPrize);
            window.clearInterval(this.plPrize);
            this.form.state = '2';
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    // 获取互动人员
    commentMember() {
      http
        .get(activityMgmt.attends, {
          id: this.itemId || '',
          attendType: '1',
          pageNumber: 1,
          pageSize: 1000
        })
        .then(data => {
          if (this.form.lotteryWay === '1') {
            this.commentList = data.content;
          } else {
            this.marqueeList = data.content;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      http
        .get(activityMgmt.bigScreen, {
          id: this.itemId || ''
        })
        .then(data => {
          this.formModel = Object.assign(this.clear(), data.data);
          screenService.connect(data.vpushServer);
          this.home();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    clear() {
      return {
        signedMembers: '',
        broadcast: '',
        background: '',
        qrCodePath: '',
        openQrCodePath: '',
        id: '',
        title: '',
        shop: {
          head: '/resources/admin/images/Avatar.png'
        },
        prizes: [],
        images: []
      };
    },
    clearForm() {
      return {
        id: '',
        title: '',
        state: '',
        itemType: '',
        lotteryWay: '',
        prizes: []
      };
    },
    // 查看抽奖信息
    lottery() {
      http
        .get(activityMgmt.lottery, {
          id: this.itemId || ''
        })
        .then(data => {
          this.isSign = false;
          this.isComment = false;
          this.isHome = false;
          window.clearInterval(this.t);
          this.form = Object.assign(this.clearForm(), data.data);
          if (this.form.lotteryWay === '1') {
            this.commentMember();
          } else if (this.form.lotteryWay === '0') {
            this.signMember();
          } else {
            this.attendMember = data.attendMember || '0';
            this.luckyMember = data.luckyMember || '0';
          }
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    showComment() {
      this.animate = true;
      setTimeout(() => {
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 500);
    },
    showCommentPrize() {
      this.animate = true;
      setTimeout(() => {
        this.commentList.push(this.commentList[0]);
        this.commentList.shift();
        this.animate = false;
      }, 500);
    },
    showSign() {
      this.animate = true;
      setTimeout(() => {
        this.tableData.push(this.tableData[0]);
        this.tableData.shift();
        this.animate = false;
      }, 500);
    },
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 模块化 每个功能函数去做自己相应的事情 代码可维护性 可扩展性
    // 初始化函数
    init(obj) {
      // 接受弹幕对象
      // 确定top值的随机区间
      let screenHeight = document.documentElement.clientHeight; // 获取屏幕可视高度
      let maxTop = screenHeight - obj.offsetHeight; // 高度差范围
      obj.style.top = maxTop * Math.random() + 'px';
      // 控制left值
      let screenWidth = document.documentElement.clientWidth; // 获取可视宽度
      let maxLeft = screenWidth - obj.offsetWidth - Math.random() * 100; // 随机宽度差
      obj.style.left = maxLeft + 'px';
      // 弹幕的随机颜色
      obj.style.color = this.randomColor(); // 普通定时器
      this.move(obj, maxLeft);
    },
    move(obj, maxLeft) {
      let speed = 5; // 控制速度的变量
      maxLeft = maxLeft - speed; // 往左移动
      if (maxLeft > -obj.offsetWidth) {
        obj.style.left = maxLeft + 'px';
        let that = this;
        window.requestAnimationFrame(function() {
          that.move(obj, maxLeft);
        }); // H5新增的动画函数
      } else {
        // this.init(obj);// 重新初始化 营造循环弹幕效果
        // oShow.removeChild(obj); // DOM删除子节点
        obj.style.display = 'none';
      }
    },
    randomColor() {
      return (
        '#' +
        Math.random()
          .toString(16)
          .slice(-6)
      );
    }
  }
};
</script>

<style lang="scss">
.button-pop {
  .el-radio-button:first-child .el-radio-button__inner {
    border: none;
  }
  .el-radio-button,
  .el-radio-button__inner {
    padding: 0px 10px;
  }
  .el-radio-button__inner {
    border: none;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #fff;
    border-color: #fff;
    box-shadow: -1px 0 0 0 #fff;
    color: #ff7300;
  }
}
.full-screen {
  padding-top: 20px;
  .iconfont {
    color: #ff7300;
    font-size: 26px;
  }
  .lottery {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .screen {
    overflow: hidden;
    position: relative;
    height: 99%;
    background-color: rgba(0, 0, 0, 0.8);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .send {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background-color: rgba(10, 10, 10, 0.6);
    text-align: center;
  }
  .input {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -20px -350px;
    font-size: 0;
  }
  .text {
    float: left;
    width: 600px;
    height: 40px;
    border: none;
    border-radius: 8px 0 0 8px;
  }
  .s_show div {
    position: absolute;
    font-size: 24px;
    font-weight: bold;
  }
  .btn {
    float: left;
    width: 100px;
    background-color: black;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    border-radius: 0 8px 8px 0;
  }
  .sign-div {
    height: 99%;
    overflow: hidden;
    position: absolute;
    top: 0;
    .marquee_top {
      transition: all 0.5s;
    }
    .sign-content {
      display: flex;
      justify-content: flex-start;
      margin-left: 100px;
      padding: 10px;
      .sign-member {
        display: block!important;
        img {
          border-radius: 50%;
        }
        span {
          display: block;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .sign-account {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        text-align: left;
        margin-left: 20px;
        padding: 10px;
        background: #efefef;
        border-radius: 5px;
      }
    }
  }
  ._button {
    margin-top: -50px;
  }
  .dzp {
    margin-top: 30px;
    span {
      color: #77e4e9;
      margin: 10px 5px;
    }
  }
  .yyy {
    margin-top: 30px;
    span {
      color: #77e4e9;
      margin: 0px 5px;
    }
  }
  .comment-content {
    display: flex;
    justify-content: flex-start;
    margin-left: 100px;
    border: 1px solid #efefef;
    border-radius: 5px;
    padding: 10px;
    .comment-member {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .comment-account {
      text-align: left;
      margin-left: 20px;
      span {
        display: block;
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-around;
    .name {
      font-size: 24px;
      line-height: 80px;
      display: flex;
      span {
        margin-left: 10px;
      }
    }
    .activityName {
      font-size: 18px;
      line-height: 80px;
    }
    .sign {
      line-height: 80px;
    }
    .img {
      display: flex;
    }
    span {
      display: block;
      text-align: center;
    }
  }
}
</style>
