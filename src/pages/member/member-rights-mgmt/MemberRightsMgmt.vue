<template>
  <div class="member-rights-mgmt">
    <biz-flex-table :loading="loading" ref="table" :operations="operations" @operate="operate" :tableData="tableData" :pagination="pagination"
      @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column width="180" prop="name" label="权益分类">
        <div slot-scope="scope" @click.stop="classClick(scope.row.id)">
          <span style="margin-left:5px">{{ scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column label="对应权益" prop="rights">
        <div slot-scope="scope" style="width:100%">
          <biz-column-table :dataList="scope.row.rights" :id="scope.row.id" @addButtonClick="addButtonClick" @rightsIconHandeler="rightsIconHandeler"
            @deleteRights="deleteRights">
          </biz-column-table>
        </div>
      </el-table-column>
      <el-table-column width="100" prop="date" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="deleteRightsClass(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
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
      <el-tab-pane label="权益券" name="rightscoupon">
        <rights-coupon-info ref="rightscoupon" :classId="classId" :rightsId="rightsId" @operationSuccess="operationSuccess">
        </rights-coupon-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>
<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BizColumnTable from './components/BizColumnTable';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import ClassBaseInfo from './ClassBaseInfo';
import RightsBaseInfo from './RightsBaseInfo';
import RightsCouponInfo from './RightsCouponInfo';
export default {
  name: 'memberRightsMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      classId: '',
      rightsId: '',
      popupTabName: 'baseinfo',
      openClass: false,
      openRights: false,
      multipleSelection: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
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
    BizFlexTable,
    BizColumnTable,
    ClassBaseInfo,
    RightsBaseInfo,
    RightsCouponInfo
  },
  created() {
    this.refresh();
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
      this.getList();
    },
    createRights(rightsId) {
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
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
    add() {
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
