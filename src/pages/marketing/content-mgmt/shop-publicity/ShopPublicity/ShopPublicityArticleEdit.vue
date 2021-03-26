<template>
  <biz-grid class="shop-publicity-article-edit" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    <div class="content_class" ref="content">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" :disabled="itemState === '1'"
        :inline-message="true">
        <el-form-item label="类型" prop="articleType" v-if="articleType === '0'|| articleType === '2'">
          <el-select v-model="form.articleType" placeholder="请选择类型">
            <el-option value="0" label="文章"></el-option>
            <el-option value="2" label="VR"></el-option>
            <el-option value="3" label="视频"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VR资源" prop="contentUrl" v-if="form.articleType === '2'" class="isRequired">
          <el-select v-model="form.contentUrl" placeholder="请选择VR资源">
            <el-option v-for="option in options" :key="option.id" :value="option.filePath" :label="option.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频资源" prop="contentUrl" v-if="form.articleType === '3'" class="isRequired">
          <video-upload :url="form.contentUrl" :open="open" @upload-video="uploadVideo" @setCover="setCover" :titleImage="form.titleImage"></video-upload>
          <div style="color: #606266;font-size: 12px;">当前仅支持mp4格式，大小200M以内</div>
        </el-form-item>
        <el-form-item label="视频简介" prop="content" v-if="form.articleType === '3'">
          <el-input placeholder="请输入视频简介" style="width:200px" v-model="form.content" maxlength="100" type="textarea"></el-input>
        </el-form-item>
        <div class="single-line">
          <el-form-item label="标题" prop="title">
            <el-input type="textarea" style="width:200px" placeholder="请输入标题" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="VR简介" prop="content" v-if="form.articleType === '2'">
            <el-input placeholder="请输入VR简介" style="width:200px" v-model="form.content" maxlength="100" type="textarea"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="资讯类别">
          <el-select v-model="form.type" @change="onTypeChange" class="shop-type">
            <el-option v-for="(item, index) in form.typeList" :label="item.name" :value="index.toString()" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" v-if="articleType !== '1'">
          <tag-select ref="tagSelect" :tagList="tagLists" :selectedTags="selectedTags" categoryType="资讯文章/内容分类"
            @addSuccess="onAddSuccess" class="tag-select-shop"></tag-select>
        </el-form-item>
        <!-- <el-form-item label="推广活动" v-if="articleType !== '1'&&form.articleType!=='2'">
          <div class="product-list el-upload-list el-upload-list--picture-card">
            <div tabindex="0" class="img-preview el-upload-list__item is-success" v-if="active.title" style="width:400px">
              <div class="detail_info">
                <span style="display:block;font-weight:bold">{{active.title}}</span>
                <span v-if="active.content">{{cutstr(deleteHtmlTag)}}</span>
              </div>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="active={}">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <img :src="active.cover" alt class="el-upload-list__item-thumbnail">
            </div>
            <div class="avatar-uploader" @click="addActive" v-if="!active.title">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </div>
        </el-form-item> -->
        <el-form-item label="推广商品" prop="productList" v-if="articleType === '1'">
          <div class="product-list el-upload-list el-upload-list--picture-card">
            <div tabindex="0" class="img-preview el-upload-list__item is-success" v-for="product in productList"
              :key="product.index">
              <img :src="product.image||defaultImg" alt class="el-upload-list__item-thumbnail">
              <span class="el-upload-list__item-actions">
                <!-- 删除 -->
                <span class="el-upload-list__item-delete" @click="handleRemove(product.id)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              <div class="detail_info">
                <span>{{product.fullName}}</span>
                <span>￥{{product.price}}元</span>
              </div>
            </div>
            <div class="avatar-uploader" @click="addProduct">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="editor-area" v-if="form.articleType === '0' || articleType === '1'">
        <biz-editor-template @templateSelect="templateSelect"></biz-editor-template>
        <!-- <biz-editor ref="editor" width="100%" height="622" :disabled="editorDisabled" v-model="form.content" :hasVideo="true"
          @video-oversize="checkVideo" @video-wrong-format="checkVideo" @openLink="addActive"></biz-editor> -->
        <biz-editor ref="editor" width="100%" height="622" :disabled="editorDisabled" v-model="form.content" :hasVideo="true"
          @video-oversize="checkVideo" @video-wrong-format="checkVideo" @openLink="addActive"
          :hasLink="articleType !== '1'&&form.articleType!=='2'"></biz-editor>
      </div>
    </div>
    <!-- 预览 -->
    <article-preview :previewDialog.sync="previewDialog" :form="form"></article-preview>
    <!-- 商品选择 -->
    <biz-dialog-selector :loading="dialogLoading" :visibility.sync="showDialog" :tableData="products" :pagination="pagination"
      :filters="productFilters" :selectionKeys="selectedItemKeys" @pageSizeChange="handleSizeChange"
      @currentPageChange="handleCurrentChange" @confirmed="confirm" @filterDataChange="filterDataChange">
      <el-table-column prop="shop.name" label="商品" min-width="220">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                  <img v-if="scope.row.image&&scope.row.image!==' '" :src="scope.row.image"/>
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="scope.row.name">{{scope.row.sn}}</div>
                    <div class="overflow">{{scope.row.name}}</div>
                    <div class="overflow">{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="剩余库存/库存总数" sortable="custom" width="150">
        <div slot-scope="scope">
          <div class="biz-customcol">
            {{ scope.row.availableStock }}/
            <span :style="{color: stateColor(scope.row)}">{{ scope.row.stock }}</span>
          </div>
        </div>
      </el-table-column>
    </biz-dialog-selector>
    <biz-dialog-selector title="链接" :visibility.sync="showActiveDialog" :appendToBody="true" :tableData="dialogActiveTableData"
      :pagination="dialogActivePagination" :selectionMode="'single'" :isClear="false" :filters="dialogActiveFilters"
      :showTable="showTable" @open="openedActive" @confirmed="handleActiveConfirmed"
      @filterDataChange="dialogActiveFilterDataChange" @pageSizeChange="dialogActivePageSizeChange"
      @currentPageChange="dialogActiveCurrentPageChange" class="activeDialog">
      <el-table-column label="名称" prop="">
        <div slot-scope="scope">
          <span v-if="dialogActiveFilters[0].value==='product'">{{scope.row.name}}</span>
          <span v-if="dialogActiveFilters[0].value!=='product'">{{scope.row.title}}</span>
        </div>
      </el-table-column>
      <el-table-column label="类型" prop=""
        v-if="dialogActiveFilters[0].value==='product'||dialogActiveFilters[0].value==='promotion'||dialogActiveFilters[0].value==='marketing'">
        <div slot-scope="scope">
          <span v-if="dialogActiveFilters[0].value==='product'">{{scope.row.categoryName}}</span>
          <span
            v-if="dialogActiveFilters[0].value==='promotion'||dialogActiveFilters[0].value==='marketing'">{{getType(scope.row)}}</span>
        </div>
      </el-table-column>
      <el-table-column label="店铺" prop="">
        <div slot-scope="scope">
          <span
            v-if="dialogActiveFilters[0].value==='product'||dialogActiveFilters[0].value==='shopPublicity'">{{scope.row.shop.name}}</span>
          <span v-if="dialogActiveFilters[0].value==='promotion'">{{scope.row.shopData.name}}</span>
          <span v-if="dialogActiveFilters[0].value==='marketing'">{{scope.row.shopname}}</span>
          <span v-if="dialogActiveFilters[0].value==='article'">{{scope.row.author}}</span>
        </div>
      </el-table-column>
      <el-table-column label="状态"
        :formatter="dialogActiveFilters[0].value==='marketing'||dialogActiveFilters[0].value==='promotion'?getStateStr:getState"
        :prop="dialogActiveFilters[0].value==='marketing'||dialogActiveFilters[0].value==='promotion'?'stateStr':'state'">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizEditor, BizEditorTemplate } from '@/components/BizEditorH';
import ArticlePreview from '../../components/ArticlePreview';
import BizDialogSelector from '@/components/BizDialogSelector';
import urls, { contentMgmt } from '@/common/urls';
import http from '@/common/http';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import TagSelect from '@/components/BizTagSelect';
import VideoUpload from '../../components/VideoUpload';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'ShopPublicityArticleEdit',
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    open: {
      type: Boolean,
      default() {
        return false;
      }
    },
    itemState: {
      type: String,
      default() {
        return '0';
      }
    },
    articleType: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      editorDisabled: false,
      showActiveDialog: false,
      openedActive: false,
      showTable: true,
      dialogActiveTableData: [],
      tagLists: [],
      active: {},
      selectedTags: [],
      // 获取图片url正则
      reg: new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/, 'i'),
      // dialog start
      dialogLoading: false,
      showDialog: false,
      defaultImg: DefaultImg,
      products: [],
      dialogActivePagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      productFilters: [
        {
          type: 'input',
          placeholder: '请输入编号/商品名',
          name: 'searchbar',
          value: ''
        }
      ],
      dialogActiveFilters: [
        {
          type: 'radio',
          label: '链接内容',
          name: 'type',
          value: 'product',
          options: [
            {
              label: '商品',
              value: 'product'
            },
            {
              label: '促销活动',
              value: 'promotion'
            },
            {
              label: '营销活动',
              value: 'marketing'
            },
            {
              label: '软文宣传',
              value: 'article'
            },
            {
              label: '商品推广',
              value: 'shopPublicity'
            },
            {
              label: '外部地址',
              value: ''
            }
          ]
        },
        {
          type: 'input',
          label: '商品',
          placeholder: '请输入商品名称',
          select: [],
          name: 'searchValue',
          value: '',
          class: 'show'
        },
        {
          type: 'inputValue',
          label: '外部地址',
          placeholder: '请输入外部地址',
          name: 'inputValue',
          value: '',
          class: 'hidden'
        }
      ],
      selectedItemKeys: [],
      // 推送设置
      tagName: [],
      tabName: 'first',
      // 预览
      previewDialog: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 100, message: '标题不要超过100字', trigger: 'blur' }
        ],
        seoTitle: [{ max: 100, message: '原始链接不要超过100字', trigger: 'blur' }],
        seoDescription: [
          { max: 120, message: '摘要最大不超过120字', trigger: 'blur' },
          { required: true, message: '请填写摘要', trigger: 'blur' }
        ],
        author: [{ max: 100, message: '作者不要超过100字', trigger: 'blur' }],
        productList: [{ required: true, message: '请选择商品', trigger: 'blur' }]
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false,
          auth: [this.articleType === '1' ? 'admin:articleProduct.edit' : 'admin:article.edit']
        },
        {
          label: '预览',
          name: 'preview',
          type: ''
        }
      ],
      loading: false,
      form: this.getOriginForm(),
      productList: [],
      options: [],
      tagList: ['行业动态', '讲堂', '杂谈'],
      // 预约项目是否显示
      // Editor Start
      isSetting: false,
      editorStyle: {
        height: '700px',
        width: '450px'
      }
      // Eidtor End
    };
  },
  methods: {
    ...mapMutations('ShopPublicity', ['updateArticleType']),
    ...mapGetters(['getUser']),
    onAddSuccess() {
      this.getStoreTags();
    },
    cutstr(str) {
      if (str.length > 50) {
        return str.substr(0, 50) + '...';
      } else {
        return str.substr(0, str.length);
      }
    },
    getType(row) {
      if (this.dialogActiveFilters[0].value === 'promotion') {
        switch (row.typeStr) {
          case '0':
            return '包邮';
          case '1':
            return '优惠券';
          case '2':
            return '促销';
          case '3':
            return '满减';
          case '4':
            return '折扣';
          case '5':
            return '满送';
          case '6':
            return '套餐';
          case '7':
            return '会员价';
          default:
            return '';
        }
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.typeStr) {
          case '0':
            return '抢红包';
          case '1':
            return '摇一摇';
          case '2':
            return '抽奖';
          case '3':
            return '拼团购';
          case '4':
            return 'N元抢购';
          case '5':
            return '限时秒杀';
          case '6':
            return '帮砍价';
          case '7':
            return '推荐有礼';
          case '8':
            return '分享有礼';
          case '9':
            return '活动招募';
          default:
            break;
        }
      }
    },
    getState(row) {
      if (this.dialogActiveFilters[0].value === 'product') {
        switch (row.state) {
          case '0':
            return '已创建';

          case '1':
            return '已提交';

          case '2':
            return '已上架';

          case '3':
            return '已下架';
          default:
            break;
        }
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        switch (row.state) {
          case '0':
            return '审核中';
          case '1':
            return '审核不通过';
          case '2':
            return '审核通过';
          case '3':
            return '已投放';
        }
      } else {
        switch (row.state) {
          case '0':
            return '已创建';
          case '1':
            return '已发布';
          // case '2':
          //   return '自动审核';
          case '3':
            return '审核通过';
          case '4':
            return '未审核';
        }
      }
    },
    getStateStr(row) {
      if (this.dialogActiveFilters[0].value === 'marketing') {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            if (row.typeStr === '9' && row.attendCount < row.maxPersonCount) {
              return '进行中';
            } else if (row.typeStr === '9' && row.attendCount === row.maxPersonCount) {
              return '已结束';
            } else {
              return '进行中';
            }
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      } else {
        switch (row.stateStr) {
          case '0':
            return '未开始';
          case '1':
            return '进行中';
          case '2':
            return '已结束';
          case '3':
            return '已创建';
          case '4':
            return '已提交';
          case '5':
            return '已取消';
          default:
            return '';
        }
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.stock > 5) {
        return '#333333';
      } else {
        return '#f56c6c';
      }
    },
    onTypeChange(value) {
      console.log(value);
      this.form.typeList.forEach((item, index) => {
        if (value === index.toString()) {
          this.curTagId = item.id;
          this.getStoreTags();
          return false;
        }
      });
    },
    getStoreTags() {
      let param = {
        tagCategoryId: this.curTagId,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTags, param)
        .then(data => {
          this.tagLists = data.content;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getStoreTagcategories() {
      let param = {
        categoryType: '资讯文章/内容分类',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTagcategories, param)
        .then(data => {
          this.form.typeList = data.content;
          if (this.itemId.id) {
            this.getTagMapping();
          } else {
            this.form.type = this.form.typeList.length ? '0' : '';
            if (this.form.type) {
              this.curTagId = this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].id : '';
              this.getStoreTags();
            }
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    tagMapping(category, id) {
      let curId;
      if (id) {
        curId = id;
      } else {
        curId = this.itemId.id;
      }
      let param = {
        refId: curId,
        type: '3',
        tags: this.$refs.tagSelect ? this.$refs.tagSelect.getCurSelectedTags() : '',
        category: category
      };
      http
        .post(urls.systemSetting.tagMapping, param)
        .then(data => {
          console.log('映射成功');
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    getTagMapping() {
      this.selectedTags = [];
      let param = {
        refId: this.itemId.id,
        type: '3'
      };
      http
        .get(urls.systemSetting.tagMapping, param)
        .then(data => {
          if (data.data.tags) {
            this.selectedTags = data.data.tags;
          }
          if (data.data.category) {
            this.form.typeList.forEach((item, index) => {
              if (item.name === data.data.category) {
                this.form.type = index.toString();
              }
            });
          } else {
            if (this.form.typeList.length) {
              this.form.type = '0';
            } else {
              this.form.type = '';
            }
          }
          this.curTagId = this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].id : '';
          this.getStoreTags();
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    operate(name) {
      this[name]();
    },
    handleLogoSuccess(url) {
      this.form.titleImage = url;
    },
    setCover(url) {
      this.form.titleImage = url;
    },
    getOriginForm() {
      return {
        typeList: [],
        type: '',
        title: '',
        author: '',
        content: '',
        titleImage: '',
        seoTitle: '',
        seoDescription: '',
        contentUrl: '',
        articleType: '0',
        contentUrlPreview: '',
        productList: [],
        tagList: ['行业动态', '讲堂', '杂谈'],
        state: ''
      };
    },
    // 返回
    back() {
      this.updateIfReturn(true);
      this.$router.go(-1);
    },
    getVrList() {
      let params = {
        shopId: this.getUser().shop.id || window.top.SHOP_ID || ''
      };
      http
        .get('/admin/vrMedia/getVrMedia.jhtml', params)
        .then(data => {
          this.options = data.data;
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
        });
    },
    // 点击'保存'按钮
    save() {
      if (!this.form.content && this.form.articleType === '0') {
        this.$message.warning({
          message: '请填写文章内容',
          showClose: true
        });
        return;
      }
      if (!this.form.contentUrl && this.form.articleType === '2') {
        this.$message.warning({
          message: '请选择Vr资源',
          showClose: true
        });
        return;
      }
      if (!this.form.contentUrl && this.form.articleType === '3') {
        this.$message.warning({
          message: '请上传视频资源',
          showClose: true
        });
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        } else {
          return false;
        }
      });
    },
    // 提交
    submit() {
      if (this.articleType !== '1') {
        this.updateArticleType(this.form.articleType);
      } else {
        this.updateArticleType('1');
        this.form.articleType = '1';
      }
      if (this.form.articleType === '2') {
        this.form.titleImage = this.options[0].cover;
      } else if (this.form.articleType === '0') {
        this.form.titleImage = this.reg.exec(this.form.content) ? this.reg.exec(this.form.content)[1] : '';
      }
      if (this.itemId.id) {
        this.update();
        this.tagMapping(this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].name : '', this.itemId.id);
      } else {
        this.create();
      }
    },
    // 创建
    create() {
      this.loading = true;
      let tagList = this.tagName.map(item => {
        return { name: item };
      });
      let params = {
        title: this.form.title,
        author: this.form.author,
        content: this.form.content,
        titleImage: this.form.titleImage,
        seoTitle: this.form.seoTitle,
        seoDescription: this.form.seoDescription,
        contentUrl: this.form.contentUrl,
        articleType: this.form.articleType,
        contentUrlPreview: this.form.contentUrlPreview,
        productList: this.form.productList,
        tagList: tagList
      };

      http
        .post(contentMgmt.publicity.editArticle.create, params)
        .then(data => {
          this.loading = false;
          this.tagMapping(this.form.typeList.length ? this.form.typeList[parseInt(this.form.type)].name : '', data.id);
          this.$emit('item-change', { id: data.id });
          this.$emit('operationSuccess');
          this.$message.success('创建成功');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning({
            message: ErrorData.errorMessage,
            showClose: true
          });
        });
    },
    // 更新
    update() {
      let tagList = this.tagName.map(item => {
        return { name: item };
      });
      let params = {
        title: this.form.title,
        author: this.form.author,
        content: this.form.content,
        titleImage: this.form.titleImage,
        seoTitle: this.form.seoTitle,
        seoDescription: this.form.seoDescription,
        contentUrl: this.form.contentUrl,
        articleType: this.form.articleType,
        contentUrlPreview: this.form.contentUrlPreview,
        productList: this.form.productList,
        id: this.itemId.id,
        tagList: tagList
      };
      http
        .put(contentMgmt.publicity.editArticle.update, params)
        .then(data => {
          this.loading = false;
          this.$message({
            message: '更新成功',
            type: 'success',
            showClose: true
          });
          this.$emit('created');
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning({
            message: ErrorData.errorMessage,
            showClose: true
          });
        });
    },
    // 重置表单
    clear() {
      if (this.$refs.form) this.$refs.form.resetFields();
      this.form = this.getOriginForm();
    },
    // 刷新
    refresh() {
      let params = {
        id: this.itemId.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(contentMgmt.publicity.editArticle.query, params)
        .then(data => {
          this.isSetting = true;
          this.loading = false;
          if (data.article.tagList && data.article.tagList.length > 0) {
            this.tagName = data.article.tagList.map(item => {
              return item.name;
            });
          }

          this.form = Object.assign(this.getOriginForm(), data.article);
          this.productList = this.form.productList.concat();
          this.selectedItemKeys = this.form.productList.map(product => {
            return product.id;
          });

          this.getStoreTagcategories();
          this.$emit('form-change', this.form);
          this.$nextTick(() => {
            this.isSetting = false;
          });
          this.operations[0].disabled = data.article.state !== '0';
          this.editorDisabled = data.article.state !== '0';
        })
        .catch(ErrorData => {
          this.loading = false;
        });
    },
    // 预览
    preview() {
      if (this.form.contentUrl && this.form.articleType === '2') {
        this.form.contentUrlPreview =
          'resources/admin/ecStatic/index.html?#/icar-channel/vr?url=' +
          this.form.contentUrl +
          '&id=' +
          this.form.id +
          '/index.html';
      }
      this.previewDialog = true;
    },
    queryLink() {
      let params = {
        searchValue: this.dialogActiveFilters[1].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogActivePagination.currentPage,
        pageSize: this.dialogActivePagination.pageSize
      };
      this.dialogLoading = true;
      let url = '/admin/product/union/list.jhtml';
      if (this.dialogActiveFilters[0].value === 'product') {
        this.dialogActiveFilters[1].placeholder = '请输入商品名称';
        url = '/admin/product/union/list.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'promotion') {
        this.dialogActiveFilters[1].placeholder = '请输入活动名称';
        url = '/admin/promotion/union/listPromotion.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        this.dialogActiveFilters[1].placeholder = '请输入活动名称';
        url = '/admin/marketing/union/listActivity.jhtml';
      } else if (this.dialogActiveFilters[0].value === 'article') {
        this.dialogActiveFilters[1].placeholder = '请输入文章名称';
        url = '/admin/article/articles.jhtml';
        this.$set(params, 'articleType', '0');
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        this.dialogActiveFilters[1].placeholder = '请输入标题';
        url = '/admin/recommend/list.jhtml';
        this.$set(params, 'position', '0');
        this.$set(params, 'type', 'product');
      }
      http
        .get(url, params)
        .then(data => {
          this.dialogLoading = false;
          if (this.dialogActiveFilters[0].value === 'shopPublicity') {
            this.dialogActiveTableData = data.recommendList;
          } else {
            this.dialogActiveTableData = data.content;
          }
          this.dialogActivePagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 查询商品列表
    queryProductList() {
      let params = {
        searchValue: this.productFilters[0].value,
        type: '0',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.dialogLoading = true;
      http
        .get(contentMgmt.publicity.editArticle.queryProductList, params)
        .then(data => {
          this.dialogLoading = false;
          this.products = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.dialogLoading = false;
          this.$message.warning(ErrorData.errorMessage || '操作错误');
        });
    },
    // 根据ID查询商品
    queryProductsByIds(ids) {
      http
        .post(contentMgmt.publicity.editArticle.findProduct, { ids: ids })
        .then(data => {
          this.productList = data.content;
        })
        .catch();
    },
    handleActiveConfirmed(key, row) {
      console.log(row);
      if (this.dialogActiveFilters[0].value === 'product') {
        this.$refs.editor.execCommandLink(
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/vshop/goods/' +
            row[0].id +
            '?shopId=' +
            row[0].shop.id
        );
      } else if (this.dialogActiveFilters[0].value === 'marketing') {
        let type = 'robRedPacket';
        if (row[0].type === '0') {
          type = 'robRedPacket';
        } else if (row[0].type === '1') {
          type = 'shake';
        } else if (row[0].type === '2') {
          type = 'turntable';
        } else if (row[0].type === '3') {
          type = 'ptg';
        } else if (row[0].type === '4') {
          type = 'nyqg';
        } else if (row[0].type === '5') {
          type = 'xsms';
        } else if (row[0].type === '6') {
          type = 'bkj';
        } else if (row[0].type === '7') {
          type = 'recommend';
        } else if (row[0].type === '9') {
          type = 'recruit';
        }
        this.$refs.editor.execCommandLink(
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/recent-activity/' +
            type +
            '/' +
            row[0].id +
            '?shopId=' +
            row[0].shopId
        );
      } else if (this.dialogActiveFilters[0].value === 'promotion') {
        this.$refs.editor.execCommandLink(
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/recent-promotion/' +
            row[0].id +
            '?shopId=' +
            row[0].shopData.id
        );
      } else if (this.dialogActiveFilters[0].value === 'article') {
        this.$refs.editor.execCommandLink(
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/icar-channel/article/' +
            row[0].id +
            '?shopId=' +
            row[0].shopId
        );
      } else if (this.dialogActiveFilters[0].value === 'shopPublicity') {
        this.$refs.editor.execCommandLink(
          document.location.protocol +
            '//' +
            window.location.host +
            '/resources/admin/ecStatic/index.html#/icar-channel/recommend/' +
            row[0].id +
            '?shopId=' +
            row[0].shop.id
        );
      } else {
        this.$refs.editor.execCommandLink(this.dialogActiveFilters[2].value);
      }
    },
    // dialog过滤器发生变动
    dialogActiveFilterDataChange(val) {
      // this.filters = val;
      this.dialogActivePagination.currentPage = 1;
      this.queryLink();
    },
    // 分页
    dialogActivePageSizeChange(val) {
      this.dialogActivePagination.pageSize = val;
      this.queryLink();
    },
    // 跳页
    dialogActiveCurrentPageChange(val) {
      this.dialogActivePagination.currentPage = val;
      this.queryLink();
    },
    // dialog过滤器发生变动
    filterDataChange(val) {
      // this.filters = val;
      this.pagination.currentPage = 1;
      this.queryProductList();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryProductList();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.queryProductList();
    },
    // dialog确认
    confirm(keys) {
      this.selectedItemKeys = keys || this.selectedItemKeys;
      this.form.productList = this.selectedItemKeys.map(key => {
        return { id: key };
      });
      this.queryProductsByIds(this.selectedItemKeys);
      this.$refs.form.clearValidate('productList');
    },
    // 添加活动
    addActive() {
      this.dialogActivePagination.currentPage = 1;
      this.openedActive = true;
      this.queryLink();
      this.showActiveDialog = true;
    },
    // 添加商品
    addProduct() {
      this.productFilters[0].value = '';
      this.pagination.currentPage = 1;
      this.queryProductList();
      this.showDialog = true;
    },
    // 删除商品列表
    handleRemove(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removePic(id);
      });
    },
    removePic(id) {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].id === id) {
          this.productList.splice(i, 1);
        }
        this.form.productList = this.productList.map(product => {
          return { id: product.id };
        });
        this.selectedItemKeys.forEach((element, index) => {
          if (element === id) {
            this.selectedItemKeys.splice(index, 1);
            return false;
          }
        });
      }
    },
    // 选中模板
    templateSelect(template) {
      // this.form.content += template;
      console.log(template);
      this.$refs.editor.execCommand('inserthtml', template);
    },
    checkVideo(msg) {
      this.$message(msg);
    },
    // 推送设置
    publishSetting() {
      if (this.itemState !== '1') {
        this.$message.warning('未发布时不可进行推送');
        return;
      }
      this.open = true;
    },
    showMessage(msg, type) {
      this.$message({
        message: msg,
        type: type,
        duration: 1000,
        showClose: true
      });
    },
    uploadVideo(url) {
      this.form.contentUrl = url;
    }
  },
  watch: {
    itemId(val, old) {
      this.clear();
      console.log(this.$refs.form);
      console.log(this.$refs.content);
      this.$refs.content.scrollTop = 0;
      if (val.id) {
        this.refresh();
        this.editorDisabled = true;
      } else {
        this.selectedTags = [];
        this.getStoreTagcategories();
        this.active = {};
        this.editorDisabled = false;
        this.operations[0].disabled = false;
        this.productList = [];
        this.selectedItemKeys = [];
      }
    },
    filters0(newValue, oldValue) {
      if (newValue) {
        this.showTable = true;
        this.dialogActiveFilters[2].value = '';
        this.dialogActiveFilters[2].class = 'hidden';
        this.dialogActiveFilters[1].class = 'show';
      } else {
        this.showTable = false;
        this.dialogActiveFilters[1].value = '';
        this.dialogActiveFilters[1].class = 'hidden';
        this.dialogActiveFilters[2].class = 'show';
      }
    },
    filters2(newValue, oldValue) {}
  },
  computed: {
    deleteHtmlTag() {
      return this.active.content.replace(/<[^>]+>|&[^>]+;/g, '').trim(); // 去掉所有的html标签和&nbsp;之类的特殊符合
    },
    filters0() {
      return this.dialogActiveFilters[0].value;
    },
    filters2() {
      return this.dialogActiveFilters[2].value;
    }
  },
  created() {
    this.getVrList();
    this.getStoreTagcategories();
  },
  mounted() {},
  components: {
    VideoUpload,
    BizGrid,
    BizSaveButton,
    BizEditor,
    BizEditorTemplate,
    BizDialogSelector,
    ArticlePreview,
    TagSelect
  }
};
</script>

<style lang="scss">
.activeDialog {
  width: 1200px;
  overflow: hidden;
  .biz-table-filter .filter-wrap {
    margin: 0px 0px 10px 0px !important;
  }
}
.shop-publicity-article-edit {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    width: 900px;
    min-height: 280px;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
    .el-select {
      margin-top: 18px;
    }
    .active-content {
      display: flex;
      border: 1px solid #c1c1c1;
      width: 400px;
      height: 80px;
      padding: 5px;
      cursor: pointer;
      justify-content: space-between;
      span {
        display: block;
        line-height: 20px;
      }
      .title {
        font-weight: bold;
        font-size: 14px;
      }
    }
    .el-form-item__content > :first-child {
      margin-top: 0;
    }
    .el-input--small {
      width: 215px;
    }
    .single-line {
      .el-input--small {
        width: 400px;
      }
    }
    .tag-select-shop,
    .shop-type {
      width: 400px;
    }
    .transition-box {
      margin-top: 10px;
    }
    .el-checkbox-group .el-checkbox {
      width: 165px;
      margin: 0;
      .el-checkbox__label {
        width: 140px;
        white-space: normal;
      }
    }
  }
  // 图片预览
  .el-upload-list.el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
  }
  .content_class {
    height: 100%;
    overflow: auto;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 300px;
    height: 100px;
    .detail_info {
      margin-left: 20px;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader {
    cursor: pointer;
    width: 100px;
    height: 100px;
    text-align: center;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
    .el-upload--text {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader-icon {
      line-height: 100px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .operate {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      opacity: 0;
      transition: all 0.3s;
      .el-icon-zoom-in,
      .el-icon-plus {
        margin: 0 5px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        .el-icon-zoom-in,
        .el-icon-plus {
          cursor: pointer;
        }
      }
    }
  }
  .editor-area {
    display: flex;
    width: 900px;
    height: 742px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    .edui-default .edui-editor {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .content-mgmt-biz-editor .quill-editor .ql-toolbar {
      border-top-left-radius: 0;
    }
    .content-mgmt-biz-editor .quill-editor .ql-container {
      border-bottom-left-radius: 0;
    }
  }
}
</style>
