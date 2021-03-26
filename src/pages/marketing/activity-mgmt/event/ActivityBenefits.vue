<template>
  <biz-grid class="activity-benefits" v-loading="loading">
    <el-table :data="tableData" style="width: 100%" size="small" :span-method="objectSpanMethod">
      <el-table-column prop="label" label="" width="100"></el-table-column>
      <el-table-column prop="name" label="指标"></el-table-column>
      <el-table-column prop="value" label="指标值"></el-table-column>
    </el-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
export default {
  name: 'MemberBaseInfo',
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
      radio: '1',
      // 用户信息
      formModel: {},
      selections: [],
      tableData: [],
      pos: 0,
      position: 0,
      contentSpanArr: [],
      spanArr: [],
      operations: [
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入手机号',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  created() {
    if (this.itemId) this.getList();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    getList() {
      http
        .get(activityMgmt.localMarketingStatistics, {
          id: this.itemId || '',
          searchValue: this.filters[0].value || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        .then(data => {
          this.formModel = data;
          this.tableData = [
            {
              label: '', name: '总签到人数', value: data.signMembers + '人'
            },
            {
              label: '互动', name: '互动人数', value: data.interactMembers + '人'
            },
            {
              label: '互动', name: '互动条数', value: data.interactCounts + '条'
            },
            {
              label: '抽奖', name: '抽奖人次', value: data.lotteryTimes + '次'
            },
            {
              label: '打赏', name: '打赏次数', value: data.rewardTimes + '次'
            },
            {
              label: '打赏', name: '打赏人数', value: data.rewardTimes + '人'
            },
            {
              label: '打赏', name: '受赏节目数', value: data.rewardItems + '个'
            },
            {
              label: '打赏', name: '赏金总数', value: data.rewardSum + '元'
            }
          ];
          this.getSpan(this.tableData);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getSpan(data) {
      this.spanArr = [];
      this.contentSpanArr = [];
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          this.contentSpanArr.push(1);
          this.position = 0;
        } else {
          if (data[i].label === data[i - 1].label) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
          if (data[i].label === data[i - 1].label) {
            this.contentSpanArr[this.position] += 1;
            this.contentSpanArr.push(0);
          } else {
            this.contentSpanArr.push(1);
            this.position = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  }
};
</script>

<style lang="scss">
.activity-benefits {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .header_1 {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .header_2 {
    .span {
      margin-right: 10px;
    }
    font-size: 12px;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
