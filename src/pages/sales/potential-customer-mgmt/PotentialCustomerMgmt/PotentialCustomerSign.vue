<template>
  <biz-grid class="potential-customer-mgmt__failure" v-loading="loading">
    <biz-save-button
      slot="top"
      :operations="operations"
      @operate="handleOperate"
    >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="跟踪结果">
        <span v-if="formModel.signTrackingResult === '0'">未签约</span>
        <span v-if="formModel.signTrackingResult === '1'">已签约</span>
      </el-form-item>
      <el-form-item label="签约结果">
        <el-select
          v-model="formModel.isSigned"
          placeholder="请选择"
          :disabled="disableInput"
          style="width: 100%;"
          @change="handleResultChange"
        >
          <el-option
            v-for="item in signList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签约日期" prop="signedTime">
        <el-date-picker
          type="date"
          placeholder="选择签约日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="formModel.signedTime"
          :disabled="disableInput"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input
          v-model="formModel.orderSn"
          readonly
          :disabled="disableInput"
        >
          <div slot="append" class="input-operation">
            <el-button
              type="text"
              @click="handleAddClick"
              :disabled="disableInput"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button
              type="text"
              @click="handleListClick"
              :disabled="disableInput"
            >
              <i class="iconfont biz-icon-liebiaoshitu"></i>
            </el-button>
            <el-button
              type="text"
              @click="handleRemoveClick"
              :disabled="disableInput"
            >
              <i class="el-icon-close" style="color: #f56c6c;"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-select
          v-model="formModel.brand"
          placeholder="请选择"
          filterable
          style="width: 100%;"
          :disabled="disableInput"
          @change="handleBrandChange"
        >
          <el-option
            v-for="(item,index) in brandList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列" prop="series">
        <el-select
          v-model="formModel.series"
          placeholder="请选择"
          filterable
          :disabled="disableInput"
          style="width: 100%;"
          @change="handleSeriesChange"
        >
          <el-option
            v-for="(item,index) in seriesList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车型" prop="product">
        <el-select
          v-model="formModel.product"
          placeholder="请选择"
          filterable
          :disabled="disableInput"
          style="width: 100%;"
        >
          <el-option
            v-for="(item,index) in modeList"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-select
          v-model="formModel.deliveryPayment"
          placeholder="请选择"
          filterable
          :disabled="disableInput"
          style="width: 100%;"
        >
          <el-option
            v-for="item in paymentList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金融方案">
        <el-select
          v-model="formModel.planId"
          placeholder="请选择"
          filterable
          :disabled="disableInput"
          style="width: 100%;"
        >
          <el-option
            v-for="item in planList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交车日期">
        <el-date-picker
          type="date"
          placeholder="选择交车日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="formModel.deliveryTime"
          :disabled="disableInput"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="确认者">
        <span>{{formModel.deliverySalesAdvisor.name}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formModel.deliveryRemarks"
          :disabled="disableInput" maxlength="100"></el-input>
      </el-form-item>
    </el-form>

    <div slot="float">
      <el-dialog
        title="创建订单"
        :visible.sync="orderDialogVisibility"
        width="500px"
        append-to-body
        v-loading="orderAddloading"
      >
        <el-form
          ref="orderAddForm"
          size="small"
          label-width="110px"
          :model="orderModel"
          :rules="orderRules"
        >
          <el-form-item label="商品" prop="productId">
            <el-select
              v-model="orderModel.productId"
              placeholder="请选择"
              filterable
              :disabled="disableInput"
              style="width: 100%;"
              @change="handleOrderProductChange"
            >
              <el-option
                v-for="item in orderProductList"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实付金额" prop="amountPaid">
            <el-input v-model="orderModel.amountPaid" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="订单金额">
            <span>{{orderModel.marketPrice}}</span>
          </el-form-item>
        </el-form>
        <biz-save-button
          :operations="orderAddOperations"
          @operate="handleOperate"
          style="margin-right: 0;"
          >
        </biz-save-button>
      </el-dialog>

      <pc-order-picker
        ref="orderPicker"
        :itemId="itemId"
        :memberId="memberId"
        @input="handleOrderSelected"
      ></pc-order-picker>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import PcOrderPicker from '../Components/PcOrderPicker';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import urlUtil from '@/utils/url';
import { mapGetters } from 'vuex';
import { ROLE } from '@/utils/dims';

// 初始化时需要的一些数据
const listData = {
  signList: [
    { label: '请选择', value: '0' },
    { label: '已签约', value: '1' }
  ],
  planList: [],
  paymentList: [
    { label: '现金', value: 'cash' },
    { label: '按揭', value: 'mortgage' }
  ],
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary',
      disabled: false,
      auth: ['admin:potential.edit']
    }
  ]
};
// 车辆相关
const vehicleData = {
  data: {
    brandList: [],
    seriesList: [],
    modeList: []
  },
  methods: {
    queryBrandList () {
      http.get(
        potentialCustomerMgmt.failure.queryBrandList,
        { brandId: '', seriesId: '' }
      )
        .then(data => {
          this.brandList = data.dataList;
        })
        .catch(errData => {
          this.brandList = errData;
        });
    },
    querySeriesList (val) {
      http.get(
        potentialCustomerMgmt.failure.querySeriesList,
        { brandId: val }
      )
        .then(data => {
          this.seriesList = data.dataList;
        })
        .catch(errData => {
          this.seriesList = errData;
        });
    },
    queryTypeList (val) {
      http.get(
        potentialCustomerMgmt.failure.queryModeList,
        { brandId: this.formModel.failureBrandId, seriesId: val }
      )
        .then(data => {
          this.modeList = data.dataList;
        })
        .catch(errData => {
          this.modeList = errData;
        });
    }
  },
  events: {
    handleBrandChange (val) {
      this.querySeriesList(val);

      this.$set(this.formModel, 'series', '');
      this.$set(this.formModel, 'product', '');
    },
    handleSeriesChange (val) {
      this.queryTypeList(val);

      this.$set(this.formModel, 'product', '');
    }
  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    isSigned: '0',
    deliverySalesAdvisor: { id: '', name: '' }
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel(),
    disableInput: false
  },
  events: {
    handleOperate (name) {
      this[name]();
    },
    handleResultChange (val) {
      // 当选择已签约后，默认选择当天
      if (val === '1') {
        // 如果签约日期不存在，则默认选中当天
        if (!this.formModel.signedTime) {
          this.$set(this.formModel, 'signedTime', new Date());
        }

        // 如果订单为空，则选中签约后，默认选中最新的可用订单
        if (!this.formModel.orderId) {
          this.loading = true;

          http.get(
            potentialCustomerMgmt.sign.orderList,
            {
              pageSize: 10,
              pageNumber: 1,
              searchValue: '',
              searchProperty: 'sn',
              id: this.itemId.id,
              orderType: 'car',
              memberId: this.formModel.memberId ? this.formModel.memberId.id : ''
            }
          )
            .then(data => {
              if (data.content && data.content.length > 0) {
                let order = data.content[0];
                this.$set(this.formModel, 'orderSn', order.sn);
                this.$set(this.formModel, 'orderId', order.id);
              }
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
        }
      } else {
        this.$set(this.formModel, 'signedTime', '');
      }
    }
  },
  methods: {
    queryPlanList () {
      http.get(
        potentialCustomerMgmt.sign.planList,
        { shopId: window.top.SHOP_ID || '' }
      )
        .then(data => {
          this.planList = data.financials;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    query () {
      let data = JSON.parse(JSON.stringify(this.consumerInfo));
      // 设置对象的默认值，并且整理字段
      let obj = data.potentialConsumer;
      obj.signedTime = obj.signedTime ? new Date(obj.signedTime) : undefined;
      obj.deliveryTime = obj.deliveryTime ? new Date(obj.deliveryTime) : undefined;
      obj.isSigned = obj.isSigned ? '1' : '0';
      obj.brand = obj.brand ? obj.brand.toString() : '';
      obj.series = obj.series ? obj.series.toString() : '';
      obj.product = obj.product ? obj.product.toString() : '';
      obj.planId = obj.planId ? obj.planId.toString() : '';
      // 如果是签约，并且已经有确认者，则不可编辑保存
      if (obj.signTrackingResult === '1' && obj.deliverySalesAdvisor && obj.deliverySalesAdvisor.id) {
        this.disableInput = true;
        this.$set(this.operations[0], 'disabled', true);
      } else {
        this.disableInput = false;
        this.$set(this.operations[0], 'disabled', false);

        // 如果没有确认者，则根据当前用户的权限，如果是主管，则可以进行确认
        let user = this.getUser();
        obj.deliverySalesAdvisor = this.checkRole(user.roleDatas, ROLE.salesmanAdmin)
          ? { id: user.id, name: user.realName }
          : { id: '', name: '' };
      }
      this.formModel = Object.assign(this.getDefaultModel(), obj);

      if (obj.brand) this.querySeriesList(this.formModel.brand);
      if (obj.series) this.queryTypeList(this.formModel.series);
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return getDefaultModel();
    },

    getSaveParams () {
      return {
        token: '',
        id: this.formModel.id || this.itemId.id,
        orderId: this.formModel.orderId,
        isSigned: this.formModel.isSigned,
        signedTime: dateUtil.dateConverter(this.formModel.signedTime),
        deliveryPayment: this.formModel.deliveryPayment,
        planId: this.formModel.planId,
        deliveryTime: dateUtil.dateConverter(this.formModel.deliveryTime),
        deliveryRemarks: this.formModel.deliveryRemarks,
        memberId: this.formModel.member ? this.formModel.member.id : '',
        productId: this.formModel.product,
        isSign: this.formModel.isSigned === '1',
        deliverySalesAdvisorId: this.formModel.deliverySalesAdvisor
          ? this.formModel.deliverySalesAdvisor.id
          : undefined
      };
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = this.getSaveParams();
          http.post(
            potentialCustomerMgmt.sign.save + urlUtil.toURLParams(params),
            {}
          )
            .then(data => {
              this.$message.success('保存成功');

              this.$emit('operationSuccess');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
// 辅助
const utilData = {
  methods: {
    checkRole (list, role) {
      if (!list) return false;

      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].type) === role) return true;
      }

      return false;
    }
  }
};
// 添加订单
const getDefaultOrderModel = () => {
  return {
    product: ''
  };
};
const orderAddData = {
  data: {
    orderAddloading: false,
    orderDialogVisibility: false,
    orderModel: getDefaultOrderModel(),
    orderProductList: [],
    orderAddOperations: [
      {
        label: '取消',
        name: 'cancelOrderAdd'
      },
      {
        label: '保存',
        name: 'saveOrderAdd',
        type: 'primary'
      }
    ]
  },
  events: {
    handleAddClick (e) {
      this.orderDialogVisibility = true;
      this.orderModel = getDefaultOrderModel();

      if (this.$refs.orderAddForm) this.$refs.orderAddForm.resetFields();
    },
    handleOrderProductChange (val) {
      this.$set(this.orderModel, 'marketPrice', this.productMap.get(val).marketPrice);
    },
    handleRemoveClick (e) {
      this.$set(this.formModel, 'orderSn', '');
      this.$set(this.formModel, 'orderId', '');
    }
  },
  methods: {
    queryProductList () {
      http.get(
        potentialCustomerMgmt.sign.productList
      )
        .then(data => {
          this.orderProductList = data.content;

          let map = new Map();
          this.orderProductList.forEach(item => {
            map.set(item.id, item);
          });
          this.productMap = map;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },

    getSaveOrderAddParams () {
      return {
        amountPaid: this.orderModel.amountPaid,
        cartItems:
        // JSON.stringify(`[{"product":{"id":"${this.orderModel.productId}"},"quantity":1}]`),
        JSON.stringify(
          [{
            product: { id: this.orderModel.productId },
            quantity: 1
          }]
        ),
        userId: this.formModel.member ? this.formModel.member.id : '',
        shopId: window.top.SHOP_ID || ''
      };
    },
    saveOrderAdd () {
      this.$refs.orderAddForm.validate((valid, a) => {
        if (valid) {
          this.orderAddloading = true;
          http.get(
            potentialCustomerMgmt.sign.saveOrder +
            urlUtil.toURLParams(this.getSaveOrderAddParams())
            // this.getSaveOrderAddParams()
          )
            .then(data => {
              let obj = data.data;
              this.$set(this.formModel, 'orderSn', obj.sn);
              this.$set(this.formModel, 'orderId', obj.id);

              this.orderDialogVisibility = false;
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.orderAddloading = false;
            });
        } else {
          return false;
        }
      });
    },
    cancelOrderAdd () {
      this.orderDialogVisibility = false;
    }
  }
};
// 订单列表
const orderListData = {
  data: {
    memberId: {}
  },
  events: {
    handleListClick (e) {
      this.memberId = { id: this.formModel.member ? this.formModel.member.id : '' };
      this.$refs.orderPicker.showDialog = true;
    },
    handleOrderSelected (val) {
      this.$set(this.formModel, 'orderSn', val.sn);
      this.$set(this.formModel, 'orderId', val.id);
    }
  },
  methods: {

  }
};

export default {
  name: 'PotentialCustomerSign',
  components: {
    BizSaveButton,
    BizGrid,
    PcOrderPicker
  },
  data () {
    return {
      ...listData,
      ...formData.data,
      ...vehicleData.data,
      ...orderAddData.data,
      ...orderListData.data,

      rules: {
        signedTime: [
          { required: true, trigger: 'blur', message: '请选择签约日期' }
        ],
        brand: [
          { required: true, trigger: ['blur', 'change'], message: '请选择品牌' }
        ],
        series: [
          { required: true, trigger: ['blur', 'change'], message: '请选择车系' }
        ],
        product: [
          { required: true, trigger: ['blur', 'change'], message: '请选择车型' }
        ]
      },
      orderRules: {
        productId: [
          { required: true, trigger: 'blur', message: '请选择商品' }
        ],
        amountPaid: [
          { required: true, trigger: 'blur', message: '请输入实付金额' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              console.log(this.orderModel);
              if (isNaN(Number(this.orderModel.amountPaid)) || Number(this.orderModel.amountPaid) <= 0) {
                callback(new Error('请输入一个大于0的数字'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo'])
  },
  methods: {
    ...mapGetters(['getUser']),

    ...formData.methods,
    ...formData.events,

    ...vehicleData.methods,
    ...vehicleData.events,

    ...orderAddData.methods,
    ...orderAddData.events,

    ...orderListData.methods,
    ...orderListData.events,

    ...utilData.methods
  },
  watch: {
    itemId (nVal, oVal) {
      this.query();
      this.$refs.form.resetFields();
    }
  },
  created() {
    this.queryBrandList();
    this.queryPlanList();
    this.queryProductList();

    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__failure {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    span {
      color: #606266;
    }

    .input-operation {
      padding-left: 10px;
      padding-right: 45px;

      .el-button + .el-button {
        margin-left: 30px;
      }

      i {
        font-size: 18px;
        color: #ff7300;
      }
    }
  }
}
</style>
