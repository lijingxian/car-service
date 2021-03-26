<template>
  <biz-grid class="membership-mgmt__certification" v-loading="loading">
    <biz-save-button
      slot="top"
      :operations="operations"
      @operate="handleOperate"
      v-if="isEdit"
    >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
      :disabled="!isEdit"
    >
      <el-form-item label="真实姓名">
        <span class="form-static">{{formModel.name}}</span>
      </el-form-item>
      <el-form-item label="证件类型">
        <span class="form-static">{{type}}</span>
      </el-form-item>
      <el-form-item label="证件号码">
        <span class="form-static">{{formModel.number}}</span>
      </el-form-item>
      <el-form-item label="证件照片">
        <img
          v-if="formModel.backgroundImg"
          class="uploaded-image"
          :src="formModel.backgroundImg"
          @click="handleImageClick($event, formModel.backgroundImg)"
        />
        <img
          v-if="formModel.positiveImg"
          class="uploaded-image"
          :src="formModel.positiveImg"
          @click="handleImageClick($event, formModel.positiveImg)"
        />
      </el-form-item>
      <el-form-item label="认证状态">
        <span class="form-static">{{state}}</span>
      </el-form-item>
    </el-form>

    <el-dialog class="avatar-preview-dialog" :append-to-body="true" :visible.sync="dialogVisible">
      <div class="review">
        <img :src="imgUrl" alt="">
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import { membershipMgmt as service } from '@/common/urls';
import http from '@/common/http';

// 初始化时需要的一些数据
const initData = {
  data: {
    operations: [
      {
        label: '通过',
        name: 'pass',
        type: 'primary'
      },
      {
        label: '不通过',
        name: 'unpass',
        type: 'primary'
      }
    ],
    typeList: [
      { label: '身份证 ', value: '0' },
      { label: '驾驶证 ', value: '1' },
      { label: '护照', value: '2' },
      { label: '军官证', value: '3' },
      { label: '户口簿', value: '4' }
    ],
    stateList: [
      { label: '审核中', value: '0 ' },
      { label: '审核通过', value: '1' },
      { label: '未通过', value: '2' }
    ]
  },
  events: {
    handleOperate (name) {
      this[name]();
    }
  },
  methods: {

  }
};
// 获取默认表单项
const getDefaultModel = () => {
  return {
    isTop: '0',
    beginDate: '',
    endDate: ''
  };
};
// 表单相关信息
const formData = {
  data: {
    loading: false,
    formModel: getDefaultModel()
  },
  events: {
  },
  methods: {
    initModel (model) {
      if (model) {
        this.formModel = Object.assign(this.getDefaultModel(), model);
      } else {
        this.resetModel();
      }

      this.$refs.form.resetFields();
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return getDefaultModel();
    },

    query () {
      this.loading = true;

      http.get(
        service.certification.query,
        { shopId: window.top.SHOP_ID || '', userId: this.itemId.id }
      )
        .then(data => {
          this.initModel(data.content);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getSaveParams (isPass) {
      return {
        userId: this.itemId.id,
        isPass: isPass,
        shopId: window.top.SHOP_ID || ''
      };
    },

    pass () {
      this.save('1');
    },
    unpass () {
      this.save('0');
    },
    save (isPass) {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          const success = data => {
            this.$message.success('操作成功');

            this.$emit('operationSuccess');
          };
          const failed = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.loading = false;
          };

          http.put(
            service.certification.certify,
            this.getSaveParams(isPass)
          )
            .then(success)
            .catch(failed)
            .finally(final);
        } else {
          this.$message.warning('表单验证失败');
          return false;
        }
      });
    }
  }
};

const dataPrview = {
  data: {
    dialogVisible: false,
    imgUrl: ''
  },
  methods: {

  },
  events: {
    handleImageClick (e, src) {
      this.dialogVisible = true;

      this.imgUrl = src;
    }
  }
};

export default {
  name: 'MembershipMgmtCertification',
  components: {
    BizSaveButton,
    BizGrid
  },
  data () {
    return {
      ...initData.data,
      ...formData.data,
      ...dataPrview.data,

      rules: {}
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  methods: {
    ...formData.methods,
    ...formData.events,

    ...initData.methods,
    ...initData.events,

    ...dataPrview.methods,
    ...dataPrview.events
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal.id) {
        this.query();
      } else {
        this.initModel();
      }
    }
  },
  computed: {
    type () {
      let index = Number(this.formModel.type);
      if (!isNaN(index)) {
        return this.typeList[index] ? this.typeList[index].label : '--';
      } else return '--';
    },
    state () {
      let index = Number(this.formModel.state);
      if (!isNaN(index)) {
        return this.stateList[index] ? this.stateList[index].label : '--';
      } else return '--';
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.membership-mgmt__certification {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {

    .form-static {
      color: #606266;
    }
  }

  $uploaded-image-size: 96px;

  .uploaded-image {
    display: inline-block;
    width: $uploaded-image-size;
    height: $uploaded-image-size;
    margin-right: 10px;
    border-radius: 6px;
    cursor: pointer;
  }
}

.avatar-preview-dialog {
  .review {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
