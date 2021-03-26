<template>
  <biz-grid class="function-defination-base-info">
    <div class="panel-top" slot="top">
      <div class="error-tip"><span v-if="unorderService.id">您的{{ unorderService.name }}服务未订购或已过期, 订购本服务需先购买该服务  <el-button type="text" @click="goSubscribe">-->去订购</el-button></span></div>
      <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
    </div>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <div class="header">
        {{ form.name }}
      </div>
      <el-form-item label="服务价格" prop="price">
        <span class="color-orange">￥{{ form.price }}</span>
        <span class="color-orange deleted"
          v-show="selectedSpecification.discount && Number(selectedSpecification.discount) !== 1">￥{{
          selectedSpecification.price }}</span>
      </el-form-item>
      <el-form-item label="规格" prop="sId">
        <el-radio-group size="mini" v-model="form.sId">
          <el-radio-button v-for="item in specificationList" :key="item.sId" :label="item.sId">
            <span v-if="form.businessServiceType === 'platform'">{{ item.period }}个月</span>
            <span v-else>{{ item.period }}条</span>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="付款方式" prop="payMethod">
        <el-radio-group v-model="form.payMethod">
          <el-radio label="0">支付宝</el-radio>
          <el-radio label="1">个人银联</el-radio>
          <el-radio label="2">企业银联</el-radio>
          <el-radio label="3">账户余额</el-radio>
        </el-radio-group>
        <span v-if="form.payMethod==='3'">可用余额：{{availableAmount}}</span>
      </el-form-item>
      <el-form-item label="订购店铺" prop="selectShop">
        <el-select placeholder="请选择订购店铺" v-model="form.selectShop" filterable>
          <el-option v-for="shop in shopList" :key="shop.id" :value="shop.id" :label="shop.name">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="el-form-item el-form-item--small details">
        <div class="el-form-item__label" style="width: 120px;">服务简介</div>
        <div class="content-area" v-html="form.description"></div>
      </div>
    </el-form>
    <el-dialog title="网上支付提示(支付完成前请不要关闭此窗口)" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" :modal="false"
      custom-class="paymentDialog" append-to-body>
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成支付
      </span>
      <span>
        若没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <span v-popover:codePop class="popover-help-text">查看帮助</span>
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
        <el-button type="primary" @click="queryOrderState" size="mini">支付完成</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'OrderBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      unorderService: {},
      availableAmount: '',
      loading: false,
      dialogVisible: false,
      operations: [{ label: '订阅', name: 'subscribe', type: 'primary', disabled: false }],
      rules: {
        name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
        keyword: [{ required: true, message: 'key不能为空', trigger: 'blur' }]
      },
      form: {
        price: 0,
        sId: '',
        // 0: 支付宝, 1: 个人银联, 2: 企业银联
        payMethod: '0',
        selectShop: ''
      },
      specificationList: [],
      shopList: [],
      orderId: ''
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  computed: {
    ...mapGetters(['currentUser']),
    id() {
      return this.itemId.id || '';
    },
    selectedSpecification() {
      return (
        this.specificationList.find(item => {
          return item.sId === this.form.sId;
        }) || {}
      );
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      this.$refs.form.resetFields();
      this.form.selectShop = this.currentUser.shop.id || window.top.SHOP_ID;
      if (newVal.id) {
        this.queryUnorderedService();
        this.refresh();
      }
    },
    'form.sId': function(newVal, oldVal) {
      if (newVal) {
        let selected = this.specificationList.find(item => {
          return item.sId === newVal;
        });
        // this.form.price = ((selected.discount * 10 * (selected.price * 100)) / 1000).toFixed(2);
        this.form.price = selected.price;
      }
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    queryUnorderedService() {
      let params = {
        id: this.id,
        shopId: this.form.shopId
      };
      http.get('/admin/businessOrder/queryService/unOrderList.jhtml', params)
        .then(data => {
          this.operations[0].disabled = !!data.unOrderList.length;
          if (data.unOrderList.length) {
            this.unorderService = data.unOrderList[0];
          } else {
            this.unorderService = {};
          }
        })
        .catch();
    },
    goSubscribe() {
      this.$emit('subscribe-service', this.unorderService.id);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    refresh() {
      let params = {
        id: this.id,
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || ''
      };
      http
        .get(urls.servicesMgmt.getOrderDetail, params)
        .then(data => {
          this.form = Object.assign(this.form, data.serviceData, data.businessProductData);
          this.specificationList = data.specificationData.sort((a, b) => {
            return Number(a.period) - Number(b.period);
          });
          this.shopList = data.storeData;
          this.availableAmount = data.availableAmount.substring(0, data.availableAmount.indexOf('.') + 3);
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
          console.log('ERR_REFRESH: ', err);
        });
    },
    async subscribe() {
      const { sId, payMethod, selectShop, price } = this.form;
      if (!sId) {
        this.$message.warning('请选择规格');
        return;
      }
      if (!payMethod) {
        this.$message.warning('请选择支付方式');
        return;
      }

      let params = null;
      let res = null;
      try {
        if (this.form.businessServiceType === 'platform') {
          params = {
            publishStore: this.currentUser.shop.id || window.top.SHOP_ID || '',
            productIds: [this.id],
            specificationId: sId,
            shopId: selectShop || this.currentUser.shop.id || window.top.SHOP_ID,
            // newly新购 renewal续订
            type: 'newly'
          };
          res = await http.post(urls.servicesMgmt.createPlatformOrder, params);
        } else {
          params = {
            publishStore: this.currentUser.shop.id || window.top.SHOP_ID || '',
            specificationId: sId,
            subscribeStore: selectShop || this.currentUser.shop.id || window.top.SHOP_ID,
            products: [{ id: this.id }]
          };
          res = await http.post(urls.servicesMgmt.createSmsOrder, params);
        }
        this.orderId = res.orderId;
        if (!isNaN(price) && !parseFloat(price)) {
          // 价格00.00
          this.freePay();
        } else {
          if (this.form.payMethod === '3') {
            this.accountPay();
          } else {
            if (this.form.payMethod === '0' && /MISE|Firefox/.test(navigator.userAgent)) {
              this.$message.warning('此浏览器不支持支付，请更换浏览器');
            }
            this.goPayPage(this.form.payMethod);
          }
        }
      } catch (e) {
        this.$message.warning(e.errorMessage);
      }
    },
    accountPay() {
      let params = { orderId: this.orderId, grade: 'platform' };
      http
        .get('/admin/order/json/accountPay.jhtml', params)
        .then(data => {
          this.$emit('refresh');
          this.$message.success('操作成功');
          this.$router.push({ path: '/union/service-mgmt/manage/order', query: {} });
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    freePay() {
      let params = { orderId: this.orderId, paymentTypeId: this.form.payMethod };
      http
        .post(urls.servicesMgmt.authorityService, params)
        .then(data => {
          this.$emit('refresh');
          this.$message.success('操作成功');
          this.$router.push({ path: '/union/service-mgmt/manage/order', query: {} });
        })
        .catch(err => {
          this.$message.warning(err.errorMessage);
        });
    },
    async goPayPage(type) {
      let data = null;
      const params = { orderId: this.orderId, version: '201901' };
      try {
        if (type === '0') {
          // alipay
          data = await http.get(urls.servicesMgmt.alipayPagePay, params);
          window.open(data.response.body);
        } else if (type === '1') {
          // 个人银联
          data = await http.get(urls.servicesMgmt.unionGatePay, params);
          let newWindow = window.open('', '_blank', '');
          newWindow.document.open('text/html', 'replace');
          newWindow.opener = null;
          newWindow.document.write(data.response);
          newWindow.document.close();
        } else if (type === '2') {
          // 企业银联
          data = await http.get(urls.servicesMgmt.unionB2BPay, params);
          let newWindow = window.open('', '_blank', '');
          newWindow.document.open('text/html', 'replace');
          newWindow.opener = null;
          newWindow.document.write(data.response);
          newWindow.document.close();
        }
        this.dialogVisible = true;
        this.$emit('closePoup');
      } catch (e) {
        this.$message.warning(e.errorMessage);
        console.log('ERR_GO_PAY: ', e);
      }
    },
    // 查询订单支付情况
    async queryOrderState() {
      const params = { orderId: this.orderId, version: '201901' };
      try {
        switch (this.form.payMethod) {
          case '0':
            await http.get(urls.servicesMgmt.alipayQuery, params);
            break;
          case '1':
            await http.get(urls.servicesMgmt.unionGatePayQuery, params);
            break;
          case '2':
            await http.get(urls.servicesMgmt.unionB2BPayQuery, params);
            break;
          default:
            break;
        }
        this.$message.warning('支付成功');
        this.$emit('refresh');
      } catch (e) {
        this.$message.warning(e.message);
        console.log('ERR_QUERY_STATE: ', e);
      }
      this.dialogVisible = false;
    },
    // 显示消息提示
    showMessage(msg, type = 'success') {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 显示侧边消息提示
    showNotify(msg, type = 'success') {
      this.$notify({
        showClose: true,
        duration: 1000,
        message: msg,
        type: type
      });
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
.function-defination-base-info {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .color-orange {
    color: #ff7300;
    font-size: 16px;
  }
  .deleted {
    margin-left: 20px;
    text-decoration: line-through;
  }
  .panel-top {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    float: left;
    .error-tip {
      margin-right: 10px;
    }
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    .header {
      font-size: 20px;
      color: #101010;
      margin-left: 45px;
    }
    .el-radio-button--mini {
      margin-bottom: 6px;
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        box-shadow: none;
      }
      .el-radio-button__inner {
        padding: 7px 10px;
        border-radius: 0;
        border-left: 1px solid #dcdfe6;
        margin-left: -1px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
    }
    .content-area {
      margin-left: 50px;
      width: calc(100% - 50px);
      min-height: 300px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 5px;
      img,
      video {
        max-width: 100%;
      }
    }
    .el-input-number--small {
      width: 100px;
    }
  }
}
.popover-help-text {
  color: #ff7300;
  font-size: 12px;
}
</style>
