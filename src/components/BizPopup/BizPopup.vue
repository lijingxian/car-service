<template>
  <transition name="biz-fade-t">
    <div class="biz-popup" v-show="open" @click.self="close">
      <transition name="biz-fade-t-right">
        <div class="popup-content" v-show="open" :style="contentStyle">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BizPopup',
  props: {
    open: {
      type: Boolean,
      default () {
        return false;
      }
    },
    contentStyle: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss">
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}

.biz-popup {
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;

  .popup-content {
    margin: 0;
    padding: 0;
    background-color: #fff;
    width: 500px;
    position: absolute;
    backface-visibility: hidden;
    top: 0;
    right: 0;
    bottom: 0;
    left: auto;

    .el-tabs {
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;

      .el-tabs__content {
        padding: 0;
        flex-grow: 1;

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}

.biz-fade-t-enter-active,
.biz-fade-t-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
.biz-fade-t-enter-active {
  animation-name: fadeIn;
}
.biz-fade-t-leave-active {
  animation-name: fadeOut;
}

.biz-fade-t-right-enter-active,
.biz-fade-t-right-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
.biz-fade-t-right-enter-active {
  animation-name: fadeInRight;
}
.biz-fade-t-right-leave-active {
  animation-name: fadeOutRight;
}
</style>
