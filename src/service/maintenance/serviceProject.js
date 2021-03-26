import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取服务项目列表
  getServiceProjectList(params, success, fail) {
    axios
      .get(urls.maintenance.serviceProjectList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取服务项目信息
  getServiceProject(params, success, fail) {
    axios
      .get(urls.maintenance.serviceProject, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建服务项目
  createServiceProject(params, success, fail) {
    axios
      .post(urls.maintenance.serviceProject, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新服务项目
  updateServiceProject(params, success, fail) {
    axios
      .put(urls.maintenance.serviceProject, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除服务项目
  deleteServiceProject(params, success, fail) {
    axios
      .delete(urls.maintenance.serviceProject, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 从平台导入服务项目
  importFromPlatform(params, success, fail) {
    axios
      .post(urls.maintenance.importFromPlatform, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 根据导入Excle返回的url获取结果
  importFromExcel(params, success, fail) {
    axios
      .post(urls.maintenance.importFromExcel, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },

  // 从平台导入
  importBooklet(params, success, fail) {
    axios
      .post(urls.maintenance.importBooklet, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getPlatformService(params, success, fail) {
    axios
      .get(urls.maintenance.platformService, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取所有服务项目
  getServiceProjectAllList(params, success, fail) {
    axios
      .get(urls.maintenance.serviceProjectAllList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取维保记录列表
  getServiceList(params, success, fail) {
    axios
      .get(urls.maintenance.queryOrderList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取服务手册列表
  getServiceHandbookList(params, success, fail) {
    axios
      .get(urls.maintenance.serviceHandbookList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 添加服务手册
  createServiceHandbook(params, success, fail) {
    axios
      .post(urls.maintenance.serviceHandbook, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取服务手册
  getServiceHandbook(params, success, fail) {
    axios
      .get(urls.maintenance.serviceHandbook, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新服务手册
  updateServiceHandbook(params, success, fail) {
    axios
      .put(urls.maintenance.serviceHandbook, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除服务手册
  deleteServiceHandbook(params, success, fail) {
    axios
      .delete(urls.maintenance.serviceHandbook, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 导入服务手册
  importServiceHandbook(params, success, fail) {
    axios
      .post(urls.maintenance.importServiceHandbook, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取车型
  getMotorcycleType(params, success, fail) {
    axios
      .get(urls.maintenance.MotorcycleType, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 添加车型
  CreateMotorcycleType(params, success, fail) {
    axios
      .post(urls.maintenance.CreateMotorcycleType, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取救援机构列表
  getRescueOrgList(params, success, fail) {
    axios
      .get(urls.maintenance.RescueOrgList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建救援机构
  createRescueOrg(params, success, fail) {
    axios
      .post(urls.maintenance.RescueOrg, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取救援机构
  getRescueOrg(params, success, fail) {
    axios
      .get(urls.maintenance.RescueOrg, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新救援机构
  updateRescueOrg(params, success, fail) {
    axios
      .put(urls.maintenance.RescueOrg, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除救援机构
  deleteRescueOrg(params, success, fail) {
    axios
      .delete(urls.maintenance.RescueOrg, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取服务手册的保养项目
  getUpkeepList(params, success, fail) {
    // success({
    // });
    // axios
    //   .get(urls.maintenance.MotorcycleType, { params: params })
    //   .then(responseHandle(success, fail))
    //   .catch(error => {
    //     console.error(error);
    //   });
  },
  // 平台保养列表
  listMaintainBooklet(params, success, fail) {
    axios
      .get(urls.maintenance.listMaintainBooklet, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 平台保养查询
  maintainBookletQuery(params, success, fail) {
    axios
      .get(urls.maintenance.maintainBooklet, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 平台保养更新
  maintainBookletUpdate(params, success, fail) {
    axios
      .put(urls.maintenance.maintainBooklet, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 平台保养创建
  maintainBookletCreate(params, success, fail) {
    axios
      .post(urls.maintenance.maintainBooklet, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 平台保养删除
  maintainBookletDelete(params, success, fail) {
    axios
      .delete(urls.maintenance.maintainBooklet, { data: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryBrandList(params, success, fail) {
    axios
      .get(urls.maintenance.queryBrandList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySeriesList(params, success, fail) {
    axios
      .get(urls.maintenance.querySeriesList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryModeList(params, success, fail) {
    axios
      .get(urls.maintenance.queryModeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySysBrandList(params, success, fail) {
    axios
      .get(urls.maintenance.brandList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySysSeriesList(params, success, fail) {
    axios
      .post(urls.maintenance.seriesList, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  querySysModeList(params, success, fail) {
    axios
      .post(urls.maintenance.modelList, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listCarType(params, success, fail) {
    axios
      .get(urls.maintenance.queryModeList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  baseData(params, success, fail) {
    axios
      .get(urls.maintenance.baseData, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  bookletbaseData(params, success, fail) {
    axios
      .get(urls.maintenance.bookletbaseData, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  bookletShopData(params, success, fail) {
    axios
      .get(urls.maintenance.bookletShopData, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryImportProgress(params, success, fail) {
    axios
      .get(urls.maintenance.queryImportProgress, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryImportBaseProgress(params, success, fail) {
    axios
      .get(urls.maintenance.queryImportBaseProgress, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
