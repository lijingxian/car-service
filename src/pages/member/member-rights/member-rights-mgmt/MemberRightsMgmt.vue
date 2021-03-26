<template>
  <biz-grid class="member-rights-mgmt">
    <div slot="top">
      <div class="member-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :views="views" @onSwitch="onViewSwitch">
        </biz-header>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <member-rights-list-view v-if="this.activedView==='list'" :cardList="tableData" :height="height"
        @created="refresh" @classClick="classClick" @rightsIconHandeler="rightsIconHandeler"
        @addButtonClick="addButtonClick" @deleteRights="deleteRights" @deleteRightsClass="deleteRightsClass">
      </member-rights-list-view>
      <member-rights-card-view v-show="this.activedView==='card'" :cardList="tableData"
        @deleteRights="deleteRights" @created="refresh" @rightsIconHandeler="rightsIconHandeler">
      </member-rights-card-view>
    </div>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <div slot="float">
      <biz-popup-tabs :open="openClass" v-model="popupTabName" @close="openClass = false;">
        <el-tab-pane label="基本信息" name="baseinfo">
          <class-base-info ref="baseinfo" :classId="classId" :open="openClass" @operationSuccess="operationSuccess">
          </class-base-info>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openRights" v-model="popupTabName" @close="openRights = false;">
        <el-tab-pane label="基本信息" name="baseinfo">
          <rights-base-info ref="baseinfo" :classId="classId" :rightsId="rightsId" @createRights="createRights">
          </rights-base-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>
<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import MemberRightsListView from './MemberRightsListView';
import MemberRightsCardView from './MemberRightsCardView';
import ClassBaseInfo from './ClassBaseInfo';
import RightsBaseInfo from './RightsBaseInfo';
export default {
  name: 'memberRightsMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      classId: '',
      height: '100%',
      rightsId: '',
      popupTabName: 'baseinfo',
      openClass: false,
      openRights: false,
      multipleSelection: [],
      operations: [
        {
          label: '新增分类',
          name: 'addCategory',
          type: 'primary'
        },
        {
          label: '新增权益',
          name: 'addRights',
          type: 'primary'
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      views: [
        {
          actived: false,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'card',
          title: '卡片视图'
        },
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizPagination,
    BizHeader,
    ClassBaseInfo,
    RightsBaseInfo,
    MemberRightsListView,
    MemberRightsCardView,
    BizGrid
  },
  created() {
    this.refresh();
  },
  computed: {
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
    }
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess(id) {
      if (id) {
        this.openClass = false;
      }
      this.getList();
    },
    onViewSwitch(name) {
      this.multipleSelection = [];
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
        }
      }
    },
    createRights(rightsId) {
      if (rightsId) {
        this.openRights = false;
      }
      this.rightsId = rightsId;
      this.getList();
    },
    getList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      service.vipRightsList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    // 批量操作-删除
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push('0_' + iterator.id);
          }
          let params = {
            ids: ids
          };
          service.deleteRights(
            params,
            data => {
              this.$message.success('删除成功!');
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 快捷操作-删除
    deleteRightsClass(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push('0_' + id);
          let params = {
            ids: ids
          };
          service.deleteRights(
            params,
            data => {
              this.$message.success('删除成功!');
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 删除
    deleteRights(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push('1_' + id);
          let params = {
            ids: ids
          };
          service.deleteRights(
            params,
            data => {
              this.$message.success('删除成功!');
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 添加推荐
    addCategory() {
      this.openClass = true;
      this.classId = '';
      this.popupTabName = 'baseinfo';
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    addRights() {
      this.popupTabName = 'baseinfo';
      this.classId = '';
      this.rightsId = '';
      this.openRights = true;
    },
    addButtonClick(id) {
      this.popupTabName = 'baseinfo';
      this.classId = id;
      this.rightsId = '';
      this.openRights = true;
    },
    rightsIconHandeler(brandId, id) {
      this.popupTabName = 'baseinfo';
      this.rightsId = id;
      this.openRights = true;
    },
    classClick(id) {
      this.popupTabName = 'baseinfo';
      this.classId = id;
      this.openClass = true;
    }
  }
};
</script>

<style lang="scss">
.member-rights-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .el-table .cell {
    display: initial!important;
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
