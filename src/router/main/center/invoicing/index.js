// 引入各个路由
import setting from './setting';
import baseData from './baseData';
import purchase from './purchase';
import storeHouse from './storeHouse';
import hypermarket from './hypermarket';
import agency from './agency';
import sale from './sale';
import supplier from './supplier';
import processSetting from './processSetting';
import statisticsMgmt from './statisticsMgmt';

let routes = [...setting];
routes = routes.concat(baseData);
routes = routes.concat(purchase);
routes = routes.concat(storeHouse);
routes = routes.concat(hypermarket);
routes = routes.concat(agency);
routes = routes.concat(sale);
routes = routes.concat(supplier);
routes = routes.concat(processSetting);
routes = routes.concat(statisticsMgmt);

export default routes;
