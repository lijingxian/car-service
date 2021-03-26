<template>
  <div class="invoice-info-apply">
    <div v-if="showEdit">
      <div>
        <div class="title">发票抬头</div>
        <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
        <div class="invoice-content">
          <el-card v-for="(invoice) in invoiceList" :key="invoice.id">
            <div>
              <div class="radio-i" @click="applyFor(invoice)">
                <el-radio v-model="invoice.checked" label="1" size="mini" @change="selectChange(invoice)">
                  <span style="color:#ffffff">.</span>
                </el-radio>
                <div>
                  <div class="default">
                    <span>发票抬头：</span>
                    <span>{{invoice.invoiceTitle}}</span>
                    <el-button type="primary" size="mini" v-if="invoice.isDefault==='1'" style="margin-left:5px">默认</el-button>
                  </div>
                  <div style="padding-top:10px">
                    <span>发票类型：</span>
                    <span>{{invoice.invoiceType==='0'?'个人':invoice.invoiceType==='1'?'增值税普通发票':invoice.invoiceType==='2'?'增值税专用发票':''}}</span>
                  </div>
                  <div style="padding:10px 0px">
                    <span>联系人：</span>
                    <span>{{invoice.contacts}}</span>
                  </div>
                  <div>
                    <span>联系电话：</span>
                    <span>{{invoice.mobile}}</span>
                  </div>
                  <div class="content-d">
                    <span>详细地址：</span>
                    <span>{{invoice.areaName + invoice.address}}</span>
                  </div>
                </div>
              </div>
              <div class="bottom-d" v-if="hasAuthEdit">
                <span @click.stop="setDefault(invoice)" v-if="invoice.isDefault==='0'">设为默认</span>
                <span @click.stop="editForm(invoice)">编辑</span>
                <span @click.stop="deleteForm(invoice.id)">删除</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div>
        <div class="title">获取方式</div>
        <el-form v-model="formModel" size="small" label-width="140px">
          <el-form-item label="发票类型" prop="invoiceMode">
            <el-radio-group v-model="formModel.invoiceMode" @change="invoiceModeChange">
              <el-radio label="0">纸质发票</el-radio>
              <el-radio label="1">电子发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formModel.invoiceMode === '1'">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="formModel.email" placeholder="请输入电子邮箱"></el-input>
            </el-form-item>
          </div>
          <div v-if="formModel.invoiceMode === '0'">
            <el-form-item label="是否邮寄" prop="needMail">
              <el-radio-group v-model="formModel.needMail">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 邮寄信息 -->
            <!-- <div v-if="formModel.needMail === '1'">
              <el-form-item label="收票人" prop="contacts">
                <el-input v-model="formModel.contacts" placeholder="请输入收票人"></el-input>
              </el-form-item>
              <el-form-item label="收件人电话" prop="mobile">
                <el-input v-model="formModel.mobile" maxlength="13" placeholder="请输入电话"></el-input>
              </el-form-item>
              <el-form-item label="所在地" prop="area">
                <biz-area-select :areaId="formModel.area.id" @areaChanged="handleAreaChanged"></biz-area-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="formModel.address" placeholder="请输入地址"></el-input>
              </el-form-item>
            </div> -->
          </div>
        </el-form>
      </div>
      <div>
        <div class="title">明细信息<span class="span-title">仓库已确认出入库，且未完全开发票的商品记录将展示在此</span></div>
        <el-table :data="tableData" height="450" border style="width: 100%" size="small" empty-text="无可支持开发票的商品">
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
          <el-table-column prop="amount" label="数量" min-width="80px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" :min="0" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" min-width="140px">
            <template slot-scope="scope">
              <div style="width:100%">
                <div class="overflow">
                  不含税单价：{{(scope.row.priceWithoutTax*1).toFixed(4)}}
                </div>
                <div class="overflow">
                  含税单价：{{(scope.row.originalPrice*1).toFixed(4)}}
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
                  不含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax).toFixed(4):''}}
                </div>
                <div class="overflow">
                  税额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax*scope.row.taxRate).toFixed(4):''}}
                </div>
                <div class="overflow">
                  含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.originalPrice).toFixed(4):''}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="!showEdit">
      <div>
        <div class="title">发票抬头</div>
        <el-form v-model="invoiceModel" size="small" label-width="140px" :inline="true">
          <div>
            <el-form-item label="发票类型：" prop="">
              {{invoiceModel.invoiceType==='0'?'个人':invoiceModel.invoiceType==='1'?'增值税普通发票':invoiceModel.invoiceType==='2'?'增值税专用发票':''}}
            </el-form-item>
            <el-form-item label="发票抬头：" prop="">
              {{invoiceModel.invoiceTitle}}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="纳税人识别号：" prop="" v-if="invoiceModel.invoiceType!=='0'">
              {{invoiceModel.code}}
            </el-form-item>
            <el-form-item label="电话：" prop="email" v-if="invoiceModel.invoiceType!=='0'">
              {{invoiceModel.registerMobile||invoiceModel.mobile}}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="开户行：" prop="email" v-if="invoiceModel.invoiceType!=='0'">
              {{invoiceModel.bank}}
            </el-form-item>
            <el-form-item label="账号：" prop="email" v-if="invoiceModel.invoiceType!=='0'">
              {{invoiceModel.account}}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div>
        <div class="title">获取方式</div>
        <el-form v-model="formModel" size="small" label-width="140px" :inline="true">
          <el-form-item label="获取方式：" prop="invoiceMode">
            {{formModel.invoiceMode==='0'?'纸质发票':'电子发票'}}
          </el-form-item>
          <el-form-item label="是否邮寄：" prop="needMail">
            {{formModel.needMail==='1'?'是':'否'}}
          </el-form-item>
          <!-- <el-form-item label="联系人：" prop="contacts">
             {{formModel.contacts}}
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            {{formModel.mobile}}
          </el-form-item>
          <el-form-item label="所在地" prop="area">
            {{formModel.areaName}}{{formModel.address}}
          </el-form-item> -->
        </el-form>
      </div>
      <div>
        <div class="title">明细信息<span class="span-title">仓库已确认出入库，且未完全开发票的商品记录将展示在此</span></div>
        <el-table :data="tableData" height="450" border style="width: 100%" size="small" empty-text="无可支持开发票的商品">
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
              <el-input-number v-model="scope.row.quantity" :min="0" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" min-width="100px">
            <template slot-scope="scope">
              <div style="width:100%">
                <div class="overflow">
                  不含税单价：{{scope.row.priceWithoutTax}}
                </div>
                <div class="overflow">
                  含税单价：{{scope.row.originalPrice}}
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
                  不含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax).toFixed(2):''}}
                </div>
                <div class="overflow">
                  税额：{{scope.row.quantity?(scope.row.quantity*scope.row.priceWithoutTax*scope.row.taxRate).toFixed(2):''}}
                </div>
                <div class="overflow">
                  含税金额：{{scope.row.quantity?(scope.row.quantity*scope.row.originalPrice).toFixed(2):''}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <biz-save-button slot="bottom" :operations="operationForm" @operate="operate"></biz-save-button>
    <el-dialog :visible.sync="showForm" append-to-body height="40%"  center>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" :inline-message="true">
        <el-form-item label="发票信息"></el-form-item>
        <el-form-item label="发票类型" prop="consignee">
          <el-select v-model="form.invoiceType" style="width:220px">
            <el-option label="个人" value="0"></el-option>
            <el-option label="增值税普通发票" value="1"></el-option>
            <el-option label="增值税专用发票" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-input type="text" v-model="form.invoiceTitle" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="code" v-if="form.invoiceType!=='0'">
          <el-input type="text" v-model="form.code" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="registerAddress" v-if="form.invoiceType!=='0'">
          <el-input type="text" v-model="form.registerAddress" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="注册电话" prop="registerMobile" v-if="form.invoiceType!=='0'">
          <el-input type="text" v-model="form.registerMobile" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank" v-if="form.invoiceType!=='0'">
          <el-input type="text" v-model="form.bank" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="account" v-if="form.invoiceType!=='0'">
          <el-input type="text" v-model="form.account" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="邮寄地址"></el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input type="text" v-model="form.contacts" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input type="text" v-model="form.mobile" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="所在地区">
          <biz-area-select :areaId="form.area.id" @areaChanged="handleAreaChanged" style="width:220px"></biz-area-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="area" v-model="form.address" maxlength="100" style="width:220px"></el-input>
        </el-form-item>
        <biz-save-button :operations="formOperations" @operate="operate"></biz-save-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters, mapMutations } from 'vuex';
import BizAreaSelect from '@/components/BizAreaSelect';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  components: {
    // BizGrid,
    BizSaveButton,
    BizAreaSelect
  },
  data() {
    return {
      formModel: {
        invoiceMode: '0',
        needMail: '1',
        area: { id: '' }
      },
      invoiceModel: {},
      form: this.getDetaultModel(),
      invoiceList: [],
      tableData: [],
      activeNames: ['1', '2', '3'],
      invoiceInfoId: '',
      checked: '1',
      showEdit: true,
      showForm: false,
      dialogVisiable: false,
      operations: [{ label: '新增', name: 'add', type: 'primary' }],
      formOperations: [{ label: '保存', name: 'save', type: 'primary' }, { label: '取消', name: 'cancel', type: 'primary' }],
      operationForm: [{ label: '下一步', name: 'next', type: 'primary', class: 'show' }, { label: '上一步', name: 'pre', type: '', class: 'hidden' }, { label: '确定', name: 'confirmHandle', type: 'primary', class: 'hidden' }],
      rules: {
        invoiceType: [{ required: true, message: '请输入发票类型', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        code: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        registerAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
        registerMobile: [{ required: true, message: '请输入注册电话', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        account: [{ required: true, message: '请输入银行账户', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { len: 11, message: '手机号位数错误', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  props: {
    orderIds: {
      type: Array
    },
    invoiceAmount: {
      type: Number
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
    userId: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:purchaseOrder.edit');
    },
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '200px',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  created() {
    this.query();
  },
  watch: {
    userId(val) {
      this.query();
    }
  },
  methods: {
    ...mapMutations('Order', ['updateCurInvoice']),
    operate(name) {
      this[name]();
    },
    invoiceModeChange(val) {
      if (val === '1') {
        this.formModel.needMail = '0';
      }
    },
    getOrderList() {
      http
        .post('/admin/invoicing/invoiceRecord/applyInvoiceDetail.jhtml', { orderIds: this.orderIds, category: this.category })
        .then(data => {
          this.tableData = data.dataList;
          this.tableData.map(item => {
            this.$set(item, 'quantity', item.totalQuantity - item.invoicedQuantity);
          });
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
    applyFor(row) {
      this.invoiceInfoId = row.id;
      this.$set(row, 'invoiceAmount', this.invoiceAmount.toFixed(2));
      this.invoiceModel = row;
      // this.updateCurInvoice(row);
    },
    cancle() {
      this.dialogVisiable = false;
    },
    close() {
      this.dialogVisiable = false;
      this.$emit('close');
    },
    selectChange(row) {
      this.invoiceList.map(item => {
        if (item.id !== row.id) {
          item.checked = '0';
        }
      });
    },
    getDetaultModel() {
      return {
        account: '',
        address: '',
        areaId: '',
        area: {
          id: '1568'
        },
        areaName: '',
        bank: '',
        code: '',
        contacts: '',
        invoiceTitle: '',
        invoiceType: '0',
        isDefault: '',
        mobile: '',
        registerAddress: '',
        registerMobile: ''
      };
    },
    add() {
      this.showForm = true;
      this.form = this.getDetaultModel();
    },
    next() {
      if (this.tableData.length === 0) {
        this.$message.warning('缺少明细信息，无法进行下一步操作');
        return;
      }
      console.log(this.invoiceModel);
      this.operationForm[0].class = 'hidden';
      this.operationForm[1].class = 'show';
      this.operationForm[2].class = 'show';
      this.showEdit = false;
    },
    pre() {
      this.operationForm[0].class = 'show';
      this.operationForm[1].class = 'hidden';
      this.operationForm[2].class = 'hidden';
      this.showEdit = true;
    },
    reset() {
      this.operationForm[0].class = 'show';
      this.operationForm[1].class = 'hidden';
      this.operationForm[2].class = 'hidden';
      this.showEdit = true;
    },
    confirmHandle() {
      let params = {
        // invoiceCode: this.invoiceModel.invoiceCode,
        // invoiceNum: this.invoiceModel.taxNumber,
        type: this.invoiceModel.invoiceType,
        category: this.category,
        buyerType: this.buyerType,
        buyer: this.buyer,
        sellerType: this.sellerType,
        seller: this.seller,
        invoiceDate: '',
        remarks: '',
        invoiceTitle: this.invoiceModel.invoiceTitle,
        contacts: this.invoiceModel.contacts,
        mobile: this.invoiceModel.registerMobile,
        address: this.invoiceModel.address,
        obtainType: this.formModel.invoiceMode,
        email: this.formModel.email,
        code: this.invoiceModel.code,
        bank: this.invoiceModel.bank,
        account: this.invoiceModel.account,
        items: this.tableData
      };
      http
        .post('/admin/invoicing/invoiceRecord/invoiceRecord.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('close');
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
    cancel() {
      this.showForm = false;
    },
    editForm(row) {
      console.log(row);
      this.form = Object.assign(this.getDetaultModel(), row);
      this.showForm = true;
    },
    deleteForm(id) {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        ids: [id]
      };
      this.$confirm('是否确认删除发票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .delete(urls.hypermarketMgmt.invoiceInfo, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(ErrorData => {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning'
            });
            console.log('ERR_REFRESH: ', ErrorData);
          })
          .finally(data => {});
      });
    },
    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.form.areaId = this.form.area.id;
          if (this.form.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    create() {
      let params = {
        clientType: '2',
        userId: this.userId || this.getUser.id,
        shopId: this.getUser.shop.id,
        invoice: this.form
      };
      http
        .post(urls.hypermarketMgmt.invoiceInfo, params)
        .then(data => {
          this.$message.success('添加成功');
          this.query();
          this.showForm = false;
          if (this.form.isDefault === '1') {
            // this.updateCurInvoice(this.form);
          }
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
    setDefault(row) {
      row.isDefault = '1';
      this.form = Object.assign(this.getDetaultModel(), row);
      this.update();
    },
    update() {
      let params = {
        clientType: '2',
        userId: this.userId || this.getUser.id,
        shopId: this.getUser.shop.id,
        invoice: this.form
      };
      http
        .put(urls.hypermarketMgmt.invoiceInfo, params)
        .then(data => {
          this.$message.success('更新成功');
          this.query();
          this.showForm = false;
          if (this.form.isDefault === '1') {
            // this.updateCurInvoice(this.form);
          }
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
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },
    query() {
      let params = {
        clientType: '2',
        userId: this.userId || this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.invoiceInfos, params)
        .then(data => {
          this.invoiceList = data.invoices || [];
          this.invoiceList.map(item => {
            this.$set(item, 'checked', item.isDefault);
            if (item.isDefault === '1') {
              this.invoiceModel = item;
            }
            // if (item.invoiceType === '0') {
            //   item.invoiceType = '个人';
            // } else if (item.invoiceType === '1') {
            //   item.invoiceType = '增值税普通发票';
            // } else if (item.invoiceType === '2') {
            //   item.invoiceType = '增值税专用发票';
            // } else {
            // }
          });
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    }
  }
};
</script>
<style lang="scss">
.bill-dialog {
  .el-dialog__body{
    height: 700px;
  }
}
.invoice-info-apply {
  color: #666666;
  font-size: 12px;
  padding: 40px;
  .el-form--inline .el-form-item__content {
    width: 200px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 10px;
    .span-title {
      font-size: 12px;
      font-weight: normal;
      margin-left: 10px;
    }
  }
  .invoice-content {
    display: flex;
    flex-wrap: wrap;
    .el-card {
      width: 380px;
      margin: 5px 10px 5px 0px;
      .el-card__body {
        padding: 10px;
      }
    }
  }
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .radio-i {
    display: flex;
    .el-radio {
      line-height: 100px;
    }
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  .el-form {
    position: relative;
    z-index: 10;
    background: #fff;
    width: 80%;
  }
  .content-d {
    padding: 10px 0px;
  }
  .default {
    .el-button {
      padding: 3px;
    }
  }
  .bottom-d {
    display: flex;
    justify-content: flex-start;
    padding: 10px 0px 0px 50px;
    cursor: pointer;
    span {
      margin: 0px 10px;
      color: #ff7300;
    }
  }
  .el-form {
    padding: 10px;
  }
}
</style>
