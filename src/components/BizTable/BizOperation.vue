<template>
  <div class="biz-table-operation">
    <el-button
      size="mini"
      :disabled="operation.disabled"
      :class="operation.class"
      v-for="(operation,index) in authorizedOperation"
      :type="operation.type"
      :key="index"
      @click="operate(operation.name)"
    >
      {{operation.label}}
    </el-button>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BizOperation',
  data() {
    return {};
  },
  props: {
    operations: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    authorizedOperation() {
      return this.operations.filter(operate => {
        if (!operate.auth) return true;
        if (Array.isArray(operate.auth) && operate.auth.length > 0) {
          return this.currentAuth.some(auth => {
            return operate.auth.includes(auth);
          });
        }
        if (typeof operate.auth === 'string') {
          return this.currentAuth.includes(operate.auth);
        }
        return true;
      });
    }
  },
  methods: {
    operate(name) {
      this.$emit('operate', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.biz-table-operation {
  .el-button.is-disabled {
    background-color :#f7f7f7
  }
  .show {
    display: '';
  }
  .hidden {
    display: none;
  }
  display: flex;
  flex-wrap: nowrap;
}
</style>
