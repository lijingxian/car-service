<template>
  <biz-grid class="invoice-info-supplier" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate" v-if="isEdit&&judgeState">
      <template slot="operation">
        <el-upload
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :data="{type: '0'}"
          :file-list="fileList"
          name="file"
          action="/admin/file/uploads.jhtml"
        >
          <el-button size="small" type="primary" style="margin-left:10px" v-if="invoiceMode">上传电子发票</el-button>
        </el-upload>
      </template>
    </biz-header>

    <div class="invoiceInfo">发票详情</div>
    <el-form ref="formModel" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true">
      <el-form-item label="发票类型" prop="invoiceType">
        <el-select v-model="formModel.invoiceType" placeholder="请选择发票类型" :disabled="true" @change="invoiceTypeChange">
          <el-option label="个人" value="0"></el-option>
          <el-option label="增值税普通发票" value="1"></el-option>
          <el-option label="增值税专用发票" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票抬头" prop="invoiceTitle">
        <el-input v-model="formModel.invoiceTitle" placeholder="请输入发票抬头" :disabled="true"></el-input>
        <el-button @click="selectInvoice" size="mini" type v-if="formModel.invoiceState===''">选择</el-button>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="code" v-if="formModel.invoiceType!=='0'">
        <el-input v-model="formModel.code" placeholder="请输入纳税人识别号" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="发票金额" prop="invoiceAmount">
        <el-input v-model="formModel.invoiceAmount" placeholder="请输入发票金额" :disabled="formModel.invoiceState!==''"></el-input>
      </el-form-item>
      <el-form-item label="注册地址" prop="registerAddress" v-if="formModel.invoiceType!=='0'">
        <el-input v-model="formModel.registerAddress" placeholder="请输入注册地址" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="注册电话" prop="registerMobile" v-if="formModel.invoiceType!=='0'">
        <el-input v-model="formModel.registerMobile" placeholder="请输入注册电话" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="bank" v-if="formModel.invoiceType!=='0'">
        <el-input v-model="formModel.bank" placeholder="请输入开户银行" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="银行账户" prop="account" v-if="formModel.invoiceType!=='0'">
        <el-input v-model="formModel.account" placeholder="请输入银行账户" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="开票时间"
        prop="createDate"
        v-if="formModel.invoiceMode==='0'&&(formModel.invoiceState==='1'||formModel.invoiceState==='2'||formModel.invoiceState==='3')"
      >
        <el-input v-model="formModel.createDate" :disabled="true"></el-input>
      </el-form-item>-->

      <div class="invoiceInfo" style="margin-left:-20px;width:570px">获取方式</div>
      <el-form-item label="发票类型" prop="invoiceMode">
        <el-radio-group v-model="formModel.invoiceMode" :disabled="formModel.invoiceState!==''">
          <el-radio label="0">纸质发票</el-radio>
          <el-radio label="1">电子发票</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formModel.invoiceMode === '1'">
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formModel.email" placeholder="请输入电子邮箱" :disabled="formModel.invoiceState!==''"></el-input>
        </el-form-item>
      </div>
      <div v-if="formModel.invoiceMode === '0'">
        <el-form-item label="是否邮寄" prop="needMail">
          <el-radio-group v-model="formModel.needMail" :disabled="formModel.invoiceState!==''">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 邮寄信息 -->
        <div v-if="formModel.needMail === '1'">
          <el-form-item label="收票人" prop="contacts">
            <el-input v-model="formModel.contacts" placeholder="请输入收票人" :disabled="formModel.invoiceState!==''"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话" prop="mobile">
            <el-input v-model="formModel.mobile" maxlength="13" placeholder="请输入电话" :disabled="formModel.invoiceState!==''"></el-input>
          </el-form-item>
          <el-form-item label="所在地" prop="area">
            <biz-area-select :areaId="formModel.area.id" @areaChanged="areaChanged" :disabled="formModel.invoiceState!==''"></biz-area-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="formModel.address" placeholder="请输入地址" :disabled="formModel.invoiceState!==''"></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="invoiceInfo" v-if="logs && logs.length>0" style="margin-left:-20px;width:570px">发票进度</div>
      <div class="order-track-new" v-if="logs && logs.length>0" style="padding-left:30px;padding-top:15px">
        <el-steps direction="vertical" finish-status="success" space="30px">
          <el-step title="已申请" :status="active==='1'?'success':'wait'">
            <div slot="description">
              <div class="logInfo" v-for="(log, index) in logs" :key="index" v-if="log.type==='0'">
                <span style="font-size:12px;margin-right:10px">{{log.createTime}}</span>
                <span style="font-size:12px;" v-if="log.operator">{{log.operator}}</span>
              </div>
            </div>
          </el-step>
          <el-step title="已开票" :status="active1==='2'?'success':'wait'">
            <div slot="description">
              <div class="logInfo" v-for="(log, index) in logs" :key="index" v-if="log.type==='1'">
                <span style="font-size:12px;margin-right:10px">{{log.createTime}}</span>
                <span style="font-size:12px;" v-if="log.operator">{{log.operator}}</span>
              </div>
            </div>
          </el-step>
          <el-step title="已邮寄" :status="active2==='3'?'success':'wait'">
            <div slot="description">
              <div class="logInfo" v-for="(log, index) in logs" :key="index" v-if="log.type==='2'">
                <span style="font-size:12px;margin-right:10px">{{log.createTime}}</span>
                <span style="font-size:12px;" v-if="log.operator">{{log.operator}}</span>
              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
      <div class="invoiceInfo" v-if="formModel.invoiceMerged === '1'" style="margin-left:-20px;width:570px">合并明细</div>
      <div v-if="formModel.invoiceMerged === '1'" style="margin-top:10px">
        <el-table ref="table" size="small" :data="formModel.purchaseOrders" stripe border highlight-current-row tooltip-effect="dark" style="width: 100%;">
          <el-table-column prop="sn" label="订单编号"></el-table-column>
          <el-table-column prop="amount" label="订单金额">
            <template slot-scope="scope">￥{{scope.row.amount}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-dialog :visible.sync="showInvoiceExpress" center append-to-body custom-class="close-invoice-dialog" title="发票邮寄" v-loading="loading" width="500px">
      <div class="reson-container">
        <span style="margin-left:40px">请填写发票邮寄的物流公司和快递单号信息</span>
        <el-form ref="formModel" size="small" label-width="110px" :model="formModel" :rules="rules" :inline-message="true" style="margin-top:40px">
          <el-form-item label="快递公司" prop="express">
            <el-select v-model="formModel.express" placeholder="请选择快递公司" @change="expressChange" style="width:220px">
              <el-option v-for="delivery in deliverys" :key="delivery.id" :label="delivery.name" :value="delivery.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="expressCode">
            <el-input v-model="formModel.expressCode" placeholder="请输入快递单号" style="width:220px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="close-button" style="text-algin:right">
        <el-button @click="showInvoiceExpress=false" size="mini" type="primary">取消</el-button>
        <el-button @click="statusChange()" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showLogisticsFollowing" center append-to-body custom-class="close-follow-dialog" title="物流跟踪" v-loading="loading">
      <div class="logistic-info">
        <div class="track-list">
          <ul v-if="getTraces">
            <li v-for="shippingTrace of shippingTraces" :key="shippingTrace.id">
              <i class="node-icon"></i>
              <span class="txt">{{shippingTrace.station}}</span>
              <span class="time">{{shippingTrace.happenTime}}</span>
            </li>
          </ul>
          <ul v-if="this.shippingTraces&&this.shippingTraces.length===0">
            <div class="info">
              <div class="i-item">
                物流状态：
                <span class="l-state">{{'暂无轨迹'}}</span>
              </div>
              <div class="i-item">快递公司：{{expressName}}</div>
              <div class="i-item">快递单号：{{expressSn}}</div>
            </div>
          </ul>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisiableInvoice" append-to-body custom-class="bill-dialog">
      <invoice-info-dialog @selectedInvoice="selectedInvoice"></invoice-info-dialog>
    </el-dialog>
    <el-dialog append-to-body class="show-file" :visible="previewInvoice" @close="previewInvoice=false" width="950px">
      <div>
        <img :style="imgStyle" :src="formModel.path" alt />
      </div>
      <div slot="footer" class="close-button" style="text-algin:right">
        <el-upload
          :show-file-list="false"
          :on-success="returnUpload"
          :on-error="handleError"
          :data="{type: '0'}"
          :file-list="fileList"
          :limit="1"
          name="file"
          action="/admin/file/uploads.jhtml"
        >
          <el-button size="small" type="primary">重新上传</el-button>
        </el-upload>
      </div>
    </el-dialog>
    <el-dialog append-to-body class="before-upload" :visible="uploadReview" @close="cancelUplod" width="950px">
      <div>
        <img :style="imgStyle" :src="formModel.path" alt />
      </div>
      <div slot="footer" class="close-button" style="text-algin:right">
        <el-button @click="uploadReview=false" size="mini" type="primary">取消</el-button>
        <el-button size="small" type="primary" @click="conformUpload">确定上传</el-button>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/order-mgmt/orderMgmt';
import BizAreaSelect from '@/components/BizAreaSelect';
import InvoiceInfoDialog from './components/InvoiceInfo';
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
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
    InvoiceInfoDialog,
    BizAreaSelect
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      isFirst: true,
      expressName: '',
      expressSn: '',
      active: '',
      active1: '',
      active2: '',
      active3: '',
      showInvoiceExpress: false,
      showLogisticsFollowing: false,
      dialogVisiableInvoice: false,
      shippingSn: '',
      shippingTraces: [],
      previewInvoice: false,
      uploadReview: false,
      logs: [],
      // 表单信息
      formModel: {
        id: '',
        invoiceType: '',
        invoiceTitle: '',
        price: '',
        code: '',
        registerAddress: '',
        registerMobile: '',
        bank: '',
        account: '',
        invoiceMode: '0',
        invoiceAmount: '',
        createDate: '',
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
      },
      // form: {},
      operations: [
        {
          label: '确认提交',
          name: 'save',
          type: 'primary',
          disabled: false,
          class: 'show'
        },
        {
          label: '撤销',
          name: 'cancel',
          type: 'primary',
          disabled: false,
          class: 'hidden'
        }
      ],
      deliverys: [],
      rules: {
        mobile: [
          {
            required: true,
            message: '电话不能少于5位',
            trigger: 'blur',
            min: 5
          },
          { pattern: /^[-0-9]*$/, message: '请输入数字', trigger: 'blur' }
        ],
        invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        invoiceAmount: [{ required: true, message: '请输入发票金额', trigger: 'blur' }],
        code: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        registerAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
        registerMobile: [{ required: true, message: '请输入注册电话', trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        account: [{ required: true, message: '请输入银行账户', trigger: 'blur' }],
        needMail: [{ required: true, message: '请选择是否邮寄', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入收票人', trigger: 'blur' }],
        number: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        // 'area.id': [{ required: true, message: '请选择所在地', trigger: 'blur' }],
        area: [
          { required: true, message: '请选择所在地', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!this.formModel.area.id) {
                callback(new Error('请选择所在地'));
              } else {
                callback();
              }
            }
          }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        express: [{ required: true, message: '请选择快递公司', trigger: 'blur' }],
        expressCode: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        freight: [{ required: true, message: '请输入物流费用', trigger: 'blur' }]
      }
    };
  },
  watch: {
    open(nVal, oVal) {
      this.formModel = this.clear();
      console.log('11111111111111====');
      if (nVal) {
        this.$refs.formModel.clearValidate();
        console.log(this.invoiceInfoId);
        console.log(this.invoiceId);
        if (this.invoiceInfoId && !this.invoiceId) {
          this.getInvoiceInit();
        } else {
          this.getList();
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderConfim', 'orderInfo', 'curInvoice', 'payment', 'defaultReceive', 'clickItemSelect']),
    judgeState() {
      console.log('invoiceState=' + this.formModel.invoiceState);
      if (this.formModel.invoiceState !== null && this.formModel.invoiceState !== '') {
        if (this.formModel.invoiceState === '2' || this.formModel.invoiceState === '3') {
          return false;
        } else {
          if (this.formModel.needMail === '0' && this.formModel.invoiceState === '1') {
            return false;
          }
        }
      }
      return true;
    },
    invoiceMode() {
      if (this.formModel.invoiceMode === '1' && this.formModel.invoiceState === '0') {
        return true;
      }
      return false;
    },
    showShippinig() {
      // 显示发货信息
      return this.formModel.invoiceState === '1' || this.formModel.invoiceState === '2' || this.formModel.invoiceState === '3';
    },
    getTraces() {
      if (this.shippingTraces && this.shippingTraces.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    imgStyle() {
      return {
        width: '100%',
        height: '100%'
      };
    }
  },
  mounted() {
    console.log('22222222222222====');
    // this.getLogs();
    if (this.invoiceInfoId && !this.invoiceId) {
      this.getInvoiceInit();
    } else {
      this.getList();
    }
  },
  methods: {
    ...mapMutations('Order', ['updateClickItemSelect']),
    clear() {
      return {
        id: '',
        invoiceType: '',
        invoiceTitle: '',
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
    cancelUplod() {
      this.uploadReview = false;
    },
    handleSuccess(res, file, fileList) {
      console.log(res + '1111111');
      if (res.fis && res.fis[0]) {
        this.fileList.push({
          uid: file.uid,
          url: res.fis[0].url
        });
        this.formModel.path = res.fis[0].url;
      }
      this.uploadReview = true;
    },
    conformUpload() {
      this.formModel.orderId = this.itemId;
      this.formModel.invoiceState = '1';
      service.invoiceDetailUpdate(
        this.formModel,
        data => {
          this.$message.success('上传成功');
          this.getList();
          this.$emit('operationSuccess');
          this.uploadReview = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleError(err, file, fileList) {
      if (err) {
        this.$message.warning(err);
      } else {
        this.$message.warning('发生错误');
      }
    },
    selectedInvoice(row) {
      this.dialogVisiableInvoice = false;
      this.formModel.invoiceType = row.invoiceType;
      this.formModel.invoiceTitle = row.invoiceTitle;
      this.formModel.code = row.code;
      this.formModel.registerAddress = row.registerAddress;
      this.formModel.registerMobile = row.registerMobile;
      this.formModel.bank = row.bank;
      this.formModel.account = row.account;
      this.formModel.mobile = row.mobile;
      this.formModel.contacts = row.contacts;
      this.formModel.area.id = row.area.id;
      this.formModel.address = row.address;
    },
    selectInvoice() {
      this.updateClickItemSelect(true);
      this.dialogVisiableInvoice = true;
    },
    cancel() {
      this.formModel.orderId = this.itemId;
      this.formModel.invoiceState = '4';
      service.invoiceDetailUpdate(
        this.formModel,
        data => {
          this.$message.success('撤销成功');
          this.formModel.invoiceState = '';
          this.getList();
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    expressInfo() {
      let param = {
        userId: this.userId,
        shippingSn: this.shippingSn,
        shopId: this.getUser.shop.id
      };
      http
        .get('/admin/purchaseOrder/logistics.jhtml', param)
        .then(data => {
          this.shippingTraces = data.shipping.shippingTraces;
          this.expressSn = data.shipping.expressSn;
          this.loading = false;
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          this.loading = false;
        });
    },
    statusChange() {
      this.formModel.orderId = this.itemId;
      this.formModel.invoiceState = '2';
      service.invoiceDetailUpdate(
        this.formModel,
        data => {
          this.$message.success('保存成功');
          this.showInvoiceExpress = false;
          this.getList();
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    returnUpload(res, file, fileList) {
      if (res.fis && res.fis[0]) {
        this.fileList.push({
          uid: file.uid,
          url: res.fis[0].url
        });
        this.formModel.path = res.fis[0].url;
        this.formModel.orderId = this.itemId;
        this.formModel.invoiceState = '1';
        service.invoiceDetailUpdate(
          this.formModel,
          data => {
            this.$message.success('上传成功');
            this.previewInvoice = false;
            this.getList();
            this.$emit('operationSuccess');
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      }
    },
    invoiceTypeChange() {
      this.$refs.formModel.clearValidate('invoiceType');
    },
    expressChange() {
      this.$refs.formModel.clearValidate('express');
    },
    getLogs() {
      let param = {
        userId: this.userId,
        orderId: this.itemId
      };

      http
        .get('/rest/invoice/invoice.jhtml', param)
        .then(data => {
          this.logs = data.invoice.logs;
          this.active = '';
          this.active1 = '';
          this.active2 = '';
          if (data.invoice.logs && data.invoice.logs.length > 0) {
            data.invoice.logs.forEach((item, index) => {
              if (item.type === '0') {
                this.active = '1';
              }
              if (item.type === '1') {
                this.active1 = '2';
              }
              if (item.type === '2') {
                this.active2 = '3';
              }
            });
          }
          this.shippingSn = data.invoice.shippingSn;
        })
        .catch(err => {
          console.log('ERR: ', err);
        })
        .finally(() => {});
    },
    areaChanged(val) {
      this.formModel.area.id = val;
      // 默认北京
      if (this.isFirst) {
        this.formModel.area.id = '1568';
        this.isFirst = false;
      }
    },
    getInvoiceInit() {
      service.invoiceInfoDefault(
        // 用户默认发票模版
        {
          userId: this.userId || ''
        },
        data => {
          this.formModel = Object.assign(this.clear(), data.invoiceInfo);
          console.log('this.price');
          this.$set(this.formModel, 'invoiceAmount', this.price);
          this.$set(this.formModel, 'invoiceMode', '0');
          this.operations[1].class = 'hidden';
          this.operations[0].label = '确认提交';
          this.logs = [];
          if (!this.formModel.area.id) this.formModel.area.id = '1568';
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
          console.log('code错误');
        }
      );
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      service.invoiceByOrder(
        // 订单查询发票信息
        {
          orderId: this.itemId || ''
        },
        data => {
          this.formModel = Object.assign(this.clear(), data.invoice);
          if (this.formModel.invoiceMode === '0') {
            if (!this.formModel.invoiceState) {
              this.operations[0].label = '确认提交';
              this.operations[0].class = 'show';
              this.operations[1].class = 'hidden';
            } else if (this.formModel.invoiceState === '0') {
              this.operations[0].label = '确认已开票';
              this.operations[0].class = 'show';
              this.operations[1].label = '撤销';
              this.operations[1].class = 'show';
            } else if (this.formModel.invoiceState === '1') {
              this.operations[0].label = '邮寄';
              this.operations[0].class = 'show';
              this.operations[1].class = 'hidden';
            } else if (this.formModel.invoiceState === '2') {
              this.operations[0].label = '物流跟踪';
              this.operations[0].class = 'show';
              this.operations[1].class = 'hidden';
            } else if (this.formModel.invoiceState === '4') {
              this.operations[0].label = '确认提交';
              this.operations[0].class = 'show';
              this.operations[1].label = '已撤销';
              this.operations[1].class = 'show';
              this.formModel.invoiceState = '';
            } else {
              this.operations[1].class = 'hidden';
            }
          } else {
            if (!this.formModel.invoiceState) {
              this.operations[0].label = '确认提交';
              this.operations[0].class = 'show';
              this.operations[1].class = 'hidden';
            } else if (this.formModel.invoiceState === '0') {
              this.operations[0].label = '';
              this.operations[1].label = '撤销';
              this.operations[1].class = 'show';
              this.operations[0].class = 'hidden';
            } else if (this.formModel.invoiceState === '5') {
              this.operations[0].label = '查看电子发票';
              this.operations[0].class = 'show';
              this.operations[1].class = 'hidden';
            } else if (this.formModel.invoiceState === '4') {
              this.operations[0].label = '确认提交';
              this.operations[0].class = 'show';
              this.operations[1].label = '已撤销';
              this.operations[1].class = 'show';
              this.formModel.invoiceState = '';
            } else {
              this.operations[1].class = 'hidden';
            }
          }
          if (!this.formModel.area.id) this.formModel.area.id = '1568';
          this.deliverys = data.deliverys;
          this.deliverys.map(item => {
            if (item.id === data.invoice.express) {
              this.expressName = item.name;
            }
          });
          this.getLogs();
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.formModel = this.clear();
          this.loading = false;
        }
      );
    },
    handleOperate(name) {
      this[name]();
    },
    save() {
      this.$refs.formModel.validate(valid => {
        if (valid) {
          this.loading = true;
          console.log('id=');
          console.log(this.formModel.id);
          this.$set(this.formModel, 'orderIds', this.orderIds);
          if (!this.formModel.id) {
            this.formModel.invoiceState = '0';
            // 发票id为空
            this.formModel.orderId = this.itemId;
            service.invoiceDetailCreate(
              this.formModel,
              data => {
                this.$message.success('保存成功');
                this.getList();
                this.$emit('operationSuccess');
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            if (this.formModel.invoiceMode === '0') {
              if (this.formModel.invoiceState === '0') {
                this.formModel.invoiceState = '1';
              } else if (this.formModel.invoiceState === '1') {
                this.formModel.invoiceState = '2';
              } else if (this.formModel.invoiceState === '2') {
                this.formModel.invoiceState = '3';
              } else {
                this.formModel.invoiceState = '0';
              }
            } else {
              if (this.formModel.invoiceState === '0') {
                this.formModel.invoiceState = '1';
              } else if (this.formModel.invoiceState === '4' || this.formModel.invoiceState === '') {
                this.formModel.invoiceState = '0';
              }
            }
            if (this.formModel.invoiceMode === '0') {
              if (this.formModel.invoiceState === '2') {
                this.formModel.express = '';
                this.formModel.expressCode = '';
                this.loading = false;
                this.showInvoiceExpress = true;
              } else if (this.formModel.invoiceState === '3') {
                this.formModel.invoiceState = '2';
                this.expressInfo();
                this.showLogisticsFollowing = true;
              } else {
                this.formModel.orderId = this.itemId;
                service.invoiceDetailUpdate(
                  this.formModel,
                  data => {
                    this.$message.success('保存成功');
                    this.getList();
                    this.$emit('operationSuccess');
                    this.loading = false;
                  },
                  // result_code 不是100的处理
                  ErrorData => {
                    this.loading = false;
                    this.$message.warning(ErrorData.errorMessage);
                    if (this.formModel.invoiceState === '3') {
                      this.formModel.invoiceState = '2';
                    } else if (this.formModel.invoiceState === '2') {
                      this.formModel.invoiceState = '1';
                    } else if (this.formModel.invoiceState === '1') {
                      this.formModel.invoiceState = '0';
                    } else {
                      this.formModel.invoiceState = '0';
                    }
                  }
                );
              }
            } else {
              if (this.formModel.invoiceState === '5') {
                this.getList();
                this.previewInvoice = true;
                this.loading = false;
              } else {
                this.formModel.orderId = this.itemId;
                service.invoiceDetailUpdate(
                  this.formModel,
                  data => {
                    this.$message.success('保存成功');
                    this.getList();
                    this.$emit('operationSuccess');
                    this.loading = false;
                  },
                  // result_code 不是100的处理
                  ErrorData => {
                    this.loading = false;
                    this.$message.warning(ErrorData.errorMessage);
                    // if (this.formModel.invoiceState === '3') {
                    //   this.formModel.invoiceState = '2';
                    // } else if (this.formModel.invoiceState === '2') {
                    //   this.formModel.invoiceState = '1';
                    // } else if (this.formModel.invoiceState === '1') {
                    //   this.formModel.invoiceState = '0';
                    // } else {
                    //   this.formModel.invoiceState = '0';
                    // }
                  }
                );
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.invoice-info-supplier {
  .el-form {
    padding: 0px 20px;
  }
  .biz-header {
    padding: 5px 20px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .invoiceInfo {
    background: #f8f8f8;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    padding-left: 20px;
    text-align: left;
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  // .el-select {
  //   width: 100%;
  // }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .header_bean {
    position: absolute;
    right: 0px;
    top: 10px;
    color: #606266;
    font-size: 14px;
  }
}
.close-follow-dialog {
  .logistic-info {
    background-color: #fefefe;
    height: calc(100% - 75px);
    ul li {
      list-style: none;
    }
    .track-list {
      margin: 0 10px;
      padding-left: 5px;
      padding-bottom: 10px;
      position: relative;
      ul {
        li:not(:last-child)::after {
          content: '';
          position: absolute;
          z-index: 1;
          pointer-events: none;
          background-color: #d9d9d9;
          width: 1px;
          top: 26px;
          left: -1px;
          bottom: -18px;
        }
        li:not(:first-child)::before {
          content: '';
          position: absolute;
          z-index: 1;
          pointer-events: none;
          background-color: #e7e7e7;
          height: 1px;
          left: 25px;
          right: 0;
        }
        li {
          position: relative;
          padding: 8px 0 0 25px;
          line-height: 18px;
          color: #999;
          .node-icon {
            position: absolute;
            left: -6px;
            top: 15px;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #b7b7b7;
            border: #e0e0e0 solid 3px;
          }
          .time {
            margin-right: 20px;
            position: relative;
            top: 4px;
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            color: #999;
          }
          .txt {
            color: #333;
            position: relative;
            top: 4px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        li:first-child {
          .node-icon {
            background: red;
            border: #ffa4a4 solid 3px;
          }
          .txt {
            color: red;
          }
        }
        li:first-child::after {
          background: linear-gradient(0deg, #e8e8ed, #e64b4e);
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .l-state {
          color: red;
        }
      }
    }
  }
}
</style>
