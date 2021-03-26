<template>
  <biz-grid class="unknow-problem-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="125px" size="small" v-loading="loading">
      <el-form-item label="相似问题" prop="question">
        <el-input v-model="question" disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="问题" prop="similarQuestion">
        <el-input placeholder="请选择问题" v-model="selectQuestion" disabled>
          <div slot="append" class="input-append">
            <el-button type="text" @click="addQuestion">
              <i class="iconfont iconfont biz-icon-liebiaoshitu"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 问题选择 -->
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialog" :tableData="questionList" :pagination="pagination"
      :filters="productFilters" :selectionMode="'single'" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange">
      <el-table-column width="200" prop="question" label="问题">
        <div slot-scope="scope">
          <div>{{scope.row.question}}</div>
          <div v-for="similarQuestion in scope.row.similarQuestion" :key="similarQuestion">{{similarQuestion}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="answer" label="答案">
        <div slot-scope="scope">
          <div class="biz-customcol" v-if="scope.row.type==='1'" v-html="scope.row.answer">
          </div>
          <div class="biz-customcol" v-if="scope.row.type==='2'">
            <img :src="scope.row.answer" height="100px">
          </div>
          <div class="biz-customcol" v-if="scope.row.type==='0'||scope.row.type==='3'">
            {{scope.row.answer}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="getType">
      </el-table-column>
      <!-- <el-table-column prop="state" label="状态">
      </el-table-column> -->
      <el-table-column prop="date" label="变更时间">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import BizDialogSelector from '@/components/BizDialogSelector';
export default {
  name: 'QaMgmtDetail',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      loading: false,
      isSetting: false,
      dialogLoading: false,
      showDialog: false,
      width: 320,
      videoType: 'video',
      selectQuestion: '',
      question: '',
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      rules: {
        question: [{ required: true, message: '请填写问题', trigger: 'blur' }]
      },
      form: {},
      questionList: [],
      selectedItemKeys: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
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
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  methods: {
    operate(name) {
      this[name]();
    },
    typeChange() {
      this.form.answer = '';
    },
    save() {
      if (!this.form.id) {
        this.$message.warning('请选择问题');
        return;
      }
      http
        .put(customerService.smartReception.knowledgeStock, this.form)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.deleteItem(this.itemId);
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    deleteItem(ids) {
      this.loading = true;
      http
        .delete(customerService.smartReception.knowledgeStock, {
          ids: [ids]
        })
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('created');
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
    },
    getType(row) {
      switch (row.type) {
        case '0':
          return '纯文本';
        case '1':
          return '富文本';
        case '2':
          return '图片';
        case '3':
          return '超链接';
        default:
          break;
      }
    },
    refresh(id) {
      this.loading = true;
      let params = { id: this.itemId || id };
      http
        .get(customerService.smartReception.knowledgeStock, params)
        .then(data => {
          this.loading = false;
          this.question = data.data.question;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 添加问题
    addQuestion() {
      this.queryQuestionList();
      this.showDialog = true;
    },
    // 查询问题列表
    queryQuestionList() {
      let params = {
        searchValue: this.productFilters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.dialogLoading = true;
      http
        .get(customerService.smartReception.knowledges, params)
        .then(data => {
          this.dialogLoading = false;
          this.questionList = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // dialog确认
    confirm(keys, key) {
      console.log(key);
      this.selectQuestion = key[0].question;
      let params = { id: key[0].id };
      http
        .get(customerService.smartReception.knowledgeStock, params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(data.data, {
            similarQuestion: data.data.similarQuestion.concat([this.question])
          });
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
      this.queryQuestionList();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryProductList();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryProductList();
    }
  },
  mounted() {},
  watch: {
    itemId(newVal, oldVal) {
      if (newVal) {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.unknow-problem-info {
  // .el-radio + .el-radio {
  //   margin-left: 20px;
  // }
  .biz-save-button {
    float: left;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .biz-grid {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
