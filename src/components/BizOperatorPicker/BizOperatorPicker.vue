<template>
  <div class="biz-operator-picker">
    <template v-for="(item, index) in innerValue">
      <el-select
        :value="innerValue[index]"
        :key="index"
        :disabled="disabled"
        class="operator-item"
        placeholder="请选择"
        style="width: 100%;"

        @input="handleInput($event, index)"
      >
        <el-option
          v-for="item in operatorList[index]"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </template>
  </div>
</template>

<script>
import service from '@/service/terminal-mgmt/Component';

export default {
  name: 'BizOperatorPicker',
  components: {

  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      innerValue: [''],
      operatorList: [],
      operatorMap: {
        'root': { }
      },
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    };
  },
  props: {
    value: {
      type: Array
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    queryOperators () {
      // 查询默认的第一级运营商
      this.doQuery('', 0);

      // 查询后续级别的运营商
      for (let i = 0; i < this.innerValue.length; i++) {
        this.doQuery(this.innerValue[i], i + 1);
      };
    },
    doQuery (pId, index) {
      // 只有第一级别为空时才继续查询
      if (pId || index === 0) {
        service.queryOperators(
          {
            parentId: pId
          },
          data => {
            let array = data.content;

            if (array.length > 0) {
              this.operatorList.splice(index, 1, array);
              if (this.operatorList.length > this.innerValue.length) {
                this.innerValue.push('');
                this.$emit('input', this.innerValue);
              }
            }
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            console.log('code错误');
          }
        );
      }
    },

    handleInput (val, index) {
      let arr = [];
      arr = arr.concat(this.innerValue.slice(0, index));
      arr = arr.concat([val]);
      this.$emit('input', arr);
    }
  },
  watch: {
    value (val, oVal) {
      if (!val || val.length === 0) {
        this.$emit('input', ['']);
      } else {
        this.innerValue = val;
        this.operatorList = new Array(val.length);
        this.queryOperators();
      }
    }
  },
  created () {
    this.queryOperators();
  }
};
</script>

<style lang="scss">
.biz-operator-picker {
  .operator-item + .operator-item {
    margin-top: 10px;
  }
}
</style>
