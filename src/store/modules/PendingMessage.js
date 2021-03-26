// state
const state = {
  pendingMessage: { isExsit: false }
};

// getters
const getters = {
  pendingMessage: state => {
    return state.pendingMessage;
  }
};

// mutations
const mutations = {
  updatePendingMessage: (state, payload) => {
    state.pendingMessage = payload;
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
