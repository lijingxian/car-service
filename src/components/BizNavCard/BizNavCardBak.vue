<template>
  <div :class="isFiveLine?'biz-nav-card-isFiveLine':(isFourLine&&!isFiveLine?'biz-nav-card-isFourLine':'biz-nav-card')" :style="styleGrid">
    <div class="card-group" :cardData="cardData" v-for="(cardGroup, index) in cardData" :key="cardGroup.index" :style="styleGridItem(index)">
      <div class="upper-content">
        <div class="triangle-left" v-show="index % 6 > 2 && index % 6 < 5 && index < cardData.length - 1 && !isFiveLine && !isFourLine"></div>
        <div class="card-box">
          <div class="nav-card" v-for="card in cardGroup" :key="card.index" @click="routeChange(card.link,card.tree)">
            <div class="step">{{(Array(2).join(0) + (index + 1)).slice(-2)}}</div>
            <div class="title">{{card.title}}</div>
            <div class="content">
              <p v-for="content in cardContent(card.content)" :key="content.index">
                {{content}}
              </p>
            </div>
            <div class="line" v-if="card.bottom !== undefined"></div>
            <div class="bottom" v-for="item in card.bottom" :key="item.index" @click.stop="routeChange(item.link)">
              {{item.content}}:
              <div class="count">{{item.value || '0'}}{{item.unit}}</div>
            </div>
          </div>
        </div>
        <div class="triangle-right" v-show="index % 6 < 2 && index < cardData.length - 1"></div>
        <div class="triangle-right" v-show="index % 3 === 2 && index < cardData.length - 1 && isFourLine"></div>
        <div class="triangle-right" v-show="index % 6 > 2 && index % 6 < 5 && index < cardData.length - 1 && isFiveLine"></div>
      </div>
      <div class="triangle-bottom" v-show="index % 3 === 2 && index < cardData.length - 1 && !isFourLine"></div>
      <div class="triangle-bottom" v-show="index % 6 > 2 && index % 6 < 5 && index < cardData.length - 1 && isFourLine && !isFiveLine"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BizNavCard',
  props: {
    cardData: {
      type: Array
    }
  },
  data() {
    return {
      // 是否有包含多个卡片的步骤
      multiBox: false,
      isFourLine: false,
      isFiveLine: false
    };
  },
  computed: {
    styleGrid() {
      let multiBox = false;
      this.cardData.map(cardGroup => {
        if (cardGroup.length > 1) {
          multiBox = true;
        }
      });
      if (multiBox) {
        return {
          // 列对齐
          'align-items': 'center'
        };
      } else {
        return {};
      }
    }
  },
  mounted() {
    if (
      document.body.clientWidth - 300 > 1350 &&
      document.body.clientWidth - 300 < 1690
    ) {
      this.isFourLine = true;
      this.isFiveLine = false;
    } else if (document.body.clientWidth - 300 > 1690) {
      this.isFiveLine = true;
      this.isFourLine = true;
    } else {
      this.isFiveLine = false;
      this.isFourLine = false;
    }
    let that = this;
    window.onresize = () => {
      return (() => {
        if (
          document.body.clientWidth - 300 > 1350 &&
          document.body.clientWidth - 300 < 1690
        ) {
          that.isFourLine = true;
          that.isFiveLine = false;
        } else if (document.body.clientWidth - 300 > 1690) {
          that.isFiveLine = true;
          that.isFourLine = true;
        } else {
          that.isFiveLine = false;
          that.isFourLine = false;
        }
      })();
    };
  },
  components: {},
  methods: {
    styleGridItem(index) {
      let indexArr = [
        'first',
        'second',
        'third',
        'fourth',
        'fifth',
        'sixth',
        'seven',
        'eight'
      ];
      return {
        'grid-area': indexArr[index]
      };
    },
    // 多行显示卡片内容
    cardContent(content) {
      if (Array.isArray(content)) {
        return content;
      } else if (typeof content === 'string') {
        return [content];
      }
    },
    cardClick(link) {
      if (link) {
        this.$router.push(link);
      }
    },
    routeChange(link, tree) {
      if (link) {
        this.$router.push({ path: link });
      }
      // tree: [当前级别菜单id, 上级菜单id, 当前类别id]
      // tree[1]
      // |-tree[0]
      //   |-tree[2]
      if (tree && tree[0]) {
        if (
          parent.window.document.getElementById(tree[0]) &&
          parent.window.document.getElementById(tree[0]).style.display ===
            'none'
        ) {
          if (tree[1] && parent.window.document.getElementById(tree[1])) {
            parent.window.document.getElementById(tree[1]).click();
          }
          if (tree[2] && parent.window.document.getElementById(tree[2])) {
            parent.window.document.getElementById(tree[2]).click();
          }
        } else {
          if (tree[2] && parent.window.document.getElementById(tree[2])) {
            parent.window.document.getElementById(tree[2]).click();
          }
        }
      }
    }
  }
};
</script>

<style lang="scss">
.biz-nav-card-isFourLine {
  width: 1350px;
  display: grid;
  grid-template-columns: 337px 337px 337px;
  grid-template-rows: auto;
  grid-template-areas:
    'first second third fourth'
    'eight seven sixth fifth';
  // 行对齐
  justify-items: center;
  .card-group {
    width: 337px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upper-content {
    display: flex;
    align-items: center;
  }
  .nav-card {
    width: 252px;
    min-height: 247px;
    margin: 35px 42.5px;
    padding-bottom: 20px;
    border-radius: 18px;
    box-shadow: 1px 2px 2px 3px #e1e1e1;
    position: relative;
    cursor: pointer;
    .title {
      width: 286px;
      padding: 20px 38px 0 38px;
      font-size: 22px;
      color: #1a1a1a;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .step {
      width: 46px;
      height: 46px;
      border-radius: 50px;
      border: 5px solid #ff7300;
      color: #ff7300;
      background-color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 36px;
      position: absolute;
      top: -20px;
      left: -20px;
      display: none;
    }
    .content {
      padding: 10px 20px 10px 28px;
      color: #666;
      font-size: 12px;
      word-wrap: break-word;
      p {
        margin: 0;
      }
    }
    .line {
      width: 222px;
      height: 1px;
      background-color: #e5e5e5;
      margin: 0 auto;
      margin-left: 15px;
    }
    .bottom {
      padding: 20px 20px 0 28px;
      font-size: 12px;
      justify-content: space-between;
      display: flex;
      color: #666;
    }
    .count {
      color: #ff7300;
    }
  }
  .triangle-right {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-left: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-left: -9px;
  }
  .triangle-left {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-right: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-right: -9px;
  }
  .triangle-bottom {
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 18px solid #ff7300;
    margin-top: -9px;
  }
}
.biz-nav-card-isFiveLine {
  width: 1350px;
  display: grid;
  grid-template-columns: 337px 337px 337px;
  grid-template-rows: auto;
  grid-template-areas: 'first second third fourth fifth';
  // 行对齐
  justify-items: center;
  .card-group {
    width: 337px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upper-content {
    display: flex;
    align-items: center;
  }
  .nav-card {
    width: 252px;
    min-height: 247px;
    margin: 35px 42.5px;
    padding-bottom: 20px;
    border-radius: 18px;
    box-shadow: 1px 2px 2px 3px #e1e1e1;
    position: relative;
    cursor: pointer;
    .title {
      width: 286px;
      padding: 20px 38px 0 38px;
      font-size: 22px;
      color: #1a1a1a;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .step {
      width: 46px;
      height: 46px;
      border-radius: 50px;
      border: 5px solid #ff7300;
      color: #ff7300;
      background-color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 36px;
      position: absolute;
      top: -20px;
      left: -20px;
      display: none;
    }
    .content {
      padding: 10px 20px 10px 28px;
      color: #666;
      font-size: 12px;
      word-wrap: break-word;
      p {
        margin: 0;
      }
    }
    .line {
      width: 222px;
      height: 1px;
      background-color: #e5e5e5;
      margin: 0 auto;
      margin-left: 15px;
    }
    .bottom {
      padding: 20px 20px 0 28px;
      font-size: 12px;
      justify-content: space-between;
      display: flex;
      color: #666;
    }
    .count {
      color: #ff7300;
    }
  }
  .triangle-right {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-left: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-left: -9px;
  }
  .triangle-left {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-right: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-right: -9px;
  }
  .triangle-bottom {
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 18px solid #ff7300;
    margin-top: -9px;
  }
}
.biz-nav-card {
  width: 1050px;
  display: grid;
  grid-template-columns: 337px 337px 337px;
  grid-template-rows: auto;
  grid-template-areas:
    'first second third'
    'sixth fifth fourth';
  // 行对齐
  justify-items: center;
  .card-group {
    width: 337px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upper-content {
    display: flex;
    align-items: center;
  }
  .nav-card {
    width: 252px;
    min-height: 247px;
    margin: 35px 42.5px;
    padding-bottom: 20px;
    border-radius: 18px;
    box-shadow: 1px 2px 2px 3px #e1e1e1;
    position: relative;
    cursor: pointer;
    .title {
      width: 286px;
      padding: 20px 38px 0 38px;
      font-size: 22px;
      color: #1a1a1a;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .step {
      width: 46px;
      height: 46px;
      border-radius: 50px;
      border: 5px solid #ff7300;
      color: #ff7300;
      background-color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 36px;
      position: absolute;
      top: -20px;
      left: -20px;
      display: none;
    }
    .content {
      padding: 10px 20px 10px 28px;
      color: #666;
      font-size: 12px;
      word-wrap: break-word;
      p {
        margin: 0;
      }
    }
    .line {
      width: 222px;
      height: 1px;
      background-color: #e5e5e5;
      margin: 0 auto;
      margin-left: 15px;
    }
    .bottom {
      padding: 20px 20px 0 28px;
      font-size: 12px;
      justify-content: space-between;
      display: flex;
      color: #666;
    }
    .count {
      color: #ff7300;
    }
  }
  .triangle-right {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-left: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-left: -9px;
  }
  .triangle-left {
    width: 0;
    height: 0;
    border-top: 16px solid transparent;
    border-right: 18px solid #ff7300;
    border-bottom: 16px solid transparent;
    margin-right: -9px;
  }
  .triangle-bottom {
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 18px solid #ff7300;
    margin-top: -9px;
  }
}
</style>
