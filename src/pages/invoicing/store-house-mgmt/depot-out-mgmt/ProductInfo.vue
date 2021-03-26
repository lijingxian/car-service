<template>
  <biz-grid class="product-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <biz-list ref="table" :tableData="tableData" :height="'100%'" :loading="loading" :key="Math.random()" v-loading="loading">
      <el-table-column prop="productName" label="商品" min-width="100">
        <template
          slot-scope="scope">{{scope.row.product&&scope.row.product.fullName?scope.row.product.fullName:scope.row.productName}}</template>
      </el-table-column>
      <el-table-column prop="barCode" label="条码">
        <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
      </el-table-column>
      <el-table-column prop="amount" label="订单数量"></el-table-column>
      <el-table-column prop="depotedQuantity" label="已出库数量"></el-table-column>
      <el-table-column prop="unDepotedQuantity" label="待出库数量"></el-table-column>
      <el-table-column prop="date" label="操作" type="index" v-if="isEdit" width="120">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click="confirm(scope.row)">确认出库</el-button>
            <el-button type="text" size="mini" @click="deleteHandeler(scope)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <biz-dialog-selector title="选择商品" :visibility.sync="showDialog" :tableData="giftList" :pagination="dialogPagination"
      :filters="dialogFilters" :selectionKeys="selectedGiftIds" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" class="product-info-dailog" @confirmed="confirmedProduct"
      @filterDataChange="dialogFilterDataChange" @selectionChange="selectionChange" :isDepotOut="isDepotOut"
      @active-item-change="activeItemChange" @cascaderChange="cascaderChange">
      <el-table-column property="fullName" label="商品名称" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px" class="titleClass" :title="scope.row.fullName">{{scope.row.fullName}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="barCode" label="条码"></el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column property="price" label="商品数量" width="120px">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.amount" size="mini" :max="Number(scope.row.realStock)" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="在库库存">
        <template slot-scope="scope">
          <div style="width:120px;">{{scope.row.realStock}}</div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector title="选择仓库" :visibility.sync="showDepotDialog" :appendToBody="true" :tableData="storeList"
      :selectionMode="'single'" :isClear="false" @open="opened" @confirmed="handleDepotConfirmed" class="depotDialog">
      <el-table-column label="仓库名称" prop="depotName"></el-table-column>
      <el-table-column prop="stockAmount" label="在库数量"></el-table-column>
    </biz-dialog-selector>
    <el-dialog title="确认出库" :visible.sync="showDialogInDepot" append-to-body custom-class="depot-in-dialog" width="80%">
      <div style="display:flex;justify-content:space-between">
        <span>商品名称：{{row.productName||row.fullName}}</span><span>条码：{{row.product?row.product.barCode:''}}</span><span>待出库数量：{{row.unDepotedQuantity || row.amount}}</span><span>本次数量：{{amount}}</span>
      </div>
      <biz-header :filters="filters" @filter-data-change="handleFilterDataChange">
      </biz-header>
      <expand-table ref="expandTable" :data="tableDataInDePot" :loading="loading" @expand-change="expandChange"
        @delete="handleDeleteClick" @row-click="handleRowClick" style="height:500px;min-height:95%"
        @quantityChange="quantityChange"></expand-table>
      <biz-pagination :pagination="paginationExpend"></biz-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="confirmed">确定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import http from '@/common/http';
import ExpandTable from './components/ExpandTable';
import BizDialogSelector from '@/components/BizDialogSelector';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';

export default {
  name: 'ProductInfo',
  props: {
    itemId: {
      type: String
    },
    returnId: {
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
      productId: '',
      amount: '',
      productCategoryId: '',
      selectedGiftList: [],
      selectedGiftIds: [],
      showDialog: false,
      showDepotDialog: false,
      DefaultImg: DefaultImg,
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入仓库名称',
          name: 'searchValue',
          value: ''
        }
      ],
      paginationExpend: {
        pageSize: 1000,
        pageSizes: [1000],
        currentPage: 1,
        total: 9
      },
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
      isDepotOut: true,
      totalFee: '',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      height: '585',
      tableData: [],
      restaurants: [],
      selections: [],
      itemDatas: [],
      showDialogInDepot: false,
      tableDataInDePot: [],
      row: {},
      dialogTableVisible: false,
      storeList: [],
      selectionList: [],
      categoryDatas: [],
      title: '',
      operations: [
        {
          label: '新增商品',
          name: 'addProduct',
          type: 'primary',
          auth: ['admin:export.edit']
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:export.edit']
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
    ExpandTable,
    BizPagination,
    BizHeader,
    BizDialogSelector
  },
  watch: {
    itemId(val) {
      this.tableData = [];
      this.storeList = [];
      this.itemId && this.getList();
      // this.queryStoreHouseList();
    },
    returnId(val) {
      this.tableData = [];
      this.storeList = [];
      this.returnId && this.getList();
      // this.queryStoreHouseList();
    }
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),
    expandChange(row) {
      this.currentRow = row;
      // this.query(row);
    },
    // 查询
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        productId: this.row.productId,
        searchValue: this.filters[0].value
      };
    },
    query() {
      this.loading = true;
      http
        .get('/admin/invoicing/stock/productDepots.jhtml', this.getQueryParams())
        .then(data => {
          this.loading = false;
          this.tableDataInDePot = data.dataList;
          for (const iterator of this.tableDataInDePot) {
            this.$set(iterator, 'quantity', 0);
            if (iterator.children && iterator.children.length > 0) {
              iterator.hasChild = '1';
              for (const item of iterator.children) {
                this.$set(item, 'quantity', 0);
                item.parentName = iterator.name;
                if (item.children.length > 0) {
                  item.hasChild = '1';
                  for (const list of item.children) {
                    this.$set(list, 'quantity', 0);
                    list.parentName = item.name;
                  }
                }
              }
            }
          }
          this.paginationExpend.total = Number(data.total);
          this.quantityChange();
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
    close() {
      this.showDialogInDepot = false;
    },
    confirmed() {
      let records = [];
      let flag = false;
      for (const iterator of this.tableDataInDePot) {
        if (iterator.quantity) {
          records.push({ itemId: this.row.id, depot: { id: iterator.id }, quantity: iterator.quantity });
          // 本次数量大于在库库存
          if (iterator.quantity > iterator.stockQuantity) {
            flag = true;
          }
        }
        if (iterator.children && iterator.children.length > 0) {
          for (const item of iterator.children) {
            if (item.quantity) {
              records.push({ itemId: this.row.id, depot: { id: item.id }, quantity: item.quantity });
              // 本次数量大于在库库存
              if (item.quantity > item.stockQuantity) {
                flag = true;
              }
            }
            if (item.children.length > 0) {
              for (const list of item.children) {
                if (list.quantity) {
                  records.push({ itemId: this.row.id, depot: { id: list.id }, quantity: list.quantity });
                  // 本次数量大于在库库存
                  if (list.quantity > list.stockQuantity) {
                    flag = true;
                  }
                }
              }
            }
          }
        }
      }
      if (flag) {
        this.$confirm('您本次出库的商品的数量与关联单据的需出库数量不符，确认出库?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.depotOutConfirm(records);
        });
      } else {
        this.depotOutConfirm(records);
      }
    },
    depotOutConfirm(records) {
      this.loading = true;
      http
        .post('/admin/invoicing/stock/depotOut/records.jhtml', { id: this.itemId, records: records })
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.showDialogInDepot = false;
          this.refresh();
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
    },
    confirm(row) {
      console.log(row);
      this.row = row;
      this.query();
      this.showDialogInDepot = true;
    },
    handleFilterDataChange() {
      this.query();
    },
    handleRowClick(model, e, column) {},
    handleDeleteClick(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    quantityChange(e, model) {
      let total = 0;
      for (const iterator of this.tableDataInDePot) {
        if (iterator.quantity) {
          total += Number(iterator.quantity);
        }
        if (iterator.children && iterator.children.length > 0) {
          for (const item of iterator.children) {
            if (item.quantity) {
              total += Number(item.quantity);
            }
            if (item.children.length > 0) {
              for (const list of item.children) {
                if (list.quantity) {
                  total += Number(list.quantity);
                }
              }
            }
          }
        }
      }
      this.amount = total;
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
      this.selectionList.map(gift => {
        if (this.selectedGiftIds.indexOf(gift.id) !== -1) {
          this.$set(gift, 'amount', gift.amount);
          this.$set(gift, 'product', { fullName: gift.fullName, barCode: gift.barCode });
          this.$set(gift, 'depotedQuantity', 0);
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
      });
      this.storeList = [];
      this.queryStoreHouseList();
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
          this.tableData[i].amount = (Number(this.tableData[i].amount) + 1).toString();
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableData.push(val);
      }
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
        id: this.itemId || this.returnId,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.depotOutMgmt.shopDepotOutItems, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.itemList;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    handleDepotConfirmed(selectionKeys, selections) {
      this.tableData.forEach((item, index) => {
        if (item.productId === selections[0].productId) {
          item.depotId = selections[0].depotId;
          item.depotName = selections[0].depotName;
        }
      });
    },
    showDialogDepot(productId) {
      this.productId = productId;
      this.showDepotDialog = true;
    },
    opened() {
      this.storeList = [];
      this.queryStoreHouseList();
    },
    queryStoreHouseList() {
      this.loading = true;
      let params = {
        productId: this.productId
      };
      http
        .get('/admin/invoicing/stock/productDepots.jhtml', params)
        .then(data => {
          this.storeList = data.dataList;
          for (const iterator of this.storeList) {
            if (iterator.children.length > 0) {
              iterator.hasChild = '1';
              for (const item of iterator.children) {
                item.parentName = iterator.name;
                if (item.children.length > 0) {
                  item.hasChild = '1';
                  for (const list of item.children) {
                    list.parentName = item.name;
                  }
                }
              }
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
            .delete(urls.invoicing.depotOutMgmt.shopDepotOutItem, { ids: [val.row.id] })
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
    },
    save() {
      this.itemDatas = this.tableData.map(item => {
        return {
          id: item.id || '',
          billId: this.itemId || this.returnId,
          product: { id: item.productId ? item.productId : item.id, barCode: item.product ? item.product.barCode : '' },
          actualQuantity: item.unDepotedQuantity || '',
          amount: item.amount || '',
          depot: { id: item.depotId },
          productName: item.fullName || item.productName,
          specId: item.specId || '',
          specValue: item.specValue || '',
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
        // if (item.depotId === '' || item.depotId === undefined) {
        //   this.$message.warning('商品信息不完整!');
        //   flag = true;
        // }
      });
      if (flag) {
        return false;
      } else {
        this.loading = true;
        let params = {
          id: this.itemId || this.returnId,
          itemDatas: this.itemDatas
        };
        http
          .post('/admin/invoicing/stock/shopDepotOutItem.jhtml', params)
          .then(data => {
            this.$message.success('保存成功');
            this.$emit('operationSuccess');
            this.getList();
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          });
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
.depot-in-dialog {
  .noexpand {
    .el-table__expand-icon {
      visibility: hidden;
    }
  }

  .first-name {
    .el-table__expand-icon {
      display: none;
    }
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
.depotDialog .biz-pagination {
  display: none;
}
.biz-dialog-selector {
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 200px;
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
  }
  .el-input {
    font-size: 12px;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>
