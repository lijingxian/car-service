<template>
  <el-menu-item class="im-group-item"
                @click="choose"
                :index="index">
    <div class="avatar">
      <img :src="group.head||DefaultAvatar"
           alt="">
    </div>
    <div class="name">
      {{group.name}}
    </div>
  </el-menu-item>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user.png';

export default {
  name: 'ImGroupItem',
  data() {
    return {
      DefaultAvatar: DefaultAvatar
    };
  },
  props: {
    group: Object,
    index: String
  },
  created() {},
  mounted() {},
  components: {},
  computed: {},
  methods: {
    choose() {
      this.$emit('choose', this.group);
    }
  }
};
</script>

<style lang="scss">
.im-group-item {
  padding-left: 60px !important;
  padding-right: 30px !important;
  .avatar {
    position: absolute;
    width: 40px;
    height: 40px;
    left: 10px;
    top: 50%;
    margin-top: -20px;
    border-radius: 20px;
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 20px;
    }
  }
}
</style>
