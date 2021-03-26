<template>
  <div class="service-order-card-view" ref="divContent">
    <el-card class="order-card" v-for="item in data" :key="item.id" @click.native="handleClick(item)">
      <div class="title">{{item.name}}</div>
      <div class="price color-orange">￥{{ item.price }}</div>
      <div class="description" v-html="formatDescription(item.summary || '')">
      </div>
    </el-card>
    <div class="no-content" v-if="data.length === 0" :style="styleObject"></div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'CardView',
  filters: {
    filterState(value) {
      return value === '1' ? '已订购' : '未订购';
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  components: {},
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
  watch: {},
  mounted() {},
  methods: {
    tagStyle(state) {
      if (state === '0') {
        return {
          'background-color': '#ffffff'
        };
      }
      return {
        'background-color': '#f7f7f7'
      };
    },
    formatDescription(description) {
      return `<span class="item-name">简介: </span>${description}`;
    },
    handleClick(id) {
      this.$emit('click', id);
    }
  }
};
</script>

<style lang="scss">
.service-order-card-view {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  height: 100%;
  overflow: auto;
  .color-orange {
    color: #ff7300;
  }
  .order-card {
    cursor: pointer;
    width: 280px;
    height: 200px;
    margin: 7px;
    font-size: 12px;
    .title {
      font-size: 20px;
      color: #101010;
    }
    .el-tag {
      display: block;
      width: 56px;
      margin-top: 6px;
      margin-bottom: 20px;
      // A6表示透明度65%, 255*.65 = 165.75 = 166 = #A6
      color: #101010a6;
      border-color: #e9e9e9;
    }
    .price {
      font-size: 14px;
      padding: 20px 0px;
    }
    .item-name {
      font-size: 14px;
      color: #000000a6;
    }
    .dead-line,
    .description {
      color: #101010a6;
    }
    .description {
      word-break: break-all;
      // 文本溢出显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
