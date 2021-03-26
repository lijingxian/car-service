import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import CommunicationCard from './modules/CommunicationCard';
import SessionOnline from './modules/SessionOnline';
import CustomService from './modules/CustomService';
import ShopPublicity from './modules/ShopPublicity';
import Menu from './modules/Menu';
import CurrentShopId from './modules/CurrentShopId';
import Authority from './modules/Authority';
import Sales from './modules/Sales';
import Member from './modules/Member';
import Order from './modules/Order';
import LocalMarketing from './modules/LocalMarketing';
import Screen from './modules/Screen';
import Site from './modules/Site';
import TemplateEditor from './modules/TemplateEditor';
import PendingMessage from './modules/PendingMessage';
Vue.use(Vuex);

const state = {
  user: {}
};

export default new Vuex.Store({
  strict: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    CommunicationCard,
    SessionOnline,
    CustomService,
    ShopPublicity,
    Menu,
    CurrentShopId,
    Authority,
    Sales,
    Member,
    Order,
    LocalMarketing,
    Screen,
    Site,
    TemplateEditor,
    PendingMessage
  }
});
