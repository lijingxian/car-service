<template>
  <div class="home" ref="home">
    <div class="filter-header">
      <el-radio-group v-model="role" @change="roleSwich" size="mini" v-if="roleDatas.length>1">
        <el-radio-button v-for="(roleData,index) in roleDatas" :key="index" :label="roleData.type">{{roleData.name}}
        </el-radio-button>
      </el-radio-group>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="日" name="day"></el-tab-pane>
        <el-tab-pane label="周" name="week"></el-tab-pane>
        <el-tab-pane label="月" name="month"></el-tab-pane>
        <el-tab-pane label="季" name="quarter"></el-tab-pane>
        <el-tab-pane label="年" name="year"></el-tab-pane>
      </el-tabs>
    </div>
    <platform-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='1'"></platform-static>
    <operator-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='2'"></operator-static>
    <store-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='3'"></store-static>
    <after-sale-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='8'||role==='16'">
    </after-sale-static>
    <service-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='4'"></service-static>
    <service-manage-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='5'">
    </service-manage-static>
    <sale-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='7'"></sale-static>
    <sale-manage-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='15'"></sale-manage-static>
    <marketing-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='6'||role==='14'">
    </marketing-static>
    <reception-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='11'"></reception-static>
    <guards-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='13'"></guards-static>
    <general-manager-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='9'">
    </general-manager-static>
    <rescue-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='10'"></rescue-static>
    <final-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='12'||role==='17'"></final-static>
    <thirdpartnar-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='18'"></thirdpartnar-static>
    <warehouse-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='19'"></warehouse-static>
    <purchase-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='21'||role==='22'">
    </purchase-static>
    <supplier-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='23'"></supplier-static>
    <agency-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='24'"></agency-static>
    <test-driver-static :beginDate="beginDate" :endDate="endDate" :viewType="viewType" v-if="role==='25'"></test-driver-static>
    <div class="left_content">
      <div class="top_content">
        <div class="title">我的待办</div>
        <div class="myscroll1 drag-box" id="myscroll1">
          <ul>
            <li v-if="pendingDealCount.sim && pendingDealCount.sim>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addSim">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-tongxunguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.sim}}</div>
                <span>SIM卡审核</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.sim">
              <div class="icon">
                <i class="iconfont biz-icon-tongxunguanli"></i>
              </div>
              <span>SIM卡审核</span>
            </li>
            <li v-if="pendingDealCount.device && pendingDealCount.device>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addDevice">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-zhongduanguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.device}}</div>
                <span>设备审核</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.device">
              <div class="icon">
                <i class="iconfont biz-icon-zhongduanguanli"></i>
              </div>
              <span>设备审核</span>

            </li>
            <li v-if="pendingDealCount.car && pendingDealCount.car>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=addCar">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-cheliangguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.car}}</div>
                <span>车辆审核</span>
              </router-link>
            <li v-else-if="pendingDealCount.car">
              <div class="icon">
                <i class="iconfont biz-icon-cheliangguanli"></i>
              </div>
              <span>车辆审核</span>
            </li>
            <li v-if="pendingDealCount.member && pendingDealCount.member>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=member">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-huijiguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.member}}</div>
                <span>会员审核</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.member">
              <div class="icon">
                <i class="iconfont biz-icon-huijiguanli"></i>
              </div>
              <span>会员审核</span>
            </li>
            <li v-if="pendingDealCount.reply && pendingDealCount.reply>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=reply">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-kefufuwu"></i>
                </div>
                <div class="number">{{pendingDealCount.reply}}</div>
                <span>在线应答</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.reply">
              <div class="icon">
                <i class="iconfont biz-icon-kefufuwu"></i>
              </div>
              <span>在线应答</span>
            </li>
            <li v-if="pendingDealCount.workOrder && pendingDealCount.workOrder>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=workOrder">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-gongdan"></i>
                </div>
                <div class="number">{{pendingDealCount.workOrder}}</div>
                <span>工单受理</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.workOrder">
              <div class="icon">
                <i class="iconfont biz-icon-gongdan"></i>
              </div>
              <span>工单受理</span>
            </li>
            <li v-if="pendingDealCount.potentialResult && pendingDealCount.potentialResult>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=potentialResult">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-qiankeguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.potentialResult}}</div>
                <span>战败/签约</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.potentialResult">
              <div class="icon">
                <i class="iconfont biz-icon-qiankeguanli"></i>
              </div>
              <span>战败/签约</span>
            </li>
            <li v-if="pendingDealCount.rescue && pendingDealCount.rescue>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=rescue">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-hezuojiuyuanjigou"></i>
                </div>
                <div class="number">{{pendingDealCount.rescue}}</div>
                <span>救援请求</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.rescue">
              <div class="icon">
                <i class="iconfont biz-icon-hezuojiuyuanjigou"></i>
              </div>
              <span>救援请求</span>
            </li>
            <li v-if="pendingDealCount.orderConfirm && pendingDealCount.orderConfirm>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderConfirm">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-chanpin"></i>
                </div>
                <div class="number">{{pendingDealCount.orderConfirm}}</div>
                <span>订单确认</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.orderConfirm">
              <div class="icon">
                <i class="iconfont biz-icon-chanpin"></i>
              </div>
              <span>订单确认</span>
            </li>
            <li v-if="pendingDealCount.orderExecute && pendingDealCount.orderExecute>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderExecute">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-chanpin"></i>
                </div>
                <div class="number">{{pendingDealCount.orderExecute}}</div>
                <span>订单服务</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.orderExecute">
              <div class="icon">
                <i class="iconfont biz-icon-chanpin"></i>
              </div>
              <span>订单服务</span>
            </li>
            <li v-if="pendingDealCount.orderRefund && pendingDealCount.orderRefund>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=orderRefund">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-chanpin"></i>
                </div>
                <div class="number">{{pendingDealCount.orderRefund}}</div>
                <span>订单退款</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.orderRefund">
              <div class="icon">
                <i class="iconfont biz-icon-chanpin"></i>
              </div>
              <span>订单退款</span>
            </li>
            <li v-if="pendingDealCount.investment && pendingDealCount.investment>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=investment">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-zhaoshangjiameng"></i>
                </div>
                <div class="number">{{pendingDealCount.investment}}</div>
                <span>招商审核</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.investment">
              <div class="icon">
                <i class="iconfont biz-icon-zhaoshangjiameng"></i>
              </div>
              <span>招商审核</span>
            </li>
            <li v-if="pendingDealCount.reception && pendingDealCount.reception>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=reception">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-yonghuming"></i>
                </div>
                <div class="number">{{pendingDealCount.reception}}</div>
                <span>客户接待</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.reception">
              <div class="icon">
                <i class="iconfont biz-icon-yonghuming"></i>
              </div>
              <span>客户接待</span>
            </li>
            <li v-if="pendingDealCount.potential && pendingDealCount.potential>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-fuwudingzhi"></i>
                </div>
                <div class="number">{{pendingDealCount.potential}}</div>
                <span>潜客回访</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.potential">
              <div class="icon">
                <i class="iconfont biz-icon-fuwudingzhi"></i>
              </div>
              <span>潜客回访</span>
            </li>
            <li v-if="pendingDealCount.idcardcertification && pendingDealCount.idcardcertification>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=idcardcertification">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-yingxiaoguanli"></i>
                </div>
                <div class="number">{{pendingDealCount.idcardcertification}}</div>
                <span>实名认证</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.idcardcertification">
              <div class="icon">
                <i class="iconfont biz-icon-yingxiaoguanli"></i>
              </div>
              <span>实名认证</span>
            </li>
            <!-- <li v-if="pendingDealCount.invoice && pendingDealCount.invoice>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=invoice">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-l-dd"></i>
                </div>
                <div class="number">{{pendingDealCount.invoice}}</div>
                <span>补开发票</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.invoice">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-l-dd"></i>
              </div>
              <span>补开发票</span>
            </li> -->
            <li v-if="pendingDealCount.delivery && pendingDealCount.delivery>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=delivery">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-l-ckgl"></i>
                </div>
                <div class="number">{{pendingDealCount.delivery}}</div>
                <span>出库待办</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.delivery">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-l-ckgl"></i>
              </div>
              <span>出库待办</span>
            </li>
            <li v-if="pendingDealCount.stockIn && pendingDealCount.stockIn>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=stockIn">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-l-fkgl"></i>
                </div>
                <div class="number">{{pendingDealCount.stockIn}}</div>
                <span>入库待办</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.stockIn">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-l-fkgl"></i>
              </div>
              <span>入库待办</span>
            </li>
            <li v-if="pendingDealCount.purchaseOrder && pendingDealCount.purchaseOrder>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchaseOrder">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-chanpin"></i>
                </div>
                <div class="number">{{pendingDealCount.purchaseOrder}}</div>
                <span>采购订单待办</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.purchaseOrder">
              <div class="icon">
                <i class="iconfont biz-icon-chanpin"></i>
              </div>
              <span>采购订单待办</span>
            </li>
            <li v-if="pendingDealCount.purchase && pendingDealCount.purchase>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchase">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-cgsq"></i>
                </div>
                <div class="number">{{pendingDealCount.purchase}}</div>
                <span>审核提醒</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.purchase">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-cgsq"></i>
              </div>
              <span>审核提醒</span>
            </li>
            <li v-if="pendingDealCount.purchaseReturn && pendingDealCount.purchaseReturn>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=purchaseReturn">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-cgthsq"></i>
                </div>
                <div class="number" style="left:60px">{{pendingDealCount.purchaseReturn}}</div>
                <span>采购退货申请待办</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.purchaseReturn">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-cgthsq"></i>
              </div>
              <span>采购退货申请待办</span>
            </li>
            <li v-if="pendingDealCount.invoice && pendingDealCount.invoice>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=invoice">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-clss"></i>
                </div>
                <div class="number" style="left:60px">{{pendingDealCount.invoice}}</div>
                <span>补开发票</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.invoice">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-clss"></i>
              </div>
              <span>补开发票</span>
            </li>
            <li v-if="pendingDealCount.vehicleLicense && pendingDealCount.vehicleLicense>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=vehicleLicense">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-xsz"></i>
                </div>
                <div class="number" style="left:60px">{{pendingDealCount.vehicleLicense}}</div>
                <span>行驶证认证</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.vehicleLicense">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-xsz"></i>
              </div>
              <span>行驶证认证</span>
            </li>
            <li v-if="pendingDealCount.recommendAudit && pendingDealCount.recommendAudit>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=recommendAudit">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-web-l-sqxx"></i>
                </div>
                <div class="number" style="left:60px">{{pendingDealCount.recommendAudit}}</div>
                <span>推送审核</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.recommendAudit">
              <div class="icon">
                <i class="iconfont biz-icon-i-web-l-sqxx"></i>
              </div>
              <span>推送审核</span>
            </li>
            <li v-if="pendingDealCount.moveCar && pendingDealCount.moveCar>0">
              <router-link to="/message/message-mgmt?category=pendingRemind&state=1&type=moveCar">
                <div class="icon_orange">
                  <i class="iconfont biz-icon-i-sh-car-smnc"></i>
                </div>
                <div class="number" style="left:60px">{{pendingDealCount.moveCar}}</div>
                <span>挪车码申请</span>
              </router-link>
            </li>
            <li v-else-if="pendingDealCount.moveCar">
              <div class="icon">
                <i class="iconfont biz-icon-i-sh-car-smnc"></i>
              </div>
              <span>挪车码申请</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom_content" id="dMessage">
        <div class="daiban" id="daiban">
          <li v-for="pendingdealMessage in pendingdealMessages" :key="pendingdealMessage.messageId">
            <router-link :to="'/message/message-mgmt?category=pendingRemind&state=1&id=' + pendingdealMessage.messageId">
              <span class="overflow_ellpise">
                <span
                  style="color:#ff7300">[{{pendingdealMessage.typeName}}]</span>&nbsp;&nbsp;{{pendingdealMessage.content}}</span>
              <span class="date">{{pendingdealMessage.sendTime}}</span>
            </router-link>
          </li>
        </div>
      </div>
    </div>
    <div class="right_content">
      <div style="display:flex;justify-content:space-between">
        <div class="title">我的消息
        </div>
        <div style="line-height:40px">
          <el-select v-model="shopId" size="mini" @change="myMessage">
            <el-option v-for="shop in shops" :key="shop.id" :label="shop.name" :value="shop.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="bottom_content" style="border:none;height:90%" id="mMessage">
        <div id="myMessage" style="position:relative;height:100%">
          <div v-if="messages.length===0" :style="styleObject"></div>
          <li v-for="message in messages" :key="message.messageId">
            <router-link
              :to="message.msgCategory==='pendingRemind'?'/message/message-mgmt?category=pendingRemind&state=1&id=' + message.messageId:'/message/message-mgmt?category='+message.category+'&id=' + message.messageId">
              <span class="overflow_ellpise">
                <span style="color:#ff7300">[{{message.typeName}}]</span>&nbsp;&nbsp;{{message.content}}</span>
              <span class="date">{{message.sendTime}}</span>
            </router-link>
          </li>
        </div>
      </div>
    </div>
    <el-dialog title="服务到期提醒" :visible.sync="dialogVisible" custom-class="service-dialog">
      <div>{{this.getUser().realName}}您好</div>
      <div>您的部分服务即将到期，请及时订购</div>
      <div class="service-order-card-view" ref="divContent">
        <el-card class="order-card" v-for="item in data" :key="item.id">
          <div class="title">{{ item.businessService.name }}</div>
          <el-tag size="small" :style="tagStyle(item.businessService.subscribeState)">{{ item.businessService.subscribeState |
            filterState }}</el-tag>
          <div class="price color-orange">￥{{ item.price }}</div>
          <div class="dead-line" v-show="item.businessService.subscribeState==='1'&&item.businessServiceType!=='sms'"><span class="item-name">有效期截止:</span> {{ item.businessService.endDate }}</div>
          <div class="description" v-html="formatDescription(item.businessService.description || '')">
          </div>
        </el-card>
        <div class="no-content" v-if="data.length === 0" :style="styleObject"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import TestDriverStatic from './static-analysis/TestDriverStatic';
import PlatformStatic from './static-analysis/PlatformStatic';
import OperatorStatic from './static-analysis/OperatorStatic';
import StoreStatic from './static-analysis/StoreStatic';
import AfterSaleStatic from './static-analysis/AfterSaleStatic';
import ServiceStatic from './static-analysis/ServiceStatic';
import ServiceManageStatic from './static-analysis/ServiceManageStatic';
import SaleStatic from './static-analysis/SaleStatic';
import SaleManageStatic from './static-analysis/SaleManageStatic';
import GeneralManagerStatic from './static-analysis/GeneralManagerStatic';
import MarketingStatic from './static-analysis/MarketingStatic';
import ReceptionStatic from './static-analysis/ReceptionStatic';
import GuardsStatic from './static-analysis/GuardsStatic';
import RescueStatic from './static-analysis/RescueStatic';
import FinalStatic from './static-analysis/FinalStatic';
import WarehouseStatic from './static-analysis/WarehouseStatic';
import thirdpartnarStatic from './static-analysis/thirdpartnarStatic';
import AgencyStatic from './static-analysis/AgencyStatic';
import PurchaseStatic from './static-analysis/PurchaseStatic';
import SupplierStatic from './static-analysis/SupplierStatic';
import dateTime from '@/utils/dateTime';
import ioService from '@/service/push/io';
import screenService from '@/service/push/smartToShopScreen';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'home',
  data() {
    return {
      pendingDealCount: {},
      messages: [],
      shops: [],
      dialogVisible: false,
      shopId: this.getUser().shop.id,
      pendingdealMessages: [],
      statistics: {},
      beginDate: dateTime.getPreThreeMonthDay(),
      endDate: dateTime.today(),
      roleType: '',
      activeName: 'month',
      viewType: 'month',
      roleDatas: [],
      data: [],
      role: this.getUser().roleDatas[0].type
    };
  },
  created() {
    this.home();
    this.queryShop();
    this.roleDatas = this.getUser().roleDatas;
  },
  components: {
    TestDriverStatic,
    PlatformStatic,
    OperatorStatic,
    StoreStatic,
    AfterSaleStatic,
    ServiceStatic,
    ServiceManageStatic,
    SaleStatic,
    SaleManageStatic,
    GeneralManagerStatic,
    MarketingStatic,
    ReceptionStatic,
    GuardsStatic,
    RescueStatic,
    FinalStatic,
    WarehouseStatic,
    thirdpartnarStatic,
    SupplierStatic,
    PurchaseStatic,
    AgencyStatic
  },
  computed: {
    styleObject() {
      return {
        height: '100%',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        position: 'absolute',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  mounted() {
    // 拖拽功能(主要是触发三个事件：onmousedown\onmousemove\onmouseup)
    this.$refs.home.style.height = this.$refs.home.clientHeight + 'px';
    let drag1 = document.getElementById('myscroll1');
    // 点击某物体时，用drag对象即可，move和up是全局区域，也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)
    drag1.onmousedown = function(event) {
      if (event.target.tagName === 'I') {
        return;
      }
      let e = event || window.event; // 兼容ie浏览器
      let diffX = e.clientX - drag1.offsetLeft; // 鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
      if (typeof drag1.setCapture !== 'undefined') {
        drag1.setCapture();
      }

      drag1.onmousemove = function(event) {
        let e = event || window.event; // 兼容ie浏览器
        let left = e.clientX - diffX;
        // 移动时重新得到物体的距离，解决拖动时出现晃动的现象
        // drag1.style.left = left + 'px';
        drag1.style.transform = 'translate3d(' + left + 'px, 0px, 0px)';
      };
      drag1.onmouseup = function(e) {
        // 当鼠标弹起来的时候不再移动
        this.onmousemove = null;
        this.onmouseup = null; // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）

        // 修复低版本ie bug
        if (typeof drag1.releaseCapture !== 'undefined') {
          drag1.releaseCapture();
        }
      };
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('PendingMessage', ['updatePendingMessage']),
    // 查询管理员店铺
    queryShop() {
      http
        .get('/admin/admin/manageShops.jhtml', {})
        .then(data => {
          this.shops = data.dataList;
        })
        .catch();
    },
    formatDescription(description) {
      return `<span class="item-name">服务简介: </span>${description}`;
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
    roleSwich(type) {
      this.roleType = type;
    },
    handleClick(tab, event) {
      if (tab.name === 'day') {
        this.beginDate = dateTime.today();
        this.endDate = dateTime.today();
        this.viewType = 'day';
      } else if (tab.name === 'week') {
        this.beginDate = dateTime.getWeekStartDate();
        this.endDate = dateTime.getWeekEndDate();
        this.viewType = 'week';
      } else if (tab.name === 'month') {
        this.beginDate = dateTime.getMonthStartDate();
        this.endDate = dateTime.getMonthEndDate();
        this.viewType = 'month';
      } else if (tab.name === 'quarter') {
        this.beginDate = dateTime.getQuarterStartDate();
        this.endDate = dateTime.getQuarterEndDate();
        this.viewType = 'quarter';
      } else if (tab.name === 'year') {
        this.beginDate = dateTime.getQuarterYearStart();
        this.endDate = dateTime.getQuarterYearEnd();
        this.viewType = 'year';
      }
    }
  }
};
</script>
<style lang="scss">
.service-dialog {
  .service-order-card-view {
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
      height: 200px;
      margin: 7px;
      font-size: 12px;
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
  overflow: auto;
  background: #ffffff;
  .filter-header {
    padding: 10px 10px 0px 10px;
  }
  .static_content,
  .left_content,
  .right_content {
    background-color: #ffffff;
  }
  .left_content {
    border-top: 10px solid #f4f4f4;
    border-right: 5px solid #f4f4f4;
  }
  .right_content {
    border-top: 10px solid #f4f4f4;
    border-left: 5px solid #f4f4f4;
    overflow-y: auto;
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
    ul {
      position: relative;
      z-index: 10;
    }
    li {
      padding: 1rem 0;
      user-select: none;
      position: relative;
      .number {
        height: 25px;
        line-height: 25px;
        width: 25px;
        background: red;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        position: absolute;
        left: 50px;
        top: 5px;
        font-size: 12px;
      }
    }
    li:first-child,
    li:last-child {
      margin-left: 0 !important;
      margin-right: 0 !important;
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
    width: 50%;
    float: left;
    height: 100%;
    // border-right: 1px solid #b7b7b7;
    overflow-y: auto;
    box-sizing: border-box;
    .bottom_content {
      // border-top: 1px solid #b7b7b7;
      margin: 20px 10px 0px 20px;
      overflow-y: auto;
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
      height: 120px;
      border-bottom: 1px solid #000000;
      .title {
        // background: #ebebeb;
        // text-align: center;
        margin-left: 20px;
        margin-top: 20px;
        border-left: 3px solid #ff7300;
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
    width: 50%;
    float: left;
    // border-right: 1px solid #b7b7b7;
    height: 100%;
    box-sizing: border-box;
    .title {
      // background: #ebebeb;
      // text-align: center;
      margin-left: 20px;
      margin-top: 20px;
      border-left: 3px solid #ff7300;
      padding-left: 5px;
      // height: 35px;
      line-height: 25px;
      color: #000;
      font-weight: bold;
      font-size: 14px;
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
  .myscroll {
    ul {
      padding: 1.5rem 0;
      text-align: left;
      li {
        width: 200px;
        min-height: 112px;
        /* padding: 1rem 0; */
        user-select: none;
        border-right: solid 1px #b7b7b7;
        a {
          display: block;
          text-decoration: none;
          span {
            padding: 0;
            color: #000000;
            font-size: 16px;
            display: block;
            margin: 0 auto;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
            white-space: normal;
          }
          .font_style {
            font-size: 32px;
            color: #ff6600;
            padding: 10px 0px;
          }
          .child_font {
            font-size: 12px;
          }
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
  }

  .drag-box > * > * {
    margin: 0;
    display: inline-block;
    vertical-align: top;
    font-size: 1rem;
  }
  .drag-box > * > *:first-child {
    margin-left: 1rem;
  }
  .drag-box > * > *:last-child {
    margin-right: 1rem;
  }

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
}
</style>
