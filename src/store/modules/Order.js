const state = {
  // 订单确认
  orderConfim: {
    shop: {},
    quantity: '',
    countMoney: '',
    freight: '',
    shippingMethodId: '',
    receivers: [], // 收货地址
    shippingMethods: [], // 配送方式
    curModAddress: {},
    selAddress: {},
    paymentMethods: [], // 支付方式
    couponGroups: [], // 可使用优惠券列表

    // 统一的接口
    // 商品列表
    products: [],
    // 实际付款金额
    finalPayment: '',
    // V+新增：操作店铺
    operatingShop: null
  },
  // 订单信息
  orderInfo: {
    id: '',
    amount: '',
    count: ''
  },
  invoiceInfo: [], // 发票信息
  currentInvoice: {}, // 当前需要修改的发票信息
  curInvoice: {
    invoiceState: '',
    expressState: ''
  }, // 当前开具的发票信息
  payment: {}, // 付款
  routerFrom: '', // 路由来源
  curApplySaleItem: {}, // 当前需要退货的商品信息
  curRefundsInfo: {}, // 当前需要退货商品的退货详情
  clickItemSelect: false,
  // 透明车间
  lucidLogs: []
};

// getters
const getters = {
  lucidLogs: state => state.lucidLogs,
  clickItemSelect: state => {
    return state.clickItemSelect;
  },
  orderConfim: state => {
    return state.orderConfim;
  },
  orderInfo: state => {
    return state.orderInfo;
  },
  invoiceInfo: state => {
    return state.invoiceInfo;
  },
  currentInvoice: state => {
    return state.currentInvoice;
  },
  curInvoice: state => {
    return state.curInvoice;
  },
  currentSelInvoice: state => {
    let ary = state.invoiceInfo;
    let len = ary.length;

    for (let i = 0; i < len; i++) {
      if (ary[i].isDefault === '1') {
        return ary[i];
      }
    }
  },
  defaultReceive: state => {
    let ary = state.orderConfim.receivers;
    let len = ary.length;

    for (let i = 0; i < len; i++) {
      if (ary[i].isDefault === '1') {
        return ary[i];
      }
    }
    return null;
  },
  payment: state => {
    return state.payment;
  },
  routerFrom: state => {
    return state.routerFrom;
  },
  curApplySaleItem: state => {
    return state.curApplySaleItem;
  },
  curRefundsInfo: state => {
    return state.curRefundsInfo;
  }
};

// mutations
const mutations = {
  updateShopInfo: (state, payload) => {
    state.orderConfim.shop = payload;
  },
  updateLucidLogs: (state, payload) => {
    state.lucidLogs = payload;
  },
  updateClickItemSelect: (state, payload) => {
    state.clickItemSelect = payload;
  },
  updateOrderConfim: (state, payload) => {
    state.orderConfim.quantity = payload.quantity;
    state.orderConfim.receivers = payload.receivers;
    state.orderConfim.shippingMethods = payload.shippingMethods;
    state.orderConfim.paymentMethods = payload.paymentMethods;
    state.orderConfim.couponGroups = payload.couponGroups;
  },
  updateCouponSelect: (state, payload) => {
    if (state.orderConfim && state.orderConfim.couponGroups.length) {
      state.orderConfim.couponGroups[0].couponList[0].select = true;
    }
  },
  updateProducts: (state, payload) => {
    state.orderConfim.products = payload;
  },
  updateFinalPayment: (state, payload) => {
    state.orderConfim.finalPayment = payload;
  },
  updateOperatingShop: (state, payload) => {
    state.orderConfim.operatingShop = payload;
  },
  updateSelAddress: (state, payload) => {
    state.orderConfim.selAddress = payload;
  },
  updateReceivers: (state, payload) => {
    state.orderConfim.receivers = payload;
  },
  updateOrderInfo: (state, payload) => {
    state.orderInfo = payload;
  },
  updateInvoiceInfo: (state, payload) => {
    state.invoiceInfo = payload.invoiceInfo;
  },
  updateCurrentInvoice: (state, payload) => {
    state.currentInvoice = payload;
  },
  updateCurInvoice: (state, payload) => {
    state.curInvoice = payload;
  },
  updateQuantity: (state, payload) => {
    state.orderConfim.quantity = payload.quantity;
    state.orderConfim.price = payload.price;
  },
  updateFreight: (state, payload) => {
    state.orderConfim.freight = payload.freight;
    state.orderConfim.shippingMethodId = payload.shippingMethodId;
  },
  updateCurModAddress: (state, payload) => {
    state.orderConfim.curModAddress = payload;
  },
  updateOrderId: (state, payload) => {
    state.orderInfo.id = payload;
  },
  updatePayment: (state, payload) => {
    state.payment = payload;
  },
  updatedRouterFrom: (state, payload) => {
    state.routerFrom = payload;
  },
  updateApplySaleItem: (state, payload) => {
    state.curApplySaleItem = payload;
  },
  updateRefundsInfo: (state, payload) => {
    state.curRefundsInfo = payload;
  },
  updateOrderInfoInvoice: (state, payload) => {
    state.orderInfo.invoiceTitle = payload;
  },
  updateCurInvoiceState: (state, payload) => {
    state.curInvoice.invoiceState = payload.invoiceState;
    state.curInvoice.expressState = payload.expressState;
  }
};

// actions
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
