<template>
  <div class="promotion-mgmt-list-view">
    <BizList :height="height" :tableData="promotionList" @handleSelectionChange="handleSelectionChange" @rowClick="rowClick"
      @sort-change="handleSortChange">
      <el-table-column type="selection" :selectable="canEdited" width="50"></el-table-column>
      <el-table-column label="活动信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.title}}
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
              {{scope.row.shopData.name?scope.row.shopData.name:'--'}}
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
            <el-button type="text" size="mini" @click.stop="Revocation(scope.row)" v-if="canRevocationed(scope.row)&&hasAuthCommit">撤回
            </el-button>
            <el-button type="text" size="mini" @click.stop="remove(scope.row)" v-if="canEdited(scope.row)&&hasAuthDel">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </BizList>
  </div>
</template>

<script>
import { BizList } from '@/components/BizTable';
import PromotionMgmtService from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'PromotionMgmtListView',
  data() {
    return {
      user: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  props: {
    height: String,
    promotionList: Array
  },
  mixins: [ColumnsMixin],
  components: { BizList },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:promotion.delete');
    },
    hasAuthPublish() {
      // return true;
      return this.currentAuth.includes('admin:promotion.publish');
    },
    hasAuthUnPublish() {
      // return true;
      return this.currentAuth.includes('admin:promotion.unpublish');
    },
    hasAuthCommit() {
      // return true;
      return this.currentAuth.includes('admin:promotion.commit');
    }
  },
  created() {},
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
            type: '9'
          };
          activityMgmtService.submit(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '提交审核成功!'
              });
              this.$emit('deleted');
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
            type: '9',
            state: '1'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '通过审核成功!'
              });
              this.$emit('deleted');
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
            type: '9',
            state: '0'
          };
          activityMgmtService.PassOrNot(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '取消审核成功!'
              });
              this.$emit('deleted');
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
    // 发布活动
    Publish(row) {
      this.$confirm('是否确认发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        };
        http
          .post('/admin/promotion/publish.jhtml', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.$emit('deleted');
          })
          .catch(ErrorData => {
            this.$message({
              type: 'warning',
              message: ErrorData.errorMessage
            });
          });
      });
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
          PromotionMgmtService.RevocationPromotion(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '撤回成功!'
              });
              this.$emit('deleted');
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
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value);
    },
    handleSortChange(value) {
      this.$emit('handleSortChange', value);
    },
    rowClick(val) {
      // if (val.isSubmit === '0' && val.consanguinity === '2') {
      //   this.$emit('rowClick', val);
      // }
      this.$emit('rowClick', val);
    },
    handleSizeChange() {},
    handleCurrentChange() {},
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
          PromotionMgmtService.deletePromotionList(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('deleted');
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
    typeFilterHandler(value, row) {
      return row.promotionType === value;
    },
    stateFilterHandler(value, row) {
      return row.state === value;
    },
    getType(row) {
      switch (row.typeStr) {
        case '0':
          return '包邮';
        case '1':
          return '优惠券';
        case '2':
          return '促销';
        case '3':
          return '满减';
        case '4':
          return '折扣';
        case '5':
          return '满送';
        case '6':
          return '套餐';
        case '7':
          return '会员价';
        default:
          return '';
      }
    },
    stateColor(row) {
      if (row.stateStr === '1' || row.stateStr === '4') {
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
          return '进行中';
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
.promotion-mgmt-list-view {
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
