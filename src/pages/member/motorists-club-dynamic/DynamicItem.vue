<template>
  <div class="dynamic-item">
    <div class="header">
      <div @click="select" class="title active" v-if="title">
        {{title}}
      </div>
      <div class="avatar" v-if="!title">
        <img :src="dynamic.authorData.head||DefaultAvatar" alt="">
        <div class="name">{{dynamic.authorData.name}}
        </div>
        <div class="from">{{dynamic.publishDate}}</div>
      </div>
      <div class="operate">
        <i @click="lookOver" class="iconfont biz-icon-chakan" title="查看"></i>
        <i class="iconfont biz-icon-vertical_line"></i>
        <i @click="top" :class="{active:dynamic.isTop==='1'}" class="iconfont biz-icon-zhiding" title="置顶"></i>
        <i class="iconfont biz-icon-vertical_line"></i>
        <i @click="deleteDynamic" class="el-icon-delete" title="删除" v-if="isDelete"></i>
      </div>
    </div>
    <div class="content" v-html="dynamic.content"></div>
    <div class="media">
      <img @click="onClickCarouselItem(index)" v-if="(dynamic.images.length!==0)&&(dynamic.videos.length===0)"
        v-for="(imgob,index) of dynamic.images" :key="index" :src="imgob" alt="">
      <video v-if="dynamic.videos.length!==0" controls :src="dynamic.videos[0]">
      </video>
    </div>
    <div class="details">
      <div class="avatar">
        <img :src="dynamic.authorData.head||DefaultAvatar" v-if="title" alt="">
        <div v-if="title" class="name">{{dynamic.authorData.name}}
        </div>
        <div v-if="title" class="from">{{dynamic.publishDate}}</div>
      </div>
      <div class="handle">
        <div class="p-btn">
          <i class="iconfont biz-icon-eye"></i>
          <div class="p-number">{{dynamic.readCount}}</div>
        </div>
        <div class="p-btn">
          <i @click="reply" class="iconfont biz-icon-message2"></i>
          <div class="p-number">{{dynamic.commentCount}}</div>
        </div>
        <div class="p-btn">
          <i @click="thumbsUp" class="iconfont" :class="zanClass"></i>
          <div class="p-number">{{dynamic.supportCount}}</div>
        </div>
      </div>
    </div>
    <el-dialog title="" width="50%" :visible.sync="dialogVisible" @open="openHandle">
      <el-carousel height="600px" :autoplay="false" arrow="always" ref="carousel" :initial-index="curIndex">
        <el-carousel-item v-for="(item,index) in dynamic.images" :key="index" :name="item">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import DynamicService from '@/service/motorists-club-dynamic/motoristsClubDynamic';
import DefaultAvatar from '@/assets/images/default_user.png';
export default {
  name: 'DynamicItem',
  data() {
    return {
      curIndex: '',
      DefaultAvatar: DefaultAvatar,
      editor: null,
      editorOption: {
        modules: {
          toolbar: {}
        },
        placeholder: '请输入正文...',
        theme: 'snow'
      },
      swiperOption: {
        autoHeight: true,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      dialogVisible: false
    };
  },
  props: {
    dynamic: Object,
    isDelete: {
      type: Boolean
    }
  },
  computed: {
    zanClass: function() {
      return {
        'biz-icon-dianzan_normal': this.dynamic.isSupport !== '1',
        active: this.dynamic.isSupport === '1',
        'biz-icon-dianzan_press': this.dynamic.isSupport === '1'
      };
    },
    title() {
      let title = this.dynamic.title || '';
      return title.slice(0, 30);
    }
  },
  methods: {
    openHandle() {
      if (this.$refs.carousel) {
        this.$refs.carousel.setActiveItem(this.curIndex);
      }
    },
    onClickCarouselItem(item) {
      this.curIndex = item;
      this.dialogVisible = true;
    },
    reply() {
      this.$emit('reply', this.dynamic.id, this.dynamic.title);
    },
    select() {
      this.$emit('select', {
        id: this.dynamic.id,
        author: this.dynamic.author
      });
    },
    // 点赞
    thumbsUp() {
      let params = {
        spaceId: this.dynamic.id
      };
      DynamicService.thumbsUp(
        params,
        data => {
          let dynamic = this.dynamic;
          if (data.type === 'unsupported') {
            dynamic.isSupport = '0';
            dynamic.supportCount--;
          } else {
            dynamic.isSupport = '1';
            dynamic.supportCount++;
          }
          this.$emit('update:dynamic', dynamic);
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 置顶
    top() {
      let params = {
        spaceId: this.dynamic.id
      };
      DynamicService.top(
        params,
        data => {
          let dynamic = this.dynamic;
          if (data.isTop === '0') {
            dynamic.isTop = '0';
          } else {
            dynamic.isTop = '1';
          }
          this.$emit('update', dynamic);
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 查看
    lookOver() {
      this.$emit('lookOver', {
        id: this.dynamic.id,
        author: this.dynamic.author
      });
    },
    // 删除
    deleteDynamic() {
      this.$emit('deleteDynamic', this.dynamic.id);
    }
  }
};
</script>

<style lang="scss">
.dynamic-item {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  padding: 30px 40px 15px 40px;

  .header {
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: bold;
      color: #1a1a1a;
      font-size: 16px;
    }
    .title.active {
      &:hover {
        color: #ff7300;
        cursor: pointer;
      }
    }
    .avatar {
      display: flex;
      align-items: center;
      width: 400px;
      img {
        width: 34px;
        height: 34px;
        border-radius: 17px;
      }
      .name {
        margin-left: 10px;
        margin-right: 30px;
        font-size: 14px;
      }
      .from {
        font-size: 13px;
        color: #666;
        white-space: nowrap;
      }
    }
    .operate {
      i {
        margin: 0 5px;
        font-size: 20px;
        color: #929292;
      }
      .biz-icon-zhiding,
      .biz-icon-chakan,
      .biz-icon-tuijian,
      .el-icon-delete {
        &:hover {
          color: #ff7300;
          cursor: pointer;
        }
      }
      .biz-icon-zhiding.active {
        color: #ff7300;
      }
      .biz-icon-tuijian.active {
        color: #ff7300;
      }
    }
  }
  .content {
    color: #1a1a1a;
    font-size: 14px;
    margin-top: 22px;
    margin-bottom: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .media {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    img {
      cursor: pointer;
      margin-right: 5px;
      object-fit: cover;
      width: 130px;
      height: 130px;
      &:hover {
        box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08);
      }
    }
    video {
      max-width: 300px;
      max-height: 300px;
      object-fit: cover;
    }
  }
  .details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .avatar {
      display: flex;
      align-items: center;
      width: 400px;
      img {
        width: 34px;
        height: 34px;
        border-radius: 17px;
      }
      .name {
        margin-left: 10px;
        margin-right: 30px;
        font-size: 14px;
      }
      .from {
        font-size: 13px;
        color: #666;
        white-space: nowrap;
      }
    }
    .handle {
      display: flex;
      justify-content: flex-end;
      .p-btn {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-left: 40px;
        i {
          line-height: 25px;
          color: #929292;
        }
        .biz-icon-message2,
        .biz-icon-dianzan_normal,
        .biz-icon-dianzan_press {
          &:hover {
            color: #ff7300;
            cursor: pointer;
          }
        }
        i.active {
          color: #ff7300;
        }
        .p-number {
          margin-left: 3px;
        }
      }
    }
  }

  .el-dialog {
    .el-carousel {
      height: 600px;
      .el-carousel__item {
        display: flex;
        justify-content: center;
        > img {
          margin: auto 0;
          max-height: 100%;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
