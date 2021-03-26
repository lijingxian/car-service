<template>
  <biz-grid class="payInfo" v-loading="loading">
    <div class="price-label">
      <span class="price-title">已付款金额</span>
      <el-input v-model="amountPaid" :disabled="true">
        <template slot="append">元</template>
      </el-input>
    </div>
    <div class="price-label">
      <span class="price-title">本次付款金额</span>
      <el-input v-model="amount">
        <template slot="append">元</template>
      </el-input>
    </div>
    <div class="content-item" v-for="paymentType of paymentTypes" :key="paymentType.id">
      <div class="radio-class">
        <el-radio size="mini" v-model="radio" :label="paymentType.type">
          <span></span>
        </el-radio>
      </div>
      <div class="item">
        <img v-if="paymentType.icon" :src="paymentType.icon" width="30" height="30" style="margin: 10px;" />
        <img v-else :src="vfacLogo" width="50" height="50" />
        <div>{{paymentType.name}}</div>
        <div v-if="paymentType.type==='2'&&radio==='2'">
          <el-select v-model="memberCardId" placeholder="请选择会员卡" size="mini">
            <el-option v-for="memberCard in paymentType.memberCards" :key="memberCard.id" :label="memberCard.name" :value="memberCard.id"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-form label-width="140px" size="small" ref="form" :model="form" :rules="rules">
      <el-form-item label="会员卡支付密码" prop="password" v-if="radio==='2'">
        <div style="display:flex;">
          <el-input type="password" v-model="form.password" maxlength="6" minlength="6"></el-input>
          <el-button type="text" @click="setPass" size="mini" v-if="form.hasSetPayPassword==='0'&&radio==='2'">设置密码</el-button>
        </div>
      </el-form-item>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" title="设置支付密码" width="40%" append-to-body>
      <div class="valid-div">
        <el-form label-width="140px" size="small" ref="formPass" :model="formPass" :rules="rulesPass">
          <el-form-item label="请输入支付密码" prop="pass">
            <el-input type="password" v-model="formPass.pass" placeholder="请输入支付密码" size="mini" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="请确认支付密码" prop="checkpass">
            <el-input type="password" v-model="formPass.checkpass" placeholder="请确认支付密码" size="mini" maxlength="6"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmByDialog" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import vfacLogo from '@/assets/images/default_user.png';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
export default {
  components: {
    BizGrid
  },
  data() {
    // 密码校验Start
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入支付密码'));
      } else {
        if (this.formPass.checkpass !== '') {
          this.$refs.formPass.validateField('checkpass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认支付密码'));
      } else if (value !== this.formPass.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      vfacLogo: vfacLogo,
      radio: '7',
      memberCardId: '',
      paymentTypes: [],
      nbzz: true,
      hykye: false,
      loading: false,
      dialogVisible: false,
      form: {
        hasSetPayPassword: '',
        password: ''
      },
      formPass: {
        pass: '',
        checkpass: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      rulesPass: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 6,
            message: '长度为6位数字',
            trigger: 'blur'
          }
        ],
        checkpass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    amountPaid: {
      type: String,
      default: ''
    },
    amountPayable: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    orderId(nval, oval) {
      if (nval) {
        this.getPaymentType();
        this.form.password = '';
        this.radio = '7';
      }
    }
  },
  methods: {
    getPaymentType() {
      let params = {
        shopId: this.getUser.shop.id,
        orderId: this.orderId,
        userId: this.getUser.id
      };
      http
        .get('/admin/purchaseOrder/paymentTypes.jhtml', params)
        .then(data => {
          this.paymentTypes = data.paymentTypes;
          this.form.hasSetPayPassword = data.hasSetPayPassword;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    setPass() {
      this.formPass.pass = '';
      this.formPass.checkpass = '';
      this.dialogVisible = true;
    },
    confirmByDialog() {
      this.$refs.formPass.validate((valid, a) => {
        if (valid) {
          let params = {
            type: '2',
            userNewPwd: this.formPass.pass,
            userPwd: this.formPass.checkpass,
            clientType: '2',
            methodName: 'BalancePayment',
            shopId: this.getUser.shop.id,
            userId: this.getUser.id
          };
          this.loading = true;
          http
            .put('/rest/member/password.jhtml', params)
            .then(data => {
              this.$message.success('支付密码设置成功');
              this.loading = false;
              this.dialogVisible = false;
            })
            .catch(errData => {
              console.log(errData);
              this.loading = false;
              this.$message.warning(errData.errorMessage);
            });
        }
      });
    },
    confirm() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (Number(this.amount) < 0) {
            this.$message.warning('本次付款金额不能为负数');
            return false;
          }
          if (!/^[0-9]+\.?[0-9]*$/.test(this.amount)) {
            this.$message.warning('本次付款金额格式错误!');
            return false;
          }
          if (Number(this.amount) > this.amountPayable) {
            this.$message.warning('本次付款金额大于需付款金额!');
            return false;
          }
          if (this.radio === '2' && !this.memberCardId) {
            this.$message.warning('请选择会员卡');
            return;
          }
          let params = {
            amount: this.amount,
            orderId: this.orderId,
            memberCardId: this.memberCardId,
            password: this.form.password,
            methodName: 'BalancePayment',
            clientType: '2',
            shopId: this.getUser.shop.id,
            userId: this.getUser.id
          };
          this.loading = true;
          if (this.radio === '2') {
            http
              .post(urls.hypermarketMgmt.balancePayment, params)
              .then(data => {
                this.$message.success('支付成功');
                this.loading = false;
                this.$emit('operateSuccess');
              })
              .catch(errData => {
                console.log(errData);
                this.loading = false;
                this.$message.warning(errData.errorMessage);
              });
          } else {
            http
              .post(urls.hypermarketMgmt.internalTransferPayment, params)
              .then(data => {
                this.$message.success('支付成功');
                this.loading = false;
                this.$emit('operateSuccess');
              })
              .catch(errData => {
                console.log(errData);
                this.loading = false;
                this.$message.warning(errData.errorMessage);
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.payInfo {
  .content-item {
    display: flex;
    font-size: 12px;
    align-items: center;
    img {
      border-radius: 50%;
    }
    .item {
      display: flex;
      div {
        line-height: 50px;
        margin-left: 20px;
      }
    }
    .radio-class {
      line-height: 50px;
    }
    .radio {
      line-height: 50px;
    }
  }
  .el-button {
    float: right;
  }
  .price-label {
    display: flex;
    margin-bottom: 10px;
    text-align: right;
    align-items: center;
    .price-title {
      font-size: 14px;
      color: #606266;
      display: inline-block;
      padding-right: 10px;
      width: 120px;
    }
    .el-input {
      width: 70%;
      font-size: 13px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-input-group {
      width: 200px;
    }
  }
}
</style>
