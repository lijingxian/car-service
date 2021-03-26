<template>
  <div class="maintenance-records-list-ve">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="!showForm">
      <!-- 维修保养项目 -->
      <el-table-column width="100" prop="item" label="维保项目" :formatter="itemFormatter">
      </el-table-column>
      <!-- 费用 -->
      <el-table-column width="80" prop="cost" label="费用">
        <template slot-scope="scope">
          ￥{{scope.row.cost}}
        </template>
      </el-table-column>
      <!-- 行驶里程 -->
      <el-table-column width="100" prop="cost" label="行驶里程">
        <template slot-scope="scope">
          {{scope.row.drivingRange?scope.row.drivingRange+'km':''}}
        </template>
      </el-table-column>
      <!-- 方式 -->
      <el-table-column width="80" prop="mode" label="方式" sortable>
        <template slot-scope="scope">
          {{scope.row.mode === '0' ? '自助' : '平台'}}
        </template>
      </el-table-column>
      <!-- 日期 -->
      <el-table-column width="100" prop="happenDate" label="日期">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="option" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: red" @click.stop="del(scope.row.id)"
            v-if="scope.row.shop.id===getUser.shop.id">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog :visible.sync="showForm" center append-to-body width="500px">
      <records-list-base-info :itemId="currentRowId" :row="row" ref="baseInfo" @created="refresh" @cancle="isShow">
      </records-list-base-info>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import RecordsListBaseInfo from './RecordsListBaseInfo';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'RecordsList',
  data() {
    return {
      // 计时器ID
      timer: null,
      isSetting: false,
      open: false,
      showForm: false,
      tabName: 'first',
      currentRowId: { id: '' },
      currentCarId: '',
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', disabled: true },
        { label: '刷新', name: 'refresh', type: '' }
      ],
      filters: [
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      multiSelected: []
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    // 按钮'添加'
    add() {
      this.isCreate = true;
      this.isSetting = false;
      this.currentRowId = { id: '' };
      this.currentCarId = '';
      this.showForm = true;
    },
    isShow() {
      this.showForm = false;
    },
    // 按钮'删除'
    del(id) {
      // 传入id为单个删除,否则为批量删除
      let ids = id ? Array(id) : this.multiSelected;
      if (ids.length === 0) {
        this.$message.warning('未选择删除条目');
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ids,
          shopId: window.top.SHOP_ID
        };
        MaintenanceRecords.delete(
          params,
          data => {
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ERR_DELETE: ', ErrorData);
          }
        );
      });
    },
    setting() {
      this.tabName = 'third';
      this.isSetting = true;
      this.open = true;
      if (this.$refs.NotificationSettings) {
        this.$refs.NotificationSettings.refresh();
      }
    },
    // 过滤器发生变动
    filterDataChange(val) {
      console.log('> ', val);
      this.filters = val;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      if (val.length > 0) {
        this.operations[1].disabled = false;
      } else {
        this.operations[1].disabled = true;
      }
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(row.id);
        if (row.shop.id !== this.getUser.shop.id) {
          this.operations[1].disabled = true;
        }
      });
    },
    rowClick(row) {
      this.isCreate = false;
      this.isSetting = false;
      this.$nextTick(() => {
        this.currentRowId = { id: row.id };
      });
      this.currentCarId = row.carId;
      this.tabName = 'first';
      // if (this.$refs.baseInfo) {
      //   this.$refs.baseInfo.refresh();
      // }
      this.showForm = true;
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 状态/店铺名过滤
    filterHandler(value, row, column) {
      const property = column.property;
      if (property === 'shopName') {
        return row.shopName === value;
      } else if (property === 'mode') {
        return row.mode === value;
      }
    },
    // 修改维修保养项目格式
    itemFormatter(row, column) {
      let format = [];
      row.implementedItems.map(item => {
        format = format.concat(item.name);
      });
      format = format.join(',');
      if (format.length > 21) {
        format = format.slice(0, 18) + '...';
      }
      return format;
    },
    close() {
      this.open = false;
    },
    refresh() {
      console.log('filters: ', this.filters);
      this.showForm = false;
      let params = {
        carId: this.itemId.id,
        shopId: window.top.SHOP_ID || '',
        keyword: '',
        beginDate: this.filters[0].value[0],
        endDate: this.filters[0].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get('/admin/maintenance/maintenanceRecordsByCar.jhtml', params)
        .then(data => {
          this.tableData = data.carMaintainDatas;
          this.pagination.currentPage = Number(data.pageNumber);
          this.pagination.pageSize = Number(data.pageSize);
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          this.$message.warning(errData.errorMessage);
        });
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      this.filters[0].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[0].value[0] = halfYearAgo();
    },
    // 60秒获得一次消息条
    getMsg() {
      let params = {
        shopId: window.top.SHOP_ID
      };
      MaintenanceRecords.getMsg(
        params,
        data => {
          this.showMessage(
            `维保记录${data.data.maintainCount}条，今日新增记录${data.data.dayMaintainCount}条，今日维保金额${data.data.dayMaintainOrderCost}元`,
            'info'
          );
        },
        ErrorData => {
          console.log('ERR_GET_MSG', ErrorData);
        }
      );
    },
    getMsgEveryMinute() {
      this.timer = setInterval(this.getMsg, 60000);
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    // 店铺过滤列表
    shopFilter: function(param) {
      let shopFilter = [];
      let tmp = [];
      this.tableData.map(row => {
        shopFilter = shopFilter.concat(row.shopName);
      });
      const set = new Set(shopFilter);
      shopFilter = [...set];
      shopFilter = shopFilter.map(item => {
        // 将空值移到最前
        if (item === '') {
          tmp.unshift({ text: '无', value: '' });
        } else {
          tmp = tmp.concat({ text: item, value: item });
        }
      });
      return tmp;
    }
  },
  created() {
    this.getFormatDate();
    this.getMsg();
    this.getMsgEveryMinute();
  },
  mounted() {
    this.itemId && this.refresh();
  },
  watch: {
    itemId(newVal, oldVal) {
      this.getFormatDate();
      this.refresh();
      this.showForm = false;
    }
  },
  components: {
    BizFlexTable,
    RecordsListBaseInfo
  },
  beforeDestroy() {
    if (this.timer) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); // 关闭
    }
  }
};
</script>

<style lang="scss">
.maintenance-records-list-ve {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-input-group {
    width: 225px;
  }
  .biz-table-filter .filter-wrap .biz-date-range .el-date-editor--daterange.el-input__inner {
    width: 200px;
  }
}
</style>
