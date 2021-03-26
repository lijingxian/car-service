<template>
  <biz-grid class="vehicle-mgmt-all-vehicle">
    <div slot="top" class="vehicle-mgmt-all-vehicle__header">
      <div v-if="isMotorcadeMode()" class="header__operator">
        <el-button size="small" type="primary" @click="faultCar">故障车辆监测</el-button>
        <el-button size="small" type="primary" @click="costMgmt">费用管理</el-button>
        <el-button size="small" type="primary" @click="signupMgmt">签到管理</el-button>
      </div>
      <div class="header__operator_fence" v-show="showMode === '0'">
        <el-checkbox @change="showAllFence" v-model="checked">显示围栏</el-checkbox>
      </div>
      <el-radio-group v-model="showMode" size="small">
        <el-radio-button label="0">地图位置</el-radio-button>
        <el-radio-button label="1">车辆列表</el-radio-button>
      </el-radio-group>
    </div>
    <biz-map
      :value="carIds"
      v-show="showMode === '0'"
      :maxDistance="maxDistance"
      :fences="fences"
      @addClickHandler="rowOperationClickHandler"
      ref="map"
    ></biz-map>
    <div class="toggle-btn" @click="isShow" v-if="showMode==='1'">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      v-show="showMode === '1'"
      ref="table"
      :operations="operations"
      :filters="filters"
      :pagination="pagination"
      :tableData="tableData"
      :loading="loading"
      @operate="operateHandler"
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      @selection-change="selectionChangeHandler"
      @filter-data-change="filterDataChangeHandler"
      @row-click="rowOperationClickHandler"
      @active-item-change="activeItemChange"
      @cascader-change="cascaderChange"
      @sort-change="handleSortChange"
      class="order-mgmt-tabel"
    >
      <template slot="operation" v-if="hasAuthImport">
        <import-file
          :tableData="importResult"
          :importLoading="importLoading"
          :total="total"
          :disabled="disabled"
          :count="count"
          :percentage="percentage"
          @clearTimeOut="clearTimeOut"
          @restProcess="restProcess"
          :stepkey="stepkey"
          :action="'/admin/car/importCar.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
          v-if="!isMotorcadeMode()"
        >
          <el-table-column label="编号" prop="line" width="50"></el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
        </import-file>
      </template>
      <!-- <el-table-column v-for="col of columns" :key="col.id" :label="col.name" :min-width="getWith(col)">
        <template slot-scope="scope">
          <div v-if="col.id === '1'" class="carlenies">
            <div>{{scope.row.plateNumber}}</div>
            <i class="iconfont biz-icon-i-web-xsz" v-show="!!scope.row.carLicense&&scope.row.carLicense.positiveImage"></i>
          </div>
          <el-button v-else-if="col.id === '2'" type="text" size="mini" @click="handleMemberClick($event, scope.row)">
            <span style="white-space:normal">{{scope.row.member.name}}</span>
          </el-button>
          <div v-else-if="col.id === '3'" style="width:100%">
            <div class="customer-info">{{scope.row.shops.length>0?scope.row.shops[0].name:''}}</div>
          </div>
          <div v-else-if="col.id === '4'" style="width:100%">
            <div class="customer-info">{{scope.row.type}}</div>
          </div>
          <div v-else-if="col.id === '5'">
            <div>{{scope.row.carInsurance.insuranceCompany}}</div>
            <div>{{scope.row.carInsurance.leaveDays?scope.row.carInsurance.leaveDays+'天到期':''}}</div>
          </div>
          <div v-else-if="col.id === '6'">
            <div>{{scope.row.carMaintain.leaveDays?scope.row.carMaintain.leaveDays+'天':''}}</div>
            <div>{{scope.row.carMaintain.leaveMiles?scope.row.carMaintain.leaveMiles+'公里':''}}</div>
          </div>
          <div v-else-if="col.id === '7'">
            <el-button
              v-for="(item, index) in scope.row.terminals"
              :key="index"
              type="text"
              size="mini"
              @click="handleRouterPush($event, item)"
            >{{item.name}}</el-button>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="车辆" prop="number" min-width="200">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.plateNumber}}
            </div>
            <div class="overflow">
              {{scope.row.type}}
            </div>
            <div class="overflow">
              状态：{{getState(scope.row)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="车主信息" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%" @click="handleMemberClick($event, scope.row)">
            <div class="overflow">
              <el-button size="mini" type="text" class="overflow">{{ scope.row.member.name }}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="insuranceFlag" sortable="custom" min-width="110">
        <template slot="header">
          保险预警
          <el-button type="text" size="small" v-popover:filePath>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="filePath" placement="bottom-start" width="300" trigger="hover">
            下次保险距离当日小于一年
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.carInsurance.insuranceCompany}}</div>
            <div class="overflow" v-if="scope.row.carInsurance&&scope.row.carInsurance.leaveDays">{{scope.row.carInsurance.leaveDays?scope.row.carInsurance.leaveDays+'天到期':''}}</div>
            <div class="overflow" v-if="scope.row.carInsurance&&scope.row.carInsurance.overdays">{{scope.row.carInsurance.overdays?'已过期'+scope.row.carInsurance.overdays+'天':''}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maintainFlag" min-width="110" sortable="custom">
        <template slot="header">
          保养预警
          <el-button type="text" size="small" v-popover:iPath>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="iPath" placement="bottom-start" width="300" trigger="hover">
            下次保养距离当日小于3个月/6个月/一年
          </el-popover>
        </template>
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow" v-if="scope.row.carMaintain&&scope.row.carMaintain.leaveDays">{{scope.row.carMaintain.leaveDays?scope.row.carMaintain.leaveDays+'天':''}}</div>
            <div class="overflow">{{scope.row.carMaintain.leaveMiles?scope.row.carMaintain.leaveMiles+'公里':''}}</div>
            <div class="overflow" v-if="scope.row.carMaintain&&scope.row.carMaintain.overdays">{{scope.row.carMaintain.overdays?'已过期'+scope.row.carMaintain.overdays+'天':''}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="终端" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <div v-for="(item, index) in scope.row.terminals"
                :key="index">
                <el-button
                type="text"
                size="mini"
                @click="handleRouterPush($event, item)"
              >{{item.name}}</el-button>
                <div>状态：{{item.status}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="所属店铺" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shops.length>0?scope.row.shops[0].name:''}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="110">
        <template #default="scope">
          <!-- 注意，biz-column-operation里面需要使用v-if控制按钮显示逻辑 -->
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" v-if="hasAbility(scope.row, '29')" @click.stop="history(scope.row)">轨迹</el-button>
            <el-button type="text" size="mini" v-if="hasAbility(scope.row, '30')" @click.stop="intime(scope.row)">定位</el-button>
            <el-button type="text" size="mini" v-if="hasAuthDel" @click.stop="deleteHandler(scope.row)">删除</el-button>
          </biz-column-operation>
        </template>
        <!-- <template #header>
          <div class="custom-header">
            <div>操作</div>
            <i @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template> -->
      </el-table-column>
    </biz-flex-table>
    <el-dialog
      :visible.sync="dialogVisible1"
      @close="dialogVisible=false"
      title="定位"
      append-to-body
      custom-class="test-drive-history-dialog"
      fullscreen
    >
      <!-- <iframe :src="'/#/vehicle/drive-in-time?carId='+carId" style="height:100vh" width="100%" frameborder="0" scrolling="no"></iframe> -->
      <drive-in-time :carId="carId"></drive-in-time>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="dialogVisible1=false"
      title="轨迹"
      append-to-body
      custom-class="test-drive-history-dialog"
      fullscreen
    >
      <!-- <iframe :src="'/#/vehicle/drive-history?carId='+carId" style="height:100vh" width="100%" frameborder="0" scrolling="no"></iframe> -->
      <drive-history :carId="carId"></drive-history>
    </el-dialog>
    <div slot="float">
      <vehicle-popup
        :open="open"
        :itemId="itemId"
        :row="row"
        :plateNumber="plateNumber"
        :number="number"
        :terminalId="terminalId"
        :abilities="carAbilities"
        :carState="carState"
        :icon="icon"
        @close="open = false;"
        :isEdit="isEdit"
        @operationSuccess="operationSuccess"
        @closeOpen="closeOpen"
      ></vehicle-popup>

      <motorcade-popup :open="openMotorcade" :itemId="motorcadeId" :isEdit="isEdit" @close="handleMotorcadeClose"></motorcade-popup>

      <member-vehicle-picker v-show="false" ref="vehiclePicker" @on-confirm="handleConfirm" :title="'车辆选择'"></member-vehicle-picker>
    </div>
    <biz-popup-tabs :open="memberInfo" @close="memberInfo=false" v-model="memberName">
      <el-tab-pane label="基本信息" name="Info">
        <membership-mgmt-base-info :itemId="memberId" ref="memberInfo" @operationSuccess="refresh"></membership-mgmt-base-info>
      </el-tab-pane>
      <el-tab-pane label="车辆信息" name="carInfo">
        <membership-mgmt-vehicle-info :itemId="memberId" ref="carInfo"></membership-mgmt-vehicle-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <terminal-popup
      :open="openTerminal"
      :itemId="itemId"
      @close="openTerminal = false;"
      :abilities="carAbilities"
      @operationSuccess="operationSuccess"
    ></terminal-popup>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { ImportFile } from '@/components/BizUpload';
import MemberVehiclePicker from './component/MemberVehiclePicker';
import { BizMap } from '@/components/BizMap';
import MembershipMgmtBaseInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '@/pages/member/membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import VehiclePopup from './vehicle/VehiclePopup';
import MotorcadePopup from './motorcade/MotorcadePopup';
import { BizPopupTabs } from '@/components/BizPopup';
import { mapGetters } from 'vuex';
import service from '@/service/vehicle-mgmt/VehicleMgmtVehicle';
import serviceInfo from '@/service/vehicle-mgmt/VehicleBaseInfo';
import { global } from '@/common/urls';
import http from '@/common/http';
import TerminalPopup from '@/pages/operating/terminal-mgmt-new/terminal/TerminalPopup';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import DriveInTime from './DriveInTime';
import DriveHistory from './DriveHistory';
export default {
  name: 'VehicleMgmtAllVehicle',
  components: {
    BizGrid,
    BizFlexTable,
    BizMap,
    ImportFile,
    MemberVehiclePicker,
    BizPopupTabs,
    VehiclePopup,
    MotorcadePopup,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo,
    TerminalPopup,
    DriveInTime,
    DriveHistory
  },
  props: {},
  data() {
    return {
      tableId: '1',
      host: window.location.protocol + '//' + window.location.host,
      isInited: false,
      memberInfo: false,
      openTerminal: false,
      checked: false,
      isEdit: true,
      orderProperty: '',
      orderDirection: '',
      row: {},
      dialogVisible1: false,
      dialogVisible: false,
      carId: '',
      memberName: 'Info',
      memberId: { id: '' },
      // 控件
      itemId: { id: '' },
      carState: {},
      icon: {},
      plateNumber: '',
      number: '',
      terminalId: '',
      classId: '',
      carAbilities: {},
      selections: [],
      carIds: [],
      fences: [],
      editShopIds: [],
      showMode: '1',
      maxDistance: '',
      // 车队信息
      openMotorcade: false,
      motorcadeId: { id: '' },

      // 右侧弹窗
      open: false,
      // Table相关
      loading: false,
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:car.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:car.delete']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '模板下载',
          name: 'download',
          type: ''
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '车型',
          name: 'type',
          filterable: false,
          class: 'hidden',
          value: [],
          options: []
        },
        {
          type: 'inputrange',
          label: '到期预警',
          name: 'earlyWarnin',
          class: 'hidden',
          selectValue: '0',
          selectOptions: [
            { label: '保险(天)', value: '0' },
            { label: '保养(天)', value: '1' },
            { label: '保养(公里)', value: '2' }
          ],
          value1: '',
          value2: ''
        },
        {
          type: 'select',
          label: '所属店铺',
          name: 'searchValue',
          class: 'hidden',
          filterable: true,
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入车主/车牌号/用户名',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageTotal: 0
      },

      importResult: [],
      importLoading: false,
      showRecommend: false,
      disabled: false,
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: ''
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthImport() {
      // return true;
      return this.currentAuth.includes('admin:car.import');
    },
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:car.delete');
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.query();
    },
    getState(row) {
      if (row.terminals.length === 0) {
        return '未联网';
      } else if (row.terminals.length > 0) {
        if (row.terminals[0].terminalState.drivingState === '99') {
          return '离线:未知';
        } else if (row.terminals[0].terminalState.drivingState === '0') {
          return '在线:行驶';
        } else if (row.terminals[0].terminalState.drivingState === '1') {
          return '在线:停车';
        } else if (row.terminals[0].terminalState.drivingState === '2') {
          return '在线:熄火';
        } else if (row.terminals[0].terminalState.drivingState === '3') {
          return '在线:怠速';
        } else if (row.terminals[0].terminalState.drivingState === '4') {
          return 'SOS';
        } else if (row.terminals[0].terminalState.drivingState === '5') {
          return '故障';
        }
      }
    },
    getWith(col) {
      if (col.id === '2') {
        return 120;
      } else if (col.id === '3') {
        return 140;
      } else if (col.id === '4') {
        return 180;
      }
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    history(row) {
      this.carId = row.id;
      this.dialogVisible = true;
    },
    intime(row) {
      this.carId = row.id;
      this.dialogVisible1 = true;
    },
    cascaderChange(value) {
      this.filters[0].value = value;
      this.query();
    },
    activeItemChange(value) {
      if (value.length === 1) {
        this.querySeriesList(value);
      }
      if (value.length === 2) {
        this.queryTypeList(value);
      }
    },
    closeOpen() {
      this.itemId = { id: '' };
    },
    queryBrandList() {
      serviceInfo.queryBrandList(
        {},
        data => {
          let obj;
          this.filters[0].options = [];
          obj = {};
          obj.label = '全部';
          obj.value = '';
          this.filters[0].options.push(obj);
          data.dataList.forEach(element => {
            obj = {};
            obj.label = element;
            obj.value = element;
            obj.children = [];
            this.filters[0].options.push(obj);
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySeriesList(value) {
      console.log(this.filters[0]);
      serviceInfo.querySeriesList(
        { brand: value[0] },
        data => {
          let obj;
          this.filters[0].options.forEach(element => {
            if (element.value === value[0]) {
              element.children = [{ label: '全部', value: '' }];
              data.dataList.forEach(item => {
                obj = {};
                obj.label = item;
                obj.value = item;
                obj.children = [];
                element.children.push(obj);
              });
            }
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryTypeList(value) {
      console.log(this.filters[0].options);
      serviceInfo.queryTypeList(
        { series: value[1], brand: value[0] },
        data => {
          let obj;
          this.filters[0].options.forEach(element => {
            if (element.value === value[0]) {
              element.children.forEach(children => {
                if (children.value === value[1]) {
                  children.children = [{ label: '全部', value: '' }];
                  data.dataList.forEach(item => {
                    obj = {};
                    obj.label = item;
                    obj.value = item;
                    children.children.push(obj);
                  });
                }
              });
            }
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    isMotorcadeMode() {
      if (this.$route.params.groupId) return true;
      else return false;
    },
    getMotorcadeId() {
      return this.$route.params.groupId;
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '7'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    queryAlertInfo() {
      service.queryAlertInfo(
        {},
        data => {
          let msg = '今日新增车辆 ' + data.todayCount + '，店铺车辆总数 ' + data.shopcount + '，联盟车辆总数 ' + data.count;
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryMotorcadeAlertInfo() {
      service.queryMotorcadeVehicles(
        Object.assign(
          {
            fleetId: this.getMotorcadeId()
          },
          this.getQueryParams()
        ),
        data => {
          let msg = '车队拥有车辆数 ' + data.total + '，可添加、删除车队车辆，进行车辆故障监测、费用管理、签到管理 ';
          this.$message({
            customClass: 'motorcade__kpi',
            showClose: true,
            message: msg,
            duration: 3000
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    terminalConverter(row) {
      let arr = [];
      if (row.terminals) {
        row.terminals.forEach(item => {
          arr.push(item.name);
        });
      }

      return arr.join(', ');
    },
    stateImageConverter(model) {
      let path = model.icon ? model.icon.path : '';
      let state = model.drivingState;

      /**
       * 当前车辆状态
       * [
       *   99->离线:未知
       *   0->在线:行驶
       *   1->在线:停车
       *   2->在线:熄火
       *   3->在线:怠速
       * ]
       * 0、1、3：绿色
       * 2：橙色
       * 99：灰色
       */
      switch (state) {
        case '0':
        case '1':
        case '3':
          path += '/map_green.png';
          break;
        case '2':
          path += '/map_orange.png';
          break;
        default:
          path += '/map_grey.png';
      }

      return path;
    },
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isMotorcadeMode()) {
          service.deleteMember(
            {
              ids: ids,
              fleetId: this.getMotorcadeId()
            },
            data => {
              this.$message.success('删除成功');
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          service.delete(
            {
              ids: ids
            },
            data => {
              this.$message.success('删除成功');
              console.log(ids.length);
              console.log(this.tableData);
              if (this.tableData.length === ids.length) {
                this.pagination.currentPage = this.pagination.currentPage - 1;
              }
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    deleteShopItem(shipids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isMotorcadeMode()) {
          service.deleteMember(
            {
              ids: shipids,
              fleetId: this.getMotorcadeId()
            },
            data => {
              this.$message.success('删除成功');
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          service.delete(
            {
              ids: shipids
            },
            data => {
              this.$message.success('删除成功');
              console.log(shipids.length);
              console.log(this.tableData);
              if (this.tableData.length === shipids.length) {
                this.pagination.currentPage = this.pagination.currentPage - 1;
              }
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        }
      });
    },
    listCarMap() {
      let carIds = [];
      for (let i = 0; i < this.tableData.length; i++) {
        carIds.push(this.tableData[i].id);
      }
      let ids = carIds.join('&ids=');
      service.listCarMap(
        { ids: ids },
        data => {
          this.carIds = data.cars;
          this.maxDistance = data.maxDistance;
          this.setAbilities(this.carIds);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    showAllFence(val) {
      if (val) {
        this.checked = val;
        let memberIds = [];
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].member.id) {
            memberIds.push(this.tableData[i].member.id);
          }
        }
        service.showAllFences(
          {
            fleetId: this.getMotorcadeId() || '',
            memberIds: !this.getMotorcadeId() ? memberIds.join('&memberIds=') : []
          },
          data => {
            this.fences = data.fences;
            this.loading = false;
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.$refs.map.clearOverlays();
        this.listCarMap();
      }
    },
    operationSuccess() {
      this.open = false;
      this.query();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model, e, column) {
      if (column && column.label === '操作') return;
      // if (model.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
      //   this.isEdit = false;
      // } else {
      //   this.isEdit = true;
      // }
      this.itemId = { id: model.id, carShipId: model.carshipId, userId: model.member.id || this.getUser.id };
      this.plateNumber = String(model.plateNumber);
      this.number = String(model.number);
      console.log(model);
      this.icon = model.icon;
      this.carState = Object.assign({}, model.carState);
      if (model.terminals) {
        // 只有TBOX的设备的id会传递给车辆标定页面
        model.terminals.forEach(item => {
          if (String(item.type) === '5') {
            this.terminalId = item.id;
          }
        });
      }
      this.carAbilities = model.abilities;
      this.row = model;
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
      if (this.operations[1].disabled) {
        this.operations[1].disabled = true;
        if (val.length > 0 || this.getUser.roleLevel !== 'shop') {
          this.operations[1].disabled = false;
        }
      }
    },
    filterDataChangeHandler() {
      this.$set(this.pagination, 'currentPage', 1);
      this.query();
    },
    deleteHandler(model) {
      let shops = [];
      if (this.getUser.roleLevel === 'shop' && !this.$route.params.groupId) {
        model.shops.forEach(item => {
          shops.push({
            carshipId: model.carshipId,
            id: model.id,
            shopId: item.id,
            companyId: window.top.Company_ID || ''
          });
        });
        this.deleteShopItem(shops);
      } else {
        this.deleteItem(shops);
      }
    },
    pathHandler(e, model) {
      window.open(document.location.protocol + '//' + window.location.host + '/#/vehicle/drive-history?carId=' + model.id);
    },
    locateHandler(e, model) {
      window.open(document.location.protocol + '//' + window.location.host + '/#/vehicle/drive-in-time?carId=' + model.id);
    },
    handleRouterPush(e, model) {
      this.itemId = { id: model.id, terminalTypeId: model.terminalTypeId };
      this.carAbilities = model.abilities;
      e.stopPropagation();
      this.openTerminal = true;
    },
    handleMotorcadeClose(e) {
      this.openMotorcade = false;
      // this.query();
    },
    handleMemberClick(e, row) {
      e.stopPropagation();
      this.memberName = 'Info';
      this.memberId = { id: row.member.id };
      this.memberInfo = true;
    },

    hasAbility(model, ability) {
      if (model.abilities && model.abilities[ability]) return true;
      else return false;
    },
    getQueryParams() {
      return {
        brandName: this.filters[0].value.length > 0 ? this.filters[0].value[0] : '',
        seriesName: this.filters[0].value.length > 1 ? this.filters[0].value[1] : '',
        carTypeName: this.filters[0].value.length > 2 ? this.filters[0].value[2] : '',
        scopeType: this.filters[1].selectValue,
        minValue: this.filters[1].value1,
        maxValue: this.filters[1].value2,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[3].value,
        shopId: this.filters[2].value || window.top.SHOP_ID,
        maintainFlag: this.orderProperty === 'maintainFlag' ? this.orderDirection : '',
        insuranceFlag: this.orderProperty === 'insuranceFlag' ? this.orderDirection : ''
      };
    },
    setAbilities(arr) {
      arr.forEach(item => {
        let map = {};
        if (item.terminals && item.terminals.length > 0) {
          item.terminals.forEach(terminal => {
            terminal.alibities.forEach(ability => {
              map[ability.ability] = true;
            });
          });
        }
        item.abilities = map;
      });
      return arr;
    },
    query() {
      this.loading = true;
      // 查询分为车队车辆查询以及全部车辆查询
      if (this.isMotorcadeMode()) {
        service.queryMotorcadeVehicles(
          Object.assign(
            {
              fleetId: this.getMotorcadeId()
            },
            this.getQueryParams()
          ),
          data => {
            this.loading = false;

            let arr = data.carList;
            this.setAbilities(arr);
            this.tableData = arr;

            // 首次查询后显示车队信息
            if (this.isMotorcadeMode() && !this.isInited) {
              this.openMotorcade = true;
              this.isInited = true;
            }

            this.$set(this.pagination, 'total', Number.parseInt(data.total));
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            console.log(ErrorData);
            console.log('code错误');
            if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
          }
        );
      } else {
        service.query(
          this.getQueryParams(),
          data => {
            this.loading = false;

            let arr = data.cars;
            this.setAbilities(arr);
            this.tableData = arr;

            if (this.isMotorcadeMode()) this.openMotorcade = true;

            this.$set(this.pagination, 'total', Number.parseInt(data.total));
          },
          // result_code 不是100的处理
          ErrorData => {
            this.loading = false;
            console.log(ErrorData);
            console.log('code错误');
            if (ErrorData.errorMessage !== '店铺不存在') this.$message.warning(ErrorData.errorMessage);
          }
        );
      }
    },
    queryCompanyList() {
      service.queryCompanyList(
        {
          shopId: window.top.SHOP_ID
        },
        data => {
          let arr = data.shops;
          arr.map(item => {
            item.label = item.name;
            item.value = item.id;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[2], 'options', data.shops);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    add() {
      if (this.isMotorcadeMode()) {
        this.$refs.vehiclePicker.showDialog = true;
      } else {
        this.open = true;
        this.itemId = { id: '' };
      }
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let shops = [];
        if (this.getUser.roleLevel === 'shop' && !this.$route.params.groupId) {
          this.selections.forEach(element => {
            element.shops.forEach(item => {
              shops.push({
                carshipId: element.carshipId,
                id: element.id,
                shopId: item.id,
                companyId: window.top.Company_ID || ''
              });
            });
          });
          this.deleteShopItem(shops);
        } else {
          this.selections.forEach(element => {
            element.shops.forEach(item => {
              shops.push({
                id: element.id,
                shopId: item.id,
                companyId: window.top.Company_ID || ''
              });
            });
          });
          this.deleteItem(shops);
        }
      } else {
        this.$message('请选择一个车辆');
      }
    },
    refresh() {
      this.query();
    },
    download() {
      window.open('/upload/mode/V服爱车_车辆基础数据导入模板.xlsx');
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    restProcess() {
      this.total = 0;
      this.count = 0;
      this.stepkey = '';
      this.percentage = 0;
    },
    handleImport() {
      let url = '/admin/car/importProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.importFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.importFile.showCurrentInfo = false;
            this.$refs.importFile.title = '导入完成';
            this.refresh();
            if (data.data && data.data.results && data.data.results.length > 0) {
              this.importResult = data.data.results;
              this.$refs.importFile.uploadingVisible = false;
              this.$refs.importFile.importingVisible = true;
            }
            this.disabled = false;
          } else if (data.data && data.data.rate && data.data.rate !== '100') {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.handleImport, 2000);
            this.$refs.importFile.uploadingVisible = true;
            this.$refs.importFile.showCurrentInfo = true;
            this.disabled = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    handleConfirm(ids) {
      service.addMember(
        {
          ids: ids,
          fleetId: this.getMotorcadeId()
        },
        data => {
          this.$message.success('添加成功');

          this.query();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    costMgmt(e) {
      this.$router.push({
        name: 'vehicle-mgmt-cost',
        params: {
          groupId: this.getMotorcadeId()
        }
      });
    },
    signupMgmt(e) {
      console.log('getId: ', this.getMotorcadeId());
      this.$router.push({
        path: '/car/vehicle-mgmt/signup',
        query: {
          id: this.getMotorcadeId()
        }
      });
    },
    faultCar(e) {
      window.open(
        document.location.protocol +
          '//' +
          window.location.host +
          '/#/vehicle/fault-car-listioner?fleetId=' +
          this.getMotorcadeId()
      );
    },

    numberConverter(row) {
      return row[0];
    },
    infoConverter(row) {
      return row[row.length - 1] === 'ok' ? '' : row[row.length - 1];
    }
  },
  watch: {
    showMode(val) {
      if (val === '0') {
        console.log(1);
        this.listCarMap();
        this.checked = false;
      }
    }
  },
  created() {
    // this.operations[0].label = this.isMotorcadeMode() ? '添加' : '新增';
    this.motorcadeId = { id: this.getMotorcadeId() };
    this.queryCompanyList();
    this.query();
    this.handleImport();
    this.getEditableStores();
    this.queryBrandList();
    // 如果显示的是车队成员列表，则隐藏模板相关
    if (this.isMotorcadeMode()) {
      this.operations.pop();
      this.queryMotorcadeAlertInfo();
    } else {
      this.queryAlertInfo();
    }
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle {
  .column1 {
    width: 100px;
  }
  .el-table_1_column_4 {
    .el-button {
      margin-right: 0px;
      margin-left: 5px;
    }
  }
  .el-table_1_column_5 {
    .el-button {
      margin-right: 0px;
      margin-left: 5px;
    }
  }
  .biz-header__filter-wrapper {
    width: 100%;
    .biz-table-filter {
      width: 100%;
    }
    .biz-table-filter .filter-wrap .biz-input-range .el-input-group__prepend .el-select .el-input__inner {
      width: 125px !important;
    }
  }
  .customer-info {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .biz-popup .popup-content {
    width: 600px;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 18px;
    }
  }
  .carlenies {
    display: flex;
    .iconfont {
      color: #ff7300;
      font-size: 32px;
    }
  }
  .a_font {
    text-decoration: none;
    color: #ff7300;
  }
  .biz-grid {
    padding: 5px 15px 5px 15px !important;
  }
  .vehicle-mgmt-all-vehicle__header {
    text-align: right;
    padding: 0px 15px;

    .header__operator {
      float: left;
    }
    .header__operator_fence {
      margin: 5px 0px 0px 20px;
      float: left;
    }
  }
  .el-button {
    text-align: left;
  }
}

.imoprt-error-text {
  color: #f56c6c;
  font-weight: bold;

  &.imoprt-success-text {
    color: #449d44;
  }
}
.motorists-club-activity__kpi {
  top: 45px;
}
.motorcade__kpi {
  top: 80px !important;
}
</style>
