<template>
  <div class="oa-mgmt-nav">
    <div class="image">
      <img :src="oa" style="width:915px"/>
      <div class="square2 step1" v-popover:codePop v-if="currentAuth().includes('admin:role')" @click="link('/oa/staff-mgmt/role')">
        <div class="top">设置角色权限</div>
        <div class="bottom">
          已有角色
          <span>{{this.form.roleCount}}个</span>
        </div>
      </div>
      <div class="square2 step1 disabled" v-popover:codePop v-if="!currentAuth().includes('admin:role')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">设置角色权限</div>
        <div class="bottom">
          已有角色
          <span>{{this.form.roleCount}}个</span>
        </div>
      </div>
      <div class="square step3" v-popover:codePop2 @click="link('/oa/staff-mgmt/admin')" v-if="currentAuth().includes('admin:admin')">
        <div class="top">创建员工</div>
        <div class="bottom">
          已有员工
          <span>{{this.form.adminCount}}个</span>
        </div>
      </div>
      <div class="square step3 disabled" v-popover:codePop2 v-if="!currentAuth().includes('admin:admin')" @click="$message.warning('您无操作权限，请管理员增加权限')">
        <div class="top">创建员工</div>
        <div class="bottom">
          已有员工
          <span>{{this.form.adminCount}}个</span>
        </div>
      </div>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop">
        <div class="pop-div">
          <div class="top-font">设置角色权限</div>
          <div class="middle-font">创建角色，及设置角色权限</div>
          <div class="bottom-font">
            已又角色
            <span>{{this.form.roleCount}}个</span>
          </div>
        </div>
      </el-popover>
      <el-popover placement="bottom-start" trigger="hover" ref="codePop2">
        <div class="pop-div">
          <div class="top-font">创建员工</div>
          <div class="middle-font">创建员工用户，设置所属角色</div>
          <div class="bottom-font">
            已有员工
            <span>{{this.form.adminCount}}个</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import oa from '@/assets/images/nav/oa.png';
import { mapGetters, mapMutations } from 'vuex';
import sideList from '@/pages/layout/SideList.js';
import http from '@/common/http';
export default {
  name: 'OaNav',
  data() {
    return {
      form: {
        roleCount: 0,
        adminCount: 0
      },
      oa: oa
    };
  },
  computed: {},
  components: {},
  methods: {
    ...mapGetters(['getUser']),
    ...mapMutations('Menu', ['updateRoutes']),
    ...mapGetters('Authority', ['currentAuth']),
    link(link) {
      this.updateRoutes({ routes: sideList[`${link.split('/')[1]}`] });
      this.$router.push(link);
    },
    getNavInfo() {
      http
        .get('/admin/admin/queryNavigationKpi.jhtml', {})
        .then(data => {
          Object.assign(this.form, data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.pop-div {
  border-radius: 5px;
  text-align: left;
  padding: 10px;
  .top-font {
    font-size: 16px;
  }
  .middle-font {
    padding: 10px 0px;
    font-size: 12px;
  }
  .bottom-font {
    font-size: 14px;
    span {
      color: #ff7300;
      margin-left: 10px;
    }
  }
}
.oa-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .image {
    width: 1000px;
    margin: 0 auto;
    height: auto;
    position: relative;
    .title1 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 156px;
      width: 90px;
    }
    .title2 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 590px;
      width: 90px;
    }
    .title3 {
      top: 16px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1083px;
      width: 90px;
    }
    .title4 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FF9C4C;
      left: 170px;
      width: 90px;
    }
    .title5 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFB87F;
      left: 555px;
      width: 90px;
    }
    .title6 {
      top: 25px;
      position: absolute;
      font-weight: 500;
      font-size: 17px;
      background-color: #FFD5B2;
      left: 1045px;
      width: 90px;
    }
    .step1 {
      top: 135px;
      left: 110px;
    }
    .step2 {
      top: 470px;
      left: 10px;
    }
    .step3 {
      top: 135px;
      left: 342px;
    }
    .disabled {
      border: 1px solid #f4f4f4 !important;
      background: #B3B3B3 !important;
      .top {
        color: #fff !important;
      }
      span {
        color: #666666 !important;
      }
    }
    .square {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FF7300;
      z-index: 10;
      background:#FF7300;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square1 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFA800;
      z-index: 10;
      background:#FFA800;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
    .square2 {
      width: 140px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      border: 1px solid #FFCF06;
      z-index: 10;
      background:#FFCF06;
      cursor: pointer;
      .top {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
        padding-top: 15px;
      }
      .bottom {
        height: 38px;
        background: #FFFDFD;
        font-size: 12px;
        line-height: 38px;
        text-align: center;
        color: #666666;
        width: 140px;
        margin-left: -1px;
        border-radius: 0px 0px 10px 10px;
        span {
          color: #ff7300;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
