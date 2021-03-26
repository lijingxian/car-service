import io from 'socket.io-client';
import store from '@/store';
import emoji from '@/utils/emoji';
import http from '@/common/http';
import urls from '@/common/urls';
import ding from '@/assets/images/ding.mp3';

const audio = new Audio(ding);
function voicePaly() {
  // 循环播放，播放结束继续播放
  audio.play();
}

export default {
  socket: null,
  resultF: null,
  playVoice: true,
  async getSocket() {
    let _this = this;
    let hostData = await http.get(urls.customerService.Host);
    console.log(hostData);
    // 不同的namespace
    // 118.24.43.226
    this.socket = io(hostData.content, {
      // 实际使用中可以在这里传递参数
      query: {
        scene: 'cs',
        role: 'cs',
        id: store.state.user.id,
        shopId: store.state.user.shop.id
      }
    });

    this.socket.on('connect', () => {
      console.log('socket连接成功！');
    });

    this.socket.on('disconnect', () => {
      console.log('socket断开成功！');
      this.socket = null;
      store.commit('SessionOnline/clear');
    });

    // 有新消息
    this.socket.on('/v1/cs/new-message', message => {
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

    // 有查询消息
    this.socket.on('/v1/cs/cs/cs-get-messages', payload => {
      let chatType = payload.chatType;
      let toId = payload.toId;
      let list = payload.dataList;

      for (const message of list) {
        if (message.body.msg) {
          message.body.msg = emoji.transform(message.body.msg);
        }
      }

      // 客服和客服
      if (chatType === '0') {
        let room = [...store.getters['SessionOnline/csListOnline'], ...store.getters['SessionOnline/csListNotOnline']].find(
          room => {
            return room.id === toId;
          }
        );
        if (list.length === 0) {
          room.scroll.complete();
          return;
        }
        for (const message of list) {
          store.commit('SessionOnline/newMessageToCsList', {
            unshift: true,
            toId: toId,
            isReaded: true,
            id: message.id,
            fromName: message.fromMember.name,
            timestamp: message.timestamp,
            body: message.body,
            isMyself: store.state.user.id === message.fromId
          });
        }
        room.scroll.loaded();
        // 群消息
      } else if (chatType === '1') {
        let room = store.getters['SessionOnline/groupList'].find(room => {
          return room.id === toId;
        });
        if (list.length === 0) {
          room.scroll.complete();
          return;
        }

        for (const message of list) {
          store.commit('SessionOnline/newMessageToGroupList', {
            unshift: true,
            isReaded: true,
            id: message.id,
            toId: toId,
            fromName: message.fromMember.name,
            body: message.body,
            timestamp: message.timestamp,
            isMyself: store.state.user.id === message.fromId
          });
        }
        room.scroll.loaded();
        // 客户消息
      } else if (chatType === '2') {
        let room = [...store.getters['SessionOnline/clientList'], ...store.getters['SessionOnline/clientEndList']].find(room => {
          return room.id === toId;
        });
        if (list.length === 0) {
          room.scroll.complete();
          return;
        }

        for (const message of list) {
          store.commit('SessionOnline/newMessageToClientList', {
            unshift: true,
            isReaded: true,
            id: message.id,
            toId: toId,
            fromName: message.fromMember.name,
            body: message.body,
            timestamp: message.timestamp,
            isMyself: message.fromMember.isService === '1' || !message.fromId || store.state.user.id === message.fromId
          });
        }

        room.scroll.loaded();
      }
    });

    // 在线成员变化,注意聊天列表变化更新
    this.socket.on('/v1/cs/user-list-change', ({ userList }) => {
      console.log('在线用户change：', userList);
      store.commit('SessionOnline/updateUserOnlineList', {
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
      store.commit('SessionOnline/updateSessionClientList', clientList);
    });

    // 超时结束session
    this.socket.on('/v1/cs/end-session', ({ id, clientId }) => {
      console.log('超时结束session：');
      store.commit('SessionOnline/newMessageToClientList', {
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
      store.commit('SessionOnline/updateClientSessionState', {
        clientId: clientId
      });
    });

    // 转入
    this.socket.on('/v1/cs/roll-out', ({ clientId, csId, reasonValue, from, reasonName, name, head }) => {
      store.commit('SessionOnline/pushRoom', {
        room: {
          imType: 'client',
          activated: false,
          head: head,
          id: clientId,
          name: name,
          messageList: [],
          input: ''
        }
      });

      store.commit('SessionOnline/newMessageToClientList', {
        isReaded: true,
        id:
          'roll-out' +
          Math.random()
            .toString(36)
            .substr(-10),
        toId: clientId,
        fromName: '',
        body: {
          msg: '转出人：' + from.name + '，转出原因：' + reasonName, // 消息内容
          type: 'roll-out' // 文本消息类型
        },
        isMyself: false
      });
    });

    // 转出结果
    this.socket.on('/v1/cs/roll-out-result', ({ result }) => {
      this.resultF(result);
    });

    // 单聊消息
    const newMessageFromChat = message => {
      // 客户来的消息
      console.log('cccc');
      if (message.chat_with === 'client') {
        newMessageFromClient(message);
      } else {
        store.commit('SessionOnline/newMessageToCsList', {
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
        if (_this.playVoice) {
          voicePaly();
        }
        for (const client of store.getters['SessionOnline/clientList']) {
          if (client.id === message.from.id) {
            hasClient = true;
            break;
          }
        }

        for (const client of store.getters['SessionOnline/clientEndList']) {
          if (client.id === message.from.id) {
            hasClient = true;
            store.commit('SessionOnline/updateClientSessionState', {
              clientId: message.from.id
            });
            break;
          }
        }
      }

      if (!isMyself && !hasClient) {
        // 新来的用户
        store.commit('SessionOnline/pushRoom', {
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
        for (const client of store.getters['SessionOnline/clientEndList']) {
          if (client.id === message.to.id) {
            store.commit('SessionOnline/updateClientSessionState', {
              clientId: message.to.id
            });
            break;
          }
        }
      }
      console.log('bbbb');
      store.commit('SessionOnline/newMessageToClientList', {
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
      store.commit('SessionOnline/newMessageToGroupList', {
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
      return fromId === store.state.user.id ? true : store.getters['SessionOnline/activatedRoom'].id === fromId;
    };
  },
  connect() {
    if (!this.socket) {
      this.getSocket();
    }
  },
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    store.commit('SessionOnline/clear');
  },
  // join room
  joinRoom(id) {
    this.socket.emit('/v1/cs/join-room', {
      roomId: id
    });
  },
  // 发送消息
  sendMessage(message) {
    console.log('message' + message);
    this.socket.emit('/v1/cs/new-message-from-cs', message);
  },
  // 店铺向平台管理员发送消息
  sendMessagePlateForm(message) {
    console.log('message' + message);
    this.socket.emit('/v1/cs/new-message-from-client', message);
  },
  // 发送评价邀请
  sendEvaluation(message) {
    store.commit('SessionOnline/newMessageToClientList', {
      isReaded: true,
      id:
        'evaluation' +
        Math.random()
          .toString(36)
          .substr(-10),
      toId: message.clientId,
      fromName: '',
      body: {
        msg: '已发送评价邀请', // 消息内容
        type: 'evaluation' // 文本消息类型
      },
      isMyself: false
    });
    this.socket.emit('/v1/cs/cs-evaluation', message);
  },
  // 发送会话结束
  dispatcherSession(clientId) {
    this.socket.emit('/v1/cs/end-session', {
      clientId: clientId
    });
  },
  // 发送转出
  dispatcherRollOut(payload, resultF) {
    this.resultF = resultF;
    this.socket.emit('/v1/cs/roll-out', payload);
  },
  // 请求聊天记录
  getMessageList(params) {
    this.socket.emit('/v1/cs/cs-get-messages', params);
  },
  switchVoice(playVoice) {
    this.playVoice = playVoice;
  }
};
