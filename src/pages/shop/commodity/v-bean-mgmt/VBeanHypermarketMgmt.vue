<template>
  <div class="v-bean-hypermarket-mgmt">
    <biz-flex-table
      v-loading="loading"
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @active-item-change="activeItemChange"
      @cascader-change="cascaderChange"
    >
      <el-table-column prop="shop.name" label="商品" min-width="220">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                  <img v-if="scope.row.image&&scope.row.image!==' '" :src="scope.row.image" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="scope.row.name">{{scope.row.sn}}</div>
                    <div class="overflow">{{scope.row.name}}</div>
                    <div class="overflow">{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="分类" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.categoryName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="销售价" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ￥{{toPrice(scope.row.price)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="剩余库存/库存总数" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.availableStock }}/<span :style="{color: stateColor(scope.row)}">{{ scope.row.stock }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="销量" min-width="60">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sales||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="状态" min-width="60">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <span :style="{color: statusColor(scope.row)}">{{getStatus(scope.row)}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" v-if="canOffsale(scope.row)&&hasAuthOff" size="mini" @click.stop="soldout(scope.row.id)">
              下架
            </el-button>
            <el-button type="text" size="mini" v-if="canOnsale(scope.row)&&hasAuthOn" @click.stop="putaway(scope.row.id)">
              上架
            </el-button>
            <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="deleteVBean(scope.row.id)">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
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
      @sort-change="handleDialogSortChange"
    >
      <el-table-column width="400" prop="fullName" label="商品名">
        <div slot-scope="scope">
          <div class="biz-two-column">
            <img :src="scope.row.image || defaultImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div style="margin-left: 10px">{{ scope.row.fullName }}</div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类"></el-table-column>
      <el-table-column label="品牌" prop="brandName"></el-table-column>
      <el-table-column prop="price" label="销售价" sortable="custom" width="120">
        <div slot-scope="scope">￥{{toPrice(scope.row.price)}}</div>
      </el-table-column>
      <el-table-column prop="stock" label="剩余库存/库存总数" sortable="custom" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{ scope.row.availableStock }}/
            <span :style="{color: stateColor(scope.row)}">{{ scope.row.stock }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="state" label="状态" :formatter="getStatus">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺"></el-table-column>
    </biz-dialog-selector>
    <VBean-popup
      slot="float"
      :open="open"
      :id="itemId"
      @close="open = false;itemId = '';"
      :isEdit="isEdit"
      @operationSuccess="refresh"
      :baseInfo="rowBaseInfo"
      @createdProductSuccess="createdProductSuccess"
    ></VBean-popup>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import BizDialogSelector from '@/components/BizDialogSelector';
import { mapGetters } from 'vuex';
import VBeanPopup from './VBeanPopup';
import { global } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'VBeanHypermarketMgmt',
  data() {
    return {
      productCategoryId: '',
      dialogProductCategoryId: '',
      rowBaseInfo: {},
      loading: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      itemId: '',
      open: false,
      isEdit: true,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:product.exchange.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: '',
          auth: ['admin:product.exchange.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
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
          type: 'select',
          label: '店铺',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          value: ''
        }
      ],
      dialogFilters: [
        // {
        //   type: 'cascader',
        //   label: '分类',
        //   name: 'category',
        //   filterable: false,
        //   value: [],
        //   options: []
        // },
        // {
        //   type: 'select',
        //   label: '品牌',
        //   value: '',
        //   options: []
        // },
        // {
        //   type: 'select',
        //   label: '店铺',
        //   value: '',
        //   options: []
        // },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          value: ''
        }
      ],
      tableData: [],
      giftList: [],
      showDialog: false,
      selectedGiftIds: [],
      selectionList: [],
      categoryDatas: [],
      categoryDialogDatas: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      sortInfo: {}
    };
  },
  components: {
    VBeanPopup,
    BizFlexTable,
    BizDialogSelector
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:product.exchange.delete');
    },
    hasAuthOn() {
      // return true;
      return this.currentAuth.includes('admin:product.exchange.on');
    },
    hasAuthOff() {
      // return true;
      return this.currentAuth.includes('admin:product.exchange.off');
    },
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:product.exchange.edit');
    }
  },
  created() {
    this.getUser();
    this.refresh();
    this.queryFilters();
    this.getEditableStores();
    this.getDefalutImg();
    let msg = '您可选择商品设置为V豆兑换商品，如需编辑商品请至商品信息功能';
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: msg,
      duration: 3000
    });
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    // 可以上架
    canOnsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.onsaleable === '1' : false) : false;
    },
    // 可以下架
    canOffsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.offsaleable === '1' : false) : false;
    },
    refresh() {
      this.getList();
    },
    createdProductSuccess(id, type) {
      this.itemId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.itemId = row.id;
      this.rowBaseInfo = row;
      this.isEdit = false;
      this.open = true;
    },
    statusColor(row) {
      if (row.state === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    // 保留两位小数（四舍五入）
    toPrice(num) {
      num = parseFloat(num)
        .toFixed(2)
        .toString()
        .split('.');
      num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,');
      return num.join('.');
    },
    soldout(id) {
      this.$confirm('是否确认下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          if (id) {
            ids.push(id);
          } else {
            for (const iterator of this.multipleSelection) {
              ids.push(iterator.id);
            }
          }
          let params = {
            ids: ids,
            state: 'false'
          };
          CommodityMgmtService.soldoutAndPutaway(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    putaway(id) {
      this.$confirm('是否确认上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          if (id) {
            ids.push(id);
          } else {
            for (const iterator of this.multipleSelection) {
              ids.push(iterator.id);
            }
          }
          let params = {
            ids: ids,
            state: 'true'
          };
          CommodityMgmtService.soldoutAndPutaway(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '2'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getDefalutImg() {
      http
        .get('/admin/settings/settings.jhtml', {
          type: 'displaySetting'
        })
        .then(data => {
          if (data.settingList.defaultThumbnailProductImage) {
            if (data.settingList.defaultThumbnailProductImage) {
              this.defaultImg = data.settingList.defaultThumbnailProductImage;
            }
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        productCategoryId: this.productCategoryId,
        brandId: this.getSelectedBrandId(),
        searchShopId: this.getSelectedShopId(),
        searchValue: this.filters[3].value,
        shopId: window.top.SHOP_ID,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        orderProperty: this.sortInfo.column,
        orderDirection: this.sortInfo.sort,
        isExchange: '1'
      };
      this.loading = true;
      CommodityMgmtService.getCommodityList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getGiftList() {
      let params = {
        // productCategoryId: this.dialogProductCategoryId,
        // brandId: this.getSelectedDialogBrandId(),
        // searchShopId: this.getSelectedDialogShopId(),
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID,
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize,
        orderProperty: this.sortInfo.column,
        orderDirection: this.sortInfo.sort,
        isExchange: '0'
      };
      this.loading = true;
      CommodityMgmtService.getCommodityList(
        params,
        data => {
          this.giftList = data.content;
          this.dialogPagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.getGiftList();
    },
    add() {
      this.giftList = [];
      // this.dialogProductCategoryId = '';
      // this.categoryDialogDatas = [];
      // this.dialogFilters[0].value = [];
      // this.dialogFilters[1].value = '';
      // this.dialogFilters[2].value = '';
      this.dialogFilters[0].value = '';
      this.getGiftList();
      // this.queryDialogFilters();
      this.showDialog = true;
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.refresh();
    },
    // dialogCascaderChange(val) {
    //   this.dialogProductCategoryId = val[val.length - 1];
    //   if (val.length > 1 && this.dialogProductCategoryId === '') {
    //     this.dialogProductCategoryId = val[val.length - 2];
    //   }
    //   this.getGiftList();
    // },
    // dialogActiveItemChange(val) {
    //   let param = {
    //     shopId: this.getUser().shop.id,
    //     parentId: val.toString()
    //   };
    //   http
    //     .get('/admin/shopProduct/productCategorys.jhtml', param)
    //     .then(data => {
    //       this.setCategoryDialogFilters();
    //       let curItem;
    //       this.dialogFilters[0].options.forEach(item => {
    //         if (item.value === val[0]) {
    //           curItem = item.children;
    //         }
    //       });
    //       data.dateList.forEach(element => {
    //         curItem.push({ value: element.id, label: element.name });
    //       });
    //     })
    //     .catch(() => {});
    // },
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
          this.filters[0].options.forEach(item => {
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
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
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
          this.selectedGiftList.push(gift);
        }
      });
      this.selectedGiftList.forEach(item => {
        this.handleSelect(item);
        this.listProduct(item);
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
          this.tableData[i].amount = (Number(this.tableData[i].amount) + 1).toString();
          contain = true;
          break;
        }
      }
      if (!contain) {
        this.tableData.push(val);
      }
    },
    listProduct(item) {
      let param = {
        ids: [item.productId]
      };
      http
        .post('/admin/product/exchangeProduct.jhtml', param)
        .then(data => {
          this.$message.success('添加成功');
          this.getList();
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getGiftList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getGiftList();
    },
    // 快捷操作-删除
    deleteVBean(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(id);
        let params = {
          ids: ids
        };
        http
          .delete('/admin/product/exchangeProduct.jhtml', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refresh();
          })
          .catch(error => {
            if (error.errorMessage) {
              console.log(error.errorMessage);
            }
          });
      });
    },
    // 批量操作-删除
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        for (const iterator of this.multipleSelection) {
          ids.push(iterator.id);
        }
        let params = {
          ids: ids
        };
        http
          .delete('/admin/product/exchangeProduct.jhtml', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refresh();
          })
          .catch(error => {
            if (error.errorMessage) {
              console.log(error.errorMessage);
            }
          });
      });
    },
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters(data.brandDatas);
          this.setStoreFilters(data.storeDatas);
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    // queryDialogFilters() {
    //   let params = { shopId: window.top.SHOP_ID || '' };
    //   CommodityMgmtService.queryFilters(
    //     params,
    //     data => {
    //       this.categoryDialogDatas = data.categoryDatas;
    //       this.setCategoryDialogFilters();
    //       this.setBrandDialogFilters(data.brandDatas);
    //       this.setStoreDialogFilters(data.storeDatas);
    //     },
    //     ErrorData => {
    //       if (ErrorData.errorMessage !== '') {
    //         this.$message.error(ErrorData.errorMessage);
    //       }
    //       console.log('获取过滤器失败', params);
    //     }
    //   );
    // },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
    },
    handleDialogSortChange(column) {
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getGiftList();
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

      this.filters[0].options = options;
    },
    setBrandFilters(brandDatas) {
      this.filters[1].options = brandDatas.map(brand => {
        return { value: brand.id, label: brand.name };
      });
      this.filters[1].options.splice(0, 0, {
        value: '',
        label: '全部'
      });
    },
    setStoreFilters(storeDatas) {
      this.filters[2].options = storeDatas.map(store => {
        return { value: store.id, label: store.name };
      });
      this.filters[2].options.splice(0, 0, {
        value: '',
        label: '全部'
      });
    },
    getSelectedBrandId() {
      return this.filters[1].value;
    },
    getSelectedShopId() {
      return this.filters[2].value;
    },
    // dialog search
    // setCategoryDialogFilters() {
    //   let options = [
    //     {
    //       value: '',
    //       label: '全部'
    //     }
    //   ];

    //   this.categoryDialogDatas.forEach(category => {
    //     options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
    //   });

    //   this.dialogFilters[0].options = options;
    // },
    // setBrandDialogFilters(brandDatas) {
    //   this.dialogFilters[1].options = brandDatas.map(brand => {
    //     return { value: brand.id, label: brand.name };
    //   });
    //   this.dialogFilters[1].options.splice(0, 0, {
    //     value: '',
    //     label: '全部'
    //   });
    // },
    // setStoreDialogFilters(storeDatas) {
    //   this.dialogFilters[2].options = storeDatas.map(store => {
    //     return { value: store.id, label: store.name };
    //   });
    //   this.dialogFilters[2].options.splice(0, 0, {
    //     value: '',
    //     label: '全部'
    //   });
    // },
    // getSelectedDialogBrandId() {
    //   return this.dialogFilters[1].value;
    // },
    // getSelectedDialogShopId() {
    //   return this.dialogFilters[2].value;
    // },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '已创建';

        case '1':
          return '已提交';

        case '2':
          return '已上架';

        case '3':
          return '已下架';
        default:
          break;
      }

      return '';
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
    height: 100px;
    width: 100px;
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
.v-bean-hypermarket-mgmt {
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  img {
    height: 100px;
    width: 100px;
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
  .biz-table-filter {
    flex: none;
  }
}
</style>
