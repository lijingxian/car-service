<template>
  <div class="coupon-records">
    <biz-flex-table
      ref="table"
      :loading="loading"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="records"
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :checkable="false"
    >
      <el-table-column width="150" label="会员">
        <template v-slot:default="{row}">
          <div class="_member">
            <div class="head">
              <img :src="row.member.head || defaultUser" />
            </div>
            <div class="mane-tel">
              <div class="name">{{row.member.name.slice(0,11)}}</div>
              <div class="tel">{{row.member.mobile}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="70" label="发放渠道">
        <template v-slot:default="{row}">{{row.channel === '0'?'会员卡':row.channel === '1'?'关怀卡':''}}</template>
      </el-table-column>
      <el-table-column prop="code" width="110" label="卡券码"></el-table-column>
      <el-table-column prop="state" width="60" :formatter="getState" label="状态"></el-table-column>
      <el-table-column width="80" prop="date" label="操作">
        <template v-slot:default="{row}">
          <div class="operate-btn-group">
            <el-button type="text" size="mini" @click.stop="verificationDialog(row)" v-show="row.state === '2'">核销</el-button>
            <el-button type="text" size="mini" @click.stop="printDialog(row)" v-show="row.state === '4'">凭证</el-button>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <el-dialog title="福利核销" :visible.sync="dialogVerification" width="500px" :append-to-body="true" center>
      <el-form ref="formSingle" size="small" :model="formVerification" label-width="55px" :inline-message="true">
        <div style="padding-bottom:10px">请您在与客户沟通一致前提下使用此功能，福利核销后，不能恢复。</div>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="formVerification.remarks" placeholder="备注字数限制100字" maxlength="100" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVerification = false" size="small">取 消</el-button>
          <el-button type="primary" @click="verification" size="small">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogPrint" :append-to-body="true" class="rights-dialog">
      <el-row :gutter="10">
        <div class="btn-c" align="right">
          <el-button type="primary" @click="print" size="mini">打印</el-button>
        </div>
      </el-row>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">{{getUser.shop ? getUser.shop.name + '核销单' : '核销单'}}</div>
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
              <div class="grid-content bg-purple">会员姓名：{{formPrint.member?formPrint.member.name:''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">会员电话：{{formPrint.member?formPrint.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">核销时间：{{formPrint.usedDate}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">车牌号：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.plateNumber:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">车型：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.type:'':''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">车辆识别代码：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.vin:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">券名称：{{formPrint.name}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">券码：{{formPrint.code}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="24">
              <div class="grid-content bg-purple">备注：{{formPrint.remarks}}</div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BizFlexTable } from '@/components/BizTable';
import vueEasyPrint from 'vue-easy-print';
import { couponMgmt } from '@/common/urls';
import http from '@/common/http';
import defaultUser from '@/assets/images/default_user.png';

export default {
  name: 'CouponBaseInfo',
  components: {
    vueEasyPrint,
    BizFlexTable
  },
  props: {
    idObj: {}
  },
  data() {
    return {
      defaultUser: defaultUser,
      loading: false,
      dialogPrint: false,
      formPrint: {},
      title: '',
      dialogVerification: false,
      formVerification: {
        memberId: '',
        remarks: '',
        couponCodeId: ''
      },
      records: [],
      pagination: {
        pagerCount: 5,
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      rules: {
        code: [{ required: true, trigger: 'blur', message: '请输入权益券码' }]
      }
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    isCreated() {
      return !this.idObj.id;
    }
  },
  watch: {
    idObj: {
      handler(idObj) {
        if (idObj.id) {
          this.filters[0].value = '';
          this.pagination.currentPage = 1;
          this.getRecords();
        } else {
          this.clear();
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    operate(name) {
      this[name]();
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getRecords();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getRecords();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getRecords();
    },
    getRecords() {
      this.loading = true;
      let params = {
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchValue: this.filters[0].value,
        couponId: this.idObj.id
      };
      http
        .get(couponMgmt.record, params)
        .then(data => {
          this.records = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getState({ state }) {
      let obj = {
        '0': '未开始',
        '1': '可使用',
        '2': '可使用',
        '3': '已过期',
        '4': '已使用'
      };
      return obj[state];
    },
    printDialog(row) {
      this.dialogPrint = true;
      let params = {
        couponCodeId: row.couponCodeId
      };
      http
        .get(couponMgmt.print, params)
        .then(data => {
          this.formPrint = data.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    print() {
      this.$refs.easyPrint.print();
    },
    verificationDialog(row) {
      this.dialogVerification = true;
      this.formVerification.memberId = row.member.id;
      this.formVerification.couponCodeId = row.couponCodeId;
    },
    verification() {
      let params = {
        couponCodeId: this.formVerification.couponCodeId,
        memberId: this.formVerification.memberId,
        remarks: this.formVerification.remarks
      };
      http
        .post(couponMgmt.verification, params)
        .then(data => {
          this.$message.success('核销成功');
          this.getRecords();
          this.dialogVerification = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {});
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
      return newTime;
    },
    clear() {
      this.records = [];
      this.pagination.currentPage = 1;
      this.pagination.total = 0;
      this.filters[0].value = '';
    }
  }
};
</script>

<style lang="scss">
.coupon-records {
  .el-table__row {
    ._member {
      display: flex;
      .head {
        width: 40px;
        height: 40px;
        margin-right: 5px;
        // border-radius: 20px;
        img {
          border-radius: 20px;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .mane-tel {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }
  .biz-pagination {
    .el-pagination__total {
      margin-right: 2px;
    }
    .btn-prev {
      padding-right: 2px;
      margin-right: 1px;
    }
    .el-pager li {
      min-width: 24px;
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      margin: 0 1px !important;
      padding: 0 1px !important;
    }
    .el-pagination__sizes {
      margin: 0 1px 0 1px !important;
      .el-select {
        .el-input {
          width: 70px;
          .el-input__inner {
            padding-right: 5px;
            padding-left: 0;
          }
        }
      }
    }
    .el-pagination__jump {
      min-width: 24px;
      .el-pagination__editor {
        width: 30px;
      }
    }
  }
}
.rights-dialog .el-dialog {
  width: 80%;
  .btn-c {
    display: flex;
    justify-content: flex-end;
  }
}
.d-p-wrap {
  text-align: left;
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .rowNone {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
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
</style>
