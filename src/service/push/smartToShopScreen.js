import io from 'socket.io-client';
import store from '@/store';

export default {
  socket: null,
  resultF: null,
  async getSocket(host) {
    console.warn(host);
    this.socket = io(host, {
      query: {
        namespace: 'VPUSHWEB',
        akey: 'icar1234567890'
      }
    });

    this.socket.on('connect', () => {
      console.log('socket连接成功！');
      this.sub();
    });

    // 有新消息
    this.socket.on('pub', raw => {
      let message = JSON.parse(raw.msg);
      console.warn('pub:', message);
      if (message.type === 'notification' && message.content === 'text') {
        if (message.extras.entity === 'intelligent_access') {
          store.commit('Screen/updateScreenData', {
            id: message.extras.id
          });
        }
      }
    });
  },
  connect(host) {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.getSocket(host);
    }
  },
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    // store.commit('SessionOnline/clear');
  },
  // join room
  sub() {
    this.socket.emit('sub', store.getters.getUser.shop.id);
  }
};
