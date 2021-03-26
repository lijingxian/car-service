<template>
  <biz-grid class="alloted-info">
    <!-- <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button> -->
    <biz-header :operations="operations" @operate="operate" v-if="isEdit">
    </biz-header>
    <el-form ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :rules="rules" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="调出仓库" prop="depotOut">
        <el-select v-model="form.depotOut.id" placeholder="" @change="depotOutChange">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="shopDepot in shopDepotsOut" :label="shopDepot.depotName" :value="shopDepot.depotId"
            :key="shopDepot.depotId" v-show="shopDepot.depotId!==form.depotIn.id" :disabled="shopDepot.enabled==='0'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调入仓库" prop="depotIn">
        <el-select v-model="form.depotIn.id" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="(shopDepot,index) in shopDepots" :label="shopDepot.name" :value="shopDepot.id" :key="index"
            v-show="shopDepot.id!==form.depotOut.id" :disabled="shopDepot.enabled==='0'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可调拨数量" prop="stockAmount">
        <el-input v-model="form.stockAmount" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="调拨数量" prop="quantity">
        <el-input v-model="form.quantity"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input :value="form.creator||getUser().name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="确认人" prop="modifier">
        <el-input :value="form.auditorName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input :value="form.state==='1'?'已确认':'未确认'" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="createDate">
        <el-input :value="form.createDate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input :value="form.remarks" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import urls from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import date from '@/utils/date.js';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    dataModel: {
      type: Object
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
    BizHeader
  },
  data() {
    let validateDepotOut = (rule, value, callback) => {
      if (!this.form.depotOut.id) {
        callback(new Error('请选择调出仓库'));
      } else {
        callback();
      }
    };
    let validateDepotIn = (rule, value, callback) => {
      if (!this.form.depotIn.id) {
        callback(new Error('请选择调入仓库'));
      } else {
        callback();
      }
    };
    let validateQuantity = (rule, value, callback) => {
      if (Number(this.form.quantity) > Number(this.form.stockAmount)) {
        callback(new Error('调拨数量大于可调拨数量'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      // 用户信息
      form: this.getDefaultForm(),
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      shopDepots: [],
      shopDepotsOut: [],
      showDialog: false,
      // 红字错误提示
      errorMobile: '',
      errorRole: '',
      errUserName: '',
      errName: '',
      rules: {
        quantity: [
          { required: true, message: '请输入调拨数量', trigger: 'blur' },
          { validator: validateQuantity, trigger: ['blur', 'change'] }
        ],
        depotOut: [
          { required: true, message: '请选择调出仓库', trigger: 'change' },
          { validator: validateDepotOut, trigger: 'change' }
        ],
        depotIn: [
          { required: true, message: '请选择调入仓库', trigger: 'change' },
          { validator: validateDepotIn, trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    itemId: {
      handler: function(nVal) {
        if (nVal) {
          this.query();
        } else {
          this.form = this.getDefaultForm();
        }
      }
    }
  },
  created() {
    this.getDepots();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    depotOutChange(val) {
      this.shopDepotsOut.map(item => {
        if (item.depotId === val) {
          this.form.stockAmount = item.stockAmount;
        }
      });
    },
    getDepots() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        pageSize: '1000',
        pageNumber: 1
      };
      http
        .get('/admin/invoicing/stock/shopDepots.jhtml', params)
        .then(data => {
          this.shopDepots = data.dataList;
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
    getDefaultForm() {
      return {
        sn: '',
        type: '1',
        depotIn: {
          id: '',
          name: ''
        },
        depotOut: {
          id: '',
          name: ''
        },
        relateDepotInBill: {
          id: '',
          name: ''
        },
        relateDepotOutBill: {
          id: '',
          name: ''
        },
        state: '1',
        items: [],
        stockAmount: '',
        quantity: '',
        remarks: ''
      };
    },
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    query() {
      if (this.itemId) {
        this.loading = true;
        http
          .get(urls.invoicing.allottedMgmt.products, { productId: this.itemId })
          .then(data => {
            this.loading = false;
            this.shopDepotsOut = data.dataList;
            this.form.quantity = '';
            this.form.createDate = date.dateTimeConverter(new Date());
          })
          .catch(errData => {
            this.loading = false;
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          });
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.form.items = [];
          this.dataModel.quantity = this.form.quantity;
          this.form.items.push(this.dataModel);
          http
            .post(urls.invoicing.allottedMgmt.depotTransfer, this.form)
            .then(data => {
              this.loading = false;
              this.$message.success('保存成功');
              this.$emit('operationSuccess');
            })
            .catch(errData => {
              this.loading = false;
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            });
        }
      });
    },
    dialogOperate(name) {}
  }
};
</script>

<style lang="scss">
.alloted-info {
  .el-form {
    overflow: auto;
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .biz-header {
    float: right;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-col .el-input {
    width: 80%;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
