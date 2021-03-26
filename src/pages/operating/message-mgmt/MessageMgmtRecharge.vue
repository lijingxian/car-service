<template>
  <biz-grid class="message-mgmt-recharge">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="短信充值套餐" prop="products">
        <div class="product-column">
          <div class="flex">
            <div class="rights_card" v-for="(tag,index) in tableData" :key="index" @click="selectMode(tag)">
              <el-radio v-model="form.products[0]" :label="tag.id" :disabled="tag.isValid==='0'?true:false">
                <div class="logo">
                  <div class="image">
                    <div>{{tag.quantity}}条</div>
                    <div>￥{{tag.price}}</div>
                  </div>
                </div>
              </el-radio>
            </div>
          </div>
        </div>
      </el-form-item>
      <div>
        <el-form-item label="付款方式" prop="paymentTypeName">
          <el-radio v-model="form.paymentTypeName" label="支付宝">支付宝</el-radio>
          <el-radio v-model="form.paymentTypeName" label="个人银联">个人银联</el-radio>
          <el-radio v-model="form.paymentTypeName" label="企业银联">企业银联</el-radio>
        </el-form-item>
        <biz-save-button slot="top" :operations="operations" @operate="operate">
        </biz-save-button>
      </div>
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
import service from '@/service/message-mgmt/messageMgmt';
import add from '@/assets/images/add.svg';
import { mapGetters } from 'vuex';
export default {
  name: 'MessageMgmtRecharge',
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
        products: [
          {
            required: true
          }
        ],
        paymentTypeName: [
          {
            required: true
          }
        ]
      },
      orderId: '',
      // 用户信息
      form: {
        products: [],
        paymentTypeName: ''
      },
      operations: [
        {
          label: '付款',
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
  created() {
    this.getList();
    this.query();
  },
  mounted() {
    this.form.operator = this.getUser().realName;
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    cancel() {
      this.open = false;
    },
    query() {
      service.query(
        { orderId: this.$route.query.id },
        data => {
          this.loading = false;
          this.orderId = data.data.id;
          this.form.products.push(data.data.products[0].id);
          this.form.paymentTypeName = data.data.paymentTypeName;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getList() {
      service.listSmsPackage({}, data => {
        this.loading = false;
        this.tableData = data.dataList;
      });
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
      if (this.form.products.length === 0) {
        this.$message.warning('请选择一个套餐');
        return;
      }
      if (this.form.paymentTypeName === '') {
        this.$message.warning('请选择一个支付方式');
        return;
      }
      if (this.$route.query.id) {
        this.dialogVisible = true;
        if (this.form.paymentTypeName === '支付宝') {
          // if (
          //   navigator.userAgent.indexOf('Firefox') !== -1 ||
          //   navigator.userAgent.indexOf('MSIE') !== -1
          // ) {
          //   this.dialogVisible = false;
          //   this.$message.warning('此浏览器不支持支付，请更换浏览器');
          //   return;
          // }
          this.alipayPagePay();
        } else if (this.form.paymentTypeName === '个人银联') {
          this.unionGatePay();
        } else {
          this.unionB2BPay();
        }
      }
      !this.$route.query.id &&
        service.createSmsOrder(
          this.getSaveParams(),
          data => {
            this.orderId = data.orderId;
            this.dialogVisible = true;
            if (this.form.paymentTypeName === '支付宝') {
              // if (
              //   navigator.userAgent.indexOf('Firefox') !== -1 ||
              //   navigator.userAgent.indexOf('MSIE') !== -1
              // ) {
              //   this.dialogVisible = false;
              //   this.$message.warning('此浏览器不支持支付，请更换浏览器');
              //   return;
              // }
              this.alipayPagePay();
            } else if (this.form.paymentTypeName === '个人银联') {
              this.unionGatePay();
            } else {
              this.unionB2BPay();
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    alipayPagePay(orderId) {
      service.alipayPagePay(
        { orderId: this.orderId },
        data => {
          // let newwin = window.open('', '_blank', '');
          // // if (newwin === null) {
          // //   this.$message.warning('您的浏览器阻止了付款窗口打开，请关闭拦截');
          // // }
          // newwin.document.open('text/html', 'replace');
          // newwin.opener = null;
          // newwin.document.write(data.response.body);
          // newwin.document.close();
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
          this.$router.push({
            path: '/operating/service-mgmt/message/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/message/order',
            query: {}
          });
        }
      );
    },
    unionGatePay() {
      service.unionGatePay(
        { orderId: this.orderId },
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
    unionGatePayQuery(orderId) {
      service.unionGatePayQuery(
        { orderId: this.orderId },
        data => {
          this.$message.success('支付成功');
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/message/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          // this.$router.push({
          //   path: '/operating/service-mgmt/message/order',
          //   query: {}
          // });
        }
      );
    },
    unionB2BPay() {
      service.unionB2BPay(
        { orderId: this.orderId },
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
          this.$router.push({
            path: '/operating/service-mgmt/message/order',
            query: {}
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.message);
          this.dialogVisible = false;
          this.$router.push({
            path: '/operating/service-mgmt/message/order',
            query: {}
          });
        }
      );
    },
    selectMode(tag) {
      this.form.products = [tag.id];
    },
    getSaveParams() {
      return {
        products: this.form.products,
        paymentTypeName: this.form.paymentTypeName
      };
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
.message-mgmt-recharge {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-input {
    width: 200px;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
  .biz-save-button {
    justify-content: flex-start;
    margin-left: 120px;
  }
  .product-column {
    .flex {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      .rights_card {
        display: inline-block;
        width: 23%;
        position: relative;
        margin: 20px 0px 20px 20px;
        transition: all 0.3s;
        &:hover {
          opacity: 0.9;
          > .logo {
            i {
              opacity: 1;
              cursor: pointer;
            }
          }
        }
        .logo {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          border: 1px solid #c1c1c1;
          border-radius: 10%;
          .image {
            text-align: center;
            position: relative;
            padding: 10px;
          }
          i {
            font-size: 15px;
            background: #000;
            color: #fff;
            position: absolute;
            border-radius: 50%;
            float: right;
            top: 0px;
            right: 0px;
            opacity: 0;
            transition: all 0.3s;
          }
        }
      }
      .rights_card_add {
        text-align: center;
        margin: 20px 0px 20px 20px;
        .image {
          border: dashed 1px #929292;
          border-radius: 5px;
          width: 85px;
          height: 60px;
          background-repeat: no-repeat;
          padding: 2px;
          cursor: pointer;
          img {
            margin-top: 10px;
            color: #c1c1c1;
          }
        }
      }
    }
  }
}
</style>
