<template>
  <div class="area-mgmt">
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      :span-method="objectSpanMethod" @row-click="rowClick" @selection-change="handleSelectionChange" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <el-table-column prop="superiorArea" label="上级地区" class-name="superior-area-name" v-if="hasSuperiorArea === true">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.parentAreaData.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="名称">
        <div slot-scope="scope">
          <el-tooltip class="tip-item" effect="light" content="点击查看下级地区" placement="right">
            <el-button prop="scope.row.name" type="text" size="mini" @click.stop="showSubordinateArea(scope.row.id)">
              <div class="biz-customcol">
                {{scope.row.name}}
              </div>
            </el-button>
          </el-tooltip>
        </div>
      </el-table-column>
      <el-table-column prop="scope.row.order" label="排序">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.order}}
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
    <area-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :areaId="areaId4Popup" :parentAreaId="parentAreaId4Popup" @refreshNotification="refresh"
      @addSuccessNotification="addSuccess"></area-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import AreaMgmtPopup from './AreaMgmtPopup';
import Service from '@/service/system-setting/area-mgmt/areaMgmt';

export default {
  name: 'AreaMgmt',
  data() {
    return {
      loading: false,
      areaId4Popup: '',
      parentAreaId4Popup: '',
      parentAreaData: this.getDefaultParentAreaData(),
      openPopup: false,
      multipleSelection: [],
      hasSuperiorArea: false,
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
          disabled: true,
          label: '上级地区',
          name: 'showSuperiorArea',
          type: 'primary'
        }
      ],
      tableData: [],
      spanArray: [],
      pos: 0,
      pagination: {
        pageSize: 100, // pageSize: 20,
        currentPage: 1,
        pageSizes: [100], // pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizFlexTable,
    AreaMgmtPopup
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
        parentId: this.parentAreaData.id,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };

      if (this.openPopup !== true) {
        this.loading = true;
      }

      Service.getList(
        params,
        data => {
          this.tableData = data.areas;
          this.pagination.total = Number(data.total);
          if (data.parent) {
            this.hasSuperiorArea = data.parent.id !== '';
            this.operations[3].disabled = data.parent.id === '';
          }
          this.parentAreaData =
            data.parent !== undefined
              ? data.parent
              : this.getDefaultParentAreaData();

          this.getSpanArray(this.tableData);
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
    // 添加推荐
    add() {
      this.openPopup = true;
      this.areaId4Popup = '';
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
      this.areaId4Popup = row.id;
    },
    showSubordinateArea(id) {
      this.parentAreaId4Popup = id;
      this.refreshByParentId(id);
    },
    showSuperiorArea() {
      this.parentAreaId4Popup = this.parentAreaData.parentAreaData.id;
      this.refreshByParentId(this.parentAreaData.parentAreaData.id);
    },
    refreshByParentId(parentId) {
      this.parentAreaData.id = parentId;
      this.refresh();
    },
    getDefaultParentAreaData() {
      return {
        id: '',
        name: '',
        order: '',
        english: '',
        parentAreaData: {
          id: '',
          name: '',
          order: '',
          english: ''
        },
        parentParentAreaData: {
          id: '',
          name: '',
          order: '',
          english: ''
        }
      };
    },
    closePopup() {
      this.openPopup = false;
      this.areaId4Popup = '';
    },
    getSpanArray(data) {
      if (data === undefined) {
        return;
      }

      if (this.hasSuperiorArea === false) {
        return;
      }

      this.spanArray = [];
      this.pos = 0;

      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArray.push(1);
          this.pos = 0;
        } else {
          if (data[i].parentAreaData.id === data[i - 1].parentAreaData.id) {
            this.spanArray[this.pos] += 1;
            this.spanArray.push(0);
          } else {
            this.spanArray.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.hasSuperiorArea === false) {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
      if (columnIndex === 1) {
        const _row = this.spanArray[rowIndex];
        const _column = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _column
        };
      }
    },
    addSuccess(areaId) {
      this.areaId4Popup = areaId;
    }
  }
};
</script>

<style lang="scss">
.area-mgmt {
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
  .superior-area-name {
    padding-top: 10px;
    padding-right: 10px;
    vertical-align: text-top;
  }
}
</style>
