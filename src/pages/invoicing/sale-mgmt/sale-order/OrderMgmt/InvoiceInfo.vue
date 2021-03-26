<template>
  <biz-grid class="invoice-info-t" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate">
    </biz-header>
     <el-card v-for="(invoice) in invoiceList" :key="invoice.id" class="invoice-content">
        <div style="display:flex;justify-content: space-between;">
          <div class="radio-i">
            <div>
              <div class="default">
                <span>发票抬头：</span>
                <span>{{invoice.invoiceTitle}}</span>
              </div>
              <div style="padding-top:10px">
                <span>发票类型：</span>
                <span>{{invoice.type==='0'?'个人':invoice.type==='1'?'增值税普通发票':invoice.type==='2'?'增值税专用发票':''}}</span>
              </div>
              <div style="padding:10px 0px">
                <span>发票金额：</span>
                <span>{{invoice.price}}</span>
              </div>
              <div>
                <span>发票状态：</span>
                <span>{{invoice.state==='0'?'未开票':'已开票'}}</span>
              </div>
            </div>
          </div>
          <div class="bottom-d">
            <span @click.stop="query(invoice)">详情</span>
            <span @click.stop="deleteItem(invoice.id)" v-if="invoice.state==='0'">删除</span>
          </div>
        </div>
    </el-card>
    <el-dialog :visible.sync="showInvoiceExpress" append-to-body custom-class="close-invoice-dialog" title="发票详情" v-loading="loading" width="800px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-form :model="formModel" :inline="true" ref="form" label-width="125px" size="small">
            <el-form-item label="发票类型：" prop="">
              {{formModel.type==='0'?'个人':formModel.type==='1'?'增值税普通发票':formModel.type==='2'?'增值税专用发票':''}}
            </el-form-item>
            <el-form-item label="发票抬头：" prop="">
              {{formModel.invoiceTitle}}
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="" v-if="formModel.type!=='0'">
              {{formModel.code}}
            </el-form-item>
            <el-form-item label="电话：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.registerMobile||formModel.mobile}}
            </el-form-item>
            <el-form-item label="开户行：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.bank}}
            </el-form-item>
            <el-form-item label="账号：" prop="email" v-if="formModel.type!=='0'">
              {{formModel.account}}
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="2" title="获取方式">
          <el-form :model="formModel" :inline="true" ref="form" label-width="125px" size="small">
            <el-form-item label="获取方式：" prop="invoiceMode">
              {{formModel.obtainType==='0'?'纸质发票':'电子发票'}}
            </el-form-item>
            <el-form-item label="是否邮寄：" prop="needMail">
              {{formModel.needMail==='1'?'是':'否'}}
            </el-form-item>
            <el-form-item label="联系人：" prop="contacts" v-if="formModel.needMail==='1'">
              {{formModel.contacts}}
            </el-form-item>
            <el-form-item label="联系电话：" prop="mobile" v-if="formModel.needMail==='1'">
              {{formModel.mobile}}
            </el-form-item>
            <el-form-item label="所在地" prop="area" v-if="formModel.needMail==='1'">
              {{formModel.areaName}}{{formModel.address}}
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="3" title="发票明细">
          <el-table :data="tableData" height="450" border style="width: 100%" size="small">
            <el-table-column prop="orderSn" label="订单编号" min-width="100">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    {{scope.row.orderSn}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品" min-width="100">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    {{scope.row.name}}
                  </div>
                  <div class="overflow">
                    {{scope.row.product.barCode}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量" min-width="60px">
              <template slot-scope="scope">
                {{scope.row.quantity}}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" min-width="140px">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    不含税单价：{{scope.row.priceWithoutTax}}
                  </div>
                  <div class="overflow">
                    含税单价：{{scope.row.price}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率" min-width="50px">
            </el-table-column>
            <el-table-column prop="" label="金额" min-width="140px">
              <template slot-scope="scope">
                <div style="width:100%">
                  <div class="overflow">
                    不含税金额：{{scope.row.quantity?scope.row.quantity*scope.row.priceWithoutTax:''}}
                  </div>
                  <div class="overflow">
                    税额：{{scope.row.tax}}
                  </div>
                  <div class="overflow">
                    含税金额：{{scope.row.quantity?scope.row.quantity*scope.row.price:''}}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <el-dialog :visible.sync="showApplyInvoice" center append-to-body custom-class="apply-invoice-dialog" width="1000px">
      <apply-invoice :invoiceAmount="invoiceAmount" :orderIds="orderIds" ref="applyInvoice"  :category="'1'" :buyerType="'2'" :buyer="buyer" :sellerType="'5'" :seller="getUser().shop.id"  @close="showApplyInvoice=false"></apply-invoice>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import ApplyInvoice from '@/pages/invoicing/purchase-mgmt/purchase-order/components/ApplyInvoice';
import { mapGetters } from 'vuex';
export default {
  name: 'invoiceInfo',
  props: {
    itemId: {
      type: String
    },
    orderIds: {
      type: Array
    },
    userId: {
      type: String
    },
    price: {
      type: String
    },
    category: {
      type: String
    },
    buyerType: {
      type: String
    },
    buyer: {
      type: String
    },
    seller: {
      type: String
    },
    sellerType: {
      type: String
    },
    invoiceInfoId: {
      type: String
    },
    invoiceId: {
      type: String
    },
    open: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    BizHeader,
    BizGrid,
    ApplyInvoice
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      invoiceList: [],
      tableData: [],
      invoiceAmount: '',
      formModel: this.resetForm(),
      loading: false,
      showApplyInvoice: false,
      formLoading: false,
      showInvoiceExpress: false,
      showLogisticsFollowing: false,
      dialogVisiableInvoice: false,
      // form: {},
      operations: [
        {
          label: '申请发票',
          name: 'save',
          type: 'primary',
          disabled: false,
          class: 'show'
        }
      ],
      deliverys: []
    };
  },
  watch: {
    open(nVal, oVal) {
      console.log(nVal);
      if (nVal) {
        this.getInvoiceList();
      }
    }
  },
  computed: {},
  mounted() {
    this.getInvoiceList();
  },
  methods: {
    ...mapGetters(['getUser']),
    resetForm() {
      return {
        id: '',
        invoiceCode: '',
        invoiceNum: '',
        type: '1',
        category: '0',
        buyerType: '',
        relateUnitBank: '1',
        buyer: '',
        buyerName: '',
        state: '0',
        sellerType: '0',
        seller: '',
        invoiceDate: '',
        remarks: ''
      };
    },
    // 查询发票信息
    query(row) {
      this.loading = true;
      let params = {
        id: row.id
      };
      http
        .get('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.loading = false;
          this.formModel = Object.assign(this.resetForm(), data.data);
          this.tableData = data.data.items || [];
          this.showInvoiceExpress = true;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 删除
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', { ids: [ids] })
          .then(data => {
            this.$message.success('删除成功');
            this.getInvoiceList();
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
    getInvoiceList() {
      let params = {
        pageSize: 1000,
        pageNumber: 1,
        seller: this.seller,
        buyer: this.buyer,
        category: this.category
      };
      http
        .get('/admin/invoicing/invoiceRecord/list.jhtml', params)
        .then(data => {
          this.invoiceList = data.dataList;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          this.loading = false;
        });
    },
    getList() {},
    handleOperate(name) {
      this[name]();
    },
    save() {
      this.showApplyInvoice = true;
      this.$nextTick(() => {
        this.$refs.applyInvoice.showEdit = true;
        this.$refs.applyInvoice.getOrderList();
      });
    }
  }
};
</script>

<style lang="scss">
.apply-invoice-dialog {
  min-height: 500px;
}
.invoice-info-t {
  .invoice-content {
    font-size: 12px;
    .el-card {
      width: 380px;
      margin: 5px 10px 5px 0px;
      .el-card__body {
        padding: 10px;
      }
    }
    .bottom-d {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      span {
        margin: 0px 10px;
        color: #ff7300;
      }
    }
  }
}
</style>
