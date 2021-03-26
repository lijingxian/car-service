import axios from 'axios';
import Promise from './promise-finally';

import store from '@/store';
import router from '@/router';

const responseHandle = function(response) {
  return new Promise(function(resolve, reject) {
    let data = response.data;
    if (data.resultCode === '100') {
      resolve(data);
    } else if (data.resultCode === '709') {
      // 未登录或登录超时
      store.commit('updateUser', { shop: {} });
      console.log('未登录: ', store.getters.currentUser);
      router.push('/login');
      reject(data);
    } else {
      reject(data);
    }
  });
};

export default {
  async get(url, params) {
    let response = await axios.get(url, { params: params });
    return responseHandle(response);
  },
  async post(url, params) {
    let response = await axios.post(url, params);
    return responseHandle(response);
  },
  async put(url, params) {
    let response = await axios.put(url, params);
    return responseHandle(response);
  },
  async delete(url, params) {
    let response = await axios.delete(url, { data: params });
    return responseHandle(response);
  }
};
