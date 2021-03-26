<template>
  <biz-grid class="motorists-club-dynamic">
    <div slot="top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
    </div>
    <div class="container">
      <biz-empty-table v-if="dynamicList.length === 0"></biz-empty-table>
      <div class="dynamic-list" v-else>
        <div v-for="(dynamic,index) of dynamicList" :key="dynamic.id">
          <dynamic-item
            @deleteDynamic="deleteDynamic"
            @lookOver="lookOver"
            @select="selectDynamic"
            @reply="replyDynamic"
            @update="refresh"
            :dynamic.sync="dynamic"
            :isDelete="isDelete"
          ></dynamic-item>
          <div class="line" v-if="!(index+1 === dynamicList.length)"></div>
        </div>
      </div>
    </div>
    <div class="m-pagination" v-if="dynamicList.length" slot="bottom">
      <biz-pagination
        v-show="activeName === 'dynamic-list'"
        :pagination="dynamicPagination"
        @handleSizeChange="handleDynamicSizeChange"
        @handleCurrentChange="handleDynamicCurrentChange"
      ></biz-pagination>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="onClose" class="tab-dynamic">
        <el-tab-pane v-if="isActivate('dynamicDetail')" label="动态详情" name="dynamicDetail">
          <dynamic :motoristsClubList="motoristsClubList" ref="dynamic" @created="refresh" :id="dynamicId" :author="dynamicAuthor"></dynamic>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('columnSetting')" label="栏目设置" name="columnSetting">
          <column-setting :refresh="refreshColumn"></column-setting>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('dynamicComment')" label="动态评论" name="dynamicComment">
          <dynamic-comment :title="dynamicCommentTitle" @created="refresh" :dynamicId="dynamicCommentId"></dynamic-comment>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <dynamic-preview :open.sync="previewDialog" :dynamicId="dynamicId" :author="dynamicAuthor"></dynamic-preview>
  </biz-grid>
</template>

<script>
import Dynamic from './Dynamic';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import date from '@/utils/date';
import DynamicItem from './DynamicItem';
import DynamicComment from './DynamicComment';
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DynamicPreview from './DynamicPreview';
import BizEmptyTable from './BizEmptyTable';
import emoji from '@/utils/emoji';
import ColumnSetting from './ColumnSetting';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  name: 'MotoristsClubDynamic',
  data() {
    return {
      refreshColumn: false,
      dynamicCommentTitle: '',
      dynamicCommentId: '',
      topicId: '',
      topic: {
        creator: {
          nickname: ''
        },
        fleet: {
          id: '',
          name: ''
        }
      },
      spaces: [],
      dynamicId: '',
      dynamicAuthor: '',
      previewDialog: false,
      activeName: 'dynamic-list',
      popupTabName: 'dynamicDetail',
      popupTabAreaName: 'dynamicDetail',
      dynamicList: [],
      dynamicPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:fleetSpace.add']
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
          auth: ['admin:fleetSpace.set']
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
      height: '600',
      openPopup: false,
      pictureList: [],
      visible: false,
      checked: false,
      logoImageUrl: ''
    };
  },
  components: {
    Dynamic,
    BizPopupTabs,
    BizHeader,
    DynamicItem,
    DynamicComment,
    BizPagination,
    DynamicPreview,
    BizEmptyTable,
    ColumnSetting,
    BizGrid
  },
  created() {
    this.resize();
    this.initDate();
    this.getMotoristsClub();
    this.getDynamicList();
    this.getKPI();
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    isDelete() {
      return this.currentAuth.includes('admin:fleetSpace.delete');
    },
    motoristsClubList() {
      let list = [];
      for (const iterator of this.filters[0].options) {
        if (iterator.value !== '') {
          list.push(iterator);
        }
      }
      return list;
    }
  },
  methods: {
    onClose() {
      this.openPopup = false;
      this.refreshColumn = false;
    },
    columnSetting() {
      console.log('栏目设置');
      this.popupTabName = 'columnSetting';
      this.popupTabAreaName = 'columnSetting';
      this.openPopup = true;
      this.refreshColumn = true;
    },
    isActivate(name) {
      return this.popupTabAreaName === name;
    },
    initDate() {
      this.filters[1].value[0] = date.lastMonthDate();
      this.filters[1].value[1] = date.nowDate();
    },
    openpusharticle() {
      this.visible = true;
    },
    uploadLogoSuccess(response, file) {
      this.logoImageUrl = file.url;
    },
    pictureUploadSuccess(response, file, fileList) {
      this.pictureList = fileList;
    },
    pictureRemoveSuccess(file, fileList) {
      this.pictureList = fileList;
    },
    beyondLimit() {
      this.$message({
        message: '最多只能上传9张图片',
        type: 'warning'
      });
    },
    operate(name) {
      this[name]();
    },
    filterDataChange() {
      this.dynamicPagination.currentPage = 1;
      this.refresh();
    },
    add() {
      if (this.motoristsClubList.length === 0) {
        this.$message({
          type: 'warning',
          message: '车友会为空，不能新建！'
        });
        return;
      }
      // 动态改变tab
      this.dynamicId = '';
      this.popupTabName = 'dynamicDetail';
      this.popupTabAreaName = 'dynamicDetail';
      this.$nextTick(() => {
        this.$refs.dynamic.clearForm();
        this.$refs.dynamic.operations[0].disabled = false;
        this.openPopup = true;
      });
    },
    // 查看KPI
    getKPI() {
      let params = {};
      DynamicService.getKPI(
        params,
        data => {
          let msg = '今日新增动态' + data.data.daySpaceCount + '条,今日新增话题' + data.data.dayTopicCount + '条。';
          this.$message({
            customClass: 'motorists-club-dynamic-kpi',
            showClose: true,
            message: msg
          });
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 搜索关键字
    searchKeyWord() {
      this.refresh();
    },
    // 查看
    lookOver({ id, author }) {
      this.dynamicId = id;
      this.dynamicAuthor = author;
      this.previewDialog = true;
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
    selectDynamic({ id, author }) {
      console.log(author);
      this.dynamicId = id;
      this.dynamicAuthor = author;
      this.popupTabName = 'dynamicDetail';
      this.popupTabAreaName = 'dynamicDetail';
      this.$nextTick(() => {
        this.$refs.dynamic.refresh(id);
      });
      this.openPopup = true;
    },
    // 回复动态
    replyDynamic(id, title) {
      this.dynamicCommentId = id;
      this.dynamicCommentTitle = title;
      this.popupTabName = 'dynamicComment';
      this.popupTabAreaName = 'dynamicComment';
      this.openPopup = true;
    },
    resize() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 246);
    },
    handleDynamicSizeChange(val) {
      this.dynamicPagination.pageSize = val;
      this.getDynamicList();
    },
    handleDynamicCurrentChange(val) {
      this.dynamicPagination.currentPage = val;
      this.getDynamicList();
    },
    // 刷新数据
    refresh() {
      this.getDynamicList();
      this.openPopup = false;
    },
    // 获取动态列表
    getDynamicList() {
      let params = {
        pageable: {
          pageNumber: this.dynamicPagination.currentPage,
          pageSize: this.dynamicPagination.pageSize
        },
        shopId: window.top.SHOP_ID || '',
        fleetId: this.filters[0].value,
        memberId: '',
        repostType: '',
        keyword: this.filters[2].value,
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1]
      };
      http
        .get(urls.motoristsClubDynamic.dynamicList, params)
        .then(data => {
          console.log(data);
          this.dynamicPagination.total = Number(data.total);
          this.dynamicList = data.content;
          for (let iterator of this.dynamicList) {
            iterator.content = emoji.transform(iterator.content);
          }
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
            label: '全部',
            head: ''
          });
          for (const iterator of data.content) {
            this.filters[0].options.push({
              value: iterator.id,
              label: iterator.name,
              head: iterator.head
            });
          }
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    }
  }
};
</script>

<style lang="scss">
.tab-dynamic {
  .el-tabs__content {
    overflow-y: auto;
  }
}
.motorists-club-dynamic {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px 35px 5px 15px;
  display: flex;
  flex-direction: column;
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .biz-save-button {
    margin-top: 10px;
  }

  .container {
    flex-grow: 2;
    width: 100%;
    min-height: 630px;
    position: relative;
    .dynamic-list {
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

.motorists-club-dynamic-kpi {
  top: 45px;
}
</style>
