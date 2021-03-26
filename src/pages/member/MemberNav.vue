<template>
  <div class="member-mgmt-nav">
    <div class="image" v-if="getUser().roleLevel==='shop'">
      <img :src="hy" style="width:915px"/>
      <!-- <div class="title1">建立会员体系</div>
      <div class="title2">会员服务</div>
      <div class="title3">数据洞察</div> -->
      <div
        class="square2 step1"
        v-popover:codePop
        @click="link('/member/member-card/member/member-card-template/true')"
        v-if="currentAuth().includes('admin:memberCardTemplate')"
      >
        <div class="top">建立成长体系</div>
        <div class="bottom">
          已有会员卡制式
          <span>{{this.form.growthSystemCount}}套</span>
        </div>
      </div>
      <div class="square2 step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:memberCardTemplate')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">建立成长体系</div>
        <div class="bottom">
          已有会员卡制式
          <span>{{this.form.growthSystemCount}}套</span>
        </div>
      </div>
      <div
        class="square2 step2"
        v-popover:codePop1
        @click="link('/member/member-card/member/member-card-template/true')"
        v-if="currentAuth().includes('admin:member.memberBenefits')"
      >
        <div class="top">建立激励体系</div>
        <div class="bottom">
          已有会员权益
          <span>{{this.form.incentiveSystemCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:member.memberBenefits')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">建立激励体系</div>
        <div class="bottom">
          已有会员权益
          <span>{{this.form.incentiveSystemCount}}个</span>
        </div>
      </div>
      <!-- <div class="square step3" v-popover:codePop2 @click="link('/member/membership-mgmt')" v-if="currentAuth().includes('admin:member.import')">
        <div class="top">导入会员</div>
        <div class="bottom">
          本月新导入会员
          <span>{{this.form.importMemberCount}}人</span>
        </div>
      </div>
      <div class="square step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:member.import')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">导入会员</div>
        <div class="bottom">
          本月新导入会员
          <span>{{this.form.importMemberCount}}人</span>
        </div>
      </div> -->
      <div class="square step4" v-popover:codePop3 @click="link('/member/membership-mgmt')" v-if="currentAuth().includes('admin:member.list')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="memberPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">会员服务</div>
        <div class="bottom">
          已有会员
          <span>{{this.form.memberCount}}人</span>
        </div>
      </div>
      <div class="square step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:member.list')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="memberPendingDeal===1"></i>
        <div class="top">会员服务</div>
        <div class="bottom">
          已有会员
          <span>{{this.form.memberCount}}人</span>
        </div>
      </div>
      <div class="square step5" v-popover:codePop4 @click="link('/member/member-card/member-card/true')" v-if="currentAuth().includes('admin:memberCard')">
        <div class="top">管理会员</div>
        <div class="bottom">
          已有会员卡
          <span>{{this.form.memberCardCount}}张</span>
        </div>
      </div>
      <div class="square step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:memberCard')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理会员</div>
        <div class="bottom">
          已有会员卡
          <span>{{this.form.memberCardCount}}张</span>
        </div>
      </div>
      <div class="square1 step6" v-popover:codePop5 @click="link('/member/member-care-mgmt/care')" v-if="currentAuth().includes('admin:member.memberCare')">
        <div class="top">会员关怀</div>
        <div class="bottom">
          已有关怀卡
          <span>{{this.form.careCardCount}}个</span>
        </div>
      </div>
      <div class="square1 step6 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:member.memberCare')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员关怀</div>
        <div class="bottom">
          已有关怀卡
          <span>{{this.form.careCardCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step7"
        v-popover:codePop6
        @click="link('/member/statistics-analysis/member/member-card-static')"
        v-if="currentAuth().includes('admin:member.statistics.card')"
      >
        <div class="top">会员卡分析</div>
        <div class="bottom">
          本月新增会员卡
          <span>{{this.form.memberCardMonthCount}}张</span>
        </div>
      </div>
      <div class="square2 step7 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:member.statistics.card')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员卡分析</div>
        <div class="bottom">
          本月新增会员卡
          <span>{{this.form.memberCardMonthCount}}张</span>
        </div>
      </div>
      <div class="square1 step8" v-popover:codePop7 @click="link('/member/motor-club/fleetMember')" v-if="currentAuth().includes('admin:fleet')">
        <div class="top">运营社区</div>
        <div class="bottom">
          已有车友会
          <span>{{this.form.clubCount}}个</span>
        </div>
      </div>
      <div class="square1 step8 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:fleet')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">运营社区</div>
        <div class="bottom">
          已有车友会
          <span>{{this.form.clubCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step9"
        v-popover:codePop8
        v-if="currentAuth().includes('admin:statistics.mouthreport.membercard')"
        @click="link('/member/statistics-analysis/member/member-card-report')"
      >
        <div class="top">会员卡月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step9 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:statistics.mouthreport.membercard')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员卡月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div
        class="square2 step12"
        v-popover:codePop11
        v-if="currentAuth().includes('admin:member.statistics.content')"
        @click="link('/member/statistics-analysis/content/generalViewAnalysis')"
      >
        <div class="top">内容分析</div>
        <div class="bottom">
          本月阅读数
          <span>{{this.form.viewNum}}次</span>
        </div>
      </div>
      <div class="square2 step12 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:member.statistics.content')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">内容分析</div>
        <div class="bottom">
          本月阅读数
          <span>{{this.form.viewNum}}次</span>
        </div>
      </div>
      <div
        class="square2 step13"
        v-popover:codePop12
        v-if="currentAuth().includes('admin:member.statistics.fleet')"
        @click="link('/member/statistics-analysis/motorist/generalViewAnalysis')"
      >
        <div class="top">车友会</div>
        <div class="bottom">
          累计成员
          <span>{{this.form.fleetMemberCount}}人</span>
        </div>
      </div>
      <div class="square2 step13 disabled" v-popover:codePop12 v-if="!currentAuth().includes('admin:member.statistics.fleet')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">车友会</div>
        <div class="bottom">
          累计成员
          <span>{{this.form.fleetMemberCount}}人</span>
        </div>
      </div>
      <div
        class="square2 step10"
        v-popover:codePop9
        v-if="currentAuth().includes('admin:member.statistics.singer')"
        @click="link('/member/statistics-analysis/user-portrait/single-member-portrait')"
      >
        <div class="top">单会员画像</div>
        <div class="bottom">
          已生成
          <span>{{this.form.singleMember}}人</span>画像
        </div>
      </div>
      <div class="square2 step10 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:member.statistics.singer')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单会员画像</div>
        <div class="bottom">
          已生成
          <span>{{this.form.singleMember}}人</span>画像
        </div>
      </div>
      <div
        class="square2 step11"
        v-popover:codePop10
        v-if="currentAuth().includes('admin:member.statistics.group')"
        @click="link('/member/statistics-analysis/user-portrait/member-portrait')"
      >
        <div class="top">会员群画像</div>
        <div class="bottom">
          本月活跃会员
          <span>{{this.form.groupMember}}人</span>
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:member.statistics.group')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员群画像</div>
        <div class="bottom">
          本月活跃会员
          <span>{{this.form.groupMember}}人</span>
        </div>
      </div>
      <div
        class="square2 step14"
        v-popover:codePop14
        v-if="currentAuth().includes('admin:statistics.mouthreport.member')"
        @click="link('/member/statistics-analysis/member/member-report')"
      >
        <div class="top">会员月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step14 disabled" v-popover:codePop14 v-if="!currentAuth().includes('admin:statistics.mouthreport.member')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">建立成长体系</div>
          <div class="middle-font">创建会员卡制式，设置会员卡成长体系</div>
          <div class="bottom-font">
            已有会员卡制式
            <span>{{this.form.growthSystemCount}}套</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">建立激励体系</div>
          <div class="middle-font">创建会员卡制式，设置会员激励体系</div>
          <div class="bottom-font">
            已有会员权益
            <span>{{this.form.incentiveSystemCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">导入会员</div>
          <div class="middle-font">批量导入会员</div>
          <div class="bottom-font">
            本月新导入会员
            <span>{{this.form.importMemberCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">维护会员信息</div>
          <div class="middle-font">维护会员基本信息，了解会员的权益、动态、车辆、终端等信息</div>
          <div class="bottom-font">
            已有会员
            <span>{{this.form.memberCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">管理会员卡</div>
          <div class="middle-font">会员卡发放、储值、消费</div>
          <div class="bottom-font">
            已有会员卡
            <span>{{this.form.memberCardCount}}张</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">会员关怀</div>
          <div class="middle-font">管理会员关怀的分类和关怀的内容</div>
          <div class="bottom-font">
            已有关怀卡
            <span>{{this.form.careCardCount}}张</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">会员卡分析</div>
          <div class="middle-font">帮助您了解会员卡发放和消费的情况</div>
          <div class="bottom-font">
            本月新增会员卡
            <span>{{this.form.memberCardMonthCount}}张</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">运营社区</div>
          <div class="middle-font">车友会组建，社区文章、动态、问答、活动内容管理</div>
          <div class="bottom-font">
            已有车友会
            <span>{{this.form.clubCount}}个</span>
          </div>
          <div class="bottom-font">
            今日新增动态
            <span>{{this.form.newAddCommunityCount}}条</span>
          </div>
          <div class="bottom-font">
            今日新增问答
            <span>{{this.form.newAddAskCount}}个</span>
          </div>
          <div class="bottom-font">
            今日新增文章
            <span>{{this.form.newAddArticleCount}}篇</span>
          </div>
          <div class="bottom-font">
            举办中活动
            <span>{{this.form.activityCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">会员卡月报</div>
          <div class="middle-font">对会员卡的整体情况进行总结，并给出建议</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">单会员画像</div>
          <div class="middle-font">帮助您了解指定会员的属性特征</div>
          <div class="bottom-font">
            已生成
            <span>{{this.form.singleMember}}人</span>画像
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">会员群画像</div>
          <div class="middle-font">帮助您了解会员群体的属性特征分布</div>
          <div class="bottom-font">
            本月活跃会员
            <span>{{this.form.groupMember}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">内容分析</div>
          <div class="middle-font">帮助您了解社区内容运营的效果</div>
          <div class="bottom-font">
            本月阅读数
            <span>{{this.form.viewNum}}次</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop12">
        <div class="pop-div">
          <div class="top-font">车友会</div>
          <div class="middle-font">帮助您了解车友会的情况</div>
          <div class="bottom-font">
            累计成员
            <span>{{this.form.fleetMemberCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop14">
        <div class="pop-div">
          <div class="top-font">会员月报</div>
          <div class="middle-font">对会员的整体情况进行总结，并给出建议</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
    </div>
    <div class="image" v-if="getUser().roleLevel!=='shop'">
      <img :src="member" style="width:915px"/>
      <!-- <div class="title4">会员管理</div>
      <div class="title5">数据洞察</div> -->
      <div class="square2 step01" v-popover:codePop0 @click="link('/member/membership-mgmt')" v-if="currentAuth().includes('admin:member.list')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="memberPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">维护会员信息</div>
        <div class="bottom">
          已有会员
          <span>{{this.formPlat.memberCount}}人</span>
        </div>
      </div>
      <div class="square2 step01 disabled" v-popover:codePop0 v-if="!currentAuth().includes('admin:member.list')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="memberPendingDeal===1"></i>
        <div class="top">维护会员信息</div>
        <div class="bottom">
          已有会员
          <span>{{this.formPlat.memberCount}}人</span>
        </div>
      </div>
      <div class="square step02" v-popover:codePop01 @click="link('/member/membership-mgmt')" v-if="currentAuth().includes('admin:member.list')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="realNamePendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">实名认证</div>
        <div class="bottom">
          已实名认证
          <span>{{this.formPlat.realNamePendingDeal}}人</span>
        </div>
      </div>
      <div class="square step02 disabled" v-popover:codePop01 v-if="!currentAuth().includes('admin:member.list')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="realNamePendingDeal===1"></i>
        <div class="top">实名认证</div>
        <div class="bottom">
          已实名认证
          <span>{{this.formPlat.realNamePendingDeal}}人</span>
        </div>
      </div>
      <div
        class="square2 step03"
        v-popover:codePop02
        v-if="currentAuth().includes('admin:member.statistics.singer')"
        @click="link('/member/statistics-analysis/user-portrait/single-member-portrait')"
      >
        <div class="top">单会员画像</div>
        <div class="bottom">
          已生成
          <span>{{this.formPlat.singleMember}}人</span>画像
        </div>
      </div>
      <div class="square2 step03 disabled" v-popover:codePop02 v-if="!currentAuth().includes('admin:member.statistics.singer')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单会员画像</div>
        <div class="bottom">
          已生成
          <span>{{this.formPlat.singleMember}}人</span>画像
        </div>
      </div>
      <div
        class="square2 step04"
        v-popover:codePop03
        v-if="currentAuth().includes('admin:member.statistics.group')"
        @click="link('/member/statistics-analysis/user-portrait/member-portrait')"
      >
        <div class="top">会员群画像</div>
        <div class="bottom">
          本月活跃会员
          <span>{{this.formPlat.groupMember}}人</span>
        </div>
      </div>
      <div class="square2 step04 disabled" v-popover:codePop03 v-if="!currentAuth().includes('admin:member.statistics.group')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会员群画像</div>
        <div class="bottom">
          本月活跃会员
          <span>{{this.formPlat.groupMember}}人</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop0">
        <div class="pop-div">
          <div class="top-font">维护会员信息</div>
          <div class="middle-font">维护会员基本信息，了解会员的权益、动态、车辆、终端等信息</div>
          <div class="bottom-font">
            已有会员
            <span>{{this.formPlat.memberCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop01">
        <div class="pop-div">
          <div class="top-font">实名认证</div>
          <div class="middle-font">对会员进行实名认证的审核</div>
          <div class="bottom-font">
            已实名认证
            <span>{{this.formPlat.realNamePendingDeal}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop02">
        <div class="pop-div">
          <div class="top-font">单会员画像</div>
          <div class="middle-font">帮助您了解会员群体的属性特征分布</div>
          <div class="bottom-font">
            已生成
            <span>{{this.formPlat.singleMember}}人</span>画像
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop03">
        <div class="pop-div">
          <div class="top-font">会员群画像</div>
          <div class="middle-font">维护会员基本信息，了解会员的权益、动态、车辆、终端等信息</div>
          <div class="bottom-font">
            本月活跃会员
            <span>{{this.formPlat.groupMember}}人</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import hy from '@/assets/images/nav/hy.png';
import member from '@/assets/images/nav/member.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        growthSystemCount: 0,
        incentiveSystemCount: 0,
        memberCount: 0,
        careCardCount: 0,
        clubCount: 0,
        newAddCommunityCount: 0,
        newAddAskCount: 0,
        newAddArticleCount: 0,
        activityCount: 0,
        memberCardCount: 0,
        groupMember: 0,
        singleMember: 0,
        viewNum: 0,
        fleetMemberCount: 0,
        memberCardMonthCount: 0,
        importMemberCount: 0
      },
      formPlat: {
        memberCount: 0,
        realNamePendingDeal: 0,
        groupMember: 0,
        singleMember: 0
      },
      memberPendingDeal: 0,
      realNamePendingDeal: 0,
      hy: hy,
      member: member
    };
  },
  computed: {},
  components: {},
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapGetters('Authority', ['currentAuth']),
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    },
    getNavInfo() {
      http
        .get('/admin/store/navigation/kpi/member.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.memberPendingDeal = data.memberPendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getPlatNavInfo() {
      http
        .get('/admin/store/navigation/kpi/platformMember.jhtml', {})
        .then(data => {
          Object.assign(this.formPlat, data);
          this.memberPendingDeal = data.memberPendingDeal;
          this.realNamePendingDeal = data.realNamePendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    if (this.getUser().roleLevel !== 'shop') {
      this.getPlatNavInfo();
    } else {
      this.getNavInfo();
    }
  }
};
</script>

<style lang="scss">
.pop-div {
  border-radius: 5px;
  text-align: left;
  padding: 10px;
  .top-font {
    font-size: 16px;
  }
  .middle-font {
    padding: 10px 0px;
    font-size: 12px;
  }
  .bottom-font {
    font-size: 14px;
    span {
      color: #ff7300;
      margin-left: 10px;
    }
  }
}
.member-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 15px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 150px;
      width: 120px;
    }
    .title2 {
      top: 15px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 598px;
      width: 90px;
    }
    .title3 {
      top: 15px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 980px;
      width: 90px;
    }
    .title4 {
      top: 38px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 250px;
      width: 90px;
    }
    .title5 {
      top: 38px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 640px;
      width: 90px;
    }
    .step1 {
      top: 270px;
      left: 80px;
    }
    .step2 {
      top: 410px;
      left: 80px;
    }
    .step3 {
      top: 462px;
      left: 233px;
    }
    .step4 {
      top: 340px;
      left: 255px;
    }
    .step01 {
      top: 195px;
      left: 170px;
    }
    .step02 {
      top: 195px;
      left: 340px;
    }
    .step03 {
      top: 144px;
      left: 569px;
    }
    .step04 {
      top: 270px;
      left: 569px;
    }
    .step5 {
      top: 104px;
      left: 428px;
    }
    .step6 {
      top: 230px;
      left: 428px;
    }
    .step7 {
      top: 60px;
      left: 635px;
    }
    .step8 {
      top: 360px;
      left: 428px;
    }
    .step9 {
      top: 168px;
      left: 635px;
    }
    .step10 {
      top: 522px;
      left: 635px;
    }
    .step11 {
      top: 644px;
      left: 635px;
    }
    .step12 {
      top: 288px;
      left: 635px;
    }
    .step13 {
      top: 406px;
      left: 635px;
    }
    .step14 {
      top: 758px;
      left: 635px;
    }
    .disabled {
      border: 1px solid #f4f4f4 !important;
      background: #B3B3B3 !important;
      .top {
        color: #fff !important;
      }
      span {
        color: #666666 !important;
      }
    }
    .square {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FF7300;
      z-index: 10;
      background:#FF7300;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square1 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFA800;
      z-index: 10;
      background:#FFA800;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square2 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFCF06;
      z-index: 10;
      background:#FFCF06;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
