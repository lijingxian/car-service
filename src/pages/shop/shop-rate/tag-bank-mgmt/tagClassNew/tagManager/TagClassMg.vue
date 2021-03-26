<template>
  <div class="tag-class-mg">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" :pagination="pagination" :tableData="tableDataHandle" :loading="loading" @operate="operateHandler" @size-change="pageSizeChange" @current-change="currentPageChange" @selection-change="selectionChangeHandler" @filter-data-change="filterDataChangeHandler" @row-click="rowOperationClickHandler" @cascader-change="cascaderChange">
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count" :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey" :action="'/admin/tag/importPlatformTag.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport" style="margin-left: 10px;">
          <el-table-column label="编号" prop="serialNo" width="50">
          </el-table-column>
          <el-table-column label="消息" prop="message">
          </el-table-column>
          <!-- <el-table-column label="操作">
          </el-table-column> -->
        </import-file>
        <div class="downloadButton">
          <el-button type="primary" size="small" @click="downloadTemplate">模板下载</el-button>
        </div>
      </template>
      <el-table-column prop="name" label="标签">
      </el-table-column>
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="tagCategory.name" label="分类">
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
      <tag-class-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess"></tag-class-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import TagClassPopup from './TagClassPopup';
import http from '@/common/http';
import urls from '@/common/urls';
import { ImportFile } from '@/components/BizUpload';
export default {
  name: 'tag-class-mg',
  data() {
    return {
      itemId: { id: '' },
      selections: [],
      open: false,
      loading: false,
      importResult: [],
      importLoading: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      disabled: false,
      tableData: [],
      tagCatrgoryId: '',
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
          type: 'cascader',
          label: '分类',
          name: 'searchValue',
          changeOnSelect: true,
          filterable: true,
          value: [],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入标签名称',
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
  props: {},
  components: { BizFlexTable, TagClassPopup, ImportFile },
  computed: {
    tableDataHandle() {
      this.tableData.forEach(element => {
        switch (element.type) {
          case '0':
            element.type = '文本型';
            break;
          case '1':
            element.type = '数值型';
            break;
          case '2':
            element.type = '浮点型';
            break;
          default:
            element.type = '文本型';
            break;
        }
      });

      return this.tableData;
    }
  },
  watch: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    downloadTemplate() {
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
    cascaderChange(value) {
      this.tagCatrgoryId = value[value.length - 1];
      this.getTagList();
    },
    add() {
      console.log('新增');
      this.itemId = { id: '' };
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
        this.$message('请选择一个分类');
      }
    },
    operationSuccess() {
      this.getTagList();
    },
    operateHandler(name) {
      console.log('operate');
      this[name]();
    },
    pageSizeChange(val) {
      console.log('pageSizeChange');
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getTagList();
    },
    currentPageChange(val) {
      console.log('currentPageChange');
      this.pagination.currentPage = val;
      this.getTagList();
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
      this.getTagList();
    },
    rowOperationClickHandler(model) {
      this.itemId = { id: model.id };
      this.open = true;
      console.log(this.itemId.id);
    },
    deleteHandler(e, model) {
      e.stopPropagation();
      this.deleteItem([model.id]);
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
          .delete(urls.systemSetting.updatePlatFormTag, param)
          .then(data => {
            console.log(data);
            this.loading = false;
            this.$message.success('删除成功');
            this.getTagList();
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {});
      });
    },
    getTagList() {
      this.loading = true;
      let param = {
        tagCatrgoryId: this.tagCatrgoryId,
        pageNumber: this.pagination.currentPage.toString(),
        pageSize: this.pagination.pageSize.toString(),
        searchValue: this.filters[1].value
      };

      http
        .get(urls.systemSetting.getPlatformTags, param)
        .then(data => {
          console.log('系统标签列表', data);
          this.loading = false;
          this.tableData = data.content;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
        })
        .catch(() => {})
        .finally(() => {});
    },
    getTagCategories() {
      let param = {
        searchValue: ''
      };

      http
        .get(urls.systemSetting.getTagCategories, param)
        .then(data => {
          console.log('系统标签分类管理 ', data);
          this.tableData = data.content;
        })
        .catch(() => {})
        .finally(() => {});
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
    this.getTagList();
    this.getTagClassList();
  }
};
</script>

<style lang="scss">
.tag-class-mg {
  .downloadButton {
    margin-left: 10px;
  }
}
</style>
