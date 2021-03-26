<template>
  <div class="my-evaluate">
    <div class="evaluate-content">
      <div v-if="orderInfo&&reviews.length">
        <div class="my-evaluate-div" v-for="(item, index) of orderInfo.orderItems" :key="index">
          <div class="order-info">
            <div class="info">
              <img :src="item.thumbnail?item.thumbnail:defaultImg" @error="errorHandle" />
              <div class="info-right">
                <span>{{item.name}}</span>
                <span>￥{{getAmount(item)}}</span>
              </div>
            </div>
          </div>
          <div class="evaluate" v-if="editable&&item.product">
            <div class="title" style="align-items: center;float:left;">
              <span class="iconfont biz-icon-shangpin" style="font-size:26px;padding: 0px 30px;"></span>
              <span style="padding-right:30px;font-size: 14px;">商品评分</span>
              <el-radio-group v-model="reviews[index].score" :horizontal="true" style="height: 10px;">
                <el-radio v-for="(option,index) in options" :label="option" :key="index"></el-radio>
              </el-radio-group>
            </div>
            <el-input type="textarea" size="mini" v-model="reviews[index].content" placeholder="来分享您的使用感受吧..." :maxlength="maxlength"></el-input>
            <img-uploader v-model="reviews[index].images"></img-uploader>
          </div>
          <div class="evaluate-dis" v-if="!editable&&item.product">
            <div class="title" style="align-items: center;float:left;">
              <span class="iconfont biz-icon-shangpin" style="font-size:26px;"></span>
              <span style="padding-right:30px;font-size: 14px;">商品评分</span>
              <span>{{reviews[index].score?'已'+reviews[index].score:''}}</span>
            </div>
            <div class="eva-content">
              <p style="margin-bottom:10px;margin-left: 20px;">{{reviews[index].content?reviews[index].content:'很遗憾，您没有留下任何评价。'}}</p>
              <div class="img-group" style="margin-left: 20px;">
                <div class="img-eva" v-for="(item,res) of reviews[index].images" :key="res">
                  <img :src="item" v-if="item" @click="handleImagePreview(reviews[index].images,res)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-evaluate">
        <div class="shop-title">
          <img :src="iconShop" />
          <span style="fontSize:14px">店铺评分</span>
        </div>
        <div class="shop-item">
          <span class="label">服务态度</span>
          <el-rate v-model="serValue" class="rate" :disabled="!editable"></el-rate>
        </div>
        <div class="shop-item">
          <span class="label">服务速度</span>
          <el-rate v-model="speedValue" class="rate" :disabled="!editable"></el-rate>
        </div>
        <div class="shop-item">
          <span class="label">专业技能</span>
          <el-rate v-model="proValue" class="rate" :disabled="!editable"></el-rate>
        </div>
      </div>
    </div>
    <div class="submit" v-if="editable">
      <span class="btn-submit" @click="submitEvaluate">提交评价</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import defaultImg from '@/assets/images/default_user.png';
import defaultFailImg from '@/assets/images/commodity/pic_default_fail_100.png';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import iconShop from '@/assets/images/store.png';

export default {
  name: 'my-evaluate',
  data() {
    return {
      iconShop: iconShop,
      defaultImg: defaultImg,
      defaultFailImg: defaultFailImg,
      selected: '好评',
      options: ['好评', '中评', '差评'],
      evaluateValue: '',
      maxlength: 100,
      serValue: 5,
      speedValue: 5,
      proValue: 5,
      reviews: [],
      info: null,
      initialIndex: 0
    };
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: { ImgUploader },
  computed: {
    ...mapGetters('Order', ['orderInfo']),
    ...mapGetters(['getUser'])
  },
  watch: {
    orderId(nval, oval) {
      this.getParams();
      this.getOrderInfo();
    }
  },
  methods: {
    ...mapMutations('Order', ['updateOrderInfo']),
    // toast提示
    showToast(str) {
      this.$createToast({
        time: 1000, // 显示的时间
        txt: str, // 提示信息
        type: 'warn' // 提示类型
      }).show(); // 显示提示信息
    },
    images(ary) {
      let array = [];
      for (const file of ary) {
        array.push(file);
      }
      return array;
    },
    // 点击图片放大
    handleImagePreview(value, index) {
      this.initialIndex = index;
      let previewImages = [];
      value.map(item => {
        previewImages.push(item);
      });
      const params = {
        $props: {
          imgs: previewImages,
          initialIndex: 'initialIndex', // 响应式数据的key名
          loop: false
        },
        $events: {
          change: i => {
            // 必须更新 initialIndex
            this.initialIndex = i;
          }
        }
      };
      this.$createImagePreview({ ...params }).show();
    },
    getAmount(value) {
      let amount = Number(value.price) * Number(value.quantity);
      return amount.toFixed(2);
    },
    submitEvaluate() {
      let param = {
        serviceAttitude: this.serValue.toString(),
        serviceSpeed: this.speedValue.toString(),
        professional: this.proValue.toString(),
        methodName: 'CreateProductReview',
        clientType: '2',
        shopId: this.getUser.shop.id,
        orderId: this.orderInfo.id,
        userId: this.getUser.id
      };

      let ary = this.orderInfo.orderItems;
      let len = ary.length;
      let reviews = this.reviews;
      let showTips = false;

      for (let i = 0; i < len; i++) {
        if (reviews[i]) {
          if (reviews[i].score === '好评') {
            reviews[i].score = '5';
            showTips = true;
          } else if (reviews[i].score === '中评') {
            reviews[i].score = '3';
            showTips = true;
          } else if (reviews[i].score === '差评') {
            reviews[i].score = '1';
            showTips = true;
          }
        }

        if (!showTips && ary[i].product) {
          this.$message.warning('请选择商品评分');
          return;
        }

        if (ary[i].product) {
          reviews[i].images = this.images(reviews[i].images);
        }
      }

      // 删除一键救援item, 一键救援不是商品
      ary.forEach((element, index) => {
        if (!element.product) {
          reviews.splice(index, 1);
          return false;
        }
      });

      if (showTips) {
        param.reviews = this.reviews;
      }

      http
        .post(urls.hypermarketMgmt.review, param)
        .then(data => {
          this.$message.success('评价成功');
          this.$emit('operationSuccess');
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        })
        .finally(() => {});
    },
    errorHandle(e) {
      e.currentTarget.src = this.defaultFailImg;
    },
    getOrderInfo(id) {
      this.open = false;
      let paramId = '';
      if (id) {
        paramId = id;
      } else {
        paramId = this.orderId;
      }
      let param = {
        clientType: this.clientType,
        methodName: 'QueryOrderDetail',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: paramId
      };

      http
        .get(urls.hypermarketMgmt.queryOrder, param)
        .then(data => {
          console.log('订单信息', data);

          let ary = data.order.orderItems;
          let len = ary.length;
          let obj;
          let i;
          this.reviews = [];
          for (i = 0; i < len; i++) {
            obj = {
              score: '',
              content: '',
              reviewOrderId: data.order.id,
              images: []
            };

            if (ary[i].product) {
              obj.productId = ary[i].product.id;
            }
            this.reviews.push(obj);
          }

          if (!this.editable) {
            this.info = data.order;
            this.getEvaluationInfo(paramId);
          } else {
            this.updateOrderInfo(data.order);
          }
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        })
        .finally(() => {});
    },
    getParams() {
      this.editable = true;
    },
    getEvaluationInfo(id) {
      let param = {
        clientType: this.clientType,
        methodName: 'QueryOrderReview',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: id
      };

      http
        .get(urls.hypermarketMgmt.reviews, param)
        .then(data => {
          console.log(data);
          this.serValue = parseInt(data.serviceAttitude);
          this.speedValue = parseInt(data.serviceSpeed);
          this.proValue = parseInt(data.professional);

          // 添加一个一键救援item
          if (data.reviews.length !== this.reviews.length) {
            let obj = {
              score: '',
              content: '',
              images: []
            };
            data.reviews.unshift(obj);
          }

          this.reviews = data.reviews;

          let ary = this.reviews;
          let len = ary.length;
          for (let i = 0; i < len; i++) {
            if (ary[i].score === '5') {
              ary[i].score = '好评';
            } else if (ary[i].score === '3') {
              ary[i].score = '中评';
            } else if (ary[i].score === '1') {
              ary[i].score = '差评';
            }
          }

          this.updateOrderInfo(this.info);
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        })
        .finally(() => {});
    }
  },
  created() {}
};
</script>

<style lang="scss">
.my-evaluate {
  width: 100%;
  height: 100%;
  position: absolute;
  .evaluate-content {
    height: 100%;
    overflow-y: auto;
    .my-evaluate-div {
      background-color: #ffffff;
      .order-info {
        .info {
          display: flex;
          padding: 10px;
          img {
            width: 50px;
            height: 50px;
            margin-right: 5px;
          }

          .info-right {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 10px;
            font-size: 14px;
            span {
              display: block;
              white-space: pre-line;
            }

            span:nth-child(2) {
              color: red;
            }
          }
        }
      }

      .evaluate-dis {
        margin: 10px 0;
        background-color: #ffffff;

        .title {
          display: flex;
          align-items: center;

          span {
            margin-left: 10px;
            font-size: 14px;
            padding: 0px 30px 0px 10px;
          }

          span:nth-child(3) {
            color: #ffac30;
          }
        }

        .eva-content {
          margin: 0 5vw;
          display: initial;
          .img-group {
            display: flex;
            flex-wrap: wrap;
            .img-eva {
              img {
                width: 100%;
              }
            }
          }
        }
      }
      .evaluate {
        margin: 10px 0;
        background-color: #ffffff;
        padding: 10px;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-bottom: 10px;
        }

        .upload {
          margin-top: 10px;
        }
      }
    }

    .shop-evaluate {
      background-color: #ffffff;
      margin: 10px 0;
      padding: 10px;
      height: 150px;
      .shop-title {
        display: inline-flex;
        align-items: center;

        img {
          width: 25px;
          margin-right: 10px;
        }
      }

      .shop-item {
        margin-top: 5px;
        display: flex;
        align-items: center;
        .rate {
          margin-left: 15px;
          .cube-rate-item {
            width: 16px;
            margin-right: 15px;
          }
        }

        .label {
          display: block;
          font-size: 13px;
        }
      }
    }
  }

  .submit {
    background-color: #ffffff;
    width: 100%;
    height: 45px;
    position: absolute;
    bottom: 0;
    z-index: 10;
    .btn-submit {
      display: block;
      padding: 5px 15px;
      border: #ffac30 solid 1px;
      border-radius: 8px;
      color: #ffac30;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>
