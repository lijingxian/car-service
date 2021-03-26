<template>
  <div class="recommend-item" style="margin-top:-20px">
    <div class="upper">
      <div class="left-part">
        <div class="title" style="font-size:12px">{{ item.title }}</div>
        <div class="desc" style="font-size:8px;margin-top:-10px" v-html="cutstr(deleteHtmlTag,10) || item.seoDescription"></div>
        <video v-if="item.videos" :src="item.videos"></video>
        <div v-if="item.images && item.images.length >= 3" class="img-group">
          <img :src="item.images[0]" alt />
          <img :src="item.images[1]" alt />
          <img :src="item.images[2]" alt />
        </div>
      </div>
      <div class="right-part" v-if="item.images && item.images.length < 3 && item.images[0]">
        <img :src="item.images[0]" alt />
      </div>
    </div>
    <div class="footer" style="margin-top:0px;">
      <div class="footer-left" style="font-size:8px;">
        <img v-if="getUser.shop && getUser.shop.logo" :src="getUser.shop.logo" alt class="shop-logo" />
        <span class="shop-name">{{ getUser.shop ? getUser.shop.name : '' }}</span>
        <span class="publish-date">{{ item.createDate.slice(5, 10) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RecommendItem',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    ...mapGetters(['getUser']),
    deleteHtmlTag() {
      return this.item.content.replace(/<[^>]+>|&[^>]+;/g, '').trim(); // 去掉所有的html标签和&nbsp;之类的特殊符合
    }
  },
  methods: {
    cutstr(str, len) {
      return str ? str.substr(0, 43) + '...' : '';
    },
    itemClick() {
      this.$emit('item-click');
    },
    // 屏蔽
    shield() {
      this.$emit('shield');
    },
    share() {
      this.$emit('share');
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.recommend-item {
  display: flex;
  flex-direction: column;
  border: none;
  padding: 10px 15px;
  min-height: 110px;
  background-color: #fff;
  .upper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    .left-part {
      flex-grow: 1;
      height: 100%;
      .title {
        font-size: 12px;
        line-height: 21px;
        color: #101010;
        // 文本溢出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .desc {
        color: #999;
        font-size: 8px;
        word-break: break-all;
        // 文本溢出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      video {
        width: 100%;
        height: calc((100% - 30px) * 9 / 16);
      }
      .img-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        img {
          object-fit: cover;
          // height: 100%;
          // width: 32%;
          height: calc(2 * (100% - 20px) / 9);
          width: calc((100% - 20px) / 3);
        }
      }
    }
    .right-part {
      flex-shrink: 0;
      // height: calc(2 * (100% - 20px) / 9);
      width: calc((100% - 20px) / 3);
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    .footer-left {
      width: 50%;
      height: 20px;
      display: flex;
      align-items: center;
      font-size: 8px;
      line-height: 18px;
      color: #999;
      .shop-name {
        flex-grow: 1;
        // 文本溢出显示省略号
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .publish-date {
        margin-left: 10px;
        flex-shrink: 0;
      }
      img {
        flex-shrink: 0;
        object-fit: cover;
        border-radius: 50%;
        height: 20px !important;
        width: 20px !important;
        margin-right: 5px;
      }
    }
    .footer-right {
      display: flex;
      align-items: center;
      font-size: 10px;
      color: #999;
      div {
        margin-left: 5px;
        vertical-align: bottom;
      }
    }
  }
}
</style>
