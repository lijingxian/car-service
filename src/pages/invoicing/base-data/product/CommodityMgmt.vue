<template>
  <div class="commodity-mgmt-base-data">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
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
      <el-table-column label="商品" min-width="220px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div  class="product-info-content">
                  <img v-if="scope.row.image&&scope.row.image!==' '" :src="scope.row.image" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="scope.row.fullName">{{scope.row.fullName}}</div>
                    <div class="overflow">{{scope.row.barCode}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" min-width="80px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.categoryName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购价(含税)" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.purchaseNewPrice?scope.row.purchaseNewPrice:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="销售价(含税)" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">零售价：￥{{ scope.row.price}}</div>
            <div>一级代理价：{{scope.row.wholesalePrice?'￥'+scope.row.wholesalePrice:'--'}}</div>
            <div>二级代理价：{{scope.row.agent2Price?'￥'+scope.row.agent2Price:'--'}}</div>
            <div>三级代理价：{{scope.row.agent3Price?'￥'+scope.row.agent3Price:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="在库库存" min-width="60px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{ scope.row.realStock }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="60px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow" :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" v-if="hasAuthOff&&scope.row.state==='2'" size="mini" @click.stop="soldout(scope.row)">下架</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="hasAuthOn&&(scope.row.state==='0' || scope.row.state==='3')"
              @click.stop="putaway(scope.row)"
            >上架</el-button>
            <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="deleteRecommend(scope.row.id)">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <Product-popup
      slot="float"
      :open="open"
      :itemId="itemId"
      :categoryId="categoryId"
      :categoryType="categoryType"
      @close="open = false;itemId = '';"
      :isEdit="isEdit"
      @operationSuccess="refresh"
      :baseInfo="rowBaseInfo"
      @createdProductSuccess="createdProductSuccess"
    ></Product-popup>
    <biz-popup-tabs :open="openimport" v-model="importtabName" @close="openimport = false;">
      <el-tab-pane label="导入商品" name="baseinfo">
        <ImportProduct
          :open="openimport"
          @operationSuccess="refresh"
          :refreshSign="refreshSign"
          ref="openimport"
          @openPoup="openPoup"
          @closePoup="closePoup"
        ></ImportProduct>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="createVehicle" v-model="createVehicleTabName" @close="createVehicle = false;">
      <el-tab-pane label="创建整车" name="createVehicle">
        <CreateVehicle :open="createVehicle" @operationSuccess="refresh"></CreateVehicle>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import ImportProduct from './ImportProduct';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import { mapGetters } from 'vuex';
import ProductPopup from './ProductPopup';
import { BizPopupTabs } from '@/components/BizPopup';
import CreateVehicle from './CreateVehicle';
import { global, invoicing } from '@/common/urls';
import http from '@/common/http';
import axios from 'axios';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'CommodityMgmt',
  data() {
    return {
      productCategoryId: '',
      categoryId: '',
      rowBaseInfo: {},
      loading: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      importtabName: 'baseinfo',
      createVehicleTabName: 'createVehicle',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      itemId: '',
      categoryType: '',
      purchasePrice: '',
      maxPrice: '',
      minPrice: '',
      open: false,
      isEdit: true,
      openimport: false,
      taskId: '',
      t: '',
      percentage: 0,
      createVehicle: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:PurchaseSaleStorage.product.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: '',
          auth: ['admin:PurchaseSaleStorage.product.delete']
        },
        {
          disabled: true,
          label: '批量上架',
          name: 'putawayAll',
          type: '',
          auth: ['admin:PurchaseSaleStorage.product.on']
        },
        {
          disabled: true,
          label: '批量下架',
          name: 'soldoutAll',
          type: '',
          auth: ['admin:PurchaseSaleStorage.product.off']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          disabled: true,
          label: '克隆',
          name: 'clone',
          type: '',
          auth: ['admin:PurchaseSaleStorage.product.copy']
        },
        // {
        //   label: '创建整车',
        //   name: 'creat',
        //   type: ''
        // },
        {
          label: '导入',
          name: 'lead',
          type: '',
          auth: ['admin:PurchaseSaleStorage.product.import']
        },
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          class: 'hidden',
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '供应商',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          // name: 'state',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '已创建', value: '0' },
            // { label: '已提交', value: '1' },//32275 WEB：进销存，商品基础数据，商品状态筛选去掉已提交
            { label: '已上架', value: '2' },
            { label: '已下架', value: '3' }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入编号/名称/条码',
          value: ''
        }
      ],
      tableData: [],
      showRecommend: false,
      categoryDatas: [],
      supplierDatas: [],
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
    ProductPopup,
    BizFlexTable,
    ImportProduct,
    BizPopupTabs,
    CreateVehicle,
    ExportFileNew
  },
  created() {
    this.getUser();
    this.refresh();
    this.queryFilters();
    this.querySupplier();
    this.getEditableStores();
    this.getDefalutImg();
    let msg = '维护店铺商品，编辑商品基本信息、详情、商品图片以及商品规格、属性等';
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: msg,
      duration: 3000
    });
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthOn() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.product.on');
      // return true;
    },
    hasAuthOff() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.product.off');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.product.delete');
      // return true;
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mounted() {
    this.filters[0].value = [''];
  },
  mixins: [ColumnsMixin],
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    soldoutAll() {
      this.$confirm('是否确认下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        for (const iterator of this.multipleSelection) {
          ids.push(iterator.id);
        }
        let params = {
          ids: ids,
          state: 'false'
        };
        http
          .post('/admin/invoicingProduct/updateMarketableState.jhtml', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '下架成功!'
            });
            this.refresh();
          })
          .catch(errData => {
            this.$message.warning(errData.errorMessage);
          });
      });
    },
    putawayAll() {
      this.$confirm('是否确认上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids,
            state: 'true'
          };
          http
            .post('/admin/invoicingProduct/updateMarketableState.jhtml', params)
            .then(data => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.refresh();
            })
            .catch(errData => {
              this.$message.warning(errData.errorMessage);
            });
        })
        .catch(() => {});
    },
    soldout(row) {
      this.$confirm('是否确认下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          if (row.id) {
            ids.push(row.id);
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
    putaway(row) {
      this.$confirm('是否确认上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (row.wholesalePrice && row.price) {
            let ids = [];
            if (row.id) {
              ids.push(row.id);
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
          } else {
            this.$message.warning('商品信息不完整，请完善商品信息后进行上架操作！');
          }
        })
        .catch(() => {});
    },
    refresh() {
      this.getList();
    },
    createdProductSuccess(id, type) {
      this.itemId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.itemId = row.id;
      this.categoryId = row.categoryId;
      this.categoryType = row.categoryType;
      this.rowBaseInfo = row;
      this.open = true;
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
        supplierId: this.getSupplierId(),
        state: this.filters[2].value,
        searchValue: this.filters[3].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.open !== true && this.openimport !== true && this.createVehicle !== true) {
        this.loading = true;
      }
      http
        .get(invoicing.productMgmt.list, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.purchasePrice = '';
          this.tableData.forEach((item, index) => {
            if (item.purchasePrices && item.purchasePrices.length > 1) {
              let purchaseArr = [];
              item.purchasePrices.forEach(purchase => {
                purchaseArr.push(Number(purchase.price));
              });
              item.maxPrice = Math.max(...purchaseArr).toFixed(2);
              item.minPrice = Math.min(...purchaseArr).toFixed(2);
              if (item.maxPrice === item.minPrice) {
                item.purchaseNewPrice = item.maxPrice;
              } else {
                item.purchaseNewPrice = item.minPrice + '-' + item.maxPrice;
              }
            } else {
              item.purchaseNewPrice = item.purchasePrice;
            }
          });
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
    exportStart() {
      let ids = [];
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        productCategoryId: this.productCategoryId,
        supplierId: this.getSupplierId(),
        state: this.filters[2].value,
        searchValue: this.filters[3].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .post('/admin/invoicingProduct/storeProducts/exportStockCenterProductStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/invoicingProduct/storeProducts/exportStockCenterProductResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    lead() {
      this.$refs.openimport.handleImportCar();
    },
    openPoup() {
      this.openimport = true;
    },
    closePoup() {
      this.openimport = false;
    },
    creat() {
      this.createVehicle = true;
    },
    add() {
      this.itemId = '';
      this.isEdit = true;
      this.open = true;
    },
    cascaderChange(val) {
      this.pagination.currentPage = 1;
      if (val.length === 0) {
        this.filters[0].value = [''];
        this.productCategoryId = '';
      } else {
        this.productCategoryId = val[val.length - 1];
        if (val.length > 1 && this.productCategoryId === '') {
          this.productCategoryId = val[val.length - 2];
        }
      }
      this.refresh();
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
      this.operations.map(item => {
        if (item.name === 'delete' || item.name === 'putawayAll' || item.name === 'soldoutAll' || item.name === 'clone') {
          item.disabled = true;
        }
      });
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations.map(item => {
          if (item.name === 'delete' || item.name === 'putawayAll' || item.name === 'soldoutAll' || item.name === 'clone') {
            item.disabled = false;
          }
        });
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
    // 快捷操作-删除
    deleteRecommend(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          CommodityMgmtService.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
    // 批量操作-删除
    delete() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids
          };
          CommodityMgmtService.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
    // 批量操作-克隆
    clone() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      let params = {
        ids: ids
      };
      CommodityMgmtService.cloneProduct(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '克隆成功!'
          });
          this.refresh();
        },
        ErrorData => {
          console.log(ErrorData);
          this.$message.error(ErrorData.errorMessage);
        }
      );
    },
    querySupplier() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        searchValue: this.filters[0].value,
        state: ''
      };
      http
        .get(invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.loading = false;
          this.supplierDatas = data.dataList;
          this.setSupplierDatas();
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
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
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
    setSupplierDatas() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];
      this.supplierDatas.forEach(supplier => {
        options.push({ value: supplier.id, label: supplier.name });
      });

      this.filters[1].options = options;
    },
    getSupplierId() {
      return this.filters[1].value;
    },
    stateColor(row) {
      if (row.state === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
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
.commodity-mgmt-base-data {
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
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100px;
        white-space: nowrap;
      }
    }
  }
  .selection-column {
    text-align: center;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
