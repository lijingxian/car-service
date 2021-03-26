<template>
  <biz-grid class="reception-mgmt-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate"  v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" :model="form" ref="form" label-width="125px" size="small" v-loading="loading" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="车牌号码" prop="plateNumber">
        <el-input v-model="form.plateNumber" :disabled="disable" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="会员卡号" prop="memberCardSn">
        <el-input v-model="form.memberCardSn" disabled placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="会员姓名" prop="memberName">
        <el-input v-model="form.memberName" disabled placeholder="请选择会员">
          <div slot="append" class="input-append">
            <el-button type="text" @click="createMember">
              <i class="el-icon-circle-plus-outline" title="添加会员"></i>
            </el-button>
            <el-button type="text" @click="addMember">
              <i class="iconfont biz-icon-man" title="选择会员"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="会员卡等级" prop="userRankName">
        <el-input v-model="form.userRankName" disabled placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="到店时间" prop="accessTime">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" :clearable="false" :disabled="disable"
          :default-value="dateNow" :picker-options="pickerOptions" v-model="form.accessTime"></el-date-picker>
        <img v-if="form.accessImage" :src="form.accessImage" alt="" @click.stop="showImg(form.accessImage)">
      </el-form-item>
      <el-form-item label="离店时间" prop="leaveTime">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="" :clearable="false" :disabled="disable"
          :default-value="dateNow" :picker-options="pickerOptions" v-model="form.leaveTime"></el-date-picker>
        <img v-if="form.leaveImage" :src="form.leaveImage" alt="" @click.stop="showImg(form.leaveImage)">
      </el-form-item>
      <el-form-item prop="isReception">
        <template slot="label">
          接待状态
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">您可以将接待状态从未接待改为已接待，专属顾问自动设为您的账号；当您在微信端确认后，接待状态也自动变更为已接待，专属顾问为您的账号</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-radio-group v-model="form.isReception" :disabled="disableReception" @change="valueChange">
          <el-radio :label="false">未接待</el-radio>
          <el-radio :label="true">已接待</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="专属顾问" prop="adminId">
        <el-select v-model="form.adminId" placeholder="" :disabled="disableReception || form.isReception === false">
          <el-option v-for="option in receptionList" :key="option.index" :label="option.name || '未填写'" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="isAutoLeave">
        <template slot="label">
          自动离店
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">选中自动离店，则客户离店时道闸自动开启</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-radio v-model="form.isAutoLeave" :label="false">否</el-radio>
        <el-radio v-model="form.isAutoLeave" :label="true">是</el-radio>
      </el-form-item> -->
      <el-form-item prop="isAppointment">
        <template slot="label">
          是否预约
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" style="width: 300px;">系统自动判断是否为预约订单，并自动匹配订单。如订单还未创建，您可以点击+前往订单页手动创建订单如订单已创建未匹配成功，您可以点击订单图标手动匹配订单</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <el-radio v-model="form.isAppointment" :label="false">否</el-radio>
        <el-radio v-model="form.isAppointment" :label="true">是</el-radio>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderSn" v-if="form.memberName">
        <el-input v-model="form.orderSn" disabled placeholder="">
          <div slot="append" class="input-append" v-if="showOrderBtn">
            <el-button type="text" @click="createOrder">
              <i class="el-icon-circle-plus-outline" title="添加订单"></i>
            </el-button>
            <el-button type="text" @click="addOrder">
              <i class="iconfont iconfont biz-icon-liebiaoshitu" title="选择订单"></i>
            </el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="商品名称" v-if="form.memberName">
        <el-input v-model="form.productName" disabled placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="订单金额" v-if="form.memberName">
        <el-input v-model="form.amount" disabled placeholder="">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="实付金额" v-if="form.memberName">
        <el-input v-model="form.amountPaid" disabled placeholder="">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <create-member :visible.sync="showCreateMember" :plate-number="form.plateNumber" @created="memberCreated"></create-member>
    <query-member-list :visible.sync="showMemberList" @confirm="memberSelected"></query-member-list>
    <create-order :visible.sync="showCreateOrder" :userId="userId" @confirm="orderCreated" ref="createOrder"></create-order>
    <query-order-list :visible.sync="showOrderList" :memberId="userId" @confirm="memberSelected"></query-order-list>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import CreateMember from '../components/CreateMember';
import QueryMemberList from '../components/QueryMemberList';
import CreateOrder from '../components/CreateOrder';
import QueryOrderList from '../components/QueryOrderList';

import { customerService } from '@/common/urls';
import http from '@/common/http';
import date from '@/utils/date.js';

export default {
  name: 'ReceptionMgmtBaseInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  data() {
    return {
      dateNow: new Date(),
      // 日期时间选择器控制
      pickerOptions: {
        disabledDate: time => {
          // return time.getTime() !== new Date();
          return false;
        }
      },
      // 显示创建会员窗口
      showCreateMember: false,
      // 显示会员列表
      showMemberList: false,
      // 显示创建订单
      showCreateOrder: false,
      // 显示订单列表
      showOrderList: false,
      loading: false,
      id: '',
      operations: [{ label: '保存', name: 'save', type: 'primary', auth: ['admin:reception.edit'] }],
      rules: {
        plateNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1,2}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,
            message: '车牌号格式不正确',
            trigger: 'blur'
          }
        ]
      },
      form: this.resetForm(),
      // 专属顾问列表
      receptionList: [],
      // 禁止修改接待状态
      disableReception: false
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    CreateMember,
    QueryMemberList,
    CreateOrder,
    QueryOrderList
  },
  computed: {
    userId() {
      return { id: this.form.memberId || '' };
    },
    disable() {
      return !!this.itemId.id;
    },
    showOrderBtn() {
      return !!this.form.memberId;
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    valueChange(val) {
      if (!val) {
        this.form.adminId = '';
      }
    },
    resetForm() {
      return {
        memberId: '',
        plateNumber: '',
        memberCardSn: '',
        memberName: '',
        userRankName: '',
        accessTime: date.dateTimeConverter(new Date()),
        leaveTime: date.dateTimeConverter(new Date()),
        accessImage: '',
        leaveImage: '',
        isReception: false,
        adminId: '',
        adminName: '',
        isAppointment: false,
        orderId: '',
        orderSn: '',
        // isAutoLeave: false,
        productName: '',
        amount: '',
        amountPaid: ''
      };
    },
    // 添加会员
    createMember() {
      if (!this.form.plateNumber) {
        this.$message.warning('请先填写车牌号');
        return;
      }
      this.showCreateMember = true;
    },
    memberCreated(form) {
      Object.assign(this.form, form);
      this.showCreateMember = false;
      let params = Object.assign({}, this.form, this.itemId);
      this.loading = true;
      if (this.itemId.id) {
        http
          .put(customerService.ReceptionMgmt.baseInfo.update, params)
          .then(data => {
            this.$emit('update');
            this.$message.success('操作成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        http
          .post(customerService.ReceptionMgmt.baseInfo.create, params)
          .then(data => {
            this.$emit('update');
            this.$message.success('操作成功');
            this.id = data.data.id;
            this.refresh(data.data.id);
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    addMember() {
      this.showMemberList = true;
    },
    memberSelected(memberInfo) {
      Object.assign(this.form, memberInfo);
    },
    // 添加订单
    createOrder() {
      this.$refs.createOrder.form = {
        productId: '',
        amount: '0',
        amountPaid: '0'
      };
      this.showCreateOrder = true;
    },
    orderCreated(form) {
      Object.assign(this.form, form);
      this.form.isReception = true;
      this.showOrderList = false;
    },
    addOrder() {
      this.showOrderList = true;
    },
    // 清空
    clear() {
      this.showCreateMember = false;
      this.showMemberList = false;
      this.showCreateOrder = false;
      this.showOrderList = false;
      this.disableReception = false;
      this.form = this.resetForm();
      this.$refs.form.resetFields();
    },
    // 检测表单中的专属顾问是否在专属顾问列表中
    checkIfAdmin() {
      if (this.form.adminId) {
        let flag = true;
        for (let i = 0; i < this.receptionList.length; i++) {
          if (this.receptionList[i].id === String(this.form.adminId)) {
            flag = false;
          }
        }
        if (flag) {
          this.receptionList.unshift({
            id: this.form.adminId,
            name: this.form.adminName
          });
        }
      }
    },
    // 点击'保存'按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (
            this.form.accessTime &&
            this.form.leaveTime &&
            this.form.accessTime > this.form.leaveTime
          ) {
            this.$message.warning('到店时间不能晚于离店时间');
            return false;
          }
          this.submit();
        } else {
          return false;
        }
      });
    },
    submit() {
      if (this.itemId.id || this.id || this.form.id) {
        this.update();
      } else {
        this.create();
      }
    },
    update() {
      if (!this.itemId.id) {
        this.itemId.id = this.id || this.form.id;
      }
      let params = Object.assign({}, this.form, this.itemId);
      this.loading = true;
      http
        .put(customerService.ReceptionMgmt.baseInfo.update, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('update');
          this.refresh();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    create() {
      let params = Object.assign({}, this.form);
      this.loading = true;
      http
        .post(customerService.ReceptionMgmt.baseInfo.create, params)
        .then(data => {
          this.$message.success('操作成功');
          this.$emit('update');
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    refresh(id) {
      this.loading = true;
      let params = this.itemId.id || id;
      http
        .get(customerService.ReceptionMgmt.baseInfo.query, { id: params })
        .then(data => {
          this.loading = false;
          this.form = Object.assign(this.resetForm(), data.data);
          this.form.adminId = String(this.form.adminId);
          if (!data.data.accessTime) {
            this.form.accessTime = '';
          }
          if (!data.data.leaveTime) {
            this.form.leaveTime = '';
          }
          if (data.data.order) {
            this.form.productName = data.data.order.orderItems[0].fullName;
            this.form.amount = data.data.order.amount;
            this.form.amountPaid = data.data.order.amountPaid;
          }
          this.disableReception = !!this.form.isReception;
          this.id = '';
          this.checkIfAdmin();
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showImg(img) {
      this.$emit('show-image', img);
    },
    queryReceptionList(shopId = '') {
      let params = {
        roleType: 'reception',
        pageSize: '1000',
        shopId: window.top.SHOP_ID || shopId || ''
      };
      http
        .get(customerService.ReceptionMgmt.baseInfo.queryReceptionList, params)
        .then(data => {
          this.receptionList = data.data;
          this.checkIfAdmin();
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    showMessage(msg, type) {
      this.$notify({
        message: msg,
        type: type,
        showClose: true
      });
    }
  },
  mounted() {
    this.queryReceptionList();
    if (this.itemId.id) {
      this.refresh();
    }
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.el-icon-question:before {
  color: #ff7300;
}
.reception-mgmt-base-info {
  img {
    margin-top: 10px;
    max-width: 100%;
  }
  .biz-save-button {
    float: left;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-input-group__append {
    padding: 0 10px;
  }
  .input-append {
    .el-button {
      margin-left: 0px;
      margin-right: 0px;
    }
    .el-button + .el-button {
      margin-left: 10px;
    }

    i {
      font-size: 16px;
      color: #ff7300;
    }
  }
  .el-radio {
    width: 70px;
  }
}
</style>
