<template>
  <div class="marketing-mgmt-nav">
    <div class="image" v-if="getUser().roleLevel==='shop'">
      <img :src="marketing" style="width:915px"/>
      <!-- <div class="title1">发布营销内容</div>
      <div class="title2">推送营销内容</div>
      <div class="title3">数据洞察</div> -->
      <div class="square step1" v-popover:codePop @click="link('/marketing/marketing-mgmt/activity')" v-if="currentAuth().includes('admin:activity')">
        <div class="top">发布营销活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.marketingCount}}个</span>
        </div>
      </div>
      <div class="square step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:activity')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发布营销活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.marketingCount}}个</span>
        </div>
      </div>
      <div class="square step2" v-popover:codePop1 @click="link('/marketing/marketing-mgmt/promotion')" v-if="currentAuth().includes('admin:promotion')">
        <div class="top">发布促销活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.activityCount}}个</span>
        </div>
      </div>
      <div class="square step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:promotion')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发布促销活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.activityCount}}个</span>
        </div>
      </div>
      <div class="square1 step3" v-popover:codePop2 @click="link('/marketing/marketing-mgmt/event')" v-if="currentAuth().includes('admin:offlineActivity')">
        <div class="top">发布线下活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.localMarketingCount}}个</span>
        </div>
      </div>
      <div class="square1 step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:offlineActivity')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发布线下活动</div>
        <div class="bottom">
          进行中活动
          <span>{{this.form.localMarketingCount}}个</span>
        </div>
      </div>
      <div class="square step4" v-popover:codePop3 @click="link('/marketing/marketing-mgmt/shop-publicity')" v-if="currentAuth().includes('admin:article')">
        <div class="top">发布软文宣传</div>
        <div class="bottom">
          已有软文宣传
          <span>{{this.form.articleCount}}篇</span>
        </div>
      </div>
      <div class="square step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:article')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发布软文宣传</div>
        <div class="bottom">
          已有软文宣传
          <span>{{this.form.articleCount}}篇</span>
        </div>
      </div>
      <div class="square step5" v-popover:codePop4 @click="link('/marketing/marketing-mgmt/product')" v-if="currentAuth().includes('admin:articleProduct')">
        <div class="top">发布商品推广</div>
        <div class="bottom">
          已有商品推广
          <span>{{this.form.promotionCount}}篇</span>
        </div>
      </div>
      <div class="square step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:articleProduct')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">发布商品推广</div>
        <div class="bottom">
          已有商品推广
          <span>{{this.form.promotionCount}}篇</span>
        </div>
      </div>
      <div class="square step6" v-popover:codePop5>
        <div class="top">推送内容</div>
        <div class="bottom">
          已有推送
          <span>{{this.form.recommendCount}}次</span>
        </div>
      </div>
      <div class="square1 step7" v-popover:codePop6>
        <div class="top">推送排序</div>
        <div class="bottom">
          已置顶内容
          <span>{{this.form.recommendIsTopCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step8"
        v-popover:codePop7
        @click="link('/marketing/statistics-analysis/marketing-analysis')"
        v-if="currentAuth().includes('admin:activityStatistics.market')"
      >
        <div class="top">营销分析</div>
        <div class="bottom">
          参与人数
          <span>{{this.form.marketingMemberCount}}人</span>
        </div>
      </div>
      <div class="square2 step8 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:activityStatistics.market')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">营销分析</div>
        <div class="bottom">
          参与人数
          <span>{{this.form.marketingMemberCount}}人</span>
        </div>
      </div>
      <div
        class="square2 step9"
        v-popover:codePop8
        @click="link('/marketing/statistics-analysis/channel-analysis')"
        v-if="currentAuth().includes('admin:activityStatistics.channel')"
      >
        <div class="top">渠道分析</div>
        <div class="bottom">
          已推送
          <span>{{this.form.recommendCount}}次</span>
        </div>
      </div>
      <div class="square2 step9 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:activityStatistics.channel')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">渠道分析</div>
        <div class="bottom">
          已推送
          <span>{{this.form.recommendCount}}次</span>
        </div>
      </div>
      <div
        class="square2 step10"
        v-popover:codePop9
        @click="link('/marketing/statistics-analysis/fans-analysis')"
        v-if="currentAuth().includes('admin:activityStatistics.fan')"
      >
        <div class="top">粉丝分析</div>
        <div class="bottom">
          净增粉丝数
          <span>{{this.form.fansNumInt}}人</span>
        </div>
      </div>
      <div class="square2 step10 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:activityStatistics.fan')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">粉丝分析</div>
        <div class="bottom">
          净增粉丝数
          <span>{{this.form.fansNumInt}}人</span>
        </div>
      </div>
      <div
        class="square2 step11"
        v-popover:codePop10
        @click="link('/marketing/statistics-analysis/report')"
        v-if="currentAuth().includes('admin:statistics.mouthreport.marketing')"
      >
        <div class="top">营销月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:statistics.mouthreport.marketing')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">营销月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div
        class="square2 step12"
        v-popover:codePop11
        @click="link('/marketing/statistics-analysis/single')"
        v-if="currentAuth().includes('admin:activityStatistics.fan')"
      >
        <div class="top">单内容分析</div>
        <div class="bottom">
          已生成
          <span>{{this.form.fansNumInt}}个</span>内容分析
        </div>
      </div>
      <div class="square2 step12 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:activityStatistics.fan')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单内容分析</div>
        <div class="bottom">
          已生成
          <span>{{this.form.fansNumInt}}个</span>内容分析
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">发布营销活动</div>
          <div class="middle-font">营销活动创建、发布，支持抽奖、团购、秒杀、砍价等多种营销方式</div>
          <div class="bottom-font">
            进行中活动
            <span>{{this.form.marketingCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">发布促销活动</div>
          <div class="middle-font">促销活动创建、发布，支持满减、折扣、套餐、包邮、优惠券等多种促销方式</div>
          <div class="bottom-font">
            进行中活动
            <span>{{this.form.activityCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">发布线下活动</div>
          <div class="middle-font">线下活动创建、发布，支持大屏投屏和手机端参与</div>
          <div class="bottom-font">
            进行中活动
            <span>{{this.form.localMarketingCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">发布软文宣传</div>
          <div class="middle-font">软文宣传内容创建、发布，支持发布文章、视频、VR类型的内容。</div>
          <div class="bottom-font">
            已有软文宣传
            <span>{{this.form.articleCount}}篇</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">发布商品推广</div>
          <div class="middle-font">商品推广内容创建、发布，可以将商品作为推广对象，点击直接跳转到购买链接</div>
          <div class="bottom-font">
            已有商品推广
            <span>{{this.form.promotionCount}}篇</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">推送内容</div>
          <div class="middle-font">内容创建后可推送到多种渠道，除V服渠道外还支持微信、头条、百度等外部渠道。</div>
          <div class="bottom-font">
            已有推送
            <span>{{this.form.recommendCount}}次</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">推送排序</div>
          <div class="middle-font">修改推送的顺序，顺序靠前的展示在前可以获取更多展示机会</div>
          <div class="bottom-font">
            已置顶内容
            <span>{{this.form.recommendIsTopCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">营销分析</div>
          <div class="middle-font">对营销内容进行分析，助你更好进行营销</div>
          <div class="bottom-font">
            参与人数
            <span>{{this.form.marketingMemberCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">渠道分析</div>
          <div class="middle-font">对推送渠道进行分析，助你更好进行推送</div>
          <div class="bottom-font">
            已推送
            <span>{{this.form.recommendCount}}次</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">粉丝分析</div>
          <div class="middle-font">对关注粉丝进行分析，助你了解粉丝特性，更针对性精准营销</div>
          <div class="bottom-font">
            净增粉丝数
            <span>{{this.form.fansNumInt}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">营销月报</div>
          <div class="middle-font">对营销的整体情况进行总结，并给出建议。</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">单内容分析</div>
          <div class="middle-font">对单个活动/文章进行分析，了解活动/文章的营销效果和人群分布。</div>
          <div class="bottom-font">
            已生成
            <span>{{this.form.fansNumInt}}个</span>内容分析
          </div>
        </div>
      </el-popover>
    </div>
    <div class="image" v-if="getUser().roleLevel!=='shop'">
      <img :src="marketpt" style="width:915px"/>
      <!-- <div class="title4">维护基础数据</div>
      <div class="title5">审核推送</div> -->
      <div class="square1 step01" v-popover:codePop0 @click="link('/marketing/template/activity')" v-if="currentAuth().includes('admin:activityTemplate')">
        <div class="top">维护营销模板</div>
        <div class="bottom">
          已有模板
          <span>{{this.formPlat.marketingCount}}个</span>
        </div>
      </div>
      <div class="square1 step01 disabled" v-popover:codePop0 v-if="!currentAuth().includes('admin:activityTemplate')">
        <div class="top">维护营销模板</div>
        <div class="bottom">
          已有模板
          <span>{{this.formPlat.marketingCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step02"
        v-popover:codePop01
        @click="link('/marketing/template/marketing-template/key-word')"
        v-if="currentAuth().includes('admin:keywordTemplate')"
      >
        <div class="top">维护关键词包</div>
        <div class="bottom">
          已有关键词包
          <span>{{this.formPlat.keywordCount}}个</span>
        </div>
      </div>
      <div class="square1 step02 disabled" v-popover:codePop01 v-if="!currentAuth().includes('admin:keywordTemplate')">
        <div class="top">维护关键词包</div>
        <div class="bottom">
          已有关键词包
          <span>{{this.formPlat.keywordCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step03"
        v-popover:codePop02
        @click="link('/system/operating/push-audit-setting')"
        v-if="currentAuth().includes('admin:setting.pushAudit')"
      >
        <div class="top">设置推送审核</div>
        <div class="bottom">
          已设置审核
          <span>{{this.formPlat.recommendConfig}}个</span>
        </div>
      </div>
      <div class="square2 step03 disabled" v-popover:codePop02 v-if="!currentAuth().includes('admin:setting.pushAudit')">
        <div class="top">设置推送审核</div>
        <div class="bottom">
          已设置审核
          <span>{{this.formPlat.recommendConfig}}个</span>
        </div>
      </div>
      <div
        class="square2 step04"
        v-popover:codePop03
        @click="link('/marketing/recommend/headline/head-line')"
        v-if="currentAuth().includes('admin:headline.platform')"
      >
        <div class="top">设置头条接口</div>
        <div class="bottom">
          已设置头条接口
          <span>{{this.formPlat.toutiaoAdCount}}个</span>
        </div>
      </div>
      <div class="square2 step04 disabled" v-popover:codePop03 v-if="!currentAuth().includes('admin:headline.platform')">
        <div class="top">设置头条接口</div>
        <div class="bottom">
          已设置头条接口
          <span>{{this.formPlat.toutiaoAdCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step05"
        v-popover:codePop04
        @click="link('/marketing/recommend/baidu/baidu-info')"
        v-if="currentAuth().includes('admin:baiduflow.platform')"
      >
        <div class="top" style="padding-bottom:0px">设置百度信息流接口</div>
        <div class="bottom">
          已设置信息流接口
          <span>{{this.formPlat.baiduAdCount}}个</span>
        </div>
      </div>
      <div class="square step05 disabled" v-popover:codePop04 v-if="!currentAuth().includes('admin:baiduflow.platform')">
        <div class="top" style="padding-bottom:0px">设置百度信息流接口</div>
        <div class="bottom">
          已设置信息流接口
          <span>{{this.formPlat.baiduAdCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step06"
        v-popover:codePop05
        @click="link('/marketing/recommend/baidu/baidu-search')"
        v-if="currentAuth().includes('admin:baidusearch.platform')"
      >
        <div class="top">设置百度搜索接口</div>
        <div class="bottom">
          已设置百度搜索接口
          <span>{{this.formPlat.baiduSearchCount}}个</span>
        </div>
      </div>
      <div class="square2 step06 disabled" v-popover:codePop05 v-if="!currentAuth().includes('admin:baidusearch.platform')">
        <div class="top">设置百度搜索接口</div>
        <div class="bottom">
          已设置百度搜索接口
          <span>{{this.formPlat.baiduSearchCount}}个</span>
        </div>
      </div>
      <div class="square step07" v-popover:codePop06>
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="recommendPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">推送审核</div>
        <div class="bottom">
          待推送审核
          <span>{{this.formPlat.recommendCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop0">
        <div class="pop-div">
          <div class="top-font">维护营销模板</div>
          <div class="middle-font">维护平台级的营销模板供店铺创建活动使用</div>
          <div class="bottom-font">
            已有模板
            <span>{{this.formPlat.marketingCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop01">
        <div class="pop-div">
          <div class="top-font">维护关键词包</div>
          <div class="middle-font">维护平台级的关键词模板，店铺进行百度搜索推广时可直接使用平台维护的关键词</div>
          <div class="bottom-font">
            进行已有关键词包中活动
            <span>{{this.formPlat.keywordCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop02">
        <div class="pop-div">
          <div class="top-font">设置推送审核</div>
          <div class="middle-font">维护各个渠道的店铺推送是否需要平台进行人工审核</div>
          <div class="bottom-font">
            已设置审核
            <span>{{this.formPlat.recommendConfig}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop03">
        <div class="pop-div">
          <div class="top-font">设置头条接口</div>
          <div class="middle-font">维护头条推送时的接口数据配置信息</div>
          <div class="bottom-font">
            已设置头条接口
            <span>{{this.formPlat.toutiaoAdCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop04">
        <div class="pop-div">
          <div class="top-font">设置百度信息流接口</div>
          <div class="middle-font">维护百度信息流推送时的接口数据配置信息</div>
          <div class="bottom-font">
            已设置百度信息流接口
            <span>{{this.formPlat.baiduAdCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop05">
        <div class="pop-div">
          <div class="top-font">设置百度搜索接口</div>
          <div class="middle-font">维护百度搜索推送时的接口数据配置信息</div>
          <div class="bottom-font">
            已设置百度搜索接口
            <span>{{this.formPlat.baiduSearchCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop06">
        <div class="pop-div">
          <div class="top-font">推送审核</div>
          <div class="middle-font">对各渠道的推送内容进行审核管理</div>
          <div class="bottom-font">
            待推送审核
            <span>{{this.formPlat.recommendCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import marketing from '@/assets/images/nav/marketing.png';
import marketpt from '@/assets/images/nav/marketpt.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        marketingCount: 0,
        activityCount: 0,
        articleCount: 0,
        promotionCount: 0,
        localMarketingCount: 0,
        recommendCount: 0,
        recommendIsTopCount: 0,
        marketingMemberCount: 0,
        fansNumInt: 0
      },
      formPlat: {
        marketingCount: 0,
        keywordCount: 0,
        recommendCount: 0,
        recommendConfig: 0,
        toutiaoAdCount: 0,
        baiduAdCount: 0,
        baiduSearchCount: 0
      },
      recommendPendingDeal: 0,
      marketing: marketing,
      marketpt: marketpt
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
        .get('/admin/store/navigation/kpi/marketing.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getPlatNavInfo() {
      http
        .get('/admin/store/navigation/kpi/platformMarketing.jhtml', {})
        .then(data => {
          Object.assign(this.formPlat, data);
          this.recommendPendingDeal = data.recommendPendingDeal;
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
.marketing-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 28px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 111px;
      width: 120px;
    }
    .title2 {
      top: 33px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 498px;
      width: 120px;
    }
    .title3 {
      top: 32px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 870px;
      width: 90px;
    }
    .title4 {
      top: 27px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 110px;
      width: 120px;
    }
    .title5 {
      top: 33px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 465px;
      width: 90px;
    }
    .step1 {
      top: 94px;
      left: 80px;
    }
    .step2 {
      top: 225px;
      left: 80px;
    }
    .step3 {
      top: 356px;
      left: 80px;
    }
    .step4 {
      top: 487px;
      left: 80px;
    }
    .step5 {
      top: 619px;
      left: 80px;
    }
    .step6 {
      top: 355px;
      left: 312px;
    }
    .step7 {
      top: 355px;
      left: 474px;
    }
    .step01 {
      top: 80px;
      left: 185px;
    }
    .step02 {
      top: 210px;
      left: 185px;
    }
    .step03 {
      top: 340px;
      left: 185px;
    }
    .step04 {
      top: 470px;
      left: 185px;
    }
    .step05 {
      top: 600px;
      left: 185px;
    }
    .step06 {
      top: 730px;
      left: 185px;
    }
    .step07 {
      top: 335px;
      left: 430px;
    }
    .step8 {
      top: 98px;
      left: 688px;
    }
    .step9 {
      top: 226px;
      left: 688px;
    }
    .step10 {
      top: 358px;
      left: 688px;
    }
    .step11 {
      top: 620px;
      left: 688px;
    }
    .step12 {
      top: 488px;
      left: 688px;
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
