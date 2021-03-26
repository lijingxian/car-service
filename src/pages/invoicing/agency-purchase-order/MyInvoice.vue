<template>
  <div class="my-invoice-my-agency">
    <div class="invoice-info-my-agency">
      <span class="invoice-title">发票信息</span>
      <el-form label-width="100" :inline-message="true">
        <el-form-item label="发票抬头：">{{curInvoice.invoiceTitle}}</el-form-item>
        <el-form-item label="发票类型：">{{curInvoice.invoiceType==='0'?'个人':curInvoice.invoiceType==='1'?'增值税普通发票':curInvoice.invoiceType==='2'?'增值税专用发票':''}}</el-form-item>
        <!-- <el-form-item label="发票金额：">{{curInvoice.invoiceAmount}}</el-form-item> -->
        <el-form-item label="发票状态：">{{curInvoice.invoiceState?curInvoice.invoiceState:'未申请'}}</el-form-item>
        <el-form-item label="联系人：">{{curInvoice.contacts}}</el-form-item>
        <el-form-item label="联系电话：">{{curInvoice.mobile}}</el-form-item>
        <el-form-item label="所在地区：">{{curInvoice.areaName?curInvoice.areaName:curInvoice.area.fullName}}</el-form-item>
        <el-form-item label="详细地址：">{{curInvoice.address}}</el-form-item>
        <el-form-item label="快递公司：" v-if="expressName">
          {{expressName}}
        </el-form-item>
        <el-form-item label="快递单号：" v-if="curInvoice.expressCode">
          {{curInvoice.expressCode}}
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeNames" @change="handleChange" v-if="this.shippingSn">
        <el-collapse-item title="发票追踪" name="1">
          <div class="logistic-info">
            <div class="track-list">
              <ul v-if="getTraces">
                <li v-for="shippingTrace of shippingTraces" :key="shippingTrace.id">
                  <i class="node-icon"></i>
                  <span class="txt">{{shippingTrace.station}}</span>
                  <span class="time">{{shippingTrace.happenTime}}</span>
                </li>
              </ul>
              <ul v-if="this.shippingTraces&&this.shippingTraces.length===0">
                <div class="info">
                  <div class="i-item">
                    物流状态：
                    <span class="l-state">{{'暂无轨迹'}}</span>
                  </div>
                  <div class="i-item">快递公司：{{expressName}}</div>
                  <div class="i-item">快递单号：{{curInvoice.expressCode}}</div>
                </div>
              </ul>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-button type="primary" size="mini" @click="submit" v-if="invoiceInfoId">提交</el-button>
    <el-button type="primary" size="mini" @click="cancle" v-if="invoiceInfoId">取消</el-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'my-invoice',
  data() {
    return {
      deliverys: [],
      activeNames: ['1'],
      expressName: '',
      shippingTraces: [],
      shippingSn: ''
    };
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    orderIds: {
      type: Array
    },
    invoiceInfoId: {
      type: String,
      default: ''
    }
  },
  components: {},
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderInfo', 'curInvoice']),
    getTraces() {
      if (this.shippingTraces && this.shippingTraces.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    invoiceInfoId(val) {}
  },
  methods: {
    ...mapMutations('Order', ['updateCurInvoice']),
    onContact() {
      this.$router.push({ path: '/custom-service' });
    },
    getInvoiceInfo() {
      let param = {
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderInfo.id,
        methodName: 'QueryInvoiceBasicInfo'
      };
      http
        .get(urls.hypermarketMgmt.invoiceByOrder, param)
        .then(data => {
          if (data.invoice.invoiceState === '0') {
            data.invoice.invoiceState = '待开票';
            data.invoice.expressState = '待开票';
          } else if (data.invoice.invoiceState === '1') {
            data.invoice.invoiceState = '未邮寄';
            data.invoice.expressState = '未邮寄';
          } else if (data.invoice.invoiceState === '2') {
            data.invoice.invoiceState = '已邮寄';
            data.invoice.expressState = '已邮寄';
          }
          this.deliverys = data.deliverys;
          this.shippingSn = data.shipping.sn;
          if (this.shippingSn) {
            this.expressInfo();
          }
          this.deliverys.map(item => {
            if (item.id === data.invoice.express) {
              this.expressName = item.name;
            }
          });
          if (data.invoice.area) {
            data.invoice.areaName = data.invoice.area.fullName;
          }
          this.updateCurInvoice(data.invoice);
        })
        .catch(error => {
          if (error.resultCode === '906') {
            this.updateCurInvoice({});
          }
        })
        .finally(() => {});
    },
    // getState(state) {
    //   console.log(state);
    //   if (state === '0') {
    //     return '未申请';
    //   } else if (state === '1') {
    //     return '未邮寄';
    //   } else if (state === '2') {
    //     return '已邮寄';
    //   }
    // },
    handleChange() {},
    cancle() {
      this.$emit('cancle');
    },
    submit() {
      let param = {
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderId: this.orderInfo.id,
        invoiceInfoId: this.curInvoice.id,
        orderIds: this.orderIds,
        methodName: 'CreateInvoiceBasicInfo'
      };

      http
        .post(urls.hypermarketMgmt.applyInvoice, param)
        .then(data => {
          this.$message.success('申请成功');
          this.$emit('close');
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          if (error.resultCode === '906') {
            this.updateCurInvoice({});
          }
        })
        .finally(() => {});
    },
    expressInfo() {
      // this.$router.push({ path: '/logistics-following/' + this.curInvoice.shippingSn });
      let param = {
        methodName: 'QueryLogistics',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        shippingSn: this.shippingSn
      };
      http
        .get(urls.hypermarketMgmt.logistics, param)
        .then(data => {
          console.log('物流追踪', data);
          this.shippingTraces = data.shipping.shippingTraces;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    }
  },
  created() {}
};
</script>

<style lang="scss">
.my-invoice-my-agency {
  font-size: 14px;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  .el-button--mini {
    float: right;
    margin: 0px 5px;
  }
  .link {
    color: #0000ff;
  }

  .btn-contact {
    position: absolute;
    bottom: 0;
    z-index: 10;
  }

  .invoice-info-my-agency {
    background-color: #ffffff;
    overflow: auto;
    .el-form-item {
      margin-bottom: 0px;
    }
    .invoice-title {
      display: block;
      font-size: 15px;
      padding: 10px;
      border-bottom: 1px solid #c0c0c0;
    }

    .item {
      display: flex;
      margin-bottom: 5px;
      span {
        display: block;
      }
    }

    .item-div {
      padding: 10px;
    }
    .logistic-info {
      background-color: #fefefe;
      border: 1px solid #eee;
      height: calc(100% - 400px);
      ul li {
        list-style: none;
      }
      .track-list {
        margin: 0 10px;
        padding-left: 5px;
        padding-bottom: 10px;
        position: relative;
        ul {
          li:not(:last-child)::after {
            content: '';
            position: absolute;
            z-index: 1;
            pointer-events: none;
            background-color: #d9d9d9;
            width: 1px;
            top: 26px;
            left: -1px;
            bottom: -18px;
          }
          li:not(:first-child)::before {
            content: '';
            position: absolute;
            z-index: 1;
            pointer-events: none;
            background-color: #e7e7e7;
            height: 1px;
            left: 25px;
            right: 0;
          }
          li {
            position: relative;
            padding: 8px 0 0 25px;
            line-height: 18px;
            color: #999;
            .node-icon {
              position: absolute;
              left: -6px;
              top: 15px;
              width: 11px;
              height: 11px;
              border-radius: 50%;
              background: #b7b7b7;
              border: #e0e0e0 solid 3px;
            }
            .time {
              margin-right: 20px;
              position: relative;
              top: 4px;
              display: inline-block;
              vertical-align: middle;
              font-size: 12px;
              color: #999;
            }
            .txt {
              color: #333;
              position: relative;
              top: 4px;
              display: inline-block;
              vertical-align: middle;
            }
          }
          li:first-child {
            .node-icon {
              background: red;
              border: #ffa4a4 solid 3px;
            }
            .txt {
              color: red;
            }
          }
          li:first-child::after {
            background: linear-gradient(0deg, #e8e8ed, #e64b4e);
          }
        }
      }
    }
  }
  .el-collapse {
    max-height: 200px;
  }
}
</style>
