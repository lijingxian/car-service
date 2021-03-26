<template>
  <div class="merchants-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange" :tableData="tableData"
      :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column width="200" prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.mobile||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="电子邮箱">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.email||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="areaName" label="所在区域">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{ scope.row.areaName||'--' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="investmentState" label="状态">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
      <el-tab-pane label="申请单基本信息" name="first">
        <merchants-mgmt-base-info ref="baseInfo" :id="currentRowId" :state="state" :open="open" @onAbandoned="onAbandoned" :email="currentRowEmail" @created="updated" @createdSuccess="createdSuccess">
        </merchants-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="个人资质信息" name="second" v-if="show">
        <merchants-mgmt-psn-qua :id="currentRowId" @updateState="updateBaseInfo" :state="state" :open="open" @onAbandoned="onAbandoned" :email="currentRowEmail" @created="updatedPerson">
        </merchants-mgmt-psn-qua>
      </el-tab-pane>
      <el-tab-pane label="企业资质信息" name="third" v-if="show">
        <merchants-mgmt-com-qua :id="currentRowId" :mobile="mobile"  @updateState="updateBaseInfo" :state="state" :open="open" @onAbandoned="onAbandoned" :email="currentRowEmail" @created="updated">
        </merchants-mgmt-com-qua>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import MerchantsMgmtBaseInfo from './MerchantsMgmtBaseInfo';
import MerchantsMgmtPsnQua from './MerchantsMgmtPsnQua';
import MerchantsMgmtComQua from './MerchantsMgmtComQua';
import { BizFlexTable } from '@/components/BizTable';
import MerchantsMgmtService from '@/service/merchants-mgmt/merchantsMgmt';

export default {
  name: 'MerchantsMgmt',
  data() {
    return {
      tabName: 'first',
      tags: [],
      open: false,
      show: false,
      dialogVisible: false,
      activeName: 'second',
      currentRowId: '',
      currentRowEmail: '',
      mobile: '',
      state: '',
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'year',
          label: '选择年份：',
          value: new Date().getFullYear().toString()
        },
        {
          type: 'select',
          label: '状态',
          name: 'add',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '0',
              label: '未处理'
            },
            {
              value: '1',
              label: '审核中'
            },
            {
              value: '2',
              label: '通过'
            },
            {
              value: '3',
              label: '废弃'
            },
            {
              value: '4',
              label: '提交中'
            }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/电话',
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
      investmentState: '',
      multipleSelection: []
    };
  },
  components: {
    BizPopupTabs,
    MerchantsMgmtBaseInfo,
    MerchantsMgmtPsnQua,
    MerchantsMgmtComQua,
    BizFlexTable
  },
  computed: {},
  watch: {},
  created() {
    this.refresh();
    this.getKpi();
  },
  methods: {
    updateBaseInfo() {
      this.$refs.baseInfo.refresh();
    },
    // 绑定到服务的operate
    operate(name) {
      this[name]();
    },
    onAbandoned() {
      this.refresh();
      this.open = false;
    },
    getKpi() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      MerchantsMgmtService.getList(
        params,
        data => {
          let msg =
            '招商加盟申请' + data.total + '个，待处理申请' + data.untreatedCount + '个，审核中申请' + data.processingCount + '个，今日新增申请' + data.nowCount + '个';
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    refresh() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[2].value,
        year: this.filters[0].value,
        investmentState: this.filters[1].value
      };
      MerchantsMgmtService.getList(
        params,
        data => {
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    filterDataChange(filters) {
      this.refresh();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.state = row.investmentState;
      if (row.investmentState !== '0') {
        this.show = true;
      }
      this.$nextTick(function() {
        this.tabName = 'first';
        if (row.investmentState === '1') {
          this.tabName = 'second';
        }
        this.currentRowId = row.id;
        this.currentRowEmail = row.email;
        this.open = true;
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    stateColor(row) {
      if (row.investmentState === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.investmentState) {
        case '0':
          return '未处理';

        case '1':
          return '审核中';

        case '2':
          return '通过';

        case '3':
          return '废弃';

        case '4':
          return '提交中';
        default:
          break;
      }

      return '';
    },
    createdSuccess(id) {
      this.currentRowId = id;
      this.refresh();
    },
    updated() {
      this.refresh();
    },
    updatedPerson(mobile) {
      this.tabName = 'third';
      this.mobile = mobile;
      this.refresh();
    },
    add() {
      this.currentRowId = '';
      this.show = false;
      this.tabName = 'first';
      this.open = true;
    }
  }
};
</script>

<style lang="scss">
.merchants-Mgmt {
  padding: 0;
}
</style>
