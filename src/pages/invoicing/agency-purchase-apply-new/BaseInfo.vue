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
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="送达地址" prop="depot">
        <el-card placeholder="请选择送达地址" @click.native="depotButtonClick">
          <div class="top" style="font-weight:bold;">
            <span>{{form.depot.consignee}}</span>
          </div>
          <div class="content">
            <span>{{form.depot.phone}}</span>
          </div>
          <div class="bottom">
            <span>{{form.depot.areaName}}{{form.depot.address}}</span>
          </div>
        </el-card>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="showDepotDialog" append-to-body custom-class="bill-dialog">
      <bill-info @selectedItem="selectedItem"></bill-info>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BillInfo from './BillInfo';
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
      areaName: '',
      address: '',
      phone: '',
      consignee: ''
    }
  };
};
export default {
  name: 'baseInfo',
  props: {
    itemId: {
      type: String
    },
    backForm: {
      type: Object
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BillInfo
  },
  data() {
    return {
      loading: false,
      showDepotDialog: false,
      dialogVisible: false,
      showBill: false,
      form: getDefaultModel(),
      totalFee: 0,
      itemDatas: [],
      forModel: this.getDetaultForm(),
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
      formOperations: [{ label: '保存', name: 'create', type: 'primary' }, { label: '取消', name: 'cancel', type: 'primary' }],
      dialogDepotTableData: [],
      dialogDepotPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogDepotFilters: [],
      rules: {
        relatePartnerName: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
        depot: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, dialogRules, callback) => {
              if (this.form.depot.consignee !== '') {
                callback();
              } else {
                callback(new Error('请选择送达地址'));
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
    handleAreaChanged(areaId) {
      this.forModel.area.id = areaId;
    },
    getDetaultForm() {
      return {
        consignee: '',
        phone: '',
        address: '',
        area: {
          id: '1568'
        },
        areaName: '',
        isDefault: '1'
      };
    },
    getDefaultModel() {
      return getDefaultModel();
    },
    cancel() {
      this.forModel = this.getDetaultForm();
      this.showBill = false;
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
    create() {
      let params = {
        clientType: '2',
        userId: this.getUser().id,
        shopId: this.getUser().shop.id,
        receiver: this.forModel
      };
      http
        .post(urls.hypermarketMgmt.receiver, params)
        .then(data => {
          this.$message.success('添加成功');
          this.showBill = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
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
        shopId: this.getUser().shop.id || '',
        pageSize: this.dialogDepotPagination.pageSize,
        pageNumber: this.dialogDepotPagination.currentPage,
        userId: this.getUser().id
      };
    },
    getDepotList() {
      http
        .get('admin/toB/receiver/list.jhtml', this.getDepotListParams())
        .then(data => {
          this.dialogDepotTableData = data.receivers;
          for (const item of data.receivers) {
            if (item.isDefault === '1') {
              this.form.depot.id = item.id;
              this.form.depot.areaName = item.areaName;
              this.form.depot.address = item.address;
              this.form.depot.phone = item.phone;
              this.form.depot.consignee = item.consignee;
            }
          }
          this.dialogDepotPagination.total = Number(data.receivers.length);
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
    selectedItem(row) {
      this.form.depot.id = row.id;
      this.form.depot.areaName = row.areaName;
      this.form.depot.address = row.address;
      this.form.depot.phone = row.phone;
      this.form.depot.consignee = row.consignee;
      this.$refs.form.clearValidate('depot');
      this.showDepotDialog = false;
    },
    query() {
      this.form = this.backForm;
    }
  }
};
</script>

<style lang="scss">
.apply-base-info {
  .el-card__body {
    min-height: 50px;
  }
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
