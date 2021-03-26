<template>
  <biz-grid class="promise-rating-mgmt__promise-base-info" v-loading="loading">
    <biz-save-button
      slot="top"
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
      <el-form-item label="等级">
        {{formModel.name}}
      </el-form-item>
      <el-form-item label="距离(km)" prop="distance">
        <el-input v-model="formModel.distance">
          <template slot="prepend">&lt;=</template>
        </el-input>
      </el-form-item>
      <el-form-item label="评分">
        <div class="el-input el-input--small el-input-group el-input-group--prepend">
          <div class="el-input-group__prepend">&gt;=</div>
          <el-select v-model="formModel.score" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in scoreList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        v-for="tag in formModel.gradeIndicators"
        :key="tag.id"
        :label="tag.name"
      >
        <div class="el-input el-input--small el-input-group el-input-group--prepend">
          <div class="el-input-group__prepend">&gt;=</div>
          <el-select v-model="tag.recommendScore" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in scoreList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import service from '@/service/shop-rate/RecommendRule';
const getDefaultModel = function () {
  return {
    distance: ''
  };
};

// 属性
const data = {
  loading: false,
  operations: [
    {
      label: '保存',
      name: 'save',
      type: 'primary'
    }
  ],
  formModel: getDefaultModel(),
  scoreList: [
    { label: '一星', value: '1' },
    { label: '二星', value: '2' },
    { label: '三星', value: '3' },
    { label: '四星', value: '4' },
    { label: '五星', value: '5' }
  ]
};

// 方法
const methods = {
  query () {
    this.formModel = Object.assign(this.getDefaultModel(), this.itemId);

    if (this.$refs.form) this.$refs.form.resetFields();
  },
  getSaveParams () {
    return this.formModel;
  },
  resetModel () {
    this.formModel = this.getDefaultModel();
  },
  getDefaultModel () {
    return getDefaultModel();
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
};

// 事件
const events = {
  operateHandler (name) {
    this[name]();
  },
  handleAddressChange (val) {
    this.formModel.address = val;
  },
  handleAreaChanged (areaId) {
    this.formModel.area.id = areaId;
  }
};

export default {
  name: 'RecommendRule',
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      ...data,

      rules: {
        distance: [
          {
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.formModel.distance !== '' && (!Number(this.formModel.distance) || Number(this.formModel.distance) < 0)) {
                callback(new Error('请输入一个大于0的数字'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    ...methods,

    ...events
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
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.promise-rating-mgmt__promise-base-info {
  padding-top: 20px;

  .biz-scroller {
  }
}
</style>
