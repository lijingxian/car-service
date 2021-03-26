<template>
  <biz-grid class="rescue-setting">
    <div slot="top" class="top_header">
      分配方式：
      <el-radio-group size="small" v-model="distributWay">
        <el-radio label="1">手动</el-radio>
        <el-radio label="0">自动</el-radio>
      </el-radio-group>
    </div>
    <biz-flex-table ref="biztable" :operations="operations" @operate="operate" :tableData="tableData" :loading="loading" :checkable="(distributWay==='1')?false:true"
      @selection-change="handleSelectionChange">
      <el-table-column width="200" prop="name" label="救援人员">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column prop="workerState" label="状态">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{ scope.row.workerState === '1' ? '任务中' : '空闲' }}</span>
        </template>
      </el-table-column>
    </biz-flex-table>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
export default {
  name: 'RescueSetting',
  data() {
    return {
      distributWay: '1',
      loading: false,
      selections: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      tableData: []
    };
  },
  components: {
    BizFlexTable,
    BizGrid
  },
  created() {},
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.workerState === '0') {
        // 空闲
        return '#67c23a';
      } else {
        // 任务中
        return '#f56c6c';
      }
    },
    getList() {
      service.rescuers(
        {
          shopId: window.top.SHOP_ID
        },
        data => {
          this.distributWay = data.shop.distributWay;
          this.tableData = data.workers;
          this.$nextTick(function() {
            this.tableData.forEach(item => {
              if (item.isOnGuard === '1') {
                this.$refs.biztable.toggleRowSelection(item, true);
              }
            });
          });
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      if (this.selections.length === 0) {
        this.$message.warning('请选择一条记录');
        return false;
      }
      service.rescuerSetting(
        {
          distributWay: this.distributWay,
          shopId: window.top.SHOP_ID,
          ids: this.selections.map(item => {
            return item.id;
          })
        },
        data => {
          this.$message.success('保存成功');
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    operationSuccess() {
      this.getList();
    },
    handleSelectionChange(val) {
      this.selections = val;
    }
  }
};
</script>

<style lang="scss">
.rescue-setting {
  .el-table {
    height: 100% !important;
  }
  .biz-header {
    float: right;
  }
  .top_header {
    padding: 10px 0px 0px 10px;
    font-size: 12px;
  }
}
</style>
