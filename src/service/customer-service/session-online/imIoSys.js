import emoji from '@/utils/emoji';
import http from '@/common/http';
import io from 'socket.io-client';
import store from '@/store';

export default {
  socket: null,
  scroll: null,
  async getSocket() {
    let data = await http.get('/rest/store/store.jhtml');
    let userId = store.getters.currentUser.id;
    console.log('currentUser' + store.getters.currentUser.shop.id);
    let shopId = store.getters.currentUser.shop.id;
    let userInfo = store.getters.currentUser;
    this.socket = io(data.shop.im.imServer, {
      query: {
        scene: 'cs',
        id: userId,
        shopId: shopId,
        role: 'client'
      }
    });

    this.socket.on('connect', () => {
      console.log('socket连接成功！');
      let user = {
        scene: 'cs',
        id: userId,
        shopId: shopId,
        role: 'client'
      };
      this.socket.emit('/v1/cs/client-connected', user);
      // 测试用，暂时不删除

      // setTimeout(() => {
      //   store.commit('CustomService/newMessage', {
      //     message: {
      //       id: '',
      //       fromName: userInfo.userNickname,
      //       head: userInfo.headerUrl,
      //       timestamp: new Date().getTime(),
      //       body: {
      //         type: 'loading'
      //       },
      //       isMyself: true,
      //       progress: 40
      //     }
      //   });
      // }, 1000);
    });

    // 有新消息
    this.socket.on('/v1/cs/new-message', message => {
      console.log(123);
      console.log(message);
      if (message.payload.body.msg) {
        message.payload.body.msg = emoji.transform(message.payload.body.msg);
      }
      switch (message.chat_type) {
        case 'chat':
          newMessageFromChat(message);
          break;
        case 'groupchat':
          newMessageFromGroup(message);
          break;
        default:
          break;
      }
    });
    // 单聊消息
    const newMessageFromChat = message => {
      // 客户来的消息
      console.log('cccc');
      if (message.chat_with === 'client') {
        newMessageFromClient(message);
      } else {
        store.commit('CustomService/newMessageToCsList', {
          toId: store.state.user.id === message.from.id ? message.to.id : message.from.id,
          isReaded: isActivatedRoom(message.from.id, message.to.id),
          id: message.id,
          fromName: message.from.name,
          timestamp: message.timestamp,
          body: message.payload.body,
          isMyself: store.state.user.id === message.from.id
        });
      }
    };
    // 客户新消息
    const newMessageFromClient = message => {
      let hasClient = false;
      let isMyself = store.state.user.id === message.from.id;
      if (!isMyself) {
        // if (_this.playVoice) {
        //   voicePaly();
        // }
        for (const client of store.getters['CustomService/clientList']) {
          if (client.id === message.from.id) {
            hasClient = true;
            break;
          }
        }

        for (const client of store.getters['CustomService/clientEndList']) {
          if (client.id === message.from.id) {
            hasClient = true;
            store.commit('CustomService/updateClientSessionState', {
              clientId: message.from.id
            });
            break;
          }
        }
      }

      if (!isMyself && !hasClient) {
        // 新来的用户
        store.commit('CustomService/pushRoom', {
          room: {
            isOnline: true,
            imType: 'client',
            activated: false,
            head: message.from.head,
            id: message.from.id,
            name: message.from.name,
            messageList: [],
            input: ''
          }
        });
      }

      // 自己激活会话
      if (isMyself) {
        for (const client of store.getters['CustomService/clientEndList']) {
          if (client.id === message.to.id) {
            store.commit('CustomService/updateClientSessionState', {
              clientId: message.to.id
            });
            break;
          }
        }
      }
      console.log('bbbb');
      store.commit('CustomService/newMessageToClientList', {
        isReaded: isActivatedRoom(message.from.id, message.to.id),
        id:
          'message' +
          Math.random()
            .toString(36)
            .substr(-10),
        toId: isMyself ? message.to.id : message.from.id,
        fromName: message.from.name,
        timestamp: message.timestamp,
        body: message.payload.body,
        isMyself: isMyself,
        isNew: true
      });
    };
    // 群聊消息
    const newMessageFromGroup = message => {
      store.commit('CustomService/newMessageToGroupList', {
        isReaded: isActivatedRoom(message.from.id, message.to.id),
        id: message.id,
        toId: message.to.id,
        fromName: message.from.name,
        body: message.payload.body,
        timestamp: message.timestamp,
        isMyself: store.state.user.id === message.from.id
      });
    };

    const isActivatedRoom = (fromId, toId) => {
      return fromId === store.state.user.id ? true : store.getters['CustomService/activatedRoom'].id === fromId;
    };
    // 在线成员变化,注意聊天列表变化更新
    this.socket.on('/v1/cs/user-list-change', ({ userList }) => {
      console.log('在线用户change：', userList);
      store.commit('CustomService/updateUserOnlineList', {
        userList
      });
    });

    // session状态变化,注意聊天列表变化更新
    this.socket.on('/v1/cs/session-change', sessionList => {
      console.log('session变化', sessionList);
      let clientList = [];
      for (const iterator of sessionList) {
        clientList.push(iterator.clientId);
      }
      store.commit('CustomService/updateSessionClientList', clientList);
    });

    // 超时结束session
    this.socket.on('/v1/cs/end-session', ({ id, clientId }) => {
      console.log('超时结束session：');
      store.commit('CustomService/newMessageToClientList', {
        isReaded: true,
        id:
          'end-session' +
          Math.random()
            .toString(36)
            .substr(-10),
        toId: clientId,
        fromName: '',
        body: {
          msg: '会话已结束，发送消息后重新接入', // 消息内容
          type: 'session_end' // 文本消息类型
        },
        isMyself: false
      });
      store.commit('CustomService/updateClientSessionState', {
        clientId: clientId
      });
    });
    // 评价邀请
    this.socket.on('/v1/cs/evaluation-app', message => {
      message.payload.body.hasEvaluate = false;
      newMessageSave(message);
    });

    // 消息记录
    this.socket.on('/v1/cs/client/client-get-messages', payload => {
      console.log('消息记录');
      // if (payload.dataList.length === 0) {
      //   this.scroll.forceUpdate();
      // }
      // for (const message of payload.dataList) {
      //   handleSavedMessage(message);
      //   handleMessage(message);
      //   saveSavedMessage(message);
      // }
      // let chatType = payload.chatType;
      let list = payload.dataList;

      for (const message of list) {
        if (message.body.msg) {
          message.body.msg = emoji.transform(message.body.msg);
        }
      }
      // let room = [...store.getters['CustomService/clientList'], ...store.getters['CustomService/clientEndList']].find(room => {
      //   return room.id === toId;
      // });
      // if (list.length === 0) {
      //   room.scroll.complete();
      //   return;
      // }

      for (const message of list) {
        store.commit('CustomService/newMessageToClientList', {
          unshift: true,
          isReaded: true,
          id: message.id,
          toId: message.toId,
          fromName: message.fromMember.name,
          body: message.body,
          timestamp: message.timestamp,
          isMyself: message.fromMember.isService === '1' || !message.fromId || store.state.user.id === message.fromId
        });
      }

      // room.scroll.loaded();
    });

    // 客户新消息
    const newMessageSave = message => {
      store.commit('CustomService/newMessage', {
        message: {
          id: message.isMyself ? message.to.id : message.from.id,
          fromName: message.from.name,
          head: message.isMyself ? userInfo.headerUrl || '' : message.from.head,
          timestamp: message.timestamp,
          body: message.payload.body,
          isMyself: message.isMyself
        }
      });
    };
  },
  connect(scroll) {
    if (!this.scroll) {
      this.scroll = scroll;
    }
    if (this.socket) {
      this.socket.connect();
    } else {
      this.getSocket();
    }
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('socket断开成功！');
    }
  },
  // 发送消息
  sendMessage(message) {
    console.log(2222);
    this.socket.emit('/v1/cs/new-message-from-client', message);
  },
  // 发送评价
  sendEvaluate(message) {
    this.socket.emit('/v1/cs/evaluation-result', message);
  },
  // 请求聊天记录
  getMessageList(params) {
    this.socket.emit('/v1/cs/client-get-messages', params);
  }
};
