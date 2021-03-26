<template>
  <div class="card-view">
    <div class="header"><span>一站式解决方案</span>商家经营解决方案，解决您多业务场景的行业问题</div>
    <div class="service-order-card-view" ref="divContent">
      <el-card class="order-card" v-for="item in dataFn" :key="item.id" @click.native="handleClick(item, true)">
        <div class="title">{{ item.name }}</div>
        <el-tag size="small" :style="tagStyle(item.subscribeState)">{{ item.subscribeState |
          filterState }}</el-tag>
        <div class="price color-orange">￥{{ item.price }}</div>
      </el-card>
      <!-- <div class="no-content" v-if="dataFn.length === 0" :style="styleObject"></div> -->
    </div>
    <div class="header"><span>为您精选</span>根据服务订购和店铺情况，实时为您推荐服务</div>
    <div class="service-order-card-view" ref="divContent">
      <el-card class="order-card" v-for="item in data" :key="item.id" @click.native="handleClick(item, false)">
        <div class="title">{{ item.businessService.name }}</div>
        <el-tag size="small" :style="tagStyle(item.businessService.subscribeState)">{{ item.businessService.subscribeState |
          filterState }}</el-tag>
        <div class="price color-orange">￥{{ item.price }}</div>
        <div class="dead-line" v-show="item.businessService.subscribeState==='1'&&item.businessServiceType!=='sms'"><span class="item-name">有效期截止:</span> {{ item.businessService.endDate }}</div>
        <div class="description" v-html="formatDescription(item.businessService.description || '')">
        </div>
      </el-card>
      <div class="no-content" v-if="data.length === 0" :style="styleObject"></div>
    </div>
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
    },
    dataFn: {
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
      return `<span class="item-name">服务简介: </span>${description}`;
    },
    handleClick(id, isFn) {
      this.$emit('click', id, isFn);
    }
  }
};
</script>

<style lang="scss">
.card-view {
  .header {
    background: #f8f8f8;
    height: 48px;
    line-height: 48px;
    margin: 0px 18px;
    font-size: 12px;
    span {
      font-size: 20px;
      margin: 0px 10px;
    }
  }
}
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
