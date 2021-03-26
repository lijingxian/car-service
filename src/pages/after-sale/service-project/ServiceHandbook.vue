<template>
  <biz-grid class="service-handbook">
    <div slot="top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange" :views="views" @onSwitch="onViewSwitch">
        <template slot="operation" v-if="getUser().roleLevel !== 'shop' && isPlateForm">
          <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
            :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
            :showProcess="showProcess" :action="'/admin/baseData/importBooklet.jhtml'" :name="'uFile'" @handle-import="handleImport"
            style="margin-left: 10px;" ref="importFile">
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
      </biz-header>
      <div class="toggle-btn" @click="isShow">
        {{ toggleRecommendTxt }}
        <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <handbook-list-view
        v-if="this.activedView==='list'"
        @deleteLine="deleteLine"
        :cardList="cardList"
        @created="refresh"
        @rowClick="rowClick"
        @handleSelectionChange="handleSelectionChange"
      ></handbook-list-view>
      <handbook-card-view v-show="this.activedView==='card'" @deleteLine="deleteLine" :cardList="cardList" @rowClick="rowClick" @created="refresh"></handbook-card-view>
    </div>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <div slot="float">
      <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
        <el-tab-pane label="基本信息" name="first">
          <service-handbook-item :itemId="itemId" ref="item" @created="refresh"></service-handbook-item>
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="product">
          <service-handbook-product :itemId="itemId" ref="product" @created="refresh"></service-handbook-product>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openImport" v-model="tabImport" @close="openImport = false;">
        <el-tab-pane label="导入保养手册" name="import">
          <service-import ref="item" @created="importSuccess"></service-import>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import serviceProjectService from '@/service/maintenance/serviceProject';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import ServiceHandbookItem from './ServiceHandbookItem';
import ServiceHandbookProduct from './ServiceHandbookProduct';
import HandbookListView from './HandbookListView';
import HandbookCardView from './HandbookCardView';
import ServiceImport from './ServiceImport';
import urls from '@/common/urls';
import { ImportFile } from '@/components/BizUpload';
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
      showRecommend: false,
      urls: urls,
      importResult: [],
      tableData: [],
      cardList: [],
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
          disabled: true,
          label: '删除',
          name: 'delete',
          type: '',
          auth: ['admin:aftersale.booklet.delete']
        }
      ],
      filters: [
        {
          type: 'select',
          label: '品牌',
          name: 'brand',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '系列',
          name: 'series',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '车型',
          name: 'carType',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入品牌/系列/商品名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      views: [
        {
          actived: false,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'card',
          title: '卡片视图'
        },
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        }
      ]
    };
  },
  components: {
    BizPopupTabs,
    ServiceHandbookItem,
    ServiceHandbookProduct,
    BizGrid,
    BizHeader,
    BizPagination,
    HandbookListView,
    HandbookCardView,
    ServiceImport,
    ImportFile
  },
  created() {
    this.handleImport();
    if ((this.getUser().roleLevel === 'shop' && this.operations[0].label !== '平台导入' && this.hasAuthImport) || window.top.SHOP_ID) {
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
    filters0(newValue, oldValue) {
      this.filters[1].value = '';
      this.filters[1].options = [{ label: '全部', value: '' }];
      this.filters[2].options = [{ label: '全部', value: '' }];
    },
    filters1(newValue, oldValue) {
      this.filters[2].value = '';
      this.filters[2].options = [{ label: '全部', value: '' }];
    }
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthImport() {
      // return true;
      return this.currentAuth.includes('admin:aftersale.booklet.import');
    },
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    },
    filters0() {
      return this.filters[0].value;
    },
    filters1() {
      return this.filters[1].value;
    },
    isPlateForm() {
      return !window.top.SHOP_ID;
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    add() {
      this.open = true;
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
    onViewSwitch(name) {
      this.multipleSelection = [];
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
          if (view.name !== 'list') {
            this.operations.map(item => {
              if (item.name === 'delete') {
                item.disabled = true;
              }
            });
          }
        }
      }
    },
    importSuccess() {
      if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
        this.baseShopData('0');
      } else {
        this.baseData('0');
      }
      this.openImport = false;
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
          seriesId: seriesId,
          shopId: window.top.SHOP_ID || ''
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
      serviceProjectService.queryImportProgress(
        { shopId: window.top.SHOP_ID },
        data => {
          if (data.data && data.data.rate && data.data.rate !== '100') {
            this.$refs.item.handleImport();
            this.$refs.item.uploadingVisible = true;
            this.$refs.item.showCurrentInfo = true;
          } else {
            this.openImport = true;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    deleteLine(row) {
      if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          serviceProjectService.deleteServiceHandbook(
            { ids: [row.id] },
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
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.loading = true;
            serviceProjectService.maintainBookletDelete(
              { ids: [row.id] },
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
      }
    },
    delete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一条数据');
        return false;
      }
      if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
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
      if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
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
          this.cardList = data.dataList;
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
        searchValue: this.filters[3].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      this.loading = true;
      serviceProjectService.getServiceHandbookList(
        params,
        data => {
          this.cardList = data.dataList;
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
      if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
        this.operations[1].disabled = true;
        if (val.length > 0) {
          this.operations[1].disabled = false;
        }
      } else {
        this.operations[0].disabled = true;
        if (val.length > 0) {
          this.operations[0].disabled = false;
        }
      }
      this.multipleSelection = val;
    },
    filterDataChange(filters) {
      if (filters[0].value) {
        if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
          this.baseShopData('1', this.filters[0].value);
        } else {
          this.baseData('1', this.filters[0].value);
        }
      }
      if (filters[1].value) {
        if (this.getUser().roleLevel === 'shop' || window.top.SHOP_ID) {
          this.baseShopData('2', this.filters[0].value, this.filters[1].value);
        } else {
          this.baseData('2', this.filters[0].value, this.filters[1].value);
        }
      }
      // }

      this.refresh();
    },
    rowClick(row) {
      this.tabName = 'first';
      this.open = true;
      this.$nextTick(() => {
        this.itemId = String(row.id);
      });
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
  .biz-input {
    position: absolute;
    top: 15px;
    right: 125px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 80px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap:last-child .el-select {
    width: 240px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: none;
    margin-top: 5px;
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
    margin-top: 5px;
  }
  .biz-header .biz-header__filter-wrapper .biz-header__switch {
    position: absolute;
    top: 14px;
    right: 30px;
  }
  .biz-popup .popup-content {
    width: 700px;
  }
  .line-break {
    display: -webkit-box !important;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
