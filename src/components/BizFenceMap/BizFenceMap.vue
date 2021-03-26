<template>
  <div class="biz-fence-map">
    <div id="fencemap" class="fencemap"></div>
  </div>
</template>
<script>
export default {
  name: 'BizFenceMap',
  components: {},
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default() {
        return '0';
      }
    },
    carState: {
      type: Object,
      default() {
        return {};
      }
    },
    icon: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      params: {
        rectLng1: '',
        rectLat1: '',
        rectLng2: '',
        rectLat2: '',
        rectLng3: '',
        rectLat3: '',
        rectLng4: '',
        rectLat4: '',
        circleLng: '',
        circleLat: '',
        radius: '',
        polygon: '',
        area: ''
      },
      fenceType: '',
      overlaysCache: [],
      styleOptions: {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {}
    },
    carState: {
      deep: true,
      handler(newValue, oldValue) {
        this.initLocation(newValue);
      }
    },
    type: {
      deep: true,
      handler(newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] !== newValue[i]) {
            this.fenceType = newValue[i];
            this.initFence();
          }
        }
      }
    }
  },
  methods: {
    // 加载围栏
    init(carState) {
      this.$BMap = window.BMap;
      this.map = new this.$BMap.Map('fencemap');
      if (carState && carState.longitude && carState.latitude) {
        this.point = new this.$BMap.Point(carState.longitude, carState.latitude);
      } else {
        this.point = new this.$BMap.Point(125.31364243, 43.89833761);
      }
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
      // 城市列表;
      this.map.addControl(
        new window.BMap.CityListControl({
          anchor: window.BMAP_ANCHOR_TOP_LEFT,
          offset: this.$BMap.Size(10, 20)
        })
      );
      let overlays = [];
      let overlaycomplete = e => {
        // 绘图操作完成回调函数
        for (let i = 0; i < overlays.length; i++) {
          this.map.removeOverlay(overlays[i]);
        }
        overlays.push(e.overlay);
        if (e.drawingMode === 'circle') {
          // 圆形时
          this.params.circleLng = e.overlay.getCenter().lng;
          this.params.circleLat = e.overlay.getCenter().lat;
          this.params.radius = e.overlay.getRadius();
          this.$emit('paramsChange', this.params);
          let len = e.overlay.getPath().length;
          let arr = [];
          for (let i = 0; i < len; i++) {
            arr.push([e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat]);
          }
          this.overlaysCache = arr;
          this.map.clearOverlays();
          overlays.push(e.overlay);
          let a = this.overlaysCache;
          let newOverlay = [];
          for (let i in a) {
            newOverlay.push(new this.$BMap.Point(a[i][0], a[i][1]));
          }
          let myOverlay = newOverlay;
          let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
          this.map.addOverlay(myPolygon);
        } else if (e.drawingMode === 'rectangle') {
          // 矩形时
          if (e.overlay.getPath() !== undefined || e.overlay.getPath() !== null) {
            this.params.rectLng1 = e.overlay.getPath()[0].lng;
            this.params.rectLat1 = e.overlay.getPath()[0].lat;
            this.params.rectLng2 = e.overlay.getPath()[1].lng;
            this.params.rectLat2 = e.overlay.getPath()[1].lat;
            this.params.rectLng3 = e.overlay.getPath()[2].lng;
            this.params.rectLat3 = e.overlay.getPath()[2].lat;
            this.params.rectLng4 = e.overlay.getPath()[3].lng;
            this.params.rectLat4 = e.overlay.getPath()[3].lat;
            this.$emit('paramsChange', this.params);
            let len = e.overlay.getPath().length;
            let arr = [];
            for (let i = 0; i < len; i++) {
              arr.push([e.overlay.getPath()[i].lng, e.overlay.getPath()[i].lat]);
            }
            this.overlaysCache = arr;
            this.map.clearOverlays();
            overlays.push(e.overlay);
            let a = this.overlaysCache;
            let newOverlay = [];
            for (let i in a) {
              newOverlay.push(new this.$BMap.Point(a[i][0], a[i][1]));
            }
            let myOverlay = newOverlay;
            let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
            this.map.addOverlay(myPolygon);
          }
        } else if (e.drawingMode === 'polygon') {
          // 多边形时
          this.showLatLon(e.overlay.getPath());
          this.map.clearOverlays();
          overlays.push(e.overlay);
          let a = this.overlaysCache;
          let newOverlay = [];
          for (let i in a) {
            newOverlay.push(new this.$BMap.Point(a[i][0], a[i][1]));
          }
          let myOverlay = newOverlay;
          let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
          this.map.addOverlay(myPolygon);
          myPolygon.enableEditing();
          myPolygon.addEventListener('lineupdate', e => {
            this.showLatLon(e.currentTarget.getPath());
          });
        }
      };
      // 实例化鼠标绘制工具
      if (this.fenceType !== '2') {
        let drawingManager = new window.BMapLib.DrawingManager(this.map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: true, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new this.$BMap.Size(5, 5), // 偏离值
            drawingModes: [
              this.fenceType === '0' ? window.BMAP_DRAWING_CIRCLE : this.fenceType === '1' ? window.BMAP_DRAWING_RECTANGLE : this.fenceType === '3' ? window.BMAP_DRAWING_POLYGON : ''
            ]
          },

          circleOptions: this.styleOptions, // 圆的样式
          polylineOptions: this.styleOptions, // 线的样式
          polygonOptions: this.styleOptions, // 多边形的样式
          rectangleOptions: this.styleOptions // 矩形的样式
        });
        // 添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
      }
      if (this.icon.path) {
        let myIcon = new this.$BMap.Icon(this.icon.path + '/map_grey.png', new this.$BMap.Size(40, 82));
        let marker = new this.$BMap.Marker(this.point, { icon: myIcon });
        this.map.addOverlay(marker);
      } else {
        let marker = new this.$BMap.Marker(this.point);
        this.map.addOverlay(marker);
      }
    },
    initFence() {
      // this.fenceType = '0';
      let overlays = [];
      let overlaycomplete = e => {
        // 绘图操作完成回调函数
        for (let i = 0; i < overlays.length; i++) {
          this.map.removeOverlay(overlays[i]);
        }
        overlays.push(e.overlay);
        if (e.drawingMode === 'circle') {
          // 圆形时
          this.params.circleLng = e.overlay.getCenter().lng;
          this.params.circleLat = e.overlay.getCenter().lat;
          this.params.radius = e.overlay.getRadius();
          this.$emit('paramsChange', this.params);
        } else if (e.drawingMode === 'rectangle') {
          // 矩形时
          if (e.overlay.getPath() !== undefined || e.overlay.getPath() !== null) {
            this.params.rectLng1 = e.overlay.getPath()[0].lng;
            this.params.rectLat1 = e.overlay.getPath()[0].lat;
            this.params.rectLng2 = e.overlay.getPath()[1].lng;
            this.params.rectLat2 = e.overlay.getPath()[1].lat;
            this.params.rectLng3 = e.overlay.getPath()[2].lng;
            this.params.rectLat3 = e.overlay.getPath()[2].lat;
            this.params.rectLng4 = e.overlay.getPath()[3].lng;
            this.params.rectLat4 = e.overlay.getPath()[3].lat;
            this.$emit('paramsChange', this.params);
          }
        } else if (e.drawingMode === 'polygon') {
          // 多边形时
          this.showLatLon(e.overlay.getPath());
          this.map.clearOverlays();
          overlays.push(e.overlay);
          let a = this.overlaysCache;
          let newOverlay = [];
          for (let i in a) {
            newOverlay.push(new this.$BMap.Point(a[i][0], a[i][1]));
          }
          let myOverlay = newOverlay;
          let myPolygon = new this.$BMap.Polygon(myOverlay, this.styleOptions);
          this.map.addOverlay(myPolygon);
          myPolygon.enableEditing();
          myPolygon.addEventListener('lineupdate', e => {
            this.showLatLon(e.currentTarget.getPath());
          });
        }
      };
      // 实例化鼠标绘制工具
      if (this.fenceType !== '2') {
        let drawingManager = new window.BMapLib.DrawingManager(this.map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: true, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new this.$BMap.Size(5, 5), // 偏离值
            drawingModes: [
              this.fenceType === '0' ? window.BMAP_DRAWING_CIRCLE : this.fenceType === '1' ? window.BMAP_DRAWING_RECTANGLE : this.fenceType === '3' ? window.BMAP_DRAWING_POLYGON : ''
            ]
          },

          circleOptions: this.styleOptions, // 圆的样式
          polylineOptions: this.styleOptions, // 线的样式
          polygonOptions: this.styleOptions, // 多边形的样式
          rectangleOptions: this.styleOptions // 矩形的样式
        });
        // 添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
      }
      if (this.icon.path) {
        let myIcon = new this.$BMap.Icon(this.icon.path + '/map_grey.png', new this.$BMap.Size(40, 82));
        let marker = new this.$BMap.Marker(this.point, { icon: myIcon });
        this.map.addOverlay(marker);
      } else {
        let marker = new this.$BMap.Marker(this.point);
        this.map.addOverlay(marker);
      }
    },
    showLatLon(a) {
      let len = a.length;
      let s = '';
      let arr = [];
      for (let i = 0; i < len; i++) {
        arr.push([a[i].lng, a[i].lat]);
        s += a[i].lng + ',' + a[i].lat + ';';
      }
      this.overlaysCache = arr;
      this.params.polygon = s;
      this.$emit('paramsChange', this.params);
    },
    clearOverlays() {
      this.map.clearOverlays();
    },
    initLocation(val) {
      if (val && val.longitude && val.latitude) {
        this.point = new this.$BMap.Point(val.longitude, val.latitude);
      }

      this.map.centerAndZoom(this.point, 13);
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
      this.map.clearOverlays();
      if (this.icon.path) {
        let myIcon = new this.$BMap.Icon(this.icon.path + '/map_grey.png', new this.$BMap.Size(40, 82));
        let marker = new this.$BMap.Marker(this.point, { icon: myIcon });
        this.map.addOverlay(marker);
      } else {
        let marker = new this.$BMap.Marker(this.point);
        this.map.addOverlay(marker);
      }
      this.initFence();
    },
    // 编辑围栏
    initEditFenceMap(params) {
      this.fenceType = params.type;
      this.init(this.carState);
      if (params.type === '0') {
        let circle = new this.$BMap.Circle(new this.$BMap.Point(params.circleLng, params.circleLat), params.radius, {
          strokeColor: 'red',
          fillColor: 'red',
          strokeWeight: 3,
          strokeOpacity: 0.8,
          fillOpacity: 0.3,
          strokeStyle: 'solid'
        }); // 创建圆
        this.map.addOverlay(circle); // 增加圆
        if (params.circleLng && params.circleLat) {
          let point = new this.$BMap.Point(params.circleLng, params.circleLat);
          this.map.centerAndZoom(point, 13);
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
          this.map.centerAndZoom(point, 13);
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
          this.map.centerAndZoom(newOverlay[0], 13);
        }
      } else if (params.type === '2') {
        this.$nextTick(() => {
          let bdary = new this.$BMap.Boundary();
          bdary.get(params.fullName, rs => {
            // 获取行政区域
            this.map.clearOverlays(); // 清除地图覆盖物
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
              let ply = new this.$BMap.Polygon(rs.boundaries[i], this.styleOptions); // 建立多边形覆盖物
              this.map.addOverlay(ply); // 添加覆盖物
              pointArray = pointArray.concat(ply.getPath());
            }
            this.map.setViewport(pointArray); // 调整视野
          });
        });
        if (this.icon.path) {
          let myIcon = new this.$BMap.Icon(this.icon.path + '/map_grey.png', new this.$BMap.Size(40, 82));
          let marker = new this.$BMap.Marker(this.point, { icon: myIcon });
          this.map.addOverlay(marker);
        } else {
          let marker = new this.$BMap.Marker(this.point);
          this.map.addOverlay(marker);
        }
      }
    }
  },
  created() {
    this.fenceType = this.type;
  },
  mounted() {
    this.init(this.carState);
  }
};
</script>

<style lang="scss">
.biz-fence-map {
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .fencemap {
    height: 100%;
  }
}
</style>
