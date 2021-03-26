<template>
  <biz-grid class="tag-class-main">
    <biz-flex-table :loading="loading" ref="table" :operations="operations" :filters="filters" @operate="operateHandler" :tableData="handleTableData" @filter-data-change="filterDataChangeHandler " @selection-change="selectionChangeHandler " @row-click="rowOperationClickHandler" @size-change="pageSizeChange " @current-change="currentPageChange ">
      <el-table-column prop="name" label="分类" class-name="first-category-name">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <tag-class-pop :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></tag-class-pop>
    </div>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import TagClassPop from './TagClassPop';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'tag-class-main',
  data() {
    return {
      itemId: { id: '' },
      selections: [],
      open: false,
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
      ]
    };
  },
  props: {},
  components: { BizGrid, TagClassPop, BizFlexTable },
  computed: {
    handleTableData() {
      let table = [];
      for (const iterator of this.tableData) {
        table.push({
          id: iterator.id,
          name: iterator.name
        });

        for (const item of iterator.children) {
          table.push({
            id: item.id,
            name: '— ' + item.name
          });

          for (const itemThr of item.children) {
            table.push({
              id: itemThr.id,
              name: '— — ' + itemThr.name
            });

            for (const itemFour of itemThr.children) {
              table.push({
                id: itemFour.id,
                name: '— — — ' + itemFour.name
              });
            }
          }
        }
      }

      console.log(table);
      return table;
    }
  },
  watch: {},
  methods: {
    add() {
      console.log('新增');
      this.itemId = { id: '' };
      this.open = true;
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(this.getDeleteTagId(element));
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    },
    operationSuccess() {
      this.getTagCategories();
    },
    operateHandler(name) {
      console.log('operate');
      this[name]();
    },
    pageSizeChange(val) {
      console.log('pageSizeChange');
      this.getTagCategories();
    },
    currentPageChange(val) {
      console.log('currentPageChange');
      this.getTagCategories();
    },
    selectionChangeHandler(val) {
      console.log('selectionChange');
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChangeHandler() {
      console.log('filterDataChange');
      this.getTagCategories();
    },
    rowOperationClickHandler(model) {
      console.log(model);
      this.itemId = { id: model.id };
      this.open = true;
    },
    // 获取要删除的标签id
    getDeleteTagId(tag) {
      let deleteId = '';
      if (tag.childrenTagCategoryData) {
        if (tag.childrenTagCategoryData.children) {
          if (tag.childrenTagCategoryData.children.children) {
            deleteId = tag.childrenTagCategoryData.children.children.id;
          } else {
            deleteId = tag.childrenTagCategoryData.children.id;
          }
        } else {
          deleteId = tag.childrenTagCategoryData.id;
        }
      } else {
        deleteId = tag.id;
      }

      return deleteId;
    },
    deleteHandler(e, model) {
      let deleteId = this.getDeleteTagId(model);
      this.deleteItem([deleteId]);
      e.stopPropagation();
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
          .delete(urls.systemSetting.deleteTagCategory, param)
          .then(data => {
            this.loading = false;
            console.log(data);
            this.$message.success('删除成功');
            this.getTagCategories();
          })
          .catch(error => {
            this.loading = false;
            this.$message(error.errorMessage);
          })
          .finally(() => {});
      });
    },
    getTagCategories() {
      let param = {
        searchValue: this.filters[0].value
      };

      http
        .get(urls.systemSetting.getTagCategories, param)
        .then(data => {
          console.log('系统标签分类管理 ', data);
          this.tableData = data.content;
        })
        .catch(() => {})
        .finally(() => {});
    }
  },
  created() {
    this.getTagCategories();
  }
};
</script>

<style lang="scss">
.tag-class-main {
}
</style>
