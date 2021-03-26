<template>
  <biz-grid class="member-share-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <el-table :data="tableData" height="300" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="共享人员" prop="realName"></el-table-column>
      <el-table-column label="操作" prop="pointCount">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="cancle(scope.row)">
              取消共享
            </el-button>
          </div>
        </div>
      </el-table-column>
    </el-table>
    <!-- <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination> -->
    <!-- <div class="biz-pagination">
      <el-pagination :total="pagination.total" :current-page="pagination.currentPage" :page-size="pagination.pageSize"
        layout="total, prev, pager, next" @current-change="handleCurrentChange"></el-pagination>
    </div> -->
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :inline-message="true">
        <el-form-item label="共享人员" prop="totalPoint">
          <el-input v-model="formModel.memberName" :disabled="true" style="width:76%">
            <div slot="append" class="input-append">
              <el-button type="text" @click="queryPeople">
                <i class="iconfont biz-icon-man" style="font-size: 16px;color: #ff7300;padding-left:10px"></i>
              </el-button>
            </div>
          </el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
    <biz-dialog-selector title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'" :loading="dialogLoading"
      :tableData="dialogTableData" :pagination="dialogPagination" :selectionMode="'single'" :filters="dialogFilters"
      @confirmed="handleConfirmed" @operate="dialogOperate" @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange" class="memberDialog">
      <el-table-column prop="userName" label="用户信息" width="180px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.userName}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期"></el-table-column>
      <el-table-column prop="enableState" label="状态" :formatter="getStatus"></el-table-column>
      <el-table-column prop="shop.name" label="店铺名称">
        <div slot-scope="scope">
          <div>
            <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="最后登录地址"></el-table-column>
      <el-table-column prop="lastLoginDate" label="最后登录时间"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import BizDialogSelector from './components/BizDialogSelector';
import http from '@/common/http';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      showForm: false,
      level: '',
      aflevel: '',
      totalPoint: '',
      dialogVisible: false,
      dialogLoading: true,
      dialogTableData: [],
      selectionKeys: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/昵称/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      showDialog: false,
      // 用户信息
      formModel: {
        cardId: '',
        member: '',
        memberName: ''
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    if (this.itemId.id) this.getList();
  },
  watch: {
    'itemId.id'(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    add() {
      this.showForm = true;
      this.formModel.memberName = '';
    },
    handleConfirmed(selectionKeys, selections) {
      this.formModel.member = selections[0].id;
      this.formModel.memberName = selections[0].name;
    },
    queryPeople() {
      this.showDialog = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      service.queryPeople(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }

      return '';
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryPeople();
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryPeople();
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryPeople();
    },
    dialogOperate(name) {},
    getList() {
      this.loading = true;
      this.showForm = false;
      http
        .get('/admin/memberCardShare/share.jhtml', { cardId: this.itemId.id })
        .then(data => {
          this.tableData = data.shareData.memberList;
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
            member: this.formModel.member,
            cardId: this.itemId.id
          };
          http
            .put('/admin/memberCardShare/share.jhtml', params)
            .then(data => {
              this.$message.success('操作成功');
              this.getList();
              this.loading = false;
              this.showForm = false;
            })
            .catch(errData => {
              this.loading = false;
              console.log(errData);
              console.log('code错误');
              this.$message.warning(errData.errorMessage);
            });
        }
      });
    },
    cancle(row) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete('/admin/memberCardShare/break.jhtml', { cardId: this.itemId.id, member: row.id })
          .then(data => {
            this.$message.success('操作成功');
            this.getList();
          })
          .catch(errData => {
            this.loading = false;
            console.log(errData);
            console.log('code错误');
            this.$message.warning(errData.errorMessage);
          });
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    cancelForm() {
      this.showForm = false;
    }
  }
};
</script>

<style lang="scss">
.member-share-info {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .biz-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .el-table__body-wrapper .is-scrolling-none {
    overflow-x: auto;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .header_bean {
    position: absolute;
    left: 0px;
    top: 20px;
    color: #606266;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    div {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 150px;
      text-align: left;
      white-space: nowrap;
    }
  }
}
.memberDialog {
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
