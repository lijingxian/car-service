<template>
  <div class="biz-scroll-load"
       style="touch-action: none;">
    <div class="scroll-container"
         :style="{height: height + 'px'}"
         @scroll="handleScroll"
         @wheel="onWheel"
         ref="scrollContainer">
      <div class="loader"
           :style="{paddingTop: wrapperPadding.paddingTop,height: loadingHeight.heightTop}"
           ref="toploader">
        <div class="load-item-top"
             v-loading="showTopLoader"
             :style="{height: loadingHeight.heightTop}">
        </div>
      </div>
      <div class="slot-container"
           ref="scrollContent">
        <slot></slot>
      </div>
      <div class="loader"
           :style="{paddingBottom: wrapperPadding.paddingBottom}"
           ref="bottomLoader">
        <div class="load-item-bottom"
             v-loading="showBottomLoader"
             :style="{height: loadingHeight.heightBottom}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle';
const dragConfig = {
  sensitivity: 10,
  minimumStartDragOffset: 5 // minimum start drag offset
};
const noop = () => Promise.resolve();

export default {
  name: 'biz-scroll-load',
  data() {
    return {
      showTopLoader: false,
      showBottomLoader: false,
      rubberRollBackTimeout: false,
      isLoading: false,
      lastScroll: 0,
      topRubberPadding: 0,
      bottomRubberPadding: 0,
      topProximityThreshold: 20,
      bottomProximityThreshold: 20,
      topHeight: 0,
      bottomHeight: 0,
      reachedTopScrollLimit: true,
      reachedBottomScrollLimit: false,
      handleScroll: () => {}
    };
  },
  props: {
    height: {
      type: [Number, String],
      default: 300
    },
    onReachTop: {
      type: Function
    },
    onReachBottom: {
      type: Function
    }
  },
  created() {
    // 节流
    this.handleScroll = throttle(this.onScroll, 150, { leading: false });
  },
  computed: {
    loadingHeight() {
      return {
        heightTop: this.topHeight + 'px',
        heightBottom: this.bottomHeight + 'px'
      };
    },
    wrapperPadding() {
      return {
        paddingTop: this.topRubberPadding + 'px',
        paddingBottom: this.bottomRubberPadding + 'px'
      };
    }
  },
  methods: {
    waitOneSecond() {
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
    },
    onWheel(event) {
      if (this.isLoading) return;
      // get the wheel direction
      const wheelDelta = event.wheelDelta ? event.wheelDelta : -(event.detail || event.deltaY);
      this.stretchEdge(wheelDelta);
    },
    onCallback(dir) {
      this.isLoading = true;
      this.showBodyLoader = true;
      if (dir > 0) {
        this.showTopLoader = true;
        this.topRubberPadding = 20;
        this.topHeight = 40;
      } else {
        this.showBottomLoader = true;
        this.bottomRubberPadding = 20;
        this.bottomHeight = 40;

        // to force the scroll to the bottom while height is animating
        let bottomLoaderHeight = 0;
        const container = this.$refs.scrollContainer;
        const initialScrollTop = container.scrollTop;
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            bottomLoaderHeight = Math.max(bottomLoaderHeight, this.$refs.bottomLoader.getBoundingClientRect().height);
            container.scrollTop = initialScrollTop + bottomLoaderHeight;
          }, i * 50);
        }
      }

      const callbacks = [this.waitOneSecond()];
      callbacks.push(
        dir > 0 ? (this.onReachTop ? this.onReachTop() : noop()) : this.onReachBottom ? this.onReachBottom() : noop()
      );

      let tooSlow = setTimeout(() => {
        this.reset();
      }, 1000);

      Promise.all(callbacks).then(() => {
        clearTimeout(tooSlow);
        this.reset();
      });
    },
    stretchEdge(direction) {
      clearTimeout(this.rubberRollBackTimeout);

      // check if set these props
      if (!this.onReachEdge) {
        if (direction > 0) {
          if (!this.onReachTop) return;
        } else {
          if (!this.onReachBottom) return;
        }
      }

      // if the scroll is not strong enough, lets reset it
      this.rubberRollBackTimeout = setTimeout(() => {
        if (!this.isLoading) this.reset();
      }, 250);

      // to give the feeling its ruberish and can be puled more to start loading
      if (direction > 0 && this.reachedTopScrollLimit) {
        console.log('1');
        this.topRubberPadding += 5 - this.topRubberPadding / 5;
        if (this.topRubberPadding > this.topProximityThreshold) this.onCallback(1);
      } else if (direction < 0 && this.reachedBottomScrollLimit) {
        console.log('2');
        this.bottomRubberPadding += 6 - this.bottomRubberPadding / 4;
        if (this.bottomRubberPadding > this.bottomProximityThreshold) this.onCallback(-1);
      } else {
        this.onScroll();
      }
    },
    reset() {
      [
        'showTopLoader',
        'showBottomLoader',
        'showBodyLoader',
        'isLoading',
        'reachedTopScrollLimit',
        'reachedBottomScrollLimit'
      ].forEach(prop => (this[prop] = false));

      this.lastScroll = 0;
      this.topRubberPadding = 0;
      this.bottomRubberPadding = 0;
      this.topHeight = 0;
      this.bottomHeight = 0;
      clearInterval(this.rubberRollBackTimeout);
    },
    onScroll() {
      const el = this.$refs.scrollContainer;
      if (this.isLoading || !el) return;
      const scrollDirection = Math.sign(this.lastScroll - el.scrollTop); // IE has no Math.sign, check that webpack polyfills this
      const displacement = el.scrollHeight - el.clientHeight - el.scrollTop;

      const topNegativeProximity = this.topProximityThreshold < 0 ? this.topProximityThreshold : 0;
      const bottomNegativeProximity = this.bottomProximityThreshold < 0 ? this.bottomProximityThreshold : 0;
      if (scrollDirection === -1 && displacement + bottomNegativeProximity <= dragConfig.sensitivity) {
        this.reachedBottomScrollLimit = true;
      } else if (scrollDirection >= 0 && el.scrollTop + topNegativeProximity <= 0) {
        this.reachedTopScrollLimit = true;
      } else {
        this.reachedTopScrollLimit = false;
        this.reachedBottomScrollLimit = false;
        this.lastScroll = el.scrollTop;
      }
    }
  }
};
</script>

<style lang="scss">
.biz-scroll-load {
  display: flex;
  height: 300px;
  flex-direction: column;
  .scroll-container {
    overflow-y: scroll;
    transition: opacity 0.5s;
    .loader {
      text-align: center;
      padding: 0;
      transition: padding 0.5s;
      overflow: hidden;
      position: relative;
      .load-item-top {
        .el-loading-spinner {
          top: 0;
        }
      }
    }
  }
}
</style>
