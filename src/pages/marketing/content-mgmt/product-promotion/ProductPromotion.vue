<template>
  <div class="product-promotion-mgmt">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" :loading="loading"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
      <!-- 表格内容 -->
      <el-table-column label="资讯信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.title}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{scope.row.state | stateFilter}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.publishDate?scope.row.publishDate:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.author?scope.row.author:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button size="mini" style="width: 50px;" type="text"
            @click.stop="publish(scope.row.id, Number(!Number(scope.row.isPublication)))"
            v-if="Number(scope.row.isPublication)?hasAuthUnPublish:hasAuthPublish">
            {{Number(scope.row.isPublication) ? '取消发布' : '发布'}}
          </el-button>
          <el-button size="mini" style="width: 50px;" type="text" @click.stop="preview(scope.row.id)">预览</el-button>
          <el-button size="mini" type="text" style="width: 50px; color: red" v-if="hasAuthDel" @click.stop="del(scope.row.id)">删除
          </el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 预览 -->
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>

    <div slot="float">
      <right-popup ref="RightPopup" :open="open" :itemId="itemId" :itemState="itemState" articleType="1" @close="close"
        @item-change="handleItemChange" @operationSuccess="handleOperationSuccess"></right-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import ArticlePreview from '../components/ArticlePreview';

import RightPopup from '../shop-publicity/ShopPublicity/ShopPublicityPopup';
import date from '@/utils/date';
import { contentMgmt } from '@/common/urls';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import {
  mapGetters
  // mapMutations
} from 'vuex';

export default {
  name: 'ProductPromotion',
  data() {
    return {
      loading: false,
      open: false,
      itemId: {
        id: ''
      },
      itemState: '0',

      // 预览
      previewDialog: false,
      tabName: 'first',
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:articleProduct.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:articleProduct.delete'] },
        { label: '刷新', name: 'refresh', type: '' }
      ],
      // '全部'选项
      selectAll: { value: '', label: '全部' },
      filters: [
        {
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          value: '',
          options: [{ value: '', label: '全部' }, { value: '0', label: '未发布' }, { value: '1', label: '已发布' }]
        },
        { type: 'daterange', label: '创建时间', value: [date.lastMonthDate(), date.nowDate()] },
        { type: 'input', placeholder: '请输入文章标题或发布店铺', name: 'searchbar', value: '' }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      // 预览数据
      form: {
        title: '',
        author: '',
        content: ''
      },
      multiSelected: [],
      stateFilter: [{ text: '未发布', value: '0' }, { text: '已发布', value: '1' }, { text: '未审核', value: '2' }, { text: '已审核', value: '3' }, { text: '自动通过', value: '4' }]
    };
  },
  filters: {
    stateFilter(val) {
      switch (val) {
        case '0':
          return '未发布';
        case '1':
          return '已发布';
        case '2':
          return '未审核';
        case '3':
          return '已审核';
        case '4':
          return '自动通过';
        default:
          break;
      }
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    // ...mapMutations('ShopPublicity', ['updateArticleId', 'updateArticleType', 'updateIfReturn', 'updateTimeRange', 'updateArticleState']),

    handleOperationSuccess(e) {
      this.refresh();
    },

    handleItemChange(item) {
      this.itemId = item;
    },

    operate(name) {
      this[name]();
    },
    // 按钮'添加'
    add() {
      this.edit('');
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 按钮'删除'
    del(id) {
      // 传入id为单个删除,否则为批量删除
      let ids = id ? Array(id) : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          this.loading = true;
          http
            .delete(contentMgmt.publicity.delete, params)
            .then(data => {
              this.loading = false;
              this.$message.success('操作成功');
              this.refresh();
            })
            .catch(ErrorData => {
              this.loading = false;
              this.$message.warning(ErrorData.errorMessage);
              console.log('ERR_DELETE: ', ErrorData);
            });
        })
        .catch();
    },
    // 按钮'发布'
    publish(id, state) {
      let params = {
        id: id,
        state: state
      };
      this.loading = true;
      http
        .post(contentMgmt.publicity.publish, params)
        .then(data => {
          this.loading = false;
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_PUBLISH_APP: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.filters = val;
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'del') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'del') {
            item.disabled = false;
          }
        });
      }
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    rowClick(row) {
      this.edit(row);
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 编辑
    edit(row) {
      // this.updateArticleId(row.id || '');
      // this.updateArticleState(row.isPublication);
      // this.updateArticleType('1');
      // this.updateTimeRange([this.filters[1].value[0], this.filters[1].value[1]]);
      // this.$router.push({
      //   path: '/marketing/marketing-mgmt/article-edit'
      // });

      this.itemId = { id: row.id };
      this.itemState = row.isPublication;
      this.open = true;
    },
    close() {
      this.open = false;
    },
    refresh() {
      let params = {
        articleType: '1',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        state: this.filters[0].value,
        beginTime: this.filters[1].value[0] || '',
        endTime: this.filters[1].value[1] || '',
        searchValue: this.filters[2].value,
        shopId: window.top.SHOP_ID || ''
      };
      this.loading = true;
      http
        .get(contentMgmt.publicity.queryList, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    // 文章预览
    preview(id) {
      this.queryArticle(id);
    },
    queryArticle(id) {
      let params = {
        id: id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(contentMgmt.publicity.editArticle.query, params)
        .then(data => {
          this.form.title = data.article.title;
          this.form.author = data.article.author;
          this.form.content = data.article.content;
          this.previewDialog = true;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_PREVIEW: ', ErrorData);
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  computed: {
    ...mapGetters('ShopPublicity', ['ifReturn', 'timeRange']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:articleProduct.edit');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:articleProduct.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:articleProduct.unpublish');
    },
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:articleProduct.delete');
    }
  },
  created() {
    if (this.ifReturn) {
      this.filters[1].value = this.timeRange;
      this.updateIfReturn(false);
    }
  },
  mounted() {
    this.showMessage('您可在此编辑商品推广的文章进行发布。', 'info');
    this.refresh();
  },
  watch: {},
  components: {
    BizFlexTable,
    ArticlePreview,
    RightPopup
  }
};
</script>

<style lang="scss">
.product-promotion-mgmt {
  height: 100%;
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 140px;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
}
</style>
