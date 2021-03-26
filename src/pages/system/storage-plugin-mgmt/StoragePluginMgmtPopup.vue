<template>
  <biz-popup-tabs :open="open" v-model="activeTabName" @close="close">
    <div v-if="id === 'ftpPlugin'">
      <el-tab-pane label="FTP设置" name="ftpStorageInfo">
        <FTPStorageInfo :open="open" :id="id" @refreshNotification="refreshNotification">
        </FTPStorageInfo>
      </el-tab-pane>
    </div>
    <div v-else-if="id === 'ossPlugin'">
      <el-tab-pane label="OSS设置" name="ossStorageInfo">
        <OssStorageInfo :open="open" :id="id" @refreshNotification="refreshNotification">
        </OssStorageInfo>
      </el-tab-pane>
    </div>
    <div v-else-if="id === 'filePlugin'">
      <el-tab-pane label="本地文件存储设置" name="fileStorageInfo">
        <FileStorageInfo :open="open" :id="id" @refreshNotification="refreshNotification">
        </FileStorageInfo>
      </el-tab-pane>
    </div>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import FTPStorageInfo from './FTPStorageInfo';
import OssStorageInfo from './OssStorageInfo';
import FileStorageInfo from './FileStorageInfo';

export default {
  name: 'StoragePluginMgmtPopup',
  components: {
    BizPopupTabs,
    FTPStorageInfo,
    OssStorageInfo,
    FileStorageInfo
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openPopup: false,
      activeTabName: 'ftpStorageInfo'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    refreshNotification(e) {
      this.$emit('refreshNotification', e);
    }
  },
  watch: {
    id(val) {
      if (val === 'ftpPlugin') {
        this.activeTabName = 'ftpStorageInfo';
      } else if (val === 'ossPlugin') {
        this.activeTabName = 'ossStorageInfo';
      } else if (val === 'filePlugin') {
        this.activeTabName = 'fileStorageInfo';
      } else {
        this.activeTabName = 'ftpStorageInfo';
      }
    }
  }
};
</script>

<style lang="scss">
</style>
