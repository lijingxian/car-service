<!-- 短信管理 -->
<template>
  <biz-grid class="service-message-mgmt">
    <div class="msg-table-header" slot="top">
      当前剩余短信数: <span class="color-orange">{{ leaveCount }}</span>
      <el-button size="small" type="primary" @click="headerBtnClick">{{ btnTxt }}</el-button>
    </div>
    <el-table size="small" ref="table" highlight-current-row :data="tableData" height="100%"
      style="width: 100%;" @row-click="rowClick">
      <biz-empty-table slot="empty"></biz-empty-table>
      <el-table-column prop="name" label="使用情况" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              类型：{{scope.row.name}}
            </div>
            <div class="overflow">
              详情：{{scope.row.remarks}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用量" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.count}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="店铺信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <el-button type="text" size="mini" @click.stop="showShopInfo(scope.row)">
                {{ scope.row.shop.name }}
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作信息" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.operator.name}}
            </div>
            <div class="overflow">
              {{scope.row.createDate}}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
    <biz-popup-tabs slot="float" :open="open" @close="close" value="first">
      <el-tab-pane :label="tabTxt" name="first">
        <shop-info v-if="tabType === 'shopInfo'" :itemId="shopId"></shop-info>
        <increase-order v-if="tabType === 'increase'" @refresh="refresh"></increase-order>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs slot="float" :open="openBase" @close="openBase=false" value="first">
      <el-tab-pane label="基本信息" name="first">
        <base-info :form="form"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizPagination } from '@/components/BizTable';
import BizEmptyTable from '@/components/BizTable/BizEmptyTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

import ShopInfo from './ShopInfo';
import IncreaseOrder from './IncreaseOrder';
import BaseInfo from './BaseInfo';
export default {
  name: 'MessageMgmt',
  data() {
    return {
      open: false,
      tabType: 'shopInfo',
      leaveCount: 0,
      openBase: false,
      form: {},
      shopId: { id: '' },
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizGrid,
    BizPagination,
    BizEmptyTable,
    BizPopupTabs,
    ShopInfo,
    IncreaseOrder,
    BaseInfo
  },
  computed: {
    ...mapGetters(['currentUser']),
    btnTxt() {
      if (this.currentUser.roleLevel === 'platform') {
        return '续增';
      } else {
        return '充值';
      }
    },
    tabTxt() {
      if (this.tabType === 'shopInfo') {
        return '店铺信息';
      }
      return '续增';
    }
  },
  watch: {},
  mounted() {
    this.refresh();
  },
  methods: {
    rowClick(row) {
      this.form = row;
      this.open = false;
      this.openBase = true;
    },
    headerBtnClick() {
      if (this.btnTxt === '充值') {
        // xxx
        this.$router.push({ path: '/union/service-mgmt/subscribe', query: { businessServiceClassify: '信息服务' } });
      } else {
        this.tabType = 'increase';
        this.open = true;
      }
    },
    showShopInfo(row) {
      this.tabType = 'shopInfo';
      this.$nextTick(() => {
        this.shopId = { id: row.shop.id };
        this.open = true;
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
    },
    refresh() {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      };
      this.getList();
    },
    getList() {
      let params = {
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get(urls.servicesMgmt.getMsgList, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.leaveCount = data.leaveCount;
        })
        .catch();
    },
    close() {
      this.open = false;
    }
  }
};
</script>

<style lang="scss">
.service-message-mgmt {
  .msg-table-header {
    padding: 5px;
    .el-button--small {
      margin-left: 10px;
    }
  }
}
</style>
