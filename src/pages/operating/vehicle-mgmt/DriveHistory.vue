<template>
  <biz-grid class="drive-history" v-loading="loading">
    <div class="clear" @click="clear" v-show="showFlag"><img :src="mapClear"></div>
    <div class="warning" @click="warning" v-show="showFlag"><img :src="mapAlertGrey"></div>
    <div class="park" @click="park" v-show="showFlag"><img :src="mapParkGrey"></div>
    <div class="driveAction" v-show="showDriveAction">
      <div @click="jjs"><img :src="jjsGrey"><span class="span">急减速<span>{{drivingActionCount[3]}}</span>次</span></div>
      <div @click="jjas"><img :src="jjasGrey"><span class="span">急加速<span>{{drivingActionCount[2]}}</span>次</span></div>
      <div @click="jzw"><img :src="jzwGrey"><span class="span">急转弯<span>{{drivingActionCount[7]}}</span>次</span></div>
      <div @click="jsc"><img :src="jscGrey"><span class="span">急刹车<span>{{drivingActionCount[5]}}</span>次</span></div>
      <div @click="gzs"><img :src="gzsGrey"><span class="span">高转速<span>{{drivingActionCount[9]}}</span>次</span></div>
      <div @click="cds"><img :src="cdsGrey"><span class="span">长怠速<span>{{drivingActionCount[4]}}</span>次</span></div>
    </div>
    <div class="swich" v-show="showFlag">
      <div><i :class="className" @click="swich"></i></div>
    </div>
    <div class="slider-gauge" v-show="showFlag">
      <div class="slider-content">
        <div class="slider">
          <el-slider v-model="value3" :max="points.length" @input="sliderInput" :show-tooltip="false"></el-slider>
        </div>
        <div class="icon">
          <div @click="play">
            <img :src="playIcon" v-show="isPaly" />
          </div>
          <div @click="pause">
            <img :src="pauseIcon" v-show="!isPaly" />
          </div>
        </div>
        <div>
          <ve-gauge :data="chartData" :settings="chartSettings" width="300px" height="300px"></ve-gauge>
        </div>
      </div>
    </div>
    <div class="content">
      <div id="map-container"></div>
      <div class="right">
        <div class="top">
          <span class="span">查询日期：</span>
          <el-date-picker type="datetimerange" class="biz-date-range" v-model="defaultDate" size="mini" range-separator="-"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-button type="primary" size="mini" @click="getList">分段查询</el-button>
          <el-button type="primary" size="mini" @click="mergeList">轨迹合并</el-button>
          <el-button type="primary" size="mini" @click="exportHandler">导出</el-button>
        </div>
        <div class="bottom-content" v-show="!show">
          <div class="bottom" v-for="data in tableData" :key="data.id"
            @click="carTrackType==='0'?getData(data.id):mergeList()">
            <div class="start">
              <img :src="start_circle" width="14" height="14" />
              <div>
                <span>{{data.beginTime}}</span>
                <span>起点：{{data.beginAddress}}</span>
              </div>
            </div>
            <div class="arrived">
              <img :src="arrived_circle" width="14" height="14" />
              <div class="arrived-content">
                <span>{{data.endTime}}</span>
                <span>终点：{{data.endAddress}}</span>
                <span>停留：{{data.stopTime}}</span>
                <span class="icon">
                  <div><img :src="distance1" /><span><span class="font">{{data.mileage}}</span></span>km</div>
                  <div><img :src="time1" /><span><span class="font">{{data.totalTime}}</span></span>h</div>
                  <div><img :src="oil1" /><span><span class="font">0{{data.totalOil}}</span></span>L</div>
                  <div><img :src="aveoil1" /><span><span class="font">{{data.avgOil}}</span></span>L/100km</div>
                </span>
              </div>
            </div>
            <div class="stop" @click.stop="showStop(data.id)"><img :src="button_stop_nor" width="65" height="50" /></div>
          </div>
          <div v-if="tableData.length === 0" :style="styleObject"></div>
        </div>
        <div class="stopAddress" v-show="show">
          <table v-for="(park,index) in parkings" :key="index">
            <tr>
              <td rowspan="5" style="width:73px">{{index===0?'起点':index===parkings.length-1?'终点':'P'+index}}</td>
            </tr>
            <tr>
              <td>时间：</td>
              <td v-if="index===0">{{park.beginTime}}</td>
              <td v-if="index>0&&index===parkings.length-1">{{park.endTime}}</td>
              <td v-if="!((index>0&&index===parkings.length-1)||index===0)">{{park.beginTime}}-{{park.endTime}}</td>
            </tr>
            <tr>
              <td style="width:73px">停留时间：</td>
              <td>{{park.totalTime}}</td>
            </tr>
            <tr>
              <td>状态：</td>
              <td>{{park.type==='0'?'ACC ON':park.type==='1'?'怠速':'熄火'}}</td>
            </tr>
            <tr>
              <td>地址：</td>
              <td>{{park.address}}</td>
            </tr>
          </table>
          <el-button type="primary" size="mini" v-show="show" @click="show=false" style="float:right">返回</el-button>
        </div>
      </div>
    </div>
  </biz-grid>
</template>
<script>
import qdIcon from '@/assets/images/i-web-qd.png';
import zdIcon from '@/assets/images/i-web-zd.png';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import date from '@/utils/date';
import VeGauge from 'v-charts/lib/gauge';
import ElSlider from 'element-ui/lib/slider';
import axios from 'axios';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  components: {
    BizGrid,
    VeGauge,
    ElSlider
  },
  data() {
    this.chartSettings = {
      labelMap: {
        speed: '速度'
      },
      dataName: {
        speed: 'km/h'
      }
    };
    return {
      chartData: {
        columns: ['type', 'value'],
        rows: [{ type: 'speed', value: 0 }]
      },
      value3: 0,
      qdIcon: qdIcon,
      zdIcon: zdIcon,
      start_circle: '/resources/icar/images/operate/icon_start_circle.png',
      arrived_circle: '/resources/icar/images/operate/icon_arrived_circle.png',
      button_stop_nor: '/resources/icar/images/operate/button_stop_nor.png',
      distance1: '/resources/icar/images/operate/icon_distance1.png',
      time1: '/resources/icar/images/operate/icon_time1.png',
      oil1: '/resources/icar/images/operate/icon_oil1.png',
      aveoil1: '/resources/icar/images/operate/icon_aveoil1.png',
      mapAlertGrey: '/resources/icar/images/operate/button_map_alert_grey.png',
      mapClear: '/resources/icar/images/operate/button_map_clear.png',
      mapParkGrey: '/resources/icar/images/operate/button_map_park_grey.png',
      jjsGrey: '/resources/icar/images/operate/icon1_grey.png',
      jjsNor: '/resources/icar/images/operate/icon1_nor.png',
      jjasGrey: '/resources/icar/images/operate/icon2_grey.png',
      jjasNor: '/resources/icar/images/operate/icon2_nor.png',
      jzwGrey: '/resources/icar/images/operate/icon3_grey.png',
      jzwNor: '/resources/icar/images/operate/icon3_nor.png',
      jscGrey: '/resources/icar/images/operate/icon4_grey.png',
      jscNor: '/resources/icar/images/operate/icon4_nor.png',
      gzsGrey: '/resources/icar/images/operate/icon5_grey.png',
      gzsNor: '/resources/icar/images/operate/icon5_nor.png',
      cdsGrey: '/resources/icar/images/operate/icon6_grey.png',
      cdsNor: '/resources/icar/images/operate/icon6_nor.png',
      carIcon: '/resources/icar/images/icon_car4.png',
      playIcon: '/resources/icar/images/operate/btn_play_nor.png',
      pauseIcon: '/resources/icar/images/operate/btn_pause_nor.png',
      className: 'el-icon-caret-bottom',
      tableData: [],
      drivingActionCount: [],
      drivingActions: [],
      parkings: [],
      points: [],
      gpsPoints: [],
      parkingPoints: [],
      pointsRedirect: [],
      map: '',
      loading: false,
      show: false,
      showFlag: false,
      showDriveAction: false,
      isPaly: true,
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
      carTrackType: '0',
      defaultDate: [date.nowDate() + ' ' + '00:00:00', date.nowDate() + ' ' + '23:59:59']
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
    // this.map.addControl(new this.$map.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_LEFT }));
    // 设置为可拖拽
    this.map.enableScrollWheelZoom(true);
  },
  created() {
    this.getList();
  },
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  watch: {},
  methods: {
    showStop(trackId) {
      this.loading = true;
      this.carTrackType === '0' &&
        http
          .get('/admin/car/track.jhtml', { trackId: trackId })
          .then(data => {
            this.loading = false;
            this.parkings = data.parkings;
            this.show = true;
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          });
      this.carTrackType === '1' &&
        http
          .get('/rest/car/mergeTracks.jhtml', this.getParams())
          .then(data => {
            this.loading = false;
            this.parkings = data.parkings;
            this.show = true;
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          });
    },
    getParams() {
      return {
        carId: this.carId,
        beginTime: this.defaultDate[0],
        endTime: this.defaultDate[1],
        carTrackType: this.carTrackType
      };
    },
    async exportHandler() {
      let params = this.getParams();
      try {
        let response = await axios.post('/admin/car/track/export.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    swich() {
      this.showDriveAction = this.className === 'el-icon-caret-bottom';
      this.className = this.className === 'el-icon-caret-bottom' ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
    },
    clear() {
      this.mapParkGrey = '/resources/icar/images/operate/button_map_park_grey.png';
      this.mapAlertGrey = '/resources/icar/images/operate/button_map_alert_grey.png';
      this.jjsGrey = '/resources/icar/images/operate/icon1_grey.png';
      this.jjasGrey = '/resources/icar/images/operate/icon2_grey.png';
      this.jzwGrey = '/resources/icar/images/operate/icon3_grey.png';
      this.jscGrey = '/resources/icar/images/operate/icon4_grey.png';
      this.gzsGrey = '/resources/icar/images/operate/icon5_grey.png';
      this.cdsGrey = '/resources/icar/images/operate/icon6_grey.png';
      this.map.clearOverlays();
      // 通过DrivingRoute获取一条路线的point
      let driving = new this.$map.DrivingRoute(this.map, { renderOptions: { map: this.map, autoViewport: true } }); // 驾车实例
      driving.search(this.points[0], this.points[this.points.length - 1]);
      driving.setSearchCompleteCallback(
        function() {
          let pts = this.points; // 通过驾车实例，获得一系列点的数组
          this.myIcon = new this.$map.Icon(this.carIcon, new this.$map.Size(66, 66));
          this.car = new this.$map.Marker(pts[0], { icon: this.myIcon });
          this.map.addOverlay(this.car);
          // 连接所有点
          this.map.addOverlay(new this.$map.Polyline(this.points, { strokeColor: 'blue', strokeWeight: 5, strokeOpacity: 1 }));
        }.bind(this)
      );
    },
    warning() {
      this.mapAlertGrey = '/resources/icar/images/operate/button_map_alert_selected.png';
      for (let i in this.drivingActions) {
        // 急减速
        let myIcon = '';
        if (this.drivingActions[i].type === 'deceleration') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_1.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else if (this.drivingActions[i].type === 'acceleration') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_2.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else if (this.drivingActions[i].type === 'sharpTurn') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_3.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else if (this.drivingActions[i].type === 'rapidBrake') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_4.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else if (this.drivingActions[i].type === 'overRotateSpeed') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_5.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else if (this.drivingActions[i].type === 'idleSpeed') {
          myIcon = new this.$map.Icon('/resources/icar/images/icon_map_6.png', new this.$map.Size(45, 54));
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    park() {
      this.mapParkGrey = '/resources/icar/images/operate/icon_map_park_selected.png';
      let myIcon = '';
      for (let i in this.drivingActions) {
        if (this.drivingActions[i].type === 'drivingStop') {
          myIcon = new this.$map.Icon('/resources/icar/images/operate/icon_map_park_selected.png', new this.$map.Size(45, 54));
        }
        let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
        let marker = new this.$map.Marker(point, { icon: myIcon });
        this.map.addOverlay(marker);
      }
    },
    jjs() {
      this.jjsGrey = this.jjsNor;
      for (let i in this.drivingActions) {
        // 急减速
        if (this.drivingActions[i].type === 'deceleration') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_1.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    jjas() {
      this.jjasGrey = this.jjasNor;
      for (let i in this.drivingActions) {
        // 急加速
        if (this.drivingActions[i].type === 'acceleration') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_2.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    jzw() {
      this.jzwGrey = this.jzwNor;
      for (let i in this.drivingActions) {
        // 急转弯
        if (this.drivingActions[i].type === 'sharpTurn') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_3.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    jsc() {
      this.jscGrey = this.jscNor;
      for (let i in this.drivingActions) {
        // 急刹车
        if (this.drivingActions[i].type === 'rapidBrake') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_4.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    gzs() {
      this.gzsGrey = this.gzsNor;
      for (let i in this.drivingActions) {
        // 高转速
        if (this.drivingActions[i].type === 'overRotateSpeed') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_5.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    cds() {
      this.cdsGrey = this.cdsNor;
      for (let i in this.drivingActions) {
        // 长怠速
        if (this.drivingActions[i].type === 'idleSpeed') {
          let point = new this.$map.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
          let myIcon = new this.$map.Icon('/resources/icar/images/icon_map_6.png', new this.$map.Size(45, 54));
          let marker = new this.$map.Marker(point, { icon: myIcon });
          this.map.addOverlay(marker);
        }
      }
    },
    getList() {
      this.loading = true;
      http
        .get('/admin/car/tracks.jhtml', this.getParams())
        .then(data => {
          this.loading = false;
          this.tableData = data.carTracks;
          this.carTrackType = '0';
          data.carTracks.length > 0 && this.getData(data.carTracks[0].id);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        });
    },
    mergeList() {
      this.loading = true;
      http
        .get('/rest/car/mergeTracks.jhtml', this.getParams())
        .then(data => {
          this.loading = false;
          this.tableData = [
            {
              avgOil: data.avgOil,
              avgSpeed: data.avgSpeed,
              beginAddress: data.beginAddress,
              beginTime: data.beginTime,
              drivingActionMap: data.drivingActionMap,
              endAddress: data.endAddress,
              endTime: data.endTime,
              id: data.id,
              isValid: data.isValid,
              mileage: data.mileage,
              oilCost: data.oilCost,
              patternMatching: data.patternMatching,
              score: data.score,
              stopTime: data.stopTime,
              totalOil: data.totalOil,
              totalTime: data.totalTime
            }
          ];
          this.carTrackType = '1';
          this.points = [];
          data.points.forEach(item => {
            this.points.push(new this.$map.Point(item.baiduLng, item.baiduLat));
            this.pointsRedirect.push(item);
          });
          this.drivingActionCount = data.drivingActionCount;
          this.drivingActions = data.drivingActions;
          console.log(this.points);
          this.successHandler(this.points);
          this.isPaly = true;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        });
    },
    getData(trackId = '') {
      this.points = [];
      this.loading = true;
      this.showFlag = true;
      http
        .get('/admin/car/track.jhtml', { trackId: trackId })
        .then(data => {
          this.loading = false;
          data.points.forEach(item => {
            this.points.push(new this.$map.Point(item.baiduLng, item.baiduLat));
            this.pointsRedirect.push(item);
          });
          this.drivingActionCount = data.drivingActionCount;
          this.drivingActions = data.drivingActions;
          this.successHandler(this.points);
          this.isPaly = true;
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
      let driving = new this.$map.DrivingRoute(this.map, { renderOptions: { map: this.map, autoViewport: true } }); // 驾车实例
      console.log(data[0]);
      driving.search(data[0], data[data.length - 1]);
      driving.setSearchCompleteCallback(
        function() {
          let pts = data; // 通过驾车实例，获得一系列点的数组
          this.myIcon = new this.$map.Icon(this.carIcon, new this.$map.Size(66, 66));
          this.car = new this.$map.Marker(pts[0], { icon: this.myIcon });
          this.map.addOverlay(this.car);
          // 连接所有点
          this.map.addOverlay(new this.$map.Polyline(data, { strokeColor: 'blue', strokeWeight: 5, strokeOpacity: 1 }));
        }.bind(this)
      );
      // let polyline = new this.$map.Polyline(data, { strokeColor: 'blue', strokeWeight: 5, strokeOpacity: 1 });
      // this.map.addOverlay(polyline);
      // let qdIcon = new this.$map.Icon(this.qdIcon, new this.$map.Size(40, 40));
      // let zdIcon = new this.$map.Icon(this.zdIcon, new this.$map.Size(40, 40));
      // let start = new this.$map.Marker(data[0], { icon: qdIcon });
      // let end = new this.$map.Marker(data[data.length - 1], { icon: zdIcon });
      // this.map.addOverlay(start);
      // this.map.addOverlay(end);
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
    play() {
      this.isPaly = false;
      this.value3 = this.index;
      let point = this.points[this.index];
      this.chartData.rows = [{ type: 'speed', value: this.pointsRedirect[this.index].speed }];
      if (this.index > 0) {
        this.map.addOverlay(
          new this.$map.Polyline([this.points[this.index - 1], point], {
            strokeColor: 'red',
            strokeWeight: 2,
            strokeOpacity: 1
          })
        );
      }
      this.car.setPosition(this.points[this.index]);
      this.car.setRotation(this.pointsRedirect[this.index].direction);
      this.index = this.index + 1;
      if (this.index < this.points.length) {
        this.timer = window.setTimeout(this.play, 1000);
      } else {
        this.map.panTo(point);
      }
    },
    pause() {
      this.isPaly = true;
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
    },
    sliderInput(val) {
      this.index = val;
      this.chartData.rows = [{ type: 'speed', value: this.pointsRedirect[val].speed }];
      if (val > 0) {
        this.map.addOverlay(
          new this.$map.Polyline([this.points[val - 1], this.points[this.value3]], {
            strokeColor: 'red',
            strokeWeight: 2,
            strokeOpacity: 1
          })
        );
      }
      this.car.setPosition(this.points[val]);
      this.car.setRotation(this.pointsRedirect[val].direction);
    }
  }
};
</script>
<style lang="scss">
.drive-history {
  padding: 5px !important;
  background: #fff;
  color: #666666;
  height: 100vh;
  width: 95vw;
  .clear {
    position: absolute;
    bottom: 260px;
    left: 10px;
    z-index: 11;
    cursor: pointer;
  }
  .warning {
    position: absolute;
    bottom: 200px;
    left: 10px;
    z-index: 11;
    cursor: pointer;
  }
  .park {
    position: absolute;
    bottom: 140px;
    left: 10px;
    z-index: 11;
    cursor: pointer;
  }
  .swich {
    position: absolute;
    width: calc(100% - 610px);
    z-index: 1;
    div {
      text-align: center;
    }
    .el-icon-caret-bottom {
      font-size: 24px;
      margin-top: 0px;
      cursor: pointer;
    }
    .el-icon-caret-top {
      font-size: 24px;
      margin-top: 62px;
      cursor: pointer;
    }
  }
  .slider-gauge {
    position: absolute;
    width: calc(100% - 610px);
    z-index: 1;
    height: 300px;
    bottom: 0px;
    .slider-content {
      display: flex;
      justify-content: space-between;
      .slider {
        width: 100%;
        padding: 150px 0px 0px 10px;
      }
      .icon {
        margin: 150px 0px 0px 20px;
        cursor: pointer;
      }
    }
  }
  .driveAction {
    font-size: 12px;
    color: #666666;
    text-align: center;
    position: absolute;
    top: 0px;
    z-index: 2;
    width: calc(100% - 610px);
    height: 70px;
    background: #ffffff;
    display: flex;
    justify-content: space-around;
    div {
      cursor: pointer;
    }
    .span {
      display: block;
      span {
        color: red;
      }
    }
  }
  .content {
    display: flex;
    width: 100%;
    height: 100%;
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
    .right {
      width: 610px;
      font-size: 12px;
      padding-left: 5px;
      .top {
        .el-range-editor--mini.el-input__inner {
          width: 315px;
        }
        .span {
          line-height: 30px;
          width: 70px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
        .el-button--mini {
          margin-left: 5px;
        }
        display: flex;
        justify-content: space-around;
      }
      .bottom-content {
        height: calc(100% - 40px);
        overflow: auto;
        position: relative;
        .bottom {
          background: #f2f5fa;
          position: relative;
          margin: 5px 0px;
          cursor: pointer;
          .start {
            display: flex;
            padding: 10px 10px 5px 10px;
            span {
              display: block;
            }
            div {
              margin-left: 10px;
            }
          }
          .arrived {
            display: flex;
            padding: 10px 10px 5px 10px;
            .arrived-content {
              margin-left: 10px;
              width: 100%;
              span {
                display: block;
              }
              .icon {
                display: flex;
                justify-content: space-between;
                width: 100%;
                div {
                  display: flex;
                  height: 20px;
                  line-height: 20px;
                }
                .font {
                  color: #538cd1;
                  margin-left: 5px;
                }
              }
            }
          }
          .stop {
            position: absolute;
            top: 30px;
            right: 10px;
            cursor: pointer;
          }
        }
      }
      .stopAddress {
        height: calc(100% - 40px);
        overflow: auto;
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          border: 1px solid #e1e1e1;
          padding: 5px;
        }
      }
    }
  }
}
</style>
