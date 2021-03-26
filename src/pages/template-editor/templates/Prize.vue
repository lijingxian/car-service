
<template>
  <div class="template-prize" :style="bgStyle" @click="selectEl('bg', 'brick')">
    <div class="content_top">
      <div class="content_body">
        <span class="title">我的奖品</span>
        <ul class="prizeList">
          <li v-for="(item, index) in awardList" :key="index">
            <div class="prLi_left">
              <p class="pr_con">{{ item.name || '奖品'}}</p>
              <p class="pr_time">中奖时间：{{ item.happenDate | formatTime }}</p>
            </div>
          </li>
        </ul>
        <div class="btn_group">
          <button class="go_on" :style="btnStyle" @click.stop="selectEl('btn', 'button')">继续抽奖</button>
        </div>
      </div>
    </div>
    <div class="bottom_foot">
      <h5 class="bottom_foot_title">奖品说明</h5>
      <p class="rule" :style="txtStyle" @click.stop="selectEl('txt', 'simple-text')">1.中奖后V豆直接发放到账户中<br />2.其他奖品您可在卡包查看，需在有效期内到对应店铺领取</p>
    </div>
  </div>
</template>
<script>
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

let isred = true;

export default {
  name: 'MyPrizes',
  data() {
    return {
      awardList: [],
      ruleData: '',
      isRed: isred,
      activityId: this.$route.query.id,
      category: this.$route.query.category
    };
  },
  computed: {
    ...mapGetters(['current', 'clientType']),
    ...mapGetters('TemplateEditor', ['pageStyle']),
    bgStyle() {
      if (!this.pageStyle.prize) return {};
      if (this.pageStyle.prize.bg.bgType === 'color') {
        console.log('color: ', this.pageStyle.prize.bg.bgColor);
        return { backgroundColor: this.pageStyle.prize.bg.bgColor };
      } else {
        return { backgroundImage: `url(${this.pageStyle.prize.bg.bgImage})` };
      }
    },
    txtStyle() {
      if (!this.pageStyle.prize) return {};
      return this.pageStyle.prize.txt;
    },
    btnStyle() {
      if (!this.pageStyle.prize) return {};
      return this.pageStyle.prize.btn;
    }
  },
  methods: {
    selectEl(el, type) {
      this.$emit('select-el', el, type);
    },
    // toast提示
    showToast(str) {
      this.$createToast({
        time: 1000, // 显示的时间
        txt: str, // 提示信息
        type: 'warn' // 提示类型
      }).show(); // 显示提示信息
    },
    comeBack() {
      window.history.go(-1);
    },
    // 获取奖品列表相关信息
    getPrizesInfo() {
      http
        .get(urls.recentActivity.cjyMyPrizes, {
          clientType: this.clientType,
          methodName: 'QueryAward',
          shopId: this.current.shopId,
          userId: this.current.userId,
          index: '0',
          count: '100',
          category: this.category,
          id: this.activityId
        })
        .then(data => {
          this.awardList = data.awards;
          this.ruleData = data.rule;
        })
        .catch(() => {})
        .finally(() => {});
    }
  },
  filters: {
    formatTime: function(value) {
      return value.split(' ')[0];
    }
  },
  created() {
    // this.getPrizesInfo();
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
<style lang="scss">
@mixin btnstyle {
  background-color: #f12b2c;
  color: #fff;
  border-radius: 7px;
  padding: 8px 20px;
  border-style: none;
  font-size: 16px;
  margin-bottom: 10px;
  width: 94%;
}

.template-prize {
  min-height: 100%;
  padding-bottom: 20px;
  // background-color: #102135;
  top: 44px;
  bottom: 0;
  width: 100%;
  background-repeat: no-repeat;
  // background: url('~@/assets/img/activity/border.png') no-repeat;
  background-size: 100%;
  background-color: #102135;
  height: calc(100% - 50px);

    .content_top {
      width: 90%;
      margin: auto;
      padding-top: 8%;

      .content_body {
        width: 88%;
        margin: auto;
        background-color: #fff;
        padding-top: 5px;

        .title {
          text-align: center;
          display: block;
          background-color: #ff5d5a;
          width: 60%;
          padding: 6px 20px;
          border-radius: 50px;
          color: #fff;
          margin: auto;
          font-size: 16px;
          margin-top: 10px;
          margin-bottom: 20px;
        }

        .prizeList {
          max-height: calc(100vh - 260px);
          overflow: auto;

          li {
            height: 50px;
            border-bottom: 0.125rem solid #ebe8bb;
            margin-left: 6%;
            margin-top: 16px;

            .prLi_left {
              float: left;
              padding-left: 18%;
              height: 32px;
              line-height: 20px;
              // background: url('~@/assets/img/activity/hongbaoBG.png') no-repeat left 8% center;
              background-size: 15%;

              .pr_con {
                font-size: 15px;
                font-weight: 600;
              }

              .pr_time {
                font-size: 13px;
              }
            }

          }
        }
      }
    }

    .btn_group {
      display: flex;
      justify-content: center;
      .go_on {
        @include btnstyle;
      }
    }
    .bottom_foot {
      margin-top: 30px;
      width: 100%;
      padding: 0 10%;
      font-size: 12px;
      color: #fff;
      text-align: left;

      .bottom_foot_title {
        color: #ffe461;
        font-size: 14px;
      }

      .rule {
        overflow: hidden;
        padding: 10px;
        text-align: left;
        color: #ffffff;
      }
    }
  }

@media screen and (max-width: 320px) {
  .pr_time {
    font-size: 12px;
  }

  .pr_con {
    font-size: 14px;
  }
}
</style>
