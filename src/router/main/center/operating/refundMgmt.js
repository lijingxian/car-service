// 所有组件都要异步加载
const RefundMgmt = resolve =>
  require(['@/pages/order/finance-mgmt/refund-mgmt/RefundMgmt.vue'], resolve);
const enter = [
  {
    path: 'finance',
    redirect: 'finance/refund'
  },
  // 退款管理
  {
    path: 'finance/refund',
    component: RefundMgmt
  }
];

export default enter;
