<template>
  <biz-grid class="reception-static-detail-base-info">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="机器人" prop="name">
        <el-input placeholder="" v-model="form.name" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="memberData.mobile">
        <el-input placeholder="" v-model="form.memberData.mobile" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="会员姓名" prop="memberData.name">
        <el-input placeholder="" v-model="form.memberData.name" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="接待时间" prop="loginTime">
        <el-input placeholder="" v-model="form.loginTime" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="接待时长" prop="timeLength">
        <el-input placeholder="" v-model="form.timeLength" :disabled=true>
          <template slot="append">min</template>
        </el-input>
      </el-form-item>
      <el-form-item label="意向商品" prop="productDatas">
        <el-input placeholder="" v-model="form.productDatas" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="人脸信息" prop="photo">
        <BizAvatarUploaderNew v-model="form.photo" :showHandler="false" :disabled="true">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
// import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { customerService as service } from '@/common/urls';
import http from '@/common/http';
import { BizAvatarUploaderNew } from '@/components/BizForm';
export default {
  name: 'ReceptionStaticDetailBaseInfo',
  data() {
    return {
      loading: false,
      showDialog: false,
      selectedDriverId: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        id: '',
        name: '',
        memberData: {
          mobile: '',
          name: '',
          id: ''
        },
        timeLength: '0min',
        loginTime: '0km',
        photo: ''
      },
      rules: {}
    };
  },
  components: {
    // BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew
  },
  props: {
    recordInfo: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  watch: {
    recordInfo(nVal, oVal) {
      console.log(' Changed: ', nVal);
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        if (nVal !== oVal) {
          console.log('nVal: ', nVal);
          console.log('oVal: ', oVal);
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    clear() {},
    operate(name) {
      this[name]();
    },
    query() {
      let params = {
        id: this.recordInfo.id
      };
      http
        .get(service.smartReception.robotRecordDetail, params)
        .then(data => {
          this.form = data.data;
          this.form.timeLength = data.data ? (data.data.timeLength ? data.data.timeLength : '') : '';
          this.form.productDatas = data.data ? (data.data.productDatas[0] ? data.data.productDatas[0].name : '') : '';
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
</style>
