<template>
  <biz-popup-tabs
    :open="open"
    v-model="tabSelection"
    @close="close"
    >
    <el-tab-pane label="基本信息" name="0">
      <tag-group-base-info
        ref="baseInfo"
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></tag-group-base-info>
    </el-tab-pane>
    <!-- <el-tab-pane label="标签信息" name="1" v-if="itemId.id">
      <tag-group-tags
        :itemId="itemId"
        @operationSuccess="operationSuccess"
      ></tag-group-tags>
    </el-tab-pane> -->
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import TagGroupBaseInfo from './TagGroupBaseInfo';

export default {
  name: 'TagGroupPopup',
  components: {
    BizPopupTabs,
    TagGroupBaseInfo
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default () {
        return {
          id: ''
        };
      }
    }
  },
  data () {
    return {
      tabSelection: '0'
    };
  },
  methods: {
    close (e) {
      this.$emit('close', e);
    },
    operationSuccess (e) {
      this.$emit('operationSuccess', e);
    }
  },
  watch: {
    open (val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = '0';
        }, 0);
      }
    },
    tabSelection (val) {
      // 进入基本信息页面刷新，因为标签数需要更新
      if (val === '0' && this.$refs.baseInfo) {
        this.$refs.baseInfo.query();
      }
    }
  }
};
</script>

<style lang="scss">

</style>
