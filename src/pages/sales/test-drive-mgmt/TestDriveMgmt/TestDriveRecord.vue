<template>
  <biz-grid class="test-drive-record" v-loading="loading">
    <div slot="top">
      <biz-header :operations="operations" @operate="handleOperate" style="float:left">
      </biz-header>
    </div>
    <el-table :data="tableData" height="100%" @selection-change="handleSelectionChange" size="small">
      <!-- <el-table-column label="会员信息" prop="member" min-width="100">
        <template slot-scope="scope">
          <div class="content">
            <div class="item1">
              {{scope.row.member.name}}
            </div>
            <div class="item2">
              {{scope.row.member.mobile}}
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="顾问" prop="adviser">
        <template slot-scope="scope">{{scope.row.adviser.name}}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <div>
            {{scope.row.state==='1'?'已服务':'服务中'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="体验时长" prop="happenDate">
        <template slot-scope="scope">
          {{dateInterval(scope.row.beginDate,scope.row.endDate)}}
        </template>
      </el-table-column>
      <el-table-column label="体验里程(km)" prop="drivingRange"></el-table-column>
      <el-table-column label="记录来源" prop="sourceType"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleCarTrackClick($event, scope.row)" v-show="scope.row.hasCarTrack==='1'">
            轨迹
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="biz-pagination" slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog :visible.sync="dialogVisible" @close="dialogVisible=false" title="轨迹" append-to-body custom-class="test-drive-history-dialog">
      <test-drive-history :trackId="trackId"></test-drive-history>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import { testDriveMgmt as service } from '@/common/urls';
import http from '@/common/http';
import axios from 'axios';
import TestDriveHistory from './TestDriveHistory';
export default {
  name: 'TestDriveRecord',
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    TestDriveHistory,
    BizPagination
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      operations: [
        {
          label: '导出',
          name: 'export',
          type: 'primary',
          auth: ['admin:testdriveManagment.edit']
        }
      ],
      selections: [],
      tableData: [],
      trackId: '',
      pagination: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      rules: {}
    };
  },
  created() {
    if (this.itemId) {
      this.query();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.query();
      }
    }
  },
  mounted() {},
  methods: {
    dateInterval(val, val1) {
      if (val && val1) {
        let dateBegin = new Date(val);
        let dateEnd = new Date(val1);
        let dateDiff = dateEnd.getTime() - dateBegin.getTime();
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
        let leave1 = dateDiff % (24 * 3600 * 1000);
        let hours = Math.floor(leave1 / (3600 * 1000));
        let leave2 = leave1 % (3600 * 1000);
        let minutes = Math.floor(leave2 / (60 * 1000));
        let leave3 = leave2 % (60 * 1000);
        let seconds = Math.round(leave3 / 1000);
        return (dayDiff > 0 ? dayDiff + 'd' : '') + (hours > 0 ? hours + 'h' : '') + minutes + 'min' + (seconds > 0 ? seconds + 's' : '');
      }
    },
    handleCarTrackClick(e, model) {
      if (model.beginDate && model.endDate) {
        // window.open(
        //   document.location.protocol +
        //     '//' +
        //     window.location.host +
        //     '/index.htm#/sales/testDrive/testDriveHistory/' +
        //     model.trackId
        // );
        this.trackId = model.trackId;
        this.dialogVisible = true;
        // this.$router.push({ path: '/sales/testDrive/testDriveHistory/' + model.trackId, query: {} });
      }
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    getParams() {
      let params = {
        testDriveId: this.itemId || '',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      return params;
    },
    // 查询列表
    query() {
      let params = this.getParams();
      http
        .get(service.testDriveRecord.testDriveRecordList, params)
        .then(data => {
          this.tableData = data.dataList;
          this.$set(this.pagination, 'total', Number.parseInt(data.total));
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    async export() {
      let params = this.getParams();
      try {
        let response = await axios.post(service.testDriveRecord.testDriveRecordExport, params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        const elink = document.createElement('a');
        console.log(fileName);
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
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.query();
    }
  }
};
</script>

<style lang="scss">
.test-drive-history-dialog {
  width: 1200px;
  height: 80%;
  .el-dialog__headerbtn {
    z-index: 3000;
  }
}
.test-drive-record {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .biz-header {
    float: right;
  }
  .biz-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .el-table__body-wrapper .is-scrolling-none {
    overflow-x: auto;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .item1 {
    // font-size: 15px;
    // color: #3b3b3b;
    // font-weight: bold;
  }
  .item2 {
    // font-size: 12px;
    // color: #aaa;
    // margin-top: 5px;
  }
}
</style>
