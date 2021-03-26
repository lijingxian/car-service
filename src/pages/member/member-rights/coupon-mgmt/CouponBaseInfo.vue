<template>
  <biz-grid class="coupon-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <el-form v-loading="loading" :rules="rules" ref="form" :model="coupon" label-width="110px" size="small" :inline-message="true">
      <el-form-item label="券类型">
        <el-select v-model="coupon.type" :disabled="!isCreated" popper-class="selectClass">
          <el-option :label="type.label" :value="type.value" :key="index" v-for="(type,index) of typeOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益券名称" prop="name">
        <el-input placeholder="请输入权益券名称，示例：100元抵扣券" maxlength="15" v-model="coupon.name"></el-input>
      </el-form-item>
      <el-form-item label="请输入面值" prop="amount">
        <el-input-number v-model="coupon.amount" :min="1" placeholder="请输入面值，示例：98"></el-input-number>
      </el-form-item>
      <el-form-item label="使用门槛" prop="minimumPrice">
        <el-radio v-model="coupon.isRequirement" label="0" @change="isRequirementChange">不限制</el-radio>
        <el-radio v-model="coupon.isRequirement" label="1">满(元)可用</el-radio>
        <el-input v-model="coupon.minimumPrice" v-if="coupon.isRequirement === '1'">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用时间限制" prop="dateLimitWay">
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
      <el-form-item label="使用规则" prop="description">
        <el-input v-model="coupon.description" type="textarea" placeholder="请使用规则"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
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
    endDate: '',
    limitDays: '',
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
    idObj: {}
  },
  data() {
    return {
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
          type: 'primary',
          auth: ['admin:member.memberBenefits.coupon.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入面值', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
        ],
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
          },
          { pattern: /^\d+$/, message: '请输入整数', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    isCreated() {
      return !this.idObj.id;
    }
  },
  watch: {
    idObj: {
      handler(idObj) {
        if (idObj.id) {
          this.getCoupon();
        } else {
          this.coupon = getClearCoupon();
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    operate(name) {
      this[name]();
    },
    isRequirementChange(val) {
      this.coupon.minimumPrice = '';
      this.$refs.form.clearValidate('minimumPrice');
    },
    dateLimitWayChange(val) {
      this.$set(this.coupon, 'endDate', '');
      this.$set(this.coupon, 'limitDays', '');
    },
    getCouponObj() {
      let coupon = {
        name: this.coupon.name,
        amount: this.coupon.amount.toString(),
        isRequirement: this.coupon.isRequirement,
        type: '13',
        minimumPrice: this.coupon.minimumPrice.toString(),
        dateLimitWay: this.coupon.dateLimitWay,
        limitDays: this.coupon.limitDays.toString(),
        endDate: this.coupon.endDate,
        description: this.coupon.description
      };
      if (!this.isCreated) {
        coupon.id = this.coupon.id;
      }
      return coupon;
    },
    getCoupon() {
      this.loading = true;
      let params = {
        id: this.idObj.id
      };
      http
        .get(couponMgmt.baseInfo, params)
        .then(data => {
          data = data.data;
          this.coupon.id = data.id;
          this.coupon.amount = Number(data.amount);
          this.coupon.endDate = data.endDate;
          this.coupon.isRequirement = data.isRequirement;
          this.coupon.dateLimitWay = data.dateLimitWay;
          this.coupon.minimumPrice = Number(data.minimumPrice);
          this.coupon.name = data.name;
          this.coupon.limitDays = Number(data.limitDays);
          this.coupon.type = data.type;
          this.coupon.description = data.description;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
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
          if (this.isCreated) {
            this.create();
          } else {
            this.update();
          }
        }
      });
    },
    create() {
      this.loading = true;
      let params = this.getCouponObj();
      http
        .post(couponMgmt.baseInfo, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('update');
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      let params = this.getCouponObj();
      http
        .put(couponMgmt.baseInfo, params)
        .then(data => {
          this.$message.success('保存成功');
          this.$emit('update');
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.coupon-base-info {
  .biz-save-button {
    float: left;
  }
}
</style>
