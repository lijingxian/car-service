<template>
  <div class="oil-price-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column prop="city" label="城市">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.city}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="b90" label="89号（元）">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.b90}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="b93" label="92号（元）">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.b93}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="b97" label="95号（元）">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.b97}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="b0" label="0号（元）">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.b0}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRow(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <oil-price-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :id="id4Popup" @refreshNotification="refresh" @addSuccessNotification="addSuccess"></oil-price-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import OilPriceMgmtPopup from './OilPriceMgmtPopup';
import Service from '@/service/system-setting/oil-price-mgmt/oilPriceMgmt';

export default {
  name: 'OilPriceMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '一键同步',
          name: 'oneKeyUpdate',
          type: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    OilPriceMgmtPopup
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };

      if (this.openPopup !== true) {
        this.loading = true;
      }

      Service.getList(
        params,
        data => {
          this.tableData = data.memberList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    // 批量操作-删除
    deleteList() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      this.delete(ids);
    },
    // 快捷操作-删除
    deleteRow(id) {
      let ids = [];
      ids.push(id);
      this.delete(ids);
    },
    // 后台删除
    delete(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          Service.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message({
                title: '警告',
                message: ErrorData.errorMessage,
                type: 'warning'
              });
            }
          );
        })
        .catch(() => {});
    },
    oneKeyUpdate() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      Service.oneKeyUpdate(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '一键同步成功!'
          });
          this.tableData = data.memberList;
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message({
            title: '警告',
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log(ErrorData);
        }
      );
    },
    // 添加推荐
    add() {
      this.openPopup = true;
      this.id4Popup = '';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
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
    rowClick(row) {
      this.openPopup = true;
      this.id4Popup = row.id;
    },
    closePopup() {
      this.openPopup = false;
      this.id4Popup = '';
    },
    addSuccess(id) {
      this.id4Popup = id;
    }
  }
};
</script>

<style lang="scss">
.oil-price-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
