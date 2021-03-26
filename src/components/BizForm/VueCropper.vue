<template>
  <el-dialog :visible.sync="dialogVisible" append-to-body title="剪裁封面" @close="close" width="850px">
    <div>
      <!-- <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;">选择图片</label>
      <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)"> -->
      <!-- <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="+" title="放大" @click="changeScale(1)">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="-" title="缩小" @click="changeScale(-1)">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↺" title="左旋转"
        @click="rotateLeft">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↻" title="右旋转"
        @click="rotateRight">
      <input type="button" class="oper" style="height:20px;width:23px;font-size:20px;margin:3px 5px;" value="↓" title="下载" @click="down('blob')"> -->
      <div class="cropper-content">
        <div class="cropper">
          <label>剪裁</label>
          <VueCropper v-if="showMode==='0'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
          <VueCropper v-if="showMode==='1'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber1" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
          <VueCropper v-if="showMode==='2'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber2" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
          <VueCropper v-if="showMode==='3'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber3" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
          <VueCropper v-if="showMode==='4'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber4" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
          <VueCropper v-if="showMode==='5'" ref="cropper" :img="picUrl" :outputSize="option.size" :outputType="option.outputType"
            :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox" :fixedBox="option.fixedBox" :fixedNumber="option.fixedNumber5" :fixed="option.fixed"
            @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
        </div>
        <div style="margin-left:20px;width:380px;height:260px">
          <label style="margin-right:10px">预览</label>
          <div class="show-preview">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">取 消</el-button>
      <el-button type="primary" @click="finish('blob')" size="mini">确 定</el-button>
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
      dialogVisible: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: false, // 上传图片是否可以移动
        original: false,
        canMoveBox: true, // 截图框能否拖动
        autoCrop: true,
        autoCropWidth: 230,
        autoCropHeight: 230,
        centerBox: true, // 截图框是否被限制在图片里面
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [2.35, 1], // 截图框的宽高比例
        fixedNumber1: [1, 1], // 截图框的宽高比例
        fixedNumber2: [16, 9], // 截图框的宽高比例
        fixedNumber3: [1, 1.52], // 截图框的宽高比例
        fixedNumber4: [1.78, 1], // 截图框的宽高比例
        fixedNumber5: [1.51, 1], // 截图框的宽高比例
        fixedBox: false // 固定截图框大小 不允许改变
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
    open: {
      type: Boolean,
      default: false
    },
    picUrl: {
      type: String,
      default: ''
    },
    showMode: {
      type: String,
      default: '1'
    }
  },
  watch: {
    open(nVal, oVal) {
      if (nVal) {
        this.dialogVisible = true;
      }
    }
  },
  methods: {
    // 放大/缩小
    changeScale(num) {
      console.log('changeScale');
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    close() {
      this.dialogVisible = false;
      this.$emit('close');
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
          let index = this.picUrl.lastIndexOf('/');
          let fileName = this.picUrl.substring(index + 1, this.picUrl.length);
          console.log(fileName);
          formData.append('file', data, fileName);
          formData.append('type', 0);
          formData.append('subType', 4);
          http
            .post('/admin/file/wechatResource.jhtml', formData)
            .then(data => {
              this.dialogVisible = false;
              this.$emit('handelSuccess', data.fis[0].url);
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
    .vue-cropper {
      margin-top: 10px;
    }
  }
  .show-preview {
    margin-top: 10px;
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
