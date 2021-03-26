<template>
  <div class="logistic-info-content">
    <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" :inline-message="true">
      <el-form-item label="物流公司" prop="deliveryId">
        <el-select v-model="form.deliveryId">
          <el-option v-for="(deliveryOption,index) in deliveryOptions" :key="index" :label="deliveryOption.name" :value="deliveryOption.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="trackingNo">
        <el-input type="text" v-model="form.trackingNo"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input type="text" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="退款说明" prop="explain">
        <el-input type="textarea" v-model="form.explain"></el-input>
      </el-form-item>
      <el-form-item label>
        <img-uploader v-model="form.files"></img-uploader>
      </el-form-item>
      <biz-save-button :operations="formOperations" @operate="operate"></biz-save-button>
    </el-form>
  </div>
</template>

<script>
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters, mapMutations } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'LogisticInfo',
  data() {
    return {
      deliveryOptions: [],
      formOperations: [{ label: '提交退货物流信息', name: 'onConfirm', type: 'primary', auth: ['admin:purchaseOrder.edit'] }],
      rules: {
        deliveryId: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
        trackingNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            pattern: /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '电话号格式错误',
            trigger: 'blur'
          }
        ],
        explain: [{ required: true, message: '请输入退款说明', trigger: 'blur' }]
      },
      form: this.getDetaultModel()
    };
  },
  props: {
    refundsId: {
      type: String,
      default: ''
    }
  },
  components: { ImgUploader, BizSaveButton },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Order', ['orderInfo', 'curApplySaleItem'])
  },
  watch: {},
  created() {
    this.getDeliveries();
  },
  methods: {
    ...mapMutations('Order', ['updateRefundsInfo']),
    fileSuccess(file) {
      console.log(file.response.urls[0]);
    },
    getDetaultModel() {
      return {
        deliveryId: '',
        files: [],
        trackingNo: '',
        mobile: '',
        explain: ''
      };
    },
    operate(name) {
      this[name]();
    },
    onConfirm() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.submitLogisticInfo();
        }
      });
    },
    getDeliveries() {
      let param = {
        methodName: 'ListDeliveryCorp',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        type: '0' // 国内的
      };
      http.get(urls.hypermarketMgmt.deliveryCorpsByType, param).then(data => {
        this.deliveryOptions = data.deliveryCorps;
      });
    },
    getLogisticsInfo() {
      let param = {
        methodName: 'QueryRefunds',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id,
        orderItemId: this.curApplySaleItem.id
      };
      http
        .get(urls.hypermarketMgmt.refunds, param)
        .then(data => {
          console.log('退款详情', data);
          this.updateRefundsInfo(data);
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        });
    },
    submitLogisticInfo() {
      let param = {
        orderId: this.curApplySaleItem.orderId,
        // 退款退货Id
        refundsId: this.refundsId,
        orderItem: {
          id: this.curApplySaleItem.id,
          quantity: this.curApplySaleItem.quantity,
          product: {
            id: this.curApplySaleItem.productId
          }
        },
        // 物流 公司Id
        deliveryId: this.form.deliveryId,
        // 物流
        delivery: this.form.delivery,
        // 物流单号
        trackingNo: this.form.trackingNo,
        mobile: this.form.mobile,
        explain: this.form.explain,
        images: this.form.files,
        methodName: 'AddReturns',
        clientType: '2',
        shopId: this.getUser.shop.id,
        userId: this.getUser.id
      };
      http
        .post(urls.hypermarketMgmt.returns, param)
        .then(data => {
          console.log('填写物流成功', data);
          this.$message.success('操作成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          if (error.errorMessage !== '') {
            this.$message.warning(error.errorMessage);
          }
        });
    }
  }
};
</script>

<style lang="scss">
.logistic-info-content {
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

.submitBtn {
  position: absolute;
  bottom: 0;
}
</style>
