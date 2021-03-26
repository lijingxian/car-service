<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-demarcate">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
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
      <el-form-item label="发布文件" prop="files">
        <biz-file-uploader
          v-model="formModel.files"
          :fileList="formModel.fileList"
          @fileListChange="handleFileListChange"
        ></biz-file-uploader>
      </el-form-item>
      <el-form-item label="文件版本" prop="version">
        <el-input v-model="formModel.version"></el-input>
      </el-form-item>
      <el-form-item label="文件资费">
        <el-input placeholder="请输入文件资费"
                  v-model="formModel.price"
                  type="number"
                  min="0"
                  >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="文件图标" prop="cover" :value="formModel.logo">
        <biz-avatar-uploader-new v-model="formModel.logo">
        </biz-avatar-uploader-new>
      </el-form-item>
      <el-form-item label="发布说明" prop="description">
        <el-input v-model="formModel.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFileUploader, BizAvatarUploaderNew } from '@/components/BizForm';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/vehicle-mgmt/VehicleDemarcate';

export default {
  name: 'VehicleDemarcate',
  components: {
    BizSaveButton,
    BizGrid,
    BizFileUploader,
    BizAvatarUploaderNew
  },
  data() {
    return {
      fileData: {
        type: '0'
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['caradmin:operateDevice.manage.edit']
        }
      ],
      rules: {
        files: [
          { required: true, message: '请选择发布文件', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入文件版本', trigger: 'blur' }
        ]
      },
      communicationProtocolList: [],
      communicationStandardList: [],
      formModel: this.getDefaultModel()
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
  created() {

  },
  methods: {
    init () {
      if (this.itemId.id) {
        this.query();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    query () {
      service.query(
        {
          id: this.itemId.id
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data);
          let arr = [];

          obj.fileNames = obj.name.split(',');
          obj.files = obj.path.split(',');
          obj.fileNames.forEach((item, i) => {
            arr.push({ name: item, url: obj.files[i] });
          });
          obj.fileList = arr;
          this.formModel = obj;

          this.$refs.form.resetFields();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams () {
      return {
        terminalId: this.itemId.id,
        path: this.formModel.files.join(','),
        name: this.formModel.fileNames.join(','),
        version: this.formModel.version,
        price: this.formModel.price,
        logo: this.formModel.logo,
        description: this.formModel.description
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        cover: '',
        files: []
      };
    },

    operateHandler (name) {
      this[name]();
    },
    handleFileListChange (list) {
      let arr = [];

      list.forEach(file => {
        arr.push(file.name);
      });

      this.formModel.fileNames = arr;
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
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
  computed: {

  },
  watch: {
    itemId (nVal, oVal) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__vehicle-demarcate {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
}
</style>
