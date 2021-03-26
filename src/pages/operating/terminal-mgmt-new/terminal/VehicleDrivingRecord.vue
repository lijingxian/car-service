<template>
  <biz-grid class="vehicle-mgmt-all-vehicle__vehicle-driving-record" v-loading="loading">
    <div slot="top">
      <biz-filter :filters="filters" @filterDataChange="handleFilter"></biz-filter>
    </div>
    <div class="vehicle-image">
      <img src="../../../../assets/images/car_image.png" />
      <el-button type="primary" class="icon-btn front-pic" @click="handleClick($event, '0', '0')">
        <i class="iconfont biz-icon-paizhao"></i>
      </el-button>
      <el-button type="primary" class="icon-btn back-pic" @click="handleClick($event, '0', '1')">
        <i class="iconfont biz-icon-paizhao"></i>
      </el-button>
      <el-button type="primary" class="icon-btn front-video" @click="handleClick($event, '1', '0')">
        <i class="iconfont biz-icon-video_icon"></i>
      </el-button>
      <el-button type="primary" class="icon-btn back-video" @click="handleClick($event, '1', '1')">
        <i class="iconfont biz-icon-video_icon"></i>
      </el-button>
    </div>

    <div>
      <record-list :list="recordList"></record-list>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFilter } from '@/components/BizTable';
import RecordList from '../component/RecordList';

import service from '@/service/vehicle-mgmt/VehicleDrivingRecord';

export default {
  name: 'VehicleDrivingRecord',
  components: {
    BizGrid,
    RecordList,
    BizFilter
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      loading: false,
      recordList: [],

      filters: [
        {
          type: 'date',
          label: '查询日期',
          name: 'searchDate',
          value: ''
        },
        {
          type: 'timerange',
          name: 'searchTimeRange',
          value: ['', '']
        }
      ]
    };
  },
  created() {},
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      }
    },
    getQueryParams() {
      let date = this.filters[0].value;
      let startTime = this.filters[1].value[0];
      let endTime = this.filters[1].value[1];

      let startDate = date
        ? date + (startTime ? ' ' + startTime : ' 00:00:00')
        : null;
      let endDate = date
        ? date + (endTime ? ' ' + endTime : ' 23:59:59')
        : null;

      return {
        carId: this.itemId.id,
        terminalId: this.itemId.id,
        beginTimeStr: startDate,
        endTimeStr: endDate
      };
    },
    query() {
      service.query(
        this.getQueryParams(),
        data => {
          this.recordList = data.DrivingRecordDatas;
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },

    handleClick(e, type, direct) {
      this.loading = true;

      service.record(
        {
          carId: this.itemId.id,
          terminalId: this.itemId.id,
          type: type, // 0: 照片 1: 视频
          channel: direct // 0: 前 1: 后
        },
        data => {
          if (type === '0') {
            this.$message.warning('照片上传中，请稍候查看');
          } else {
            this.$message.warning('视频上传中，请稍候查看');
          }
          // 照片30s后请求查询，视频一分钟后请求查询
          setTimeout(() => {
            this.query();
          }, type === '0' ? 30000 : 60000);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    handleFilter(val) {
      this.query();
    }
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
$vehicle-driving-record__icon-size: 36px;
$vehicle-driving-record__icon-offset-v: 36px;
$vehicle-driving-record__icon-offset-h: 20px;

.vehicle-mgmt-all-vehicle__vehicle-driving-record {
  padding-top: 20px;

  .biz-table-filter {
    .biz-date {
      .el-date-editor.el-input {
        width: 140px;
      }
    }
  }

  .biz-scroller {

    .vehicle-image {
      position: relative;
      text-align: center;
      height: 200px;
      line-height: 200px;

      img {
        width: 300px;
        vertical-align: middle;
      }

      .icon-btn {
        text-align: left;
        position: absolute;
        border-radius: 50%;
        padding: 0;
        width: $vehicle-driving-record__icon-size;
        height: $vehicle-driving-record__icon-size;
        line-height: $vehicle-driving-record__icon-size;
        margin-left: 0;

        .iconfont {
          font-size: $vehicle-driving-record__icon-size / 5 * 3;
          margin-left: 5px;
        }

        &.front-pic {
          top: $vehicle-driving-record__icon-offset-v;
          left: $vehicle-driving-record__icon-offset-h;
        }
        &.back-pic {
          top: $vehicle-driving-record__icon-offset-v;
          right: $vehicle-driving-record__icon-offset-h;
        }
        &.front-video {
          bottom: $vehicle-driving-record__icon-offset-v;
          left: $vehicle-driving-record__icon-offset-h;
        }
        &.back-video {
          bottom: $vehicle-driving-record__icon-offset-v;
          right: $vehicle-driving-record__icon-offset-h;
        }
      }
    }
  }

  .panel-title {
    color: #606266;
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
