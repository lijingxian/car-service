<template>
  <biz-popup-tabs :open="open" @close="close" v-model="tabSelection" >
    <el-tab-pane label="基本信息" name="BaseDataSetting">
      <base-data-setting :open="open" :itemId="itemId" @operationSuccess="operationSuccess" @createdBaseDataSuccess="createdBaseDataSuccess" :tabSelection="tabSelection">
      </base-data-setting>
    </el-tab-pane>
    <el-tab-pane label="详情" name="detail" v-if="itemId">
      <Detail :open="open" :id="baseInfo.productId" :isEdit="isEdit" :tabSelection="tabSelection" :categoryName="categoryName" :baseInfo="baseInfo" @operationSuccess="operationSuccess">
      </Detail>
    </el-tab-pane>
    <el-tab-pane label="图片" name="pictureInfo" v-if="itemId">
      <PictureInfo :open="open" :id="baseInfo.productId" :isEdit="isEdit" :baseInfo="baseInfo" :tabSelection="tabSelection" @operationSuccess="operationSuccess">
      </PictureInfo>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import BaseDataSetting from './BaseDataSetting';
import Detail from './Detail';
import PictureInfo from './PictureInfo';
export default {
  name: 'BaseDataMgmtPopup',
  components: {
    BizPopupTabs,
    Detail,
    PictureInfo,
    BaseDataSetting
  },
  props: {
    baseInfo: {
      type: Object,
      default() {
        return {
          shop: {
            name: ''
          }
        };
      }
    },
    open: {
      type: Boolean
    },
    categoryName: {
      type: String
    },
    isEdit: {
      type: Boolean
    },
    id: {
      type: String,
      default: ''
    },
    categoryType: {
      type: String,
      default: ''
    },
    itemId: {
      type: String
    },
    tabName: {
      type: String
    }
  },
  data() {
    return {
      tabSelection: 'BaseDataSetting'
    };
  },
  computed: {},
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    createdBaseDataSuccess(baseDataId) {
      this.$emit('createdBaseDataSuccess', baseDataId);
    }
  },
  watch: {
    itemId(Val) {
      console.log('BaseDataMgmtPopup::watch() Val:', Val);
    },
    open(val) {
      if (!val) {
        this.tabSelection = 'BaseDataSetting';
      }
    }
  }
};
</script>

<style lang="scss">

</style>
