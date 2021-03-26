<template>
  <div class="cs-black-list">
    <biz-flex-table @filter-data-change="filterDataChange"
               :tableData="tableData"
               :pagination="pagination"
               @row-click="rowClick"
               :filters="filters"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange">
      <!-- <el-table-column width="150"
                       prop="name"
                       label="用户">
        <div slot-scope="scope">
          <div class="user">
            <div class="avatar">
              <img :src="scope.row.member.head||DefaultAvatar"
                   alt="">
            </div>
            <div class="name">
              {{scope.row.member.nickname}}
            </div>
          </div>
        </div>
      </el-table-column> -->
      <el-table-column prop="" label="客户" min-width="260">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              昵称：{{scope.row.member.nickname}}
            </div>
            <div class="overflow">
              电话：{{scope.row.member.mobile}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="blackDate"
                       label="拉黑日期">
      </el-table-column>
      <el-table-column :formatter="getSource"
                       label="用户来源">
      </el-table-column>
      <el-table-column prop="remarks"
                       width="350"
                       label="原因说明">
      </el-table-column>
      <el-table-column :formatter="getState"
                       label="状态">
      </el-table-column>
      <el-table-column width="100"
                       prop="date"
                       label="操作">
        <div slot-scope="scope">
          <div class="operate-btn-group">
            <el-button type="text"
                       v-if="scope.row.state === '1'"
                       size="mini"
                       @click.stop="recover($event,scope.row)">
              恢复
            </el-button>
            <el-button type="text"
                       v-if="scope.row.state === '0'"
                       size="mini"
                       @click.stop="passBlack($event,scope.row)">
              通过
            </el-button>
            <el-button type="text"
                       v-if="scope.row.state === '0'"
                       size="mini"
                       @click.stop="recover($event,scope.row)">
              拒绝
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="open=false" v-model="tabName">
      <el-tab-pane label="基本信息" name="first">
        <base-info ref="baseInfo" @operationSuccess="refresh"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import csService from '@/service/customer-service/csMgmt';
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import date from '@/utils/date';
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'BlackList',
  data() {
    return {
      DefaultAvatar: DefaultAvatar,
      filters: [
        {
          type: 'daterange',
          label: '日期范围',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入搜索内容',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      open: false,
      tabName: 'first',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    this.refresh();
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '点击“恢复”，此用户将从黑名单中删除，恢复正常',
      type: 'info'
    });
  },
  components: { BizFlexTable, BizPopupTabs, BaseInfo },
  computed: {},
  methods: {
    refresh() {
      this.getBlackList();
    },
    getBlackList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginTime: this.filters[0].value[0] ? this.filters[0].value[0] + ' ' + '00:00:00' : '',
        endTime: this.filters[0].value[1] ? this.filters[0].value[1] + ' ' + '23:59:59' : '',
        searchValue: this.filters[1].value
      };
      csService.getBlackList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.$message({
            type: 'warning',
            message: ErrorData.errorMessage
          });
        }
      );
    },
    recover(e, row) {
      e.stopPropagation();
      this.tabName = 'first';
      this.$refs.baseInfo.refresh(row);
      this.open = true;
    },
    passBlack(e, row) {
      e.stopPropagation();
      this.tabName = 'first';
      this.$refs.baseInfo.refresh(row);
      this.open = true;
    },
    filterDataChange() {
      this.pagination.pageNumber = 1;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row, event) {
      this.tabName = 'first';
      this.$refs.baseInfo.refresh(row);
      this.open = true;
    },
    getState(row) {
      switch (row.state) {
        case '0':
          return '未审核';
        case '1':
          return '已审核';
        default:
          break;
      }
    },
    getSource(row) {
      switch (row.member.userSource) {
        case '0':
          return '推荐注册';
        case '1':
          return '潜客转化';
        case '2':
          return '正常注册';
        case '3':
          return '后台创建';
        case '4':
          return '其他';
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.cs-black-list {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .user {
    display: flex;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      img {
        max-width: 100%;
        border-radius: 20px;
      }
    }
    .name {
      margin-left: 15px;
    }
  }
}
</style>
