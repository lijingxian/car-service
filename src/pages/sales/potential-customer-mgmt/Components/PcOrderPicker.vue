<template>
  <div class="potential-customer__order-picker">
    <biz-dialog-selector
      slot="float"
      title="选择订单"
      :visibility.sync="showDialog"
      :loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="filters"

      @confirmed="confirmedHandler"
      @open="openedHandler"

      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
    >
      <el-table-column prop="sn" label="订单编号">
      </el-table-column>
      <el-table-column prop="orderTime" label="订单时间">
      </el-table-column>
      <el-table-column prop="orderType" label="订单分类" :formatter="orderTypeFormatter">
      </el-table-column>
      <el-table-column prop="orderItems" label="商品名称">
        <template slot-scope="scope">
          <span
            v-for="item in scope.row.orderItems"
            :key="item.id"
          >
            {{item.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="consignee" label="会员昵称">
      </el-table-column>
      <el-table-column prop="plateNumber" label="车牌">
      </el-table-column>
      <el-table-column prop="amount" label="订单金额">
      </el-table-column>
      <el-table-column prop="amountPaid" label="实付金额">
      </el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';

import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'PcOrderPicker',
  components: {
    BizDialogSelector
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      showDialog: false,
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  props: {
    value: {
      type: Object
    },
    itemId: {
      type: Object
    },
    memberId: {
      type: Object
    }
  },
  methods: {
    // 订单类型格式化
    orderTypeFormatter(row) {
      let TYPE_LIST = {
        0: '普通商品订单',
        1: '充值订单',
        2: '服务订单',
        3: '一键救援预约',
        4: '维修预约',
        5: '保养预约',
        6: '置换预约',
        7: '贷款购车预约',
        8: '预约体验预约',
        9: '整车订单',
        10: '普通订单',
        11: '维修保养订单',
        12: '产品订单',
        13: 'sim卡充值订单',
        14: '平台服务',
        15: '短信服务'
      };
      return TYPE_LIST[row.orderType];
    },
    query (params) {
      this.loading = true;

      http.get(
        potentialCustomerMgmt.sign.orderList,
        params
      )
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getStatus (row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }

      return '';
    },

    clickHandler (e) {
      this.showDialog = true;
    },
    confirmedHandler (selectionKeys, selections) {
      let obj = selections[0];
      this.$emit('input', obj);
    },
    getQueryParams () {
      return {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchValue: this.filters[0].value,
        searchProperty: 'sn',
        id: this.itemId.id,
        orderType: 'car',
        memberId: this.memberId ? this.memberId.id : ''
      };
    },
    openedHandler () {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = 20;
      this.filters = [{
        type: 'input',
        label: '',
        placeholder: '请输入订单号',
        name: 'searchValue',
        value: ''
      }];
      this.query(this.getQueryParams());
    },
    dialogFilterDataChange (filters) {
      this.pagination.currentPage = 1;
      this.query(this.getQueryParams());
    },
    dialogPageSizeChange (val) {
      this.$set(this.pagination, 'pageSize', val);
      this.query(this.getQueryParams());
    },
    dialogCurrentPageChange (val) {
      this.$set(this.pagination, 'currentPage', val);
      this.query(this.getQueryParams());
    }
  }
};
</script>

<style lang="scss">

</style>
