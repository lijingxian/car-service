<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close">
    <el-tab-pane label="基本信息" name="0">
      <potential-customer-base-info :itemId="itemId" ref="base" :viewMode="viewMode" @operationSuccess="operationSuccess"></potential-customer-base-info>
    </el-tab-pane>
    <el-tab-pane label="购买意向" name="1" v-if="itemId.id">
      <potential-customer-intention :itemId="itemId" :activeNames1="activeNames1" :viewMode="viewMode" @operationSuccess="operationSuccess"></potential-customer-intention>
    </el-tab-pane>
    <!-- <el-tab-pane label="回访提醒" name="2" v-if="itemId.id">
      <potential-customer-callback-alert
        ref="callbackAlert"
        :itemId="itemId"
        @operationSuccess="handleCallbackAlert"
      ></potential-customer-callback-alert>
    </el-tab-pane> -->
    <el-tab-pane label="回访记录" name="3" v-if="itemId.id">
      <potential-customer-callback-record :itemId="itemId" :alertId="alertId" :viewMode="viewMode" @operationSuccess="operationSuccess"></potential-customer-callback-record>
    </el-tab-pane>
    <el-tab-pane label="动态详情" name="4" v-if="itemId.id">
      <div class="page-top">
        <el-tabs v-model="tabName" style="padding-top:20px">
          <el-tab-pane label="体验" name="test-drive">
            <potential-customer-test-drive :itemId="itemId" :alertId="alertId" :viewMode="viewMode" @operationSuccess="operationSuccess"></potential-customer-test-drive>
          </el-tab-pane>
          <el-tab-pane label="互动" name="interaction-info">
            <interaction-info :itemId="itemId" :phoneNumber="phoneNumber" :alertId="alertId" :viewMode="viewMode" @operationSuccess="operationSuccess">
            </interaction-info>
          </el-tab-pane>
          <el-tab-pane label="消费" name="consumption-info">
            <consumption-info :itemId="itemId" @showOrderTab="showOrderTab" :phoneNumber="phoneNumber" :alertId="alertId" :viewMode="viewMode" @operationSuccess="operationSuccess">
            </consumption-info>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>
    <!-- <el-tab-pane label="战败" name="5" v-if="itemId.id && consumerState !== '1'">
      <potential-customer-failure :itemId="itemId" @operationSuccess="operationSuccess"></potential-customer-failure>
    </el-tab-pane>
    <el-tab-pane label="签约" name="6" v-if="itemId.id && consumerState !== '2'">
      <potential-customer-sign :itemId="itemId" @operationSuccess="operationSuccess"></potential-customer-sign>
    </el-tab-pane> -->
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import PotentialCustomerBaseInfo from './PotentialCustomerBaseInfo';
import PotentialCustomerIntention from './PotentialCustomerIntention';
import PotentialCustomerCallbackRecord from './PotentialCustomerCallbackRecord';
import PotentialCustomerTestDrive from './PotentialCustomerTestDrive';
import InteractionInfo from './InteractionInfo';
import ConsumptionInfo from './ConsumptionInfo';

import messageBox from '@/utils/messagebox';
import { potentialCustomerMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'PotentialCustomerPopup',
  components: {
    BizPopupTabs,
    PotentialCustomerBaseInfo,
    PotentialCustomerIntention,
    PotentialCustomerCallbackRecord,
    PotentialCustomerTestDrive,
    InteractionInfo,
    ConsumptionInfo
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    phoneNumber: {
      type: String
    },
    defaultTab: {
      type: String,
      default() {
        return '0';
      }
    },
    viewMode: {
      type: String,
      default() {
        return 'merge';
      }
    },
    activeNames1: {
      type: Array,
      default() {
        return ['1', '2', '3'];
      }
    }
  },
  data() {
    return {
      tabSelection: '0',
      tabName: 'test-drive',
      alertId: { id: '' },

      showFailure: true,
      showSign: true
    };
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    showOrderTab(e) {
      this.$emit('showOrderTab', e);
    },
    handleCallbackAlert(e) {
      this.alertId = Object.assign({}, e);
      this.tabSelection = '3';
    },

    query() {
      http
        .get(potentialCustomerMgmt.baseInfo.editQuery, {
          shopId: window.top.SHOP_ID || '',
          id: this.itemId.id,
          viewMode: this.viewMode
        })
        .then(data => {
          let obj = data.potentialConsumer;

          let state = '0';
          // 如果是签约，并且已经有确认者，则为签约状态
          // 如果是战败，并且已经有确认者，则为战败状态
          // 其他则为普通状态
          if (
            obj.signTrackingResult === '1' &&
            obj.deliverySalesAdvisor &&
            obj.deliverySalesAdvisor.id
          ) {
            state = '1';
          } else if (
            obj.failureTrackingResult === '1' &&
            obj.failureSalesAdvisor &&
            obj.failureSalesAdvisor.id
          ) {
            state = '2';
          }
          this.$store.commit('changeConsumerState', { value: state });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  computed: {
    consumerState() {
      return this.$store.state.potentialCustomer.consumerState;
    }
  },
  watch: {
    open(val) {
      if (val) {
        setTimeout(() => {
          this.tabSelection = this.defaultTab ? this.defaultTab : '0';
          this.tabName = 'test-drive';
          messageBox.clearMessageBoxes();
          this.$message({
            showClose: true,
            message: this.itemId.id
              ? '创建或编辑潜客档案，完善客户信息。从营销活动、预约体验等自动建档的潜客需要您完善客户信息'
              : '手动创建潜客档案，填写客户姓名电话等信息，越完整越好哦'
          });
        }, 500);
      }
    },
    itemId(val) {
      this.$store.commit('changeConsumerState', { value: '-1' });

      if (val.id) {
        this.query();
      } else {
        this.showFailure = true;
        this.showSign = true;
      }
    },
    tabSelection(nVal) {
      if (this.$refs.dataStreamTab) this.$refs.dataStreamTab.clearInterval();

      messageBox.clearMessageBoxes();

      switch (nVal) {
        case '0':
          this.$message({
            showClose: true,
            message: this.itemId.id
              ? '创建或编辑潜客档案，完善客户信息。从营销活动、预约体验等自动建档的潜客需要您完善客户信息'
              : '手动创建潜客档案，填写客户姓名电话等信息，越完整越好哦'
          });
          break;
        case '1':
          this.$message({
            showClose: true,
            message:
              '回访并确定潜客个性化需求，意向越完整越好；并按照O/H/A/B/C的标准给客户意向分级'
          });
          break;
        case '2':
          // this.$message({
          //   showClose: true,
          //   message: ''
          // });
          this.$refs.callbackAlert.updateHeight();
          break;
        case '3':
          this.$message({
            showClose: true,
            message:
              '潜客的定期回访，持续跟踪，回访记录在案；通过回访挖掘客户需求，展现产品优势，预约客户到店体验'
          });
          break;
        case '4':
          this.$message({
            showClose: true,
            message:
              '记录潜客体验记录；预约体验能进一步建立客户信心，激发客户购买欲！'
          });
          break;
        case '5':
          this.$message({
            showClose: true,
            message:
              '记录战败情况，以便分析战败原因，提高成交率；战败信息需销售经理确认'
          });
          break;
        case '6':
          this.$message({
            showClose: true,
            message: '记录签约信息，签约信息需销售经理确认'
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.page-top {
  display: contents;
  .el-tabs__nav .is-top {
    left: 40px;
  }
}
</style>
