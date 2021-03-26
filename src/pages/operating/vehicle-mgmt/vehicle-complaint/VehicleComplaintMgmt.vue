<template>
  <div class="vehicle-complaint">
    <biz-flex-table ref="table" :filters="filters" :pagination="pagination" :tableData="tableData" :loading="loading"
      @size-change="pageSizeChange" @current-change="currentPageChange" @selection-change="selectionChangeHandler"
      @filter-data-change="filterDataChangeHandler" @row-click="rowOperationClickHandler">
      <el-table-column prop="plateNumber" label="车牌号">
      </el-table-column>
      <el-table-column label="车主信息">
        <template slot-scope="scope">
          <div>
            <div>
              <span>{{scope.row.appealer.name}}</span>
            </div>
            <div>
              <span>{{scope.row.appealer.gender==='0'?'男':'女'}}</span>
            </div>
            <div>
              <span>{{scope.row.appealer.mobile}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="申请提交时间">
      </el-table-column>
      <el-table-column prop="state" label="处理进度">
      </el-table-column>
      <el-table-column prop="modifyDate" label="处理时间">
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <complaint-popup :open="open" :itemId="itemId" @close="open = false;" @operationSuccess="operationSuccess">
      </complaint-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import ComplaintPopup from './ComplaintPopup';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'vehicle-complaint',
  data() {
    return {
      // 控件
      itemId: '1',
      classId: '',
      selections: [],

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
      filters: [
        {
          type: 'select',
          label: '处理进度',
          name: 'searchValue',
          value: '全部',
          options: [
            {
              value: '全部',
              label: '全部'
            },
            {
              value: '待处理',
              label: '待处理'
            },
            {
              value: '申诉成功',
              label: '申诉成功'
            },
            {
              value: '申诉失败',
              label: '申诉失败'
            },
            {
              value: '申诉取消',
              label: '申诉取消'
            }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入车主手机号/车牌号',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  props: {},
  components: {
    BizFlexTable,
    ComplaintPopup
  },
  computed: {},
  watch: {},
  methods: {
    operationSuccess() {
      this.getComplaintInfos();
    },
    filterDataChangeHandler() {
      this.pagination.currentPage = 1;
      console.log('filterDataChangeHandler');
      this.getComplaintInfos();
    },
    selectionChangeHandler() {
      console.log('selectionChangeHandler');
    },
    currentPageChange(val) {
      console.log('currentPageChange');
      this.pagination.currentPage = val;
      this.getComplaintInfos();
    },
    pageSizeChange(val) {
      console.log('pageSizeChange');
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getComplaintInfos();
    },
    rowOperationClickHandler(model) {
      this.itemId = model.id;
      this.open = true;
      console.log(model.id);
    },
    getComplaintInfos() {
      this.loading = true;
      let state;
      switch (this.filters[0].value) {
        case '全部':
          state = '';
          break;
        case '待处理':
          state = '0';
          break;
        case '申诉成功':
          state = '1';
          break;
        case '申诉失败':
          state = '2';
          break;
        case '申诉取消':
          state = '3';
          break;
        default:
          state = '';
          break;
      }
      console.log('状态', this.filters);
      let param = {
        state: state,
        mobile: '',
        plateNumber: '',
        searchValue: this.filters[1].value,
        pageNumber: this.pagination.currentPage.toString(),
        pageSize: this.pagination.pageSize.toString()
      };

      http
        .get(urls.vehicleMgmt.VehicleBaseInfo_appeals, param)
        .then(data => {
          this.tableData = data.datas;

          data.datas.forEach(element => {
            switch (element.state) {
              case '0':
                element.state = '待处理';
                break;
              case '1':
                element.state = '申诉成功';
                break;
              case '2':
                element.state = '申诉失败';
                break;
              case '3':
                element.state = '申诉取消';
                break;
            }
          });
          console.log(data);
          this.loading = false;
          this.pagination.pageSize = parseInt(data.pageSize);
          this.pagination.currentPage = parseInt(data.pageNumber);
          this.pagination.total = parseInt(data.total);
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {});
    },
    addComplaintInfo() {
      let param = {
        state: '0',
        userId: '23',
        vin: '2134234',
        plateNumber: '吉ADZ421',
        engineNumber: 'eyriuwery324234',
        plateNumberType: '0',
        paths: ['werywer'],
        memo: '',
        appealer: {},
        respondent: {},
        operator: {},
        car: {}
      };

      http
        .post(urls.vehicleMgmt.VehicleBaseInfo_addAppeal, param)
        .then(data => {
          console.log('添加申诉信息', data);
          this.getComplaintInfos();
        })
        .catch(() => {})
        .finally(() => {});
    }
  },
  created() {
    // this.addComplaintInfo();
    this.getComplaintInfos();
  }
};
</script>

<style lang="scss">
.vehicle-complaint {
}
</style>
