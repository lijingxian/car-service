import { customerService } from '@/common/urls';
import http from '@/common/http';

const state = {
  // 当前cs信息
  csData: {},
  userKetword: '',
  tabType: '',
  roomList: [],
  onlineList: {
    csList: [],
    clientList: []
  },
  sessionClientList: []
};

// getters
const getters = {
  unReadedMessageList: state => {
    let messageList = [];
    state.roomList.forEach(item => {
      messageList = messageList.concat(item.messageList.filter(message => message.isReaded === false));
    });
    return messageList;
  },
  sessionClientList: state => {
    return state.sessionClientList;
  },
  onlineList: state => {
    return state.onlineList;
  },
  tabType: state => {
    return state.tabType;
  },
  roomList: state => {
    return state.roomList;
  },
  // 过滤后的roomList
  filteredRoomList: state => {
    if (state.userKetword === '') {
      return state.roomList;
    }
    let list = [];
    for (const room of state.roomList) {
      if (room.name.indexOf(state.userKetword) !== -1) {
        list.push(room);
      }
    }
    return list;
  },
  // csList
  csList: (state, getters) => {
    let list = [];
    for (const iterator of getters.filteredRoomList) {
      if (iterator.imType === 'cs') {
        list.push(iterator);
      }
    }
    return list;
  },
  // csList online
  csListOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.csList) {
      if (iterator.isOnline === true) {
        list.push(iterator);
      }
    }
    return list;
  },
  // csList not online
  csListNotOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.csList) {
      if (iterator.isOnline === false) {
        list.push(iterator);
      }
    }
    return list;
  },
  // clientList
  clientList: (state, getters) => {
    let list = [];
    for (const iterator of getters.filteredRoomList) {
      if (iterator.imType === 'client') {
        list.push(iterator);
      }
    }
    return list;
  },
  // clientList online
  clientListOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.clientList) {
      if (iterator.isOnline === true) {
        list.push(iterator);
      }
    }
    return list;
  },
  // clientList not online
  clientListNotOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.clientList) {
      if (iterator.isOnline === false) {
        list.push(iterator);
      }
    }
    return list;
  },
  // clientEndList
  clientEndList: (state, getters) => {
    let list = [];
    for (const iterator of getters.filteredRoomList) {
      if (iterator.imType === 'clientEnd') {
        list.push(iterator);
      }
    }
    return list;
  },
  // clientEndList online
  clientEndListOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.clientEndList) {
      if (iterator.isOnline === true) {
        iterator.messageList.push({ body: { msg: '会话已结束，发送消息后重新接入', type: 'session_end' } });
        list.push(iterator);
      }
    }
    return list;
  },
  // clientEndList not online
  clientEndListNotOnline: (state, getters) => {
    let list = [];
    for (const iterator of getters.clientEndList) {
      if (iterator.isOnline === false) {
        list.push(iterator);
      }
    }
    return list;
  },
  groupList: (state, getters) => {
    let list = [];
    for (const iterator of getters.filteredRoomList) {
      if (iterator.imType === 'group') {
        list.push(iterator);
      }
    }
    return list;
  },
  activatedRoom: (state, getters) => {
    // 这里会有变化，造成activatedRoom变化，实际返回的值是OK的
    for (const iterator of getters.roomList) {
      if (iterator.activated) {
        return iterator;
      }
    }

    return {};
  },
  csData(state) {
    return state.csData;
  }
};

// mutations
const mutations = {
  updateSessionClientList(state, payload) {
    state.sessionClientList = payload;
  },
  updateTabType(state, payload) {
    state.tabType = payload.tabType;
  },
  pushRoom(state, payload) {
    if (!payload.room.pageNumber) {
      payload.room.pageNumber = 1;
    }
    state.roomList.push(payload.room);
  },
  removeRoom(state, payload) {
    let index = -1;
    for (const room of state.roomList) {
      if (room.imType === payload.imType && room.id === payload.id) {
        index = state.roomList.indexOf(room);
        break;
      }
    }
    if (index !== -1) {
      state.roomList.splice(index, 1);
      let hasActivated = false;
      for (const iterator of state.roomList) {
        if (iterator.activated) {
          hasActivated = true;
          break;
        }
      }
      if (!hasActivated) {
        if (state.roomList.length > 0) {
          state.roomList[0].activated = true;
          for (const message of state.roomList[0].messageList) {
            if (!message.isReaded) {
              message.isReaded = true;
            }
          }
        }
      }
    }
  },
  makeAactivatedRoom(state, payload) {
    console.log('makeAactivatedRoom');
    let hasActivated = false;
    for (const iterator of state.roomList) {
      if (iterator.activated) {
        hasActivated = true;
        break;
      }
    }
    if (!hasActivated) {
      if (state.roomList.length > 0) {
        state.roomList[0].activated = true;
        for (const message of state.roomList[0].messageList) {
          if (!message.isReaded) {
            message.isReaded = true;
          }
        }
      }
    }
  },
  clear(state, payload) {
    state.userKetword = '';
    state.tabType = '';
    state.roomList = [];
  },
  updateChatAreaMessage(state, payload) {
    for (const iterator of state.roomList) {
      if (iterator.activated) {
        iterator.input = payload.input;
        break;
      }
    }
  },
  changeActivatedRoom(state, payload) {
    // 释放被选中的room
    console.log('changeActivatedRoom');
    for (const iterator of state.roomList) {
      if (iterator.activated) {
        iterator.activated = false;
        break;
      }
    }
    for (const iterator of state.roomList) {
      console.log(iterator);
      if ((iterator.id === payload.id && iterator.imType === payload.imType) || (iterator.id === payload.admin && iterator.imType === payload.imType)) {
        iterator.activated = true;
        for (const message of iterator.messageList) {
          if (!message.isReaded) {
            message.isReaded = true;
          }
        }
        break;
      }
    }
  },
  updateActivatedRoomMessage(state, { id, messageList }) {
    for (const room of state.roomList) {
      if (room.imType === 'client' || room.imType === 'clientEnd') {
        if (room.id === id) {
          for (const message of messageList) {
            room.messageList.push(message);
          }
        }
      }
    }
  },
  clearActivateRoomInput(state, payload) {
    for (const iterator of state.roomList) {
      if (iterator.activated) {
        iterator.input = '';
        break;
      }
    }
  },
  newMessageFromStore(state, payload) {
    console.log(0);
    state.messageList.unshift(payload.message);
  },
  newMessageToClientList(state, payload) {
    console.log(123);
    for (let iterator of state.roomList) {
      if (iterator.imType === 'client' || iterator.imType === 'clientEnd') {
        if (payload.toId === iterator.id) {
          if (iterator.messageList.some(message => message.id === payload.id)) {
            return;
          }
          if (payload.unshift) {
            iterator.messageList.unshift(payload);
          } else {
            iterator.messageList.push(payload);
          }
          console.log('iterator.messageList' + iterator.messageList);
          if (payload.isNew) {
            setTimeout(() => {
              iterator.scrollWrapper.scrollTop =
                iterator.scrollWrapper.scrollHeight - iterator.scrollWrapper.clientHeight;
            }, 50);
          }
          break;
        }
      }
    }
  },
  newMessageToCsList(state, payload) {
    console.log(1231);
    for (let iterator of state.roomList) {
      if (iterator.imType === 'cs') {
        if (payload.toId === iterator.id) {
          if (iterator.messageList.some(message => message.id === payload.id)) {
            return;
          }
          if (payload.unshift) {
            iterator.messageList.unshift(payload);
          } else {
            iterator.messageList.push(payload);
          }
          break;
        }
      }
    }
  },
  newMessageToGroupList(state, payload) {
    for (let iterator of state.roomList) {
      if (iterator.imType === 'group') {
        if (payload.toId === iterator.id) {
          if (iterator.messageList.some(message => message.id === payload.id)) {
            return;
          }
          if (payload.unshift) {
            iterator.messageList.unshift(payload);
          } else {
            iterator.messageList.push(payload);
          }
          break;
        }
      }
    }
  },
  updateUserOnlineList(state, payload) {
    for (const room of state.roomList) {
      room.isOnline = false;
      for (const iterator of payload.userList.clientList) {
        if (room.id === iterator) {
          room.isOnline = true;
        }
      }

      for (const iterator of payload.userList.csList) {
        if (room.id === iterator) {
          room.isOnline = true;
        }
      }
    }
    state.onlineList = payload.userList;
  },
  updateUserKetword(state, payload) {
    state.userKetword = payload.userKetword;
  },
  updateClientSessionState(state, payload) {
    for (let iterator of state.roomList) {
      if (iterator.imType === 'client' || iterator.imType === 'clientEnd') {
        if (iterator.id === payload.clientId) {
          if (iterator.imType === 'client') {
            iterator.imType = 'clientEnd';
          } else {
            iterator.imType = 'client';
          }
          break;
        }
      }
    }
  },
  updateCsData(state, payload) {
    state.csData = payload.csData;
  },
  increasePageNumberAndInit(state, payload) {
    for (const room of state.roomList) {
      if (room.imType === payload.imType && room.id === payload.id) {
        room.pageNumber++;
        if (!room.hasInit) {
          room.hasInit = true;
        }
      }
    }
  }
};

// actions
const actions = {
  getHistoryList({ commit, state }, payload) {
    let params = {
      accountId: state.csData.id,
      pageNumber: 1,
      pageSize: 999
    };
    http.get(customerService.HistoryClientList, params).then(data => {
      let list = [];
      list = data.content.map(member => {
        member.imType = 'clientEnd';
        member.activated = false;
        member.input = '';
        member.isOnline = state.onlineList.clientList.includes(member.id);
        member.messageList = [];
        return member;
      });
      for (const room of list) {
        commit('pushRoom', { room });
      }
      if (payload.cb) {
        payload.cb();
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
