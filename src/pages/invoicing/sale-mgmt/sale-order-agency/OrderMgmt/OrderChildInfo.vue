<template>
  <biz-grid class="child-order-info">
    <div class="order-info-div">
      <div class="order-info-content" v-for="(orderInfo, index) in orderDatas" :key="index">
        <div class="order-info-new">
          <div class="order-sn">
            订单号：
            <span style="fontSize:14px">{{orderInfo.sn?orderInfo.sn:''}}</span>
          </div>
          <div v-for="(item, index) of orderInfo.orderItems" :key="index">
            <div class="good-info">
              <div class="goods-img">
                <img :src="item.thumbnail&&item.thumbnail.indexOf('/')>=0?item.thumbnail:defaultImg" @error="imgError(index)" class="img" ref="img" />
              </div>
              <div class="good-right">
                <div class="good-name">
                  <span style="flex:1">{{item.fullName}}</span>
                </div>
                <div class="good-price">
                  <span>￥{{item.price}}</span>
                  <span>X{{item.quantity}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="price-info-content">
            <div class="total-price">
              <span style="margin-right:10px">共{{orderInfo.count}}件</span>
              <span>合计:￥{{orderInfo.amount}}</span>
              <span>(含运费{{orderInfo.freight}}元)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import defaultImg from '@/assets/images/commodity/pic_default_none.png';
import defaultFailImg from '@/assets/images/commodity/pic_default_fail_100.png';
export default {
  name: 'child-order-info',
  data() {
    return {
      defaultImg: defaultImg,
      defaultFailImg: defaultFailImg,
      loading: false,
      orderDatas: []
    };
  },
  props: {
    itemId: {
      type: String
    }
  },
  watch: {
    itemId(val) {
      this.itemId && this.getOrderChildInfo();
    }
  },
  components: { BizGrid },
  computed: {},
  methods: {
    getOrderChildInfo() {
      let params = {
        orderId: this.itemId
      };
      http
        .get('/admin/purchaseOrderManage/storeSalesOrders/children.jhtml', params)
        .then(data => {
          this.orderDatas = data.dataList;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    }
  },
  created() {
    this.itemId && this.getOrderChildInfo();
  }
};
</script>

<style lang="scss">
@mixin flexStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.child-order-info {
  .order-info-div {
    height: 100%;
    padding-bottom: 45px;
    .order-info-content {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      width: 550px;
      padding: 20px 20px 0px 20px;
      margin-left: 20px;
      .order-top-content {
        background: #fff;
        margin-bottom: 10px;
      }
      .order-info-new {
        width: 100%;
        font-size: 14px;
        padding: 10px;
        background: #fff;
        margin-bottom: 10px;
        .order-sn {
          border-bottom: 1px solid #e3e3e3;
        }
        .good-info {
          width: 100%;
          display: flex;
          align-items: center;
          margin-top: 10px;

          .goods-img {
            width: 80px;
            height: 80px;
            overflow: hidden;
            display: flex;
            flex-grow: 0;
            flex-direction: row;
            align-items: center;
            margin-right: 10px;
            img {
              display: inline-block;
              width: 80px;
              height: 70px;
              vertical-align: middle;
            }
          }

          .good-right {
            width: calc(100% - 80px);

            .good-name {
              margin-bottom: 20px;
              display: block;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .color-mater {
              color: #808080;
              font-size: 12px;
              margin-bottom: 10px;
            }

            .good-price {
              @include flexStyle;

              span:nth-child(1) {
                color: red;
                display: inline-block;
              }

              span:nth-child(2) {
                color: #808080;
                display: inline-block;
              }
            }
          }
        }
      }
      .price-info-content {
        font-size: 14px;
        display: flex;
        justify-content: flex-end;
        background: #fff;
        margin-bottom: 10px;
        padding: 5px 10px;
        .total-price {
          @include flexStyle;
          line-height: 22px;

          .color {
            color: red;
          }

          span {
            display: inline-block;
            color: #808080;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
