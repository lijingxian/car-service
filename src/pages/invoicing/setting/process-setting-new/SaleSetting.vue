<template>
  <biz-grid class="process-setting">
    <div slot="top">
      <div class="slot-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"
          :views="views" @onSwitch="onViewSwitch">
        </biz-header>
        <div class="model">
          <div class="font">销售流程模板</div>
          <img :src="xslc" height="150">
        </div>
      </div>
    </div>
    <biz-flex-table ref="table" :tableData="tableData" :loading="loading" :pagination="pagination" v-show="!showList"
      @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @row-click="handleRowClick">
      <el-table-column label="流程名称" prop="name" min-width="100"></el-table-column>
      <el-table-column label="流程" min-width="700">
        <template slot-scope="scope">
          <div class="process">
            <img :src="xslc" height="150" align="center" v-if="scope.row.configs&&scope.row.configs[0].state==='1'">
            <img :src="xslc1" height="150" align="center" v-if="scope.row.configs&&scope.row.configs[0].state==='0'">
            <span class="step1" v-if="scope.row.configs&&scope.row.configs[0].state==='1'"
              :title="formatRow(scope.row)">{{formatRow(scope.row)}}</span>
            <span class="step2"
              v-if="scope.row.configs&&scope.row.configs[0].state==='1'">{{scope.row.configs[1].way==='0'?'系统审批':'人工审批'}}</span>
            <span
              :class="scope.row.configs&&scope.row.configs[0].state==='1'?'step3':'step33'">{{scope.row.configs[2].way==='0'?'自动提交':'手动提交'}}</span>
            <span
              :class="scope.row.configs&&scope.row.configs[0].state==='1'?'step4':'step22'">{{scope.row.configs[3].way==='0'?'系统审批':'人工审批'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="handleDeleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-flex-table ref="table" :tableData="tableData" :loading="loading" :pagination="pagination" v-show="showList"
      @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @row-click="handleRowClick">
      <el-table-column label="流程名称" prop="name" min-width="180"></el-table-column>
      <el-table-column label="提交销售申请" min-width="100">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.configs[0].state==='0'">✖</div>
            <template v-if="scope.row.configs[0].state==='1'">
              <div v-for="item in scope.row.configs[0].items" :key="item.id">
                {{item.shop.name?item.shop.name+':':'全部门店'}}
                {{item.shop.name?(item.approver.name?item.approver.name:'全部'):''}}
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售申请审批" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.configs[0].state==='0'">✖</div>
          <template v-if="scope.row.configs[0].state==='1'">
            <span v-if=" scope.row.configs[1].way==='0'">自动通过</span>
            <div v-for="(item,index) in scope.row.configs[1].items" :key="item.id">
              <template v-if="scope.row.configs[1].way==='1'">{{item.approver.name}}<template
                  v-if="index < scope.row.configs[1].items.length - 1">→</template></template>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="提交销售订单" min-width="100">
        <template slot-scope="scope">
          <div>
            <span v-if=" scope.row.configs[2].way==='0'">自动通过</span>
            <div v-for="item in scope.row.configs[2].items" :key="item.id">
              <template v-if="scope.row.configs[2].way==='1'">
                {{item.shop.name?item.shop.name+':':'全部门店'}}
                {{item.shop.name?(item.approver.name?item.approver.name:'全部'):''}}
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售订单审批" min-width="100">
        <template slot-scope="scope">
          <span v-if=" scope.row.configs[3].way==='0'">自动通过</span>
          <div v-for="(item,index) in scope.row.configs[3].items" :key="item.id">
            <template v-if="scope.row.configs[3].way==='1'">{{item.approver.name}}<template
                v-if="index < scope.row.configs[3].items.length - 1">→</template></template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="流程描述" min-width="100" prop="memo">
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="handleDeleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="设置" name="first">
          <sale-setting-info :idObject="infoId" @item-updated="refresh"></sale-setting-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import xslc from '@/assets/images/process/01.png';
import xslc1 from '@/assets/images/process/02.png';
import http from '@/common/http';
import urls from '@/common/urls';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizFlexTable } from '@/components/BizTable';
import SaleSettingInfo from './SaleSettingInfo';
export default {
  name: 'ProcessSettingSale',
  components: {
    BizGrid,
    BizPopupTabs,
    SaleSettingInfo,
    BizFlexTable,
    BizHeader
  },
  data() {
    return {
      tabName: 'first',
      loading: false,
      open: false,
      showList: false,
      infoId: { id: '' },
      orderId: { id: '' },
      purchaseId: { id: '' },
      selections: [],
      tableData: [],
      xslc: xslc,
      xslc1: xslc1,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-qiapianshitu',
          title: '流程视图',
          name: 'card'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-liebiaoshitu',
          title: '列表视图',
          name: 'list'
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入流程名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    formatRow(row) {
      if (row.configs[0].items.length === 1) {
        if (row.configs[0].items[0].shop.name) {
          return (row.configs[0].items[0].shop.name + (row.configs[0].items[0].approver.name ? row.configs[0].items[0].approver.name : '全部'));
        } else {
          return '全部门店';
        }
      } else {
        if (row.configs[0].items[0].shop.name) {
          return (row.configs[0].items[0].shop.name + (row.configs[0].items[0].approver.name ? row.configs[0].items[0].approver.name : '全部') + '等');
        } else {
          return '全部门店等';
        }
      }
    },
    operate(name) {
      this[name]();
    },
    onViewSwitch(name) {
      if (name === 'card') {
        this.views[0].actived = true;
        this.views[1].actived = false;
        this.showList = false;
      } else {
        this.views[1].actived = true;
        this.views[0].actived = false;
        this.showList = true;
      }
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    handlePageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleCurrentPageChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    create() {
      this.infoId = { id: '' };
      this.open = true;
    },
    handleRowClick(row) {
      this.infoId = { id: row.id };
      this.open = true;
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
          .delete(urls.invoicing.shopApprovalFlow, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
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
    handleDeleteClick(model) {
      this.deleteItem([model.id]);
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[0].value,
        type: '1'
      };
      this.loading = true;
      http
        .get(urls.invoicing.shopApprovalFlows, params)
        .then(data => {
          this.tableData = data.dataList;

          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.process-setting {
  .biz-flex-table {
    padding: 0px !important;
  }
  .model {
    display: flex;
    background: #f9f9f9;
    font-size: 12px;
    .font {
      padding: 30px 90px;
    }
  }
  position: relative;
  .image {
    position: relative;
  }
  .process {
    position: relative;
    .step1 {
      position: absolute;
      top: 90px;
      left: 120px;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
    .step11 {
      position: absolute;
      top: 80px;
      left: 100px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
    .step2 {
      position: absolute;
      top: 90px;
      left: 275px;
    }
    .step22 {
      position: absolute;
      top: 80px;
      left: 275px;
    }
    .step33 {
      position: absolute;
      top: 80px;
      left: 130px;
    }
    .step3 {
      position: absolute;
      top: 90px;
      left: 425px;
    }
    .step4 {
      position: absolute;
      top: 90px;
      left: 575px;
    }
  }
}
</style>
