<template>
  <div class="store-value-mgmt-product-base-info">
    <biz-flex-table
      ref="table"
      :tableData="tableData"
      :loading="loading"
      :checkable="false"
    >
      <el-table-column label="编号" prop="sn">
      </el-table-column>
      <el-table-column label="商品名称" prop="fullName">
      </el-table-column>
      <el-table-column label="商品价格" prop="price">
      </el-table-column>
      <el-table-column label="数量" prop="quantity">
      </el-table-column>
      <el-table-column label="小计" prop="amount">
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

import { financeMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'StoreValueMgmtProductInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      loading: false,
      tableData: []
    };
  },
  components: {
    BizFlexTable
  },
  methods: {
    refresh() {
      this.loading = true;
      let params = { orderId: this.itemId.id };
      http.get(financeMgmt.store.productInfo.query, params)
        .then(
          data => {
            this.loading = false;
            this.tableData = data.orderItems;
          }
        )
        .catch(
          ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
    },
    updateHeight () {
      setTimeout(() => {
        this.$refs.table.doHeight();
      }, 100);
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
  },
  watch: {
    itemId(newVal, oldVal) {
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.store-value-mgmt-product-base-info {
  padding: 10px;
}
</style>
