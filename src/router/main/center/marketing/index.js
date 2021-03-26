// 引入各个路由
import activityMgmt from './activityMgmt';
import contentMgmt from './contentMgmt';
import marketingMgmt from './marketing';
import marketingStatistics from './marketingStatistics';
let routes = [...activityMgmt];
routes = routes.concat(activityMgmt);
routes = routes.concat(contentMgmt);
routes = routes.concat(marketingMgmt);
routes = routes.concat(marketingStatistics);
export default routes;
