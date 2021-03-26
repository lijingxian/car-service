<template>
  <biz-grid class="question-answer-release">
    <div slot="top">
      <biz-header :operations="operations"
                  @operate="operate"
                  :filters="filters"
                  @filterDataChange="filterDataChange">
      </biz-header>
    </div>
    <div class="container">
      <biz-empty-table v-if="topicList.length === 0"></biz-empty-table>
      <div class="topic-list">
        <div v-for="(topicItem,index) of topicList"
              :key="topicItem.id">
          <topic-item @deleteTopic="deleteTopic"
                      @selectTopic="selectTopic"
                      @updated="updateTopicList"
                      :topic="topicItem">
          </topic-item>
          <div class="line"
                v-if="!(index+1 === topicList.length)"></div>
        </div>
      </div>
    </div>
    <div slot="float">
      <div class="m-pagination" v-if="topicList.length">
        <biz-pagination :pagination="topicPagination"
                        @handleSizeChange="handleTopicSizeChange"
                        @handleCurrentChange="handleTopicCurrentChange">
        </biz-pagination>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup"
                      v-model="popupTabName"
                      @close="onClose" class="popup-tab">
        <el-tab-pane v-if="isActivate('columnSetting')"
                    label="栏目设置"
                    name="columnSetting">
          <column-setting :refresh="refreshColumn"></column-setting>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('topicDetail')&&!addTopic"
                    label="问答详情"
                    name="topicDetail">
          <topic :topic="topic"
                :spaces="spaces"
                :ref="topic"
                @change-thumb-up="changeThumbUp"
                @updateTopic="updateTopic">

          </topic>
        </el-tab-pane>
        <el-tab-pane v-if="isActivate('topicDetail')"
                    label="问答编辑"
                    name="topicEditor">
          <dynamic :motoristsClubList="motoristsClubList"
                  ref="dynamic"
                  @created="refresh"
                  :id="topicId"
                  :author="dynamicAuthor" infoType="2">
          </dynamic>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <dynamic-preview :open.sync="previewDialog"
                     :dynamicId="dynamicId"
                     :author="dynamicAuthor">
    </dynamic-preview>
  </biz-grid>
</template>

<script>
import Dynamic from '../motorists-club-dynamic/Dynamic';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizPagination } from '@/components/BizTable';
import date from '@/utils/date';
import TopicItem from '../motorists-club-dynamic/TopicItem';
import Topic from '../motorists-club-dynamic/Topic';
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DynamicPreview from '../motorists-club-dynamic/DynamicPreview';
import BizEmptyTable from '../motorists-club-dynamic/BizEmptyTable';
import emoji from '@/utils/emoji';
import ColumnSetting from '../motorists-club-dynamic/ColumnSetting';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'question-answer-release',
  data() {
    return {
      refreshColumn: false,
      addTopic: false,
      dynamicAuthor: '',
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
      previewDialog: false,
      activeName: 'dynamic-list',
      popupTabName: 'dynamicDetail',
      popupTabAreaName: 'dynamicDetail',
      topicList: [],
      topicPagination: {
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
          auth: ['admin:space.topic.add']
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
          auth: ['admin:space.topic.set']
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
      textarea: '',
      visible: false,
      checked: false,
      logoImageUrl: ''
    };
  },
  components: {
    Dynamic,
    BizPopupTabs,
    BizHeader,
    Topic,
    TopicItem,
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
    this.getTopicList();
    this.getKPI();
  },
  computed: {
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
      this.addTopic = false;
      this.refreshColumn = false;
    },
    columnSetting() {
      console.log('栏目设置');
      this.popupTabName = 'columnSetting';
      this.popupTabAreaName = 'columnSetting';
      this.refreshColumn = true;
      this.openPopup = true;
    },
    updateTopicList() {
      this.getTopicList();
    },
    isActivate(name) {
      return this.popupTabAreaName === name;
    },
    updateTopic() {
      this.getTopic();
    },
    initDate() {
      this.filters[1].value[0] = date.lastMonthDate();
      this.filters[1].value[1] = date.nowDate();
    },
    openpusharticle() {
      this.visible = true;
    },
    emojiChoosed(key) {
      this.textarea = this.textarea.concat(key);
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
    filterDataChange: async function() {
      await this.refresh();
    },
    add() {
      if (this.motoristsClubList.length === 0) {
        this.$message({
          type: 'warning',
          message: '车友会为空，不能新建！'
        });
        return;
      }
      this.addTopic = true;
      this.topicId = '';
      this.popupTabName = 'topicEditor';
      this.popupTabAreaName = 'topicDetail';
      this.openPopup = true;
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
    // 删除话题
    deleteTopic(topicId) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(topicId);
          let params = {
            ids: ids
          };
          DynamicService.deleteTopic(
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
        })
        .catch(() => {});
    },
    resize() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 246);
    },
    selectTopic(topicId) {
      this.topicId = topicId;
      this.addTopic = false;
      this.popupTabAreaName = 'topicDetail';
      this.popupTabName = 'topicEditor';
      this.$nextTick(() => {
        this.$refs.dynamic.refresh(this.topicId);
      });
      this.openPopup = true;
      this.getTopic();
    },
    handleTopicSizeChange(val) {
      this.topicPagination.pageSize = val;
      this.getTopicList();
    },
    handleTopicCurrentChange(val) {
      this.topicPagination.currentPage = val;
      this.getTopicList();
    },
    // 刷新数据
    refresh() {
      this.getTopicList();
      this.openPopup = false;
      this.$refs.dynamic.clearForm();
    },
    // 查看话题数据
    getTopic() {
      let params = {
        topicId: this.topicId
      };
      DynamicService.selectTopic(
        params,
        data => {
          this.topic = data.data;
          this.spaces = data.spaces;
          for (let iterator of this.spaces) {
            iterator.content = emoji.transform(iterator.content);
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 获取话题列表
    getTopicList() {
      let params = {
        pageable: {
          pageNumber: this.topicPagination.currentPage,
          pageSize: this.topicPagination.pageSize
        },
        keyword: this.filters[2].value,
        shopId: window.top.SHOP_ID || '',
        fleetId: this.filters[0].value,
        memberId: '',
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1]
      };
      DynamicService.getTopicList(
        params,
        data => {
          this.topicPagination.total = Number(data.total || 1);
          this.topicList = data.content;
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
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
    },
    changeThumbUp() {
      this.getTopic();
    }
  }
};
</script>

<style lang="scss">
.popup-tab{
  .el-tabs--border-card > .el-tabs__header{
    min-height: 39px;
  }
  .el-tabs__content{
    overflow-y: auto;
  }
}
.question-answer-release {
  padding: 0 15px;
  height: 100%;
  overflow-y: auto;
  .el-tabs__nav{
    height: 39px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .biz-save-button {
    margin-top: 10px;
  }

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

  .container{
    min-height: 630px;
    position: relative;
    .topic-list {
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
    margin: 20px 0 0 10px;
  }
}

.motorists-club-dynamic-kpi {
  top: 45px;
}
</style>
