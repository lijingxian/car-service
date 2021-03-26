<template>
  <div class="member-mgmt-card-view">
    <div class="no-content"
         v-if="memberCareList.length === 0"
         :style="styleObject"></div>
    <div class="category-list" v-for="category in categoryList" :key="category">
      <div class="category-name">{{ category }}</div>
      <item v-for="item of filteredList(category)"
        :key="item.id"
        :item="item"
        @click="cardClick"
        @delete="cardDelete"
        @refresh="refresh">
      </item>
    </div>
  </div>
</template>

<script>
import Item from './MemberCareCardItem';
import NoContent from '@/assets/images/emptyGray.png';

export default {
  name: 'MemberCareMgmtCardView',
  data() {
    return {};
  },
  props: {
    memberCareList: {
      type: Array,
      default() {
        return [];
      }
    }
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
    },
    categoryList() {
      return [...new Set(this.memberCareList.map(card => card.category.name))];
    }
  },
  methods: {
    filteredList(category) {
      return this.memberCareList.filter(card => card.category.name === category);
    },
    cardClick(id) {
      this.$emit('click', id);
    },
    cardDelete(id) {
      this.$emit('delete', id);
    },
    refresh() {
      this.$emit('refresh');
    }
  }
};
</script>

<style lang="scss">
.member-mgmt-card-view {
  display: flex;
  flex-wrap: wrap;
  // height: 100%;
  overflow: auto;
  .category-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .category-name {
    width: 100%;
    color: rgba(102, 102, 102, .75);
    font-size: 16px;
    font-weight: bold;
    line-height: 21px;
    margin: 20px 10px;
  }
}
</style>
