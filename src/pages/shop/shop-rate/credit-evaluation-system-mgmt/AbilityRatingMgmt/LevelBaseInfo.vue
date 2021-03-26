<template>
  <biz-grid class="ability-rating-mgmt__level-base-info" v-loading="loading">
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
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入等级名称"></el-input>
      </el-form-item>

      <el-table
        :data="formModel.indicators"
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="name" label="指标名称"></el-table-column>
        <el-table-column
          prop="score"
          label="权重（%）"
          sortable
        >
          <template slot-scope="scope">
            <el-input
              type="number"
              v-model="scope.row.weight"
              size="small"
              :disabled="scope.row.disabled"
              @input="handleWeightChange(scope.row, $event)"
              min="0"
              max="100"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/shop-rate/LevelBaseInfo';

const getDefaultModel = function () {
  return {
    indicators: []
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
  rules: {
    name: [
      { required: true, message: '请输入等级名称', trigger: 'blur' }
    ]
  },
  formModel: getDefaultModel(),
  indicatorList: []
};

// 方法
const methods = {
  queryIndicators () {
    service.queryIndicators(
      { shopId: window.top.SHOP_ID || '' },
      data => {
        let list = data.content;
        console.log(list);
        list = list.map(item => {
          return {
            weight: 0,
            indicator: item.id,
            name: item.name
          };
        });
        this.indicatorList = list;

        this.resetModel();
      },
      // result_code 不是100的处理
      ErrorData => {
        console.log(ErrorData);
        console.log('code错误');

        this.loading = false;
      }
    );
  },
  query () {
    this.loading = true;
    service.query(
      {
        id: this.itemId.id,
        terminalTypeId: '2',
        shopId: window.top.SHOP_ID || ''
      },
      data => {
        let obj = Object.assign(this.getDefaultModel(), data.data);
        obj.indicators.map(item => {
          if (isNaN(Number(item.weight))) {
            item.weight = 0;
          }
          return item;
        });
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
      indicators: this.formModel.indicators,
      shopId: window.top.SHOP_ID || ''
    };
  },
  resetModel () {
    this.formModel = this.getDefaultModel();
  },
  getDefaultModel () {
    let obj = getDefaultModel();
    let arr = [];
    this.indicatorList.forEach(item => {
      arr.push(Object.assign({}, item));
    });
    obj.indicators = arr;
    return obj;
  },

  save () {
    this.$refs.form.validate((valid, a) => {
      let pass = true;
      if (this.sumWeight !== 100) {
        this.$message.warning('权重合计不等于100');
        pass = false;
      }
      if (valid && pass) {
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
  },

  getSummaries(param) {
    const { data } = param;
    let sum = 0;

    data.forEach(row => {
      let weight = Number(row.weight);
      if (!isNaN(weight)) {
        sum += weight;
      }
    });

    this.sumWeight = sum;

    return ['合计(%)', sum];
  }
};

// 事件
const events = {
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
  handleWeightChange (row, e) {
    if (Number(row.weight) > 100) {
      this.$set(this.formModel.indicators[this.formModel.indicators.indexOf(row)], 'weight', 100);
      this.$message.warning('权重不能大于100');
    } else if (Number(row.weight) < 0) {
      this.$set(this.formModel.indicators[this.formModel.indicators.indexOf(row)], 'weight', 0);
      this.$message.warning('权重不能小于0');
    }
  }
};

export default {
  name: 'LevelBaseInfo',
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
      ...data
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
        this.queryIndicators();

        if (this.$refs.form) this.$refs.form.resetFields();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.ability-rating-mgmt__level-base-info {
  padding-top: 20px;
}
</style>
