<template>
  <div class="hypermarket-mgmt">
    <div class="search">
      <biz-filter :filters="filters" @filterDataChange="filterDataChange" style="margin-right:10px"></biz-filter>
      <el-input placeholder="请输入商品名称" v-model="searchValue" class="input-with-select">
        <el-button slot="append" @click="search">搜索</el-button>
      </el-input>
      <div class="buyCar" @click="cart">
        <i class="iconfont biz-icon-i-web-t-jxc"></i>
        <div>购物车</div>
        <div class="count">{{cartCount}}</div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="nav-name">分类导航</div>
        <div class="class-name">
          <el-popover
            width="1000"
            placement="right-start"
            popper-class="popoverStyle"
            trigger="hover"
            :visible-arrow="false"
            v-for="(value, index) in classList"
            :key="index"
            :disabled="checkedChild!==''&&select===index"
          >
            <div class="radioStyle" style="font-size: 12px;">
              <div v-if="value.name==='全部'">
                <div v-for="(item,index1) in productCategories" :key="index1">
                  <span>{{item.name}}></span>
                  <el-radio-group v-model="checkedChild" @change="getSelectChildList(index)">
                    <el-radio-button
                      v-for="(condition,index)  in item.childrenProductCategoryDataList"
                      :label="condition.id"
                      :key="index"
                      size="mini"
                    >{{condition.name}}</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div v-else>
                <span>{{value.name}}></span>
                <el-radio-group v-model="checkedChild" @change="getSelectChildList(index)">
                  <el-radio-button
                    v-for="(condition,index1)  in value.childrenProductCategoryDataList"
                    :label="condition.id"
                    :key="index1"
                    size="mini"
                  >{{condition.name}}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div slot="reference" class="text-item" :class="{'selected':select===index}" @click="getSelectList(value,index)" @mouseover="checkedChild = ''">{{ value.name }}</div>
          </el-popover>
        </div>
      </div>
      <div class="right" v-loading="loading">
        <biz-grid>
          <div slot="top">
            <div class="indicators-search" :class="{'showHide1' : showHide}">
              <div class="title">品牌：</div>
              <div class="hardGroup" :class="{'showHide' : showHide}" ref="brandGroup">
                <el-checkbox-button v-model="checkAllBrand" @change="handleCheckAllBrand" :indeterminate="isIndeterminateBrand">全部</el-checkbox-button>
                <el-checkbox-group v-model="checkedBrand" @change="brandChange">
                  <el-checkbox-button v-for="(condition,index)  in brandList" :label="condition.id" :key="index" size="mini">{{condition.name}}</el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>
            <div class="swich" v-if="showSwich">
              <i :class="className" @click="swich"></i>
            </div>
          </div>
          <div v-for="data in tableData" :key="data.id" class="card" @click="rowClick(data)">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="data.image || defaultImg" class="image" :onerror="errorImg" />
              <div style="padding: 14px 14px 0px 14px;">
                <span>{{data.fullName.length>45?data.fullName.substr(0, 45) + '...':data.fullName}}</span>
                <div>{{data.barCode}}</div>
                <div class="bottom clearfix">￥{{data.price}}</div>
              </div>
            </el-card>
          </div>
          <div v-if="tableData.length === 0" :style="styleObject"></div>
          <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
        </biz-grid>
      </div>
    </div>
    <biz-popup-tabs :open="open" v-model="tabSelection" @close="open = false;">
      <el-tab-pane label="商品" name="0">
        <product-info ref="productInfo" :open="open" @goOrderInfo="goOrderInfo" :itemId="itemId" @addToCart="addToCart"></product-info>
      </el-tab-pane>
      <el-tab-pane label="详情" name="1">
        <product-detail-info :itemId="itemId" :open="open"></product-detail-info>
      </el-tab-pane>
      <el-tab-pane label="评价" name="2">
        <review-info :itemId="itemId" :open="open"></review-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openCart" v-model="tabSelection" @close="openCart = false;">
      <el-tab-pane label="购物车" name="3">
        <cart ref="cart" @goOrderInfo="goOrderInfo" @cartCountQuery="cartCountQuery"></cart>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openOrder" v-model="orderInfo" @close="openOrder = false;" v-if="openOrder">
      <el-tab-pane label="订单信息" name="4">
        <confirm-order ref="confirmOrder" @goPay="goPay"></confirm-order>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openPay" v-model="payInfo" @close="openPay = false;">
      <el-tab-pane label="付款" name="5">
        <pay-info ref="payInfo" :orderId="orderId"></pay-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import ProductInfo from './ProductInfo';
import Cart from './Cart';
import ProductDetailInfo from './ProductDetailInfo';
import ConfirmOrder from './ConfirmOrder';
import ReviewInfo from './ReviewInfo';
import PayInfo from './PayInfo';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import BizPagination from '@/components/BizTable/BizPagination';
import NoContent from '@/assets/images/emptyGray.png';
import BizFilter from '@/components/BizTable/BizFilter';
export default {
  name: 'HypermarketMgmt',
  components: {
    BizPopupTabs,
    ProductInfo,
    ProductDetailInfo,
    ReviewInfo,
    Cart,
    ConfirmOrder,
    PayInfo,
    BizPagination,
    BizGrid,
    BizFilter
  },
  data() {
    return {
      classList: [],
      tableData: [],
      productCategories: [],
      searchValue: '',
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      select: 0,
      checkedBrand: [],
      checkedChild: '',
      brandList: [],
      checkAllBrand: false,
      showRecommend: false,
      showSwich: false,
      showHide: false,
      popShow: false,
      isIndeterminateBrand: true,
      open: false,
      openCart: false,
      openOrder: false,
      openPay: false,
      loading: false,
      tabSelection: '0',
      orderInfo: '4',
      payInfo: '5',
      itemId: '',
      orderId: '',
      type: '',
      classId: '',
      cartCount: '',
      className: 'el-icon-caret-bottom',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'select',
          label: '供应商',
          name: 'shop',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  created() {
    this.getSupplierList();
    this.getClassList({ id: '', type: '' });
    this.getList({ id: '', type: '' });
    this.getBrandsList();
  },
  methods: {
    brandChange(val) {
      let checkedCount = val.length;
      this.checkAllBrand = checkedCount === this.brandList.length;
      this.isIndeterminateBrand = checkedCount > 0 && checkedCount < this.brandList.length;
      this.getList({ id: this.classId, type: this.type });
    },
    handleCheckAllBrand(val) {
      this.checkedBrand = val
        ? this.brandList.map(item => {
          return item.id;
        })
        : [];
      this.getList({ id: this.classId, type: this.type });
    },
    getBrandsList() {
      this.loading = true;
      console.log(this.filters);
      let param = {
        pageNumber: 1,
        pageSize: 1000,
        supplierShopId: this.filters[0].value
      };
      http
        .get('/admin/toB/product/brandSeries.jhtml', param)
        .then(data => {
          this.loading = false;
          this.brandList = data.Brand;
          // this.checkedBrand = this.brandList ? this.brandList.map(item => { return item.id; }) : [];
          this.$nextTick(() => {
            this.hardGroupHeight = document.getElementsByClassName('hardGroup')[0].offsetHeight;
            if (this.hardGroupHeight > 62) {
              this.showSwich = true;
              this.showHide = true;
            } else {
              this.showSwich = false;
              this.showHide = false;
            }
          });
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    swich() {
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      this.showHide = this.className === 'el-icon-caret-bottom';
      if (!this.showHide) {
        document.getElementsByClassName('hardGroup')[0].style.height = 'auto';
      } else {
        document.getElementsByClassName('hardGroup')[0].style.height = '55px';
      }
    },
    getClassList(value, index) {
      this.type = value.type;
      this.classId = value.id;
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        type: value.type || '',
        supplierShopId: this.filters[0].value || ''
      };
      http
        .get(urls.hypermarketMgmt.productCategories, params)
        .then(data => {
          this.classList = [{ id: '', name: '全部' }].concat(
            data.productCategorys
          );
          this.productCategories = data.productCategorys;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
      this.select = index;
    },
    getSupplierList() {
      http
        .get('/admin/cooperationInfo/agent/supplierStores.jhtml', {})
        .then(data => {
          this.filters[0].options = [{ value: '', label: '全部' }].concat(
            data.dataList.map(item => {
              return { label: item.shop.name, value: item.shop.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    search() {
      this.pagination.currentPage = 1;
      this.getList({ id: '', type: '' });
    },
    getSelectChildList(index) {
      this.loading = true;
      let params = {
        clientType: 1,
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        categoryId: this.checkedChild,
        orderType: 0,
        filterType: 0,
        supplierShopId: this.filters[0].value || '',
        searchValue: this.searchValue,
        shopBrands: this.checkedBrand.join('&shopBrands='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get(urls.hypermarketMgmt.getList + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.products || [];
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
      this.select = index;
    },
    getSelectList(value, index) {
      this.loading = true;
      this.checkedChild = '';
      this.type = value.type;
      this.classId = value.id;
      let params = {
        clientType: 1,
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        categoryId: this.classId,
        orderType: 0,
        filterType: 0,
        supplierShopId: this.filters[0].value || '',
        searchValue: this.searchValue,
        shopBrands: this.checkedBrand.join('&shopBrands='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get(urls.hypermarketMgmt.getList + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.products || [];
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
      this.select = index;
    },
    getList(value, index) {
      this.loading = true;
      this.checkedChild = '';
      this.type = value.type;
      this.classId = value.id;
      let params = {
        clientType: 1,
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        categoryId: this.classId,
        orderType: 0,
        filterType: 0,
        supplierShopId: this.filters[0].value || '',
        searchValue: this.searchValue,
        shopBrands: this.checkedBrand.join('&shopBrands='),
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get(urls.hypermarketMgmt.getList + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.products || [];
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    cartCountQuery(val) {
      this.cartCount = val;
    },
    addToCart() {
      // this.cartCount = Number(this.cartCount) + 1;
      this.$refs.cart.query();
    },
    goOrderInfo() {
      this.open = false;
      this.openCart = false;
      this.openOrder = true;
    },
    goPay(orderId) {
      this.orderId = orderId;
      this.openOrder = false;
      this.openPay = true;
    },
    rowClick(row) {
      this.itemId = row.id;
      this.tabSelection = '0';
      this.open = true;
      // this.$nextTick(() => {
      //   this.$refs.productInfo.query();
      // });
    },
    cart() {
      this.tabSelection = '3';
      this.open = false;
      this.openCart = true;
      this.$refs.cart.show = false;
      this.$refs.cart.query();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList({ id: this.classId, type: '' });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList({ id: this.classId, type: '' });
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.getClassList({ id: '', type: '' });
      this.getBrandsList();
      this.getList({ id: '', type: '' });
    }
  }
};
</script>

<style lang="scss">
.popoverStyle {
  top: 185px !important;
  height: 420px;
}
.radioStyle {
  height: 600px;
  .el-radio-button__inner {
    padding: 10px;
    font-size: 12px;
    border: none;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border: none;
    border-radius: 15px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border-color: #ffffff;
    background-color: #ffffff;
    color: #ff7300;
    box-shadow: none;
  }
}
.hypermarket-mgmt {
  width: 100%;
  padding: 5px 10px 0px 20px;
  position: relative;
  background: #ffffff;
  .biz-grid {
    padding: 5px 0px 0px 20px !important;
    .swich {
      text-align: center;
    }
    .indicators-search {
      display: -webkit-box;
      height: auto;
      .el-checkbox-button {
        padding: 15px;
      }
      .el-checkbox-button__inner {
        padding: 10px;
        font-size: 12px;
        border: none;
      }
      .el-checkbox-button:first-child .el-checkbox-button__inner {
        border: none;
        border-radius: 15px;
      }
      .el-checkbox-button:last-child .el-checkbox-button__inner {
        border-radius: 15px;
      }
      .el-checkbox-button,
      .el-checkbox-button__inner {
        border-radius: 15px;
      }
      .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background-color: #f8d6ad;
        border-color: #fff;
        box-shadow: -1px 0 0 0 #fff;
        color: #ff7300;
      }
      .title {
        padding: 20px 10px;
        font-size: 12px;
        height: 100%;
      }
      .hardGroup {
        display: flex;
        width: calc(100% - 90px);
      }
      .hardGroupFleet {
        display: flex;
        width: calc(100% - 90px);
      }
      .hardSeriesGroup {
        display: flex;
        width: calc(100% - 90px);
      }
    }
    .showHide {
      height: 55px;
      overflow-y: hidden;
    }
    .showHide1 {
      height: 55px;
    }
  }
  .card {
    float: left;
    .el-card {
      width: 240px;
      height: 290px;
      position: relative;
    }
  }
  .search {
    display: flex;
    justify-content: flex-end;
    .el-input-group {
      width: 60%;
    }
    .el-input-group__append {
      background: #ff7300;
      color: #fff;
      font-size: 14px;
      border-radius: 0px 20px 20px 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      border: 1px solid #ff7300;
    }
    .el-input-group--append .el-input__inner {
      border-radius: 20px 0px 0px 20px;
      border-color: #ff7300;
    }
    .buyCar {
      width: 200px;
      display: flex;
      justify-content: space-around;
      line-height: 40px;
      font-size: 12px;
      color: #ff7300;
      border: 1px solid #ff7300;
      border-radius: 20px;
      margin-left: 10px;
      cursor: pointer;
      .iconfont {
        font-size: 24px;
      }
      .count {
        color: red;
      }
    }
  }
  .content {
    display: flex;
    height: calc(100% - 50px);
    font-size: 12px;
    .left {
      text-align: center;
      cursor: pointer;
      width: 160px;
      border: 1px solid #ff7300;
      border-radius: 5px 5px 0px 0px;
      margin: 5px 0px 0px 0px;
      .class-name {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 60px);
        text-align: left;
        padding-left: 20px;
      }
      .nav-name {
        background: #ff7300;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #fff;
        width: 160px;
      }
      .selected {
        color: #ff7300;
        outline: none;
      }
      .text-item {
        padding: 10px 0px;
      }
      .text-item:hover {
        color: #ff7300;
      }
    }
    .right {
      padding-left: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      width: calc(100% - 80px);
      position: relative;
      overflow: auto;
      .card {
        padding: 5px;
      }
      .image {
        width: 100%;
        display: block;
        object-fit: cover;
        height: 200px;
        width: 240px;
      }
      .bottom {
        color: red;
        position: absolute;
        bottom: 5px;
      }
    }
  }
}
</style>
