<template>
  <div class="stock-statistics">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :loading="loading" :pagination="pagination"
      :showSummary="true" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" class="stock-statistics" @active-item-change="activeItemChange"
      @cascader-change="cascaderChange">
      <template v-for="(column,index) in cols" v-if="index<=6">
        <el-table-column :key="index" :label="column.name" :prop="column.value" v-if="column.name!=='条码'&&column.name!=='商品信息'"></el-table-column>
        <el-table-column :key="index" :label="column.name"  v-if="column.name==='商品信息'" min-width="160px">
          <div slot-scope="scope">
            <div>{{scope.row.value0}}</div>
            <div>{{scope.row.value1}}</div>
          </div>
        </el-table-column>
      </template>
      <el-table-column label="操作" prop="date">
        <div slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="showMore(scope.row)" v-if="cols.length>7">更多</el-button>
        </div>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="调拨" name="info">
        <alloted-info :open="open" @operationSuccess="refresh" :dataModel="dataModel" :itemId="itemId"></alloted-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openMore" v-model="tabNameMore" @close="openMore = false;">
      <el-tab-pane label="详细库存" name="depotInfo">
        <depot-info ref="depot" :depotName="depotName" :depotItem="depotItem"></depot-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import AllotedInfo from './AllotedInfo';
import DepotInfo from './DepotInfo';
import { BizPopupTabs } from '@/components/BizPopup';
import axios from 'axios';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'StockStatistics',
  data() {
    return {
      loading: false,
      open: false,
      openMore: false,
      selections: [],
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '调拨',
          name: 'alloted',
          disabled: true,
          type: ''
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '商品分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      cols: [],
      categoryDatas: [],
      dataModel: {},
      depotItem: [],
      depotName: [],
      tabName: 'info',
      tabNameMore: 'depotInfo',
      itemId: '',
      productCategoryId: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    AllotedInfo,
    BizPopupTabs,
    DepotInfo,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryFilters();
  },
  watch: {},
  computed: {},
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
    showMore(row) {
      this.tabNameMore = 'depotInfo';
      this.openMore = true;
      let depotName = [];
      let depotItem = [];
      this.cols.forEach((item, index) => {
        if (index > 2) {
          depotName.push(item);
        }
      });
      this.tableData.forEach((list, index) => {
        if (list.productId === row.productId) {
          depotItem.push(list);
        }
      });
      this.depotName = depotName;
      this.depotItem = depotItem;
      this.$nextTick(() => {
        console.log(this.depotItem + '124512');
        this.$refs.depot.getList();
      });
    },
    alloted() {
      this.itemId = this.selections[0].productId;
      this.dataModel = {
        categoryId: this.selections[0].categoryId,
        categoryName: this.selections[0].categoryName,
        depotId: this.selections[0].depotId,
        depotName: this.selections[0].depotName,
        fullName: this.selections[0].productName,
        id: '',
        productId: this.selections[0].productId,
        quantity: '1',
        vin: this.selections[0].vin
      };
      this.open = true;
    },
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.productId);
        });
      }
      let params = {
        ids: ids,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[1].value,
        categoryId: this.productCategoryId
      };
      http
        .post('/admin/invoicing/stock/shopDepotReports/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/stock/shopDepotReports/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.loading = false;
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
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[1].value,
        categoryId: this.productCategoryId
      };
      this.loading = true;
      http
        .get(urls.invoicing.stockStatistics.list, params)
        .then(data => {
          this.tableData = data.dataList;
          this.cols = data.dataNameList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
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
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.getList();
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
      this.selections = val;
      this.operations[2].disabled = true;
      if (val.length === 1) {
        this.operations[2].disabled = false;
      }
    },
    filterDataChange(filters) {
      this.filters = filters;
      this.pagination.currentPage = 1;
      this.refresh();
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
.purchase-statistics {
  .biz-input {
    width: 220px;
  }
}
.purchase-statistics {
  .tel-style {
    color: #ff7300;
    cursor: pointer;
  }
  .operate-container {
    margin-left: 10px;
  }
  .row {
    padding: 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-date-editor {
    width: 210px;
  }
  .info-bottom {
    display: flex;
    justify-content: space-between;
  }
  .price-info {
    width: 120px;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .titleMember {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
