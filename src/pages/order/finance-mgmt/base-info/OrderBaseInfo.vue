<template>
  <biz-grid class="store-value-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form :rules="rules" :model="order" ref="order" disabled label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="订单编号" prop="sn">
        <el-input placeholder v-model="order.sn"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="type">
        <el-select placeholder="请选择状态" v-model="order.type">
          <el-option value="0" label="全部"></el-option>
          <el-option value="1" label="待商家确认"></el-option>
          <el-option value="2" label="商家已确认"></el-option>
          <el-option value="3" label="买家已付款"></el-option>
          <el-option value="4" label="订单已执行"></el-option>
          <el-option value="5" label="交易完成"></el-option>
          <el-option value="6" label="交易关闭"></el-option>
          <el-option value="7" label="已评价"></el-option>
          <el-option value="8" label="订单过期"></el-option>
          <el-option value="9" label="退款退货中"></el-option>
          <el-option value="10" label="退款退货完成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单金额" prop="amount">
        <el-input placeholder v-model="order.amount"></el-input>
      </el-form-item>
      <el-form-item label="调整金额" prop="offsetAmount">
        <el-input placeholder v-model="order.offsetAmount"></el-input>
      </el-form-item>
      <el-form-item label="实付金额" prop="amountPaid">
        <el-input placeholder v-model="order.amountPaid"></el-input>
      </el-form-item>
      <el-collapse v-model="activeTabName">
        <el-collapse-item name="customerInfo">
          <template slot="title">
            <span class="collapse-title">客户信息</span>
          </template>
          <el-form-item label="会员昵称">
            <el-input placeholder v-model="order.member.nickname"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select placeholder v-model="order.member.gender">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
              <el-option label="保密" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input placeholder v-model="order.member.mobile"></el-input>
          </el-form-item>
          <el-form-item label="车辆">
            <el-input placeholder v-model="order.car.plateNumber"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="serviceInfo">
          <template slot="title">
            <span class="collapse-title">服务信息</span>
          </template>
          <el-form-item label="顾问">
            <el-select placeholder v-model="order.consultant.id">
              <el-option :label="order.consultant.userName" :value="order.consultant.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区">
            <el-input placeholder v-model="order.areaName"></el-input>
          </el-form-item>
          <el-form-item label="服务地址">
            <el-input placeholder v-model="order.address"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input placeholder type="textarea" v-model="order.memo"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="promotionInfo">
          <template slot="title">
            <span class="collapse-title">优惠信息</span>
          </template>
          <el-form-item label="销售折扣">
            <el-input placeholder v-model="order.promotionDiscount"></el-input>
          </el-form-item>
          <el-form-item label="优惠券折扣">
            <el-input placeholder v-model="order.couponDiscount"></el-input>
          </el-form-item>
          <el-form-item label="V豆抵扣">
            <el-input placeholder v-model="order.beanDiscount"></el-input>
          </el-form-item>
          <el-form-item label="赠送积分">
            <el-input placeholder v-model="order.point"></el-input>
          </el-form-item>
          <el-form-item label="赠送V豆">
            <el-input placeholder v-model="order.giftBean"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="paymentInfo">
          <template slot="title">
            <span class="collapse-title">付款信息</span>
          </template>
          <el-form-item label="支付方式">
            <el-input placeholder v-model="order.paymentMethodName"></el-input>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-input placeholder v-model="order.paymentTypeName"></el-input>
          </el-form-item>
          <el-form-item label="会员卡" prop="payments[0].memberCardId" v-if="order.payments[0].paymentType==='会员卡余额'">
            <el-select v-model="order.payments[0].memberCardId" disabled placeholder="请选择会员卡">
              <el-option v-for="(item,index) in listExistCard" :key="index" :label="item.template.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付款银行" prop="payments[0].payBank" v-if="order.payments[0].paymentType==='刷卡'||order.payments[0].paymentType==='汇款'">
            <el-input placeholder="请输入付款银行" v-model="order.payments[0].payBank"></el-input>
          </el-form-item>
          <el-form-item label="付款账号" prop="payments[0].payAccount" v-if="order.payments[0].paymentType==='刷卡'||order.payments[0].paymentType==='汇款'">
            <el-input placeholder="请输入付款账号" v-model="order.payments[0].payAccount"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="logisticsInfo">
          <template slot="title">
            <span class="collapse-title">物流信息</span>
          </template>
          <el-form-item label="配送方式">
            <el-select v-model="shippingMethodId" placeholder="请选择配送方式">
              <el-option v-for="item in shippingMethods" :key="item.index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流公司" v-show="shippingMethodId" prop="shippings[0].logistics">
            <el-input placeholder="请选择物流公司" v-model="order.shippings[0].logistics"></el-input>
          </el-form-item>
          <el-form-item label="物流单号" v-show="shippingMethodId" prop="shippings[0].expressSn">
            <el-input placeholder="请输入物流单号" v-model="order.shippings[0].expressSn"></el-input>
          </el-form-item>
          <el-form-item label="物流费用" v-show="shippingMethodId" prop="shippings[0].freight">
            <el-input placeholder="请输入物流费用" v-model="order.shippings[0].freight"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" v-show="shippingMethodId" prop="shippings[0].address">
            <el-input placeholder="请输入收货地址" v-model="order.shippings[0].address"></el-input>
          </el-form-item>
          <el-form-item label="收货人" v-show="shippingMethodId" prop="shippings[0].consignee">
            <el-input placeholder="请输入收货人" v-model="order.shippings[0].consignee"></el-input>
          </el-form-item>
          <el-form-item label="电话" v-show="shippingMethodId" prop="shippings[0].phone">
            <el-input placeholder="请输入电话" v-model="order.shippings[0].phone"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="invoiceInfo">
          <template slot="title">
            <span class="collapse-title">发票信息</span>
          </template>
          <el-form-item label="是否需要发票" prop="invoiceState">
            <el-select v-model="order.invoiceState" :disabled="true">
              <el-option label="否" :value="order.invoiceState"></el-option>
              <el-option label="是" :value="order.invoiceState"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="otherInfo">
          <template slot="title">
            <span class="collapse-title">其他信息</span>
          </template>
          <el-form-item label="创建时间">
            <el-date-picker value-format="yyyy-MM-dd" v-model="order.orderTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间">
            <el-date-picker value-format="yyyy-MM-dd" v-model="order.deliveryTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="付款时间">
            <el-date-picker value-format="yyyy-MM-dd" v-model="order.payments[0].paymentDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-date-picker value-format="yyyy-MM-dd" v-model="order.orderTime"></el-date-picker>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/order-mgmt/orderMgmt';
import { financeMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'StoreValueMgmtBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      activeTabName: '',
      loading: false,
      operations: [
        // { label: '保存', name: 'save', type: 'primary' }
      ],
      rules: {},
      // 顾问ID
      adminCurrentId: '',
      // 顾问列表
      afterSales: [],
      listExistCard: [],
      consultants: [],
      adminCurrent: [],
      order: this.resetOrder(),
      // 配送方式
      shippingMethodId: '',
      shippingMethods: []
    };
  },
  components: {
    BizGrid,
    BizSaveButton
  },
  methods: {
    operate(name) {
      this[name]();
    },
    resetOrder() {
      return {
        sn: '',
        type: '',
        userId: '',
        amount: '',
        offsetAmount: '',
        amountPaid: '',
        member: {},
        car: {},
        consultant: {},
        area: '',
        consignee: '',
        areaName: '',
        address: '',
        phone: '',
        memo: '',
        promotionDiscount: '',
        couponDiscount: '',
        beanDiscount: '',
        point: '',
        giftBean: '',
        paymentMethodName: '',
        paymentTypeName: '',
        payments: [{}],
        payAccount: '',
        shippings: [
          {
            shippingMethod: '',
            deliveryCorpId: '',
            expressSn: '',
            freight: '',
            address: '',
            consignee: '',
            phone: '',
            zipCode: ''
          }
        ],
        invoiceState: '',
        invoiceType: '',
        invoiceTitle: '',
        taxNumber: '',
        orderTime: '',
        deliveryTime: '',
        paymentTime: '',
        completeTime: ''
      };
    },
    resetForm() {
      return {
        order: {}
      };
    },
    clear() {
      this.activeTabName = '';
      this.form = this.resetForm();
      // this.$refs['order'].resetFields();
    },
    refresh() {
      this.loading = true;
      let params = { orderId: this.itemId.id };
      http
        .get(financeMgmt.store.baseInfo.query, params)
        .then(data => {
          this.loading = false;
          this.adminCurrentId = data.adminCurrent.id;
          this.afterSales = data.afterSales;
          this.shippingMethods = data.shippingMethods;
          data.shippingMethods.map(method => {
            if (data.order.shippingMethodName === method.name) {
              this.shippingMethodId = method.id;
            }
          });
          this.order = Object.assign(this.resetOrder(), data.order);
          if (!this.order.payments.length) {
            this.order.payments = [{}];
          }
          if (this.order.shippings.length === 0) {
            this.order.shippings = [
              {
                shippingMethod: '',
                deliveryCorpId: '',
                expressSn: '',
                freight: '',
                address: this.order.areaName ? this.order.areaName + this.order.address : this.order.address,
                consignee: this.order.consignee,
                phone: this.order.phone,
                zipCode: this.order.zipCode
              }
            ];
          }
          this.adminCurrent = [{ id: data.adminCurrent.id, name: data.adminCurrent.realName }];
          if (!this.order.consultant.id) {
            this.order.consultant = { id: data.adminCurrent.id, userName: data.adminCurrent.realName };
          } else {
            this.adminCurrent = [{ id: this.order.consultant.id, name: this.order.consultant.realName }];
          }
          // if (!this.order.shippings.length) {
          //   this.order.shippings = [{}];
          // }
          // this.listAdminByRole();
          this.listExistCardTemplate();
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    listAdminByRole() {
      let roleTypes = '';
      if (this.$route.params.orderType === 'car') {
        roleTypes = ['salesman'];
      } else {
        roleTypes = ['afterSale', 'reception', 'testDriver'];
      }
      service.listAdminByRole(
        { roleTypes: roleTypes },
        data => {
          this.loading = false;
          this.flag = false;
          console.log(this.form.consultant.id);
          data.dataList.map(item => {
            if (item.id === this.adminCurrent[0].id) {
              this.flag = true;
            }
          });
          if (!this.flag) {
            this.consultants = data.dataList.concat(this.adminCurrent);
          } else {
            this.consultants = data.dataList;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      this.$refs.form.validate(result => {
        if (result) {
          this.submit();
        }
      });
    },
    submit() {
      if (this.itemId.id) {
        this.update();
      } else {
        this.create();
      }
    },
    listExistCardTemplate() {
      service.listExistCardTemplate(
        { userId: this.order.userId },
        data => {
          this.loading = false;
          this.listExistCard = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    create() {
      this.loading = true;
      let params = this.form;
      http
        .post(financeMgmt.store.baseInfo.create, params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('update');
          this.form = this.resetForm();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      let params = Object.assign(this.form, this.itemId);
      http
        .put(financeMgmt.store.baseInfo.update, params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('update');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    if (this.itemId.id) this.refresh();
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.store-value-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px 20px 0 20px;
  }
  .el-collapse {
    // margin: 0 20px 20px 20px;
    // .el-collapse-item__header:before {
    //   content: '';
    //   position: absolute;
    //   right: 20px;
    //   // bottom: 0px;
    //   width: calc(100% - 140px);
    //   height: 1px;
    //   background-color: #ebeef5;
    // }
    // .el-collapse-item:last-child {
    //   .el-collapse-item__wrap:after {
    //     content: '';
    //     position: absolute;
    //     right: 20px;
    //     // bottom: 0px;
    //     width: calc(100% - 140px);
    //     height: 1px;
    //     background-color: #ebeef5;
    //   }
    // }
    .collapse-title {
      display: inline-block;
      width: 100px;
      padding-right: 12px;
      text-align: right;
      font-size: 14px;
      color: #606266;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
