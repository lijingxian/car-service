
import store from '@/store';
import router from '@/router';

export default function(success, fail) {
  return function(response) {
    let data = response.data;
    if (data.resultCode === '100') {
      success(data);
    } else if (data.resultCode === '709') {
      // 未登录或登录超时
      store.commit('updateUser', { shop: {} });
      console.log('未登录: ', store.getters.currentUser);
      router.push('/login');
      // fail(data);
    } else {
      fail(data);
    }
  };
}
