<template>
  <biz-grid class="propetry-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" label-width="70px" size="small" :disabled="!isEdit">
      <el-collapse v-model="activeTab">
        <el-collapse-item title="基本信息" name="baseInfo">
          <el-form-item label="商品介绍"></el-form-item>
          <div class="h-editor">
            <biz-editor height="400px" width="450px" v-model="form.introduction"></biz-editor>
          </div>
        </el-collapse-item>
        <el-collapse-item title="扩展信息" name="moreInfo">
          <el-form-item label="购买须知"></el-form-item>
          <div class="h-editor">
            <biz-editor height="400px" width="450px" v-model="form.notice"></biz-editor>
          </div>
          <el-form-item label="产品售后"></el-form-item>
            <div class="h-editor">
              <biz-editor height="400px" width="450px" v-model="form.afterSale"></biz-editor>
            </div>
          <el-form-item label="语音播报介绍" label-width="100px"></el-form-item>
            <div class="y-editor">
              <el-input v-model="form.memo" type="textarea" maxlength="200" :autosize="{ minRows: 5, maxRows: 8 }" width="418px">
              </el-input>
            </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <store-vehicle-picker v-show="false" ref="vehiclePicker" @on-confirm="handleConfirm"></store-vehicle-picker>
    <el-dialog :visible="previewDialogOpen" append-to-body :open="previewDialogOpen" @close="previewDialogOpen=false" width="420px">
      <iframe :src="'resources/admin/ecStatic/index.html?#/vshop/goods/'+id+'?shopId='+baseInfo.shopId" frameborder="0"
        scrolling="no" width="375px" height="567px"></iframe>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { BizEditor } from '@/components/BizEditorH';
import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
// import { BizFileUploader } from '@/components/BizForm';
// import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import { customerService } from '@/common/urls';
import StoreVehiclePicker from '@/pages/shop/commodity/commodity-mgmt/StoreVehiclePicker';
import http from '@/common/http';
export default {
  name: 'CommodityMgmtBaseInfo',
  data() {
    return {
      activeTab: ['baseInfo'],
      isCreated: false,
      dialogVisible: false,
      isCompeting: false,
      previewDialogOpen: false,
      checked: false,
      radioValue: '1',
      checkedValue: [],
      options: [],
      fileList: [],
      name: '', // 车型名称
      title: '添加商品亮点',
      isEditCompetitor: false,
      competingId: '', // 车型id
      editId: '',
      lightPoints: [],
      competitorList: [],
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, dialogRules, callback) => {
              if (this.name) {
                callback();
              } else {
                callback(new Error('请选择竞品'));
              }
            }
          }
        ],
        options: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, dialogRules, callback) => {
              if (this.tag.name) {
                callback();
              } else {
                if (this.isCompeting) {
                  callback(new Error('请输入关键词'));
                } else {
                  callback(new Error('请输入亮点标签'));
                }
              }
            }
          }
        ],
        checkpass: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, dialogRules, callback) => {
              if (this.checkedValue.length && this.checkedValue.length > 0) {
                callback();
              } else {
                if (this.isCompeting) {
                  callback(new Error('请选择对比资源'));
                } else {
                  callback(new Error('请选择亮点资源'));
                }
              }
            }
          }
        ]
      },
      resources: ['音频', '视频', '超链接', '文本', '图片'],
      operations: [
        {
          label: '保存',
          name: 'update',
          type: 'primary',
          auth: ['admin:product.edit']
        },
        {
          label: '预览',
          name: 'preview',
          type: 'primary',
          class: 'show'
        }
      ],
      tag: {
        id: '',
        productId: '',
        name: '',
        audio: '',
        video: '',
        audios: [],
        videos: [],
        text: '',
        link: '',
        picture: [],
        type: '0'
      },
      form: {
        introduction: '',
        notice: '',
        afterSale: '',
        memo: '',
        files: '',
        fileList: []
      }
    };
  },
  props: {
    id: {
      type: String
    },
    categoryName: {
      type: String
    },
    tabSelection: {
      type: String
    },
    baseInfo: {
      type: Object
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
    tabSelection(val) {
      if (val === 'detail') {
        if (this.id !== '') {
          this.refresh();
          this.tagList();
          this.getCompetitorList();
        }
      }
    },
    open(val) {
      if (!val) {
        // this.id = '';
        this.form.introduction = '';
        this.form.notice = '';
        this.form.afterSale = '';
        this.form.memo = '';
      }
    }
  },
  components: { BizSaveButton, BizGrid, BizEditor, StoreVehiclePicker },
  created() {},
  computed: {},
  methods: {
    checkVideo(msg) {
      this.$message.warning(msg);
    },
    preview() {
      this.previewDialogOpen = true;
    },
    checkedValueChange() {
      console.log('checkedValueChange');
      if (!this.checkedValue.includes('音频')) {
        this.$set(this.tag, 'audios', []);
      }
      if (!this.checkedValue.includes('文本')) {
        this.$set(this.tag, 'text', '');
      }
      if (!this.checkedValue.includes('图片')) {
        this.$set(this.tag, 'picture', []);
      }
    },
    defaultModel() {
      return {
        id: '',
        productId: '',
        name: '',
        audio: '',
        video: '',
        audios: [],
        videos: [],
        text: '',
        link: '',
        picture: [],
        type: '0'
      };
    },
    operate(name) {
      this[name]();
    },
    addLigntPoiont() {
      this.isEditCompetitor = false;
      this.title = '添加商品亮点';
      this.isCompeting = false;
      this.tag = this.defaultModel();
      this.options = [];
      this.fileList = [];
      this.checkedValue = [];
      this.dialogVisible = true;
    },
    onSubmit() {
      console.log('submit!');
    },
    selectCar() {
      console.log('showDialog true');
      // 点击车主输入框
      this.$refs.vehiclePicker.showDialog = true;
    },
    handleConfirm(key, value) {
      console.log('showDialog false');
      this.$refs.vehiclePicker.showDialog = false;
      this.name = value.seriesName + value.type;
      this.competingId = value.id;
      this.$refs.form.clearValidate();
    },
    editHandler(row) {
      this.isEditCompetitor = false;
      this.isCompeting = false;
      this.title = '编辑商品亮点';
      http
        .get('/admin/productLabel/productLabel.jhtml', { id: row.id })
        .then(data => {
          this.checkedValue = [];
          this.dialogVisible = true;
          this.tag = Object.assign(this.defaultModel(), data.data);
          this.options = [{ content: this.tag.name }];
          if (data.data.audio) {
            this.tag.audios = [data.data.audio];
            this.fileList = [{ name: data.data.audio, url: data.data.audio }];
          }
          if (data.data.video) {
            this.tag.videos = [data.data.video];
          }
          if (data.data.link) {
            this.checkedValue.push('超链接');
          }
          if (data.data.picture.length > 0) {
            this.checkedValue.push('图片');
          }
          if (data.data.text) {
            this.checkedValue.push('文本');
          }
          if (data.data.video) {
            this.checkedValue.push('视频');
          }
          if (data.data.audio) {
            this.checkedValue.push('音频');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteHandler(row) {
      http
        .delete('/admin/productLabel/productLabel.jhtml', { ids: [row.id] })
        .then(data => {
          this.$message.success('删除成功');
          this.tagList();
          this.getCompetitorList();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editCompetitor(row) {
      this.isEditCompetitor = true;
      this.isCompeting = true;
      this.title = '添加竞品关键词';
      http
        .get('/admin/productCompeting/productCompeting.jhtml', { id: row.id })
        .then(data => {
          this.dialogVisible = true;
          this.name = data.data.name;
          this.competingId = data.data.competingId;
          this.editId = data.data.id;
          this.tag = this.defaultModel();
          this.tag.productId = data.data.id;
          this.tag.type = '1';
          this.options = [];
          this.fileList = [];
          this.checkedValue = [];
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteCompetitor(row) {
      http
        .delete('/admin/productCompeting/productCompeting.jhtml', { ids: [row.id] })
        .then(data => {
          this.$message.success('删除成功');
          this.getCompetitorList();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirmByDialog() {
      console.log('confurm');
      if (this.tag.audios.length > 0) {
        this.tag.audio = this.tag.audios[0];
      } else {
        this.tag.audio = '';
      }
      if (this.tag.video.length > 0) {
        this.tag.video = this.tag.videos[0];
      } else {
        this.tag.video = '';
      }
      let that = this;
      if (!this.tag.productId) {
        this.tag.productId = this.id;
      }
      this.$refs.formPass.validate((valid, a) => {
        if (valid) {
          if (this.isEditCompetitor) {
            if (this.isCompeting) {
              this.updateCompetitor();
              this.createTag();
            }
          } else {
            if (this.isCompeting) {
              this.createCompetitor();
            } else {
              if (this.options.length > 0) {
                this.options.forEach(item => {
                  if (this.tag.id) {
                    this.updateTag(item.content);
                  } else {
                    setTimeout(() => {
                      that.createTag(item.content);
                    }, 500);
                  }
                });
              } else {
                if (this.tag.id) {
                  this.updateTag('');
                } else {
                  this.createTag('');
                }
              }
            }
          }
        }
      });
    },
    // 添加亮点
    createTag(name) {
      http
        .post('/admin/productLabel/productLabel.jhtml', this.tag)
        .then(data => {
          this.$message.success('保存成功');
          this.tagList();
          this.getCompetitorList();
          this.dialogVisible = false;
          if (this.radioValue === '1') {
            this.createProblem();
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 更新亮点
    updateTag(name) {
      http
        .put('/admin/productLabel/productLabel.jhtml', this.tag)
        .then(data => {
          this.$message.success('保存成功');
          this.tagList();
          this.getCompetitorList();
          if (this.radioValue === '1') {
            this.createProblem();
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getCompetitorList() {
      console.log(this.options);
      http
        .get('/admin/productCompeting/productCompetings.jhtml', { productId: this.id, pageNumber: 1, pageSize: 100 })
        .then(data => {
          this.competitorList = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addCompetitor() {
      this.isEditCompetitor = false;
      this.title = '添加商品竞品';
      this.isCompeting = true;
      this.tag = this.defaultModel();
      this.options = [];
      this.fileList = [];
      this.checkedValue = [];
      this.competingId = '';
      this.name = '';
      this.dialogVisible = true;
    },
    // 创建竞品
    createCompetitor() {
      let params = {
        productId: this.id,
        competingId: this.competingId,
        name: this.name,
        competingType: '1'
      };
      http
        .post('/admin/productCompeting/productCompeting.jhtml', params)
        .then(data => {
          this.tag.productId = data.id;
          this.tag.type = '1';
          let that = this;
          if (this.options.length > 0) {
            this.options.forEach(item => {
              setTimeout(() => {
                that.createTag(item.content);
              }, 500);
            });
          } else {
            this.createTag('');
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 更新竞品
    updateCompetitor() {
      let params = {
        productId: this.id,
        id: this.editId,
        competingId: this.competingId,
        name: this.name,
        competingType: '1'
      };
      http
        .put('/admin/productCompeting/productCompeting.jhtml', params)
        .then(data => {
          this.$message.success('保存成功');
          this.getCompetitorList();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    tagList() {
      console.log(this.options);
      http
        .get('/admin/productLabel/productLabels.jhtml', { id: this.id, type: '0' })
        .then(data => {
          this.lightPoints = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 创建问答
    createProblem() {
      let type = '1002';
      let answer = '';
      if (this.checkedValue.length === 1 && this.checkedValue.includes('音频')) {
        answer = this.tag.audios.join(',');
      } else if (this.checkedValue.length === 1 && this.checkedValue.includes('文本')) {
        type = '0';
        answer = this.tag.text + ',' + this.tag.picture.join(',');
      } else if (this.checkedValue.length === 1 && this.checkedValue.includes('图片')) {
        type = '3';
        answer = this.tag.picture.join(',');
      } else if (this.checkedValue.length > 1) {
        type = '1';
        answer =
          this.tag.text + '<img src=' + this.tag.picture.join(',') + '/>' + '<audio src=' + this.tag.audios.join(',') + '/>';
      }
      let params = {
        name: this.tag.name,
        matchMode: '0',
        question: '解释一下' + this.tag.name,
        similarQuestion: [
          '说说' + this.tag.name,
          '讲讲' + this.tag.name,
          '说一说' + this.tag.name,
          '聊聊' + this.tag.name,
          '谈谈' + this.tag.name,
          '说一下' + this.tag.name,
          '讲一下' + this.tag.name
        ],
        type: type,
        answer: answer
      };
      http
        .post(customerService.smartReception.knowledgeStock, params)
        .then(data => {
          console.log('添加成功');
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          if (ErrorData.errorMessage !== '问题已存在') {
            this.$message.warning(ErrorData.errorMessage);
          }
        });
    },
    // 创建亮点问答
    createProblemLd() {
      let type = '0';
      let temp = this.lightPoints.map(item => {
        return item.name;
      });
      let answer = temp.join(',');
      let params = {
        name: this.baseInfo.name,
        matchMode: '0',
        question: this.baseInfo.name.replace(/\s*/g, '') + '怎么样',
        similarQuestion: [this.baseInfo.name.replace(/\s*/g, '') + '有什么优势'],
        type: type,
        answer: answer
      };
      http
        .post(customerService.smartReception.knowledgeStock, params)
        .then(data => {
          console.log('添加成功');
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          if (ErrorData.errorMessage !== '问题已存在') {
            this.$message.warning(ErrorData.errorMessage);
          }
        });
    },
    refresh() {
      let params = {
        id: this.id
      };
      this.isCreated = true;
      BaseInfoService.queryProductDetail(
        params,
        data => {
          this.form.introduction = data.introduction;
          this.form.notice = data.notice;
          this.form.afterSale = data.afterSale;
          this.form.memo = data.memo;
          this.$nextTick(() => {
            this.isCreated = false;
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    update() {
      let params = {
        id: this.id,
        introduction: this.form.introduction,
        notice: this.form.notice,
        afterSale: this.form.afterSale,
        memo: this.form.memo
      };
      BaseInfoService.updateProductDetail(
        params,
        data => {
          this.$message.success('操作成功');
          if (this.checked) {
            this.createProblemLd();
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.warning(ErrorData.errorMessage);
          }
          console.log(ErrorData);
        }
      );
    }
  }
};
</script>

<style lang="scss">
.addLignt {
  .el-checkbox {
    width: 80%;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.propetry-base-info {
  .el-checkbox {
    float: right;
  }
  .iconfont {
    padding: 0px 10px;
    color: #ff7300;
  }
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
  .h-editor {
    padding-left: 0px;
  }
  .y-editor {
    padding: 0px 10px 10px 0px;
  }
}
</style>
