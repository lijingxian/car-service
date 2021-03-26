<template>
  <div class="federation-mgmt-nav">
    <el-radio-group v-model="isUnion" size="mini" @change="unionChange">
      <el-radio-button label="联盟管理"></el-radio-button>
      <el-radio-button label="智慧门店"></el-radio-button>
    </el-radio-group>
    <div class="image" v-show="isUnion==='联盟管理'&&getUser().roleLevel!=='shop'">
      <img :src="union" style="width:915px"/>
      <!-- <div class="title1">联盟管理</div>
      <div class="title2">店铺管理</div>
      <div class="title3">数据洞察</div> -->
      <div class="square2 step101" v-popover:codePop101 v-if="currentAuth().includes('admin:shop.tag')" @click="link('/union/shop/tag/tagClass')">
        <div class="top">管理标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}个</span>
        </div>
      </div>
      <div class="square2 step101 disabled" v-popover:codePop101 v-if="!currentAuth().includes('admin:shop.tag')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}个</span>
        </div>
      </div>
      <div class="square2 step102" v-popover:codePop102 v-if="currentAuth().includes('admin:shop.creditRating')" @click="link('/product-settings/shop-rate/ability')">
        <div class="top">设置评级指标</div>
        <div class="bottom">
          已有评级指标
          <span>{{this.formLm.storeIndicatorCount}}个</span>
        </div>
      </div>
      <div class="square2 step102 disabled" v-popover:codePop102 v-if="!currentAuth().includes('admin:shop.creditRating')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置评级指标</div>
        <div class="bottom">
          已有评级指标
          <span>{{this.formLm.storeIndicatorCount}}个</span>
        </div>
      </div>
      <div class="square step1" v-popover:codePop v-if="currentAuth().includes('admin:union.manage')" @click="link('/union/federation-mgmt/federation')">
        <div class="top">门店管理</div>
        <div class="bottom">
          所属店铺
          <span>{{this.formLm.storeCount}}个</span>
        </div>
      </div>
      <div class="square step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:union.manage')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">门店管理</div>
        <div class="bottom">
          所属店铺
          <span>{{this.formLm.storeCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step2"
        v-popover:codePop1
        v-if="currentAuth().includes('admin:investment')&&getUser().roleLevel==='platform'"
        @click="link('/union/federation-mgmt/merchants-mgmt/investment')"
      >
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="investmentPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">审核加盟申请</div>
        <div class="bottom">
          待审核申请
          <span>{{this.formLm.untreatedCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:investment')&&getUser().roleLevel==='platform'" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="investmentPendingDeal===1"></i>
        <div class="top">审核加盟申请</div>
        <div class="bottom">
          待审核申请
          <span>{{this.formLm.untreatedCount}}个</span>
        </div>
      </div>
      <div class="square1 step3" v-popover:codePop2 @click="link('/union/shop/shop-account')" v-if="currentAuth().includes('admin:system.shopaccount.shop')">
        <div class="top">V服账户</div>
        <div class="bottom">
          账户余额
          <span>{{this.formLm.balance}}元</span>
        </div>
      </div>
      <div class="square1 step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:system.shopaccount.shop')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">V服账户</div>
        <div class="bottom">
          账户余额
          <span>{{this.formLm.balance}}元</span>
        </div>
      </div>
      <div class="square1 step4" v-popover:codePop3 @click="link('/union/shop/wechatList')" v-if="currentAuth().includes('admin:shopWechatBind')">
        <div class="top">微信账户</div>
        <div class="bottom">
          已有微信账户
          <span>{{this.formLm.wechat}}人</span>
        </div>
      </div>
      <div class="square1 step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:shopWechatBind')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">微信账户</div>
        <div class="bottom">
          已有微信账户
          <span>{{this.formLm.wechat}}人</span>
        </div>
      </div>
      <div class="square2 step5" v-popover:codePop4 @click="link('/union/shop/move-code')" v-if="currentAuth().includes('admin.parkingCode')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="moveCarPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">挪车码</div>
        <div class="bottom">
          已有挪车码
          <span>{{this.formLm.moveCarCount}}个</span>
        </div>
      </div>
      <div class="square2 step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin.parkingCode')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="moveCarPendingDeal===1"></i>
        <div class="top">挪车码</div>
        <div class="bottom">
          已有挪车码
          <span>{{this.formLm.moveCarCount}}个</span>
        </div>
      </div>
      <div class="step6" style="top: 200px;width: 295px;height: 105px;position: absolute;background: #ffffff;left: 400px">
      </div>
      <!-- <div
        class="square2 step6"
        v-popover:codePop5
        @click="link('/union/shop/product-settings/distributor-setting')"
        v-if="currentAuth().includes('admin:shop.shippingMethod')"
      >
        <div class="top">配送方式</div>
        <div class="bottom">
          已有配送方式
          <span>{{this.formLm.shippingMethodCount}}个</span>
        </div>
      </div>
      <div class="square2 step6 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:shop.shippingMethod')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">配送方式</div>
        <div class="bottom">
          已有配送方式
          <span>{{this.formLm.shippingMethodCount}}个</span>
        </div>
      </div>
      <div class="square2 step7" v-popover:codePop6 @click="link('/union/shop/delivery_shop')" v-if="currentAuth().includes('admin:shop.shippingMethod')">
        <div class="top">物流公司</div>
        <div class="bottom">
          已有合作物流公司
          <span>{{this.formLm.deliverCorpCount}}个</span>
        </div>
      </div>
      <div class="square2 step7 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:shop.shippingMethod')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">物流公司</div>
        <div class="bottom">
          已有合作物流公司
          <span>{{this.formLm.deliverCorpCount}}个</span>
        </div>
      </div> -->
      <div class="square2 step8" v-popover:codePop7 @click="link('/union/shop/screen-projection')" v-if="currentAuth().includes('admin:advertising')">
        <div class="top">电视投屏</div>
        <div class="bottom">
          已有电视
          <span>{{this.formLm.tvCount}}个</span>
        </div>
      </div>
      <div class="square2 step8 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:advertising')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">电视投屏</div>
        <div class="bottom">
          已有电视
          <span>{{this.formLm.tvCount}}个</span>
        </div>
      </div>
      <!-- <div class="square2 step9" v-popover:codePop8 @click="link('/union/system/tag/tagClass')" v-if="currentAuth().includes('admin:system.tag.tagCategory')">
        <div class="top">定义标签分类</div>
        <div class="bottom">
          已有标签分类
          <span>{{this.formLm.tagCategoryCount}}个</span>
        </div>
      </div>
      <div class="square2 step9 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:system.tag.tagCategory')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">定义标签分类</div>
        <div class="bottom">
          已有标签分类
          <span>{{this.formLm.tagCategoryCount}}个</span>
        </div>
      </div>
      <div class="square2 step10" v-popover:codePop9 @click="link('/union/shop/tag/tagClass')" v-if="currentAuth().includes('admin:shop.tag.tagCategory')">
        <div class="top">定义店铺标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}类</span>
        </div>
      </div>
      <div class="square2 step10 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:shop.tag.tagCategory')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">定义店铺标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}类</span>
        </div>
      </div> -->
      <div class="square2 step11" v-popover:codePop10 @click="link('/union/log/user-operat-log')" v-if="currentAuth().includes('admin:log.memberOperato')">
        <div class="top">用户操作日志</div>
        <div class="bottom">
          用户操作日志
          <span>{{(Number(this.formLm.memberOperationLog)/10000).toFixed(1)}}万条</span>
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:log.memberOperato')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">用户操作日志</div>
        <div class="bottom">
          用户操作日志
          <span>{{(Number(this.formLm.memberOperationLog)/10000).toFixed(1)}}万条</span>
        </div>
      </div>
      <div class="square2 step12" v-popover:codePop11 @click="link('/union/log/admin-operate-log')" v-if="currentAuth().includes('admin:log.adminOperato')">
        <div class="top">管理操作日志</div>
        <div class="bottom">
          管理操作日志
          <span>{{(Number(this.formLm.adminOperationLog)/10000).toFixed(1)}}万条</span>
        </div>
      </div>
      <div class="square2 step12 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:log.adminOperato')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理操作日志</div>
        <div class="bottom">
          管理操作日志
          <span>{{(Number(this.formLm.adminOperationLog)/10000).toFixed(1)}}万条</span>
        </div>
      </div>
      <div
        class="square1 step13"
        v-popover:codePop12
        @click="link('/union/statistics-analysis/single-shop-analysis')"
        v-if="currentAuth().includes('admin:operatorStatistics.store')"
      >
        <div class="top">单店铺分析</div>
        <div class="bottom">
          已生成
          <span>{{this.formLm.singleStore }}个</span>店铺分析
        </div>
      </div>
      <div class="square1 step13 disabled" v-popover:codePop12 v-if="!currentAuth().includes('admin:operatorStatistics.store')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单店铺分析</div>
        <div class="bottom">
          已生成
          <span>{{this.formLm.singleStore }}个</span>店铺分析
        </div>
      </div>
      <div
        class="square1 step14"
        v-popover:codePop13
        @click="link('/union/statistics-analysis/shop-analysis')"
        v-if="currentAuth().includes('admin:operatorStatistics.storegroup')"
      >
        <div class="top">店铺群分析</div>
        <div class="bottom">
          累计加盟店铺
          <span>{{this.formLm.storeGroup }}个</span>
        </div>
      </div>
      <div class="square1 step14 disabled" v-popover:codePop13 v-if="!currentAuth().includes('admin:operatorStatistics.storegroup')">
        <div class="top">店铺群分析</div>
        <div class="bottom">
          累计加盟店铺
          <span>{{this.formLm.storeGroup }}个</span>
        </div>
      </div>
      <div class="square step15" v-popover:codePop14 @click="link('/union/service-mgmt/subscribe')" v-if="currentAuth().includes('admin:service.subscribe')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="servicePendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">订阅服务</div>
        <div class="bottom">
          已订阅服务
          <span>{{this.formLm.businessServiceCount}}个</span>
        </div>
      </div>
      <div class="square step15 disabled" v-popover:codePop14 v-if="!currentAuth().includes('admin:service.subscribe')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="servicePendingDeal===1"></i>
        <div class="top">订阅服务</div>
        <div class="bottom">
          已订阅服务
          <span>{{this.formLm.businessServiceCount}}个</span>
        </div>
      </div>
      <div class="square1 step16" v-popover:codePop15 @click="link('/union/service-mgmt/message-mgmt')" v-if="currentAuth().includes('admin:service.sms.store')">
        <div class="top">短信充值</div>
        <div class="bottom">
          可用短信数
          <span>{{this.formLm.smsRechargeCount}}个</span>
        </div>
      </div>
      <div class="square1 step16 disabled" v-popover:codePop15 v-if="!currentAuth().includes('admin:service.sms.store')">
        <div class="top">短信充值</div>
        <div class="bottom">
          可用短信数
          <span>{{this.formLm.smsRechargeCount}}个</span>
        </div>
      </div>
      <div class="square1 step17" v-popover:codePop16 @click="link('/union/service-mgmt/manage/order')" v-if="currentAuth().includes('admin:serviceOrder')">
        <div class="top">查看订单</div>
        <div class="bottom">
          已有服务订单
          <span>{{this.formLm.serviceOrder }}个</span>
        </div>
      </div>
      <div class="square1 step17 disabled" v-popover:codePop16 v-if="!currentAuth().includes('admin:serviceOrder')">
        <div class="top">查看订单</div>
        <div class="bottom">
          已有服务订单
          <span>{{this.formLm.serviceOrder }}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">组建并管理联盟</div>
          <div class="middle-font">创建/维护联盟店铺，维护联盟店铺关系及店铺基本信息</div>
          <div class="bottom-font">
            所属店铺
            <span>{{this.formLm.storeCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">审核加盟申请</div>
          <div class="middle-font">审核商家提交的加盟申请</div>
          <div class="bottom-font">
            待审核申请
            <span>{{this.formLm.untreatedCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">V服账户</div>
          <div class="middle-font">店铺账户充值，用于购买服务或广告投放等</div>
          <div class="bottom-font">
            帐户余额
            <span>{{this.formLm.balance}}元</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">微信账户</div>
          <div class="middle-font">管理店铺微信公众号，可配置菜单、自动回复</div>
          <div class="bottom-font">
            已有微信账户
            <span>{{this.formLm.wechat}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">挪车码</div>
          <div class="middle-font">管理店铺挪车码，可作为福利发给会员</div>
          <div class="bottom-font">
            已有挪车码
            <span>{{this.formLm.moveCarCount}}张</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">配送方式</div>
          <div class="middle-font">创建/维护店铺物流配送方式</div>
          <div class="bottom-font">
            已有配送方式
            <span>{{this.formLm.shippingMethodCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">物流公司</div>
          <div class="middle-font">创建/维护店铺合作物流公司</div>
          <div class="bottom-font">
            已有合作物流公司
            <span>{{this.formLm.deliverCorpCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">电视投屏</div>
          <div class="middle-font">管理店端电视投屏内容，可播报到店信息及宣传视频</div>
          <div class="bottom-font">
            已有电视
            <span>{{this.formLm.tvCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">定义标签分类</div>
          <div class="middle-font">创建/维护店铺标签的分类</div>
          <div class="bottom-font">
            已有标签分类
            <span>{{this.formLm.tagCategoryCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">定义店铺标签</div>
          <div class="middle-font">定义店铺标签</div>
          <div class="bottom-font">
            已有标签
            <span>{{this.formLm.storeTagCount}}类</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">用户操作日志</div>
          <div class="middle-font">查看用户的操作日志，包括app、微信端</div>
          <div class="bottom-font">
            用户操作日志
            <span>{{this.formLm.memberOperationLog}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">管理员操作日志</div>
          <div class="middle-font">查看管理员（顾问）操作日志，包括web、小程序</div>
          <div class="bottom-font">
            管理员操作日志
            <span>{{this.formLm.adminOperationLog}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop12">
        <div class="pop-div">
          <div class="top-font">单店铺分析</div>
          <div class="middle-font">多维度分析单个店铺经营能力</div>
          <div class="bottom-font">
            已生成
            <span>{{this.formLm.singleStore }}个</span>店铺分析
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop13">
        <div class="pop-div">
          <div class="top-font">店铺群分析</div>
          <div class="middle-font">分析联盟店铺整体情况，包括加盟情况、运营趋势、店铺发布、业务分布等</div>
          <div class="bottom-font">
            累计加盟店铺
            <span>{{this.formLm.storeGroup }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop14">
        <div class="pop-div">
          <div class="top-font">订阅服务</div>
          <div class="middle-font">您可在此进行平台服务的订阅，订阅后即可使用对应的功能。</div>
          <div class="bottom">
            已订阅服务
            <span>{{this.formLm.businessServiceCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop15">
        <div class="pop-div">
          <div class="top-font">短信充值</div>
          <div class="middle-font">您可进行短信充值，活动、文章等推广时可采用短信即时</div>
          <div class="bottom">
            可用短信数量
            <span>{{this.formLm.smsRechargeCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop16">
        <div class="pop-div">
          <div class="top-font">查看订单</div>
          <div class="middle-font">店铺的首款记录、退款记录、储值记录均在此进行管理</div>
          <div class="bottom-font">
            已有服务订单
            <span>{{this.formLm.serviceOrder }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop101">
        <div class="pop-div">
          <div class="top-font">管理标签</div>
          <div class="middle-font">管理店铺的标签，可根据不同标签应用场景在平台已有的基础上添加自定义标签，联盟管理评级标准设置、订单、文章、会员等场景可使用标签</div>
          <div class="bottom-font">
            已有标签
            <span>{{this.formLm.storeTagCount }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop102">
        <div class="pop-div">
          <div class="top-font">设置评级指标</div>
          <div class="middle-font">联盟可设置多指标评级体系用于对联盟内的店铺进行评级，且支持店铺选择承诺服务，对评级良好的店铺可进行优先推荐</div>
          <div class="bottom-font">
            已有评级指标
            <span>{{this.formLm.storeIndicatorCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="image" v-show="isUnion==='联盟管理'&&getUser().roleLevel==='shop'">
      <img :src="unionShop" style="width:915px"/>
      <!-- <div class="title1">联盟管理</div>
      <div class="title2">店铺管理</div>
      <div class="title3">数据洞察</div> -->
      <div class="square2 step201" v-popover:codePop101 v-if="currentAuth().includes('admin:shop.tag')" @click="link('/union/shop/tag/tagClass')">
        <div class="top">管理标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}个</span>
        </div>
      </div>
      <div class="square2 step201 disabled" v-popover:codePop101 v-if="!currentAuth().includes('admin:shop.tag')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">管理标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}个</span>
        </div>
      </div>
      <div class="square2 step202" v-popover:codePop102 v-if="currentAuth().includes('admin:shop.creditRating')" @click="link('/product-settings/shop-rate/ability')">
        <div class="top">设置评级指标</div>
        <div class="bottom">
          已有评级指标
          <span>{{this.formLm.storeIndicatorCount}}个</span>
        </div>
      </div>
      <div class="square2 step202 disabled" v-popover:codePop102 v-if="!currentAuth().includes('admin:shop.creditRating')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置评级指标</div>
        <div class="bottom">
          已有评级指标
          <span>{{this.formLm.storeIndicatorCount}}个</span>
        </div>
      </div>
      <div class="square step203" v-popover:codePop v-if="currentAuth().includes('admin:union.manage')" @click="link('/union/federation-mgmt/federation')">
        <div class="top">门店管理</div>
        <div class="bottom">
          所属店铺
          <span>{{this.formLm.storeCount}}个</span>
        </div>
      </div>
      <div class="square step203 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:union.manage')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">门店管理</div>
        <div class="bottom">
          所属店铺
          <span>{{this.formLm.storeCount}}个</span>
        </div>
      </div>
      <div class="square1 step204" v-popover:codePop2 @click="link('/union/shop/shop-account')" v-if="currentAuth().includes('admin:system.shopaccount.shop')">
        <div class="top">V服账户</div>
        <div class="bottom">
          账户余额
          <span>{{this.formLm.balance}}元</span>
        </div>
      </div>
      <div class="square1 step204 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:system.shopaccount.shop')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">V服账户</div>
        <div class="bottom">
          账户余额
          <span>{{this.formLm.balance}}元</span>
        </div>
      </div>
      <div class="square1 step205" v-popover:codePop3 @click="link('/union/shop/wechatList')" v-if="currentAuth().includes('admin:shopWechatBind')">
        <div class="top">微信账户</div>
        <div class="bottom">
          已有微信账户
          <span>{{this.formLm.wechat}}人</span>
        </div>
      </div>
      <div class="square1 step205 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:shopWechatBind')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">微信账户</div>
        <div class="bottom">
          已有微信账户
          <span>{{this.formLm.wechat}}人</span>
        </div>
      </div>
      <div class="square2 step206" v-popover:codePop4 @click="link('/union/shop/move-code')" v-if="currentAuth().includes('admin.parkingCode')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="moveCarPendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">挪车码</div>
        <div class="bottom">
          已有挪车码
          <span>{{this.formLm.moveCarCount}}个</span>
        </div>
      </div>
      <div class="square2 step206 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin.parkingCode')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="moveCarPendingDeal===1"></i>
        <div class="top">挪车码</div>
        <div class="bottom">
          已有挪车码
          <span>{{this.formLm.moveCarCount}}个</span>
        </div>
      </div>
      <div class="square2 step207" v-popover:codePop7 @click="link('/union/shop/screen-projection')" v-if="currentAuth().includes('admin:advertising')">
        <div class="top">电视投屏</div>
        <div class="bottom">
          已有电视
          <span>{{this.formLm.tvCount}}个</span>
        </div>
      </div>
      <div class="square2 step207 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:advertising')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">电视投屏</div>
        <div class="bottom">
          已有电视
          <span>{{this.formLm.tvCount}}个</span>
        </div>
      </div>
      <!-- <div class="square2 step9" v-popover:codePop8 @click="link('/union/system/tag/tagClass')" v-if="currentAuth().includes('admin:system.tag.tagCategory')">
        <div class="top">定义标签分类</div>
        <div class="bottom">
          已有标签分类
          <span>{{this.formLm.tagCategoryCount}}个</span>
        </div>
      </div>
      <div class="square2 step9 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:system.tag.tagCategory')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">定义标签分类</div>
        <div class="bottom">
          已有标签分类
          <span>{{this.formLm.tagCategoryCount}}个</span>
        </div>
      </div>
      <div class="square2 step10" v-popover:codePop9 @click="link('/union/shop/tag/tagClass')" v-if="currentAuth().includes('admin:shop.tag.tagCategory')">
        <div class="top">定义店铺标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}类</span>
        </div>
      </div>
      <div class="square2 step10 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:shop.tag.tagCategory')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">定义店铺标签</div>
        <div class="bottom">
          已有标签
          <span>{{this.formLm.storeTagCount}}类</span>
        </div>
      </div> -->
      <div
        class="square1 step208"
        v-popover:codePop12
        @click="link('/union/statistics-analysis/single-shop-analysis')"
        v-if="currentAuth().includes('admin:operatorStatistics.store')"
      >
        <div class="top">单店铺分析</div>
        <div class="bottom">
          已生成
          <span>{{this.formLm.singleStore }}个</span>店铺分析
        </div>
      </div>
      <div class="square1 step208 disabled" v-popover:codePop12 v-if="!currentAuth().includes('admin:operatorStatistics.store')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单店铺分析</div>
        <div class="bottom">
          已生成
          <span>{{this.formLm.singleStore }}个</span>店铺分析
        </div>
      </div>
      <div
        class="square1 step209"
        v-popover:codePop13
        @click="link('/union/statistics-analysis/shop-analysis')"
        v-if="currentAuth().includes('admin:operatorStatistics.storegroup')"
      >
        <div class="top">店铺群分析</div>
        <div class="bottom">
          累计加盟店铺
          <span>{{this.formLm.storeGroup }}个</span>
        </div>
      </div>
      <div class="square1 step209 disabled" v-popover:codePop13 v-if="!currentAuth().includes('admin:operatorStatistics.storegroup')">
        <div class="top">店铺群分析</div>
        <div class="bottom">
          累计加盟店铺
          <span>{{this.formLm.storeGroup }}个</span>
        </div>
      </div>
      <div class="square step210" v-popover:codePop14 @click="link('/union/service-mgmt/subscribe')" v-if="currentAuth().includes('admin:service.subscribe')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="servicePendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">订阅服务</div>
        <div class="bottom">
          已订阅服务
          <span>{{this.formLm.businessServiceCount}}个</span>
        </div>
      </div>
      <div class="square step210 disabled" v-popover:codePop14 v-if="!currentAuth().includes('admin:service.subscribe')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="servicePendingDeal===1"></i>
        <div class="top">订阅服务</div>
        <div class="bottom">
          已订阅服务
          <span>{{this.formLm.businessServiceCount}}个</span>
        </div>
      </div>
      <div class="square1 step211" v-popover:codePop15 @click="link('/union/service-mgmt/message-mgmt')" v-if="currentAuth().includes('admin:service.sms.store')">
        <div class="top">短信充值</div>
        <div class="bottom">
          可用短信数
          <span>{{this.formLm.smsRechargeCount}}个</span>
        </div>
      </div>
      <div class="square1 step211 disabled" v-popover:codePop15 v-if="!currentAuth().includes('admin:service.sms.store')">
        <div class="top">短信充值</div>
        <div class="bottom">
          可用短信数
          <span>{{this.formLm.smsRechargeCount}}个</span>
        </div>
      </div>
      <div class="square1 step212" v-popover:codePop16 @click="link('/union/service-mgmt/manage/order')" v-if="currentAuth().includes('admin:serviceOrder')">
        <div class="top">查看订单</div>
        <div class="bottom">
          已有服务订单
          <span>{{this.formLm.serviceOrder }}个</span>
        </div>
      </div>
      <div class="square1 step212 disabled" v-popover:codePop16 v-if="!currentAuth().includes('admin:serviceOrder')">
        <div class="top">查看订单</div>
        <div class="bottom">
          已有服务订单
          <span>{{this.formLm.serviceOrder }}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">门店管理</div>
          <div class="middle-font">创建/维护联盟店铺，维护联盟店铺关系及店铺基本信息</div>
          <div class="bottom-font">
            所属店铺
            <span>{{this.formLm.storeCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">审核加盟申请</div>
          <div class="middle-font">审核商家提交的加盟申请</div>
          <div class="bottom-font">
            待审核申请
            <span>{{this.formLm.untreatedCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">V服账户</div>
          <div class="middle-font">店铺账户充值，用于购买服务或广告投放等</div>
          <div class="bottom-font">
            帐户余额
            <span>{{this.formLm.balance}}元</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">微信账户</div>
          <div class="middle-font">管理店铺微信公众号，可配置菜单、自动回复</div>
          <div class="bottom-font">
            已有微信账户
            <span>{{this.formLm.wechat}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">挪车码</div>
          <div class="middle-font">管理店铺挪车码，可作为福利发给会员</div>
          <div class="bottom-font">
            已有挪车码
            <span>{{this.formLm.moveCarCount}}张</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">配送方式</div>
          <div class="middle-font">创建/维护店铺物流配送方式</div>
          <div class="bottom-font">
            已有配送方式
            <span>{{this.formLm.shippingMethodCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">物流公司</div>
          <div class="middle-font">创建/维护店铺合作物流公司</div>
          <div class="bottom-font">
            已有合作物流公司
            <span>{{this.formLm.deliverCorpCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">电视投屏</div>
          <div class="middle-font">管理店端电视投屏内容，可播报到店信息及宣传视频</div>
          <div class="bottom-font">
            已有电视
            <span>{{this.formLm.tvCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">定义标签分类</div>
          <div class="middle-font">创建/维护店铺标签的分类</div>
          <div class="bottom-font">
            已有标签分类
            <span>{{this.formLm.tagCategoryCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">定义店铺标签</div>
          <div class="middle-font">定义店铺标签</div>
          <div class="bottom-font">
            已有标签
            <span>{{this.formLm.storeTagCount}}类</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">用户操作日志</div>
          <div class="middle-font">查看用户的操作日志，包括app、微信端</div>
          <div class="bottom-font">
            用户操作日志
            <span>{{this.formLm.memberOperationLog}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">管理员操作日志</div>
          <div class="middle-font">查看管理员（顾问）操作日志，包括web、小程序</div>
          <div class="bottom-font">
            管理员操作日志
            <span>{{this.formLm.adminOperationLog}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop12">
        <div class="pop-div">
          <div class="top-font">单店铺分析</div>
          <div class="middle-font">多维度分析单个店铺经营能力</div>
          <div class="bottom-font">
            已生成
            <span>{{this.formLm.singleStore }}个</span>店铺分析
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop13">
        <div class="pop-div">
          <div class="top-font">店铺群分析</div>
          <div class="middle-font">分析联盟店铺整体情况，包括加盟情况、运营趋势、店铺发布、业务分布等</div>
          <div class="bottom-font">
            累计加盟店铺
            <span>{{this.formLm.storeGroup }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop14">
        <div class="pop-div">
          <div class="top-font">订阅服务</div>
          <div class="middle-font">您可在此进行平台服务的订阅，订阅后即可使用对应的功能。</div>
          <div class="bottom">
            已订阅服务
            <span>{{this.formLm.businessServiceCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop15">
        <div class="pop-div">
          <div class="top-font">短信充值</div>
          <div class="middle-font">您可进行短信充值，活动、文章等推广时可采用短信即时</div>
          <div class="bottom">
            可用短信数量
            <span>{{this.formLm.smsRechargeCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop16">
        <div class="pop-div">
          <div class="top-font">查看订单</div>
          <div class="middle-font">店铺的首款记录、退款记录、储值记录均在此进行管理</div>
          <div class="bottom-font">
            已有服务订单
            <span>{{this.formLm.serviceOrder }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop101">
        <div class="pop-div">
          <div class="top-font">管理标签</div>
          <div class="middle-font">管理店铺的标签，可根据不同标签应用场景在平台已有的基础上添加自定义标签，联盟管理评级标准设置、订单、文章、会员等场景可使用标签</div>
          <div class="bottom-font">
            已有标签
            <span>{{this.formLm.storeTagCount }}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop102">
        <div class="pop-div">
          <div class="top-font">设置评级指标</div>
          <div class="middle-font">联盟可设置多指标评级体系用于对联盟内的店铺进行评级，且支持店铺选择承诺服务，对评级良好的店铺可进行优先推荐</div>
          <div class="bottom-font">
            已有评级指标
            <span>{{this.formLm.storeIndicatorCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="image" v-show="isUnion==='智慧门店'">
      <img :src="store" style="width:915px"/>
      <!-- <div class="title4">设置</div>
      <div class="title5">业务处理</div>
      <div class="title6">数据洞察</div> -->
      <div class="square2 step01" v-popover:setting>
        <div class="top">到店设置</div>
        <div class="bottom">
          已有终端
          <span>{{this.formZh.arriveSettingCount}}个</span>
        </div>
      </div>
      <div class="square step22" v-popover:record @click="link('/union/smart-to-shop/reception-mgmt')" v-if="currentAuth().includes('admin:reception')">
        <div class="top">到店记录</div>
        <div class="bottom">
          今日到店客户
          <span>{{this.formZh.arriveRecordCount}}人</span>
        </div>
      </div>
      <div class="square step22 disabled" v-popover:record v-if="!currentAuth().includes('admin:reception')">
        <div class="top">到店记录</div>
        <div class="bottom">
          今日到店客户
          <span>{{this.formZh.arriveRecordCount}}人</span>
        </div>
      </div>
      <div
        class="square1 step33"
        v-popover:codePop33
        @click="link('/union/statistics-analysis/smart-to-shop')"
        v-if="currentAuth().includes('admin:smartReception.statistics')"
      >
        <div class="top">到店及接待统计</div>
        <div class="bottom">
          本月到店
          <span>{{this.formZh.intelligentAccess}}人</span>
        </div>
      </div>
      <div class="square1 step33 disabled" v-popover:codePop33 v-if="!currentAuth().includes('admin:smartReception.statistics')">
        <div class="top">到店及接待统计</div>
        <div class="bottom">
          本月到店
          <span>{{this.formZh.intelligentAccess}}人</span>
        </div>
      </div>
      <div
        class="square1 step44"
        v-popover:codePop44
        @click="link('/union/smart-reception/robot-mgmt')"
        v-if="currentAuth().includes('admin:smartReception.robotManage')"
      >
        <div class="top">机器人设置</div>
        <div class="bottom">
          已有机器人
          <span>{{this.formZh.robotCount}}个</span>
        </div>
      </div>
      <div class="square1 step44 disabled" v-popover:codePop44 v-if="!currentAuth().includes('admin:smartReception.robotManage')">
        <div class="top">机器人设置</div>
        <div class="bottom">
          已有机器人
          <span>{{this.formZh.robotCount}}个</span>
        </div>
      </div>
      <div
        class="square1 step55"
        v-popover:codePop55
        @click="link('/union/smart-reception/qa-mgmt')"
        v-if="currentAuth().includes('admin:smartReception.answer')"
      >
        <div class="top">普通问答</div>
        <div class="bottom">
          已配置问答
          <span>{{this.formZh.commonCount}}个</span>
        </div>
      </div>
      <div class="square1 step55 disabled" v-popover:codePop55 v-if="!currentAuth().includes('admin:smartReception.answer')">
        <div class="top">普通问答</div>
        <div class="bottom">
          已配置问答
          <span>{{this.formZh.commonCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step66"
        v-popover:codePop66
        @click="link('/union/smart-reception/process-qa')"
        v-if="currentAuth().includes('admin:smartReception.flowAnswer')"
      >
        <div class="top">流程问答</div>
        <div class="bottom">
          已配置流程
          <span>{{this.formZh.processCount}}个</span>
        </div>
      </div>
      <div class="square2 step66 disabled" v-popover:codePop66 v-if="!currentAuth().includes('admin:smartReception.flowAnswer')">
        <div class="top">流程问答</div>
        <div class="bottom">
          已配置流程
          <span>{{this.formZh.processCount}}个</span>
        </div>
      </div>
      <div
        class="square step77"
        v-popover:codePop77
        @click="link('/union/statistics-analysis/reception-static')"
        v-if="currentAuth().includes('admin:Reception.statistics')"
      >
        <div class="top">接待记录</div>
        <div class="bottom">
          今日接待客户
          <span>{{this.formZh.receptionCount}}人</span>
        </div>
      </div>
      <div class="square step77 disabled" v-popover:codePop77 v-if="!currentAuth().includes('admin:Reception.statistics')">
        <div class="top">接待记录</div>
        <div class="bottom">
          今日接待客户
          <span>{{this.formZh.receptionCount}}人</span>
        </div>
      </div>
      <div
        class="square2 step88"
        v-popover:codePop88
        @click="link('/union/statistics-analysis/smart-to-shop')"
        v-if="currentAuth().includes('admin:smartReception.statistics')"
      >
        <div class="top">到店&接待月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step88 disabled" v-popover:codePop88 v-if="!currentAuth().includes('admin:smartReception.statistics')">
        <div class="top">到店&接待月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step99" v-popover:codePop99 @click="link('/union/smart-reception/map-mgmt')" v-if="currentAuth().includes('admin:smartReception.map')">
        <div class="top">地图设置</div>
        <div class="bottom">
          已设置
          <span>{{this.formZh.robotMap }}个</span>点位
        </div>
      </div>
      <div class="square2 step99 disabled" v-if="!currentAuth().includes('admin:smartReception.map')">
        <div class="top">地图设置</div>
        <div class="bottom">
          已设置
          <span>{{this.formZh.robotMap }}个</span>点位
        </div>
      </div>
      <div
        class="square2 step100"
        v-popover:codePop100
        @click="link('/union/smart-reception/reception-static/review-static-detail')"
        v-if="currentAuth().includes('admin:smartReception.assess')"
      >
        <div class="top">客户评价</div>
        <div class="bottom">
          今日新增评价
          <span>{{this.formZh.evaluateCount}}个</span>
        </div>
      </div>
      <div class="square2 step100 disabled" v-popover:codePop100 v-if="!currentAuth().includes('admin:smartReception.assess')">
        <div class="top">客户评价</div>
        <div class="bottom">
          今日新增评价
          <span>{{this.formZh.evaluateCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step111"
        v-popover:codePop001
        @click="link('/union/smart-reception/unknow-problem')"
        v-if="currentAuth().includes('admin:smartReception.unknownQuestion')"
      >
        <div class="top">未知问题</div>
        <div class="bottom">
          今日新增未知问题
          <span>{{this.formZh.unKnowCount}}个</span>
        </div>
      </div>
      <div class="square2 step111 disabled" v-popover:codePop001 v-if="!currentAuth().includes('admin:smartReception.unknownQuestion')">
        <div class="top">未知问题</div>
        <div class="bottom">
          今日新增未知问题
          <span>{{this.formZh.unKnowCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="setting">
        <div class="pop-div">
          <div class="top-font">到店设置</div>
          <div class="middle-font">配置智能到店道闸等基本信息</div>
          <div class="bottom-font">
            已有终端
            <span>{{this.formZh.arriveSettingCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="record">
        <div class="pop-div">
          <div class="top-font">到店记录</div>
          <div class="middle-font">管理到店客户记录，查看及更新接待信息</div>
          <div class="bottom-font">
            今日到店客户
            <span>{{this.formZh.arriveRecordCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop33">
        <div class="pop-div">
          <div class="top-font">到店及接待统计</div>
          <div class="middle-font">多维度分析到店和接待数据</div>
          <div class="bottom-font">
            本月到店
            <span>{{this.formZh.intelligentAccess}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop44">
        <div class="pop-div">
          <div class="top-font">机器人设置</div>
          <div class="middle-font">店铺机器人基本信息设置</div>
          <div class="bottom-font">
            已有机器人
            <span>{{this.formZh.robotCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop55">
        <div class="pop-div">
          <div class="top-font">普通问答</div>
          <div class="middle-font">配置机器人对客户问题的回答</div>
          <div class="bottom-font">
            已有问答
            <span>{{this.formZh.commonCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop66">
        <div class="pop-div">
          <div class="top-font">流程问答</div>
          <div class="middle-font">配置流程性的问答，引导客户看车或购买商品</div>
          <div class="bottom-font">
            已配置流程
            <span>{{this.formZh.processCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop77">
        <div class="pop-div">
          <div class="top-font">接待记录</div>
          <div class="middle-font">机器人详细接待记录</div>
          <div class="bottom-font">
            今日接待客户
            <span>{{this.formZh.receptionCount}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop88">
        <div class="pop-div">
          <div class="top-font">到店&接待月报</div>
          <div class="middle-font">按月分析到店&接待数据，并给出相应建议</div>
          <div class="bottom-font">
            已生成
            <span>{{new Date().getMonth()+1}}月</span>月报
          </div >
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop99">
        <div class="pop-div">
          <div class="top-font">地图设置</div>
          <div class="middle-font">针对可移动机器人，设置地图，规划行动路线</div>
          <div class="bottom-font">
            已设置
            <span>{{this.formZh.robotMap }}个</span>点位
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop100">
        <div class="pop-div">
          <div class="top-font">客户评价</div>
          <div class="middle-font">查看客户对机器人的评分和评价</div>
          <div class="bottom-font">
            今日新增评价
            <span>{{this.formZh.evaluateCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop001">
        <div class="pop-div">
          <div class="top-font">未知问题</div>
          <div class="middle-font">机器人答不上来的客户问题，您可以去设置回答或相似问题</div>
          <div class="bottom-font">
            今日新增未知问题
            <span>{{this.formZh.unKnowCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import union from '@/assets/images/nav/union.png';
import unionShop from '@/assets/images/nav/union_shop.png';
import store from '@/assets/images/nav/store.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      isUnion: '联盟管理',
      formLm: {
        storeCount: 0,
        storeIndicatorCount: 0,
        untreatedCount: 0,
        balance: 0,
        wechat: 0,
        moveCarCount: 0,
        shippingMethodCount: 0,
        deliverCorpCount: 0,
        tvCount: 0,
        businessServiceCount: 0,
        smsRechargeCount: 0,
        tagCategoryCount: 0,
        storeTagCount: 0,
        singleStore: 0,
        storeGroup: 0,
        memberOperationLog: 0,
        adminOperationLog: 0,
        serviceOrder: 0
      },
      formZh: {
        arriveSettingCount: 0,
        arriveRecordCount: 0,
        robotCount: 0,
        commonCount: 0,
        processCount: 0,
        receptionCount: 0,
        evaluateCount: 0,
        unKnowCount: 0,
        robotMap: 0,
        intelligentAccess: 0
      },
      investmentPendingDeal: 0,
      moveCarPendingDeal: 0,
      servicePendingDeal: 0,
      union: union,
      unionShop: unionShop,
      store: store
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
    unionChange() {
      if (this.isUnion === '联盟管理') {
        this.getLmNavInfo();
      } else {
        this.getZhNavInfo();
      }
    },
    getLmNavInfo() {
      http
        .get('/admin/store/navigation/kpi/unionStoreManagement.jhtml', {})
        .then(data => {
          Object.assign(this.formLm, data);
          this.investmentPendingDeal = data.investmentPendingDeal;
          this.moveCarPendingDeal = data.moveCarPendingDeal;
          this.servicePendingDeal = data.servicePendingDeal;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getZhNavInfo() {
      http
        .get('/admin/store/navigation/kpi/smartStore.jhtml', {})
        .then(data => {
          Object.assign(this.formZh, data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    this.getLmNavInfo();
    this.getZhNavInfo();
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
.federation-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 156px;
      width: 90px;
    }
    .title2 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 590px;
      width: 90px;
    }
    .title3 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1083px;
      width: 90px;
    }
    .title4 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 170px;
      width: 90px;
    }
    .title5 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 555px;
      width: 90px;
    }
    .title6 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1045px;
      width: 90px;
    }
    .step1 {
      top: 335px;
      left: 10px;
    }
    .step101 {
      top: 85px;
      left: 10px;
    }
    .step102 {
      top: 205px;
      left: 10px;
    }
    .step2 {
      top: 470px;
      left: 10px;
    }
    .step3 {
      top: 85px;
      left: 252px;
    }
    .step4 {
      top: 85px;
      left: 404px;
    }
    .step5 {
      top: 85px;
      left: 554px;
    }
    .step6 {
      top: 200px;
      left: 252px;
    }
    .step7 {
      top: 200px;
      left: 404px;
    }
    .step8 {
      top: 200px;
      left: 252px;
    }
    // .step9 {
    //   top: 480px;
    //   left: 252px;
    // }
    // .step10 {
    //   top: 480px;
    //   left: 404px;
    // }
    .step11 {
      top: 490px;
      left: 252px;
    }
    .step12 {
      top: 490px;
      left: 404px;
    }
    .step13 {
      top: 335px;
      left: 775px;
    }
    .step14 {
      top: 496px;
      left: 775px;
    }
    .step15 {
      top: 335px;
      left: 252px;
    }
    .step16 {
      top: 335px;
      left: 404px;
    }
    .step17 {
      top: 335px;
      left: 554px;
    }
    .step01 {
      top: 124px;
      left: 32px;
    }
    .step22 {
      top: 114px;
      left: 360px;
    }
    .step33 {
      top: 110px;
      left: 760px;
    }
    .step44 {
      top: 300px;
      left: 46px;
    }
    .step55 {
      top: 300px;
      left: 275px;
    }
    .step66 {
      top: 295px;
      left: 446px;
    }
    .step77 {
      top: 300px;
      left: 600px;
    }
    .step88 {
      top: 295px;
      left: 760px;
    }
    .step99 {
      top: 460px;
      left: 45px;
    }
    .step100 {
      top: 455px;
      left: 280px;
    }
    .step111 {
      top: 455px;
      left: 445px;
    }
    .step203 {
      top: 375px;
      left: 20px;
    }
    .step201 {
      top: 125px;
      left: 20px;
    }
    .step202 {
      top: 245px;
      left: 20px;
    }
    .step204 {
      top: 125px;
      left: 262px;
    }
    .step205 {
      top: 125px;
      left: 414px;
    }
    .step206 {
      top: 125px;
      left: 564px;
    }
    .step207 {
      top: 240px;
      left: 262px;
    }
    .step208 {
      top: 375px;
      left: 775px;
    }
    .step209 {
      top: 536px;
      left: 775px;
    }
    .step210 {
      top: 375px;
      left: 262px;
    }
    .step211 {
      top: 375px;
      left: 414px;
    }
    .step212 {
      top: 375px;
      left: 564px;
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
        border-radius: 0px 0px 10px 10px;
        width: 140px;
        margin-left: -1px;
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
