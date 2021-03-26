<template>
  <div class="user-list">
    <el-menu ref="menu" class="el-menu-user-list" background-color="#fff" text-color="#353535" active-text-color="#353535">
      <!-- <el-submenu index="1">
        <template slot="title">
          <span>客服群组</span>
        </template>
        <im-group-item @choose="choose" :index="'group'+group.id" v-for="group of groupList" :group="group" :key="'group'+group.id"></im-group-item>
      </el-submenu> -->
      <el-submenu index="2" class="cs-style">
        <template slot="title">
          <span>客服人员</span>
        </template>
        <im-user-item :user="user" :index="'cs'+user.id" @choose="choose" v-for="user of csListOnline" :key="'cs'+user.id"></im-user-item>
        <im-user-item :user="user" :index="'cs'+user.id" @choose="choose" v-for="user of csListNotOnline" :key="'cs'+user.id"></im-user-item>
      </el-submenu>
      <!-- <el-submenu index="3" class="cs-style">
        <template slot="title">
          <span>交谈中客户</span>
        </template>
        <im-user-item :user="user" :index="'client'+user.id" @choose="choose" v-for="user of clientListOnline" :key="'client'+user.id"></im-user-item>
        <im-user-item :user="user" :index="'client'+user.id" @choose="choose" v-for="user of clientListNotOnline" :key="'client'+user.id"></im-user-item>
      </el-submenu>
      <el-submenu index="4" class="cs-style">
        <template slot="title">
          <span>会话结束客户</span>
        </template>
        <im-user-item :user="user" :index="'client'+user.id" @choose="choose" v-for="user of clientEndListOnline" :key="'client'+user.id"></im-user-item>
        <im-user-item :user="user" :index="'client'+user.id" @choose="choose" v-for="user of clientEndListNotOnline" :key="'client'+user.id"></im-user-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>

<script>
import ImUserItem from './ImUserItem';
// import ImGroupItem from './ImGroupItem';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'UserList',
  data() {
    return {};
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.$refs.menu.open('3');
    }, 100);
  },
  components: { ImUserItem },
  computed: {
    ...mapGetters('CustomService', [
      'activatedRoom',
      'groupList',
      'csListOnline',
      'csListNotOnline',
      'clientListOnline',
      'clientListNotOnline',
      'clientEndList',
      'clientEndListOnline',
      'clientEndListNotOnline',
      'csData'
    ]),
    ...mapGetters(['currentUser']),
    activeIndex() {
      if (this.activatedRoom) {
        if (this.activatedRoom.imType === 'client' || this.activatedRoom.imType === 'clientEnd') {
          return 'client' + this.activatedRoom.id;
        } else if (this.activatedRoom.imType === 'cs') {
          return 'cs' + this.activatedRoom.id;
        } else if (this.activatedRoom.imType === 'group') {
          return 'group' + this.activatedRoom.id;
        }
      }
      return '';
    }
  },
  watch: {},
  beforeDestroy() {
    // 此处需要把所有聊天信息清空
  },
  methods: {
    ...mapMutations('CustomService', ['changeActivatedRoom']),
    choose(room) {
      if (room.activated) {
        return;
      }
      this.changeActivatedRoom(room);
    }
  }
};
</script>

<style lang="scss">
.user-list {
  width: 220px;
  height: 445px;
  overflow-y: auto;
  padding: 0;
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 5px;
    height: 12px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c3c3c3;
    border-radius: 12px;
  }
  > .el-menu-user-list {
    height: 100%;
    border-width: 0;
    .el-submenu__title,
    .el-menu-item {
      font-size: 13px;
      height: 60px;
      &:hover {
        background-color: #fff8f0 !important;
      }
    }
    .el-menu-item.is-active {
      background-color: #fef3e5 !important;
    }
  }
}
</style>
