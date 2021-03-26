<template>
  <biz-grid class="potential-customer-mgmt__test-drive" v-loading="loading">
    <biz-list
      ref="table"
      :tableData="tableData"
      :key="Math.random()"
      :height="'100%'"
    >
      <el-table-column label="日期" prop="attendDate"></el-table-column>
      <el-table-column label="互动活动" prop="title">
        <div slot-scope="scope">
          {{scope.row.activity.title?scope.row.activity.title:''}}
        </div>
      </el-table-column>
      <el-table-column prop="tag" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="detailClickHandler($event, scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </biz-list>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog class="box-card" title="活动详情" :visible.sync="showForm" center append-to-body width="500px">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :inline-message="true">
        <el-form-item label="参与活动：" prop="title">
          <span>{{formModel.activity?formModel.activity.title:''}}</span>
        </el-form-item>
        <el-form-item label="参与时间：" prop="attendDate">
          <span>{{formModel.attendDate}}</span>
        </el-form-item>
        <el-form-item label="奖品名称：" prop="prizeName">
          <span>{{formModel.prizeName}}</span>
        </el-form-item>
        <el-form-item label="奖品类型：" prop="type">
          <span>{{formModel.prize?(formModel.prize.type==='bean'?'V豆':formModel.prize.type==='again'?'再来一次':
            formModel.prize.type==='thanks'?'谢谢参与':formModel.prize.type==='physical'?'实物':formModel.prize.type==='cashCoupon'?'现金券':''):''}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import BizList from '@/components/BizTable/BizList';
import { BizPagination } from '@/components/BizTable';
// 基础内容
export default {
  name: 'ActivityBaseInfo',
  data() {
    return {
      tableData: [],
      showForm: false,
      loading: false,
      formModel: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      }
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    phoneNumber: {
      type: String
    }
  },
  components: {
    BizGrid,
    BizPagination,
    BizList
  },
  created() {
    this.query();
  },
  mounted() {},
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.query();
      }
    }
  },
  methods: {
    query() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        phoneNumber: this.phoneNumber,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/marketing/activityList.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    detailClickHandler(e, row) {
      e.stopPropagation();
      this.formModel = row;
      this.showForm = true;
    }
  }
};
</script>

<style lang="scss">
.potential-customer-mgmt__test-drive {
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
