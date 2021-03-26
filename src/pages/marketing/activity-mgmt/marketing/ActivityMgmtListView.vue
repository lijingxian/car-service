<template>
  <div class="activity-mgmt-list-view">
    <BizList
      ref="table"
      :tableData="activityList"
      :height="height"
      @handleSelectionChange="handleSelectionChange"
      @rowClick="rowClick"
      @filterChange="filterChange"
      @sort-change="sortChange"
    >
    <el-table-column type="selection" :selectable="canEdited" width="50"></el-table-column>
      <el-table-column label="活动信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.title}}
            </div>
            <div class="overflow">
              类型：{{getType(scope.row)}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{getState(scope.row)}}</span>
            </div>
            <div class="overflow">
              创建时间：{{scope.row.createDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.beginDate?scope.row.beginDate:'--'}}
            </div>
            <div class="overflow">
              {{scope.row.endDate?scope.row.endDate:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shopname?scope.row.shopname:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="Submit(scope.row)" v-if="canSubmited(scope.row)&&hasAuthCommit">提交</el-button>
            <el-button type="text" size="mini" @click.stop="Pass(scope.row)" v-if="canPassed(scope.row)&&hasAuthCommit">通过</el-button>
            <el-button type="text" size="mini" @click.stop="Cancel(scope.row)" v-if="canCancel(scope.row)&&hasAuthCommit">取消</el-button>
            <el-button type="text" size="mini" @click.stop="Publish(scope.row)" v-if="canPublished(scope.row)&&hasAuthPublish">发布</el-button>
            <el-button type="text" size="mini" @click.stop="Revocation(scope.row)" v-if="canRevocationed(scope.row)&&hasAuthCommit">撤回</el-button>
            <el-button type="text" size="mini" @click.stop="remove(scope.row)" v-if="canEdited(scope.row)&&hasAuthDel">删除</el-button>
            <el-button type="text" size="mini" @click.stop="UnPublish(scope.row)" v-if="scope.row.stateStr==='0'">取消发布</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </BizList>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BizList } from '@/components/BizTable';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'ActivityMgmtListView',
  data() {
    return {
      user: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      typeFilters: [
        { text: '抢红包', value: '0' },
        { text: '摇一摇', value: '1' },
        { text: '抽奖', value: '2' },
        { text: '拼团购', value: '3' },
        { text: 'N元抢购', value: '4' },
        { text: '限时秒杀', value: '5' },
        { text: '帮砍价', value: '6' },
        { text: '推荐有礼', value: '7' },
        { text: '分享有礼', value: '8' },
        { text: '活动招募', value: '9' },
        { text: '潜客活动', value: '11' },
        { text: '推广活动', value: '12' }
      ],
      stateFilters: [
        { text: '未开始', value: '0' },
        { text: '进行中', value: '1' },
        { text: '已结束', value: '2' },
        { text: '已创建', value: '3' }
      ]
    };
  },
  props: {
    height: String,
    activityList: Array
  },
  components: { BizList },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:activity.delete');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:activity.unpublish');
    },
    hasAuthCommit() {
      // return true;
      return this.currentAuth.includes('admin:activity.commit');
    }
  },
  created() {},
  mixins: [ColumnsMixin],
  methods: {
    // 可以提交审核操作
    canSubmited(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.deliverable === '1' : false) : false;
    },
    // 可以通过审核
    canPassed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.passable === '1' : false) : false;
    },
    // 可以取消审核
    canCancel(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.cancelable === '1' : false) : false;
    },
    // 可以发布活动
    canPublished(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.publishable === '1' : false) : false;
    },
    // 可以撤回
    canRevocationed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.revocable === '1' : false) : false;
    },
    // 可以删除、更新
    canEdited(row) {
      return row.unionConfig ? row.unionConfig.editable === '1' : false;
    },
    // 取消发布
    UnPublish(row) {
      this.$confirm('是否确认取消发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id
          };
          this.loading = true;
          http
            .post('/admin/marketing/cancelPublish.jhtml', params)
            .then(data => {
              this.$message({
                type: 'success',
                message: '取消发布成功!'
              });
              this.loading = false;
              this.$emit('created');
            })
            .catch(ErrorData => {
              this.loading = false;
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
            });
        })
        .catch(() => {});
    },
    // 提交审核
    Submit(row) {
      this.$confirm('是否确认提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3'
          };
          activityMgmtService.submit(
            params,
            data => {
              this.$message.success('提交审核成功!');
              this.$emit('created');
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 通过审核
    Pass(row) {
      this.$confirm('是否确认通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3',
            state: '1'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message.success('通过审核成功!');
              this.$emit('created');
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 取消审核
    Cancel(row) {
      this.$confirm('是否确认取消审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            eventId: row.id,
            unionStore: row.unionStore,
            mainStore: row.mainStore,
            type: '3',
            state: '0'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message.success('取消审核成功!');
              this.$emit('created');
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 发布活动
    Publish(row) {
      this.$confirm('是否确认发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id
          };
          this.loading = true;
          http
            .post('/admin/marketing/publish.jhtml', params)
            .then(data => {
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
              this.loading = false;
              this.$emit('created');
            })
            .catch(ErrorData => {
              this.loading = false;
              this.$message({
                type: 'warning',
                message: ErrorData.errorMessage
              });
            });
        })
        .catch(() => {});
    },
    // 撤回
    Revocation(row) {
      this.$confirm('是否确认撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id
          };
          activityMgmtService.Revocation(
            params,
            data => {
              this.$message.success('撤回成功!');
              this.$emit('created');
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value);
    },
    // 对可编辑进行校验
    rowClick(val) {
      // if (val.isSubmit === '0' && val.consanguinity === '2') {
      //   this.$emit('rowClick', val);
      // }
      this.$emit('rowClick', val);
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    filterChange() {
      this.pagination.currentPage = 1;
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    remove(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          let params = {
            ids: ids
          };
          activityMgmtService.deleteActivity(
            params,
            data => {
              this.$message.success('删除成功!');
              this.$emit('created');
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    typeFilterHandler(value, row) {
      return row.type === value;
    },
    stateFilterHandler(value, row) {
      return row.state === value;
    },
    sortChange(params) {
      this.$emit('sort-change', params);
    },
    getType(row) {
      switch (row.typeStr) {
        case '0':
          return '抢红包';
        case '1':
          return '摇一摇';
        case '2':
          return '抽奖';
        case '3':
          return '拼团购';
        case '4':
          return 'N元抢购';
        case '5':
          return '限时秒杀';
        case '6':
          return '帮砍价';
        case '7':
          return '推荐有礼';
        case '8':
          return '分享有礼';
        case '9':
          return '活动招募';
        case '11':
          return '潜客活动';
        default:
          break;
      }
    },
    stateColor(row) {
      if (row.stateStr === '1') {
        if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
          return '#FF7300';
        } else if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
          return '#11AE17';
        } else {
          return '#11AE17';
        }
      } else if (row.stateStr === '4') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getState(row) {
      switch (row.stateStr) {
        case '0':
          return '未开始';
        case '1':
          if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
            return '进行中';
          } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
            return '已结束';
          } else {
            return '进行中';
          }
        case '2':
          return '已结束';
        case '3':
          return '已创建';
        case '4':
          return '已提交';
        case '5':
          return '已取消';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-list-view {
  padding-right: 15px;
  height: 100%;
  overflow: auto;
  padding-right: 15px;
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .biz-list {
    height: 100%;
    .operate-btn-group {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
