<template>
  <div class="cart-product-list">
    <div v-show="list.length === 0" :style="emptyStyle"></div>
    <div class="cart-product-item">
      <div class="product-list">
        <hy-image-panel
          v-for="(item, itemIndex) in list"
          :key="itemIndex"
          :imgSrc="item.product[imageField]"
          @click.native="handleClick(item, itemIndex)"
        >
          <div class="check" slot="left" @click.stop="handleItemCheckClick(item, itemIndex)">
            <span class="iconfont biz-icon-i-sh-man-xz" v-show="selectionKeys && selectionKeys.indexOf(item.id) >= 0"></span>
            <span class="iconfont biz-icon-i-sh-man-wxz" v-show="!selectionKeys || selectionKeys.indexOf(item.id) < 0"></span>
          </div>
          <el-popover
            placement="bottom"
            width="400"
            :ref="'spe'+itemIndex"
            title="规格"
            >
            <el-radio-group v-model="speValue" size="mini">
              <el-radio v-for="spe in specList" :key="spe.productId" :label="spe.productId">{{spe.period+'个月'}}</el-radio>
            </el-radio-group>
             <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="confirm(itemIndex,item)">确定</el-button>
            </div>
            <div class="product-item" slot="reference">
              <div class="title" @click="getSpeList(item, itemIndex)">
                <span>{{item.product.fullName.length>35?item.product.fullName.substr(0, 35) + '...':item.product.fullName}}</span><i class="el-icon-arrow-down"></i>
              </div>
              <div class="price">￥{{item.effectivePrice}}</div>
              <div class="quantity">x {{item.quantity}}</div>
            </div>
          </el-popover>
        </hy-image-panel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import defaultImage from '@/assets/images/default_user.png';
import HyImagePanel from './HyImagePanel';
// import HyStepper from './HyStepper';
import EmptyImg from '@/assets/images/emptyGray.png';
import http from '@/common/http';
export default {
  name: 'CartProductList',
  components: {
    HyImagePanel
    // HyStepper
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
      speValue: '',
      visible: true,
      innerSelections: [],
      specList: [],
      defaultImage: defaultImage,
      EmptyImg: EmptyImg
    };
  },
  computed: {
    ...mapGetters(['host']),
    ...mapGetters(['getUser']),
    options() {
      return {
        pullDownRefresh: this.pullDownRefreshObj,
        scrollbar: true
      };
    },
    emptyStyle() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + EmptyImg + ') 50% 50% / auto 200px no-repeat'
      };
    },
    pullDownRefreshObj: function() {
      return {
        threshold: 60,
        txt: '刷新成功'
      };
    },
    selectionKeys() {
      console.log(this.selections);
      let keys = [];
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i]) {
          keys.push(this.selections[i].id);
        } else {
          keys.push([]);
        }
      }

      return keys;
    }
  },
  watch: {
    selections(val) {
      this.innerSelections = val;
    }
  },
  methods: {
    confirm(itemIndex, item) {
      this.$refs['spe' + itemIndex][0].doClose();
      this.updateHandle(itemIndex, item);
    },
    // 修改订阅清单
    updateHandle(itemIndex, item) {
      let params = {
        product: { id: this.speValue },
        userId: this.getUser.id,
        quantity: '1',
        shopId: this.getUser.shop.id,
        id: item.id
      };
      http.put('/admin/subscribeList/subscribeList.jhtml', params)
        .then(data => {
          let price = this.specList.filter(item => { item.productId = this.speValue; });
          this.$set(this.list[itemIndex], 'effectivePrice', price);
        })
        .catch();
    },
    handleCount(item) {
      this.$emit('quantity-click', item);
    },
    handleClick(item, index) {
      this.$emit('item-click', item, index);
    },
    getSpeList(item, itemIndex) {
      this.speValue = this.list[itemIndex].product.id;
      let params = {
        id: item.product.id
      };
      http.get('/admin/businessOrder/queryService/v201901.jhtml', params)
        .then(data => {
          this.specList = data.specificationData;
        })
        .catch(errorCode => {
          this.$message.warning(errorCode.errorMessage);
        });
    },
    // 下拉刷新
    onPullingDown() {
      this.$emit('refresh', this.resetState);
    },
    resetState() {
      this.$refs.scroll.forceUpdate();
    },
    handleItemCheckClick(item, itemIndex) {
      console.log(this.innerSelections);
      let index = this.innerSelections.indexOf(item);
      if (index >= 0) {
        this.innerSelections.splice(index, 1);
      } else {
        this.innerSelections.push(item);
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
        font-size: 25px;
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
          border: none;
          background: #fff;
        }
      }
    }
  }
}
</style>
