<template>
  <div class="maintenance-order-list">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @sort-change="handleSortChange">
      <el-table-column label="车牌号" min-width="80px">
        <template slot-scope="scope">
          <div style="width:100%">
             <el-button @click.stop="carClick(scope.row)" type="text" size="mini">{{scope.row.plateNumber}}</el-button>
          </div>
        </template>
      </el-table-column>
      <!-- 车主 -->
      <el-table-column prop="memberName" label="客户信息" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%" class="customer-info" @click.stop="memberClick(scope.row)">
            <div class="overflow">
              {{scope.row.memberName}}
            </div>
            <div class="overflow">
              {{scope.row.mobile}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="预约详情" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              维保类型：{{scope.row.type === '0' ? '保养' : '维修'}}
            </div>
            <div class="overflow">
              费用：￥{{scope.row.cost === '' ? '0' : scope.row.cost}}
            </div>
            <div class="overflow">
              预约日期：￥{{scope.row.happenDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 方式 -->
      <el-table-column min-width="60" prop="mode" label="方式" sortable>
        <template slot-scope="scope">
          {{scope.row.mode === '0' ? '自助' : '平台'}}
        </template>
      </el-table-column>
      <el-table-column min-width="60" prop="mode" label="状态">
        <template slot-scope="scope">
          <span :style="{color: stateColor(scope.row)}">{{scope.row.state === '0' ? '未到店' : '已到店'}}</span>
        </template>
      </el-table-column>
      <!-- 所属店铺 -->
      <el-table-column min-width="150" prop="shopName" label="店铺">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shopName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="option" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: red" @click.stop="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!isBookSetting">
        <base-info :itemId="currentRowId" :currentRowType="currentRowType" @created="refresh"></base-info>
      </el-tab-pane>
      <el-tab-pane label="预约设置" name="second" v-if="isBookSetting">
        <order-setting ref="orderSetting"></order-setting>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="memberInfo" @close="memberInfo=false" v-model="memberName">
      <el-tab-pane label="基本信息" name="memberInfo">
        <membership-mgmt-base-info :itemId="memberId" @operationSuccess="operationSuccess" ref="memberInfo">
        </membership-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="车辆信息" name="carInfo">
        <membership-mgmt-vehicle-info :itemId="memberId" ref="carInfo"></membership-mgmt-vehicle-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './OrderListBaseInfo';
import OrderMgmt from '@/service/maintenance/orderMgmt';
import OrderSetting from './OrderSettings';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import { mapGetters } from 'vuex';
export default {
  name: 'OrderList',
  data() {
    return {
      isBookSetting: false,
      // 计时器ID
      timer: null,
      open: false,
      tabName: 'first',
      currentRowId: { id: '' },
      currentRowType: '0',
      // 排序
      orderProperty: '',
      orderDirection: '',
      memberName: 'memberInfo',
      memberInfo: false,
      memberId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:aftersale.appointment.add'] },
        { label: '删除', name: 'del', type: '', disabled: true, auth: ['admin:aftersale.appointment.delete'] },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '预约设置', name: 'bookSetting', type: 'primary', auth: ['admin:aftersale.appointment.set'] }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          options: [{ label: '全部', value: '' }, { label: '未到店', value: '0' }, { label: '已到店', value: '1' }]
        },
        { type: 'daterange', label: '创建日期', value: ['2011-11-11', '2012-12-12'] },
        { type: 'input', placeholder: '请输入车牌或车主姓名', name: 'searchbar', value: '' }
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
  methods: {
    operate(name) {
      this[name]();
    },
    bookSetting() {
      this.isBookSetting = true;
      this.tabName = 'second';
      this.open = true;
      this.$nextTick(() => {
        this.$refs.orderSetting.refresh();
      });
    },
    // 按钮'添加'
    add() {
      this.currentRowId = { id: '' };
      this.currentRowType = '0';
      this.tabName = 'first';
      this.open = true;
      this.isBookSetting = false;
    },
    memberClick(row) {
      this.$refs.memberInfo.operations = [];
      this.$refs.carInfo.operations = [];
      this.$refs.carInfo.ishandler = false;
      this.memberId = { id: row.userId };
      this.memberInfo = true;
    },
    // 按钮'删除'
    del(row) {
      // 删除管理员
      // 传入id为单个删除,否则为批量删除
      let ids = row ? [`${row.type}_${row.id}`] : this.multiSelected;
      // `${row.type}_${row.id}`
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
          ids: ids
        };
        OrderMgmt.delete(
          params,
          data => {
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ErrorDELETE: ', ErrorData);
          }
        );
      });
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      this.filters = val;
      this.refresh();
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = 'appointmentDate';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    // 多选
    handleSelectionChange(val) {
      this.multiSelected = [];
      this.operations.map(item => {
        if (item.name === 'del') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'del') {
            item.disabled = false;
          }
        });
      }
      val.map(row => {
        this.multiSelected = this.multiSelected.concat(`${row.type}_${row.id}`);
      });
    },
    rowClick(row) {
      this.isBookSetting = false;
      this.$nextTick(() => {
        this.currentRowId = { id: row.id };
        this.currentRowType = row.type;
        this.tabName = 'first';
        this.open = true;
      });
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
    close() {
      this.open = false;
    },
    refresh() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        state: this.filters[0].value,
        keyword: this.filters[2].value,
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      OrderMgmt.getOrderList(
        params,
        data => {
          this.tableData = data.maintainRepairAppointmentDatas;
          this.pagination.currentPage = Number(data.pageNumber);
          this.pagination.pageSize = Number(data.pageSize);
          this.pagination.total = Number(data.total);
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        }
      );
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
      this.filters[1].value[1] = `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      this.filters[1].value[0] = halfYearAgo();
    },
    stateColor(row) {
      if (row.state === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    // 60秒获得一次消息条
    getMsg() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      OrderMgmt.getMsg(
        params,
        data => {
          this.showMessage(
            `本月新增记录${data.data.monthAppointmentCount}条，今日新增记录${data.data.dayAppointmentCount}条`,
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
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:aftersale.appointment.delete');
      // return true;
    }
  },
  created() {
    this.getFormatDate();
    this.refresh();
    this.getMsg();
    this.getMsgEveryMinute();
  },
  components: {
    OrderSetting,
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo
  },
  beforeDestroy() {
    if (this.timer) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); // 关闭
      console.log('timerClear');
    }
  }
};
</script>

<style lang="scss">
.maintenance-order-list {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-pagination {
    margin-right: 100px;
  }
  .customer-info {
    color: #ff7300;
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .titleMember {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
</style>
