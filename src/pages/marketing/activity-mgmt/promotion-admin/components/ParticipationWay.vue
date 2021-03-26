<template>
  <div class="promotion-participation-way">
    <!-- 已选商品列表 -->
    <div v-show="participationWay === 'Product'||participationWay === '3'">
      <el-button type="primary" @click="addProducts">添加商品</el-button>
      <el-table ref="productTable" size="small" :data="products" stripe border highlight-current-row tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column prop="fullName" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delProduct(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 已选品牌列表 -->
    <div v-show="participationWay === 'ShopBrand'||participationWay === '2'">
      <el-button type="primary" @click="addBrands">添加品牌</el-button>
      <el-table ref="brandTable" size="small" :data="shopBrands" stripe border highlight-current-row tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column prop="name" label="品牌名称"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delBrand(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 已选分类列表 -->
    <div v-show="participationWay === 'ProductCategory'||participationWay === '1'">
      <el-button type="primary" @click="showClassSelector = !showClassSelector">添加分类</el-button>
      <el-table ref="cateTable" size="small" :data="productCategories" stripe border highlight-current-row tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="option" label="操作" width="70">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color: red" @click.stop="delClass(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 选择商品 -->
    <biz-dialog-selector title="选择商品" :visibility.sync="showProductSelector" :tableData="productTableData"
      :pagination="productPagination" :filters="productFilters" :selectionKeys="selectedProducts" :max="5"
      @pageSizeChange="productPageSizeChange" @currentPageChange="productCurrentPageChange" @confirmed="confirmedProduct"
      @filterDataChange="productFilterDataChange">
      <el-table-column label="服务名称">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.businessServiceType==='0'?scope.row.businessService.name:scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="businessServiceClassifyPathName" label="分类">
      </el-table-column>
      <el-table-column prop="price" label="价格">
      </el-table-column>
      <el-table-column prop="isFree" label="是否默认提供">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.businessService.isDefault==='1'?'√':'×'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="isDefault" label="是否免费">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.isFree==='1'?'√':'×'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="isMarketable" label="是否上架">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.isMarketable==='1'?'√':'×'}}</div>
        </div>
      </el-table-column>
    </biz-dialog-selector>
    <!-- 选择品牌 -->
    <el-dialog class="promotion-dialog-checkbox" title="选择品牌" :visible.sync="showBrandSelector" append-to-body>
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
    <el-dialog class="promotion-dialog-checkbox" title="选择分类" :visible.sync="showClassSelector" append-to-body>
      <!-- <el-checkbox-group v-model="classArr">
        <el-checkbox v-for="category in baseInfo.productCategories" :key="category.index" :label="category.id">{{category.name}}
        </el-checkbox>
      </el-checkbox-group> -->
      <el-tree :props="defaultProps" node-key="id" :highlight-current="highlightCurrent" :data="dataTree" show-checkbox
        @check-change="handleCheckChange" ref="tree">
      </el-tree>
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
import { activityMgmt } from '@/common/urls';
import urls from './urls.js';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
export default {
  name: 'PromotionParticipationWay',
  props: {
    // v-model进来的值
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 参与方式
    participationWay: {
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
      // 商品列表
      DefaultImg: DefaultImg,
      brandList: [],
      brandSearchValue: '',
      products: [],
      shopBrands: [],
      productCategories: [],
      showProductSelector: false,
      showBrandSelector: false,
      showClassSelector: false,
      // 弹出框选中的品牌项
      brandArr: [],
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
          type: 'input',
          placeholder: '请输入编号/商品名',
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
      // ==============================================================
      // // 创建一个新对象,将val的值都设为true
      // let newObj = {};
      // val.map(value => {
      //   newObj[value] = true;
      // });
      // // 遍历newObj, 如果为false表示val中不包含已选中列表中的id, 则在已选中列表中删除该商品, 如果为true表示val中包含已选中id, 设该项为false
      // let length = this.selectedProducts.length;
      // for (let i = 0; i < length; i++) {
      //   if (!newObj[this.selectedProducts[i]]) {
      //     this.products.splice(i, 1);
      //   } else {
      //     newObj[this.selectedProducts[i]] = false;
      //   }
      // }
      // this.productTableData.map(product => {
      //   // newObj[id]为true表示为新加id,为false表示已有id
      //   if (val.indexOf(product.id) !== -1 && newObj[product.id]) {
      //     this.products.push(product);
      //   }
      // });
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
        searchValue: this.productFilters[0].value,
        pageNumber: this.productPagination.currentPage,
        pageSize: this.productPagination.pageSize
      };
      http
        .get('/admin/businessProduct/list/v201901.jhtml', params)
        .then(data => {
          this.productPagination.total = Number(data.total);
          this.productTableData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    addProducts() {
      // this.showProductSelector = !this.showProductSelector;
      this.selectedProducts = [];
      this.value.map(item => {
        this.selectedProducts.push(item.id);
      });
      this.showProductSelector = true;
    },
    addBrands() {
      this.showBrandSelector = !this.showBrandSelector;
      this.getBrandList();
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
    handleInput(val) {
      this.$emit('input', val);
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        switch (this.participationWay) {
          case 'Store':
          case '0':
            this.products = [];
            this.shopBrands = [];
            this.productCategories = [];
            break;
          case 'Product':
          case '3':
            this.products = newValue;
            this.shopBrands = [];
            this.productCategories = [];
            break;
          case 'ShopBrand':
          case '2':
            this.products = [];
            this.shopBrands = newValue;
            this.productCategories = [];
            break;
          case 'ProductCategory':
          case '1':
            this.products = [];
            this.shopBrands = [];
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
        if (this.participationWay === '2') {
          this.brandArr = this.value.map(item => {
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
.promotion-participation-way {
  .el-table {
    margin-top: 10px;
  }
}
.promotion-dialog-checkbox {
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
