<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__base-info" v-loading="loading">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     v-if="isEdit"
                     >
    </biz-save-button>
    <div style="height:100%">
      <vehicle-base-info-content
        ref="content"
        :itemId="itemId"
        @on-loading="handleLoading"
        @operationSuccess="operationSuccess"
      ></vehicle-base-info-content>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import VehicleBaseInfoContent from './VehicleBaseInfoContent';

export default {
  name: 'VehicleBaseInfo',
  components: {
    BizSaveButton,
    BizGrid,

    VehicleBaseInfoContent
  },
  data () {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:car.edit']
        }
      ]
    };
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {

  },
  methods: {
    handleLoading (val) {
      this.loading = val;
    },

    operateHandler (name) {
      this[name]();
    },
    operationSuccess () {
      this.$emit('operationSuccess');
    },

    save () {
      this.$refs.content.save();
    }
  }
};
</script>

<style lang="scss">
.vehicle-mgmt-all-vehicle__base-info {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
}
</style>
