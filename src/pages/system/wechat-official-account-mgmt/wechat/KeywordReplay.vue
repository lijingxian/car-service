<template>
  <biz-grid class="message-replay" v-loading="loading">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" :height="height" @row-click="rowClick"
      :pagination="pagination" @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      <el-table-column prop="name" label="规则名称">
      </el-table-column>
      <el-table-column prop="keyword" label="关键词">
      </el-table-column>
      <el-table-column prop="content" label="回复内容">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="deleteRow(scope.row.id)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="bottom">
      <el-card class="box-card" v-show="showForm" style="margin-top: 20px;">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="small">
          <el-form-item label="规则名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="关键词" v-for="(keyword,index) in form.keywordList" :key="index">
            <el-radio-group v-model="keyword.matchMode">
              <el-radio label="0">模糊</el-radio>
              <el-radio label="1">精准</el-radio>
            </el-radio-group>
            <div class="flex">
              <el-input v-model="keyword.content"></el-input>
              <div class="color">
                <i class="el-icon-circle-plus" @click="addKeyword" v-show="index===form.keywordList.length-1"></i>
                <i class="el-icon-remove" @click="removeKeyword(keyword)" v-show="form.keywordList.length>1"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="回复内容" v-for="reply in form.replyList" :key="reply.name">
            <el-radio-group v-model="reply.type">
              <el-radio label="0">文本</el-radio>
              <el-radio label="1">图片</el-radio>
              <el-radio label="2">语音</el-radio>
              <!-- <el-radio label="4">图文消息</el-radio> -->
              <!-- <el-radio label="3">视频</el-radio> -->
            </el-radio-group>
            <el-input v-model="reply.content" type="textarea" v-show="reply.type==='0'" :autosize="{ minRows: 4, maxRows: 10 }"
              maxlength="600"></el-input>
            <div v-if="reply.type==='0'" class="imageValidate" align="right">{{600-reply.content.length}}/600</div>
            <BizAvatarUploader v-model="reply.image" v-show="reply.type==='1'" :type="reply.type">
            </BizAvatarUploader>
            <div v-if="reply.type==='1'" class="validateText">大小不超过2M，支持PNG\JPEG\JPG\GIF格式</div>
            <BizAvatarUploader v-model="reply.voice" :fileType="'2'" :type="reply.type" v-show="reply.type==='2'">
            </BizAvatarUploader>
            <BizAvatarUploader v-model="reply.video" :fileType="'2'" :type="reply.type" v-show="reply.type==='3'">
            </BizAvatarUploader>
          </el-form-item>
          <el-form-item label="" v-for="reply in form.replyList" :key="reply.name" v-if="reply.type==='4'" label-width="80px">
            <div style="display:flex">
              <div class="head-content">
                <div class="head-div" @mouseover="contentHover(0)" v-if="reply.articles&&reply.articles[0]" @click="edit(reply.articles[0])">
                  <img :src="reply.articles[0].picUrl" width="350" height="180">
                  <span class="title">{{reply.articles[0].title}}</span>
                  <div class="operate" v-show="currentIndex===0">
                    <div>
                      <i class="el-icon-download" @click="moveDown(reply.articles,0)"></i>
                    </div>
                    <div>
                      <i class="el-icon-delete" @click="deleteArticles(reply,reply.articles[0])"></i>
                    </div>
                  </div>
                </div>
                <div v-for="(aticle,index) in reply.articles" :key="index" style="position:relative" @click="edit(aticle)">
                  <div v-if="index>0" style="display:flex" @mouseover="contentHover(index)">
                    <div class="content-title">{{aticle.title}}</div>
                    <div><img :src="aticle.picUrl" width="60" height="60" style="margin-top:5px"></div>
                  </div>
                  <div class="operate" v-if="index>0" v-show="index===currentIndex">
                    <div>
                      <i class="el-icon-upload2" style="padding-right:30px" @click="moveUp(reply.articles,index)"></i><i class="el-icon-download"
                        v-show="index!==reply.articles.length-1" @click="moveDown(reply.articles,index)"></i>
                    </div>
                    <div>
                      <i class="el-icon-delete" @click="deleteArticles(reply, aticle)"></i>
                    </div>
                  </div>
                </div>
                <div align="center" @mouseover="currentIndex=''">
                  <i class="el-icon-plus add" @click="addArticles(reply)"></i>
                </div>
              </div>
              <div v-show="isAdd">
                <el-form-item label="标题名称" label-width="80px">
                  <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="链接地址" label-width="80px">
                  <el-input v-model="article.url"></el-input>
                </el-form-item>
                <el-form-item label="封面" label-width="80px">
                  <BizAvatarUploaderNew v-model="article.picUrl" @uploadSuccess="uploadSuccess">
                  </BizAvatarUploaderNew>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <VueCropper :open="open" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
        <biz-save-button :operations="formOperations" @operate="operate" style="margin-right: 0;">
        </biz-save-button>
      </el-card>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { systemSetting } from '@/common/urls';
import http from '@/common/http';
import BizAvatarUploader from '../components/BizAvatarUploader';
import BizAvatarUploaderNew from '../components/BizAvatarUploaderNew';
import { BizFlexTable } from '@/components/BizTable';
import VueCropper from '../components/VueCropper';
export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: false,
      showForm: false,
      isAdd: false,
      open: false,
      currentIndex: '',
      picUrl: '',
      multipleSelection: [],
      tableData: [],
      fileList: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        }
      ],
      formOperations: [
        {
          label: '取消',
          name: 'cancelForm'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      height: '50%',
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
  components: { BizGrid, BizAvatarUploader, BizFlexTable, BizSaveButton, BizAvatarUploaderNew, VueCropper },
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
          this.refresh();
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
    addArticles(row) {
      this.article = this.getDefaultArticle();
      this.form.replyList[this.form.replyList.indexOf(row)].articles.push(this.article);
      this.isAdd = true;
    },
    edit(row) {
      this.article = row;
      this.isAdd = true;
    },
    deleteArticles(row, article) {
      this.form.replyList[this.form.replyList.indexOf(row)].articles.splice(this.form.replyList[this.form.replyList.indexOf(row)].articles.indexOf(article), 1);
      if (article.title === this.article.title) {
        this.article = this.getDefaultArticle();
      }
    },
    contentHover(index) {
      this.currentIndex = index;
    },
    getDefaultArticle() {
      return {
        title: '',
        description: '',
        picUrl: ''
      };
    },
    getDefaultData() {
      return {
        keywordList: [
          {
            matchMode: '0',
            content: ''
          }
        ],
        replyList: [
          {
            type: '0',
            content: '',
            id: '',
            ruleId: '',
            image: { path: '', name: '' },
            voice: { path: '', name: '' },
            video: { path: '', name: '' },
            articles: []
          }
        ],
        name: '',
        replyMode: '1',
        id: '',
        wechatOpenId: ''
      };
    },
    cancelForm() {
      this.showForm = false;
      this.form = this.getDefaultData();
    },
    add() {
      this.showForm = true;
      this.form = this.getDefaultData();
    },
    save() {
      if (this.form.id) {
        this.update();
      } else {
        this.create();
      }
    },
    create() {
      this.loading = true;
      this.form.wechatOpenId = this.id;
      http
        .post(systemSetting.keywordReply, this.form)
        .then(data => {
          this.loading = false;
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
          this.rowClick({ id: data.id });
          this.refresh();
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      http
        .put(systemSetting.keywordReply, this.form)
        .then(data => {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
          this.refresh();
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 批量操作-删除
    deleteList() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      this.delete(ids);
    },
    // 快捷操作-删除
    deleteRow(id) {
      let ids = [];
      ids.push(id);
      this.delete(ids);
    },
    // 后台删除
    delete(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          http
            .delete(systemSetting.keywordReply, params)
            .then(data => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.refresh();
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            });
        })
        .catch(() => {});
    },
    addKeyword() {
      this.form.keywordList.push({
        matchMode: '0',
        content: ''
      });
    },
    removeKeyword(row) {
      this.form.keywordList.splice(this.form.keywordList.indexOf(row), 1);
    },
    addReplay() {
      this.form.replyList.push({
        type: '0',
        content: '',
        image: { path: '', name: '' },
        voice: { path: '', name: '' },
        video: { path: '', name: '' }
      });
    },
    removeReplay(row) {
      this.form.replyList.splice(this.form.replyList.indexOf(row), 1);
    },
    rowClick(row) {
      let params = {
        id: row.id
      };
      http
        .get(systemSetting.keywordReply, params)
        .then(data => {
          console.log(this.getDefaultData());
          this.form = Object.assign(this.getDefaultData(), data.data);
          console.log(this.form);
          this.showForm = true;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    refresh() {
      let params = {
        wechatOpenId: this.id,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(systemSetting.keywordReplys, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
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
  }
  .validateText {
    position: absolute;
    bottom: -30px;
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }
  .flex {
    display: flex;
    .color {
      color: #ff7300;
      font-size: 24px;
      width: 60px;
      display: flex;
      justify-content: space-between;
      i {
        cursor: pointer;
      }
    }
  }
  .el-card__body {
    height: 320px;
    overflow: auto;
  }
  .biz-avatar-uploader {
    width: 100%;
    .name {
      width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
    .avatar {
      text-align: left;
    }
  }
}
</style>
