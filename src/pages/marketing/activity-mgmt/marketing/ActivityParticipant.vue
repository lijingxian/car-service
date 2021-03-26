<template>
  <div class="activity-participant">
    <div class="attendLimit">
      <span v-if="isZM">已报名{{attendCount}}位/{{maxPersonCount?'限额'+maxPersonCount+'位':'无限制'}}</span>
    </div>
    <biz-flex-table ref="table" :loading="loading" :operations="operations" @operate="operate" :filters="filters"
      @filter-data-change="filterDataChange" :tableData="tabelHandle" :pagination="pagination" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :checkable="false">
      <el-table-column v-if="isZM" prop="attendDate" label="报名时间">
      </el-table-column>
      <el-table-column v-if="isZM" prop="member.nickname" label="用户昵称">
      </el-table-column>
      <el-table-column v-if="isZM" v-for="option in recruitOption" :key="option.id" :prop="'optionValues.'+ option.name" :label="option.name">
      </el-table-column>
      <el-table-column v-if="!isZM&&!isSite" width="160" prop="attendDate" label="参与时间">
      </el-table-column>
      <el-table-column v-if="!isZM&&!isSite" width="150" prop="member.mobile" label="参与用户手机号">
      </el-table-column>
      <el-table-column v-if="isPTG&&!isXSMS" prop="state" :formatter="getState" label="状态">
      </el-table-column>

      <el-table-column v-if="!isOrder&&!isPTG&&!isXSMS&&!isNYQG&&!isZM&&!isSite" width="100" :prop="prizeName" label="奖品名称">
      </el-table-column>
      <el-table-column key="odjplx" v-if="!isOrder&&!isPTG&&!isXSMS&&!isNYQG&&!isZM&&!isSite" width="100" :formatter="getType" label="奖品类型">
      </el-table-column>
      <el-table-column key="odkqm" v-if="!isOrder&&!isBKJ&&!isPTG&&!isXSMS&&!isNYQG&&!isZM&&!isSite" width="120" label="卡券码">
        <div slot-scope="scope">
          <div class="hx" v-if="scope.row.couponCode">
            {{scope.row.couponCode.code}}
            <el-button type="text" size="mini" v-show="scope.row.couponCode.isUsed==='false'" @click.stop="verification(scope.row)">
              核销
            </el-button>
          </div>
        </div>
      </el-table-column>

      <!-- <el-table-column v-if="!isOrder&&!isBKJ&&!isPTG"
                       width="140"
                       prop="couponCode.usedDate"
                       label="使用时间">
      </el-table-column> -->
      <el-table-column v-if="isOrder" label="订单号">
        <div slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="orderDetail(scope.row)">
            {{scope.row.orderSn}}
          </el-button>
        </div>
      </el-table-column>

      <el-table-column v-if="isNYQG" prop="productCount" label="购买份数">
      </el-table-column>
      <el-table-column v-if="isNYQG" key="sfzj" :formatter="getSFZJ" label="是否中奖">
      </el-table-column>
      <el-table-column v-if="isNYQG" key="zjfs" :formatter="getZJFS" label="中奖份数">
      </el-table-column>

      <el-table-column v-if="isBKJ" key="bkcs" prop="bargainCount" label="砍价次数">
      </el-table-column>
      <el-table-column v-if="isBKJ" key="bkje" prop="discountPrice" label="砍价金额">
      </el-table-column>
      <el-table-column v-if="isBKJ||isPTG||isXSMS||isNYQG" width="200" key="bkddh" prop="orderSn" label="订单号">
        <div slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="orderDetail(scope.row)">
            {{scope.row.orderSn}}
          </el-button>
        </div>
      </el-table-column>
      <el-table-column v-if="isBKJ" key="bkcz" label="操作">
        <div slot-scope="scope">
          <div class="hx">
            <el-button type="text" size="mini" @click.stop="openBKJDlg(scope.row)">
              帮砍记录
            </el-button>
          </div>
        </div>
      </el-table-column>

      <!-- 潜客活动 -->
      <el-table-column v-if="isSite" prop="attendDate" label="时间">
      </el-table-column>
      <el-table-column v-if="isSite" prop="customerData.name" width="60" label="姓名">
      </el-table-column>
      <el-table-column v-if="isSite" prop="customerData.mobile" width="100" label="电话">
      </el-table-column>
      <el-table-column v-if="isSite" prop="customerData.intentionCars[0].productName" label="意向车型">
      </el-table-column>

    </biz-flex-table>

    <el-dialog class="activity-part-bkj-dlg" :title="dlgTitle" append-to-body :visible.sync="dlgVisible" @close="dlgVisible = false">
      <biz-flex-table :checkable="checkable" :loading="dlgLoading" :tableData="dlgTableData" :pagination="dlgPagination"
        @size-change="dlgPageSizeChange" @current-change="dlgCurrentPageChange">
        <el-table-column prop="wxName" label="帮砍用户">
        </el-table-column>
        <el-table-column prop="happenDate" label="帮砍时间">
        </el-table-column>
        <el-table-column prop="cutPrice" label="帮砍金额">
        </el-table-column>
      </biz-flex-table>
    </el-dialog>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import Service from '@/service/activity-mgmt/marketing/activityMgmt';
import http from '@/common/http';
export default {
  name: 'ActivityParticipant',
  data() {
    return {
      checkable: false,
      bargainAttendId: '',
      dlgTitle: '帮砍记录',
      dlgVisible: false,
      dlgLoading: false,
      loading: false,
      dlgTableData: [],
      dlgPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      height: '',
      attendCount: '',
      maxPersonCount: '',
      recruitOption: [],
      activity: {},
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      tableData: [],
      operations: [
        {
          label: '导出',
          name: 'exportAttend',
          type: 'primary'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '奖品名称',
          name: 'prizeName',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    itemId: {
      type: Object
    }
  },
  components: { BizFlexTable },
  created() {
    this.resize();
  },
  computed: {
    tabelHandle() {
      let tableData = this.tableData;
      tableData.forEach(element => {
        if (!element.member) {
          element.member = {};
          element.member.nickname = '游客';
        }
      });
      return tableData;
    },
    isOrder() {
      if (['0', '1', '2', '7', '8'].indexOf(this.activity.typeStr) === -1) {
        if (this.activity.isPayOnline === '1') {
          return true;
        }
      }
      return false;
    },
    // 抽奖 摇一摇 抢红包
    isCYC() {
      return ['0', '1', '2'].indexOf(this.activity.typeStr) !== -1;
    },
    // 限时秒杀
    isXSMS() {
      return this.activity.typeStr === '5';
    },
    isBKJ() {
      return this.activity.typeStr === '6';
    },
    isPTG() {
      return this.activity.typeStr === '3';
    },
    isNYQG() {
      return this.activity.typeStr === '4';
    },
    isZM() {
      return this.activity.typeStr === '9';
    },
    isSite() {
      return this.activity.typeStr === '11' || this.activity.typeStr === '12';
    },
    prizeName() {
      if (['0', '1', '2', '7', '8'].indexOf(this.activity.typeStr) === -1) {
        return 'product.name';
      } else {
        return 'prizeName';
      }
    },
    prizeCount() {
      if (['0', '1', '2', '7', '8'].indexOf(this.activity.typeStr) === -1) {
        return 'productCount';
      } else {
        return 'prize.count';
      }
    }
  },
  watch: {
    itemId(nVal, oVal) {}
  },
  methods: {
    resize() {
      let height = document.documentElement.clientHeight || window.innerHeight;
      this.height = String(height - 345);
    },
    operate(name) {
      this[name]();
    },
    prizeNameList() {
      let params = {
        activityId: this.activity.id
      };
      http
        .get('/admin/marketing/prizeNames.jhtml', params)
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.data.map(item => {
              return { label: item, value: item };
            })
          );
        })
        .catch(ErrorData => {});
    },
    exportAttend() {
      if (this.activity.typeStr === '9' && (this.attendCount < 1 || this.attendCount === '')) {
        this.$notify({
          title: '警告',
          message: '报名人数为0不能导出',
          type: 'warning',
          duration: 1500
        });
        return false;
      }
      let params = {
        id: this.activity.id,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        prizeName: this.filters[0].value,
        searchValue: this.filters[1].value
      };
      // Service.exportAttend(
      //   params,
      //   data => {},
      //   ErrorData => {
      //     this.$notify({
      //       title: '警告',
      //       message: ErrorData.errorMessage,
      //       type: 'warning'
      //     });
      //   }
      // );
      http
        .get('admin/marketing/exportAttend.jhtml', params)
        .then()
        .catch(data => {
          if (!data.errorMessage && data !== '没有符合条件的数据') {
            let paramsArr = [];
            for (let name in params) {
              paramsArr.push(`${name}=${params[name]}`);
            }
            let linkedUrl = `${'admin/marketing/exportAttend.jhtml'}?` + paramsArr.join('&');
            // 异步弹出窗口会被Chrome拦截
            window.open(linkedUrl);
            // location.href = linkedUrl;
          } else {
            if (data === '没有符合条件的数据') {
              this.$message.warning('没有符合条件的数据');
            } else {
              this.$message.warning(data.errorMessage);
            }
          }
        });
    },
    filterDataChange(filters) {
      this.refresh(this.activity);
    },
    refresh(activity) {
      this.activity = activity;
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        prizeName: this.filters[0].value,
        searchValue: this.filters[1].value,
        activityId: this.activity.id
      };
      Service.getActivityParticipant(
        params,
        data => {
          this.tableData = data.content;
          this.attendCount = data.attendCount || '';
          this.maxPersonCount = data.maxPersonCount;
          this.recruitOption = data.recruitOption;
          this.pagination.total = Number(data.total);
          this.prizeNameList();
          if (['0', '1', '2', '7', '8'].indexOf(this.activity.typeStr) === -1) {
            document.querySelectorAll('.filter-wrap')[5].style.display = 'none';
          } else {
            document.querySelectorAll('.filter-wrap')[5].style.display = '';
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh(this.activity);
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh(this.activity);
    },
    getState(row) {
      switch (row.state) {
        case 'wait':
          return '等待';
        case 'success':
          return '成功';
        case 'fail':
          return '失败';
        default:
          break;
      }
    },
    getType(row) {
      if (['0', '1', '2', '7', '8'].indexOf(this.activity.typeStr) === -1) {
        return this.getProductType(row);
      } else {
        return this.getPriceType(row);
      }
    },
    getPriceType(row) {
      if (row.prize) {
        switch (row.prize.type) {
          case 'bean':
            return 'V豆';
          case 'again':
            return '再来一次';
          case 'thanks':
            return '谢谢参与';
          case 'physical':
            return '实物';
          case 'cashCoupon':
            return '现金券';
          default:
            break;
        }
      } else {
        return '';
      }
    },
    getProductType(row) {
      switch (row.product.productType) {
        case '0':
          return '普通商品';
        case '1':
          return '兑换商品';
        case '2':
          return '赠品';
        case '3':
          return 'sim充值';
        case '4':
          return '平台服务';
        default:
          break;
      }
    },
    getZJFS(row) {
      let count = 0;
      for (const code of row.codes) {
        if (code.isLuck === '1') {
          count++;
        }
      }
      return count;
    },
    getSFZJ(row) {
      for (const code of row.codes) {
        if (code.isLuck === '1') {
          return '是';
        }
      }
      return '否';
    },
    orderDetail(row) {
      this.$router.push({
        path: `/order/product/${row.order.orderType}`,
        query: { id: row.order.id }
      });
    },
    verification(row) {
      this.$confirm('是否确认核销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            attendId: row.id,
            code: row.couponCode.code
          };
          Service.verification(
            params,
            data => {
              this.$notify({
                title: '成功',
                message: '核销成功',
                type: 'success',
                duration: 1500
              });
              this.refresh(this.activity);
            },
            ErrorData => {
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    openBKJDlg(row) {
      this.bargainAttendId = row.id;
      this.getBKRecord();
      this.dlgVisible = true;
    },
    getBKRecord() {
      this.dlgLoading = true;
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        bargainAttendId: this.bargainAttendId
      };
      Service.getBKRecordList(
        params,
        data => {
          this.dlgTableData = data.dataList;
          this.dlgPagination.total = Number(data.total);
          this.dlgLoading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.dlgLoading = false;
        }
      );
    },
    dlgPageSizeChange() {},
    dlgCurrentPageChange() {}
  }
};
</script>

<style lang="scss">
$biz-dialog-selector-height: 80;

.activity-participant {
  .attendLimit {
    padding: 25px 0px 0px 70px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .biz-input {
    width: 150px;
    right: 15px !important;
    top: 20px !important;
  }
  .biz-select {
    width: 100px;
    margin-right: 100px;
  }
  .biz-table-filter .filter-label {
    font-size: 12px;
  }
  .biz-table-filter .filter-wrap {
    width: auto !important;
    margin-left: 5px !important;
    margin: 0px !important;
  }
  .biz-table-body {
    margin: 10px 5px;
    .hx {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
.activity-part-bkj-dlg {
  .el-dialog__body {
    padding: 70px 20px 0 0;
    height: 600px;
    position: relative;
  }
}
</style>
