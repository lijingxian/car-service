<template>
  <div class="communi-card">
    <biz-flex-table :operations="operations" :loading="loading" :tableData="tableData" :pagination="pagination" :filters="filters"
      @input-option-change="inputOptionChange" @filter-data-change="filterDataChange" @operate="operate"
      @selection-change="handleSelectionChange" @row-click="rowClick" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @cascader-change="handleCascaderChange">
      <!-- 上传 -->
      <template slot="operation">
        <import-file :tableData="importResult" :importLoading="importLoading" :total="total" :disabled="disabled" :count="count"
          :percentage="percentage" @clearTimeOut="clearTimeOut" @restProcess="restProcess" :stepkey="stepkey"
          :action="'/admin/sim/importSim.jhtml'" :name="'uFile'" ref="importFile" @handle-import="handleImport"
          style="margin-left: 10px;">
          <el-table-column label="SIM卡号" prop="number"></el-table-column>
          <el-table-column label="ICCID" prop="iccid"></el-table-column>
          <el-table-column label="卡类型" prop="type"></el-table-column>
          <el-table-column label="电信运营商" prop="telecomOperatorName"></el-table-column>
          <el-table-column label="结果" prop="result"></el-table-column>
        </import-file>
      </template>
      <!-- 表格内容 -->
      <el-table-column label="SIM" prop="number" min-width="200">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              SIM：{{scope.row.number}}
            </div>
            <div class="overflow">
              ICCID：{{scope.row.iccid}}
            </div>
            <div class="overflow">
              卡类型：{{scope.row.type}}
            </div>
            <div class="overflow">
              运营商：{{scope.row.telecomOperatorName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="所有者" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="handleQueryOwner(scope.row)">
            {{ scope.row.ownerName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="terminalTypeName" label="终端" min-width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="handleQueryTerminal(scope.row)">
            {{ scope.row.terminalTypeName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{ formatStatus(scope.row.status) }}</span>
            </div>
            <div class="overflow">
              到期日期：{{scope.row.expiredTime}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="使用情况" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              余额：{{ scope.row.balance ||'0' }}
            </div>
            <div class="overflow">
              剩余流量：{{scope.row.remainingData}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog class="dialog-selector" title="发送短信" :visible.sync="dialogVisible" :append-to-body="true" @close="msgContent = ''">
      <ul class="dialog-list">
        <li v-for="item in selectedNumbers" :key="item.index">{{item}}</li>
      </ul>
      <div style="font-size: 16px">共选择: {{selectedNumbers.length}} 项</div>
      <br>
      <div style="font-size: 16px">短信内容: </div>
      <el-input type="textarea" max="1000" v-model="msgContent" placeholder="请输入短信内容"></el-input>
      <div>{{msgContent.length}}/1000</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="consfirmSendMsg">确定</el-button>
      </span>
    </el-dialog>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="handleClose" v-model="tabName">
      <el-tab-pane label="通讯卡信息" name="first" v-if="!ownerOpen">
        <base-info :itemId="currentRowId" @update="refresh"></base-info>
      </el-tab-pane>
      <el-tab-pane label="所有者信息" name="first" v-if="ownerOpen">
        <member-info :itemId="ownerId"></member-info>
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="second" v-if="currentRowId.id">
        <recharge-records ref="recharge" :itemId="currentRowId" @update="refresh"></recharge-records>
      </el-tab-pane>
      <el-tab-pane label="消费记录" name="third" v-if="currentRowId.id">
        <consume-records ref="consume" :itemId="currentRowId" @update="refresh"></consume-records>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';
import RechargeRecords from './RechargeRecords';
import ConsumeRecords from './ConsumeRecords';
import { ImportFile } from '@/components/BizUpload';
import http from '@/common/http';
import MemberInfo from '@/pages/operating/terminal-mgmt-new/MembershipBaseInfo';
import serviceOperator from '@/service/communi-mgmt/communiOperator';
import service from '@/service/communi-mgmt/communiCard';
import axios from 'axios';
import date from '@/utils/date.js';
export default {
  name: 'CommuniCard',
  data() {
    return {
      ownerId: { id: '' },
      ownerOpen: false,
      // 三级运营商map
      firstCompanyMap: new Map(),
      secondCompanyMap: new Map(),
      thirdCompanyMap: new Map(),
      // 发送短信Start
      dialogVisible: false,
      selectedNumbers: [],
      msgContent: '',
      // 发送短信End
      // 上传Start
      action: '/admin/sim/importSim.jhtml',
      importResult: [],
      importLoading: false,
      companyId: '',
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      disabled: false,
      // 上传End
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '删除', name: 'del', type: '', disabled: true },
        { label: '启用', name: 'enable', type: '', disabled: true },
        { label: '停用', name: 'disable', type: '', disabled: true },
        { label: '发送短信', name: 'sendMsg', type: '', disabled: true },
        { label: '模板下载', name: 'download', type: '' },
        { label: '导出', name: 'export', type: '' }
      ],
      filters: [
        {
          label: '卡类型',
          type: 'select',
          placeholder: '请选择卡类型',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '移动', value: '移动' },
            { label: '联通', value: '联通' },
            { label: '电信', value: '电信' }
          ]
        },
        // {
        //   label: '运营商',
        //   type: 'cascader',
        //   placeholder: '请选择运营商',
        //   changeOnSelect: true,
        //   filterable: false,
        //   value: '',
        //   options: []
        // },
        {
          label: '电信运营商',
          type: 'select',
          placeholder: '请选择电信运营商',
          value: '',
          options: []
        },
        {
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '停用', value: '0' },
            { label: '启用', value: '1' },
            { label: '未审核', value: '2' }
          ]
        },
        {
          label: '终端分类',
          type: 'select',
          placeholder: '请选择终端分类',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '到期日期',
          name: 'date',
          value: [date.nowDate(), date.nextMonthDate()]
        },
        {
          label: '筛选数据',
          type: 'input',
          value: '',
          placeholder: '',
          select: [
            {
              value: 'iccid',
              placeholder: '',
              options: [
                { label: 'ICCID', value: 'iccid' },
                { label: 'SIM', value: 'number' },
                { label: '所有者', value: 'ownerName' },
                { label: '余额', value: 'balance' },
                { label: '剩余流量', value: 'remainingData' }
              ]
            }
          ]
        }
      ],
      loading: false,
      tableData: [],
      multiSelected: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      // 侧栏
      open: false,
      tabName: 'first'
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    ImportFile,
    RechargeRecords,
    ConsumeRecords,
    MemberInfo
  },
  methods: {
    operate(name) {
      this[name]();
    },
    add() {
      this.currentRowId = { id: '' };
      this.tabName = 'first';
      this.open = true;
    },
    // 删除
    del(id) {
      let ids = id ? Array(id) : this.multiSelected.length === 0 ? [] : this.multiSelected;
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
        this.loading = true;
        service.deleteBaseInfo(
          params,
          data => {
            this.loading = false;
            this.$message.success('操作成功');
            this.refresh();
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    handleSelectionChange(selectedItems) {
      this.selectedNumbers = selectedItems.map(row => {
        return row.number;
      });
      this.multiSelected = selectedItems.map(row => {
        return row.id;
      });
    },
    rowClick(row) {
      this.currentRowId = { id: row.id };
      this.tabName = 'first';
      this.open = true;
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.refresh();
    },
    handleCurrentChange(pageNumber) {
      this.pagination.currentPage = pageNumber;
      this.refresh();
    },
    // 级联内容变化,传过来的是ID数组
    handleCascaderChange(value) {
      // this.filters[1].value = value[value.length - 1];
      this.companyId = value[value.length - 1];
      this.refresh();
      this.queryCompanyList(value[value.length - 1]);
    },
    inputOptionChange(filters) {
      if (['balance', 'remainingData'].indexOf(filters[5].select[0].value) !== -1 && filters[5].select.length === 1) {
        this.filters[5].select.push({
          value: 'ge',
          options: [
            { label: '>=', value: 'ge' },
            { label: '<=', value: 'le' }
          ]
        });
      } else if (['balance', 'remainingData'].indexOf(filters[5].select[0].value) === -1 && filters[5].select.length === 2) {
        this.filters[5].select.splice(1, 1);
      }
    },
    // 根据id获取level
    getLevel(id) {
      if (this.firstCompanyMap.get(id)) {
        return 0;
      } else if (this.secondCompanyMap.get(id)) {
        return 1;
      } else if (this.thirdCompanyMap.get(id)) {
        return 2;
      } else {
        return -1;
      }
    },
    queryCompany() {
      this.loading = true;
      let params = {
        pageNumber: 1,
        pageSize: 1000
      };
      serviceOperator.queryList(
        params,
        data => {
          this.loading = false;
          this.filters[1].options = [{ label: '全部', value: '' }].concat(
            data.content.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 获取运营商列表
    queryCompanyList(id) {
      let params = {
        parentId: id || ''
      };
      service.queryCompanyList(
        params,
        data => {
          let level = this.getLevel(id);
          let companyList = [];
          data.content.map(item => {
            if (level !== 2) {
              companyList.push({
                label: item.name,
                value: item.id,
                children: []
              });
            } else {
              companyList.push({ label: item.name, value: item.id });
            }
          });
          // 没有id, 查询一级运营商列表
          if (!id) {
            this.filters[1].options = [{ label: '全部', value: '' }].concat(companyList);
            let map = new Map();
            this.filters[1].options.map((item, index) => {
              map.set(item.value, String(index));
            });
            this.firstCompanyMap = map;
          } else if (level === 0) {
            // 查询id等级为0, 查询二级列表
            if (companyList.length === 0) {
              // 如果没有二级列表则删除上一级对应的children;
              this.$delete(this.filters[1].options[this.firstCompanyMap.get(id)], 'children');
              return;
            }
            this.filters[1].options[this.firstCompanyMap.get(id)].children = companyList;
            let map = new Map();
            map.set('parentId', id);
            companyList.map((item, index) => {
              map.set(item.value, String(index));
            });
            this.secondCompanyMap = map;
          } else if (level === 1) {
            if (companyList.length === 0) {
              // 如果没有三级列表则删除上一级对应的children;
              this.$delete(
                this.filters[1].options[this.firstCompanyMap.get(this.secondCompanyMap.get('parentId'))].children[
                  this.secondCompanyMap.get(id)
                ],
                'children'
              );
              return;
            }
            // 查询三级列表
            this.filters[1].options[this.firstCompanyMap.get(this.secondCompanyMap.get('parentId'))].children[
              this.secondCompanyMap.get(id)
            ].children = companyList;
            let map = new Map();
            map.set('parentId', id);
            companyList.map((item, index) => {
              map.set(item.value, String(index));
            });
            this.thirdCompanyMap = map;
          } else if (level === 2) {
            if (companyList.length === 0) {
              // 如果没有四级列表则删除上一级对应的children;
              this.$delete(
                this.filters[1].options[this.firstCompanyMap.get(this.secondCompanyMap.get('parentId'))].children[
                  this.secondCompanyMap.get(this.thirdCompanyMap.get('parentId'))
                ].children[this.thirdCompanyMap.get(id)],
                'children'
              );
              return;
            }
            this.filters[1].options[this.firstCompanyMap.get(this.secondCompanyMap.get('parentId'))].children[
              this.secondCompanyMap.get(this.thirdCompanyMap.get('parentId'))
            ].children[this.thirdCompanyMap.get(id)].children = companyList;
          }
        },
        ErrorData => {}
      );
    },
    filterDataChange(filters) {
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      };
      this.refresh();
    },
    refresh() {
      this.loading = true;
      let params = Object.assign(
        {
          type: this.filters[0].value,
          telecomOperatorId: this.filters[1].value,
          status: this.filters[2].value,
          terminalTypeId: this.filters[3].value,
          beginExpireDate: this.filters[4].value[0],
          endExpireDate: this.filters[4].value[1],
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        this.searchValue()
      );
      service.queryList(
        params,
        data => {
          this.loading = false;
          this.pagination.total = Number(data.total);
          this.tableData = data.content;
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          if (ErrorData.errorMessage) {
            this.$message.warning(ErrorData.errorMessage);
          } else {
            this.$message.warning('对不起,您的操作有误');
          }
        }
      );
    },
    async export() {
      let params = Object.assign(
        {
          type: this.filters[0].value,
          telecomOperatorId: this.filters[1].value,
          status: this.filters[2].value,
          terminalTypeId: this.filters[3].value,
          beginExpireDate: this.filters[4].value[0],
          endExpireDate: this.filters[4].value[1],
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        this.searchValueExport()
      );
      try {
        let response = await axios.post('/admin/sim/export.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 根据搜索栏选项不同返回不同的值
    searchValueExport() {
      let obj = { filter: {} };
      let option = this.filters[5].select[0].value;
      if (['balance', 'remainingData'].indexOf(this.filters[5].select[0].value) !== -1) {
        obj.filter.property = this.filters[5].select[0].value;
        obj.filter.operator = this.filters[5].select[1].value;
        obj.filter.value = this.filters[5].value;
      } else {
        obj.filter[option] = this.filters[5].value;
      }
      return obj;
    },
    // 根据搜索栏选项不同返回不同的值
    searchValue() {
      let obj = {};
      let option = this.filters[5].select[0].value;
      if (['balance', 'remainingData'].indexOf(this.filters[5].select[0].value) !== -1) {
        obj.property = this.filters[5].select[0].value;
        obj.operator = this.filters[5].select[1].value;
        obj.value = this.filters[5].value;
      } else {
        obj[option] = this.filters[5].value;
      }
      return obj;
    },
    // 格式化状态文字
    formatStatus(status) {
      switch (status) {
        case '0':
          return '停用';
        case '1':
          return '启用';
        case '2':
          return '未审核';
        default:
          break;
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.status === '1') {
        // 启用
        return '#11AE17';
      } else {
        // 停用
        return '#FF7300';
      }
    },
    // 修改状态
    changeState(row) {
      row.status === '0' ? (row.status = '1') : (row.status = '0');
    },
    enable() {
      let params = {
        ids: this.multiSelected
      };
      service.enable(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    disable() {
      let params = {
        ids: this.multiSelected
      };
      service.disable(
        params,
        data => {
          this.$message.success('操作成功');
          this.refresh();
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    download() {
      window.open('/upload/mode/V服爱车_通信卡导入模板.xlsx');
    },
    // 发送短信
    sendMsg() {
      this.dialogVisible = true;
    },
    consfirmSendMsg() {
      if (!this.msgContent.length) {
        this.$message.warning('请输入短信内容');
        return;
      }
      this.dialogVisible = false;
      let params = {
        ids: this.multiSelected,
        content: this.msgContent
      };
      service.sendMsg(
        params,
        data => {
          const h = this.$createElement;
          let tmp = data.content.map(msg => {
            if (msg.indexOf('发送成功') !== -1) {
              return h('p', { style: 'color: #67C23A' }, msg);
            } else if (msg.indexOf('发送失败') !== -1) {
              return h('p', { style: 'color: #E6A23C' }, msg);
            }
          });
          this.$msgbox({
            title: '发送结果',
            message: h('p', null, tmp),
            confirmButtonText: '确定'
          });
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
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
    getTerminalTypeList() {
      http
        .get('/admin/intelligent/json/getTerminalTypeList.jhtml', {})
        .then(data => {
          this.filters[3].options = [{ label: '全部', value: '' }].concat(
            data.data.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    // 导入
    handleImport() {
      let url = '/admin/sim/importProgress.jhtml';
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
            this.disabled = false;
            this.refresh();
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
    handleClose() {
      this.open = false;
      this.ownerOpen = false;
    },
    handleQueryOwner(row) {
      this.tabName = 'first';
      this.ownerId = { id: row.ownerId };
      this.ownerOpen = true;
      this.open = true;
    },
    handleQueryTerminal(row) {
      this.$router.push({
        name: 'terminal-mgmt-terminal-search',
        params: {
          terminalTypeId: row.terminalData.terminalTypeId,
          terminalTypeName: row.terminalTypeName
        }
      });
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        showClose: true
      });
    },
    getKpi() {
      http
        .get('/admin/sim/countSimByState.jhtml', {
          shopId: window.top.shopId
        })
        .then(data => {
          this.showMessage(
            `共有通讯卡${data.data.totalCount}张，其中启用${data.data.enableCount}张，停用${data.data.disableCount}张，未审核${data.data.notAuditCount}张`,
            'info'
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    }
  },
  created() {
    if (this.$route.query.number) {
      this.filters[5].value = this.$route.query.number;
      this.filters[5].select[0].value = 'number';
    }
    this.queryCompany();
    this.refresh();
    this.getTerminalTypeList();
    this.getKpi();
  },
  computed: {},
  watch: {
    open(newVal, oldVal) {
      if (!newVal) {
        this.refresh();
      }
    },
    tabName(newVal, oldVal) {
      switch (newVal) {
        case 'second':
          this.$refs.recharge.setHeight();
          break;
        case 'third':
          this.$refs.consume.setHeight();
          break;
        default:
          break;
      }
    },
    multiSelected(newVal, oldVal) {
      if (newVal.length) {
        this.operations[1].disabled = false;
        this.operations[2].disabled = false;
        this.operations[3].disabled = false;
        this.operations[4].disabled = false;
      } else {
        this.operations[1].disabled = true;
        this.operations[2].disabled = true;
        this.operations[3].disabled = true;
        this.operations[4].disabled = true;
      }
    }
  }
};
</script>

<style lang="scss">
.communi-card {
  .biz-table-filter {
    .filter-wrap {
      &:nth-child(2) {
        .biz-select {
          .el-select {
            width: 100px;
          }
        }
      }
      .biz-input {
        .el-input-group__prepend {
          .el-select:nth-child(2) {
            .el-input {
              width: 50px;
              .el-input__inner {
                padding-left: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
