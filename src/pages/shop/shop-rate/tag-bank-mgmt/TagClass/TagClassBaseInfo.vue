<template>
  <biz-grid class="tag-class-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formModel.description" type="textarea" maxlength="200" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/shop-rate/TagClassBaseInfo';

export default {
  name: 'TagClassBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data () {
    return {
      loading: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      formModel: this.getDefaultModel()
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  },
  methods: {
    query () {
      this.loading = true;
      service.query(
        {
          id: this.itemId.id,
          terminalTypeId: '2'
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          this.formModel = obj;

          this.$refs.form.resetFields();

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.loading = false;
        }
      );
    },
    getSaveParams () {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        description: this.formModel.description
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {

      };
    },

    operateHandler (name) {
      this[name]();
    },
    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleUploadSuccess(url) {
      this.formModel.cover = url;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
                this.loading = false;

                window.top.postMessage(
                  { method: 'setTagTree' },
                  window.top.location.origin
                );
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');
                this.loading = false;

                this.$emit('operationSuccess');
                this.loading = false;

                window.top.postMessage(
                  { method: 'setTagTree' },
                  window.top.location.origin
                );
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal && nVal.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    }
  }
};
</script>

<style lang="scss">
.tag-class-mgmt__base-info {
  padding-top: 20px;

  .biz-scroller {
  }
}
</style>
