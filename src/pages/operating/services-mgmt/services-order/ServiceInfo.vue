<template>
  <biz-grid class="services-mgmt__service-info">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <biz-list ref="list" :height="height" :tableData="serviceDataList" style="width: 100%" :pagination="pagination">
      <el-table-column prop="sn" label="编号" width="50px">
      </el-table-column>
      <el-table-column prop="name" label="服务名称" width="50px">
      </el-table-column>
      <el-table-column prop="parentName" label="子服务名称" width="58px">
      </el-table-column>
      <el-table-column prop="price" label="服务价格" width="50px">
      </el-table-column>
      <el-table-column prop="specification" label="服务规格" width="50px" :formatter="specificationFormatter">
      </el-table-column>
      <el-table-column prop="discount" label="折扣" width="50px" :formatter="discountFormatter">
      </el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="50px">
      </el-table-column>
      <el-table-column prop="endTime" label="到期时间" width="50px">
      </el-table-column>
      <el-table-column prop="amountPaid" label="实付金额" width="50px">
      </el-table-column>
    </biz-list>
    <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
    </biz-pagination>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizPagination } from '@/components/BizTable';
import BizList from '@/components/BizTable/BizList';
import BizSaveButton from '@/components/BizSaveButton';
import BaseInfoService from '@/service/services-mgmt/services-order/baseInfo';

export default {
  name: 'ServiceInfo',
  components: {
    BizSaveButton,
    BizGrid,
    BizList,
    BizPagination
  },
  data() {
    return {
      serviceDataList: [],
      height: '720',
      operations: [
        {
          label: '刷新',
          name: 'refresh',
          type: 'primary'
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
  computed: {},
  props: {
    id: {
      type: String
    }
  },
  created() {},
  methods: {
    getDefaultParameterData() {
      return {
        id: '',
        parentName: '',
        name: '',
        price: '',
        specification: '',
        discount: '',
        beginTime: '',
        endTime: '',
        amountPaid: ''
      };
    },
    operateHandler(name) {
      this[name]();
    },
    specificationFormatter(row) {
      switch (row.specification) {
        case '1':
          return '1个月';
        case '3':
          return '3个月';
        case '6':
          return '6个月';
        case '9':
          return '9个月';
        case '12':
          return '12个月';
        case '24':
          return '24个月';
        case '36':
          return '36个月';
        default:
          break;
      }
    },
    discountFormatter(row) {
      switch (row.discount) {
        case '1.00':
          return '无';
        case '0.90':
          return '9折';
        case '0.85':
          return '8.5折';
        case '0.80':
          return '8折';
        case '0.75':
          return '7.5折';
        case '0.70':
          return '7折';
        case '0.60':
          return '6折';
        default:
          break;
      }
    },
    refresh() {
      let params = {
        businessOrderId: this.id,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      BaseInfoService.listBusinessOrderItem(
        params,
        data => {
          this.serviceDataList = data.dataList;
          this.pagination.total = Number(data.total);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  },
  watch: {
    id(Val) {
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.services-mgmt__service-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
    margin-bottom: 0px;
    .el-button--small {
      margin-left: 20px;
    }
  }
  .biz-scroller {

    .el-form {
      margin-top: 20px;
    }
  }
}
</style>
