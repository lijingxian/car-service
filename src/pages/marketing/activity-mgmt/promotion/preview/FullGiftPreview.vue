<template>
  <div class="full-gift-preview" :style="'width:'+width">
    <preview-header :headerTitle="preview.title" :width="width"></preview-header>
    <iframe :src="'resources/admin/ecStatic/index.html#/recent-promotion/' + preview.id" id="iframe" frameborder="0" scrolling="no"
    :width="width" :height="height"></iframe>
    <!-- <div class="title">{{preview.title}}</div>
    <div class="create-date">发布时间: {{preview.publishDate}}</div>
    <div class="date-range">优惠时间: {{preview.beginDate.slice(0, 10)}}至{{preview.endDate.slice(0, 10)}}</div>
    <div class="description">活动说明: <div v-html="preview.content"></div></div>
    <div class="product-list">
      <div class="product-title">活动商品</div>
      <div class="product" v-for="product in preview.products" :key="product.index">
        <div class="cover" :style="coverStyle(product)"></div>
        <div class="detail">
          <div class="name">{{product.name}}</div>
          <div class="price">
            <span class="now">￥{{product.price}}</span>
            <s>￥{{product.marketPrice}}</s>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import PreviewHeader from './PreviewHeader.vue';
import YYYBG from '@/assets/images/activity-preview/shakeIndex.png';

export default {
  name: 'PromotionPreview',
  data() {
    return {};
  },
  props: {
    preview: Object,
    height: {
      type: String,
      default() {
        return '667px';
      }
    },
    width: {
      type: String,
      default() {
        return '375px';
      }
    }
  },
  components: {
    PreviewHeader
  },
  watch: {},
  computed: {
    styleObject() {
      return {
        background: 'url(' + YYYBG + ') no-repeat no-repeat',
        'background-size': '270px'
      };
    }
  },
  methods: {
    coverStyle(val) {
      return { background: `url(${val.image}) no-repeat no-repeat` };
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.full-gift-preview {
  // div {
  //   background-color: rgba(0, 0, 0, 0.05);
  // }
  color: #000;
  height: 100%;
  text-align: center;
  margin: 0 auto;
  .title {
    font-weight: bold;
    font-size: 20px;
    margin: 25px 0;
  }
  .create-date {
    color: #909399;
  }
  .date-range {
    border: 1px solid #ae191e;
    background-color: #fcf7f4;
    height: 30px;
    margin-top: 5px;
  }
  .description {
    height: auto;
    margin: 20px;
    img {
      width: 300px;
    }
  }
  .product-title {
    border-left: 7px solid #ae191e;
    padding-left: 5px;
    height: 25px;
    font-weight: bold;
  }
  .product {
    display: flex;
    height: auto;
    padding: 10px;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    .cover {
      height: 60px;
      width: 60px;
      margin-right: 20px;
    }
    .detail {
      width: 62%;
      height: 100%;
      .name {
        height: auto;
      }
      .price {
        // height: 50%;
        font-size: 12px;
        font-weight: bold;
        .now {
          color: #ae191e;
        }
      }
    }
  }
  .product-list,
  .description {
    text-align: left;
  }
}
</style>
