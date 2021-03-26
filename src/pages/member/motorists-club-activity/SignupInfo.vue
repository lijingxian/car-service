<template>
  <biz-grid class="motorists-club-activity__signup-info">
    <div slot="top" class="signup-info__top">
      <div class="text">
        已报名 {{count}} 人/限额 {{limit}} 人
      </div>
      <biz-save-button :operations="operations"
                      @operate="operate"
                      >
      </biz-save-button>
    </div>
    <biz-flex-table ref="table"
                    :pagination="pagination"
                    :tableData="tableData"
                    :loading="loading"
                    :checkable="false"

                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                    >
      <el-table-column v-for="col in columnData" :key="col.id" :prop="col.id" :label="col.content">
      </el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizFlexTable } from '@/components/BizTable';
import SignupInfoService from '@/service/motorists-club-activity/SignupInfo';
import { BizGrid } from '@/components/BizGrid';
export default {
  name: 'SignupInfo',
  components: {
    BizGrid,
    BizFlexTable,
    BizSaveButton
  },
  data () {
    return {
      loading: false,
      columnData: [],
      tableData: [],
      filters: [],
      operations: [
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },

      count: 0,
      limit: 0
    };
  },
  props: {
    cardId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  methods: {
    query () {
      this.loading = true;
      SignupInfoService.query(
        {
          activityId: this.cardId.id
        },
        data => {
          let temp = [];

          this.columnData = data.optionData;
          data.content.forEach(element => {
            temp.push(element.option);
          });
          this.tableData = temp;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));
          this.$set(this.pagination, 'totalPages', Number.parseInt(data.totalPages));

          this.count = data.total;
          this.limit = data.fleetActivity ? data.fleetActivity.limitNumber ? Number.parseInt(data.fleetActivity.limitNumber) : 0 : 0;
          this.limit = this.limit === 0 ? '-' : this.limit;
          // console.log(data);

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    operate (name) {
      this[name]();
    },
    export () {
      SignupInfoService.export(
        {
          activityId: this.cardId.id
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },

    pageSizeChange (val) {
      this.pagination.pageSize = val;
      this.query();
    },
    currentPageChange (val) {
      this.pagination.currentPage = val;
      this.query();
    },
    clearInfo() {
      this.tableData = [];
      this.count = 0;
      this.limit = 0;
      this.pagination.total = 0;
    }
  },
  watch: {
    cardId (nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.clearInfo();
      }
    }
  }
};
</script>

<style lang="scss">
.motorists-club-activity__signup-info {
  padding-top: 20px;
  .biz-save-button {
    float: left;
  }
  .signup-info__top {

    .text {
      color: #929292;
      font-size: 14px;
      float: left;
      margin: 5px 20px;
    }
  }
}
</style>
