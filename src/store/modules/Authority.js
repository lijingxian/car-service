// state
const state = {
  currentAuth: {}
};

// getters
const getters = {
  currentAuth: state => {
    return state.currentAuth;
  }
};

// mutations
const mutations = {
  updateAuth: (state, payload) => {
    state.currentAuth = payload;
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
