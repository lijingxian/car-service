<template>
  <biz-grid class="article-publish">
    <div slot="top">
      <biz-header :operations="operations"
                  @operate="operate"
                  :filters="filters"
                  @filterDataChange="filterDataChange">
      </biz-header>
    </div>
    <div class="container">
      <biz-empty-table v-if="dynamicList.length === 0"></biz-empty-table>
      <div class="article-list" v-else>
        <div v-for="(dynamic,index) of dynamicList"
            :key="dynamic.id">
          <dynamic-item @deleteDynamic="deleteDynamic"
                      @lookOver="lookOver"
                      @select="selectDynamic"
                      @reply="replyDynamic"
                      @update="refresh"
                      :isDelete="isDelete"
                      :dynamic.sync="dynamic">
          </dynamic-item>
          <div class="line" v-if="!(index+1 === dynamicList.length)">
          </div>
        </div>
      </div>
    </div>
    <div class="m-pagination" v-if="dynamicList.length" slot="bottom">
      <biz-pagination v-if="dynamicList.length" :pagination="dynamicPagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <dynamic-preview :open.sync="previewDialog"
                     :dynamicId="dynamicId"
                     :author="dynamicAuthor">
    </dynamic-preview>
    <div slot="float">
      <biz-popup-tabs :open="openPopup"
                      v-model="popupTabName"
                      @close="onClose">
        <el-tab-pane label="文章详情" name="dynamicDetail" v-if="isActivate('dynamicDetail')">
          <article-info :dynamicId="dynamicId" :dynamicAuthor="dynamicAuthor" @refresh="refresh"></article-info>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('columnSetting')"
                    label="栏目设置"
                    name="columnSetting">
          <column-setting :refresh="refreshColumn"></column-setting>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('dynamicComment')"
                    label="动态评论"
                    name="dynamicComment">
          <dynamic-comment :title="dynamicCommentTitle" @created="refresh"
                          :dynamicId="dynamicCommentId">
          </dynamic-comment>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import DynamicItem from '../motorists-club-dynamic/DynamicItem';
import ArticleInfo from './ArticleInfo';
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import BizEmptyTable from '../motorists-club-dynamic/BizEmptyTable';
import DynamicPreview from '../motorists-club-dynamic/DynamicPreview';
import { BizPopupTabs } from '@/components/BizPopup';
import date from '@/utils/date';
import ColumnSetting from '../motorists-club-dynamic/ColumnSetting';
import DynamicComment from '../motorists-club-dynamic/DynamicComment';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  name: 'article-publish',
  data() {
    return {
      dynamicCommentId: '',
      dynamicCommentTitle: '',
      refreshColumn: false,
      previewDialog: false,
      openPopup: false,
      popupTabName: 'dynamicDetail',
      dynamicId: '',
      dynamicAuthor: '',
      dynamicList: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:fleet.article.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '栏目设置',
          name: 'columnSetting',
          type: '',
          auth: ['admin:fleet.article.set']
        }
      ],
      filters: [
        {
          type: 'select',
          label: '车友会',
          name: 'add',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '发布时间：',
          name: '日期区间：',
          value: ['2017-12-12', '2018-02-12']
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入作者/标题进行',
          name: 'add',
          value: ''
        }
      ],
      dynamicPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  props: {},
  components: {
    BizHeader,
    BizPagination,
    DynamicItem,
    ArticleInfo,
    BizEmptyTable,
    BizPopupTabs,
    ColumnSetting,
    DynamicPreview,
    DynamicComment,
    BizGrid
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    isDelete() {
      return this.currentAuth.includes('admin:fleet.article.delete');
    }
  },
  watch: {},
  methods: {
    onClose() {
      this.dynamicId = '-1';
      this.openPopup = false;
      this.refreshColumn = false;
    },
    isActivate(name) {
      return this.popupTabName === name;
    },
    // 回复动态
    replyDynamic(id, title) {
      this.dynamicCommentId = id;
      this.dynamicCommentTitle = title;
      this.popupTabName = 'dynamicComment';
      this.popupTabAreaName = 'dynamicComment';
      this.openPopup = true;
    },
    operate(name) {
      this[name]();
    },
    filterDataChange() {
      this.dynamicPagination.currentPage = 1;
      this.refresh();
    },
    add() {
      this.dynamicId = '';
      this.popupTabName = 'dynamicDetail';
      this.openPopup = true;
    },
    columnSetting() {
      this.popupTabName = 'columnSetting';
      this.openPopup = true;
      this.refreshColumn = true;
    },
    refresh() {
      this.getDynamicList();
    },
    handleSizeChange(val) {
      this.dynamicPagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.dynamicPagination.currentPage = val;
      this.refresh();
    },
    // 获取文章列表
    getDynamicList() {
      let params = {
        pageable: {
          pageNumber: this.dynamicPagination.currentPage,
          pageSize: this.dynamicPagination.pageSize
        },
        shopId: window.top.SHOP_ID || '',
        fleetId: this.filters[0].value,
        memberId: '',
        repostType: '1',
        keyword: this.filters[2].value,
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1]
      };
      http
        .get(urls.motoristsClubDynamic.dynamicList, params)
        .then(data => {
          console.log('333', data);
          this.dynamicPagination.total = Number(data.total);
          this.dynamicList = data.content;
        })
        .catch(error => {
          console.log(error.errorMessage);
        });
    },
    // 获取车友会列表
    getMotoristsClub() {
      let params = {
        shopId: window.top.SHOP_ID
      };
      DynamicService.getMotoristsClub(
        params,
        data => {
          this.filters[0].options = [];
          this.filters[0].options.push({
            value: '',
            label: '全部'
          });
          for (const iterator of data.content) {
            this.filters[0].options.push({
              value: iterator.id,
              label: iterator.name
            });
          }
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 删除动态
    deleteDynamic(dynamicId) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(dynamicId);
        let params = {
          shopId: window.top.SHOP_ID || '',
          ids: ids
        };
        DynamicService.delete(
          params,
          data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refresh();
          },
          ErrorData => {
            this.$message({
              type: 'warning',
              message: ErrorData.errorMessage
            });
          }
        );
      });
    },
    // 查看
    lookOver({ id, author }) {
      this.dynamicId = id;
      this.dynamicAuthor = author;
      this.previewDialog = true;
    },
    selectDynamic({ id, author }) {
      this.dynamicId = id;
      this.dynamicAuthor = author;
      this.popupTabName = 'dynamicDetail';
      this.popupTabAreaName = 'dynamicDetail';
      this.openPopup = true;
    },
    initDate() {
      this.filters[1].value[0] = date.lastMonthDate();
      this.filters[1].value[1] = date.nowDate();
    }
  },
  created() {
    this.initDate();
    this.getMotoristsClub();
    this.getDynamicList();
  }
};
</script>

<style lang="scss">
.article-publish {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 30px;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .container{
    min-height: 630px;
    position: relative;
    .article-list {
      width: 906px;
      margin: 10px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .line {
        height: 1px;
        width: 100%;
        background-color: #eee;
      }
    }
  }
  .m-pagination {
    height: 40px;
    margin-left: 10px;
  }
}
</style>
