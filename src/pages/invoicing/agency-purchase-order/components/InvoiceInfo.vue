<template>
  <biz-grid class="invoice-info-order">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-card v-for="invoice in invoiceList" :key="invoice.id">
      <div @click="selectItem(invoice)">
        <div>
          <span>发票抬头：</span>
          <span>{{invoice.invoiceTitle}}</span>
        </div>
        <div>
          <span>联系人：</span>
          <span>{{invoice.contacts}}</span>
        </div>
        <div class="top">
          <div>
            <span>联系电话：</span>
            <span>{{invoice.mobile}}</span>
          </div>
          <div>
            <span>
              <el-checkbox v-model="invoice.isDefault" true-label="1" false-label="0" size="mini" @change="setDefault(invoice)"></el-checkbox>
            </span>
          </div>
        </div>
        <div class="content">
          <span>详细地址：</span>
          <span>{{invoice.areaName + invoice.address}}</span>
        </div>
        <div class="bottom">
          <span @click="editForm(invoice)">编辑</span>
          <span @click="deleteForm(invoice.id)">删除</span>
        </div>
      </div>
    </el-card>
    <div v-if="invoiceList.length === 0" :style="styleObject"></div>
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
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters, mapMutations } from 'vuex';
import BizAreaSelect from '@/components/BizAreaSelect';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  components: {
    BizGrid,
    BizSaveButton,
    BizAreaSelect
  },
  data() {
    return {
      invoiceList: [],
      showForm: false,
      operations: [{ label: '新增', name: 'add', type: 'primary' }],
      formOperations: [{ label: '保存', name: 'save', type: 'primary' }, { label: '取消', name: 'cancel', type: 'primary' }],
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
      },
      form: this.getDetaultModel()
    };
  },
  computed: {
    ...mapGetters(['getUser']),
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
  methods: {
    ...mapMutations('Order', ['updateCurInvoice']),
    operate(name) {
      this[name]();
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
        invoiceType: '',
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
    cancel() {
      this.showForm = false;
    },
    editForm(row) {
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
      this.$confirm('是否确认删除收货地址?', '提示', {
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
        userId: this.getUser.id,
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
            this.updateCurInvoice(this.form);
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
        userId: this.getUser.id,
        shopId: this.getUser.shop.id,
        invoice: this.form
      };
      http
        .put(urls.hypermarketMgmt.invoiceInfo, params)
        .then(data => {
          this.$message.success('设置成功');
          this.query();
          this.$emit('selectedItem');
          this.showForm = false;
          if (this.form.isDefault === '1') {
            this.updateCurInvoice(this.form);
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
    selectItem(invoice) {
      console.log(invoice);
      this.$emit('selectedItem');
      this.updateCurInvoice(invoice);
    },
    handleAreaChanged(areaId) {
      this.form.area.id = areaId;
    },
    query() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.invoiceInfos, params)
        .then(data => {
          this.invoiceList = data.invoices;
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
.el-dialog__headerbtn {
  z-index: 1;
}
.invoice-info-order {
  color: #666666;
  font-size: 14px;
  padding: 20px;
  .top {
    display: flex;
    justify-content: space-between;
  }
  .content {
    border-bottom: 1px dotted #e1e1e1;
    padding: 10px 0px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    padding: 10px 0px 0px 0px;
    cursor: pointer;
  }
  .el-form {
    padding: 10px;
  }
}
</style>
