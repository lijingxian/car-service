<template>
  <biz-dialog-selector class="query-member-list" selectionMode="single" :visibility.sync="showDialog" :tableData="tableData"
    :pagination="pagination" :filters="filters" :selectionKeys="selectedItemKeys" :loading="loading" @pageSizeChange="handleSizeChange"
    @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange" :isClear="false">
    <el-table-column label="用户名">
      <template slot-scope="scope">
        <div class="customer-info">
          <img :src="scope.row.head || defaultAvatar" alt="">
          <div class="wrapper">
            <div class="title">{{ scope.row.userName }}</div>
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
    <el-table-column label="手机号" prop="mobile"></el-table-column>
    <el-table-column label="创建日期" prop="createDate"></el-table-column>
    <el-table-column label="状态" prop="enableState" :formatter="stateFormatter"></el-table-column>
    <el-table-column label="店铺名称">
      <template slot-scope="scope">
        <div>
          <div class="customer-info" v-for="(shop,index) in scope.row.shops" :key="index">{{shop.name}}</div>
        </div>
      </template>
    </el-table-column>
  </biz-dialog-selector>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
import defaultAvatar from '@/assets/images/default_user.png';

import { customerService } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'QueryMemberList',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      defaultAvatar: defaultAvatar,
      showDialog: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      filters: [
        {
          label: '状态',
          value: '',
          type: 'select',
          options: [{ label: '全部', value: '' }, { label: '启用', value: '1' }, { label: '停用', value: '0' }]
        },
        { type: 'input', placeholder: '请输入姓名/手机号', value: '' }
      ],
      selectedItemKeys: []
    };
  },
  components: {
    BizDialogSelector
  },
  methods: {
    clear() {
      this.selectedItemKeys = [];
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.pagination.pageSize = 20;
      this.pagination.currentPage = 1;
      this.pagination.total = 0;
    },
    stateFormatter(row) {
      return row.enableState === '0' ? '停用' : '启用';
    },
    shopFormatter(row) {
      return row.shop ? row.shop.name : '';
    },
    filterDataChange(val) {
      this.refresh();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    confirm(keys, items) {
      this.selectedItemKeys = keys;
      if (items.length === 0) {
        return;
      }
      let userInfo = {
        memberId: items[0].id,
        memberCardSn: items[0].memberCardSn,
        memberName: items[0].name,
        userRankName: items[0].userRankName
      };
      this.$emit('confirm', userInfo);
    },
    refresh() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[1].value,
        state: this.filters[0].value
      };
      this.loading = true;
      http
        .get(customerService.ReceptionMgmt.baseInfo.queryMemberList, params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {},
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        this.showDialog = newVal;
        this.clear();
        this.refresh();
      }
    },
    showDialog(newVal, oldVal) {
      if (!newVal) {
        this.$emit('update:visible', false);
      }
    }
  }
};
</script>

<style lang="scss">
.query-member-list {
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
