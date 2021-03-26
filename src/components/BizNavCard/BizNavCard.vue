<template>
  <div class="biz-nav-card">
    <div class="nav-card-row" v-for="n in rowCount" :key="n" :style="styleGrid">
      <div class="card-group" v-for="(cardGroup, index) in cardData" :key="cardGroup.index" v-show="(index < n * columnCount) && (index >= (n - 1) * columnCount)">
        <div class="upper-content">
          <div class="triangle-left" v-show="n % 2 === 0 &&  index % columnCount !== columnCount - 1 && index < cardData.length - 1">
          </div>
          <div class="card-box">
            <div class="nav-card" v-for="card in cardGroup" :key="card.index" @click="routeChange(card.link,card.tree)">
              <div class="step">{{ (Array(2).join(0) + (index + 1)).slice(-2) }}</div>
              <div class="title">{{card.title}}</div>
              <div class="content">
                <p v-for="content in cardContent(card.content)" :key="content.index">
                  {{content}}
                </p>
              </div>
              <!-- <div class="line" v-if="card.bottom !== undefined"></div> -->
              <div class="bottom-content">
                <div class="bottom" v-for="item in card.bottom" :key="item.index" @click.stop="routeChange(item.link)">
                  {{item.content}}:
                  <div class="count">
                    {{ item.value || '0' }}{{ item.unit }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="triangle-right" v-show="n % 2 === 1 && index % columnCount !== columnCount - 1 && index < cardData.length - 1">
          </div>
        </div>
        <div class="triangle-bottom" v-show="index % columnCount === (columnCount - 1) && index < cardData.length - 1">
        </div>
      </div>
      <div v-if="n == rowCount && cardData.length % columnCount !== 0" v-for="m in (columnCount - cardData.length % columnCount)"
        :key="m" style="width: 337px;">
        <!-- 占位保持最后一行卡片对齐 -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'BizNavCard',
  props: {
    cardData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 容器宽度
      containerWidth: 100,
      // 是否有包含多个卡片的步骤
      multiBox: false,
      isFourLine: false,
      isFiveLine: false
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    // 列数量
    columnCount() {
      // padding
      return Math.floor((this.containerWidth - 100) / 337) || 1;
    },
    // 行数量
    rowCount() {
      return Math.ceil((this.cardData.length || 0) / this.columnCount);
    },
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
    this.containerWidth = document.querySelector('.main-center').clientWidth;
    window.onresize = () => {
      this.containerWidth = document.querySelector('.main-center').clientWidth;
    };
  },
  components: {},
  methods: {
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
          parent.window.document.getElementById(tree[0]).style.display === 'none'
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
.biz-nav-card {
  .nav-card-row {
    display: flex;
    justify-content: space-around;
    &:nth-child(even) {
      flex-direction: row-reverse;
    }
  }
  .card-group {
    min-width: 337px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upper-content {
    display: flex;
    align-items: center;
  }
  .nav-card {
    width: 282px;
    min-height: 217px;
    margin: 35px 28.5px;
    border-radius: 2px;
    box-shadow: 0px 0px 5px 1px #e5e5e5;
    position: relative;
    cursor: pointer;
    .title {
      width: 286px;
      padding: 20px 38px 0 28px;
      font-size: 16px;
      font-weight: bold;
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
      font-size: 14px;
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
      height: 70px;
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
    .bottom-content {
      background: #fafafa;
      height: 135px;
    }
    .bottom {
      padding: 10px 20px 0 28px;
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
    border-top: 6px solid transparent;
    border-left: 8px solid #ff7300;
    border-bottom: 6px solid transparent;
    margin-left: -9px;
  }
  .triangle-left {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 8px solid #ff7300;
    border-bottom: 6px solid transparent;
    margin-right: -9px;
  }
  .triangle-bottom {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #ff7300;
    margin-top: -9px;
  }
}
</style>
