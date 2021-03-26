const defaultPacketStyle = {
  // 首页样式
  '1': {
    // 背景
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/抽奖.jpg')
    },
    // 页面中间图片
    img: {
      url: require('@/assets/images/activity-template/红包.png')
    },
    btn: {
      fontSize: '14px',
      color: '#624326',
      backgroundColor: '#fdb71b'
    }
  },
  // 抢红包成功样式
  '2': {
    // 背景
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/中奖.jpg')
    },
    // 页面中间图片
    img: {
      url: require('@/assets/images/activity-template/中奖红包.png')
    },
    btn: {
      fontSize: '14px',
      color: '#624326',
      backgroundColor: '#fdb71b'
    }
  },
  // 抢红包失败样式
  '3': {
    // 背景
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/未中奖.jpg')
    },
    // 页面中间图片
    img: {
      url: require('@/assets/images/activity-template/未中奖图片.png')
    },
    btn: {
      fontSize: '14px',
      color: '#624326',
      backgroundColor: '#fdb71b'
    }
  },
  // 我的奖品页面
  'prize': {
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/border.png'),
      bgColor: '#102135'
    },
    txt: {
      fontSize: '12px',
      color: '#fff'
    },
    btn: {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#f12b2c'
    }
  },
  // 分享
  'share': {
    img: {
      url: require('@/assets/images/activity-template/share_icon.png')
    },
    txt: {
      content: '轻轻松松就能抽到大奖, 积攒多年的人品终于有用了, 你也赶紧来抽奖吧!!'
    }
  }
};

const defaultShakeStyle = {
  '1': {
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/shakeBg.jpg')
    },
    // 页面中间图片
    img: {
      url: require('@/assets/images/activity-template/shakeImg.png')
    },
    txt1: {
      content: '摇一摇, 得优惠',
      fontSize: '24px',
      color: '#fff'
    },
    txt2: {
      color: '#fff',
      fontSize: '12px'
    },
    txt3: {
      color: '#fde25f',
      fontSize: '16px'
    },
    winners: {
      backgroundColor: '#bc3833',
      color: '#fff'
    },
    btn: {
      fontSize: '14px',
      color: '#cb2c17',
      backgroundColor: '#fff965'
    }
  },
  'prize': {
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/border.png'),
      bgColor: '#102135'
    },
    txt: {
      fontSize: '12px',
      color: '#fff'
    },
    btn: {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#f12b2c'
    }
  },
  // 分享
  'share': {
    img: {
      url: require('@/assets/images/activity-template/share_icon.png')
    },
    txt: {
      content: '轻轻松松就能抽到大奖, 积攒多年的人品终于有用了, 你也赶紧来抽奖吧!!'
    }
  }
};

const defaultLotteryStyle = {
  '1': {
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/luckDrawBg_two.png')
    },
    txt1: {
      fontSize: '12px',
      color: '#000'
    },
    txt2: {
      color: '#ffe461',
      fontSize: '16px'
    },
    winners: {
      backgroundColor: '#bc3833',
      color: '#fff'
    },
    btn: {
      fontSize: '14px',
      color: '#fff',
      backgroundColor: '#ff7300'
    }
  },
  'prize': {
    bg: {
      bgType: 'image',
      bgImage: require('@/assets/images/activity-template/border.png'),
      bgColor: '#102135'
    },
    txt: {
      fontSize: '12px',
      color: '#fff'
    },
    btn: {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#f12b2c'
    }
  },
  // 分享
  'share': {
    img: {
      url: require('@/assets/images/activity-template/share_icon.png')
    },
    txt: {
      content: '轻轻松松就能抽到大奖, 积攒多年的人品终于有用了, 你也赶紧来抽奖吧!!'
    }
  }
};

export default {
  defaultPacketStyle,
  defaultShakeStyle,
  defaultLotteryStyle
};
