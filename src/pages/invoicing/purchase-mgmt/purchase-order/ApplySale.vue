<template>
  <div class="apply-sale-content">
    <div class="input-area">
      <el-form size="small" label-width="120px" :inline-message="true">
        <el-form-item label="售后类型：">
          <el-select v-model="typeStr" @change="inputHandle">
            <el-option v-for="option in options" :key="option" :label="option" :value="option"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货数量：" v-if="typeStr==='我要退货退款'||typeStr==='我要退货（无需退款）'">
          <el-input-number size="mini" :min="1" v-model="quantity" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="换货数量：" v-if="typeStr==='我要换货（无需退款）'">
          <el-input-number size="mini" :min="1" v-model="quantity" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="售后原因：">
          <el-select v-model="reasonType">
            <el-option v-for="reasonOption in reasonOptions" :key="reasonOption" :label="reasonOption" :value="reasonOption">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址：" v-if="typeStr==='我要换货（无需退款）'">
          <el-card @click.native="clickAdress">
            <div class="left">
              <div class="address">
                <div class="receiver-address">
                  <span>{{getAddress?getAddress.consignee:''}}</span>
                  <span style="margin-left:10px">{{getAddress?getAddress.phone:''}}</span>
                </div>
                <div class="icon">
                  <span>
                    <i class="el-icon-location-outline"></i>
                    {{getAddress?(getAddress.areaName+getAddress.address):'请设置收货地址'}}
                  </span>
                  <span style="float:right">
                    <i class="right-arrow iconfont biz-icon-i-web-zk1"></i>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <i class="right-arrow iconfont icon-i-sh-man-tz"></i>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="退款金额：" v-if="typeStr==='我要退货退款'||typeStr==='我要退款（无需退货）'">
          <el-input :disabled="disableInput" type="text" v-model="amount"></el-input>
        </el-form-item>
        <el-form-item label="售后说明：">
          <el-input placeholder="请输入退款说明" v-model="explain" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="上传图片：">
          <img-uploader v-model="files"></img-uploader>
          <span>当前仅支持.jpeg .jpg .png格式，大小10M以内</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onConfirm" size="mini" v-if="hasAuthEdit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogVisiable" append-to-body custom-class="bill-dialog">
      <bill-info style="margin-top: 15px;" @selectedItem="selectedItem"></bill-info>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import BillInfo from './components/BillInfo';
export default {
  name: 'ApplySale',
  data() {
    return {
      editable: false,
      files: [],
      typeStr: '我要退款（无需退货）',
      options: ['我要退款（无需退货）', '我要退货退款', '我要换货（无需退款）', '我要退货（无需退款）'],
      reasonType: '多拍/错拍/不想要',
      reasonOptions: ['多拍/错拍/不想要', '快递无跟踪记录', '空包裹/少货'],
      amount: '',
      explain: '',
      quantity: '',
      id: '', // 退款退货id
      disabled: false,
      uploadimgs: 0,
      disableInput: false,
      dialogVisiable: false,
      getAddress: {},
      depotReceiver: ''
    };
  },
  props: {
    isEditable: {
      type: Boolean,
      default: true
    },
    itemId: {
      type: String,
      default: ''
    }
  },
  components: { ImgUploader, BillInfo },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderInfo', 'curApplySaleItem']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:purchaseApplication.edit');
    },
    images() {
      let array = [];
      for (const file of this.files) {
        array.push(file);
      }
      return array;
    },
    type() {
      return this.options.indexOf(this.typeStr).toString();
    }
  },
  watch: {
    itemId(oval, nval) {
      this.changeValue();
      this.getAddressList();
    },
    isEditable(nval, oval) {}
  },
  mounted() {
    this.amount = this.curApplySaleItem.maxAmountRefundable;
    this.quantity = this.curApplySaleItem.quantity;
    this.disableInput = Number(this.curApplySaleItem.minAmountRefundable) === Number(this.curApplySaleItem.maxAmountRefundable);
    this.getAddressList();
  },
  methods: {
    changeValue() {
      this.amount = this.curApplySaleItem.maxAmountRefundable;
      this.quantity = this.curApplySaleItem.quantity;
      this.disableInput = Number(this.curApplySaleItem.minAmountRefundable) === Number(this.curApplySaleItem.maxAmountRefundable);
    },
    getAddressList() {
      let params = {
        clientType: '2',
        userId: this.getUser.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(urls.hypermarketMgmt.receiverList, params)
        .then(data => {
          if (data.receivers.length > 0) {
            this.depotReceiver = data.receivers[0].id;
            this.getAddress = data.receivers[0];
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
    inputHandle() {
      if (this.typeStr === this.options[0]) {
        this.reasonType = '多拍/错拍/不想要';
        this.reasonOptions = ['多拍/错拍/不想要', '快递无跟踪记录', '空包裹/少货'];
      } else if (this.typeStr === this.options[1]) {
        this.reasonType = '质量问题';
        this.reasonOptions = ['质量问题', '颜色/款式/图案与描述不符', '商家发错货'];
      } else if (this.typeStr === this.options[2]) {
        this.reasonType = '质量问题';
        this.reasonOptions = ['质量问题', '商家发错货'];
      } else if (this.typeStr === this.options[3]) {
        this.reasonType = '质量问题';
        this.reasonOptions = ['质量问题', '多拍/错拍/不想要'];
      }
    },
    fileSuccess(file) {
      console.log(file.response.urls[0]);
    },
    onConfirm() {
      if (!this.typeStr) {
        this.$message.warning('请输入售后类型');
        return;
      }
      if (!this.reasonType) {
        this.$message.warning('请输入售后原因');
        return;
      }
      if (!this.amount) {
        this.$message.warning('请输入退款金额');
        return;
      } else {
        let reg = /^\d+(?=\.{0,1}\d+$|$)/;
        if (!reg.test(this.amount)) {
          this.$message.warning('请输入合法数字');
          return;
        }
      }

      if (!this.isEditable) {
        this.updateRefunds();
      } else {
        this.refundsHandle();
      }
    },
    showToast(str) {
      this.$createToast({
        time: 1000,
        txt: str,
        type: 'warn'
      }).show();
    },
    refundsHandle() {
      let param = {
        orderId: this.curApplySaleItem.orderId,
        orderItem: {
          id: this.curApplySaleItem.id,
          quantity: this.curApplySaleItem.quantity,
          product: {
            id: this.curApplySaleItem.productId
          }
        },
        type: this.options.indexOf(this.typeStr).toString(),
        reason: this.reasonType,
        amount: this.amount,
        quantity: this.quantity,
        depotReceiver: this.depotReceiver,
        explain: this.explain,
        images: this.images,
        methodName: 'AddRefunds',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        receiverId: this.getAddress.id
      };
      http
        .post(urls.hypermarketMgmt.refunds, param)
        .then(data => {
          console.log('申请成功', data);
          this.$message.success('申请成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    // 修改申请
    updateRefunds() {
      let param = {
        amount: this.amount,
        quantity: this.quantity,
        depotReceiver: this.depotReceiver,
        refundsId: this.id,
        type: this.type,
        reason: this.reasonType,
        explain: this.explain,
        methodName: 'UpdateRefunds',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        images: this.images,
        receiverId: this.getAddress.id
      };

      http
        .put(urls.hypermarketMgmt.refunds, param)
        .then(data => {
          console.log('修改申请成功', data);
          this.$message.success('修改申请成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {});
    },
    queryRefunds(id) {
      let param = {
        clientType: '2',
        methodName: 'QueryRefunds',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        id: id
      };

      http
        .get(urls.hypermarketMgmt.refunds, param)
        .then(data => {
          console.log('修改申请', data);
          this.typeStr = this.options[data.refunds.type];
          this.inputHandle();
          this.reasonType = data.refunds.reason;
          this.amount = data.refunds.amount;
          this.explain = data.refunds.explain;
          this.id = data.refunds.id;

          let ary = data.refunds.images;
          let len = ary.length;
          let file;
          for (let i = 0; i < len; i++) {
            this.files.push(file);
          }
          this.uploadimgs = len;
        })
        .catch(() => {})
        .finally(() => {});
    },
    getParams(id) {
      if (!this.isEditable) {
        this.queryRefunds(id);
      }

      // 卖家未发货的情况下，没有退货选项
      if (
        (this.orderInfo.paymentStatus === '1' || this.orderInfo.paymentStatus === '2') &&
        this.orderInfo.shippingStatus === '0'
      ) {
        this.options = ['我要退款（无需退货）'];
      } else if (this.orderInfo.shippingStatus === '0' && this.orderInfo.paymentStatus === '0') {
        this.options = ['我要退货（无需退款）'];
      } else if (this.orderInfo.shippingStatus !== '0' && this.orderInfo.paymentStatus === '0') {
        this.options = ['我要退货（无需退款）', '我要换货（无需退款）'];
      } else {
        this.options = ['我要退款（无需退货）', '我要退货退款', '我要换货（无需退款）'];
      }
    },
    onFinishUpload() {
      this.disabled = false;
    },
    onFileUploading() {
      this.disabled = true;
    },
    clickAdress() {
      this.dialogVisiable = true;
    },
    selectedItem(val) {
      this.dialogVisiable = false;
      this.getAddress = val;
      this.depotReceiver = val.id;
    }
  },
  created() {}
};
</script>

<style lang="scss">
.apply-sale-content {
  .el-button {
    float: right;
  }
  height: calc(100% - 45px);
  .input-area {
    padding: 0 10px;
    padding-bottom: 5px;
    background-color: #fff;
    margin: 10px 0;
  }
  .content-div {
    background: #ffffff;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 10px;

    .label {
      display: block;
      width: 25%;
      font-size: 14px;
    }
    .add-input {
      width: 72%;
    }

    input {
      text-align: right;
    }

    button {
      background: #ff7300;
    }
  }
}
</style>
