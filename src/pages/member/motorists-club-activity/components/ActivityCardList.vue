<template>
  <div class="activity-list">
    <div class="activity-list__content" :class="{ hide: !(activities && activities.length > 0) }">
      <template v-for="activity in activities">
        <activity-card :key="activity.id" :model="activity" @closed="deleteItem" @cardClicked="cardClicked" @topClicked="topClicked">
        </activity-card>
      </template>
    </div>
    <div v-if="activities.length === 0" class="activity-list-no-data"></div>
  </div>
</template>

<script>
import ActivityCard from './ActivityCard';

export default {
  props: ['activities'],
  methods: {
    deleteItem(e, model) {
      this.$emit('deleteItem', e, this.activities.indexOf(model));
    },
    cardClicked(e, model) {
      this.$emit('cardClicked', e, model);
    },
    topClicked(e, model) {
      this.$emit('topClicked', e, model);
    }
  },
  components: {
    ActivityCard
  }
};
</script>

<style lang="scss">
.activity-list {
  .activity-list__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 5px;
  }

  .activity-list-no-data {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: url('~@/assets/images/emptyGray.png') 50% 50% / 250px no-repeat;
  }

  .hide {
    display: none;
  }
}
</style>
