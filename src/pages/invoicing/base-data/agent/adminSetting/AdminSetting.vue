<template>
  <div class="admin-mgmt">
    <biz-flex-table
      ref="table"
      :operations="operations"
      :filters="filters"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @operate="handleOperate"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
    >
      <el-table-column label="用户" prop="name">
        <div slot-scope="scope">
          <div class="customer-info">
            <img :src="scope.row.head ? scope.row.head : Img" alt />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="isEnabled" label="状态" min-width="80">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.isEnabled === '1' ? '启用' : '停用' }}</span>
        </template>
      </el-table-column>
      <!-- 最后登录地址 -->
      <el-table-column min-width="100" prop="loginAddress" label="最后登录地址">
        <template slot-scope="scope">{{ scope.row.loginAddress === 'null' ? '' : scope.row.loginAddress }}</template>
      </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column min-width="150" prop="loginDate" label="最后登录日期" sortable="custom"></el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="handleAdminDelete($event, scope.row)">删除</el-button>
            <el-button type="text" size="mini" v-if="scope.row.opeateState==='0'" @click.stop="handleAdminSetting($event, scope.row)">设置为管理员</el-button>
            <el-button type="text" size="mini" v-if="scope.row.opeateState==='1'" :disabled="true">已设置</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <biz-popup-tabs :open="openBaseInfo" @close="openBaseInfo = false;" v-model="tabNameBase">
        <el-tab-pane label="基本信息" name="0">
          <new-user :itemId="itemId" :masterId="masterId" :isEdit="isEdit" @operationSuccess="handleOperationSuccessNew"></new-user>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="选择已注册用户" name="1">
          <platform-user :itemId="itemId" ref="platformUser" @operationSuccess="handleOperationSuccessPlat"></platform-user>
        </el-tab-pane>
        <el-tab-pane label="注册新用户" name="2">
          <new-user :itemId="itemId" :masterId="masterId" ref="newUser" @operationSuccess="handleOperationSuccessNew"></new-user>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import PlatformUser from './PlatformUserInfo';
import NewUser from './NewUserInfo';
import Img from '@/assets/images/default_user.png';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

// 基础属性
const dataBase = {
  // 控件
  itemId: { id: '' },
  masterId: '',
  role: {
    id: '',
    name: '',
    type: ''
  },
  selections: [],
  Img: Img,
  tabName: '1',
  tabNameBase: '0',
  isEdit: true,
  // 右侧弹窗
  open: false,
  openBaseInfo: false
};
// Table相关
const dataTable = {
  loading: false,
  tableData: [],
  operations: [
    {
      label: '添加管理员',
      name: 'add',
      type: 'primary'
    },
    {
      label: '刷新',
      name: 'refresh',
      type: ''
    },
    {
      label: '返回',
      name: 'back',
      type: ''
    }
  ],
  filters: [
    {
      type: 'select',
      placeholder: '请选择状态',
      label: '状态',
      value: '',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '停用', value: '0' }
      ]
    },
    {
      type: 'input',
      label: '',
      placeholder: '请输入姓名/手机号',
      name: 'searchValue',
      value: ''
    }
  ],
  pagination: {
    pageSize: 20,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    total: 0
  }
};

// 方法
const methods = {
  // 查询
  getQueryParams() {
    return {
      shopId: window.top.SHOP_ID || '',
      cooperationType: '1',
      cooperationId: this.$route.query.cooperationId,
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.currentPage,
      searchValue: this.filters[1].value,
      isEnabled: this.filters[0].value
    };
  },
  query() {
    this.loading = true;
    http
      .get(urls.invoicing.supplierMgmt.adminList, this.getQueryParams())
      .then(data => {
        this.loading = false;
        this.tableData = [];
        data.dataList.map(item => {
          if (item.opeateState === '1') {
            this.tableData.push(item);
          }
        });
        this.pagination.total = Number(data.total);
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  // 状态文字颜色
  stateColor(row) {
    if (row.isEnabled === '1') {
      // 启用
      return '#11AE17';
    } else {
      // 停用
      return '#FF7300';
    }
  },
  refresh() {
    this.query();
  },
  // 添加
  add() {
    this.itemId = { id: '' };
    this.masterId = '';
    this.tabName = '1';
    this.$refs.platformUser.clearSearchValue();
    this.$refs.platformUser.refresh();
    this.$refs.newUser.resetModel();
    this.open = true;
  },
  back() {
    this.$router.go(-1);
  }
};

// 事件
const events = {
  handleOperationSuccessNew(val, nVal) {
    this.itemId = { id: String(val) };
    this.masterId = String(nVal);
    this.query();
  },
  handleOperationSuccessPlat(val, nVal) {
    this.query();
  },
  handleOperate(name) {
    this[name]();
  },
  handlePageSizeChange(val) {
    this.pagination.pageSize = val;
    this.pagination.currentPage = 1;
    this.query();
  },
  handleCurrentPageChange(val) {
    this.pagination.currentPage = val;
    this.query();
  },
  handleFilterDataChange() {
    this.query();
  },
  handleRowClick(model, e, column) {
    this.itemId = { id: String(model.id) };
    this.masterId = model.masterId;
    this.tabNameBase = '0';
    this.openBaseInfo = true;
    this.isEdit = false;
  },
  getRole() {
    http
      .get('/admin/role/getRoleByType.jhtml', {
        roleType: 'agent'
      })
      .then(data => {
        this.role = data.data;
      })
      .catch(errData => {
        console.log(errData);
        console.log('code错误');
        if (errData.errorMessage) this.$message.warning(errData.errorMessage);
      });
  },
  handleAdminSetting(e, model) {
    this.loading = true;
    let params = {
      id: model.id,
      roleIds: [this.role.id],
      shop: { id: window.top.SHOP_ID || '' },
      compy: { id: window.Company_ID || '' },
      agent: { id: this.$route.query.cooperationId }
    };
    http
      .post(urls.invoicing.supplierMgmt.transfer, params)
      .then(data => {
        this.loading = false;
        this.$message.success('管理员设置成功');
        this.refresh();
      })
      .catch(ErrorData => {
        this.loading = false;
        this.$message({
          message: ErrorData.errorMessage,
          type: 'warning'
        });
      })
      .finally(data => {
        this.loading = false;
      });
  },
  handleAdminDelete(e, model) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      let params = {
        ids: [model.id],
        cooperationId: this.$route.query.cooperationId
      };
      http
        .delete('/admin/cooperationInfo/mgmt/admin.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }
};

export default {
  name: 'SupplierMgmt',
  components: {
    BizFlexTable,
    BizPopupTabs,
    PlatformUser,
    NewUser
  },
  props: {},
  data() {
    return {
      ...dataBase,
      ...dataTable
    };
  },
  methods: {
    ...mapGetters(['getUser']),

    ...methods,
    ...events
  },
  created() {
    this.query();
    this.getRole();
  }
};
</script>

<style lang="scss">
.admin-mgmt {
  img {
    height: 40px;
    width: 40px;
  }
  .biz-popup .popup-content {
    width: 600px;
  }
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
          font-size: 24px;
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
