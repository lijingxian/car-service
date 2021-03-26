<template>
  <biz-grid class="function-defination-history-list">
    <el-table size="small" ref="table" stripe height="100%" border :data="data" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="时间" prop="paymentTime"></el-table-column>
      <el-table-column label="规格" prop="purchaseSpecification" :formatter="specificationFormatter"></el-table-column>
      <el-table-column label="价格" prop="amountPaid"></el-table-column>
    </el-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'OrderHistoryList',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isFn: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      data: []
    };
  },
  components: {
    BizGrid
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
    itemId(newVal, oldVal) {
      if (newVal.id) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    specificationFormatter(row, column) {
      return this.$route.query.businessServiceClassify ? `${row.purchaseSpecification}条` : `${row.purchaseSpecification}个月`;
    },
    getList() {
      let params = {
        shopId: this.currentUser.shop.id || window.top.SHOP_ID || '',
        id: this.itemId.id || '',
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get(this.isFn ? '/admin/solution/subscribe/buyRecords.jhtml' : urls.servicesMgmt.orderHistory, params)
        .then(data => {
          this.data = data.dataList.filter(item => {
            return !!item.paymentTime;
          });
        })
        .catch();
    }
  }
};
</script>

<style lang="scss">
</style>
