// 引入各个路由
import routes from './center';
import Home from '@/pages/home/HomeNew';
import MainContainer from '@/pages/layout/MainContainer';
const AboutUs = resolve => require(['@/pages/home/AboutUs'], resolve);
const HypermarketMgmt = resolve => require(['@/pages/invoicing/hypermarket/HypermarketMgmt'], resolve);
const NotFound = resolve => require(['@/pages/home/404'], resolve);
const Scheduler = resolve => require(['@/pages/test/Scheduler'], resolve);
let children = [
  {
    path: '',
    component: Home
  },
  {
    path: '/union',
    component: MainContainer,
    children: routes.union
  },
  {
    path: '/oa',
    component: MainContainer,
    children: routes.oa
  },
  {
    path: '/car',
    component: MainContainer,
    children: routes.car
  },
  {
    path: '/operating',
    component: MainContainer,
    children: routes.operating
  },
  {
    path: '/service',
    component: MainContainer,
    children: routes.service
  },
  {
    path: '/marketing',
    component: MainContainer,
    children: routes.marketing
  },
  {
    path: '/member',
    component: MainContainer,
    children: routes.member
  },
  {
    path: '/message',
    component: MainContainer,
    children: routes.message
  },
  {
    path: '/sales',
    component: MainContainer,
    children: routes.sales
  },
  {
    path: '/after-sale',
    component: MainContainer,
    children: routes.afterSale
  },
  {
    path: '/invoicing',
    component: MainContainer,
    children: routes.invoicing
  },
  {
    path: '/finance',
    component: MainContainer,
    children: routes.finance
  },
  {
    path: '/system',
    component: MainContainer,
    children: routes.system
  },
  {
    path: '/admin',
    component: MainContainer,
    children: routes.admin
  },
  {
    path: '/about',
    component: AboutUs
  },
  {
    path: '/help',
    component: MainContainer,
    children: routes.help
  },
  {
    path: '/hypermarket',
    component: HypermarketMgmt
  },
  {
    path: '/system/log/scheduler',
    component: Scheduler
  },
  {
    path: '/test',
    component: MainContainer,
    children: routes.test
  },
  // 404NotFound
  {
    path: '*',
    component: NotFound
  }
];

export default children;
