import Vue from 'vue';

// state
const state = {
  pageType: '1',
  selectedEl: '',
  selectedType: '',
  pageStyle: {}
};

// getters
const getters = {
  pageType: state => state.pageType,
  pageStyle: state => state.pageStyle,
  selectedEl: state => state.pageStyle[`${state.pageType}`][`${state.selectedEl}`],
  selectedType: state => state.selectedType
};

// mutations
const mutations = {
  updatePageType: (state, payload) => {
    state.pageType = payload;
  },
  updatePageStyle: (state, payload) => {
    state.pageStyle = payload;
  },
  updateSelectedType: (state, payload) => {
    state.selectedType = payload;
  },
  updateSelectedEl: (state, payload) => {
    state.selectedEl = payload;
  },
  updateBrickBgType: (state, payload) => {
    Object.assign(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], { bgType: payload });
  },
  updateBrickBgColor: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'bgColor', payload);
  },
  updateBrickBgImage: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'bgImage', payload);
  },
  updateImg: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'url', payload);
  },
  updateColor: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'color', payload);
  },
  updateFontSize: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'fontSize', payload);
  },
  updateBgColor: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'backgroundColor', payload);
  },
  updateTxtContent: (state, payload) => {
    Vue.set(state.pageStyle[`${state.pageType}`][`${state.selectedEl}`], 'content', payload);
  }
};

// actions
const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
