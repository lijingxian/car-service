<template>
  <div class="service-mgmt-nav">
    <div class="image">
      <img :src="kf" style="width:915px"/>
      <!-- <div class="title1">售前客服</div>
      <div class="title2">售中售后</div>
      <div class="title3">数据洞察</div> -->
      <div class="square2 step1" v-popover:codePop1 @click="link('/service/service-mgmt/konwledge-base')" v-if="currentAuth().includes('admin:knowledgeBase')">
        <div class="top">设置自动回复</div>
        <div class="bottom">
          已设置自动回复
          <span>{{this.form.autoCount}}个</span>
        </div>
      </div>
      <div class="square2 step1 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:knowledgeBase')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置自动回复</div>
        <div class="bottom">
          已设置自动回复
          <span>{{this.form.autoCount}}个</span>
        </div>
      </div>
      <div class="square2 step2" v-popover:codePop2 @click="link('/service/service-mgmt/member')" v-if="currentAuth().includes('admin:customerServiceMember')">
        <div class="top">管理客服人员</div>
        <div class="bottom">
          已有客服人员
          <span>{{this.form.memberCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:customerServiceMember')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理客服人员</div>
        <div class="bottom">
          已有客服人员
          <span>{{this.form.memberCount}}个</span>
        </div>
      </div>
      <div class="square2 step3" v-popover:codePop3 @click="link('/service/service-mgmt/group')" v-if="currentAuth().includes('admin:group')">
        <div class="top">管理客服群组</div>
        <div class="bottom">
          已有客服群组
          <span>{{this.form.groupCount}}个</span>
        </div>
      </div>
      <div class="square2 step3 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:group')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理客服群组</div>
        <div class="bottom">
          已有客服群组
          <span>{{this.form.groupCount}}个</span>
        </div>
      </div>
      <div class="square step4" v-popover:codePop4 @click="link('/service/service-mgmt/online-response')" v-if="currentAuth().includes('admin:onlineReply')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="onLinePendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">在线应答</div>
        <div class="bottom">
          待接入客户
          <span>{{this.form.onLineCount}}个</span>
        </div>
      </div>
      <div class="square step4 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:onlineReply')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="onLinePendingDeal===1"></i>
        <div class="top">在线应答</div>
        <div class="bottom">
          待接入客户
          <span>{{this.form.onLineCount}}个</span>
        </div>
      </div>
      <div class="square1 step5" v-popover:codePop5 @click="link('/service/service-mgmt/quality')" v-if="currentAuth().includes('admin:qualitySampling')">
        <div class="top">会话质检</div>
        <div class="bottom">
          已评分会话
          <span>{{this.form.dialogueCount}}个</span>
        </div>
      </div>
      <div class="square1 step5 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:qualitySampling')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">会话质检</div>
        <div class="bottom">
          已评分会话
          <span>{{this.form.dialogueCount}}个</span>
        </div>
      </div>
      <div class="square2 step6" v-popover:codePop6 @click="link('/service/service-mgmt/black-list')" v-if="currentAuth().includes('admin:blacklistCheck')">
        <div class="top">黑名单</div>
        <div class="bottom">
          黑名单用户
          <span>{{this.form.blackCount}}个</span>
        </div>
      </div>
      <div class="square2 step6 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:blacklistCheck')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">黑名单</div>
        <div class="bottom">
          黑名单用户
          <span>{{this.form.blackCount}}个</span>
        </div>
      </div>
      <div class="square1 step7" v-popover:codePop7 @click="link('/after-sale/appointment')" v-if="currentAuth().includes('admin:aftersale.appointment')">
        <div class="top">预约确认</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.appointmentCount}}个</span>
        </div>
      </div>
      <div class="square1 step7 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:aftersale.appointment')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">预约确认</div>
        <div class="bottom">
          今日新增记录
          <span>{{this.form.appointmentCount}}个</span>
        </div>
      </div>
      <div class="square1 step8" v-popover:codePop8 @click="link('/service/worksheet?state=0')" v-if="currentAuth().includes('admin:customerServiceScheduling')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="untreatedPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">处理工单</div>
        <div class="bottom">
          待处理工单数
          <span>{{this.form.untreatedCount}}个</span>
        </div>
      </div>
      <div class="square1 step8 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:customerServiceScheduling')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="untreatedPendingDeal===1"></i>
        <div class="top">处理工单</div>
        <div class="bottom">
          待处理工单数
          <span>{{this.form.untreatedCount}}个</span>
        </div>
      </div>
      <div class="square1 step9" v-popover:codePop9 @click="link('/operating/finance/refund?state=0')" v-if="currentAuth().includes('admin:refunds')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="afterSalesPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">售后退款</div>
        <div class="bottom">
          待处理售后
          <span>{{this.form.afterSalesCount}}个</span>
        </div>
      </div>
      <div class="square1 step9 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:refunds')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="afterSalesPendingDeal===1"></i>
        <div class="top">售后退款</div>
        <div class="bottom">
          待处理售后
          <span>{{this.form.afterSalesCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step10"
        v-popover:codePop10
        @click="link('/service/statistics-analysis/generalViewAnalysis')"
        v-if="currentAuth().includes('admin:accessStatistics.service')"
      >
        <div class="top">客服分析</div>
        <div class="bottom">
          已处理会话
          <span>{{this.form.csAnalysis}}个</span>
        </div>
      </div>
      <div class="square1 step10 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:accessStatistics.service')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">客服分析</div>
        <div class="bottom">
          已处理会话
          <span>{{this.form.csAnalysis}}个</span>
        </div>
      </div>
      <div class="square2 step11" v-popover:codePop11 @click="link('/service/statistics-analysis/report')" v-if="currentAuth().includes('admin:statistics.mouthreport.customerservice')">
        <div class="top">客服月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:statistics.mouthreport.customerservice')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">客服月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">设置自动回复</div>
          <div class="middle-font">设置问题库，智能答疑</div>
          <div class="bottom-font">
            已设置自动回复
            <span>{{this.form.autoCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">管理客服人员</div>
          <div class="middle-font">新增/维护客服人员基本信息</div>
          <div class="bottom-font">
            已维护客服人员
            <span>{{this.form.memberCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">管理客服群组</div>
          <div class="middle-font">创建/维护客服群组，设置群组人员</div>
          <div class="bottom-font">
            已有客服群组
            <span>{{this.form.groupCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">在线应答</div>
          <div class="middle-font">在线答复客户咨询，解答客户疑惑，促进订单成交；</div>
          <div class="bottom-font">
            待接入客户
            <span>{{this.form.onLineCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">会话质检</div>
          <div class="middle-font">检查客服工作情况，给会话打分</div>
          <div class="bottom-font">
            已评分会话
            <span>{{this.form.dialogueCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">黑名单</div>
          <div class="middle-font">恶意、非法访问用户管理</div>
          <div class="bottom-font">
            黑名单用户
            <span>{{this.form.blackCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">预约确认</div>
          <div class="middle-font">管理车辆预约维保记录</div>
          <div class="bottom-font">
            今日新增记录
            <span>{{this.form.appointmentCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">处理工单</div>
          <div class="middle-font">创建、处理工单，如需他人处理，可转交</div>
          <div class="bottom-font">
            待处理工单数
            <span>{{this.form.untreatedCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">售后退款</div>
          <div class="middle-font">订单售后退款/退货处理</div>
          <div class="bottom-font">
            待处理售后
            <span>{{this.form.afterSalesCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">客服分析</div>
          <div class="middle-font">通过数据分析客服工作量和工作质量</div>
          <div class="bottom-font">
            已处理会话
            <span>{{this.form.csAnalysis}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">客服月报</div>
          <div class="middle-font">客服月度经营报告</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import kf from '@/assets/images/nav/kf.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        autoCount: 0,
        memberCount: 0,
        groupCount: 0,
        onLineCount: 0,
        dialogueCount: 0,
        blackCount: 0,
        appointmentCount: 0,
        untreatedCount: 0,
        afterSalesCount: 0,
        csAnalysis: 0
      },
      onLinePendingDeal: 0,
      untreatedPendingDeal: 0,
      afterSalesPendingDeal: 0,
      kf: kf
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
        .get('/admin/store/navigation/kpi/service.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.onLinePendingDeal = data.onLinePendingDeal;
          this.untreatedPendingDeal = data.untreatedPendingDeal;
          this.afterSalesPendingDeal = data.afterSalesPendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    this.getNavInfo();
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
.service-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 29px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 155px;
      width: 90px;
    }
    .title2 {
      top: 28px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 572px;
      width: 90px;
    }
    .title3 {
      top: 28px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1050px;
      width: 90px;
    }
    .step1 {
      top: 100px;
      left: 0px;
    }
    .step2 {
      top: 230px;
      left: 0px;
    }
    .step3 {
      top: 378px;
      left: 0px;
    }
    .step4 {
      top: 227px;
      left: 245px;
    }
    .step5 {
      top: 436px;
      left: 160px;
    }
    .step6 {
      top: 436px;
      left: 322px;
    }
    .step7 {
      top: 140px;
      left: 446px;
    }
    .step8 {
      top: 315px;
      left: 446px;
    }
    .step9 {
      top: 140px;
      left: 630px;
    }
    .step10 {
      top: 315px;
      left: 765px;
    }
    .step11 {
      top: 438px;
      left: 765px;
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
