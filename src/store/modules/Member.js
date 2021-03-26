// state
const state = {
  curDetailDataParam: {},
  canGoBack: false
};

// getters
const getters = {
  curDetailDataParam: state => {
    return state.curDetailDataParam;
  },
  curCanGoBack: state => {
    return state.canGoBack;
  }
};

// mutations
const mutations = {
  updateCurDetailDataParam: (state, payload) => {
    state.curDetailDataParam = payload;
  },
  updateCanGoBack: (state, payload) => {
    state.curCanGoBack = payload;
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
