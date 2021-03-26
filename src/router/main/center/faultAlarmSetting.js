// 所有组件都要异步加载
let FaultAlarmSetting = resolve =>
  require(['@/pages/message/fault-alarm-setting/FaultAlarmSetting.vue'], resolve);

const enter = [
  // 故障告警设置
  {
    path: 'faultAlarm/car/alarm',
    component: FaultAlarmSetting
  }
];

export default enter;
