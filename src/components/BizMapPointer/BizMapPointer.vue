<template>
  <div class="biz-map-pointer">
    <el-popover ref="mapContainer" placement="bottom" width="600" trigger="click" popper-class="map-container" @show="showHandler"
      v-model="showPopper">
      <div :id="'map-instance-' + randomKey" class="map-instance"></div>
    </el-popover>
    <el-input v-model="innerAddress" placeholder="请输入地址" @input="inputHandler"></el-input>
    <el-button type="primary" size="mini" v-popover:mapContainer>选择</el-button>
  </div>
</template>

<script>
// import axios from 'axios';
export default {
  name: 'BizMapPointer',
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    address: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      randomKey: '',
      innerAddress: '',
      showPopper: false
    };
  },
  methods: {
    init() {
      this.map = new this.$map.Map('map-instance-' + this.randomKey);
      this.point = new this.$map.Point(116.404, 39.915);
      this.map.centerAndZoom(this.point, 13);
      // 添加缩放以及移动控件
      this.map.addControl(new this.$map.NavigationControl());
      // 设置为可拖拽
      this.map.enableScrollWheelZoom(true);
    },
    pointToAddress(point, address) {
      this.Geocoder.getLocation(point, r => {
        if (r) {
          // let url =
          //   'http://api.map.baidu.com/geocoder/v2/?ak=TKRROZRGxrxzdSAp0jGu0C8r&s=1&location=' +
          //   r.point.lat +
          //   ',' +
          //   r.point.lng +
          //   '&output=json';
          // axios.get(url).then(
          //   function(data) {
          //     console.log(data);
          //   },
          //   function(response) {
          //     console.info(response);
          //   }
          // );
          if (address) {
            this.$emit('addressChange', address, r.addressComponents.city);
          } else {
            this.$emit('addressChange', r.address, r.addressComponents.city);
          }
        }
      });
    },
    addressToPoint(address) {
      this.Geocoder.getPoint(address, r => {
        if (r) {
          this.setPoint(r);
          this.pointToAddress(r, address);
        } else {
          this.$emit('input', { lng: '', lat: '' });
        }
      });
    },
    inputHandler(val) {
      this.addressToPoint(val);
      this.$emit('addressChange', val);
    },
    setMarker(point) {
      // 初始化marker对象
      if (!this.marker) {
        this.marker = new this.$map.Marker(point);
        this.map.addOverlay(this.marker);
        // 开启拖拽功能
        this.marker.enableDragging();
        this.marker.addEventListener('dragend', () => {
          let pt = this.marker.getPosition();

          this.point = pt;
          this.$emit('input', pt);
          this.pointToAddress(pt);
        });
      }

      this.marker.setPosition(point);
      setTimeout(() => {
        this.map.centerAndZoom(point, 16);
      }, 50);
    },
    setPoint(point) {
      this.setMarker(point);
      this.point = point;

      this.$emit('input', point);
    },
    showHandler(e) {
      this.$message('请直接输入或拖动光标选择地址');
      if (this.address) {
        if (this.value && this.value.lat && this.value.lng) {
          this.setPoint(new this.$map.Point(this.value.lng, this.value.lat));
        } else {
          this.addressToPoint(this.address);
        }
      } else {
        this.LocalCity.get(result => {
          this.setMarker(result.center);
          this.$emit('input', result.center);
          this.pointToAddress(result.center);
        });
      }
    }
  },
  created() {
    this.randomKey = new Date().getTime().toString();
    this.LocalCity = new this.$map.LocalCity();
    this.Geocoder = new this.$map.Geocoder();
    this.innerAddress = this.address;
  },
  mounted() {
    this.init();
  },
  watch: {
    address(val) {
      this.innerAddress = val;
    }
  }
};
</script>

<style lang="scss">
.map-container {
  padding: 3px;
  margin-top: 3px !important;

  .map-instance {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 4px;
  }
}
</style>
