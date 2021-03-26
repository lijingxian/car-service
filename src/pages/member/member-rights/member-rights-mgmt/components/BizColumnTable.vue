<template>
  <div class="right-product-column">
    <div class="flex">
      <div class="rights_card" v-for="(right,index) in dataList" :key="index">
        <div class="logo">
          <div class="image">
            <img :src="right.logo||defaultImg" @click.stop="rightsIconHandeler(id, right.id)" />
          </div>
          <i class="el-icon-close" @click.stop="deleteHandler(right.id)"></i>
        </div>
        <div class="name" @click.stop="rightsIconHandeler(id, right.id)">{{right.name}}</div>
      </div>
      <div class="rights_card_add">
        <div class="image">
          <img class="addImg" :src="addButton" alt="" @click.stop="addHandeler(id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addButton from '@/assets/images/add.svg';
import defaultImg from '@/assets/images/icon_vip.png';
export default {
  name: 'brandSeriesMgmtList',
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      }
    },
    id: { type: String }
  },
  data() {
    return {
      addButton: addButton,
      defaultImg: defaultImg
    };
  },
  methods: {
    deleteHandler(id) {
      this.$emit('deleteRights', id);
    },
    // showIcon(index) {
    //   this.$refs.icon[index].style.display = '';
    // },
    // hideIcon(index) {
    //   this.$refs.icon[index].style.display = 'none';
    // },
    addHandeler(id) {
      this.$emit('addButtonClick', id);
    },
    rightsIconHandeler(classId, id) {
      this.$emit('rightsIconHandeler', classId, id);
    }
  }
};
</script>
<style lang="scss">
.right-product-column {
  .flex {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    .rights_card {
      display: flex;
      width: 23%;
      margin: 20px 0px 20px 20px;
      transition: all 0.3s;
      &:hover {
        opacity: 0.9;
        > .logo {
          i {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
      .name {
        color: #1a1a1a;
        font-size: 12px;
        margin-left: 15px;
        line-height: 50px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width:100%
      }
      .logo {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        .image {
          width: 75px;
          height: 50px;
          text-align: center;
          img {
            width: 50px;
            height: 50px;
            cursor: pointer;
          }
        }
        i {
          background: #000000;
          color: #ffffff;
          position: absolute;
          border-radius: 50%;
          padding: 5px;
          float: right;
          top: 0px;
          right: 0px;
          opacity: 0;
          transition: all 0.3s;
        }
      }
    }
    .rights_card_add {
      text-align: center;
      margin: 20px 0px 20px 20px;
      .image {
        border: dashed 1px #929292;
        border-radius: 5px;
        width: 75px;
        height: 50px;
        background-repeat: no-repeat;
        padding: 2px;
        img {
          margin-top: 5px;
          color: #c1c1c1;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
