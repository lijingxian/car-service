<template>
  <el-dialog class="biz-dialog-selector" :title="title" :visible.sync="dialogVisible" :append-to-body="appendToBody" @close="close">
    <biz-grid class="coupon-mgmt">
      <div slot="top" class="activity-mgmt-top">
        <biz-header :filters="filters" @filterDataChange="filterDataChange"></biz-header>
      </div>
      <div class="content" ref="c-content" v-loading="loading">
        <coupon-item v-for="item of tableData" :item="item" :key="item.id" @check-change="checkChange(item,arguments[0])"></coupon-item>
      </div>
      <div slot="bottom">
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
      </div>
    </biz-grid>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="isClear" size="small" @click="clear">清除</el-button>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="confirmed">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import couponItem from './CouponItem';
import { couponMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'BizDialogSelector',
  components: {
    couponItem,
    BizGrid,
    BizHeader,
    BizPagination
  },
  props: {
    title: {
      require: true,
      type: String,
      default() {
        return ' ';
      }
    },
    visibility: {
      require: true,
      type: Boolean
    },
    appendToBody: {
      default: true,
      type: Boolean
    },
    keyField: {
      type: String,
      default() {
        return 'id';
      }
    },
    isClear: {
      default: true,
      type: Boolean
    },
    selectionKeys: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入卡券名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      loading: false,
      dialogVisible: false,
      // 选中项目的id数组
      innerSelectionKeys: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  methods: {
    close(e) {
      // 清空选中信息，防止下次打开时有选中状态
      this.innerSelectionKeys = [];

      this.$emit('update:visibility', false);
      this.$emit('close', false);
    },
    confirmed() {
      if (this.innerSelectionKeys.length > 0) {
        this.$emit('confirmed', this.innerSelectionKeys);
        this.dialogVisible = false;
      } else {
        this.$message('请选择一项');
      }
    },
    clear() {
      this.tableData.forEach(item => {
        item.checked = false;
      });
      this.innerSelectionKeys = [];
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.$refs['c-content'].parentNode.scrollTop = 0;
      this.getList();
    },
    getList() {
      let params = {
        type: '13',
        searchValue: this.filters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      http
        .get(couponMgmt.list, params)
        .then(data => {
          for (const iterator of data.dataList) {
            iterator.checked = false;
            if (this.selectionKeys.includes(iterator.id)) {
              iterator.checked = true;
            }
          }
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(data => {})
        .finally(() => {
          this.loading = false;
        });
    },
    checkChange(item, value) {
      this.tableData.find(column => {
        return column.id === item.id;
      }).checked = value;
      let index = this.innerSelectionKeys.findIndex(selectionId => selectionId === item.id);
      if (index === -1) {
        this.innerSelectionKeys.push(item.id);
      } else {
        this.innerSelectionKeys.splice(index, 1);
      }
    }
  },
  watch: {
    visibility(newVal, oldVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.innerSelectionKeys = [];
        for (const iterator of this.selectionKeys) {
          this.innerSelectionKeys.push(iterator);
        }
        this.pagination.currentPage = 1;
        this.filters[0].value = '';
        this.getList();
      }
    }
  },
  computed: {},
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
$biz-dialog-selector-height: 80;

.biz-dialog-selector {
  .el-input-group {
    width: 295px;
  }
  .el-input__validateIcon {
    display: none;
  }
  > .el-dialog {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: unquote($biz-dialog-selector-height + '%');
    margin: unquote(5 / $biz-dialog-selector-height * 100 + '%') auto !important;

    > .el-dialog__body {
      position: relative;
      flex-grow: 1;
      padding: 0;
      margin: 5px 20px;

      .biz-header {
        box-shadow: none;
        padding: 5px 0;

        .filter-wrap {
          margin: 0;
        }
      }

      .biz-table {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        > .biz-table-body {
          flex-grow: 1;
        }
      }

      .biz-pagination {
        padding-top: 10px;
      }
    }
  }
  .biz-table-filter .filter-wrap .biz-select .el-select {
    width: 240px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .coupon-wrap {
      .coupon-item {
        height: 82px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
