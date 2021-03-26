<template>
  <div class="distributor-mgmt">
    <biz-flex-table
      ref="table"
      v-loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :checkable="false"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="name" label="名称" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">{{scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column prop="price" label="配送费用" width="250">
        <template slot-scope="scope">
          <div class="price">
            <div v-if="scope.row.isNeedDelivery==='1'">
              <div>首重：{{scope.row.firstPrice}}元/{{scope.row.firstWeight}}KG</div>
              <div>续重：{{scope.row.continuePrice}}元/{{scope.row.continueWeight}}KG</div>
            </div>
            <div v-else>{{scope.row.freight}}元</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="order" label="排序" width="150"></el-table-column> -->
      <el-table-column prop="description" label="介绍"></el-table-column>
      <el-table-column prop="name" label="状态" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol"><span :style="{color: stateColor(scope.row)}">{{scope.row.isValid==='1'?'启用':'停用'}}</span></div>
        </div>
      </el-table-column>
      <el-table-column width="120" label="操作">
      <template slot-scope="scope">
        <div class="biz-customcol">
          <el-button type="text" size="mini" @click.stop="scope.row.id===tableData[0].id?'':moveUp(scope.row)">上移</el-button>
          <el-button type="text" size="mini" @click.stop="scope.row.id===tableData[tableData.length-1].id?'':moveDown(scope.row)">下移</el-button>
        </div>
      </template>
    </el-table-column>
    </biz-flex-table>
    <el-dialog :visible="open" append-to-body :open="open" @close="open=false">
      <distributor-info :obj="distributorObj" @refresh="getList"></distributor-info>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
// import { BizPopupTabs } from '@/components/BizPopup';
import DistributorInfo from './DistributorInfo';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'DistributorMgmt',
  components: { BizFlexTable, DistributorInfo },
  props: {},
  data() {
    return {
      distributorObj: {
        id: ''
      },
      loading: false,
      tableData: [],
      dataList: [],
      open: false,
      activeTabName: 'shippingMethodInfo',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 1
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    rowClick(val) {
      this.distributorObj = {
        id: val.id
      };
      this.$nextTick(() => {
        this.open = true;
      });
    },
    moveUp(row) {
      this.loading = true;
      let order = row.order;
      this.tableData.map(item => {
        if (item.id === row.id) {
          this.tableData[this.tableData.indexOf(row)].order = this.tableData[this.tableData.indexOf(row) - 1].order;
          this.tableData[this.tableData.indexOf(row) - 1].order = order;
          this.dataList = [this.tableData[this.tableData.indexOf(row)], this.tableData[this.tableData.indexOf(row) - 1]];
          this.order();
        }
      });
    },
    moveDown(row) {
      this.loading = true;
      let order = row.order;
      this.dataList = [];
      this.tableData.map(item => {
        if (item.id === row.id) {
          this.tableData[this.tableData.indexOf(row)].order = this.tableData[this.tableData.indexOf(row) + 1].order;
          this.tableData[this.tableData.indexOf(row) + 1].order = order;
          this.dataList = [this.tableData[this.tableData.indexOf(row)], this.tableData[this.tableData.indexOf(row) + 1]];
          this.order();
        }
      });
    },
    order() {
      http
        .put('/admin/shippingMethod/shippingMethodSort.jhtml', this.dataList)
        .then(data => {
          this.getList();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    stateColor(row) {
      if (row.isValid === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    showUp(row) {
      if (this.tableData[0] && row.id === this.tableData[0].id) {
        return false;
      } else {
        return true;
      }
    },
    showDown(row) {
      if (this.tableData[0] && row.id === this.tableData[this.tableData.length - 1].id) {
        return false;
      } else {
        return true;
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      if (this.open !== true) {
        this.loading = true;
      }
      http
        .get(urls.distributorMgmt.DistributorList, params)
        .then(data => {
          for (const row of data.content) {
            row.description = row.description || '';
            let reg = /<\/?.+?\/?>/g;
            row.description = row.description.replace(reg, '');
          }
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          setTimeout(() => {
            this.$refs.table.doLayout();
          }, 500);
          this.open = false;
        })
        .catch(ErrorData => {
          console.log(ErrorData);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.distributor-mgmt {
  padding-right: 5px;
  .biz-save-button {
    margin-top: 5px;
  }
}
</style>
