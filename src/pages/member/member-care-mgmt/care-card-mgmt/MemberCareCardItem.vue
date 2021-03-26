<template>
  <el-card class="member-care-mgmt-card-item" @click.native="cardClick">
    <div class="header" slot="header">
      <i class="del-btn el-icon-error" @click.stop="handleDelete" v-if="hasAuthDel"></i>
      <div class="title">
        <span>{{ filteredTitle }}</span>
        <span class="state" :class="{ 'is-active': item.state === '1' }">{{ itemState }}</span>
      </div>
      <div class="desc">{{ item.description }}</div>
    </div>
    <div class="content">
      <div class="upper">内含福利:</div>
      <div class="lower">
        <!-- <span v-if="Number(item.point) !== 0">{{ item.point }}积分</span>
        <span v-if="Number(item.bean) !== 0">、{{ item.bean }}V豆</span>
        <span v-if="item.rightsList.length">
          、<span>{{ rights }}</span>
        </span> -->
        {{ computedWelfare }}
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'MemberCareMgmtCardItem',
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: '',
          rightsList: []
        };
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:member.memberCare.care.delete');
    },
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:member.memberCare.care.edit');
    },
    filteredTitle() {
      if (this.item.name.length > 15) {
        return this.item.name.slice(0, 15) + '...';
      } else {
        return this.item.name;
      }
    },
    itemState() {
      const { state } = this.item;
      return state === '0' ? '已停用' : '已启用';
    },
    rights() {
      if (!this.item.rightsList.length) return '';
      let rightsStr = this.item.rightsList.map(right => right.name).splice(0, 2).join('、');
      if (this.item.rightsList.length > 2) {
        rightsStr = rightsStr + '...';
      }
      return rightsStr;
    },
    computedWelfare() {
      let arr = [];
      const { item } = this;
      if (item.point > 0) {
        arr.push(`${item.point} 积分`);
      }
      if (item.bean > 0) {
        arr.push(`${item.bean} V豆`);
      }
      if (item.rightsList.length) {
        arr.push(`${this.rights}`);
      }
      return arr.join('、');
    }
  },
  methods: {
    handleDelete() {
      this.$emit('delete', this.item.id);
    },
    cardClick() {
      this.$emit('click', this.item.id);
    }
  }
};
</script>

<style lang="scss">
.member-care-mgmt-card-item {
  width: 384px;
  height: 268px;
  margin: 10px;
  cursor: pointer;
  .el-card__header {
    height: 168px;
  }
  .el-card__body {
    height: 100px;
    padding: 10px 20px;
    background-color: #f7f7f7;
  }
  .header {
    position: relative;
  }
  .del-btn {
    position: absolute;
    right: 0;
    font-size: 16px;
    color: #d9d9d9;
  }
  .title {
    margin-bottom: 20px;
    font-size: 16px;
    color: rgba(0, 0, 0, .65);
    line-height: 24px;
    font-weight: bold;
    .state {
      margin-left: 5px;
      font-size: 10px;
      padding: 0 3px;
      font-weight: normal;
      color: #fff;
      line-height: 15px;
      border-radius: 4px;
      background-color: #d9d9d9;
      &.is-active {
        background-color: #ff7300;
      }
    }
  }
  .desc,
  .content {
    font-size: 12px;
    color: rgba(0, 0, 0, .43);
    line-height: 18px;
    // 文本溢出显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .content {
  }
}
</style>
