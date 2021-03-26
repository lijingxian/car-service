<template>
  <biz-grid class="shop-account-mgmt">
    <div slot="top" class="message-mgmt-header">
      <div style="font-size: 14px;margin-bottom: 10px;display:flex;align-items: center;">
        <div>
          账户名称：
          {{data.shop?data.shop.name:''}}
        </div>
        <div style="padding: 0px 10px 0px 10px">
          状态：
          {{data.state==='0'?'停用':'启用'}}
        </div>
        <div style="padding: 0px 10px 0px 10px">
          已订购服务：
          {{data.services?data.services.join('/'):''}}
        </div>
      </div>
      <div style="font-size: 14px;display:flex;align-items: center;">
        <div>
          账户余额：
          ￥{{balance}}
        </div>
        <div style="padding: 0px 10px 0px 10px" v-popover:codePop>
          可用余额：
          ￥{{availableAmount}}
          <i class="iconfont el-icon-question" style="color:#ff7300;margin-left:10px"></i>
        </div>
        <el-popover ref="codePop" placement="bottom-end" width="300" trigger="hover">
          <p>当您进行推送时，头条、百度等推送渠道可能产生费用，平台将从账户中按预算设置冻结对应投放时间内所需的金额，此时会出现账户可用余额小于账户余额的情况。</p>
          <p>当日推送结束后，对当日的冻结金额进行结算，扣除当日推送产生的费用，其余部分退还至可用账户。V服不收取任何中间费用，具体收费按第三方渠道产生的实际费用收取。</p>
        </el-popover>
      </div>
    </div>
    <biz-flex-table
      :operations="operations"
      ref="table"
      @selection-change="handleSelectionChange"
      @operate="operate"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column prop="itemName" label="项目">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.itemName}}</div>
            <div>{{scope.row.createDate}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="credit" label="金额">
        <template slot-scope="scope">
          <div>
            <div>{{ getCredit(scope.row.credit) }}</div>
            <div>账户余额：{{scope.row.balance}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="付款方式"></el-table-column>
      <el-table-column prop="operator" label="操作者"></el-table-column>
    </biz-flex-table>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="充值" name="first">
          <shop-recharge :itemId="itemId" ref="recharge" @operationSuccess="operationSuccess"></shop-recharge>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openBase" @close="openBase = false;" v-model="tabName">
        <el-tab-pane label="基本信息" name="first">
          <base-info :form="form"></base-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <export-file-new ref="exportFile" :percentage="percentage" @clearTimeOut="clearTimeOut" @exportExcle="exportExcle"></export-file-new>
  </biz-grid>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import ShopRecharge from './ShopRecharge';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import BaseInfo from './BaseInfo';
import axios from 'axios';
import { ExportFileNew } from '@/components/BizUpload';
export default {
  name: 'MessageMgmtSys',
  components: {
    BizFlexTable,
    BizGrid,
    BizPopupTabs,
    ShopRecharge,
    BaseInfo,
    ExportFileNew
  },
  data() {
    return {
      tabName: 'first',
      itemId: '',
      id: '',
      open: false,
      openBase: false,
      loading: false,
      balance: '',
      multipleSelection: [],
      availableAmount: '',
      data: {},
      form: {},
      tableData: [],
      taskId: '',
      t: '',
      percentage: 0,
      operations: [
        {
          label: '充值',
          name: 'recharge',
          type: 'primary'
        },
        {
          label: '导出',
          name: 'exportStart',
          type: ''
        }

      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {},
  watch: {},
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    operate(name) {
      this[name]();
    },
    rowClick(row) {
      this.open = false;
      this.openBase = true;
      this.form = row;
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    getCredit(credit) {
      console.log(credit);
      let creditNew = '';
      creditNew = credit.slice(0, 1) + '￥' + credit.slice(1);
      return creditNew;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportStart() {
      let ids = [];
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
      }
      let params = {
        ids: ids,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: this.getUser().shop.id || window.top.SHOP_ID || ''
      };
      http
        .post('/admin/account/exportAccountDepositStart.jhtml', params)
        .then(data => {
          this.taskId = data.data.taskId;
          this.getProcess(data.data.taskId);
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportExcle() {
      try {
        let response = await axios.get('/admin/account/exportAccountDepositResult.jhtml?taskId=' + this.taskId, { responseType: 'blob' });
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
    getProcess(taskId) {
      let url = '/rest/v1/asynctask/getTaskInfo.jhtml';
      http
        .get(url, { taskId: this.taskId })
        .then(data => {
          if (!data.data.rate) {
            this.percentage = 0;
          }
          if (data.data.rate) {
            this.percentage = Number(data.data.rate);
          }
          if (data.data.status === '1' || data.data.status === '2' || data.data.status === '0') {
            this.$refs.exportFile.uploadingVisible = true;
            if (data.data && data.data.rate && data.data.rate === '100') {
              this.clearTimeOut();
              this.$refs.exportFile.title = '导出完成';
            } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
              if (this.t) {
                this.clearTimeOut();
              }
              this.t = setTimeout(this.getProcess, 2000);
            }
          } else {
            this.$message.warning('导出失败');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: this.getUser().shop.id || window.top.SHOP_ID || ''
      };
      http
        .get('/admin/account/deposits.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
          this.data = data.data;
          this.balance = data.data.balance;
          this.availableAmount = data.data.availableAmount;
          this.id = data.data.id;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    recharge() {
      this.itemId = this.id;
      this.open = true;
      this.$refs.recharge.clear();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.shop-account-mgmt {
  .message-mgmt-header {
    padding: 20px 0px 0px 20px;
  }
}
</style>
