<template>
  <div class="activity-model-item">
    <div class="title" @click="select">{{activity.name}}</div>
    <div class="image">
      <i class="el-icon-error" @click.stop="$emit('remove',activity.id)"></i>
      <div style="width:200px;height:356px;position:absolute;background:#fff" v-if="!activity.content">
        <div :style="styleObject" v-if="!activity.content"></div>
      </div>
      <iframe ref="iframe" @load="onLoad" :src="'/#/site/single-page?shopId=10&channel=10&activityId='+activity.id+'_memberCareTemplate'" frameborder="0" width="200px" height="356px"></iframe>
    </div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'ActivityModelItem',
  data() {
    return {};
  },
  created() {},
  components: {},
  props: {
    activity: {}
  },
  computed: {
    styleObject() {
      return {
        height: '100%',
        width: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  methods: {
    select() {
      console.log('select');
      this.$emit('select', this.activity);
      console.log('select');
    },
    onLoad() {
      setTimeout(() => {
        this.$refs.iframe.contentWindow.document.documentElement.style.fontSize = '18px';
      }, 200);
    },
    check() {
      console.log('check');
    }
  }
};
</script>

<style lang="scss">
.activity-model-item {
  margin: 40px 20px;
  .title {
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .image {
    position: relative;
    width: 200px;
    i {
      font-size: 25px;
      color: #666;
      transition: all 0.3s;
      position: absolute;
      top: 5px;
      right: 5px;
      opacity: 0;
      z-index: 10;
    }
    &:hover {
      i {
        opacity: 1;
      }
      cursor: pointer;
    }
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 356px;
  }
}
</style>
