<template>
  <biz-grid class="news-info">
    <el-form ref="form" label-width="120px" size="small" v-loading="loading">
      <el-form-item label="消息标题:" prop="title">
        <el-input v-model="data.title" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="消息内容:" prop="content">
        <el-input :value="data.content" :disabled="true" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="车辆:" prop="carPlateNumber" v-if="data.msgCategory==='car'||data.msgCategory==='service'">
        <el-input v-model="data.carPlateNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="车主:" prop="name" v-if="data.msgCategory==='car'||data.msgCategory==='service'">
        <el-input :value="(data.car&&data.car.member)?data.car.member.name:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="车主电话:" prop="mobile" v-if="data.msgCategory==='car'||data.msgCategory==='service'">
        <el-input :value="(data.car&&data.car.member)?data.car.member.mobile:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="会员:" prop="name" v-if="data.msgCategory==='community'||data.msgCategory==='system'">
        <el-input :value="data.reviever?data.reviever.name:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="会员电话:" prop="mobile" v-if="data.msgCategory==='community'||data.msgCategory==='system'">
        <el-input :value="data.reviever?data.reviever.mobile:''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="地点:" prop="address" v-if="data.msgCategory==='car'||data.msgCategory==='service'">
        <el-input :value="data.address" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="消息类别:" prop="typeName">
        <el-input :value="data.typeName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="日期:" prop="sendTime">
        <el-input :value="data.sendTime" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/news-mgmt/newsMgmt';
export default {
  name: 'NewsMgmtInfo',
  props: {
    itemId: {
      type: String
    }
  },
  components: {
    BizGrid
  },
  data() {
    return {
      loading: false,
      data: {}
    };
  },
  watch: {
    itemId(val) {
      this.init();
    }
  },
  methods: {
    init() {
      service.queryMsg(
        this.getSaveParams(),
        data => {
          this.data = data.message;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getSaveParams() {
      return {
        id: this.itemId
      };
    }
  }
};
</script>

<style lang="scss">
.news-info {
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-row {
    margin: 30px;
    font-size: 14px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .el-checkbox-group .el-checkbox {
    width: 170px;
    margin: 0;
  }
  .el-input--suffix .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .grid-content {
    height: 32px;
    line-height: 32px;
  }
}
</style>
