<template>
  <div class="push-audit-setting">
    <biz-flex-table ref="table" v-loading="loading" :tableData="tableData" :checkable="false" @row-click="rowClick">
      <el-table-column prop="position" label="推送位置" :formatter="positionFormatter"></el-table-column>
      <el-table-column prop="way" label="审核方式" :formatter="wayFormatter"></el-table-column>
    </biz-flex-table>
    <div slot="float">
      <right-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="handleOperationSuccess"></right-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import RightPopup from './PushAuditPopup';
import http from '@/common/http';
import { mapGetters } from 'vuex';

export default {
  name: 'DistributorMgmt',
  components: { BizFlexTable, RightPopup },
  props: {},
  data() {
    return {
      itemId: { id: '' },
      loading: false,
      tableData: [],
      open: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    ...mapGetters(['getUser']),
    handleOperationSuccess() {
      this.open = false;
      this.getList();
    },
    rowClick(val) {
      this.itemId = {
        id: val.id
      };
      this.open = true;
    },
    getList() {
      let params = {
        store: this.getUser().shop.id || window.top.SHOP_ID
      };
      if (this.open !== true) {
        this.loading = true;
      }
      http
        .get('/admin/recommendApproval/configs.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
          setTimeout(() => {
            this.$refs.table.doLayout();
          }, 500);
        })
        .catch(ErrorData => {
          console.log(ErrorData);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    positionFormatter(row) {
      switch (row.position) {
        case '0':
          return '服务推荐';
        case '1':
          return 'App启动';
        case '2':
          return '爱车频道';
        case '5':
          return '领优惠券';
        case '6':
          return 'V商宣传';
        case '8':
          return '百度信息流';
        case '9':
          return '百度搜索推广';
        case '10':
          return '今日头条';
        default:
          return '--';
      }
    },
    wayFormatter(row) {
      switch (row.way) {
        case '0':
          return '系统审核';
        case '1':
          return '人工审核';
        default:
          return '--';
      }
    }
  }
};
</script>

<style lang="scss">
.push-audit-setting {
  padding-right: 5px;
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
