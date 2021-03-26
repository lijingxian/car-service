<template>
  <div class="biz-save-button">
    <slot>
      <el-button size="mini" :disabled="operation.disabled" :class="operation.class" v-for="(operation,index) in authorizedOperation" :type="operation.type" :key="index"
        @click="operate(operation.name)">{{operation.label}}</el-button>
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BizSaveButton',

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
        if (operate.auth && operate.auth.length > 0) {
          return this.currentAuth.some(auth => {
            return operate.auth.includes(auth);
          });
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

<style lang="scss">
.biz-save-button {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  margin-bottom: 15px;
  .hidden {
    display: none;
  }
  .show {
    display: '';
  }
}
</style>
