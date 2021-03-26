<template>
  <div class="promise-list">
    <a
      class="promise-item"
      v-for="(item, index) in list"
      :key="index"
      @click="handleClick(item, $event)"
    >
      <img v-if="item.head" :src="item.head" />
      <img v-else src="../../../../assets/images/default_user.png" />
      <div class="title">{{item.name}}</div>
      <div class="count">{{item.shop.name}}</div>
      <div class="count">{{item.memberCount}}人</div>
      <!-- <div class="content">{{item.remark}}</div> -->
      <!-- <img :src="item.icon" /> -->
      <div class="close" @click="handleClose(item, $event)" v-if="hasAuthDel && (item.unionConfig.editable === '1' || getUser.roleLevel !== 'shop')"><i class="el-icon-close"></i></div>
    </a>
    <div v-if="list.length === 0" :style="styleObject"></div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
import { mapGetters } from 'vuex';
export default {
  name: 'MotorClubList',
  props: {
    list: {
      type: Array
    },
    editShopIds: {
      type: Array
    }
  },
  data () {
    return {

    };
  },
  methods: {
    handleClick (model, e) {
      this.$emit('item-click', model, e);
    },
    handleClose (model, e) {
      e.stopPropagation();

      this.$emit('remove-item', model, e);
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:fleet.delete');
    },
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 20% no-repeat'
      };
    }
  }
};
</script>

<style lang="scss">
$promise-list__item__close-size:    18px;
.promise-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  padding: 25px;

  .promise-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 25px;
    margin-bottom: 25px;
    padding: 20px 25px;
    // width: 320px;
    // height: 188px;
    width: 169px;
    height: 198px;
    text-align: center;
    border-radius: 6px;
    border: #fff solid 1px;
    cursor: pointer;

    box-shadow: #bbb 2px 2px 8px;

    img {
      display: block;
      // height: 48px;
      // width: 48px;
      width: 75px;
      height: 75px;
      margin: 0 auto;
      border-radius: 4px;
      text-align: center;
    }

    .title {
      font-size: 15px;
      color: #3b3b3b;
      font-weight: bold;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .count {
      font-size: 12px;
      color: #aaa;
    }

    .content {
      font-size: 12px;
      color: #aaa;
      text-align: left;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .close {
      position: absolute;
      display: none;
      right: 5px;
      top: 5px;
      width: $promise-list__item__close-size;
      height: $promise-list__item__close-size;
      border-radius: 50%;
      background: #333;
      color: #fff;
      font-size: $promise-list__item__close-size / 4 * 3;
      line-height: $promise-list__item__close-size;
      text-align: center;
      opacity: 0.7;
      z-index: 2;

      &:hover {
        opacity: 1;
      }
    }

    &:hover {
      .close {
        display: block;
      }

      border: #ff7300 solid 1px;
    }
  }

  .no-data {
    display: block;
    width: 100%;
    text-align: center;
    color: #929292;
    padding-top: 30px;
  }

  .hide {
    display: none;
  }
}
</style>
