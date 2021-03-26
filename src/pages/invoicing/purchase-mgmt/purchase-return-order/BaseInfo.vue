<template>
  <biz-grid class="apply-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="编号" prop="sn" v-if="itemId">
        <el-input v-model="form.sn" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="relatePartnerName" class="isRequired">
        <el-input v-model="form.relatePartnerName" placeholder="请选择供应商" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="优惠率(%)" prop="discountRate">
        <el-input v-model="form.discountRate" @change="rateChange"></el-input>
      </el-form-item>
      <el-form-item label="优惠金额(元)" prop="discontFee">
        <el-input v-model="form.discontFee" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="总金额(元)" prop="totalFee">
        <el-input v-model="form.totalFee" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="申请人" prop="applierName">
        <el-input v-model="form.applierName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="采购" prop="purchaserId">
        <el-select v-model="form.purchaserId" placeholder="请选择采购">
          <el-option v-for="item in purchaseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="state">
        <el-input :value="stateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="入库状态" prop="depotState">
        <el-input :value="depotStateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="结算状态" prop="settleState">
        <el-input :value="settleStateFormatter" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
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
    settleState: '',
    depotState: '',
    state: '',
    id: '',
    createDate: '',
    shopId: '',
    shop: {},
    purchaserId: '',
    purchaserName: ''
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
    }
  },
  components: {
    BizGrid,
    BizSaveButton
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
      form: getDefaultModel(),
      totalFee: 0,
      itemDatas: [],
      purchaseList: [],
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
        discountRate: [{ required: true, trigger: 'blur', validator: isDiscountRateError }],
        purchaserId: [{ required: true, message: '请选择采购', trigger: 'blur' }]
      }
    };
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case '0':
          return '已提交';
        case '1':
          return '已确认';
        case '2':
          return '处理中';
        case '3':
          return '已完成';
        case '4':
          return '已作废';
        default:
          return '--';
      }
    },
    depotStateFormatter() {
      switch (this.form.depotState) {
        case '0':
          return '未完成';
        case '1':
          return '部分完成';
        case '2':
          return '已完成';
        default:
          return '--';
      }
    },
    settleStateFormatter() {
      switch (this.form.settleState) {
        case '0':
          return '未结清';
        case '1':
          return '部分结清';
        case '2':
          return '已结清';
        default:
          return '--';
      }
    }
  },
  created() {
    this.queryRoleList();
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
    rateChange(val) {
      this.form.discontFee = this.totalFee * (Number(val) / 100);
      this.form.totalFee = this.totalFee - Number(this.form.discontFee);
    },
    queryPurchase() {
      this.loading = true;
      http
        .get(urls.invoicing.purchaseReturnOrderMgmt.shopPurchaseReturnOrder, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId
        })
        .then(data => {
          this.loading = false;
          data.data.purchaserName = this.form.purchaserName;
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
    queryRoleList() {
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['21', '22']
        })
        .then(data => {
          for (const item of data.dataList) {
            this.form.purchaserId = item.id;
            this.form.purchaserName = item.name;
            this.purchaseList.push({ name: this.form.purchaserName, id: this.form.purchaserId });
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
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
        purchaserId: this.form.purchaserId,
        purchaserName: this.form.purchaserName,
        discountRate: this.form.discountRate,
        discontFee: this.form.discontFee,
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
            this.$emit('operationSuccess');
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          http
            .put(urls.invoicing.purchaseReturnOrderMgmt.shopPurchaseReturnOrder, this.getSaveParams())
            .then(success)
            .catch(failed)
            .finally(final);
        } else {
          return false;
        }
      });
    },
    setReturnOrderItems(val) {
      this.itemDatas = val;
      let total = 0;
      val.map(item => {
        total = total + Number(item.amount) * Number(item.price);
      });
      this.totalFee = total;
      this.form.discontFee = total * this.form.discountRate;
      this.form.totalFee = total - this.form.discontFee;
    }
  }
};
</script>

<style lang="scss">
.apply-base-info {
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
