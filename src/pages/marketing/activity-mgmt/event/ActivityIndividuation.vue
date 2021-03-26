<template>
  <biz-grid class="activity-individuation" v-loading="loading">
    <div slot="top">
      <div class="header_1" v-if="isEdit">
        <el-button type="primary" size="mini" @click="screen">现场大屏幕</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </div>
    </div>
    <el-form :model="formModel" label-width="110px" size="small" :disabled="!isEdit" :inline-message="true">
      <el-form-item label="大屏幕显示：">
        <el-checkbox v-model="formModel.storeLogoSwitchs" true-label='1' false-label='0'>店铺logo</el-checkbox>
        <el-checkbox v-model="formModel.storeNameSwitchs" true-label='1' false-label='0'>店铺名称</el-checkbox>
        <el-checkbox v-model="formModel.signCountSwitchs" true-label='1' false-label='0'>签到人数</el-checkbox>
        <el-checkbox v-model="formModel.broadcastSwitchs" true-label='1' false-label='0'>广播条</el-checkbox>
        <el-input v-model="formModel.broadcast" v-if="formModel.broadcastSwitchs==='1'" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="屏幕背景" prop="name">
        <BizAvatarUploaderNew v-model="formModel.background">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
    <el-dialog title="" :visible.sync="dialogVisibleScreen" append-to-body :fullscreen="fullscreen" custom-class="fullScreen-dialog">
      <full-screen :itemId="itemId" :open="dialogVisibleScreen"></full-screen>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import FullScreen from './components/FullScreen';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    BizAvatarUploaderNew,
    FullScreen
  },
  data() {
    return {
      loading: false,
      dialogVisibleScreen: false,
      fullscreen: true,
      radio: '1',
      // 用户信息
      formModel: {
        localMarketing: '',
        storeLogoSwitchs: '0',
        storeNameSwitchs: '0',
        signCountSwitchs: '0',
        broadcastSwitchs: '0',
        broadcast: '扫描二维码签到后，发送想说的话即可上墙，欢迎大家踊跃发言',
        background: ''
      },
      configure: [
        { label: '店铺logo', value: 'storeLogoSwitchs' },
        { label: '店铺名称', value: 'storeNameSwitchs' },
        { label: '签到人数', value: 'signCountSwitchs' },
        { label: '广播条', value: 'broadcastSwitchs' }
      ]
    };
  },
  created() {
    if (this.itemId) this.getList();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    clear() {
      return {
        localMarketing: '',
        storeLogoSwitchs: '0',
        storeNameSwitchs: '0',
        signCountSwitchs: '0',
        broadcastSwitchs: '0',
        broadcast: '扫描二维码签到后，发送想说的话即可上墙，欢迎大家踊跃发言',
        background: ''
      };
    },
    screen() {
      this.dialogVisibleScreen = true;
    },
    save() {
      this.formModel.localMarketing = this.itemId;
      http
        .put(activityMgmt.configure, this.formModel)
        .then(data => {
          this.$message.success('保存成功');
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    getList() {
      http
        .get(activityMgmt.configure, {
          id: this.itemId || ''
        })
        .then(data => {
          this.formModel = Object.assign(this.clear(), data.data);
          if (!this.formModel.background) {
            this.formModel.background = '/resources/admin/images/default/default-screen.png';
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    }
  }
};
</script>

<style lang="scss">
.fullScreen-dialog {
  .el-dialog__header {
    position: relative;
    z-index: 1;
  }
}
.activity-individuation {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .header_1 {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .header_2 {
    .span {
      margin-right: 10px;
    }
    font-size: 12px;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
