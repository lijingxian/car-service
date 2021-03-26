<template>
  <div class="divide-rule">
    <el-card class="box-card">
      <el-form ref="propForm" size="small" label-width="110px" :model="tempModel" :rules="propRules" :inline-message="true">
        <el-form-item label="属性类型" prop="type">
          <el-select v-model="tempModel.type" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in propTypelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input min="1" v-model="tempModel.length" type="number" placeholder="请输入长度"></el-input>
        </el-form-item>
        <el-form-item :error="tempError" label="属性值" prop="tempValue">
          <el-input v-model="tempModel.tempValue" @input="tempValueInput" placeholder="请输入属性值"></el-input>
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="tempModel.name" placeholder="请输入属性名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input min="0" v-model="tempModel.order" type="number" placeholder="请输入排序"></el-input>
        </el-form-item>
      </el-form>
      <biz-save-button :operations="propOperations" @operate="operateHandler" style="margin-right: 0;"></biz-save-button>
    </el-card>
  </div>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';

export default {
  name: 'DivideRule',
  components: { BizSaveButton },
  props: {
    propModel: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      tempError: '',
      tempModel: {
        length: '1',
        name: '',
        options: [],
        order: '0',
        type: '0',
        value1: '',
        value2: '',
        id: '',
        tempValue: ''
      },
      propTypelList: [{ name: '单值', id: '0' }, { name: '多值', id: '1' }, { name: '范围值', id: '2' }],
      propOperations: [
        {
          label: '取消',
          name: 'cancelPropOperate'
        },
        {
          label: '保存',
          name: 'savePropOperate',
          type: 'primary'
        }
      ],
      propRules: {
        type: [{ required: true, message: '请选择属性类型', trigger: 'blur' }],
        length: [
          { required: true, message: '请输入长度', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (!/^\+?[1-9]\d*$/.test(this.propModel.length)) {
                callback(new Error('请输入大于0的整数'));
              } else if (!this.checkLength()) {
                callback(new Error('长度和属性值不匹配'));
              } else {
                callback();
              }
            }
          }
        ],
        tempValue: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              // if (model.type === '1') {
              //   console.log('1');
              //   model.tempValue = model.options.join(',');
              // } else if (model.type === '2') {
              //   console.log('2');
              //   model.tempValue = [model.value1, model.value2].join('-');
              // } else {
              //   model.tempValue = model.value1;
              // }
              if (this.tempModel.type === '1') {
                let tempArray = this.tempModel.tempValue.split(',');
                if (Array.isArray(tempArray) && tempArray.length > 1) {
                  callback();
                } else {
                  callback(new Error('请输入属性值，格式为x,y,z'));
                }
              } else if (this.tempModel.type === '2') {
                let tempArray = this.tempModel.tempValue.split('-');
                if (Array.isArray(tempArray) && tempArray.length === 2) {
                  callback();
                } else {
                  callback(new Error('请输入属性值，格式为x-y'));
                }
              } else {
                this.tempModel.tempValue ? callback() : callback(new Error('请输入属性值'));
              }
            }
          }
        ],
        name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (Number(this.propModel.order) < 0) {
                callback(new Error('请输入大于或等于0的数字'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    getValue(model) {
      if (model.type === '1') {
        return model.options.join(',');
      } else if (model.type === '2') {
        return (model.value1 ? model.value1 : '') + '-' + (model.value2 ? model.value2 : '');
      } else {
        return model.value1;
      }
    }
  },
  watch: {
    propModel() {
      this.tempModel.length = this.propModel.length || '1';
      this.tempModel.name = this.propModel.name || '';
      this.tempModel.options = this.propModel.options || [];
      this.tempModel.order = this.propModel.order || '1';
      this.tempModel.type = this.propModel.type || '0';
      this.tempModel.value1 = this.propModel.value1 || '';
      this.tempModel.value2 = this.propModel.value2 || '';
      this.tempModel.id = this.propModel.id || '';
      this.tempModel.tempValue = this.getTempValue(this.propModel);
    }
  },
  created() {},
  methods: {
    operateHandler(name) {
      this[name]();
    },
    checkLength() {
      /**
       * 验证属性的总长度不能大于规则所定义的长度
       * 1. 获取当前属性的长度
       * 2. 计算每种形式的每一个属性的长度，比较
       */
      let length = Number(this.tempModel.length);
      let options = [];
      if (this.tempModel.type === '1') {
        options = this.tempModel.tempValue.split(',');
        if (options.length <= 2) {
          return false;
        }
      } else if (this.tempModel.type === '2') {
        options = this.tempModel.tempValue.split('-');
        if (options.length !== 2) {
          return false;
        }
      } else {
        options.push(this.tempModel.tempValue);
      }
      for (const option of options) {
        if (length !== option.length) {
          return false;
        }
      }
      return true;
    },
    queryPropTypeList() {
      this.propTypelList = [{ name: '单值', id: '0' }, { name: '多值', id: '1' }, { name: '范围值', id: '2' }];
    },
    savePropOperate() {
      this.$refs.propForm.validate((valid, a) => {
        if (valid) {
          this.$emit('add-prop', this.getProp());
          this.$emit('prod-cancel');
        } else {
          return false;
        }
      });
    },
    // 属性
    propRowDeleteClickHandler(e, model) {
      this.deleteProp([model.id]);
    },
    deleteProp(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ruleModel.valueDatas.forEach((element, i) => {
          if (ids.indexOf(element.id) >= 0) {
            this.ruleModel.valueDatas.splice(i, 1);
          }
        });
      });
    },
    getProp() {
      let obj = {
        length: this.tempModel.length,
        name: this.tempModel.name,
        options: [],
        order: this.tempModel.order,
        type: this.tempModel.type,
        value1: '',
        value2: '',
        id: this.tempModel.id
      };
      if (obj.type === '1') {
        obj.options = this.tempModel.tempValue.split(',');
      } else if (obj.type === '2') {
        let temp = this.tempModel.tempValue.split('-');
        obj.value1 = temp[0] ? temp[0] : '';
        obj.value2 = temp[1] ? temp[1] : '';
      } else {
        obj.value1 = this.tempModel.tempValue;
      }
      return obj;
    },
    getTempValue(model) {
      if (model.type === '1') {
        return model.options.join(',');
      } else if (model.type === '2') {
        console.log('2');
        return [model.value1, model.value2].join('-');
      } else {
        return model.value1;
      }
    },
    cancelPropOperate() {
      this.$emit('prod-cancel');
    },
    tempValueInput() {
      this.$refs.propForm.validate();
    }
  }
};
</script>

<style lang="scss">
.divide-rule {
}
</style>
