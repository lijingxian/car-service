import { dynamicRouterList, constantRouterList } from '@/routers';

const hasPermission = (authList, route) => {
  if (!route.meta) return true;
  if (!route.meta.auth) return true;
  return authList.includes(route.meta.auth);
};

const filterRoutes = (routes, authList) => {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(authList, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoutes(tmp.children, authList);
      }
      res.push(tmp);
    }
  });

  return res;
};

// state
const state = {
  routes: constantRouterList,
  addRouters: []
};

// mutations
const mutations = {
  addRoutes: (state, payload) => {
    const add = [
      {
        path: '',
        component: () => import('@/pages/layout/MainContainer'),
        children: payload,
        meta: {
          loginRequired: true
        }
      }
    ];
    state.addRouters = add;
    state.routes = constantRouterList.concat(add);
  }
};

// actions
const actions = {
  generateRoutes({ commit }, data) {
    return new Promise((resolve, reject) => {
      const { authList } = data;
      const generatedRouters = filterRoutes(dynamicRouterList, authList);
      commit('addRoutes', generatedRouters);
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
