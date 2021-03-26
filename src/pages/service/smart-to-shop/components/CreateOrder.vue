<template>
  <el-dialog title="创建订单" :visible.sync="dialogVisible" width="600px" append-to-body v-loading="loading" custom-class="create-order"
    center>
    <el-form :model="form" ref="form" label-width="80px" size="small" :inline-message="true">
      <el-form-item label="订单属性" prop="orderType">
        <el-radio-group @change="orderTypeChange" v-model="form.orderType" size="mini">
          <el-radio label="0">车品订单</el-radio>
          <el-radio label="2">普通服务</el-radio>
          <el-radio label="9">整车订单</el-radio>
          <el-radio label="10">普通订单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品" prop="products">
        <el-autocomplete v-model="form.products" :fetch-suggestions="querySearchAsync" size="small" placeholder="输入搜索的商品编号、名称"
          clearable @select="handleSelect" @input="listProduct"></el-autocomplete>
        <biz-list ref="table" :tableData="tableData" :loading="loading" :height="height">
          <el-table-column prop="fullName" label="商品名称">
          </el-table-column>
          <el-table-column prop="price" label="商品价格">
          </el-table-column>
          <el-table-column prop="quantity" label="数量">
            <div slot-scope="scope">
              <div class="biz-customcol">
                <el-input type="number" size="mini" :min="1" v-model="scope.row.quantity" @input="quantityChange">
                </el-input>
              </div>
            </div>
          </el-table-column>
          <el-table-column prop="date" label="操作" type=index>
            <div slot-scope="scope">
              <div class="biz-customcol">
                <el-button type="text" size="mini" @click="deleteHandeler(scope)">
                  删除
                </el-button>
              </div>
            </div>
          </el-table-column>
        </biz-list>
      </el-form-item>
      <el-form-item label="优惠券" prop="couponCodeId">
        <el-select v-model="form.couponCodeId" filterable placeholder="请选择优惠券" @change="couponChnage">
          <el-option v-for="(coupon,index) in couponList" :key="index" :label="coupon.coupon.name" :value="coupon.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实付金额" prop="amountPaid">
        <el-input v-model="form.amountPaid" placeholder="请输入实付金额"></el-input>
      </el-form-item>
      <el-form-item label="业务类型" v-if="form.orderType==='2'">
        <tag-select ref="tagSelect" :tagList="tagList" :bAddTag="false" selectType="order" :selectedTags="selectedTags"
          @addSuccess="onAddSuccess"></tag-select>
      </el-form-item>
    </el-form>
    <biz-save-button slot="footer" :operations="operations" @operate="operate"></biz-save-button>
  </el-dialog>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import serviceProduct from '@/service/member-card-mgmt/memberCardMgmt';
import urls, { customerService } from '@/common/urls';
import http from '@/common/http';
import BizList from '@/components/BizTable/BizList';
import TagSelect from '@/components/BizTagSelect';

export default {
  name: 'CreateOrder',
  props: {
    userId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tagList: [],
      selectedTags: [],
      loading: false,
      loadingSelect: false,
      dialogVisible: false,
      subTotal: '',
      height: '385',
      tableData: [],
      restaurants: [],
      couponList: [],
      operations: [
        { label: '取消', name: 'cancel' },
        { label: '确认已执行', name: 'confirm', type: 'primary' }
        // 修改33393 智能到店：创建订单时，“确认已完成”的权限问题
        // { label: '确认已完成', name: 'complete', type: 'primary' }
      ],
      form: {
        products: '',
        couponCodeId: '',
        amountPaid: '',
        orderStatus: 1,
        orderType: ''
      },
      rules: {
        productId: [{ required: true, message: '请选择商品', trigger: 'blur' }]
      },
      productList: [],
      productListMap: new Map()
    };
  },
  components: {
    BizSaveButton,
    BizList,
    TagSelect
  },
  methods: {
    orderTypeChange(val) {
      this.listProduct();
      if (val === '2') {
        this.getStoreTags();
      }
    },
    onAddSuccess() {
      this.getStoreTags();
    },
    tagMapping(orderId) {
      let param = {
        refId: orderId,
        type: '7',
        tags: this.$refs.tagSelect ? this.$refs.tagSelect.getCurSelectedTags() : []
      };
      http
        .post(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('映射成功');
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    getStoreTags() {
      let param = {
        categoryType: '订单/服务业务类型'
      };
      http
        .get(urls.systemSetting.storeTags, param)
        .then(data => {
          console.log('订单/服务业务类型标签', data);
          this.tagList = data.content;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    operate(name) {
      this[name]();
    },
    cancel() {
      this.form = this.getOriginForm();
      this.dialogVisible = false;
    },
    deleteHandeler(val) {
      this.subTotal = (Number(this.subTotal) - Number(val.row.price) * Number(val.row.quantity)).toFixed(2);
      this.form.amountPaid = this.subTotal;
      this.tableData.splice(val.$index, 1);
      this.form.couponCodeId = '';
      this.getCoupon();
    },
    listProduct(val) {
      serviceProduct.listProduct(
        {
          searchValue: this.form.products,
          orderType: this.form.orderType
        },
        data => {
          this.restaurants = data.content.map(item => {
            return {
              fullName: item.fullName,
              sn: item.sn,
              price: item.price,
              quantity: '1',
              subTotal: item.price,
              productId: item.id,
              value: item.fullName
            };
          });
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 300 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return true;
      };
    },
    couponChnage(val) {
      let amount = '';
      this.couponList.map(item => {
        if (item.id === val) {
          amount = item.coupon.amount;
        }
      });
      let amountPaid = (Number(this.subTotal) - Number(amount)).toFixed(2);
      this.$set(this.form, 'amountPaid', amountPaid);
    },
    quantityChange() {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      this.subTotal = total.toFixed(2);
      this.form.amountPaid = this.subTotal;
      this.getCoupon();
    },
    handleSelect(val) {
      console.log('val', val);
      this.subTotal = (Number(this.subTotal) + Number(val.quantity) * Number(val.price)).toFixed(2);
      this.form.amountPaid = this.subTotal;
      if (this.tableData.length === 0) {
        this.tableData.push(val);
        this.getCoupon();
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          this.tableData[i].quantity = Number(this.tableData[i].quantity) + 1;
          break;
        } else {
          this.tableData.push(val);
          break;
        }
      }
      this.getCoupon();
    },
    getCoupon() {
      let cartItems = this.tableData.map(item => {
        return {
          product: { id: item.id ? '' : item.productId },
          quantity: item.quantity || ''
        };
      });
      let params = {
        shopId: window.top.SHOP_ID || '',
        cartItems: cartItems,
        userId: this.userId.id
      };
      this.couponList = [];
      http
        .post('/admin/order/couponCodes.jhtml', params)
        .then(data => {
          this.couponList = data.content;
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    complete() {
      this.confirm('2');
    },
    confirm(orderStatus) {
      let cartItems = this.tableData.map(item => {
        return {
          product: { id: item.id ? '' : item.productId },
          quantity: item.quantity || ''
        };
      });
      let params = {
        amountPaid: this.form.amountPaid,
        orderStatus: orderStatus || '1',
        couponCodeId: this.form.couponCodeId,
        cartItems: cartItems,
        userId: this.userId.id
      };
      this.loading = true;
      if (this.tableData.length === 0) {
        this.$message.warning('请选择商品');
        this.loading = false;
        return false;
      }
      http
        .post(customerService.ReceptionMgmt.baseInfo.createOrder, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit(
            'confirm',
            Object.assign({}, this.form, {
              orderId: data.data.id,
              productName: data.data.orderItems[0] ? data.data.orderItems[0].name : '',
              orderSn: data.data.sn,
              amount: data.data.amount,
              amountPaid: data.data.amountPaid
            })
          );
          this.dialogVisible = false;
          if (this.form.orderType === '2') {
            this.tagMapping(data.data.id);
          }
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOriginForm() {
      return {
        tableData: [],
        products: '',
        couponCodeId: '',
        amountPaid: '',
        orderStatus: 1,
        orderType: ''
      };
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true,
        duration: 1000
      });
    }
  },
  mounted() {
    // this.listProduct();
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogVisible = newVal;
      this.tableData = [];
      this.subTotal = '';
      this.getStoreTags();
      // this.listProduct();
    },
    dialogVisible(newVal, oldVal) {
      if (!newVal) {
        this.$emit('update:visible', false);
        this.tableData = [];
        this.subTotal = '';
        this.couponList = [];
      }
    }
  }
};
</script>

<style lang="scss">
.create-order {
  .el-autocomplete {
    width: 100%;
    padding-bottom: 10px;
  }
}
</style>
