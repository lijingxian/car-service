// state
const state = {
  commentData: {},
  prizeData: {},
  shakeData: {},
  barrageData: {}
};

// getters
const getters = {
  commentData: state => {
    return state.commentData;
  },
  prizeData: state => {
    return state.prizeData;
  },
  shakeData: state => {
    return state.shakeData;
  },
  barrageData: state => {
    return state.barrageData;
  }
};

// mutations
const mutations = {
  updateCommentData: (state, payload) => {
    state.commentData = payload;
  },
  updatePrizeData: (state, payload) => {
    state.prizeData = payload;
  },
  updateShakeData: (state, payload) => {
    state.shakeData = payload;
  },
  updateBarrageData: (state, payload) => {
    state.barrageData = payload;
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
