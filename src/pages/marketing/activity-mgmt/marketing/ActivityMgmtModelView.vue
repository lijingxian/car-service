<template>
  <div class="activity-mgmt-model-view">
    <activity-mgmt-model-item @select="select" :activityModel="activityModel" v-for="activityModel of activityModelList" :key="activityModel.id">
    </activity-mgmt-model-item>
  </div>
</template>

<script>
import ActivityMgmtModelItem from './ActivityMgmtModelItem';

export default {
  name: 'ActivityMgmtModelView',
  data() {
    return {};
  },
  props: {
    activityModelList: Array
  },
  components: { ActivityMgmtModelItem },
  created() {},
  methods: {
    select(activityModel) {
      this.$emit('select', activityModel);
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-model-view {
  display: flex;
  flex-wrap: wrap;
  height:100%;
  overflow: auto
}
</style>
