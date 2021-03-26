<template>
  <biz-grid class="supplier-mgmt__platform-info" v-loading="loading">
    <div slot="top">
      <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
    </div>
    <biz-list ref="table" :tableData="tableData" :key="Math.random()" :height="'100%'">
      <el-table-column prop="name" label="用户">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.name}}</div>
              <div class="mobile">
                <span>{{scope.row.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" v-if="scope.row.opeateState === '0'" @click="addHandeler(scope.row)">添加为管理员
            </el-button>
            <el-button type="text" size="mini" v-if="scope.row.opeateState === '1'" @click="deleteHandeler(scope.row.masterId)">移除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizList from '@/components/BizTable/BizList';
import BizPagination from '@/components/BizTable/BizPagination';
import BizFilter from '@/components/BizTable/BizFilter';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'SupplierPlatformInfo',
  components: {
    BizGrid,
    BizList,
    BizPagination,
    BizFilter
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableDataAdmin: [],
      role: {
        id: '',
        name: '',
        type: ''
      },
      filters: [
        {
          type: 'input',
          placeholder: '请输入用户姓名/电话',
          name: 'searchbar',
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
  },
  props: {},
  mounted() {
    this.getRole();
  },
  methods: {
    ...mapGetters(['getUser']),
    filterDataChange(val) {
      this.filters = val;
      this.getList();
    },
    clearSearchValue() {
      this.filters[0].value = '';
    },
    deleteHandeler(id) {
      // 删除管理员
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          masterIds: Array(id)
        };
        http
          .delete('/admin/admin/mgmt/admin.jhtml', params)
          .then(data => {
            this.$message.success('操作成功');
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            this.$message.error(errData.errorMessage);
          });
      });
    },
    getList() {
      this.loading = true;
      let params = {
        companyId: window.Company_ID || '',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value,
        position: 'agent'
      };
      http
        .get(urls.invoicing.supplierMgmt.adminByKeyword, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    // 获取角色列表
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
    addHandeler(row) {
      this.loading = true;
      let params = {
        id: row.id,
        roleIds: [this.role.id],
        shop: { id: this.getUser().shop.id, name: this.getUser().shop.name },
        compy: { id: this.getUser().compy.id, name: this.getUser().compy.name },
        agent: { id: this.$route.query.cooperationId }
      };
      http
        .post(urls.invoicing.supplierMgmt.transfer, params)
        .then(data => {
          this.loading = false;
          this.$message.success('添加成功');
          this.getList();
          this.$emit('operationSuccess', data.id, data.masterId);
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
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '1',
        cooperationId: this.$route.query.cooperationId,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
    },
    // 刷新列表
    refresh() {
      this.loading = true;
      http
        .get(urls.invoicing.supplierMgmt.adminList, this.getQueryParams())
        .then(data => {
          this.loading = false;
          this.tableData = [];
          data.dataList.map(item => {
            if (item.opeateState === '0') {
              this.tableData.push(item);
            }
          });
          this.pagination.total = Number(this.tableData.length);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.supplier-mgmt__platform-info {
  .biz-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
  .biz-table-filter {
    float: right;
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
      .mobile {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
