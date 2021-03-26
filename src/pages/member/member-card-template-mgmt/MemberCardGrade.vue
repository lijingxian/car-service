<template>
  <div class="member-card-grade">
    <a class="promise-item" v-for="(item, index) in gradeList" :key="index" @click="handleClick(item, $event)">
      <div class="title">{{item.name}}({{item.state==='1'?'启用':'停用'}})</div>
      <img v-if="item.image" :src="item.image" />
      <img v-else src="../../../assets/images/icon_vip.png" />
      <div class="count">{{item.point}}</div>
      <div class="contenttext">
        <span v-for="(right, index) in item.rights" :key="index" ><span v-for="(rightItem,index) in right.rights"  :key="index" v-if="rightItem.isSelected==1">{{(right.rights.length>1&&right.rights.length===index+1)?rightItem.name:rightItem.name+'、'}}</span></span>
      </div>
      <!-- <img :src="item.icon" /> -->
      <div class="close" @click.stop="handleClose(item, $event)" v-if="isEdit">
        <i class="el-icon-close"></i>
      </div>
    </a>
    <div v-if="isEdit">
      <a class="promise-item-add" @click="addHandleClick">
        <i class="el-icon-plus"></i>
        <div class="count">添加会员卡等级</div>
      </a>
    </div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';

export default {
  name: 'MemberMgmtCardView',
  props: {
    gradeList: Array,
    isEdit: {
      type: Boolean,
      default () {
        return true;
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
    addHandleClick() {
      this.$emit('addHandleClick');
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
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 50% no-repeat'
      };
    }
  }
};
</script>

<style lang="scss">
$promise-list__item__close-size: 18px;
.member-card-grade {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  padding-top: 20px;

  .promise-item-add {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 50px 25px;
    width: 320px;
    height: 188px;
    text-align: center;
    border-radius: 6px;
    border: #fff solid 1px;
    cursor: pointer;

    box-shadow: #bbb 2px 2px 8px;
    .el-icon-plus {
      line-height: 50px;
      width: 50px;
      height: 50px;
      font-size: 30px;
      border: 1px solid #ddd;
      border-radius: 50%;
      color: #ddd;
      margin: 0 auto;
    }
    img {
      display: block;
      height: 48px;
      width: 48px;
      margin: 0 auto;
      border-radius: 50%;
      text-align: center;
    }

    .title {
      text-align: left;
      font-size: 12px;
      color: #aaa;
    }

    .count {
      font-size: 15px;
      color: #ff7300;
    }
    .contenttext {
      font-size: 12px;
      color: #aaa;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  .promise-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 15px 25px;
    width: 320px;
    height: 188px;
    text-align: center;
    border-radius: 6px;
    border: #fff solid 1px;
    cursor: pointer;

    box-shadow: #bbb 2px 2px 8px;
    .el-icon-plus {
      line-height: 50px;
      width: 50px;
      height: 50px;
      font-size: 30px;
      border: 1px solid #ddd;
      border-radius: 50%;
      color: #ddd;
      margin: 0 auto;
    }
    img {
      display: block;
      height: 48px;
      width: 48px;
      margin: 0 auto;
      border-radius: 50%;
      text-align: center;
    }

    .title {
      text-align: left;
      font-size: 12px;
      color: #aaa;
    }

    .count {
      font-size: 15px;
      color: #ff7300;
    }
    .contenttext {
      font-size: 12px;
      color: #aaa;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
