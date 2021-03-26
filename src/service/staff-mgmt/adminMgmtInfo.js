import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 添加
  add(params, success, fail) {
    axios
      .get(urls.staffMgmt.adminAdd, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询
  get(params, success, fail) {
    axios
      .get(urls.staffMgmt.adminSelect, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建
  create(params, success, fail) {
    axios
      .post(urls.staffMgmt.adminCreate, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新
  save(params, success, fail) {
    axios
      .put(urls.staffMgmt.adminEdit, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取运营商列表
  getCompanies(params, success, fail) {
    axios
      .get(urls.staffMgmt.getCompanyList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺列表
  getShops(params, success, fail) {
    axios
      .get(urls.staffMgmt.getShopList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺列表
  getChildShops(params, success, fail) {
    axios
      .get(urls.staffMgmt.getChildShopList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取角色列表
  getAllRoles(params, success, fail) {
    axios
      .get(urls.staffMgmt.getAllRoles, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 修改密码
  editPass(params, success, fail) {
    axios
      .put(urls.staffMgmt.editPass, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
