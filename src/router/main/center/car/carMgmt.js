// 所有组件都要异步加载
let VehicleMgmtNav = resolve =>
  require(['@/pages/operating/vehicle-mgmt/VehicleMgmtNav.vue'], resolve);
let VehicleMgmtAllVehicle = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/VehicleMgmtAllVehicle.vue'
  ], resolve);
let VehicleMgmtMotorcade = resolve =>
  require(['@/pages/operating/vehicle-mgmt/VehicleMgmtMotorcade.vue'], resolve);
let VehicleMgmtCost = resolve =>
  require(['@/pages/operating/vehicle-mgmt/VehicleMgmtCost.vue'], resolve);
// 签到管理
let VehicleMgmtSignUp = resolve =>
  require(['@/pages/operating/vehicle-mgmt/VehicleMgmtSignUp.vue'], resolve);
let VehicleComplaint = resolve =>
  require(['@/pages/operating/vehicle-mgmt/vehicle-complaint/VehicleComplaintMgmt.vue'], resolve);
// 统计分析
// 运营车辆
let MarketingCars = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/statistics-analysis/MarketingCars.vue'
  ], resolve);
// 车辆状态
let CarState = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/statistics-analysis/CarState.vue'
  ], resolve);
// 车辆速度
let CarSpeed = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/statistics-analysis/CarSpeed.vue'
  ], resolve);
// 异常用车
let AbnormalStatistics = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/statistics-analysis/AbnormalStatistics.vue'
  ], resolve);
// 费用分析
let PaymentAnalysis = resolve =>
  require([
    '@/pages/operating/vehicle-mgmt/statistics-analysis/PaymentAnalysis.vue'
  ], resolve);

const enter = [
  // 全部车辆
  {
    path: '',
    component: VehicleMgmtNav
  },
  // 全部车辆
  {
    path: 'vehicle-mgmt/vehicle',
    component: VehicleMgmtAllVehicle
  },
  // 全部车队
  {
    path: 'vehicle-mgmt/fleet',
    component: VehicleMgmtMotorcade
  },
  // 车队
  {
    name: 'vehicle-mgmt-motorcade-vehicle',
    path: 'vehicle-mgmt/fleet/:groupId',
    component: VehicleMgmtAllVehicle
  },
  // 车队费用
  {
    name: 'vehicle-mgmt-cost',
    path: 'vehicle-mgmt/cost/:groupId',
    component: VehicleMgmtCost
  },
  // 签到管理
  {
    path: 'vehicle-mgmt/signup',
    component: VehicleMgmtSignUp
  },
  // 统计分析
  {
    path: 'vehicle-mgmt/statistics-analysis',
    redirect: 'vehicle-mgmt/statistics-analysis/marketing-cars'
  },
  // 运营车辆
  {
    path: 'vehicle-mgmt/statistics-analysis/marketing-cars',
    component: MarketingCars
  },
  // 车辆状态
  {
    path: 'vehicle-mgmt/statistics-analysis/car-state',
    component: CarState
  },
  // 车辆速度
  {
    path: 'vehicle-mgmt/statistics-analysis/car-speed',
    component: CarSpeed
  },
  // 异常用车
  {
    path: 'vehicle-mgmt/statistics-analysis/abnormal',
    component: AbnormalStatistics
  },
  // 费用分析
  {
    path: 'vehicle-mgmt/statistics-analysis/payment',
    component: PaymentAnalysis
  },
  // 车辆管理导航
  {
    path: 'vehicle-mgmt',
    component: VehicleMgmtNav
  },
  // 车辆申诉管理
  {
    path: 'vehicle-mgmt/vehicle-complaint',
    component: VehicleComplaint
  }
];

export default enter;
