<template>
  <biz-grid class="terminal-mgmt-communi-card-base-info">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button> -->
    <el-form :rules="rules" :model="form" :disabled="true" ref="form" label-width="125px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="SIM" prop="number">
        <el-input v-model="form.number" placeholder="请输入SIM卡号"></el-input>
      </el-form-item>
      <el-form-item label="ICCID" prop="iccid">
        <el-input v-model="form.iccid" placeholder="请输入ICCID"></el-input>
      </el-form-item>
      <el-form-item label="卡类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择卡类别">
          <el-option label="移动" value="移动"></el-option>
          <el-option label="联通" value="联通"></el-option>
          <el-option label="电信" value="电信"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商" prop="company">
        <biz-company-selector v-model="companyInfo" :queryParent="queryParent"></biz-company-selector>
      </el-form-item>
      <el-form-item label="所有者" prop="ownerName">
        <el-input v-model="form.ownerName" @focus="selectOwner" placeholder="请选择所有者"></el-input>
      </el-form-item>
      <el-form-item label="电信运营商" prop="telecomOperatorId">
        <el-select v-model="form.telecomOperatorId" placeholder="请选择电信运营商" @change="telecomOperatorIdChange">
          <el-option v-for="item in telecomOperatorList" :key="item.index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="停用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="未审核" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端设备" prop="terminalTypeName">
        <el-input v-model="form.terminalTypeName" placeholder="请输入终端设备" disabled></el-input>
      </el-form-item>
      <el-form-item label="套餐" prop="rechargePackageName">
        <el-input v-model="form.rechargePackageName" placeholder="请输入套餐" disabled></el-input>
      </el-form-item>
      <el-form-item label="余额(元)" prop="balance">
        <el-input v-model="form.balance" placeholder="请输入余额" disabled></el-input>
      </el-form-item>
      <el-form-item label="流量总量(MB)" prop="totalData">
        <el-input v-model="form.totalData" placeholder="请输入流量总量" disabled></el-input>
      </el-form-item>
      <el-form-item label="剩余流量(MB)" prop="remainingData">
        <el-input v-model="form.remainingData" placeholder="请输入剩余流量" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="createdTime">
        <el-date-picker type="date" v-model="form.createdTime" placeholder="请选择创建日期" disabled></el-date-picker>
      </el-form-item>
      <el-form-item label="激活日期" prop="createdTime">
        <el-date-picker type="date" v-model="form.activatedTime" placeholder="请选择激活日期" disabled></el-date-picker>
      </el-form-item>
      <el-form-item label="到期日期" prop="createdTime">
        <el-date-picker type="date" v-model="form.expiredTime" placeholder="请选择到期日期" disabled></el-date-picker>
      </el-form-item>
      <el-form-item label="短信可用量(平台>>卡)" prop="smsDown" label-width="160px">
        <el-input v-model="form.smsDown" placeholder="请输入短信可用量" disabled></el-input>
      </el-form-item>
      <el-form-item label="短信已用量(平台>>卡)" prop="smsDownUsed" label-width="160px">
        <el-input v-model="form.smsDownUsed" placeholder="请输入短信已用量" disabled></el-input>
      </el-form-item>
      <el-form-item label="短信可用量(卡>>平台)" prop="smsUp" label-width="160px">
        <el-input v-model="form.smsUp" placeholder="请输入短信可用量" disabled></el-input>
      </el-form-item>
      <el-form-item label="短信已用量(卡>>平台)" prop="smsUpUsed" label-width="160px">
        <el-input v-model="form.smsUpUsed" placeholder="请输入短信已用量" disabled></el-input>
      </el-form-item>
    </el-form>
    <biz-dialog-selector title="选择所有者" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'" :selectionKeys="Array(form.ownerId)"
      :loading="dialogLoading" :tableData="dialogTableData" :selectionMode="'single'" :pagination="dialogPagination" :filters="dialogFilters"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange"
      @confirmed="handleConfirmed" :isClear="false">
      <el-table-column label="用户名" prop="userName"></el-table-column>
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="手机号" prop="mobile"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizCompanySelector from '@/components/BizCompanySelector';
import BizDialogSelector from '@/components/BizDialogSelector';

import service from '@/service/communi-mgmt/communiCard';

export default {
  name: 'TerminalMgmtCommuniCardBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      // Dialog Start
      showDialog: false,
      dialogLoading: false,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      dialogFilters: [{ type: 'input', value: '', placeholder: '请输入姓名' }],
      // Dialog End
      // 是否查找父级运营商
      queryParent: false,
      loading: false,
      rules: {
        number: [
          { required: true, message: '请输入SIM卡号', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        iccid: [{ required: true, message: '请输入ICCID', trigger: 'blur' }],
        telecomOperatorId: [
          { required: true, message: '请选择电信运营商', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择卡类别', trigger: 'blur' }],
        balance: [
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        totalData: [
          {
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        // remainingData: [
        //   {
        //     pattern: /^[0-9]+\.?[0-9]*$/,
        //     message: '请输入数字',
        //     trigger: 'blur'
        //   }
        // ],
        smsDown: [
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        smsDownUsed: [
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        smsUp: [
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        smsUpUsed: [
          { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      // 运营商信息
      companyInfo: {
        id: '',
        name: ''
      },
      // 电信运营商列表
      telecomOperatorList: [],
      form: this.resetForm()
    };
  },
  components: {
    BizGrid,
    BizCompanySelector,
    BizDialogSelector
  },
  methods: {
    operate(name) {
      this[name]();
    },
    telecomOperatorIdChange() {
      this.$refs.form.clearValidate('telecomOperatorId');
    },
    resetForm() {
      return {
        number: '',
        iccid: '',
        type: '',
        ownerId: '',
        ownerName: '',
        telecomOperatorId: '',
        telecomOperatorName: '',
        companyId: '',
        companyName: '',
        status: '',
        terminalTypeName: '',
        rechargePackageName: '',
        balance: '0',
        totalData: '0',
        remainingData: '0',
        createdTime: '',
        activatedTime: '',
        expiredTime: '',
        smsDown: '0',
        smsDownUsed: '0',
        smsUp: '0',
        smsUpUsed: '0'
      };
    },
    clear() {
      this.companyInfo = {
        id: '',
        name: ''
      };
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    refresh() {
      let params = {
        id: this.itemId.id
      };
      service.queryBaseInfo(
        params,
        data => {
          this.queryParent = true;
          this.form = Object.assign(this.resetForm(), data.content);
          this.companyInfo = this.formatBaseInfo(data.content);
          this.$nextTick(() => {
            this.queryParent = false;
          });
        },
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (this.itemId.id) {
        this.update();
      } else {
        this.create();
      }
    },
    create() {
      this.loading = true;
      let params = Object.assign({}, this.form, this.telecomOperator, {
        companyId: this.companyInfo.id,
        companyName: this.companyInfo.name
      });
      service.createBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      this.loading = true;
      let params = Object.assign(
        {},
        this.form,
        this.telecomOperator,
        { companyId: this.companyInfo.id, companyName: this.companyInfo.name },
        this.itemId
      );
      service.updateBaseInfo(
        params,
        data => {
          this.loading = false;
          this.$message.success('操作成功');
        },
        ErrorData => {
          this.loading = false;
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    // 选择所有者
    selectOwner() {
      this.dialogFilters[0].value = '';
      this.showDialog = true;
    },
    // 获取所有者列表
    queryOwnerList(id) {
      this.dialogLoading = true;
      let params = {
        companyId: id,
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      service.queryOwnerList(
        params,
        data => {
          this.dialogLoading = false;
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
        },
        ErrorData => {
          this.dialogLoading = false;
        }
      );
    },
    // Dialog
    handleConfirmed(id, obj) {
      this.form.ownerId = obj[0].id;
      this.form.ownerName = obj[0].nickname;
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryOwnerList(this.companyInfo.id);
    },
    dialogPageSizeChange(value) {
      this.dialogPagination.pageSize = value;
      this.queryOwnerList(this.companyInfo.id);
    },
    dialogCurrentPageChange(value) {
      this.dialogPagination.currentPage = value;
      this.queryOwnerList(this.companyInfo.id);
    },
    // 获取电信运营商列表
    queryTeleOperator() {
      let params = {};
      service.queryTeleOperator(
        params,
        data => {
          this.telecomOperatorList = data.content;
        },
        ErrorData => {}
      );
    },
    // 格式化获取的数据
    formatBaseInfo(content) {
      return {
        id: content.companyId || '',
        name: content.companyName || ''
      };
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.queryTeleOperator();
    if (this.itemId.id) {
      this.refresh();
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (this.itemId.id) {
        this.refresh();
      }
    },
    companyInfo(newVal, oldVal) {
      this.queryOwnerList(newVal.id);
    }
  },
  computed: {
    telecomOperator() {
      let tmp = {};
      this.telecomOperatorList.map(operator => {
        if (operator.id === this.form.telecomOperatorId) {
          tmp = { telecomOperatorName: operator.name };
        }
      });
      return tmp;
    },
    stateValue() {
      switch (this.form.state) {
        case '1':
          return '已使用';
        default:
          return '未使用';
      }
    }
  }
};
</script>

<style lang="scss">
.terminal-mgmt-communi-card-base-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
}
</style>
