<template>
  <div class="product-column">
    <div class="flex">
      <div class="rights_card" v-for="(tag,index) in seriesDataList" :key="index">
        <div class="logo">
          <div class="image">
            <img :src="tag.image" :onerror="defaultImg" @click.stop="seriesIconHandeler(id, tag.id)" />
          </div>
          <i class="el-icon-close" @click.stop="deleteHandler(tag.id)"></i>
        </div>
        <span style="color: #1a1a1a;font-size:12px;margin-left:15px;">{{tag.name}}</span>
      </div>
      <div class="rights_card_add" @click.stop="addHandeler(id)">
        <div class="image">
          <img class="addImg" src="../../assets/images/add.svg" alt=""/>
        </div>
        <span class="label">添加系列
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import addButton from '@/assets/images/add.svg';

export default {
  name: 'brandSeriesMgmtList',
  props: {
    seriesDataList: {
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
      defaultImg: 'this.src="' + require('../../assets/images/commodity/pic_default_fail.png') + '"'
    };
  },
  methods: {
    deleteHandler(id) {
      this.$emit('deleteSeries', id);
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
    seriesIconHandeler(brandId, id) {
      this.$emit('seriesIconClick', brandId, id);
    }
  }
};
</script>
<style lang="scss">
.product-column {
  .flex {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    .rights_card {
      display: inline-block;
      width: 33%;
      position: relative;
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
      .logo {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        .image {
          width: 75px;
          height: 50px;
          text-align: center;
          position: relative;
          img {
            width: 75px;
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
      display: flex;
      align-items: center;
      margin: 20px 0px 20px 20px;
      cursor: pointer;
      .image {
        border: dashed 1px #929292;
        border-radius: 5px;
        width: 75px;
        height: 50px;
        background-repeat: no-repeat;
        padding: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          color: #c1c1c1;
        }
      }
      .label {
        color: #929292;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
}
</style>
