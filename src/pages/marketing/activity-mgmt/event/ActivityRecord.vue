<template>
  <biz-grid class="activity-record" v-loading="loading">
    <div slot="top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
      </biz-header>
      <div class="header_1">
        <el-radio-group v-model="attendType" @change="attendTypeChange">
          <el-radio label="0">签到记录</el-radio>
          <el-radio label="5">互动记录</el-radio>
          <el-radio label="3">打赏记录</el-radio>
          <el-radio label="4">抽奖记录</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-table :data="tableData" height="100%" highlight-current-row tooltip-effect="dark" stripe size="small" v-show="attendType==='0'">
      <el-table-column label="签到时间" prop="createDate">
      </el-table-column>
      <el-table-column label="签到人" prop="member.nickname">
      </el-table-column>
      <el-table-column label="手机号" prop="member.mobile"></el-table-column>
    </el-table>
    <el-table :data="tableData" height="100%" highlight-current-row tooltip-effect="dark" stripe size="small" v-show="attendType==='5'">
      <el-table-column label="抽奖时间" prop="createDate">
      </el-table-column>
      <el-table-column label="互动类型" prop="name">
        <template slot-scope="scope">
          {{getType(scope.row.attendType)}}
        </template>
      </el-table-column>
      <el-table-column label="参与人" prop="member.nickname"></el-table-column>
      <el-table-column label="互动内容" prop="content"></el-table-column>
    </el-table>
    <el-table :data="tableData" height="100%" border highlight-current-row tooltip-effect="dark" stripe size="small" v-show="attendType==='3'">
      <el-table-column label="打赏时间" prop="createDate">
      </el-table-column>
      <el-table-column label="打赏人" prop="member.nickname">
      </el-table-column>
      <el-table-column label="打赏节目" prop="marketingItem.title"></el-table-column>
      <el-table-column label="赏金" prop="rewardAmount"></el-table-column>
    </el-table>
    <el-table :data="tableData" height="100%" highlight-current-row tooltip-effect="dark" stripe size="small" v-show="attendType==='4'">
      <el-table-column label="抽奖时间" prop="createDate">
      </el-table-column>
      <el-table-column label="抽奖人" prop="member.nickname">
      </el-table-column>
      <el-table-column label="抽奖方式" prop="type">
        <template slot-scope="scope">
          {{lotteryWay(scope.row.marketingItem?scope.row.marketingItem.lotteryWay:'')}}
        </template>
      </el-table-column>
      <el-table-column label="奖品名称" prop="prize.name"></el-table-column>
      <el-table-column label="奖品类型" prop="type">
        <template slot-scope="scope">
          {{prizeType(scope.row.prize?scope.row.prize.type:'')}}
        </template>
      </el-table-column>
      <el-table-column label="卡券码" prop="couponCode"></el-table-column>
    </el-table>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import axios from 'axios';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizHeader,
    BizPagination
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      attendType: '0',
      // 用户信息
      formModel: {},
      selections: [],
      tableData: [],
      operations: [
        {
          label: '导出',
          name: 'exportExcle',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入手机号',
          select: [],
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
  },
  created() {
    if (this.itemId) this.getList();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    getType(type) {
      if (type === '0') {
        return '签到';
      } else if (type === '1') {
        return '评论';
      } else if (type === '2') {
        return '弹幕';
      } else if (type === '3') {
        return '打赏';
      } else if (type === '4') {
        return '抽奖';
      }
    },
    lotteryWay(type) {
      switch (type) {
        case '0':
          return '用户名抽奖';
        case '1':
          return '评论抽奖';
        case '2':
          return '现场摇一摇';
        case '3':
          return '大转盘';
        default:
          return '--';
      }
    },
    prizeType(type) {
      switch (type) {
        case '0':
          return 'V豆';
        case '3':
          return '再来一次';
        case '4':
          return '谢谢参与';
        case '5':
          return '实物';
        case '8':
          return '现金券';
        default:
          return '--';
      }
    },
    attendTypeChange() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    getList() {
      http
        .get(activityMgmt.attends, {
          id: this.itemId || '',
          attendType: this.attendType,
          searchValue: this.filters[0].value || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    async exportExcle() {
      let params = {
        id: this.itemId || '',
        attendType: this.attendType,
        searchValue: this.filters[0].value || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      try {
        let response = await axios.post(activityMgmt.exportlocalMarketingAttend, params, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.activity-record {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .header_1 {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .header_2 {
    .span {
      margin-right: 10px;
    }
    font-size: 12px;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
