<template>
  <div class="services-mgmt">
    <biz-flex-table ref="table" v-loading="loading" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="name" label="领域" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.name}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceData.name" label="基础服务" min-width="80">
        <template slot-scope="scope">
          <div>
            <template v-for="(service,index) in scope.row.serviceIds">
              {{service.serviceData?service.serviceData.name:'--'}}
              <template v-if="index < scope.row.serviceIds.length - 1">{{separator}}</template>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="基础商品分类" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.serviceIds">
            <template v-for="(category,index) in scope.row.serviceIds[0].categoryDatas">
              {{category.name}}
              <template v-if="index < scope.row.serviceIds[0].categoryDatas.length - 1">{{separator}}</template>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="100" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteLog(scope.row)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <BaseInfo ref="baseInfo" :id="orderId" :refreshSign="refreshSign" @operationSuccess="operationSuccess">
        </BaseInfo>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import { mapGetters } from 'vuex';
import BaseInfo from './BaseInfo';
import http from '@/common/http';
export default {
  name: 'ServicesMgmtOrder',
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo
  },
  data() {
    return {
      orderId: '',
      paymentTypeName: '支付宝',
      open: false,
      loading: false,
      separator: '、',
      // 侧栏是否刷新
      refreshSign: false,
      dialogVisible: false,
      showCloseOrder: false,
      showPayment: false,
      curSelectCloseReason: '',
      closeDeccription: '',
      selections: [],
      multiSelected: [],
      tabName: 'first',
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
        },
        {
          label: '删除',
          name: 'del',
          type: '',
          disabled: true
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入领域名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      multipleSelection: [],
      serviceDatas: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    this.refresh();
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    operationSuccess() {
      this.getList();
    },
    refresh() {
      this.getList();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    closeOrder(row) {
      this.orderId = row.id;
      this.showCloseOrder = true;
      this.curSelectCloseReason = '';
      this.closeDeccription = '';
    },
    cancelClose() {
      this.showCloseOrder = false;
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
          ids: ids,
          userId: this.getUser().id
        };
        this.loading = true;
        http
          .delete('/admin/businessServiceDomain/domain.jhtml', params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    // 快捷删除
    deleteLog(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: [row.id]
        };
        this.loading = true;
        http
          .delete('/admin/businessServiceDomain/domain.jhtml', params)
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          });
      });
    },
    getList() {
      let params = {
        searchValue: this.filters[0].value,
        userId: this.getUser().id,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      http
        .get('/admin/businessServiceDomain/domainPage.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          // console.log(data);
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    getOrderPurchaseWay(row) {
      switch (row.purchaseWay) {
        case 'newly':
          return '新购';
        case 'renewal':
          return '续订';
        default:
          break;
      }
    },
    getOrderStatus(row) {
      switch (row.state) {
        case 'unpaid':
          return '待付款';
        case 'paid':
          return '已完成';
        case 'cancelled':
          return '已关闭';
        default:
          break;
      }
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.orderId = row.id;
      this.open = true;
      this.tabName = 'first';
    },
    add() {
      this.orderId = '';
      this.$refs.baseInfo.clear();
      this.open = true;
      this.tabName = 'first';
    },
    filterChange(val) {
      this.$refs.table.doLayout();
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handleSelectionChange(selectedItems) {
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
      this.operations[2].disabled = true;
      if (selectedItems.length > 0) {
        this.operations[2].disabled = false;
      }
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
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
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
.services-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .message-mgmt-header {
    position: absolute;
    top: 5px;
    left: 10px;
    font-size: 14px;
    z-index: 1;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .biz-two-column {
    display: flex;
    img {
      width: 100px;
      height: 100px;
    }
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
