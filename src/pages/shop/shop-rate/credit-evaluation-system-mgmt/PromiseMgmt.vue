<template>
  <biz-grid class="motorists-club-activity" v-loading="loading">
    <biz-header
      slot="top"
      :operations="operations"
      @operate="handleOperate"
      >
    </biz-header>

    <promise-list
      :list="tableData"
      @item-click="handleClick"
      @remove-item="handleDelete"
    ></promise-list>

    <right-popup
      slot="float"
      :open="open"
      :itemId="itemId"
      @close="open = false;"
      @operationSuccess="handlePperationSuccess"
    ></right-popup>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import PromiseList from './Components/PromiseList';

import rightPopup from './PromiseMgmt/PromiseMgmtPopup';

import service from '@/service/shop-rate/PromiseMgmt';

// 属性
const data = {
  itemId: { id: '' },

  // 右侧弹窗
  open: false,

  // 列表相关
  loading: false,
  tableData: [],
  operations: [
    {
      label: '新增',
      name: 'add',
      type: 'primary'
    }
  ]
};

// 方法
const methods = {
  getQueryParams () {
    return {
      shopId: window.top.SHOP_ID || ''
    };
  },
  query () {
    this.loading = true;
    service.query(
      this.getQueryParams(),
      data => {
        this.tableData = data.content;

        this.loading = false;
      },
      // result_code 不是100的处理
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');
        this.loading = false;
      }
    );
  },
  add () {
    this.open = true;
    this.itemId = { id: '' };
  },
  // refresh () {
  //   this.query();
  // },
  deleteItem (ids) {
    this.$confirm('是否确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      service.delete(
        {
          ids: ids
        },
        data => {
          this.loading = false;
          this.$message.success('删除成功');
          this.query();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    });
  }
};

// 事件
const events = {
  handlePperationSuccess () {
    this.open = false;
    this.query();
  },
  handleOperate (name) {
    this[name]();
  },
  handleClick (model, e) {
    this.itemId = { id: model.id };
    this.open = true;
  },
  handleDelete (model, e) {
    this.deleteItem([model.id]);
  }
};

export default {
  name: 'PromiseMgmt',
  components: {
    BizGrid,
    BizHeader,
    PromiseList,

    rightPopup
  },
  props: {

  },
  data () {
    return {
      ...data
    };
  },
  methods: {
    ...methods,

    ...events
  },
  watch: {

  },
  created() {
    this.query();
  },
  mounted () {
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: '您可在此建立对子店铺的承诺体系',
      duration: 3000
    });
  }
};
</script>

<style lang="scss">

</style>
