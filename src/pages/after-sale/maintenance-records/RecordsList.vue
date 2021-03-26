<template>
  <div class="maintenance-records-list">
    <biz-flex-table :operations="operations" @operate="operate" :filters="filters" @filter-data-change="filterDataChange"
      :tableData="tableData" :pagination="pagination" @selection-change="handleSelectionChange" @row-click="rowClick"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
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
      <el-table-column prop="memberName" label="维保详情" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              维保项目：{{itemFormatter(scope.row)}}
            </div>
            <div class="overflow">
              费用：￥{{scope.row.cost}}
            </div>
            <div class="overflow">
              日期：￥{{scope.row.happenDate}}
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
        <template slot-scope="scope" v-if="hasAuthDel">
          <el-button size="mini" type="text" @click.stop="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!isSetting">
        <base-info :itemId="currentRowId" ref="baseInfo" @created="refresh"></base-info>
      </el-tab-pane>
      <!-- <el-tab-pane label="历史故障" name="second" v-if="currentRowId.id !== '' && !isSetting">
        <past-records :id="currentCarId" @created="refresh"></past-records>
      </el-tab-pane> -->
      <el-tab-pane label="提醒设置" name="third" v-if="isSetting">
        <notification-settings ref="NotificationSettings"></notification-settings>
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
    <vehicle-popup :open="openCar" :itemId="carId" :plateNumber="plateNumber" :abilities="carAbilities" :carState="carState"
      :icon="icon" @close="openCar = false;" :isEdit="true">
    </vehicle-popup>
  </div>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizFlexTable } from '@/components/BizTable';
import BaseInfo from './RecordsListBaseInfo';
import { mapGetters } from 'vuex';
import NotificationSettings from './NotificationSettings';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import VehiclePopup from '@/pages/operating/vehicle-mgmt/vehicle/VehiclePopup';
export default {
  name: 'RecordsList',
  data() {
    return {
      // 计时器ID
      timer: null,
      isSetting: false,
      open: false,
      openCar: false,
      tabName: 'first',
      userId: '',
      carState: {},
      icon: {},
      currentRowId: { id: '' },
      carId: { id: '' },
      currentCarId: '',
      carAbilities: {},
      memberName: 'memberInfo',
      memberInfo: false,
      memberId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:aftersale.maintain.add'] },
        { label: '删除', name: 'del', disabled: true, auth: ['admin:aftersale.maintain.delete'] },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '提醒设置', name: 'setting', type: '', auth: ['admin:aftersale.maintain.set'] }
      ],
      filters: [
        {
          type: 'daterange',
          label: '日期区间：',
          value: ['2011-11-11', '2012-12-12']
        },
        {
          type: 'input',
          placeholder: '请输入车牌号/姓名/手机号',
          name: 'searchbar',
          value: ''
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
      multiSelected: [],
      plateNumber: ''
    };
  },
  methods: {
    operate(name) {
      this[name]();
    },
    memberClick(row) {
      this.$refs.memberInfo.operations = [];
      this.$refs.carInfo.operations = [];
      this.$refs.carInfo.ishandler = false;
      this.memberId = { id: row.userId };
      this.memberInfo = true;
    },
    // 按钮'添加'
    add() {
      this.isCreate = true;
      this.isSetting = false;
      this.currentRowId = { id: '' };
      this.currentCarId = '';
      this.tabName = 'first';
      // if (this.$refs.baseInfo) {
      //   this.$refs.baseInfo.refresh('');
      // }
      this.open = true;
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
        this.multiSelected = this.multiSelected.concat(row.id);
      });
    },
    carClick(model) {
      this.carId = { id: model.carId, carShipId: model.carshipId, userId: model.userId };
      this.plateNumber = String(model.plateNumber);
      this.number = String(model.number);
      console.log(model);
      this.icon = model.icon || {};
      this.carState = Object.assign({}, model.carState);
      if (model.terminals) {
        // 只有TBOX的设备的id会传递给车辆标定页面
        model.terminals.forEach(item => {
          if (String(item.type) === '5') {
            this.terminalId = item.id;
          }
        });
      }
      this.carAbilities = model.abilities || {};
      this.openCar = true;
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
      this.open = true;
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
      if (format.length > 63) {
        format = format.slice(0, 63) + '...';
      }
      return format;
    },
    close() {
      this.open = false;
    },
    refresh() {
      console.log('filters: ', this.filters);
      let params = {
        shopId: window.top.SHOP_ID || '',
        keyword: this.filters[1].value,
        beginDate: this.filters[0].value[0],
        endDate: this.filters[0].value[1],
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      MaintenanceRecords.getRecordsList(
        params,
        data => {
          this.tableData = data.carMaintainDatas;
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
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      return this.currentAuth.includes('admin:aftersale.maintain.delete');
      // return true;
    },
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
    this.refresh();
    this.getMsg();
    this.getMsgEveryMinute();
  },
  watch: {},
  components: {
    BizPopupTabs,
    BizFlexTable,
    BaseInfo,
    NotificationSettings,
    VehiclePopup,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo
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
.maintenance-records-list {
  .biz-table-body .biz-pagination {
    justify-content: flex-end;
  }
  .el-input-group {
    width: 225px;
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
