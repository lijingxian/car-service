// 所有组件都要异步加载
const ShopKpiReport = resolve =>
  require(['@/pages/operating/static-analysis/ShopStaticAnalisis'], resolve);
const PackageKpiReport = resolve =>
  require(['@/pages/operating/static-analysis/PackageStaticAnalisis'], resolve);
const CardKpiReport = resolve =>
  require(['@/pages/operating/static-analysis/CardStaticAnalisis'], resolve);
// const VehicleStaticAnalisis = resolve =>
//   require(['@/pages/operating/static-analysis/VehicleStaticAnalisis'], resolve);
const OperatorStaticAnalisis = resolve =>
  require(['@/pages/operating/static-analysis/ShopStaticAnalisis'], resolve);
const GeneralViewAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/car-base-info/GeneralViewAnalysis'], resolve);
const ConditionViewAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/car-condition/GeneralViewAnalysis'], resolve);
const ActionViewAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/car-drive-action/GeneralViewAnalysis'], resolve);
const SingleViewAnalysis = resolve =>
  require(['@/pages/operating/static-analysis-new/car-single/GeneralViewAnalysis'], resolve);
// 终端分析
let GeneralViewTerminal = resolve =>
  require(['@/pages/operating/static-analysis-new/terminal/GeneralViewAnalysis.vue'], resolve);
const enter = [
  {
    path: 'statistics-analysis/terminal-statistics',
    component: GeneralViewTerminal
  },
  {
    path: 'statistics-analysis',
    redirect: 'statistics-analysis/vehicleStatic'
  },
  {
    path: 'statistics-analysis/fleet',
    redirect: 'statistics-analysis/fleet/mileageOil'
  },
  {
    path: 'statistics-analysis/card',
    redirect: 'statistics-analysis/card/card'
  },
  {
    path: 'statistics-analysis/shop',
    component: ShopKpiReport
  },
  {
    path: 'statistics-analysis/vehicleStatic',
    component: GeneralViewAnalysis
  },
  {
    path: 'statistics-analysis/operator',
    component: OperatorStaticAnalisis
  },
  {
    path: 'statistics-analysis/card/card',
    component: CardKpiReport
  },
  {
    path: 'statistics-analysis/card/package',
    component: PackageKpiReport
  },
  {
    path: 'statistics-analysis/vehicleStatic/generalViewAnalysis',
    component: GeneralViewAnalysis
  },
  {
    path: 'statistics-analysis/vehicleStatic/conditionViewAnalysis',
    component: ConditionViewAnalysis
  },
  {
    path: 'statistics-analysis/vehicleStatic/actionViewAnalysis',
    component: ActionViewAnalysis
  },
  {
    path: 'statistics-analysis/vehicleStatic/singleViewAnalysis',
    component: SingleViewAnalysis
  }
];

export default enter;
