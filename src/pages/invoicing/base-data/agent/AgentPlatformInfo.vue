<template>
  <biz-grid class="agent-mgmt__platform-info" v-loading="loading">
    <div slot="top">
      <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
    </div>
    <biz-list
      ref="table"
      :tableData="tableData"
      :key="Math.random()"
      :height="'100%'"
    >
      <el-table-column prop="name" label="门店名称" min-width="100"></el-table-column>
      <el-table-column prop="address" label="地址" min-width="100"></el-table-column>
      <el-table-column prop="phone" label="电话" min-width="100"></el-table-column>
      <el-table-column prop="date" label="操作" type="index" min-width="100">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" v-if="scope.row.opeateState === '0'" @click="addHandeler(scope.row)">添加</el-button>
            <el-button type="text" size="mini" v-if="scope.row.opeateState === '1'" :disabled="true">已添加</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
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
  name: 'AgentPlatformInfo',
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
      filters: [
        {
          type: 'input',
          placeholder: '请输入门店名称',
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
  methods: {
    ...mapGetters(['getUser']),
    filterDataChange(val) {
      this.filters = val;
      this.getList();
    },
    clearSearchValue() {
      this.filters[0].value = '';
    },
    getList() {
      this.loading = true;
      let params = {
        cooperationType: '1',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value
      };
      http
        .get(urls.invoicing.supplierMgmt.storesByName, params)
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
    addHandeler(row) {
      this.loading = true;
      let params = {
        sourceShopId: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '1'
      };
      http
        .post(urls.invoicing.supplierMgmt.shopSupplier, params)
        .then(data => {
          this.loading = false;
          this.$message.success('添加成功');
          this.getList();
          this.$emit('operationSuccess', data.id);
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
      console.log(val);
      this.pagination.currentPage = val;
      this.getList();
    }
  },
  watch: {},
  created() {}
};
</script>

<style lang="scss">
.agent-mgmt__platform-info {
  .biz-table-filter {
    float: right;
  }
}
</style>
