<template>
  <biz-grid class="invoice-mgmt-base-info">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <biz-save-button :operations="operations" @operate="operate"></biz-save-button>
        <el-form :rules="rules" :model="form" :inline="true" ref="form" label-width="125px" size="small" v-loading="loading"
          :disabled="!isEdit" :inline-message="true">
          <el-form-item label="发票代码" prop="invoiceCode">
            <el-input v-model="form.invoiceCode"></el-input>
          </el-form-item>
          <el-form-item label="发票号码" prop="invoiceNum">
            <el-input v-model="form.invoiceNum"></el-input>
          </el-form-item>
          <el-form-item label="发票类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择发票类型" style="width:100%">
              <el-option v-for="type in conditionData.invoiceTypeList" :key="type.value" :label="type.label" :value="type.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票类别" prop="category">
            <el-select v-model="form.category" placeholder="请选择发票类别" style="width:100%" @change="typeChange" :disabled="!!form.id">
              <el-option v-for="type in conditionData.invoiceRecordCategoryList" :key="type.value" :label="type.label"
                :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买方类型" prop="buyer" v-if="form.category==='1'">
            <el-select v-model="form.buyerType" placeholder="请选择购买方类型" @change="buyerTypeChange" :disabled="!!form.id">
              <el-option label="会员" value="1"></el-option>
              <el-option label="代理商" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买方" prop="buyer" v-if="form.category==='1'">
            <el-input :value="form.buyerName" @focus="buyerFocus" :disabled="!!form.id"></el-input>
          </el-form-item>
          <el-form-item label="购买方" prop="buyer" v-if="form.category==='0'">
            <el-input :value="getUser.shop.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="销售方" prop="seller" v-if="form.category==='0'">
            <el-select v-model="form.seller" placeholder="请选择销售方" filterable :disabled="!!form.id">
              <el-option v-for="type in sellerList" :key="type.value" :label="type.name" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售方" prop="seller" v-if="form.category==='1'">
            <el-input :value="getUser.shop.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="开票日期" prop="invoiceDate">
            <el-date-picker v-model="form.invoiceDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建者" prop="creator">
            <el-input placeholder :value="getUser.shop.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-input placeholder :value="getStatus(form.state)" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
            <el-input placeholder v-model="form.createDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" placeholder v-model="form.remarks"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2" title="发票抬头">
        <el-form v-model="form" size="small" label-width="140px" :inline="true">
          <el-form-item label="发票抬头" prop="invoiceTitle">
            <el-input type="text" v-model="form.invoiceTitle" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="code" v-if="form.invoiceType!=='0'">
            <el-input type="text" v-model="form.code" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="注册电话" prop="registerMobile" v-if="form.invoiceType!=='0'">
            <el-input type="text" v-model="form.mobile" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="bank" v-if="form.invoiceType!=='0'">
            <el-input type="text" v-model="form.bank" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="银行账户" prop="account" v-if="form.invoiceType!=='0'">
            <el-input type="text" v-model="form.account" style="width:220px"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="3" title="获取方式">
        <el-form v-model="form" size="small" label-width="140px">
          <el-form-item label="发票类型" prop="invoiceMode">
            <el-radio-group v-model="form.invoiceMode" @change="invoiceModeChange">
              <el-radio label="0">纸质发票</el-radio>
              <el-radio label="1">电子发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.invoiceMode === '1'">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱"></el-input>
            </el-form-item>
          </div>
          <div v-if="form.invoiceMode === '0'">
            <el-form-item label="是否邮寄" prop="needMail">
              <el-radio-group v-model="form.needMail">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 邮寄信息 -->
            <div v-if="form.needMail === '1'">
              <el-form-item label="收票人" prop="contacts">
                <el-input v-model="form.contacts" placeholder="请输入收票人"></el-input>
              </el-form-item>
              <el-form-item label="收件人电话" prop="mobile">
                <el-input v-model="form.mobile" maxlength="13" placeholder="请输入电话"></el-input>
              </el-form-item>
              <el-form-item label="所在地" prop="area">
                <biz-area-select :areaId="form.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入地址"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="4" title="明细信息" v-if="form.id">
        <biz-save-button :operations="operationsDetail" @operate="operate"></biz-save-button>
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
          <el-table-column prop="amount" label="数量" min-width="120px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" :min="0" size="mini" :max="Number(scope.row.totalQuantity)"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" min-width="100px">
            <template slot-scope="scope">
              <div style="width:100%">
                <div class="overflow">
                  不含税单价：{{(scope.row.priceWithoutTax*1).toFixed(4)}}
                </div>
                <div class="overflow">
                  含税单价：{{(scope.row.price*1).toFixed(4)}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taxRate" label="税率" min-width="50px">
          </el-table-column>
          <el-table-column prop="" label="金额" min-width="100px">
            <template slot-scope="scope">
              <div style="width:100%">
                <div class="overflow">
                  不含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax).toFixed(4):''}}
                </div>
                <div class="overflow">
                  税额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax*scope.row.taxRate).toFixed(4):''}}
                </div>
                <div class="overflow">
                  含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.price).toFixed(4):''}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div class="biz-customcol">
                <el-button type="text" size="mini" @click="deleteHandeler(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <biz-dialog-selector title="选择购买方" :visibility.sync="showDialogM" :appendToBody="true" :tableData="buyerList"
      :pagination="dialogMemberPagination" :selectionMode="'single'" :filters="dialogFilters" @confirmed="handleConfirmed"
      @filterDataChange="dialogMemberFilterDataChange" @pageSizeChange="dialogMemberPageSizeChange"
      @currentPageChange="dialogMemberCurrentPageChange">
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="createDate" label="创建日期"></el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector title="选择购买方" :visibility.sync="showDialogD" :appendToBody="true" :tableData="buyerList"
      :pagination="dialogMemberPagination" :selectionMode="'single'" :filters="dialogFilters" @confirmed="handleConfirmed"
      @filterDataChange="dialogMemberFilterDataChange" @pageSizeChange="dialogMemberPageSizeChange"
      @currentPageChange="dialogMemberCurrentPageChange">
      <el-table-column label="门店名称" prop="name">
      </el-table-column>
      <el-table-column label="地址" prop="address">
      </el-table-column>
      <el-table-column label="电话" prop="phone">
      </el-table-column>
    </biz-dialog-selector>
    <!-- 添加明细 -->
    <biz-dialog-selector title="添加明细" :visibility.sync="showInfoDialog" :appendToBody="true" :loading="dialogLoading"
      :tableData="dialogInfoTableData" :pagination="dialogPagination" :selectionMode="'multi'" :isClear="false"
      @selectionChange="selectionChange" :filters="dialogInfoFilters" @confirmed="handleInfoConfirmed" @open="opened"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange" class="invoiceDialog-class">
      <div slot="top">
        <div style="display:flex;justify-content:space-between">
          <span>已选订单：{{orderNum}}</span><span>已选明细：{{infoNum}}</span><span>开票数量：{{invoiceNum}}</span><span>不含税金额：{{priceWithoutTax}}</span><span>税额：{{tax}}</span><span>含税金额：{{amount}}</span>
        </div>
      </div>
      <el-table-column label="订单信息" prop="orderSn">
        <template slot-scope="scope">
          <span>{{scope.row.orderSn}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="200px">
        <template slot-scope="scope">
          <div>
            <div>{{scope.row.name}}</div>
            <div>{{scope.row.product.barCode || '--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品单价" width="200px">
        <template slot-scope="scope">
          <div>
            <div>不含税{{(scope.row.priceWithoutTax*1).toFixed(4)}}</div>
            <div>税率{{(scope.row.taxRate*1).toFixed(4) || '--'}}</div>
            <div>含税{{(scope.row.originalPrice*1).toFixed(4) || '--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="可开票数量" prop="totalQuantity"></el-table-column>
      <el-table-column label="已开票数量" prop="invoicedQuantity"></el-table-column>
      <el-table-column label="本次开票数量" prop="sn" width="120px">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.quantity" :min="0" size="mini" :max="Number(scope.row.totalQuantity)"
            @change="quantityChange">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="开票金额" width="200px">
        <template slot-scope="scope">
          <div>
            <div>不含税{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax).toFixed(4):''}}</div>
            <div>税额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax*scope.row.taxRate).toFixed(4):''}}</div>
            <div>含税{{scope.row.quantity?(scope.row.quantity*scope.row.originalPrice).toFixed(4) : '--'}}</div>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import http from '@/common/http';
import dateUtil from '@/utils/date';
import { mapGetters } from 'vuex';
import BizAreaSelect from '@/components/BizAreaSelect';
const dataConverter = {
  stateConverter(row) {
    if (row.enableState === '0') return '停用';
    else if (row.enableState === '1') return '启用';
    else return '--';
  },
  stateSupplierConverter(row) {
    if (row.enabled === '0') return 'X';
    else if (row.enabled === '1') return '√';
    else return '--';
  },
  createDateConverter(row) {
    if (row.createDate) {
      row.createDate = row.createDate.replace(/-/g, '/');
      let date = new Date(row.createDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  loginDateConverter(row) {
    if (row.lastLoginDate) {
      row.lastLoginDate = row.lastLoginDate.replace(/-/g, '/');
      let date = new Date(row.lastLoginDate);
      return dateUtil.dateConverter(date);
    } else {
      return '--';
    }
  },
  ipConverter(row) {
    if (row.lastLoginIp) return row.lastLoginIp;
    else return '--';
  }
};
export default {
  name: 'ReceiptMgmtBaseInfo',
  props: {
    itemId: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    const isAmount = (rule, rules, callback) => {
      if (this.form.amount === '') {
        callback(new Error('请输入有效的付款金额'));
      }
      if (Number(this.form.amount) >= 0) {
        callback();
      } else if (Number(this.form.amount) < 0) {
        callback(new Error('付款金额不能为负数'));
      } else {
        callback(new Error('付款金额必须为数字值'));
      }
    };
    const isRelateUnitName = (rule, rules, callback) => {
      if (this.form.relateUnit.id === '') {
        callback(new Error('请选择往来方'));
      } else {
        callback();
      }
    };
    const isRelateBill = (rule, rules, callback) => {
      if (this.form.relateBill.sn === '') {
        callback(new Error('请选择关联单据'));
      } else {
        callback();
      }
    };
    const isPaymentType = (rule, rules, callback) => {
      if (this.form.paymentType.id === '') {
        callback(new Error('请选择付款方式'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      operationsDetail: [
        { label: '新增', name: 'add', type: 'primary' },
        { label: '保存', name: 'saveDetail', type: 'primary' }
      ],
      rules: {
        type: [{ required: true, message: '请选择业务类型', trigger: ['blur', 'change'] }],
        relateUnitType: [{ required: true, trigger: 'blur', validator: isRelateUnitName }],
        relateBill: [{ required: true, trigger: 'blur', validator: isRelateBill }],
        amount: [{ required: true, trigger: 'blur', validator: isAmount }],
        paymentType: [{ required: true, trigger: 'blur', validator: isPaymentType }],
        relateUnitBank: [{ required: true, trigger: 'blur', message: '请选择往来方银行' }],
        relateUnitAccount: [{ required: true, trigger: 'blur', message: '请输入往来方账号' }]
      },
      form: this.resetForm(),
      showSupplierDialog: false,
      showInfoDialog: false,
      dialogLoading: true,
      showDialogD: false,
      showDialogM: false,
      activeNames: ['1'],
      orderNum: '',
      infoNum: '',
      amount: '',
      priceWithoutTax: '',
      tax: '',
      invoiceNum: '',
      dialogInfoTableData: [],
      sellerList: [],
      buyerList: [],
      tableData: [],
      dialogMemberPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      isCreated: false,
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入用户名/手机号',
          name: 'searchValue',
          value: ''
        }
      ],
      dialogInfoFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入订单编号/商品名称/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      paymentMethodId: '',
      conditionData: {},
      selections: [],
      userId: ''
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    BizAreaSelect
  },
  computed: {
    ...mapGetters(['getUser']),
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
  created() {
    this.getConditionData();
    this.querySeller();
  },
  methods: {
    ...dataConverter,
    operate(name) {
      this[name]();
    },
    invoiceModeChange(val) {
      if (val === '1') {
        this.form.needMail = '0';
      }
    },
    handleAreaChanged(areaId) {
      this.form.area.id = areaId;
    },
    quantityChange() {
      console.log(1);
      this.amount = 0;
      this.selections.map(item => {
        this.amount = Number(item.price * (item.quantity ? item.quantity : 0)) + Number(this.amount);
        this.priceWithoutTax = Number(item.price * (item.quantity ? item.quantity : 0)) + Number(this.priceWithoutTax);
        this.tax = Number(item.tax) + Number(this.tax);
      });
    },
    handleConfirmed(selectionKeys, selections) {
      this.form.buyer = selections[0].id;
      this.form.buyerName = selections[0].name;
    },
    buyerFocus() {
      if (this.form.buyerType === '1') {
        this.showDialogD = false;
        this.showDialogM = true;
        this.dialogFilters[0].placeholder = '请输入用户名/手机号';
      } else {
        this.showDialogM = false;
        this.showDialogD = true;
        this.dialogFilters[0].placeholder = '请输入门店名称';
      }
    },
    // 购买类型变化事件
    buyerTypeChange() {
      if (this.form.buyerType === '1') {
        let params = {
          pageSize: this.dialogMemberPagination.pageSize,
          pageNumber: this.dialogMemberPagination.currentPage,
          searchValue: this.dialogFilters[0].value,
          userSource: '1213'
        };
        http
          .get('/admin/member/members.jhtml', params)
          .then(data => {
            this.loading = false;
            this.buyerList = data.content;
            this.dialogMemberPagination.total = Number(data.total);
          })
          .catch(ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          });
      } else {
        let params = {
          pageSize: this.dialogMemberPagination.pageSize,
          pageNumber: this.dialogMemberPagination.currentPage,
          searchValue: this.dialogFilters[0].value,
          cooperationType: '1'
        };
        http
          .get('admin/cooperationInfo/cooperationInfo/list.jhtml', params)
          .then(data => {
            this.loading = false;
            this.buyerList = data.dataList;
            this.dialogMemberPagination.total = Number(data.total);
          })
          .catch(ErrorData => {
            this.loading = false;
            console.log('ERR_REFRESH: ', ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          });
      }
    },
    // 删除明细
    deleteHandeler(row) {
      let ids = [];
      ids.push(row.id);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete('/admin/invoicing/invoiceRecord/invoiceRecordItem.jhtml', { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.tableData.splice(this.tableData.indexOf(row), 1);
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
        remarks: '',
        invoiceTitle: '',
        invoiceState: '',
        price: '',
        code: '',
        registerAddress: '',
        registerMobile: '',
        bank: '',
        account: '',
        invoiceAmount: '',
        createDate: '',
        invoiceMode: '0',
        needMail: '0',
        contacts: '',
        mobile: '',
        area: { id: '1568' },
        address: '',
        express: '',
        expressCode: '',
        freight: '',
        zipCode: '',
        email: '',
        path: ''
      };
    },
    clear() {
      this.form = this.resetForm();
      this.listExistCard = [];
      this.$refs.form.resetFields();
    },
    typeChange() {
      this.form.buyerType = '';
      this.form.seller = '';
      this.form.buyerName = '';
      this.querySeller();
    },
    // 查询销售方
    querySeller() {
      this.loading = true;
      let params = {
        cooperationType: '0',
        pageSize: 20,
        pageNumber: 1,
        searchValue: this.dialogFilters[0].value
      };
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', params)
        .then(data => {
          this.loading = false;
          this.sellerList = data.dataList;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 背景数据
    getConditionData(id) {
      this.loading = true;
      let params = {
        id: id
      };
      http
        .get('/admin/invoicing/invoiceRecord/backgrounds.jhtml', params)
        .then(data => {
          this.loading = false;
          this.conditionData = data;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 查询发票信息
    refresh(id) {
      this.loading = true;
      let params = {
        id: id
      };
      http
        .get('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.resetForm(), data.data);
          this.tableData = data.data.items || [];
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    add() {
      this.showInfoDialog = true;
      this.orderNum = '';
      this.infoNum = '';
      this.amount = '';
      this.invoiceNum = '';
      this.priceWithoutTax = '';
      this.tax = '';
    },
    // 添加明细列表
    queryInfoList() {
      let params = {
        id: this.form.id,
        pageSize: 20,
        pageNumber: 1,
        searchValue: this.dialogInfoFilters[0].value
      };
      http
        .get('/admin/invoicing/invoiceRecord/relatedItems.jhtml', params)
        .then(data => {
          this.dialogLoading = false;
          this.showInfoDialog = true;
          this.dialogInfoTableData = data.dataList;
          this.dialogInfoTableData.map(item => {
            this.$set(item, 'quantity', item.totalQuantity - item.invoicedQuantity);
          });
          this.dialogPagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    opened() {
      this.dialogInfoTableData = [];
      this.dialogInfoFilters[0].value = '';
      this.queryInfoList(this.getDialogQueryParams());
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogInfoFilters[0].value
      };
    },
    dialogFilterDataChange(filters) {
      this.dialogPagination.currentPage = 1;
      this.queryInfoList(this.getDialogQueryParams());
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      this.queryInfoList(this.getDialogQueryParams());
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      this.queryInfoList(this.getDialogQueryParams());
    },
    dialogMemberFilterDataChange(filters) {
      this.dialogMemberPagination.currentPage = 1;
      this.buyerTypeChange();
    },
    dialogMemberPageSizeChange(val) {
      this.$set(this.dialogMemberPagination, 'pageSize', val);
      this.buyerTypeChange();
    },
    dialogMemberCurrentPageChange(val) {
      this.$set(this.dialogMemberPagination, 'currentPage', val);
      this.buyerTypeChange();
    },
    // 选择明细列表数据
    selectionChange(selections) {
      console.log(2);
      this.selections = selections;
      let snList = [];
      let hash = [];
      this.amount = 0;
      this.invoiceNum = 0;
      selections.map(item => {
        snList.push(item.orderSn);
        this.amount = Number(item.price * (item.quantity ? item.quantity : 0)) + Number(this.amount);
        this.invoiceNum = Number(item.quantity || 0) + Number(this.invoiceNum);
        this.priceWithoutTax = Number(item.price * (item.quantity ? item.quantity : 0)) + Number(this.priceWithoutTax);
        this.tax = Number(item.tax) + Number(this.tax);
      });
      snList.forEach(i => {
        if (hash.indexOf(i) === -1) {
          hash.push(i);
        }
      });
      this.orderNum = hash.length;
      this.infoNum = selections.length;
    },
    handleInfoConfirmed(selectionKeys, selections) {
      this.showInfoDialog = false;
      console.log(selectionKeys);
      this.tableData.map(item => {
        // if (this.selections.find(n => n.productId === item.productId)) {
        //   this.selections.splice(item, 1);
        // }
        this.selections.forEach(element => {
          if (element.productId === item.productId) {
            this.selections.splice(item, 1);
            item.quantity = item.quantity + element.quantity;
          }
        });
      });
      this.selections.forEach(item => {
        this.$set(item, 'orderItemId', item.id);
        this.$set(item, 'id', '');
      });
      this.tableData = this.tableData.concat(this.selections);
    },
    // 保存明细
    saveDetail() {
      this.loading = true;
      let orderItem = [];
      orderItem = this.tableData.map(item => {
        return { orderItemId: item.orderItemId, quantity: item.quantity, id: item.id };
      });
      http
        .post('/admin/invoicing/invoiceRecord/invoiceRecordItem.jhtml', { id: this.form.id, items: orderItem })
        .then(data => {
          this.loading = false;
          this.refresh(this.form.id);
          this.$message.success('操作成功');
          this.$emit('operationSuccess', this.itemId.id);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 保存发票
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.form.category === '0') {
            this.form.sellerType = '0';
            this.form.buyerType = '5';
            this.form.buyer = this.getUser.shop.id;
          } else {
            this.form.sellerType = '5';
            this.form.seller = this.getUser.shop.id;
          }
          if (this.form.id) {
            this.update();
          } else {
            this.create();
          }
        } else {
          return false;
        }
      });
    },
    create() {
      this.loading = true;
      let params = this.form;
      http
        .post('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('operationSuccess', data.id);
          this.refresh(data.id);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      let params = this.form;
      http
        .put('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.loading = false;
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    getStatus(row) {
      switch (row) {
        case '0':
          return '未确认';
        case '5':
          return '已确认';
        default:
          return '--';
      }
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
      if (val.id !== '') {
        this.refresh(val.id);
      } else {
        this.clear();
      }
    }
  }
};
</script>

<style lang="scss">
.invoiceDialog-class {
  .biz-grid {
    top: 20px;
  }
  .el-dialog__footer {
    margin-top: 10px;
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
.invoice-mgmt-base-info {
  .biz-save-button {
    justify-content: flex-start;
  }
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
