<template>
  <div class="shop-publicity-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" :loading="loading"
      @filter-data-change="filterDataChange" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <!-- 表格内容 -->
      <el-table-column label="资讯信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.title}}
            </div>
            <div class="overflow">
              类型：{{getType(scope.row.articleType)}}
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
            <el-button size="mini" type="text" @click.stop="passCheck(scope.row.id)"
            v-if="hasAuthEdit&&scope.row.state === '4'">审核通过
          </el-button>
          <el-button size="mini" type="text" @click.stop="rejectCheck(scope.row.id)"
            v-if="hasAuthEdit&&scope.row.state === '4'">审核不通过
          </el-button>
          <el-button size="mini" type="text" @click.stop="publish(scope.row.id, Number(!Number(scope.row.isPublication)))"
            v-show="scope.row.state === '0' || scope.row.state === '1'"
            v-if="Number(scope.row.isPublication)?hasAuthUnPublish:hasAuthPublish">
            {{Number(scope.row.isPublication) ? '取消发布' : '发布'}}
          </el-button>
          <el-button size="mini" type="text" @click.stop="preview(scope.row.id)">预览</el-button>
          <el-button size="mini" type="text" style="width: 50px; color: red" @click.stop="del(scope.row.id)"
            v-show="scope.row.state === '0' || scope.row.state === '1'" v-if="hasAuthDel">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 预览 -->
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>
    <div slot="float">
      <right-popup ref="RightPopup" :open="open" :itemId="itemId" :itemState="itemState" articleType="0" @close="close"
        @item-change="handleItemChange" @operationSuccess="handleOperationSuccess"></right-popup>

      <ability-popup ref="AbilityPopup" :open="openAbility" :itemId="shopId" @close="closeAbility" @operationSuccess="closePopup">
      </ability-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import ArticlePreview from '../components/ArticlePreview';
import RightPopup from './ShopPublicity/ShopPublicityPopup';
import AbilityPopup from './ShopAbilitySetting/ShopAbilitySettingPopup';
import urls, { contentMgmt } from '@/common/urls';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import {
  mapGetters
  // mapMutations
} from 'vuex';

export default {
  name: 'ShopPublicity',
  data() {
    return {
      loading: false,
      open: false,
      itemId: {
        id: ''
      },
      itemState: '0',

      openAbility: false,
      shopId: { id: '' },

      // 预览
      previewDialog: false,
      showRecommend: false,
      tabName: 'first',
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:article.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:article.delete'] },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '批量审核通过', name: 'passCheck', type: 'primary', auth: ['admin:article.edit'] },
        { label: '设置', name: 'setting', type: 'primary', auth: ['admin:article.set'] }
      ],
      // '全部'选项
      selectAll: { value: '', label: '全部' },
      filters: [
        {
          label: '发布店铺',
          type: 'select',
          placeholder: '请选择店铺',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          value: '',
          class: 'hidden',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '已创建' },
            { value: '1', label: '已发布' },
            // { value: '2', label: '自动审核' },
            { value: '3', label: '审核通过' },
            { value: '4', label: '未审核' }
          ]
        },
        {
          type: 'daterange',
          label: '发布日期',
          name: 'publishDate',
          class: 'hidden',
          value: []
        },
        {
          type: 'input',
          placeholder: '请输入文章标题',
          name: 'searchbar',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      orderProperty: '',
      orderDirection: '',
      // 预览数据
      form: {
        title: '',
        author: '',
        content: '',
        contentUrl: ''
      },
      multiSelected: [],
      stateFilter: [{ text: '已创建', value: '0' }, { text: '已发布', value: '1' }]
    };
  },
  filters: {
    stateFilter(val) {
      switch (val) {
        case '0':
          return '已创建';
        case '1':
          return '已发布';
        // case '2':
        //   return '自动审核';
        case '3':
          return '审核通过';
        case '4':
          return '未审核';
      }
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    ...mapGetters(['getUser']),
    // ...mapMutations('ShopPublicity', [
    //   'updateArticleId',
    //   'updateArticleType',
    //   'updateIfReturn',
    //   'updateTimeRange',
    //   'updateArticleState'
    // ]),
    getType(val) {
      switch (val) {
        case '0':
          return '文章';
        case '2':
          return 'vr';
        case '3':
          return '视频';
      }
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    handleItemChange(item) {
      this.itemId = item;
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    handleOperationSuccess(e) {
      this.refresh();
    },
    stateColor(row) {
      if (row.state === '1' || row.state === '3') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    closePopup() {
      this.openAbility = false;
    },
    operate(name) {
      this[name]();
    },
    // 按钮'添加'
    add() {
      this.edit('');
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
    // 通过审批
    passCheck(id) {
      if (id) {
        this.doPassCheck([id]);
        return;
      }
      if (this.multiSelected && this.multiSelected.length > 0) {
        this.doPassCheck(this.multiSelected);
      } else {
        this.$message('请选择一条记录');
      }
    },
    // 设置
    setting() {
      this.itemId = { id: '' };
      this.openAbility = true;
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
      this.pagination.currentPage = 1;
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
      // this.updateArticleType('0');
      // this.updateTimeRange([
      //   this.filters[1].value[0],
      //   this.filters[1].value[1]
      // ]);
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
        articleType: '0',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        state: this.filters[1].value,
        searchValue: this.filters[3].value,
        shopId: window.top.SHOP_ID || '',
        searchShopId: this.filters[0].value,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection,
        beginTimeStr: this.filters[2].value[0],
        endTimeStr: this.filters[2].value[1]
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
          this.form.seoDescription = data.article.seoDescription;
          this.form.articleType = data.article.articleType;
          if (data.article.contentUrl && data.article.articleType === '1') {
            this.form.contentUrl =
              document.location.protocol +
              '//' +
              window.location.host +
              '/resources/admin/ecStatic/index.html#/icar-channel/vr?title=店铺Vr&url=' +
              document.location.protocol +
              '//' +
              window.location.host +
              data.article.contentUrl;
          } else if (data.article.contentUrl && data.article.articleType === '2') {
            this.form.contentUrlPreview =
              'resources/admin/ecStatic/index.html?#/icar-channel/vr?url=' +
              this.form.contentUrl +
              '&id=' +
              this.form.id +
              '/index.html';
          } else if (data.article.contentUrl && data.article.articleType === '3') {
            this.form.contentUrl = data.article.contentUrl;
          }
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
    },

    // 能力设置
    closeAbility() {
      this.openAbility = false;
    },

    // 设置审核通过
    doPassCheck(ids) {
      http
        .post(contentMgmt.publicity.check, {
          ids: ids,
          state: '1'
        })
        .then(data => {
          this.$message.success('设置成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_PREVIEW: ', ErrorData);
        });
    },
    rejectCheck(id) {
      http
        .post(contentMgmt.publicity.check, {
          ids: [id],
          state: '2'
        })
        .then(data => {
          this.$message.success('设置成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_PREVIEW: ', ErrorData);
        });
    },
    getShopList() {
      let param = {
        shopId: this.shopId.id
      };
      http
        .get(urls.shopRate.pushStores, param)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.content.map(shop => {
              return { label: shop.name, value: shop.id };
            })
          );
        })
        .catch(() => {});
    }
  },
  computed: {
    ...mapGetters('ShopPublicity', ['ifReturn', 'timeRange']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:article.edit');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:article.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:article.unpublish');
    },
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:activity.delete');
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  created() {
    this.getShopList();
  },
  mounted() {
    this.shopId = { id: this.getUser().shop.id || window.top.SHOP_ID || '' };
    this.showMessage('您可在此编辑店铺宣传的文章进行发布。', 'info');
    this.refresh();
  },
  watch: {},
  components: {
    BizFlexTable,
    ArticlePreview,
    RightPopup,
    AbilityPopup
  }
};
</script>

<style lang="scss">
.shop-publicity-mgmt {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
