<template>
  <div class="push-mgmt-wechat-create" v-loading="loading">
    <biz-grid>
      <biz-header
        slot="top"
        :operations="operations"
        :filters="filters"
        @operate="operate"
      >
      </biz-header>
      <!-- 瀑布流Masonry Layout -->
      <wechat-preview :previewList="wechatList" @add-new="add" @card-click="cardClick"></wechat-preview>
    </biz-grid>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="推送到微信" name="first">
        <base-info :itemId="itemId" @update="isUpdate = true"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <!-- 文章选择框 -->
    <biz-dialog-selector
      :loading="loading"
      :visibility.sync="showDialog"
      :tableData="articleList"
      :pagination="pagination"
      :filters="articleFilters"
      :selectionKeys="selectedItemKeys"
      @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange"
      @confirmed="confirm"
      @filterDataChange="filterDataChange"
    >
      <el-table-column property="title" label="标题"></el-table-column>
      <el-table-column property="author" label="发布者"></el-table-column>
      <el-table-column property="createDate" label="创建时间"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import WechatPreview from '../components/WechatPreview';
import BaseInfo from './WechatCreateBaseInfo';
import BizDialogSelector from '@/components/BizDialogSelector';
import { contentMgmt } from '@/common/urls';
import http from '@/common/http';

import service from '@/service/content-mgmt/WechatPublication';

export default {
  name: 'WechatPublication',
  data () {
    return {
      loading: false,
      isUpdate: false,
      // dialog start
      showDialog: false,
      articleList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      articleFilters: [
        {
          label: '推送内容类型',
          type: 'select',
          value: '0',
          options: [
            { value: '0', label: '软文宣传' }
          ]
        },
        {
          type: 'input',
          placeholder: '请输入标题',
          name: 'searchbar',
          value: ''
        }
      ],
      selectedItemKeys: [],
      // dialog end
      wechatList: [],
      open: false,
      tabName: 'first',
      itemId: { id: '' },
      operations: [
        {
          label: '推送',
          name: 'publish',
          type: 'primary'
        },
        {
          label: '放弃',
          name: 'abandon',
          type: 'primary'
        },
        {
          label: '返回',
          name: 'back',
          type: 'primary'
        }
      ],
      filters: [
        {
          label: '推送公众号',
          type: 'select',
          placeholder: '请选择公众号',
          name: 'wechat',
          value: '',
          options: []
        }
      ]
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 推送
    publish() {
      if (this.wechatList.length > 8) {
        this.$message.warning('推送文章数量不得超过8篇');
        return;
      }
      if (this.wechatList.length === 0) {
        this.$message.warning('没有推送文章');
        return;
      }
      this.loading = true;
      let params = {
        ids: this.selectedItemKeys,
        wechatOpenId: this.filters[0].value
      };
      http.post(contentMgmt.WechatPublication_publish, params)
        .then(data => {
          this.$message.success('操作成功');
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 放弃
    abandon() {
      this.selectedItemKeys = [];
      this.wechatList = [];
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 添加
    add() {
      this.articleFilters[1].value = '';
      this.showDialog = true;
    },
    // 点击卡片
    cardClick(id) {
      this.itemId = { id: id };
      this.open = true;
    },
    // 查询文章列表
    queryArticleList() {
      let params = {
        articleType: '0',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        state: '1',
        searchValue: this.articleFilters[1].value
      };
      this.loading = true;
      http.get(contentMgmt.publicity.queryList, params)
        .then(data => {
          this.loading = false;
          this.articleList = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
      this.queryArticleList();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryArticleList();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryArticleList();
    },
    // dialog确认
    confirm(keys) {
      this.selectedItemKeys = keys || this.selectedItemKeys;
      http.post(contentMgmt.ShopPublicity_queryList, { ids: this.selectedItemKeys })
        .then(data => {
          this.wechatList = data.content;
        })
        .catch();
    },
    close() {
      this.open = false;
    },
    // 查询公众号列表
    queryList() {
      let params = {
        shopId: window.top.SHOP_ID
      };
      service.queryWechatList(
        params,
        data => {
          this.filters[0].options = data.wechatDataList.map(wechat => {
            return { value: wechat.id, label: wechat.showName };
          });
          this.filters[0].value = this.filters[0].options[0].value;
        },
        ErrorData => {}
      );
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
  computed: {},
  created() {},
  beforeDestroy() {},
  mounted() {
    this.queryList();
  },
  watch: {
    wechatList: {
      handler: function(newVal, oldVal) {
        this.selectedItemKeys = newVal.map(wechat => {
          return wechat.id;
        });
      },
      deep: true
    },
    showDialog(newVal, oldVal) {
      if (newVal) {
        this.queryArticleList();
      }
    },
    open(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.confirm();
        this.isUpdate = false;
      }
    }
  },
  components: {
    BizPopupTabs,
    BizHeader,
    WechatPreview,
    BizGrid,
    BaseInfo,
    BizDialogSelector
  }
};
</script>

<style lang="scss">
.push-mgmt-wechat-create {
  height: 100%;
  .wechat-preview {
    // display: inline-block;
    margin:20px;
    width: 500px;
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
