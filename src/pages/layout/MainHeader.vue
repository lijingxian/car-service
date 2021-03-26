<template>
  <div class="main-header">
    <div class="shop-info" ref="shopInfo">
      <!-- 平台运营logo -->
      <img v-if="currentUser.roleLevel === 'platform'" class="platform-logo" :src="platformLogo" alt="" @click="goHome">
      <img v-if="currentUser.roleLevel === 'shop'" class="shop-header"
        :src="currentUser.shop.logo ? currentUser.shop.logo : defaultShopLogo" alt="" @click="goHome">
      <img v-if="currentUser.roleLevel === 'company'" class="shop-header"
        :src="currentUser.compy ?currentUser.compy.logo ? currentUser.compy.logo : defaultShopLogo:defaultShopLogo" alt=""
        @click="goHome">
      <el-popover v-if="currentUser.roleLevel !== 'platform'" width="800" trigger="hover" placement="bottom-start">
        <div class="shop-name" slot="reference" @click="goHome">
          {{ currentUser.shop.name || currentUser.company ||currentUser.compy.name}}
        </div>
        <div class="tooltip-content">
          <div class="content-left">
            <div class="mobile">
              <i class="iconfont biz-icon-dianhua"></i>
              {{ currentUser.shop.mobile || currentUser.compy.mobile }}
            </div>
            <div class="address">
              <!-- <span>所在区域: {{ area }}</span> -->
              <!-- <br /> -->
              <span>公司地址: {{ currentUser.shop.address || currentUser.compy.address }}</span>
            </div>
          </div>
          <div class="content-right">
            <img class="qr-code" :src="currentUser.shop.qrCodePath" alt="" v-if="currentUser.shop.qrCodePath">
            <!-- <div class="scan-qr-code">
              <img :src="scanThisQRCode" alt=""> 扫描二维码
            </div> -->
            <div>
              <el-button @click="print(currentUser.shop.qrCodePath)" type="primary" size="mini">打印</el-button>
              <el-button @click="downloadIamge(currentUser.shop.qrCodePath, 'qrcode.png')" type="primary" size="mini">下载</el-button>
            </div>
          </div>
        </div>
      </el-popover>
      <el-popover v-if="currentUser.roleLevel !== 'platform'" width="300" trigger="click" placement="bottom-start">
        <span slot="reference" :class="shops.length > 1?'swich-shop':'swich-shop-none'">切店</span>
        <div class="shop-list" v-for="(shop,index) in shops" :key="index" @click="swichShop(shop,'switch')">
          <img :src="shop.logo || defaultShopLogo" width="32" height="32" />
          <span class="shop-name" :title="shop.name">{{shop.name}}</span>
          <span :class="shop.isCurrent==='1'?'shop-font-yellow':'shop-font'"
            @click.stop="swichShop(shop,'default')">{{shop.isCurrent==='1'?'默认':'设为默认'}}</span>
        </div>
      </el-popover>
    </div>
    <div class="main-nav-area">
      <el-button class="nav-btn" v-for="(nav, key) in navList" :key="nav.name" v-if="ifShowBtn[key]"
        :disabled="disableBtn(nav.name)" :class="{ active: nav.link === currentActive }"
        @click="navBtnClick(nav, ifShowBtn[key])">
        <div class="icon">
          <i class="iconfont" :class="nav.icon"></i>
        </div>
        <div class="nav-name">{{ nav.name }}</div>
      </el-button>
    </div>
    <div class="functional-area" :style="{ width: styleWidth }">
      <div class="wrapper customer-info">
        <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
         <i class="iconfont biz-icon-quanping1" @click="handleFullScreen" v-if="!fullscreen"></i>
         <i class="iconfont biz-icon-tuichuquanping" @click="handleFullScreen" v-if="fullscreen"></i>
        </el-tooltip>
        <i class="iconfont biz-icon-i-web-t-kf" @click="routeLink('/service/service-mgmt/online-response-sys')" v-if="isShowService()"></i>
        <el-badge :is-dot="pendingMessage.isExsit" class="item">
          <i class="iconfont biz-icon-i-web-t-xx" @click="navBtnClick({name:'消息',link:'/message'},true)" v-if="isShowMessage()"></i>
        </el-badge>
        <i class="iconfont biz-icon-i-web-t-xt" @click="navBtnClick({name:'系统',link:'/system'},true)"
          v-if="currentUser.roleLevel==='platform'"></i>
        <div class="upper">
          <el-popover placement="bottom-end" trigger="click" popper-class="popover-class">
            <img v-if="currentUser.head" :src="currentUser.head" />
            <img v-else src="../../assets/images/default_user.png" />
            <div class="wrapper-content">
              <div class="title" :title="currentUser.name">{{currentUser.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="currentUser.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="currentUser.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="currentUser.gender === '2'"></i>
                <span>{{currentUser.mobile}}</span>
              </div>
            </div>
            <div class="line"></div>
            <div>
              <el-button type="text" @click="navBtnClick({name:'个人',link:'/admin/profile'},true)">个人中心</el-button>
            </div>
            <div>
              <el-button type="text" @click="shopNavImg" style="margin: 10px 0px">店铺指南</el-button>
            </div>
            <div>
              <el-button type="text" @click="navBtnClick({name:'帮助',link:'/help'},true)" style="margin-bottom:10px">帮助中心</el-button>
            </div>
            <div>
              <el-button type="text" @click="aboutUs" style="margin: 0px 0px 10px 0px">关于我们</el-button>
            </div>
            <el-popover placement="bottom" trigger="click" width="170">
              <el-button slot="reference" type="text">手机下载</el-button>
              <img src="/resources/admin/help/app.png" alt="" style="width: 146px">
            </el-popover>
            <div class="line"></div>
            <div>
              <el-button type="text" @click="logOut">退出登录</el-button>
            </div>
            <div slot="reference">
              <img v-if="currentUser.head" :src="currentUser.head" width="30" />
              <img v-else src="../../assets/images/default_user.png" />
              <i class="iconfont biz-icon-i-sh-man-pulldown" style="font-size:12px;margin:5px 0px 0px 5px"></i>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="店铺指南" append-to-body width="830px" custom-class="shop-nav" v-if="dialogVisible">
      <!-- <img :src="shopNav"/> -->
      <div class="square step1" @click="step1click">
        <div class="top">
          <div class="title1">注册店铺</div>
          <div class="title2">已完成，去修改</div>
        </div>
        <div class="bottom">
          <div class="over-style" title="方便客户快速找到，请完善店名、地址、电话等信息。">
            方便客户快速找到，请完善店名、地址、电话等信息。
          </div>
        </div>
      </div>
      <div :class="showlength()===0?'border-style-disabled step1-border': 'border-style step1-border'">
        <div style="position: absolute;left: 92px;top: -6px;font-weight: bold;font-size: 20px;">＞</div>
      </div>
      <div :class="showlength()===0?'square-disabled step2':'square step2'" @click="storeClick">
        <div class="top">
          <div class="title1">店铺装修</div>
          <div class="title2" v-if="showlength()===0">未完成</div>
          <div class="title2" v-if="showlength()===1">已完成25%</div>
          <div class="title2" v-if="showlength()===2">已完成50%</div>
          <div class="title2" v-if="showlength()===3">已完成75%</div>
          <div class="title2" v-if="showlength()===4">已完成,去修改</div>
        </div>
        <div class="bottom">
          <div class="over-style" title="更多场景化立体展现，请填写简介、上传VR。">
            更多场景化立体展现，请填写简介、上传VR。
          </div>
        </div>
      </div>
      <div :class="configData.hasProduct==='1'?'border-style step2-border': 'border-style-disabled step2-border'">
        <div style="position: absolute;left: 92px;top: -6px;font-weight: bold;font-size: 20px;">＞</div>
      </div>
      <div :class="configData.hasProduct==='1'?'square step3':'square-disabled step3'" @click="productClick">
        <div class="top">
          <div class="title1">上架服务/商品</div>
          <div class="title2" v-if="configData.hasProduct==='0'">未完成</div>
          <div class="title2" v-if="configData.hasProduct==='1'">已完成,去修改</div>
        </div>
        <div class="bottom">
          <div class="over-style" title="轻松一键导入上架服务/商品，上下架管理更方便。">
            轻松一键导入上架服务/商品，上下架管理更方便。
          </div>
        </div>
      </div>
      <div :class="configData.isEnabled==='1'&&configData.hasProduct==='1'?'border-style step3-border':'border-style-disabled step3-border'">
        <div style="position: absolute;left: 92px;top: -6px;font-weight: bold;font-size: 20px;">＞</div>
      </div>
      <div :class="configData.isEnabled==='1'&&configData.hasProduct==='1'?'square step4':'square-disabled step4'" @click="dialogVisible=false">
        <div class="top">
          <div class="title1">店铺营业</div>
          <div class="title2" v-if="configData.isEnabled==='1'&&configData.hasProduct==='0'">未开始营业</div>
          <div class="title2" v-if="configData.isEnabled==='1'&&configData.hasProduct==='1'">营业中</div>
          <div class="title2" v-if="configData.isEnabled==='0'">关店</div>
        </div>
        <div class="bottom">
          <div class="over-style" title="扫码即进店,快向客户展示吧。">
            扫码即进店,快向客户展示吧。
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import defaultShopLogo from '@/assets/images/shop-logo.png';
import platformLogo from '@/assets/images/logo.png';
import scanThisQRCode from '@/assets/images/pic-owl.png';
import shopNav from '@/assets/images/nav/shopNav.png';
import store from '@/store';
import sideList from './SideList.js';

import http from '@/common/http';
export default {
  name: 'MainHeader',
  data() {
    return {
      dialogVisible: false,
      fullscreen: false,
      // 左侧店铺信息DOM宽度
      styleWidth: '170px',
      logoutUrl: '/admin/logout.jhtml',
      getAuthUrl: '/admin/common/listAuthority/v201901.jhtml',
      shops: [],
      showHot: false,
      configData: {},
      // 导航按钮列表及对应路由
      navList: {
        // 首页
        homePage: {
          name: '首页',
          icon: 'biz-icon-index',
          link: '/'
        },
        // 联盟
        union: {
          name: '门店',
          icon: 'biz-icon-i-web-t-yy',
          link: '/union'
        },
        // OA
        oa: {
          name: 'OA',
          icon: 'biz-icon-i-web-t-wd',
          link: '/oa'
        },
        // 运营
        operating: {
          name: '运营',
          icon: 'biz-icon-i-web-t-dp',
          link: '/operating'
        },
        // 会员
        member: {
          name: '会员',
          icon: 'biz-icon-i-web-t-hy',
          link: '/member'
        },
        // 客服
        service: {
          name: '客服',
          icon: 'biz-icon-i-web-t-kf',
          link: '/service'
        },
        // 车辆
        car: {
          name: '车辆',
          icon: 'biz-icon-i-web-t-dd',
          link: '/car'
        },
        // 营销
        marketing: {
          name: '营销',
          icon: 'biz-icon-i-web-t-yx',
          link: '/marketing'
        },
        // 销售
        sales: {
          name: '销售',
          icon: 'biz-icon-i-web-t-xs',
          link: '/sales'
        },
        // 售后
        'after-sale': {
          name: '售后',
          icon: 'biz-icon-i-web-t-sh',
          link: '/after-sale'
        },
        // 进销存
        invoicing: {
          name: '进销存',
          icon: 'biz-icon-i-web-t-jxc',
          link: '/invoicing'
        },
        // 财务
        finance: {
          name: '财务',
          icon: 'biz-icon-i-web-t-cw',
          link: '/finance'
        },
        // 商城
        hypermarket: {
          name: '商城',
          icon: 'biz-icon-i-web-t-jxc',
          link: '/hypermarket'
        }
      },
      // 是否显示导航按钮
      ifShowBtn: {
        homePage: true,
        union: false,
        operating: false,
        service: false,
        marketing: false,
        member: false,
        sales: false,
        'after-sale': false,
        car: false,
        finance: false,
        invoicing: false,
        hypermarket: false,
        oa: false
      },
      defaultShopLogo: defaultShopLogo,
      platformLogo: platformLogo,
      scanThisQRCode: scanThisQRCode,
      shopNav: shopNav,
      area: '吉林省长春市'
    };
  },
  props: {},
  computed: {
    ...mapGetters('Menu', ['routes']),
    ...mapGetters('Menu', ['router']),
    ...mapGetters('Authority', ['currentAuth']),
    ...mapGetters(['currentUser']),
    ...mapGetters('PendingMessage', ['pendingMessage']),
    ...mapGetters('CurrentShopId', ['currentShopId']),
    authList() {
      let list = {};
      for (let i in sideList) {
        const routes = sideList[i];
        let authSet = new Set();
        // 只取第一层权限
        routes.forEach(item => authSet.add(item.auth));
        list[i] = [...authSet];
      }
      return list;
    },
    currentActive() {
      let currentUrlArray = this.$route.path.split('/');
      console.log(currentUrlArray);
      return `/${currentUrlArray[1]}`;
    }
  },
  created() {
    this.getShopNav();
  },
  watch: {
    currentAuth(newVal, oldVal) {
      this.checkAuth(newVal);
    }
  },
  methods: {
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapMutations('Menu', ['updateRouter']),
    ...mapMutations('Authority', ['updateAuth']),
    ...mapMutations(['updateUser']),
    routeLink(url) {
      this.$router.push({ path: url });
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
    downloadIamge(imgsrc, name) { // 下载图片地址和图片名
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      // image.setAttribute('crossOrigin", "anonymous');
      image.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
        let a = document.createElement('a'); // 生成一个a元素
        let event = new MouseEvent('click'); // 创建一个单击事件
        a.download = name || 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    productClick() {
      this.$router.push({ path: '/' });
      this.$nextTick(() => {
        this.updateRouter({ router: '/operating/commodity-mgmt' });
        this.$router.push({ path: '/operating/commodity-mgmt/commodity', query: { source: 'nav' } });
      });
      // this.updateRouter({ router: '/union/federation-mgmt' });
      this.dialogVisible = false;
    },
    step1click() {
      this.$router.push({ path: '/' });
      this.$nextTick(() => {
        this.updateRouter({ router: '/union/federation-mgmt/federation' });
        this.$router.push({ path: '/union/federation-mgmt/federation', query: { tabName: 'federationmgmtInfo', shopId: this.currentUser.shop.id } });
      });
      this.dialogVisible = false;
    },
    storeClick() {
      let tabName = 'federationmgmtIntroduce';
      if (this.configData.introduce === '1' && this.configData.paymentMethods === '0') {
        tabName = 'federationmgmtPayment';
      } else if (this.configData.introduce === '1' && this.configData.paymentMethods === '1' && this.configData.vrMedia === '0') {
        tabName = 'federationmgmtVr';
      } else if (this.configData.introduce === '1' && this.configData.paymentMethods === '1' && this.configData.vrMedia === '1' && this.configData.score === '0') {
        tabName = 'ShopEvaluation';
      } else {
        tabName = 'federationmgmtIntroduce';
      }
      this.$router.push({ path: '/' });
      this.$nextTick(() => {
        this.updateRouter({ router: '/union/federation-mgmt' });
        this.$router.push({ path: '/union/federation-mgmt/federation', query: { tabName: tabName, shopId: this.currentUser.shop.id } });
      });
      this.dialogVisible = false;
    },
    showlength() {
      console.log(this.configData.storeInfoList);
      let arr = this.configData.storeInfoList.filter(item => {
        return item.state === '1';
      });
      return arr.length;
    },
    // 获取店铺注册导航
    getShopNav() {
      http
        .get('/admin/exhibition/queryStoreState.jhtml', { storeId: this.currentUser.shop.id })
        .then(data => {
          this.configData = data.storeState;
        })
        .catch();
    },
    print(src) {
      window.open(
        document.location.protocol +
          '//' +
          window.location.host +
          '/#/qrcode-print?img=' +
          src +
          '&shopName=' +
          (this.currentUser.shop.name || this.currentUser.company || this.currentUser.compy.name)
      );
    },
    shopNavImg() {
      this.getShopNav();
      this.dialogVisible = true;
    },
    goHome() {
      this.$router.push('/');
      console.log(this.pendingMessage);
    },
    aboutUs() {
      this.$router.push('/about');
    },
    // 禁用导航按钮
    disableBtn(name) {
      let haveShop = this.currentUser.shop ? this.currentUser.shop.id ? this.currentUser.shop.id : this.currentShopId ? this.currentShopId : window.top.SHOP_ID : '';
      if (this.currentUser.roleLevel === 'company') {
        const NAME_LIST = {
          客服: true,
          财务: true,
          营销: true
        };
        return NAME_LIST[name] && !haveShop;
      } else {
        const NAME_LIST = {
          客服: true,
          财务: true
        };
        return NAME_LIST[name] && !haveShop;
      }
    },
    navBtnClick(nav, val) {
      console.log(nav);
      this.dialogVisible = false;
      this.updateRoutes({ routes: sideList[`${nav.link.split('/')[1]}`] });
      if (nav.name === '消息' || nav.name === '个人') {
        let array = [];
        // 获取有权限的路由
        this.routes.map(item => {
          if (this.currentAuth.includes(item.auth)) {
            array.push(item);
          }
        });
        console.log(array[0].path);
        this.$router.push(array[0].path);
      } else {
        this.$router.replace({ path: '/' });
        this.$router.push({ path: nav.link.split('/')[1] });
      }
      // let array = [];
      // // 获取有权限的路由
      // this.routes.map(item => {
      //   if (this.currentAuth.includes(item.auth)) {
      //     array.push(item);
      //   }
      // });
      // // 先改变侧栏路由树,再updateActivePath
      // if (nav.name === '商城') {
      //   this.$router.push('/hypermarket');
      //   return;
      // }
      // console.log(array[0].path);
      // this.$router.push(array[0].path);
    },
    getDefaultImg() {
      let params = {
        type: 'displaySetting'
      };
      http
        .get('/admin/settings/settings.jhtml', params)
        .then(data => {
          if (data.settingList.defaultStoreLogoImage) {
            this.defaultShopLogo = data.settingList.defaultStoreLogoImage;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    // 获取当前用户信息
    getCurrent() {
      http
        .get('/admin/common/getCurrent.jhtml', {})
        .then(data => {
          store.commit('Authority/updateAuth', data.authorities);
        })
        .catch();
    },

    // 获取权限列表
    getAuth() {
      http
        .get('/admin/common/listAuthority/v201901.jhtml', {})
        .then(data => {
          store.commit('Authority/updateAuth', data.authorities);
          this.checkAuth(data.authorities);
          window.location.reload();
        })
        .catch();
    },
    // 查询管理员店铺
    queryShop() {
      http
        .get('/admin/admin/manageShops.jhtml', {})
        .then(data => {
          this.shops = data.dataList;
        })
        .catch();
    },
    // 切换店铺
    swichShop(shop, type) {
      console.log(shop);
      if (shop.isCurrent === '1' && type === 'default') {
        return false;
      }
      http
        .put('/admin/admin/manageShop/default.jhtml', {
          shopId: shop.id,
          type: type
        })
        .then(data => {
          this.$router.replace({ path: '/' });
          window.location.reload();
        })
        .catch();
    },
    // 查询权限
    queryAuth() {
      http
        .get(this.getAuthUrl, {})
        .then(data => {
          this.checkAuth(data.authorities);
          this.updateAuth(data.authorities);
        })
        .catch();
    },
    // 检查权限
    checkAuth(data) {
      for (let name in this.ifShowBtn) {
        this.ifShowBtn[name] = data.some(auth => {
          // 一级导航下没有左侧的菜单时，默认显示一级导航商城，返回true
          return this.authList[name] ? this.authList[name].includes(auth) : false;
        });
        if (data.includes('admin:shoppingmall.sub')) {
          this.ifShowBtn.hypermarket = true;
        }
      }
      this.ifShowBtn.homePage = true;
    },
    isShowMessage() {
      let flag = this.currentAuth.some(auth => {
        // 一级导航下没有左侧的菜单时，默认显示一级导航商城，返回true
        return this.authList.message ? this.authList.message.includes(auth) : false;
      });
      return flag;
    },
    isShowService() {
      return this.currentAuth.includes('admin:service.service.plateForm');
    },
    // 登出
    logOut() {
      window.top.SHOP_ID = '';
      http
        .post(this.logoutUrl, {})
        .then(data => {
          // 清空sid
          this.clearCookie();
          // 转到登录页面
          this.updateUser({ shop: {} });
          this.$router.push({ path: '/login' });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log(ErrorData);
        });
    },
    // 清空sid
    clearCookie() {
      // document.cookie = 'sid=;expires=-1';
    },
    // 显示消息
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true,
        duration: 1000
      });
    }
  },
  mounted() {
    this.checkAuth(this.currentAuth);
    this.queryShop();
    this.styleWidth = window.getComputedStyle(this.$refs.shopInfo).width;
    this.getDefaultImg();
    if (this.$route.query.registerStore) {
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.shop-nav {
  height: 45vh;
  .border-style {
    border-bottom-style: dashed;
    color: rgb(255, 138, 42);
    height: 10px;
    width: 100px;
    position: absolute;
    background: #ffffff;
  }
  .border-style-disabled {
    border-bottom-style: dashed;
    color: #666666;
    height: 10px;
    width: 100px;
    position: absolute;
    background: #ffffff;
  }
  .step1-border {
    top: 178px;
    left: 140px;
  }
  .step2-border {
    top: 178px;
    left: 348px;
  }
  .step3-border {
    top: 178px;
    left: 553px;
  }
  .square {
    width: 118px;
    height: 118px;
    border-radius: 10px;
    position: absolute;
    border: 1px solid #ff7300;
    z-index: 10;
    background: #fff;
    cursor: pointer;
    .top {
      height: 65px;
      line-height: 65px;
      width: 116px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      background: #ff8a2a;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .title1 {
        height: 40px;
        line-height: 40px;
        padding-top: 5px;
      }
      .title2 {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
    .bottom {
      height: 51px;
      background: #f7f7f7;
      font-size: 12px;
      text-align: center;
      color: #666666;
      border-radius: 0px 0px 10px 10px;
      .over-style {
        display: -webkit-box !important;
        overflow: hidden;
        white-space: normal !important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 10px 8px 0px 8px;
        text-align: left;
      }
    }
  }
  .square-disabled {
    width: 118px;
    height: 118px;
    border-radius: 10px;
    position: absolute;
    border: 1px solid #f4f4f4;
    z-index: 10;
    background: #fff;
    cursor: pointer;
    .top {
      height: 65px;
      line-height: 65px;
      width: 116px;
      font-size: 14px;
      color: #101010;
      text-align: center;
      background: #E5E5E5;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      .title1 {
        height: 40px;
        line-height: 40px;
        padding-top: 5px;
      }
      .title2 {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
    .bottom {
      height: 51px;
      background: #f7f7f7;
      font-size: 12px;
      text-align: center;
      color: #666666;
      border-radius: 0px 0px 10px 10px;
      .over-style {
        display: -webkit-box !important;
        overflow: hidden;
        white-space: normal !important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 10px 0px 0px 8px;
        text-align: left;
      }
    }
  }
  .step1 {
    position: absolute;
    top: 119px;
    left: 40px
  }
  .step2 {
    position: absolute;
    top: 119px;
    left: 247px
  }
  .step3 {
    position: absolute;
    top: 120px;
    left: 456px
  }
  .step4 {
    position: absolute;
    top: 120px;
    left: 660px
  }
}
.wrapper-content {
  margin-left: 56px;
  position: relative;
  .title {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .gender {
    .iconfont {
      position: absolute;
      left: -28px;
      bottom: -2px;
      font-size: 24px;
    }

    .male {
      color: #2069cb;
    }
    .female {
      color: #f935d1;
    }
    .none {
      color: #ff7300;
    }
  }
}
.swich-shop {
  color: #ff7300;
  position: absolute;
  font-size: 12px;
  margin: 10px 0px 0px 10px;
}
.swich-shop-none {
  color: #ff7300;
  position: absolute;
  font-size: 12px;
  margin: 10px 0px 0px 10px;
  display: none;
}
.shop-list {
  display: flex;
  justify-content: flex-start;
  padding: 5px 0px;
  cursor: pointer;
  .shop-name {
    font-size: 12px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 160px;
    white-space: nowrap;
    margin: 0px 10px;
  }
  .shop-font {
    font-size: 12px;
    color: #cfcfcf;
    line-height: 30px;
  }
  .shop-font-yellow {
    font-size: 12px;
    color: #ff7300;
    line-height: 30px;
  }
}
.main-header {
  display: flex;
  justify-content: space-between;
  height: 72px;
  min-height: 72px;
  flex-grow: 0;
  z-index: 2000;
  background: #404040;
  box-shadow: 0 3px 3px #dedede;
  .shop-info {
    cursor: pointer;
    min-width: 270px;
    max-width: 370px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    .platform-logo {
      width: 160px;
      height: 56px;
    }
    .shop-header {
      max-width: 32px;
      max-height: 32px;
    }
    .shop-name {
      margin-left: 10px;
      font-size: 16px;
      color: #ffffff;
      &:hover {
        color: #ff7300;
      }
    }
  }
  .main-nav-area {
    display: flex;
    align-items: center;
    font-size: 18px;
    padding-left: 10px;
    .nav-btn {
      cursor: pointer;
      width: 65px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      color: #ffffff;
      background-color: #404040;
      border: none;
      border-radius: 0;
      &:hover,
      &:focus {
        // background-color: #ffffff;
        color: #ff7300;
      }
      &.active {
        color: #ff7300;
      }
      &.is-disabled {
        color: #c0c4cc;
      }
      .nav-name {
        padding-top: 3px;
      }
    }
    .nav-btn + .nav-btn {
      // border-left: 1px solid #dcdfe6;
      margin-left: 0;
    }
    .iconfont {
      font-size: 20px;
    }
  }
  .functional-area {
    min-width: 170px;
    padding-right: 40px;
    .wrapper {
      display: flex;
      align-items: center;
      height: 72px;
      justify-content: flex-end;
      .iconfont {
        font-size: 20px;
        color: #ffffff;
        cursor: pointer;
      }
      .biz-icon-i-web-t-xt {
        padding: 0px 0px 0px 20px;
      }
      .biz-icon-i-web-t-xx {
        padding: 0px 0px 0px 20px;;
      }
      .biz-icon-i-web-t-kf {
        padding: 0px 0px 0px 20px;;
      }
    }
    .upper {
      display: flex;
      justify-content: center;
      padding-left: 20px;
      .el-button + .el-button {
        color: #939393;
      }
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        margin-top: 3px;
      }
    }
    .lower {
      display: flex;
      justify-content: center;
      align-items: center;
      // color: #ff7300;
      .line {
        padding: 0px 5px;
        color: #939393;
      }
      .el-button {
        padding: 0px;
        color: #939393;
      }
    }
  }
}
.popover-class {
  img {
    float: left;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .el-button {
    padding: 0px;
    color: #939393;
  }
  .line {
    height: 1px;
    width: 100%;
    background-color: #e9e9e9;
    margin: 10px 0px;
  }
}
.el-popover {
  .tooltip-content {
    height: 160px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    color: #929292;
    font-size: 18px;
    .mobile {
      margin-bottom: 20px;
      font-size: 25px;
      color: #ff7300;
      .iconfont {
        font-size: 25px;
      }
    }
    .content-right {
      // display: flex;
      // align-items: flex-start;
      .qr-code {
        width: 113px;
        height: 113px;
      }
      .scan-qr-code {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
