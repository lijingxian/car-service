<template>
  <biz-grid class="order-confirm-content">
    <div class="order-address" @click="clickAdress" slot="top" v-if="showAddress">
      <div class="left">
        <div class="address">
          <div class="receiver-address">
            <span>{{getAddress?getAddress.consignee:''}}</span>
            <span>{{getAddress?getAddress.phone:''}}</span>
          </div>
          <div class="icon">
            <span>{{getAddress?(getAddress.areaName+getAddress.address):'请设置收货地址'}}</span>
            <span>
              <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
            </span>
          </div>
        </div>
      </div>
      <div>
        <i class="right-arrow iconfont icon-i-sh-man-tz"></i>
      </div>
    </div>
    <div class="order-goods">
      <div class="shop-name">
        <img :src="iconShop" />
        <span style="fontSize:14px">{{getUser.shop.name}}</span>
      </div>
      <div v-for="(item,index) of orderConfim.products" :key="index">
        <div class="order-goods-div">
          <div class="img-div">
            <img :src="item.product&&item.product.image?item.product.image:vfacLogo" :onerror="errorImg" class="img" />
          </div>
          <div class="goods-info">
            <span class="name">{{item.product.fullName}}</span>
            <div style="margin-bottom:10px">
              <span v-if="item.product.barCode" style="font-size: 14px;margin-right:10px">{{item.product.barCode}}</span>
              <span style="font-size: 14px;">最小包装数：{{item.product.minimumPackQuantity}}</span>
            </div>
            <div class="money-info">
              <span class="count-money">￥{{item.effectivePrice}}</span>
              <span class="count-num">X{{item.quantity}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-info">
      <div class="select-tyle" v-if="orderConfim.products[0].product.productType !== '1' && !priceCoupon">
        <span>支付方式</span>
        <el-select v-model="payType" @change="paymentChange" size="mini">
          <el-option v-for="payOption in payOptions" :key="payOption" :label="payOption" :value="payOption"></el-option>
        </el-select>
      </div>
      <div class="select-tyle">
        <span>配送方式</span>
        <el-select v-model="type" @change="inputChange" size="mini">
          <el-option v-for="optionItem in options" :key="optionItem" :label="optionItem" :value="optionItem"></el-option>
        </el-select>
      </div>
      <!-- <div class="order-dispatch" v-if="orderConfim.couponGroups&&orderConfim.couponGroups.length && orderConfim.products[0].product.productType !== '1' && !orderConfim.finalPayment" @click="onSelectDiscount">
              <span class="label">优惠选择</span>
              <div class="invoice-info">
                <span>{{disSelect?disSelect:''}}</span>
                <i class="right-arrow iconfont icon-i-sh-man-tz"></i>
              </div>
      </div>-->
      <div class="buy-leave-mes">
        <span>买家留言</span>
        <el-input type="textarea" size="mini" placeholder="选填：填写内容已和卖家协商确认" v-model="leaveMessage"></el-input>
      </div>
    </div>
    <div class="order-info">
      <div class="order-dispatch" v-if="orderConfim.products[0].product.productType !== '1' && parseFloat(getRealAmount) && showInvoince">
        <span style="display:flex;align-items:center;">
          <el-checkbox v-model="invoiceChecked" @change="invoiceChange" />
          <span class="label">发票信息</span>
        </span>
        <div class="invoice-info" @click="clickInvoiceInfo">
          <span class="invoice-title" style="font-size: 14px;" v-if="invoiceChecked">{{curInvoice?curInvoice.invoiceTitle:'暂无发票'}}</span>
          <span class="invoice-title" style="font-size: 14px;" v-if="!invoiceChecked">{{'不开具发票'}}</span>
          <!-- <i class="cubeic-wrong delete-btn" v-if="curInvoice.id" @click.stop="deleteInvoice"></i> -->
          <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
        </div>
      </div>
      <!-- <div class="order-vd" v-if="showVd && !orderConfim.finalPayment && bean">
        <el-checkbox v-model="vdChecked" @change="onSelctVd" />
        <span>
          可使用{{bean}}V豆抵扣
          <span style="color:red">{{vdiscount}}</span>元
        </span>
      </div>-->
    </div>
    <div class="order-count-div">
      <div class="order-count">
        <span class="pro-count">产品总额</span>
        <span>￥{{getCountMouny}}</span>
      </div>
      <div class="order-count">
        <span class="pro-count">邮费</span>
        <span>+￥{{ freight }}</span>
      </div>
      <div class="order-count" v-if="discount && orderConfim.products[0].product.productType !== '1'">
        <span class="pro-count">优惠</span>
        <span>-￥{{discount.toFixed(2)}}</span>
      </div>
      <!-- <div class="order-count" v-if="vdChecked && bean">
        <span class="pro-count">V豆抵扣</span>
        <span>-￥{{vdiscount}}</span>
      </div>-->
      <div class="order-count">
        <span class="pro-count" style="color:#333;">合计</span>
        <span class="count-money">￥{{getAmount?getAmount:getAmount.toFixed(2)}}</span>
      </div>
      <!--修改bug32194 去掉if判断条件 start-->
      <!-- <div class="order-count" v-if="vdChecked||discount||type==='顺丰速递'">
        <span class="pro-count" style="color:#333;">合计</span>
        <span class="count-money">￥{{getAmount?getAmount:getAmount.toFixed(2)}}</span>
      </div>-->
      <!--修改bug32194 end-->
      <!-- <div v-if="getIsSubscription==='1'&&!activity.activityId" class="subscription">
            <div class="subscription-count" style="color:red">
              <span>阶段1：订金</span>
              <span>￥{{getSubscription}}</span>
            </div>
            <div class="subscription-count">
              <span>阶段2：尾款</span>
              <span>￥{{getFinallyPayment}}</span>
            </div>
      </div>-->
    </div>
    <div class="foot" slot="bottom">
      <p class="pay-for">
        需付款
        <span class="count-money">￥{{getRealAmount?getRealAmount:getRealAmount.toFixed(2)}}</span>
      </p>
      <span class="submit" @click="submit">提交订单</span>
    </div>
    <el-dialog :visible.sync="dialogVisiable" append-to-body custom-class="bill-dialog-s" height="600px">
      <bill-info @selectedItem="selectedItem"></bill-info>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiableInvoice" append-to-body custom-class="invoice-dialog">
      <invoice-info @selectedInvoice="selectedInvoice"></invoice-info>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import iconShop from '@/assets/images/store.png';
import BillInfo from './components/BillInfo';
import InvoiceInfo from './components/InvoiceInfo';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'order-confirm',
  data() {
    return {
      iconShop: iconShop,
      invoiceId: '',
      vfacLogo: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      leaveMessage: '',
      type: '',
      shippingMethodId: '',
      options: [],
      receiverId: '',
      open: false,
      dialogVisiable: false,
      dialogVisiableInvoice: false,
      id: '0',
      payType: '',
      payOptions: [],
      openSelect: false,
      selectDiscount: [],
      vdChecked: false,
      invoiceChecked: false,
      showVdDiscount: false,
      option: { label: '' },
      bean: 0,
      vdiscount: 0,
      discount: 0,
      showVd: false,
      disSelect: '',
      freight: 0,
      computedBean: {},
      showAddress: true,
      flag: false
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    // ...mapGetters('RecentActivity', ['activity', 'shop', 'product']),
    ...mapGetters('Order', ['orderConfim', 'orderInfo', 'curInvoice', 'payment', 'defaultReceive', 'clickItemSelect']),
    getFinallyPayment() {
      return (this.orderConfim.products[0].effectivePrice * this.orderConfim.products[0].quantity - this.getSubscription).toFixed(
        2
      );
    },
    getIsSubscription() {
      return this.orderConfim.products[0].product.isSubscription;
    },
    getSubscription() {
      return this.orderConfim.products[0].product.subscription;
    },
    getRealAmount() {
      if (this.orderConfim.finalPayment) {
        return this.orderConfim.finalPayment;
      } else {
        return this.getAmount;
      }
      // if (this.getIsSubscription === '1' && !this.activity.activityId) {
      //   return this.getSubscription;
      // } else {
      //   return this.getAmount;
      // }
    },
    showInvoince() {
      if (this.vdChecked && this.getCountMouny - this.vdiscount - this.discount <= 0) {
        return false;
      }
      return true;
    },
    getAmount() {
      let amount = 0;
      if (this.vdChecked) {
        amount = Number(
          Number(this.getCountMouny) - Number(this.vdiscount) - Number(this.discount) + Number(this.freight)
        ).toFixed(2);
      } else {
        console.log('amount: ', this.getCountMouny - this.discount + this.freight);
        amount = Number(Number(this.getCountMouny) - Number(this.discount) + Number(this.freight)).toFixed(2);
      }
      return amount >= 0 ? amount : 0;
    },
    getCountMouny() {
      let ary = this.orderConfim.products;
      let len = ary.length;
      let count = 0;
      for (let i = 0; i < len; i++) {
        count += ary[i].effectivePrice * ary[i].quantity;
      }
      return parseFloat(count).toFixed(2);
    },
    getCountNum() {
      return 'X ' + this.orderConfim.quantity;
    },
    getAddress() {
      if (Object.getOwnPropertyNames(this.orderConfim.selAddress).length > 1) {
        return this.orderConfim.selAddress;
      }

      if (this.defaultReceive) {
        return this.defaultReceive;
      }

      if (this.orderConfim.receivers && this.orderConfim.receivers.length > 0) {
        return this.orderConfim.receivers[0];
      }
      return null;
    },
    isActivityOrder() {
      // return this.activity.activityId;
      return false;
    },
    priceCoupon() {
      return this.orderConfim.products[0].product.productType === '7';
    },
    orderType() {
      if (this.priceCoupon) {
        return '5';
      }
      return '0';
    }
  },
  components: { BillInfo, InvoiceInfo, BizGrid },
  methods: {
    ...mapMutations('Order', [
      'updateOrderInfo',
      'updateOrderConfim',
      'updateOrderId',
      'updatePayment',
      'updateFreight',
      'updateCouponSelect',
      'updateClickItemSelect',
      'updateCurInvoice'
    ]),
    // 跳转到店铺介绍页面
    goShop() {
      this.$router.push({
        path: `/shop-about/${this.orderConfim.shop.id}`
      });
    },
    calculateOrder(bean = '0') {
      let param = {
        cartItems: [],
        methodName: 'CalculateOrder',
        clientType: '2',
        shopId: this.getUser.shop.id || '',
        userId: this.getUser.id || '',
        couponIds: this.selectDiscount,
        shippingMethodId: this.shippingMethodId || '',
        bean: bean
      };

      let ary = this.orderConfim.products;
      let len = ary.length;
      let obj;
      let product;
      for (let i = 0; i < len; i++) {
        obj = {};
        // obj.id = ary[i].id;
        // obj.isMatch = ary[i].isMatch;
        // obj.packageId = ary[i].packageId;
        obj.quantity = ary[i].quantity;
        obj.amount = ary[i].quantity * ary[i].effectivePrice;
        product = {};
        product.id = ary[i].product.id;
        product.price = ary[i].effectivePrice;
        obj.product = product;
        param.cartItems.push(obj);
      }

      http
        .post(urls.hypermarketMgmt.calculateAgent, param)
        .then(data => {
          console.log('选择优惠券', data);
          this.discount = parseFloat(data.discount);
          this.freight = data.freight;
          this.beanComputed();
        })
        .catch(() => {})
        .finally(() => {});
    },
    onSelect(obj) {
      this.disSelect = obj.name;
      this.selectDiscount = obj.id ? [obj.id] : [];
      this.calculateOrder();
    },
    // 加载失败，替换为默认图片
    imgError(e) {},
    onCancel() {
      this.open = false;
      this.$router.replace({ path: this.$route.path + '/orderInfo/' + this.id });
    },
    clickAdress() {
      this.dialogVisiable = true;
    },
    // 节流
    submit() {
      if (
        (!this.getAddress || !this.getAddress.areaName) &&
        ((this.payment.name === '在线支付' && this.showAddress) || this.payment.name === '货到付款') &&
        !this.priceCoupon
      ) {
        this.$message.warning('请设置收货地址');
        return;
      }
      if (this.flag) {
        this.$message.warning('订单金额不满足商家起订要求');
        return;
      }
      this.createOrder();
    },
    clickInvoiceInfo() {
      this.updateClickItemSelect(true);
      this.dialogVisiableInvoice = true;
    },
    getQueryHandle() {
      this.updateOrderInfo({
        // id: this.product.id,
        amount: this.orderConfim.quantity * this.orderConfim.effectivePrice,
        count: this.orderConfim.quantity
      });

      let ary = this.orderConfim.shippingMethods;
      let len = ary.length;
      let i;

      for (i = 0; i < len; i++) {
        this.options.push(ary[i].name);
      }

      if (len > 0) {
        this.type = this.options[0];
        this.refreshFreight();
      }
    },
    refreshFreight() {
      let ary = this.orderConfim.shippingMethods;
      let len = ary.length;
      let i;

      for (i = 0; i < len; i++) {
        if (this.type === ary[i].name) {
          this.updateFreight({ freight: ary[i].freight, shippingMethodId: ary[i].id });
        }
      }

      if (this.type === '顺丰速递') {
        this.freight = 20.0;
      } else {
        this.freight = 0;
      }
    },
    inputChange() {
      this.shippingMethodId = this.orderConfim.shippingMethods.find(i => i.name === this.type).id;
      this.calculateOrder();

      let arr = this.orderConfim.shippingMethods;
      let len = this.orderConfim.shippingMethods.length;

      for (let i = 0; i < len; i++) {
        if (this.type === arr[i].name) {
          if (arr[i].isNeedReceiver === '0') {
            this.showAddress = false;
          } else {
            this.showAddress = true;
          }
          this.refreshFreight();
          return;
        }
      }
    },
    orderConfirm() {
      this.flag = false;
      let interfaceName = '';
      let param = {
        cartItems: [],
        methodName: '',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderType: this.orderType // 订单类型[0:购物消费(车品类商品),1:充值,2:整车预定(整车类商品),3:预约维修,4:预约保养,5:有价优惠券]/
      };

      param.methodName = 'FillInOrder';
      interfaceName = urls.hypermarketMgmt.fillInAgent;
      let ary = this.orderConfim.products;
      let len = ary.length;
      let obj;
      let product;
      for (let i = 0; i < len; i++) {
        obj = {};
        obj.id = ary[i].id;
        obj.quantity = ary[i].quantity;
        obj.amount = ary[i].quantity * ary[i].effectivePrice;
        product = {};
        product.id = ary[i].product.id;
        product.price = ary[i].effectivePrice;
        obj.product = product;
        param.cartItems.push(obj);
      }

      http
        .post(interfaceName, param)
        .then(data => {
          if (!this.shippingMethodId && data.shippingMethods.length) {
            this.shippingMethodId = data.shippingMethods[0].id;
          }
          console.log(111, data);
          console.log(222, this.orderConfim.selAddress);
          console.log(333, this.defaultReceive);
          console.log(444, this.orderConfim.receivers);
          this.updateOrderConfim({
            quantity: this.orderConfim.quantity,
            receivers: data.receivers || [], // 收货地址
            shippingMethods: data.shippingMethods, // 配送方式
            paymentMethods: data.paymentMethods, // 支付方式
            couponGroups: data.couponGroups // 可使用优惠券列表
          });
          this.setReceiveId();
          this.payType = data.paymentMethods[0].name;
          this.updatePayment(data.paymentMethods[0]);
          this.getQueryHandle();

          let ary = data.paymentMethods;
          let len = ary.length;
          for (let i = 0; i < len; i++) {
            this.payOptions.push(ary[i].name);
          }

          this.computedBean = {
            bean: data.bean,
            maxOffsetBean: data.maxOffsetBean,
            minOffsetBean: data.minOffsetBean,
            beanRate: data.beanRate
          };
          if (
            data.couponGroups &&
            data.couponGroups.length &&
            this.orderConfim.products[0].product.productType !== '1' &&
            !this.orderConfim.finalPayment
          ) {
            data.couponGroups[0].couponList[0].select = true;
            this.disSelect = data.couponGroups[0].couponList[0].name;
            this.selectDiscount = [data.couponGroups[0].couponList[0].id];
            this.updateCouponSelect({ couponGroups: data.couponGroups });
          }
          this.bean = data.bean;

          this.beanComputed();

          if (data.shippingMethods && data.shippingMethods.length) {
            if (data.shippingMethods[0].isNeedReceiver === '0') {
              this.showAddress = false;
            } else {
              this.showAddress = true;
            }
          }

          if (!this.isActivityOrder) {
            if (this.vdChecked) {
              this.calculateOrder(this.bean);
            } else {
              this.calculateOrder('0');
            }
          }
        })
        .catch(err => {
          if (err.errorMessage.indexOf('订单金额不满足商家起订要求') !== -1) {
            this.flag = true;
          }
          this.$message.warning(err.errorMessage);
        })
        .finally(() => {});
    },
    beanComputed() {
      console.log('computedBean', this.computedBean);
      if (parseFloat(this.computedBean.bean) > 0) {
        // 计算V豆抵扣
        let bean = parseFloat(this.computedBean.bean);
        let minBean = parseFloat(this.computedBean.minOffsetBean);
        let maxBean = parseFloat(this.computedBean.maxOffsetBean);

        if (bean > minBean && bean <= maxBean) {
          this.bean = bean;
          this.vdiscount = (this.bean * parseFloat(this.computedBean.beanRate)).toFixed(2);
        } else {
          if (bean > maxBean) {
            console.log('discount', this.discount);
            if (maxBean * parseFloat(this.computedBean.beanRate) > this.getCountMouny - this.discount) {
              this.bean = (this.getCountMouny - this.discount) * (1 / parseFloat(this.computedBean.beanRate));
            } else {
              this.bean = maxBean;
            }
            this.vdiscount = (this.bean * parseFloat(this.computedBean.beanRate)).toFixed(2);
          }
        }
        console.log('bean', this.bean);
        console.log('vdiscount', this.vdiscount);
        if (this.bean) {
          this.showVd = true;
        }
      } else {
        this.showVd = false;
      }

      if (!this.computedBean.beanRate) {
        this.showVd = false;
      }
    },
    selectedItem() {
      this.dialogVisiable = false;
      this.dialogVisiableInvoice = false;
    },
    selectedInvoice() {
      this.dialogVisiable = false;
      this.dialogVisiableInvoice = false;
      this.invoiceChecked = true;
    },
    createOrder() {
      console.log('createOrder');
      console.log(222, this.orderConfim.selAddress);
      console.log(333, this.defaultReceive);
      console.log(444, this.orderConfim.receivers);
      if (Object.getOwnPropertyNames(this.orderConfim.selAddress).length > 1) {
        this.receiverId = this.orderConfim.selAddress.id;
      } else if (this.defaultReceive) {
        this.receiverId = this.defaultReceive.id;
      } else if (this.orderConfim.receivers && this.orderConfim.receivers.length) {
        this.receiverId = this.orderConfim.receivers[0].id;
      }
      let param = {
        cartItems: [],
        // marketingId: this.activity.activityId,
        amount: this.orderConfim.quantity * this.orderConfim.price,
        freight: this.freight.toString(),
        receiverId:
          ((this.payment.name === '在线支付' && this.showAddress) ||
            this.payment.name === '货到付款' ||
            this.payment.name === '到店支付') &&
          !this.priceCoupon
            ? this.receiverId
            : '',
        paymentMethodId: !this.priceCoupon ? this.payment.id : '',
        shippingMethodId: this.shippingMethodId,
        methodName: 'CreateOrder',
        clientType: '2',
        shopId: this.orderConfim.shop.id || this.getUser.shop.id,
        userId: this.getUser.id,
        orderType: this.orderType,
        invoiceId: this.invoiceChecked && this.curInvoice ? this.curInvoice.id : '',
        bean: '0',
        couponIds: this.selectDiscount,
        // isSubscription: this.product.isSubscription,
        memo: this.leaveMessage
      };

      if (this.vdChecked) {
        param.bean = this.bean.toString();
      }

      let ary = this.orderConfim.products;
      let len = ary.length;
      let obj;
      let product;
      for (let i = 0; i < len; i++) {
        obj = {};
        obj.id = ary[i].id;
        obj.quantity = ary[i].quantity;
        obj.amount = ary[i].quantity * ary[i].effectivePrice;
        obj.isMatch = ary[i].isMatch;
        obj.packageId = ary[i].packageId;
        product = {};
        product.id = ary[i].product.id;
        product.price = ary[i].effectivePrice;
        obj.product = product;
        param.cartItems.push(obj);
      }

      http
        .post(urls.hypermarketMgmt.createOrderAgent, param)
        .then(data => {
          console.log('订单id', data.id);
          this.updateOrderId(data.id);
          this.id = data.id;

          if (this.payment.name === '在线支付') {
            if (parseFloat(this.getRealAmount) !== 0) {
              this.$emit('goPay', data.id);
            } else {
              // this.payNow();
              this.$emit('goPay', data.id);
            }
          } else {
            this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: { isShowDialog: true } });
          }
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          if (error.resultCode === '1162' || error.resultCode === '1163') {
            this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: { isShowDialog: true } });
          }
        })
        .finally(() => {});
    },
    payNow() {
      let param = {
        orderId: this.id,
        methodName: 'BalancePayment',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id
      };

      http
        .post(urls.hypermarketMgmt.balancePayment, param)
        .then(data => {
          this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: { isShowDialog: true } });
        })
        .catch(error => {
          if (error.resultCode === '377') {
            this.$message.warning('会员卡余额不足，请使用其他支付方式');
          } else if (error.resultCode === '378') {
            this.$message.warning('用户支付密码未设定，请先设定支付密码');
          } else if (error.resultCode === '380') {
            this.$message.warning('支付密码输入错误，请重试');
            this.passValue = '';
          } else if (error.resultCode === '1189') {
            this.$message.warning('订单为先发货后付款，请等待商家发货后付款');
            this.$router.push({ path: '/invoicing/agency/agency-purchase-order', query: { isShowDialog: true } });
          } else {
            this.$message.warning(error.errorMessage);
          }
        })
        .finally(() => {});
    },
    successHandle(data) {
      console.log('支付成功回调函数', data);
      this.$router.replace({ path: '/orderInfo/' + this.id });
    },
    failHandle() {
      this.$router.replace({ path: '/orderInfo/' + this.id });
    },
    setReceiveId() {
      if (Object.getOwnPropertyNames(this.orderConfim.selAddress).length > 1) {
        this.receiverId = this.orderConfim.selAddress.id;
      }

      if (this.defaultReceive) {
        this.receiverId = this.defaultReceive.id;
      }

      if (this.orderConfim.receivers && this.orderConfim.receivers.length > 0) {
        this.receiverId = this.orderConfim.receivers[0].id;
      }
    },
    paymentChange() {
      let ary = this.orderConfim.paymentMethods;
      let len = ary.length;
      let i;

      for (i = 0; i < len; i++) {
        if (this.payType === ary[i].name) {
          this.updatePayment(ary[i]);
        }
      }
    },
    hideSelect() {
      this.openSelect = false;
    },
    invoiceChange(val) {
      console.log(val);
      if (val) {
        let params = {
          clientType: '2',
          userId: this.getUser.id,
          shopId: this.getUser.shop.id
        };
        http
          .get(urls.hypermarketMgmt.invoiceInfos, params)
          .then(data => {
            if (data.invoices) {
              this.updateCurInvoice(data.invoices[0]);
            }
          })
          .catch(ErrorData => {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning'
            });
            console.log('ERR_REFRESH: ', ErrorData);
          })
          .finally(data => {});
      }
    },
    onSelectDiscount() {
      this.openSelect = true;
    },
    deleteInvoice() {
      this.updateCurInvoice({});
    }
    // onSelctVd() {
    //   if (this.vdChecked) {
    //     this.calculateOrder(this.bean);
    //   } else {
    //     this.calculateOrder('0');
    //   }
    // }
  },
  created() {
    this.orderConfirm();
    // this.onSelctVd();
    console.log('订单确认商品', this.orderConfim);
    if (this.orderConfim.products[0].product.productType === '1') {
      this.vdChecked = true;
    }
  }
};
</script>

<style lang="scss">
.invoice-dialog {
  height: 80%;
  .el-dialog__body {
    height: 100%;
  }
}
.bill-dialog-s {
  min-height: 500px;
  .el-dialog__headerbtn {
    z-index: 1;
  }
}
.order-confirm-content {
  height: 100%;
  padding-bottom: 45px;
  padding: 0px 10px;
  .order-address {
    padding: 10px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    .left {
      color: #808080;
      display: flex;
      width: 100%;
      .address {
        width: 100%;
        .icon {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          cursor: pointer;
        }
        .receiver-address {
          color: #000;
          span {
            display: inline-block;
            font-size: 13px;
            margin: 0 20px 10px 0px;
          }
        }
        p {
          font-size: 13px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .order-goods {
    background: #ffffff;
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #e5e5e5;
    .shop-name {
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      img {
        width: 18px;
        margin-right: 10px;
      }
    }
    .order-goods-div {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .img-div {
        width: 80px;
        height: 80px;
        overflow: hidden;
        display: flex;
        flex-grow: 0;
        flex-direction: row;
        align-items: center;
        margin-right: 10px;
        img {
          display: inline-block;
          width: 100%;
          vertical-align: middle;
        }
      }

      .goods-info {
        width: calc(100% - 80px);

        .name {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          color: #000;
        }

        .money-info {
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .count-money {
            color: red;
            display: inline-block;
          }

          .count-num {
            display: inline-block;
            color: #808080;
          }
        }
      }
    }
  }

  .order-info {
    background: #ffffff;
    margin-bottom: 10px;

    .select-tyle {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 5px 0px;
      .label {
        margin-left: 5px;
      }
    }

    .inv-info {
      font-size: 14px;

      a {
        color: #808080;
      }
    }

    .order-dispatch {
      height: 43px;
      padding: 13px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
      .invoice-info {
        display: flex;
        align-items: center;
        color: #666;
        cursor: pointer;
        overflow: hidden;
        .delete-btn {
          font-size: 16px;
          margin: 0 6px;
        }
      }
      .label {
        font-size: 14px;
      }
      .select {
        width: 70%;
        text-align: right;
      }
    }

    .order-vd {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      padding: 0 10px;
      height: 43px;
    }

    .buy-leave-mes {
      font-size: 14px;
      margin-bottom: 10px;
      .el-textarea {
        margin-top: 5px;
      }
      .label {
        margin-left: 5px;
      }

      .mes-input {
        width: 70%;
        text-align: right;
      }
    }
  }

  .order-count-div {
    background: #ffffff;
    padding: 10px;
    font-size: 14px;
    margin-bottom: 10px;
    .order-count {
      background: #ffffff;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #888;

      .pro-count {
        display: block;
      }

      .count-money {
        color: red;
      }
    }
    .subscription {
      border-top: 1px solid #e5e5e5;
      margin-top: 10px;
      .subscription-count {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: block;
          margin-top: 10px;
        }
      }
    }
  }

  .foot {
    width: 100%;
    padding: 0;
    background: #ffffff;
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    bottom: 1px;
    border-top: #e5e5e5 solid 1px;
    font-size: 14px;

    .pay-for {
      margin-left: 10px;
    }

    .count-money {
      color: red;
      font-size: 16px;
    }
    .submit {
      padding: 7px 15px;
      background: #ff7300;
      color: #ffffff;
      display: block;
      cursor: pointer;
    }
  }
  .cube-checkbox {
    padding: 0 6px;
  }
}
</style>
