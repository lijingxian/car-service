<template>
  <div class="tag-class-mgmt">
    <biz-flex-table ref="table"
                    :operations="operations"
                    :filters="filters"
                    :tableData="tableData"
                    :loading="loading"

                    @operate="operateHandler"
                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                    @selection-change="selectionChangeHandler"
                    @filter-data-change="filterDataChangeHandler"
                    @row-click="rowOperationClickHandler"
                    >
      <el-table-column label="分类" width="240">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleRouterPush($event, scope.row)"
            >
            {{scope.row.name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="操作"
        width="130">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="deleteHandler($event, scope.row)"
            >
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <tag-class-popup
        :open="open"
        :itemId="itemId"
        @close="open = false;"
        @operationSuccess="operationSuccess"
      ></tag-class-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import TagClassPopup from './TagClass/TagClassPopup';

import service from '@/service/shop-rate/TagClassMgmt';

export default {
  name: 'TagClassMgmt',
  components: {
    BizFlexTable,
    TagClassPopup
  },
  props: {

  },
  data () {
    return {
      // 控件
      itemId: { id: '' },
      selections: [],

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
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
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入分类名称',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  methods: {
    deleteItem (ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delete(
          {
            ids: ids
          },
          data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();

            window.top.postMessage(
              { method: 'setTagTree' },
              window.top.location.origin
            );
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          }
        );
      });
    },

    operationSuccess () {
      this.open = false;
      this.query();
    },
    operateHandler (name) {
      this[name]();
    },
    pageSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange (val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler (model, e, column) {
      if (column.label === '操作' || column.label === '名称') return;

      this.itemId = { id: String(model.id) };
      this.open = true;
    },
    selectionChangeHandler (val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChangeHandler () {
      this.query();
    },
    deleteHandler (e, model) {
      this.deleteItem([model.id]);
    },
    handleRouterPush (e, model) {
      e.stopPropagation();

      this.$router.push({
        name: this.$route.params.isSys ? 'tag-group-all-mgmt' : 'tag-group-mgmt',
        params: {
          isSys: 'isSys',
          classId: model.id
        }
      });
    },

    getQueryParams () {
      return {
        // pageNumber: this.pagination.currentPage,
        // pageSize: this.pagination.pageSize,

        // 平台运营与店铺的权限不同
        // 平台运营下的编辑功能不传递店铺ID，店铺的权限需要传递店铺ID
        shopId: window.top.SHOP_ID && this.$route.params.isSys !== 'isSys' ? window.top.SHOP_ID : '',
        searchValue: this.filters[0].value,
        hierarchy: this.$route.params.isSys === 'isSys' ? 'platform' : 'shop'
      };
    },
    query () {
      this.loading = true;
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.content;

          // this.$set(this.pagination, 'total', Number.parseInt(data.total));
          this.loading = false;

          if (!this.inited) {
            let msg =
              '共有分类 ' + data.content.length + ' 个';
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: msg,
              duration: 3000
            });

            this.inited = true;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
        }
      );
    },
    add () {
      this.open = true;
      this.itemId = { id: '' };
    },
    delete () {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    }
  },
  created () {
    this.query();
  }
};
</script>

<style lang="scss">
.motorists-club-activity__kpi {
  top: 45px;
}
</style>
