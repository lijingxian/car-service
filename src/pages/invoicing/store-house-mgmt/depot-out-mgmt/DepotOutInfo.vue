<template>
  <biz-grid class="product-info">
    <biz-list ref="table" :tableData="tableData" :height="'100%'" :loading="loading" :key="Math.random()" v-loading="loading">
      <el-table-column prop="productName" label="商品名称" min-width="100">
        <template
          slot-scope="scope">{{scope.row.product&&scope.row.product.fullName?scope.row.product.fullName:scope.row.productName}}</template>
      </el-table-column>
      <el-table-column prop="barCode" label="条码">
        <template slot-scope="scope">{{scope.row.product&&scope.row.product.barCode?scope.row.product.barCode:''}}</template>
      </el-table-column>
      <el-table-column prop="depotName" label="仓库"></el-table-column>
      <el-table-column prop="quantity" label="出库数量"></el-table-column>
      <el-table-column prop="createDate" label="出库时间"></el-table-column>
      <el-table-column prop="operator" label="出库人"></el-table-column>
    </biz-list>
  </biz-grid>
</template>

<script>
import BizList from '@/components/BizTable/BizList';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import http from '@/common/http';

export default {
  name: 'ProductInfo',
  props: {
    itemId: {
      type: String
    },
    tabSelection: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizList,
    BizGrid
  },
  watch: {
    itemId(val) {
      this.tableData = [];
      this.itemId && this.query();
      // this.queryStoreHouseList();
    },
    tabSelection(val) {
      if (val === 'depotoutinfo') {
        this.query();
      }
    }
  },
  mounted() {
    let height = document.documentElement.clientHeight || window.innerHeight;
    this.height = String(height - 175);
  },
  methods: {
    ...mapGetters(['getUser']),

    query() {
      this.loading = true;
      http
        .get('/admin/invoicing/stock/depotOut/records.jhtml', { id: this.itemId })
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.product-info-dailog {
  .el-dialog__header {
    text-align: center;
  }
}
.dialog-column {
  display: flex;
  align-items: center;
  .productImg {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .biz-two-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .titleClass {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 200px;
      white-space: nowrap;
    }
  }
}
.depotDialog .biz-pagination {
  display: none;
}
.biz-dialog-selector {
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 200px;
  }
}
.product-info {
  .el-form {
    padding: 0px 10px;
  }
  .el-input-number--mini {
    width: 110px;
  }
  .el-button--small {
    margin-top: 20px;
  }
  .delete-btn {
    color: red;
  }
  .subTotal {
    float: right;
  }
  .el-autocomplete {
    width: 220px;
  }
  .biz-customcol {
    .el-input-number--mini .el-input-number__increase,
    .el-input-number--mini .el-input-number__decrease {
      width: 20px;
    }
  }
  .el-input {
    font-size: 12px;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>
