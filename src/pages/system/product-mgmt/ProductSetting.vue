<template>
  <biz-grid class="product-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="form" :rules="rules">
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="成本价:" prop="cost">
        <el-input v-model="form.cost" placeholder="请输入成本价"></el-input>
      </el-form-item>
      <el-form-item label="市场价:" prop="marketPrice">
        <el-input v-model="form.marketPrice" placeholder="请输入市场价"></el-input>
      </el-form-item>
      <el-form-item label="展示图片:" prop="image">
        <BizAvatarUploaderNew v-model="form.image">
        </BizAvatarUploaderNew>
      </el-form-item>
      <!-- <el-form-item label="单位:" prop="unit">
        <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
      </el-form-item> -->
      <el-form-item label="重量:" prop="weight">
        <el-input v-model="form.weight" placeholder="请输入重量">
          <template slot="append">克</template>
        </el-input>
      </el-form-item>
      <el-form-item label="类型:" prop="category">
        <el-select v-model="form.category" placeholder="请选择类型" style="width: 100%;">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="介绍:" prop="introduction">
        <el-input v-model="form.introduction" type="textarea" placeholder="请输入介绍"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="memo">
        <el-input v-model="form.memo" type="textarea" placeholder="请输入备注"></el-input>
      </el-form-item> -->
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/system-setting/product-mgmt/productMgmt';

export default {
  name: 'ProductSetting',
  components: {
    BizSaveButton,
    BizGrid,
    BizAvatarUploaderNew
  },
  data() {
    const isCostValid = (rule, rules, callback) => {
      if (Number(this.form.cost) >= 0) {
        callback();
      } else {
        callback(new Error('成本价必须为数字值'));
      }
    };
    const isMarketPriceValid = (rule, rules, callback) => {
      if (Number(this.form.marketPrice) >= 0) {
        callback();
      } else {
        callback(new Error('市场价必须为数字值'));
      }
    };
    const isWeightValid = (rule, rules, callback) => {
      let reg = new RegExp(/^([1-9]\d*|[0]{1,1})$/);
      if (reg.test(this.form.weight)) {
        callback();
      } else {
        callback(new Error('重量必须为正整数或零'));
      }
    };
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
        cost: [
          {
            required: false,
            trigger: 'change',
            validator: isCostValid
          }
        ],
        marketPrice: [
          {
            required: false,
            trigger: 'change',
            validator: isMarketPriceValid
          }
        ],
        weight: [
          {
            required: false,
            trigger: 'change',
            validator: isWeightValid
          }
        ],
        category: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },

      form: {
        id: '',
        name: '',
        cost: '',
        marketPrice: '',
        image: '',
        unit: '',
        weight: '0',
        category: '',
        introduction: '',
        memo: ''
      },
      productList: [],
      typeList: []
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id === '') {
            this.add();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    refresh() {
      let params = {
        id: this.id
      };
      service.queryBasicData(
        params,
        data => {
          this.form.id = data.generalType.id;
          this.form.name = data.generalType.name;
          this.form.cost = data.generalType.cost;
          this.form.marketPrice = data.generalType.marketPrice;
          this.form.image = data.generalType.image;
          this.form.unit = data.generalType.unit;
          this.form.weight = parseInt(data.generalType.weight);
          this.form.category = data.generalType.category;
          this.form.introduction = data.generalType.introduction;
          this.form.memo = data.generalType.memo;

          this.typeList = data.types;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    operateHandler(name) {
      this[name]();
    },
    add() {
      let params = {
        id: this.form.id,
        name: this.form.name,
        cost: this.form.cost,
        marketPrice: this.form.marketPrice,
        image: this.form.image,
        unit: this.form.unit,
        weight: this.form.weight,
        category: this.form.category,
        introduction: this.form.introduction,
        memo: this.form.memo
      };
      service.createBasicData(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshProduct');
          this.$emit('createdProductSuccess', data.id);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    update() {
      let params = {
        id: this.form.id,
        name: this.form.name,
        cost: this.form.cost,
        marketPrice: this.form.marketPrice,
        image: this.form.image,
        unit: this.form.unit,
        weight: this.form.weight,
        category: this.form.category,
        introduction: this.form.introduction,
        memo: this.form.memo
      };
      service.updateBasicData(
        params,
        data => {
          this.$message.success('操作成功');
          this.$emit('refreshProduct');
          this.refresh();
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    clearFormData() {
      this.form.id = '';
      this.form.name = '';
      this.form.cost = '';
      this.form.marketPrice = '';
      this.form.image = '';
      this.form.unit = '';
      this.form.weight = '0';
      this.form.category = '';
      this.form.introduction = '';
      this.form.memo = '';
    }
  },
  computed: {},
  watch: {
    id(Val) {
      if (this.open === true) {
        this.refresh();
      }
    },
    open(val) {
      if (!val) {
        this.clearFormData();
      } else {
        if (this.id === '') {
          this.refresh();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.product-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
  .checkbox-group {
    font-size: 14px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 100px;
    margin: 0;
    .checkbox-group-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .biz-list {
    margin-top: 10px;
  }
  .el-radio {
    width: 60px;
  }
}
</style>
