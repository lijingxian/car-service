<template>
  <div class="home" ref="home">
    <div class="left_content" v-if="this.wddb.moduleId==='1'&&this.wddb.displayable===true">
      <div class="top_content-top">
        <div class="service" @click="currentAuth().includes('admin:normalService')?routerLink('/operating/product/service?isAdd=true','/operating/product'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-l-wxby"></i>
          <span>工单新建</span>
        </div>
        <div class="service" aria-autocomplete="" @click="currentAuth().includes('admin:memberCard')?routerLink('/member/member-card/member-card/true','/member/member-card'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-l-hjgl"></i>
          <span>会员体系</span>
        </div>
        <div class="service" @click="currentAuth().includes('admin:export')?routerLink('/invoicing/store-house-mgmt/depot-out-mgmt','/invoicing/store-house-mgmt'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-l-ckgl"></i>
          <span>仓库盘点</span>
        </div>
        <div class="service" @click="currentAuth().includes('admin:finance.reconciliation')?routerLink('/finance/supplier-check-acount','/finance/supplier-check-acount'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-t-cw"></i>
          <span>财务收支</span>
        </div>
      </div>
      <div class="top_content-top">
        <div class="service-t" @click="currentAuth().includes('admin:carProductOrder.sale')?routerLink('/sales/product/product?isAdd=true','/sales/product'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-l-gd"></i>
          <span>销售新建</span>
        </div>
        <div class="service-t" @click="currentAuth().includes('admin:potential')?routerLink('/sales/potential/potential','/sales/potential'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-qiankeguanli"></i>
          <span>潜客跟踪</span>
        </div>
        <div class="service-t" @click="currentAuth().includes('admin:activity')?routerLink('/marketing/marketing-mgmt/activity','/marketing/marketing-mgmt'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-t-yx"></i>
          <span>营销活动</span>
        </div>
        <div class="service-t" @click="currentAuth().includes('admin:testAppointment')?routerLink('/operating/product/ride','/operating/product'):$message.warning('您无操作权限，请管理员增加权限')">
          <i class="iconfont biz-icon-i-web-sjgl"></i>
          <span>体验服务</span>
        </div>
      </div>
      <div class="top_content">
        <div class="title">工作看板</div>
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
            <swiper-slide class="swiper-slide" v-if="pendingDealCount.workOrder">'
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
              <el-badge :value="Number(pendingDealCount.potentialResult)" :max="99" v-if="pendingDealCount.potentialResult && pendingDealCount.potentialResult>0">
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
              <el-badge :value="Number(pendingDealCount.idcardcertification)" :max="99" v-if="pendingDealCount.idcardcertification && pendingDealCount.idcardcertification>0">
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
              <el-badge :value="Number(pendingDealCount.purchaseOrder)" :max="99" v-if="pendingDealCount.purchaseOrder && pendingDealCount.purchaseOrder>0">
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
              <el-badge :value="Number(pendingDealCount.purchaseReturn)" :max="99" v-if="pendingDealCount.purchaseReturn && pendingDealCount.purchaseReturn>0">
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
              <el-badge :value="Number(pendingDealCount.vehicleLicense)" :max="99" v-if="pendingDealCount.vehicleLicense && pendingDealCount.vehicleLicense>0">
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
              <el-badge :value="Number(pendingDealCount.recommendAudit)" :max="99" v-if="pendingDealCount.recommendAudit && pendingDealCount.recommendAudit>0">
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
                <span
                  style="color:#ff7300">[{{pendingdealMessage.typeName}}]</span>&nbsp;&nbsp;{{pendingdealMessage.content}}</span>
              <span>{{pendingdealMessage.verifyState==='0'?'待处理':'已处理'}}</span>
              <span class="date">{{pendingdealMessage.sendTime}}</span>
            </router-link>
          </li>
        </div>
      </div>
    </div>
    <div class="right_content">
      <!-- <el-button type="primary" icon="el-icon-edit" @click="openDialog" style="font-size:11px;float:right;padding:5px">自定义</el-button> -->
      <div style="height:228px;margin-top:-10px;background-color: #ffffff" v-if="this.jqfw.moduleId==='2'&&this.jqfw.displayable===true">
        <div class="title">近期访问</div>
        <div class="visit">
          <div v-for="(top,index) in operationRecordDTOs" :key="index">
            <div class="content"><i :class="'iconfont'+ ' ' + top.businessKey.split('?')[1]"></i><div @click="routerLink(top.businessKey.split('?')[2])">{{top.businessKey.split('?')[0]}}</div></div>
          </div>
        </div>
        <div v-if="operationRecordDTOs.length===0" :style="styleObject"></div>
      </div>
      <div style="height:205px;margin-top:10px;background-color: #ffffff" v-if="this.zxtj.moduleId==='3'&&this.zxtj.displayable===true">
        <div class="title" style="display:flex;justify-content:space-between">
          <div>最新推荐&nbsp;&nbsp;<el-button type="text" size="mini" @click="replaceContent">换一批<i class="el-icon-refresh-right"></i></el-button></div>
          <div class="btn" style="font-size: 11px;font-weight: normal;cursor: pointer;margin-right:10px" @click="latestApp(businessProducts.length>0?businessProducts[0]:{})">更多</div>
        </div>
        <div style="font-size:12px;display:flex;flex-wrap: wrap;padding-left: 15px;height:160px;overflow:hidden;align-items:center;justify-content:space-around">
          <div v-for="(business,index) in businessProducts" :key="index" v-if="index<2">
            <div style="padding:10px;border: 1px solid #f5f5f5;margin:5px;height:120px;min-width:185px;width:185px" @click="latestApp(business)">
              <el-button type="text">{{business.businessService.name}}</el-button>
              <div style="display: -webkit-box !important;overflow: hidden;white-space: normal !important;text-overflow: ellipsis;word-wrap: break-word;-webkit-line-clamp: 3;-webkit-box-orient: vertical;">{{formatContent(business.businessService.description)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="yykb" v-if="this.zxtj.moduleId==='3'&&this.zxtj.displayable===true">
        <div class="title" style="display:flex;justify-content:space-between">
          <div>营业快报</div>
          <div class="btn more" @click="routerLink('/morestatic')">更多</div>
        </div>
        <div class="content">
          <div>今日收入：<span>{{summary1.orderAmountInc}}</span></div>
          <div>今日新增会员：<span>{{summary1.memberInc}}</span></div>
          <div>本月收入：<span>{{summary1.orderAmountMonthInc}}</span></div>
          <div>店铺会员总数：<span>{{summary1.memberCnt}}</span></div>
        </div>
      </div>
    </div>
      <el-dialog title="免费试用" :visible.sync="dialogVisibleFree">
        <div>
          <img :src="image" @click="linkTo"/>
        </div>
      </el-dialog>
      <el-dialog title="服务到期提醒" :visible.sync="dialogVisible" custom-class="service-dialog">
        <div>{{this.getUser().realName}}您好</div>
        <div>您的部分服务即将到期，请及时订购</div>
        <div class="service-card-view" ref="divContent">
          <el-card class="order-card" v-for="item in dataList" :key="item.id">
            <div class="title">{{ item.businessService.name }}</div>
            <el-tag size="small" :style="tagStyle(item.businessService.subscribeState)">{{ item.businessService.subscribeState |
              filterState }}</el-tag>
            <div class="price color-orange">￥{{ item.price }}</div>
            <div class="dead-line" v-show="item.businessService.subscribeState==='1'&&item.businessServiceType!=='sms'"><span class="item-name">有效期截止:</span> {{ item.businessService.endDate }}</div>
            <div class="description" style="min-height:74px" v-html="formatDescription(item.businessService.description || '')">
            </div>
            <div align="center"><el-button type="primary" size="mini" @click.stop="toLink(item)">去续费</el-button></div>
          </el-card>
        </div>
        <div>您可能感兴趣的服务</div>
        <div class="service-card-view" ref="divContent">
          <el-card class="order-card" v-for="item in dataListLe" :key="item.id">
            <div class="title">{{ item.businessService.name }}</div>
            <el-tag size="small" :style="tagStyle(item.businessService.subscribeState)">{{ item.businessService.subscribeState |
              filterState }}</el-tag>
            <div class="price color-orange">￥{{ item.price }}</div>
            <div class="dead-line" v-show="item.businessService.subscribeState==='1'&&item.businessServiceType!=='sms'"><span class="item-name">有效期截止:</span> {{ item.businessService.endDate }}</div>
            <div class="description" style="min-height:74px" v-html="formatDescription(item.businessService.description || '')">
            </div>
            <div align="center"><el-button type="primary" size="mini" @click.stop="toLink(item)">去订购</el-button></div>
          </el-card>
        </div>
      </el-dialog>
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
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
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
      flag: true,
      loaded: true,
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
      t: '',
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
    this.home();
    this.queryShop();
    this.getHomeBaseInf();
    this.getRecentVisit();
    this.getLatestApp();
    this.getUnionStatistics();
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
  mounted() {
    if (this.$route.query.isFree) {
      this.dialogVisibleFree = true;
    }
    if (!this.$route.query.registerStore) {
      this.expireList();
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('PendingMessage', ['updatePendingMessage']),
    ...mapGetters('Authority', ['currentAuth']),
    ...mapMutations('Menu', ['updateRouter']),
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
    routerLink(url, toLInk) {
      console.log(url);
      this.updateRouter({ router: toLInk });
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
          this.loading = false;
          if (this.dataList && this.dataList.length > 0) {
            this.dialogVisible = true;
          }
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
    latestApp(row) {
      this.$router.push({ path: '/union/service-mgmt/subscribe?id=' + row.id });
    },
    getUnionStatistics() {
      http
        .get('/admin/ecommerce/kpi/summary/businessExpress.jhtml', {})
        .then(data => {
          this.summary1 = data.indicators;
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
          if (this.operationRecordDTOs.length > 6) {
            this.operationRecordDTOs = this.operationRecordDTOs.slice(0, 6);
          }
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
.home {
  width: 100%;
  // overflow: auto;
  overflow-x: hidden;
  padding-top: 20px;
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
    width: 60.5%;
    float: left;
    // height: 420px;
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
    .top_content-top {
      height: 120px;
      display: flex;
      justify-content: space-around;
      background: #f7f7f7;
      .service {
        width: 175px;
        height: 108px;
        background: #ff7300;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        .iconfont {
        padding-top: 20px;
        display: block;
        font-size: 60px;
        color: #ffffff;
        }
        span {
          font-weight: bold;
          color: #ffffff
        }
      }
      .service-t {
        width: 175px;
        height: 108px;
        cursor: pointer;
        background: #A2A1A1;
        text-align: center;
        line-height: 40px;
        .iconfont {
        padding-top: 20px;
        display: block;
        font-size: 60px;
        color: #ffffff;
        }
        span {
          font-weight: bold;
          color: #ffffff
        }
      }
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
    width: 37.4%;
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
    .visit {
      font-size:12px;display:flex;flex-wrap:wrap;padding-left: 20px;
      .content {
        padding: 5px;
        display: flex;
        width: 17vw;
        i {
          font-size: 42px;
          color: #ff7300;
        }
        div {
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          color: #ff7300;
          height: 45px;
          line-height: 45px;
        }
      }
    }
    .yykb {
      height:205px;margin-top:10px;background-color: #ffffff;
      .more {
        font-size: 11px;font-weight: normal;cursor: pointer;margin-right:10px
      }
      .content {
        font-size:12px;display:flex;flex-wrap: wrap;padding-left: 15px;height:160px;overflow:hidden;align-items:center;justify-content:space-around;
        div {
          width: 15vw;
          span {
            color: #ff7300;
            font-size: 16px;
          }
        }
      }
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
        margin-left: 20px;
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
        flex-wrap: wrap;
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
