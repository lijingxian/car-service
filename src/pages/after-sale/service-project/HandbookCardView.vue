<template>
  <div class="handbook-list-card">
    <a class="promise-item" v-for="(item, index) in cardList" :key="index"
      @click="handleClick(item, $event)">
      <div class="title">
        <div class="center-content">
          <img v-if="item.image" :src="item.image" :onerror="errorImg" />
          <img v-else src="/resources/admin/images/default/product-default-100.png" />
          <div class="content">
            <div class="count">{{item.brand}}</div>
            <div class="count">{{item.series}}</div>
            <div class="count1" v-html="item.carType.replace(/\,/g, '<br>')">{{item.carType}}</div>
          </div>
        </div>
      </div>
      <div class="close" @click.stop="handleClose(item, $event)">
        <i class="el-icon-close"></i>
      </div>
    </a>
    <div v-if="cardList.length === 0" :style="styleObject"></div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
import { mapGetters } from 'vuex';
export default {
  name: 'HandbookCardView',
  props: {
    cardList: Array
  },
  data() {
    return {};
  },
  methods: {
    handleClick(model, e) {
      this.$emit('rowClick', model);
    },
    handleClose(model, e) {
      this.$emit('deleteLine', model);
    },
    operationSuccess() {
      this.$emit('create');
    },
    filterChange() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    }
  },
  computed: {
    ...mapGetters(['getUser']),
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
$promise-list__item__close-size: 18px;
.handbook-list-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  padding-top: 20px;
  height: 100%;
  .promise-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 20px 25px;
    width: 320px;
    height: 188px;
    text-align: center;
    border-radius: 6px;
    border: #fff solid 1px;
    cursor: pointer;

    box-shadow: #bbb 2px 2px 8px;

    img {
      display: block;
      height: 48px;
      width: 48px;
      // margin: 0 auto;
      border-radius: 50%;
      text-align: center;
    }
    .center-content {
      display: flex;
      justify-content: flex-start;
      .content {
        margin-left: 10px;
        text-align: left;
      }
    }
    .title {
      text-align: left;
      font-size: 12px;
      color: #aaa;
      display: flex;
      justify-content: space-between;
      img {
        display: block;
        // margin: 0 auto;
        border-radius: 50%;
        text-align: center;
      }
    }

    .count {
      font-size: 14px;
      color: #3b3b3b;
      font-weight: bold;
    }
    .count1 {
      font-size: 12px;
      color: #aaa;
      margin-top: 5px;
      display: -webkit-box !important;
      overflow: hidden;
      white-space: normal !important;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
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
}
</style>
