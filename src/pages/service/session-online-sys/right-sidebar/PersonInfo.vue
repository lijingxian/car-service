<template>
  <div class="person-info">
    <el-form label-width="80px" size="small" v-loading="loading" disabled :inline-message="true">
      <!-- 个人信息 -->
      <el-form-item label="用户名" v-if="isCs||isClient">
        <el-input v-model="userInfo.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" v-if="isCs||isClient">
        <el-input v-model="userInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item label="姓名" v-if="isCs||isClient">
        <el-input v-model="userInfo.realName"></el-input>
      </el-form-item>
      <el-form-item label="昵称" v-if="isCs||isClient">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户来源" v-if="isCs||isClient">
        <el-input :value="getSource"></el-input>
      </el-form-item>
      <el-form-item label="性别" v-if="isCs||isClient">
        <el-select v-model="userInfo.gender">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
          <el-option label="保密" value="2"></el-option>
        </el-select>
      </el-form-item>

      <!-- 群组信息 -->
      <el-form-item label="群组" v-if="isGroup">
        <el-input v-model="groupInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="群主" v-if="isGroup">
        <el-input v-model="groupInfo.groupOwner.name"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ImService from '@/service/customer-service/session-online/imService';
import service from '@/service/customer-service/group-mgmt/groupBaseInfo';

export default {
  name: 'PersonInfo',
  data() {
    return {
      loading: false,
      userInfo: {
        userSource: '',
        realName: '',
        userName: '',
        mobile: '',
        nickname: '',
        gender: '0'
      },
      groupInfo: {
        name: '',
        groupOwner: { name: '' }
      }
    };
  },
  props: {},
  created() {},
  components: {},
  computed: {
    ...mapGetters('CustomService', ['activatedRoom']),
    isCs() {
      return this.activatedRoom.imType === 'cs';
    },
    isClient() {
      return this.activatedRoom.imType === 'client' || this.activatedRoom.imType === 'clientEnd';
    },
    isGroup() {
      return this.activatedRoom.imType === 'group';
    },
    getSource() {
      switch (this.userInfo.userSource) {
        case '0':
          return '推荐注册';
        case '1':
          return '潜客转化';
        case '2':
          return '正常注册';
        case '3':
          return '后台创建';
        case '4':
          return '其他';
        default:
          return '';
      }
    }
  },
  mounted() {
    this.getInfo();
  },
  watch: {
    activatedRoom() {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      if (this.activatedRoom.imType === 'cs') {
        this.getUserInfo();
      } else if (this.activatedRoom.imType === 'client' || this.activatedRoom.imType === 'clientEnd') {
        this.getUserInfo();
      } else if (this.activatedRoom.imType === 'group') {
        this.getGroupInfo();
      } else {
      }
    },
    getUserInfo() {
      this.loading = true;
      ImService.getClient(
        { id: this.activatedRoom.id },
        data => {
          this.userInfo = data.memberData;
          this.loading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    },
    getGroupInfo() {
      this.loading = true;
      service.query(
        {
          id: this.activatedRoom.id
        },
        data => {
          this.groupInfo = Object.assign(this.groupInfo, data.data);
          this.loading = false;
        },
        ErrorData => {
          console.log(ErrorData);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.person-info {
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-left: 15px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 25px;
    }
  }
  .name {
    margin-left: 10px;
    color: #fff;
  }
}
</style>
