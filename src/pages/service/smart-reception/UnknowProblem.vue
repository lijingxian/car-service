<template>
  <div class="unknow-problem">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" @operate="operate" :tableData="tableData" :loading="loading"
      :pagination="pagination" @row-click="rowClick" @size-change="handleSizeChange" @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange">
      <el-table-column width="200" prop="question" label="问题">
      </el-table-column>
      <el-table-column prop="count" label="次数">
      </el-table-column>
      <el-table-column prop="date" label="最近访问时间">
      </el-table-column>
      <el-table-column prop="answer" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="primary" size="mini" @click.stop="answer(scope.row)">回答</el-button>
            <el-button type="primary" size="mini" @click.stop="setting(scope.row)">设置为相似问题</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="回答" name="info">
        <QaMgmtDetail :itemId="itemId" @created="refresh"></QaMgmtDetail>
      </el-tab-pane>
      <el-tab-pane label="设置相似问题" name="problem">
        <UnknowProblemInfo :itemId="itemId" @created="refresh"></UnknowProblemInfo>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import QaMgmtDetail from './QaMgmtDetail';
import UnknowProblemInfo from './UnknowProblemInfo';
import { BizPopupTabs } from '@/components/BizPopup';
export default {
  name: 'QaMgmt',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      loading: false,
      open: false,
      selections: [],
      tableData: [],
      operations: [
        {
          label: '忽略',
          name: 'delete',
          type: 'primary'
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: []
    };
  },
  components: {
    BizFlexTable,
    QaMgmtDetail,
    BizPopupTabs,
    UnknowProblemInfo
  },
  created() {
    this.getList();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    exportExcle() {},
    add() {
      this.itemId = '';
      this.open = true;
    },
    rowClick(model, e, column) {
      this.itemId = model.id;
      this.open = true;
    },
    answer(row) {
      this.tabName = 'info';
      this.itemId = row.id;
      this.open = true;
    },
    setting(row) {
      this.tabName = 'problem';
      this.itemId = row.id;
      this.open = true;
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
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete(customerService.smartReception.knowledgeStock, {
            ids: ids
          })
          .then(data => {
            this.$message.success('操作成功');
            this.refresh();
            this.loading = false;
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(data => {
            this.loading = false;
          });
      });
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        type: '10001'
      };
      this.loading = true;
      http
        .get(customerService.smartReception.knowledges, params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
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
    handleSelectionChange(val) {
      this.selections = val;
    }
  }
};
</script>

<style lang="scss">
.unknow-problem {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
