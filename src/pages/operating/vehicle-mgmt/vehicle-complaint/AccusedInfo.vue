<template>
  <biz-grid class="accused-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="info.state==='0'">
    </biz-save-button>
    <div class="accused-info-item">
      <p class="label"><span style="color:red;">*</span>判定结果</p>
      <div>
        <el-radio v-model="radio" label="1" v-if="info.state==='0'||info.state==='1'">申诉成功</el-radio>
        <el-radio v-model="radio" label="2" v-if="info.state==='0'||info.state==='2'">申诉失败</el-radio>
        <span v-if="info.state==='3'" style="color: #ff7300;">申诉取消</span>
      </div>
    </div>
    <div class="accused-info-item">
      <span class="label">判定说明</span>
      <el-input type="textarea" :rows="4" v-model="textarea" style="width:350px;" :disabled="info.state!=='0'">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车牌号</span>
      <el-input v-model="info.plateNumber" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车主姓名</span>
      <el-input v-model="realName" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">手机号码</span>
      <el-input v-model="mobile" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车辆识别代号</span>
      <el-input v-model="info.vin" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">发动机号</span>
      <el-input v-model="info.engineNumber" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">品牌</span>
      <el-input v-model="brand" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">系列</span>
      <el-input v-model="series" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="accused-info-item">
      <span class="label">车型</span>
      <el-input v-model="type" class="el-input" :disabled="true">
      </el-input>
    </div>
    <div class="complant-img-div">
      <img :src="imgUrl">
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'accused-info',
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      radio: '',
      textarea: '',
      info: {},
      realName: '',
      mobile: '',
      brand: '',
      series: '',
      type: '',
      imgUrl: ''
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
  components: {
    BizSaveButton,
    BizGrid
  },
  computed: {},
  watch: {
    itemId(newValue, oldValue) {
      if (newValue) {
        this.urls = '';
        this.getAccusedInfo();
      }
    }
  },
  methods: {
    operateHandler() {
      if (this.radio !== '1' && this.radio !== '2') {
        this.$message.warning('请选择判定结果');
        return;
      }
      this.addComplaintInfo();
    },
    addComplaintInfo() {
      this.loading = true;
      let param = {
        id: this.info.id,
        state: this.radio,
        vin: this.info.vin,
        plateNumber: this.info.plateNumber,
        engineNumber: this.info.engineNumber,
        plateNumberType: this.info.plateNumberType,
        paths: this.info.paths,
        memo: this.textarea,
        appealer: this.info.appealer,
        respondent: this.info.respondent,
        operator: this.info.operator,
        car: this.info.car
      };

      http
        .put(urls.vehicleMgmt.VehicleBaseInfo_appeal, param)
        .then(data => {
          this.loading = false;
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('operationSuccess');
          this.getAccusedInfo();
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
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
          this.info = data.data;
          this.textarea = this.info.memo;
          this.imgUrl = this.info.paths[0];

          let appealer = this.info.appealer;
          let car = this.info.car;
          if (appealer) {
            if (appealer.name) {
              this.realName = appealer.name;
            }

            if (appealer.mobile) {
              this.mobile = appealer.mobile;
            }
          }

          if (car) {
            if (car.brand) {
              this.brand = car.brand;
            }
            if (car.series) {
              this.series = car.series;
            }
            if (car.type) {
              this.type = car.type;
            }
          }

          if (this.info.state === '1') {
            this.radio = '1';
          } else if (this.info.state === '2') {
            this.radio = '2';
          } else {
            this.radio = '0';
          }
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
.accused-info {
  padding: 20px 0 20px 10px;
  font-size: 14px;
  color: #606266;
  .biz-save-button {
    justify-content: flex-start;
  }
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

  .complant-img-div {
    width: 300px;
    margin: 0 auto;
    padding: 10px 0;
    img {
      width: 100%;
    }
  }
}
</style>
