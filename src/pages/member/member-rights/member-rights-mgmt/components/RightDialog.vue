<template>
  <el-dialog class="biz-dialog-selector" :title="title" :visible.sync="dialogVisible" :append-to-body="true" width="45%"
    @close="close">
    <biz-grid class="coupon-mgmt">
      <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
      <el-form v-loading="loading" :rules="rules" ref="form" :model="coupon" label-width="110px" size="small">
        <el-form-item label="券类型" v-if="mode==='coupon'">
          <el-select v-model="coupon.type" popper-class="selectClass" style="width: 270px;">
            <el-option :label="type.label" :value="type.value" :key="index" v-for="(type,index) of typeOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权益券名称" prop="name" v-if="mode==='coupon'">
          <el-input placeholder="请输入权益券名称，示例：100元抵扣券" maxlength="15" v-model="coupon.name" style="width: 270px;"></el-input>
        </el-form-item>
        <el-form-item label="请输入面值" prop="amount" v-if="mode==='coupon'">
          <el-input-number v-model="coupon.amount" :min="1" placeholder="请输入面值，示例：98"></el-input-number>
        </el-form-item>
        <el-form-item label="使用门槛" prop="minimumPrice" v-if="mode==='coupon'">
          <el-radio v-model="coupon.isRequirement" label="0" @change="isRequirementChange">不限制</el-radio>
          <el-radio v-model="coupon.isRequirement" label="1">满(元)可用</el-radio>
          <el-input v-model="coupon.minimumPrice" v-if="coupon.isRequirement === '1'">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用时间限制" prop="dateLimitWay" v-if="mode==='coupon'">
          <el-radio-group v-model="coupon.dateLimitWay" @change="dateLimitWayChange" style="line-height: 20px;vertical-align: text-top;">
          <el-radio label="0">长期有效</el-radio>
          <el-radio label="1">获得后(天)内有效</el-radio>
          <el-radio label="2">在日期内有效</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="天" prop="limitDays" v-if="coupon.dateLimitWay==='1'">
          <el-input-number v-model="coupon.limitDays" :min="1" placeholder="请输入"></el-input-number>
        </el-form-item>
        <el-form-item prop="endDate" v-if="coupon.dateLimitWay==='2'">
          <el-date-picker type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="coupon.endDate"
           :clearable="false" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="发放频率" prop="issueMode" v-if="mode==='issueMode'">
          <el-radio-group v-model="coupon.issueMode" @change="issueModeChange">
            <el-radio label="0">单次发放</el-radio>
            <el-radio label="1">周期发放</el-radio>
            <el-radio label="2">不限次</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="天" prop="cycleDay" v-if="coupon.issueMode==='1'">
          <el-input-number v-model="coupon.cycleDay" :min="1" placeholder="请输入"></el-input-number>
        </el-form-item>
        <el-form-item label="发放数量" prop="quantity" v-if="mode==='issueMode'&&coupon.issueMode!=='2'">
          <el-input-number v-model="coupon.quantity" :min="1" placeholder="请输入"></el-input-number>
        </el-form-item>
        <el-form-item label="使用规则" prop="description" v-if="mode==='coupon'">
          <el-input v-model="coupon.description" type="textarea" placeholder="请使用规则" style="width: 350px;"></el-input>
        </el-form-item>
      </el-form>
    </biz-grid>
  </el-dialog>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { couponMgmt } from '@/common/urls';
import http from '@/common/http';

function getClearCoupon() {
  return {
    name: '',
    amount: 1,
    isRequirement: '0',
    type: '13',
    minimumPrice: 1,
    dateLimitWay: '0',
    limitDays: '',
    endDate: '',
    issueMode: '0',
    cycleDay: 1,
    quantity: 1,
    description: ''
  };
}

export default {
  name: 'CouponBaseInfo',
  components: {
    BizGrid,
    BizSaveButton
  },
  props: {
    title: {
      require: true,
      type: String,
      default() {
        return ' ';
      }
    },
    couponModel: {
      type: Object,
      default() {
        return {};
      }
    },
    mode: {
      type: String
    },
    visibility: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      coupon: getClearCoupon(),
      typeOptions: [
        {
          label: '权益券',
          value: '13'
        }
      ],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入面值', trigger: 'blur' }],
        dateLimitWay: [{ required: true, message: '请选择使用时间限制', trigger: 'blur' }],
        minimumPrice: [
          {
            required: true,
            pattern: /^[0-9]+\.?[0-9]*$/,
            message: '请输入非负数字',
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.coupon.isRequirement === '1' && !this.coupon.minimumPrice) {
                callback(new Error('请输入使用门槛'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    visibility(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        if (this.couponModel.id) {
          this.coupon = this.couponModel;
        } else {
          this.coupon = getClearCoupon();
        }
      }
    }
  },
  created() {},
  methods: {
    close(e) {
      this.$emit('update:visibility', false);
    },
    operate(name) {
      this[name]();
    },
    isRequirementChange(val) {
      this.coupon.minimumPrice = 1;
      this.$refs.form.clearValidate('minimumPrice');
    },
    issueModeChange(val) {
      this.$set(this.coupon, 'cycleDay', '');
      this.$set(this.coupon, 'quantity', '');
    },
    dateLimitWayChange(val) {
      this.$set(this.coupon, 'endDate', '');
      this.$set(this.coupon, 'limitDays', '');
    },
    save() {
      if (this.coupon.quantity && !/^(0|[1-9][0-9]*)$/.test(this.coupon.quantity)) {
        this.$message.warning('请输入正确的张数');
        return false;
      }
      if (this.coupon.cycleDay && !/^(0|[1-9][0-9]*)$/.test(this.coupon.cycleDay)) {
        this.$message.warning('请输入正确的天数');
        return false;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.create();
        }
      });
    },
    create() {
      this.loading = true;
      let params = this.getCouponObj();
      !this.coupon.id &&
        http
          .post(couponMgmt.baseInfo, params)
          .then(data => {
            this.$message.success('保存成功');
            this.$emit('update', data.data.id);
            this.$emit('update:visibility', false);
          })
          .catch(error => {
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      this.coupon.id &&
        http
          .put(couponMgmt.baseInfo, params)
          .then(data => {
            this.$message.success('保存成功');
            this.$emit('update', data.data.id);
            this.$emit('update:visibility', false);
          })
          .catch(error => {
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    getCouponObj() {
      let coupon = {
        name: this.coupon.name,
        amount: this.coupon.amount.toString(),
        isRequirement: this.coupon.isRequirement,
        type: '13',
        minimumPrice: this.coupon.minimumPrice.toString(),
        issueMode: this.coupon.issueMode,
        dateLimitWay: this.coupon.dateLimitWay,
        limitDays: this.coupon.limitDays,
        endDate: this.coupon.endDate,
        cycleDay: this.coupon.cycleDay.toString(),
        quantity: this.coupon.quantity.toString(),
        description: this.coupon.description,
        id: this.coupon.id
      };
      return coupon;
    }
  }
};
</script>

<style lang="scss">
.coupon-base-info {
}
</style>
