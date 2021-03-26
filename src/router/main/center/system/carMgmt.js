const BaseDataMgmt = resolve =>
  require(['@/pages/system/base-data-mgmt/BaseDataMgmt'], resolve);
const QAMgmt = resolve =>
  require(['@/pages/service/smart-reception/QaMgmt'], resolve);
const CarFaultCode = resolve =>
  require(['@/pages/system/car-fault-code-mgmt/CarFaultCodeMgmt'], resolve);
const UnknowProblem = resolve =>
  require(['@/pages/service/smart-reception/UnknowProblem'], resolve);
const enter = [
  // 基本设置
  {
    path: 'service',
    redirect: 'service/base-data'
  },
  // 基础数据
  {
    path: 'service/base-data',
    component: BaseDataMgmt
  },
  // 知识库
  {
    path: 'service/knowledge',
    redirect: 'service/knowledge/qa-mgmt'
  },
  // 问答管理
  {
    path: 'service/knowledge/qa-mgmt',
    component: QAMgmt
  },
  // 未知问题
  {
    path: 'service/knowledge/unknow-problem',
    component: UnknowProblem
  },
  // 车辆故障码
  {
    path: 'service/carFault-code',
    component: CarFaultCode
  }
];

export default enter;
