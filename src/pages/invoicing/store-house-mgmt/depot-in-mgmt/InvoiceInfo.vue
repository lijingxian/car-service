<template>
  <biz-grid class="invoice-mgmt-base-info">
    <el-collapse v-model="activeNames">
      <el-table :data="tableData" height="250" border style="width: 100%" show-summary size="small">
        <el-table-column prop="date" label="订单编号">
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
        </el-table-column>
        <el-table-column prop="address" label="条码">
        </el-table-column>
        <el-table-column prop="address" label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity" :min="0" size="mini"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="不含税单价">
        </el-table-column>
        <el-table-column prop="address" label="不含税金额">
        </el-table-column>
        <el-table-column prop="address" label="税率">
        </el-table-column>
        <el-table-column prop="address" label="税额">
        </el-table-column>
        <el-table-column prop="address" label="含税单价">
        </el-table-column>
        <el-table-column prop="address" label="含税金额">
        </el-table-column>
        <el-table-column prop="date" label="操作" min-width="120">
          <div slot-scope="scope">
            <div class="biz-customcol">
              <el-button type="text" size="mini" @click.stop="detail(scope.row)">详情</el-button>
              <el-button type="text" size="mini" @click.stop="printApply(scope.row)">凭证</el-button>
            </div>
          </div>
        </el-table-column>
      </el-table>
      <el-collapse-item title="基本信息" name="1">
        <el-form :rules="rules" :model="form" :inline="true" ref="form" label-width="125px" size="small" v-loading="loading"
          :disabled="!isEdit" :inline-message="true">
          <el-form-item label="发票代码" prop="sn">
            <el-input v-model="form.sn" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="发票号码" prop="sn">
            <el-input v-model="form.sn" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="发票类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择发票类型" style="width:100%" @change="typeChange">
              <el-option v-for="type in accountInTypeList" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票类别" prop="type">
            <el-select v-model="form.type" placeholder="请选择发票类别" style="width:100%" @change="typeChange">
              <el-option v-for="type in accountInTypeList" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买方" prop="type">
            <el-select v-model="form.type" placeholder="请选择购买方" style="width:100%" @change="typeChange">
              <el-option v-for="type in accountInTypeList" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售方" prop="type">
            <el-select v-model="form.type" placeholder="请选择销售方" style="width:100%" @change="typeChange">
              <el-option v-for="type in accountInTypeList" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票日期" prop="relateUnitAccount">
            <el-input placeholder v-model="form.relateUnitAccount"></el-input>
          </el-form-item>
          <el-form-item label="创建者" prop="creator">
            <el-input placeholder v-model="form.creator" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="createDate">
            <el-input placeholder v-model="form.createDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
            <el-input placeholder v-model="form.createDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" placeholder v-model="form.remarks"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2" title="明细信息">
        <el-table :data="tableData" height="250" border style="width: 100%" show-summary size="small">
          <el-table-column prop="date" label="订单编号">
          </el-table-column>
          <el-table-column prop="name" label="商品名称">
          </el-table-column>
          <el-table-column prop="address" label="条码">
          </el-table-column>
          <el-table-column prop="address" label="数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" :min="0" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="不含税单价">
          </el-table-column>
          <el-table-column prop="address" label="不含税金额">
          </el-table-column>
          <el-table-column prop="address" label="税率">
          </el-table-column>
          <el-table-column prop="address" label="税额">
          </el-table-column>
          <el-table-column prop="address" label="含税单价">
          </el-table-column>
          <el-table-column prop="address" label="含税金额">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog :visible.sync="dialogTableVisible" center width="800px" append-to-body custom-class="orderDialog">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
            <el-button type="primary" @click="exportInvoice" size="mini">导出</el-button>
          </div>
        </el-col>
      </el-row>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10" class="row">
            <div class="p-title">{{title}}</div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="24">
              <div class="grid-content bg-purple" align="center">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="14">
              <div class="grid-content bg-purple">发票代码：{{form.invoiceCode}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">发票号码：{{form.invoiceNum}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">发票类型：{{form.type}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">发票类别：{{form.category}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">购买方：{{form.buyerName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">销售方：{{form.sellerName}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">开票日期：{{form.applierName}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建者：{{form.state}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">状态：{{form.invoiceDate}}</div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple">创建时间：{{form.createDate}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="14">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-table :data="gridData" class="table-class" show-summary size="small">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="订单编号">
              <template slot-scope="scope">{{scope.row.orderSn}}</template>
            </el-table-column>
            <el-table-column property="name" label="商品名称" min-width="200">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column property="product.barCode" label="条码"></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
            <el-table-column property="price" label="不含税单价"></el-table-column>
            <el-table-column property="" label="不含税金额"></el-table-column>
            <el-table-column property="" label="税率"></el-table-column>
            <el-table-column property="tax" label="税额"></el-table-column>
            <el-table-column property="priceWithTax" label="含税单价"></el-table-column>
            <el-table-column property="" label="含税金额"></el-table-column>
          </el-table>
        </div>
      </vue-easy-print>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import vueEasyPrint from 'vue-easy-print';
import axios from 'axios';
export default {
  name: 'ReceiptMgmtBaseInfo',
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
  data() {
    return {
      loading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      operationsDetail: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '保存', name: 'saveDetail', type: 'primary' }
      ],
      rules: {},
      title: '',
      form: this.resetForm(),
      tableData: [],
      gridData: [],
      activeNames: ['1'],
      isCreated: false,
      dialogTableVisible: false,
      paymentMethodId: '',
      relateUnitTypeList: [],
      accountInTypeList: [],
      financeBillStateList: [],
      paymentMethodList: [],
      paymentTypeList: [],
      accountList: [],
      listExistCard: [],
      userId: ''
    };
  },
  components: {
    BizGrid,
    vueEasyPrint
  },
  computed: {
    stateFormatter() {
      switch (this.form.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        default:
          return '--';
      }
    }
  },
  created() {},
  methods: {
    operate(name) {
      this[name]();
    },
    print() {
      this.$refs.easyPrint.print();
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    deleteHandeler() {},
    resetForm() {
      return {
        id: '',
        type: '2',
        amount: '',
        relateUnitType: '0',
        relateUnit: {
          id: ''
        },
        relateUnitAccount: '',
        relateUnitBank: '',
        relateBill: {
          id: ''
        },
        remarks: '',
        userCard: {
          id: '',
          template: { id: '', name: '' }
        },
        account: {
          id: ''
        },
        paymentMethod: {
          id: '',
          name: ''
        },
        paymentType: {
          id: '',
          name: ''
        }
      };
    },
    clear() {
      this.form = this.resetForm();
      this.listExistCard = [];
      this.$refs.form.resetFields();
    },
    detail() {},
    typeChange() {},
    typeFormatter(type) {
      let typeList = {
        '0': '采购申请单',
        '1': '采购退货申请单',
        '2': '采购订单',
        '3': '采购退货订单',
        '4': '入库单',
        '5': '出库单',
        '6': '收款单',
        '7': '付款单',
        '8': '销售订单',
        '9': '销售退款订单'
      };
      return typeList[type];
    },
    printApply(row) {
      let params = {
        id: row.id
      };
      http
        .get('', params)
        .then(data => {
          this.dialogTableVisible = true;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    async exportInvoice() {
      let params = {
        id: this.form.id,
        //  0:采购；1：销售
        type: '0'
      };
      try {
        let response = await axios.post('/admin/invoicing/purchase/voucher/purchaseApply/export.jhtml', params, {
          responseType: 'blob'
        });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    refresh(id) {
      http
        .get('/admin/invoicing/config/setting.jhtml', {})
        .then(data => {
          if (data.purchaseApply === '0') {
            this.operations[0].class = 'hidden';
          } else {
            this.operations[0].class = 'show';
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {},
  watch: {
    itemId(val) {
      if (val !== '') {
        this.refresh(val);
      } else {
        this.clear();
      }
    }
  }
};
</script>

<style lang="scss">
.invoiceDialog {
  .biz-grid {
    top: 20px;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
}
.payment-mgmt-base-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
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
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
