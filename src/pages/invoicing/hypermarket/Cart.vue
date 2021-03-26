<template>
  <biz-grid class="cart" v-loading="loading">
    <template>
      <cart-product-list
        ref="productList"
        class="hy-page__scroll-container"
        :list="list"
        :selections.sync="selections"
        @item-click="handleItemClick"
        @quantity-click="handleCount"
        @refresh="handleRefresh"
      ></cart-product-list>

      <el-dialog :visible.sync="confirmVisible" append-to-body width="300px">
        <div class="cart-confirm-text">是否确认从购物车中删除该商品？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="confirmVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleRmoveConfirm" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <div class="cart-footer" slot="bottom">
        <div class="check-left">
          <div class="check-all">
            <div class="check" slot="left" @click="handleSelectAllClick">
              <span class="iconfont biz-icon-i-sh-man-xz" v-show="selectAll"></span>
              <span class="iconfont biz-icon-i-sh-man-wxz" v-show="!selectAll"></span>
            </div>
            <span>全选</span>
          </div>
          <div class="price" v-show="viewState === '0'">
            <!-- <div class="comment">含运费</div> -->
            <div class="amount">
              合计：
              <span>￥{{amount | currencyFilter}}</span>
            </div>
          </div>
        </div>
        <div v-show="viewState === '0'">
          <el-button type="primary" size="mini" @click="handleRemove">删除</el-button>
        </div>
        <div class="operators" v-show="viewState === '0'">
          <el-button type="primary" size="mini" @click="handleBuy">结算({{selectedItemList.length}})</el-button>
        </div>
      </div>
    </template>
  </biz-grid>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';
import CartProductList from './components/CartProductList';
export default {
  name: 'Cart',
  components: {
    CartProductList,
    BizGrid
  },
  data() {
    return {
      list: [],
      index: 0,
      selections: [],
      loading: false,
      confirmVisible: false,
      show: false,
      viewState: '0',
      flg: true,
      openShopPicker: false,

      buttons: [
        {
          name: 'edit',
          icon: 'icon-i-s-gl',
          show: true,
          label: '管理'
        },
        {
          name: 'done',
          icon: 'icon-i-sh-car-dh2',
          show: false,
          label: '完成'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getUser']),

    selectAll() {
      console.log(this.selectedItemList.length);
      if (this.selectedItemList.length === 0) return false;

      for (let i = 0; i < this.list.length; i++) {
        if (this.selections[i] && this.selections[i].length === this.list[i].cartItems.length) {
        } else {
          return false;
        }
      }

      return true;
    },

    amount() {
      let amount = 0;
      this.selections.forEach(arr => {
        arr.forEach(item => {
          amount += item.effectivePrice * item.quantity;
        });
      });

      return amount;
    },

    // 所有选中项集合
    selectedItemList() {
      let result = [];
      if (this.selections) {
        this.selections.forEach(arr => {
          if (arr) {
            arr.forEach(item => {
              result.push(item);
            });
          }
        });
      }

      return result;
    },

    // 所有可预约的选中项集合
    preorderList() {
      let tempArr = [];
      this.selectedItemList.forEach(item => {
        if (item.product.categoryType === '2') tempArr.push(item);
      });

      return tempArr;
    }
  },
  filters: {
    currencyFilter(val) {
      let num = Number(val);
      if (num) return num.toFixed(2);
      else return '0.00';
    }
  },
  methods: {
    ...mapMutations('Order', ['updatedRouterFrom', 'updateProducts', 'updateFinalPayment', 'updateOperatingShop']),
    ...mapMutations('VShop', ['setSelection']),

    handleCount(item) {
      if (item.quantity % item.product.minimumPackQuantity === 0) {
        this.updateCount(item);
        this.flg = true;
      } else {
        this.$message.warning('数量为最小包装数的整数倍');
        this.flg = false;
      }
    },
    handleSelectAllClick() {
      if (this.selectAll) {
        this.selections = [];
        for (let i = 0; i < this.list.length; i++) {
          this.$set(this.selections, i, []);
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          this.$set(this.selections, i, [].concat(this.list[i].cartItems));
        }
      }
    },

    handleItemClick(item, index) {
      // if (this.viewState === '0') {
      //   this.$router.push({ path: `/vshop/goods/${item.product.id}` });
      // }
    },

    handleAppoint(e) {
      if (!this.preorderList.length || this.preorderList.length <= 0) {
        this.$message.warning('请选择一个预约商品', 'warn');
        return;
      }

      console.log('===> ', this.preorderList);
      this.setSelection(this.preorderList.map(item => ({ quantity: item.quantity, ...item.product })));
      this.$router.push({ path: '/book/appoint-service' });
    },
    handleBuy(e) {
      if (this.selectedItemList.length === 0) {
        this.$message.warning('请选择一个商品', 'warn');
        return;
      }
      if (!this.flg) {
        this.$message.warning('数量为最小包装数的整数倍');
        return;
      }
      // 如果存在服务类商品，则需要选择店铺
      // let hasService = false;
      // for (let i = 0; i < this.selectedItemList.length; i++) {
      //   if (this.selectedItemList[i].product.categoryType === '2') {
      //     hasService = true;
      //     break;
      //   }
      // }

      // if (hasService) {
      //   this.openShopPicker = true;
      // } else {
      //   this.handleShopClick(null, -1);
      // }
      this.handleShopClick(null, -1);
    },
    handleFavorite(e) {
      if (this.selectedItemList.length === 0) {
        this.$message.warning('请选择一个商品', 'warn');
        return;
      }

      let ids = this.getSelectionIds();

      this.moveToFavor(ids);

      this.selections = []; // 选中商品移到收藏夹后，将选中的商品列表置为空，重置总计金额
    },
    handleRemove(e) {
      if (this.selectedItemList.length === 0) {
        this.$message.warning('请选择一个商品', 'warn');
        return;
      }

      this.confirmVisible = true;
    },

    handleRmoveConfirm() {
      let ids = this.getSelectionIds();

      this.remove(ids);
    },

    // 选择店铺后，调用订单确认页面
    handleShopClick(shop, index) {
      this.updateProducts(this.selectedItemList);
      this.updateFinalPayment('');
      // this.updateOperatingShop(shop);
      this.updatedRouterFrom('');
      this.orderConfirm();
    },
    updateCount(item) {
      let params = {
        clientType: '2',
        methodName: 'UpdateCartItem',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        cartItems: [
          {
            id: item.id,
            quantity: item.quantity,
            product: {
              id: item.product.id
            }
          }
        ]
      };
      http
        .put(urls.hypermarketMgmt.cartItem, params)
        .then(data => {})
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    orderConfirm() {
      let interfaceName = '';
      let param = {
        cartItems: [],
        methodName: '',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderType: this.orderType // 订单类型[0:购物消费(车品类商品),1:充值,2:整车预定(整车类商品),3:预约维修,4:预约保养,5:有价优惠券]/
      };

      param.methodName = 'FillInOrder';
      interfaceName = urls.hypermarketMgmt.fillInAgent;
      param.cartItems = this.selectedItemList;

      http
        .post(interfaceName, param)
        .then(data => {
          this.$emit('goOrderInfo');
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        })
        .finally(() => {});
    },

    // 浮动控件点击事件
    handleStateChange(item, index, e) {
      if (item.name === 'edit') {
        this.viewState = '1';
        this.$set(this.buttons[0], 'show', false);
        this.$set(this.buttons[1], 'show', true);
      } else {
        this.viewState = '0';
        this.$set(this.buttons[0], 'show', true);
        this.$set(this.buttons[1], 'show', false);
      }
    },
    handleRefresh(callback) {
      this.refresh();
    },
    refresh() {
      this.list = [];
      this.selections = [];
      this.query();
    },
    query() {
      this.selections = [];
      this.loading = true;
      let params = this.getSearchParams();
      http
        .get(urls.hypermarketMgmt.productList, params)
        .then(data => {
          let list = data.carts;
          this.list = this.dealWithData(list);
          let total = 0;
          if (data.carts.length > 0) {
            for (let i = 0; i < data.carts.length; i++) {
              total += data.carts[i].cartItems.length;
            }
          }
          this.$emit('cartCountQuery', data.carts.length > 0 ? total : '0');

          this.loading = false;
          // if (list.length === 0) this.$refs.productList.resetState();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    dealWithData(list) {
      return list.map(shop => {
        shop.cartItems = shop.cartItems.map(item => {
          item.quantity = Number(item.quantity) ? Number(item.quantity) : 0;
          return item;
        });
        return shop;
      });
    },
    getSearchParams() {
      return {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,

        orderType: this.orderTypeComputed
      };
    },

    remove(ids, item, itemIndex, shop, shopIndex) {
      this.loading = true;

      http
        .delete(urls.hypermarketMgmt.cartItem, {
          clientType: '2',
          userId: this.getUser.id,
          shopId: this.getUser.shop.id,

          ids: ids
        })
        .then(data => {
          this.loading = false;

          this.$message.success('删除成功');
          this.confirmVisible = false;
          this.refresh();
        })
        .catch(errData => {
          this.loading = false;

          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    moveToFavor(ids) {
      this.loading = true;

      http
        .post(urls.cart.moveToFavor, {
          clientType: '2',
          userId: this.getUser.id,
          shopId: this.getUser.shop.id,

          ids: ids
        })
        .then(data => {
          this.loading = false;

          this.$message.warning('移动到收藏夹成功');
          this.refresh();
        })
        .catch(errData => {
          this.loading = false;

          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },

    showToast(msg, type) {
      let option = {
        txt: msg,
        type: type || 'correct',
        time: 1000
      };
      this.$createToast(option).show();
    },
    getSelectionIds() {
      return this.selectedItemList.map(item => {
        return item.id;
      });
    }
  },
  mounted() {
    // 验证是否登录
    this.query();
  }
};
</script>

<style lang="scss">
.cart {
  font-size: 14px;

  .cart-footer {
    display: flex;
    justify-content: space-between;
    .check-left {
      display: flex;
      justify-content: space-between;
      flex: 1;
      padding-right: 10px;
      .check-all {
        display: flex;
        align-items: center;
        padding-left: 10px;

        .check {
          display: inline-block;
          vertical-align: middle;
          margin-right: 5px;

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
        span {
          color: #999;
        }
      }
      .price {
        display: flex;
        align-items: center;
        .comment {
          color: #999;
          font-size: 12px;
          margin-right: 5px;
        }
        .amount {
          span {
            color: #d53328;
          }
        }
      }
    }

    .operators {
      margin: 0px 0px 0px 5px;
      .cube-btn {
        background: #ff7300;
        color: #fff;
        padding: 8px;
        min-height: 47px;
        min-width: 70px;
        font-size: 14px;
        border-radius: 0;
      }
      .account {
        background: #fddcb3;
        color: #ff7300;
        margin-right: -5px;
      }
    }
  }
}

.cart-confirm-text {
  text-align: center;
  padding-top: 20px;
}
.hy-page > .hy-page__footer {
  border-top: 1px solid #e5e5e5 !important;
}
@media screen and (max-width: 320px) {
  .cart {
    .cart-footer {
      .check-left {
        .price {
          display: inline-block;
          padding: 0;
          .comment {
            margin-right: 0;
            margin-top: 10px;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
