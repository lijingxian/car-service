<template>
  <div class="potential-customer-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      ref="table"
      :operations="operations"
      :filters="filters"
      :tableData="tableData"
      :loading="loading"
      :checkable="true"
      :pagination="pagination"
      @operate="handleOperate"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @active-item-change="activeItemChange"
      @cascader-change="cascaderChange"
    >
      <template slot="operation" v-if="hasAuthImport">
        <import-file
          :tableData="importResult"
          :importLoading="importLoading"
          :total="total"
          :disabled="disabled"
          :count="count"
          :percentage="percentage"
          @clearTimeOut="clearTimeOut"
          @restProcess="restProcess"
          :stepkey="stepkey"
          :action="'/admin/customer/importConsumer.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="编号" prop="line" width="50"></el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
        </import-file>
        <el-button type @click="changeView(viewMode)" size="mini" style="margin-left:10px">{{viewMode==='record'?'记录视图':'合并视图'}}</el-button>
      </template>
      <el-table-column label="潜客信息" min-width="80px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="/resources/admin/images/Avatar.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gernder === 'male'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gernder === 'female'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gernder === 'unknown'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="意向商品" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.intentionCars.length>0?scope.row.intentionCars[0].intentionName:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="渠道" min-width="60px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.customerChannel&&scope.row.customerChannel.name?scope.row.customerChannel.name:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="潜客级别" min-width="80px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.level}}{{scope.row.levelInfo||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="潜客跟踪" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">顾问：{{salesConverter(scope.row)}}</div>
            <div class="overflow">建档日期：{{createDateConverter(scope.row)}}</div>
            <div class="overflow">下次回访日期：{{backDateConverter(scope.row)}}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-for="(col,index) of columns"
        :key="col.id"
        :label="col.name"
        :min-width="getWidth(col)"
        :sortable="getSortable(col)"
        :prop="getProp(col)"
      >
        <template slot-scope="scope">
          <div v-if="col.id === '1'" class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="/resources/admin/images/Avatar.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gernder === 'male'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gernder === 'female'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gernder === 'unknown'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
          <div v-else-if="col.id === '2'" class="customer-info">
            <div v-for="(intentionCars,index) in scope.row.intentionCars" :key="index">{{intentionCars.intentionName}}</div>
          </div>
          <div v-else-if="col.id === '3'" class="customer-info">
            <div>{{scope.row.customerChannel&&scope.row.customerChannel.name?scope.row.customerChannel.name:''}}</div>
          </div>
          <div v-else-if="col.id === '4'">
            <div>{{scope.row.level}}{{scope.row.levelInfo}}</div>
          </div>
          <div v-else-if="col.id === '5'">{{salesConverter(scope.row)}}</div>
          <div v-else-if="col.id === '6'">{{createDateConverter(scope.row)}}</div>
          <div v-else-if="col.id === '7'">{{backDateConverter(scope.row)}}</div>
        </template>
        <template #header>
          <div class="custom-header">
            <div>{{col.name}}</div>
            <i v-show="index===(columns.length - 1)" @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template>
      </el-table-column> -->
    </biz-flex-table>
    <div slot="float">
      <right-popup
        :open="open"
        ref="RightPopup"
        :itemId="itemId"
        :phoneNumber="phoneNumber"
        :viewMode="viewMode"
        :defaultTab="defaultTab"
        @close="open = false;"
        :activeNames1="activeNames1"
        @operationSuccess="handleOperationSuccess"
        @showOrderTab="showOrderTab"
      ></right-popup>
      <biz-popup-tabs :open="openOrder" @close="openOrder=false" v-model="orderName">
      <el-tab-pane label="基本信息" name="info">
        <order-base-info :itemId="orderId" :isEdit="isEdit" ref="orderBaseInfo" :activeNames="activeNames"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <product-info :itemId="orderId" :isEdit="isEdit" ref="productinfo"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
      <callback-setting-popup
        :open="openCallback"
        :itemId="callbackId"
        @close="openCallback = false;"
        @operationSuccess="handleCallbackOperationSuccess"
      ></callback-setting-popup>
      <biz-popup-tabs :open="openTest" @close="openTest=false" v-model="tabName">
        <el-tab-pane label="体验协议" name="first">
          <TestDriveAgreement :open="openTest"></TestDriveAgreement>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <el-dialog title="潜客分配" :visible.sync="dialogVisible" width="30%">
      <span>将选中{{selections.length}}个潜客分配至</span>
      <el-form>
        <el-form-item label="分配顾问：" prop="salesAdvisor">
          <el-select v-model="salesAdvisor" placeholder="请选择" size="mini">
            <el-option v-for="item in salesList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmDistribute" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { ImportFile } from '@/components/BizUpload';
import RightPopup from './PotentialCustomerMgmt/PotentialCustomerPopup';
import CallbackSettingPopup from './CallbackSetting/CallbackSettingPopup';
import TestDriveAgreement from './PotentialCustomerMgmt/TestDriveAgreement';
import OrderBaseInfo from '@/pages/order/OrderMgmt/BaseInfo';
import ProductInfo from '@/pages/order/OrderMgmt/ProductInfo';
import { BizPopupTabs } from '@/components/BizPopup';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import urlUtil from '@/utils/url';
import { ExportFileNew } from '@/components/BizUpload';
import { mapGetters, mapMutations } from 'vuex';
import { ROLE } from '@/utils/dims';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import axios from 'axios';
const consumerStateList = [
  { value: 'created', label: '已建档' },
  { value: 'intention', label: '意向客户' },
  { value: 'signed', label: '已签约' },
  { value: 'failed', label: '已战败' },
  { value: 'finished', label: '已结束' }
];
// 基础属性
const dataBase = {
  // 控件
  itemId: { id: '' },
  selections: [],
  salesAdvisor: '',
  defaultTab: '0',
  tabName: 'first',
  openTest: false,
  openOrder: false,
  orderName: 'info',
  isEdit: false,
  activeNames: ['2'],
  activeNames1: ['1'],
  orderId: '',
  phoneNumber: '',
  taskId: '',
  t: '',
  percentage: 0,
  // 状态列表
  consumerStateList: consumerStateList,

  channelList: [],
  // 右侧弹窗
  open: false,

  // 是否是销售主管
  isAdmin: false
};
// Table相关
const dataTable = {
  loading: false,
  dialogVisible: false,
  viewMode: 'merge',
  tableData: [],
  showRecommend: false,
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary',
      auth: ['admin:potential.add']
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    },
    {
      label: '模板下载',
      name: 'download',
      type: ''
    },
    {
      label: '导出',
      name: 'exportStart',
      type: '',
      auth: ['admin:potential.export']
    }
  ],
  filters: [
    {
      type: 'cascader',
      label: '意向车型',
      name: 'potentialId',
      filterable: false,
      value: [],
      class: 'hidden',
      options: []
    },
    {
      type: 'select',
      label: '渠道',
      name: 'channel',
      value: '',
      class: 'hidden',
      options: []
    },
    {
      type: 'select',
      label: '潜客级别',
      name: 'level',
      value: '',
      class: 'hidden',
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: 'O'
        },
        {
          value: '1',
          label: 'H'
        },
        {
          value: '2',
          label: 'A'
        },
        {
          value: '3',
          label: 'B'
        },
        {
          value: '4',
          label: 'C'
        },
        {
          value: '5',
          label: 'F'
        },
        {
          value: '6',
          label: 'D'
        },
        {
          value: '7',
          label: 'N'
        }
      ]
    },
    {
      type: 'select',
      label: '顾问',
      name: 'potentialId',
      value: '',
      class: 'hidden',
      options: []
    },
    {
      type: 'input',
      label: '',
      placeholder: '请输入客户姓名/电话',
      name: 'searchValue',
      value: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    total: 0
  },
  salesList: [],
  sortInfo: {},
  carType: []
};

// 方法
const methods = {
  ...mapMutations('Sales', ['updatePotentialInfo', 'updateConsumer']),
  changeView(val) {
    this.pagination.currentPage = 1;
    if (val === 'merge') {
      this.viewMode = 'record';
    } else {
      this.viewMode = 'merge';
    }
    this.query();
  },
  test() {
    this.openTest = true;
  },
  querySalesList() {
    http
      .get(potentialCustomerMgmt.mainPage.salesList, this.getQueryParams())
      .then(data => {
        let arr = data.dataList;
        arr.map(item => {
          item.value = item.id;
          item.label = item.name;
        });
        arr.unshift({ value: '-1', label: '未分配' });
        arr.unshift({ value: '', label: '全部' });
        this.$set(this.filters[3], 'options', arr);
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      });
  },
  queryKpi() {
    http
      .get(potentialCustomerMgmt.mainPage.kpi, this.getQueryParams())
      .then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `累计潜客记录${data.totalCount}条，
            今日新增潜客${data.dayCount}人，
            意向客户${data.intentionCount}人，
            签约${data.signedCount}人，
            战败${data.failureCount}人`,
          duration: 3000
        });
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      });
  },
  showOrderTab(row) {
    window.dType = row.dType;
    this.orderId = row.id;
    this.orderName = 'info';
    this.openOrder = true;
    this.isEdit = false;
    this.open = false;
  },
  distribute() {
    if (this.selections.length === 0) {
      this.$message.warning('请选择要分配的潜客');
      return;
    }
    http
      .get(potentialCustomerMgmt.mainPage.salesList, this.getQueryParams())
      .then(data => {
        let arr = data.dataList;
        arr.map(item => {
          item.value = item.id;
          item.label = item.name;
        });
        arr.unshift({ value: '-1', label: '未分配' });
        this.salesList = arr;
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      });
    this.dialogVisible = true;
  },
  channelListData() {
    http
      .get(potentialCustomerMgmt.customerChannels, { shopId: window.top.SHOP_ID || '' })
      .then(data => {
        this.channelList = data.dataList;
        this.filters[1].options = [{ label: '全部', value: '' }].concat(
          data.dataList.map(item => {
            return { label: item.name, value: item.id };
          })
        );
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      });
  },
  confirmDistribute() {
    let ids = [];
    this.selections.map(item => {
      ids.push(item.id);
    });
    let params = {
      ids: ids,
      adminId: this.salesAdvisor,
      viewMode: this.viewMode
    };
    http
      .put(potentialCustomerMgmt.mainPage.distribute, params)
      .then(data => {
        this.$message.success('分配成功');
        this.query();
        this.dialogVisible = false;
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
  // 导出
  exportStart() {
    let ids = [];
    this.selections.forEach(element => {
      ids.push(element.id);
    });
    let params = {
      potentialIds: ids || [],
      shopId: window.top.SHOP_ID || '',
      level: this.filters[2].value || '',
      customerChannelId: this.filters[1].value || '',
      salesAdvisorId: this.filters[3].value || '',
      searchValue: this.filters[4].value || '',
      nameormobile: this.filters[4].value || '',
      orderProperty: this.sortInfo.column || '',
      orderDirection: this.sortInfo.sort || '',
      viewMode: this.viewMode || '',
      pageSize: this.pagination.pageSize || '',
      pageNumber: this.pagination.currentPage || ''
    };
    http
      .post('/admin/customer/exportConsumer/exportStart.jhtml', params)
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
      let response = await axios.get('/admin/customer/exportConsumer/exportResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
      .get(url, { taskId: taskId })
      .then(data => {
        if (!data.data.rate) {
          this.percentage = 0;
        }
        if (data.data.rate) {
          this.percentage = Number(data.data.rate);
        }
        this.$refs.exportFile.uploadingVisible = true;
        if (data.data && data.data.rate && data.data.rate === '100') {
          this.clearTimeOut();
          this.$refs.exportFile.title = '导出完成';
        } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
          if (this.t) {
            this.clearTimeOut();
          }
          this.t = setTimeout(this.getProcess(taskId), 2000);
        }
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
      });
  },
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',
      level: this.filters[2].value,
      customerChannelId: this.filters[1].value,
      salesAdvisorId: this.filters[3].value,
      searchValue: this.filters[4].value,
      nameormobile: this.filters[4].value,
      orderProperty: this.sortInfo.column,
      orderDirection: this.sortInfo.sort,
      viewMode: this.viewMode,
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      brandId: this.carType[0] || '',
      seriesId: this.carType[1] || ''
    };
  },
  query() {
    this.loading = true;

    http
      .get(potentialCustomerMgmt.mainPage.potentialCustomerList, this.getQueryParams())
      .then(data => {
        this.tableData = data.content;

        this.$set(this.pagination, 'total', Number.parseInt(data.total));
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
  async queryPotentialInfo(id) {
    try {
      let response = await http.get(potentialCustomerMgmt.baseInfo.addQuery, {
        shopId: window.top.SHOP_ID || '',
        id: id,
        viewMode: this.viewMode
      });
      console.log('response => ', response);
      this.updatePotentialInfo(response);
      return;
    } catch (error) {
      throw new Error(error);
    }
  },
  async queryConsumerInfo(id) {
    try {
      let response = await http.get(potentialCustomerMgmt.baseInfo.editQuery, {
        shopId: window.top.SHOP_ID || '',
        id: id,
        viewMode: this.viewMode
      });
      console.log('response => ', response);
      this.updateConsumer(response);
      return;
    } catch (error) {
      throw new Error(error);
    }
  },
  async queryPotentialBaseInfo(id) {
    try {
      await this.queryConsumerInfo(id);
      this.itemId = { id: id };
      this.open = true;
    } catch (error) {
      this.$message.warning(error.errorMessage);
    }
  },
  refresh() {
    this.query();
  },

  driveItem(id) {
    this.defaultTab = '4';
    this.queryPotentialBaseInfo(String(id));
  },
  signItem(id) {
    this.defaultTab = '6';
    this.queryPotentialBaseInfo(String(id));
  },
  failItem(id) {
    this.defaultTab = '5';
    this.queryPotentialBaseInfo(String(id));
  },
  abandonItem(ids) {
    this.$confirm('是否确认废弃?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      let params = urlUtil.toURLParams({ ids: ids });
      http
        .post(potentialCustomerMgmt.mainPage.potentialCustomer_abandon + params, {})
        .then(data => {
          this.$message.success('废弃成功');
          this.query();
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
  // 删除
  deleteItem(ids) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      let params = urlUtil.toURLParams({ ids: ids });
      http
        .post(potentialCustomerMgmt.mainPage.potentialCustomer_delete + params, {})
        .then(data => {
          this.$message.success('删除成功');
          this.query();
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

  // 添加
  add() {
    this.defaultTab = '0';
    this.open = true;
    this.itemId = { id: '' };
    this.$refs.RightPopup.$refs.base.resetModel();
    this.$refs.RightPopup.$refs.base.getChannelList();
  },

  purposeConverter(row) {
    return `${row.purposeBrand} ${row.purposeSeries} ${row.purposeProduct}`;
  },
  stateConverter(row) {
    for (let i = 0; i < this.consumerStateList.length; i++) {
      if (this.consumerStateList[i].value === row.consumerState) {
        return this.consumerStateList[i].label;
      }
    }

    return '';
  },
  salesConverter(row) {
    if (row.salesAdvisor && row.salesAdvisor.name) {
      return row.salesAdvisor.name;
    } else {
      return '--';
    }
  },
  createDateConverter(row) {
    if (!row.entryDate) return '';

    let date = new Date(row.entryDate);
    return dateUtil.dateConverter(date);
  },
  backDateConverter(row) {
    if (!row.nextVisitTime) return '--';

    let date = new Date(row.nextVisitTime);
    return dateUtil.dateConverter(date);
  },

  checkRole(list) {
    if (!list) return false;

    for (let i = 0; i < list.length; i++) {
      if (Number(list[i].type) === ROLE.salesmanAdmin) return true;
    }

    return false;
  },
  showMessage(msg, type) {
    this.$message({
      message: msg,
      type: type,
      duration: 1000,
      showClose: true
    });
  }
};

// 事件
const events = {
  handleOperationSuccess(id) {
    // this.open = false;
    this.query();
    id && this.queryPotentialBaseInfo(id);
  },

  handleOperate(name) {
    this[name]();
  },
  handlePageSizeChange(val) {
    this.pagination.pageSize = val;
    this.pagination.currentPage = 1;
    this.query();
  },
  handleCurrentPageChange(val) {
    this.pagination.currentPage = val;
    this.query();
  },
  handleSelectionChange(val) {
    this.selections = val;
  },
  handleFilterDataChange(data) {
    console.log(data);
    this.pagination.currentPage = 1;
    this.query();
  },
  handleRowClick(model, e, column) {
    this.defaultTab = '0';
    this.phoneNumber = model.mobile;
    // this.itemId = { id: String(model.id) };
    // this.open = true;
    this.queryPotentialBaseInfo(String(model.id));
    this.$refs.RightPopup.$refs.base.getChannelList();
  },
  handleSortChange(column) {
    console.log('column', column);
    this.sortInfo = {
      column: column.prop,
      sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
    };

    this.query();
  },
  handleRouterPush(e, model) {
    e.stopPropagation();

    this.$router.push({
      name: this.$route.params.isSys ? 'tag-group-all-mgmt' : 'tag-group-mgmt',
      params: {
        isSys: 'isSys',
        classId: model.id
      }
    });
  },
  handleDriveClick(e, model) {
    e.stopPropagation();

    this.driveItem(model.id);
  },
  handleSignClick(e, model) {
    e.stopPropagation();

    this.signItem(model.id);
  },
  handleFailClick(e, model) {
    e.stopPropagation();

    this.failItem(model.id);
  },
  handleAbandonClick(e, model) {
    e.stopPropagation();

    this.abandonItem([model.id]);
  },
  handleDeleteClick(e, model) {
    e.stopPropagation();

    this.deleteItem([model.id]);
  }
};

// 导入相关
const importData = {
  data: {
    importResult: [],
    importLoading: false,
    disabled: false,
    total: 0,
    count: 0,
    t: '',
    percentage: 0,
    stepkey: ''
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    clearTimeOut() {
      window.clearTimeout(this.t);
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
    cascaderChange(value) {
      this.carType = value;
      this.query();
    },
    activeItemChange(value) {
      this.getSeriesList(value[0]);
    },
    getBrandList() {
      http
        .get(potentialCustomerMgmt.failure.queryBrandList, { category: 'car' })
        .then(data => {
          let obj;
          this.filters[0].options = [];
          obj = {};
          obj.label = '全部';
          obj.value = '';
          this.filters[0].options.push(obj);
          data.dataList.forEach(element => {
            obj = {};
            obj.label = element.name;
            obj.value = element.id;
            obj.children = [];
            this.filters[0].options.push(obj);
          });
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    getSeriesList(value) {
      let obj;
      http
        .get(potentialCustomerMgmt.failure.querySeriesList, { brandId: value })
        .then(data => {
          this.filters[0].options.forEach(element => {
            if (element.value === value) {
              element.children = [];
              data.dataList.forEach(item => {
                obj = {};
                obj.label = item.name;
                obj.value = item.id;
                element.children.push(obj);
              });

              return false;
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  events: {
    download() {
      window.open('/upload/mode/V%E6%9C%8D%E7%88%B1%E8%BD%A6_%E6%BD%9C%E5%AE%A2%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx');
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
      let url = '/admin/customer/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
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
            this.refresh();
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.disabled = false;
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    }
  }
};

// 潜客设置
const callbackData = {
  data: {
    openCallback: false,
    callbackId: { id: '' }
  },
  events: {
    handleCallbackOperationSuccess(e) {
      this.openCallback = false;
    }
  },
  methods: {
    callbackSetting(e) {
      this.callbackId = { id: '' };
      this.openCallback = true;
    }
  }
};

export default {
  name: 'PotentialCustomerMgmt',
  components: {
    BizFlexTable,
    ImportFile,
    RightPopup,
    CallbackSettingPopup,
    BizPopupTabs,
    OrderBaseInfo,
    ProductInfo,
    TestDriveAgreement,
    ExportFileNew
  },
  props: {},
  data() {
    return {
      tableId: '7',
      ...dataBase,
      ...dataTable,
      ...importData.data,
      ...callbackData.data
    };
  },
  computed: {
    ...mapGetters('Sales', ['potentialInfo', 'consumerInfo']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthImport() {
      // return true;
      return this.currentAuth.includes('admin:potential.import');
    },
    hasAuthDistribute() {
      // return true;
      return this.currentAuth.includes('admin:potential.distribution');
    },
    hasAuthSet() {
      // return true;
      return this.currentAuth.includes('admin:potential.set');
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
  methods: {
    getWidth(col) {
      switch (col.id) {
        case '1':
          return '130';
        case '2':
          return '180';
        case '4':
          return '100';

        default:
          return '';
      }
    },
    getSortable(col) {
      switch (col.id) {
        case '6':
          return 'custom';
        case '7':
          return 'custom';

        default:
          return false;
      }
    },
    getProp(col) {
      switch (col.id) {
        case '6':
          return 'entryDate';
        case '7':
          return 'nextVisitTime';

        default:
          return '';
      }
    },
    ...mapGetters(['getUser']),
    ...methods,
    ...events,
    ...importData.methods,
    ...importData.events,
    ...callbackData.methods,
    ...callbackData.events
  },
  created() {
    // 注册Vuex模块
    this.$store.registerModule('potentialCustomer', {
      state: {
        // 潜客状态
        // -1: 未确定
        // 0: 普通
        // 1: 已签约
        // 2: 已战败
        consumerState: '0'
      },
      mutations: {
        changeConsumerState(state, payload) {
          state.consumerState = payload.value;
        }
      }
    });
    this.channelListData();
    this.queryPotentialInfo('');
    this.query();
    this.querySalesList();
    this.getBrandList();
    this.queryKpi();
  },
  mounted() {
    this.isAdmin = this.checkRole(this.getUser().roleDatas);
    let flag = false;
    // 销售主管时
    if (this.isAdmin) {
      this.operations.map(item => {
        if (item.label === '潜客设置') {
          flag = false;
          return false;
        } else {
          flag = true;
        }
      });
      if (flag) {
        if (this.hasAuthDistribute) {
          this.operations.push({
            label: '分配',
            name: 'distribute',
            type: ''
          });
        }
        if (this.hasAuthSet) {
          this.operations.push({
            label: '潜客设置',
            name: 'callbackSetting',
            type: ''
          });
        }
      }
      // 不是销售主管时
    } else if (!this.isAdmin && !flag) {
      this.operations.splice(this.operations.length - 2, 2);
    }
  },
  destroyed() {
    this.$store.unregisterModule('potentialCustomer');
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt {
  .biz-popup .popup-content {
    width: 550px;
  }
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 18px;
    }
  }
  .motorists-club-activity__kpi {
    top: 45px;
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
      .title {
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
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
