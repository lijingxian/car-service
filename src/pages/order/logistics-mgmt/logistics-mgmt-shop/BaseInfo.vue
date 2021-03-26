<template>
  <div class="logistics-mgmt__shop" v-loading="loading">
    <div slot="top">
      <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
    </div>
    <biz-list
      ref="table"
      :tableData="tableData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :key="Math.random()"
      :height="'100%'"
    >
      <el-table-column prop="name" label="物流公司"></el-table-column>
      <el-table-column prop="code" label="代码"></el-table-column>
      <el-table-column prop="url" label="网址"></el-table-column>
      <el-table-column prop="date" label="操作" type="index">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" v-if="scope.row.addFlg === '0'" @click="addHandeler(scope.row)">添加</el-button>
            <el-button type="text" size="mini" v-if="scope.row.addFlg === '1'" :disabled="true">已添加</el-button>
          </div>
        </div>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
  </div>
</template>

<script>
// import { BizGrid } from '@/components/BizGrid';
import BizList from '@/components/BizTable/BizList';
import BizPagination from '@/components/BizTable/BizPagination';
import BizFilter from '@/components/BizTable/BizFilter';
// import { logisticsMgmt } from '@/common/urls';
// import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';

export default {
  name: 'logisticsBaseInfo',
  components: {
    // BizGrid,
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
          placeholder: '请输入物流公司名称/简称',
          name: 'searchbar',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      }
    };
  },
  props: {},
  methods: {
    ...mapGetters(['getUser']),
    filterDataChange(val) {
      // this.pagination.currentPage = 1;
      this.filters = val;
      this.refresh();
    },
    clearSearchValue() {
      this.pagination.currentPage = 1;
      this.filters[0].value = '';
    },
    refresh() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/shop_delivery_corp/json/listPlatform.jhtml', params)
        .then(data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    addHandeler(row) {
      this.loading = true;
      let params = {
        deliverCorpId: row.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .post('/admin/shop_delivery_corp/json/create.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('添加成功');
          this.refresh();
          this.$emit('operationSuccess');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  },
  watch: {},
  created() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.logistics-mgmt__shop {
  .biz-table-filter {
    float: right;
  }
}
</style>
