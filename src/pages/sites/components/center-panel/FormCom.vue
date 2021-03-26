<template>
  <el-form :model="form" status-icon ref="form" label-width="100px" class="form-com" :rules="rules">
    <el-form-item :label="element.label" :prop="element.key" v-for="(element, index) in comData.formData.elements" :required="rules[element.key] ? undefined : element.required" :key="index">
      <el-input :type="element.type" :placeholder="'请输入'+element.label" :value="form[element.key]" @input="onInput(element.key,$event)" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :style="styleObject" @click="onSubmit">{{comData.formData.submitText}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { site } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'FormCom',
  components: {},
  props: {
    comData: {}
  },
  data() {
    return {
      activityId: '',
      params: {},
      form: {},
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入意向车型', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters('Site', ['selectedCom']),
    styleObject() {
      let style = {
        color: this.comData.buttonForeColor,
        'background-color': this.comData.buttonBackColor
      };
      return style;
    }
  },
  watch: {},
  created() {
    let form = {};
    for (const element of this.comData.formData.elements) {
      form[element.key] = element.value;
    }
    this.form = form;
    this.getParams();
  },
  methods: {
    ...mapMutations('Site', ['updateSimpleTextHeight', 'updateComFormLabel']),
    onInput(key, value) {
      this.form[key] = value;
    },
    onSubmit() {
      this.$refs.form.validate(result => {
        if (result) {
          if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.form.mobile)) {
            this.$message({
              customClass: 'site-form-message',
              message: '请输入正确的手机号',
              center: true
            });
            return;
          }
          this.submitForm();
        }
      });
    },
    submitForm() {
      if (this.comData.version === 1) {
        let params = {
          shopId: this.params.shopId,
          channel: this.params.channel,
          mobile: this.form.mobile,
          name: this.form.name,
          intentionCars: [
            {
              productName: this.form.productName
            }
          ]
        };
        console.log(params);
        http
          .post(site.potentialConsumer, params)
          .then(() => {
            this.$message({
              customClass: 'site-form-message',
              message: this.comData.successTip,
              type: 'success',
              center: true
            });
            if (this.params.target === 'toutiao') {
              this.submitTouTiao();
            }
          })
          .catch(function(error) {
            console.log(error);
          });

        // 提交参与用户信息
        let param = {
          id: this.activityId,
          data: {
            shopId: this.params.shopId,
            channel: this.params.channel,
            mobile: this.form.mobile,
            name: this.form.name,
            intentionCars: [
              {
                productName: this.form.productName
              }
            ]
          }
        };
        console.log(param);
        http
          .post(site.memberPartake, param)
          .then(() => {})
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    getParams() {
      if (this.comData.version === 1) {
        this.params.channel = this.$route.query.channel || '';
        this.params.shopId = this.$route.query.shopId || '';
        this.params.target = this.$route.query.target || '';
        this.activityId = this.$route.query.activityId || '';
      }
    },
    submitTouTiao() {
      // eslint-disable-next-line
      meteor.track('view', { convert_id: '1650537132072973' });
    }
  }
};
</script>

<style lang="scss">
.form-com {
  padding: 0.32rem 0.64rem;
  &.el-form {
    .el-form-item {
      margin-bottom: 0.2rem;
    }
    .el-form-item__label {
      display: block;
      float: none;
      text-align: left;
      line-height: 0.8rem;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      width: 100%;
      line-height: 1rem;
      .el-input {
        width: 100% !important;
      }
    }
    .el-input__inner {
      line-height: 1rem;
    }
    .el-button {
      width: 100%;
      margin-top: 0.64rem;
      border: none;
    }
  }
}
.site-form-message {
  padding: 0.3rem;
  min-width: 7rem;
}
</style>
