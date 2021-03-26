<template>
  <div class="operate-mgmt-nav">
    <div class="image">
      <img :src="yy" style="width:915px"/>
      <!-- <div class="title1">基础设置</div>
      <div class="title2">电商运营</div>
      <div class="title3">数据洞察</div> -->
      <div class="square2 step1" v-popover:codePop>
        <div class="top">设置支付方式</div>
        <div class="bottom">
          支持支付方式
          <span>{{this.form.paymentCurrentCount}}/{{this.form.paymentTotalCount}}个</span>
        </div>
      </div>
      <div
        class="square2 step2"
        v-popover:codePop1
        @click="link('/union/shop/product-settings/distributor-setting')"
        v-if="currentAuth().includes('admin:shop.shippingMethod')"
      >
        <div class="top">设置配送方式</div>
        <div class="bottom">
          支持配送方式
          <span>{{this.form.shippingMethodCurrentCount}}/{{this.form.shippingMethodTotalCount}}个</span>
        </div>
      </div>
      <div class="square2 step2 disabled" v-popover:codePop1 v-if="!currentAuth().includes('admin:shop.shippingMethod')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置配送方式</div>
        <div class="bottom">
          支持配送方式
          <span>{{this.form.shippingMethodCurrentCount}}/{{this.form.shippingMethodTotalCount}}个</span>
        </div>
      </div>
      <div class="square2 step3" v-popover:codePop2 @click="link('/union/shop/delivery_shop')" v-if="currentAuth().includes('admin:deliveryCorp.shop')">
        <div class="top">设置物流公司</div>
        <div class="bottom">
          支持物流公司
          <span>{{this.form.deliveryCompCount}}个</span>
        </div>
      </div>
      <div class="square2 step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:deliveryCorp.shop')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置物流公司</div>
        <div class="bottom">
          支持物流公司
          <span>{{this.form.deliveryCompCount}}个</span>
        </div>
      </div>
      <div class="square step4" v-popover:codePop3 @click="link('/operating/commodity-mgmt/commodity')" v-if="currentAuth().includes('admin:product')">
        <div class="top">商品管理</div>
        <div class="bottom">
          已有商品
          <span>{{this.form.productCount}}种</span>
        </div>
      </div>
      <div class="square step4 disabled" v-popover:codePop3 v-if="!currentAuth().includes('admin:product')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">商品管理</div>
        <div class="bottom">
          已有商品
          <span>{{this.form.productCount}}种</span>
        </div>
      </div>
      <div class="square step5" v-popover:codePop4 @click="link('/operating/product/car')" v-if="currentAuth().includes('admin:order.order')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="orderPendingDeal===1" @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">订单管理</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.orderCount}}个</span>
        </div>
      </div>
      <div class="square step5 disabled" v-popover:codePop4 v-if="!currentAuth().includes('admin:order.order')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="orderPendingDeal===1"></i>
        <div class="top">订单管理</div>
        <div class="bottom">
          今日新增订单
          <span>{{this.form.orderCount}}个</span>
        </div>
      </div>
      <div class="square1 step6" v-popover:codePop5 @click="link('/operating/logistics')" v-if="currentAuth().includes('admin:order.logistics')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="shippingPendingDeal===1"  @click.stop="link('/message/message-mgmt-pending?category=pendingRemind&state=1&type=depotOut')"></i>
        <div class="top">物流发货</div>
        <div class="bottom">
          今日新增发货记录
          <span>{{this.form.shippingCount}}条</span>
        </div>
      </div>
      <div class="square1 step6 disabled" v-popover:codePop5 v-if="!currentAuth().includes('admin:order.logistics')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="shippingPendingDeal===1"></i>
        <div class="top">物流发货</div>
        <div class="bottom">
          今日新增发货记录
          <span>{{this.form.shippingCount}}条</span>
        </div>
      </div>
      <div class="square1 step7" v-popover:codePop6 @click="link('/operating/finance/refund')" v-if="currentAuth().includes('admin:refunds')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="afterSalePendingDeal===1"  @click.stop="link('/message/message-mgmt?category=pendingRemind&state=1')"></i>
        <div class="top">售后退款</div>
        <div class="bottom">
          今日新增售后记录
          <span>{{this.form.afterSaleCount}}条</span>
        </div>
      </div>
      <div class="square1 step7 disabled" v-popover:codePop6 v-if="!currentAuth().includes('admin:refunds')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <i class="iconfont el-icon-warning" style="color:#ff7300;float:right" v-if="afterSalePendingDeal===1"></i>
        <div class="top">售后退款</div>
        <div class="bottom">
          今日新增售后记录
          <span>{{this.form.afterSaleCount}}条</span>
        </div>
      </div>
      <div
        class="square2 step8"
        v-popover:codePop7
        @click="link('/operating/product-statistics/productCategoryAnalysis')"
        v-if="currentAuth().includes('admin:order.statistics.catagory')"
      >
        <div class="top">品类分析</div>
        <div class="bottom">
          已分析品类
          <span>{{this.form.productCategoryAnalysis}}个</span>
        </div>
      </div>
      <div class="square2 step8 disabled" v-popover:codePop7 v-if="!currentAuth().includes('admin:order.statistics.catagory')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">品类分析</div>
        <div class="bottom">
          已分析品类
          <span>{{this.form.productCategoryAnalysis}}个</span>
        </div>
      </div>
      <div
        class="square2 step9"
        v-popover:codePop8
        @click="link('/operating/product-statistics/singleProductAnalysis')"
        v-if="currentAuth().includes('admin:order.statistics.product')"
      >
        <div class="top">单品分析</div>
        <div class="bottom">
          已分析单品
          <span>{{this.form.productAnalysis}}个</span>
        </div>
      </div>
      <div class="square2 step9 disabled" v-popover:codePop8 v-if="!currentAuth().includes('admin:order.statistics.product')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">单品分析</div>
        <div class="bottom">
          已分析单品
          <span>{{this.form.productAnalysis}}个</span>
        </div>
      </div>
      <div
        class="square2 step10"
        v-popover:codePop9
        @click="link('/operating/product-statistics/generalViewAnalysis')"
        v-if="currentAuth().includes('admin:order.statistics.summary')"
      >
        <div class="top">运营概况</div>
        <div class="bottom">
          本月销售额
          <span>{{this.form.saleAmount}}元</span>
        </div>
      </div>
      <div class="square2 step10 disabled" v-popover:codePop9 v-if="!currentAuth().includes('admin:order.statistics.summary')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">运营概况</div>
        <div class="bottom">
          本月销售额
          <span>{{this.form.saleAmount}}元</span>
        </div>
      </div>
      <div
        class="square2 step11"
        v-popover:codePop10
        @click="link('/operating/product-statistics/OrderPopulationAnalysis')"
        v-if="currentAuth().includes('admin:order.statistics.buyer')"
      >
        <div class="top">下单人群分析</div>
        <div class="bottom">
          本月下单人数
          <span>{{this.form.orderMember}}人</span>
        </div>
      </div>
      <div class="square2 step11 disabled" v-popover:codePop10 v-if="!currentAuth().includes('admin:order.statistics.buyer')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">下单人群分析</div>
        <div class="bottom">
          本月下单人数
          <span>{{this.form.orderMember}}人</span>
        </div>
      </div>
      <div
        class="square2 step12"
        v-popover:codePop11
        @click="link('/operating/product-statistics/report')"
        v-if="currentAuth().includes('admin:statistics.mouthreport.ecommerce')"
      >
        <div class="top">运营月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <div class="square2 step12 disabled" v-popover:codePop11 v-if="!currentAuth().includes('admin:statistics.mouthreport.ecommerce')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">运营月报</div>
        <div class="bottom">
          已生成
          <span>{{new Date().getMonth()+1}}月</span>月报
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">设置支付方式</div>
          <div class="middle-font">可设置店铺需要开通的支付方式</div>
          <div class="bottom-font">
            支持支付方式
            <span>{{this.form.paymentCurrentCount}}/{{this.form.paymentTotalCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop1">
        <div class="pop-div">
          <div class="top-font">设置配送方式</div>
          <div class="middle-font">可设置店铺需要支持的配送方式，支持自定义配送方式的费用</div>
          <div class="bottom-font">
            支持配送方式
            <span>{{this.form.shippingMethodCurrentCount}}/{{this.form.shippingMethodTotalCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">设置物流公司</div>
          <div class="middle-font">可添加店铺合作的物流公司，订单发货将从设置的物流公司中选择</div>
          <div class="bottom-font">
            支持物流公司
            <span>{{this.form.deliveryCompCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop3">
        <div class="pop-div">
          <div class="top-font">商品管理</div>
          <div class="middle-font">维护商品分类信息、品牌信息、商品信息，维护V豆全额兑换商品</div>
          <div class="bottom-font">
            已有商品
            <span>{{this.form.productCount}}种</span>
          </div>
          <div class="bottom-font">
            已有品牌
            <span>{{this.form.brandCount}}种</span>
          </div>
          <div class="bottom-font">
            已有分类
            <span>{{this.form.productCategoryCount}}种</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop4">
        <div class="pop-div">
          <div class="top-font">订单管理</div>
          <div class="middle-font">管理订单，进行确认、发货/执行、收款、开票等处理</div>
          <div class="bottom-font">
            今日新增订单
            <span>{{this.form.orderCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop5">
        <div class="pop-div">
          <div class="top-font">物流发货</div>
          <div class="middle-font">查看店铺的物流发货情况</div>
          <div class="bottom-font">
            今日新增发货记录
            <span>{{this.form.shippingCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop6">
        <div class="pop-div">
          <div class="top-font">售后退款</div>
          <div class="middle-font">查看店铺的售后退款情况</div>
          <div class="bottom-font">
            今日新增售后记录
            <span>{{this.form.afterSaleCount}}条</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop7">
        <div class="pop-div">
          <div class="top-font">品类分析</div>
          <div class="middle-font">对商品进行分析，了解单个品类销售情况。</div>
          <div class="bottom-font">
            已分析品类
            <span>{{this.form.productCategoryAnalysis}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop8">
        <div class="pop-div">
          <div class="top-font">单品分析</div>
          <div class="middle-font">对商品进行分析，了解单个商品销售情况。</div>
          <div class="bottom-font">
            已分析品类
            <span>{{this.form.productCategoryAnalysis}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop9">
        <div class="pop-div">
          <div class="top-font">运营概况</div>
          <div class="middle-font">对电商情况进行分析，了解销售、转化、服务情况。</div>
          <div class="bottom-font">
            本月销售额
            <span>{{this.form.saleAmount}}元</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop10">
        <div class="pop-div">
          <div class="top-font">下单人群分析</div>
          <div class="middle-font">对下单人群进行分析，了解消费者的特性和消费价值。</div>
          <div class="bottom-font">
            本月下单人数
            <span>{{this.form.orderMember}}人</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop11">
        <div class="pop-div">
          <div class="top-font">运营月报</div>
          <div class="middle-font">对运营的整体情况进行总结，并给出建议。</div>
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
import yy from '@/assets/images/nav/yy.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'CustomerServiceNav',
  data() {
    return {
      form: {
        paymentTotalCount: 0,
        paymentCurrentCount: 0,
        shippingMethodTotalCount: 0,
        shippingMethodCurrentCount: 0,
        deliveryCompCount: 0,
        productCount: 0,
        brandCount: 0,
        productCategoryCount: 0,
        orderCount: 0,
        shippingCount: 0,
        afterSaleCount: 0
      },
      orderPendingDeal: 0,
      shippingPendingDeal: 0,
      afterSalePendingDeal: 0,
      orderMember: 0,
      saleAmount: 0,
      productAnalysis: 0,
      productCategoryAnalysis: 0,
      yy: yy
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
        .get('/admin/store/navigation/kpi/ecommerce.jhtml', {})
        .then(data => {
          Object.assign(this.form, data);
          this.orderPendingDeal = data.orderPendingDeal;
          this.shippingPendingDeal = data.shippingPendingDeal;
          this.afterSalePendingDeal = data.afterSalePendingDeal;
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
.operate-mgmt-nav {
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
      background-color:#FF9C4C;
      left: 100px;
      width: 90px;
    }
    .title2 {
      top: 28px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 558px;
      width: 90px;
    }
    .title3 {
      top: 28px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1020px;
      width: 90px;
    }
    .step1 {
      top: 78px;
      left: 32px;
    }
    .step2 {
      top: 203px;
      left: 32px;
    }
    .step3 {
      top: 330px;
      left: 32px;
    }
    .step4 {
      top: 140px;
      left: 226px;
    }
    .step5 {
      top: 332px;
      left: 390px;
    }
    .step6 {
      top: 450px;
      left: 550px;
    }
    .step7 {
      top: 580px;
      left: 550px;
    }
    .step8 {
      top: 80px;
      left: 750px;
    }
    .step9 {
      top: 202px;
      left: 750px;
    }
    .step10 {
      top: 325px;
      left: 750px;
    }
    .step11 {
      top: 450px;
      left: 750px;
    }
    .step12 {
      top: 575px;
      left: 750px;
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
