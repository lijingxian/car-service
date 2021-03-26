// 引入各个路由
import systemMgmt from './systemMgmt';
import marketingMgmt from './marketingMgmt';
import unionMgmt from './unionMgmt';
import saleMgmt from './saleMgmt';
import carMgmt from './carMgmt';
let routes = [...systemMgmt];
routes = routes.concat(marketingMgmt);
routes = routes.concat(unionMgmt);
routes = routes.concat(saleMgmt);
routes = routes.concat(carMgmt);
export default routes;
