<template>
  <div class="service-handbook">
    <biz-flex-table :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :filters="filters" @filter-data-change="filterDataChange">
      <template slot="operation" v-if="getUser().roleLevel !== 'shop'">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey" :showProcess="showProcess"
          :action="'/admin/baseData/importBooklet.jhtml'" :name="'uFile'" @handle-import="handleImport" style="margin-left: 10px;"
          ref="importFile">
          <el-table-column label="编号" width="50" prop="row">
          </el-table-column>
          <el-table-column label="状态" width="150" prop="result">
            <template slot-scope="scope">
              {{scope.row.result?scope.row.result:'--'}}
            </template>
          </el-table-column>
          <el-table-column label="信息" prop="message">
            <template slot-scope="scope">
              {{scope.row.message?scope.row.message:'--'}}
            </template>
          </el-table-column>
        </import-file>
      </template>
      <el-table-column label="品牌" prop="brand" width="150px">
        <template slot-scope="scope">
          {{scope.row.brand?scope.row.brand:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="系列" prop="series" width="150px">
        <template slot-scope="scope">
          {{scope.row.series?scope.row.series:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="车型" prop="carType">
        <template slot-scope="scope">
          {{scope.row.carType?scope.row.carType:'--'}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="名称" prop="name">
      </el-table-column> -->
      <!-- <el-table-column label="推荐项目" v-if="isShop">
        <div slot-scope="scope">
          <div class="biz-interval" v-for="(productList,index) in scope.row.productList" :key="index">
            {{productList.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="推荐项目" v-if="!isShop">
        <div slot-scope="scope">
          <div class="biz-interval" v-for="(item,index) in scope.row.item" :key="index">
            {{item.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="推荐价格" prop="cost">
      </el-table-column> -->
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="first">
        <service-handbook-item-sys :itemId="itemId" ref="itemInfo" @created="refresh">
        </service-handbook-item-sys>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openImport" v-model="tabImport" @close="openImport = false;">
      <el-tab-pane label="导入保养手册" name="import">
        <service-import ref="item" @created="importSuccess">
        </service-import>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizPopupTabs } from '@/components/BizPopup';
import ServiceHandbookItemSys from './ServiceHandbookItemSys';
import ServiceImport from './ServiceImport';
import { BizFlexTable } from '@/components/BizTable';
import { ImportFile } from '@/components/BizUpload';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';

export default {
  name: 'ServiceHandbook',
  data() {
    return {
      total: 0,
      count: 0,
      percentage: 0,
      stepkey: '',
      loading: false,
      disabled: false,
      importLoading: false,
      showProcess: false,
      isShop: true,
      urls: urls,
      importResult: [],
      tableData: [],
      itemId: '',
      t: '',
      type: '',
      tabName: 'first',
      tabImport: 'import',
      tags: [],
      open: false,
      openImport: false,
      dialogVisible: false,
      multipleSelection: [],
      brandId: '',
      seriesId: '',
      modeList: '',
      serviceList: [],
      serviceHandbookList: [],
      operations: [
        {
          disabled: false,
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '品牌',
          name: 'brand',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '系列',
          name: 'series',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '车型',
          name: 'carType',
          value: '',
          options: []
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
    BizPopupTabs,
    ServiceHandbookItemSys,
    BizFlexTable,
    ImportFile,
    ServiceImport
  },
  created() {
    this.handleImport();
    if (this.getUser().roleLevel === 'shop' && this.operations[0].label !== '平台导入') {
      this.isShop = true;
      this.getServiceHandbookList();
      // this.queryBrandList();
      this.baseShopData('0');
      this.operations.unshift({
        label: '平台导入',
        name: 'sysImport',
        type: 'primary'
      });
    } else {
      this.isShop = false;
      this.listMaintainBooklet();
      this.baseData('0');
    }
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  watch: {
    $route(to, from) {
      this.refresh();
      this.handleImport();
    },
    filters: {
      handler(newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i].value !== newValue[i].value) {
            console.log(newValue);
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    add() {
      this.itemId = '';
      this.open = true;
      this.$refs.itemInfo.setDefaultModel();
    },
    importSuccess() {
      if (this.getUser().roleLevel === 'shop') {
        this.baseShopData('0');
      } else {
        this.baseData('0');
      }
      this.refresh();
    },
    baseData(type, brandId, seriesId) {
      serviceProjectService.bookletbaseData(
        {
          type: type,
          brandId: brandId,
          seriesId: seriesId
        },
        data => {
          if (type === '0') {
            this.filters[0].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
            this.filters[1].value = '';
            this.filters[2].value = '';
          }
          if (type === '1') {
            this.filters[1].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
          }
          if (type === '2') {
            this.filters[2].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    baseShopData(type, brandId, seriesId) {
      serviceProjectService.bookletShopData(
        {
          type: type,
          brandId: brandId,
          seriesId: seriesId
        },
        data => {
          if (type === '0') {
            this.filters[0].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
            this.filters[1].value = '';
            this.filters[2].value = '';
          }
          if (type === '1') {
            this.filters[1].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
          }
          if (type === '2') {
            this.filters[2].options = [{ label: '全部', value: '' }].concat(
              data.dataList.map(item => {
                return { label: item.name, value: item.id };
              })
            );
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryBrandList() {
      serviceProjectService.queryBrandList(
        {},
        data => {
          this.filters[0].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(val) {
      serviceProjectService.querySeriesList(
        { brandId: val },
        data => {
          this.filters[1].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryModeList(val) {
      serviceProjectService.listCarType(
        { seriesId: val, brandId: this.filters[0].value },
        data => {
          this.filters[2].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    sysImport() {
      this.openImport = true;
    },
    delete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一条数据');
        return false;
      }
      if (this.getUser().roleLevel === 'shop') {
        this.deleteOperate();
      } else {
        this.deleteSys();
      }
    },
    deleteSys() {
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
          this.loading = true;
          serviceProjectService.maintainBookletDelete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loading = false;
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        })
        .catch(() => {});
    },
    deleteOperate() {
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
          this.loading = true;
          serviceProjectService.deleteServiceHandbook(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loading = false;
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.loading = false;
            }
          );
        })
        .catch(() => {});
    },
    refresh() {
      this.open = false;
      this.itemId = '';
      if (this.getUser().roleLevel === 'shop') {
        this.getServiceHandbookList();
      } else {
        this.listMaintainBooklet();
      }
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      serviceProjectService.queryImportBaseProgress(
        {},
        data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          } else {
            this.$refs.importFile.uploadingVisible = false;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.$refs.importFile.uploadingVisible = false;
        }
      );
    },
    listMaintainBooklet() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        brand: this.filters[0].value,
        series: this.filters[1].value,
        carType: this.filters[2].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      this.loading = true;
      serviceProjectService.listMaintainBooklet(
        params,
        data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    getServiceHandbookList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        brand: this.filters[0].value,
        series: this.filters[1].value,
        carType: this.filters[2].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      this.loading = true;
      serviceProjectService.getServiceHandbookList(
        params,
        data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    handleSelectionChange(val) {
      if (this.getUser().roleLevel === 'shop') {
        this.operations[2].disabled = true;
        if (val.length > 0) {
          this.operations[2].disabled = false;
        }
      } else {
        this.operations[1].disabled = true;
        if (val.length > 0) {
          this.operations[1].disabled = false;
        }
      }
      this.multipleSelection = val;
    },
    filterDataChange(filters) {
      if (filters[0].value) {
        if (this.getUser().roleLevel === 'shop') {
          this.baseShopData('1', this.filters[0].value);
        } else {
          this.baseData('1', this.filters[0].value);
        }
      }
      if (filters[1].value) {
        if (this.getUser().roleLevel === 'shop') {
          this.baseShopData('2', this.filters[0].value, this.filters[1].value);
        } else {
          this.baseData('2', this.filters[0].value, this.filters[1].value);
        }
      }
      // }

      this.refresh();
    },
    rowClick(row) {
      this.open = true;
      this.itemId = String(row.id);
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
.service-handbook {
  .checked {
    margin-left: 60px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #ff7300;
  }
  .biz-popup .popup-content {
    width: 700px;
  }
}
</style>
