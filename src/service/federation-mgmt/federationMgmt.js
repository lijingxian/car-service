import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  // 获取店铺或运营商列表
  getNavInfo(params, success, fail) {
    axios
      .get(urls.federationMgmt.nav, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺或运营商列表
  list(params, success, fail) {
    axios
      .get(urls.federationMgmt.List_storeOrOperator, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺或运营商列表
  listMap(params, success, fail) {
    axios
      .get(urls.federationMgmt.List_storeOrOperator_Map, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取上级店铺和运营商
  parentCompanyAndStore(params, success, fail) {
    axios
      .get(urls.federationMgmt.parentCompanyAndStore, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 查询店铺或运营商列表
  query(params, success, fail) {
    axios
      .get(urls.federationMgmt.storeOrOperatorInfo, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新店铺或运营商
  update(params, success, fail) {
    axios
      .put(urls.federationMgmt.storeOrOperatorInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建店铺或运营商
  add(params, success, fail) {
    axios
      .post(urls.federationMgmt.storeOrOperatorInfo, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 启用禁用店铺
  active(params, success, fail) {
    axios
      .get(urls.federationMgmt.opera, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新店铺或运营商
  updateOperator(params, success, fail) {
    axios
      .put(urls.federationMgmt.operator, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 创建店铺或运营商
  addOperator(params, success, fail) {
    axios
      .post(urls.federationMgmt.operator, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 删除店铺或运营商
  delete(params, success, fail) {
    axios
      .delete(urls.federationMgmt.storeOrOperatorInfo, {
        data: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺介绍
  queryIntroduce(params, success, fail) {
    axios
      .get(urls.federationMgmt.introduce, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取添加店铺列表
  listAdditiveStore(params, success, fail) {
    axios
      .get(urls.federationMgmt.listAdditiveStore, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 更新店铺介绍
  updateIntroduce(params, success, fail) {
    axios
      .post(urls.federationMgmt.introduce, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取店铺支付方式
  getPayments(params, success, fail) {
    function makeData(originalData) {
      console.log(originalData);
      return originalData.content.map(item => {
        // if(item.method=='0'||item.method=='2'){
        //   item.isDisabled = true
        //   item.valid = '1'
        // }else{
        //   item.isDisabled = false
        // }
        return item;
      });
    }
    axios
      .get(urls.federationMgmt.paymentMethodShopList, {
        params: {
          shopId: params.shopId || ''
        }
      })
      .then(responseHandle(success, fail, makeData))
      .catch(error => {
        console.error(error);
      });
  },
  // 保存店铺支付方式
  editPayments(paymentMethods, success, fail) {
    function makeData(originalData) {
      return originalData;
    }
    let formData = new FormData();
    formData.append('paymentMethods', JSON.stringify(paymentMethods));
    axios
      .post(urls.federationMgmt.updatePaymentShopMethods, formData, {})
      .then(responseHandle(success, fail, makeData))
      .catch(error => {
        console.error(error);
      });
  },
  // 获取vr资源
  getVrAsset(params, success, fail) {
    axios
      .get(urls.federationMgmt.search, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 店铺上传多个图片 文件
  uploadShopPictures(params, success, fail) {
    let upAdata = {
      medialist: params.vrlist
    };
    let data = {
      shopId: params.shopId,
      vrlist: JSON.stringify(upAdata)
    };
    axios
      .post(urls.federationMgmt.uploadPictures, data)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  uploadShopZip(params, success, fail) {
    let that = this;
    let data = new FormData();
    data.append('shopId', params.shopId);
    data.append('multipartFile', params.file);
    axios
      .post(urls.federationMgmt.uploadZip, data, {
        timeout: 9000000,
        progress(e) {
          // console.log(~~(e.loaded*100/e.total)/100)
          that.vr_data = ~~((e.loaded * 100) / e.total);
        }
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  // 统计分析
  queryKpi(params, success, fail) {
    axios
      .get(urls.federationMgmt.statisticsAnalysis, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
