<template>
  <div class="activity-mgmt-card-view">
    <div class="no-content"
         v-if="activityList.length === 0"
         :style="styleObject"></div>
    <item v-for="activity of activityList"
          :key="activity.id"
          :activity="activity"
          @select="select"
          @created="created">
    </item>
  </div>
</template>

<script>
import Item from './ActivityMgmtCardItem';
import NoContent from '@/assets/images/emptyGray.png';

export default {
  name: 'ActivityMgmtCardView',
  data() {
    return {};
  },
  props: {
    activityList: Array
  },
  components: { Item },
  created() {},
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / auto 200px no-repeat'
      };
    }
  },
  methods: {
    select(activity) {
      this.$emit('select', activity);
    },
    created() {
      this.$emit('created');
    }
  }
};
</script>

<style lang="scss">
.activity-mgmt-card-view {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  overflow: auto;
}
</style>
