<template>
  <div class="test-drive-mgmt">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :tableData="tableData" :loading="loading"
      :pagination="pagination" @operate="handleOperate" @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange" @row-click="handleRowClick" @sort-change="handleSortChange">
      <el-table-column prop="car.plateNumber" label="体验商品" min-width="200">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.product.name}}</div>
            <div class="overflow">{{scope.row.car.type}}</div>
            <div class="overflow">{{scope.row.car.plateNumber}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="80">
        <template slot-scope="scope">
          <div>
            <span :style="{color: stateColor(scope.row)}">{{scope.row.state==='1'?'服务中':'空闲中'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="adviser.name" label="顾问" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.adviser.name||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="car.plateNumber" label="体验记录" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">体验时长：{{scope.row.drivingTimes}}</div>
            <div class="overflow">体验距离：{{scope.row.drivingRange}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" min-width="50">
        <template slot-scope="scope" v-if="hasAuthDel">
          <el-button type="text" size="mini" @click="handleDeleteClick($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>

    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" name="testDriveBaseInfo">
          <test-drive-base-info ref="testDriveBaseInfo" :itemId.sync="itemId" @operationSuccess="addSuccess">
          </test-drive-base-info>
        </el-tab-pane>

        <el-tab-pane label="体验记录" name="testDriveRecord" v-if="itemId">
          <test-drive-record ref="testDriveRecord" :itemId="itemId">
          </test-drive-record>
        </el-tab-pane>
      </biz-popup-tabs>

      <biz-popup-tabs :open="openTestDrive" @close="openTestDrive=false" v-model="tabName">
        <el-tab-pane label="体验设置" name="first">
          <TestDriveAgreement :open="openTestDrive">
          </TestDriveAgreement>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import TestDriveAgreement from './TestDriveMgmt/TestDriveAgreement';
import { BizPopupTabs } from '@/components/BizPopup';
import { testDriveMgmt as service } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import TestDriveBaseInfo from './TestDriveMgmt/TestDriveBaseInfo';
import TestDriveRecord from './TestDriveMgmt/TestDriveRecord';

// 基础属性
const dataBase = {
  // 控件
  // itemId: { id: '' },
  recordFlag: false,
  itemId: '',
  selections: [],
  openTestDrive: false,
  tabName: 'first',
  popupTabName: 'testDriveBaseInfo',
  // 右侧弹窗
  openPopup: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary',
      auth: ['admin:testdriveManagment.add']
    },
    {
      label: '删除',
      name: 'delete',
      type: '',
      disabled: true,
      auth: ['admin:testdriveManagment.delete']
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    },
    {
      label: '体验设置',
      name: 'testDriveConfig',
      type: '',
      auth: ['admin:testdriveManagment.set']
    }
  ],
  // 排序
  orderProperty: '',
  orderDirection: '',
  // 过滤
  filters: [
    {
      type: 'select',
      label: '状态',
      name: 'state',
      value: '',
      disabled: false,
      options: [{ label: '全部', value: '' }, { label: '空闲中', value: '0' }, { label: '服务中', value: '1' }]
    },
    {
      type: 'input',
      label: '',
      placeholder: '请输入车牌号',
      name: 'searchValue',
      value: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    total: 0
  },
  sortInfo: {},
  brandSeries: []
};
// 方法
const methods = {
  // 排序
  handleSortChange(value) {
    const ORDER_DIRECTION = {
      ascending: 'asc',
      descending: 'desc'
    };
    this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
    if (this.orderDirection) {
      this.orderProperty = value.column ? value.column.property : '';
    } else {
      this.orderProperty = '';
    }
    this.refresh();
  },
  testDriveConfig() {
    this.openTestDrive = true;
  },
  stateColor(row) {
    if (row.state === '1') {
      return '#11AE17';
    } else {
      return '#FF7300';
    }
  },
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      searchValue: this.filters[1].value,
      state: this.filters[0].value,
      orderDirection: this.orderDirection,
      orderProperty: this.orderProperty
    };
  },
  query() {
    this.loading = true;
    http
      .get(service.testDrive.testDriveList, this.getQueryParams())
      .then(data => {
        this.tableData = data.dataList;
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
  refresh() {
    this.itemId = '';
    this.query();
  },
  addSuccess() {
    this.query();
  },
  // 删除
  deleteItem(ids) {
    this.$confirm('删除后体验记录将会同步清空，是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      http
        .delete(service.testDrive.testDriveCrud, { ids: ids })
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
    this.popupTabName = 'testDriveBaseInfo';
    this.openPopup = true;
    this.recordFlag = false;
    // this.itemId = { id: '' };
    this.itemId = '';
  }
};

// 事件
const events = {
  operationSuccess() {
    this.openPopup = false;
    this.query();
  },
  formmatTime(row) {
    let str = row.drivingTimes;
    if (str !== '0' && str !== '' && str !== null) {
      return (
        (Math.floor(str / 60).toString().length < 2 ? '0' + Math.floor(str / 60).toString() : Math.floor(str / 60).toString()) +
        'h' +
        ((str % 60).toString().length < 2 ? '0' + (str % 60).toString() : (str % 60).toString()) +
        'min'
      );
    } else {
      return '';
    }
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
  handleFilterDataChange() {
    this.query();
  },
  handleRowClick(model, e, column) {
    this.popupTabName = 'testDriveBaseInfo';
    this.openPopup = true;
    this.recordFlag = true;

    this.$nextTick(() => {
      // this.$refs.testDriveRecord.query(this.itemId);
      this.itemId = String(model.id);
    });

    console.log(this.itemId);
  },
  handleDeleteClick(e, model) {
    e.stopPropagation();
    this.deleteItem([model.id]);
  }
};

export default {
  name: 'TestDriveMgmt',
  components: {
    BizFlexTable,
    TestDriveAgreement,
    BizPopupTabs,
    TestDriveBaseInfo,
    TestDriveRecord
  },
  props: {},
  data() {
    return {
      ...dataBase,
      ...dataTable
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:testdriveManagment.delete');
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    ...methods,
    ...events
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
</style>
