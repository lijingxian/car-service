<template>
  <biz-grid class="return-apply-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="编号" prop="sn" v-if="itemId">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="relatePartnerId" class="isRequired">
        <el-select v-model="form.relatePartnerId" placeholder="请选择供应商" style="width: 100%;" @change="relatePartnerNameChange"
          :disabled="form.state === '0' || !itemId?false:true">
          <el-option v-for="(item,index) in relatePartnerList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联的采购入库单" prop="relateBillSn">
        <el-input v-model="form.relateBillSn" :disabled="form.relatePartnerId === '' || isPend" placeholder="请选择关联的采购入库单" @focus="showDialog"></el-input>
      </el-form-item>
      <el-form-item label="优惠率(%)" prop="discountRate">
        <el-input v-model="form.discountRate" @change="rateChange" :disabled="isPend"></el-input>
      </el-form-item>
      <el-form-item label="优惠金额(元)" prop="discontFee" v-if="itemId">
        <el-input v-model="form.discontFee" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="总金额(元)" prop="totalFee" v-if="itemId">
        <el-input v-model="form.totalFee" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="applierName" v-if="itemId">
        <el-input v-model="form.applierName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state" v-if="itemId">
        <el-input :value="stateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate" v-if="itemId">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <biz-dialog-selector title="选择关联入库单" :visibility.sync="showRelateDialog" :appendToBody="true" :tableData="dialogTableData"
      :pagination="dialogPagination" :selectionMode="'single'" :isClear="false" :filters="dialogFilters" @open="opened"
      @confirmed="handleConfirmed" @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" class="depotInDialog">
      <el-table-column label="编号" prop="sn" min-width="200"></el-table-column>
      <el-table-column label="商品信息" min-width="300">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between">
            <div style="width:100%;margin-right:30px">
              <div v-for="productItem in scope.row.itemDatas" :key="productItem.id" class="product-info" style="display:flex;width:100%;">
                <div class="wrapper">
                  <div class="titleClass" style="text-overflow:ellipsis;overflow:hidden;width: 250px;white-space:nowrap;" :title="productItem.productName">{{productItem.productName}}</div>
                </div>
                <div class="info-bottom">
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*{{productItem.amount}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="往来方" prop="relatePartnerName" min-width="200"></el-table-column>
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
    relateBillSn: '',
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
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector
  },
  data() {
    const isDiscountRateError = (rule, rules, callback) => {
      if (this.form.discountRate === '') {
        callback(new Error('请输入优惠率'));
      }
      if (Number(this.form.discountRate) >= 0 && Number(this.form.discountRate) <= 100) {
        callback();
      } else {
        callback(new Error('优惠率必须为0~100的数字值'));
      }
    };
    return {
      loading: false,
      showRelateDialog: false,
      dialogVisible: false,
      relatePartnerList: [],
      relateBillList: [],
      form: getDefaultModel(),
      totalFee: 0,
      itemDatas: [],
      operations: [
        {
          label: '保存',
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
      rules: {
        relatePartnerId: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
        discountRate: [{ required: true, trigger: 'blur', validator: isDiscountRateError }],
        relateBillSn: [{ required: true, message: '请选择关联的采购入库单', trigger: 'blur' }]
      }
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        case '2':
          return '审核中';
        case '3':
          return '已通过';
        case '4':
          return '已驳回';
        default:
          return '--';
      }
    }
  },
  created() {
    this.getSupplier();
  },
  watch: {
    itemId(val) {
      this.form = this.getDefaultModel();
      this.totalFee = '';
      this.queryPurchase();
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    showDialog() {
      this.showRelateDialog = true;
      if (this.form.relateBillSn) {
        this.$refs.form.clearValidate('relateBillSn');
      }
    },
    initModel(model) {
      if (model) {
        this.form = Object.assign(this.getDefaultModel(), model);
        this.totalFee = Number(model.totalFee) + Number(model.discontFee);
      } else {
        this.resetModel();
      }
    },
    resetModel() {
      this.form = this.getDefaultModel();
      this.$refs.form.resetFields();
    },
    rateChange(val) {
      this.form.discontFee = this.totalFee * (Number(val) / 100);
      this.form.totalFee = this.totalFee - Number(this.form.discontFee);
    },
    queryPurchase() {
      this.loading = true;
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.shopPurchaseReturnApply, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId
        })
        .then(data => {
          this.loading = false;
          // 列表
          this.initModel(data.data);
        })
        .catch(errData => {
          this.loading = false;
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
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
        relateBill: this.form.relateBill,
        relateBillSn: this.form.relateBillSn,
        remark: this.form.remark,
        shopId: window.top.SHOP_ID || ''
      };
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('保存成功');
            if (!this.form.id) {
              this.form.id = data.id;
              this.$emit('setBaseItems', this.form.id);
            }
            this.$emit('operationSuccess', this.form.id);
          };
          const failed = errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          if (this.form.id) {
            http
              .put(urls.invoicing.purchaseReturnApplyMgmt.shopPurchaseReturnApply, this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          } else {
            http
              .post(urls.invoicing.purchaseReturnApplyMgmt.shopPurchaseReturnApply, this.getSaveParams())
              .then(success)
              .catch(failed)
              .finally(final);
          }
        } else {
          return false;
        }
      });
    },
    opened() {
      this.dialogTableData = [];
      this.getSupplierDepotIn(this.form.relatePartnerId);
    },
    getSupplier() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.relateSupplier, params)
        .then(data => {
          this.relatePartnerList = data.dataList;
        })
        .catch(ErrorData => {
          if (ErrorData.errorMessage !== '店铺不存在') {
            this.$message.warning(ErrorData.errorMessage);
            console.log('ERR_REFRESH: ', ErrorData);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },
    getSupplierDepotIn(relatePartnerId) {
      let params = {
        shopId: window.top.SHOP_ID || '',
        supplierId: relatePartnerId
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.supplierDepotIn, params)
        .then(data => {
          this.dialogTableData = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    relatePartnerNameChange(val) {
      for (const item of this.relatePartnerList) {
        if (val === item.id) {
          this.form.relatePartnerId = item.id;
          this.form.relatePartnerName = item.name;
          this.form.relateBill = '';
        }
      }
    },
    setOrderItems(val) {
      this.itemDatas = val;
      let total = 0;
      val.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      this.totalFee = total;
      this.form.discontFee = total * (this.form.discountRate / 100);
      this.form.totalFee = total - this.form.discontFee;
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getSupplierDepotIn(this.form.relatePartnerId);
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getSupplierDepotIn(this.form.relatePartnerId);
    },
    dialogFilterDataChange(val) {
      this.dialogFilters = val;
      this.dialogPagination.currentPage = 1;
      this.getSupplierDepotIn(this.form.relatePartnerId);
    },
    getDepotInDiscountRate(id) {
      let params = {
        id: id
      };
      http
        .get(urls.invoicing.purchaseReturnApplyMgmt.depotInDiscountRate, params)
        .then(data => {
          this.form.discountRate = data.data.discountRate;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.relateBill = selections[0].id;
      this.form.relateBillSn = selections[0].sn;
      this.getDepotInDiscountRate(this.form.relateBill);
      this.$refs.form.clearValidate('relateBillSn');
    }
  }
};
</script>

<style lang="scss">
.return-apply-base-info {
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
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
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
}
</style>
