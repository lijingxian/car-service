<template>
  <biz-grid class="order-product-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :inline="true" :disabled="!isEdit" :inline-message="true">
      <!-- <el-form-item label="商品" prop="products">
        <el-autocomplete v-model="form.products" :fetch-suggestions="querySearchAsync" size="medium" placeholder="输入搜索的商品编号、名称"
          @select="handleSelect" @input="listProduct()"></el-autocomplete>
      </el-form-item> -->
      <el-form-item label="合计:" prop="subTotal" class="subTotal">
        {{subTotal}}
      </el-form-item>
    </el-form>
    <biz-list ref="table" :tableData="tableData" :loading="loading" :key="Math.random()">
      <el-table-column prop="sn" label="编号">
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
      </el-table-column>
      <el-table-column prop="price" label="商品价格" min-width="130">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" v-model="scope.row.price" :min="0" @change="priceChange(scope.row.price)">
            </el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" min-width="130">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="1" v-model="scope.row.quantity" @change="quantityChange(scope.row.quantity)">
            </el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="subTotal" label="小计">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.quantity?(Number(scope.row.quantity)*Number(scope.row.price)).toFixed(2):''}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="date" label="操作" type=index>
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="isEdit">
            <el-button type="text" size="mini" @click="deleteHandeler(scope)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <el-dialog :visible.sync="dialogTableVisible" center width="1200px" append-to-body>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="grid18"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" align="right">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">
              {{title}}
            </div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" align="right">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="6">
              <div class="grid-content bg-purple">订单编号：{{formData.sn}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">配送方式：{{shippingData.shippingMethod}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">收货人：{{shippingData.consignee}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">电话：{{shippingData.phone}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">地址：{{shippingData.address}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">买家留言：{{formData.memo}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple"></div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class">
            <el-table-column property="isTotal" width="50" label="序号">
              <template slot-scope="scope">
                <div v-if="scope.row.isTotal">合计</div>
                <div v-else>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column property="name" label="商品名" width="200">
              <template slot-scope="scope" v-if="!scope.row.isTotal">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column property="address" label="规格">
              <template slot-scope="scope" v-if="!scope.row.isTotal">
                {{scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}
              </template>
            </el-table-column>
            <el-table-column property="price" label="单价">
              <template slot-scope="scope" v-if="!scope.row.isTotal">
                ￥{{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="subTotal" label="小计">
              <template slot-scope="scope">
                ￥{{scope.row.subTotal}}
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" class="row">
            <el-col :span="6">
              <div class="grid-content bg-purple">运费：￥{{formData.freight}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">优惠金额：￥{{formData.couponDiscount}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">调整金额：￥{{formData.offsetAmount}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">订单金额：￥{{formData.originalAmount}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">仓库签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :tableData="giftList" :pagination="dialogPagination" :filters="dialogFilters"
      :selectionKeys="selectedGiftIds" @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" class="product-info-dailog"
      @confirmed="confirmedProduct" @filterDataChange="dialogFilterDataChange" @selectionChange="selectionChange">
      <el-table-column property="fullName" label="商品名称" width="400px">
         <div slot-scope="scope">
          <div class="biz-two-column">
            <img :src="scope.row.image || DefaultImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px;font-size:14px">{{scope.row.name}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div style="margin-left: 10px">规格：{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column label="剩余库存/库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.availableStock}}/{{scope.row.stock}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import BizPagination from '@/components/BizTable/BizPagination';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import serviceProduct from '@/service/member-card-mgmt/memberCardMgmt';
import vueEasyPrint from 'vue-easy-print';
import { mapGetters } from 'vuex';
import urls, { logisticsMgmt } from '@/common/urls';
import http from '@/common/http';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';

export default {
  name: 'NewsMgmt',
  props: {
    itemId: {
      type: String
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
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      DefaultImg: DefaultImg,
      selectedGiftList: [],
      selectedGiftIds: [],
      showDialog: false,
      dialogFilters: [
        {
          type: 'input',
          placeholder: '请输入编号或商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      giftList: [],
      loading: false,
      open: false,
      subTotal: '',
      height: '585',
      subTotalAll: '',
      tableData: [],
      restaurants: [],
      selections: [],
      orderItems: [],
      selectionList: [],
      dialogTableVisible: false,
      gridData: [],
      formData: {},
      shippingData: {},
      title: '',
      form: {
        products: ''
      },
      operations: [
        {
          label: '新增',
          name: 'addProduct',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        },
        {
          label: '打印',
          name: 'certificate',
          type: 'primary'
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizList,
    BizPagination,
    BizGrid,
    BizSaveButton,
    vueEasyPrint,
    BizDialogSelector
  },
  watch: {
    itemId(val) {
      this.tableData = [];
      this.subTotal = '';
      this.itemId && this.getList();
    }
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),
    addProduct() {
      this.dialogFilters[0].value = '';
      this.getGiftList();
      this.selectedGiftIds.splice(0, this.selectedGiftIds.length);
      this.selectedGiftList.splice(0, this.selectedGiftList.length);
      this.showDialog = true;
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    getGiftList() {
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        isOutOfStock: '0',
        type: this.$route.params.orderType === 'couponOrder' ? '7' : '',
        orderType: this.$route.params.orderType
      };
      http
        .get(window.top.dType === 'purchaseOrder' ? '/admin/purchaseOrderManage/product/list.jhtml' : urls.memberCardMgmt.memberCard.listProduct, params)
        .then(data => {
          this.giftList = data.content;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    selectionChange(selections) {
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    confirmedProduct(val) {
      this.selectedGiftIds = val.concat();
      this.selectedGiftList = [];
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          gift.quantity = '1';
          this.selectedGiftList.push(gift);
        }
      });
      let total = 0;
      this.selectedGiftList.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
        this.listProduct(item);
      });
    },
    print() {
      this.$refs.easyPrint.print();
    },
    certificate() {
      if (!this.itemId) {
        this.$message.warning('请先生成一个订单');
        return false;
      }
      let params = {
        orderId: this.itemId,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(window.dType === 'purchaseOrder' ? logisticsMgmt.delivery.queryShippingVoucherPurchase : logisticsMgmt.delivery.queryShippingVoucher, params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '发货单' : '发货单';
          this.formData = data.order;
          this.shippingData = data.shipping || {};
          this.userCard = data.userCard;
          this.gridData = data.order.orderItems;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    resize() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 175);
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.flag = true;
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    getList() {
      console.log('window.top.dType' + window.top.dType);
      this.loading = true;
      let params = {
        orderId: this.itemId,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.viewProducts(
        params,
        data => {
          this.loading = false;
          this.tableData = data.orderItems;
          this.subTotal = data.order.price;
          this.pagination.total = Number(data.total);
          console.log('this.tableData', this.tableData);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    handleSelect(val) {
      let contain = false;
      val.productId = val.id;
      val.id = '';
      this.subTotal = (Number(this.subTotal) + Number(val.quantity) * Number(val.price)).toFixed(2);
      if (this.tableData.length === 0) {
        this.tableData.push(val);
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          this.tableData[i].quantity = (Number(this.tableData[i].quantity) + 1).toString();
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableData.push(val);
      }
    },
    deleteHandeler(val) {
      console.log(1);
      this.tableData.splice(val.$index, 1);
      if (this.tableData.length > 0) {
        this.subTotal = (Number(this.subTotal) - Number(val.row.price) * Number(val.row.quantity)).toFixed(2);
      } else {
        this.subTotal = 0;
      }
    },
    quantityChange(quantity) {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      if (total) {
        this.subTotal = total.toFixed(2);
      } else {
        this.subTotal = '';
      }
    },
    priceChange(price) {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.quantity) * Number(item.price);
      });
      if (total) {
        this.subTotal = total.toFixed(2);
      } else {
        this.subTotal = '';
      }
    },
    save() {
      this.orderItems = this.tableData.map(item => {
        return {
          id: item.id || '',
          productId: item.productId ? item.productId : item.id,
          quantity: item.quantity || '',
          price: item.price || ''
        };
      });
      let flag = false;
      this.tableData.forEach(item => {
        console.log(item.quantity);
        if (String(item.quantity).indexOf('.') !== -1) {
          flag = true;
        }
      });
      if (flag) {
        this.$message.warning('数量不能为小数');
        return false;
      }
      !this.itemId && this.$emit('setOrderItems', this.orderItems);
      this.itemId &&
        service.addOrderItems(
          {
            orderId: this.itemId,
            orderData: {
              orderItems: this.orderItems
            },
            shopId: window.top.SHOP_ID
          },
          data => {
            // this.$message.success('保存成功');
            this.$emit('setOrderItems', this.orderItems);
            this.$emit('operationSuccess');
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            this.getList();
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    listProduct(item) {
      serviceProduct.listProduct(
        { searchValue: item.name },
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
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.product-info-dailog {
  .el-dialog__header {
    text-align: center;
  }
  img {
    height: 60px;
    width: 60px;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .selection-column {
    text-align: center;
  }
}
.dialog-column {
  display: flex;
  align-items: center;
  .productImg {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
}
.order-product-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    padding: 0px 10px;
  }
  .el-input-number--mini {
    width: 110px;
  }
  .el-button--small {
    margin-top: 20px;
  }
  .delete-btn {
    color: red;
  }
  .subTotal {
    float: right;
  }
  .el-autocomplete {
    width: 220px;
  }
}
</style>
