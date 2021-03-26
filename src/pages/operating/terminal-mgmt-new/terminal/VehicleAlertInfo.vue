<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-alert-info">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <div class="panel-title">报警详情</div>
    <el-table :data="formModel.data" height="400" style="width: 100%">
      <el-table-column prop="code" label="故障代码">
      </el-table-column>
      <el-table-column prop="happenDate" label="故障发生时间">
      </el-table-column>
      <el-table-column prop="typeName" label="故障分类">
      </el-table-column>
      <el-table-column prop="definitionCn" label="故障描述">
      </el-table-column>
    </el-table>
    <div class="panel-title">车主信息</div>
    <el-form ref="form" size="small" label-width="110px" :model="formModel">
      <el-form-item label="车主姓名">
        <div>{{formModel.owner_nickname}}</div>
      </el-form-item>
      <el-form-item label="车主电话">
        <div>{{formModel.owner_mobile}}</div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/vehicle-mgmt/VehicleAlertInfo';

export default {
  name: 'VehicleAlertInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '故障清除',
          name: 'errClear',
          type: 'success',
          auth: ['caradmin:operateDevice.manage.edit']
        }
      ],
      formModel: this.getDefaultModel()
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  created() {},
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    query() {
      service.query(
        {
          terminalId: this.itemId.id
        },
        data => {
          this.formModel = Object.assign(this.getDefaultModel(), data);

          this.$refs.form.resetFields();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    resetModel() {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        data: [],
        beginTime: '',
        endTime: '',
        owner_id: '',
        owner_mobile: '',
        owner_nickname: ''
      };
    },
    getSaveParams() {
      return {
        terminalId: this.itemId.id,
        beginTime: this.formModel.beginTime || '',
        endTime: this.formModel.endTime || ''
      };
    },

    operateHandler(name) {
      this[name]();
    },

    errClear() {
      service.errClear(
        this.getSaveParams(),
        data => {
          this.$message.success('清除成功');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    }
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__vehicle-alert-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }

  .panel-title {
    color: #606266;
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
