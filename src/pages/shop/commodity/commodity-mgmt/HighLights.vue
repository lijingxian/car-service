<template>
  <biz-grid class="propetry-base-info">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="form" label-width="110px" size="small" :disabled="!isEdit">
      <div v-if="categoryName==='整车'" style="padding:0px 5px">
        <el-form-item>
          <span slot="label" v-popover:code3>
            口碑
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="code3" placement="left" width="300" trigger="hover">
              <div>口碑词汇将在商品详细页评价处显示，建议使用用户感受类的词汇。</div>
            </el-popover>
          </span>
          <el-tag v-for="tag in reputations" :key="tag" size="small" closable :disable-transitions="true"
            @close="handleClose(tag)" type="warning">{{tag}}</el-tag>
          <el-input class="input-new-tag" v-model="inputValue" ref="saveTagInput" size="small" style="width:180px"
            placeholder="请输入1-6字口碑词汇" v-if="inputVisible" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
        </el-form-item>
        <el-form-item>
          <span slot="label" v-popover:code4>
            营销标签
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="code4" placement="left" width="300" trigger="hover">
              <div>营销标签将在商品列表页展示，建议用商品参与的促销优惠等词汇。</div>
            </el-popover>
          </span>
          <div class="item-content">
            <div class="tag-list">
              <div class="tag-group">
                <el-tag v-for="(tag ,index) of tags" :key="index" closable size="mini" @close="removeMarketTag(tag.id)">
                  {{ tag.name }}</el-tag>
              </div>
              <div class="toggle-btn" @click="showMarketRecommend = !showMarketRecommend">
                <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showMarketRecommend }"></div>
                {{ toggleMarketRecommendTxt }}
              </div>
              <div class="recommend-group" v-show="showMarketRecommend">
                <el-tag v-for="tag of recommendMarketTags.slice(0,10)" :key="tag.id" type="info" size="mini"
                  @click="addRecommendMarketTag(tag)">{{ tag.name }}</el-tag>
                <el-tag v-show="recommendMarketTags&&recommendMarketTags.length > 10" type="info" size="mini"
                  @click="dialogVisibility=true" style="background-color: white;border:none;">
                  更多
                  <i class="el-icon-d-arrow-right"></i>
                </el-tag>
                <span v-show="recommendMarketTags&&!recommendMarketTags.length" style="color: #bbbbbb;">暂无推荐</span>
              </div>
            </div>
            <div class="add-tag">
              <el-input v-model="newMarketTagName" :maxlength="18" placeholder="请输入自定义标签"></el-input>
              <el-button @click="addRecommendMarketTagByButton" type="primary">添加</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品亮点">
          <el-button type="primary" size="mini" @click="addLigntPoiont">添加</el-button>
          <el-checkbox v-model="checked">同步至问答</el-checkbox>
        </el-form-item>
        <div>
          <el-table size="small" :data="lightPoints">
            <el-table-column label="亮点标签" prop="name"></el-table-column>
            <el-table-column label="资源" prop="shop.name">
              <template slot-scope="scope">
                <i class="biz-icon-i-web-wb iconfont" v-if="scope.row.text"></i>
                <i class="biz-icon-i-web-yp iconfont" v-if="scope.row.audio"></i>
                <i class="biz-icon-i-web-tp iconfont" v-if="scope.row.picture.length>0"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="bean">
              <template slot-scope="scope">
                <i class="el-icon-edit iconfont" @click.stop="editHandler(scope.row)"></i>
                <i class="el-icon-delete iconfont" @click.stop="deleteHandler(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :title="title" append-to-body custom-class="addLignt">
      <el-form label-width="140px" size="small" ref="formPass" :model="tag" :rules="rules">
        <el-form-item label="选择竞品" prop="name" v-if="isCompeting">
          <el-input placeholder="请选择车辆" v-model="name" @focus="selectCar" :disabled="isEditCompetitor"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="isCompeting?'关键词':'亮点标签'" prop="options" class="isRequired" v-show="!isEditCompetitor">
          <tag-manager v-model="options"></tag-manager>
        </el-form-item>-->
        <el-form-item :label="isCompeting?'关键词':'亮点标签'" prop="options" class="isRequired">
          <el-input v-model="tag.name"></el-input>
        </el-form-item>
        <el-form-item :label="isCompeting?'对比资源':'亮点资源'" prop="checkpass" class="isRequired">
          <el-checkbox-group v-model="checkedValue" @change="checkedValueChange">
            <el-checkbox label="音频"></el-checkbox>
            <biz-file-uploader :data="{type:2}" v-model="tag.audios" :fileList="fileList" v-show="checkedValue.includes('音频')">
            </biz-file-uploader>
            <!-- <el-checkbox label="视频"></el-checkbox>
            <biz-file-uploader :data="{type:2}" v-model="tag.videos" :fileList="form.fileList"
              v-show="checkedValue.includes('视频')">
            </biz-file-uploader>-->
            <el-checkbox label="文本"></el-checkbox>
            <el-input v-model="tag.text" v-show="checkedValue.includes('文本')"></el-input>
            <!-- <el-checkbox label="超链接"></el-checkbox>
            <el-input ptype="textarea" v-model="tag.link" :autosize="{ minRows: 4, maxRows: 6 }"
            v-show="checkedValue.includes('超链接')"></el-input>-->
            <el-checkbox label="图片"></el-checkbox>
            <img-uploader v-model="tag.picture" v-show="checkedValue.includes('图片')"></img-uploader>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="同步至问答" prop="options1" class="isRequired">
          <!-- <span v-popover:codePop>
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="codePop" placement="left" width="300" trigger="hover">
              <div>同步至机器人问答库，当用户提及该标签时机器人将自动答复商品亮点。</div>
            </el-popover>
          </span>-->
          <el-radio-group v-model="radioValue" size="mini">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmByDialog" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <store-vehicle-picker v-show="false" ref="vehiclePicker" @on-confirm="handleConfirm"></store-vehicle-picker>
    <el-dialog :visible="previewDialogOpen" append-to-body :open="previewDialogOpen" @close="previewDialogOpen=false">
      <iframe :src="'resources/admin/ecStatic/index.html?#/vshop/goods/'+id+'?shopId='+baseInfo.shopId" frameborder="0"
        scrolling="no" width="375px" height="567px"></iframe>
    </el-dialog>
    <marketing-tag-dialog :visibility.sync="dialogVisibility" :tags="tags" :recommendMarketTags="recommendMarketTags"
      @selected-tag="selectedTag"></marketing-tag-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
// import BaseInfoService from '@/service/commodity/commodity-mgmt/baseInfo';
import { BizFileUploader } from '@/components/BizForm';
import ImgUploader from '@/components/BizForm/BizAvatarUploaderMulti';
import { customerService } from '@/common/urls';
import StoreVehiclePicker from '@/pages/shop/commodity/commodity-mgmt/StoreVehiclePicker';
import http from '@/common/http';
import MarketingTagDialog from './components/MarketingTagDialog';
import urls from '@/common/urls';
export default {
  name: 'CommodityMgmtHighLights',
  data() {
    return {
      isCreated: false,
      dialogVisible: false,
      isCompeting: false,
      previewDialogOpen: false,
      dialogVisibility: false,
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
      reputations: [],
      // 营销标签
      tags: [],
      recommendMarketTags: [],
      showMarketRecommend: false,
      newMarketTagName: '',
      // 营销标签Id，用于上传
      recommendMarketTagId: '',
      inputVisible: false,
      inputValue: '',
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
      if (val === 'highLights') {
        if (this.id !== '') {
          this.tagList();
          this.getMarketTags();
          this.getCompetitorList();
        }
      }
    },
    open(val) {
      if (!val) {
        this.reputations = [];
        this.tags = [];
      }
    }
  },
  components: { BizSaveButton, BizGrid, BizFileUploader, ImgUploader, StoreVehiclePicker, MarketingTagDialog },
  created() {},
  computed: {
    toggleMarketRecommendTxt() {
      const { showMarketRecommend } = this;
      if (showMarketRecommend) {
        return '收起推荐';
      }
      return '展开推荐';
    }
  },
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
    // Tag
    handleClose(tag) {
      this.reputations.splice(this.reputations.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputValue.length > 6) {
        this.$message.warning('请输入1-6字口碑词汇');
        return false;
      }
      this.inputVisible = false;
      if (this.inputValue) {
        this.reputations.push(this.inputValue);
        this.inputValue = '';
      }
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
      this.getRecommendMarketTags();
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
    getRecommendMarketTags() {
      let params = {
        isIncludeParent: '1',
        isIncludeTag: '1',
        shopId: window.top.SHOP_ID || '',
        categoryType: '商品/商品营销'
      };
      http.get('/admin/tag/storeTagcategories.jhtml', params).then(data => {
        this.recommendMarketTags = data.content[0].tags || [];
        this.recommendMarketTagId = data.content[0].id;
      });
    },
    addRecommendMarketTag(tag) {
      if (!this.recommendMarketTagId) {
        this.$message.warning('请新建营销标签');
        return;
      }
      tag = tag.id ? tag : { name: this.newMarketTagName, id: 'temp' + Math.random().toString(36).substr(-10) };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    addRecommendMarketTagByButton(tag) {
      if (this.newMarketTagName === '') {
        this.$message.warning('请输入自定义标签');
        return;
      }
      tag = tag.id ? tag : { name: this.newMarketTagName, id: 'temp' + Math.random().toString(36).substr(-10) };
      for (const iterator of this.tags) {
        if (iterator.name === tag.name) {
          this.$message.warning('该标签已存在，请重新添加');
          return;
        }
      }
      this.tags.push(tag);
      this.newMarketTagName = '';
    },
    removeMarketTag(id) {
      let index = 0;
      for (; index < this.tags.length; index++) {
        const element = this.tags[index];
        if (element.id === id) {
          break;
        }
      }
      this.tags = this.tags.slice(0, index).concat(this.tags.slice(index + 1));
    },
    saveRecommendMarketTags() {
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      let promiseList = [];
      for (const tag of newTags) {
        let params = {
          name: tag.name,
          type: '0',
          description: '',
          hierarchy: '1',
          shopId: window.top.SHOP_ID || '',
          tagCategory: {
            id: this.recommendMarketTagId
          }
        };
        promiseList.push(http.post(urls.shopRate.TagGroupTags_tag, params));
      }
      return Promise.all(promiseList);
    },
    selectedTag(tags) {
      this.tags = tags;
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
    // refresh() {
    //   let params = {
    //     id: this.id
    //   };
    //   this.isCreated = true;
    //   BaseInfoService.queryProductDetail(
    //     params,
    //     data => {
    //       this.form.introduction = data.introduction;
    //       this.form.notice = data.notice;
    //       this.form.afterSale = data.afterSale;
    //       this.form.memo = data.memo;
    //       this.$nextTick(() => {
    //         this.isCreated = false;
    //       });
    //     },
    //     // result_code 不是100的处理
    //     ErrorData => {
    //       console.log(ErrorData);
    //     }
    //   );
    // },
    async saveMarketTags() {
      let resList = await this.saveRecommendMarketTags();
      let newTags = this.tags.filter(tag => {
        return tag.id.indexOf('temp') !== -1;
      });
      for (const tag of newTags) {
        for (const res of resList) {
          if (res.data.name === tag.name) {
            tag.id = res.data.id.toString();
          }
        }
      }

      let params = {
        id: this.id,
        reputations: this.reputations,
        tags: this.tags
      };
      http
        .put('/admin/shopProduct/productMarketingInfo.jhtml', params)
        .then(data => {
          this.getMarketTags();
          this.$message.success('更新成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMarketTags() {
      let params = {
        id: this.id
      };
      http
        .get('/admin/shopProduct/productMarketingInfo.jhtml', params)
        .then(data => {
          if (data.productMarketingInfoData) {
            this.tags = data.productMarketingInfoData.tags || [];
            this.reputations = data.productMarketingInfoData.reputations || [];
          } else {
            this.tags = [];
            this.reputations = [];
          }
          if (this.tags && this.tags.length > 0) {
            this.showMarketRecommend = false;
          } else {
            this.showMarketRecommend = true;
          }
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      if (this.checked) {
        this.createProblemLd();
      }
      this.saveMarketTags();
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
  }
  .h-editor {
    padding-left: 0px;
  }
  .y-editor {
    padding: 0px 10px 10px 0px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .item-content {
    display: flex;
    flex-direction: column;
    width: 210px;
    .el-tag + .el-tag {
      margin-left: 0;
    }
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      .tag-group {
        width: calc(100% - 85px);
        padding-right: 5px;
      }
      .toggle-btn {
        display: -webkit-box;
        align-items: flex-end;
        width: 65px;
        cursor: pointer;
        user-select: none;
        .rotate-180 {
          transform: rotate(180deg);
        }
      }
      .recommend-group {
        width: 100%;
        margin: 0 10px 10px 0;
        padding: 7px 12px;
        border: 1px solid #f4f2f2;
        border-radius: 4px;
        .el-tag {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .add-tag {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
      .el-input {
        margin-right: 10px;
      }
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
