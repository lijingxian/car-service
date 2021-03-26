// 引入各个路由
import carMgmt from './carMgmt';
import communicationMgmt from './communicationMgmt';
import terminalMgmt from './terminalMgmt';
import statisticsMgmt from './statisticsMgmt';
let routes = [...carMgmt];
routes = routes.concat(communicationMgmt);
routes = routes.concat(terminalMgmt);
routes = routes.concat(statisticsMgmt);
export default routes;
