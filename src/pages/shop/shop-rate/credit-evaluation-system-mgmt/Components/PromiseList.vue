<template>
  <div class="promise-list">
    <a class="promise-item" v-for="(item, index) in list" :key="index" @click="handleClick(item, $event)">
      <img v-if="item.icon" :src="item.icon" />
      <img v-else src="../../../../../assets/images/default_user.png" />
      <!-- <img :src="item.icon" /> -->
      <div class="title">{{item.name}}</div>
      <div class="close" @click="handleClose(item, $event)"><i class="el-icon-close"></i></div>
    </a>
    <div v-if="list.length === 0" :style="styleObject"></div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'PromiseList',
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {};
  },
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: '0px',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 350px no-repeat'
      };
    }
  },
  methods: {
    handleClick(model, e) {
      this.$emit('item-click', model, e);
    },
    handleClose(model, e) {
      e.stopPropagation();

      this.$emit('remove-item', model, e);
    }
  }
};
</script>

<style lang="scss">
$promise-list__item__close-size: 18px;
.promise-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  padding-top: 20px;

  .promise-item {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 20px 30px;
    width: 260px;
    text-align: center;
    border-radius: 6px;
    border: #fff solid 1px;
    cursor: pointer;

    box-shadow: #bbb 2px 2px 8px;

    img {
      display: block;
      height: 48px;
      width: 48px;
      margin: 0 auto;
      border-radius: 4px;
      text-align: center;
    }

    .title {
      margin-top: 10px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #333;

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
