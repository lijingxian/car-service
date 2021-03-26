<template>
  <div class="com-list">
    <div class="com-section" v-show="comMenuId==='10'">
      <div class="label">图片（拖拽添加此内容）</div>
      <div class="drag-item image" draggable="true" @dragstart="onDragstart($event,'image')">
        <img src="https://p3-tt.byteimg.com/img/ad-tetris-site/brick_tpl_picture_0.png~noop.webp" />
      </div>
    </div>
    <div class="com-section" v-show="comMenuId==='20'">
      <div class="label">简单文本（拖拽添加此内容）</div>
      <div class="drag-item" draggable="true" @dragstart="onDragstart($event,'simple-text')">
        <img src="https://p1-tt.byteimg.com/img/ies.fe.mis/aa6a72c0f0769273f412aad7a55801e5.jpeg~noop.webp" />
      </div>
    </div>
    <div class="com-section" v-show="comMenuId==='31'">
      <div class="label">基本样式（拖拽添加此内容）</div>
      <div class="drag-item" draggable="true" @dragstart="onDragstart($event,'form')">
        <img src="https://p1-tt.byteimg.com/img/ies.fe.mis/bb2a579f06740f7e21fae4efa909539e.png~noop.webp" />
      </div>
    </div>
    <div class="com-section" v-show="comMenuId==='32'">
      <div class="label">基本样式（拖拽添加此内容）</div>
      <div class="drag-item" draggable="true" @dragstart="onDragstart($event,'tel')">
        <img src="https://p9-tt.byteimg.com/img/ies.fe.mis/9ab497fd2a3d6f4b769745855e9388f5.png~noop.webp" />
      </div>
    </div>
    <div class="com-section" v-show="comMenuId==='33'">
      <div class="label">按钮（拖拽添加此内容）</div>
      <div class="drag-item" draggable="true" @dragstart="onDragstart($event,'btn')">
        <img src="@/assets/images/site/按钮.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ComList',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters('Site', ['comMenuId'])
  },
  watch: {},
  created() {},
  methods: {
    onDragstart(e, type) {
      e.dataTransfer.setData('com-type', type);
    }
  }
};
</script>

<style lang="scss">
.com-list {
  flex-grow: 2;
  .com-section {
    margin: 24px 24px 32px;
    .label {
      font-size: 16px;
    }
    .drag-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 16px;
      border-radius: 4px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
      background-color: #fff;
      &:hover {
        box-shadow: 0 4px 13px 0 rgba(0, 0, 0, 0.18);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
      .el-icon-plus {
        font-size: 30px;
        margin-top: 30px;
      }
    }
  }
}
</style>
