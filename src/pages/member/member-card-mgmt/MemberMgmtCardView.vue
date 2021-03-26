<template>
  <div class="promise-list-card">
    <a :class="item.state==='1'?'promise-item':'promise-item promise-item-disabled'" v-for="(item, index) in cardList" :key="index"
      @click="handleClick(item, $event)">
      <div class="title">
        <div>No.{{item.sn}}</div>
        <div>
          <span class="template-name" :title="item.template.name">{{item.template.name}}</span>
          <img v-if="item.memberRank.image" :src="item.memberRank.image" />
          <img v-else src="../../../assets/images/icon_vip.png" />
        </div>
        </div>
        <div class="center-content">
          <img v-if="item.member.head" :src="item.member.head" />
          <img v-else src="../../../assets/images/default_user.png" />
          <div class="content">
            <div class="count">{{item.member.name}}</div>
            <div class="count1">{{item.member.mobile}}</div>
            <div class="count1">{{item.shop.name}}</div>
          </div>
        </div>
        <div class="contenttext">
          <div>￥{{item.balance}}</div>
          <div>{{item.bean}}V豆</div>
          <div>{{item.point}}积分</div>
        </div>
        <!-- <img :src="item.icon" /> -->
        <div class="close" @click.stop="handleClose(item, $event)" v-if="hasAuthDel&&item.unionConfig.editable === '1'||getUser.roleLevel !== 'shop'">
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
  name: 'MemberMgmtCardView',
  props: {
    cardList: Array,
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    },
    editShopIds: {
      type: Array,
      default() {
        return [];
      }
    }
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
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:memberCard.delete');
    },
    hasAuthRightsout() {
      // return true;
      return this.currentAuth.includes('admin:memberCard.rightsout');
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
$promise-list__item__close-size: 18px;
.promise-list-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  padding-top: 20px;
  height: 100%;
  overflow: auto;
  .promise-item-disabled {
    background: #f5f5f5;
  }
  .template-name {
    display: inline-block;
    width: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
        height: 28px;
        width: 28px;
        // margin: 0 auto;
        border-radius: 50%;
        text-align: center;
      }
    }

    .count {
      font-size: 15px;
      color: #3b3b3b;
      font-weight: bold;
    }
    .count1 {
      font-size: 12px;
      color: #aaa;
      margin-top: 5px;
    }
    .contenttext {
      font-size: 12px;
      color: #aaa;
      display: flex;
      justify-content: space-between;
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
