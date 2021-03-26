<template>
  <div class="shipping-method-mgmt">
    <biz-flex-table
      ref="table"
      :loading="loading"
      :operations="operations"
      @operate="operate"
      :tableData="tableData"
      :pagination="pagination"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="name" width="220" label="名称">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="isNeedReceiver" width="120" label="是否获取配送地址">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.isNeedReceiver==='1'?'√':'x'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="isNeedDelivery" width="120" label="是否填写物流信息">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.isNeedDelivery==='1'?'√':'x'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="isValid" width="120" label="启用">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.isValid==='1'?'√':'x'}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="description" label="介绍"></el-table-column>
      <el-table-column label="操作" width="120">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRow(scope.row.id)">删除</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <shipping-method-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :obj="shippingMethodObj" @refresh="refresh" @add-Success="addSuccess"></shipping-method-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import ShippingMethodMgmtPopup from './ShippingMethodMgmtPopup';
// import Service from '@/service/system-setting/shipping-method-mgmt/shippingMethodMgmt';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'ShippingMethodMgmt',
  data() {
    return {
      loading: false,
      shippingMethodObj: {
        id: ''
      },
      openPopup: false,
      multiSelected: [],
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
    ShippingMethodMgmtPopup
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
      http
        .get(urls.shippingMethodMgmt.shippingMethodsList, params)
        .then(data => {
          for (const row of data.content) {
            row.description = row.description || '';
            let reg = /<\/?.+?\/?>/g;
            row.description = row.description.replace(reg, '');
          }
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          console.log(ErrorData);
        })
        .finally(() => {
          this.loading = false;
        });
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

          http
            .delete(urls.shippingMethodMgmt.shippingMethodsList, params)
            .then(data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            })
            .catch(ErrorData => {
              console.log(ErrorData);
            })
            .finally(() => {});
        })
        .catch(() => {});
    },
    // 添加
    add() {
      this.openPopup = true;
      this.shippingMethodObj = {
        id: ''
      };
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
      this.shippingMethodObj = {
        id: row.id
      };
    },
    addSuccess(id) {
      this.shippingMethodObj = {
        id: id
      };
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      for (const iterator of val) {
        this.multiSelected.push(iterator.id);
      }
    },
    deleteList() {
      let ids = [];
      ids = this.multiSelected;
      this.delete(ids);
    },
    closePopup() {
      this.openPopup = false;
    }
  }
};
</script>

<style lang="scss">
.shipping-method-mgmt {
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
