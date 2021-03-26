<template>
  <div class="shipping-method-mgmt">
    <biz-flex-table ref="table" :loading="loading" :tableData="tableData" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" :checkable="checkable">
      <el-table-column prop="name" label="支付方式">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.name}}
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="order" label="排序">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{scope.row.order}}
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
    <payment-method-mgmt-popup slot="float" :open="openPopup" @close="closePopup" :id="id4Popup" @refreshNotification="refresh"></payment-method-mgmt-popup>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import PaymentMethodMgmtPopup from './PaymentMethodMgmtPopup';
import Service from '@/service/system-setting/payment-method-mgmt/paymentMethodMgmt';

export default {
  name: 'PaymentMethodMgmt',
  data() {
    return {
      loading: false,
      id4Popup: '',
      openPopup: false,
      multipleSelection: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      checkable: false
    };
  },
  components: {
    BizFlexTable,
    PaymentMethodMgmtPopup
  },
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      Service.getList(
        params,
        data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row) {
      this.openPopup = true;
      this.id4Popup = row.id;
    },
    closePopup() {
      this.openPopup = false;
    }
  }
};
</script>

<style lang="scss">
.shipping-method-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
</style>
