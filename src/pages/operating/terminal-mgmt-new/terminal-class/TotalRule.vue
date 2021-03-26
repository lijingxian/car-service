<template>
  <el-dialog :visible.sync="show" center append-to-body width="500px" v-loading="ruleLoading">
    <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="rules">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="ruleModel.name" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="长度" prop="length">
        <el-input min="1" v-model="ruleModel.length" type="number" placeholder="请输入长度"></el-input>
      </el-form-item>
    </el-form>
    <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;"></biz-save-button>

    <biz-header :operations="propTableOperations" @operate="operateHandler"></biz-header>
    <el-table :data="ruleModel.valueDatas" style="width: 100%" @selection-change="propSelectionChangeHandler" class="coding-rule__value-table">
      <el-table-column type="selection" width="25"></el-table-column>
      <el-table-column label="类型" :formatter="typeConverter" width="50"></el-table-column>
      <el-table-column prop="name" label="属性名称"></el-table-column>
      <el-table-column prop="length" label="长度" width="35"></el-table-column>
      <el-table-column prop="order" label="排序" width="35"></el-table-column>
      <el-table-column label="属性值" :formatter="valueConverter"></el-table-column>
      <el-table-column prop="title" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="propRowEditClickHandler(scope)" style="margin-left: 0;">编辑</el-button>
          <el-button type="text" size="mini" @click="propRowDeleteClickHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <divide-rule v-show="showProp" :prop-model="propModel" @add-prop="addProp" @prod-cancel="prodCancel"></divide-rule>
  </el-dialog>
</template>

<script>
import service from '@/service/terminal-mgmt/CodingRule';
import BizSaveButton from '@/components/BizSaveButton';
import DivideRule from './DivideRule';
import { BizHeader } from '@/components/BizTable';

export default {
  name: 'total-rule',
  components: { BizSaveButton, DivideRule, BizHeader },
  props: {
    terminalTypeId: String,
    show: {
      required: true,
      type: Boolean
    },
    ruleIdObject: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      rowIndex: -1,
      propSelections: [],
      propModel: {},
      ruleLoading: false,
      baseInfo: {},
      ruleModel: {
        name: '',
        length: '',
        valueDatas: []
      },
      ruleOperations: [
        {
          label: '取消',
          name: 'cancelRuleOperate'
        },
        {
          label: '保存',
          name: 'saveRuleOperate',
          type: 'primary'
        }
      ],
      propTableOperations: [
        {
          label: '新增',
          name: 'propAdd',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'propDelete',
          type: '',
          disabled: true
        }
      ],
      showProp: false,
      propTypelList: [],
      rules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        length: [
          { required: true, min: 1, message: '请输入长度', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              let checkLength = model => {
                let length = 0;
                model.valueDatas.forEach(item => {
                  length += Number(item.length);
                });
                if (length === Number(model.length)) return true;
                else return false;
              };
              if (Number(this.ruleModel.length) <= 0) {
                callback(new Error('请输入大于0的数字'));
              } else if (!checkLength(this.ruleModel)) {
                callback(new Error('设置的规则长度与其属性长度总和不符'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    ruleIdObject() {
      this.$refs.ruleForm.clearValidate();
      if (this.ruleIdObject.id) {
        this.queryRule();
      } else {
        this.resetRule();
      }
    }
  },
  created() {},
  methods: {
    operateHandler(name) {
      this[name]();
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          // console.log('saveRuleOperate');
          // console.log(this.ruleModel);
          this.ruleLoading = true;
          if (this.ruleModel.id) {
            service.updateRule(
              { ...this.ruleModel, terminalTypeId: this.terminalTypeId },
              data => {
                this.$message.success('操作成功');
                this.$emit('update:show', false);
                this.$emit('updated');
                this.ruleLoading = false;
              },
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.ruleLoading = false;
              }
            );
          } else {
            service.addRule(
              { ...this.ruleModel, terminalTypeId: this.terminalTypeId },
              data => {
                this.$message.success('操作成功');
                this.$emit('update:show', false);
                this.$emit('updated');
                this.ruleLoading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.ruleLoading = false;
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    propAdd() {
      this.propModel = {
        id: '',
        length: '1',
        name: '',
        options: [],
        order: '0',
        type: '0',
        value1: '',
        value2: ''
      };
      this.rowIndex = -1;
      this.showProp = true;
    },
    propDelete() {
      if (this.propSelections && this.propSelections.length > 0) {
        for (const iterator of this.propSelections) {
          let index = -1;
          index = this.ruleModel.valueDatas.indexOf(iterator);
          if (index !== -1) {
            this.ruleModel.valueDatas.splice(index, 1);
          }
        }
      }
    },
    cancelRuleOperate() {
      this.$emit('update:show', false);
      this.showProp = false;
    },
    cancelPropOperate() {
      this.showProp = false;
    },
    getRuleSaveParams() {
      return {
        terminalTypeId: this.itemId.id,
        id: this.ruleModel.id,
        name: this.ruleModel.name,
        length: this.ruleModel.length,
        order: this.ruleModel.order,
        valueDatas: this.ruleModel.valueDatas
      };
    },
    queryRule() {
      this.ruleLoading = true;
      service.queryRule(
        {
          id: this.ruleIdObject.id
        },
        data => {
          console.log(data);
          this.ruleModel = data.content;
          this.ruleLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.ruleLoading = false;
        }
      );
    },
    propSelectionChangeHandler(val) {
      this.propTableOperations[1].disabled = true;
      if (val.length > 0) {
        this.propTableOperations[1].disabled = false;
      }
      this.propSelections = val;
    },
    resetRule() {
      this.ruleModel = {
        name: '',
        length: '',
        valueDatas: []
      };
    },
    typeConverter(row) {
      let ary = ['单值', '多值', '范围值'];
      return ary[row.type];
    },
    valueConverter(row) {
      if (row.type === '1') {
        return row.options.join(',');
      } else if (row.type === '2') {
        return [row.value1, row.value2].join('-');
      } else {
        return row.value1;
      }
    },
    addProp(prop) {
      let isCreating = this.rowIndex === -1;
      if (isCreating) {
        // 记录插入位置，因为order的关系，不能直接push
        let index = 0;
        for (const iterator of this.ruleModel.valueDatas) {
          if (prop.order === iterator.order) {
            this.$message.warning('排序冲突');
            return;
          }
          if (iterator.order > prop.order) {
            break;
          }
          index++;
        }
        // 插入到合适的位置
        this.ruleModel.valueDatas.splice(index, 0, prop);
      } else {
        // 判断更新时候order是否冲突
        for (let index = 0; index < this.ruleModel.valueDatas.length; index++) {
          const element = this.ruleModel.valueDatas[index];
          if (index !== this.rowIndex) {
            console.log('index：', index);
            if (prop.order === element.order) {
              this.$message.warning('排序冲突');
              return;
            }
          }
        }
        // 这里要注意Array的变化
        this.ruleModel.valueDatas.splice(this.rowIndex, 1, prop);
      }
      // 校验一下length等信息
      this.$refs.ruleForm.validate();
    },
    prodCancel() {
      this.showProp = false;
    },
    propRowEditClickHandler({ $index, row }) {
      this.propModel = {
        id: row.id,
        length: row.length,
        name: row.name,
        options: row.options,
        order: row.order,
        type: row.type,
        value1: row.value1,
        value2: row.value2
      };
      this.rowIndex = $index;
      this.showProp = true;
    },
    propRowDeleteClickHandler({ $index }) {
      this.ruleModel.valueDatas.splice($index, 1);
    }
  }
};
</script>

<style lang="scss">
.total-rule {
  .el-card__body {
    padding: 10px 5px;
  }
}
</style>
