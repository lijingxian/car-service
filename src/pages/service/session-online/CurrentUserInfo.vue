<template>
  <div class="cs-c-user-info">
    <div class="info">
      <div class="avatar">
        <img :src="csData.head||DefaultAvatar" alt />
      </div>
      <div class="name">{{currentUser.name}}</div>
      <div class="voice" title="语音提示" @click="switchVoice">
        <img v-if="playVoice" :src="laba" />
        <img v-else :src="jingyin" />
      </div>
    </div>
    <div class="search">
      <el-input size="mini" placeholder="搜索联系人" v-model="keyword" @keyup.native.enter="submit">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
  </div>
</template>

<script>
import DefaultAvatar from '@/assets/images/default_user1.png';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import service from '@/service/customer-service/csMgmt.js';
import ImService from '@/service/customer-service/session-online/imService';
import IoService from '@/service/customer-service/session-online/imIo';
import laba from '@/assets/images/laba.png';
import jingyin from '@/assets/images/jingyin.png';

export default {
  name: 'CurrentUserInfo',
  data() {
    return {
      laba: laba,
      jingyin: jingyin,
      playVoice: true,
      DefaultAvatar: DefaultAvatar,
      keyword: ''
    };
  },
  created() {
    if (!this.csData.id) {
      this.getCsInfoByAdmin();
    }
  },
  components: {},
  computed: {
    ...mapGetters(['currentUser']),
    ...mapGetters('SessionOnline', ['csData', 'csList', 'groupList', 'onlineList'])
  },
  methods: {
    ...mapMutations('SessionOnline', ['updateUserKetword', 'updateCsData', 'pushRoom', 'makeAactivatedRoom']),
    ...mapActions('SessionOnline', ['getHistoryList']),
    switchVoice() {
      this.playVoice = !this.playVoice;
      IoService.switchVoice(this.playVoice);
    },
    submit() {
      this.updateUserKetword({
        userKetword: this.keyword
      });
    },
    getCsInfo() {
      let params = {
        id: this.currentUser.id
      };
      service.query(
        params,
        data => {
          console.log(data);
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    getCsInfoByAdmin() {
      // socket建立连接
      if (IoService.socket === null) {
        console.log('IoService.socket === null');
        IoService.connect();
      }
      let params = {
        id: this.currentUser.id
      };
      ImService.getCsInfoByAdmin(
        params,
        data => {
          this.updateCsData({
            csData: data.data
          });
          this.getHistoryList({
            cb: () => {
              this.getCustomerServiceList();
            }
          });
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 获取客服人员
    getCustomerServiceList() {
      let params = {
        pageNumber: 1,
        pageSize: 999,
        storeId: this.currentUser.shop.id,
        hierarchyId: '1'
      };
      ImService.getCustomerServiceList(
        params,
        data => {
          if (this.csList.length === 0) {
            for (const iterator of data.content) {
              if (this.currentUser.id !== iterator.admin) {
                this.pushRoom({
                  room: {
                    loading: false,
                    imType: 'cs',
                    activated: false,
                    isOnline: this.onlineList.csList.includes(iterator.admin),
                    csgroup: iterator.csgroup.slice(0),
                    head: iterator.head,
                    id: iterator.admin,
                    level: iterator.level,
                    mobile: iterator.mobile,
                    name: iterator.nickname,
                    receptnumber: iterator.receptnumber,
                    uuid: iterator.uuid,
                    messageList: [],
                    input: ''
                  }
                });
              }
            }
          }

          this.getCustomerServiceGroupList();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    // 获取群组
    getCustomerServiceGroupList() {
      let params = {
        pageNumber: 1,
        pageSize: 999
      };
      ImService.getMyGroupList(
        params,
        data => {
          if (this.groupList.length === 0) {
            for (const iterator of data.data) {
              this.pushRoom({
                room: {
                  loading: false,
                  imType: 'group',
                  activated: false,
                  name: iterator.name,
                  id: iterator.id,
                  description: iterator.description,
                  messageList: [],
                  input: ''
                }
              });
              IoService.joinRoom(iterator.id);
            }
          }
          // 激活一个Room
          // this.makeAactivatedRoom();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.cs-c-user-info {
  width: 220px;
  height: 125px;
  background: linear-gradient(to right, #f9a400 0%, #ffc018 100%);
  padding-top: 0;
  display: flex;
  flex-direction: column;
  > .info {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 25px;
      }
    }
    .name {
      width: 110px;
      margin-left: 10px;
      margin-right: 10px;
      color: #fff;
    }
    .voice {
      width: 25px;
      height: 25px;
      border: #f9a400 1px solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      > img {
        height: 80%;
        width: 80%;
        object-fit: cover;
      }
    }
  }
  > .search {
    margin-top: 10px;
    margin-left: 35px;
    .el-input__inner {
      width: 150px;
      border-radius: 12px;
      background-color: #feeecd;
      &:focus {
        border-color: #fde2aa;
      }
    }
  }
}
</style>
