<template>
  <div class="brand-series-mgmt">
    <biz-flex-table :loading="loading" ref="table" :operations="operations" @operate="operate" :tableData="tableData"
      :filters="filters" :pagination="pagination" @filter-data-change="filterDataChange" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column width="260" prop="Brand" label="品牌">
        <div slot-scope="scope" @click.stop="brandClick(scope.row)" style="position: relative;">
          <img :src="scope.row.logo" :onerror="defaultImg"
            style="width: 50px;height: 50px;vertical-align: middle;margin: 0px 15px 0px 20px;cursor:pointer;" />
          <span style="color: #1a1a1a;font-size:12px;">{{ scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column label="系列" prop="Brand.seriesDataList">
        <div slot-scope="scope" style="width:100%">
          <biz-column-table :seriesDataList="scope.row.seriesDataList" :id="scope.row.id" @addButtonClick="addButtonClick"
            @seriesIconClick="seriesIconClick" @deleteSeries="deleteSeries">
          </biz-column-table>
        </div>
      </el-table-column>
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope" v-if="hasAuthDel">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteCommodity(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="openBrand" v-model="tabName_brand" @close="openBrand = false;">
      <el-tab-pane label="品牌信息" name="brandBaseinfo">
        <BrandBaseInfo ref="brandBaseInfo" :id="brandId" :isEdit="isEdit" @created="refresh" :refreshSign="refreshSign">
        </BrandBaseInfo>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs v-model="tabName_series" :open="openSeries" @close="openSeries = false;">
      <el-tab-pane label="系列信息" name="seriesBaseinfo">
        <SeriesBaseInfo ref="seriesBaseInfo" :id="seriesId" :isEdit="isEdit" :brandId="brandId" @created="refresh"
          :refreshSign="refreshSign">
        </SeriesBaseInfo>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs v-model="tabName" :open="open" @close="open = false;">
      <el-tab-pane label="导入品牌/系列" name="import">
        <ImportBrandSeries ref="import" :open="open" @closePoup="closePoup" @openPoup="openPoup" @operationSuccess="operationSuccess">
        </ImportBrandSeries>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import { BizColumnTable } from '@/components/BizColumnTable';
import BrandBaseInfo from './BrandBaseInfo';
import SeriesBaseInfo from './SeriesBaseInfo';
import ImportBrandSeries from './ImportBrandSeries';
import BrandSeriesMgmtService from '@/service/commodity/brand-series-mgmt/brandSeriesMgmt';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import { global } from '@/common/urls';
export default {
  name: 'CommodityMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      editShopIds: [],
      isEdit: true,
      brandId: '',
      seriesId: '',
      tabName: 'import',
      tabName_brand: 'brandBaseinfo',
      tabName_series: 'seriesBaseinfo',
      openBrand: false,
      openSeries: false,
      open: false,
      multipleSelection: [],
      operations: [
        {
          label: '添加品牌',
          name: 'add',
          type: 'primary',
          auth: ['admin:PurchaseSaleStorage.brand.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: '',
          auth: ['admin:PurchaseSaleStorage.brand.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导入',
          name: 'import',
          type: '',
          auth: ['admin:PurchaseSaleStorage.brand.import']
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入品牌',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      defaultImg: 'this.src="' + require('../../../../assets/images/commodity/pic_default_fail_100.png') + '"'
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BrandBaseInfo,
    SeriesBaseInfo,
    BizColumnTable,
    ImportBrandSeries
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:PurchaseSaleStorage.brand.delete');
      // return true;
    }
  },
  created() {
    this.getUser();
    this.refresh();
    this.getKpi();
    this.getEditableStores();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    import() {
      this.$refs.import.handleImport();
    },
    closePoup() {
      this.open = false;
    },
    openPoup() {
      this.open = true;
    },
    operationSuccess() {
      this.refresh();
    },
    getKpi() {
      http
        .get('/admin/product/queryNavigationKpi.jhtml', {})
        .then(data => {
          let msg = '维护商品所属的品牌信息。已维护品牌' + data.data.shopBrandsCount + '个';
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
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
    getList() {
      let params = {
        searchProperty: 'name',
        searchValue: this.filters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.openBrand !== true && this.openSeries !== true) {
        this.loading = true;
      }
      BrandSeriesMgmtService.getBrandManageList(
        params,
        data => {
          this.tableData = data.Brand;
          // console.log(data);
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
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
          BrandSeriesMgmtService.deleteBrand(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-删除
    deleteCommodity(id) {
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
          BrandSeriesMgmtService.deleteBrand(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 删除系列
    deleteSeries(id) {
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
          BrandSeriesMgmtService.deleteSeries(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.openBrand = true;
      this.$refs.brandBaseInfo.clear();
      this.brandId = '';
    },
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'deleteList') {
          item.disabled = true;
        }
        if (val.length > 0) {
          if (item.name === 'deleteList') {
            item.disabled = false;
          }
        }
      });
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
    typeFilterHandler(value, row) {
      return row.type === value;
    },
    statusFilterHandler(value, row) {
      return row.state === value;
    },
    addButtonClick(id) {
      this.openBrand = false;
      this.openSeries = true;
      this.brandId = id;
      this.$refs.seriesBaseInfo.clear();
      this.seriesId = '';
    },
    seriesIconClick(brandId, id) {
      this.refreshSign = !this.refreshSign;
      this.seriesId = id;
      this.openSeries = true;
    },
    brandClick(row) {
      this.refreshSign = !this.refreshSign;
      this.brandId = row.id;
      this.openBrand = true;
    }
  }
};
</script>

<style lang="scss">
.brand-series-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
