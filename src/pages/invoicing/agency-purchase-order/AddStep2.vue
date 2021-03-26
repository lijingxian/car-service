<template>
  <biz-grid class="add-step-2">
    <div slot="bottom">
      <div class="subTotal">
        <div>
          合计:
          <span class="price">￥{{subTotal}}</span>
        </div>
        <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
      </div>
    </div>
    <div slot="top">
      <div class="header-step">
        <div class="step-2">
          <span>①</span>
          <span>选择商品</span>
          <span>></span>
        </div>
        <div class="step-3">
          <span>②</span>
          <span>确认订单</span>
        </div>
      </div>
      <el-button type="primary" size="small" @click="addProduct">添加商品</el-button>
    </div>
    <biz-list ref="table" :tableData="tableData" :loading="loading" :key="Math.random()" :height="'100%'">
      <el-table-column prop="fullName" label="商品名称" min-width="130">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div class="product-info">
                <img v-if="scope.row.image" :src="scope.row.image" />
                <img v-else src="/resources/admin/images/default/product-default-100.png" />
                <div class="wrapper">
                  <div class="titleClass" :title="scope.row.fullName">{{scope.row.fullName}}</div>
                </div>
                <div class="info-bottom">
                  <div style="margin-left:7px;color:red">￥{{scope.row.price}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="barCode" label="条码"></el-table-column>
      <el-table-column prop="minimumPackQuantity" label="最小包装数" min-width="60"></el-table-column>
      <el-table-column prop="quantity" label="数量" min-width="90">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="1" v-model="scope.row.quantity" @change="quantityChange(scope.row.quantity)"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="date" label="操作" type="index">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="isEdit">
            <el-button type="text" size="mini" @click="deleteHandeler(scope)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <biz-dialog-selector
      title="选择商品"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      :selectionKeys="selectedGiftIds"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="product-info-dailog"
      @confirmed="confirmedProduct"
      @filterDataChange="dialogFilterDataChange"
      @selectionChange="selectionChange"
      @active-item-change="activeItemChange"
      @cascaderChange="cascaderChange"
    >
      <el-table-column property="fullName" label="商品名称" width="400px">
         <div slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg" :onerror="errorImg"/>
            <div class="biz-two-row">
              <div style="margin-left: 10px;font-size:14px">{{scope.row.name}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div style="margin-left: 10px">规格：{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column property="barCode" label="条码"></el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column label="在库库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.realStock}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import serviceProduct from '@/service/member-card-mgmt/memberCardMgmt';
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
// import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
export default {
  name: 'NewsMgmt',
  props: {
    itemId: {
      type: String
    },
    supplierId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    step2Data: {
      type: Array
    },
    step2SubTotal: {
      type: String
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
      categoryDatas: [],
      showDialog: false,
      dialogFilters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '品牌',
          value: '',
          options: []
        },
        {
          type: 'input',
          placeholder: '请输入编号/商品名/条码',
          name: 'searchbar',
          value: ''
        }
      ],
      giftList: [],
      loading: false,
      open: false,
      subTotal: '',
      height: '585',
      productCategoryId: '',
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
          label: '确定',
          name: 'save',
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
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    itemId(val) {
      this.tableData = [];
      this.subTotal = '';
      this.itemId && this.getList();
    }
  },
  created() {
    this.queryFilters();
  },
  mounted() {},
  methods: {
    ...mapMutations('Order', ['updatedRouterFrom', 'updateProducts', 'updateFinalPayment', 'updateOperatingShop']),
    stepOne() {
      this.$emit('stepToOne');
    },
    // 查询过滤器
    queryFilters() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.productCategories, params)
        .then(data => {
          this.categoryDatas = data.productCategorys;
          this.setCategoryFilters();
          this.setBrandFilters();
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.getGiftList();
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser.shop.id,
        parentId: val.toString()
      };
      http
        .get('/admin/shopProduct/productCategorys.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.dialogFilters[0].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.dateList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    setCategoryFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
      });

      this.dialogFilters[0].options = options;
    },
    setBrandFilters() {
      let param = {
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/toB/product/brandSeries.jhtml', param)
        .then(data => {
          this.dialogFilters[1].options = data.Brand.map(brand => {
            return { value: brand.id, label: brand.name };
          });
          this.dialogFilters[1].options.splice(0, 0, {
            value: '',
            label: '全部'
          });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    getSelectedBrandId() {
      return this.dialogFilters[1].value;
    },
    addProduct() {
      this.dialogFilters[2].value = '';
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
      this.giftList = [];
      this.getGiftList();
    },
    getGiftList() {
      let params = {
        shopBrands: this.getSelectedBrandId(),
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        categoryId: this.productCategoryId,
        searchValue: this.dialogFilters[2].value,
        shopId: window.top.SHOP_ID || this.getUser.shop.id,
        userId: this.getUser.id
      };
      http
        .get('/admin/toB/product/list.jhtml', params)
        .then(data => {
          // data.products.forEach(list => {
          //   if (list.price) {
          //     this.giftList.push(list);
          //   }
          // });
          this.giftList = data.products;
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
      this.tableData.splice(val.$index, 1);
      this.subTotal = (Number(this.subTotal) - Number(val.row.price) * Number(val.row.quantity)).toFixed(2);
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
    save() {
      if (this.tableData.length) {
        let products = [];
        products = this.tableData.map(item => {
          return {
            effectivePrice: item.price,
            product: {
              availableStock: item.availableStock,
              categoryType: item.categoryType,
              fullName: item.fullName,
              id: item.productId,
              image: item.image,
              productType: item.productType
            },
            shopName: item.shop.name,
            quantity: item.quantity
          };
        });
        let flag = false;
        this.tableData.forEach(item => {
          console.log(item.quantity);
          if (String(item.quantity).indexOf('.') !== -1) {
            this.$message.warning('数量不能为小数');
            flag = true;
          }
          if (item.quantity % item.minimumPackQuantity !== 0) {
            this.$message.warning('数量为最小包装数的整数倍');
            flag = true;
          }
        });
        if (flag) {
          return false;
        }
        this.updateProducts(products);
        this.$emit('step2Confirm', this.tableData, this.subTotal);
      } else {
        this.$message.warning('采购订单项目为空');
        return false;
      }
      // this.updateQuantity({ quantity: this.quantity, price: this.formModel.price });
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
    },
    query() {
      this.tableData = this.step2Data;
      this.subTotal = this.step2SubTotal;
    }
  }
};
</script>

<style lang="scss">
.product-info-dailog {
  .el-dialog__header {
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
  .biz-two-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .titleClass {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 200px;
      white-space: nowrap;
    }
  }
}
.add-step-2 {
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
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .price {
      color: red;
    }
  }
  .el-autocomplete {
    width: 220px;
  }
  .product-info {
    min-height: 48px;
    margin: 5px 0px;
    width: 100%;
    img {
      float: left;
      width: 48px;
      height: 48px;
    }
    .wrapper {
      margin-left: 56px;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
  .biz-grid__top {
    .el-button {
      float: left;
      margin-bottom: 5px;
    }
  }
  .header-step {
    display: flex;
    background: #e1e1e1;
    padding: 10px;
    margin: 20px 0px;
    color: #666666;
    justify-content: space-around;
    .step-1 {
      display: flex;
      justify-content: space-around;
      width: 160px;
      cursor: pointer;
    }
    .step-2 {
      display: flex;
      justify-content: space-around;
      width: 160px;
      color: #000000;
    }
    .step-3 {
      display: flex;
      justify-content: space-around;
      width: 160px;
    }
  }
}
</style>
