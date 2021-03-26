// 引入各个路由
import memberMgmt from './member';
import motoristsClubDynamic from './motoristsClubDynamic';
import motoristsClubActivity from './motoristsClubActivity';
import memberAnalysis from './memberAnalysis';
let routes = [...memberMgmt];
routes = routes.concat(motoristsClubDynamic);
routes = routes.concat(motoristsClubActivity);
routes = routes.concat(memberAnalysis);
export default routes;
