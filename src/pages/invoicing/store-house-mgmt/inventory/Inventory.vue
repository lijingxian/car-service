<template>
  <div class="inventory-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :loading="loading" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" class="inventory-mgmt-tabel" @closeDialogFilter="closeDialogFilter">
      <el-table-column label="单据" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate}}</div>
            <div class="overflow">状态：
              <span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="仓库" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.depotName?scope.row.depotName:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="盘点人" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.creatorName?scope.row.creatorName:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="盘点" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">盘点商品种类：{{scope.row.productAmount?scope.row.productAmount:'--'}}</div>
            <div class="overflow">已盘点商品种类：{{scope.row.inventoryProductAmount?scope.row.inventoryProductAmount:'--'}}</div>
            <div class="overflow">盈亏数量：{{scope.row.profit?scope.row.profit:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" v-if="scope.row.state==='1'&&hasAuthAdjust" @click.stop="dataChange(scope.row)">调整
            </el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='0'&&hasAuthComfirm"
              @click.stop="statusChange(scope.row,'0')">完成</el-button>
            <el-button type="text" size="mini" v-if="scope.row.state==='0'&&hasAuthDel"
              @click.stop="deleteApply($event,scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click.stop="printApply(scope.row)">凭证</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <base-info :itemId="itemId" :isEdit="isEdit" ref="baseInfo" @operationSuccess="createdSuccess"></base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo" v-if="isCreate">
        <product-info :itemId="itemId" :isEdit="isEdit" ref="productinfo" @operationSuccess="refresh"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openModify" @close="openModify=false" v-model="isButtonClick">
      <el-tab-pane label="调整信息" name="modifyinfo">
        <modify-info :itemId="itemId" :isEdit="isEdit" ref="modifyinfo" @operationSuccess="operationSuccess"></modify-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <el-dialog :visible.sync="dialogTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
            <el-button type="primary" @click="exportInvoice" size="mini">导出</el-button>
          </div>
        </el-col>
      </el-row>

      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">仓库：{{form.depotName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建人：{{form.creatorName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">状态：{{form.state}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">备注：{{form.remark}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">盘点商品总数：{{form.inventoryProductAmount}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">盈亏总数：{{form.profit}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class" show-summary>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column property="productName" label="商品">
              <template slot-scope="scope">{{scope.row.productName}}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="商品条码"></el-table-column>
            <el-table-column property="amount" label="在库数量"></el-table-column>
            <el-table-column property="inventoryAmount" label="盘点数量"></el-table-column>
            <el-table-column property="profit" label="盈亏"></el-table-column>
          </el-table>
        </div>
      </vue-easy-print>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import { ExportFileNew } from '@/components/BizUpload';
import BaseInfo from './BaseInfo';
import ProductInfo from './ProductInfo';
import ModifyInfo from './ModifyInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import urls from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'InventoryMgmtList',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      title: '',
      handler: '',
      isEdit: true,
      isCreate: false,
      isButtonClick: 'modifyinfo',
      openModify: false,
      form: {},
      loading: false,
      visiable: false,
      open: false,
      showRecommend: false,
      dialogTableVisible: false,
      selections: [],
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:check.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:check.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
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
          type: 'checkBox',
          label: '盘点仓库',
          name: 'depot',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          showMore: true
        },
        {
          type: 'checkBox',
          label: '订单状态',
          name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '盈亏状态',
          name: 'depotState',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '平库' },
            { value: '1', label: '盘盈' },
            { value: '2', label: '盘亏' }
          ]
        },
        {
          type: 'checkBox',
          label: '盘点人员',
          name: 'people',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          showMore: false
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入盘点单号',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      gridData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    vueEasyPrint,
    ProductInfo,
    ModifyInfo,
    ExportFileNew
  },
  created() {
    this.getList();
    this.queryKpi();
    this.queryFilters();
  },
  watch: {},
  mixins: [ColumnsMixin],
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthComfirm() {
      return this.currentAuth.includes('admin:check.comfirm');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:check.delete');
      // return true;
    },
    hasAuthAdjust() {
      return this.currentAuth.includes('admin:check.adjust');
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
    closeDialogFilter(filter) {
      console.log(11);
      this.filters.map(item => {
        if (item.label === filter.label) {
          item.options = filter.options;
        }
      });
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    operationSuccess(val) {
      this.refresh();
      this.itemId = '';
    },
    createdSuccess(id) {
      if (id) {
        this.itemId = String(id);
        this.tabName = 'productinfo';
        this.isCreate = true;
        this.refresh();
        this.$nextTick(() => {
          this.$refs.productinfo.refresh();
        });
      } else {
        this.refresh();
      }
    },
    refresh() {
      this.getList();
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    statusChange(model, state) {
      let flag = false;
      model.itemDatas.map(item => {
        if (!item.inventoryAmount) {
          this.$message.warning('请完成盘点后再点击完成');
          flag = true;
        }
      });
      if (flag) {
        return;
      }
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          shopId: window.top.SHOP_ID || '',
          id: model.id,
          actionType: state
        };
        http
          .get(urls.invoicing.inventory.state, params)
          .then(data => {
            this.$message.success('操作成功！');
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {});
      });
    },
    deleteApply(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    // 删除
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete(urls.invoicing.inventory.inventory, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    printApply(row) {
      let params = {
        id: row.id
      };
      http
        .get(urls.invoicing.inventory.print, params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop.name + '盘点单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '盘点中';
          } else if (this.form.state === '1') {
            this.form.state = '盘点完成';
          } else if (this.form.state === '2') {
            this.form.state = '已调整';
          } else {
          }
          this.gridData = data.data.itemDatas;
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
    print() {
      this.$refs.easyPrint.print();
    },
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[4].value
        },
        shopId: window.top.SHOP_ID || this.getUser().shop.id,
        depotIds: this.filters[0].value,
        userIds: this.filters[3].value,
        states: this.filters[1].value,
        depotStates: this.filters[2].value
      };
      http
        .post('/admin/invoicing/stock/depotInventory/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/stock/depotInventory/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    async exportInvoice() {
      let params = {
        id: this.form.id
      };
      try {
        let response = await axios.post('/admin/invoicing/stock/voucher/depotInventory/export.jhtml', params, {
          responseType: 'blob'
        });
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
    add() {
      this.tabName = 'info';
      this.open = true;
      this.isCreate = false;
      this.itemId = '';
      this.isEdit = true;
      this.$refs.baseInfo.resetModel();
    },
    rowClick(model, e, column) {
      this.tabName = 'info';
      this.open = true;
      this.isCreate = true;
      this.$nextTick(() => {
        this.itemId = model.id;
      });
      if (model.state === '0') {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    dataChange(row) {
      this.itemId = row.id;
      this.isButtonClick = 'modifyinfo';
      this.openModify = true;

      this.$nextTick(() => {
        this.$refs.modifyinfo.refresh(row.id);
      });
    },
    getList() {
      let params = {
        pageable: {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.currentPage,
          searchValue: this.filters[4].value
        },
        shopId: window.top.SHOP_ID || this.getUser().shop.id,
        depotIds: this.filters[0].value,
        userIds: this.filters[3].value,
        states: this.filters[1].value,
        depotStates: this.filters[2].value
      };
      this.loading = true;
      http
        .post(urls.invoicing.inventory.list, params)
        .then(data => {
          console.log(data);
          this.tableData = data.dataList;
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
    queryKpi() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/invoicing/stock/queryShopDepotInventoriesKpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待完成${data.data.processing}条`,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryFilters() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.inventory.queryFilters, params)
        .then(data => {
          this.filters[0].options = data.depotList.map(item => {
            return { label: item.name, value: item.id };
          });
          this.filters[3].options = data.creatorList.map(item => {
            return { label: item.name, value: item.id };
          });
          this.filters[1].options = data.stateList.map(item => {
            return { label: item.name, value: item.id };
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    stateColor(row) {
      if (row.state === '1' || row.state === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '盘点中';
        case '1':
          return '盘点完成';
        case '2':
          return '已调整';
        default:
          return '--';
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        });
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
.grid18 {
  height: 20px;
}
.close-order-dialog {
  width: 500px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 260px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
}
.d-p-wrap {
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
}
.inventory-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.inventory-mgmt {
  .biz-popup .popup-content {
    width: 600px;
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
  .product-info {
    margin: 5px 0px;
    width: 100%;
    .wrapper {
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 160px;
        white-space: nowrap;
        display: flex;
      }
    }
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
