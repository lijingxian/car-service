<template>
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <div>
      <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;">选择图片</label>
      <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)">
      <!-- <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="+" title="放大" @click="changeScale(1)">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="-" title="缩小" @click="changeScale(-1)">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↺" title="左旋转"
        @click="rotateLeft">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↻" title="右旋转"
        @click="rotateRight">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↓" title="下载" @click="down('blob')"> -->
      <div class="cropper-content">
        <div class="cropper">
          <label>剪裁封面</label>
          <VueCropper ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType" :info="true"
            :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
            :fixedBox="option.fixedBox" @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
        </div>
        <div style="margin-left:20px;">
          <label>预览封面</label>
          <el-radio></el-radio>
          <div class="show-preview">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
            <div>
              <span style="display:block">图文封面</span>
              <span>你的星标、长读用户将在订阅号消息列表里，看到此封面</span>
            </div>
          </div>
          <div class="show-preview">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
            <div>
              <span style="display:block">图文封面</span>
              <span>其他用户将在订阅号消息列表里看到此封面</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="finish('blob')" size="mini">>确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { VueCropper } from 'vue-cropper';
// import Api from '@/js/api.js' // 接口url配置文件
import http from '@/common/http';
export default {
  data() {
    return {
      headImg: '',
      // 剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: false
      },
      fileName: '', // 本机文件地址
      downImg: '#',
      imgFile: '',
      uploadImgRelaPath: '' // 上传后的图片的地址（不带服务器域名）
    };
  },
  components: {
    VueCropper
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    picUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 放大/缩小
    changeScale(num) {
      console.log('changeScale');
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      console.log('rotateLeft');
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      console.log('rotateRight');
      this.$refs.cropper.rotateRight();
    },
    // 上传图片（点击上传按钮）
    finish(type) {
      console.log('finish');
      // let _this = this;
      let formData = new FormData();
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          let img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
          formData.append('file', data, this.fileName);
          formData.append('type', 0);
          http
            .post('/admin/file/uploads.jhtml', formData)
            .then(data => {
              this.dialogVisible = false;
            })
            .catch(errData => {
              this.$message.warning(errData.errorMessage);
            })
            .finally(() => {
              this.loading = false;
            });
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      console.log('realTime');
      this.previews = data;
    },
    // 下载图片
    down(type) {
      console.log('down');
      let aLink = document.createElement('a');
      aLink.download = 'author-img';
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.downImg = window.URL.createObjectURL(data);
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data;
          aLink.href = data;
          aLink.click();
        });
      }
    },
    // 选择本地图片
    uploadImg(e, num) {
      console.log('uploadImg');
      let _this = this;
      // 上传图片
      let file = e.target.files[0];
      _this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false;
      }
      let reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          _this.option.img = data;
        } else if (num === 2) {
          _this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    imgLoad(msg) {
      console.log('imgLoad');
      console.log(msg);
    }
  }
};
</script>
<style lang="scss">
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
  .cropper {
    width: 260px;
    height: 260px;
  }
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    .preview {
      overflow: hidden;
      border: 1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.cropper-content .show-preview .preview {
  margin-left: 0;
}
</style>
