<template>
  <div class="biz-header">
    <operation
      :operations="operations"
      @operate="operate"
      class="biz-header__operation-wrapper"
    >
      <slot name="operation"></slot>
    </operation>
    <div
      class="biz-header__filter-wrapper"
    >
      <biz-filter
        :filters="filters"
        @input-option-change="inputOptionChange"
        @filterDataChange="filterDataChange"
        @closeDialogFilter="closeDialogFilter"
        @cascader-change="handleCascaderChange"
        @active-item-change="activeItemChange"
      ></biz-filter>
      <biz-view-switch
        :views="views"
        v-if="views.length > 0"
        @onSwitch="onSwitch"
        class="biz-header__switch"
      ></biz-view-switch>
    </div>
  </div>
</template>

<script>
import Operation from './BizOperation';
import BizFilter from './BizFilter';
import BizViewSwitch from './BizViewSwitch';

export default {
  name: 'BizHeader',
  props: {
    operations: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filters: {
      type: Array,
      default: function() {
        return [];
      }
    },
    views: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      height: '800'
    };
  },
  components: {
    Operation,
    BizFilter,
    BizViewSwitch
  },
  methods: {
    operate(name) {
      this.$emit('operate', name);
    },
    inputOptionChange(filters) {
      this.$emit('input-option-change', filters);
    },
    filterDataChange(filters) {
      console.log(4444);
      this.$emit('filterDataChange', filters); // 即将废弃
      this.$emit('filter-data-change', filters);
    },
    closeDialogFilter(filter) {
      console.log(3);
      this.$emit('closeDialogFilter', filter);
    },
    handleCascaderChange(value) {
      this.$emit('cascader-change', value);
    },
    activeItemChange(value) {
      this.$emit('active-item-change', value);
    },
    onSwitch(name) {
      this.$emit('onSwitch', name);
      this.$emit('on-switch', name);
    }
  }
};
</script>

<style lang="scss">
.biz-header {
  padding: 10px;

  &:after {
    content: '';
    clear: both;
    display: table;
  }

  .biz-header__operation-wrapper {
    float: left;
    margin-bottom: 0;
  }

  .biz-header__filter-wrapper {
    float: right;
    display: flex;
    .biz-header__switch {
      margin-left: 10px;
      margin-top: 5px;
      display: block;
    }
  }
  // .row {
  //   display: flex;
  //   justify-content: space-between;
  //   margin-bottom: 5px;
  // }
}
</style>
