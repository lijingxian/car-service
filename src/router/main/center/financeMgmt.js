// 所有组件都要异步加载
const Paymentmgmt = resolve =>
  require(['@/pages/order/finance-mgmt/payment-mgmt/PaymentMgmt.vue'], resolve);
const RefundMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/refund-mgmt/RefundMgmt.vue'], resolve);
const StoreValueMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/store-value-mgmt/StoreValueMgmt.vue'], resolve);

const enter = [
  {
    path: 'finance',
    redirect: 'finance/refund'
  },
  // 收款管理
  {
    path: 'finance/payment',
    component: Paymentmgmt
  },
  // 退款管理
  {
    path: 'finance/refund',
    component: RefundMgmt
  },
  // 储值管理
  {
    path: 'finance/deposit',
    component: StoreValueMgmt
  }
];

export default enter;
