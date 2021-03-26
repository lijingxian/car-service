<template>
  <biz-grid class="message-mgmt-settings">
    <biz-header slot="top" :operations="operations" @operate="operate">
    </biz-header>
    <div class="checkbox-area">
      <el-checkbox :indeterminate="isIndeterminateCar" v-model="checkAllCar" @change="handleCheckAllChangeCar" class="msgTitle" v-if="carMessage.length>0">车辆消息</el-checkbox>
      <el-checkbox-group v-model="carMsgSwitch" @change="handleCheckedCarChange">
        <el-checkbox v-for="item in carMessage" :key="item.index" :label="item.type">{{
          item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox :indeterminate="isIndeterminateService" v-model="checkAllService" @change="handleCheckAllChangeService" class="msgTitle" v-if="serviceMessage.length>0">服务消息</el-checkbox>
      <el-checkbox-group v-model="serviceMsgSwitch" @change="handleCheckedServiceChange">
        <el-checkbox v-for="item in serviceMessage" :key="item.index" :label="item.type">{{
          item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox :indeterminate="isIndeterminateCommunity" v-model="checkAllCommunity" @change="handleCheckAllChangeCommunity" class="msgTitle" v-if="communityMessage.length>0">社区消息</el-checkbox>
      <el-checkbox-group v-model="communityMsgSwitch" @change="handleCheckedCommunityChange">
        <el-checkbox v-for="item in communityMessage" :key="item.index" :label="item.type">{{
          item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox :indeterminate="isIndeterminateSystem" v-model="checkAllSystem" @change="handleCheckAllChangeSystem" class="msgTitle" v-if="systemMessage.length>0">系统消息</el-checkbox>
      <el-checkbox-group v-model="systemMsgSwitch" @change="handleCheckedSystemChange">
        <el-checkbox v-for="item in systemMessage" :key="item.index" :label="item.type">{{
          item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox :indeterminate="isIndeterminatePending" v-model="checkAllPending" @change="handleCheckAllChangePending" class="msgTitle" v-if="pendingMessage.length>0">待办消息</el-checkbox>
      <el-checkbox-group v-model="pendingMsgSwitch" @change="handleCheckedPendingChange">
        <el-checkbox v-for="item in pendingMessage" :key="item.index" :label="item.type">{{
          item.name }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import { messageMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'MessageMgmtSettings',
  data() {
    return {
      operations: [{ label: '保存', name: 'save', type: 'primary' }],
      switchData: {},
      carMsgSwitch: [],
      serviceMsgSwitch: [],
      communityMsgSwitch: [],
      systemMsgSwitch: [],
      pendingMsgSwitch: [],
      isIndeterminateCar: false,
      checkAllCar: false,
      isIndeterminatePending: false,
      checkAllPending: false,
      isIndeterminateService: false,
      checkAllService: false,
      isIndeterminateCommunity: false,
      checkAllCommunity: false,
      isIndeterminateSystem: false,
      checkAllSystem: false,
      // 车辆消息
      carMessage: [],
      // 服务消息
      serviceMessage: [],
      // 社区消息
      communityMessage: [],
      // 系统消息
      systemMessage: [],
      // 待办消息
      pendingMessage: []
    };
  },
  computed: {},
  components: {
    BizGrid,
    BizHeader
  },
  methods: {
    operate(name) {
      this[name]();
    },
    handleCheckAllChangeCar(val) {
      console.log(121);
      this.carMsgSwitch = val ? this.carMessage.map(item => {
        return item.type;
      }) : [];
      this.isIndeterminateCar = false;
    },
    handleCheckedCarChange(value) {
      console.log(123);
      let checkedCount = value.length;
      this.checkAllCar = checkedCount === this.carMessage.length;
      this.isIndeterminateCar = checkedCount > 0 && checkedCount < this.carMessage.length;
    },
    handleCheckAllChangeService(val) {
      console.log(121);
      this.serviceMsgSwitch = val ? this.serviceMessage.map(item => {
        return item.type;
      }) : [];
      this.isIndeterminateService = false;
    },
    handleCheckedServiceChange(value) {
      console.log(123);
      let checkedCount = value.length;
      this.checkAllService = checkedCount === this.serviceMessage.length;
      this.isIndeterminateService = checkedCount > 0 && checkedCount < this.serviceMessage.length;
    },
    handleCheckAllChangeCommunity(val) {
      console.log(121);
      this.communityMsgSwitch = val ? this.communityMessage.map(item => {
        return item.type;
      }) : [];
      this.isIndeterminateCommunity = false;
    },
    handleCheckedCommunityChange(value) {
      console.log(123);
      let checkedCount = value.length;
      this.checkAllCommunity = checkedCount === this.communityMessage.length;
      this.isIndeterminateCommunity = checkedCount > 0 && checkedCount < this.communityMessage.length;
    },
    handleCheckAllChangeSystem(val) {
      console.log(121);
      this.systemMsgSwitch = val ? this.systemMessage.map(item => {
        return item.type;
      }) : [];
      this.isIndeterminateSystem = false;
    },
    handleCheckedSystemChange(value) {
      console.log(123);
      let checkedCount = value.length;
      this.checkAllSystem = checkedCount === this.systemMessage.length;
      this.isIndeterminateSystem = checkedCount > 0 && checkedCount < this.systemMessage.length;
    },
    handleCheckAllChangePending(val) {
      console.log(121);
      this.pendingMsgSwitch = val ? this.pendingMessage.map(item => {
        return item.type;
      }) : [];
      this.isIndeterminatePending = false;
    },
    handleCheckedPendingChange(value) {
      console.log(123);
      let checkedCount = value.length;
      this.checkAllPending = checkedCount === this.pendingMessage.length;
      this.isIndeterminatePending = checkedCount > 0 && checkedCount < this.pendingMessage.length;
    },
    refresh() {
      http
        .get(messageMgmt.settings, {})
        .then(data => {
          this.carMessage = [];
          this.serviceMessage = [];
          this.communityMessage = [];
          this.systemMessage = [];
          this.pendingMessage = [];
          this.carMsgSwitch = [];
          this.serviceMsgSwitch = [];
          this.communityMsgSwitch = [];
          this.systemMsgSwitch = [];
          this.pendingMsgSwitch = [];
          data.messageSwitchDatas.forEach(item => {
            if (item.category === 'car') {
              this.carMessage.push(item);
              if (item.isChecked === '1') {
                this.carMsgSwitch.push(item.type);
              }
            } else if (item.category === 'service') {
              this.serviceMessage.push(item);
              if (item.isChecked === '1') {
                this.serviceMsgSwitch.push(item.type);
              }
            } else if (item.category === 'community') {
              this.communityMessage.push(item);
              if (item.isChecked === '1') {
                this.communityMsgSwitch.push(item.type);
              }
            } else if (item.category === 'system') {
              this.systemMessage.push(item);
              if (item.isChecked === '1') {
                this.systemMsgSwitch.push(item.type);
              }
            } else if (item.category === 'pendingRemind') {
              this.pendingMessage.push(item);
              if (item.isChecked === '1') {
                this.pendingMsgSwitch.push(item.type);
              }
            }
            this.handleCheckedCarChange(this.carMsgSwitch);
            this.handleCheckedServiceChange(this.serviceMessage);
            this.handleCheckedCommunityChange(this.communityMessage);
            this.handleCheckedSystemChange(this.systemMessage);
            this.handleCheckedPendingChange(this.pendingMessage);
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    save() {
      console.log(this.carMsgSwitch);
      this.carMessage.map(item => {
        if (this.carMsgSwitch.includes(item.type)) {
          item.isChecked = '1';
        } else {
          item.isChecked = '0';
        }
      });
      this.serviceMessage.map(item => {
        if (this.serviceMsgSwitch.includes(item.type)) {
          item.isChecked = '1';
        } else {
          item.isChecked = '0';
        }
      });
      this.communityMessage.map(item => {
        if (this.communityMsgSwitch.includes(item.type)) {
          item.isChecked = '1';
        } else {
          item.isChecked = '0';
        }
      });
      this.systemMessage.map(item => {
        if (this.systemMsgSwitch.includes(item.type)) {
          item.isChecked = '1';
        } else {
          item.isChecked = '0';
        }
      });
      this.pendingMessage.map(item => {
        if (this.pendingMsgSwitch.includes(item.type)) {
          item.isChecked = '1';
        } else {
          item.isChecked = '0';
        }
      });
      let params = this.carMessage
        .concat(this.serviceMessage)
        .concat(this.communityMessage)
        .concat(this.systemMessage)
        .concat(this.pendingMessage);
      http
        .post(messageMgmt.settings, params)
        .then(data => {
          this.$message.success('操作成功');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: '1000',
        showClose: true
      });
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.message-mgmt-settings {
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .checkbox-area {
    width: 906px;
    margin-top: 20px;
    margin-left: 20px;
    padding: 25px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .msgTitle {
      font-weight: bold;
      font-size: 16px;
    }
    .label {
      padding-left: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 14px;
      border-left: 3px solid #ff7300;
    }
    .el-checkbox {
      width: 130px;
      margin-left: 30px;
      // margin-right: 30px;
      margin-bottom: 10px;
      // .el-checkbox + .el-checkbox {
      //   margin-left: 0;
      // }
    }
  }
}
</style>
