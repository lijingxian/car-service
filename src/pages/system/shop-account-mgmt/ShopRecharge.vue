<template>
  <biz-grid class="shop-recharge">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="充值金额" prop="amount" class="isRequired">
        <el-radio-group @change="amountChange" v-model="radioValue" size="mini">
          <el-radio-button label="0">￥500</el-radio-button>
          <el-radio-button label="1">￥1000</el-radio-button>
          <el-radio-button label="2">￥2000</el-radio-button>
          <el-radio-button label="3">￥5000</el-radio-button>
          <el-radio-button label="4">￥10000</el-radio-button>
          <el-radio-button label="5">自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自定义金额" prop="price" v-if="radioValue === '5'">
        <el-input v-model="form.price" placeholder="请输入500~10000之间的金额"></el-input>
        <div style="color:darkgray">单次充值金额限定范围为500~10000，如充值金额较大请分次充值。</div>
      </el-form-item>
      <el-form-item label="付款方式" prop="paymentTypeName">
        <el-radio-group v-model="form.paymentTypeName">
          <el-radio label="支付宝">支付宝</el-radio>
          <el-radio label="个人银联">个人银联</el-radio>
          <!-- <el-radio label="企业银联">企业银联</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-dialog title="网上支付提示(支付完成前请不要关闭此窗口)" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成支付
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <span v-popover:codePop class="helpClass">查看帮助</span>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">支付遇到问题</el-button>
        <el-button type="primary" @click="payQuery" size="mini">支付完成</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/services-mgmt/services-order/subscriptionService';
import add from '@/assets/images/add.svg';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'ShopAccountMgmtRecharge',
  props: {
    itemId: {
      type: String
    }
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  data() {
    return {
      dialogVisible: false,
      rules: {
        price: [
          { required: true, message: '请输入自定义金额', trigger: 'submit' }
          // { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        paymentTypeName: [
          {
            required: true
          }
        ]
      },
      radioValue: '0',
      orderId: '',
      // 用户信息
      form: {
        amount: '500',
        price: '',
        paymentTypeName: '支付宝'
      },
      operations: [
        {
          label: '充值',
          name: 'save',
          type: 'primary'
        }
      ],
      tableData: [],
      loading: false,
      open: false,
      add: add,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: ''
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
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
    clear() {
      this.radioValue = '0';
      this.form = {
        amount: '500',
        price: '',
        paymentTypeName: '支付宝'
      };
      this.$refs.form.clearValidate('price');
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    payQuery() {
      if (this.form.paymentTypeName === '支付宝') {
        this.alipayQuery();
      } else if (this.form.paymentTypeName === '个人银联') {
        this.unionGatePayQuery();
      } else {
        this.unionB2BPayQuery();
      }
    },
    save() {
      if (this.form.paymentTypeName === '') {
        this.$message.warning('请选择一个支付方式');
        return;
      }
      if (this.radioValue === '5') {
        this.form.amount = this.form.price;
      }
      this.$refs.form.validate(isValid => {
        if (isValid) {
          let params = {
            shopId: this.getUser().shop.id || window.top.SHOP_ID || '',
            accountId: this.itemId,
            amount: this.form.amount,
            paymentTypeName: this.form.paymentTypeName
          };
          http
            .post('/admin/order/rechargeAccount.jhtml', params)
            .then(data => {
              this.orderId = data.orderId;
              this.dialogVisible = true;
              if (this.form.paymentTypeName === '支付宝') {
                this.alipayPagePay(this.orderId);
              } else if (this.form.paymentTypeName === '个人银联') {
                this.unionGatePay(this.orderId);
              } else {
                this.unionB2BPay(this.orderId);
              }
            })
            .catch(errData => {
              this.loading = false;
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    alipayPagePay(orderId) {
      service.alipayPagePay(
        { orderId: orderId },
        data => {
          window.open(data.response.body);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    alipayQuery() {
      service.alipayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$emit('operationSuccess');
        }
      );
    },
    unionGatePay(orderId) {
      service.unionGatePay(
        { orderId: orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionGatePayQuery() {
      service.unionGatePayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
        }
      );
    },
    unionB2BPay(orderId) {
      service.unionB2BPay(
        { orderId: orderId },
        data => {
          let newwin = window.open('', '_blank', '');
          if (newwin === null) {
            this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          }
          newwin.document.open('text/html', 'replace');
          newwin.opener = null;
          newwin.document.write(data.response);
          newwin.document.close();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
        }
      );
    },
    unionB2BPayQuery(orderId) {
      service.unionB2BPayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$emit('operationSuccess');
        }
      );
    },
    amountChange() {
      if (this.radioValue === '0') {
        this.form.amount = '500';
      } else if (this.radioValue === '1') {
        this.form.amount = '1000';
      } else if (this.radioValue === '2') {
        this.form.amount = '2000';
      } else if (this.radioValue === '3') {
        this.form.amount = '5000';
      } else if (this.radioValue === '4') {
        this.form.amount = '10000';
      } else {
        this.form.amount = '';
      }
    }
  }
};
</script>

<style lang="scss">
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.shop-recharge {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-radio-button {
    padding: 5px;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 15px;
    font-size: 13px;
  }
  .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
  }
  .el-input {
    width: 250px;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .message-mgmt-header {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 14px;
    z-index: 1;
  }
  .shop-name {
    color: #ff7300;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
