<template>
  <biz-grid class="terminal-mgmt-class__terminal-update" v-loading="loading">
    <div v-show="!errorMessage">
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
        <el-form-item label="发布文件" prop="files">
          <biz-file-uploader
            v-model="formModel.files"
            :fileList="formModel.fileList"
            @fileListChange="handleFileListChange"
          ></biz-file-uploader>
        </el-form-item>
        <el-form-item label="文件版本" prop="version">
          <el-input v-model="formModel.version" placeholder="请输入文件版本"></el-input>
        </el-form-item>
        <el-form-item label="文件资费" prop="price">
          <el-input placeholder="请输入文件资费"
                    v-model="formModel.price"
                    type="number"
                    min="0"
                    >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="文件图标" :value="formModel.logo">
          <biz-avatar-uploader-new v-model="formModel.logo">
          </biz-avatar-uploader-new>
        </el-form-item>
        <el-form-item label="发布说明">
          <el-input v-model="formModel.description" type="textarea" placeholder="请输入发布说明"></el-input>
        </el-form-item>
        <el-form-item label="兼容版本" :value="formModel.options">
          <tag-manager v-model="formModel.options" :removeHandler="removeHandler" placeholder="请输入兼容版本"></tag-manager>
        </el-form-item>
      </el-form>
    </div>

    <p v-show="errorMessage">{{errorMessage}}</p>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFileUploader, BizAvatarUploaderNew } from '@/components/BizForm';
import BizSaveButton from '@/components/BizSaveButton';
import { TagManager } from '@/components/BizTagManager';

import service from '@/service/terminal-mgmt/TerminalUpdate';

export default {
  name: 'TerminalUpdate',
  components: {
    BizSaveButton,
    BizGrid,
    BizFileUploader,
    BizAvatarUploaderNew,
    TagManager
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: '',
      errorMessage: '',

      fileData: {
        type: '0'
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        files: [
          { required: true, message: '请选择发布文件', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入文件版本', trigger: 'blur' }
        ],
        price: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.price < 0) {
                callback(new Error('资费不能为负数'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      communicationProtocolList: [],
      communicationStandardList: [],
      formModel: this.getDefaultModel()
    };
  },
  created() {

  },
  methods: {
    removeHandler: tag => {
      if (tag.isAttend === '1') {
        this.$message.warning('该字段已经有人报名使用，无法删除');
        return false;
      } else {
        return true;
      }
    },
    init () {
      if (this.itemId.id) {
        this.query();
      } else {
        this.resetModel();
      }

      if (this.$refs.form) this.$refs.form.resetFields();
    },
    query () {
      service.query(
        {
          terminalTypeId: this.itemId.id
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.content);
          let arr = [];

          obj.fileNames = obj.name ? obj.name.split(',') : [];
          obj.files = obj.path ? obj.path.split(',') : [];
          obj.fileNames.forEach((item, i) => {
            arr.push({ name: item, url: obj.files[i] });
          });
          obj.fileList = arr;
          obj.options = [];
          if (obj.compatibleVersion) {
            let arr = obj.compatibleVersion.split(',');
            arr.forEach(item => {
              obj.options.push({ content: item });
            });
          } else {
            obj.options = [];
          }
          this.formModel = obj;
          this.errorMessage = '';
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          if (ErrorData.resultCode === '827') {
            this.errorMessage = ErrorData.errorMessage;
          } else {
            this.$message.warning(ErrorData.errorMessage);

            this.resetModel();
          }
        }
      );
    },
    getSaveParams () {
      let arr = [];
      if (this.formModel.options) {
        this.formModel.options.forEach(item => {
          arr.push(item.content);
        });
      }
      return {
        terminalTypeId: this.itemId.id,
        path: this.formModel.files.join(','),
        name: this.formModel.fileNames.join(','),
        version: this.formModel.version,
        price: this.formModel.price,
        logo: this.formModel.logo,
        description: this.formModel.description,
        compatibleVersion: arr.join(',')
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        logo: '',
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

      // 将版本号设置为最后一个文件的文件名
      let fileName = this.formModel.fileNames[this.formModel.fileNames.length - 1];
      this.formModel.version = fileName.substr(0, fileName.lastIndexOf('.'));

      if (this.$refs.form) this.$refs.form.validate();
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

                this.$emit('operationSuccess');
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
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
.terminal-mgmt-class__terminal-update {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
}
</style>
