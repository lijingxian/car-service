<template>
  <biz-grid class="refueling-record" v-loading="loading">
    <div slot="top">
      <biz-filter :filters="filters" @filterDataChange="filterDataChange"></biz-filter>
    </div>
    <biz-list ref="table" :tableData="tableData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
      :key="Math.random()" :height="'100%'">
      <el-table-column prop="name" label="会员" width="160px">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.member.head" :src="scope.row.member.head" />
            <img v-else src="../../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title" :title="scope.row.member.name">{{scope.row.member.name}}</div>
              <div class="gender">
                <span>{{scope.row.member.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="发放时间" width="90px"></el-table-column>
      <el-table-column prop="type" label="关怀类型" width="100px">
        <template slot-scope="scope">
          {{ getType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="发放福利">
        <template slot-scope="scope">
          <!-- {{ getWelfare(scope.row) }} -->
          <div class="cell-content">
            <div class="slot-top">
              <p v-if="Number(scope.row.bean) !== 0">V豆: {{ scope.row.bean }}</p>
              <p v-if="Number(scope.row.point) !== 0">积分: {{ scope.row.point }}</p>
            </div>
            <div class="slot-bottom" v-if="scope.row.rightsList.length">
              权益: {{ getRights(scope.row.rightsList) }}
            </div>
          </div>
        </template>
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
  name: 'RefuelingRecord',
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
          placeholder: '请输入姓名/手机号',
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
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    getType(type) {
      //  (0-会员生日,1-会员消费,2-新会员注册,3-保养到期,4-保险到期,5-指定日期)
      switch (type) {
        case '0':
          return '会员生日';
        case '1':
          return '会员消费';
        case '2':
          return '新会员注册';
        case '3':
          return '保养到期';
        case '4':
          return '保险到期';
        case '5':
          return '指定日期';
        case '6':
          return '单次消费';
        case '7':
          return '活跃度变化';
        default:
          return '';
      }
    },
    getWelfare(item) {
      return `V豆: ${item.bean}, 积分: ${item.point}`;
    },
    getRights(item) {
      if (!item.length) return '';
      return item
        .map(right => right.name)
        .splice(0, 2)
        .join('、');
    },
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
        memberCareId: this.itemId.id,
        shopId: (this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value,
        beginTime: '',
        endTime: ''
      };
      http
        .get(urls.memberCareMgmt.careRecord, params)
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
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.clearSearchValue();
      if (nVal.id) {
        this.getList();
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
.refueling-record {
  .biz-table-filter {
    float: right;
  }
  .customer-info {
    img {
      position: absolute;
      top: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .title {
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .slot-top {
    p {
      margin: 0;
    }
  }
}
</style>
