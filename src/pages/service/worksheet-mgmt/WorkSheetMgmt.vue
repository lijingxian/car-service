<template>
  <div class="work-order-mgmt">
    <biz-flex-table
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="handleTableData"
      :pagination="pagination"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :loading="loading"
    >
      <!-- <el-table-column v-for="(col,index) of columns" :key="col.id" :label="col.name">
        <template slot-scope="scope">
          <div v-if="col.id === '1'">{{scope.row.number}}</div>
          <div v-else-if="col.id === '2'">{{workSheetLevel(scope.row.level)}}</div>
          <div v-else-if="col.id === '3'">{{workSheetType(scope.row.type)}}</div>
          <div v-else-if="col.id === '4'">{{scope.row.content}}</div>
          <div v-else-if="col.id === '5'">{{workSheetState(scope.row.state)}}</div>
          <div
            v-else-if="col.id === '6'"
          >{{scope.row.initiator ? (scope.row.initiator.name || scope.row.initiator.nickname || scope.row.initiator.userName) : ''}}</div>
          <div
            v-else-if="col.id === '7'"
          >{{scope.row.handleGroup ? scope.row.handleGroup.name : ''}}{{scope.row.handlerAdmin ? scope.row.handlerAdmin.name : ''}}</div>
          <div v-else-if="col.id === '8'">{{scope.row.createDate}}</div>
          <div v-else-if="col.id === '9'">{{scope.row.modifyDate}}</div>
        </template>
        <template #header>
          <div class="custom-header">
            <div>{{col.name}}</div>
            <i v-show="index===(columns.length - 1)" @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="工单" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.number}}
            </div>
            <div class="overflow">
              创建日期：{{scope.row.createDate}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{workSheetState(scope.row.state)}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="工单详情" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              内容：{{scope.row.content}}
            </div>
            <div class="overflow">
              类型：{{workSheetType(scope.row.type)}}
            </div>
            <div class="overflow">
              级别：{{workSheetLevel(scope.row.level)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发起人" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.initiator ? (scope.row.initiator.name || scope.row.initiator.nickname || scope.row.initiator.userName) : ''}}
            </div>
            <div class="overflow">
              {{scope.row.initiator ? scope.row.initiator.mobile : ''}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="受理人" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.handleGroup ? scope.row.handleGroup.name : ''}}{{scope.row.handlerAdmin ? scope.row.handlerAdmin.name : ''}}
            </div>
            <div class="overflow">
              更新日期：{{scope.row.modifyDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="scope.row.state==='1'" @click.stop="answer(scope.row.id)">
            答复
          </el-button>
          <el-button type="text" size="mini" @click.stop="del(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="工单信息" name="first">
        <base-info :itemId="currentRowId" ref="baseInfo" @created="refresh"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './WorkSheetBaseInfo.vue';
import service from '@/service/customer-service/workSheetMgmt.js';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import axios from 'axios';
export default {
  name: 'WorkSheetMgmt',
  data() {
    return {
      tableId: '4',
      tableData: [],
      open: false,
      currentRowId: {},
      tabName: 'first',
      line: '-',
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:customerServiceScheduling.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:customerServiceScheduling.delete'] },
        { label: '刷新', name: 'refresh', type: '' },
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      filters: [
        {
          label: '工单类型',
          type: 'select',
          placeholder: '请选择工单类型',
          name: 'type',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '售前' },
            { value: '1', label: '售后' },
            { value: '2', label: '问题反馈' },
            { value: '3', label: '投诉' },
            { value: '4', label: '拉黑' },
            { value: '5', label: '功能建议' },
            { value: '6', label: '体验问题' }
          ]
        },
        {
          label: '工单状态',
          type: 'select',
          placeholder: '请选择工单状态',
          name: 'state',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '待受理' },
            { value: '1', label: '受理中' },
            { value: '2', label: '已完结' }
          ]
        },
        {
          type: 'input',
          placeholder: '请输入工单内容',
          name: 'searchbar',
          value: ''
        }
      ],
      originData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      multiSelected: [],
      loading: false
    };
  },
  computed: {
    handleTableData() {
      let tableData = this.tableData;
      tableData.forEach(element => {
        if (element.handleGroup && element.handleGroup.name && element.handlerAdmin.name) {
          element.handleGroup.name += '-';
        }
      });
      return tableData;
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    operate(name) {
      this[name]();
    },
    close() {
      this.open = false;
    },
    async export() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        type: this.filters[0].value,
        state: this.filters[1].value,
        searchValue: this.filters[2].value
      };
      try {
        let response = await axios.post('/admin/cs/exportCSWorkSheet.jhtml', params, {
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
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 修改工单状态
    setDone(row) {},
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.tableData = this.tableData.slice(val * this.pagination.currentPage - val, val * this.pagination.currentPage);
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.tableData = this.tableData.slice(
        this.pagination.pageSize * val - this.pagination.pageSize,
        this.pagination.pageSize * val
      );
      this.refresh();
    },
    // 添加
    add() {
      this.currentRowId = { id: '' };
      this.open = true;
      this.$refs.baseInfo.operations[0].disabled = false;
    },
    // 答复
    answer(id) {
      this.currentRowId = { id: id };
      this.open = true;
    },
    // 编辑
    rowClick(row) {
      this.currentRowId = { id: row.id };
      this.open = true;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids
        };
        service.deleteBaseInfo(
          params,
          data => {
            this.$message.success('操作成功');
            this.filterDataChange();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    // 过滤器更新
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 刷新
    refresh() {
      this.loading = true;
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        type: this.filters[0].value,
        state: this.filters[1].value,
        searchValue: this.filters[2].value,
        shopId: window.top.SHOP_ID || ''
      };
      service.queryList(
        params,
        data => {
          this.loading = false;
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
    },
    // 级别
    workSheetLevel(level) {
      switch (level) {
        case '0':
          return '低';
        case '1':
          return '中';
        case '2':
          return '高';
      }
    },
    // 类型
    workSheetType(type) {
      switch (type) {
        case '0':
          return '售前';
        case '1':
          return '售后';
        case '2':
          return '问题反馈';
        case '3':
          return '投诉';
        case '4':
          return '拉黑';
      }
    },
    stateColor(row) {
      if (row.state === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 状态
    workSheetState(state) {
      switch (state) {
        case '0':
          return '待受理';
        case '1':
          return '受理中';
        case '2':
          return '已完结';
        default:
          return '待受理';
      }
    }
  },
  mounted() {
    let params = {
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      type: this.filters[0].value,
      state: '0',
      searchValue: this.filters[2].value,
      shopId: window.top.SHOP_ID || ''
    };
    service.queryList(
      params,
      data => {
        this.showMessage(`待处理工单数：${data.total}条`, 'info');
      },
      ErrorData => {
        this.loading = false;
      }
    );
    this.refresh();
    this.filters[1].value = this.$route.query.state || '';
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo
  }
};
</script>

<style lang="scss">
.work-order-mgmt {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
      padding-left: 0;
    }
    i {
      font-size: 18px;
    }
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
