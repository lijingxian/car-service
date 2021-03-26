<template>
  <biz-grid class="terminal-mgmt-class__class-ability-setting">
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
      <el-form-item label="终端名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入终端名称"></el-input>
      </el-form-item>
      <el-form-item label="终端类型" prop="styleType">
        <el-select v-model="formModel.styleType" placeholder="请选择" style="width: 100%;" @change="typeChange">
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
      <el-form-item
        v-for="category in abilityCategoryList"
        :label="category.name"
        :value="formModel.abilities"
        :key="category.id"
        prop="abilities"
      >
        <el-checkbox-group
          v-model="formModel.abilities"
          class="terminal-mgmt-class__class-ability-setting__checkbox-group"
          >
          <div
            v-for="item in terminalAbilityList"
            :key="item.id"
            class="checkbox-item"
            v-if="category.id === item.abilityCategory"
            >
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/terminal-mgmt/ClassAbilitySetting';

export default {
  name: 'ClassAbilitySetting',
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
      terminalAbilityList: [],
      formModel: this.getDefaultModel(),
      abilityCategoryList: [
        { id: '0', name: '全车体检' },
        { id: '1', name: '车辆菜单' },
        { id: '2', name: '基本信息' },
        { id: '3', name: '首页显示' },
        { id: '4', name: '车辆控制' },
        { id: '5', name: '智能到店' }
      ]
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
    this.queryAbilityList();

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
        service.query(
          {
            terminalTypeId: val
          },
          data => {
            let obj = Object.assign(this.getDefaultModel(), data.data);
            obj.abilities = data.abilityIds;
            this.formModel = obj;

            this.$refs.form.resetFields();
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
      }
    },
    queryTypeList () {
      this.terminalTypeList = [
        { id: 'intelligent_driving', name: '智能驾驶' },
        { id: 'comfort_control', name: '舒适控制' },
        { id: 'entertainment_information', name: '娱乐信息' },
        { id: 'intelligentaccess', name: '智能到店' }
      ];
    },
    querySignList () {
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
    queryAbilityList () {
      service.queryAbilityList(
        {},
        data => {
          this.terminalAbilityList = data.data;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    getSaveParams () {
      let arr = [];
      this.formModel.abilities.forEach(element => {
        arr.push({
          id: element
        });
      });

      return {
        id: this.formModel.id,
        name: this.formModel.name,
        styleType: this.formModel.styleType,
        originalName: this.formModel.originalName,
        description: this.formModel.description,
        ability: arr
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
    },
    getDefaultModel () {
      return {
        typeId: '',
        signId: '',
        abilities: []
      };
    },

    operateHandler (name) {
      this[name]();
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.abilities.length === 0) {
            this.$message.warning('请至少选择一项终端能力');
          } else {
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
      this.init(nVal.id);
    }
  }
};
</script>

<style lang="scss">
.terminal-mgmt-class__class-ability-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
    padding: 20px;

    .terminal-mgmt-class__class-ability-setting__checkbox-group {

      .checkbox-item {

        .el-checkbox {
          display: block;
          padding-bottom: 5px;

          & + .el-checkbox{
            margin-left: 0;
          }

          .el-checkbox__input {
            float: right;
            margin-top: 8px;
          }

          .el-checkbox__label {
            padding-left: 0;
          }
        }
      }
    }
  }
}
</style>
