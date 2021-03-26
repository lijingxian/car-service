<template>
  <biz-dialog-selector class="query-order-list" selectionMode="single" :visibility.sync="showDialog" :tableData="tableData"
    :pagination="pagination" :filters="filters" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange"
    @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange" :isClear="false">
    <el-table-column label="订单编号" prop="sn"></el-table-column>
    <el-table-column label="订单时间" prop="orderTime"></el-table-column>
    <el-table-column label="订单分类" prop="orderType" :formatter="typeFormatter"></el-table-column>
    <el-table-column label="商品名称" :formatter="productNameFormatter">
      <div slot-scope="scope">
        <div class="biz-customcol" v-for="(orderItem,index) in scope.row.orderItems" :key="index">
          {{orderItem.fullName}}
        </div>
      </div>
    </el-table-column>
    <el-table-column label="车牌号" prop="plateNumber"></el-table-column>
    <el-table-column label="订单原价" prop="originalAmount"></el-table-column>
    <el-table-column label="订单现价" prop="amount"></el-table-column>
  </biz-dialog-selector>
</template>

<script>
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';

export default {
  name: 'QueryMemberList',
  props: {
    memberId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      filters: [{ type: 'input', placeholder: '请输入订单编号', value: '' }],
      selectedItemKeys: []
    };
  },
  components: {
    BizDialogSelector
  },
  methods: {
    clear() {
      this.filters[0].value = '';
      this.pagination.pageSize = 20;
      this.pagination.currentPage = 1;
      this.pagination.total = 0;
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
      console.log(items[0]);
      let orderInfo = {
        orderId: items[0].id,
        orderSn: items[0].sn,
        orderType: items[0].orderType,
        orderItems: items[0].orderItems,
        amountPaid: items[0].amountPayable
      };
      this.$emit('confirm', orderInfo);
    },
    refresh() {
      let params = {
        memberId: this.memberId.id,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        // 按订单搜索
        searchProperty: 'sn',
        searchValue: this.filters[0].value
      };
      http
        .get('/admin/deposit/orders.jhtml', params)
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.data.length);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    typeFormatter(row) {
      const TYPE_LIST = {
        '0': '车品订单',
        '1': '充值订单',
        '2': '服务订单',
        '3': '一键救援预约',
        '4': '维修预约',
        '5': '保养预约',
        '6': '置换预约',
        '7': '贷款购车预约',
        '8': '预约体验预约',
        '9': '整车订单',
        '10': '普通订单',
        '13': 'sim卡充值订单',
        '14': '平台服务',
        '15': '短信服务',
        '16': '活动招募订单',
        '99': '总计'
      };
      return TYPE_LIST[row.orderType] || '';
    },
    productNameFormatter(row) {
      return row.orderItems[0].fullName;
    }
  },
  mounted() {},
  watch: {
    memberId(newVal, oldVal) {
      this.selectedItemKeys = [];
    },
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
.query-order-list {
  .user-area {
    display: flex;
    img {
      width: 50px;
      height: 50px;
    }
    .right {
      margin-left: 10px;
    }
  }
}
</style>
