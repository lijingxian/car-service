// 所有组件都要异步加载
const Cart = resolve => require(['@/pages/invoicing/hypermarket/Cart'], resolve);
const routes = [
  {
    path: 'hypermarket/cart',
    component: Cart
  }
];

export default routes;
