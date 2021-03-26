<template>
  <div class="n-y-q-g-preview">
    <preview-header :headerTitle="'活动招募'">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html?#/recent-activity/recruit/'+activity.id"  frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
    <!-- <div class="shop-info">
      <div class="shop">
        <img :src="activity.shop ? activity.shop.logo : ''" alt="">
        <div class="info">
          <div class="shop-name">{{ activity.shop ? activity.shop.name : '' }}</div>
          <div class="publish-time">{{ activity.createDate }}</div>
        </div>
      </div>
      <el-button size="mini" type="primary">关注</el-button>
    </div>
    <div class="rtf" v-html="activity.content"></div>
    <div class="activity-info" v-if="activity.product">
      <div class="label">活动时间</div>
      <div class="time">{{ activity.beginDate }} 至 {{ activity.endDate }}</div>
      <div class="label">报名时间</div>
      <div class="time">{{ activity.attendBeginDate }} 至 {{ activity.attendEndDate }}</div>
      <div class="label">主办方</div>
      <div class="condition">{{ activity.shopname }}</div>
      <div class="label">活动地点</div>
      <div class="rules">{{ activity.address}}</div>
    </div>
    <el-button size="mini" type="primary" class="go">立即报名</el-button> -->
  </div>
</template>

<script>
import PreviewHeader from './PreviewHeader.vue';

export default {
  name: 'NYQGPreview',
  data() {
    return {};
  },
  props: {
    activity: Object,
    isCreated: Boolean
  },
  components: {
    PreviewHeader
  },
  watch: {},
  computed: {
    memberRankNames() {
      if (this.activity.memberRanks) {
        if (this.activity.memberRanks.length === 0) {
          return '全部';
        }
        let tmp = this.activity.memberRanks.map(rank => {
          return rank.name;
        });
        return tmp.join(',');
      }
      return '全部';
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.n-y-q-g-preview {
  color: #000;
  width: 100%;
  min-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .shop-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .shop {
      display: flex;
      align-items: center;
      font-size: 12px;
      img {
        margin-right: 5px;
        width: 30px;
        height: 30px;
      }
    }
  }
  .activity-info {
    width: 100%;
    .label {
      margin-top: 10px;
      margin-bottom: 5px;
      padding-left: 5px;
      border-left: 3px solid #ff7300;
    }
    .product {
      display: flex;
      img {
        max-width: 30px;
        max-height: 30px;
      }
    }
  }
  .go {
    width: 90%;
    margin-top: 5px;
  }
}
</style>
