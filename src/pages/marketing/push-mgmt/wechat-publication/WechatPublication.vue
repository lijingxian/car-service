<template>
  <div class="content-mgmt-wechat-publication">
    <biz-grid>
      <biz-header
        slot="top"
        :operations="operations"
        :filters="filters"
        @operate="operate"
        @filter-data-change="filterDataChange"
      >
      </biz-header>
      <!-- 瀑布流Masonry Layout -->
      <div class="wechat-list-area">
        <div class="columns" v-for="count in columnCount" :key="count">
          <wechat-preview
            v-for="(list, index) in tableData"
            v-if="(index - count + 1) % columnCount === 0"
            :key="list.index"
            :date="list.createDate"
            :previewList="list.newsList"
            :isReadOnly="true"
            @card-click="cardClick"
          ></wechat-preview>
        </div>
        <div class="no-content" v-if="tableData.length === 0" :style="styleObject"></div>
      </div>
      <biz-pagination
        slot="bottom"
        v-if="pagination"

        :pagination="pagination"

        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></biz-pagination>
    </biz-grid>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="推送到微信" name="first">
        <base-info @update="refresh" :itemId="itemId"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import WechatPreview from '../components/WechatPreview';
import BaseInfo from './WechatPublicationBaseInfo';
import date from '@/utils/date';
import NoContent from '@/assets/images/emptyGray.png';
// import NoContent from '@/assets/images/iphone-b.png';

import service from '@/service/content-mgmt/WechatPublication';

export default {
  name: 'WechatPublication',
  data () {
    return {
      clientWidth: document.documentElement.clientWidth,
      open: false,
      tabName: 'first',
      itemId: { id: '' },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      beginDate: '',
      endDate: '',
      filters: [
        {
          label: '日期区间',
          type: 'daterange',
          value: [date.lastMonthDate(), date.nowDate()]
          // value: this.dateRange
        },
        {
          label: '公众号',
          type: 'select',
          placeholder: '请选择公众号',
          name: 'wechat',
          value: '',
          options: []
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
      // 预览数据
      form: {
        title: '',
        author: '',
        content: ''
      },
      multiSelected: [],
      stateFilter: [
        { text: '未发布', value: '0' },
        { text: '已发布', value: '1' }
      ]
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 按钮'添加'
    add() {
      this.$router.push({
        path: '/marketing/recommend/wechat-create'
      });
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
      }).then(() => {
        let params = {
          ids: ids
        };
        service.delete(
          params,
          data => {
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ERR_DELETE: ', ErrorData);
          }
        );
      });
    },
    // 过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    cardClick(id) {
      this.itemId = { id: id };
      this.open = true;
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
          this.filters[1].options = data.wechatDataList.map(wechat => {
            return { value: wechat.id, label: wechat.showName };
          });
          this.filters[1].value = this.filters[1].options[0].value;
        },
        ErrorData => {}
      );
    },
    refresh() {
      let params = {
        shopId: window.top.SHOP_ID,
        beginTime: this.filters[0].value[0] || '',
        endTime: this.filters[0].value[1] || '',
        wechatOpenId: this.filters[1].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      service.query(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
    },
    // 文章预览
    preview(id) {
      this.queryArticle(id);
    },
    queryArticle(id) {
      let params = {
        id: id
      };
      service.queryBaseInfo(
        params,
        data => {
          this.form.title = data.article.title;
          this.form.author = data.article.author;
          this.form.content = data.article.content;
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_PREVIEW: ', ErrorData);
        }
      );
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 页面改变大小时触发
    handleResize() {
      this.clientWidth = document.documentElement.clientWidth;
    }
  },
  computed: {
    dateRange: {
      get() {
        return [this.beginDate, this.endDate];
      },
      set(newValue) {
        console.log('dateRange: ', newValue);
        // newVal = []
        if (newValue.length) {
          this.beginDate = newValue[0];
          this.endDate = newValue[1];
        } else {
          this.beginDate = '';
          this.endDate = '';
        }
      }
    },
    columnCount() {
      return Math.floor(Number(this.clientWidth) / 400);
    },
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / auto 200px no-repeat'
      };
    },
    previewList() {
      let tmp = [];
      this.tableData.map(data => {
        if (this.multiSelected.indexOf(data.id) !== -1) {
          tmp.push(data);
        }
      });
      return tmp;
    }
  },
  created() {
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize());
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    this.queryList();
  },
  watch: {},
  components: {
    BizPopupTabs,
    BizHeader,
    BizPagination,
    WechatPreview,
    BizGrid,
    BaseInfo
  }
};
</script>

<style lang="scss">
.content-mgmt-wechat-publication {
  height: 100%;
  .wechat-list-area {
    width: 100%;
    display: flex;
    // flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    .columns {
      width: 400px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .wechat-preview {
      // display: inline-block;
      margin: 0 7.5px;
      width: 385px;
    }
  }
  // .wechat-list-area {
  //   width: 100%;
  //   height: 100%;
  //   // column-count: calc(1*100% / 270);
  //   column-gap: 0;
  //   .wechat-preview {
  //     break-inside: avoid;
  //     margin: 0 15px 15px 15px;
  //   }
  // }
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
