<template>
  <biz-grid class="apply-base-info">
    <div slot="top">
      <div class="header-step">
        <div class="step-1">
          <span>①</span>
          <span>填写基本信息</span>
          <span>></span>
        </div>
        <div class="step-2">
          <span>②</span>
          <span>选择商品</span>
        </div>
      </div>
    </div>
    <biz-save-button slot="bottom" :operations="operations" @operate="operate"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="供应商" prop="relatePartnerName">
        <el-input v-model="form.relatePartnerName" placeholder="请选择供应商" @focus="showDialog = true;"></el-input>
      </el-form-item>
      <el-form-item label="送达仓库" prop="depot">
        <el-card placeholder="请选择送达仓库" @click.native="depotButtonClick">
          <div class="top" style="font-weight:bold;">
            <span>{{form.depot.name}}</span>
          </div>
          <div class="content">
            <span style="margin-right:15px;">{{form.depot.contactor}}</span>
            <span>{{form.depot.phone}}</span>
          </div>
          <div class="bottom">
            <span>{{form.depot.address}}</span>
          </div>
        </el-card>
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
      <el-table-column label="供应商名称" width="200px" prop="name"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector
      title="选择仓库"
      :visibility.sync="showDepotDialog"
      :appendToBody="true"
      :tableData="dialogDepotTableData"
      :pagination="dialogDepotPagination"
      :selectionMode="'single'"
      :isClear="false"
      :filters="dialogDepotFilters"
      @open="openedDepot"
      @confirmed="handleDepotConfirmed"
      @filterDataChange="dialogDepotFilterDataChange"
      @pageSizeChange="dialogDepotPageSizeChange"
      @currentPageChange="dialogDepotCurrentPageChange"
      class="depotDialog"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="联系人" prop="contactor"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
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
    shop: {},
    depot: {
      id: '',
      name: '',
      address: '',
      phone: '',
      contactor: ''
    }
  };
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
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
      showDepotDialog: false,
      dialogVisible: false,
      form: getDefaultModel(),
      totalFee: 0,
      itemDatas: [],
      operations: [
        {
          label: '确定',
          name: 'save',
          type: 'primary'
        }
      ],
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
      dialogDepotTableData: [],
      dialogDepotPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogDepotFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入仓库名称',
          name: 'searchValue',
          value: ''
        }
      ],
      rules: {
        relatePartnerName: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
        depot: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, dialogRules, callback) => {
              if (this.form.depot.name !== '') {
                callback();
              } else {
                callback(new Error('请选择送达仓库'));
              }
            }
          }
        ]
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
    getDefaultModel() {
      return getDefaultModel();
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
        cooperationType: '0',
        state: '1'
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
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
    depotButtonClick() {
      this.openedDepot();
    },
    openedDepot() {
      this.dialogDepotTableData = [];
      this.getDepotList();
      this.showDepotDialog = true;
    },
    getDepotListParams() {
      return {
        shopId: window.top.SHOP_ID || '',
        state: '1',
        pageSize: this.dialogDepotPagination.pageSize,
        pageNumber: this.dialogDepotPagination.currentPage,
        name: this.dialogDepotFilters[0].value
      };
    },
    getDepotList() {
      http
        .get(urls.invoicing.storeHouseMgmt.shopDepotList, this.getDepotListParams())
        .then(data => {
          this.dialogDepotTableData = data.dataList;
          this.dialogDepotPagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
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
    dialogDepotPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getSupplier();
    },
    dialogDepotCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getSupplier();
    },
    dialogDepotFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getSupplier();
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.relatePartnerName = selections[0].name;
      this.form.relatePartnerId = selections[0].id;
    },
    handleDepotConfirmed(selectionKeys, selections) {
      this.form.depot.id = selections[0].id;
      this.form.depot.name = selections[0].name;
      this.form.depot.address = selections[0].address;
      this.form.depot.phone = selections[0].phone;
      this.form.depot.contactor = selections[0].contactor;
      this.$refs.form.clearValidate('depot');
    }
  }
};
</script>

<style lang="scss">
.apply-base-info {
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
  }
  .el-collapse-item__header.is-active {
    background-color: #fef3e5;
  }
  .el-collapse-item__wrap {
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
  .title-class {
    display: flex;
    justify-content: space-between;
    .title-class-one {
      color: #ff7300;
      .el-badge__content.is-fixed.is-dot {
        top: 18px;
        right: 0px;
      }
    }
    .title-class-two {
      color: red;
      font-size: 10px;
      padding-right: 10px;
    }
  }

  .el-form-item__content .el-select {
    width: 100%;
  }
  .biz-grid__content .biz-scroller {
    padding-left: 20px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .imgUpload {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 58px;
      height: 58px;
    }
    .el-upload--picture-card {
      width: 58px;
      height: 58px;
      line-height: 68px;
    }
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card__body {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
