<template>
  <biz-grid class="terminal-mgmt-class__access-setting">
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
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入配置名称"></el-input>
      </el-form-item>
      <el-form-item label="通讯协议" prop="protocol">
        <el-select v-model="formModel.protocol" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in protocolList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通讯标准" prop="standard">
        <el-select v-model="formModel.standard" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in standardList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂商代码">
        <el-input v-model="formModel.manufacturerCode" placeholder="请输入厂商代码"></el-input>
      </el-form-item>
      <el-form-item label="厂商型号">
        <el-input v-model="formModel.modelCode" placeholder="请输入厂商型号"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="formModel.supplier" placeholder="请输入供应商"></el-input>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="formModel.version" placeholder="请输入版本"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/terminal-mgmt/AccessSetting';

export default {
  name: 'AccessSetting',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入配置名称', trigger: 'blur' }
        ],
        protocol: [
          { required: true, message: '请选通讯协议', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '请选择通讯标准', trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本', trigger: 'blur' }
        ]
      },
      protocolList: [],
      standardList: [],
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
    this.queryProtocolList();
    this.queryStandardList();
  },
  methods: {
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
          this.formModel = Object.assign(this.getDefaultModel(), data.content);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryProtocolList () {
      this.protocolList = [
        'TCP',
        'UDP'
      ];
    },
    queryStandardList () {
      this.standardList = [
        '非808',
        '808',
        '北斗2012'
      ];
    },
    getSaveParams () {
      return {
        id: this.formModel.id,
        terminalTypeId: this.formModel.id ? undefined : this.itemId.id,
        name: this.formModel.name,
        protocol: this.formModel.protocol,
        standard: this.formModel.standard,
        manufacturerCode: this.formModel.manufacturerCode,
        modelCode: this.formModel.modelCode,
        supplier: this.formModel.supplier,
        version: this.formModel.version
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        protocol: '',
        standard: ''
      };
    },

    operateHandler (name) {
      this[name]();
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
.terminal-mgmt-class__access-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
}
</style>
