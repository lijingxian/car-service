// state
const state = {
  ifRouteListChanged: false,
  activePath: '',
  routes: [],
  router: ''
};

// getters
const getters = {
  activePath: state => {
    return state.activePath;
  },
  routes: state => {
    return state.routes;
  },
  router: state => {
    return state.router;
  },
  ifRouteListChanged: state => {
    return state.ifRouteListChanged;
  }
};

// mutations
const mutations = {
  updateActivePath: (state, payload) => {
    if (state.activePath !== payload.activePath) {
      state.activePath = payload.activePath;
    }
  },
  updateRoutes: (state, payload) => {
    state.routes = payload.routes || [];
    state.ifRouteListChanged = !state.ifRouteListChanged;
  },
  updateRouter: (state, payload) => {
    state.router = payload.router || '';
  }
};

// actions
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
