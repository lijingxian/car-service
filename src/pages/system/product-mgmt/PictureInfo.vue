<template>
  <biz-grid class="commodity-mgmt-picture-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" size="small" label-position="top" label-width="110px" :disabled="!isEdit">
      <el-form-item label="所有图片限制200K以下,建议尺寸3:2">
      </el-form-item>
      <el-form-item label="轮播主图管理">
        <ProductAvatarPictureCardUploader :imageList="carouselImages" :productId="id" :isMainPicture='true'
          @upload-success="handleCarouselUpload" @remove-success="handleCarouselRemove" :class="{disabled:uploadDisabled}">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
      <el-form-item label="VR资源管理">
        <el-radio-group v-model="sourceType" @change="sourceTypeChange">
          <el-radio label="0">本地资源包</el-radio>
          <el-radio label="1">第三方资源地址</el-radio>
        </el-radio-group>
        <ProductVrFileUploader :open="open" :fileList="vrFileList" :productId="id" :isTestDrive="false"
          @upload-success="handleVRUpload" @remove-success="handleVRRemove" v-show="sourceType==='0'"></ProductVrFileUploader>
        <el-input type="textarea" v-model="url" :autosize="{ minRows: 5, maxRows: 8 }" v-show="sourceType==='1'"></el-input>
        <!-- <div>
          <el-button v-show="!!url" size="small" type="primary" @click="preview=true" :disabled="preview">预览</el-button>
          <el-button v-show="!!url" size="small" type="primary" @click="preview=false" :disabled="!preview">取消预览</el-button>
        </div>
        <iframe class="vrframe" ref="vrFrame" v-show="!!preview" :src="url" frameborder="0"></iframe> -->
      </el-form-item>
      <el-form-item label="试驾视频 (请上传视频文件)">
        <ProductVrFileUploader :open="open" :fileList="testDriverList" :productId="id" :isTestDrive="true"
          @upload-success="handleTestDriveUpload" @remove-success="handleTestDriveRemove"></ProductVrFileUploader>
      </el-form-item>
      <el-form-item label="内饰图片管理">
        <ProductAvatarPictureCardUploader :imageList="interiorsImages" :productId="id" @upload-success="handleInteriorsUpload"
          @remove-success="handleInteriorsRemove">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
      <el-form-item label="空间图片管理">
        <ProductAvatarPictureCardUploader :imageList="spaceImages" :productId="id" @upload-success="handleSpaceUpload"
          @remove-success="handleSpaceRemove">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
      <el-form-item label="图解资源管理">
        <ProductAvatarPictureCardUploader :imageList="diagramImages" :productId="id" @upload-success="handleDiagramUpload"
          @remove-success="handleDiagramRemove">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
      <el-form-item label="车身图片管理">
        <el-col :span="11">
          <el-input v-model="fullScreenName"></el-input>
        </el-col>
        <el-col :span="11">
          <el-button type="primary" size="mini" @click.stop="addFullScreen">添加颜色</el-button>
        </el-col>
      </el-form-item>
      <el-form-item v-for="item in fullScreenList" :key="item.name">
        <el-tag :closable="!hasFullScreenImages(item)" :disable-transitions="false" type="info" size="warning"
          @close="handleCloseFullScreen(item)">
          {{item.name}}
        </el-tag>
        <ProductAvatarPictureCardUploader :imageList="item.fullScreenImages" :parentElementName="item.name"
          @upload-success="handleFullScreenUpload" @remove-success="handleFullScreenRemove">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
      <el-form-item label="360图片管理">
        <el-col :span="11">
          <el-input v-model="appearanceName"></el-input>
        </el-col>
        <el-col :span="11">
          <el-button type="primary" size="mini" @click.stop="addAppearance">添加颜色</el-button>
        </el-col>
      </el-form-item>
      <el-form-item v-for="item in appearanceList" :key="item.name">
        <el-tag :closable="!hasAppearanceImages(item)" :disable-transitions="false" type="info" size="warning"
          @close="handleClose(item)">
          {{item.name}}
        </el-tag>
        <ProductAvatarPictureCardUploader :imageList="item.appearanceImages" :parentElementName="item.name"
          @upload-success="handleAppearanceUpload" @remove-success="handleAppearanceRemove">
        </ProductAvatarPictureCardUploader>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import ProductVrFileUploader from './components/ProductVrFileUploader';
import ProductAvatarPictureCardUploader from './components/ProductAvatarPictureCardUploader';
import service from '@/service/commodity/commodity-mgmt/pictureInfo';

export default {
  name: 'CommodityMgmtPictureInfo',
  components: {
    BizSaveButton,
    BizGrid,
    ProductVrFileUploader,
    ProductAvatarPictureCardUploader
  },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      preview: false,
      appearanceName: '',
      fullScreenName: '',
      image: '',
      wideImage: '',
      VrMediaData: [],
      productImageDatas: [],
      sourceType: '0',
      defaultType: '',
      url: '',
      carouselImages: [],
      vrFileList: [],
      testDriverList: [],
      interiorsImages: [],
      spaceImages: [],
      diagramImages: [],
      fullScreenList: [],
      appearanceList: []
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.image = '';
        this.wideImage = '';
        this.VrMediaData = [];
        this.productImageDatas = [];

        this.carouselImages = [];
        this.interiorsImages = [];
        this.spaceImages = [];
        this.diagramImages = [];
        this.fullScreenList = [];
        this.appearanceList = [];
      }
    }
  },
  created() {},
  computed: {
    uploadDisabled() {
      if (this.productImageDatas.length >= 5) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    if (this.id) {
      this.query();
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    sourceTypeChange(val) {
      if (val !== this.defaultType) {
        if (val === '0') {
          this.vrFileList = [];
        } else {
          this.url = '';
        }
      }
    },
    addAppearance() {
      if (this.appearanceName) {
        let index = this.appearanceList.findIndex(item => item.name === this.appearanceName);

        if (index === -1) {
          let appearance = {
            name: this.appearanceName,
            appearanceImages: []
          };

          this.appearanceList.push(appearance);
        }

        this.appearanceName = '';
      }
    },
    addFullScreen() {
      if (this.fullScreenName) {
        let index = this.fullScreenList.findIndex(item => item.name === this.fullScreenName);

        if (index === -1) {
          let fullScreen = {
            name: this.fullScreenName,
            fullScreenImages: []
          };

          this.fullScreenList.push(fullScreen);
        }

        this.fullScreenName = '';
      }
    },
    updateCarouselImages() {
      let images = [];
      for (let i = 0; i < this.productImageDatas.length; i++) {
        images.push({
          name: this.productImageDatas[i].title,
          url: this.productImageDatas[i].source
        });
      }
      this.carouselImages = images;
    },
    updateVrData() {
      this.interiorsImages = [];
      this.spaceImages = [];
      this.diagramImages = [];
      this.fullScreenImages = [];
      this.appearanceList = [];
      this.fullScreenList = [];
      this.vrFileList = [];
      this.testDriverList = [];

      for (let i = 0; i < this.VrMediaData.length; i++) {
        let image = {
          url: this.VrMediaData[i].filePath,
          color: this.VrMediaData[i].color,
          mediaType: this.VrMediaData[i].mediaType
        };

        if (this.VrMediaData[i].mediaType === 'vr') {
          this.vrFileList.push({
            name: this.VrMediaData[i].filePath,
            url: this.VrMediaData[i].filePath
          });
        } else if (this.VrMediaData[i].mediaType === 'testdrive') {
          this.testDriverList.push({
            name: this.VrMediaData[i].filePath,
            url: this.VrMediaData[i].filePath
          });
        } else if (this.VrMediaData[i].mediaType === 'interiors') {
          this.interiorsImages.push(image);
        } else if (this.VrMediaData[i].mediaType === 'space') {
          this.spaceImages.push(image);
        } else if (this.VrMediaData[i].mediaType === 'diagram') {
          this.diagramImages.push(image);
        } else if (this.VrMediaData[i].mediaType === 'facade') {
          if (this.VrMediaData[i].color) {
            let index = this.fullScreenList.findIndex(item => item.name === this.VrMediaData[i].color);

            if (index === -1) {
              let fullScreen = {
                name: this.VrMediaData[i].color,
                fullScreenImages: []
              };
              fullScreen.fullScreenImages.push(image);
              this.fullScreenList.push(fullScreen);
            } else {
              this.fullScreenList[index].fullScreenImages.push(image);
            }
          }
        } else if (this.VrMediaData[i].mediaType === 'appearance') {
          if (this.VrMediaData[i].color) {
            let index = this.appearanceList.findIndex(item => item.name === this.VrMediaData[i].color);

            if (index === -1) {
              let appearance = {
                name: this.VrMediaData[i].color,
                appearanceImages: []
              };
              appearance.appearanceImages.push(image);
              this.appearanceList.push(appearance);
            } else {
              this.appearanceList[index].appearanceImages.push(image);
            }
          }
        }
      }
    },
    handleCarouselUpload(res, file) {
      if (res.resultCode === '100') {
        this.productImageDatas.push({
          large: res.map[0].large,
          medium: res.map[0].medium,
          order: '',
          source: res.map[0].source,
          thumbnail: res.map[0].thumbnail,
          title: file.name
        });
      }
    },
    handleCarouselRemove(file) {
      let index = this.productImageDatas.findIndex(item => item.source === file.url);

      if (index !== -1) {
        this.productImageDatas.splice(index, 1);
        return;
      }

      index = this.productImageDatas.findIndex(item => item.source === file.response.map[0].source);

      if (index !== -1) {
        this.productImageDatas.splice(index, 1);
      }
    },
    getImage(type) {
      return {
        color: '',
        fileName: this.getFileName(type),
        filePath: '',
        id: '',
        large: '',
        mediaType: type,
        medium: '',
        sortSn: '',
        thumbnail: '',
        sourceType: this.sourceType,
        title: this.getTitle(type),
        zipKey: ''
      };
    },
    getFileName(type) {
      if (type === 'interiors') {
        return 'inside';
      } else if (type === 'space') {
        return 'size';
      } else if (type === 'diagram') {
        return 'pictureInfo';
      } else if (type === 'appearance') {
        return 'car';
      } else if (type === 'facade') {
        return 'car';
      } else if (type === 'testdrive') {
        return 'drive';
      } else if (type === 'vr') {
        return 'vr';
      } else {
        return '';
      }
    },
    getTitle(type) {
      if (type === 'interiors') {
        return '内饰';
      } else if (type === 'space') {
        return '空间';
      } else if (type === 'diagram') {
        return '图解';
      } else if (type === 'appearance') {
        return '360';
      } else if (type === 'facade') {
        return '外观';
      } else if (type === 'testdrive') {
        return '试驾';
      } else if (type === 'vr') {
        return 'VR';
      } else {
        return '';
      }
    },
    handleVRUpload(res, file, fileList) {
      if (res.resultCode === '100') {
        let image = this.getImage('vr');
        image.filePath = res.path;
        this.AddVrData(image);

        let arr = [];
        arr.push({ name: res.path, url: res.path });
        this.vrFileList = arr;
      }
    },
    handleVRRemove(file, fileList) {
      // this.DelVrData(file);
      this.vrFileList = [];
      let index = this.VrMediaData.findIndex(item => item.mediaType === 'vr' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'vr' && item.filePath === file.response.map[0].source);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleTestDriveUpload(res, file, fileList) {
      if (res.resultCode === '100') {
        let image = this.getImage('testdrive');
        image.filePath = res.urls[0];
        this.AddVrData(image);

        // this.testDriverList = fileList.slice(-1);

        let arr = [];
        arr.push({ name: res.urls[0], url: res.urls[0] });
        this.testDriverList = arr;
      }
    },
    handleTestDriveRemove(file, fileList) {
      // this.DelVrData(file);
      this.testDriverList = [];

      let index = this.VrMediaData.findIndex(item => item.mediaType === 'testdrive' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'testdrive' && item.filePath === file.response.urls[0]);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleInteriorsUpload(res, file) {
      if (res.resultCode === '100') {
        let image = this.getImage('interiors');
        image.filePath = res.map[0].source;
        image.large = res.map[0].large;
        image.medium = res.map[0].medium;
        image.thumbnail = res.map[0].thumbnail;
        this.AddVrData(image);
      }
    },
    handleInteriorsRemove(file) {
      // this.DelVrData(file);

      let index = this.VrMediaData.findIndex(item => item.mediaType === 'interiors' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'interiors' && item.filePath === file.response.map[0].source);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleSpaceUpload(res, file) {
      if (res.resultCode === '100') {
        let image = this.getImage('space');
        image.filePath = res.map[0].source;
        image.large = res.map[0].large;
        image.medium = res.map[0].medium;
        image.thumbnail = res.map[0].thumbnail;
        this.AddVrData(image);
      }
    },
    handleSpaceRemove(file) {
      // this.DelVrData(file);
      let index = this.VrMediaData.findIndex(item => item.mediaType === 'space' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'space' && item.filePath === file.response.map[0].source);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleFullScreenUpload(res, file, name) {
      if (res.resultCode === '100') {
        let image = this.getImage('facade');
        image.color = name;
        image.filePath = res.map[0].large;
        image.large = res.map[0].large;
        image.medium = res.map[0].medium;
        image.thumbnail = res.map[0].thumbnail;
        image.fileName = res.map[0].fileName;
        image.source = res.map[0].source;
        this.AddVrData(image);
      }
    },
    handleFullScreenRemove(file) {
      // this.DelVrData(file);

      let index = this.VrMediaData.findIndex(item => item.mediaType === 'facade' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'facade' && item.filePath === file.response.map[0].large);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleDiagramUpload(res, file) {
      if (res.resultCode === '100') {
        let image = this.getImage('diagram');
        image.filePath = res.map[0].source;
        image.large = res.map[0].large;
        image.medium = res.map[0].medium;
        image.thumbnail = res.map[0].thumbnail;
        this.AddVrData(image);
      }
    },
    handleDiagramRemove(file) {
      // this.DelVrData(file);
      let index = this.VrMediaData.findIndex(item => item.mediaType === 'diagram' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'diagram' && item.filePath === file.response.map[0].source);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    handleAppearanceUpload(res, file, name) {
      if (res.resultCode === '100') {
        let image = this.getImage('appearance');
        image.color = name;
        image.filePath = res.map[0].large;
        image.large = res.map[0].large;
        image.medium = res.map[0].medium;
        image.thumbnail = res.map[0].thumbnail;
        image.fileName = res.map[0].fileName;
        image.source = res.map[0].source;
        this.AddVrData(image);
      }
    },
    handleAppearanceRemove(file) {
      // this.DelVrData(file);

      let index = this.VrMediaData.findIndex(item => item.mediaType === 'appearance' && item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
        return;
      }

      index = this.VrMediaData.findIndex(item => item.mediaType === 'appearance' && item.filePath === file.response.map[0].large);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    AddVrData(image) {
      if (image.mediaType === 'vr' || image.mediaType === 'testdrive') {
        let index = this.VrMediaData.findIndex(item => item.mediaType === image.mediaType);
        if (index !== -1) {
          this.VrMediaData[index] = image;
        } else {
          this.VrMediaData.push(image);
        }
      } else {
        this.VrMediaData.push(image);
      }
    },
    DelVrData(file) {
      let index = this.VrMediaData.findIndex(item => item.filePath === file.url);
      if (index !== -1) {
        this.VrMediaData.splice(index, 1);
      }
    },
    query() {
      let params = {
        id: this.id
      };
      service.getImageGroups_pm(
        params,
        data => {
          this.image = data.image;
          this.wideImage = data.wideImage;
          this.VrMediaData = data.VrMediaData;
          this.productImageDatas = data.productImageDatas;

          this.updateCarouselImages();
          this.updateVrData();
          this.VrMediaData.map(item => {
            if (item.mediaType === 'vr') {
              this.sourceType = item.sourceType;
              this.defaultType = item.sourceType;
              this.url = item.filePath;
            }
          });
          console.log('获取商品图片成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log('获取商品图片失败', this.id);
        }
      );
    },
    save() {
      let imgParams = {
        id: this.id,
        shopId: window.top.SHOP_ID || '',
        image: this.image,
        wideImage: this.wideImage,
        productImageDatas: this.productImageDatas
      };
      service.updateImageGroups_pm(
        imgParams,
        data => {
          this.saveVR(true);
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          this.saveVR(false);
          console.log('更新商品轮播主图失败', this.id);
        }
      );
    },
    saveVR(isProductImageSuccess) {
      if (this.sourceType === '1') {
        this.VrMediaData = [];
        this.VrMediaData.push({
          color: '',
          fileName: 'vr',
          filePath: this.url,
          id: '',
          large: '',
          mediaType: 'vr',
          medium: '',
          sortSn: '',
          thumbnail: '',
          sourceType: this.sourceType,
          title: 'vr',
          zipKey: ''
        });
      }
      let vrParams = {
        id: this.id,
        shopId: window.top.SHOP_ID || '',
        datas: this.VrMediaData
      };
      service.updateProductVrMediaBath_pm(
        vrParams,
        data => {
          // this.query();
          this.$message.success('更新商品图片成功');
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          if (isProductImageSuccess === true) {
            this.query();
          }
          console.log('更新商品VR资源失败', this.id);
        }
      );
    },
    handleClose(tag) {
      this.appearanceList = this.appearanceList.filter(item => item.name !== tag.name);
    },
    handleCloseFullScreen(tag) {
      this.fullScreenList = this.fullScreenList.filter(item => item.name !== tag.name);
    },
    hasFullScreenImages(tag) {
      let index = this.VrMediaData.findIndex(item => item.mediaType === 'fullScreen' && item.color === tag.name);

      return index !== -1;
    },
    hasAppearanceImages(tag) {
      let index = this.VrMediaData.findIndex(item => item.mediaType === 'appearance' && item.color === tag.name);

      return index !== -1;
    }
  }
};
</script>

<style lang="scss">
.commodity-mgmt-picture-info {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .disabled .el-upload--picture-card {
    display: none;
  }
  .el-form {
    margin-left: 10px;
  }
}
</style>
