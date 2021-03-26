<template>
  <biz-grid class="logistics-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit"></biz-save-button>
    <el-table :data="form.shippings" style="width: 100%" size="small">
      <el-table-column label="配送方式" prop="shippingMethod" min-width="80"></el-table-column>
      <el-table-column label="物流公司" prop="logistics" min-width="80"></el-table-column>
      <el-table-column label="物流单号" prop="expressSn" min-width="80"></el-table-column>
      <el-table-column label="物流费用" prop="freight" min-width="80"></el-table-column>
      <el-table-column label="收货地址" prop="address" min-width="80"></el-table-column>
      <el-table-column label="商品" prop min-width="180">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div v-for="shippingItem in scope.row.shippingItems" :key="shippingItem.id">{{shippingItem.name}}x{{shippingItem.quantity}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" min-width="80">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="mini" @click="detailClickHandler(scope.row)">详情</el-button>
            <el-button type="text" size="mini" @click="certificate(scope.row.id)">凭证</el-button>
            <el-button type="text" size="mini" @click="followClickHandler(scope.row)">物流跟踪</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showLogistics" center append-to-body width="700px">
      <el-form ref="logisticsForm" size="small" label-width="110px" :model="form" :rules="rules" :inline-message="true">
        <el-table :data="form.orderItems" style="width: 100%" size="small">
          <el-table-column label="商品" prop="name" min-width="80"></el-table-column>
          <el-table-column label="条码" prop="barCode" min-width="80">
            <div slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</div>
          </el-table-column>
          <!-- <el-table-column label="订单数量" min-width="80" v-if="!isShipped">
            <div slot-scope="scope">
              <div class="biz-customcol">
                {{scope.row.quantity}}
              </div>
            </div>
          </el-table-column>-->
          <el-table-column label="已发货数量" min-width="80">
            <div slot-scope="scope">{{scope.row.shippedQuantity}}</div>
          </el-table-column>
          <el-table-column label="本次发货数量" v-if="!isShipped">
            <div slot-scope="scope">
              <div class="biz-customcol">
                <el-input-number size="mini" :min="0" v-model="scope.row.unShippedQuantity" :disabled="isShipped"></el-input-number>
              </div>
            </div>
          </el-table-column>
        </el-table>
        <el-form-item label="配送方式" prop="shippingMethodId">
          <el-select v-model="form.shippingMethodId" placeholder="请选择配送方式" :disabled="isShipped" v-if="!isShipped">
            <el-option label="空" value></el-option>
            <el-option v-for="(shippingMethod,index) in shippingMethod" :key="index" :label="shippingMethod.name" :value="shippingMethod.id"></el-option>
          </el-select>
          <el-input v-model="form.shippingMethodName" :disabled="isShipped" v-if="isShipped"></el-input>
        </el-form-item>
        <el-form-item label="零担物流" prop="isLCL">
          <el-switch v-model="form.isLCL" :disabled="isShipped" active-value="1" inactive-value="0" active-color="#ff7300" inactive-color="#d9d9d9"></el-switch>
        </el-form-item>
        <el-form-item label="物流公司" prop="deliveryCorpId" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-select v-model="form.deliveryCorpId" filterable :disabled="isShipped" placeholder="请选择物流公司">
            <el-option v-for="(deliveryCorps,index) in deliveryCorps" :key="index" :label="deliveryCorps.name" :value="deliveryCorps.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="expressSn" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input v-model="form.expressSn" :disabled="isShipped || form.isLCL==='1'" placeholder="请输入物流单号" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="物流费用" prop="freight" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input-number :min="0" v-model="form.freight" :disabled="isShipped" placeholder="请输入物流费用" style="width:210px"></el-input-number>
        </el-form-item>
        <el-form-item label="收货店铺" prop="receiveStore" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input v-model="form.receiveStore" :disabled="isShipped" placeholder="请输入收货店铺" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input v-model="form.address" :disabled="isShipped" placeholder="请输入收货地址" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="consignee" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input v-model="form.consignee" :disabled="isShipped" placeholder="请输入收货人" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" class="isRequired" v-if="form.shippingMethodId&&showDelivery">
          <el-input v-model="form.phone" :disabled="isShipped" placeholder="请输入电话" style="width:210px"></el-input>
        </el-form-item>
        <div class="close-button" style="float:right;">
          <el-button @click="showLogistics=false" size="mini" type>取消</el-button>
          <el-button @click="save" size="mini" type="primary">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogShipping" center width="1200px" append-to-body custom-class="printDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="printExport" size="mini">导出</el-button>
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">订单编号：{{formShipping.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">订单状态：{{shippingsPrint.shippingStatus==='1'?'订单已部分发货':'订单已执行'}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">发货时间：{{shippingsPrint.shippingDate?shippingsPrint.shippingDate.split(' ')[0]:''}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">物流公司：{{shippingsPrint.logistics}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">物流单号：{{shippingsPrint.expressSn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">物流费用：{{shippingsPrint.freight}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收货人：{{shippingsPrint.consignee}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">电话：{{shippingsPrint.phone}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">收货地址：{{shippingsPrint.address}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="name" label="商品名">
              <template slot-scope="scope" v-if="!scope.row.isTotal">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column property="barCode" label="条码">
              <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">￥{{scope.row.price}}</template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">￥{{scope.row.subTotal}}</template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/order-mgmt/orderMgmt';
// import urls from '@/common/urls';
import http from '@/common/http';
import vueEasyPrint from 'vue-easy-print';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'LogisticsInfo',
  components: {
    BizSaveButton,
    BizGrid,
    vueEasyPrint
  },
  data() {
    return {
      operations: [
        {
          label: '新增',
          name: 'addLogistics',
          type: 'primary',
          class: 'show'
        }
      ],
      rules: {
        deliveryCorpId: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
        // expressSn: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
        freight: [{ required: true, message: '请输入物流费用', trigger: 'blur' }],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        consignee: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        receiveStore: [{ required: true, message: '请输入收货店铺', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      logisticsList: [],
      isShipped: false,
      detailList: [],
      showLogistics: false,
      loading: false,
      orderItems: [],
      form: {
        shippings: [],
        orderItems: [],
        shippingMethodId: '',
        isLCL: '',
        deliveryCorpId: '',
        expressSn: '',
        freight: '',
        address: '',
        consignee: '',
        receiveStore: '',
        phone: '',
        shippingMethodName: ''
      },
      dialogShipping: false,
      formShipping: {},
      title: '',
      gridData: [],
      shippingId: '',
      shippingsPrint: '',
      shippingMethod: [],
      deliveryCorps: [],
      paymentTypes: [],
      paymentMethods: [],
      showDelivery: false,
      showReceiver: false,
      flag: true
    };
  },
  computed: {},
  props: {
    itemId: {
      type: String
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    handler: {
      type: String
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    ...mapGetters(['getUser']),
    getDefaultForm() {
      return {
        shippings: [],
        orderItems: [],
        shippingMethodId: '',
        isLCL: '',
        deliveryCorpId: '',
        expressSn: '',
        freight: '',
        address: '',
        consignee: '',
        receiveStore: '',
        phone: '',
        shippingMethodName: ''
      };
    },
    print() {
      // window.print();
      this.$refs.easyPrint.print();
    },
    async printExport() {
      let params = {
        shippingId: this.shippingId
      };
      try {
        let response = await axios.post('/admin/purchaseOrder/voucher/export/shipping.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    // 发货凭证
    certificate(shippingId) {
      let param = {
        shippingId: shippingId
      };
      http
        .get('/admin/purchaseOrder/voucher/shipping.jhtml', param)
        .then(data => {
          this.dialogShipping = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '发货单' : '发货单';
          this.formShipping = data.order;
          this.shippingId = shippingId;
          this.shippingsPrint = data.shipping;
          this.gridData = data.shipping.shippingItems;
        })
        .catch(error => {
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    addLogistics() {
      this.isShipped = false;
      // this.form.orderItems = this.orderItems;
      this.form.shippingMethodId = '';
      this.form.isLCL = '';
      this.form.deliveryCorpId = '';
      this.form.expressSn = '';
      this.form.freight = '';
      this.form.address = '';
      this.form.consignee = '';
      this.form.receiveStore = '';
      this.form.phone = '';
      this.showLogistics = true;
      this.init();
    },
    init() {
      console.log('init');
      service.viewOrder(
        { orderId: this.itemId },
        data => {
          this.form = this.getDefaultForm();
          this.form.address = data.order.address;
          this.form.consignee = data.order.consignee;
          this.form.receiveStore = data.order.receiveStore;
          this.form.phone = data.order.phone;
          this.form.shippings = data.order.shippings;
          this.form.orderItems = data.order.orderItems;
          if (data.order.shippingStatus === '2' || data.order.shippingStatus === '3') {
            this.operations[0].class = 'hidden';
          } else {
            this.operations[0].class = 'show';
          }
          this.orderItems = data.order.orderItems;
          console.log(this.form);
          this.shippingMethod = data.shippingMethods;
          this.deliveryCorps = data.deliveryCorps;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      this.$refs.logisticsForm.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let shippingMethod = '';
          this.shippingMethod.map(item => {
            if (item.id === this.form.shippingMethodId) {
              shippingMethod = item.name;
            }
          });
          let logistics = '';
          this.deliveryCorps.map(item => {
            if (item.id === this.form.deliveryCorpId) {
              logistics = item.name;
            }
          });
          let numIndex = [];
          this.form.orderItems.forEach((num, index) => {
            if (num.unShippedQuantity === 0) {
              numIndex.push(num);
            }
          });
          if (numIndex.length === this.form.orderItems.length) {
            this.$message.warning('本次发货数量不能为0');
            this.loading = false;
            return false;
          } else {
            let params = {
              id: this.itemId,
              shippingMethodId: this.form.shippingMethodId,
              isLCL: this.form.isLCL,
              deliveryCorpId: this.form.deliveryCorpId,
              expressSn: this.form.expressSn,
              freight: this.form.freight,
              address: this.form.address,
              consignee: this.form.consignee,
              receiveStore: this.form.receiveStore,
              phone: this.form.phone,
              shippingMethod: shippingMethod,
              logistics: logistics,
              shippingItems: this.form.orderItems.map(item => {
                return {
                  orderItemId: item.id,
                  quantity: item.unShippedQuantity,
                  name: item.fullName
                };
              })
            };
            const success = data => {
              this.$message.success('保存成功');
              // this.form.shippings.push(params);
              this.init();
              this.$emit('operationSuccess', this.form.id);
              this.showLogistics = false;
              this.loading = false;
            };
            const failed = errData => {
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              this.loading = false;
            };
            const final = data => {
              this.loading = false;
            };
            http
              .put('/admin/purchaseOrderManage/partialShipping.jhtml', params)
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          return false;
        }
      });
    },
    detailClickHandler(row) {
      console.log(row);
      this.isShipped = true;
      row.shippingItems.map(ship => {
        this.orderItems.map(item => {
          if (ship.name === item.name) {
            ship.product = item.product;
          }
        });
        ship.shippedQuantity = ship.quantity;
      });
      this.form.orderItems = row.shippingItems;
      this.form.isLCL = row.isLCL;
      this.form.deliveryCorpId = row.deliveryCorpId;
      this.form.expressSn = row.expressSn;
      this.form.freight = row.freight;
      this.form.address = row.address;
      this.form.consignee = row.consignee;
      this.form.receiveStore = row.receiveStore;
      this.form.phone = row.phone;
      this.form.shippingMethodName = row.shippingMethod;
      this.shippingMethod.map(item => {
        if (item.name === this.form.shippingMethodName) {
          this.form.shippingMethodId = item.id;
          if (item.isNeedDelivery === '1') {
            this.showDelivery = true;
          }
        }
      });
      this.showLogistics = true;
    },
    followClickHandler() {
      this.$emit('goToOrderLogs');
    },
    operateHandler(name) {
      this[name]();
    }
  },
  watch: {
    itemId(Val) {
      this.showLogistics = false;
      this.init();
      if (this.handler === 'shipping') {
        this.showLogistics = true;
      } else {
        this.showLogistics = false;
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler: function(integral) {
        this.showDelivery = false;
        this.showReceiver = false;
        this.shippingMethod.map(item => {
          if (item.id === integral.shippingMethodId && item.isNeedDelivery === '1') {
            this.showDelivery = true;
          }
          if (item.id === integral.shippingMethodId && item.isNeedReceiver === '1') {
            this.showReceiver = true;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.logistics-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    .el-form {
      margin-top: 20px;
    }
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .el-input-number .el-input {
    width: auto !important;
  }
}
</style>
