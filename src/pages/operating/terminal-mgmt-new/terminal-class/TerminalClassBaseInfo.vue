<template>
  <biz-grid class="terminal-mgmt-class__terminal-class-base-info" v-loading="loading">
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="终端类型" prop="styleType">
          <el-select v-model="formModel.styleType" placeholder="请选择" style="width: 100%;"  @change="typeChange">
            <el-option
              v-for="item in terminalTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端标识" prop="originalName">
          <el-select v-model="formModel.originalName" placeholder="请选择" style="width: 100%;" @change="valueChange">
            <el-option
              v-for="item in terminalSignList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端描述" prop="description">
          <el-input v-model="formModel.description" type="textarea" placeholder="请输入终端描述"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <p v-show="errorMessage">{{errorMessage}}</p>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/terminal-mgmt/ClassAbilitySetting';
import { terminalMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'TerminalClassBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入终端名称', trigger: 'blur' }
        ],
        styleType: [
          { required: true, message: '请选择终端类型', trigger: 'blur' }
        ],
        originalName: [
          { required: true, message: '请选择终端标识', trigger: 'blur' }
        ]
      },
      terminalTypeList: [],
      terminalSignList: [],
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
    this.queryTypeList();
    this.querySignList();

    if (this.itemId.id) {
      this.init(this.itemId.id);
    }
  },
  methods: {
    valueChange() {
      this.$refs.form.clearValidate('originalName');
    },
    typeChange() {
      this.$refs.form.clearValidate('styleType');
    },
    init (val) {
      if (val) {
        this.query(val);
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    query (id) {
      this.loading = true;
      http.get(terminalMgmt.BaseInfo.query, { terminalTypeId: id })
        .then(data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          obj.styleType = {
            intelligent_driving: '0',
            comfort_control: '1',
            entertainment_information: '2',
            intelligentaccess: '3'
          }[obj.styleType];
          this.formModel = obj;

          this.$refs.form.resetFields();
        })
        .catch(errData => {
          if (errData.resultCode === '800') {
            this.errorMessage = errData.errorMessage;
          } else {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },
    queryTypeList () {
      this.terminalTypeList = [
        { id: '0', name: '智能驾驶' },
        { id: '1', name: '舒适控制' },
        { id: '2', name: '娱乐信息' },
        { id: '3', name: '智能到店' }
      ];
    },
    querySignList () {
      http.get(terminalMgmt.BaseInfo.signList)
        .then(data => {
          this.terminalSignList = data.data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
      service.querySignList(
        {},
        data => {
          this.terminalSignList = data.data;
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
        id: this.formModel.id,
        name: this.formModel.name,
        styleType: this.formModel.styleType,
        originalName: this.formModel.originalName,
        description: this.formModel.description
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        typeId: '',
        signId: ''
      };
    },

    operateHandler (name) {
      this[name]();
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          http.post(
            this.itemId.id
              ? terminalMgmt.BaseInfo.update
              : terminalMgmt.BaseInfo.add,
            this.getSaveParams()
          )
            .then(data => {
              this.$message.success('保存成功');

              this.$emit('operationSuccess');
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage) this.$message.warning(errData.errorMessage);
            })
            .finally(data => {
              this.loading = false;
            });
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
      this.init(nVal.id);
    }
  }
};
</script>

<style lang="scss">
.terminal-mgmt-class__terminal-class-base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
}
</style>
