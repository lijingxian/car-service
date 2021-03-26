<template>
  <biz-grid class="apply-info">
    <div class="apply-info-div">
      <div class="apply-info-content">
        <div class="apply-top-content">
          <div class="apply-follow-up" @click="onOrderSchedules(orderData.id)">
            <span>申请单跟踪</span>
            <div class="apply-state">
              <span>{{getOrderState}}</span>
              <i style="margin-left:10px;color:#808080;" class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="receiver-info">
            <span>{{orderData.depot?orderData.depot.contactor:''}}</span>
            <span>{{orderData.depot?orderData.depot.phone:''}}</span>
            <p>
              <i style="margin-right:5px;" class="el-icon-location-outline"></i>
              {{orderData.depot?orderData.depot.address:''}}
            </p>
          </div>
        </div>
        <div class="apply-info-new">
          <div class="shop-name" @click="goSupplier">
            <img :src="iconShop" />
            <span style="fontSize:14px">{{orderData.relatePartnerName}}</span>
          </div>
          <div v-for="(item, index) of orderData.itemDatas" :key="index">
            <div class="good-info">
              <div class="goods-img">
                <img :src="item.thumbnail&&item.thumbnail.indexOf('/')>=0?item.thumbnail:defaultImg" @error="imgError(index)" class="img" ref="img" />
              </div>
              <div class="good-right">
                <div class="good-name">
                  <span style="flex:1">
                    {{item.specValue}}
                  </span>
                </div>
                <div style="margin-bottom:10px">
                  <span v-if="item.product.barCode" style="font-size: 14px;margin-right:10px">{{item.product.barCode}}</span>
                </div>
                <div class="good-price">
                  <span>￥{{item.price}}</span>
                  <span>X{{item.amount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="price-info-content">
          <div class="total-price">
            <span>合计</span>
            <span style="color:red">￥{{orderData.totalFee}}</span>
          </div>
        </div>
        <div class="pay-type">
          <span>单据编号: {{orderData.sn}}</span>
          <span>创建时间: {{orderData.createDate}}</span>
          <span>申请人: {{orderData.applierName}}</span>
        </div>
      </div>
    </div>
    <div slot="bottom" v-if="isPend" style="float: right;">
      <el-button
        type="primary"
        size="mini"
        v-if="hasAuthExamine&&((orderData.state==='1'&& orderData.audit==='1') || (orderData.state==='2'&& orderData.audit==='1'))"
        @click.stop="toPass(orderData,'1')"
      >审核</el-button>
      <el-button type="primary" size="mini" v-if="orderData.state==='0'" @click.stop="statusChange(orderData,'0')">提交</el-button>
      <el-button type="primary" size="mini" v-if="orderData.state==='1'&&orderData.isApplier==='1'" @click.stop="statusChange(orderData,'3')">撤回</el-button>
      <!-- <el-button
        type="primary"
        size="mini"
        v-if="(orderData.state==='1'&& orderData.audit==='1') || (orderData.state==='2'&& orderData.audit==='1')"
        @click.stop="statusChange(orderData,'2')"
      >驳回</el-button>-->
    </div>
    <el-dialog :visible.sync="dialogVisiable" center width="800px" min-height="400px" append-to-body custom-class="orderDialog">
      <apply-follow ref="invoice"></apply-follow>
    </el-dialog>
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">驳回</el-radio>
          <div style="padding: 5px 0px;margin-top:15px;" v-show="auditState==='2'">
            <span>驳回理由：</span>
            <el-select v-model="curSelectCloseReason" placeholder="请选择驳回理由" class="order-select" size="mini">
              <el-option v-for="reason in reasonList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
            </el-select>
          </div>
          <el-input v-model="remarks" type="textarea" style="margin-top:15px;"></el-input>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showPassOrder=false" size="mini" type="primary">取消</el-button>
        <el-button @click="statusChange(row,auditState)" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import defaultImg from '@/assets/images/commodity/pic_default_none.png';
import iconShop from '@/assets/images/store.png';
import ApplyFollow from './ApplyFollow';
export default {
  name: 'apply-info',
  data() {
    return {
      orderData: {},
      iconShop: iconShop,
      defaultImg: defaultImg,
      dialogVisiable: false,
      showPassOrder: false,
      loading: false,
      remarks: '',
      auditState: '1',
      row: {},
      curSelectCloseReason: '申报的商品与实际需要采购的商品不符',
      reasonList: [
        {
          label: '申报的商品与实际需要采购的商品不符',
          value: '申报的商品与实际需要采购的商品不符'
        },
        {
          label: '送达仓库地址填写错误',
          value: '送达仓库地址填写错误'
        },
        {
          label: '申报的商品供应方已停售或缺货',
          value: '申报的商品供应方已停售或缺货'
        },
        {
          label: '申报的商品数量有误',
          value: '申报的商品数量有误'
        },
        {
          label: '已与部分商品供应商终止合作',
          value: '已与部分商品供应商终止合作'
        },
        {
          label: '其他原因',
          value: '其他原因'
        }
      ]
    };
  },
  props: {
    itemId: {
      type: String,
      default: ''
    },
    isPend: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    itemId(val) {
      this.getOrderInfo();
    }
  },
  components: { BizGrid, ApplyFollow },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthExamine() {
      // return true;
      return this.currentAuth.includes('admin:purchaseApplication.examine');
    },
    getOrderState() {
      switch (this.orderData.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        case '2':
          return '审核中';
        case '3':
          return '已通过';
        case '4':
          return '已驳回';
        default:
          return '';
      }
    }
  },
  methods: {
    // 跳转到供应商介绍页面
    goSupplier() {
      // this.$router.push({
      //   path: `/shop-about/${this.orderInfo.shop.id}`
      // });
    },
    // toast提示
    showToast(str) {
      this.$createToast({
        time: 1000, // 显示的时间
        txt: str, // 提示信息
        type: 'warn' // 提示类型
      }).show(); // 显示提示信息
    },
    toPass(row, state) {
      this.remarks = '';
      this.row = row;
      this.showPassOrder = true;
    },
    onOrderSchedules(id) {
      this.dialogVisiable = true;
      this.$nextTick(() => {
        this.$refs.invoice.getList(id);
      });
    },
    getOrderInfo() {
      let param = {
        id: this.itemId
      };
      http
        .get(urls.invoicing.purchaseApplyMgmt.purchaseApplyNew, param)
        .then(data => {
          this.orderData = data.data;
        })
        .catch(() => {})
        .finally(() => {});
    },
    statusChange(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          shopId: window.top.SHOP_ID || '',
          id: model.id,
          actionType: state,
          details: state === '2' ? this.curSelectCloseReason : '',
          remarks: this.remarks
        };
        http
          .post('/admin/invoicing/purchase/shopPurchaseApplyState.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.loading = false;
            this.showPassOrder = false;
            this.$emit('operationSuccess');
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    }
  },
  created() {}
};
</script>

<style lang="scss">
@mixin flexStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 300px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.apply-info {
  .btn-group {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .apply-info-div {
    height: 100%;
    padding-bottom: 45px;
    .apply-info-content {
      width: 100%;
      height: 100%;
      .apply-top-content {
        background: #fff;
        margin-bottom: 10px;
        border-bottom: 1px solid #e3e3e3;
        .apply-follow-up {
          cursor: pointer;
          font-size: 15px;
          padding: 10px;
          @include flexStyle;
          border-bottom: 1px solid #e3e3e3;
          .apply-state {
            color: #ff7300;
            @include flexStyle;
          }
        }

        .receiver-info {
          padding: 10px;

          span {
            display: initial;
            font-size: 13px;
            margin: 0 0 10px 15px;
          }

          p {
            font-size: 13px;
            color: #808080;
            display: flex;
            align-items: center;
          }
        }
      }

      .apply-info-new {
        width: 100%;
        font-size: 14px;
        padding: 10px;
        background: #fff;
        margin-bottom: 10px;
        border-bottom: 1px solid #e3e3e3;
        .shop-name {
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e3e3e3;
          img {
            width: 18px;
            margin-right: 10px;
          }
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
              width: 100%;
              vertical-align: middle;
            }
          }

          .good-right {
            width: calc(100% - 80px);

            .good-name {
              margin-bottom: 10px;
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
        font-size: 16px;
        background: #fff;
        margin-bottom: 10px;
        padding: 5px 10px;
        border-bottom: 1px solid #e3e3e3;
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
      .pay-type {
        color: #808080;
        font-size: 14px;
        padding: 5px 10px;
        background: #fff;
        margin-bottom: 10px;

        .message {
          display: flex;
          align-items: flex-start;
          .label {
            width: 60px;
            margin-right: 4px;
          }
          .buy-message {
            flex: 1;
            display: block;
          }
        }

        span {
          display: block;
          line-height: 22px;
        }
      }
    }
  }
}
</style>
