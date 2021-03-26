<template>
  <div class="share-template">
    <div class="share-body">
      <div class="title">参与活动赢大奖</div>
      <div class="share-content">
        <div class="content" @click="selectEl('txt', 'text-content')">{{ shareContent }}</div>
        <img class="share-img" :src="shareImg" @click="selectEl('img', 'image')" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: '',
  data () {
    return {
    };
  },
  components: {
  },
  computed: {
    ...mapGetters('TemplateEditor', ['pageStyle']),
    shareContent() {
      if (!this.pageStyle.share) return '';
      return this.pageStyle.share.txt.content;
      // return '轻轻松松就能抽到大奖, 积攒多年的人品终于有用了, 你也赶紧来抽奖吧!!';
    },
    shareImg() {
      if (!this.pageStyle.share) return '';
      return this.pageStyle.share.img.url;
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    selectEl(el, type) {
      this.$emit('select-el', el, type);
    }
  }
};
</script>

<style lang="scss">
.share-template {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/images/activity-template/share.png');
  .share-body {
    position: absolute;
    top: 125px;
    left: 85px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .share-content {
      display: flex;
    }
    .content {
      cursor: default;
      width: 130px;
      height: 70px;
      font-size: 13px;
      color: #bbb;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      display: -webkit-box;
    }
    .share-img {
      width: 70px;
      height: 70px;
      margin-left: 5px;
      object-fit: cover;
    }
  }
}
</style>
