<template>
  <biz-grid class="order-confirm-content">
    <div class="order-goods">
      <div v-for="(item,index) of data" :key="index">
        <div class="order-goods-div">
          <div class="goods-info">
            <span class="name">{{item.name||item.product.name}}</span>
            <div class="money-info">
              <span class="count-money">￥{{item.price||(item.product?item.product.price:'')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-info">
      <div class="select-tyle">
        <span>付款方式</span>
        <el-select v-model="form.payType" size="mini" filterable>
          <el-option v-for="payOption in payOptions" :key="payOption.value" :label="payOption.label" :value="payOption.value"></el-option>
        </el-select>
      </div>
      <div class="select-tyle">
        <span>订阅店铺</span>
        <el-select placeholder="请选择订购店铺" v-model="form.selectShop" size="mini" filterable>
          <el-option v-for="shop in shopList" :key="shop.id" :value="shop.id" :label="shop.name">
          </el-option>
        </el-select>
      </div>
      <div class="select-tyle">
        <span>优惠</span>
        <el-select placeholder="请选择优惠" v-model="form.calculate" size="mini" filterable @change="calculatePromotion">
          <el-option v-for="promotion in promotionList" :key="promotion.couponList.length>0?promotion.couponList[0].id:''" :value="promotion.couponList.length>0?promotion.couponList[0].id:''" :label="promotion.couponList.length>0?promotion.couponList[0].name:''">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="order-count-div">
      <div class="order-count">
        <span class="pro-count">产品总额</span>
        <span>￥{{amount}}</span>
      </div>
      <div class="order-count">
        <span class="pro-count">优惠</span>
        <span>-￥{{discount}}</span>
      </div>
      <div class="order-count">
        <span class="pro-count" style="color:#333;">合计</span>
        <span class="count-money">￥{{actualPayment}}</span>
      </div>
    </div>
    <div class="foot" slot="bottom">
      <p class="pay-for">
        需付款
        <span class="count-money">￥{{actualPayment}}</span>
      </p>
      <span class="submit" @click="submit">提交订单</span>
    </div>
    <el-dialog title="网上支付提示(支付完成前请不要关闭此窗口)" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" :modal="false"
      custom-class="paymentDialog" append-to-body>
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成支付
      </span>
      <span>
        若没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <span v-popover:codePop class="popover-help-text">查看帮助</span>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">支付遇到问题</el-button>
        <el-button type="primary" @click="queryOrderState" size="mini">支付完成</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import iconShop from '@/assets/images/store.png';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'order-confirm',
  data() {
    return {
      iconShop: iconShop,
      invoiceId: '',
      vfacLogo: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      payOptions: [{ label: '支付宝', value: '0' }, { label: '个人银联', value: '1' }, { label: '企业银联', value: '2' }, { label: '账户余额', value: '3' }],
      shopList: [],
      promotionList: [],
      dialogVisible: false,
      amount: '',
      actualPayment: '',
      discount: '',
      orderId: '',
      form: {
        calculate: '',
        price: 0,
        sId: '',
        // 0: 支付宝, 1: 个人银联, 2: 企业银联
        payType: '0',
        selectShop: ''
      }
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  components: { BizGrid },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(errorCode => {});
    },
    calculatePromotion(id) {
      let params = [];
      // 订购清单列表入口进入的情况
      if (this.data[0].product) {
        params = this.data.map(item => {
          return { quantity: '1', id: item.id, isMatch: '0', packageId: '', product: { id: item.product.id } };
        });
      } else {
      // 服务基本信息入口进入情况
        params = this.data.map(item => {
          return { quantity: '1', id: '', isMatch: '0', packageId: '', product: { id: item.id } };
        });
      }
      let couponIds = [];
      let couponList = [];
      this.promotionList.forEach(element => {
        element.couponList.forEach(item => {
          if (item.id === id) {
            couponList = element;
          }
        });
      });
      if (couponList.couponList) {
        couponIds = couponList.couponList.map(ele => {
          return ele.id;
        });
      }
      http
        .post('/admin/businessOrder/calculatePromotion.jhtml', { subscribeLists: params, shopId: this.form.selectShop, userId: this.getUser.id, couponIds: couponIds })
        .then(data => {
          this.amount = data.amount;
          this.discount = data.discount;
          this.actualPayment = data.actualPayment;
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_REFRESH: ', err);
        });
    },
    getShop() {
      let params = {
        sourceType: ''
      };
      http
        .get('/admin/member/json/findEShops.jhtml', params)
        .then(data => {
          this.amount = 0;
          this.shopList = data.shops;
          this.form.selectShop = this.getUser.shop.id || (data.shops.length > 0 ? data.shops[0].id : '');
          this.data.map(item => {
            this.amount = Number(item.price || item.product.price) + this.amount;
          });
          this.discount = '';
          this.actualPayment = this.amount;
          this.getPromotion();
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_REFRESH: ', err);
        });
    },
    getPromotion() {
      let params = [];
      // 订购清单列表入口进入的情况
      if (this.data[0].product) {
        params = this.data.map(item => {
          return { quantity: '1', id: item.id, isMatch: '0', packageId: '', product: { id: item.product.id } };
        });
      } else {
      // 服务基本信息入口进入情况
        params = this.data.map(item => {
          return { quantity: '1', id: '', isMatch: '0', packageId: '', product: { id: item.id } };
        });
      }
      http
        .post('/admin/businessOrder/orderCoupons.jhtml', { subscribeLists: params, shopId: this.form.selectShop, userId: this.getUser.id })
        .then(data => {
          this.form.calculate = '';
          this.promotionList = data.dataList;
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_REFRESH: ', err);
        });
    },
    submit() {
      let params = [];
      // 订购清单列表入口进入的情况
      if (this.data[0].product) {
        params = this.data.map(item => {
          return { quantity: '1', id: item.id, isMatch: '0', packageId: '', product: { id: item.product.id } };
        });
      } else {
      // 服务基本信息入口进入情况
        params = this.data.map(item => {
          return { quantity: '1', id: '', isMatch: '0', packageId: '', product: { id: item.id } };
        });
      }
      let couponIds = [];
      let couponList = [];
      this.promotionList.forEach(element => {
        element.couponList.forEach(item => {
          if (item.id === this.form.calculate) {
            couponList = element;
          }
        });
      });
      if (couponList.couponList) {
        couponIds = couponList.couponList.map(ele => {
          return ele.id;
        });
      }
      http
        .post('/admin/businessOrder/createOrder.jhtml', { subscribeLists: params, shopId: this.form.selectShop, userId: this.getUser.id, couponIds: couponIds })
        .then(data => {
          this.orderId = data.orderId;
          if (!isNaN(data.amount) && !parseFloat(data.amount)) {
            // 价格00.00
            this.freePay();
          } else {
            if (this.form.payType === '3') {
              this.accountPay();
            } else {
              if (this.form.payType === '0' && /MISE|Firefox/.test(navigator.userAgent)) {
                this.$message.warning('此浏览器不支持支付，请更换浏览器');
              }
              this.goPayPage(this.form.payType);
            }
          }
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_REFRESH: ', err);
        });
    },
    accountPay() {
      let params = { orderId: this.orderId, grade: 'platform' };
      http
        .get('/admin/order/json/accountPay.jhtml', params)
        .then(data => {
          this.$emit('refresh');
          this.$message.success('操作成功');
          this.$router.push({ path: '/union/service-mgmt/manage/order', query: {} });
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    freePay() {
      let params = { orderId: this.orderId, paymentTypeId: this.form.payType };
      http
        .post(urls.servicesMgmt.authorityService, params)
        .then(data => {
          this.$emit('refresh');
          this.$message.success('操作成功');
          this.$router.push({ path: '/union/service-mgmt/manage/order', query: {} });
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    async goPayPage(type) {
      let data = null;
      const params = { orderId: this.orderId, version: '201901' };
      try {
        if (type === '0') {
          // alipay
          data = await http.get(urls.servicesMgmt.alipayPagePay, params);
          window.open(data.response.body);
        } else if (type === '1') {
          // 个人银联
          data = await http.get(urls.servicesMgmt.unionGatePay, params);
          let newWindow = window.open('', '_blank', '');
          newWindow.document.open('text/html', 'replace');
          newWindow.opener = null;
          newWindow.document.write(data.response);
          newWindow.document.close();
        } else if (type === '2') {
          // 企业银联
          data = await http.get(urls.servicesMgmt.unionB2BPay, params);
          let newWindow = window.open('', '_blank', '');
          newWindow.document.open('text/html', 'replace');
          newWindow.opener = null;
          newWindow.document.write(data.response);
          newWindow.document.close();
        }
        this.dialogVisible = true;
        this.$emit('closePoup');
      } catch (e) {
        this.$message.warning(e.errorMessage);
        console.log('ERR_GO_PAY: ', e);
      }
    },
    // 查询订单支付情况
    async queryOrderState() {
      const params = { orderId: this.orderId, version: '201901' };
      try {
        switch (this.form.payType) {
          case '0':
            await http.get(urls.servicesMgmt.alipayQuery, params);
            break;
          case '1':
            await http.get(urls.servicesMgmt.unionGatePayQuery, params);
            break;
          case '2':
            await http.get(urls.servicesMgmt.unionB2BPayQuery, params);
            break;
          default:
            break;
        }
        this.$message.warning('支付成功');
        this.$emit('refresh');
      } catch (e) {
        this.$message.warning(e.message);
        console.log('ERR_QUERY_STATE: ', e);
      }
      this.dialogVisible = false;
    }
  },
  created() {},
  mounted() {
    this.data.length > 0 && this.getShop();
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
        width: calc(100% - 20px);
        display: flex;
        justify-content: space-between;
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
