<template>
  <div class="car-fault-code">
    <biz-flex-table ref="table" :operations="operations" :pagination="pagination" :tableData="tableDataHandle" :loading="loading" @operate="operate" @size-change="handleSizeChange" @current-change="handleCurrentChange" @selection-change="selectionChangeHandler" @row-click="rowClick">
      <el-table-column prop="faultCode" label="故障码"></el-table-column>
      <el-table-column prop="faultDescription" label="故障描述">
        <template slot-scope="scope">
          {{scope.row.faultDescription||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultType" label="故障类型">
        <template slot-scope="scope">
          {{scope.row.faultType||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultSpn" label="SPM">
        <template slot-scope="scope">
          {{scope.row.faultSpn||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultFmi" label="FMI">
        <template slot-scope="scope">
          {{scope.row.faultFmi||'--'}}
        </template>
      </el-table-column>
      <el-table-column prop="faultDtcm" label="DTCM">
        <template slot-scope="scope">
          {{scope.row.faultDtcm||'--'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <car-fault-code-popup slot="float" :open="openPopup" @close="closePopup" :itemId="itemId" @operationSuccess="refresh"></car-fault-code-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import CarFaultCodePopup from './CarFaultCodePopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'car-fault-code',
  data() {
    return {
      itemId: { id: '' },
      openPopup: false,
      loading: false,
      tableData: [],
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
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
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      faultTypeList: []
    };
  },
  props: {},
  components: { BizFlexTable, CarFaultCodePopup },
  computed: {
    tableDataHandle() {
      let ary = this.tableData;
      if (ary) {
        ary.forEach(element => {
          this.faultTypeList.forEach(item => {
            if (element.faultTypeId === item.id) {
              element.faultType = item.name;
            }
          });
        });

        return ary;
      }
      return [];
    }
  },
  watch: {},
  methods: {
    add() {
      this.itemId = { id: '' };
      this.openPopup = true;
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    },
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let param = {
          ids: ids
        };
        http
          .delete(urls.systemSetting.carFaultCodeOperate, param)
          .then(data => {
            console.log(data);
            this.loading = false;
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {});
      });
    },
    operate(name) {
      this[name]();
    },
    deleteHandler(e, model) {
      e.stopPropagation();
      this.deleteItem([model.id]);
    },
    refresh() {
      this.getList();
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    closePopup() {
      this.openPopup = false;
    },
    rowClick(row) {
      console.log('rowClick');
      this.openPopup = true;
      this.itemId = { id: row.id };
    },
    handleSelectionChange() {
      console.log('handleSelectionChange');
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      console.log('handleSizeChange');
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      console.log('handleCurrentChange');
      this.refresh();
    },
    getList() {
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.systemSetting.carFaultCodeList, params)
        .then(data => {
          console.log('车辆故障码列表', data);
          this.tableData = data.content;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        })
        .finally(() => {});
    },
    getFaultType() {
      http
        .get(urls.systemSetting.faultType)
        .then(data => {
          console.log('故障类型', data);
          this.faultTypeList = data.faultTypeList;
          this.refresh();
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    }
  },
  created() {
    this.getFaultType();
  }
};
</script>

<style lang="scss">
.car-fault-code {
}
</style>
