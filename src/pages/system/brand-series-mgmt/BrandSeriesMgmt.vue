<template>
  <div class="brand-series-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :filters="filters" :pagination="pagination"
      @filter-data-change="filterDataChange" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :rowKeys="rowKeys">
      <el-table-column width="260" prop="brandDataList" label="品牌">
        <div slot-scope="scope" @click.stop="brandClick(scope.row.id)" style="position: relative;">
          <img :src="scope.row.logo" :onerror="defaultImg" style="width: 50px;height: 50px;vertical-align: middle;margin: 0px 15px 0px 20px;cursor:pointer;"
          />
          <span style="color: #1a1a1a;font-size:12px;">{{ scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column label="系列" prop="brandDataList.series">
        <div slot-scope="scope" style="width:100%">
          <biz-column-table :seriesDataList="scope.row.series" :id="scope.row.id" @addButtonClick="addButtonClick" @seriesIconClick="seriesIconClick"
            @deleteSeries="deleteSeries">
          </biz-column-table>
        </div>
      </el-table-column>
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope">
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
        <BrandBaseInfo ref="brandBaseInfo" :open="openBrand" :id="brandId" @created="refresh" :refreshSign="refreshSign">
        </BrandBaseInfo>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs v-model="tabName_series" :open="openSeries" @close="openSeries = false;">
      <el-tab-pane label="系列信息" name="seriesBaseinfo">
        <SeriesBaseInfo ref="seriesBaseInfo" :open="openSeries" :id="seriesId" :brandId="brandId" @created="refresh" @createdSeriesSuccess="createdSeriesSuccess"
          :refreshSign="refreshSign">
        </SeriesBaseInfo>
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
import BrandSeriesMgmtService from '@/service/system-setting/brand-series-mgmt/brandSeriesMgmt';
import { mapGetters } from 'vuex';

export default {
  name: 'CommodityMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      brandId: '',
      seriesId: '',
      tabName_brand: 'brandBaseinfo',
      tabName_series: 'seriesBaseinfo',
      openBrand: false,
      openSeries: false,
      multipleSelection: [],
      operations: [
        {
          label: '添加品牌',
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
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字',
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
      defaultImg:
        'this.src="' +
        require('../../../assets/images/commodity/pic_default_fail_100.png') +
        '"'
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BrandBaseInfo,
    SeriesBaseInfo,
    BizColumnTable
  },
  created() {
    this.getUser();
    this.refresh();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    rowKeys(row) {
      return row.name + row.fullName;
    },
    refresh() {
      this.getList();
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
          this.tableData = data.brandDataList;
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
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
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
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
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
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
            }
          );
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.openBrand = true;
      this.brandId = '';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
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
      this.seriesId = '';
    },
    seriesIconClick(brandId, id) {
      this.refreshSign = !this.refreshSign;
      this.seriesId = id;
      this.brandId = brandId;
      this.openSeries = true;
    },
    brandClick(id) {
      this.refreshSign = !this.refreshSign;
      this.brandId = id;
      this.openBrand = true;
    },
    createdSeriesSuccess(id) {
      this.seriesId = id;
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
