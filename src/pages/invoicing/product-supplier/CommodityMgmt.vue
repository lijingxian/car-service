<template>
  <div class="commodity-mgmt">
    <biz-flex-table v-loading="loading" ref="table" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @sort-change="handleSortChange" @active-item-change="activeItemChange"
      @cascader-change="cascaderChange">
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
      <el-table-column label="批发价" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">￥{{scope.row.purchasePrice}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRecommend(scope.row.id)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <Product-popup slot="float" :open="open" :id="addId" @close="open = false;addId = '';" :isEdit="isEdit"
      :categoryType="categoryType" @operationSuccess="refresh" :baseInfo="rowBaseInfo"
      @createdProductSuccess="createdProductSuccess"></Product-popup>
    <biz-popup-tabs :open="openimport" v-model="importtabName" @close="openimport = false;">
      <el-tab-pane label="导入商品" name="baseinfo">
        <ImportProduct :open="openimport" @operationSuccess="refresh" ref="openimport" :refreshSign="refreshSign"
          @openPoup="openPoup" @closePoup="closePoup"></ImportProduct>
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
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'CommodityMgmt',
  data() {
    return {
      productCategoryId: '',
      rowBaseInfo: {},
      loading: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      importtabName: 'baseinfo',
      createVehicleTabName: 'createVehicle',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      addId: '',
      categoryType: '',
      open: false,
      isEdit: true,
      openimport: false,
      createVehicle: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
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
          type: ''
        },
        // {
        //   label: '创建整车',
        //   name: 'creat',
        //   type: ''
        // },
        {
          label: '导入',
          name: 'lead',
          type: ''
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
          label: '',
          placeholder: '请输入编号/名称/条码',
          value: ''
        }
      ],
      tableData: [],
      categoryDatas: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      sortInfo: {},
      taskId: '',
      t: '',
      percentage: 0
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
  mounted() {},
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
    refresh() {
      this.getList();
    },
    createdProductSuccess(id, type) {
      this.addId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.addId = row.id;
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
        brandId: this.getSelectedBrandId(),
        searchValue: this.filters[2].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.open !== true && this.openimport !== true && this.createVehicle !== true) {
        this.loading = true;
      }
      http
        .get(invoicing.productMgmt.supplierList, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
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
        brandId: this.getSelectedBrandId(),
        searchValue: this.filters[2].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .post('admin/invoicingProduct/supplierProducts/exportSupplierProductStart.jhtml', params)
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
        let response = await axios.get('admin/invoicingProduct/supplierProducts/exportSupplierProductResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      this.addId = '';
      this.isEdit = true;
      this.open = true;
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
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
      this.operations[1].disabled = true;
      this.operations[3].disabled = true;
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations[1].disabled = false;
        this.operations[3].disabled = false;
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
            }
          );
        })
        .catch(() => {});
    },
    // 批量操作-删除
    deleteList() {
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
    // 查询过滤器
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters(data.brandDatas);
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
    setBrandFilters(brandDatas) {
      this.filters[1].options = brandDatas.map(brand => {
        return { value: brand.id, label: brand.name };
      });
      this.filters[1].options.splice(0, 0, {
        value: '',
        label: '全部'
      });
    },
    getSelectedBrandId() {
      return this.filters[1].value;
    }
  }
};
</script>

<style lang="scss">
.commodity-mgmt {
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
  .biz-table-filter {
    flex: none;
  }
}
</style>
