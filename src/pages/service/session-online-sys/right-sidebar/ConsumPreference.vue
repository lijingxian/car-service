<template>
  <biz-grid class="consum-preference">
    <el-form ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="下单总额" prop="amount">
        <el-input placeholder="请选择下单总额" v-model="form.amount" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="下单数量" prop="total">
        <el-input placeholder="请输入下单数量" disabled v-model="form.total"></el-input>
      </el-form-item>
      <el-form-item label="下单类型" prop="typeNames">
        <el-input placeholder="请输入下单类型" disabled v-model="form.typeNames"></el-input>
      </el-form-item>
      <el-form-item label="最近下单时间" prop="latestTime">
        <el-input placeholder="请输入最近下单时间" disabled v-model="form.latestTime"></el-input>
      </el-form-item>
      <el-form-item label="相关订单" prop="orders">
        <div v-for="(item,index) in form.orders" :key="index" v-if="index<6">
          <el-button type="text" size="mini" @click="clickOrder($event, item)">
            <span style="white-space:normal">{{ item.sn? item.sn : '' }}</span>
          </el-button>
        </div>
        <div v-if="form.orders.length>6" style="font-size:12px;color:#ff7300;cursor:pointer" @click="moreOrders">...更多</div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" width="550px">
      <div style="display: flex;flex-wrap: wrap;justify-content: space-between;padding:10px">
        <div v-for="(item,index) in form.orders" :key="index" style="width:220px">
          <el-button type="text" size="mini" @click="clickOrder($event, item)">
            <span style="white-space:normal">{{ item.sn? item.sn : '' }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import { membershipMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'consum-preference',
  components: {
    BizGrid
  },
  props: {},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        amount: '',
        total: '',
        typeNames: '',
        latestTime: '',
        orders: []
      }
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('CustomService', ['activatedRoom'])
  },
  watch: {
    activatedRoom() {
      this.getNews();
    }
  },
  mounted() {},
  created() {},
  methods: {
    moreOrders() {
      this.dialogVisible = true;
    },
    getNews() {
      this.loading = true;
      let params = {
        userId: this.activatedRoom.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(membershipMgmt.memberNews, params)
        .then(data => {
          let typeNames = '';
          this.loading = false;
          typeNames = data.data.order.typeNames.replace(/^\s*|\s*$/g, '');
          this.form.typeNames = typeNames.replace(/\s+|&nbsp;/ig, '/');
          this.form.total = data.data.order.total;
          this.form.amount = data.data.order.amount;
          this.form.latestTime = data.data.order.latestTime;
          this.form.orders = data.data.order.orders;
        })
        .catch(errData => {})
        .finally(() => {
          this.loading = false;
        });
    },
    clickOrder(e, row) {
      this.$emit('showOrder', row);
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.consum-preference {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin-bottom: 8px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
</style>
