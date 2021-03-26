<template>
  <div class="agent-participation-way">
    <!-- 已选供应商列表 -->
    <div v-show="productAgentWay === '4'">
      <el-button type="primary" @click="addSuppliers">新增</el-button>
      <el-table ref="supplierTable" size="small" :data="supplierTableData" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="name" label="供应商"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delSupplier(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 已选商品列表 -->
    <div v-show="productAgentWay === 'Product'||productAgentWay === '3'">
      <el-button type="primary" @click="addProducts">新增</el-button>
      <el-table ref="productTable" size="small" :data="products" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="fullName" label="商品"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delProduct(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 已选品牌列表 -->
    <div v-show="productAgentWay === 'ShopBrand'||productAgentWay === '2'">
      <el-button type="primary" @click="addBrands">新增</el-button>
      <el-table ref="brandTable" size="small" :data="shopBrands" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="name" label="品牌"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delBrand(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 已选分类列表 -->
    <div v-show="productAgentWay === 'ProductCategory'||productAgentWay === '1'">
      <el-button type="primary" @click="showClassSelector = !showClassSelector">新增</el-button>
      <el-table
        ref="cateTable"
        size="small"
        :data="productCategories"
        stripe
        border
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%;"
        row-key="id"
      >
        <el-table-column prop="name" label="分类"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delClass(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 选择商品 -->
    <biz-dialog-selector
      title="选择商品"
      :visibility.sync="showProductSelector"
      :tableData="productTableData"
      :pagination="productPagination"
      :filters="productFilters"
      :selectionKeys="selectedProducts"
      :max="5"
      @pageSizeChange="productPageSizeChange"
      @currentPageChange="productCurrentPageChange"
      @confirmed="confirmedProduct"
      @filterDataChange="productFilterDataChange"
      @active-item-change="activeItemChange"
      @cascaderChange="cascaderChange"
    >
      <el-table-column property="name" label="商品信息" width="300px">
        <template slot-scope="scope">
          <div class="dialog-column">
            <img :src="scope.row.image || DefaultImg" class="productImg">
            <div style="width:100%">
              <div>编号：{{scope.row.sn}}</div>
              <div>{{scope.row.fullName}}</div>
              <div>条码：{{scope.row.barCode}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="categoryName" label="分类"></el-table-column>
      <el-table-column property="brandName" label="品牌"></el-table-column>
      <el-table-column property="supplier.name" label="供应商"></el-table-column>
    </biz-dialog-selector>
    <!-- 选择商品 -->
    <el-dialog class="agent-dialog-checkbox" title="选择供应商" :visible.sync="showSupplierSelector" append-to-body>
      <div class="dialog-top">
        <el-input size="small" :placeholder="'请输入供应商'" v-model="supplierSearchValue">
          <el-button @click="supplierSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-checkbox-group v-model="supplierArr">
        <el-checkbox v-for="supplier in supplierList" :key="supplier.index" :label="supplier.id">{{supplier.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSupplierSelector = false">取 消</el-button>
        <el-button type="primary" @click="confirmSuppliers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择品牌 -->
    <el-dialog class="agent-dialog-checkbox" title="选择品牌" :visible.sync="showBrandSelector" append-to-body>
      <div class="dialog-top">
        <el-input size="small" :placeholder="'请输入品牌'" v-model="brandSearchValue">
          <el-button @click="brandSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-checkbox-group v-model="brandArr">
        <el-checkbox v-for="brand in brandList" :key="brand.index" :label="brand.id">{{brand.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBrandSelector = false">取 消</el-button>
        <el-button type="primary" @click="confirmBrands">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择分类 -->
    <el-dialog class="agent-dialog-checkbox" title="选择分类" :visible.sync="showClassSelector" append-to-body>
      <!-- <el-checkbox-group v-model="classArr">
        <el-checkbox v-for="category in baseInfo.productCategories" :key="category.index" :label="category.id">{{category.name}}
        </el-checkbox>
      </el-checkbox-group>-->
      <el-tree
        :props="defaultProps"
        node-key="id"
        :highlight-current="highlightCurrent"
        :data="dataTree"
        show-checkbox
        @check-change="handleCheckChange"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showClassSelector = false">取 消</el-button>
        <el-button type="primary" @click="confirmClasses">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import comUrls, { activityMgmt } from '@/common/urls';
import { mapGetters } from 'vuex';
import urls from './urls.js';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
export default {
  name: 'ProductAgentWay',
  props: {
    // v-model进来的值
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 参与方式
    productAgentWay: {
      type: String,
      default() {
        return '';
      }
    },
    // 从服务器获取的基本数据
    baseInfo: {
      type: Object,
      default() {
        return {
          shop: {
            name: ''
          }
        };
      }
    }
  },
  data() {
    return {
      highlightCurrent: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataTree: [],
      categoryDatas: [],
      productCategoryId: '',
      // 商品列表
      DefaultImg: DefaultImg,
      brandList: [],
      brandSearchValue: '',
      supplierList: [],
      supplierSearchValue: '',
      products: [],
      shopBrands: [],
      supplierTableData: [],
      productCategories: [],
      showProductSelector: false,
      showBrandSelector: false,
      showSupplierSelector: false,
      showClassSelector: false,
      // 弹出框选中的品牌项
      brandArr: [],
      supplierArr: [],
      // 类别列表
      classList: [],
      // 选中的分类项
      classArr: [],
      // 商品列表
      productTableData: [],
      // 选中的商品id列表
      selectedProducts: [],
      productPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
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
          name: 'brand',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '供应商',
          name: 'supplier',
          value: '',
          options: []
        },
        {
          type: 'input',
          placeholder: '请输入编号/商品名/条码',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  components: {
    BizDialogSelector
  },
  methods: {
    ...mapGetters(['getUser']),
    loadNode() {
      http
        .get('/admin/json/ShopProduct_category/list.jhtml', {
          pageNumber: 1,
          pageSize: 1000
        })
        .then(data => {
          this.dataTree = [];
          data.ProductCategoryManage.map(item => {
            this.dataTree.push({
              label: item.name,
              id: item.id,
              children: item.childrenProductCategoryDataList.map(element => {
                return { label: element.name, id: element.id };
              })
            });
          });
          this.$refs.tree.setCheckedKeys(
            this.value.map(item => {
              return item.id;
            })
          );
          console.log(this.dataTree);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      console.log(this.$refs.tree.getCheckedNodes());
      this.$nextTick(() => {
        this.classArr = this.$refs.tree.getCheckedNodes().map(item => {
          return item.id;
        });
      });
    },
    productPageSizeChange(val) {
      this.productPagination.pageSize = val;
      this.getProductTable();
    },
    productCurrentPageChange(val) {
      this.productPagination.currentPage = val;
      this.getProductTable();
    },
    confirmedProduct(val) {
      let params = {
        ids: val
      };
      http
        .post(activityMgmt.PromotionContent_queryProductByIds, params)
        .then(data => {
          this.products = data.content.filter(val => val);
          this.selectedProducts = this.products.map(item => {
            return item.id;
          });
          this.handleInput(this.products);
        })
        .catch(ErrorData => {
          console.log('ERR_GET_PRODUCT_BY_IDS: ', ErrorData);
        });
    },
    productFilterDataChange(val) {
      this.productPagination.currentPage = 1;
      this.productFilters = val;
      this.getProductTable();
    },
    delProduct(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
              this.products.splice(i, 1);
              this.handleInput(this.products);
            }
          }
          this.selectedProducts = [];
          this.products.map(product => {
            this.selectedProducts.push(product.id);
          });
        })
        .catch(() => {});
    },
    delBrand(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (let i = 0; i < this.shopBrands.length; i++) {
            if (this.shopBrands[i].id === id) {
              this.shopBrands.splice(i, 1);
              this.handleInput(this.shopBrands);
              this.brandSearchValue = '';
            }
          }
          this.brandArr = [];
          this.shopBrands.map(brand => {
            this.brandArr.push(brand.id);
          });
        })
        .catch(() => {});
    },
    delSupplier(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (let i = 0; i < this.supplierTableData.length; i++) {
            if (this.supplierTableData[i].id === id) {
              this.supplierTableData.splice(i, 1);
              this.handleInput(this.supplierTableData);
              this.supplierSearchValue = '';
            }
          }
          this.supplierArr = [];
          this.supplierTableData.map(supplier => {
            this.supplierArr.push(supplier.id);
          });
        })
        .catch(() => {});
    },
    delClass(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          for (let i = 0; i < this.productCategories.length; i++) {
            if (this.productCategories[i].id === id) {
              this.productCategories.splice(i, 1);
              this.handleInput(this.productCategories);
            }
          }
          this.classArr = [];
          this.productCategories.map(category => {
            this.classArr.push(category.id);
          });
        })
        .catch(() => {});
    },
    brandSearch() {
      this.getBrandList();
    },
    supplierSearch() {
      this.getSupplierList();
    },
    confirmBrands() {
      this.showBrandSelector = false;
      let params = {
        searchProperty: 'name',
        searchValue: '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.queryBrandList, params)
        .then(data => {
          this.brandList = data.Brand;
          this.shopBrands = this.brandList.filter(brand => this.brandArr.includes(brand.id));
          // this.baseInfo.brands.map(brand => {
          //   if (this.brandArr.indexOf(brand.id) !== -1) {
          //     this.shopBrands.push(brand);
          //   }
          // });
          this.handleInput(this.shopBrands);
        })
        .catch();
    },
    confirmSuppliers() {
      this.showSupplierSelector = false;
      let params = {
        cooperationType: '0',
        searchValue: '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.querySupplierList, params)
        .then(data => {
          this.supplierList = data.dataList;
          this.supplierTableData = this.supplierList.filter(supplier => this.supplierArr.includes(supplier.id));
          this.handleInput(this.supplierTableData);
        })
        .catch();
    },
    confirmClasses() {
      this.showClassSelector = false;
      this.productCategories = [];
      this.$refs.tree.getCheckedNodes().map(category => {
        if (this.classArr.indexOf(category.id) !== -1) {
          this.productCategories.push({ id: category.id, name: category.label });
        }
      });
      this.handleInput(this.productCategories);
    },
    getProductTable() {
      let params = {
        productType: 'normal',
        pageSize: this.productPagination.pageSize,
        pageNumber: this.productPagination.currentPage,
        searchValue: this.productFilters[3].value,
        brandId: this.getSelectedBrandId(),
        supplierId: this.productFilters[2].value,
        productCategoryId: this.productCategoryId
      };
      http
        .get('admin/invoicingProduct/stockCenterProducts.jhtml', params)
        .then(data => {
          this.productPagination.total = Number(data.total);
          this.productTableData = data.dataList;
        })
        .catch();
    },
    addProducts() {
      // this.showProductSelector = !this.showProductSelector;
      this.selectedProducts = [];
      this.value.map(item => {
        this.selectedProducts.push(item.id);
      });
      this.queryFilters();
      this.querySupplierList();
      this.showProductSelector = true;
    },
    addBrands() {
      this.showBrandSelector = !this.showBrandSelector;
      this.getBrandList();
    },
    addSuppliers() {
      this.showSupplierSelector = !this.showSupplierSelector;
      this.getSupplierList();
    },
    // 递归获取所有品牌
    getBrandList() {
      let params = {
        searchProperty: 'name',
        searchValue: this.brandSearchValue,
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.queryBrandList, params)
        .then(data => {
          this.brandList = data.Brand;
        })
        .catch();
    },
    getSupplierList() {
      let params = {
        cooperationType: '0',
        pageNumber: 1,
        pageSize: 1000,
        searchValue: this.supplierSearchValue
      };
      http
        .get(urls.querySupplierList, params)
        .then(data => {
          this.supplierList = data.dataList;
        })
        .catch();
    },
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    querySupplierList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        state: ''
      };
      http
        .get(comUrls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.productFilters[2].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
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
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.getProductTable();
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
          this.productFilters[0].options.forEach(item => {
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

      this.productFilters[0].options = options;
    },
    setBrandFilters() {
      let params = {
        searchProperty: 'name',
        searchValue: '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(urls.queryBrandList, params)
        .then(data => {
          this.productFilters[1].options = data.Brand.map(brand => {
            return { value: brand.id, label: brand.name };
          });
          this.productFilters[1].options.splice(0, 0, {
            value: '',
            label: '全部'
          });
        })
        .catch();
    },
    getSelectedBrandId() {
      return this.productFilters[1].value;
    },
    handleInput(val) {
      this.$emit('input', val);
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        switch (this.productAgentWay) {
          case 'Store':
          case '0':
            this.products = [];
            this.shopBrands = [];
            this.supplierTableData = [];
            this.productCategories = [];
            break;
          case '4':
            this.supplierTableData = newValue;
            this.shopBrands = [];
            this.products = [];
            this.productCategories = [];
            break;
          case 'Product':
          case '3':
            this.products = newValue;
            this.shopBrands = [];
            this.supplierTableData = [];
            this.productCategories = [];
            break;
          case 'ShopBrand':
          case '2':
            this.products = [];
            this.shopBrands = newValue;
            this.productCategories = [];
            this.supplierTableData = [];
            break;
          case 'ProductCategory':
          case '1':
            this.products = [];
            this.shopBrands = [];
            this.supplierTableData = [];
            this.productCategories = newValue;
            break;
          default:
            break;
        }
      },
      deep: true
    },
    showProductSelector(newVal, oldVal) {
      if (newVal) {
        this.productPagination.currentPage = 1;
        // this.productFilters = '';
        this.getProductTable();
      }
    },
    showClassSelector(newVal, oldVal) {
      if (newVal) {
        this.loadNode();
      }
    },
    showBrandSelector(newVal, oldVal) {
      if (newVal) {
        if (this.productAgentWay === '2') {
          this.brandArr = this.value.map(item => {
            return item.id;
          });
        }
      }
    },
    showSupplierSelector(newVal, oldVal) {
      if (newVal) {
        if (this.productAgentWay === '4') {
          this.supplierArr = this.value.map(item => {
            return item.id;
          });
        }
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.dialog-column {
  display: flex;
  align-items: center;
}
.productImg {
  display: block;
  width: 50px;
  height: 50px;
  margin-right: 5px;
}
.agent-participation-way {
  .el-table {
    margin-top: 10px;
  }
}
.agent-dialog-checkbox {
  .dialog-top {
    display: flex;
    justify-content: flex-end;
  }
  .el-input {
    width: 170px;
    margin-bottom: 15px;
  }
  .el-checkbox {
    margin-left: 30px;
    // min-width: 100px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
