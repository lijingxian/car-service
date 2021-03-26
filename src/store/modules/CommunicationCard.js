const state = {
  currentPackage: {
    packageId: '',
    operatorName: '',
    packageNumber: ''
  }
};

// getters
const getters = {
  currentPackage: state => {
    return state.currentPackage;
  }
};

// mutations
const mutations = {
  updateCurrentPackage: (state, payload) => {
    state.currentPackage = payload;
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
