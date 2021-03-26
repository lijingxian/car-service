<template>
  <div class="ed-test">
    <button @click="openPopup = true">问问</button>
    <biz-editor v-model="msg2" :hasVideo="true"></biz-editor>
  </div>
</template>

<script>
import { BizEditor } from '@/components/BizEditorH';

export default {
  name: 'ed-test',
  components: { BizEditor },
  props: {},
  data() {
    return {
      openPopup: false,
      popupTabName: 'baseinfo',
      msg2: 'Vue + UEditor + v-model双向绑定1',
      myConfig: {
        toolbars: [],
        initialFrameWidth: null,
        UEDITOR_HOME_URL: './static/ueditorh/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 关闭自动保存
        enableAutoSave: false,
        wordCount: false,
        elementPathEnabled: false,
        scaleEnabled: false
      },
      toolbar: [
        [
          {
            name: 'bold',
            title: '加粗',
            type: 'toolbtn',
            status: 'checked'
          },
          {
            name: 'italic',
            title: '斜体',
            type: 'toolbtn',
            status: 'checked'
          },
          {
            name: 'underline',
            title: '下划线',
            type: 'toolbtn',
            status: ''
          }
        ]
      ]
      // toolbar: [
      //   [
      //     {
      //       name: 'fontsize',
      //       title: '字号',
      //       type: 'toolinput'
      //     },
      //     {
      //       name: 'bold',
      //       title: '加粗',
      //       type: 'toolbtn',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'italic',
      //       title: '斜体',
      //       type: 'toolbtn',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'underline',
      //       title: '下划线',
      //       type: 'toolbtn',
      //       status: ''
      //     },
      //     {
      //       name: 'forecolor',
      //       title: '字体颜色',
      //       type: 'toolcolorpicker'
      //     },
      //     {
      //       name: 'backcolor',
      //       title: '背景色',
      //       type: 'toolcolorpicker'
      //     },
      //     {
      //       name: 'simpleupload',
      //       title: '图片上传',
      //       type: 'toolbtn',
      //       status: ''
      //     },
      //     {
      //       name: 'insertvideo',
      //       title: '视频',
      //       type: 'toolbtn',
      //       status: ''
      //     }
      //   ],
      //   [
      //     {
      //       name: 'indent',
      //       title: '首行缩进',
      //       type: 'toolbtn',
      //       status: 'checked'
      //     },
      //     {
      //       type: 'separator'
      //     },
      //     {
      //       name: 'justify',
      //       title: '居左对齐',
      //       type: 'toolbtn',
      //       value: 'left',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'justify',
      //       title: '居中对齐',
      //       type: 'toolbtn',
      //       value: 'center',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'justify',
      //       title: '居右对齐',
      //       type: 'toolbtn',
      //       value: 'right',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'justify',
      //       title: '两端对齐',
      //       type: 'toolbtn',
      //       value: 'justify',
      //       status: 'checked'
      //     },
      //     {
      //       name: 'lineheight',
      //       title: '行间距',
      //       type: 'toolselect'
      //     }
      //   ]
      // ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss">
.ed-test {
  height: 100%;
  overflow-y: auto;
  padding: 30px;
  .vue-ueditor {
  }
}
</style>
