const state = {
  // 文章ID
  articleId: '',
  // 文章类型: 0 => 店铺宣传, 1 => 商品推广
  articleType: '0',
  // 文章状态: 0 => 已创建, 1 => 已发布
  articleState: '0',
  // 是否是从文章编辑返回文章管理, 用来在返回时恢复保存的开始/结束时间[19514]
  ifReturn: false,
  // 文章管理跳转到文章编辑时保存的开始/结束时间
  timeRange: []
};

// getters
const getters = {
  articleId: state => {
    return state.articleId;
  },
  articleType: state => {
    return state.articleType;
  },
  articleState: state => {
    return state.articleState;
  },
  ifReturn: state => {
    return state.ifReturn;
  },
  timeRange: state => {
    return state.timeRange;
  }
};

// mutations
const mutations = {
  updateArticleId: (state, payload) => {
    state.articleId = payload;
  },
  updateArticleType: (state, payload) => {
    state.articleType = payload;
  },
  updateArticleState: (state, payload) => {
    state.articleState = payload;
  },
  updateIfReturn: (state, payload) => {
    state.ifReturn = payload;
  },
  updateTimeRange: (state, payload) => {
    if (payload[0] === undefined || payload[1] === undefined) {
      state.timeRange = [];
    } else {
      state.timeRange = payload;
    }
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
