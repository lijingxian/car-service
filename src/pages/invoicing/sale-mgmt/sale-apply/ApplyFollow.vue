<template>
  <div class="order-log-info">
    <div style="text-align: center;font-size: 15px;margin-bottom: 20px;">单据进度跟踪</div>
    <el-steps direction="vertical" space="auto">
      <el-step title="新申请" :status="active==='1'?'finish':'wait '" :class="(orderData.state!=='3'&&orderData.state!=='4'&&(this.currentState==='0'||this.currentState==='1'))?'style-isfinish':'style-new'">
        <div slot="description">
          <div class="logInfo" v-for="(orderLog,index) in orderData.schedules" :key="index" v-if="orderLog.state==='0'|| orderLog.state==='1'">
            <p style="margin-right:20px;">{{orderLog.state==='0'?'已创建':'已提交'}}</p>
            <p>{{orderLog.time}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="审核" :status="active1==='1'?'finish':'wait '" :class="(orderData.state!=='3'&&orderData.state!=='4'&&(this.currentState==='2'||this.currentState==='3'||this.currentState==='4'))?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-for="(orderLog,index) in orderData.schedules" :key="index" v-if="orderLog.state==='2'||orderLog.state==='3'">
            <p style="margin-right:20px;">{{orderLog.adminName + '已通过'}}</p>
            <p>备注：{{orderLog.remarks}}</p>
            <p>{{orderLog.time}}</p>
          </div>
          <div v-for="(orderLog,index) in orderData.schedules" :key="index" v-if="orderLog.state==='4'">
            <p style="margin-right:20px;">{{orderLog.adminName + '审核不通过'}}</p>
            <p>理由：{{orderLog.details}}</p>
            <p>备注：{{orderLog.remarks}}</p>
            <p>{{orderLog.time}}</p>
          </div>
        </div>
      </el-step>
      <el-step title="审核通过/驳回" :status="active2==='1'?'finish':'wait '" :class="(orderData.state==='3'||orderData.state==='4')?'style-isfinish':'style-new'">
        <div slot="description">
          <div v-if="orderData.state==='3'">
            <p style="margin-right:20px;">{{'审核通过'}}</p>
          </div>
          <div v-if="orderData.state==='4'">
            <p style="margin-right:20px;">{{'审核驳回'}}</p>
          </div>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
export default {
  name: 'NewsMgmt',
  props: {},
  data() {
    return {
      loading: false,
      orderData: [],
      state: '',
      active: '',
      active1: '',
      active2: ''
    };
  },
  components: {},
  watch: {},
  created() {},
  computed: {
    getOrderLogState(state) {
      switch (this.state) {
        case '0':
          return '已创建';
        case '1':
          return '已提交';
        case '2':
          return '审核中';
        case '3':
          return '已通过';
        case '4':
          return '审核通过';
        default:
          return '';
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    getList(id) {
      let param = {
        id: id
      };
      http
        .get(urls.invoicing.purchaseApplyMgmt.purchaseApplyNew, param)
        .then(data => {
          this.orderData = data.data;
          this.currentState = data.data.schedules[data.data.schedules.length - 1].state;
          this.active = '';
          this.active1 = '';
          this.active2 = '';
          data.data.schedules.forEach(item => {
            if (item.state === '0' || item.type === '1') {
              this.active = '1';
            }
            if (item.state === '2' || item.state === '3' || item.state === '4') {
              this.active1 = '1';
            }
            if (data.data.state === '3' || data.data.state === '4') {
              this.active2 = '1';
            }
          });
        })
        .catch(() => {})
        .finally(() => {});
    }
  }
};
</script>

<style lang="scss">
.order-log-info {
  padding: 20px;
  .el-step.is-vertical {
    display: -webkit-box;
  }
  .logInfo {
    display: flex;
  }
  .el-step__description {
    color: #000000;
  }
  .style-isfinish {
    .el-step__title.is-finish {
      color: #ff7300;
    }
    .el-step__icon {
      background: #ff7300;
    }
    .el-step__icon.is-text {
      color: #f7f7f7;
    }
  }
  .style-new {
    .el-step__title.is-finish {
      color: #000000;
    }
    .el-step__icon {
      background: #ffffff;
    }
  }
}
</style>
