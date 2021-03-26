<template>
  <biz-grid class="class-mgmt">
    <div slot="top" class="class-mgmt-header">
      <biz-header :operations="operations" @operate="operateHandler" :filters="filters" @filter-data-change="filterDataChangeHandler ">
        <template slot="operation">
          <import-file
            :tableData="importResult"
            :importLoading="importLoading"
            :total="total"
            :disabled="disabled"
            :count="count"
            :percentage="percentage"
            @clearTimeOut="clearTimeOut"
            @restProcess="restProcess"
            :stepkey="stepkey"
            :action="'/admin/tag/importPlatformTag.jhtml'"
            :name="'uFile'"
            ref="importFile"
            @handle-import="handleImport"
            style="margin-left: 10px;"
          >
            <el-table-column label="标签" width="50" prop="row"></el-table-column>
            <el-table-column label="数据类型" width="150" prop="result"></el-table-column>
            <el-table-column label="分类" prop="message"></el-table-column>
            <el-table-column label="结果" prop="message"></el-table-column>
          </import-file>
        </template>
      </biz-header>
    </div>
    <expand-table
      ref="expandTable"
      :data="tableData"
      :loading="loading"
      @expand-change="expandChange"
      :isSearch="isSearch"
      @delete="deleteHandler"
      @row-click="rowOperationClickHandler"
      @selection-change="selectionChangeHandler"
      @clickHandle="clickHandle"
      @addChildcategory="addChildcategory"
    ></expand-table>
    <div slot="float">
      <biz-popup-tabs :open="open" v-model="tabSelection" @close="open = false;">
        <el-tab-pane label="分类信息" name="0">
          <class-info ref="info" :itemId="itemId" @operationSuccess="operationSuccess"></class-info>
        </el-tab-pane>
        <el-tab-pane label="标签" name="1" v-if="itemId.id">
          <tag-info :itemId="itemId" @operationSuccess="operationSuccess"></tag-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import ExpandTable from './components/ExpandTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import ClassInfo from './ClassInfo';
import TagInfo from './TagInfo';
import { ImportFile } from '@/components/BizUpload';
// import ClassMgmtPop from './ClassMgmtPop';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'class-mgmt',
  data() {
    return {
      expands: [],
      itemId: { id: '' },
      selections: [],
      sonSelections: [],
      tabSelection: '0',
      isChildEditableToStore: '',
      isTagEditableToStore: '',
      isVisibleToStore: '',
      isSearch: true,
      open: false,
      stepkey: '',
      t: '',
      percentage: 0,
      disabled: false,
      count: 0,
      total: 0,
      tagCatrgoryId: '',
      importResult: [],
      importLoading: false,
      successCount: 0,
      failCount: 0,
      loading: false,
      tableData: [],
      currentRow: {},
      checkable: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        // {
        //   label: '删除',
        //   name: 'delete',
        //   type: '',
        //   disabled: true
        // },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '模板下载',
          name: 'download',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '店铺是否可见分类',
          placeholder: '请输入分类名称',
          name: 'catagaryName',
          class: 'hidden',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '可见', value: '1' }, { label: '不可见', value: '0' }]
        },
        {
          type: 'select',
          label: '店铺是否可编辑分类标签',
          placeholder: '请输入分类名称',
          name: 'sonTag',
          value: '',
          class: 'hidden',
          options: [{ label: '全部', value: '' }, { label: '可编辑', value: '1' }, { label: '不可编辑', value: '0' }]
        },
        {
          type: 'select',
          label: '店铺是否可添加子分类',
          placeholder: '请输入分类名称',
          name: 'sonClass',
          value: '',
          class: 'hidden',
          options: [{ label: '全部', value: '' }, { label: '可添加', value: '1' }, { label: '不可添加', value: '0' }]
        },
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
  components: { BizGrid, ExpandTable, ClassInfo, BizHeader, BizPopupTabs, ImportFile, TagInfo },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {},
  methods: {
    expandChange(row) {
      this.currentRow = row;
      this.getList(row);
    },
    download() {
      window.open('/upload/mode/V服爱车_标签导入模板.xlsx');
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      let url = '/admin/tag/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.disabled = false;
            this.refresh();
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    updateInfo(row) {
      this.loading = true;
      let url;
      let params = {
        id: row.id,
        name: row.name,
        parentId: row.parentId,
        isChildEditableToStore: row.isChildEditableToStore ? '1' : '0',
        isVisibleToStore: row.isVisibleToStore ? '1' : '0',
        isTagEditableToStore: row.isTagEditableToStore ? '1' : '0',
        description: row.description
      };

      if (this.getUser.roleLevel === 'platform') {
        url = urls.systemSetting.createTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.createShopTagCategories;
      }

      http
        .put(url, params)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.getList();
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    clickHandle(e) {
      e.stopPropagation();
    },
    addChildcategory(e, row) {
      e.stopPropagation();
      this.itemId = { id: '' };
      this.$refs.info.clear(row);
      this.open = true;
    },
    add() {
      console.log('新增');
      this.tabSelection = '0';
      this.itemId = { id: '' };
      this.open = true;
    },
    delete() {
      if (this.selections.length > 0 || this.sonSelections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(this.getDeleteTagId(element));
        });
        this.sonSelections.forEach(element => {
          ids.push(this.getDeleteTagId(element));
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    },
    // 获取要删除的标签id
    getDeleteTagId(tag) {
      console.log(tag);
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
      console.log('删除id', deleteId);
      return deleteId;
    },
    operationSuccess() {
      this.open = false;
      this.getList();
    },
    refresh() {
      this.getList();
    },
    operateHandler(name) {
      console.log('operate');
      this[name]();
    },
    pageSizeChange(val) {
      console.log('pageSizeChange');
      this.getList();
    },
    currentPageChange(val) {
      console.log('currentPageChange');
      this.getList();
    },
    selectionChangeHandler(val) {
      this.selections = val;
      // this.operations[1].disabled = true;
      // if (val.length > 0) {
      //   this.operations[1].disabled = false;
      // }
    },
    sonClassSelectionChange(val) {
      this.sonSelections = val;
    },
    filterDataChangeHandler() {
      if (this.filters.length) {
        this.getList();
      }
    },
    rowOperationClickHandler(model) {
      console.log(model);
      this.tabSelection = '0';
      this.itemId = { id: model.id };
      this.open = true;
    },
    deleteHandler(model) {
      let deleteId = this.getDeleteTagId(model);
      this.deleteItem([deleteId]);
    },
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let url;
        let param = {
          ids: ids
        };

        if (this.getUser.roleLevel === 'platform') {
          url = urls.systemSetting.createTagCategories;
        } else if (this.getUser.roleLevel === 'shop') {
          url = urls.systemSetting.createShopTagCategories;
        }

        http
          .delete(url, param)
          .then(data => {
            this.loading = false;
            console.log(data);
            this.$message.success('删除成功');
            this.getList();
          })
          .catch(error => {
            this.loading = false;
            this.$message(error.errorMessage);
          })
          .finally(() => {});
      });
    },
    getList(row) {
      this.loading = true;
      let url;
      let params = {
        searchValue: this.filters.length ? this.filters[3].value : ''
      };

      if (this.getUser.roleLevel === 'platform') {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        params.isChildEditableToStore = this.filters[2].value;
        params.isVisibleToStore = this.filters[0].value;
        params.isTagEditableToStore = this.filters[1].value;
        url = urls.systemSetting.getTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        url = urls.systemSetting.getShopTagCategories;
      }

      http
        .get(url, params)
        .then(data => {
          this.loading = false;
          console.log('标签分类列表', data);
          this.tableData = data.content;
          for (const iterator of this.tableData) {
            if (iterator.children.length > 0) {
              iterator.hasChild = '1';
              for (const item of iterator.children) {
                if (item.children.length > 0) {
                  item.hasChild = '1';
                  for (const itemTwo of item.children) {
                    if (itemTwo.children.length > 0) {
                      itemTwo.hasChild = '1';
                      for (const itemThr of itemTwo.children) {
                        if (itemThr.children.length > 0) {
                          itemThr.hasChild = '1';
                        } else {
                          itemThr.hasChild = '0';
                        }
                      }
                    } else {
                      itemTwo.hasChild = '0';
                    }
                  }
                } else {
                  item.hasChild = '0';
                }
              }
            }
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message(error.errorMessage);
        });
    }
  },
  created() {
    // if (this.getUser.roleLevel === 'shop') {
    //   this.filters = [];
    // }
    this.getList();
  }
};
</script>

<style lang="scss">
.noexpand {
  .el-table__expand-icon {
    visibility: hidden;
  }
}

.class-mgmt-tabel {
  .el-table__expanded-cell[class*='cell'] {
    padding: 10px 0 10px 50px;
  }
}

.class-mgmt {
  height: 100%;
  overflow-x: hidden;

  .switch-container {
    width: 40px;
  }
  .first-category-name {
    .el-table__expand-icon {
      display: none;
    }
  }
}
</style>
