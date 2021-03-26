<template>
  <div class="invoice-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @closeDialogFilter = "closeDialogFilter" class="invoice-mgmt-tabel">
      <el-table-column label="订单" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              发票号码：{{scope.row.invoiceNum||'--'}}
            </div>
            <div class="overflow">
              发票代码：{{scope.row.invoiceCode||'--'}}
            </div>
            <div class="overflow">
              开票日期：{{scope.row.invoiceDate||'--'}}
            </div>
            <div>状态：<span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              类别：{{getCategory(scope.row)}}
            </div>
            <div class="overflow">
              发票类型：{{getType(scope.row)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="购销方" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              购买方：{{scope.row.buyerName}}
            </div>
            <div class="overflow">
              销售方：{{scope.row.sellerName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              不含税：{{scope.row.priceWithoutTax}}
            </div>
            <div class="overflow">
              税额：{{scope.row.tax}}
            </div>
            <div class="overflow">
              含税：{{scope.row.price}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="80">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" v-if="scope.row.state==='0'"
              @click.stop="statusChange(scope.row,'3')">确认</el-button>
            <el-button type="text" size="mini"
              @click.stop="deleteApply($event,scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click.stop="printApply(scope.row)">凭证</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="openAdd" @close="openAdd=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="addinfo">
        <base-info ref="step1Info" :backForm="backForm" :itemId="itemId" @operationSuccess="operationSuccess"></base-info>
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
              <div class="grid-content bg-purple">发票代码：{{form.invoiceCode}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">发票号码：{{form.invoiceNum}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">发票类型：{{form.type}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">发票类别：{{form.category}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">购买方：{{form.buyerName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">销售方：{{form.sellerName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">开票日期：{{form.invoiceDate}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建者：{{form.creatorName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">状态：{{form.state}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class" show-summary size="small">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="订单编号">
              <template slot-scope="scope">{{scope.row.orderSn}}</template>
            </el-table-column>
            <el-table-column property="name" label="商品名称" min-width="200">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="条码"></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="price" label="不含税单价"></el-table-column>
            <el-table-column property="" label="不含税金额"></el-table-column>
            <el-table-column property="" label="税率"></el-table-column>
            <el-table-column property="tax" label="税额"></el-table-column>
            <el-table-column property="priceWithTax" label="含税单价"></el-table-column>
            <el-table-column property="" label="含税金额"></el-table-column>
          </el-table>
           <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './BaseInfo';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'PurchaseApplyMgmtList',
  data() {
    return {
      tabName: 'addinfo',
      tabNameInfo: 'info',
      itemId: { id: '' },
      remarks: '',
      title: '',
      showRecommend: false,
      isEdit: true,
      isPend: false,
      returnId: '',
      auditState: '1',
      form: {},
      formData: {},
      backForm: {},
      row: {},
      loading: false,
      open: false,
      openAdd: false,
      dialogTableVisible: false,
      step1: true,
      step2: false,
      showCloseOrder: false,
      showPassOrder: false,
      selections: [],
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          class: 'show',
          auth: ['admin:finance.invoice.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:finance.invoice.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '导出',
          name: 'exportStart',
          type: '',
          auth: ['admin:finance.invoice.export']
        }
      ],
      filters: [
        {
          type: 'select',
          label: '发票类别',
          name: 'supplier',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '采购发票', value: '0' },
            { label: '销售发票', value: '1' }
          ]
        },
        {
          type: 'select',
          label: '发票类型',
          name: 'people',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '个人', value: '0' },
            { label: '增值税普通发票', value: '1' },
            { label: '增值税专用发票', value: '2' }
          ]
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '未确认', value: '0' },
            { label: '已确认', value: '1' }
          ]
        },
        {
          type: 'daterange',
          label: '开票日期',
          name: 'publishDate',
          class: 'hidden',
          value: []
        },
        {
          type: 'inputrange',
          label: '发票金额',
          name: 'earlyWarnin',
          class: 'hidden',
          selectValue: '0',
          selectOptions: [
            { label: '金额（元）', value: '0' }
          ],
          value1: '',
          value2: ''
        },
        {
          type: 'checkBox',
          label: '购买方',
          name: 'buyer',
          value: [],
          checkAll: false,
          class: 'hidden',
          showMore: true,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '销售方',
          name: 'seller',
          value: [],
          checkAll: false,
          class: 'hidden',
          showMore: true,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入发票代码/发票号码',
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
        total: 0
      }
    };
  },
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    vueEasyPrint,
    ExportFileNew
  },
  mixins: [ColumnsMixin],
  created() {
    this.getList();
  },
  watch: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthExamine() {
      return this.currentAuth.includes('admin:purchaseApplication.examine');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:purchaseApplication.delete');
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
    this.getBuyerList();
    this.getSellerList();
  },
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
    getBuyerList() {
      let params = {
        cooperationType: '1',
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/cooperationInfo/cooperationInfo/list.jhtml', params)
        .then(data => {
          this.filters[5].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getSellerList() {
      this.loading = true;
      let params = {
        cooperationType: '0',
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', params)
        .then(data => {
          this.loading = false;
          this.filters[6].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
        this.filters[5].class = 'hidden';
        this.filters[6].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
        this.filters[5].class = 'show';
        this.filters[6].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.openAdd = false;
      this.refresh();
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
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          ids: [model.id]
        };
        http
          .post('/admin/invoicing/invoiceRecord/submmit.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            this.loading = false;
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
          .delete('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', { ids: ids })
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
        .get('/admin/invoicing/invoiceRecord/voucher.jhtml', params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop.name + '发票单';
          this.form = data.data;
          this.gridData = data.data.items || [];
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
    async exportInvoice() {
      let params = {
        id: this.form.id,
        //  0:采购；1：销售
        type: '0'
      };
      try {
        let response = await axios.post('/admin/invoicing/invoiceRecord/voucher/export.jhtml', params, {
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
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[7].value,
        type: this.filters[1].value,
        category: this.filters[0].value,
        state: this.filters[2].value,
        beginDate: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endDate: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      http
        .post('/admin/invoicing/invoiceRecord/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/invoiceRecord/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    add() {
      this.tabName = 'addinfo';
      this.itemId = { id: '' };
      this.openAdd = true;
      this.$nextTick(() => {
        // this.$refs.step1Info.getDepotList();
      });
    },
    rowClick(model, e, column) {
      this.tabNameInfo = 'addinfo';
      this.openAdd = true;
      this.$nextTick(() => {
        this.itemId = { id: model.id };
      });
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[7].value,
        seller: this.filters[6].value.join('&seller='),
        buyer: this.filters[5].value.join('&buyer='),
        priceLowLimit: this.filters[4].value1,
        priceTopLimit: this.filters[4].value2,
        type: this.filters[1].value,
        category: this.filters[0].value,
        state: this.filters[2].value,
        beginDate: this.filters[3].value[0] ? this.filters[3].value[0] + ' ' + '00:00:00' : '',
        endDate: this.filters[3].value[1] ? this.filters[3].value[1] + ' ' + '23:59:59' : ''
      };
      this.loading = true;
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/invoicing/invoiceRecord/list.jhtml?' + paramsArr.join('&'))
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
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '未确认';
        case '1':
          return '已确认';
        default:
          return '--';
      }
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '个人发票';
        case '1':
          return '增值税普通发票';
        case '2':
          return '增值税专用发票';
        default:
          return '--';
      }
    },
    getCategory(row) {
      switch (row.category) {
        case '0':
          return '采购发票';
        case '1':
          return '销售发票';
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
    width: 300px;
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
.invoice-mgmt-tabel {
  .biz-input {
    width: 220px;
  }
}
.invoice-mgmt {
  .biz-popup .popup-content {
    width: 900px;
  }
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
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
}
</style>
