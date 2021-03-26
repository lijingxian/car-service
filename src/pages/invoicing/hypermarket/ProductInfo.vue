<template>
  <biz-grid class="hypermarket-product-info">
    <template>
      <el-carousel trigger="click" arrow="never">
        <el-carousel-item v-for="item in formModel.productImages" :key="item">
          <img class="small" :src="item || defaultImg" :onerror="errorImg" />
        </el-carousel-item>
        <div class="vr" v-show="showVr">
          <i class="iconfont biz-icon-i-s-vrts" @click="vrClick"></i>
        </div>
        <div class="media" v-show="showMedia">
          <i class="iconfont biz-icon-i-s-zssp" @click="mediaClick"></i>
        </div>
        <div class="image" v-show="showImage">
          <i class="iconfont biz-icon-i-s-zstp" @click="imageClick"></i>
        </div>
      </el-carousel>
      <div class="name">{{formModel.fullName}}</div>
      <div>
        <span style="margin-right:10px" v-if="formModel.barCode">{{formModel.barCode}}</span>
        <span>最小包装数：{{formModel.minimumPackQuantity}}</span>
      </div>
      <!-- <div class="red">
        ￥{{formModel.price?formModel.price-formModel.beanDiscount:''}}
        <span>可抵{{formModel.bean}}v豆</span>
      </div>-->
      <div class="zdj">零售价￥{{formModel.retailPrice}}</div>
      <div class="price">￥{{formModel.price}}</div>
      <div class="ys">已售{{formModel.invoicingSales}}件</div>
      <!-- <div class="yh-div">
      <div>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <span>领券</span><span class="lq" v-for="couponPromotion in formModel.couponPromotions" :key="couponPromotion.id">{{couponPromotion.title}}</span>
            </template>
            <div v-for="couponPromotion in formModel.couponPromotions" :key="couponPromotion.id">
              <el-radio v-model="couponPromotion.id">{{couponPromotion.title}}</el-radio>
            </div>
            <el-radio-group v-model="radio">
              <div v-for="couponPromotion in formModel.couponPromotions" :key="couponPromotion.id">
                <el-radio v-model="couponPromotion.id">{{couponPromotion.title}}</el-radio>
              </div>
            </el-radio-group>
            <el-button type="primary" size="mini">领取</el-button>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div></div>
      </div>-->
      <div class="yh-div">
        <category-picker :product="formModel" @selecedName="selecedName" @selecedId="selecedId"></category-picker>
      </div>
      <div class="sl">
        <span>数量</span>
        <el-input-number v-model.number="quantity" size="mini" :min="1" @change="numChange"></el-input-number>
      </div>
      <div slot="bottom">
        <div align="right">
          <el-button type="primary" size="small" @click="buy">立即购买</el-button>
          <el-button type="primary" size="small" @click="addToCart">加入购物车</el-button>
        </div>
      </div>
    </template>
    <el-dialog title="VR展示" center append-to-body width="600px" :visible.sync="dialogVisibleVr">
      <iframe :src="'resources/admin/ecStatic/index.html?#/car-view/'+itemId+'/vr'" frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
    </el-dialog>
    <el-dialog title="视频" center append-to-body width="600px" :visible.sync="dialogVisibleMedia">
      <iframe :src="'resources/admin/ecStatic/index.html?#/car-view/'+itemId+'/testdrive'" frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
    </el-dialog>
    <el-dialog title="图片" center append-to-body width="600px" :visible.sync="dialogVisibleImage">
      <iframe :src="'resources/admin/ecStatic/index.html?#/car-view/'+itemId+'/photo'" frameborder="0" scrolling="no" width="100%" height="450px"></iframe>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';
import CategoryPicker from './components/CategoryPicker';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'ProductInfo',
  components: {
    BizGrid,
    CategoryPicker
  },
  data() {
    return {
      activeNames: ['1'],
      selectedSpecArr: [],
      products: [],
      selected: '',
      quantity: '1',
      showVr: false,
      showMedia: false,
      showImage: false,
      show: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      formModel: this.getDefaultModel(),
      dialogVisibleVr: false,
      dialogVisibleMedia: false,
      dialogVisibleImage: false,
      flg: true
    };
  },
  props: {
    itemId: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderConfim', 'orderInfo', 'curInvoice', 'payment', 'defaultReceive', 'clickItemSelect'])
  },
  watch: {
    itemId(nval, oval) {
      if (this.open === true) {
        this.quantity = '1';
        this.resourceList();
        this.query();
      }
    },
    open(nVal, oVal) {
      if (nVal) {
        this.quantity = '1';
      }
    }
  },
  methods: {
    ...mapMutations('Order', [
      'updateOrderInfo',
      'updateOrderConfim',
      'updateOrderId',
      'updatePayment',
      'updateFreight',
      'updateCouponSelect',
      'updateClickItemSelect',
      'updateCurInvoice',
      'updateProducts',
      'updateSelAddress',
      'updateQuantity'
    ]),
    selecedName(val) {
      this.selected = val;
    },
    selecedId(val) {
      this.formModel.id = val;
    },
    vrClick() {
      this.dialogVisibleVr = true;
    },
    mediaClick() {
      this.dialogVisibleMedia = true;
    },
    imageClick() {
      this.dialogVisibleImage = true;
    },
    getDefaultModel() {
      return {
        afterSale: '',
        attributeValue0: '',
        bean: '',
        beanDiscount: '',
        beanPercent: '',
        brandId: '',
        brandLogo: '',
        categoryId: '',
        categoryType: '',
        couponPromotions: [],
        freight: '',
        fullName: '',
        goodsId: '',
        id: '',
        image: '',
        introduction: '',
        isBuyAtShop: '',
        isBuyOnLine: '',
        isFavor: '',
        isHaveVr: '',
        isPriceNegotiable: '',
        isSubscription: '',
        isSubscriptionReturn: '',
        isSupportTestDrive: '',
        marketPrice: '',
        memo: '',
        name: '',
        notice: '',
        parameterGroups: [],
        point: '',
        price: '',
        productImageDatas: [],
        productImages: [],
        productType: '',
        reputation: '',
        reviewCount: '',
        reviews: [],
        sales: '',
        seriesId: '',
        shopId: '',
        showPath: '',
        specificationGroups: [],
        specificationValues: [],
        specifications: [],
        stock: '',
        subscription: '',
        flg: true
      };
    },
    numChange(val) {
      console.log(123);
      if (val % this.formModel.minimumPackQuantity !== 0) {
        this.flg = false;
      } else {
        this.flg = true;
      }
    },
    query() {
      let params = {
        clientType: '2',
        productId: this.itemId,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.product, params)
        .then(data => {
          this.formModel = Object.assign(this.getDefaultModel(), data.product);
          if (this.formModel.productImages.length === 0) {
            this.formModel.productImages.push(this.formModel.image);
          }
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    resourceList() {
      let params = {
        clientType: '1',
        showProductId: this.itemId,
        shopId: this.getUser.shop.id,
        userId: this.getUser.id
      };
      http
        .get('rest/shop/vrMedias.jhtml', params)
        .then(data => {
          this.showVr = false;
          this.showImage = false;
          this.showMedia = false;
          data.data.map(item => {
            if (item.mediaType === 'testdrive') {
              this.showMedia = true;
            } else if (item.mediaType === 'vr') {
              this.showVr = true;
            } else if (item.mediaType && item.mediaType !== 'testdrive' && item.mediaType !== 'vr') {
              this.showImage = true;
            }
          });
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    addToCart() {
      if (!this.flg) {
        this.$message.warning('数量为最小包装数的整数倍');
        return;
      }
      if (this.formModel.price) {
        let params = {
          clientType: '2',
          userId: this.getUser.id || '',
          cartItems: [{ quantity: this.quantity, product: { id: this.formModel.id } }],
          shopId: this.getUser.shop.id
        };
        http
          .post(urls.hypermarketMgmt.cartItem, params)
          .then(data => {
            this.$message.success('操作成功');
            this.$emit('addToCart');
          })
          .catch(ErrorData => {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning'
            });
            console.log('ERR_REFRESH: ', ErrorData);
          })
          .finally(data => {});
      } else {
        this.$message.warning('该商品没有代理商价格，无法加入购物车');
      }
    },
    buy() {
      console.log(111);
      if (!this.flg) {
        this.$message.warning('数量为最小包装数的整数倍');
        return;
      }
      if (this.formModel.price) {
        let products = [];
        products.push({ product: this.formModel, quantity: this.quantity, effectivePrice: this.formModel.price });
        this.updateProducts(products);
        this.updateQuantity({ quantity: this.quantity, price: this.formModel.price });
        this.$emit('goOrderInfo');
      } else {
        this.$message.warning('该商品没有代理商价格，无法购买');
      }
    }
  }
};
</script>
<style lang="scss">
.hypermarket-product-info {
  .name {
    padding-bottom: 10px;
  }
  .el-carousel__item {
    text-align: center;
  }
  .vr {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #ff7300;
    z-index: 10;
    cursor: pointer;
    background: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    .biz-icon-i-s-vrts {
      position: absolute;
      top: -5px;
      right: -3px;
      font-size: 36px;
    }
  }
  .media {
    position: absolute;
    top: 80px;
    right: 20px;
    color: #ff7300;
    z-index: 10;
    cursor: pointer;
    background: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    .biz-icon-i-s-zssp {
      position: absolute;
      top: -5px;
      right: -3px;
      font-size: 36px;
    }
  }
  .image {
    position: absolute;
    top: 140px;
    right: 20px;
    color: #ff7300;
    z-index: 10;
    cursor: pointer;
    background: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    .biz-icon-i-s-zstp {
      position: absolute;
      top: -5px;
      right: -3px;
      font-size: 36px;
    }
  }
  .el-carousel {
    img {
      height: 300px;
    }
  }
  .red {
    color: red;
    font-size: 16px;
    padding: 3px 0px;
    span {
      font-size: 14px;
    }
  }
  .zdj {
    text-decoration: line-through;
    font-size: 12px;
    color: #b3b3b3;
    padding: 3px 0px;
  }
  .price {
    font-size: 14px;
    color: red;
    padding: 3px 0px;
  }
  .ys {
    font-size: 12px;
    color: #b3b3b3;
    padding: 3px 0px;
  }
  .yh-div {
    border-top: 3px solid #e1e1e1;
    border-bottom: 2px solid #e1e1e1;
    margin: 10px 0px;
    .lq {
      background: #ff7300;
      margin: 0px 10px;
      height: 30px;
      line-height: 20px;
      color: #fff;
      padding: 5px;
    }
  }
  .sl {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
}
</style>
