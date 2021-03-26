<template>
  <biz-popup-tabs :open="open" v-model="tabSelection" @close="close" :contentStyle="{ width: '940px' }" class="shop-public-pop">
    <el-tab-pane label="基本信息" name="0">
      <shop-publicity-article-edit :itemId="itemId" :itemState="itemState" :open="open" :articleType="articleType"
        @operationSuccess="operationSuccess" @form-change="handleFormChange" @item-change="handleItemChange">
      </shop-publicity-article-edit>
    </el-tab-pane>
    <el-tab-pane label="推送设置" name="1" v-if="itemId.id">
      <biz-publish-setting :showPushToOtherShop="true" :itemId="itemId" :article="form" :isEdit="hasAuthEdit"
        :articleType="articleType" :isDisabled="false"></biz-publish-setting>
    </el-tab-pane>
  </biz-popup-tabs>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';

import ShopPublicityArticleEdit from './ShopPublicityArticleEdit';
import BizPublishSetting from '@/components/BizPublishSetting';
import { mapGetters } from 'vuex';
export default {
  name: 'ShopPublicityPopup',
  components: {
    BizPopupTabs,
    ShopPublicityArticleEdit,
    BizPublishSetting
  },
  props: {
    open: {
      type: Boolean
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    itemState: {
      type: String,
      default() {
        return '0';
      }
    },
    articleType: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      tabSelection: '0',
      form: {}
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      if (this.articleType === '1') {
        return this.currentAuth.includes('admin:articleProduct.edit');
      } else {
        return this.currentAuth.includes('admin:article.edit');
      }
    }
  },
  methods: {
    close(e) {
      this.$emit('close', e);
    },
    operationSuccess(e) {
      this.$emit('operationSuccess', e);
    },
    handleFormChange(obj) {
      this.form = Object.assign({}, obj);
    },
    handleItemChange(item) {
      console.log('item=change', item);
      this.$emit('item-change', item);
    }
  },
  watch: {
    open(val) {
      if (open) {
        this.tabSelection = '0';
      }
    }
  }
};
</script>

<style lang="scss">
.shop-public-pop {
  .popup-content .el-tabs {
    width: 100%;
  }
}
</style>
