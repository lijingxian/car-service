<template>
  <biz-grid class="complaint-base-info" v-loading="loading">
    <div class="accused-info-item">
      <span class="label">车牌号</span>
      <el-input v-model="plateNumber" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车主姓名</span>
      <el-input v-model="carOwnerName" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">手机号码</span>
      <el-input v-model="phoneNumber" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车辆识别代号</span>
      <el-input v-model="carVinNo" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">发动机号</span>
      <el-input v-model="engineNo" class="el-input" :disabled="true">
      </el-input>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'complaint-base-info',
  data() {
    return {
      loading: false,
      plateNumber: '',
      carOwnerName: '',
      phoneNumber: '',
      carVinNo: '',
      engineNo: ''
    };
  },
  props: {
    itemId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: { BizGrid },
  computed: {},
  watch: {
    itemId(newValue, oldValue) {
      if (newValue) {
        this.getAccusedInfo();
      }
    }
  },
  methods: {
    getAccusedInfo() {
      this.loading = true;
      let param = {
        id: this.itemId
      };
      http
        .get(urls.vehicleMgmt.VehicleBaseInfo_appeal, param)
        .then(data => {
          console.log('通过id查询', data);
          this.loading = false;
          let curData = data.data;
          this.plateNumber = curData.plateNumber;
          this.carOwnerName = curData.respondent.name;
          this.phoneNumber = curData.respondent.mobile;
          this.carVinNo = curData.car.vin;
          this.engineNo = curData.engineNumber;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {});
    }
  },
  created() {
    this.getAccusedInfo();
  }
};
</script>

<style lang="scss">
.complaint-base-info {
  padding: 40px 0 20px 10px;
  font-size: 14px;
  color: #606266;

  .accused-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .label {
      display: block;
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }

    .el-input,
    .el-input__inner {
      width: 350px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
