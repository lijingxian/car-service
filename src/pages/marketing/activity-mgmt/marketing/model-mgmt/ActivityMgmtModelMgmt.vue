<template>
  <biz-grid class="activity-mgmt-model-mgmt">
    <div slot="top">
      <biz-header :operations="operations"
                  @operate="operate"
                  :filters="filters"
                  @filterDataChange="filterDataChange">
      </biz-header>
    </div>
    <div class="model-list">
      <activity-model-item v-for="activityModel of activityModelList"
                           :key="activityModel.id"
                           :activity="activityModel"
                           @select="select"
                           @remove="remove">
      </activity-model-item>
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
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import ActivityModelItem from './ActivityModelItem';
import Service from '@/service/activity-mgmt/marketing/model-mgmt/activityMgmtModelMgmt';
import { BizGrid } from '@/components/BizGrid';

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
    ActivityModelItem,
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

      Service.getList(
        params,
        data => {
          this.activityModelList = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
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
          Service.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
            }
          );
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
