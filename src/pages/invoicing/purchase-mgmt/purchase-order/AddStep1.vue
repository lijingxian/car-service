<template>
  <biz-grid class="add-step-1">
    <div slot="top">
      <div class="header-step">
        <div class="step-1">
          <span>①</span>
          <span>选择供应商</span>
          <span>></span>
        </div>
        <div class="step-2">
          <span>②</span>
          <span>选择商品</span>
          <span>></span>
        </div>
        <div class="step-3">
          <span>③</span>
          <span>确认订单</span>
        </div>
      </div>
    </div>
    <biz-save-button slot="bottom" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="供应商" prop="relatePartnerName">
        <el-input v-model="form.relatePartnerName" placeholder="请选择供应商" :disabled="form.state === '0' || !itemId?false:true" @focus="showDialog = true;"></el-input>
      </el-form-item>
    </el-form>
    <biz-dialog-selector
      title="选择供应商"
      :visibility.sync="showDialog"
      :appendToBody="true"
      :tableData="dialogTableData"
      :pagination="dialogPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogFilters"
      @open="opened"
      @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="supplierDialog"
    >
      <el-table-column label="供应商名称" prop="name"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

// 获取默认表单项
const getDefaultModel = () => {
  return {
    relatePartnerId: '',
    relatePartnerName: '',
    relatePartnerType: '',
    totalFee: '',
    billType: '',
    sn: '',
    applierId: '',
    applierName: '',
    relateBill: '',
    relateBillType: '',
    discountRate: '0',
    discontFee: '',
    auditLevel: '',
    state: '',
    id: '',
    createDate: '',
    shopId: '',
    shop: {}
  };
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isPend: {
      type: Boolean,
      default() {
        return false;
      }
    },
    step1Data: {
      type: Object
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogVisible: false,
      form: getDefaultModel(),
      totalFee: 0,
      itemDatas: [],
      operations: [
        {
          label: '确定',
          name: 'save',
          type: 'primary',
          auth: ['admin:purchaseOrder.edit']
        }
      ],
      shopList: [],
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入供应商名称',
          name: 'searchValue',
          value: ''
        }
      ],
      rules: {
        relatePartnerName: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }]
      }
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    initModel(model) {
      if (model) {
        this.form = Object.assign(this.getDefaultModel(), model);
        this.totalFee = Number(model.totalFee) + Number(model.discontFee);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    resetModel() {
      this.form = this.getDefaultModel();
    },
    getDefaultModel() {
      return getDefaultModel();
    },

    getSaveParams() {
      return {
        id: this.form.id,
        relatePartnerId: this.form.relatePartnerId,
        totalFee: this.form.totalFee,
        discountRate: this.form.discountRate,
        discontFee: this.form.discontFee,
        remark: this.form.remark,
        shopId: window.top.SHOP_ID || ''
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.$emit('step1Confirm', this.form);
        } else {
          return false;
        }
      });
    },
    opened() {
      this.dialogTableData = [];
      this.getSupplier();
    },
    getSupplier() {
      this.loading = true;
      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0'
      };
      http
        .get(urls.hypermarketMgmt.cooperationInfos, params)
        .then(data => {
          this.loading = false;
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(error => {
          this.loading = false;
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getSupplier();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getSupplier();
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getSupplier();
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.relatePartnerName = selections[0].name;
      this.form.relatePartnerId = selections[0].id;
    },
    query() {
      this.form = this.step1Data;
    }
  }
};
</script>

<style lang="scss">
.add-step-1 {
  .header-step {
    display: flex;
    background: #e1e1e1;
    padding: 10px;
    margin: 20px 0px;
    color: #666666;
    justify-content: space-around;
    .step-1 {
      display: flex;
      justify-content: space-around;
      color: #000000;
      width: 160px;
    }
    .step-2 {
      display: flex;
      justify-content: space-around;
      width: 160px;
    }
    .step-3 {
      display: flex;
      justify-content: space-around;
      width: 160px;
    }
  }
}
</style>
