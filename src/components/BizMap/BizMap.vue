<template>
  <div class="bizmap">
    <div class="nav">
      <a href="https://map.baidu.com/" target="_blank">
        <div class="icon_map_nav"></div>
      </a>
    </div>
    <div class="swich">
      <a href="javascript:;" @click="swich()">
        <div v-show="showPerson" class="icon_map_person"></div>
        <div v-show="showCar" class="icon_map_car"></div>
      </a>
    </div>
    <div id="allmap" class="allmap"></div>
  </div>
</template>
<script>
import head from '@/assets/images/head.png';
export default {
  name: 'BizMap',
  components: {},
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    fences: {
      type: Array,
      default() {
        return [];
      }
    },
    maxDistance: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      markers: [],
      personMarkers: [],
      showPerson: true,
      showCar: false,
      zoom: 11
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.zoomChange();
        this.init();
        // 遍历获取车辆的信息
        this.markers = [];
        this.personMarkers = [];
        for (let i = 0; i < this.value.length; i++) {
          if (
            this.value[i].carState &&
            this.value[i].carState.longitude &&
            this.value[i].carState.latitude
          ) {
            let point = new this.$BMap.Point(
              this.value[i].carState.longitude,
              this.value[i].carState.latitude
            );
            this.addMarker(
              point,
              this.value[i].drivingState,
              this.value[i].bodyStateData,
              this.value[i].icon ? this.value[i].icon.path : '',
              this.value[i]
            );
          }
        }
        for (let i = 0; i < this.value.length; i++) {
          if (
            this.value[i].stateData &&
            this.value[i].stateData.longitude &&
            this.value[i].stateData.latitude
          ) {
            let point = new this.$BMap.Point(
              this.value[i].stateData.longitude,
              this.value[i].stateData.latitude
            );
            this.addMarker(
              point,
              this.value[i].drivingState,
              this.value[i].bodyStateData,
              this.value[i].icon ? this.value[i].icon.path : '',
              this.value[i]
            );
          }
        }
        // 点聚合
        /* eslint-disable no-new */
        new window.BMapLib.MarkerClusterer(this.map, {
          markers: this.markers
        });
      },
      deep: true
    },
    fences: {
      deep: true,
      handler(newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          this.initFenceMap(newValue[i]);
        }
      }
    }
  },
  methods: {
    init() {
      this.$BMap = window.BMap;
      this.map = new this.$BMap.Map('allmap');
      this.point = new this.$BMap.Point(125.31364243, 43.89833761);
      this.map.centerAndZoom(this.point, this.zoom);
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
      // 城市列表;
      this.map.addControl(
        new window.BMap.CityListControl({
          anchor: window.BMAP_ANCHOR_TOP_LEFT,
          offset: this.$BMap.Size(10, 20)
        })
      );
    },
    // 增加人的点
    addPersonMarker(point) {
      let myIcon = new this.$BMap.Icon(head, new this.$BMap.Size(35, 35));
      let marker = new this.$BMap.Marker(point, { icon: myIcon });
      this.personMarkers.push(marker);
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, this.zoom);
    },
    // 增加车的点
    addMarker(point, drivingState, bodyStateData, carIcon, car) {
      let myIcon = '';
      if (
        drivingState === '0' ||
        drivingState === '1' ||
        drivingState === '3'
      ) {
        if (bodyStateData) {
          if (
            bodyStateData.value === '2:0;7:0' ||
            bodyStateData.value === '2:0'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/alarm_green.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (
            bodyStateData.value === '2:1;7:1' ||
            bodyStateData.value === '7:1'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/sos_green.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (bodyStateData.value === '2:0;7:1') {
            myIcon = new this.$BMap.Icon(
              carIcon + '/warningsos_green.png',
              new this.$BMap.Size(40, 82)
            );
          } else {
            myIcon = new this.$BMap.Icon(
              carIcon + '/map_green.png',
              new this.$BMap.Size(40, 82)
            );
          }
        } else {
          myIcon = new this.$BMap.Icon(
            carIcon + '/map_green.png',
            new this.$BMap.Size(40, 40)
          );
        }
      } else if (drivingState === '2') {
        if (bodyStateData) {
          if (
            bodyStateData.value === '2:0;7:0' ||
            bodyStateData.value === '2:0'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/alarm_orange.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (
            bodyStateData.value === '2:1;7:1' ||
            bodyStateData.value === '7:1'
          ) {
            myIcon = new this.$BMap.Icon(
              carIcon + '/sos_orange.png',
              new this.$BMap.Size(40, 62)
            );
          } else if (bodyStateData.value === '2:0;7:1') {
            myIcon = new this.$BMap.Icon(
              carIcon + '/warningsos_orange.png',
              new this.$BMap.Size(40, 82)
            );
          } else {
            myIcon = new this.$BMap.Icon(
              carIcon + '/map_orange.png',
              new this.$BMap.Size(40, 82)
            );
          }
        } else {
          myIcon = new this.$BMap.Icon(
            carIcon + '/map_orange.png',
            new this.$BMap.Size(40, 40)
          );
        }
      } else {
        myIcon = new this.$BMap.Icon(
          carIcon + '/map_grey.png',
          new this.$BMap.Size(40, 40)
        );
      }
      let marker = new this.$BMap.Marker(point, { icon: myIcon });
      this.markers.push(marker);
      let that = this;
      marker.addEventListener('click', e => {
        that.$emit('addClickHandler', car);
      });
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, this.zoom);
      // 路况信息;
      this.map.addControl(
        new window.BMapLib.TrafficControl({
          showPanel: true, // 是否显示路况提示面板
          anchor: window.BMAP_ANCHOR_BOTTOM_RIGHT
        })
      );
      // 全景
      this.map.addControl(
        new this.$BMap.PanoramaControl({
          anchor: window.BMAP_ANCHOR_TOP_RIGHT,
          offset: this.$BMap.Size(10, 20)
        })
      );
    },
    // 人车切换
    swich() {
      if (this.showPerson) {
        this.showPerson = false;
        this.showCar = true;
        this.initPersonList();
      } else {
        this.showPerson = true;
        this.showCar = false;
        this.initCarList();
      }
    },
    // 地图上全部车辆
    initCarList() {
      this.markers = [];
      this.personMarkers = [];
      for (let i = 0; i < this.value.length; i++) {
        if (
          this.value[i].carState &&
          this.value[i].carState.longitude &&
          this.value[i].carState.latitude
        ) {
          let point = new this.$BMap.Point(
            this.value[i].carState.longitude,
            this.value[i].carState.latitude
          );
          this.addMarker(
            point,
            this.value[i].drivingState,
            this.value[i].bodyStateData,
            this.value[i].icon.path
          );
        }
      }
      this.map.clearOverlays();
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.markers
      });
    },
    // 地图上全部人
    initPersonList() {
      this.personMarkers = [];
      this.markers = [];
      this.map.clearOverlays();
      for (let i = 0; i < this.value.length; i++) {
        if (this.value[i].member.longitude && this.value[i].member.latitude) {
          let personPoint = new this.$BMap.Point(
            this.value[i].member.longitude,
            this.value[i].member.latitude
          );
          this.addPersonMarker(personPoint);
        }
      }
      // 点聚合
      /* eslint-disable no-new */
      new window.BMapLib.MarkerClusterer(this.map, {
        markers: this.personMarkers
      });
    },
    // 编辑围栏
    initFenceMap(params) {
      if (params.type === '0') {
        let circle = new this.$BMap.Circle(
          new this.$BMap.Point(params.circleLng, params.circleLat),
          params.radius,
          {
            strokeColor: 'red',
            fillColor: 'red',
            strokeWeight: 3,
            strokeOpacity: 0.8,
            fillOpacity: 0.3,
            strokeStyle: 'solid'
          }
        ); // 创建圆
        this.map.addOverlay(circle); // 增加圆
        if (params.circleLng && params.circleLat) {
          let point = new this.$BMap.Point(params.circleLng, params.circleLat);
          this.map.centerAndZoom(point, this.zoom);
        }
      } else if (params.type === '1') {
        let rectangle = new this.$BMap.Polygon(
          [
            new this.$BMap.Point(params.rectLng1, params.rectLat1),
            new this.$BMap.Point(params.rectLng2, params.rectLat2),
            new this.$BMap.Point(params.rectLng3, params.rectLat3),
            new this.$BMap.Point(params.rectLng4, params.rectLat4)
          ],
          {
            strokeColor: 'red',
            fillColor: 'red',
            strokeWeight: 3,
            strokeOpacity: 0.8,
            fillOpacity: 0.3,
            strokeStyle: 'solid'
          }
        ); // 创建矩形
        this.map.addOverlay(rectangle); // 增加矩形
        if (params.rectLng1 && params.rectLat1) {
          let point = new this.$BMap.Point(params.rectLng1, params.rectLat1);
          this.map.centerAndZoom(point, this.zoom);
        }
      } else if (params.type === '3') {
        let arrPolygon = [];
        arrPolygon = params.polygon.split(';');
        let newOverlay = [];
        for (let i = 0; i < arrPolygon.length; i++) {
          let splitTemp = [];
          splitTemp = arrPolygon[i].split(',');
          newOverlay.push(new this.$BMap.Point(splitTemp[0], splitTemp[1]));
        }

        let myOverlay = newOverlay;
        let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
        this.map.addOverlay(myPolygon); // 增加多边形
        if (newOverlay.length > 0) {
          this.map.centerAndZoom(newOverlay[0], this.zoom);
        }
      } else if (params.type === '2') {
        this.$nextTick(() => {
          let bdary = new this.$BMap.Boundary();
          bdary.get(params.area, rs => {
            // 获取行政区域
            let count = rs.boundaries.length; // 行政区域的点有多少个
            if (count === 0) {
              // $.message(
              //   'warn',
              //   '${message("icar.admin.motorcade.index.noticeInfoAdministration")}'
              // ); //未能获取当前输入行政区域
              return;
            }
            let pointArray = [];
            for (let i = 0; i < count; i++) {
              let ply = new this.$BMap.Polygon(
                rs.boundaries[i],
                this.styleOptions
              ); // 建立多边形覆盖物
              this.map.addOverlay(ply); // 添加覆盖物
              pointArray = pointArray.concat(ply.getPath());
            }
            // this.map.setViewport(pointArray); // 调整视野
          });
        });
      }
    },
    clearOverlays() {
      this.map.clearOverlays();
    },
    zoomChange() {
      if (this.maxDistance / 1000 > 0.05 && this.maxDistance / 1000 < 0.1) {
        this.zoom = 17;
      }
      if (this.maxDistance / 1000 > 0.1 && this.maxDistance / 1000 < 0.2) {
        this.zoom = 16;
      }
      if (this.maxDistance / 1000 > 0.2 && this.maxDistance / 1000 < 0.5) {
        this.zoom = 15;
      }
      if (this.maxDistance / 1000 > 0.5 && this.maxDistance / 1000 < 1) {
        this.zoom = 14;
      }
      if (this.maxDistance / 1000 > 1 && this.maxDistance / 1000 < 2) {
        this.zoom = 13;
      }
      if (this.maxDistance / 1000 > 2 && this.maxDistance / 1000 < 5) {
        this.zoom = 12;
      }
      if (this.maxDistance / 1000 > 5 && this.maxDistance / 1000 < 10) {
        this.zoom = 11;
      }
      if (this.maxDistance / 1000 > 10 && this.maxDistance / 1000 < 20) {
        this.zoom = 10;
      }
      if (this.maxDistance / 1000 > 20 && this.maxDistance / 1000 < 50) {
        this.zoom = 9;
      }
      if (this.maxDistance / 1000 > 50 && this.maxDistance / 1000 < 100) {
        this.zoom = 8;
      }
      if (this.maxDistance / 1000 > 100 && this.maxDistance / 1000 < 200) {
        this.zoom = 7;
      }
      if (this.maxDistance / 1000 > 200 && this.maxDistance / 1000 < 500) {
        this.zoom = 6;
      }
      if (this.maxDistance / 1000 > 500 && this.maxDistance / 1000 < 1000) {
        this.zoom = 5;
      }
      if (this.maxDistance / 1000 > 1000 && this.maxDistance / 1000 < 2000) {
        this.zoom = 4;
      }
      if (this.maxDistance / 1000 > 2000) {
        this.zoom = 3;
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.bizmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .swich {
    position: absolute;
    top: 170px;
    right: 15px;
    z-index: 10;
  }
  .nav {
    position: absolute;
    top: 100px;
    right: 15px;
    z-index: 10;
  }
  .allmap {
    height: 100%;
  }
  .maplibTc {
    right: 100px!important;
  }
  .icon_map_person {
    height: 40px;
    width: 40px;
    background: url('~@/assets/images/icon_map_person.png');
    line-height: 45px;
    text-align: center;
  }
  .icon_map_car {
    height: 40px;
    width: 40px;
    background: url('~@/assets/images/icon_map_car.png');
    line-height: 45px;
    text-align: center;
  }
  .icon_map_nav {
    height: 44px;
    width: 44px;
    background: url('~@/assets/images/icon_map_navi.png');
    line-height: 45px;
    text-align: center;
  }
  .maplibTcBtn_deskTop {
    top: auto !important;
    bottom: 10px !important;
  }
}
</style>
