<template>
  <div class="cart-product-list">
    <!-- <hy-empty
        v-show="list.length === 0 && showEmpty"
        :content="'暂无商品'"
      ></hy-empty> -->
    <div class="cart-product-item" v-for="(shop, shopIndex) in list" :key="shopIndex">
      <!-- <div class="shop">
        <div class="check" @click.stop="handleShopCheckClick(shop, shopIndex)">
          <span class="iconfont icon-i-sh-man-xz" v-show="selectionKeys[shopIndex] && shop.cartItems && selectionKeys[shopIndex].length === shop.cartItems.length"></span>
          <span class="iconfont icon-i-sh-man-wxz" v-show="!selectionKeys[shopIndex] || !shop.cartItems || selectionKeys[shopIndex].length !== shop.cartItems.length"></span>
        </div>
        <img class="logo" :src="shop.shop && shop.shop.logo ? (host + shop.shop.logo) : defaultImage" />
        <div class="title">{{shop.shop ? shop.shop.name : ''}}</div>
      </div> -->
      <div class="product-list">
        <hy-image-panel v-for="(item, itemIndex) in shop.cartItems" :key="itemIndex" :imgSrc="item.product[imageField]"
          @click.native="handleClick(item, itemIndex, shop, shopIndex)">
          <div class="check" slot="left" @click.stop="handleItemCheckClick(item, itemIndex, shop, shopIndex)">
            <span class="iconfont biz-icon-i-sh-man-xz" v-show="selectionKeys[shopIndex] && selectionKeys[shopIndex].indexOf(item.id) >= 0"></span>
            <span class="iconfont biz-icon-i-sh-man-wxz" v-show="!selectionKeys[shopIndex] || selectionKeys[shopIndex].indexOf(item.id) < 0"></span>
          </div>
          <div class="product-item">
            <div class="title">
              <span>{{item.name}}</span>
              <span class="preorder" v-show="item.product.categoryType === '2'">可预约</span>
            </div>
            <div class="price">￥{{item.effectivePrice}}</div>
            <div class="quantity">x {{item.quantity}}</div>
            <hy-stepper
                class="quantity"
                v-model="item.quantity"
                :min="1"
                :readOnly="true"
                :cartStyle="true"
                @click.native.stop
                @input="handleCount(item)"
              ></hy-stepper>
          </div>
        </hy-image-panel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import defaultImage from '@/assets/images/default_user.png';
import HyImagePanel from './HyImagePanel';
import HyStepper from './HyStepper';
export default {
  name: 'CartProductList',
  components: {
    HyImagePanel,
    HyStepper
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    selections: {
      type: Array,
      default() {
        return [];
      }
    },
    imageField: {
      type: String,
      default() {
        return 'image';
      }
    },
    showEmpty: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      innerSelections: [],
      defaultImage: defaultImage
    };
  },
  computed: {
    ...mapGetters(['host']),

    options() {
      return {
        pullDownRefresh: this.pullDownRefreshObj,
        scrollbar: true
      };
    },
    pullDownRefreshObj: function() {
      return {
        threshold: 60,
        txt: '刷新成功'
      };
    },
    selectionKeys() {
      let keys = [];
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i]) {
          keys.push(
            this.selections[i].map(item => {
              return item.id;
            })
          );
        } else {
          keys.push([]);
        }
      }

      return keys;
    }
  },
  watch: {
    selections(val) {
      this.innerSelections = [].concat(val);
    }
  },
  methods: {
    handleCount(item) {
      this.$emit('quantity-click', item);
    },
    handleClick(item, index) {
      this.$emit('item-click', item, index);
    },
    // 下拉刷新
    onPullingDown() {
      this.$emit('refresh', this.resetState);
    },
    resetState() {
      this.$refs.scroll.forceUpdate();
    },

    handleShopCheckClick(shop, shopIndex) {
      if (!this.innerSelections[shopIndex]) {
        this.innerSelections[shopIndex] = [];
      }
      if (this.innerSelections[shopIndex].length === shop.cartItems.length) {
        this.innerSelections[shopIndex] = [];
      } else {
        this.innerSelections[shopIndex] = [].concat(shop.cartItems);
      }

      this.$emit('update:selections', this.innerSelections);
    },
    handleItemCheckClick(item, itemIndex, shop, shopIndex) {
      if (!this.innerSelections[shopIndex]) {
        this.innerSelections[shopIndex] = [];
      }

      let index = this.innerSelections[shopIndex].indexOf(item);
      if (index >= 0) {
        this.innerSelections[shopIndex].splice(index, 1);
      } else {
        this.innerSelections[shopIndex].push(item);
      }

      this.$emit('update:selections', this.innerSelections);
    }
  }
};
</script>

<style lang="scss">
.cart-product-list {
  .cart-product-item {
    padding-left: 10px;
    background: #fff;
    margin-bottom: 10px;

    .check {
      margin: 0 5px;

      span {
        font-size: 20px;
        &:first-child {
          color: #fc9153;
        }
        &:last-child {
          color: #999;
        }
      }
    }

    .shop {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e5e5e5;

      .logo {
        width: 24px;
        height: 24px;
        margin-left: 5px;
        border-radius: 5px;
      }

      .title {
        color: #999;
        margin-left: 10px;
      }
    }

    .image-panel {
      padding: 10px 10px 10px 0;
      border-bottom-color: #e5e5e5;
      &:last-child {
        border-bottom: 1px solid #e5e5e5;
      }
      .image {
        margin-left: 5px;
        border-radius: 3px;
      }

      .product-item {
        .title {
          width: 100%;
          margin-bottom: 10px;
          line-height: 20px;
          .preorder {
            color: #ff7300;
            padding: 3px 5px;
            border: 1px solid #ff7300;
            font-size: 12px;
            border-radius: 5px;
            margin: 0 5px;
          }
        }

        .price {
          position: absolute;
          bottom: 0;
          color: #d53328;
          font-size: 16px;
        }

        .quantity {
          position: absolute;
          bottom: 0;
          left: auto;
          right: 0;
          color: #888;
          font-size: 12px;
          border-radius: 5px;
          border: 1px solid #e5e5e5;
          background: #fff;
        }
      }
    }
  }
}
</style>
