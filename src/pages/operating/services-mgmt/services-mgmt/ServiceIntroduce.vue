<template>
  <biz-grid class="service-introduce">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <div style="padding: 10px 0px;font-size:14px">服务介绍</div>
    <biz-editor ref="editor" v-model="content"></biz-editor>
  </biz-grid>
</template>
<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor } from '@/components/BizEditorH';
import http from '@/common/http';
export default {
  name: 'ServiceIntroduce',
  components: { BizGrid, BizSaveButton, BizEditor },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      isCreated: false,
      videoType: 'video',
      content: '',
      editorStyle: {
        height: '300px',
        width: '428px',
        marginLeft: '10px'
      }
    };
  },
  props: {
    id: {
      type: String
    },
    tabSelection: {
      type: String
    }
  },
  created() {},
  watch: {
    tabSelection(val) {
      if (val === 'three') {
        if (this.id !== '') {
          this.queryIntroduce();
        }
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    queryIntroduce() {
      this.isCreated = true;
      http
        .get('/admin/businessProduct/query/v201901.jhtml', {
          shopId: window.top.SHOP_ID || '',
          id: this.id
        })
        .then(data => {
          this.content = data.productData.businessService.description;
          this.$nextTick(() => {
            this.isCreated = false;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    save() {
      http
        .put('/admin/businessProduct/businessProductDescription/v201901.jhtml', {
          businessService: { description: this.content },
          id: this.id
        })
        .then(data => {
          this.$message.success('保存成功');
          this.$nextTick(() => {
            this.isCreated = false;
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    }
  }
};
</script>
<style lang="scss">
.service-introduce {
  .biz-save-button {
    justify-content: flex-start;
  }
  .vue-ueditor {
    padding-top: 20px;
    margin: 0 auto;
  }
}
</style>
