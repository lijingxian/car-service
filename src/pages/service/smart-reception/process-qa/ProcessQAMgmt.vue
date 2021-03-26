<template>
  <div class="process-q-a-a">
    <biz-flex-table
      v-loading="loading"
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @selection-change="onSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="name" label="流程名称"></el-table-column>
      <el-table-column prop="describe" label="流程描述"></el-table-column>
      <el-table-column prop="modifyDate" label="变更时间"></el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" v-model="importtabName" @close="open = false;" :contentStyle="{ 'width': '760px' }">
      <el-tab-pane label="基本信息" name="baseinfo">
        <base-info @success="refresh" :itemObjId="itemObjId"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import http from '@/common/http';
import { customerService } from '@/common/urls';

export default {
  name: 'ProcessQAMgmt',
  components: { BizFlexTable, BizPopupTabs, BaseInfo },
  props: {},
  data() {
    return {
      itemObjId: {
        id: ''
      },
      open: false,
      loading: false,
      importtabName: 'baseinfo',
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      selections: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'delete',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入搜索内容',
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
    operate(name) {
      this[name]();
    },
    add() {
      this.itemObjId = {
        id: ''
      };
      this.open = true;
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[0].value
      };
      this.loading = true;
      http
        .get(customerService.processQA.list, params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    filterDataChange() {
      this.pagination.pageNumber = 1;
      this.getList();
    },
    onSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
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
          .delete(customerService.processQA.flow, {
            ids: ids
          })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(data => {
            this.loading = false;
          });
      });
    },
    rowClick(item) {
      this.itemObjId = {
        id: item.id
      };
      this.open = true;
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    refresh(id) {
      this.getList();
      if (id) {
        this.itemObjId = {
          id
        };
      }
    }
  }
};
</script>

<style lang="scss">
.process-q-a-a {
}
</style>
