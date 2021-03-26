<template>
  <biz-grid class="fedration-mgmt-payment">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>

    <div class="payment-mode-content" v-for="paymentMode in contentData" :key="paymentMode.name" v-if="contentData">
      <el-checkbox v-model="paymentMode.valid" :disabled="paymentMode.isDisabled" @change.native="changeSelectStatus(paymentMode)">{{paymentMode.name}}</el-checkbox>
      <el-button type="text" size="small" v-if="paymentMode.name==='在线支付'" v-popover:UnionType>
        <i class="iconfont el-icon-question"></i>
      </el-button>
      <el-button type="text" size="small" v-if="paymentMode.name==='到店支付'" v-popover:UnionType1>
        <i class="iconfont el-icon-question"></i>
      </el-button>
      <el-button type="text" size="small" v-if="paymentMode.name==='货到付款'" v-popover:UnionType2>
        <i class="iconfont el-icon-question"></i>
      </el-button>
      <el-popover :ref="paymentMode.name==='在线支付'?'UnionType':paymentMode.name==='到店支付'?'UnionType1':'UnionType2'" placement="bottom-start"
        width="300" trigger="hover">
        <p v-if="paymentMode.name==='在线支付'">开通此支付方式后，用户下订单时可直接付款，付款资金实施到达您的账户中。
          目前平台支持会员卡余额支付、支付宝支付、银联支付。会员卡余额支付需要用户先预存才可消费。
          支付宝和银联支付您必须先开通这两种商家收银账号，将参数填写到对应处。
        </p>
        <p v-if="paymentMode.name==='到店支付'">开通此支付方式后，用户可先下订单，到店消费后由您确认收款金额并进行收款。
          此支付方式适用于无法准确定价的服务商品。
        </p>
        <p v-if="paymentMode.name==='货到付款'">开通此支付方式后，用户可先下订单，通过快递或自己送达至用户手中后向用户收取商品费用。
        </p>
      </el-popover>
      <label class="demonstration">排序</label>
      <el-input-number type="number" :min="1" controls-position="right" size="small" v-model="paymentMode.order" class="payment-method-order">排序</el-input-number>
      <div v-for="paymengTypes in paymentMode.paymengTypes" class="payment-method" :key="paymengTypes.name">
        <div class="inline">
          <div>
            <el-checkbox v-model="paymengTypes.shopValid" @change="changeParentSelect(paymentMode, paymengTypes.shopValid,paymengTypes)" />{{paymengTypes.name}}
          </div>
          <div>
            <label class="demonstration">排序</label>
            <el-input-number type="number" label="排序" :min="1" size="small" controls-position="right" v-model="paymengTypes.order"
              class="payment-method-order"></el-input-number>
          </div>
        </div>
        <div v-if="paymengTypes.shopValid===true&&paymengTypes.type==='0'&&paymentMode.method==='0'">
          <div class="paymentMode-div">
            <label>商户PID</label>
            <div class="demonstration-div">
              <el-input type="text" v-model="paymengTypes.appId" size="small" placeholder="请输入商户PID"></el-input>
            </div>
          </div>
          <div class="paymentMode-div">
            <label>商户私钥</label>
            <div class="demonstration-div">
              <el-input type="textarea" :autosize="{ minRows: 4}" :value="paymengTypes.privateKey.length<120?paymengTypes.privateKey:paymengTypes.privateKey.substr(0, 120) + '...'" placeholder="请输入商户私钥"></el-input>
            </div>
          </div>
          <div class="paymentMode-div">
            <label>支付宝公钥</label>
            <div class="demonstration-div">
              <el-input type="textarea" :autosize="{ minRows: 4}" :value="paymengTypes.publicKey.length<120?paymengTypes.publicKey:paymengTypes.publicKey.substr(0, 120) + '...'" placeholder="请输入支付宝公钥"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import paymentModeConf from '@/service/federation-mgmt/federationMgmt';
import isNotEmpty from '@/utils/is-not-empty';
export default {
  name: 'FederationMgmtIntroduce',
  components: { BizGrid, BizSaveButton },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:union.manage.edit']
        }
      ],
      contentData: {},
      pidErr: '',
      flag: false,
      privateKeyErr: '',
      publicKeyErr: ''
    };
  },
  props: {
    itemId: {
      type: String
    },
    type: {
      type: String
    }
  },
  created() {
    if (this.itemId) {
      this.type !== 'operator' && this.initData();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.type !== 'operator' && this.initData();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    changeSelectStatus(ele) {
      if (ele.valid === false || ele.valid === '0') {
        ele.paymengTypes.map(type => {
          type.shopValid = false;
        });
      } else if (ele.valid === true || ele.valid === '1') {
        ele.paymengTypes.map(type => {
          type.shopValid = true;
        });
      }
    },
    changeParentSelect(parent, ele, type) {
      if (ele === true || ele === '1') {
        parent.valid = true;
      }
    },
    initData() {
      this.loaded = false;
      this.saving = false;
      this.message = '';
      paymentModeConf.getPayments.bind(this)(
        { shopId: this.itemId || window.top.SHOP_ID },
        data => {
          this.contentData = data.content;
        },
        err => {
          this.$message.warning(err);
        }
      );
    },
    save() {
      // if(this.paymentMethods){

      // }
      let errMsg = '';
      let alipayFlag = false;
      if (
        (this.contentData[0].valid === '0' || this.contentData[0].valid === false) &&
        (this.contentData[1].valid === '0' || this.contentData[1].valid === false) &&
        (this.contentData[2].valid === '0' || this.contentData[2].valid === false)
      ) {
        this.$message.warning('至少选择一种支付方式');
        return;
      }
      this.contentData.map(paymentMode => {
        if (paymentMode.valid === true || paymentMode.valid === '1') {
          paymentMode.valid = true;
        } else {
          paymentMode.valid = false;
        }
        let parentValid = paymentMode.valid;
        let parentValidFlag = true;
        let orderValidFlag = '';
        let reg = new RegExp(/^\+?[1-9][0-9]*$/);
        if (paymentMode.order && !reg.test(paymentMode.order)) {
          orderValidFlag = '的排序格式不正确';
        }
        paymentMode.paymengTypes.map(type => {
          if (type.order < 1) {
            orderValidFlag = '[' + type.name + ']的排序不能小于1';
          }
          if (type.order && !reg.test(type.order)) {
            orderValidFlag = '[' + type.name + ']的排序格式不正确';
          }
          if (type.shopValid === true || type.shopValid === '1') {
            type.shopValid = true;
            parentValidFlag = false;
            // 支付宝支付
            if (type.type === '0' && paymentMode.method === '0') {
              if (!isNotEmpty(type.appId)) {
                this.$message.warning('商户PID不能为空');
                return false;
              } else {
                this.pidErr = '';
              }
              if (!isNotEmpty(type.privateKey)) {
                this.$message.warning('商户私钥不能为空');
                return false;
              } else {
                this.privateKeyErr = '';
              }
              if (!isNotEmpty(type.publicKey)) {
                this.$message.warning('支付宝公钥不能为空');
                return false;
              } else {
                this.publicKeyErr = '';
              }
            }
          } else {
            type.shopValid = false;
          }
        });

        if (parentValid === true || parentValid === '1') {
          if (orderValidFlag) {
            errMsg = paymentMode.name + orderValidFlag;
            this.$message.warning(errMsg);
            return false;
          }
          if (parentValidFlag) {
            this.$message.warning(errMsg = '请选择' + paymentMode.name + '的付款方式');
            return false;
          }
        }
      });
      if (isNotEmpty(errMsg)) {
        return;
      }
      if (alipayFlag) {
        return;
      }
      paymentModeConf.editPayments.bind(this)(
        this.contentData,
        data => {
          this.$message.success('保存成功');
        },
        err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_CREATE:', err);
        }
      );
    }
  }
};
</script>
<style lang="scss">
.fedration-mgmt-payment {
  font-size: 14px;
  .inline {
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    .el-input-number {
      width: 120px;
      margin-left: 20px;
    }
  }
  .payment-mode-content {
    padding-top: 20px;
  }
  .payment-method {
    margin: 10px 0px 0px 50px;
  }
  .payment-method-order {
    width: 120px;
    margin-left: 20px;
  }
  .paymentMode-div {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .biz-save-button {
    justify-content: flex-start;
  }
  .demonstration {
    padding: 0px 0px 0px 30px;
  }
  .demonstration-div {
    width: 300px;
    max-height: 96px;
  }
}
</style>
