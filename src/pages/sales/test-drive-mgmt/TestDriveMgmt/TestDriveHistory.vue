<template>
  <biz-grid class="test-drive-history" v-loading="loading">
    <div id="map-container"></div>
  </biz-grid>
</template>
<script>
import qdIcon from '@/assets/images/i-web-qd.png';
import zdIcon from '@/assets/images/i-web-zd.png';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
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
      car: ''
    };
  },
  props: {
    trackId: String
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
    }
  },
  methods: {
    getData() {
      this.points = [];
      this.loading = true;
      http
        .get('/admin/testDriveMgmt/testDriveRecord/track.jhtml', { trackId: this.trackId })
        .then(data => {
          this.loading = false;
          data.track.points.forEach(item => {
            this.points.push(new this.$map.Point(item.baiduLng, item.baiduLat));
            this.pointsRedirect.push(item);
          });
          this.successHandler(this.points);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        });
    },
    successHandler(data) {
      this.map.clearOverlays();
      this.setZoom(data);
      // 通过DrivingRoute获取一条路线的point
      // let driving = new this.$map.DrivingRoute(this.map, { renderOptions: { map: this.map, autoViewport: true } }); // 驾车实例
      // driving.search(data[0], data[data.length - 1]);
      // driving.setSearchCompleteCallback(
      //   function() {
      //     let pts = data; // 通过驾车实例，获得一系列点的数组
      //     this.myIcon = new this.$map.Icon(this.carIcon, new this.$map.Size(66, 66));
      //     this.car = new this.$map.Marker(pts[0], { icon: this.myIcon });
      //     this.map.addOverlay(this.car);
      //     // 连接所有点
      //     this.map.addOverlay(new this.$map.Polyline(data, { strokeColor: 'blue', strokeWeight: 5, strokeOpacity: 1 }));
      //   }.bind(this)
      // );
      let polyline = new this.$map.Polyline(data, { strokeColor: 'blue', strokeWeight: 5, strokeOpacity: 1 });
      this.map.addOverlay(polyline);
      let qdIcon = new this.$map.Icon(this.qdIcon, new this.$map.Size(40, 40));
      let zdIcon = new this.$map.Icon(this.zdIcon, new this.$map.Size(40, 40));
      let start = new this.$map.Marker(data[0], { icon: qdIcon });
      let end = new this.$map.Marker(data[data.length - 1], { icon: zdIcon });
      this.map.addOverlay(start);
      this.map.addOverlay(end);
    },
    setZoom(points) {
      if (points.length > 0) {
        let maxLng = points[0].lng;
        let minLng = points[0].lng;
        let maxLat = points[0].lat;
        let minLat = points[0].lat;
        let res;
        for (let i = points.length - 1; i >= 0; i--) {
          res = points[i];
          if (res.lng > maxLng) maxLng = res.lng;
          if (res.lng < minLng) minLng = res.lng;
          if (res.lat > maxLat) maxLat = res.lat;
          if (res.lat < minLat) minLat = res.lat;
        }
        let cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
        let cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
        let zoom = this.getZoom(maxLng, minLng, maxLat, minLat);
        this.map.centerAndZoom(new this.$map.Point(cenLng, cenLat), zoom);
      }
    },
    getZoom(maxLng, minLng, maxLat, minLat) {
      let zoom = [
        '50',
        '100',
        '200',
        '500',
        '1000',
        '2000',
        '5000',
        '10000',
        '20000',
        '25000',
        '50000',
        '100000',
        '200000',
        '500000',
        '1000000',
        '2000000'
      ]; // 级别18到3。
      let pointA = new this.$map.Point(maxLng, maxLat); // 创建点坐标A
      let pointB = new this.$map.Point(minLng, minLat); // 创建点坐标B
      let distance = this.map.getDistance(pointA, pointB).toFixed(1); // 获取两点距离,保留小数点后两位
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 3; // 之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
        }
      }
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
.test-drive-history {
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
  }
}
</style>
