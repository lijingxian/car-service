<template>
  <div class="motor-club-member-mgmt">
    <biz-flex-table
      ref="table"
      :operations="operations"
      :filters="filters"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @sort-change="handleSortChange"
      @operate="handleOperate"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
      @filter-data-change="handleFilterDataChange"
      @row-click="handleRowClick"
    >
      <el-table-column label="资讯信息" min-width="220">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.title}}
            </div>
            <div class="overflow">
              类型：{{formatType(scope.row)}}
            </div>
            <div class="overflow">
              状态：<span :style="{color: stateColor(scope.row)}">{{scope.row.state==='0'?'审核中':scope.row.state==='1'?'V服审核通过':scope.row.state==='2'?'V服审核不通过':'已投放'}}{{scope.row.thirdState?'('+scope.row.thirdState+')':''}}</span>
            </div>
            <div class="overflow">
              创建时间：{{scope.row.createDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始投放" prop="isOn" v-if="pageType === '8' || pageType === '9' || pageType === '10'">
        <template slot-scope="scope">
          <el-switch
            v-if="pageType === '8' || pageType === '9' || pageType === '10'"
            v-model="scope.row.isOn"
            :disabled="getUser.roleLevel !== 'shop'"
            active-value="1"
            inactive-value="0"
            active-color="#87d068"
            @change="onChange($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="推送开始日期" min-width="100" sortable="custom">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.beginDate||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="推送结束日期" min-width="100" sortable="custom">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.endDate||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店铺" min-width="160">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" min-width="100">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button
            type="text"
            size="mini"
            v-if="getUser.roleLevel === 'shop'&& pageType !== '8'&&pageType !== '9'&&pageType !== '10'"
            @click.stop="handleTopClick($event, scope.row)"
          >{{ scope.row.isTop === '0' ? '置顶' : '取消置顶' }}</el-button>
          <el-button type="text" size="mini" v-if="getUser.roleLevel !== 'shop' && scope.row.state === '0'" @click.stop="handleAudit($event, scope.row)">审核</el-button>
          <el-button type="text" size="mini" v-if="getUser.roleLevel !== 'shop' && scope.row.state === '1'" @click.stop="handlePush($event, scope.row)">投放</el-button>
          <el-button type="text" size="mini" @click.stop="handleDeleteClick($event, scope.row)">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog :visible.sync="showPassOrder" center append-to-body custom-class="close-order-dialog" title="审核" v-loading="loading">
      <div>
        <div class="dec" style="margin-bottom:20px;">
          <span>说明：审核通过后系统将自动为您进行投放，投放不成功的情况下可再次手动投放。</span>
        </div>
        <div class="reson-container">
          <span>审核结果：</span>
          <el-radio v-model="auditState" label="1" size="mini">通过</el-radio>
          <el-radio v-model="auditState" label="2" size="mini">不通过</el-radio>
          <div style="padding:5px 0px;margin-top:15px;" v-show="auditState==='2'">
            <span style="margin-left:25px">原因：</span>
            <el-select v-model="curSelectAjectReason" placeholder="请选择不通过原因" class="order-select" size="mini">
              <el-option v-for="reason in reasonAjectList" :key="reason.label" :label="reason.label" :value="reason.value"></el-option>
            </el-select>
          </div>
          <div style="padding:5px 0px;margin-top:15px;">
            <span style="vertical-align:top;margin-left:25px">备注：</span>
            <el-input v-model="remark" type="textarea" style="width:80%"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="showPassOrder=false" size="mini">取消</el-button>
        <el-button @click="auditConfirm(row,auditState)" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="授权提示" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成授权
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <div>
          <span v-popover:codePop class="helpClass">查看帮助</span>
        </div>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">授权遇到问题</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">授权完成</el-button>
      </span>
    </el-dialog>
    <right-popup slot="float" :open="open" :itemId="itemId" :position="position" @close="handlePopupClose" @operationSuccess="handlePopupSuccess"></right-popup>
    <biz-popup-tabs :open="openSetting" @close="openSetting=false" v-model="tabName">
      <el-tab-pane label="接口设置" name="thirdSetting">
        <setting ref="setting" :thirdType="thirdType" @operationSuccess="handlePopupSuccess"></setting>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import rightPopup from './RightPopup/Popup';
import { BizPopupTabs } from '@/components/BizPopup';
import setting from './RightPopup/Setting.vue';
import { mapGetters } from 'vuex';
import { pushMgmt as service, membershipMgmt } from '@/common/urls';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
// 基础信息
const baseData = {
  data: {
    // 页面查询数据类型
    pageType: '0',
    tabName: 'thirdSetting',
    thirdType: '',
    openSetting: false
  },
  methods: {
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    resetAll() {
      this.open = false;
      this.openSetting = false;
      this.itemId = { id: '' };
      this.position = '';
      this.selections = [];
      this.pagination = {
        pageSize: 20,
        currentPage: 1,
        total: 0
      };
      this.filters = [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '审核中' },
            { value: '1', label: '审核通过' },
            { value: '2', label: '审核不通过' },
            { value: '3', label: '已投放' }
          ],
          class: 'show'
        },
        {
          type: 'select',
          label: '店铺',
          name: 'shop',
          value: '',
          filterable: true,
          options: [],
          class: 'show'
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入标题/店铺名称',
          name: 'searchValue',
          value: ''
        }
      ];
    },
    queryKpi() {
      const MESSAGE_LIST = {
        '0': '您可在此管理服务推荐中的信息流展示顺序，优先展示置顶内容。',
        '1': '您可在此管理爱车频道中的信息流展示顺序，优先展示置顶内容。',
        '2': '您可在此管理APP启动页的推送内容，APP最多展示1个。',
        '3': '您可在此管理近期活动弹出框的推送内容，APP端最多展示1个。',
        '4': '您可在此管理最新促销弹出框的推送内容，APP端最多展示1个。',
        '5': '您可在此管理V商宣传弹出框的推送内容，APP端最多展示8个。',
        '6': '您可在此管理领优惠券处弹出框的推送内容，APP端最多展示1个。',
        '8': '您可在此管理投放到今日头条信息流的推送内容。',
        '9': '您可在此管理投放到百度信息流的推送内容。',
        '10': '您可在此管理投放到百度搜索推广的推送内容。',
        '11': '您可在此管理微信推送弹出框的推送内容。'
      };
      console.log(this.pageType);
      this.$message({
        customClass: 'motorists-club-activity__kpi',
        showClose: true,
        message: MESSAGE_LIST[this.pageType],
        duration: 3000
      });
    },
    // 设置页面查询数据类型
    setType() {
      const PAGE_TYPE_LIST = {
        'service-recommend': '0',
        'icar-channel': '1',
        'app-startup': '2',
        marketing: '3',
        promotion: '4',
        'v-publicity': '5',
        coupon: '6',
        community: '7',
        'head-line': '8',
        'baidu-info': '9',
        'baidu-search': '10',
        wechat: '11'
      };
      console.log(this.$route);
      let type = this.$route.params.type;
      if (this.$route.path === '/marketing/recommend/vfu/service-recommend') {
        this.pageType = '0';
      } else if (this.$route.path === '/marketing/recommend/headline/head-line') {
        this.pageType = '8';
      } else {
        this.pageType = PAGE_TYPE_LIST[type];
      }
    }
  },
  events: {}
};

// Table相关
const dataTable = {
  data: {
    loading: false,
    orderProperty: '',
    orderDirection: '',
    showPassOrder: false,
    dialogVisible: false,
    auditState: '1',
    remark: '',
    row: {},
    curSelectAjectReason: '涉嫌不实信息',
    reasonAjectList: [
      {
        label: '涉嫌不实信息',
        value: '涉嫌不实信息'
      },
      {
        label: '涉嫌侵权',
        value: '涉嫌侵权'
      },
      {
        label: '推广页有误',
        value: '推广页有误'
      },
      {
        label: '文案与实际不符',
        value: '文案与实际不符'
      },
      {
        label: '内容不符合规范',
        value: '内容不符合规范'
      },
      {
        label: '内容存在非法',
        value: '内容存在非法'
      },
      {
        label: '涉嫌诱导分享',
        value: '涉嫌诱导分享'
      },
      {
        label: '其他原因',
        value: '其他原因'
      }
    ],
    closeDeccription: '',
    curSelectCloseReason: '',
    tableData: [],
    selections: [],
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary',
        class: 'show'
      },
      {
        label: '删除',
        name: 'delete',
        type: '',
        disabled: true
      },
      {
        label: '刷新',
        name: 'refresh',
        type: ''
      },
      {
        label: '批量审核通过',
        name: 'audit',
        type: '',
        class: 'hidden'
      },
      {
        label: '批量投放',
        name: 'push',
        type: '',
        class: 'hidden'
      },
      {
        label: '设置',
        name: 'setting',
        type: '',
        class: 'hidden'
      }
    ],
    pagination: {
      pageSize: 20,
      currentPage: 1,
      total: 0
    },
    filters: [
      {
        type: 'select',
        label: '状态',
        name: 'state',
        value: '',
        options: [
          { value: '', label: '全部' },
          { value: '0', label: '审核中' },
          { value: '1', label: '审核通过' },
          { value: '2', label: '审核不通过' },
          { value: '3', label: '已投放' }
        ],
        class: 'show'
      },
      {
        type: 'select',
        label: '店铺',
        name: 'shop',
        value: '',
        options: [],
        class: 'show'
      },
      {
        type: 'input',
        label: '',
        placeholder: '请输入标题名称',
        name: 'searchValue',
        value: ''
      }
    ]
  },
  methods: {
    queryShopList() {
      http
        .get(membershipMgmt.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '4'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[1], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    audit() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.auditItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    push() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.pushItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    stateColor(row) {
      if (row.state === '1' || row.state === '3') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    auditItem(ids) {
      this.loading = true;
      http
        .post('/admin/recommend/updateApprovalState.jhtml', {
          ids: ids,
          state: '1'
        })
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1201') {
            this.loading = true;
            this.dialogVisible = true;
            http
              .post('/admin/recommend/oauth.jhtml', {})
              .then(data => {
                this.loading = false;
                window.open(data.oauthURL);
              })
              .catch(() => {
                this.loading = false;
              });
          }
          if (ErrorData.errorMessage) {
            this.$message.warning(ErrorData.errorMessage);
            this.refresh();
          }
        });
    },
    pushItem(ids) {
      this.loading = true;
      http
        .post('/admin/recommend/updateApprovalState.jhtml', {
          ids: ids,
          state: '3'
        })
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1201') {
            this.loading = true;
            this.dialogVisible = true;
            http
              .post('/admin/recommend/oauth.jhtml', {})
              .then(data => {
                this.loading = false;
                window.open(data.oauthURL);
              })
              .catch(() => {
                this.loading = false;
              });
          }
          if (ErrorData.errorMessage) {
            this.$message.warning(ErrorData.errorMessage);
            this.refresh();
          }
        });
    },
    auditConfirm(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          ids: [model.id],
          state: state,
          reason: state === '2' ? this.curSelectAjectReason : '',
          remark: this.remark
        };
        http
          .post('/admin/recommend/updateApprovalState.jhtml', params)
          .then(data => {
            this.$message.success('操作成功！');
            this.showPassOrder = false;
            this.loading = false;
            this.refresh();
          })
          .catch(errData => {
            this.loading = false;
            this.showPassOrder = false;
            if (errData.resultCode === '1201') {
              this.loading = true;
              this.dialogVisible = true;
              http
                .post('/admin/recommend/oauth.jhtml', {})
                .then(data => {
                  this.loading = false;
                  window.open(data.oauthURL);
                })
                .catch(() => {
                  this.loading = false;
                });
            }
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
              this.refresh();
            }
          })
          .finally(() => {});
      });
    },
    refresh() {
      this.query();
    },

    // 格式化类型
    formatType(row, column) {
      const TYPE_LIST = {
        '1': '活动',
        '2': '促销',
        '4': '资讯(爱车频道)',
        '5': '广告',
        '6': '商品推广',
        '7': '车友会活动'
      };
      return TYPE_LIST[row.type] || '全部';
    },
    // 格式化类型
    formatState(row, column) {
      const STATE_LIST = {
        '0': '审核中',
        '1': 'V服审核通过',
        '2': 'V服审核不通过',
        '3': '已投放'
      };
      return STATE_LIST[row.state] || '全部';
    },
    // 查询
    getQueryParams() {
      return {
        shopId: this.getUser.shop.id || window.top.SHOP_ID || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection,
        keyword: this.filters[2].value,
        state: this.filters[0].value,
        // 服务推荐
        position: this.pageType
      };
    },
    setting() {
      this.thirdType = this.pageType === '8' ? '0' : this.pageType === '9' ? '1' : '2';
      this.itemId = { id: '' };
      this.open = false;
      this.tabName = 'thirdSetting';
      this.$refs.setting.query(this.thirdType);
      this.openSetting = true;
    },
    query() {
      this.loading = true;
      console.log(this.filters);
      let params = this.getQueryParams();
      if (this.getUser.roleLevel !== 'shop') {
        params.searchShopId = this.filters[1].value;
      } else {
        this.filters[1].class = 'hidden';
      }
      if ((this.pageType === '8' || this.pageType === '9' || this.pageType === '10') && this.getUser.roleLevel !== 'shop') {
        this.operations[3].class = 'show';
        this.operations[4].class = 'show';
        this.operations[5].class = 'show';
      } else {
        this.operations[3].class = 'hidden';
        this.operations[4].class = 'hidden';
        this.operations[5].class = 'hidden';
      }
      if (this.pageType === '8' || this.pageType === '9' || this.pageType === '10') {
        this.operations[0].class = 'hidden';
      } else {
        this.operations[0].class = 'show';
      }
      http
        .get(service.queryList, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.recommendList;
          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .post(service.deleteBaseInfo, { ids: ids })
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            this.loading = false;
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },

    // converter
    activeDate(row) {
      if (!row.lastLoginDate) return '--';

      let date = new Date(row.lastLoginDate);
      return dateUtil.dateConverter(date);
    },
    addDateConverter(row) {
      if (!row.joinDate) return '----';

      let date = new Date(row.joinDate);
      return dateUtil.dateConverter(date);
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    handleSizeChange(val) {
      this.$set(this.pagination, 'pageSize', val);
      this.$set(this.pagination, 'currentPage', 1);
      this.query();
    },
    handleCurrentChange(val) {
      this.$set(this.pagination, 'currentPage', val);
      this.query();
    },
    handleSelectionChange(val) {
      this.operations[0].disabled = true;
      if (val.length > 0) {
        this.operations[0].disabled = false;
      }
      this.selections = val;
    },
    handleFilterDataChange() {
      this.pagination.currentPage = 1;
      this.query();
    },
    handleRowClick(model, e, column) {
      this.defaultTab = '0';
      this.itemId = { id: String(model.id) };
      this.position = this.pageType;
      this.open = true;
      this.openSetting = false;
    },
    add(model, e, column) {
      this.defaultTab = '0';
      this.itemId = { id: '' };
      this.position = this.pageType;
      this.open = true;
      this.openSetting = false;
    },
    handleAudit(e, model) {
      this.remark = '';
      this.auditState = '1';
      this.curSelectAjectReason = this.reasonAjectList[0].value;
      this.row = model;
      this.showPassOrder = true;
    },
    // 推送开关
    onChange(e, model) {
      window.event.stopPropagation();
      this.loading = true;
      let param = {
        ids: [model.id],
        state: model.isOn
      };
      http
        .post('/admin/recommend/updateLaunchState.jhtml', param)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
        })
        .catch(error => {
          this.loading = false;
          if (error.resultCode === '1201') {
            this.loading = true;
            this.dialogVisible = true;
            http
              .post('/admin/recommend/oauth.jhtml', {})
              .then(data => {
                this.loading = false;
                window.open(data.oauthURL);
              })
              .catch(() => {
                this.loading = false;
              });
          }
          if (error.errorMessage) {
            this.$message.warning(error.errorMessage);
          }
        });
    },
    handlePush(e, model) {
      this.loading = true;
      http
        .post('/admin/recommend/updateApprovalState.jhtml', {
          ids: [model.id],
          state: '3'
        })
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          if (ErrorData.resultCode === '1201') {
            this.loading = true;
            this.dialogVisible = true;
            http
              .post('/admin/recommend/oauth.jhtml', {})
              .then(data => {
                this.loading = false;
                window.open(data.oauthURL);
              })
              .catch(() => {
                this.loading = false;
              });
          }
          if (ErrorData.errorMessage) {
            this.$message.warning(ErrorData.errorMessage);
          }
        });
    },
    handleDeleteClick(e, model) {
      this.deleteItem([model.id]);
    },
    handleTopClick(e, model) {
      let params = {
        ids: [model.id],
        state: String(model.isTop === '0')
      };
      http
        .post(service.setTop, params)
        .then(data => {
          this.query();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    }
  }
};

// Popup相关
const dataPopup = {
  data: {
    open: false,
    itemId: { id: '' },
    position: ''
  },
  methods: {},
  events: {
    handlePopupClose() {
      this.open = false;
    },
    handlePopupSuccess(val) {
      this.open = false;
      this.openSetting = false;
      this.query();
    }
  }
};

export default {
  name: 'ServiceRecommend',
  components: {
    BizFlexTable,
    rightPopup,
    setting,
    BizPopupTabs
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  data() {
    return {
      ...baseData.data,
      ...dataTable.data,
      ...dataPopup.data
    };
  },
  mixins: [ColumnsMixin],
  methods: {
    ...dataTable.methods,
    ...dataTable.events,

    ...baseData.methods,
    ...baseData.events,

    ...dataPopup.methods,
    ...dataPopup.events
  },
  created() {
    this.setType();
    if (this.getUser.roleLevel === 'platform') {
      this.queryShopList();
    }
    this.query();
  },
  mounted() {
    this.queryKpi();
  },
  watch: {
    $route(to, from) {
      if (this.getUser.roleLevel === 'platform') {
        this.queryShopList();
      }
      this.resetAll();
      this.setType();
      this.queryKpi();
      // this.query();
    }
  }
};
</script>

<style lang="scss">
@mixin flexStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.motor-club-member-mgmt {
  .biz-popup .popup-content {
    width: 600px;
  }
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
}
.close-order-dialog {
  width: 600px;
  .reson-container {
    margin: 10px 0;
    .start {
      color: red;
      font-size: 16px;
    }
  }
  .order-select {
    width: 300px;
  }
  .deccription {
    display: flex;
    .dec-label {
      white-space: nowrap;
    }
  }
  .close-button {
    text-align: right;
  }
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.helpClass {
  color: #ff7300;
}
</style>
