<template>
  <biz-grid class="propetry-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" label-width="106px" size="small" :disabled="!isEdit">
      <el-form-item label="商品介绍"></el-form-item>
      <div class="h-editor">
        <biz-editor height="400px" width="418px" v-model="form.introduction"></biz-editor>
      </div>
      <el-form-item label="购买须知"></el-form-item>
      <div class="h-editor">
        <biz-editor height="400px" width="418px" v-model="form.notice"></biz-editor>
      </div>
      <el-form-item label="产品售后"></el-form-item>
      <div class="h-editor">
        <biz-editor height="400px" width="418px" v-model="form.afterSale"></biz-editor>
      </div>
      <el-form-item label="语音播报介绍" label-width="135px"></el-form-item>
      <div class="y-editor">
        <el-input v-model="form.broadcast" type="textarea" maxlength="200" :autosize="{ minRows: 5, maxRows: 8 }" width="430px">
        </el-input>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizEditor } from '@/components/BizEditorH';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';

export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
    return {
      isCreated: false,
      operations: [
        {
          label: '保存',
          name: 'update',
          type: 'primary'
        }
      ],
      form: {
        introduction: '',
        notice: '',
        afterSale: '',
        broadcast: ''
      }
    };
  },
  props: {
    id: {
      type: String
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  watch: {
    open(val) {
      if (!val) {
        // this.id = '';
        this.form.introduction = '';
        this.form.notice = '';
        this.form.afterSale = '';
        this.form.broadcast = '';
      }
    }
  },
  components: { BizSaveButton, BizGrid, BizEditor },
  created() {},
  computed: {},
  mounted() {
    if (this.id) {
      this.refresh();
    }
  },
  methods: {
    checkVideo(msg) {
      this.$message.warning(msg);
    },
    operate(name) {
      this[name]();
    },
    onSubmit() {
      console.log('submit!');
    },
    refresh() {
      let params = {
        id: this.id
      };
      this.isCreated = true;
      BaseInfoService.queryProductDetail_pm(
        params,
        data => {
          this.form.introduction = data.data.introduction;
          this.form.notice = data.data.notice;
          this.form.afterSale = data.data.afterSale;
          this.form.broadcast = data.data.broadcast;
          this.$nextTick(() => {
            this.isCreated = false;
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        introduction: this.form.introduction,
        notice: this.form.notice,
        afterSale: this.form.afterSale,
        broadcast: this.form.broadcast
      };
      BaseInfoService.updateProductDetail_pm(
        params,
        data => {
          this.$message.success('操作成功');
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.propetry-base-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .h-editor {
    padding-left: 20px;
  }
  .y-editor {
    padding: 0px 10px 40px 20px;
  }
}
</style>
