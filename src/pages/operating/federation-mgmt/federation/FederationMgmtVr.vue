<template>
  <div class="upload-vr-asset-h" v-loading="loading" element-loading-text="正在上传,请稍候" element-loading-spinner="el-icon-loading">
    <div class="row">
      <input type="file" class="hide-file" @change="uploadVr" ref="vr_file" id="vr_val" />
      <div id="qrcode"></div>
      <div class="handle-btn" v-if="hasAuthEdit">
        <el-button @click="save" type="primary" size="small">保存</el-button>
        <el-button @click="addVr" type="primary" size="small">添加</el-button>
        <el-button @click="playVr" :disabled="form.sourceType==='1'||!form.filePath" type="primary" size="small">预览</el-button>
        <el-button @click="deleteOperator" type="primary" size="small">删除</el-button>
        <el-button @click="uploadUrcode" type="primary" size="small">下载二维码</el-button>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small" v-loading="loading"
        :inline-message="true">
        <el-form-item label="VR资源" prop="filePath">
          <div slot="label" class="slot">
            VR资源
            <el-button type="text" size="small" v-popover:filePath>
              <i class="iconfont el-icon-question"></i>
            </el-button>
            <el-popover ref="filePath" placement="bottom-start" width="300" trigger="hover">
              您可录制VR展厅资料包并上传至平台，用户可足不出户，身临其境的了解您的店铺，VR资源包限制在200M以内。
            </el-popover>
          </div>
          <el-radio-group v-model="form.sourceType" @change="sourceTypeChange">
            <el-radio label="0">本地资源包</el-radio>
            <el-radio label="1">第三方资源地址</el-radio>
          </el-radio-group>
          <el-input v-model="form.filePath" type="textarea" :disabled="form.sourceType==='0'"
            :autosize="{ minRows: 5, maxRows: 8 }"></el-input>
        </el-form-item>
        <el-form-item label="VR名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入VR名称"></el-input>
        </el-form-item>
        <el-form-item label="VR封面" prop="cover">
          <BizAvatarUploaderNew v-model="form.cover" @uploadSuccess="uploadSuccess">
          </BizAvatarUploaderNew>
        </el-form-item>
      </el-form>
    </div>
    <iframe v-show="show_vr " :src="zip_upload_url+ '/index.html' " frameborder="0 " class="iframe "></iframe>
  </div>
</template>
<script>
import vrAsset from '@/service/federation-mgmt/federationMgmt';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { mapGetters } from 'vuex';
import axios from 'axios';
import QRCode from 'qrcodejs2';
export default {
  name: 'FederationMgmtVr',
  components: { BizAvatarUploaderNew },
  computed: {
    QRCode,
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:union.manage.edit');
    }
  },
  data() {
    return {
      isUploading: false,
      loading: false,
      vr_data: 0,
      dialog: false,
      vr_reader: new FileReader(),
      vr_title: 'VR资源管理(最大支持200M)',
      vr_file: [],
      zip_upload_url: '',
      shopId: '',
      sourceType: '',
      filePath: '',
      form: {
        filePath: '',
        name: '',
        cover: '',
        sourceType: '0'
      },
      title: '店铺Vr',
      show_vr: false,
      saveBtn: 'save-btn',
      rules: {
        filePath: [{ required: true, message: '请上传vr资源', trigger: 'blur' }],
        name: [{ required: true, message: '请输入Vr名称', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传封面', trigger: 'blur' }]
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
      this.type !== 'operator' && this.init();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.type !== 'operator' && this.init();
      this.show_vr = false;
      this.$refs.form.clearValidate();
    }
  },
  mounted() {},
  methods: {
    sourceTypeChange(val) {
      // if (val !== this.sourceType) {
      //   this.form.filePath = '';
      // } else {
      //   this.form.filePath = this.filePath;
      // }
    },
    init() {
      this.shopId = this.itemId || window.top.SHOP_ID;
      // get已有vr资源包
      vrAsset.getVrAsset.bind(this)(
        {
          shopId: this.shopId
        },
        res => {
          if (res && res.resultCode === '100') {
            if (res.data.length > 0) {
              this.form.name = res.data[0].name;
              if (this.form.name) {
                this.title = this.form.name;
              }
              if (res.data[0].filePath) {
                if (res.data[0].sourceType === '0') {
                  this.form.filePath =
                    document.location.protocol +
                    '//' +
                    window.location.host +
                    '/resources/admin/ecStatic/index.html#/icar-channel/vr?title=' +
                    this.title +
                    '&url=' +
                    res.data[0].filePath;
                  this.filePath =
                    document.location.protocol +
                    '//' +
                    window.location.host +
                    '/resources/admin/ecStatic/index.html#/icar-channel/vr?title=' +
                    this.title +
                    '&url=' +
                    res.data[0].filePath;
                } else {
                  this.form.filePath = res.data[0].filePath;
                  this.filePath = res.data[0].filePath;
                }
              }
              this.sourceType = res.data[0].sourceType;
              this.zip_upload_url = res.data[0].filePath;
              this.form.name = res.data[0].name;
              this.form.cover = res.data[0].cover;
              this.form.sourceType = res.data[0].sourceType;
              axios
                .get(this.zip_upload_url + '/index.html')
                .then(res => {
                  //                                    alert(res)
                  this.saveBtn = 'save-btn';
                })
                .catch(e => {
                  if (e.status === '404') {
                    this.saveBtn = 'useless-btn';
                  }
                });
            } else {
              this.form = {
                filePath: '',
                name: '',
                cover: '',
                sourceType: '0'
              };
              this.zip_upload_url = '';
            }
          }
        }
      );
    },
    uploadSuccess() {
      this.$refs.form.clearValidate('cover');
    },
    addVr() {
      document.getElementById('vr_val').click();
    },
    uploadUrcode() {
      if (this.zip_upload_url) {
        /* eslint-disable no-new */
        if (this.form.name) {
          this.title = this.form.name;
        }
        new QRCode(
          document.getElementById('qrcode'),
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/icar-channel/vr?title=' +
            this.title +
            '&url=' +
            this.zip_upload_url
          // document.location.protocol + '//' + window.location.host + this.zip_upload_url + '/index.html'
        );
        this.exportCanvasAsPNG('qrcode.png', document.getElementById('qrcode').children[0]);
      } else {
        this.$message({
          showClose: true,
          message: '请先上传资源',
          type: 'warning'
        });
      }
    },
    base64Img2Blob(code) {
      let parts = code.split(';base64,');
      let contentType = parts[0].split(':')[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement('a');
      let blob = this.base64Img2Blob(content); // new Blob([content]);
      let evt = document.createEvent('HTMLEvents');
      console.log(1);
      evt.initEvent('click', false, false); // initEvent 不加后两个参数在FF下会报错
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      document.execCommand('SaveAs');
      aLink.dispatchEvent(evt);
    },
    exportCanvasAsPNG(fileName, canvas) {
      let MIME_TYPE = 'image/png';
      let dlLink = document.createElement('a');
      dlLink.download = fileName;
      dlLink.href = canvas.toDataURL('image/png');
      dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.href].join(':');
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    },
    // 上传vr资源zip包
    uploadVr(e) {
      this.vr_file.push(e.target.files[0]);
      let vrFileSize = e.target.files[0].size;
      if (vrFileSize / 1024 / 1024 > 200) {
        this.$message({
          showClose: true,
          message: '请上传小于200M的文件',
          type: 'warning'
        });
        return;
      }

      let that = this;

      // 根据后缀判断资源类别
      let copyUlr = this.$refs.vr_file.value.toLowerCase();
      let suffix = copyUlr.slice(copyUlr.lastIndexOf('.'), copyUlr.length);
      if (suffix === '.zip') {
        this.vr_url = this.$refs.vr_file.value;
        this.loading = true;
        // 上传zip文件
        vrAsset.uploadShopZip.bind(that)(
          {
            shopId: this.shopId,
            file: that.vr_file[0]
          },
          res => {
            that.zip_upload_url = res.path;
            if (this.form.name) {
              this.title = this.form.name;
            }
            that.form.filePath =
              document.location.protocol +
              '//' +
              window.location.host +
              '/resources/admin/ecStatic/index.html#/icar-channel/vr?title=' +
              this.title +
              '&url=' +
              res.path;
            // document.location.protocol + '//' + window.location.host + res.path + '/index.html';
            this.zip_upload_url = res.path;
            this.loading = false;
            // 预览vr
            console.log(that.form.filePath);
            if (res.path) {
              this.$message({
                showClose: true,
                message: 'zip上传成功',
                type: 'success'
              });
              this.saveBtn = 'useless-btn';
            }
          }
        );
        that.vr_reader.onload = function(e) {
          that.vr_data = e.target.result;
          console.log(that.vr_data);
        };
      } else {
        this.$message({
          showClose: true,
          message: '请上传zip格式的文件',
          type: 'warning'
        });
      }
    },
    // vr 删
    delVr() {
      this.dialog = true;
    },
    deleteOperator() {
      this.zip_upload_url = '';
      this.form.filePath = '';
      this.show_vr = false;
    },
    save() {
      let params = {
        shopId: this.shopId,
        vrlist: []
      };
      params.vrlist.push({
        mediaType: 'vr',
        title: 'VR',
        filePath: this.form.sourceType === '0' ? this.zip_upload_url : this.form.filePath,
        name: this.form.name,
        cover: this.form.cover,
        sortSn: 1,
        fileName: 'vr',
        sourceType: this.form.sourceType
      });
      // if (this.zip_upload_url !== '') {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if ((this.form.sourceType === '0' && this.zip_upload_url !== '') || this.form.sourceType === '1') {
            vrAsset.uploadShopPictures.bind(this)(params, res => {
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              });
              this.urlList = [];
            });
          } else {
            this.$message({
              showClose: true,
              message: '请上传文件！',
              type: 'warning'
            });
          }
        }
      });
    },
    playVr() {
      if (this.saveBtn === 'useless-btn') {
        this.$message({
          showClose: true,
          message: '十分钟后可预览',
          type: 'warning'
        });
      } else {
        console.log(this.zip_upload_url);
        if (this.zip_upload_url !== '') {
          this.show_vr = !this.show_vr;
        } else {
          this.$message({
            showClose: true,
            message: '请先上传vr资源压缩包',
            type: 'warning'
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.upload-vr-asset-h {
  width: 100%;
  margin-top: 20px;
  .hide-file {
    display: none;
  }
  .slot {
    float: right;
    width: 70px;
    margin-top: -2px;
  }
  .iframe {
    width: 100%;
    min-height: 400px;
  }
  .row {
    display: flex;
    flex-direction: column;
    .mu-linear-progress-determinate {
      background-color: #ff8d00;
    }
    .handle-btn {
      margin: 10px;
      width: 100%;
      .title {
        margin-bottom: 5px;
      }
      .btn {
        margin: 0 5px;
        background-color: #ff8d00;
        .mu-raised-button-label {
          color: #fff;
        }
      }
      .del.btn {
        background-color: #da0000;
        opacity: 0.8;
      }
    }
    .title {
      width: 100%;
      font-size: 16px;
      color: #929292;
    }
    #qrcode {
      display: none !important;
    }
  }
}
</style>
