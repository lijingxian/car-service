<template>
  <biz-grid class="terminal-mgmt-terminal">
    <div slot="top" class="terminal-mgmt-all-vehicle__header">
      <el-radio-group v-model="showMode" size="small">
        <el-radio-button label="0">地图位置</el-radio-button>
        <el-radio-button label="1">设备列表</el-radio-button>
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
    <div class="toggle-btn" @click="isShow">
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
    >
      <template slot="operation">
        <import-file
          :tableData="importResult"
          :importLoading="importLoading"
          :total="total"
          :disabled="disabled"
          :count="count"
          :percentage="percentage"
          @clearTimeOut="clearTimeOut"
          :stepkey="stepkey"
          :action="'/admin/terminal/importTerminal.jhtml'"
          :name="'uFile'"
          ref="importFile"
          @handle-import="handleImport"
          style="margin-left: 10px;"
        >
          <el-table-column label="编号" prop="line" width="50"></el-table-column>
          <el-table-column label="消息" prop="result"></el-table-column>
        </import-file>
      </template>
      <!-- <el-table-column v-for="col of columns" :key="col.id" :label="col.name">
        <template slot-scope="scope">
          <div v-if="col.id === '1'">{{scope.row.name}}</div>
          <div v-else-if="col.id === '2'">{{scope.row.terminalTypeName}}</div>
          <div v-else-if="col.id === '3'">{{scope.row.carPlateNumber}}</div>
          <div v-else-if="col.id === '4'">{{scope.row.number}}</div>
          <div v-else-if="col.id === '5'">{{scope.row.commCard.number}}</div>
          <div v-else-if="col.id === '6'">
            <div class="customer-info" v-for="(shop,index) in scope.row.shopDatas" :key="index">{{shop.name}}</div>
          </div>
          <el-button
            v-else-if="col.id === '7'"
            type="text"
            size="mini"
            @click="rowNameClickHandler($event, scope.row)"
          >{{scope.row.memberData?scope.row.memberData.name:''}}</el-button>
          <div v-else-if="col.id === '8'">{{statusConverter(scope.row)}}</div>
          <div v-else-if="col.id === '9'">{{scope.row.createDate}}</div>
          <div v-else-if="col.id === '11'">{{modeConverter(scope.row)}}</div>
          <div v-else-if="col.id === '10'">{{scope.row.happenDate}}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="终端产品" min-width="150">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">产品序列号：{{scope.row.number}}</div>
            <div class="overflow">终端名称：{{scope.row.name}}</div>
            <div class="overflow">终端分类：{{scope.row.terminalTypeName}}</div>
            <div class="overflow">创建日期：{{scope.row.createDate}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="originalName" label="绑定车辆">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.carPlateNumber||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="styleType" label="所有者">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <el-button type="text" size="mini" @click="rowNameClickHandler($event, scope.row)">{{scope.row.memberData?(scope.row.memberData.name||'--'):'--'}}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="SIM卡号" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.commCard.number||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="状态">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow"><span :style="{color: stateColor(scope.row)}">{{statusConverter(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="模式">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{modeConverter(scope.row)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ability" label="所属店铺" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.shopDatas.length>0?scope.row.shopDatas[0].name:'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="100">
        <template #default="scope">
          <!-- 注意，biz-column-operation里面需要使用v-if控制按钮显示逻辑 -->
          <biz-column-operation :row="scope.row">
            <el-button
              type="text"
              size="mini"
              @click.stop="startHandler($event, scope.row)"
              v-if="scope.row.status === '0' && scope.row.unionConfig.editable ==='1' && hasAuthOn"
            >启用</el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="stopHandler($event, scope.row)"
              v-if="scope.row.status === '1'&& scope.row.unionConfig.editable ==='1' && hasAuthOff"
            >停用</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="hasAbility(scope.row, '29')&& scope.row.unionConfig.editable ==='1'"
              @click.stop="history(scope.row)"
            >轨迹</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="hasAbility(scope.row, '30')&& scope.row.unionConfig.editable ==='1'"
              @click.stop="intime(scope.row)"
            >定位</el-button>
            <el-button
              type="text"
              size="mini"
              v-if="(scope.row.unionConfig.editable ==='1')&&hasAuthDel"
              @click.stop="deleteHandler($event, scope.row)"
            >删除</el-button>
            <el-button type="text" size="mini" @click.stop="code($event, scope.row)" v-show="scope.row.terminalTypeName ==='LPR'">查看小程序码</el-button>
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
    <el-dialog :visible.sync="codeDialogVisible" @close="codeDialogVisible=false" :title="title" append-to-body center width="520px">
      <img :src="url" width="470" v-if="url" />
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible1"
      @close="dialogVisible=false"
      title="定位"
      append-to-body
      custom-class="test-drive-history-dialog"
      fullscreen
    >
      <!-- <iframe :src="'/#/vehicle/drive-in-time?terminalId='+terminalId" style="height:100vh" width="100%" frameborder="0" scrolling="no"></iframe> -->
      <drive-in-time :terminalId="terminalId"></drive-in-time>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="dialogVisible1=false"
      title="轨迹"
      append-to-body
      custom-class="test-drive-history-dialog"
      fullscreen
    >
      <!-- <iframe :src="'/#/vehicle/drive-history?terminalId='+terminalId" style="height:100vh" width="100%" frameborder="0" scrolling="no"></iframe> -->
      <drive-history :terminalId="terminalId"></drive-history>
    </el-dialog>
    <div slot="float">
      <el-dialog title="分配" :visible.sync="dialogAllocateVisible" width="500px" :append-to-body="true">
        <el-form
          ref="allocateForm"
          size="small"
          label-width="110px"
          :model="allocateModel"
          :rules="getUser().roleLevel==='platform'?allocateRules:{}"
        >
          <el-form-item label="所属运营商" prop="operator">
            <biz-operator-picker v-model="allocateModel.operator" @input="handleOperatorChange" v-show="getUser().roleLevel==='platform'"></biz-operator-picker>
            <span v-show="getUser().roleLevel==='shop'">{{getUser().compy.name}}</span>
          </el-form-item>
          <el-form-item label="所属店铺" prop="storeData">
            <biz-shop-picker v-model="allocateModel.storeData.id" :operatorId="operatorId" v-show="getUser().roleLevel==='platform'"></biz-shop-picker>
            <span v-show="getUser().roleLevel==='shop'">{{getUser().shop.name}}</span>
          </el-form-item>
          <el-form-item label="所有者">
            <people-picker v-model="allocateModel.memberData" :shopId="allocateModel.storeData.id" :operatorId="operatorId"></people-picker>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="allocateOperations" @operate="operateHandler" style="margin-right: 0;"></biz-save-button>
      </el-dialog>

      <terminal-popup
        :open="open"
        :itemId="itemId"
        @close="open = false;"
        :abilities="carAbilities"
        :number="number"
        :isEdit="isEdit"
        @operationSuccess="operationSuccess"
      ></terminal-popup>
      <!-- 侧边弹出栏 -->
      <biz-popup-tabs :open="openInfo" @close="closeTab" v-model="tabName">
        <el-tab-pane label="会员信息" name="first" v-if="openMember">
          <member-info :itemId="memberId" @update="refresh"></member-info>
        </el-tab-pane>
        <el-tab-pane label="通讯卡信息" name="first" v-if="openCommuniCard">
          <card-info :itemId="cardId" @update="refresh"></card-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizOperatorPicker } from '@/components/BizOperatorPicker';
import { ImportFile } from '@/components/BizUpload';
import { BizPopupTabs } from '@/components/BizPopup';
import BizSaveButton from '@/components/BizSaveButton';
import PeoplePicker from './component/PeoplePicker';
import TerminalPopup from './terminal/TerminalPopup';
import MemberInfo from './MembershipBaseInfo';
import CardInfo from './CommuniCardBaseInfo';
import service from '@/service/terminal-mgmt/TerminalMgmtTerminal';
import serviceClass from '@/service/terminal-mgmt/TerminalMgmtClass';
import date from '@/utils/date.js';
import http from '@/common/http';
import { terminalMgmt } from '@/common/urls';
import { mapGetters } from 'vuex';
import { BizMap } from '@/components/BizMap';
import { BizShopPicker } from '@/components/BizShopPicker';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
import DriveInTime from './DriveInTime';
import DriveHistory from './DriveHistory';
export default {
  name: 'TerminalMgmtTerminal',
  components: {
    BizFlexTable,
    BizSaveButton,
    PeoplePicker,
    BizOperatorPicker,
    ImportFile,
    BizPopupTabs,
    BizShopPicker,
    MemberInfo,
    CardInfo,
    BizGrid,
    TerminalPopup,
    BizMap,
    DriveInTime,
    DriveHistory
  },
  props: {},
  data() {
    return {
      tableId: '2',
      host: window.location.protocol + '//' + window.location.host,
      tabName: 'first',
      showMode: '1',
      maxDistance: '',
      url: '',
      codeDialogVisible: false,
      number: '',
      fences: [],
      carIds: [],
      // 查看信息
      openInfo: false,
      dialogVisible: false,
      dialogVisible1: false,
      // 查看会员
      openMember: false,
      isEdit: true,
      memberId: { id: '' },
      // 查看通讯卡
      openCommuniCard: false,
      cardId: { id: '' },
      // 控件
      itemId: {},
      selections: [],
      user: {},
      carAbilities: {},
      // 右侧弹窗
      open: false,
      openClass: false,

      // Table相关
      loading: false,
      title: '',
      terminalId: '',
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['caradmin:operateDevice.manage.add']
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['caradmin:operateDevice.manage.delete']
        },
        {
          label: '分配',
          name: 'allocate',
          type: '',
          disabled: true,
          class: 'show',
          auth: ['caradmin:operateDevice.manage.edit']
        },
        {
          label: '启用',
          name: 'start',
          type: '',
          disabled: true,
          auth: ['caradmin:operateDevice.manage.on']
        },
        {
          label: '停用',
          name: 'stop',
          type: '',
          disabled: true,
          auth: ['caradmin:operateDevice.manage.off']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: '',
          disabled: false
        },
        {
          label: '模板下载',
          name: 'download',
          type: ''
        }
      ],
      filters: [
        {
          type: 'daterange',
          label: '创建日期',
          name: 'date',
          class: 'hidden',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          class: 'hidden',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '0',
              label: '停用'
            },
            {
              value: '1',
              label: '启用'
            },
            {
              value: '2',
              label: '未审核'
            }
          ]
        },
        {
          type: 'select',
          label: '终端分类',
          name: 'class',
          class: 'hidden',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称/序列号/所有者',
          name: 'searchValue',
          value: this.$route.params.terminalNumber ? this.$route.params.terminalNumber : ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },

      dialogAllocateVisible: false,
      allocateModel: this.getDefaultAllocateForm(),
      allocateRules: {
        operator: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(this.allocateModel.operator);
              if (this.allocateModel.operator && this.allocateModel.operator.length > 0) {
                callback();
              } else {
                callback(new Error('请选择所属运营商'));
              }
            }
          }
        ],
        storeData: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.allocateModel.storeData.id) {
                callback(new Error('请选择所属店铺'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      allocateOperations: [
        {
          label: '取消',
          name: 'cancelAllocate'
        },
        {
          label: '保存',
          name: 'saveAllocate',
          type: 'primary'
        }
      ],

      importResult: [],
      importLoading: false,
      disabled: false,
      showRecommend: false,
      storeData: {},
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: ''
    };
  },
  mounted() {
    if (this.getUser().roleLevel === 'shop') {
      this.operations.map(item => {
        if (item.name === 'allocate') {
          item.class = 'hidden';
        }
      });
    }
  },
  watch: {
    showMode(val) {
      if (val === '0') {
        this.listCarMap();
      }
    },
    $route(to, from) {
      // 查询权限
      // this.openClass = true;
      this.queryAuth();
      this.query();
      this.handleImport();
      // 如果是平台运营，则隐藏新增按钮
      this.user = this.getUser();
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    ...mapGetters(['getUser']),
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
    progress(e, file, fileList) {
      console.log(e.percent);
    },
    history(row) {
      this.terminalId = row.id;
      this.dialogVisible = true;
    },
    intime(row) {
      this.terminalId = row.id;
      this.dialogVisible1 = true;
    },
    listCarMap() {
      let carIds = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.getUser().roleLevel === 'shop') {
          carIds.push(this.tableData[i].storeTerminalId);
        } else {
          carIds.push(this.tableData[i].id);
        }
      }
      let ids = carIds.join('&ids=');
      let storeTerminalIds = carIds.join('&storeTerminalIds=');
      this.getUser().roleLevel === 'shop' &&
        http
          .get('/admin/terminal/manage/terminals/map.jhtml' + '?storeTerminalIds=' + storeTerminalIds)
          .then(data => {
            this.carIds = data.dataList;
            this.maxDistance = data.maxDistance;
            this.setAbilities(this.carIds);
            this.loading = false;
          })
          .catch(errData => {
            this.loading = false;
            this.$message.warning(errData.errorMessage);
          });

      this.getUser().roleLevel !== 'shop' &&
        http
          .get('/admin/terminal/manage/terminals/map.jhtml' + '?ids=' + ids)
          .then(data => {
            this.carIds = data.dataList;
            this.maxDistance = data.maxDistance;
            this.setAbilities(this.carIds);
            this.loading = false;
          })
          .catch(errData => {
            this.loading = false;
            this.$message.warning(errData.errorMessage);
          });
    },
    deleteItem(ids) {
      let params = {};
      if (this.getUser().roleLevel === 'shop') {
        params = {
          ids: ids
        };
      } else {
        params = {
          ids: ids
        };
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete('/admin/terminal/manage/terminal/v20190816.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();

            this.loading = false;

            // 首次查询后展示终端分类信息
            if (!this.isInited) {
              // this.openClass = true;
              this.isInited = true;
            }
          })
          .catch(errData => {
            this.loading = false;
            // 查询后展示终端分类信息
            // this.openClass = true;
            this.$message.warning(errData.errorMessage);
          });
      });
    },
    switchItemState(ids, state) {
      this.$confirm(state === '1' ? '是否确认启用？' : '是否确认停用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.switchState(
          {
            ids: ids,
            state: state
          },
          data => {
            this.$message.success('操作成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    hasAbility(model, ability) {
      if (model.abilities && model.abilities[ability]) return true;
      else return false;
    },
    operationSuccess() {
      this.open = false;
      this.openClass = false;
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
      // if (column.label === '操作') return;
      this.carAbilities = model.abilities;
      this.number = model.number;
      this.itemId = {
        id: model.id,
        storeTerminalId: model.storeTerminalId,
        terminalTypeId: model.terminalTypeId,
        userId: model.memberData.id || this.getUser().id
      };
      if (model.unionConfig.editable === '0') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations.map(item => {
        if (item.name === 'allocate' || item.name === 'start' || item.name === 'stop' || item.name === 'delete') {
          item.disabled = true;
        }
      });
      if (val.length > 0) {
        this.operations.map(item => {
          if (item.name === 'allocate' || item.name === 'start' || item.name === 'stop' || item.name === 'delete') {
            item.disabled = false;
          }
        });
        this.selections.map(item => {
          if (item.shopDatas.length > 0) {
            this.operations.map(item => {
              if (item.name === 'allocate') {
                item.disabled = true;
              }
            });
          }
        });
      }
    },
    filterDataChangeHandler() {
      this.pagination.currentPage = 1;
      this.query();
    },
    startHandler(e, model) {
      this.switchItemState([model.id], '1');
    },
    stopHandler(e, model) {
      this.switchItemState([model.id], '0');
    },
    code(e, model) {
      this.loading = true;
      http
        .get('/admin/intelligent/manage/lprCode.jhtml', { id: model.id, typeId: model.terminalTypeId, isQrCode: false })
        .then(data => {
          this.loading = false;
          this.url = data.path;
          if (model.position === '0') {
            this.title = '入口小程序码';
          } else {
            this.title = '出口小程序码';
          }
          this.codeDialogVisible = true;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    deleteHandler(e, model) {
      if (this.getUser().roleLevel === 'shop') {
        this.deleteItem([
          {
            storeTerminalId: model.storeTerminalId,
            id: model.id,
            shopId: model.shopData.id,
            companyId: window.top.Company_ID || ''
          }
        ]);
      } else {
        this.deleteItem([{ id: model.id, shopId: model.shopData.id, companyId: window.top.Company_ID || '' }]);
      }
    },
    pathHandler(e, model) {
      window.open(document.location.protocol + '//' + window.location.host + '/#/vehicle/drive-history?terminalId=' + model.id);
    },
    locateHandler(e, model) {
      window.open(document.location.protocol + '//' + window.location.host + '/#/vehicle/drive-in-time?terminalId=' + model.id);
    },
    handleOperatorChange(val) {
      this.allocateModel.memberData = {
        id: '',
        name: ''
      };
      this.allocateModel.storeData = {
        id: '',
        name: ''
      };
    },
    closeTab() {
      this.openInfo = false;
      this.openMember = false;
      this.openCommuniCard = false;
    },
    rowNameClickHandler(e, model) {
      e.stopPropagation();
      this.openMember = true;
      this.memberId = { id: model.memberData.id };
      this.openInfo = true;
    },
    rowSimClickHandler(e, model) {
      e.stopPropagation();
      this.openCommuniCard = true;
      this.cardId = { id: model.simData.id };
      this.openInfo = true;
    },

    getQueryParams() {
      return {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        beginTime: this.filters[0].value[0] || '',
        endTime: this.filters[0].value[1] || '',
        state: this.filters[1].value || '',
        terminalTypeId: this.filters[2].value || '',
        searchValue: this.filters[3].value
      };
    },
    query() {
      this.loading = true;
      http
        .get('/admin/terminal/manage/terminals/v20190816.jhtml', this.getQueryParams())
        .then(data => {
          let arr = data.dataList;
          arr.forEach(item => {
            item.memberData = Object.assign({}, item.memberData);
          });

          this.tableData = arr;
          console.log(arr);
          this.setAbilities(arr);
          this.$set(this.pagination, 'total', Number(data.total));

          this.loading = false;

          // 首次查询后展示终端分类信息
          if (!this.isInited) {
            // this.openClass = true;
            this.isInited = true;
          }
        })
        .catch(errData => {
          this.loading = false;
          // 查询后展示终端分类信息
          // this.openClass = true;
          this.$message.warning(errData.errorMessage);
        });
    },
    setAbilities(arr) {
      arr.forEach(item => {
        let map = {};
        if (item.alibities && item.alibities.length > 0) {
          item.alibities.forEach(alibitie => {
            map[alibitie.ability] = true;
          });
        }
        item.abilities = map;
      });
      return arr;
    },
    add() {
      this.open = true;
      this.itemId = { id: '', terminalTypeId: '' };
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          if (this.getUser().roleLevel === 'shop') {
            ids.push({
              storeTerminalId: element.storeTerminalId,
              id: element.id,
              shopId: element.shopData.id,
              companyId: element.companyData.id
            });
          } else {
            ids.push({
              storeTerminalId: element.storeTerminalId,
              id: element.id,
              shopId: element.shopData.id,
              companyId: element.companyData.id
            });
          }
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个终端');
      }
    },
    // 查询是否有跳转到会籍管理的权限
    queryAuth() {
      http
        .get(terminalMgmt.queryAuth, {})
        .then(data => {
          data.authorities.map(data => {
            if (data === 'admin:member.edit') {
              this.isAuthorized = true;
            }
          });
        })
        .catch();
    },
    start() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.switchItemState(ids, '1');
      } else {
        this.$message('请选择一个终端');
      }
    },
    stop() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.switchItemState(ids, '0');
      } else {
        this.$message('请选择一个终端');
      }
    },
    refresh() {
      this.query();
    },
    allocate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.dialogAllocateVisible = true;
        this.allocateModel.ids = ids || [];
      } else {
        this.$message('请选择一个终端');
      }
    },
    download() {
      window.open('/upload/mode/V服爱车_终端设备导入模板.xlsx');
    },

    getDefaultAllocateForm(ids) {
      return {
        ids: ids || [],
        operator: [],
        memberData: {
          id: '',
          name: ''
        },
        storeData: {
          id: '',
          name: ''
        }
      };
    },
    cancelAllocate() {
      this.dialogAllocateVisible = false;
    },
    saveAllocate() {
      this.$refs.allocateForm.validate((valid, a) => {
        if (valid) {
          let companyId = '';
          if (
            this.allocateModel.operator &&
            this.allocateModel.operator.length > 0 &&
            this.allocateModel.operator[this.allocateModel.operator.length - 1] === ''
          ) {
            companyId = this.allocateModel.operator[this.allocateModel.operator.length - 2];
          }
          if (
            this.allocateModel.operator &&
            this.allocateModel.operator.length > 0 &&
            this.allocateModel.operator[this.allocateModel.operator.length - 1] !== ''
          ) {
            companyId = this.allocateModel.operator[this.allocateModel.operator.length - 1];
          }
          service.allocate(
            {
              ids: this.allocateModel.ids,
              companyId: this.getUser().roleLevel === 'platform' ? companyId : this.getUser().compy.id,
              userId: this.allocateModel.memberData.id,
              shopId: this.getUser().roleLevel === 'platform' ? this.allocateModel.storeData.id : this.getUser().shop.id
            },
            data => {
              this.$message.success('保存成功');
              this.dialogAllocateVisible = false;
              this.query();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        } else {
          return false;
        }
      });
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    handleImport() {
      let url = '/admin/terminal/importProgress.jhtml';
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

    numberConverter(row) {
      return row[0];
    },
    stateColor(row) {
      if (row.status === '1') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    statusConverter(row) {
      return row.status === '1' ? '启用' : row.status === '0' ? '停用' : '未审核';
    },
    modeConverter(row) {
      return row.terminalMode === '0' ? '工程模式' : row.terminalMode === '1' ? '安装模式' : row.terminalMode === '2' ? '用户模式' : '';
    },
    infoConverter(row) {
      return row[row.length - 1] === 'ok' ? '' : row[row.length - 1];
    },
    queryTerminalClass() {
      serviceClass.query(
        {
          pageNumber: this.pagination.currentPage,
          pageSize: 1000
        },
        data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.data.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    }
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    },
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('caradmin:operateDevice.manage.delete');
    },
    hasAuthOn() {
      // return true;
      return this.currentAuth.includes('caradmin:operateDevice.manage.on');
    },
    hasAuthOff() {
      // return true;
      return this.currentAuth.includes('caradmin:operateDevice.manage.off');
    },
    operatorId() {
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] === ''
      ) {
        return this.allocateModel.operator[this.allocateModel.operator.length - 2];
      }
      if (
        this.allocateModel.operator &&
        this.allocateModel.operator.length > 0 &&
        this.allocateModel.operator[this.allocateModel.operator.length - 1] !== ''
      ) {
        return this.allocateModel.operator[this.allocateModel.operator.length - 1];
      }
      return this.getUser().compy.id;
    }
  },
  created() {
    // 查询权限
    this.queryAuth();
    this.query();
    this.handleImport();
    this.queryTerminalClass();
    // 如果是平台运营，则隐藏新增按钮
    this.user = this.getUser();
  }
};
</script>

<style lang="scss">
.terminal-mgmt-terminal {
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
  .a_font {
    text-decoration: none;
    color: #ff7300;
  }
  .biz-grid {
    padding: 5px 15px 5px 15px !important;
  }
  .terminal-mgmt-all-vehicle__header {
    text-align: right;
    padding-right: 15px;

    .header__operator {
      float: left;
    }
    .header__operator_fence {
      margin: 5px 0px 0px 20px;
      float: left;
    }
  }
  .table-button {
    white-space: normal;
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
</style>
