<template>
  <div class="review-static-detail">
    <biz-flex-table
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      :checkable="false"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :loading="loading"
      :pagination="pagination"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column width="200" prop="robotData.name" label="机器人"></el-table-column>
      <el-table-column prop="memberData.name" label="会员">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.memberData.name}}
            </div>
            <div class="overflow">
              {{scope.row.memberData.mobile}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceAttitude" label="服务满意度">
        <template slot-scope="scope">
          <div v-if="scope.row.serviceAttitude==='0'||scope.row.serviceAttitude===''"></div>
          <div style="font-size:18px" v-if="scope.row.serviceAttitude==='1'">
            <i class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceAttitude==='2'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceAttitude==='3'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceAttitude==='4'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceAttitude==='5'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="professional" label="任务达成">
        <template slot-scope="scope">
          <div v-if="scope.row.professional==='0'||scope.row.professional===''"></div>
          <div style="font-size:18px" v-if="scope.row.professional==='1'">
            <i class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.professional==='2'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.professional==='3'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.professional==='4'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.professional==='5'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceSpeed" label="响应速度">
        <template slot-scope="scope">
          <div v-if="scope.row.serviceSpeed==='0'||scope.row.serviceSpeed===''"></div>
          <div style="font-size:18px" v-if="scope.row.serviceSpeed==='1'">
            <i class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceSpeed==='2'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceSpeed==='3'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceSpeed==='4'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
          <div style="font-size:18px" v-if="scope.row.serviceSpeed==='5'">
            <i class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
            <i style="padding-left:5px" class="el-icon-star-off"></i>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>

    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup=false;">
        <el-tab-pane label="基本信息" name="info">
          <review-static-detail-base-info :recordInfo="recordInfo"></review-static-detail-base-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import dateTime from '@/utils/dateTime';
import { BizPopupTabs } from '@/components/BizPopup';
import ReviewStaticDetailBaseInfo from './ReviewStaticDetailBaseInfo';

export default {
  name: 'NewsMgmt',
  data() {
    return {
      date: 'month',
      viewType: 'month',
      defaultDate: [dateTime.getWeekStartDate(), dateTime.getWeekEndDate()],
      loading: false,
      // 右侧弹窗
      popupTabName: 'info',
      openPopup: false,
      recordInfo: {},
      selections: [],
      tableData: [],
      operations: [
        {
          label: '导出',
          name: 'exportExcle',
          type: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      filters: [
        {
          type: 'select',
          label: '机器人',
          name: 'type',
          value: '',
          options: []
        },
        {
          type: 'daterange',
          label: '日期',
          name: 'publishDate',
          value: [dateTime.today(), dateTime.today()]
        }
      ]
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    ReviewStaticDetailBaseInfo
  },
  created() {
    this.init();
    this.getList();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    exportExcle() {
      let params = {
        beginTime: this.filters[1].value[0] || '',
        endTime: this.filters[1].value[1] || '',
        terminalId: this.filters[0].value || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/reception/robotInfoReview/export.jhtml', params)
        .then()
        .catch(
          data => {
            if (!data.errorMessage && data !== '没有符合条件的数据') {
              let paramsArr = [];
              for (let name in params) {
                paramsArr.push(`${name}=${params[name]}`);
              }
              let linkedUrl = '/admin/reception/robotInfoReview/export.jhtml?' + paramsArr.join('&');
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
    rowClick(model, e, column) {
      this.popupTabName = 'info';
      this.openPopup = true;
      this.recordInfo = model;
    },
    init() {
      http
        .get(customerService.smartReception.getRobotInfoList, {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.filters[0].options =
            data.data && data.data.length > 0
              ? data.data.map(item => {
                return { label: item.name, value: item.id };
              })
              : [];
          this.filters[0].value = data.data && data.data.length > 0 ? data.data[0].id : '';
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getList() {
      let params = {
        beginDate: this.filters[1].value[0],
        endDate: this.filters[1].value[1],
        terminalId: this.$route.query.id || this.filters[0].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/reception/listRobotInfoReview.jhtml', params)
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    filterDataChange() {
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.review-static-detail {
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
  .delete-btn {
    color: red;
  }
}
</style>
