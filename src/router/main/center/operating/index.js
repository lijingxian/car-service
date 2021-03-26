// 引入各个路由
import productMgmt from './productMgmt';
import orderMgmt from './orderMgmt';
import logisticsMgmt from './logisticsMgmt';
import refundMgmt from './refundMgmt';
import statisticsMgmt from './statisticsMgmt';
import communiMgmt from './communiMgmt';

let routes = [...productMgmt];
routes = routes.concat(orderMgmt);
routes = routes.concat(logisticsMgmt);
routes = routes.concat(refundMgmt);
routes = routes.concat(statisticsMgmt);
routes = routes.concat(communiMgmt);

export default routes;
