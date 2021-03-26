<template>
  <biz-grid class="purchase-return-order-info" v-loading="loading">
    <el-form label-width="110px" size="small" :inline-message="true">
      <el-form-item label="入库单">
        <span
          v-for="orderList in orderLists"
          :key="orderList.id"
          :label="orderList.sn"
          :value="orderList.id"
          @click="onClickOrderList(orderList)"
          class="tel-style"
        >{{orderList.sn}}</span>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogOrderTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <div class="d-p-wrap">
        <el-row :gutter="10" class="row">
          <div class="p-title">入库单</div>
        </el-row>
        <el-row :gutter="10" class="row-top">
          <el-col :span="14">
            <div class="grid-content bg-purple">编号：{{form.sn}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">供应商：{{form.relatePartnerName}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">创建人：{{form.creatorName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="row">
          <el-col :span="14">
            <div class="grid-content bg-purple">状态：{{form.state}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">备注：{{form.remark}}</div>
          </el-col>
        </el-row>
        <el-table :data="gridReturnOrderData" class="table-class">
          <el-table-column property="productName" label="商品">
            <template slot-scope="scope">{{scope.row.productName}}</template>
          </el-table-column>
          <el-table-column property="amount" label="入库数量"></el-table-column>
          <el-table-column property="depotName" label="仓库"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'OrderInfo',
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
    BizGrid
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      orderLists: [],
      // 用户信息
      form: {},
      gridReturnOrderData: [],
      dialogOrderTableVisible: false
    };
  },
  created() {},
  watch: {
    itemId(val) {
      this.orderLists = [];
      this.itemId && this.getList();
    }
  },
  mounted() {},
  methods: {
    getList() {
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.relateBill, {
          id: this.itemId || ''
        })
        .then(data => {
          this.orderLists = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    queryReturnOrderList(id) {
      // 调用订单接口
      let params = {
        id: id
      };
      http
        .get(urls.invoicing.depotInMgmt.print, params)
        .then(data => {
          this.dialogOrderTableVisible = true;
          this.title = '入库单';
          this.form = data.data;
          if (this.form.state === '0') {
            this.form.state = '已创建';
          } else if (this.form.state === '1') {
            this.form.state = '已提交';
          } else {
          }
          this.gridReturnOrderData = data.data.itemDatas;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    onClickOrderList(val) {
      this.queryReturnOrderList(val.id);
    }
  }
};
</script>

<style lang="scss">
.purchase-return-order-info {
  .tel-style {
    color: #ff7300;
    cursor: pointer;
    display: flex;
  }
}
</style>
