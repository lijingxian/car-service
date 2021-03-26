<template>
  <biz-grid class="add-product-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form
      ref="productDataForm"
      label-width="140px"
      size="small"
      v-loading="loading"
      v-model="form"
      :inline-message="true"
    >
      <el-form-item label="税率">
        <el-select v-model="form.taxRate" placeholder="请选择税率" allow-create filterable>
          <el-option v-for="item of taxList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-collapse v-model="activeTab">
          <el-collapse-item title="采购价格" name="baseInfo">
            <!-- <el-form-item label="计算标准">
              <el-radio-group v-model="form.type">
                <el-radio label="0">以不含税单价为准</el-radio>
                <el-radio label="0">以含税单价为准</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <biz-header :operations="tableOperations" @operate="operate" v-if="isEdit"></biz-header>
            <el-table :data="tableData" height="300" style="margin-top:30px" highlight-current-row tooltip-effect="dark" stripe size="small">
              <el-table-column label="供应商" prop="cooperationName"></el-table-column>
              <el-table-column label="不含税单价" prop="beanCount">
                <template slot-scope="scope">
                  {{scope.row.priceWithoutTax}}
                </template>
              </el-table-column>
              <el-table-column label="税率" prop="taxRate" width="80px">
                <template slot-scope="scope">
                  {{scope.row.taxRate||form.taxRate}}
                </template>
              </el-table-column>
              <el-table-column label="含税单价" prop="price">
                <template slot-scope="scope">
                  {{(scope.row.priceWithoutTax * (1 + Number(form.taxRate))).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="text"  @click.stop="edit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="text"  @click.stop="del(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="销售价格" name="saleInfo">
            <!-- <el-form-item label="计算标准">
              <el-radio-group v-model="form.saleType">
                <el-radio label="0">以不含税单价为准</el-radio>
                <el-radio label="0">以含税单价为准</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="零售价(含税)" prop="price">
              <el-input v-model="form.price" placeholder="零售价(含税)"></el-input>
            </el-form-item>
            <el-form-item label="零售价(不含税)" prop="priceNoTax">
              <el-input v-model="priceNoTax" placeholder="零售价(不含税)" disabled></el-input>
            </el-form-item>
            <el-form-item label="一级代理商(含税)" prop="wholesalePrice">
              <el-input v-model="form.wholesalePrice" placeholder="一级代理商(含税)"></el-input>
            </el-form-item>
            <el-form-item label="一级代理商(不含税)" prop="wholesalePriceNoTax">
              <el-input v-model="wholesalePriceNoTax" placeholder="一级代理商(不含税)" disabled></el-input>
            </el-form-item>
            <el-form-item label="二级代理商(含税)" prop="agent2Price">
              <el-input v-model="form.agent2Price" placeholder="二级代理商(含税)"></el-input>
            </el-form-item>
            <el-form-item label="二级代理商(不含税)" prop="agent2PriceNoTax">
              <el-input v-model="agent2PriceNoTax" placeholder="二级代理商(不含税)" disabled></el-input>
            </el-form-item>
            <el-form-item label="三级代理商(含税)" prop="agent3Price">
              <el-input v-model="form.agent3Price" placeholder="二级代理商(含税)"></el-input>
            </el-form-item>
            <el-form-item label="三级代理商(不含税)" prop="agent3PriceNoTax">
              <el-input v-model="agent3PriceNoTax" placeholder="二级代理商(不含税)" disabled></el-input>
            </el-form-item>
          </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-dialog class="box-card" :visible.sync="showForm" center append-to-body width="500px">
      <el-form ref="form" size="small" label-width="110px" :model="formModel" :inline-message="true">
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="formModel.supplier" placeholder="供应商">
            <el-option v-for="supplier in supplierList" :key="supplier.id" :label="supplier.name" :value="supplier.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购价(含税)" prop="number">
          <el-input v-model="formModel.price" placeholder="采购价(含税)" @change="priceChange"></el-input>
        </el-form-item>
        <el-form-item label="采购价(不含税)" prop="price">
          <el-input v-model="formModel.priceNoTaxModel" placeholder="采购价(不含税)" @change="priceNoTaxChange"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="formOperations" @operate="operate" style="margin-right: 0;">
      </biz-save-button>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizHeader } from '@/components/BizTable';
import http from '@/common/http';
// import urls from '@/common/urls';
export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
    return {
      openV: false,
      showForm: false,
      loading: false,
      id: '',
      tableData: [],
      supplierList: [],
      form: {
        saleType: '0',
        type: '0',
        price: '',
        wholesalePrice: '',
        agent2Price: '',
        agent3Price: '',
        taxRate: '0.13',
        purchasePrices: []
      },
      formModel: {
        price: '',
        supplier: '',
        priceNoTaxModel: ''
      },
      activeTab: ['baseInfo'],
      taxList: [{ name: '13%', id: '0.13' }, { name: '9%', id: '0.09' }, { name: '6%', id: '0.06' }],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'saveForm',
          type: 'primary'
        }
      ],
      tableOperations: [
        {
          label: '添加',
          name: 'add',
          type: 'primary',
          disabled: false
        }
        // {
        //   label: '删除',
        //   name: 'del',
        //   type: '',
        //   disabled: true
        // }
      ]
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizHeader
  },
  props: {
    itemId: {
      type: String,
      default: ''
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  watch: {
    tabSelection(val) {
      this.query();
    },
    itemId(nVal, oVal) {
      this.query();
    }
  },
  created() {
    this.getSupplierList();
  },
  computed: {
    priceNoTax() {
      console.log(Number(this.form.price) * Number(this.form.taxRate));
      return (this.form.price / (1 + Number(this.form.taxRate))).toFixed(2);
    },
    wholesalePriceNoTax() {
      return (this.form.wholesalePrice / (1 + Number(this.form.taxRate))).toFixed(2);
    },
    agent2PriceNoTax() {
      return (this.form.agent2Price / (1 + Number(this.form.taxRate))).toFixed(2);
    },
    agent3PriceNoTax() {
      return (this.form.agent3Price / (1 + Number(this.form.taxRate))).toFixed(2);
    },
    priceNoTaxModel() {
      return (this.formModel.price / (1 + Number(this.form.taxRate))).toFixed(2);
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    priceNoTaxChange() {
      this.formModel.price = (this.formModel.priceNoTaxModel * (1 + Number(this.form.taxRate))).toFixed(2);
    },
    priceChange() {
      this.formModel.priceNoTaxModel = (this.formModel.price / (1 + Number(this.form.taxRate))).toFixed(2);
    },
    query() {
      http
        .get('/admin/invoicingProduct/price.jhtml', { id: this.itemId })
        .then(data => {
          this.loading = false;
          this.tableData = data.data.purchasePrices;
          this.form.taxRate = data.data.taxRate;
          this.form.price = data.data.price;
          this.form.wholesalePrice = data.data.wholesalePrice;
          this.form.agent2Price = data.data.agent2Price;
          this.form.agent3Price = data.data.agent3Price;
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
    getSupplierList() {
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', { cooperationType: '0', pageSize: 1000, pageNumber: 1 })
        .then(data => {
          this.loading = false;
          this.supplierList = data.dataList;
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
    cancelForm() {
      this.showForm = false;
    },
    create() {
      http
        .post('/admin/invoicingProduct/purchasePrice.jhtml', { price: this.formModel.price, cooperationId: this.formModel.supplier, productId: this.itemId })
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.showForm = false;
          this.query();
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
    update() {
      http
        .put('/admin/invoicingProduct/purchasePrice.jhtml', { id: this.id, price: this.formModel.price, cooperationId: this.formModel.supplier, productId: this.itemId })
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.showForm = false;
          this.query();
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
    saveForm() {
      if (this.id) {
        this.update();
      } else {
        this.create();
      }
    },
    add() {
      this.id = '';
      this.formModel.price = '';
      this.formModel.supplier = '';
      this.showForm = true;
    },
    edit(row) {
      console.log(row);
      this.id = row.id;
      this.formModel.price = (row.priceWithoutTax * (1 + Number(this.form.taxRate))).toFixed(2);
      this.formModel.supplier = row.cooperationId;
      this.formModel.priceNoTaxModel = row.priceWithoutTax;
      this.showForm = true;
    },
    del(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete('/admin/invoicingProduct/purchasePrice.jhtml', { ids: [row.id] })
          .then(data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    save() {
      let params = {
        taxRate: this.form.taxRate,
        price: this.form.price,
        wholesalePrice: this.form.wholesalePrice,
        agent2Price: this.form.agent2Price,
        agent3Price: this.form.agent3Price,
        id: this.itemId
      };
      http
        .put('/admin/invoicingProduct/salePrice.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.query();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.add-product-base-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .shipping-method {
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      margin-left: 0px;
      width: 110px;
    }
  }
}
</style>
