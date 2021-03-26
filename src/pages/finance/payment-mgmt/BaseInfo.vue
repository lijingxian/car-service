<template>
  <biz-grid class="payment-base-info">
    <div class="base-info">
      <div style="display:flex;margin-bottom:10px">
        <div class="main" style="margin-right: 40px;">
          <span class="label-name">订单状态</span>
          <el-input :value="form.stateName?form.stateName:formatStatus(form.type)"></el-input>
        </div>
        <div class="main">
          <span class="label-name">供应商</span>
          <el-input :value="form.supplier?form.supplier.name:''"></el-input>
        </div>
      </div>
      <div style="display:flex;margin-bottom:10px">
        <div class="main" style="margin-right: 40px;">
          <span class="label-name">顾问</span>
          <el-input :value="form.consultant?form.consultant.name:''"></el-input>
        </div>
        <div class="main">
          <span class="label-name">配送方式</span>
          <el-input :value="form.shippingMethodName"></el-input>
        </div>
      </div>
      <div style="margin-bottom:10px">
        <div class="main">
          <span class="label-name">备注</span>
          <el-input :value="form.memo"></el-input>
        </div>
      </div>
      <div style="margin-bottom:10px">
        <div style="width: 60px;text-align: right;margin-bottom:10px">商品</div>
        <el-table :data="form.orderItems" size="small" stripe border highlight-current-row tooltip-effect="dark">
          <el-table-column prop="fullName" label="商品">
            <template slot-scope="scope">
              <div style="width:100%">
                {{scope.row.fullName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="originalPrice" label="原价">
            <template slot-scope="scope">
              <div style="width:100%">
                {{scope.row.originalPrice?scope.row.originalPrice:'--'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="现价">
            <template slot-scope="scope">
              <div style="width:100%">
                {{scope.row.price?scope.row.price:'--'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量">
            <template slot-scope="scope">
              <div style="width:100%">
                {{scope.row.quantity}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subTotal" label="小计">
            <template slot-scope="scope">
              <div style="width:100%">
                {{scope.row.subTotal}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="price-info-content">
      <div class="total-price">
        <span>商品总价</span>
        <span>￥{{form.price}}</span>
      </div>
      <div class="total-price">
        <span>优惠</span>
        <span>- ￥{{form.couponDiscount}}</span>
      </div>
      <div class="total-price">
        <span>V豆抵扣</span>
        <span>- ￥{{form.bean}}</span>
      </div>
      <div class="total-price">
        <span>运费</span>
        <span>+ ￥{{form.freight}}</span>
      </div>
      <div class="order-price">
        <span>订单金额</span>
        <span>￥{{form.originalAmount}}</span>
      </div>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    }
  },
  components: {
    BizGrid
  },
  data() {
    return {
      form: {}
    };
  },
  computed: {},
  created() {},
  watch: {
    itemId(val) {
      this.init();
    }
  },
  methods: {
    init() {
      service.viewOrder(
        { orderId: this.itemId },
        data => {
          this.form = data.order;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 状态
    formatStatus(type) {
      switch (type) {
        case '11':
          return '卖家已发货';
        case '10':
          return '售后完成';
        case '9':
          return '售后中';
        case '8':
          return '已过期';
        case '7':
          return '已评价';
        case '6':
          return '订单关闭';
        case '5':
          return '交易完成';
        case '4':
          return '订单已执行';
        case '3':
          return '买家已付款';
        case '2':
          return '商家已确认';
        case '1':
          return '待商家确认';
        default:
          return '无';
      }
    }
  }
};
</script>

<style lang="scss">
@mixin flexStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.base-info {
  font-size: 14px;
  color: #606266;
  .main {
    display: flex;
    align-items: center;
    width: 200px;
    .label-name {
      width: 100px;
      text-align: right;
      padding-right: 10px;
    }
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
}
.payment-base-info {
  .price-info-content {
    font-size: 16px;
    background: #fff;
    margin-bottom: 10px;
    padding: 5px 10px;
    .total-price {
      @include flexStyle;
      line-height: 35px;
      border-bottom: 1px solid #e3e3e3;
      span {
        display: inline-block;
        color: #808080;
        font-size: 14px;
      }
    }
    .order-price {
      @include flexStyle;
      line-height: 35px;
      span {
        display: inline-block;
        color: #808080;
        font-size: 14px;
      }
    }
  }
}
</style>
