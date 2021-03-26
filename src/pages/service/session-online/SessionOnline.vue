<template>
  <div class="session-online">
    <div class="wrapper">
      <div class="w-left">
        <current-user-info></current-user-info>
        <user-list @choose-room="chooseRoom"></user-list>
      </div>
      <div class="w-right">
        <im-content v-if="activatedRoom" @product="onProduct"></im-content>
      </div>
    </div>
    <biz-popup-tabs :open="open" v-model="tabSelection" @close="onClose">
      <el-tab-pane label="基本信息" name="baseinfo">
        <product-info :id="productId" :isEdit="false" :open="open"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CurrentUserInfo from './CurrentUserInfo';
import UserList from './UserList';
import ImContent from './ImContent';
import { BizPopupTabs } from '@/components/BizPopup';
import ProductInfo from './components/ProductInfo';

export default {
  name: 'SessionOnline',
  data() {
    return {
      productId: '',
      tabSelection: 'baseinfo',
      open: false,
      isCS: false,
      user: {},
      timer: null
    };
  },
  created() {
    this.getBaseInfo();
  },
  components: {
    ProductInfo,
    BizPopupTabs,
    CurrentUserInfo,
    UserList,
    ImContent
  },
  computed: {
    ...mapGetters('SessionOnline', ['activatedRoom', 'unReadedMessageList'])
  },
  watch: {
    unReadedMessageList(newVal, oldVal) {
      console.log('unReadedMessageList');
      if (newVal.length > 0) {
        if (this.timer === null) {
          this.timer = setTimeout(() => {
            if (window.Notification) {
              Notification.requestPermission(function(status) {
                if (status === 'granted') {
                  /* eslint-disable no-new */
                  new Notification('提示', {
                    body: '您有新的客户接入!'
                  });
                }
              });
            }
          }, 3 * 60 * 1000);
        }
      } else {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    onClose() {
      this.open = false;
    },
    onProduct(id) {
      this.productId = id;
      this.open = true;
    },
    getBaseInfo() {
      this.user = this.getUser();
      for (const iterator of this.user.roleDatas) {
        if (iterator.type === '4') {
          this.isCS = true;
          break;
        }
      }
    },
    chooseRoom(room) {
      this.room = room;
    }
  }
};
</script>

<style lang="scss">
.session-online {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > .wrapper {
    width: 1000px;
    height: 572px;
    display: flex;
    border: 1px solid #ccc;
  }
}
</style>
