<template>
  <biz-grid class="member-point-info" v-loading="loading">
    <biz-header :operations="operations" @operate="handleOperate" v-if="isEdit">
    </biz-header>
    <div class="header_bean" style="top:50px">
      <div>当前等级：{{level}}</div>
      <div> 当前积分：{{totalPoint}}</div>
    </div>
    <el-table :data="tableData" height="100%" style="margin-top:30px" @selection-change="handleSelectionChange" size="small">
      <el-table-column label="来源" prop="type" :formatter="dateConverter"></el-table-column>
      <el-table-column label="数量" prop="pointCount"></el-table-column>
      <el-table-column label="日期" prop="happenData" width="150px"></el-table-column>
      <el-table-column label="备注" prop="memo"></el-table-column>
    </el-table>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog :visible.sync="showFormAdd" title="充值" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="当前积分" prop="totalPoint">
          <el-input v-model="formModel.currentPoint" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="当前等级" prop="level">
          <el-input v-model="formModel.level" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="调整积分" prop="integral">
          <el-input v-model="formModel.integral" maxlength="100" @input="updateAddGrade" placeholder="输入充值数量，如500"></el-input>
        </el-form-item>
        <el-form-item label="调整后等级" prop="aflevel">
          <el-input v-model="aflevel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.memo" maxlength="100" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="handleOperate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
    <el-dialog :visible.sync="showFormConsumption" title="消费" center append-to-body width="500px" v-loading="formLoading">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
        <el-form-item label="当前积分" prop="totalPoint">
          <el-input v-model="formModel.currentPoint" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="当前等级" prop="level">
          <el-input v-model="formModel.level" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="调整积分" prop="integral">
          <el-input v-model="formModel.integral" maxlength="100" @input="updateConGrade" placeholder="输入消费数量，如500"></el-input>
        </el-form-item>
        <el-form-item label="调整后等级" prop="aflevel">
          <el-input v-model="aflevel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.memo" maxlength="100" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperationsCon" @operate="handleOperateCon" style="margin-right: 0;"></biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
export default {
  name: 'MemberBaseInfo',
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
  components: {
    BizHeader,
    BizGrid,
    BizSaveButton,
    BizPagination
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      showFormAdd: false,
      showFormConsumption: false,
      level: '',
      aflevel: '',
      totalPoint: '',
      // 用户信息
      formModel: {
        integral: '',
        currentPoint: '',
        level: '',
        aflevel: '',
        memo: ''
      },
      operations: [
        {
          label: '充值',
          name: 'add',
          type: 'primary'
        },
        {
          label: '消费',
          name: 'consumption',
          type: 'primary'
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelFormAdd'
        },
        {
          label: '保存',
          name: 'saveAdd',
          type: 'primary'
        }
      ],
      formOperationsCon: [
        {
          label: '取消',
          name: 'cancelFormCon'
        },
        {
          label: '保存',
          name: 'saveCon',
          type: 'primary'
        }
      ],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      rules: {
        integral: [
          { required: true, message: '请输入调整积分', trigger: 'blur' },
          { pattern: /^\+?[1-9][0-9]*$/, message: '请输入大于0的正整数', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    if (this.itemId.id) this.getList();
  },
  watch: {
    'itemId.id'(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    dateConverter(row) {
      switch (row.type) {
        case '0':
          return '消费';
        case '1':
          return '充值';
        case '2':
          return '店铺调整';
        case '3':
          return '活动';
        case '4':
          return '关怀';
      }
      return '';
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      service.getIntegralList(
        {
          id: this.itemId.id || '',
          shopId: window.top.SHOP_ID || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        },
        data => {
          this.tableData = data.content;
          this.level = data.level;
          this.totalPoint = data.totalPoint;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleOperate(name) {
      this[name]();
    },
    handleOperateCon(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    saveAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          service.createPoint(
            {
              id: this.itemId.id,
              shopId: window.top.SHOP_ID || '',
              integral: this.formModel.integral,
              memo: this.formModel.memo
            },
            data => {
              this.$message.success('保存成功');
              this.loading = false;
              this.getList();
              this.$emit('operationSuccess');
              this.showFormAdd = false;
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        }
      });
    },
    saveCon() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          service.createPoint(
            {
              id: this.itemId.id,
              shopId: window.top.SHOP_ID || '',
              integral: (-this.formModel.integral).toString(),
              memo: this.formModel.memo
            },
            data => {
              this.$message.success('保存成功');
              this.loading = false;
              this.getList();
              this.$emit('operationSuccess');
              this.showFormConsumption = false;
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              this.loading = false;
            }
          );
        }
      });
    },
    add() {
      service.getlistUpgrade(
        {
          id: this.itemId.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {};
          this.aflevel = '';
          this.formModel.level = data.level;
          this.formModel.currentPoint = data.totalPoint;
          this.loading = false;
          this.showFormAdd = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    consumption() {
      service.getlistUpgrade(
        {
          id: this.itemId.id,
          shopId: window.top.SHOP_ID || ''
        },
        data => {
          this.formModel = {};
          this.aflevel = '';
          this.formModel.level = data.level;
          this.formModel.currentPoint = data.totalPoint;
          this.loading = false;
          this.showFormConsumption = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    updateAddGrade(val) {
      service.updateGrade(
        {
          memberCardId: this.itemId.id || '',
          shopId: window.top.SHOP_ID || '',
          integral: val
        },
        data => {
          this.aflevel = data.level;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    updateConGrade(val) {
      service.updateGrade(
        {
          memberCardId: this.itemId.id || '',
          shopId: window.top.SHOP_ID || '',
          integral: (-val).toString()
        },
        data => {
          this.aflevel = data.level;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    cancelFormAdd() {
      this.showFormAdd = false;
    },
    cancelFormCon() {
      this.showFormConsumption = false;
    }
  }
};
</script>

<style lang="scss">
.member-point-info {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
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
  .header_bean {
    position: absolute;
    left: 0px;
    top: 20px;
    color: #606266;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    div {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 150px;
      text-align: left;
      white-space: nowrap;
    }
  }
}
</style>
