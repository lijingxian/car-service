<template>
  <biz-grid class="product-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form :inline="true">
      <el-form-item label="合计:" prop="totalFee" class="subTotal">￥{{totalFee?totalFee:'0'}}</el-form-item>
    </el-form>
    <biz-list ref="table" :tableData="tableData" :height="'100%'" :loading="loading" :key="Math.random()">
      <el-table-column prop="productName" label="商品名称" min-width="100"></el-table-column>
      <el-table-column prop="price" label="退货单价(元)" min-width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input size="small" v-model="scope.row.price" @change="priceChange(scope.row.price)" :disabled="!isEdit"></el-input>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="amount" label="退货数量" min-width="110">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-input-number size="mini" :min="1" v-model="scope.row.amount" @change="amountChange(scope.row.amount)" style="width:90px" :disabled="!isEdit"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="totalFee" label="金额(元)" min-width="100">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.amount?(Number(scope.row.amount)*Number(scope.row.price)).toFixed(2):''}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="depotId" label="仓库" min-width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.depotId" placeholder="请选择类型" size="mini" :disabled="!isEdit">
            <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" type="index" v-if="isEdit" min-width="100">
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
    >
      <el-table-column property="fullName" label="商品名称" width="200px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg">
            <div style="width:120px;">{{scope.row.fullName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column label="库存">
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
      selectedGiftList: [],
      selectedGiftIds: [],
      showDialog: false,
      DefaultImg: DefaultImg,
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
      totalFee: '',
      height: '585',
      tableData: [],
      restaurants: [],
      selections: [],
      itemDatas: [],
      dialogTableVisible: false,
      storeList: [],
      selectionList: [],
      title: '',
      operations: [
        {
          label: '新增商品',
          name: 'addProduct',
          type: 'primary',
          disabled: false
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
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
      this.totalFee = '';
      this.storeList = [];
      this.itemId && this.getList();
      this.queryStoreHouseList();
    }
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),
    addProduct() {
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
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          gift.amount = '1';
          gift.productName = gift.fullName;
          this.selectedGiftList.push(gift);
        }
      });
      let total = 0;
      this.selectedGiftList.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
        this.listProduct(item);
      });
      this.storeList = [];
      this.queryStoreHouseList();
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
        .get(urls.invoicing.purchaseReturnOrderMgmt.shopPurchaseReturnOrderItems, params)
        .then(data => {
          this.tableData = data.itemList;
          this.totalFee = data.data.totalFee;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    queryStoreHouseList() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.storeHouseMgmt.shopDepotList, params)
        .then(data => {
          for (const item of data.dataList) {
            if (item.enabled === '1') {
              this.storeList.push(item);
            }
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
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
      if (val.row.id === '') {
        this.tableData.splice(val.$index, 1);
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http
            .delete(urls.invoicing.purchaseReturnOrderMgmt.shopPurchaseReturnOrderItem, { ids: [val.row.id] })
            .then(data => {
              this.$message.success('删除成功');
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
      this.totalFee = (Number(this.totalFee) - Number(val.row.price) * Number(val.row.amount)).toFixed(2);
    },
    save() {
      this.itemDatas = this.tableData.map(item => {
        return {
          id: item.id || '',
          billId: this.itemId,
          productId: item.productId ? item.productId : item.id,
          amount: item.amount || '',
          price: item.price || '',
          depotId: item.depotId || '',
          productName: item.fullName,
          specId: item.specId || '',
          specValue: item.specValue || '',
          totalFee: item.amount * item.price || ''
        };
      });
      let flag = false;
      this.tableData.forEach(item => {
        console.log(item.amount);
        if (String(item.amount).indexOf('.') !== -1) {
          flag = true;
        }
      });
      if (flag) {
        this.$message.warning('数量不能为小数');
        return false;
      }
      let params = {
        itemDatas: this.itemDatas
      };
      http
        .post(urls.invoicing.purchaseReturnOrderMgmt.shopPurchaseReturnOrderItem, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('setReturnOrderItems', this.itemDatas);
          this.$emit('operationSuccess');
          this.getList();
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    amountChange(amount) {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      if (total) {
        this.totalFee = total.toFixed(2);
      } else {
        this.totalFee = '';
      }
    },
    priceChange(price) {
      let total = 0;
      this.tableData.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      if (total) {
        this.totalFee = total.toFixed(2);
      } else {
        this.totalFee = '';
      }
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
.product-info {
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
