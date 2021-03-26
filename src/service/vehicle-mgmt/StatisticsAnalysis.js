import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 运营车辆
  // 查询车队列表
  queryFleetList(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.MarketingCars_queryFleetList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询车辆列表
  queryCarList(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.MarketingCars_queryCarList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询驾驶员列表
  queryDriverList(params, success, fail) {
    axios
      .get(urls.vehicleMgmt.MarketingCars_queryDriverList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询运营车辆信息
  queryMarketingCarsData (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.MarketingCars_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询运营车辆图表
  queryMarketingCarsChart (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.MarketingCars_queryChart, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 运营车辆导出
  marketingCarsExport (params, success, fail) {
    window.open(urls.vehicleMgmt.MarketingCars_export + '?fleetName=' + params.fleetName + '&type=' + params.type + '&summaryMode=' + params.summaryMode + '&dateRange=' + params.dateRange);
  },
  // 查询车辆状态信息
  queryCarStateData (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarState_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 车辆状态导出
  carStateExport (params, success, fail) {
    window.open(urls.vehicleMgmt.CarState_export + '?fleetName=' + params.fleetName);
  },
  // 查询异常状态信息
  queryAbnormalData (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.AbnormalStatistics_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 异常状态导出
  abnormalExport (params, success, fail) {
    let linkedUrl = [];
    for (let name in params) {
      linkedUrl.push(`${name}=${params[name]}`);
    }
    window.open(urls.vehicleMgmt.AbnormalStatistics_export + '?' + linkedUrl.join('&'));
  },
  // 查询车速
  querySpeed (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarSpeed_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询车速图表
  querySpeedChart (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarSpeedChart_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 车辆速度导出
  speedExport (params, success, fail) {
    window.open(urls.vehicleMgmt.CarSpeed_export + '?plateNumber=' + params.plateNumber + '&speed=' + params.speed + '&dateRange=' + params.dateRange);
  },

  // 费用分析
  // 查询费用分析
  queryPayment (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarPayment_query, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询消费情况分析
  queryExpenseAnalysis (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarExpensAnalyze, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 消费占比分析
  queryExpensePropotion (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarExpensePropotion, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 同比分析
  queryExpenseYearOnYear (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarExpenseYearOnYear, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 环比分析
  queryExpenseMonthOnMonth (params, success, fail) {
    axios
      .get(urls.vehicleMgmt.CarExpenseMonthOnMonth, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
