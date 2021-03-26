<template>
  <el-container style="background-color: #f4f4f4;">
    <el-header style="background-color:#040404;height:50px;text-align: center;margin: 0;padding: 0;position: fixed;width: 100%;z-index:1000">
      <span style="color:white;vertical-align: -webkit-baseline-middle;font-size:14px;line-height: 50px;">您可对卡片进行添加/移动/删除等自定义操作</span>
      <div style="float:right;padding:10px">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="cancelCustomize">取消</el-button>
        <el-button size="mini" @click="restoreDefault">恢复默认</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside style="width:200px;margin-right: -20px;margin-top: 50px;background-color: #ffffff;">
        <div style="margin-top:10px;margin-left:20px">
          <div style="height:40px;line-height:40px">
            <span style="font-size:14px;font-weight:bold">隐藏已添加模块</span>
            <el-switch
              v-model="value"
              active-value="1"
              inactive-value="0"
              active-color="#ff7300"
              inactive-color="#d9d9d9"
              style="margin-left: 20px;width:30px"
              @change="hiddenMode"
            ></el-switch>
          </div>
          <div style="height:40px;line-height:40px" class="wddb">
            <span style="font-size:14px;font-weight:bold">我的待办</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.wddb.moduleId==='1'&&this.wddb.displayable===false" @click="wddbAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.wddb.moduleId==='1'&&this.wddb.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="jqfw">
            <span style="font-size:14px;font-weight:bold">近期访问</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.jqfw.moduleId==='2'&&this.jqfw.displayable===false" @click="jqfwAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.jqfw.moduleId==='2'&&this.jqfw.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="zxtj">
            <span style="font-size:14px;font-weight:bold">最新推荐</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.zxtj.moduleId==='3'&&this.zxtj.displayable===false" @click="zxtjAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.zxtj.moduleId==='3'&&this.zxtj.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="lmgl" v-if="this.currentAuth().includes('admin:operatorStatistics.storegroup')">
            <span style="font-size:14px;font-weight:bold">联盟管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.lmgl.moduleId==='4'&&this.lmgl.displayable===false" @click="lmglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.lmgl.moduleId==='4'&&this.lmgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="zndd" v-if="this.currentAuth().includes('admin:smartReception.statistics')">
            <span style="font-size:14px;font-weight:bold">智能到店</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.zndd.moduleId==='5'&&this.zndd.displayable===false" @click="znddAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.zndd.moduleId==='5'&&this.zndd.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="hygl" v-if="this.currentAuth().includes('admin:member.statistics.member')">
            <span style="font-size:14px;font-weight:bold">会员管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.hygl.moduleId==='6'&&this.hygl.displayable===false" @click="hyglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.hygl.moduleId==='6'&&this.hygl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="hyxs" v-if="this.currentAuth().includes('admin:order.statistics.summary')">
            <span style="font-size:14px;font-weight:bold">会员销售</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.hyxs.moduleId==='7'&&this.hyxs.displayable===false" @click="hyxsAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.hyxs.moduleId==='7'&&this.hyxs.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="hykgl" v-if="this.currentAuth().includes('admin:member.statistics.card')">
            <span style="font-size:14px;font-weight:bold">会员卡管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 56px;" v-if="this.hykgl.moduleId==='8'&&this.hykgl.displayable===false" @click="hykglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 56px;" v-if="this.hykgl.moduleId==='8'&&this.hykgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="sqgl" v-if="this.currentAuth().includes('admin:member.statistics.content')">
            <span style="font-size:14px;font-weight:bold">社区管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.sqgl.moduleId==='9'&&this.sqgl.displayable===false" @click="sqglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.sqgl.moduleId==='9'&&this.sqgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="cyhgl" v-if="this.currentAuth().includes('admin:member.statistics.fleet')">
            <span style="font-size:14px;font-weight:bold">车友会管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 56px;" v-if="this.cyhgl.moduleId==='10'&&this.cyhgl.displayable===false" @click="cyhglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 56px;" v-if="this.cyhgl.moduleId==='10'&&this.cyhgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="kffw" v-if="this.currentAuth().includes('admin:accessStatistics.service')">
            <span style="font-size:14px;font-weight:bold">客服服务</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.kffw.moduleId==='11'&&this.kffw.displayable===false" @click="kffwAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.kffw.moduleId==='11'&&this.kffw.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="clfw" v-if="this.currentAuth().includes('admin:operatorStatistics.car')">
            <span style="font-size:14px;font-weight:bold">车辆服务</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.clfw.moduleId==='12'&&this.clfw.displayable===false" @click="clfwAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.clfw.moduleId==='12'&&this.clfw.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="zdgl" v-if="this.currentAuth().includes('admin:terminalStatistics')">
            <span style="font-size:14px;font-weight:bold">终端管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.zdgl.moduleId==='13'&&this.zdgl.displayable===false" @click="zdglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.zdgl.moduleId==='13'&&this.zdgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="yxgl" v-if="this.currentAuth().includes('admin:activityStatistics.market')">
            <span style="font-size:14px;font-weight:bold">营销管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.yxgl.moduleId==='14'&&this.yxgl.displayable===false" @click="yxglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.yxgl.moduleId==='14'&&this.yxgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="qkgl" v-if="this.currentAuth().includes('admin:potentialStatistics')">
            <span style="font-size:14px;font-weight:bold">潜客管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.qkgl.moduleId==='15'&&this.qkgl.displayable===false" @click="qkglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.qkgl.moduleId==='15'&&this.qkgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="xcxs" v-if="this.currentAuth().includes('admin:potential.statistics')">
            <span style="font-size:14px;font-weight:bold">新车销售</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.xcxs.moduleId==='16'&&this.xcxs.displayable===false" @click="xcxsAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.xcxs.moduleId==='16'&&this.xcxs.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="shgl" v-if="this.currentAuth().includes('admin:aftersale.statistics.aftersale')">
            <span style="font-size:14px;font-weight:bold">售后管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.shgl.moduleId==='17'&&this.shgl.displayable===false" @click="shglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.shgl.moduleId==='17'&&this.shgl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="cggl" v-if="this.currentAuth().includes('admin:Statistic.purchase')">
            <span style="font-size:14px;font-weight:bold">采购管理</span>
            <i class="el-icon-plus" size="small" style="margin-left: 70px;" v-if="this.cggl.moduleId==='18'&&this.cggl.displayable===false" @click="cgglAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 70px;" v-if="this.cggl.moduleId==='18'&&this.cggl.displayable===true"></i>
          </div>
          <div style="height:40px;line-height:40px" class="dlsxs" v-if="this.currentAuth().includes('admin:Statistic.sale')">
            <span style="font-size:14px;font-weight:bold">代理商销售</span>
            <i class="el-icon-plus" size="small" style="margin-left: 56px;" v-if="this.dlsxs.moduleId==='19'&&this.dlsxs.displayable===false" @click="dlsxsAdd"></i>
            <i class="el-icon-check" size="small" style="margin-left: 56px;" v-if="this.dlsxs.moduleId==='19'&&this.dlsxs.displayable===true"></i>
          </div>
        </div>
      </el-aside>
      <el-main style="padding:10px !important;margin-top:50px;margin-left:10px;overflow-x:hidden">
        <div class="customize">
          <div class="left_content" v-if="this.wddb.moduleId==='1'&&this.wddb.displayable===true">
            <div class="top_content">
              <div class="title">
                我的待办
                <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="wddbDelete"></i>
              </div>
              <div class="myscroll1 drag-box" id="myscroll1">
                <swiper class="swiper-container" :options="swiperOption" ref="mySwiper" :auto-update="true">
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.sim">
                    <el-badge :value="Number(pendingDealCount.sim)" :max="99" v-if="pendingDealCount.sim && pendingDealCount.sim>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addSim">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-tongxunguanli"></i>
                        </div>
                        <span>SIM卡审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.sim">
                      <div class="icon">
                        <i class="iconfont biz-icon-tongxunguanli"></i>
                      </div>
                      <span>SIM卡审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.device">
                    <el-badge :value="Number(pendingDealCount.device)" :max="99" v-if="pendingDealCount.device && pendingDealCount.device>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addDevice">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-zhongduanguanli"></i>
                        </div>
                        <span>设备审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.device">
                      <div class="icon">
                        <i class="iconfont biz-icon-zhongduanguanli"></i>
                      </div>
                      <span>设备审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.car">
                    <el-badge :value="Number(pendingDealCount.car)" :max="99" v-if="pendingDealCount.car && pendingDealCount.car>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addCar">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-cheliangguanli"></i>
                        </div>
                        <span>车辆审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.car">
                      <div class="icon">
                        <i class="iconfont biz-icon-cheliangguanli"></i>
                      </div>
                      <span>车辆审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.member">
                    <el-badge :value="Number(pendingDealCount.member)" :max="99" v-if="pendingDealCount.member && pendingDealCount.member>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=member">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-huijiguanli"></i>
                        </div>
                        <span>会员审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.member">
                      <div class="icon">
                        <i class="iconfont biz-icon-huijiguanli"></i>
                      </div>
                      <span>会员审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.reply">
                    <el-badge :value="Number(pendingDealCount.reply)" :max="99" v-if="pendingDealCount.reply && pendingDealCount.reply>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=reply">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-kefufuwu"></i>
                        </div>
                        <span>在线应答</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.reply">
                      <div class="icon">
                        <i class="iconfont biz-icon-kefufuwu"></i>
                      </div>
                      <span>在线应答</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.workOrder">
                    '
                    <el-badge :value="Number(pendingDealCount.workOrder)" :max="99" v-if="pendingDealCount.workOrder && pendingDealCount.workOrder>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=workOrder">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-gongdan"></i>
                        </div>
                        <span>工单受理</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.workOrder">
                      <div class="icon">
                        <i class="iconfont biz-icon-gongdan"></i>
                      </div>
                      <span>工单受理</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.potentialResult">
                    <el-badge
                      :value="Number(pendingDealCount.potentialResult)"
                      :max="99"
                      v-if="pendingDealCount.potentialResult && pendingDealCount.potentialResult>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=potentialResult">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-qiankeguanli"></i>
                        </div>
                        <span>战败/签约</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.potentialResult">
                      <div class="icon">
                        <i class="iconfont biz-icon-qiankeguanli"></i>
                      </div>
                      <span>战败/签约</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.rescue">
                    <el-badge :value="Number(pendingDealCount.rescue)" :max="99" v-if="pendingDealCount.rescue && pendingDealCount.rescue>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=rescue">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-hezuojiuyuanjigou"></i>
                        </div>
                        <span>救援请求</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.rescue">
                      <div class="icon">
                        <i class="iconfont biz-icon-hezuojiuyuanjigou"></i>
                      </div>
                      <span>救援请求</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.orderConfirm">
                    <el-badge :value="Number(pendingDealCount.orderConfirm)" :max="99" v-if="pendingDealCount.orderConfirm && pendingDealCount.orderConfirm>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderConfirm">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-chanpin"></i>
                        </div>
                        <span>订单确认</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.orderConfirm">
                      <div class="icon">
                        <i class="iconfont biz-icon-chanpin"></i>
                      </div>
                      <span>订单确认</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.orderExecute">
                    <el-badge :value="Number(pendingDealCount.orderExecute)" :max="99" v-if="pendingDealCount.orderExecute && pendingDealCount.orderExecute>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderExecute">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-chanpin"></i>
                        </div>
                        <div class="number">{{pendingDealCount.orderExecute}}</div>
                        <span>订单服务</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.orderExecute">
                      <div class="icon">
                        <i class="iconfont biz-icon-chanpin"></i>
                      </div>
                      <span>订单服务</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.orderRefund">
                    <el-badge :value="Number(pendingDealCount.orderRefund)" :max="99" v-if="pendingDealCount.orderRefund && pendingDealCount.orderRefund>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderRefund">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-chanpin"></i>
                        </div>
                        <span>订单退款</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.orderRefund">
                      <div class="icon">
                        <i class="iconfont biz-icon-chanpin"></i>
                      </div>
                      <span>订单退款</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.investment">
                    <el-badge :value="Number(pendingDealCount.investment)" :max="99" v-if="pendingDealCount.investment && pendingDealCount.investment>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=investment">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-zhaoshangjiameng"></i>
                        </div>
                        <div class="number">{{pendingDealCount.investment}}</div>
                        <span>招商审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.investment">
                      <div class="icon">
                        <i class="iconfont biz-icon-zhaoshangjiameng"></i>
                      </div>
                      <span>招商审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.reception">
                    <el-badge :value="Number(pendingDealCount.reception)" :max="99" v-if="pendingDealCount.reception && pendingDealCount.reception>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=reception">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-yonghuming"></i>
                        </div>
                        <span>客户接待</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.reception">
                      <div class="icon">
                        <i class="iconfont biz-icon-yonghuming"></i>
                      </div>
                      <span>客户接待</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.potential">
                    <el-badge :value="Number(pendingDealCount.potential)" :max="99" v-if="pendingDealCount.potential && pendingDealCount.potential>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-fuwudingzhi"></i>
                        </div>
                        <span>潜客回访</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.potential">
                      <div class="icon">
                        <i class="iconfont biz-icon-fuwudingzhi"></i>
                      </div>
                      <span>潜客回访</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.idcardcertification">
                    <el-badge
                      :value="Number(pendingDealCount.idcardcertification)"
                      :max="99"
                      v-if="pendingDealCount.idcardcertification && pendingDealCount.idcardcertification>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=idcardcertification">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-yingxiaoguanli"></i>
                        </div>
                        <span>实名认证</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.idcardcertification">
                      <div class="icon">
                        <i class="iconfont biz-icon-yingxiaoguanli"></i>
                      </div>
                      <span>实名认证</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.delivery">
                    <el-badge :value="Number(pendingDealCount.delivery)" :max="99" v-if="pendingDealCount.delivery && pendingDealCount.delivery>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=delivery">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-l-ckgl"></i>
                        </div>
                        <span>出库待办</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.delivery">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-l-ckgl"></i>
                      </div>
                      <span>出库待办</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.stockIn">
                    <el-badge :value="Number(pendingDealCount.stockIn)" :max="99" v-if="pendingDealCount.stockIn && pendingDealCount.stockIn>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=stockIn">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-l-fkgl"></i>
                        </div>
                        <span>入库待办</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.stockIn">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-l-fkgl"></i>
                      </div>
                      <span>入库待办</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.purchaseOrder">
                    <el-badge
                      :value="Number(pendingDealCount.purchaseOrder)"
                      :max="99"
                      v-if="pendingDealCount.purchaseOrder && pendingDealCount.purchaseOrder>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchaseOrder">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-chanpin"></i>
                        </div>
                        <span>采购订单待办</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.purchaseOrder">
                      <div class="icon">
                        <i class="iconfont biz-icon-chanpin"></i>
                      </div>
                      <span>采购订单待办</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.purchase">
                    <el-badge :value="Number(pendingDealCount.purchase)" :max="99" v-if="pendingDealCount.purchase && pendingDealCount.purchase>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchase">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-cgsq"></i>
                        </div>
                        <span>审核提醒</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.purchase">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-cgsq"></i>
                      </div>
                      <span>审核提醒</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.purchaseReturn">
                    <el-badge
                      :value="Number(pendingDealCount.purchaseReturn)"
                      :max="99"
                      v-if="pendingDealCount.purchaseReturn && pendingDealCount.purchaseReturn>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchaseReturn">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-cgthsq"></i>
                        </div>
                        <span>采购退货申请待办</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.purchaseReturn">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-cgthsq"></i>
                      </div>
                      <span>采购退货申请待办</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.invoice">
                    <el-badge :value="Number(pendingDealCount.invoice)" :max="99" v-if="pendingDealCount.invoice && pendingDealCount.invoice>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=invoice">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-clss"></i>
                        </div>
                        <span>补开发票</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.invoice">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-clss"></i>
                      </div>
                      <span>补开发票</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.vehicleLicense">
                    <el-badge
                      :value="Number(pendingDealCount.vehicleLicense)"
                      :max="99"
                      v-if="pendingDealCount.vehicleLicense && pendingDealCount.vehicleLicense>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=vehicleLicense">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-xsz"></i>
                        </div>
                        <span>行驶证认证</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.vehicleLicense">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-xsz"></i>
                      </div>
                      <span>行驶证认证</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.recommendAudit">
                    <el-badge
                      :value="Number(pendingDealCount.recommendAudit)"
                      :max="99"
                      v-if="pendingDealCount.recommendAudit && pendingDealCount.recommendAudit>0"
                    >
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=recommendAudit">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-web-l-sqxx"></i>
                        </div>
                        <span>推送审核</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.recommendAudit">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-web-l-sqxx"></i>
                      </div>
                      <span>推送审核</span>
                    </el-badge>
                  </swiper-slide>
                  <swiper-slide class="swiper-slide" v-if="pendingDealCount.moveCar">
                    <el-badge :value="Number(pendingDealCount.moveCar)" :max="99" v-if="pendingDealCount.moveCar && pendingDealCount.moveCar>0">
                      <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=moveCar">
                        <div class="icon_orange">
                          <i class="iconfont biz-icon-i-sh-car-smnc"></i>
                        </div>
                        <span>挪车码申请</span>
                      </router-link>
                    </el-badge>
                    <el-badge v-else-if="pendingDealCount.moveCar">
                      <div class="icon">
                        <i class="iconfont biz-icon-i-sh-car-smnc"></i>
                      </div>
                      <span>挪车码申请</span>
                    </el-badge>
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                  <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
                  <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
                </swiper>
              </div>
            </div>
            <div class="bottom_content" id="dMessage">
              <div class="daiban" id="daiban">
                <li v-for="(pendingdealMessage,index) in pendingdealMessages" :key="pendingdealMessage.messageId" v-if="index<6">
                  <router-link :to="'/message/message-mgmt?category=pendingRemind&state=1&id=' + pendingdealMessage.messageId">
                    <span class="overflow_ellpise">
                      <span style="color:#ff7300">[{{pendingdealMessage.typeName}}]</span>
                      &nbsp;&nbsp;{{pendingdealMessage.content}}
                    </span>
                    <span class="date">{{pendingdealMessage.sendTime}}</span>
                  </router-link>
                </li>
              </div>
            </div>
          </div>
          <div class="right_content">
            <div style="height:205px;margin-top:-10px;background-color: #ffffff" v-if="this.jqfw.moduleId==='2'&&this.jqfw.displayable===true">
              <div class="title">近期访问</div>
              <div v-if="operationRecordDTOs.length===0" :style="styleObject"></div>
              <div style="font-size:12px;display:flex;flex-wrap:wrap;padding-left:20px">
                <div v-for="(top,index) in operationRecordDTOs" :key="index">
                  <div style="padding:5px">{{top.businessKey.split('?')[0]}}</div>
                </div>
              </div>
              <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;margin: inherit;cursor: pointer;" @click="jqfwDelete"></i>
            </div>
            <div style="height:205px;margin-top:10px;background-color: #ffffff" v-if="this.zxtj.moduleId==='3'&&this.zxtj.displayable===true">
              <div class="title" style="display:flex;justify-content:space-between">
                <div>最新推荐</div>
                <div class="btn" style="font-size: 11px;font-weight: normal;cursor: pointer;margin-right:10px" @click="latestApp">更多</div>
              </div>
              <div style="font-size:12px;display:flex;flex-wrap: wrap;padding-left: 15px;height:150px;overflow: hidden;">
                <div v-for="(business,index) in businessProducts" :key="index" v-if="index<2">
                  <div style="padding:10px;border: 1px solid #f5f5f5;margin:5px;height:120px;min-width:185px;width:145px">
                    <el-button type="text">{{business.businessService.name}}</el-button>
                    <div style="display: -webkit-box !important;overflow: hidden;white-space: normal !important;text-overflow: ellipsis;word-wrap: break-word;-webkit-line-clamp: 3;-webkit-box-orient: vertical;">{{formatContent(business.businessService.description)}}</div>
                  </div>
                </div>
              </div>
              <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="zxtjDelete"></i>
            </div>
          </div>
          <div
            class="column1"
            v-if="this.currentAuth().includes('admin:operatorStatistics.storegroup')&&this.lmgl.moduleId==='4'&&this.lmgl.displayable===true"
          >
            <div style="display: flex;justify-content: space-between;">
              <div class="title">联盟管理</div>
              <div class="btn" @click="operatorStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary1.totalStoreCount}}</span>
                <div class="cont">联盟店铺数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary1.turnover}}</span>
                <div class="cont">本月联盟营业额（万元）</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary1.increaseMember}}</span>
                <div class="cont">当期新增会员数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="lmglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:smartReception.statistics')&&this.zndd.moduleId==='5'&&this.zndd.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">智能到店</div>
              <div class="btn" @click="smartReception">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary2.intelAccessCnt.increase}}</span>
                <div class="cont">到店人数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary2.robotAccessCnt.increase}}</span>
                <div class="cont">接待人数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;margin-top: 70px;" @click="znddDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.group')&&this.hygl.moduleId==='6'&&this.hygl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">会员管理</div>
              <div class="btn" @click="memberStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary3.total}}</span>
                <div class="cont">累计会员数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{Number(summary3.consumeMember)}}</span>
                <div class="cont">当期消费会员数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{Number(summary3.activeMember)}}</span>
                <div class="cont">当期活跃会员数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="hyglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:order.statistics.summary')&&this.hyxs.moduleId==='7'&&this.hyxs.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">会员销售</div>
              <div class="btn" @click="orderStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary4.orderIncrease}}</span>
                <div class="cont">订单数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary4.orderAmountIncrease}}</span>
                <div class="cont">销售额（万元）</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;margin-top: 70px;" @click="hyxsDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.card')&&this.hykgl.moduleId==='8'&&this.hykgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">会员卡管理</div>
              <div class="btn" @click="memberCardStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary5.totalMemberCardTemplates}}</span>
                <div class="cont">会员卡制式数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary5.totalMemberCard}}</span>
                <div class="cont">累计会员卡（张）</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary5.totalBalance}}</span>
                <div class="cont">会员卡余额（万元）</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="hykglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.content')&&this.sqgl.moduleId==='9'&&this.sqgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">社区管理</div>
              <div class="btn" @click="contentStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary6.contentNumCnt}}</span>
                <div class="cont">累计帖子数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary6.contentNumInc}}</span>
                <div class="cont">当期新增帖子数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary6.viewNumIns}}</span>
                <div class="cont">当期阅读数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="sqglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:member.statistics.fleet')&&this.cyhgl.moduleId==='10'&&this.cyhgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">车友会管理</div>
              <div class="btn" @click="fleetStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary7.summary1.memberNumCnt}}</span>
                <div class="cont">累计成员数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary7.summary2.memberNumInc}}</span>
                <div class="cont">当期新增成员数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary7.summary3.activeMemberNumCnt}}</span>
                <div class="cont">当期活跃成员数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="cyhglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:accessStatistics.service')&&this.kffw.moduleId==='11'&&this.kffw.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">客服服务</div>
              <div class="btn" @click="accessStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary8.sessionCnt.increase}}</span>
                <div class="cont">客服会话数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary8.workSheetCnt.increase}}</span>
                <div class="cont">新增工单数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary8.managerScore.increase}}</span>
                <div class="cont">客户满意度</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="kffwDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:operatorStatistics.car')&&this.clfw.moduleId==='12'&&this.clfw.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">车辆服务</div>
              <div class="btn" @click="carStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary9.increase}}</span>
                <div class="cont">新增车辆数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary9.total}}</span>
                <div class="cont">累计车辆数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary9.online}}</span>
                <div class="cont">在线车辆数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="clfwDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:terminalStatistics')&&this.zdgl.moduleId==='13'&&this.zdgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">终端管理</div>
              <div class="btn" @click="terminalStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary10.total}}</span>
                <div class="cont">设备数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary10.bingdCar}}</span>
                <div class="cont">已绑定车辆设备数</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary10.online}}/{{summary10.offline}}</span>
                <div class="cont">在线/离线设备数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="zdglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:activityStatistics.market')&&this.yxgl.moduleId==='14'&&this.yxgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">营销管理</div>
              <div class="btn" @click="activityStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary11.marketingViewNumInc}}</span>
                <div class="cont">阅读量</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary11.activityCrowNumInc}}</span>
                <div class="cont">参与人数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;margin-top: 70px;" @click="yxglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:potentialStatistics')&&this.qkgl.moduleId==='15'&&this.qkgl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">潜客管理</div>
              <div class="btn" @click="potentialStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary12.valid.increase}}</span>
                <div class="cont">新增有效潜客数</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary12.sign.increase}}</span>
                <div class="cont">新增签约数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;margin-top: 70px;" @click="qkglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:potential.statistics')&&this.xcxs.moduleId==='16'&&this.xcxs.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">新车销售</div>
              <div class="btn" @click="newCarStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary13.orderProductNumInc}}</span>
                <div class="cont">销售台次（台）</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary13.orderAmountPaidInc}}</span>
                <div class="cont">销售收入（万元）</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;margin-top: 70px;" @click="xcxsDelete"></i>
          </div>
          <div
            class="column1"
            v-if="this.currentAuth().includes('admin:aftersale.statistics.aftersale')&&this.shgl.moduleId==='17'&&this.shgl.displayable===true"
          >
            <div style="display: flex;justify-content: space-between;">
              <div class="title">售后管理</div>
              <div class="btn" @click="aftersaleStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary14.entryCnt.yValue}}</span>
                <div class="cont">进厂台次（台）</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary14.aftersaleAmount.yValue}}</span>
                <div class="cont">售后产值（万元）</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary14.aftersaleComplaint.yValue}}</span>
                <div class="cont">售后投诉</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="shglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:Statistic.purchase')&&this.cggl.moduleId==='18'&&this.cggl.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">采购管理</div>
              <div class="btn" @click="purchaseStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary15.purchaseOrderNum}}</span>
                <div class="cont">订单数（单）</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary15.purchaseOrderAmount}}</span>
                <div class="cont">订单金额（万元）</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary15.purchaseProductNum}}</span>
                <div class="cont">商品数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="cgglDelete"></i>
          </div>
          <div class="column1" v-if="this.currentAuth().includes('admin:Statistic.sale')&&this.dlsxs.moduleId==='19'&&this.dlsxs.displayable===true">
            <div style="display: flex;justify-content: space-between;">
              <div class="title">代理商销售</div>
              <div class="btn" @click="saleStatistics">更多</div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary16.salesOrderNum}}</span>
                <div class="cont">订单数（单）</div>
              </div>
              <div class="color-primary">
                <span class="font">{{summary16.salesOrderAmount}}</span>
                <div class="cont">订单金额（万元）</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="color-primary">
                <span class="font">{{summary16.salesProductNum}}</span>
                <div class="cont">商品数</div>
              </div>
            </div>
            <i class="el-icon-delete" size="small" style="padding-right:10px;float:right;cursor: pointer;" @click="dlsxsDelete"></i>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import dateTime from '@/utils/dateTime';
import ioService from '@/service/push/io';
import screenService from '@/service/push/smartToShopScreen';
import 'swiper/dist/css/swiper.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'customize',
  data() {
    return {
      pendingDealCount: {},
      messages: [],
      shops: [],
      shopId: this.getUser().shop.id,
      pendingdealMessages: [],
      statistics: {},
      showEditDialog: false,
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      activeName: 'month',
      viewType: 'month',
      businessProducts: [],
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
      arr: [{ indicators: 'memberCnt' }, { indicators: 'memberIns' }, { indicators: 'activeMemberCnt' }],
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
      value: '0',
      swiperOption: {
        slidesPerView: 8,
        slidesPerGroup: 8,
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
    this.home();
    this.queryShop();
    this.getHomeBaseInf();
    this.getRecentVisit();
    this.getLatestApp();
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
  components: {
    Swiper,
    SwiperSlide
  },
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
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('PendingMessage', ['updatePendingMessage']),
    ...mapGetters('Authority', ['currentAuth']),
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
      }
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
    latestApp() {
      this.$router.replace({ path: '/union/service-mgmt/subscribe' });
    },
    cancelCustomize() {
      this.$router.replace({ path: '/' });
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
        .finally(data => {});
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
          this.operationRecordDTOs = data.data.operationRecordDTOs;
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
    wddbAdd() {
      this.wddb.displayable = true;
    },
    jqfwAdd() {
      this.jqfw.displayable = true;
    },
    zxtjAdd() {
      this.zxtj.displayable = true;
    },
    lmglAdd() {
      this.lmgl.displayable = true;
    },
    znddAdd() {
      this.zndd.displayable = true;
    },
    hyglAdd() {
      this.hygl.displayable = true;
    },
    hyxsAdd() {
      this.hyxs.displayable = true;
    },
    hykglAdd() {
      this.hykgl.displayable = true;
    },
    sqglAdd() {
      this.sqgl.displayable = true;
    },
    cyhglAdd() {
      this.cyhgl.displayable = true;
    },
    zdglAdd() {
      this.zdgl.displayable = true;
    },
    kffwAdd() {
      this.kffw.displayable = true;
    },
    clfwAdd() {
      this.clfw.displayable = true;
    },
    yxglAdd() {
      this.yxgl.displayable = true;
    },
    qkglAdd() {
      this.qkgl.displayable = true;
    },
    xcxsAdd() {
      this.xcxs.displayable = true;
    },
    shglAdd() {
      this.shgl.displayable = true;
    },
    cgglAdd() {
      this.cggl.displayable = true;
    },
    dlsxsAdd() {
      this.dlsxs.displayable = true;
    },
    wddbDelete() {
      this.wddb.displayable = false;
    },
    jqfwDelete() {
      this.jqfw.displayable = false;
    },
    zxtjDelete() {
      this.zxtj.displayable = false;
    },
    lmglDelete() {
      this.lmgl.displayable = false;
    },
    znddDelete() {
      this.zndd.displayable = false;
    },
    hyglDelete() {
      this.hygl.displayable = false;
    },
    hyxsDelete() {
      this.hyxs.displayable = false;
    },
    hykglDelete() {
      this.hykgl.displayable = false;
    },
    sqglDelete() {
      this.sqgl.displayable = false;
    },
    cyhglDelete() {
      this.cyhgl.displayable = false;
    },
    zdglDelete() {
      this.zdgl.displayable = false;
    },
    kffwDelete() {
      this.kffw.displayable = false;
    },
    clfwDelete() {
      this.clfw.displayable = false;
    },
    yxglDelete() {
      this.yxgl.displayable = false;
    },
    qkglDelete() {
      this.qkgl.displayable = false;
    },
    xcxsDelete() {
      this.xcxs.displayable = false;
    },
    shglDelete() {
      this.shgl.displayable = false;
    },
    cgglDelete() {
      this.cggl.displayable = false;
    },
    dlsxsDelete() {
      this.dlsxs.displayable = false;
    },
    save() {
      this.loading = true;
      this.moduleDisplayStateDatas.push(this.wddb, this.jqfw, this.zxtj);
      if (this.currentAuth().includes('admin:operatorStatistics.storegroup')) {
        this.moduleDisplayStateDatas.push(this.lmgl);
      }
      if (this.currentAuth().includes('admin:smartReception.statistics')) {
        this.moduleDisplayStateDatas.push(this.zndd);
      }
      if (this.currentAuth().includes('admin:member.statistics.group')) {
        this.moduleDisplayStateDatas.push(this.hygl);
      }
      if (this.currentAuth().includes('admin:order.statistics.summary')) {
        this.moduleDisplayStateDatas.push(this.hyxs);
      }
      if (this.currentAuth().includes('admin:member.statistics.card')) {
        this.moduleDisplayStateDatas.push(this.hykgl);
      }
      if (this.currentAuth().includes('admin:member.statistics.content')) {
        this.moduleDisplayStateDatas.push(this.sqgl);
      }
      if (this.currentAuth().includes('admin:member.statistics.fleet')) {
        this.moduleDisplayStateDatas.push(this.cyhgl);
      }
      if (this.currentAuth().includes('admin:accessStatistics.service')) {
        this.moduleDisplayStateDatas.push(this.kffw);
      }
      if (this.currentAuth().includes('admin:operatorStatistics.car')) {
        this.moduleDisplayStateDatas.push(this.clfw);
      }
      if (this.currentAuth().includes('admin:terminalStatistics')) {
        this.moduleDisplayStateDatas.push(this.zdgl);
      }
      if (this.currentAuth().includes('admin:activityStatistics.market')) {
        this.moduleDisplayStateDatas.push(this.yxgl);
      }
      if (this.currentAuth().includes('admin:potentialStatistics')) {
        this.moduleDisplayStateDatas.push(this.qkgl);
      }
      if (this.currentAuth().includes('admin:potential.statistics')) {
        this.moduleDisplayStateDatas.push(this.xcxs);
      }
      if (this.currentAuth().includes('admin:aftersale.statistics.aftersale')) {
        this.moduleDisplayStateDatas.push(this.shgl);
      }
      if (this.currentAuth().includes('admin:Statistic.purchase')) {
        this.moduleDisplayStateDatas.push(this.cggl);
      }
      if (this.currentAuth().includes('admin:Statistic.sale')) {
        this.moduleDisplayStateDatas.push(this.dlsxs);
      }
      let params = {
        userId: this.getUser().id,
        moduleType: '1',
        moduleDisplayStateDatas: this.moduleDisplayStateDatas
      };
      http
        .post('/admin/exhibition/web/coustomModuleLayout/list.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$router.replace({ path: '/' });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
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
          this.moduleMessage = data.data.moduleDisplayStateDatas;
          if (this.moduleMessage.length > 0) {
            for (const iterator of this.moduleMessage) {
              if (iterator.moduleId === '1') {
                this.wddb = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '2') {
                this.jqfw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '3') {
                this.zxtj = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '4') {
                this.lmgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '5') {
                this.zndd = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '6') {
                this.hygl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '7') {
                this.hyxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '8') {
                this.hykgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '9') {
                this.sqgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '10') {
                this.cyhgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '11') {
                this.kffw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '12') {
                this.clfw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '13') {
                this.zdgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '14') {
                this.yxgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '15') {
                this.qkgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '16') {
                this.xcxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '17') {
                this.shgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '18') {
                this.cggl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '19') {
                this.dlsxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
            }
          } else {
            for (const iterator of this.moduleMessageAll) {
              if (iterator.moduleId === '1') {
                this.wddb = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '2') {
                this.jqfw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '3') {
                this.zxtj = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '4') {
                this.lmgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '5') {
                this.zndd = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '6') {
                this.hygl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '7') {
                this.hyxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '8') {
                this.hykgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '9') {
                this.sqgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '10') {
                this.cyhgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '11') {
                this.kffw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '12') {
                this.clfw = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '13') {
                this.zdgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '14') {
                this.yxgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '15') {
                this.qkgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '16') {
                this.xcxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '17') {
                this.shgl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '18') {
                this.cggl = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
              if (iterator.moduleId === '19') {
                this.dlsxs = {
                  userId: iterator.userId,
                  moduleId: iterator.moduleId,
                  moduleType: iterator.moduleType,
                  displayable: iterator.displayable
                };
              }
            }
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
    // 恢复默认保存（恢复默认现为get接口返回数据，保存后仍为get接口返回数据，个人认为不需要保存）
    // restoreDefaultSave() {
    //   let params = {
    //     userId: this.getUser().id,
    //     moduleType: '1',
    //     moduleDisplayStateDatas: this.moduleMessage
    //   };
    //   http
    //     .post('/admin/exhibition/web/coustomModuleLayout/list.jhtml', params)
    //     .then(data => {
    //       this.loading = false;
    //       this.$message.success('操作成功');
    //     })
    //     .catch(ErrorData => {
    //       this.$message.warning(ErrorData.errorMessage);
    //     });
    // },
    restoreDefault() {
      this.getHomeBaseInf();
      // this.restoreDefaultSave();
    },
    hiddenMode() {
      if (this.value === '1') {
        if (this.wddb.displayable === true) {
          document.getElementsByClassName('wddb')[0].style.display = 'none';
        }
        if (this.jqfw.displayable === true) {
          document.getElementsByClassName('jqfw')[0].style.display = 'none';
        }
        if (this.zxtj.displayable === true) {
          document.getElementsByClassName('zxtj')[0].style.display = 'none';
        }
        if (this.lmgl.displayable === true) {
          document.getElementsByClassName('lmgl')[0].style.display = 'none';
        }
        if (this.zndd.displayable === true) {
          document.getElementsByClassName('zndd')[0].style.display = 'none';
        }
        if (this.hygl.displayable === true) {
          document.getElementsByClassName('hygl')[0].style.display = 'none';
        }
        if (this.hyxs.displayable === true) {
          document.getElementsByClassName('hyxs')[0].style.display = 'none';
        }
        if (this.hykgl.displayable === true) {
          document.getElementsByClassName('hykgl')[0].style.display = 'none';
        }
        if (this.sqgl.displayable === true) {
          document.getElementsByClassName('sqgl')[0].style.display = 'none';
        }
        if (this.cyhgl.displayable === true) {
          document.getElementsByClassName('cyhgl')[0].style.display = 'none';
        }
        if (this.kffw.displayable === true) {
          document.getElementsByClassName('kffw')[0].style.display = 'none';
        }
        if (this.clfw.displayable === true) {
          document.getElementsByClassName('clfw')[0].style.display = 'none';
        }
        if (this.zdgl.displayable === true) {
          document.getElementsByClassName('zdgl')[0].style.display = 'none';
        }
        if (this.yxgl.displayable === true) {
          document.getElementsByClassName('yxgl')[0].style.display = 'none';
        }
        if (this.qkgl.displayable === true) {
          document.getElementsByClassName('qkgl')[0].style.display = 'none';
        }
        if (this.xcxs.displayable === true) {
          document.getElementsByClassName('xcxs')[0].style.display = 'none';
        }
        if (this.shgl.displayable === true) {
          document.getElementsByClassName('shgl')[0].style.display = 'none';
        }
        if (this.cggl.displayable === true) {
          document.getElementsByClassName('cggl')[0].style.display = 'none';
        }
        if (this.dlsxs.displayable === true) {
          document.getElementsByClassName('dlsxs')[0].style.display = 'none';
        }
      } else {
        if (this.wddb.displayable === true) {
          document.getElementsByClassName('wddb')[0].style.display = 'block';
        }
        if (this.jqfw.displayable === true) {
          document.getElementsByClassName('jqfw')[0].style.display = 'block';
        }
        if (this.zxtj.displayable === true) {
          document.getElementsByClassName('zxtj')[0].style.display = 'block';
        }
        if (this.lmgl.displayable === true) {
          document.getElementsByClassName('lmgl')[0].style.display = 'block';
        }
        if (this.zndd.displayable === true) {
          document.getElementsByClassName('zndd')[0].style.display = 'block';
        }
        if (this.hygl.displayable === true) {
          document.getElementsByClassName('hygl')[0].style.display = 'block';
        }
        if (this.hyxs.displayable === true) {
          document.getElementsByClassName('hyxs')[0].style.display = 'block';
        }
        if (this.hykgl.displayable === true) {
          document.getElementsByClassName('hykgl')[0].style.display = 'block';
        }
        if (this.sqgl.displayable === true) {
          document.getElementsByClassName('sqgl')[0].style.display = 'block';
        }
        if (this.cyhgl.displayable === true) {
          document.getElementsByClassName('cyhgl')[0].style.display = 'block';
        }
        if (this.kffw.displayable === true) {
          document.getElementsByClassName('kffw')[0].style.display = 'block';
        }
        if (this.clfw.displayable === true) {
          document.getElementsByClassName('clfw')[0].style.display = 'block';
        }
        if (this.zdgl.displayable === true) {
          document.getElementsByClassName('zdgl')[0].style.display = 'block';
        }
        if (this.yxgl.displayable === true) {
          document.getElementsByClassName('yxgl')[0].style.display = 'block';
        }
        if (this.qkgl.displayable === true) {
          document.getElementsByClassName('qkgl')[0].style.display = 'block';
        }
        if (this.xcxs.displayable === true) {
          document.getElementsByClassName('xcxs')[0].style.display = 'block';
        }
        if (this.shgl.displayable === true) {
          document.getElementsByClassName('shgl')[0].style.display = 'block';
        }
        if (this.cggl.displayable === true) {
          document.getElementsByClassName('cggl')[0].style.display = 'block';
        }
        if (this.dlsxs.displayable === true) {
          document.getElementsByClassName('dlsxs')[0].style.display = 'block';
        }
      }
    }
  }
};
</script>
<style lang="scss">
.customize {
  width: 100%;
  margin-top: -10px;
  .left_content {
    background-color: #ffffff;
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
    width: 65.6%;
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
        margin-left: 20px;
        margin-top: 20px;
        padding-left: 5px;
        // height: 35px;
        line-height: 25px;
        color: #000;
        font-weight: bold;
        font-size: 14px;
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
    width: 32%;
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
  .swiper-button-prev,
  .swiper-button-next {
    background-size: 20px 20px;
  }
  .my-bullet-active {
    background: #ff6600;
    opacity: 3;
    padding: 0px !important;
  }
  .swiper-pagination-fraction,
  .swiper-pagination-custom,
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
      margin-left: 10px;
      margin-top: 20px;
      padding-left: 5px;
      line-height: 25px;
      color: #000;
      font-weight: bold;
      font-size: 14px;
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
      .color-primary {
        margin-left: 10px;
        padding: 10px 0px 10px 5px;
        width: 170px;
        .font {
          color: #ff7300;
          padding-left: 20px;
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
