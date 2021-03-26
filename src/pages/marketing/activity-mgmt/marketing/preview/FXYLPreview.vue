<template>
  <div class="f-x-y-l-preview">
    <preview-header :headerTitle="activity.title">
      <i class="iconfont biz-icon-zhuanfa" slot="append"></i>
    </preview-header>
    <div class="shop-info">
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
      <div class="label">活动奖品</div>
      <div class="product" v-for="item in activity.prizes" :key="item.index">
        <!-- <img :src="item.image || ''" alt=""> -->
        <div class="product-info">
          <div class="product-name">{{ item.name || '' }}  *{{ item.quantity }}</div>
          <!-- <div class="product-price">￥{{ activity.product.price || '' }}</div> -->
        </div>
      </div>
      <div class="label">活动时间</div>
      <div class="time">{{ activity.beginDate }} 至 {{ activity.endDate }}</div>
      <div class="label">参与条件</div>
      <div class="condition">{{ memberRankNames }}会员可参加</div>
      <div class="label">活动规则</div>
      <div class="rules">{{ activity.desc || '无' }}</div>
    </div>
    <el-button size="mini" type="primary" class="go">去参与</el-button>
  </div>
</template>

<script>
import PreviewHeader from '../../promotion/preview/PreviewHeader.vue';

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
.f-x-y-l-preview {
  position: relative;
  color: #000;
  width: 100%;
  min-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .rtf {
    img {
      width: 300px;
    }
  }
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
      padding-left: 10px;
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
