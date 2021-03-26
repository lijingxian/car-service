<template>
  <biz-grid class="fedration-ability">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <div class="fedration-ability-content">
      <el-form class="top-form" ref="form" label-width="300px" size="small" v-loading="loading">
        <el-form-item label="允许该店铺接收平台推送的资讯文章">
          <el-switch v-model="acceptPlatform" active-value="1" inactive-value="0" inactive-color="#d9d9d9"  active-color="#87d068">
          </el-switch>
        </el-form-item>
        <el-form-item label="允许该店铺会员接收平台推送的VR">
          <el-switch active-value="1" inactive-value="0" :disabled="true" inactive-color="#d9d9d9"  active-color="#87d068">
          </el-switch>
        </el-form-item>
        <el-form-item label="允许该店铺会员接收平台推送的话题">
          <el-switch active-value="1" inactive-value="0" :disabled="true" inactive-color="#d9d9d9"  active-color="#87d068">
          </el-switch>
        </el-form-item>
        <el-form-item label="允许该店铺会员接收平台推送的动态">
          <el-switch active-value="1" inactive-value="0" :disabled="true" inactive-color="#d9d9d9"  active-color="#87d068">
          </el-switch>
        </el-form-item>
      </el-form>

      <el-checkbox
        true-label="1"
        false-label="0"
        v-model="hasSetting"
      >代店铺设置过滤规则</el-checkbox>

      <div v-show="hasSetting === '1'" class="hidden-content">
        <el-form class="bottom-form" ref="form1" label-width="120px" size="small" v-loading="loading">
          <el-form-item label="资讯类别标签">

          </el-form-item>
          <el-form-item label="资讯内容标签">

          </el-form-item>
          <el-form-item label="涉及品牌标签">

          </el-form-item>
        </el-form>
      </div>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

export default {
  name: 'FederationMgmtInfo',
  components: {
    BizGrid,
    BizSaveButton
  },
  props: {
    itemId: {
      type: String
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:union.manage.edit']
        }
      ],

      acceptPlatform: '0',
      hasSetting: '0'
    };
  },
  computed: {

  },
  created() {

  },
  watch: {
    itemId(nVal, oVal) {

    }
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },

    save() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          // this.loading = true;
          // if (this.itemId) {
          //   service.update(
          //     this.getSaveParams(),
          //     data => {
          //       this.$message.success('保存成功');
          //       this.loading = false;
          //       // this.$emit('operationSuccess');
          //     },
          //     // result_code 不是100的处理
          //     ErrorData => {
          //       this.$message.warning(ErrorData.errorMessage);
          //     }
          //   );
          // } else {
          //   if (this.form.address === '') {
          //     this.$message.warning('请填写地址');
          //     this.loading = false;
          //     return false;
          //   }
          //   this.loading = true;
          //   service.add(
          //     this.getSaveParams(),
          //     data => {
          //       this.$message.success('保存成功');
          //       this.loading = false;
          //       this.$emit('operationSuccess');
          //     },
          //     // result_code 不是100的处理
          //     ErrorData => {
          //       this.$message.warning(ErrorData.errorMessage);
          //       this.loading = false;
          //     }
          //   );
          // }
        }
      });
    },
    getSaveParams() {
      return {

      };
    }
  }
};
</script>

<style lang="scss">
.fedration-ability {
  .biz-save-button {
    justify-content: flex-start;
  }
  .fedration-ability-content {
    height: 100%;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;

    .top-form {

      .el-form-item {

        .el-form-item__label {
          text-align: left;
        }
        .el-form-item__content {
          text-align: right;
        }
      }
    }

    .bottom-form {
      margin-top: 20px;
    }
  }
}
</style>
