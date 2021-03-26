<template>
  <biz-grid class="product-info-class" v-loading="loading">
    <div slot="bottom">
      <div class="subTotal">
        <div style="margin-right: 100px;margin-top: 5px;">
          合计:
          <span class="price">￥{{totalFee?totalFee:'0.00'}}</span>
        </div>
        <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
      </div>
    </div>
    <div slot="top">
      <div class="header-step">
        <div class="step-1" @click="returnStepOne">
          <span>①</span>
          <span>填写基本信息</span>
          <span>></span>
        </div>
        <div class="step-2">
          <span>②</span>
          <span>选择商品</span>
        </div>
      </div>
      <el-button type="primary" size="small" @click="addProduct">添加商品</el-button>
    </div>
    <biz-list ref="table" :tableData="tableData" :height="'100%'" :key="Math.random()">
      <el-table-column prop="productName" label="商品" min-width="180">
        <template slot-scope="scope">
          <div style="justify-content:space-between;width:100%">
            <div style="width:100%;margin-right:30px">
              <div class="product-info">
                <img v-if="scope.row.image" :src="scope.row.image" />
                <img v-else src="/resources/admin/images/default/product-default-100.png" />
                <div class="wrapper">
                  <div class="titleClass" :title="scope.row.productName">{{scope.row.productName}}</div>
                  <div class="info-bottom">
                    <div style="color:red">￥{{scope.row.price}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="barCode" label="条码"></el-table-column>
      <el-table-column prop="minimumPackQuantity" label="最小包装数"></el-table-column>
      <el-table-column prop="amount" label="数量" min-width="110">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="1" v-model="scope.row.amount" @change="amountChange(scope.row.amount)"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="date" label="操作" type="index" min-width="100">
        <div slot-scope="scope">
          <div class="biz-customcol">
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
          <div class="biz-two-column">
            <img :src="scope.row.image || DefaultImg" :onerror="errorImg" width="48px" height="48px"/>
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
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import http from '@/common/http';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';

export default {
  name: 'ProductInfo',
  props: {
    formData: {
      type: Object
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
      flg: true,
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      selectedGiftList: [],
      selectedGiftIds: [],
      selectionList: [],
      productCategoryId: '',
      categoryDatas: [],
      showDialog: false,
      DefaultImg: DefaultImg,
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
      totalFee: '',
      height: '585',
      tableData: [],
      selections: [],
      itemDatas: [],
      dialogTableVisible: false,
      title: '',
      operations: [
        {
          label: '确定申请',
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
  watch: {},
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),
    returnStepOne() {
      this.$emit('step2Confirm');
    },
    addProduct() {
      this.queryFilters();
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
        shopBrands: this.getSelectedBrandId(),
        categoryId: this.productCategoryId,
        searchValue: this.dialogFilters[2].value,
        shopId: this.getUser().shop.id || '',
        userId: this.getUser().id || '',
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize
      };
      http
        .get(urls.hypermarketMgmt.getList, params)
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
    // 查询过滤器
    queryFilters() {
      let params = {
        clientType: '2',
        userId: this.getUser().id,
        shopId: this.getUser().shop.id
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
        shopId: this.getUser().shop.id,
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
    setBrandFilters(brandDatas) {
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
          this.$set(gift, 'amount', 1);
          this.$set(gift, 'productName', gift.fullName);
          this.selectedGiftList.push(gift);
        }
      });
      let total = 0;
      this.selectedGiftList.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
    },
    operate(name) {
      this[name]();
    },
    handleSelect(val) {
      let contain = false;
      val.productId = val.id;
      val.id = '';
      this.totalFee = (Number(this.totalFee) + Number(val.amount) * Number(val.price)).toFixed(2);
      if (this.tableData.length === 0) {
        this.tableData.push(val);
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          this.tableData[i].amount = (Number(this.tableData[i].amount) + 1).toString();
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
      this.totalFee = (Number(this.totalFee) - Number(val.row.price) * Number(val.row.amount)).toFixed(2);
    },
    save() {
      this.itemDatas = this.tableData.map(item => {
        return {
          productId: item.productId ? item.productId : item.id,
          amount: item.amount || '',
          price: item.price || '',
          image: item.image || '',
          productName: item.fullName,
          specId: item.specId || '',
          specValue: item.specValue || '',
          totalFee: item.amount * item.price || '',
          categoryId: item.categoryId,
          categoryName: item.categoryName
        };
      });
      let flag = false;
      this.tableData.forEach(item => {
        if (String(item.amount).indexOf('.') !== -1) {
          this.$message.warning('数量不能为小数');
          flag = true;
        }
        if (item.amount % item.minimumPackQuantity !== 0) {
          this.$message.warning('数量为最小包装数的整数倍');
          flag = true;
        }
      });
      if (flag) {
        return false;
      } else {
        this.loading = true;
        let params = {
          shopId: window.top.SHOP_ID || '',
          relatePartnerId: this.formData.relatePartnerId,
          receiver: { id: this.formData.depot.id },
          itemDatas: this.itemDatas
        };
        http
          .post('/admin/invoicing/purchase/agentPurchaseApply.jhtml', params)
          .then(data => {
            this.$message.success('创建成功');
            this.$emit('operationSuccess');
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          });
      }
    },
    amountChange(amount) {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.amount) * Number(item.price);
        // if (amount % item.minimumPackQuantity === 0) {
        //   this.flg = true;
        // } else {
        //   this.flg = false;
        // }
      });
      if (total) {
        this.totalFee = total.toFixed(2);
      } else {
        this.totalFee = '';
      }
    }
  }
};
</script>

<style lang="scss">
.product-info-dailog {
  .el-dialog__header {
    text-align: center;
  }
  .biz-two-column {
    display: flex;
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
.product-info-class {
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
      margin-left: 16px;
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 160px;
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
  }
}
</style>
