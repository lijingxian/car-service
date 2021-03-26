<template>
  <div class="tag-test">
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
    >
      <el-form-item label="Tag Test">
        <tag-manager
          v-model="formModel.options"
          :removeHandler="removeHandler"
          @item-click="handleClick"
        ></tag-manager>
      </el-form-item>
      {{text}}
    </el-form>
  </div>
</template>

<script>
import { TagManager } from '@/components/BizTagManager';

export default {
  name: 'TagTest',
  components: {
    TagManager
  },
  data() {
    return {
      formModel: {
        options: [
          { content: 'test 1' },
          { content: 'test 2' },
          { content: 'test 3' }
        ]
      },
      text: ''
    };
  },
  props: {
  },
  created() {

  },
  methods: {
    removeHandler (tag) {
      return true;
    },
    handleClick (tag, e) {
      this.text = tag.content + ' is clicked';
    }
  }
};
</script>

<style lang="scss">
.tag-test {
  margin: 20px auto;
  width: 500px;
}
</style>
