<template>
  <div class="wechat-preview">
    <el-card class="card-list" :body-style="{padding: 0}">
      <div slot="header" v-if="isReadOnly">
        <span>{{date}}</span>
      </div>
      <div class="big-cover"
        :disabled="previewList.length === 1"
        @click="cardClick(previewList[0].id)"
      >
        <img :src="previewList[0].titleImage" class="cover-img" alt="">
        <!-- <img :src="imgUrl" class="cover-img" alt=""> -->
        <div class="big-title" v-if="previewList.length > 1">{{previewList[0].title}}</div>
      </div>
      <div class="article" v-if="previewList.length === 1" @click="cardClick(previewList[0].id)">
        <div class="title">{{previewList[0].title}}</div>
      </div>
      <div class="article"
        v-for="(preview, index) in previewList"
        :key="preview.id"
        v-if="index > 0"
        @click="cardClick(preview.id)"
      >
        <div class="title">{{preview.title}}</div>
        <div class="cover" :style="imgStyle">
          <img :src="preview.titleImage" alt="" class="cover-img">
        </div>
        <div class="option-panel flex-box" v-if="!isReadOnly">
          <div class="flex-box">
            <el-button v-if="index > 0" @click="moveUp(index)" type="text">
              <i class="iconfont">↑</i>
            </el-button>
            <el-button v-if="index < previewList.length - 1" @click="moveDown(index)" type="text">
              <i class="iconfont">↓</i>
            </el-button>
          </div>
          <el-button v-if="index !== 0" @click="moveAway(index)" type="text">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>
    </el-card>
    <!-- <el-button v-for="operation in operations" :key="operation.index" @click="operate(operation.name)" :type="operation.type">{{operation.label}}</el-button> -->
  </div>
</template>

<script>

export default {
  name: 'WechatPreview',
  props: {
    date: {
      type: String,
      default: ''
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    previewList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      selectedCardId: '',
      operations: [
        { label: '上移', name: 'moveUp', type: 'primary' },
        { label: '下移', name: 'moveDown', type: 'primary' },
        { label: '移除', name: 'moveAway', type: 'primary' }
      ],
      imgStyle: 'background: #ffffff url(' + '' + ') no-repeat fixed center; background-size: 100%',
      imgUrl: '/upload/image/201805/fe63fb12-f0f5-4cca-9301-6a8d8b0bd951.jpg'
    };
  },
  methods: {
    cardClick(id) {
      this.$emit('cardClick', id);
    },
    operate(name) {
      this[name]();
    },
    moveUp(index) {
      console.log('index: ', index);
      let tmp = this.previewList[index - 1];
      this.$set(this.previewList, index - 1, this.previewList[index]);
      this.$set(this.previewList, index, tmp);
    },
    moveDown(index) {
      console.log('index: ', index);
      let tmp = this.previewList[index + 1];
      this.$set(this.previewList, index + 1, this.previewList[index]);
      this.$set(this.previewList, index, tmp);
    },
    moveAway(index) {
      console.log('index: ', index);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.previewList.splice(index + 1, 1);
      }).catch();
    },
    isSelected(id) {
      if (this.selectedCardId === id) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    itemIndex() {
      for (let i = 0; i < this.previewList.length; i++) {
        if (this.previewList[i].id === this.selectedCardId) {
          return i;
        }
      }
      return 0;
    },
    bigCoverBackground() {
      return `url(${this.previewList[0].titleImage}) no-repeat no-repeat`;
      // return `url(${this.imgUrl}) 100% 100% no-repeat`;
    }
  },
  mounted() {
  },
  watch: {
    previewList: {
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('update:previewList', newVal);
      }
    }
  },
  components: {
  }
};
</script>

<style lang="scss">
.wechat-preview {
  .selectedCardStyle {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.5);
  }
  .card-list {
    margin-bottom: 20px;
    .cover-img {
        position: absolute;
        left: 0;
        bottom: 0;
        width: auto;
        height: auto;
        // max-height: 100%;
        max-width: 100%;
      }
    .big-cover {
      cursor: pointer;
      position: relative;
      width: 100%;
      // height: 300px;
      height: 0;
      padding-bottom: 56.2%;
      overflow: hidden;
      .big-title {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 20px 20px;
        background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.5));
        color: #ffffff;
        font-size: 25px;
        font-weight: 400;
      }
    }
    .article {
      cursor: pointer;
      position: relative;
      height: 100px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        height: 100%;
        width: 100%;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      .cover {
        height: 100%;
        width: 40%;
        margin-left: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .option-panel {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 333;
        width: 100%;
        height: 45%;
        background-color: rgba(0, 0, 0, .5);
        button {
          width: 45px;
          margin-left: 10px;
        }
        .el-button--text {
          color: #ccc;
          font-size: 18px;
          font-weight: bold;
          &:hover {
            color: #bbb;
          }
        }
      }
      &:hover .option-panel {
        display: flex;
        justify-content: space-between;
      }
    }
    .article:nth-child(n + 3):before {
      content: '';
      position: absolute;
      top: -1px;
      left: 10px;
      width: 70%;
      height: 1px;
      background-color: #ebeef5;
    }
  }
}
</style>
