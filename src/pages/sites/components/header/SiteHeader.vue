<template>
  <div class="site-header">
    <el-button type="primary" icon="iconfont biz-icon-eye" @click="onReview">预览</el-button>
    <el-button type="primary" icon="iconfont biz-icon-cunchuchajian" @click="onSave">保存</el-button>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" width="391px" center :modal-append-to-body="false">
      <div slot="title"></div>
      <div class="site-preview">
        <brick v-for="brick of bricks" :brick-data="brick" :key="brick.id" :isEdit="false"></brick>
      </div>
      <!-- <iframe src="/#/site/single-page" width="375px" height="667px" frameborder="0"></iframe> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Brick from '../center-panel/Brick';

export default {
  name: 'SiteHeader',
  components: {
    Brick
  },
  props: {},
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters('Site', ['bricks'])
  },
  watch: {},
  created() {},
  methods: {
    ...mapActions('Site', ['saveActivityContent']),
    onReview() {
      this.dialogVisible = true;
    },
    onSave() {
      this.saveActivityContent(() => {
        this.$message({
          customClass: 'site-form-message',
          message: '保存成功',
          type: 'success',
          center: true
        });
      });
    }
  }
};
</script>

<style lang="scss">
.site-header {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > .el-button {
    > .iconfont {
      margin-right: 5px;
    }
  }
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 8px;
    .site-preview {
      width: 375px;
      height: 667px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      scrollbar-width: none;
    }
  }
}
</style>
