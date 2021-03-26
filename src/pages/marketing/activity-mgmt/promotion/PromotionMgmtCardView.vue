<template>
  <div class="promotion-mgmt-card-view">
    <div class="no-content"
         v-if="promotionList.length === 0"
         :style="styleObject"></div>
    <item v-for="promotion of promotionList"
          :key="promotion.id"
          :promotion="promotion"
          @select="select"
          @deleted="deleted">
    </item>
  </div>
</template>

<script>
import Item from './PromotionMgmtCardItem';
import NoContent from '@/assets/images/emptyGray.png';

export default {
  name: 'PromotionMgmtCardView',
  data() {
    return {};
  },
  props: {
    promotionList: Array
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
    select(promotion) {
      this.$emit('select', promotion);
    },
    deleted() {
      this.$emit('deleted');
    }
  }
};
</script>

<style lang="scss">
.promotion-mgmt-card-view {
  display: flex;
  flex-wrap: wrap;
}
</style>
