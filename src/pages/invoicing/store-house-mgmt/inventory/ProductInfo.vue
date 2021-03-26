<template>
  <biz-grid class="product-info">
    <div slot="top" >
      <biz-save-button :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
      <el-form :inline="true" :disabled="!isEdit">
        <el-form-item label="商品总数:" prop="productTotal" class="subTotal">{{productTotal?productTotal:'0'}}</el-form-item>
        <el-form-item label="盈亏总数:" prop="profitTotal" class="subTotal">{{profitTotal?profitTotal:'0'}}</el-form-item>
      </el-form>
    </div>
    <biz-list ref="table" :tableData="tableData" :loading="loading" :key="Math.random()" @handleSelectionChange="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="fullName" label="商品" min-width="100"></el-table-column>
      <el-table-column prop="barCode" label="条码">
        <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
      </el-table-column>
      <el-table-column prop="amount" label="账目数量" min-width="60">
        <template slot-scope="scope">{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column prop="inventoryAmount" label="盘点数量" min-width="120">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="0" v-model="scope.row.inventoryAmount" @input="amountChange(scope.row)" style="width:120px" :disabled="!isEdit"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="盈亏" prop="profit" min-width="60"></el-table-column>
      <el-table-column prop="date" label="操作" type="index" v-if="isEdit" min-width="60">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click="deleteHandeler(scope.row)">删除</el-button>
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
      <el-table-column property="fullName" label="商品名称" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div style="margin-left: 10px" class="titleClass" :title="scope.row.fullName">{{scope.row.fullName}}</div>
            </div>
          </div>
        </template>
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
      productCategoryId: '',
      categoryDatas: [],
      selectedGiftList: [],
      selectedGiftIds: [],
      showDialog: false,
      DefaultImg: DefaultImg,
      errorImg: 'this.src="' + require('../../../../assets/images/commodity/pic_default_fail.png') + '"',
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
      profitTotal: '',
      productTotal: '',
      height: '585',
      tableData: [],
      restaurants: [],
      selections: [],
      itemDatas: [],
      dialogTableVisible: false,
      storeList: [],
      selectionList: [],
      multipleSelection: [],
      title: '',
      operations: [
        {
          label: '删除',
          name: 'del',
          type: '',
          disabled: true
        },
        {
          label: '新增商品',
          name: 'addProduct',
          type: 'primary'
          // auth: ['admin:check.edit']
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:check.edit']
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
  watch: {
    itemId(val) {
      this.tableData = [];
      this.productTotal = '';
      this.profitTotal = '';
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
        productCategoryId: this.productCategoryId,
        brandId: this.getSelectedBrandId(),
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[2].value,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.commodity.getCommodityList, params)
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
      // let productTotal = 0;
      // let profitTotal = 0;
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.$set(gift, 'productName', gift.fullName);
          this.$set(gift, 'profit', '--');
          this.$set(gift, 'amount', gift.minimumPackQuantity);
          this.$set(gift, 'barCode', gift.barCode);
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
      // for (const item of this.tableData) {
      //   item.profit = Number(item.inventoryAmount) - Number(item.amount);
      //   profitTotal = profitTotal + Number(item.profit);
      //   productTotal = productTotal + Number(item.amount);
      //   if (productTotal || profitTotal) {
      //     this.productTotal = productTotal;
      //     this.profitTotal = profitTotal;
      //   }
      // }
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
        id: this.itemId,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.inventory.itemList, params)
        .then(data => {
          this.tableData = data.itemList;
          this.productTotal = data.data.totalAmount;
          this.profitTotal = data.data.profit;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    handleSelect(val) {
      let contain = false;
      val.productId = val.id;
      val.id = '';
      if (this.tableData.length === 0) {
        this.tableData.push(val);
        return;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId === val.productId) {
          this.tableData[i].amount = (Number(this.tableData[i].amount) + Number(val.availableStock)).toString();
          if (this.tableData[i].inventoryAmount) {
            this.tableData[i].profit = Number(this.tableData[i].inventoryAmount) - Number(this.tableData[i].amount);
          }
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableData.push(val);
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      this.operations[0].disabled = true;
      if (this.multipleSelection.length > 0) {
        this.operations[0].disabled = false;
      }
    },
    del() {
      let ids = [];
      this.multipleSelection.map(item => {
        if (!item.id) {
          this.deleteHandeler(item);
        } else {
          ids.push(item.id);
        }
      });
      if (ids.length > 0) {
        this.loading = true;
        http
          .delete(urls.invoicing.inventory.inventoryItem, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.$emit('operationSuccess');
            this.getList();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    deleteHandeler(val) {
      if (val.id === '') {
        this.tableData.splice(this.tableData.indexOf(val), 1);
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http
            .delete(urls.invoicing.inventory.inventoryItem, { ids: [val.id] })
            .then(data => {
              this.$message.success('删除成功');
              this.$emit('operationSuccess');
              this.getList();
            })
            .catch(errData => {
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        });
      }
      this.productTotal = Number(this.productTotal) - Number(val.amount);
      if (val.profit === '--') {
        this.profitTotal = Number(this.profitTotal) - 0;
      } else {
        this.profitTotal = Number(this.profitTotal) - Number(val.profit);
      }
    },
    save() {
      this.itemDatas = this.tableData.map(item => {
        return {
          id: item.id,
          billId: this.itemId,
          productId: item.productId ? item.productId : item.id,
          amount: item.amount || '',
          price: item.price || '',
          depotId: item.depotId || '',
          depotName: item.depotName || '',
          productName: item.fullName,
          categoryId: '',
          categoryName: '',
          specId: item.specId || '',
          specValue: item.specValue || '',
          inventoryAmount: item.inventoryAmount || '',
          profit: item.profit || ''
        };
      });
      let flag = false;
      this.tableData.forEach(item => {
        if (String(item.inventoryAmount).indexOf('.') !== -1) {
          this.$message.warning('盘点商品数不能为小数');
          flag = true;
        }
      });
      if (flag) {
        return false;
      } else {
        let params = {
          id: this.itemId,
          itemDatas: this.itemDatas
        };
        http
          .post(urls.invoicing.inventory.inventoryItem, params)
          .then(data => {
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            this.getList();
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.getList();
            this.$message.warning(error.errorMessage);
          });
      }
    },
    amountChange(row) {
      let profitTotal = 0;
      for (const item of this.tableData) {
        if (item.inventoryAmount === '' || item.inventoryAmount === 'undefined') {
          this.$set(item, 'profit', '');
          profitTotal = profitTotal + 0;
        } else {
          if (item.id === row.id && item.inventoryAmount) {
            this.$set(item, 'profit', Number(item.inventoryAmount) - Number(item.amount));
          }
          profitTotal = profitTotal + Number(item.profit);
        }
      }
      if (profitTotal) {
        this.profitTotal = profitTotal;
      } else {
        this.profitTotal = '';
      }
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      http
        .get('/admin/shopProduct/filter.jhtml', params)
        .then(data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters(data.brandDatas);
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
      this.dialogFilters[1].options = brandDatas.map(brand => {
        return { value: brand.id, label: brand.name };
      });
      this.dialogFilters[1].options.splice(0, 0, {
        value: '',
        label: '全部'
      });
    },
    getSelectedBrandId() {
      return this.dialogFilters[1].value;
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
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.getGiftList();
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
.product-info {
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
  .biz-customcol {
    .el-input-number--mini .el-input-number__increase,
    .el-input-number--mini .el-input-number__decrease {
      width: 20px;
    }
    .el-input-number--mini .el-input__inner {
      padding-left: 25px;
      padding-right: 25px;
    }
  }
}
</style>
