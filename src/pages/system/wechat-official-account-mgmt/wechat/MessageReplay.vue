<template>
  <biz-grid class="message-replay" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <el-form ref="form" :rules="rules" :model="form" size="small">
      <el-form-item label="类型" label-width="120px">
        <el-radio-group v-model="form.type">
          <el-radio label="0">文本</el-radio>
          <el-radio label="1">图片</el-radio>
          <el-radio label="2">语音</el-radio>
          <!-- <el-radio label="4">图文消息</el-radio> -->
          <!-- <el-radio label="3">视频</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回复" label-width="120px" v-if="form.type!=='4'">
        <el-input v-model="form.content" type="textarea" v-show="form.type==='0'" :autosize="{ minRows: 4, maxRows: 10 }"
          maxlength="600"></el-input>
        <div v-if="form.type==='0'" class="imageValidate" align="right">{{600-form.content.length}}/600</div>
        <BizAvatarUploader v-model="form.image" :type="form.type" v-show="form.type==='1'">
        </BizAvatarUploader>
        <div v-if="form.type==='1'" class="imageValidate">大小不超过2M，支持PNG\JPEG\JPG\GIF格式</div>
        <BizAvatarUploader v-model="form.voice" :type="form.type" :fileType="'2'" v-show="form.type==='2'">
        </BizAvatarUploader>
        <BizAvatarUploader v-model="form.video" :type="form.type" :fileType="'2'" v-show="form.type==='3'">
        </BizAvatarUploader>
      </el-form-item>
      <el-form-item label="" v-if="form.type==='4'" label-width="80px">
        <div style="display:flex">
          <div class="head-content">
            <div class="head-div" @mouseover="contentHover(0)" v-if="form.articles&&form.articles[0]"  @click="edit(form.articles[0])">
              <img :src="form.articles[0].picUrl" width="350" height="180">
              <span class="title" >{{form.articles[0].title}}</span>
              <div class="operate" v-show="currentIndex===0">
                <div>
                  <i class="el-icon-download" @click="moveDown(form.articles,0)"></i>
                </div>
                <div>
                  <i class="el-icon-delete" @click="deleteRow(form.articles[0])"></i>
                </div>
              </div>
            </div>
            <div v-for="(aticle,index) in form.articles" :key="index" style="position:relative" @click="edit(aticle)">
              <div v-if="index>0" style="display:flex" @mouseover="contentHover(index)">
                <div class="content-title">{{aticle.title}}</div>
                <div><img :src="aticle.picUrl" width="60" height="60" style="margin-top:5px"></div>
              </div>
              <div class="operate" v-if="index>0" v-show="index===currentIndex">
                <div>
                  <i class="el-icon-upload2" style="padding-right:30px" @click="moveUp(form.articles,index)"></i><i class="el-icon-download"
                    v-show="index!==form.articles.length-1" @click="moveDown(form.articles,index)"></i>
                </div>
                <div>
                  <i class="el-icon-delete" @click="deleteRow(aticle)"></i>
                </div>
              </div>
            </div>
            <div align="center" @mouseover="currentIndex=''">
              <i class="el-icon-plus add" @click="add"></i>
            </div>
          </div>
          <div v-show="isAdd">
            <el-form-item label="标题名称">
              <el-input v-model="article.title"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
              <el-input v-model="article.url"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <BizAvatarUploaderNew v-model="article.picUrl" @uploadSuccess="uploadSuccess">
              </BizAvatarUploaderNew>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <VueCropper :open="open" :picUrl="picUrl"  @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { systemSetting } from '@/common/urls';
import BizAvatarUploaderNew from '../components/BizAvatarUploaderNew';
import http from '@/common/http';
import BizAvatarUploader from '../components/BizAvatarUploader';
import VueCropper from '../components/VueCropper';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      isAdd: false,
      open: false,
      currentIndex: '',
      picUrl: '',
      list: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      article: this.getDefaultArticle(),
      form: this.getDefaultData(),
      shopList: [],
      wechatOpenList: [],
      rules: {
        showName: [{ required: true, message: '请输入微信公众号名称', trigger: 'blur' }],
        showId: [{ required: true, message: '请输入微信公众号ID', trigger: 'blur' }],
        wecharId: [{ required: true, message: '请输入微信原始ID', trigger: 'blur' }],
        appId: [{ required: true, message: '请输入微信AppID', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入微信AppSecret', trigger: 'blur' }],
        qrCodePath: [{ required: true, message: '请上传二维码', trigger: 'blur' }]
      }
    };
  },
  components: { BizSaveButton, BizGrid, BizAvatarUploaderNew, BizAvatarUploader, VueCropper },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(nVal, oVal) {
      this.$refs.form.clearValidate();
      if (nVal) {
        if (nVal !== oVal) {
          this.query();
        }
      } else {
        if (nVal !== oVal) {
          this.form = this.getDefaultData();
        }
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    operate(name) {
      this[name]();
    },
    close() {
      this.open = false;
    },
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.open = true;
    },
    handelSuccess(url) {
      this.article.picUrl = url;
    },
    add() {
      this.article = this.getDefaultArticle();
      this.form.articles.push(this.article);
      this.isAdd = true;
    },
    edit(row) {
      this.article = row;
      this.isAdd = true;
    },
    deleteRow(row) {
      this.form.articles.splice(this.form.articles.indexOf(row), 1);
      if (row.title === this.article.title) {
        this.article = this.getDefaultArticle();
      }
    },
    contentHover(index) {
      this.currentIndex = index;
    },
    getDefaultData() {
      return {
        wechatOpenId: '',
        type: '0',
        content: '',
        image: { path: '', name: '' },
        voice: { path: '', name: '' },
        video: { path: '', name: '' },
        articles: []
      };
    },
    getDefaultArticle() {
      return {
        title: '',
        description: '',
        picUrl: ''
      };
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    query() {
      let params = {
        wechatOpenId: this.id
      };
      http
        .get(systemSetting.messageReplay, params)
        .then(data => {
          this.form = Object.assign(this.getDefaultData(), data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      this.form.wechatOpenId = this.id;
      http
        .post(systemSetting.messageReplay, this.form)
        .then(data => {
          this.$message.success('更新成功');
          this.$emit('created');
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp(arr, index) {
      this.swapArray(arr, index, index - 1);
    },

    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown(arr, index) {
      this.swapArray(arr, index, index + 1);
    }
  }
};
</script>

<style lang="scss">
.message-replay {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .add {
    font-size: 22px;
    cursor: pointer;
  }
  .head-content {
    width: 350px;
    height: 100%;
    border: 1px solid #e1e1e1;
    margin-right: 30px;
    .head-div {
      height: 180px;
      position: relative;
    }
    .title {
      position: absolute;
      bottom: 0px;
      left: 2px;
      background: #000;
      opacity: 0.4;
      width: 100%;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
    .content-title {
      width: 300px;
      border-bottom: 1px solid #e1e1e1;
      padding: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .operate {
      background: #000;
      opacity: 0.5;
      display: flex;
      color: #fff;
      justify-content: space-around;
      width: 285px;
      position: absolute;
      top: 0px;
      i {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }

  .imageValidate {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }
  .biz-avatar-uploader {
    .name {
      width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
  }
}
</style>
