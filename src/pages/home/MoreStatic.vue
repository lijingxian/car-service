<template>
  <div class="moreStatic" ref="home">
      <div class="return" @click="routerLink('/')"><i class="el-icon-arrow-left iconfont"></i>回到首页</div>
      <div class="column1" v-if="this.currentAuth().includes('admin:operatorStatistics.storegroup')&&this.lmgl.moduleId==='4'&&this.lmgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-lmgl"></i><div>联盟管理</div></div>
          <div class="btn" @click="operatorStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary1.totalStoreCount}}</span>
            <div class="cont">联盟店铺数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary1.turnover}}</span>
           <div class="cont">本月联盟营业额（万元）</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary1.increaseMember}}</span>
           <div class="cont">当期新增会员数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:smartReception.statistics')&&this.zndd.moduleId==='5'&&this.zndd.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-zndd"></i><div>智能到店</div></div>
          <div class="btn" @click="smartReception">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary2.intelAccessCnt.increase}}</span>
            <div class="cont">到店人数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary2.robotAccessCnt.increase}}</span>
           <div class="cont">接待人数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.group')&&this.hygl.moduleId==='6'&&this.hygl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-hjgl"></i><div>会员管理</div></div>
          <div class="btn" @click="memberStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary3.total}}</span>
            <div class="cont">累计会员数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{Number(summary3.consumeMember)}}</span>
           <div class="cont">当期消费会员数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{Number(summary3.activeMember)}}</span>
           <div class="cont">当期活跃会员数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:order.statistics.summary')&&this.hyxs.moduleId==='7'&&this.hyxs.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-skgl"></i><div>会员销售</div></div>
          <div class="btn" @click="orderStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary4.orderIncrease}}</span>
            <div class="cont">订单数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary4.orderAmountIncrease}}</span>
           <div class="cont">销售额（万元）</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.card')&&this.hykgl.moduleId==='8'&&this.hykgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-hyk"></i><div>会员卡管理</div></div>
          <div class="btn" @click="memberCardStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary5.totalMemberCardTemplates}}</span>
            <div class="cont">会员卡制式数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary5.totalMemberCard}}</span>
           <div class="cont">累计会员卡（张）</div>
          </div>
          <div class="color-primary">
            <span class="font">{{summary5.totalBalance}}</span>
            <div class="cont">会员卡余额（万元）</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.content')&&this.sqgl.moduleId==='9'&&this.sqgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-cysq"></i><div>社区管理</div></div>
          <div class="btn" @click="contentStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary6.contentNumCnt}}</span>
            <div class="cont">累计帖子数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary6.contentNumInc}}</span>
           <div class="cont">当期新增帖子数</div>
          </div>
          <div class="color-primary"><span class="font">{{summary6.viewNumIns}}</span>
            <div class="cont">当期阅读数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.fleet')&&this.cyhgl.moduleId==='10'&&this.cyhgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-cysq"></i><div>车友会管理</div></div>
          <div class="btn" @click="fleetStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary7.summary1.memberNumCnt}}</span>
            <div class="cont">累计成员数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary7.summary2.memberNumInc}}</span>
           <div class="cont">当期新增成员数</div>
          </div>
          <div class="color-primary"><span class="font">{{summary7.summary3.activeMemberNumCnt}}</span>
            <div class="cont">当期活跃成员数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:accessStatistics.service')&&this.kffw.moduleId==='11'&&this.kffw.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-kffw"></i><div>客服服务</div></div>
          <div class="btn" @click="accessStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary8.sessionCnt.increase}}</span>
            <div class="cont">客服会话数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary8.workSheetCnt.increase}}</span>
           <div class="cont">新增工单数</div>
          </div>
          <div class="color-primary"><span class="font">{{summary8.managerScore.increase}}</span>
            <div class="cont">客户满意度</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:operatorStatistics.car')&&this.clfw.moduleId==='12'&&this.clfw.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-clgl"></i><div>车辆服务</div></div>
          <div class="btn" @click="carStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary9.increase}}</span>
            <div class="cont">新增车辆数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary9.total}}</span>
           <div class="cont">累计车辆数</div>
          </div>
          <div class="color-primary"><span class="font">{{summary9.online}}</span>
            <div class="cont">在线车辆数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:terminalStatistics')&&this.zdgl.moduleId==='13'&&this.zdgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-zdgl"></i><div>终端管理</div></div>
          <div class="btn" @click="terminalStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary10.total}}</span>
            <div class="cont">设备数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary10.bingdCar}}</span>
           <div class="cont">已绑定车辆设备数</div>
          </div>
          <div class="color-primary"><span class="font">{{summary10.online}}/{{summary10.offline}}</span>
            <div class="cont">在线/离线设备数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:activityStatistics.market')&&this.yxgl.moduleId==='14'&&this.yxgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-yhgl"></i><div>营销管理</div></div>
          <div class="btn" @click="activityStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary11.marketingViewNumInc}}</span>
            <div class="cont">阅读量</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary11.activityCrowNumInc}}</span>
           <div class="cont">参与人数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:potentialStatistics')&&this.qkgl.moduleId==='15'&&this.qkgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-qiankeguanli"></i><div>潜客管理</div></div>
          <div class="btn" @click="potentialStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary12.valid.increase}}</span>
            <div class="cont">新增有效潜客数</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary12.sign.increase}}</span>
           <div class="cont">新增签约数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:potential.statistics')&&this.xcxs.moduleId==='16'&&this.xcxs.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-xsgl"></i><div>新车销售</div></div>
          <div class="btn" @click="newCarStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary13.orderProductNumInc}}</span>
            <div class="cont">销售台次（台）</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary13.orderAmountPaidInc}}</span>
           <div class="cont">销售收入（万元）</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:aftersale.statistics.aftersale')&&this.shgl.moduleId==='17'&&this.shgl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-wxby"></i><div>售后管理</div></div>
          <div class="btn" @click="aftersaleStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary14.entryCnt.yValue}}</span>
            <div class="cont">进厂台次（台）</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary14.aftersaleAmount.yValue}}</span>
           <div class="cont">售后产值（万元）</div>
          </div>
          <div class="color-primary"><span class="font">{{summary14.aftersaleComplaint.yValue}}</span>
            <div class="cont">售后投诉</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:Statistic.purchase')&&this.cggl.moduleId==='18'&&this.cggl.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-cggl"></i><div>采购管理</div></div>
          <div class="btn" @click="purchaseStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary15.purchaseOrderNum}}</span>
            <div class="cont">订单数（单）</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary15.purchaseOrderAmount}}</span>
           <div class="cont">订单金额（万元）</div>
          </div>
          <div class="color-primary"><span class="font">{{summary15.purchaseProductNum}}</span>
            <div class="cont">商品数</div>
          </div>
        </div>
      </div>
      <div class="column1" v-if="this.currentAuth().includes('admin:Statistic.sale')&&this.dlsxs.moduleId==='19'&&this.dlsxs.displayable===true">
        <div style="display: flex;justify-content: space-between;">
          <div class="title"><i class="iconfont biz-icon-i-web-l-xsgl"></i><div>代理商销售</div></div>
          <div class="btn" @click="saleStatistics">更多</div>
        </div>
        <div class="table-cell">
          <div class="color-primary"><span class="font">{{summary16.salesOrderNum}}</span>
            <div class="cont">订单数（单）</div>
          </div>
          <div class="color-primary">
           <span class="font">{{summary16.salesOrderAmount}}</span>
           <div class="cont">订单金额（万元）</div>
          </div>
          <div class="color-primary"><span class="font">{{summary16.salesProductNum}}</span>
            <div class="cont">商品数</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import image from '@/assets/images/nav/useFree.png';
import http from '@/common/http';
import dateTime from '@/utils/dateTime';
import ioService from '@/service/push/io';
import screenService from '@/service/push/smartToShopScreen';
import 'swiper/dist/css/swiper.css';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'home',
  filters: {
    filterState(value) {
      return value === '1' ? '已订购' : '未订购';
    }
  },
  data() {
    return {
      pendingDealCount: {},
      image: image,
      messages: [],
      shops: [],
      dataList: [],
      dataListLe: [],
      dialogVisible: false,
      dialogVisibleFree: false,
      shopId: this.getUser().shop.id,
      pendingdealMessages: [],
      statistics: {},
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      activeName: 'month',
      viewType: 'month',
      businessProducts: [],
      businessProductsAll: [],
      summary1: {},
      summary2: {
        robotAccessCnt: {},
        intelAccessCnt: {}
      },
      summary3: {},
      summary4: {},
      summary5: {},
      summary6: {},
      summary7: {
        summary1: {},
        summary2: {},
        summary3: {}
      },
      summary8: {
        sessionCnt: {},
        managerScore: {},
        workSheetCnt: {}
      },
      summary9: {},
      summary10: {},
      summary11: {},
      summary12: {
        sign: {},
        valid: {}
      },
      summary13: {},
      summary14: {
        aftersaleAmount: {},
        entryCnt: {},
        aftersaleComplaint: {}
      },
      summary15: {},
      summary16: {},
      arr: [
        { indicators: 'memberCnt' },
        { indicators: 'memberIns' },
        { indicators: 'activeMemberCnt' }
      ],
      operationRecordDTOs: [],
      moduleDisplayStateDatas: [],
      moduleMessage: [],
      moduleMessageAll: [
        {
          userId: this.getUser().id,
          moduleId: '1',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '2',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '3',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '4',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '5',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '6',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '7',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '8',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '9',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '10',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '11',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '12',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '13',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '14',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '15',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '16',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '17',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '18',
          moduleType: '1',
          displayable: true
        },
        {
          userId: this.getUser().id,
          moduleId: '19',
          moduleType: '1',
          displayable: true
        }
      ],
      wddb: {},
      jqfw: {},
      zxtj: {},
      lmgl: {},
      zndd: {},
      hygl: {},
      hyxs: {},
      hykgl: {},
      sqgl: {},
      cyhgl: {},
      yxgl: {},
      qkgl: {},
      kffw: {},
      clfw: {},
      zdgl: {},
      xcxs: {},
      shgl: {},
      cggl: {},
      dlsxs: {},
      i: 1,
      swiperOption: {
        slidesPerView: 9,
        slidesPerGroup: 9,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          bulletElement: 'li',
          bulletActiveClass: 'my-bullet-active'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    };
  },
  created() {
    this.queryShop();
    this.getHomeBaseInf();
    if (this.currentAuth().includes('admin:operatorStatistics.storegroup')) {
      this.getUnionStatistics();
    }
    if (this.currentAuth().includes('admin:smartReception.statistics')) {
      this.getSmartStatistics();
    }
    if (this.currentAuth().includes('admin:member.statistics.group')) {
      this.getMemberStatistics();
    }
    if (this.currentAuth().includes('admin:order.statistics.summary')) {
      this.getMemberSaleStatistics();
    }
    if (this.currentAuth().includes('admin:member.statistics.card')) {
      this.getMemberCardStatistics();
    }
    if (this.currentAuth().includes('admin:member.statistics.content')) {
      this.getContentStatistics();
    }
    if (this.currentAuth().includes('admin:member.statistics.fleet')) {
      for (let i = 0; i < this.arr.length; i++) {
        this.getFleetStatistics(this.arr[i].indicators, i);
      }
    }
    if (this.currentAuth().includes('admin:accessStatistics.service')) {
      this.getServiceStatistics();
    }
    if (this.currentAuth().includes('admin:operatorStatistics.car')) {
      this.getCarBaseStatistics();
    }
    if (this.currentAuth().includes('admin:terminalStatistics')) {
      this.getTerminalStatistics();
    }
    if (this.currentAuth().includes('admin:activityStatistics.market')) {
      this.getMarketingStatistics();
    }
    if (this.currentAuth().includes('admin:potentialStatistics')) {
      this.getPotentialStatistics();
    }
    if (this.currentAuth().includes('admin:potential.statistics')) {
      this.getSalesStatistics();
    }
    if (this.currentAuth().includes('admin:aftersale.statistics.aftersale')) {
      this.getAfterSalesStatistics();
    }
    if (this.currentAuth().includes('admin:Statistic.purchase')) {
      this.getPurchaseStatistics();
    }
    if (this.currentAuth().includes('admin:Statistic.sale')) {
      this.getInvoiceSaleStatistics();
    }
  },
  components: {},
  computed: {
    styleObject() {
      return {
        height: '80%',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        position: 'inherit',
        background: 'url(' + NoContent + ') 50% 50% / 200px no-repeat'
      };
    }
  },
  mounted() {
    this.expireList();
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('PendingMessage', ['updatePendingMessage']),
    ...mapGetters('Authority', ['currentAuth']),
    linkTo() {
      this.$router.push('/union/federation-mgmt/federation');
    },
    // 去掉内容中的标签及图片/视频
    formatContent(content) {
      if (content) {
        let tmp = content.replace(/<script[^>]*?>.*<\/script>/g, '');
        tmp = tmp.replace(/<style[^>]*?>.*<\/style>/g, '');
        tmp = tmp.replace(/<[^>]+>/g, '');
        tmp = tmp.replace(/\\&[a-zA-Z]{1,10};/g, '');
        return tmp;
      } else {
        return '';
      }
    },
    replaceContent() {
      if (this.businessProducts.length > 2) {
        this.businessProducts = this.businessProducts.slice(2);
        console.log(this.businessProducts);
      } else {
        this.businessProducts = this.businessProductsAll;
        // this.businessProducts = this.businessProducts.slice(2);
      }
    },
    tagStyle(state) {
      if (state === '0') {
        return {
          'background-color': '#ffffff'
        };
      }
      return {
        'background-color': '#f7f7f7'
      };
    },
    routerLink(url) {
      console.log(url);
      this.$router.push({ path: url });
    },
    formatDescription(description) {
      return `<span class="item-name">服务简介: </span>${description.length > 35 ? description.substr(0, 35) + '...' : description}`;
    },
    toLink(row) {
      this.$router.push({ path: '/union/service-mgmt/subscribe?id=' + row.id });
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
    myMessage() {
      http
        .get('/admin/common/myMessage.jhtml', { shopId: this.shopId })
        .then(data => {
          this.messages = data.messages;
        })
        .catch();
    },
    expireList() {
      http
        .get('/admin/businessOrder/listService/expireList.jhtml', { shopId: this.shopId })
        .then(data => {
          this.dataList = data.expiredProducts;
          this.dataListLe = data.interestedProducts;
        })
        .catch();
    },
    home() {
      http
        .get('/admin/common/homePage.jhtml', {})
        .then(data => {
          this.pendingDealCount = data.pendingDeal;
          this.messages = data.messages;
          this.pendingdealMessages = data.pendingdealMessages;
          if (this.pendingdealMessages.length > 0) {
            this.updatePendingMessage({ isExsit: true });
          } else {
            this.updatePendingMessage({ isExsit: false });
          }
          ioService.connect(data.vpushServer);
          screenService.connect(data.vpushServer);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getHomeBaseInf() {
      let params = {
        userId: this.getUser().id,
        moduleType: '1'
      };
      http
        .get('/admin/exhibition/web/coustomModuleLayout/list.jhtml', params)
        .then(data => {
          this.moduleDisplayStateDatas = data.data.moduleDisplayStateDatas;
          if (this.moduleDisplayStateDatas.length > 0) {
            this.moduleDisplayStateDatas.forEach((item, index) => {
              if (item.moduleId === '1') {
                this.wddb = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '2') {
                this.jqfw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '3') {
                this.zxtj = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '4') {
                this.lmgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '5') {
                this.zndd = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '6') {
                this.hygl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '7') {
                this.hyxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '8') {
                this.hykgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '9') {
                this.sqgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '10') {
                this.cyhgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '11') {
                this.kffw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '12') {
                this.clfw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '13') {
                this.zdgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '14') {
                this.yxgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '15') {
                this.qkgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '16') {
                this.xcxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '17') {
                this.shgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '18') {
                this.cggl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '19') {
                this.dlsxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
            });
          } else {
            this.moduleMessageAll.forEach((item, index) => {
              if (item.moduleId === '1') {
                this.wddb = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '2') {
                this.jqfw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '3') {
                this.zxtj = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '4') {
                this.lmgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '5') {
                this.zndd = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '6') {
                this.hygl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '7') {
                this.hyxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '8') {
                this.hykgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '9') {
                this.sqgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '10') {
                this.cyhgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '11') {
                this.kffw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '12') {
                this.clfw = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '13') {
                this.zdgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '14') {
                this.yxgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '15') {
                this.qkgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '16') {
                this.xcxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '17') {
                this.shgl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '18') {
                this.cggl = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
              if (item.moduleId === '19') {
                this.dlsxs = { userId: item.userId, moduleId: item.moduleId, moduleType: item.moduleType, displayable: item.displayable };
              }
            });
          }
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openDialog() {
      this.$router.replace({ path: '/customize' });
      // let routeUrl = this.$router.resolve({ path: '/customize' });
      // window.open(routeUrl.href, '_blank');
    },
    operatorStatistics() {
      this.$router.replace({ path: '/union/statistics-analysis/shop-analysis' });
    },
    smartReception() {
      this.$router.replace({ path: '/union/statistics-analysis/smart-to-shop' });
    },
    memberStatistics() {
      this.$router.replace({ path: '/member/statistics-analysis/user-portrait/member-portrait' });
    },
    orderStatistics() {
      this.$router.replace({ path: '/operating/product-statistics/generalViewAnalysis' });
    },
    memberCardStatistics() {
      this.$router.replace({ path: '/member/statistics-analysis/member/member-card-static' });
    },
    contentStatistics() {
      this.$router.replace({ path: '/member/statistics-analysis/content/generalViewAnalysis' });
    },
    fleetStatistics() {
      this.$router.replace({ path: '/member/statistics-analysis/motorist/generalViewAnalysis' });
    },
    accessStatistics() {
      this.$router.replace({ path: '/service/statistics-analysis/generalViewAnalysis' });
    },
    carStatistics() {
      this.$router.replace({ path: '/car/statistics-analysis/vehicleStatic/generalViewAnalysis' });
    },
    terminalStatistics() {
      this.$router.replace({ path: '/car/statistics-analysis/terminal-statistics' });
    },
    activityStatistics() {
      this.$router.replace({ path: '/marketing/statistics-analysis/marketing-analysis' });
    },
    potentialStatistics() {
      this.$router.replace({ path: '/sales/statistics-analysis/general' });
    },
    newCarStatistics() {
      this.$router.replace({ path: '/sales/statistics-analysis/sale' });
    },
    aftersaleStatistics() {
      this.$router.replace({ path: '/after-sale/statistics-analysis/aftersale' });
    },
    purchaseStatistics() {
      this.$router.replace({ path: '/invoicing/statistics-analysis/purchase' });
    },
    saleStatistics() {
      this.$router.replace({ path: '/invoicing/statistics-analysis/sale' });
    },
    latestApp(row) {
      this.$router.push({ path: '/union/service-mgmt/subscribe?id=' + row.id });
    },
    getUnionStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/stores/summary.jhtml', params)
        .then(data => {
          this.summary1 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getSmartStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/service/service.jhtml', params)
        .then(data => {
          this.summary2 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getMemberStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/member/summary.jhtml', params)
        .then(data => {
          this.summary3 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getMemberSaleStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        type: 'orderSale',
        indicators: ['orderAmount', 'order', 'car']
      };
      http
        .post('/admin/ecommerce/kpi/order/summary/order/order.jhtml', params)
        .then(data => {
          this.summary4 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getMemberCardStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopIds: [this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/memberCard/overview.jhtml', params)
        .then(data => {
          this.summary5 = data;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getContentStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: ['contentCnt', 'contentIns', 'viewNum']
      };
      http
        .post('/admin/ecommerce/kpi/friend/summary/fleet.jhtml', params)
        .then(data => {
          this.summary6 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getFleetStatistics(indicators, i) {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: [indicators]
      };
      http
        .post('/admin/ecommerce/kpi/friend/summary/fleet.jhtml', params)
        .then(data => {
          if (i === 0) {
            this.summary7.summary1 = data.indicators;
          } else if (i === 1) {
            this.summary7.summary2 = data.indicators;
          } else {
            this.summary7.summary3 = data.indicators;
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getServiceStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/service/service.jhtml', params)
        .then(data => {
          this.summary8 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getCarBaseStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/car/summary/storeCar/summary.jhtml', params)
        .then(data => {
          this.summary9 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getTerminalStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType
      };
      http
        .get('/admin/ecommerce/kpi/summary/terminal/storeTerminal/summary.jhtml', params)
        .then(data => {
          this.summary10 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getMarketingStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicators: ['marketingViewNum', 'activityCrowNum'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/marketing/summary/marketing.jhtml', params)
        .then(data => {
          this.summary11 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getPotentialStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        summaryType: '0'
      };
      http
        .get('/admin/ecommerce/kpi/summary/sales/customer/v2.jhtml', params)
        .then(data => {
          this.summary12 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getSalesStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        indicators: ['orderProductNum', 'orderAmountPaid'],
        orderTypes: ['car'],
        viewType: this.viewType
      };
      http
        .post('/admin/ecommerce/kpi/sales/summary/sales.jhtml', params)
        .then(data => {
          this.summary13 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getAfterSalesStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        shopIds: [this.getUser().shop.id]
      };
      http
        .post('/admin/ecommerce/kpi/afterSales/overview.jhtml', params)
        .then(data => {
          this.summary14 = data;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getPurchaseStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: ['purchaseOrderNum', 'purchaseOrderAmount', 'purchaseProductNum']
      };
      http
        .post('/admin/ecommerce/kpi/purchase/summary/purchase.jhtml', params)
        .then(data => {
          this.summary15 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getInvoiceSaleStatistics() {
      let params = {
        beginDate: this.beginDate,
        endDate: this.endDate,
        viewType: this.viewType,
        indicators: ['salesOrderNum', 'salesOrderAmount', 'salesProductNum']
      };
      http
        .post('/admin/ecommerce/kpi/purchase/summary/sales.jhtml', params)
        .then(data => {
          this.summary16 = data.indicators;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
        });
    },
    getRecentVisit() {
      let params = {
        userId: this.getUser().id,
        storeId: this.getUser().shop.id,
        hierarchyId: this.getUser().roleLevel === 'shop' ? '1' : '0',
        companyId: this.getUser().roleLevel === 'shop' ? '' : '0'
      };
      http
        .get('/admin/exhibition/operationRecord/list.jhtml', params)
        .then(data => {
          let arrs = [];
          let brrs = [];
          data.data.operationRecordDTOs.forEach((item, index) => {
            if (arrs.indexOf(item.businessKey.split('?')[0]) < 0) {
              arrs.push(item.businessKey.split('?')[0]);
              brrs.push(index);
            }
          });
          this.operationRecordDTOs = brrs.map(index => {
            return data.data.operationRecordDTOs[index];
          });
          console.log(this.operationRecordDTOs);
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLatestApp() {
      let params = {
        shopId: this.getUser().shopId,
        businessServiceClassify: this.$route.query.businessServiceClassify,
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/businessOrder/listService/v201901.jhtml', params)
        .then(data => {
          this.businessProducts = data.businessProducts;
          this.businessProductsAll = data.businessProducts;
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.service-dialog {
  width: 950px;
  .service-card-view {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 10px;
    height: 100%;
    overflow: auto;
    .color-orange {
      color: #ff7300;
    }
    .order-card {
      cursor: pointer;
      width: 280px;
      margin: 7px;
      font-size: 12px;
      height: 260px;
      .title {
        font-size: 20px;
        color: #101010;
      }
      .el-tag {
        display: block;
        width: 56px;
        margin-top: 6px;
        margin-bottom: 20px;
        // A6表示透明度65%, 255*.65 = 165.75 = 166 = #A6
        color: #101010a6;
        border-color: #e9e9e9;
      }
      .price {
        font-size: 14px;
      }
      .item-name {
        font-size: 14px;
        color: #000000a6;
      }
      .dead-line,
      .description {
        color: #101010a6;
      }
      .description {
        word-break: break-all;
        // 文本溢出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
.moreStatic {
  width: 100%;
  // overflow: auto;
  background: #f4f4f4;
  overflow-x: hidden;
  .left_content {
    background-color: #ffffff;
  }
  .return {
    font-size: 12px;
    margin: 10px;
    cursor: pointer;
  }
  a {
    text-decoration: none;
    color: #666666;
  }
  li {
    list-style-type: none;
  }
  .overflow_ellpise {
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
  }
  .myscroll1 {
    border-bottom: 1px solid #f4f4f4;
    .el-badge__content.is-fixed {
      right: 30px;
    }
    img {
      width: 55px;
      margin: 0 37.5px;
    }
    span {
      display: block;
      margin: 0 auto;
      text-align: center;
      width: 100%;
      font-size: 12px;
      padding: 0.5rem 1rem 0;
      box-sizing: border-box;
      white-space: normal;
      color: #666666;
    }
  }
  .left_content {
    width: 65.7%;
    float: left;
    height: 420px;
    margin: 10px 10px 5px 5px;
    box-sizing: border-box;
    .bottom_content {
      padding: 30px 30px 20px 30px;
      .daiban {
        margin: 20px 0px 0px 20px;
        li {
          padding: 5px 0px;
          .date {
            float: right;
            padding-right: 10px;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
    .top_content {
      height: 140px;
      .title {
        // background: #ebebeb;
        // text-align: center;
        margin-left: 10px;
        margin-top: 20px;
        padding-left: 5px;
        // height: 35px;
        line-height: 25px;
        color: #000;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  }
  .icon {
    color: #929292;
    .iconfont {
      font-size: 46px;
      // background-color: #f0f0f0;
      border-radius: 5px;
      padding: 5px;
    }
  }
  .icon_orange {
    color: #ff7300;
    .iconfont {
      font-size: 46px;
      // background-color: #f0f0f0;
      border-radius: 5px;
      padding: 10px;
    }
  }
  .right_content {
    width: 32.4%;
    float: right;
    // border-right: 1px solid #b7b7b7;
    height: 420px;
    box-sizing: border-box;
    margin: 10px 10px 5px 0px;
    .title {
      // background: #ebebeb;
      // text-align: center;
      margin-left: 20px;
      margin-top: 10px;
      padding-left: 5px;
      // height: 35px;
      line-height: 25px;
      color: #000;
      font-weight: bold;
      font-size: 14px;
      padding-top: 10px;
    }
    .bottom_content {
      margin: 20px 10px 0px 20px;
      overflow-y: auto;
      li {
        text-align: left;
        padding: 5px 0px 5px 0px;
        font-size: 12px;
        .date {
          float: right;
          padding-right: 10px;
        }
      }
    }
  }
  .drag-box {
    box-sizing: border-box;
    // overflow: hidden;
    padding: 0;
    position: relative;
    z-index: 11;
    cursor: move;
  }

  .drag-box > * {
    margin: 0;
    padding: 0;
    font-size: 0;
    white-space: nowrap;
    text-align: center;
    align-items: baseline;
    margin-bottom: 40px;
    padding-top: 10px;
  }

  .drag-box > * > * {
    // display: inline-block;
    vertical-align: top;
    align-items: center;
  }
  // .drag-box > * > *:first-child {
  //   margin-left: 1rem;
  // }
  // .drag-box > * > *:last-child {
  //   margin-right: 1rem;
  // }

  .drag-box:before,
  .drag-box:after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    pointer-events: none;
    top: 0;
    height: 100%;
    width: 3rem;
  }

  .drag-box:before {
    left: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 1.5rem);
  }
  .drag-box:after {
    right: 0;
    background: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 1.5rem);
  }
  .swiper-button-prev, .swiper-button-next {
    background-size: 20px 20px;
  }
  .my-bullet-active {
    background: #ff6600;
    opacity: 3;
    padding: 0px !important;
  }
  .swiper-pagination-fraction, .swiper-pagination-custom,
  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 0px;
    position: inherit;
  }
  .swiper-pagination-bullet {
    padding: 0px !important;
  }
    .column1 {
      display: inline-table;
      flex-wrap: wrap;
      width: 32.4%;
      margin: 5px 0px 5px 10px;
      background-color: #ffffff;
      line-height: 20px;
      height: 205px;
      .title {
        i {
          font-size: 50px;
        }
        margin-left: 20px;
        margin-top: 20px;
        padding-left: 5px;
        line-height: 25px;
        color: #ff7300;
        font-size: 20px;
        display: flex;
        div {
          font-weight: bold;
        }
      }
      .btn {
        margin-top: 20px;
        line-height: 25px;
        font-size: 11px;
        cursor: pointer;
        padding-right: 10px;
      }
      .table-cell {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .color-primary {
          margin-left: 10px;
          padding: 20px 0px 10px 25px;
          width: 170px;
          .font {
            color: #ff7300;
            font-weight: bold;
          }
          .cont {
            font-size: 11px;
            padding-top: 10px;
          }
        }
      }
  }
}
</style>
