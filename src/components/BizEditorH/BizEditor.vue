<template>
  <div class="biz-editor" :style="style">
    <div style="display:none;">
      <!-- 图片上传组件辅助-->
      <el-upload ref="imageUploader" multiple accept="image/*" :action="serverUrl" :show-file-list="false" name="file"
        :data="fileData0" :on-success="uploadSuccess"></el-upload>
      <!-- 视频上传组件辅助-->
      <el-upload ref="videoUploader" accept="video/*" :action="serverUrl" :show-file-list="false" name="file" :data="fileData3"
        :before-upload="beforeUpload" :on-progress="handleProgress" :on-success="uploadSuccess"></el-upload>
      <video ref="videoTool"></video>
    </div>
    <toolbar ref="toolbar" :toolbars="toolbars" @on-editor-execCommand="execCommand" :class="{'disabledStyle': disabled}">
    </toolbar>
    <!-- 上传视频进度条 -->
    <el-progress v-if="percentage !== 0" slot="header" :text-inside="true" :stroke-width="18" :percentage="percentage">
    </el-progress>
    <editor-body :canPaste="canPaste" :value="value" @input="onInput" :height="height" :width="width" :config="config"
      :disabled="disabled" @ready="init"></editor-body>
  </div>
</template>

<script>
import EditorBody from './EditorBody';
import Toolbar from './Toolbar';
let MP4Box = require('mp4box').MP4Box;

export default {
  name: 'biz-editor',
  components: { Toolbar, EditorBody },
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '360px'
    },
    hasImage: {
      type: Boolean,
      default() {
        return true;
      }
    },
    hasVideo: {
      type: Boolean,
      default() {
        return false;
      }
    },
    hasLink: {
      type: Boolean,
      default() {
        return false;
      }
    },
    canPaste: {
      type: Boolean,
      default() {
        return true;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      dataRatio: 0,
      fileData0: {
        type: '0'
      },
      fileData3: {
        type: '2'
      },
      // 上传url
      serverUrl: '/admin/file/uploads.jhtml',
      percentage: 0,
      editor: null,
      isImage: false,
      toolbarsData: [
        [
          {
            name: 'fontsize',
            title: '字号',
            type: 'toolinput',
            value: '16px'
          },
          {
            name: 'bold',
            title: '加粗',
            type: 'toolbtn',
            value: '',
            checked: false
          },
          {
            name: 'italic',
            title: '斜体',
            type: 'toolbtn',
            value: '',
            checked: false
          },
          {
            name: 'underline',
            title: '下划线',
            type: 'toolbtn',
            value: '',
            checked: false
          },
          {
            type: 'separator'
          },
          {
            name: 'forecolor',
            title: '字体颜色',
            type: 'toolcolorpicker',
            value: '#000000',
            visible: true
          },
          {
            name: 'backcolor',
            title: '背景色',
            type: 'toolcolorpicker',
            value: '#FFFFFF',
            visible: true
          }
        ],
        [
          {
            name: 'indent',
            title: '首行缩进',
            type: 'toolbtn',
            value: '',
            checked: false
          },
          {
            name: 'indentboth',
            title: '两端缩进',
            type: 'toolselect',
            label: '无',
            value: '0px'
          },
          {
            name: 'justify',
            title: '居左对齐',
            type: 'toolbtn',
            value: 'left',
            checked: false
          },
          {
            name: 'justify',
            title: '居中对齐',
            type: 'toolbtn',
            value: 'center',
            checked: false
          },
          {
            name: 'justify',
            title: '居右对齐',
            type: 'toolbtn',
            value: 'right',
            checked: false
          },
          {
            name: 'justify',
            title: '两端对齐',
            type: 'toolbtn',
            value: 'justify',
            checked: false
          },
          {
            name: 'lineheight',
            title: '行间距',
            type: 'toolselect',
            label: '1',
            value: 1
          }
        ]
      ]
    };
  },
  computed: {
    config() {
      let obj = {};
      obj.initialFrameHeight = parseInt(this.height);
      return obj;
    },
    style() {
      let style = {};

      if (this.width) {
        if (this.width.indexOf('%') !== -1) {
          style.width = this.width;
        } else {
          style.width = parseInt(this.width) + 2 + 'px';
        }
      }
      return style;
    },
    toolbars() {
      let toolbars = this.toolbarsData;
      if (this.hasImage) {
        toolbars[0].push({
          name: 'uploadimage',
          title: '图片',
          type: 'toolbtn',
          value: '',
          checked: false
        });
      }
      if (this.hasVideo) {
        toolbars[0].push({
          name: 'uploadvideo',
          title: '视频',
          type: 'toolbtn',
          value: '',
          checked: false
        });
      }
      if (this.hasLink) {
        toolbars[0].push({
          name: 'link',
          title: '超链接',
          type: 'toolbtn',
          value: '',
          checked: false
        });
      }
      return toolbars;
    }
  },
  watch: {},
  created() {},
  methods: {
    init(editor) {
      this.editor = editor;
      // bind 事件，处理光标在不同位置的当前态
      this.editor.addListener('selectionchange', this.onSelectionChange);
      this.onFocus();
    },
    // 激活需要
    onFocus() {
      this.editor.addListener(
        'focus',
        function() {
          console.log('focus');
          this.$refs.toolbar.clearVisible();
        }.bind(this)
      );
      this.editor.addListener(
        'blur',
        function() {
          console.log('blur');
          this.$refs.toolbar.clearVisible();
        }.bind(this)
      );
    },
    execCommand(name, value) {
      // 拦截上传事件
      if (name === 'uploadimage') {
        this.isImage = true;
        this.$refs.imageUploader.$refs['upload-inner'].$refs.input.click();
      } else if (name === 'uploadvideo') {
        this.isImage = false;
        this.$refs.videoUploader.$refs['upload-inner'].$refs.input.click();
      } else if (name === 'link') {
        this.$emit('openLink');
      } else {
        this.editor.execCommand(name, value);
      }
    },
    execCommandLink(url) {
      this.editor.execCommand('link', { href: url });
    },
    onInput(value) {
      this.$emit('input', value);
    },
    onSelectionChange() {
      for (let toolbarRow of this.toolbars) {
        for (const toolbar of toolbarRow) {
          let btnArray = ['bold', 'italic', 'underline', 'indent'];
          if (btnArray.indexOf(toolbar.name) !== -1) {
            let state = this.editor.queryCommandState(toolbar.name);
            // console.log(
            //   toolbar.name + '  state:' + state + ' ' + typeof state
            // );
            if (state === 1 || state === true) {
              toolbar.checked = true;
            } else {
              toolbar.checked = false;
            }
          }

          let justArray = ['justify'];
          if (justArray.indexOf(toolbar.name) !== -1) {
            let value = this.editor.queryCommandValue(toolbar.name);
            // console.log(
            //   toolbar.name + '  value:' + value + ' ' + typeof value
            // );
            toolbar.checked = false;
            if (toolbar.value === value) {
              toolbar.checked = true;
            }
          }

          let valueArray = ['forecolor', 'backcolor', 'lineheight', 'fontsize', 'indentboth'];
          if (valueArray.indexOf(toolbar.name) !== -1) {
            let value = this.editor.queryCommandValue(toolbar.name);
            // console.log(toolbar.name + '  value:' + value + ' ' + typeof value);
            toolbar.value = value;
          }
        }
      }
    },
    // 上传视频前
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 100) {
        this.$emit('video-oversize', {
          message: '视频文件过大，最大支持100M',
          type: 'warning'
        });
        return false;
      }

      if (file.type === 'video/ogg' || file.type === 'video/webm') {
        return true;
      } else if (file.type === 'video/mp4') {
        return new Promise((resolve, reject) => {
          let mseSupported = 'MediaSource' in window;
          let mp4Parsed = info => {
            let codecs = [];
            for (let t = 0; t < info.tracks.length; ++t) {
              codecs.push(info.tracks[t].codec);
            }
            if (mseSupported) {
              let codecStr = 'video/mp4; codecs="' + codecs.join(', ') + '"';
              if (!MediaSource.isTypeSupported(codecStr)) {
                this.$emit('video-wrong-format', {
                  message: '视频格式不支持,仅支持ogg、webm和部分mp4',
                  type: 'warning'
                });
              } else {
                resolve(true);
              }
            }
          };
          let getWidthReader = new FileReader();
          getWidthReader.readAsDataURL(file);
          getWidthReader.addEventListener('load', () => {
            let dataUrl = getWidthReader.result;
            this.$refs.videoTool.src = dataUrl;
            this.$refs.videoTool.addEventListener('loadedmetadata', () => {
              let dataRatio = this.$refs.videoTool.videoWidth / this.$refs.videoTool.videoHeight;
              this.dataRatio = dataRatio < 1.33 ? 1.33 : dataRatio;
            });
          });

          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.addEventListener('loadend', function() {
            let result = reader.result;
            result.fileStart = 0;
            let mp4Box = new MP4Box();
            mp4Box.onReady = mp4Parsed;
            mp4Box.appendBuffer(result);
          });
        });
      } else {
        this.$emit('video-wrong-format', {
          message: '视频格式不支持,仅支持ogg、webm和部分mp4',
          type: 'warning'
        });
        return false;
      }
    },
    // 上传进度
    handleProgress(event) {
      this.percentage = Number.parseInt(event.percent);
    },
    // 上传成功
    uploadSuccess(res, file) {
      if (this.isImage) {
        this.editor.execCommand('inserthtml', `<img src="${res.fis[0].url}" style="max-width: 100%;">`);
      } else {
        // 重置上传进度
        this.percentage = 0;
        this.imsertVideo(res);
      }
    },
    imsertVideo(res) {
      let videoCover = res.fis[0].url.substring(0, res.fis[0].url.lastIndexOf('.')) + '.jpg';
      // let inserthtml =
      //   `<p><iframe class="biz_video_iframe" data-cover="${videoCover}" style="width:100%;" src="${
      //     res.urls[0]
      //   }" frameborder=0 allowfullscreen="true" webkitallowfullscreen="true" onload="this.style.height=this.offsetWidth*` +
      //   1 / this.dataRatio +
      //   `+'px';"></iframe></p>`;

      let inserthtml = `<p style="display: none;">0</p></p><p><video poster="${videoCover}" style="width:100%;" controls ><source type="video/mp4" src="${res.fis[0].url}" ></video></p>`;
      this.editor.execCommand('inserthtml', inserthtml);
    }
  }
};
</script>

<style lang="scss">
.biz-editor {
  border: 1px solid #e7e7eb;
  line-height: 23px;
  position: relative;
  .disabledStyle {
    background-color: #f5f7fa;
  }
  .video_iframe {
    background-color: #000;
    margin: 0;
    position: static;
    video {
      width: 100%;
    }
  }
}
</style>
