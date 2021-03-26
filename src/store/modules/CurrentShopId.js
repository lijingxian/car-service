// state
const state = {
  currentShopId: ''
};

// getters
const getters = {
  currentShopId: state => {
    return state.currentShopId;
  }
};

// mutations
const mutations = {
  updateCurrentShopId: (state, payload) => {
    state.currentShopId = payload;
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
