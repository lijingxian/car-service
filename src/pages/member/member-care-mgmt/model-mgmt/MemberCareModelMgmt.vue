<template>
  <biz-grid class="activity-mgmt-model-mgmt">
    <div slot="top">
      <biz-header :operations="operations"
                  @operate="operate">
      </biz-header>
    </div>
    <div class="model-list">
      <member-care-model-item v-for="activityModel of activityModelList"
                           :key="activityModel.id"
                           :activity="activityModel"
                           @select="select"
                           @remove="remove">
      </member-care-model-item>
    </div>
    <div class="m-pagination"
         slot="bottom">
      <div class="limit-pagination">
        <biz-pagination :pagination="pagination"
                        @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange">
        </biz-pagination>
      </div>
    </div>
    <biz-popup-tabs :open="openPopup"
                    v-model="popupTabName"
                    @close="openPopup = false;">
      <el-tab-pane label="模板详情"
                   name="baseinfo">
        <base-info ref="baseInfo"
                   @created="refresh">
        </base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizPagination, BizHeader } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import MemberCareModelItem from './MemberCareModelItem';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
export default {
  name: 'ActivityMgmtModelMgmt',
  data() {
    return {
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      activityModelList: [],
      openPopup: false,
      popupTabName: 'baseinfo',
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '模板类型',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '营销活动', value: '0' }, { label: '促销活动', value: '1' }]
        }
      ]
    };
  },
  created() {
    this.refresh();
  },
  components: {
    BizHeader,
    BizPagination,
    BaseInfo,
    BizPopupTabs,
    MemberCareModelItem,
    BizGrid
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.$refs.baseInfo.clear();
      this.openPopup = true;
    },
    refresh() {
      let params = {
        type: this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/memberCareTemplate/list.jhtml', params)
        .then(data => {
          this.activityModelList = data.dataList;
        })
        .catch();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    select(activity) {
      console.log(123);
      this.$refs.baseInfo.refresh(activity);
      this.openPopup = true;
    },
    remove(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          http
            .delete('/admin/memberCareTemplate/template.jhtml', params)
            .then(data => {
              this.$message.success('删除成功');
              this.refresh();
            })
            .catch();
        })
        .catch(() => {});
    },
    filterDataChange() {
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-model-mgmt {
  .model-list {
    display: flex;
    flex-wrap: wrap;
    height:100%;
    overflow: auto;
  }
  .m-pagination {
    height: 40px;
    display: flex;
    justify-content: flex-end;
    padding-right: 4px;
    align-items: center;
    .limit-pagination {
      display: flex;
      justify-content: center;
    }
  }
  .el-tabs__content{
    overflow-y: auto;
  }
}
</style>
