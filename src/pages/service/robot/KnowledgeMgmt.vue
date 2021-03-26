<template>
  <div class="cs-knowledge-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <template slot="operation" v-if="hasAuthImport">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
          :action="'/admin/cs/importKnowledge.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport"
          style="margin-left: 10px;">
          <el-table-column label="编号" prop="line" width="50"></el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
          <!-- <el-table-column label="操作">
          </el-table-column>-->
        </import-file>
      </template>
      <el-table-column prop="parentCategory.name" label="类别"></el-table-column>
      <el-table-column prop="childCategory.name" label="子类别"></el-table-column>
      <el-table-column prop="question" label="关键字"></el-table-column>
      <el-table-column prop="answer" label="客服答案"></el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <item :activatedObj="activedK" :KFatherTypeList="KFatherTypeList" @created="getKList"></item>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openSetting" @close="openSetting = false;" v-model="tabName">
      <el-tab-pane label="回复设置" name="setting">
        <reply-setting></reply-setting>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import { ExportFileNew } from '@/components/BizUpload';
import { BizPopupTabs } from '@/components/BizPopup';
import { ImportFile } from '@/components/BizUpload';
import Item from './KnowledgeItem';
import { mapGetters } from 'vuex';
import ReplySetting from './ReplySetting';
import RobotService from '@/service/customer-service/robot/robot';
import http from '@/common/http';
import axios from 'axios';
export default {
  name: 'KnowledgeMgmt',
  data() {
    return {
      importResult: [],
      importLoading: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      loading: false,
      disabled: false,
      tabName: 'first',
      open: false,
      openSetting: false,
      tableData: [],
      KFatherTypeList: [],
      activedK: {},
      selectedList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      operations: [
        { label: '新增', name: 'createItem', type: 'primary', auth: ['admin:knowledgeBase.add'] },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:knowledgeBase.delete']
        },
        {
          label: '导出',
          name: 'exportStart',
          type: '',
          auth: ['admin:knowledgeBase.export']
        },
        {
          label: '模版下载',
          name: 'download',
          type: ''
        },
        {
          label: '回复设置',
          name: 'replySetting',
          type: '',
          auth: ['admin:knowledgeBase.set']
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键字搜索',
          name: 'add',
          value: ''
        }
      ]
    };
  },
  components: { BizFlexTable, BizPopupTabs, Item, ImportFile, ReplySetting, ExportFileNew },
  created() {
    this.refresh();
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthImport() {
      return this.currentAuth.includes('admin:knowledgeBase.import');
    }
  },
  mounted() {
    // this.$message({
    //   showClose: true,
    //   message: '点击“添加”选择类别和子类别，填写问题及答案',
    //   type: 'info'
    // });
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    download() {
      window.open(
        '/upload/mode/V服爱车_知识库导入模板.xlsx'
      );
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    // 回复设置
    replySetting() {
      this.tabName = 'setting';
      this.openSetting = true;
    },
    handleImport() {
      let url = '/admin/cs/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          // if (!data.data.total) {
          //   this.total = 0;
          //   this.count = 0;
          //   this.stepkey = '';
          //   this.percentage = 0;
          // }
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
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
            this.getKList();
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
    exportStart() {
      let params = {
        keyWord: this.filters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .post('/admin/cs/exportAllStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/cs/exportAllResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getKFatherType();
    },
    getKFatherType() {
      let params = {};
      RobotService.getKFatherType(
        params,
        async data => {
          for (const iterator of data.list) {
            let res = await RobotService.getKSonType({ parentId: iterator.id });
            iterator.list = res.data.list;
          }
          this.KFatherTypeList = data.list;
          this.getKList();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getKList() {
      let params = {
        keyWord: this.filters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      RobotService.getKList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    delete() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.selectedList) {
            ids.push(iterator.id);
          }

          let params = {
            ids: ids
          };
          RobotService.deleteK(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    createItem() {
      this.tabName = 'first';
      this.open = true;
      this.activedK = { id: '' };
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getKFatherType();
    },
    rowClick(val) {
      this.activedK = { id: val.id };
      this.open = true;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    handleSelectionChange(val) {
      this.selectedList = val;
      this.operations.map(item => {
        if (item.name === 'delete') {
          item.disabled = true;
        }
        if (val.length > 0) {
          if (item.name === 'delete') {
            item.disabled = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.cs-knowledge-mgmt {
}
</style>
