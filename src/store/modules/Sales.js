// state
const state = {
  potentialInfo: {},
  consumerInfo: {}
};

// getters
const getters = {
  potentialInfo: state => {
    return state.potentialInfo;
  },
  consumerInfo: state => {
    return state.consumerInfo;
  }
};

// mutations
const mutations = {
  updatePotentialInfo: (state, payload) => {
    state.potentialInfo = payload;
  },
  updateConsumer: (state, payload) => {
    state.consumerInfo = payload;
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
