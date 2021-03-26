<template>
  <biz-grid class="fedration-mgmt-introduce">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <biz-editor ref="editor" height="622" width="100%" v-model="content" :hasVideo="true" @video-oversize="checkVideo"
      @video-wrong-format="checkVideo"></biz-editor>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor } from '@/components/BizEditorH';
import service from '@/service/federation-mgmt/federationMgmt';
export default {
  name: 'FederationMgmtIntroduce',
  components: { BizGrid, BizSaveButton, BizEditor },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:union.manage.edit']
        }
      ],
      isCreated: false,
      videoType: 'video',
      shopImg: '/resources/admin/images/default/default-shop.png',
      content: '',
      editorStyle: {
        height: '300px',
        width: '428px',
        marginLeft: '10px'
      }
    };
  },
  props: {
    itemId: {
      type: String
    },
    type: {
      type: String
    }
  },
  created() {
    if (this.itemId) {
      this.type !== 'operator' && this.queryIntroduce();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.type !== 'operator' && this.queryIntroduce();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    checkVideo(msg) {
      this.$message(msg);
    },
    queryIntroduce() {
      this.isCreated = true;
      service.queryIntroduce(
        {
          storeId: this.itemId
        },
        data => {
          if (data.introduce) {
            this.content = data.introduce;
          } else {
            this.content = `<img src="${this.shopImg}"><br><p>【企业简介】：</p><p>××成立于2004年3月，主营汽车销售、售后保养及维修服务。</p><p>【企业规模】：</p><p>公司员工76人，其中3/4具有十年以上行业经验。</p><p>【服务理念】：</p><p>公司秉承客户至上的服务理念，以“智能到店”、“透明车间”等特色服务，为客户打造无需等待的维保惬意时光。</p>`;
          }
          this.$nextTick(() => {
            this.isCreated = false;
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    },
    save() {
      service.updateIntroduce(
        {
          id: this.itemId,
          introduce: this.content
        },
        data => {
          this.$message.success('保存成功');
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          console.log('code错误');
        }
      );
    }
  }
};
</script>
<style lang="scss">
.fedration-mgmt-introduce {
  .biz-editor {
    padding-top: 20px;
    margin: 0 auto;
  }
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
