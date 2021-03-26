// state
const state = {
  screenData: {}
};

// getters
const getters = {
  screenData: state => {
    return state.screenData;
  }
};

// mutations
const mutations = {
  updateScreenData: (state, payload) => {
    state.screenData = payload;
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
