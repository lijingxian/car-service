<template>
  <biz-grid class="tag-mgmt">
    <biz-flex-table
      :loading="loading"
      ref="table"
      :operations="operations"
      :checkable="false"
      :filters="filters"
      :pagination="pagination"
      @operate="operateHandler"
      :tableData="handleTableData"
      @filter-data-change="filterDataChangeHandler "
      @selection-change="selectionChangeHandler "
      @row-click="rowOperationClickHandler"
      @size-change="pageSizeChange "
      @current-change="currentPageChange"
      @cascader-change="cascaderChange"
    >
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
      <el-table-column prop="fullName" label="分类" class-name="first-category-name"></el-table-column>
      <el-table-column prop="platformTags" label="平台标签" class-name="first-category-name">
        <template slot-scope="scope">
          <div>
            <span class="platform-tags" v-for="(item, index) in scope.row.platformTags" :key="index">{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="storeTags" label="店铺标签" class-name="first-category-name">
        <template slot-scope="scope">
          <div>
            <span class="platform-tags" v-for="(item, index) in scope.row.storeTags" :key="index">{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="memberTags" label="会员标签" class-name="first-category-name">
        <template slot-scope="scope">
          <div>
            <span class="platform-tags" v-for="(item, index) in scope.row.memberTags" :key="index">{{item.name}}</span>
          </div>
        </template>
      </el-table-column> -->
    </biz-flex-table>
    <div slot="float">
      <tag-mgmt-pop :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></tag-mgmt-pop>
    </div>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import TagMgmtPop from './TagMgmtPop';
import { ImportFile } from '@/components/BizUpload';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'tag-mgmt',
  data() {
    return {
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
      itemId: { id: '' },
      selections: [],
      open: false,
      loading: false,
      tableData: [
        { name: '哈哈哈', platTag: '咨询文章', shopTag: '咨询文章', memberTag: '说明说过' },
        { name: '哈哈哈', platTag: '咨询文章', shopTag: '咨询文章', memberTag: '说明说过' }
      ],
      operations: [
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
          type: 'cascader',
          label: '分类',
          name: 'searchValue',
          changeOnSelect: true,
          filterable: false,
          value: [],
          options: []
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
  props: {},
  components: { BizFlexTable, BizGrid, TagMgmtPop, ImportFile },
  computed: {
    handleTableData() {
      let table = this.tableData;
      table.forEach(element => {
        if (element.platformTags) {
          element.platformTags.forEach((item, index) => {
            if (index !== element.platformTags.length - 1) {
              item.name += '、';
            }
          });
        }

        if (element.storeTags) {
          element.storeTags.forEach((item, index) => {
            if (index !== element.storeTags.length - 1) {
              item.name += '、';
            }
          });
        }

        if (element.memberTags) {
          element.memberTags.forEach((item, index) => {
            if (index !== element.memberTags.length - 1) {
              item.name += '、';
            }
          });
        }
      });
      return table;
    }
  },
  watch: {},
  methods: {
    cascaderChange(value) {
      console.log(value);
      this.pagination.currentPage = 1;
      this.tagCatrgoryId = value[value.length - 1];
      this.getList();
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
            this.getTagList();
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
    download() {
      window.open('/upload/mode/V服爱车_标签导入模板.xlsx');
    },
    import() {},
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
      this.getList();
    },
    refresh() {
      this.getList();
    },
    getList() {
      this.loading = true;
      let param = {
        tagCategoryId: this.tagCatrgoryId,
        pageNumber: this.pagination.currentPage.toString(),
        pageSize: this.pagination.pageSize.toString(),
        searchValue: this.filters[0].value
      };

      http
        .get(urls.systemSetting.tagMgList, param)
        .then(data => {
          console.log('标签管理列表', data);
          this.loading = false;
          this.tableData = data.content;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
        })
        .catch(error => {
          this.loading = false;
          console.log(error.errorMessage);
        });
    },
    operateHandler(name) {
      console.log('operate');
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      console.log('pageSizeChange');
      this.getList();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      console.log('currentPageChange');
      this.getList();
    },
    selectionChangeHandler(val) {
      console.log('selectionChange');
      this.selections = val;
    },
    filterDataChangeHandler() {
      console.log('filterDataChange');
      this.pagination.currentPage = 1;
      this.getList();
    },
    rowOperationClickHandler(model) {
      console.log(model);
      this.itemId = { id: model.id };
      this.open = true;
    },
    deleteHandler(e, model) {
      let deleteId = this.getDeleteTagId(model);
      this.deleteItem([deleteId]);
      e.stopPropagation();
      e.preventDefault();
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
          .delete(urls.systemSetting.deleteTag, param)
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
    getTagClassList() {
      this.loading = true;
      let param = {
        tagCatrgoryId: ''
      };

      http
        .get(urls.systemSetting.getTagCategories, param)
        .then(data => {
          console.log('系统标签分类管理', data);
          this.loading = false;
          let ary = data.content;
          let obj;
          this.filters[0].options = [];
          obj = {};
          obj.label = '全部';
          obj.value = '';
          this.filters[0].options.push(obj);
          ary.forEach(element => {
            obj = {};
            obj.label = element.name;
            obj.value = element.id;
            this.filters[0].options.push(obj);

            if (element.children && element.children.length) {
              obj.children = [];
              element.children.forEach(elementOne => {
                let objOne = {};
                objOne.label = elementOne.name;
                objOne.value = elementOne.id;
                obj.children.push(objOne);

                if (elementOne.children && elementOne.children.length) {
                  objOne.children = [];
                  elementOne.children.forEach(elementTwo => {
                    let objTwo = {};
                    objTwo.label = elementTwo.name;
                    objTwo.value = elementTwo.id;
                    objOne.children.push(objTwo);

                    if (elementTwo.children && elementTwo.children.length) {
                      objTwo.children = [];
                      elementTwo.children.forEach(elementThree => {
                        let objThree = {};
                        objThree.label = elementThree.name;
                        objThree.value = elementThree.id;
                        objTwo.children.push(objThree);
                      });
                    }
                  });
                }
              });
            }
          });
        })
        .catch(() => {})
        .finally(() => {});
    }
  },
  created() {
    this.getList();
    this.getTagClassList();
  }
};
</script>

<style lang="scss">
.tag-mgmt {
  .platform-tags {
    display: block;
    float: left;
  }
}
</style>
