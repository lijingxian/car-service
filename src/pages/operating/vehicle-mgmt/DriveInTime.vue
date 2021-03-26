<template>
  <biz-grid class="test-drive-in-time" v-loading="loading">
    <div id="map-container"></div>
  </biz-grid>
</template>
<script>
import qdIcon from '@/assets/images/i-web-qd.png';
import zdIcon from '@/assets/images/i-web-zd.png';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { setTimeout } from 'timers';
export default {
  components: {
    BizGrid
  },
  data() {
    return {
      qdIcon: qdIcon,
      zdIcon: zdIcon,
      drivingActionCount: [],
      drivingActions: [],
      parkings: [],
      points: [],
      gpsPoints: [],
      parkingPoints: [],
      pointsRedirect: [],
      map: '',
      loading: false,
      makerParkings: [],
      makerWarn: [],
      makeraddSpeed: [],
      makercutSpeed: [],
      makerturn: [],
      makerlock: [],
      makerhighSpeed: [],
      makerlongSlow: [],
      myIcon: '',
      timer: '',
      defaultPoints: [],
      index: 0,
      car: '',
      contentInTime: ''
    };
  },
  props: {
    trackId: String,
    carId: String
  },
  mounted() {
    this.map = new this.$map.Map('map-container');
    let point = new this.$map.Point(116.331398, 39.897445);
    this.map.centerAndZoom(point, 12);
    this.map.addControl(
      new this.$map.NavigationControl({
        anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT,
        type: window.BMAP_NAVIGATION_CONTROL_ZOOM
      })
    );
    this.map.addControl(new this.$map.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_LEFT }));
    // 设置为可拖拽
    this.map.enableScrollWheelZoom(true);
  },
  created() {
    this.getData();
  },
  watch: {
    trackId(val) {
      this.getData();
    },
    carId(val) {
      this.clearTimeOut();
    }
  },
  methods: {
    getData() {
      this.points = [];
      this.loading = true;
      let date = new Date();
      let month = date.getMonth() + 1;
      let dateStr =
        date.getFullYear() +
        '-' +
        month +
        '-' +
        date.getDate() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds();
      http
        .get('/admin/car/realTimeTrack.jhtml', {
          carId: this.carId,
          beginTime: dateStr,
          zoom: 16
        })
        .then(data => {
          this.loading = false;
          this.addInTimeMarker(
            new this.$map.Point(data.dataList[0].lngBaidu, data.dataList[0].latBaidu),
            data.dataList[0].carId,
            data.dataList[0].plateNumber,
            data.dataList[0].speed,
            data.dataList[0].runningStatus,
            data.dataList[0].direction,
            data.dataList[0].deviceStatus,
            data.dataList[0].drivingState,
            data.dataList[0].happenDate,
            data.dataList[0].webIcon ? data.dataList[0].webIcon.path : ''
          );
          this.map.centerAndZoom(new this.$map.Point(data.dataList[0].lngBaidu, data.dataList[0].latBaidu), 16);
          setTimeout(() => {
            this.getData();
          }, 5000);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        });
    },

    // 创建覆盖物
    addInTimeMarker(point, carId, plateNumber, speed, runningState, direction, deviceStatus, drivingState, happenDate, carIcon) {
      let myIcon = '';
      if (drivingState === '在线：行驶' || drivingState === '在线：怠速' || drivingState === '在线：停车') {
        myIcon = new this.$map.Icon(carIcon + '/map_green.png', new this.$map.Size(40, 40));
      } else if (drivingState === '在线：熄火') {
        myIcon = new this.$map.Icon(carIcon + '/map_orange.png', new this.$map.Size(40, 40));
      } else {
        myIcon = new this.$map.Icon(carIcon + '/map_grey.png', new this.$map.Size(40, 40));
      }

      let marker = new this.$map.Marker(point, { icon: myIcon });
      marker.setPosition(point);
      marker.setRotation(direction);
      this.map.addOverlay(marker);
      let that = this;
      marker.addEventListener('click', function(e) {
        that.setContentInTime(carId, plateNumber, speed, happenDate, runningState, deviceStatus, drivingState);
        let opts = {
          width: 230, // 信息窗口宽度
          height: 100 // 信息窗口高度
        };
        let infoWindowInTime = new that.$map.InfoWindow(that.contentInTime, opts); // 创建信息窗口对象
        that.map.openInfoWindow(infoWindowInTime, point); // 开启信息窗口
      });

      this.setContentInTime(carId, plateNumber, speed, happenDate, runningState, deviceStatus, drivingState);
      let opts = {
        width: 230, // 信息窗口宽度
        height: 100 // 信息窗口高度
      };
      let infoWindowInTime = new this.$map.InfoWindow(this.contentInTime, opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindowInTime, point); // 开启信息窗口
    },
    // 弹出信息窗口
    openInfo(content, e) {
      let p = e.target;
      let point = new this.$map.Point(p.getPosition().lng, p.getPosition().lat);
      let infoWindow = new this.$map.InfoWindow(content, {
        width: 230, // 信息窗口宽度
        height: 100 // 信息窗口高度
      }); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
    },

    // 弹出信息窗口要显示的样式及内容
    setContentInTime(carId, plateNumber, speed, happenDate, runningState, deviceStatus, drivingState) {
      // 弹出框显示的文本及样式

      this.contentInTime =
        "<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
        '<tbody>' +
        '<tr>' +
        "<td width='260'></td>" +
        '<td>' +
        "<div class='map_ceng_box1'>" +
        "<table class='map_ceng_tittle' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
        '<tbody>' +
        '<tr>' +
        '<td>&nbsp;&nbsp;' +
        plateNumber +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        "<table class='map_ceng_text1'  width='100%' border='0' cellspacing='0' cellpadding='0'>" +
        '<tbody>' +
        '<tr>' +
        '<td>' +
        drivingState +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>车速：' +
        speed +
        'km/h</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
        happenDate +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
    },
    list() {
      this.$router.push({
        name: 'running-tracks-stop',
        query: {
          trackId: this.trackId
        }
      });
    }
  }
};
</script>
<style lang="scss">
.test-drive-in-time {
  height: 100vh;
  width: 95vw;
  #map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    font-family: '微软雅黑';
    .BMap_stdMpZoom {
      top: auto;
      bottom: 150px;
    }
    .BMap_scaleCtrl {
      bottom: 180px !important;
      top: auto !important;
      left: 10px !important;
    }
    .anchorBL {
      display: none;
    }
    .map_ceng_box {
      width: 332px;
      height: 227px;
    }
    .map_ceng_box1 {
      width: 230px;
      height: 205px;
    }
    .map_ceng_tittle {
      /* height:20px;*/
      height: 20px;
      width: 100%; /*line-height:20px;*/
      line-height: 20px;
      color: #000;
    }
    .map_ceng_text tr td {
      padding: 3px 10px 3px 10px;
      color: #000;
    }
    .map_ceng_text1 tr td {
      padding: 3px 10px 3px 10px;
    }
    .map_ceng_tittle img {
      width: 20px;
      height: 20px;
    }
    .map_btn01 {
      background: #e0e0e0;
      width: 145px;
      height: 28px;
    }
  }
}
</style>
