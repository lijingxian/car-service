// 引入各个路由
import shopMgmt from './shopMgmt';
import unionMgmt from './unionMgmt';
import serviceMgmt from './serviceMgmt';
import tagMgmt from './tagMgmt';
import logMgmt from './logMgmt';
import smartReceptionMgmt from './smartReceptionMgmt';
import statisticsMgmt from './statisticsMgmt';

let routes = [...shopMgmt];
routes = routes.concat(unionMgmt);
routes = routes.concat(serviceMgmt);
routes = routes.concat(tagMgmt);
routes = routes.concat(logMgmt);
routes = routes.concat(smartReceptionMgmt);
routes = routes.concat(statisticsMgmt);

export default routes;
