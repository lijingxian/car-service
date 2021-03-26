<template>
  <div class="qa-mgmt">
    <biz-flex-table ref="table" :operations="operations" :filters="filters" @operate="operate" :tableData="tableData"
      :loading="loading" :pagination="pagination" @row-click="rowClick" @size-change="handleSizeChange"
      @selection-change="handleSelectionChange" @filter-data-change="filterDataChange" @current-change="handleCurrentChange">
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
          :showProcess="showProcess" :action="'/admin/knowledge/importKnowledge.jhtml'" :name="'uFile'"
          @handle-import="handleImport" style="margin-left: 10px;" ref="importFile">
          <el-table-column label="编号" width="50" prop="row">
          </el-table-column>
          <el-table-column label="状态" width="150" prop="result">
          </el-table-column>
          <el-table-column label="信息" prop="message">
          </el-table-column>
        </import-file>
      </template>
      <el-table-column prop="name" label="问答名称">
      </el-table-column>
      <el-table-column width="220" prop="question" label="问题">
        <div slot-scope="scope">
          <div class="overflow">{{scope.row.question}}</div>
          <div class="overflow">
            {{scope.row.similarQuestion&&scope.row.similarQuestion.length > 0 ? scope.row.similarQuestion[0] : ''}}</div>
          <div class="overflow">
            {{scope.row.similarQuestion&&scope.row.similarQuestion.length > 1 ? scope.row.similarQuestion[1] : ''}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="matchMode" label="匹配方式" :formatter="getMatchMode" width="100">
      </el-table-column>
      <el-table-column prop="answer" label="答案" width="120">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.type==='1'" v-html="scope.row.answer">
          </div>
          <div class="biz-customcol" v-if="scope.row.type==='3'">
            <img :src="scope.row.answer" height="80px">
          </div>
          <div class="biz-customcol" v-if="scope.row.type==='0'||scope.row.type==='2'||scope.row.type==='1001'">
            {{scope.row.answer}}
          </div>
          <div class="biz-customcol" v-if="scope.row.type==='1002'">
            <audio :src="scope.row.answer" height="80px" controls></audio>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="getType" width="100">
      </el-table-column>
      <!-- <el-table-column prop="state" label="状态">
      </el-table-column> -->
      <el-table-column prop="count" label="访问次数">
      </el-table-column>
      <el-table-column prop="date" label="最近访问时间" width="180">
      </el-table-column>
      <el-table-column prop="date" label="变更时间" width="180">
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs :open="open" @close="open = false" v-model="tabName">
      <el-tab-pane label="基本信息" name="info">
        <QaMgmtDetail :itemId="itemId" @created="refresh" ref="info"></QaMgmtDetail>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openSetting" @close="openSetting = false" v-model="tabSettingName"
      v-if="getUser().roleLevel === 'shop'">
      <el-tab-pane label="开场词设置" name="info">
        <OpenRemarks :itemId="itemId" ref="openRemarks"></OpenRemarks>
      </el-tab-pane>
      <el-tab-pane label="召回词设置" name="return">
        <RecallWords :itemId="itemId"></RecallWords>
      </el-tab-pane>
      <el-tab-pane label="指代词设置" name="pronounWords">
        <PronounWords></PronounWords>
      </el-tab-pane>
      <el-tab-pane label="关键字设置" name="keyWords">
        <KeyWords></KeyWords>
      </el-tab-pane>
    </biz-popup-tabs>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import QaMgmtDetail from './QaMgmtDetail';
import OpenRemarks from './OpenRemarks';
import RecallWords from './RecallWords';
import PronounWords from './PronounWords';
import KeyWords from './KeyWords';
import { mapGetters } from 'vuex';
import { BizPopupTabs } from '@/components/BizPopup';
import { ImportFile } from '@/components/BizUpload';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'QaMgmt',
  data() {
    return {
      tabName: 'info',
      tabSettingName: 'info',
      itemId: '',
      loading: false,
      open: false,
      openSetting: false,
      importLoading: false,
      disabled: false,
      showProcess: false,
      total: 0,
      count: 0,
      stepkey: '',
      selections: [],
      tableData: [],
      importResult: [],
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
          label: '导出',
          name: 'exportStart',
          type: ''
        },
        {
          label: '设置',
          name: 'setting',
          type: '',
          class: 'hidden'
        },
        {
          label: '模板下载',
          name: 'download',
          type: ''
        }
      ],
      taskId: '',
      t: '',
      percentage: 0,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'input',
          placeholder: '请输入问题关键字',
          name: 'searchbar',
          value: ''
        }
      ]
    };
  },
  components: {
    BizFlexTable,
    QaMgmtDetail,
    BizPopupTabs,
    ImportFile,
    OpenRemarks,
    RecallWords,
    KeyWords,
    PronounWords,
    ExportFileNew
  },
  created() {
    this.getList();
    this.handleImport();
    if (this.getUser().roleLevel === 'shop') {
      this.operations[3].class = 'show';
    }
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
      this.handleImport();
    }
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    download() {
      window.open('/upload/mode/V服爱车_知识库导入模板.xlsx');
    },
    exportStart() {
      let ids = [];
      if (this.selections && this.selections.length > 0) {
        this.selections.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[0].value
      };
      http
        .post('/admin/knowledge/exportKnowledgeStart.jhtml', params)
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
        let response = await axios.get('/admin/knowledge/exportKnowledgeResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    add() {
      this.itemId = '';
      this.$refs.info.clear();
      this.open = true;
    },
    setting() {
      this.tabSettingName = 'info';
      this.openSetting = true;
    },
    rowClick(model, e, column) {
      this.itemId = model.id;
      this.open = true;
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      http
        .get(customerService.smartReception.importProgress, {})
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
          } else {
            this.$refs.importFile.uploadingVisible = false;
          }
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '纯文本';
        case '1':
          return '富文本';
        case '3':
          return '图片';
        case '2':
          return '超链接';
        case '1002':
          return '音频';
        case '1001':
          return '商品';
        case '1004':
          return '功能';
        case '1005':
          return '活动';
        default:
          break;
      }
    },
    getMatchMode(row) {
      switch (row.matchMode) {
        case '0':
          return '模糊';
        case '1':
          return '精准';
        default:
          break;
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
          .delete(customerService.smartReception.knowledgeStock, {
            ids: ids
          })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
            this.loading = false;
          })
          .catch(errData => {
            this.loading = false;
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(data => {
            this.loading = false;
          });
      });
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
        .get(customerService.smartReception.knowledges, params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    filterDataChange(val) {
      // this.filters = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.qa-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .overflow {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 80px;
    .el-button {
      margin-left: 10px;
    }
    img {
      height: 80px;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
