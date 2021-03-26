<template>
  <biz-grid class="template-static-mgmt">
    <div class="indicators-search">
      <div class="title">会员卡制式：</div>
      <el-radio-group v-model="checked" @change="conditionChange">
        <el-radio-button v-for="(card,index) in cardList" :label="card.id" :key="index" size="mini">{{card.name}}
        </el-radio-button>
      </el-radio-group>
      <div class="date">
        <div class="title">日期：</div>
        <el-date-picker slot="top" class="inline" unlink-panels size="mini" v-model="date" type="daterange"
          value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="conditionChange">
        </el-date-picker>
      </div>
    </div>
    <el-table ref="table" :data="tableData" :loading="loading" border highlight-current-row tooltip-effect="dark" size="small"
      stripe>
      <el-table-column prop="name" min-width="100"></el-table-column>
      <el-table-column prop="total" label="累计会员卡" min-width="80"></el-table-column>
      <el-table-column prop="increase" label="新增会员卡" min-width="80"></el-table-column>
      <el-table-column prop="balance" label="余额" min-width="80" :formatter="balanceFormatter"></el-table-column>
      <el-table-column prop="deposit" label="储值" min-width="80" :formatter="depositFormatter"></el-table-column>
      <el-table-column prop="expense" label="消费" min-width="80" :formatter="expenseFormatter"></el-table-column>
      <el-table-column prop="bean" label="V豆余额" min-width="80">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.bean}}</div>
            <el-button type="text" size="mini" @click.stop="balanceBean(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="usedBean" label="已使用V豆" min-width="80">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.usedBean}}</div>
            <el-button type="text" size="mini" @click.stop="usedBean(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="incomeBean" label="V豆获取量" min-width="80">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.incomeBean}}</div>
            <el-button type="text" size="mini" @click.stop="incomeBean(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="issuedRightsCoupon" label="权益券发放量" min-width="100">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.issuedRightsCoupon}}</div>
            <el-button type="text" size="mini" @click.stop="issuedList(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="usedRightsCoupon" label="已使用权益券" min-width="100">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.usedRightsCoupon}}</div>
            <el-button type="text" size="mini" @click.stop="usedList(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="权益券发放量详情" :visible.sync="dialogTableVisible" :append-to-body="true" center custom-class="orderDialog">
      <biz-list ref="table" :tableData="couponTableData">
        <el-table-column property="name" label="权益券名称"></el-table-column>
        <el-table-column property="issued" label="已发放"></el-table-column>
        <el-table-column property="usable" label="可用"></el-table-column>
        <el-table-column property="used" label="已使用"></el-table-column>
        <el-table-column property="expired" label="已过期"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </biz-pagination>
    </el-dialog>
    <el-dialog title="已使用权益券详情" :visible.sync="dialogTableVisibleUse" :append-to-body="true" center custom-class="usedList">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
      </biz-header>
      <biz-list ref="table" :tableData="couponTableDataUse">
        <el-table-column prop="name" label="权益券名称"></el-table-column>
        <el-table-column prop="code" label="卡券码"></el-table-column>
        <el-table-column label="会员" min-width="200">
          <template slot-scope="scope">
            <div class="customer-info">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member.name}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="usedDate" label="使用日期"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click.stop="certificate(scope.row.id)">凭证</el-button>
          </template>
        </el-table-column>
      </biz-list>
      <biz-pagination :pagination="paginationUsed" @handleSizeChange="handleSizeChangeUsed"
        @handleCurrentChange="handleCurrentChangeUsed"></biz-pagination>
    </el-dialog>

    <el-dialog title="已使用V豆详情" :visible.sync="dialogTableVisibleBean" :append-to-body="true" center custom-class="usedList">
      <biz-header :operations="operationsBean" @operate="operate" :filters="filtersBean" @filterDataChange="filterDataChangeBean">
      </biz-header>
      <biz-list ref="table" :tableData="beanTableData">
        <el-table-column prop="typeName" label="来源"></el-table-column>
        <el-table-column prop="beanCount" label="数量"></el-table-column>
        <el-table-column label="会员">
          <template slot-scope="scope">
            <div class="customer-info">
              <img v-if="scope.row.member.head" :src="scope.row.member.head" />
              <img v-else src="../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member.name}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member.mobile}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="happenData" label="使用日期"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </biz-list>
      <biz-pagination :pagination="paginationBean" @handleSizeChange="handleSizeChangeBean"
        @handleCurrentChange="handleCurrentChangeBean"></biz-pagination>
    </el-dialog>
    <el-dialog :visible.sync="dialogPrintVisible" :append-to-body="true" class="rights-dialog">
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="grid18"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" align="right">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" align="right">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="12">
              <div class="grid-content bg-purple">会员姓名：{{form.member?form.member.name:''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">会员电话：{{form.member?form.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">核销时间：{{form.usedDate}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车牌号：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.plateNumber:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车型：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.type:'':''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车辆识别代码：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.vin:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">券名称：{{form.name}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">券码：{{form.code}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="12" v-if="form.orderSn">
              <div class="grid-content bg-purple">订单编号：{{form.orderSn}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
    <BeanBalanceInfo :rowData="rowData" :beginDate="date&&date.length>0?date[0]:''" :endDate="date&&date.length>0?date[1]:''"
      :dialogVisible="dialogVisible" ref="dialog"></BeanBalanceInfo>
    <BeanUsedInfo :rowData="rowData" :beginDate="date&&date.length>0?date[0]:''" :endDate="date&&date.length>0?date[1]:''"
      :dialogVisible="dialogVisible1"></BeanUsedInfo>
  </biz-grid>
</template>
<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import BizList from '@/components/BizTable/BizList';
import { BizGrid } from '@/components/BizGrid';
import urls from '@/common/urls';
import http from '@/common/http';
import date from '@/utils/date';
import { mapGetters } from 'vuex';
import vueEasyPrint from 'vue-easy-print';
import BeanUsedInfo from './BeanUsedInfo';
import BeanBalanceInfo from './BeanBalanceInfo';
export default {
  data() {
    return {
      templateId: '',
      loading: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogTableVisible: false,
      dialogTableVisibleUse: false,
      dialogTableVisibleBean: false,
      dialogPrintVisible: false,
      beanTableData: [],
      tableData: [],
      couponTableDataUse: [],
      couponTableData: [],
      cardList: [],
      checked: '',
      issuedId: '',
      usedId: '',
      title: '',
      issuedType: '',
      usedType: '',
      form: {},
      rowData: [],
      date: ['', ''],
      operations: [
        {
          label: '导出',
          name: 'export',
          type: ''
        }
      ],
      operationsBean: [
        {
          label: '导出',
          name: 'exportBean',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '权益券',
          name: 'coupon',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '会员',
          placeholder: '请输入姓名/手机号码',
          select: [],
          name: 'searchValue',
          value: ''
        },
        {
          type: 'daterange',
          label: '使用日期',
          name: 'publishDate',
          value: []
        }
      ],
      filtersBean: [
        {
          type: 'daterange',
          label: '使用日期',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      paginationUsed: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      paginationBean: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizPagination,
    BizList,
    BizHeader,
    vueEasyPrint,
    BizGrid,
    BeanUsedInfo,
    BeanBalanceInfo
  },
  created() {
    this.getCardTemplateList();
    this.getFormatDate();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    // 获取今天以及30天前的日期
    getFormatDate() {
      let date = new Date();
      // this.date[1] = date;
      this.date[1] = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      }`;
      let halfYearAgo = function() {
        let dt = new Date();
        dt.setDate(dt.getDate() - 30);
        return `${dt.getFullYear()}-${dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${
          dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
        }`;
      };
      // this.date[0] = date.setDate(date.getDate() - 30);
      this.date[0] = halfYearAgo();
      console.log('date: ', this.date);
      console.log('date: ', date);
    },
    balanceBean(row) {
      console.log(row);
      this.rowData = [];
      if (row.type === 'rank') {
        this.rowData.push(row);
      } else {
        this.rowData = this.tableData.slice(1);
      }
      // this.dialogVisible1 = false;
      // this.dialogVisible = true;
      this.$refs.dialog.balanceBean(row);
    },
    incomeBean(row) {
      console.log(row);
      this.rowData = [];
      if (row.type === 'rank') {
        this.rowData.push(row);
      } else {
        this.rowData = this.tableData.slice(1);
      }
      // this.dialogVisible1 = false;
      // this.dialogVisible = true;
      this.$refs.dialog.getBean(row);
    },
    usedBean(row) {
      this.rowData = [];
      if (row.type === 'rank') {
        this.rowData.push(row);
      } else {
        this.rowData = this.tableData.slice(1);
      }
      this.$refs.dialog.useBean(row);
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    conditionChange() {
      this.dialogVisible = false;
      this.dialogVisible1 = false;
      console.log(this.date);
      if (!this.date) {
        console.log(!this.date);
        this.date = [];
      }
      this.getList();
    },
    getCardTemplateList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        dataType: 'current'
      };
      http
        .get('/admin/memberCardTemplate/memberCardTemplates.jhtml', params)
        .then(data => {
          this.cardList = data.content;
          if (data.content.length > 0) this.checked = data.content[0].id;
          this.getList();
          this.getCouponList();
        })
        .catch(ErrorData => {
          console.log('errdata: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    certificate(id) {
      let params = {
        id: id
      };
      http
        .get(urls.memberCardMgmt.vipRights.voucher, params)
        .then(data => {
          this.dialogPrintVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '核销单' : '核销单';
          this.form = data.data;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    print() {
      this.$refs.easyPrint.print();
    },
    getCouponList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get('/admin/rightscoupon/storeRightCoupons.jhtml', params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    refresh() {
      this.loading = true;
      console.log(this.filters[2].value);
      let params = {
        type: this.usedType,
        id: this.usedId,
        templateId: this.checked,
        searchValue: this.filters[1].value || '',
        couponId: this.filters[0].value || '',
        beginDate: this.filters[2].value[0] ? this.filters[2].value[0] : this.date.length > 0 ? this.date[0] : '',
        endDate: this.filters[2].value[1] ? this.filters[2].value[1] : this.date.length > 0 ? this.date[1] : '',
        pageNumber: this.paginationUsed.currentPage,
        pageSize: this.paginationUsed.pageSize
      };
      http
        .get(urls.memberCardMgmt.vipRights.usedList, params)
        .then(data => {
          this.couponTableDataUse = data.dataList;
          this.paginationUsed.total = Number(data.total);
          this.dialogTableVisibleUse = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    refreshBean() {
      this.loading = true;
      let params = {
        type: this.usedType,
        id: this.usedId,
        templateId: this.checked,
        beginDate: this.filtersBean[0].value[0] || this.date.length > 0 ? this.date[0] : '',
        endDate: this.filtersBean[0].value[1] || this.date.length > 0 ? this.date[1] : '',
        pageNumber: this.paginationBean.currentPage,
        pageSize: this.paginationBean.pageSize
      };
      http
        .get('/admin/bean/expendList.jhtml', params)
        .then(data => {
          this.beanTableData = data.dataList;
          this.paginationBean.total = Number(data.total);
          this.dialogTableVisibleBean = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getList() {
      this.loading = true;
      let params = {
        templateId: this.checked,
        beginTime: this.date.length > 0 ? this.date[0] : '',
        endTime: this.date.length > 0 ? this.date[1] : ''
      };
      http
        .get(urls.memberCardMgmt.memberCard.statistics, params)
        .then(data => {
          this.tableData = data.dataList;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    issuedList(row) {
      this.dialogVisible = false;
      this.dialogVisible1 = false;
      this.pagination.currentPage = 1;
      this.usedId = row.id;
      this.usedType = row.type;
      this.loading = true;
      let params = {
        type: row.type,
        id: row.id,
        beginDate: this.date.length > 0 ? this.date[0] : '',
        endDate: this.date.length > 0 ? this.date[1] : '',
        templateId: this.checked,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.memberCardMgmt.vipRights.issuedList, params)
        .then(data => {
          this.couponTableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.dialogTableVisible = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    usedList(row) {
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.filters[2].value = [];
      this.dialogVisible = false;
      this.dialogVisible1 = false;
      this.loading = true;
      this.usedId = row.id;
      this.usedType = row.type;
      let params = {
        type: row.type,
        id: row.id,
        templateId: this.checked,
        searchValue: this.filters[1].value || '',
        couponId: this.filters[0].value || '',
        beginDate: this.filters[2].value[0] || this.date.length > 0 ? this.date[0] : '',
        endDate: this.filters[2].value[1] || this.date.length > 0 ? this.date[1] : '',
        pageNumber: this.paginationUsed.currentPage,
        pageSize: this.paginationUsed.pageSize
      };
      http
        .get(urls.memberCardMgmt.vipRights.usedList, params)
        .then(data => {
          this.couponTableDataUse = data.dataList;
          this.paginationUsed.total = Number(data.total);
          this.dialogTableVisibleUse = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    export() {
      let params = {
        type: this.usedType,
        id: this.usedId,
        templateId: this.checked,
        beginDate: this.filters[2].value[0] || this.date.length > 0 ? this.date[0] : '',
        endDate: this.filters[2].value[1] || this.date.length > 0 ? this.date[1] : '',
        searchValue: this.filters[1].value || '',
        couponId: this.filters[0].value || '',
        pageNumber: this.paginationUsed.currentPage,
        pageSize: this.paginationUsed.pageSize
      };
      http
        .get('/admin/rightscoupon/usedList/export.jhtml', params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = '/admin/rightscoupon/usedList/export.jhtml?' + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              window.open(linkedUrl);
              // location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
          }
        );
    },
    exportBean() {
      let params = {
        type: this.usedType,
        id: this.usedId,
        templateId: this.checked,
        beginDate: this.filtersBean[0].value[0] || this.date.length > 0 ? this.date[0] : '',
        endDate: this.filtersBean[0].value[1] || this.date.length > 0 ? this.date[1] : '',
        pageNumber: this.paginationBean.currentPage,
        pageSize: this.paginationBean.pageSize
      };
      http
        .get('/admin/bean/expendList/export.jhtml', params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = '/admin/bean/expendList/export.jhtml?' + paramsArr.join('&');
              // 异步弹出窗口会被Chrome拦截
              window.open(linkedUrl);
              // location.href = linkedUrl;
            } else {
              if (data === '没有符合条件的数据') {
                this.$message.warning('没有符合条件的数据');
              } else {
                this.$message.warning(data.errorMessage);
                console.log('ERR_EXPORT: ', data);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
          }
        );
    },
    refreshList() {
      let params = {
        type: this.usedType,
        id: this.usedId,
        templateId: this.checked,
        beginDate: this.date.length > 0 ? this.date[0] : '',
        endDate: this.date.length > 0 ? this.date[1] : '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(urls.memberCardMgmt.vipRights.issuedList, params)
        .then(data => {
          this.couponTableData = data.dataList;
          this.pagination.total = Number(data.total);
          this.dialogTableVisible = true;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    filterDataChange() {
      this.paginationUsed.currentPage = 1;
      this.refresh();
    },
    filterDataChangeBean() {
      this.paginationBean.currentPage = 1;
      this.refreshBean();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refreshList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refreshList();
    },
    handleSizeChangeUsed(val) {
      this.paginationUsed.pageSize = val;
      this.refresh();
    },
    handleCurrentChangeUsed(val) {
      this.paginationUsed.currentPage = val;
      this.refresh();
    },
    handleSizeChangeBean(val) {
      this.paginationBean.pageSize = val;
      this.refreshBean();
    },
    handleCurrentChangeBean(val) {
      this.paginationBean.currentPage = val;
      this.refreshBean();
    },
    balanceFormatter(row) {
      if (!row.balance) return '0.00';
      // 获取整数部分
      let intPart = Number(row.balance) || 0;
      // 将整数部分逢三一断
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      // 预定义小数部分
      let floatPart = '.00';
      let value2Array = row.balance.split('.');

      // =2表示数据有小数位
      if (value2Array.length === 2) {
        // 拿到小数部分
        floatPart = value2Array[1].toString();
        return intPartFormat + '.' + floatPart;
      } else {
        return intPartFormat + floatPart;
      }
    },
    depositFormatter(row) {
      if (!row.deposit) return '0.00';
      // 获取整数部分
      let intPart = Number(row.deposit) || 0;
      // 将整数部分逢三一断
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      // 预定义小数部分
      let floatPart = '.00';
      let value2Array = row.deposit.split('.');

      // =2表示数据有小数位
      if (value2Array.length === 2) {
        // 拿到小数部分
        floatPart = value2Array[1].toString();
        return intPartFormat + '.' + floatPart;
      } else {
        return intPartFormat + floatPart;
      }
    },
    expenseFormatter(row) {
      if (!row.expense) return '0.00';
      // 获取整数部分
      let intPart = Number(row.expense) || 0;
      // 将整数部分逢三一断
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      // 预定义小数部分
      let floatPart = '.00';
      let value2Array = row.expense.split('.');

      // =2表示数据有小数位
      if (value2Array.length === 2) {
        // 拿到小数部分
        floatPart = value2Array[1].toString();
        return intPartFormat + '.' + floatPart;
      } else {
        return intPartFormat + floatPart;
      }
    }
  }
};
</script>

<style lang="scss">
.grid18 {
  height: 20px;
}
.d-p-wrap {
  text-align: left;
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 10px 0px;
  }
  .rowNone {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        > div {
          text-align: left;
        }
      }
    }
  }
}
.usedList {
  width: 80% !important;
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
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
.template-static-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .indicators-search {
    display: flex;
    flex-wrap: wrap;
    .el-radio-button__inner {
      padding: 10px;
      font-size: 12px;
    }
    .title {
      padding: 20px 10px;
      font-size: 12px;
    }
    .date {
      display: flex;
      align-items: center;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border: none;
    }
    .el-radio-button,
    .el-radio-button__inner {
      padding: 10px;
    }
    .el-radio-button__inner {
      border: none;
    }
    .el-radio-button.is-checked .el-radio-button__inner {
      background-color: #fff;
      border-color: #fff;
      box-shadow: -1px 0 0 0 #fff;
      color: #ff7300;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
