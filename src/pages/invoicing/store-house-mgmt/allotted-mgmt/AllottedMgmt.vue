<template>
  <div class="allotted-mgmt">
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
      @closeDialogFilter = "closeDialogFilter"
    >
      <el-table-column label="订单" min-width="180px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.sn}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate}}</div>
            <div class="overflow">状态：
              <span :style="{color: stateColor(scope.row)}">{{ scope.row.state==='0'?'未确认':'已确认' }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="仓库" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              调出仓库：{{scope.row.depotOut.name?scope.row.depotOut.name:'--'}}
            </div>
            <div class="overflow">
              调入仓库：{{scope.row.depotIn.name?scope.row.depotIn.name:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" min-width="60px">调拨</el-table-column>
      <el-table-column label="关联单据" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div style="color:#ff7300;cursor:pointer" class="shop-over overflow" @click.stop="billInClick(scope.row)">
              {{ scope.row.relateDepotInBill.sn?scope.row.relateDepotInBill.sn:'--' }}
            </div>
            <div style="color:#ff7300;cursor:pointer" class="shop-over overflow" @click.stop="billOutClick(scope.row)">
              {{ scope.row.relateDepotOutBill.sn?scope.row.relateDepotOutBill.sn:'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="240px">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div v-for="orderItem in (scope.row.items.length>0?[scope.row.items[0]]:[])" :key="orderItem.sn"
                class="product-info-content">
                  <img v-if="orderItem.thumbnail&&orderItem.thumbnail!==' '" :src="orderItem.thumbnail" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="orderItem.fullName">{{orderItem.fullName?orderItem.fullName:'--'}}</div>
                    <div class="overflow">{{orderItem.product?orderItem.product.barCode:''}}</div>
                  </div>
                  <div class="amount">{{orderItem.quantity}}{{scope.row.items.length>1?'...':''}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="certificate(scope.row.id)">凭证</el-button>
            <el-button type="text" size="mini" @click.stop="confirm(scope.row.id)" v-if="scope.row.state==='0'">确认</el-button>
            <el-button type="text" size="mini" @click.stop="deleteRecommend(scope.row.id)" v-if="scope.row.state==='0'&&hasAuthDel">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
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
            <el-col :span="12">
              <div class="grid-content bg-purple">编号：{{form.sn}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">调出仓库：{{form.depotOut.name}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">调入仓库：{{form.depotIn.name}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">创建人：{{form.creatorName}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">确认人：{{form.auditorName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple">状态：{{form.state==='1'?'已确认':'未确认'}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="24">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table size="small" :data="form.items"  show-summary>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="商品" prop="fullName"></el-table-column>
            <el-table-column property="product.barCode" label="商品条码"></el-table-column>
            <el-table-column label="仓库" prop="depotName"></el-table-column>
            <el-table-column label="调拨数量" prop="quantity"></el-table-column>
          </el-table>
        </div>
      </vue-easy-print>
    </el-dialog>
    <biz-popup-tabs :open="open" v-model="importtabName" @close="open = false;">
      <el-tab-pane label="基本信息" name="baseinfo">
        <base-info :open="open" @operationSuccess="refresh" :itemId="itemId" :refreshSign="refreshSign" :shopDepots="shopDepots"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openDepotIn" @close="openDepotIn=false" v-model="tabName">
      <el-tab-pane label="入库信息" name="info">
        <base-info-in :itemId="relateDepotInId" :isEdit="isEdit" ref="baseInfo"></base-info-in>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openDepotOut" @close="openDepotOut=false" v-model="tabName">
      <el-tab-pane label="出库信息" name="info">
        <base-info-out :itemId="relateDepotOutId" :isEdit="isEdit" ref="baseInfo"></base-info-out>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import { mapGetters } from 'vuex';
import { BizPopupTabs } from '@/components/BizPopup';
import urls from '@/common/urls';
import http from '@/common/http';
import BaseInfo from './BaseInfo';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
import BaseInfoIn from '../depot-in-mgmt/BaseInfo';
import BaseInfoOut from '../depot-out-mgmt/BaseInfo';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'CommodityMgmt',
  data() {
    return {
      rowBaseInfo: {},
      loading: false,
      openDepotIn: false,
      openDepotOut: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      importtabName: 'baseinfo',
      tabName: 'info',
      relateDepotOutId: '',
      relateDepotInId: '',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      shopDepots: [],
      itemId: '',
      open: false,
      isEdit: true,
      taskId: '',
      t: '',
      percentage: 0,
      showRecommend: false,
      dialogTableVisible: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:storage.transfer.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: '',
          auth: ['admin:storage.transfer.delete']
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
          auth: ['admin:storage.transfer.export']
        }
      ],
      filters: [
        {
          type: 'checkBox',
          label: '订单状态',
          name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '未确认' },
            { value: '1', label: '已确认' }
          ]
        },
        {
          type: 'checkBox',
          label: '调出仓库',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          showMore: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '调入仓库',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          showMore: true,
          options: []
        },
        {
          type: 'daterange',
          label: '创建日期',
          name: 'publishDate',
          class: 'hidden',
          value: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入编号/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      categoryDatas: [],
      supplierDatas: [],
      title: '',
      form: this.getDefaultForm(),
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
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    vueEasyPrint,
    BaseInfoIn,
    BaseInfoOut,
    ExportFileNew
  },
  created() {
    this.getDepots();
    this.refresh();
    this.queryKpi();
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:storage.transfer.delete');
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
  mixins: [ColumnsMixin],
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
    billInClick(row) {
      this.relateDepotInId = row.relateDepotInBill.id;
      this.tabName = 'info';
      this.openDepotIn = true;
    },
    billOutClick(row) {
      this.relateDepotOutId = row.relateDepotOutBill.id;
      this.tabName = 'info';
      this.openDepotOut = true;
    },
    refresh() {
      this.getList();
    },
    getDefaultForm() {
      return {
        sn: '',
        type: '1',
        depotIn: {
          id: '',
          name: ''
        },
        depotOut: {
          id: '',
          name: ''
        },
        relateDepotInBill: {
          id: '',
          name: ''
        },
        relateDepotOutBill: {
          id: '',
          name: ''
        },
        state: '',
        items: [],
        remarks: ''
      };
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
      //  + ' ' +
      // (hour < 10 ? '0' + hour : hour) +
      // ':' +
      // (min < 10 ? '0' + min : min) +
      // ':' +
      // (sec < 10 ? '0' + sec : sec);

      return newTime;
    },
    createdProductSuccess(id, type) {
      this.itemId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.itemId = row.id;
      this.rowBaseInfo = row;
      this.open = true;
    },
    confirm(id) {
      this.$confirm('确认调拨?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          http
            .post(urls.invoicing.allottedMgmt.submmit, params)
            .then(data => {
              this.loading = false;
              this.$message.success('操作成功');
              this.getList();
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              this.loading = false;
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getDepots() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageSize: '1000',
        pageNumber: 1
      };
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml', params)
        .then(data => {
          this.filters[1].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
          this.filters[2].options = data.dataList.map(item => {
            return { label: item.name, value: item.id };
          });
          this.shopDepots = data.dataList;
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
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getList() {
      let params = {
        pageable: {
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          searchValue: this.filters[4].value
        },
        states: this.filters[0].value,
        beginTime: this.filters[3].value.length > 0 ? this.filters[3].value[0] : '',
        endTime: this.filters[3].value.length > 1 ? this.filters[3].value[1] : '',
        depotOuts: this.filters[1].value,
        depotIns: this.filters[2].value,
        shopId: this.getUser().shop.id
      };
      http
        .post(urls.invoicing.allottedMgmt.list, params)
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
    queryKpi() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/invoicing/depotTransfer/queryDepotTransferKpi.jhtml', params)
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `今日新增${data.data.dayNewAdd}条，待确认${data.data.unConfirm}条`,
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
    async exportInvoice() {
      let params = {
        id: this.form.id
      };
      try {
        let response = await axios.post('/admin/invoicing/depotTransfer/voucher/export.jhtml', params, {
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
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        states: this.filters[0].value,
        beginTime: this.filters[3].value.length > 0 ? this.filters[3].value[0] : '',
        endTime: this.filters[3].value.length > 1 ? this.filters[3].value[1] : '',
        pageable: {
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          searchValue: this.filters[4].value
        },
        depotOuts: this.filters[1].value,
        depotIns: this.filters[2].value,
        shopId: this.getUser().shop.id
      };
      http
        .post('/admin/invoicing/depotTransfer/depotTransfer/exportStart.jhtml', params)
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
        let response = await axios.get('/admin/invoicing/depotTransfer/depotTransfer/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    add() {
      this.itemId = '';
      this.isEdit = true;
      this.open = true;
    },
    handleSelectionChange(val) {
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
    print() {
      this.$refs.easyPrint.print();
    },
    certificate(id) {
      this.title = this.getUser().shop.name + '仓库调拨单';
      this.dialogTableVisible = true;
      http
        .get(urls.invoicing.allottedMgmt.voucher, { id: id })
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.getDefaultForm(), data.data);
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
    // 快捷操作-删除
    deleteRecommend(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          http
            .delete(urls.invoicing.allottedMgmt.depotTransfer, params)
            .then(data => {
              this.$message.success('删除成功');
              this.loading = false;
              this.getList();
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              this.loading = false;
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 批量操作-删除
    deleteList() {
      this.loading = true;
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
          http
            .delete(urls.invoicing.allottedMgmt.depotTransfer, params)
            .then(data => {
              this.$message.success('删除成功');
              this.getList();
              this.loading = false;
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              this.loading = false;
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
    }
  }
};
</script>

<style lang="scss">
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
.allotted-mgmt {
  .el-dropdown {
    vertical-align: top;
  }
  .item {
    display: flex;
    justify-content: space-between;
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
  .product-info {
    margin: 5px 0px;
    width: 100%;
    .wrapper {
      .titleClass {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 200px;
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
