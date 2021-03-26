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
        if (message.extras.type === 'COMMENT') {
          store.commit('LocalMarketing/updateCommentData', {
            attendType: '1',
            content: message.extras.content,
            id: '',
            member: {
              head: message.extras.head,
              id: '',
              mobile: '',
              nickname: '',
              userName: message.extras.from
            },
            result: '1',
            rewardAmount: ''
          });
        } else if (message.extras.type === 'SHAKE') {
          store.commit('LocalMarketing/updateShakeData', message.extras);
        } else if (message.extras.type === 'PRIZEWHEEL') {
          store.commit('LocalMarketing/updatePrizeData', message.extras);
        } else if (message.extras.type === 'BULLETSCREEN') {
          store.commit('LocalMarketing/updateBarrageData', message.extras);
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
