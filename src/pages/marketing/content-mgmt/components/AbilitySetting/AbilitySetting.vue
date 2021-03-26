<template>
  <biz-grid class="shop-ability-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operate">
    </biz-save-button>
    <div class="content_class">
      <el-form ref="form" :model="data" label-width="120px" size="small" v-loading="loading">
        <el-form-item label="平台文章赋能">
          <span slot="label" v-popover:code1>
            平台文章赋能
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <el-popover ref="code1" placement="left" width="300" trigger="hover">
              <div>开启后文章赋能后，您将接收到平台上其他店铺创作的文章</div>
            </el-popover>
          </span>
          <el-radio-group v-model="data.receiveArticleSwitchs" size="mini">
            <el-radio label="0">关闭</el-radio>
            <el-radio label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接收模式">
          <el-radio-group v-model="data.receiveArticleMode" size="mini">
            <el-radio label="0">自动接收</el-radio>
            <el-radio label="1">人工审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="过滤标签">
          <div>
            <el-checkbox class="setting-item" v-model="data.articleCategoryFilterSwitchs">资讯类别标签</el-checkbox>
            <div v-show="data.articleCategoryFilterSwitchs&&data.articleCategoryFilterSwitchs!=='0'">
              <tag-selector v-model="data.articleCategoryFilters" :options="categoryList" @input="onCategoryInput" class="ability-selector"></tag-selector>
            </div>
          </div>
          <div>
            <el-checkbox class="setting-item" v-model="data.articleContentFilterSwitchs">
              资讯内容标签
            </el-checkbox>
            <div v-show="data.articleContentFilterSwitchs&&data.articleCategoryFilterSwitchs!=='0'">
              <tag-select ref="tagSelect" :tagList="articleContentTagList" :selectedTags="data.articleContentFilters" @change="contentChange"
                :bAddTag="false" selectType="shopProfile" @showMore="showArticleContentHandle" class="tag-select-ability"></tag-select>
            </div>
          </div>
          <div>
            <el-checkbox class="setting-item" v-model="data.articleBrandFilterSwitchs">
              涉及品牌标签
            </el-checkbox>
            <div v-show="data.articleBrandFilterSwitchs&&data.articleBrandFilterSwitchs!=='0'">
              <tag-select ref="tagSelect" :tagList="articleBrandTagList" :selectedTags="data.articleBrandFilters" @change="brandChange"
                :bAddTag="false" selectType="shopProfile" @showMore="showArticleBrandHandle" class="tag-select-ability"></tag-select>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog title="内容标签过滤选择" :visible.sync="showArticleContent" append-to-body custom-class="ability-with-select">
        <el-input placeholder="请输入标签名称" v-model="brandTagName" size="small" class="search-input">
          <el-button slot="append" icon="el-icon-search" @click="onClickContent"></el-button>
        </el-input>
        <div class="tag-container">
          <div v-for="item in contentTaginfoList" :key="item.label">
            <span class="brand-label">{{item.label}}</span>
            <el-checkbox-group v-model="curSelectedContentTags" size="small">
              <el-checkbox-button v-for="(tag, index) in item.content" :label="tag.name" :key="index" class="tag-column">{{tag.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <div v-if="!contentTaginfoList.length" class="empty-tips">未查询到标签</div>
        </div>
        <div slot="footer" class="dialog-footer" v-if="contentTaginfoList.length">
          <el-button @click="showArticleContent = false" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmArticleContent" size="small">确认选择</el-button>
        </div>
      </el-dialog>
      <el-dialog title="品牌标签过滤选择" :visible.sync="showArticleBrand" append-to-body custom-class="ability-with-select">
        <el-input placeholder="请输入品牌名称" v-model="contentTagName" class="search-input" size="small">
          <el-button slot="append" icon="el-icon-search" @click="onClickBrand"></el-button>
        </el-input>
        <div class="tag-container">
          <div v-for="item in brandTagInfoList" :key="item.label">
            <span class="brand-label">{{item.label}}</span>
            <el-checkbox-group v-model="curSelectedBrandTags" size="small">
              <el-checkbox-button v-for="(tag, index) in item.content" :label="tag.name" :key="index" class="tag-column">{{tag.name}}</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <div v-if="!brandTagInfoList.length" class="empty-tips">未查询到标签</div>
        </div>
        <div slot="footer" class="dialog-footer" v-if="brandTagInfoList.length">
          <el-button @click="showArticleBrand = false" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmArticleBrand" size="small">确认选择</el-button>
        </div>
      </el-dialog>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { TagSelector } from '@/components/BizTagManager';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import TagSelect from '@/components/BizTagSelect';

export default {
  name: 'AbilitySetting',
  components: {
    BizGrid,
    BizSaveButton,
    TagSelector,
    TagSelect
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    }
  },
  data() {
    return {
      categoryIds: [],
      curSelectedContentTags: [],
      curSelectedBrandTags: [],
      curShowContentTags: [],
      curShowBrandTags: [],
      brandTagName: '',
      contentTagName: '',
      showArticleContent: false,
      showArticleBrand: false,
      articleContentTagList: [],
      articleBrandTagList: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      loading: false,
      data: this.getDefaultData(),
      categoryList: [],
      contentTagList: [],
      tagLimit: 10,
      contentTaginfoList: [],
      brandTagInfoList: []
    };
  },
  computed: {},
  watch: {
    itemId(val, old) {
      this.query();
    },
    'data.selectedIds': function(val, old) {
      this.$set(this.data, 'selectedTags', []);
    }
  },
  methods: {
    ...mapGetters(['getUser']),

    onCategoryInput(val) {
      this.categoryIds = this.getTagIdByName(val);
      this.getStoreTags();
    },
    showArticleContentHandle() {
      this.brandTagName = '';
      this.getStoreTags();
      this.showArticleContent = true;
    },
    showArticleBrandHandle() {
      this.contentTagName = '';
      this.getBrandTagList();
      this.showArticleBrand = true;
    },
    contentChange(val) {
      val.forEach(item => {
        if (!this.containsItem(this.curSelectedContentTags, item)) {
          this.curSelectedContentTags.push(item);
        }
        if (!this.containsItem(this.data.articleContentFilters, item)) {
          this.data.articleContentFilters.push(item);
        }
      });
    },
    curSelectedContentChange() {
      this.data.articleContentFilters = this.curSelectedContentTags;
    },
    curSelectedBrandChange() {
      this.data.articleBrandFilters = this.curSelectedBrandTags;
    },
    brandChange(val) {
      this.curSelectedBrandTags = val;
      this.data.articleBrandFilters = val;
    },
    confirmArticleContent() {
      this.showArticleContent = false;
      this.curSelectedContentChange();
    },
    containsItem(ary, item) {
      let contains = false;
      ary.forEach(element => {
        if (element === item) {
          contains = true;
          return false;
        }
      });
      return contains;
    },
    confirmArticleBrand() {
      this.showArticleBrand = false;
      this.curSelectedBrandChange();
    },
    handleAppend(tag) {
      this.data.selectedTags.push(tag);
    },
    operate(name) {
      this[name]();
    },
    getDefaultData() {
      return {
        receiveArticleMode: '0',
        receiveArticleSwitchs: '1',
        articleCategoryFilterSwitchs: false,
        articleContentFilterSwitchs: false,
        articleBrandFilterSwitchs: false,
        articleCategoryFilters: [],
        articleContentFilters: [],
        articleBrandFilters: []
      };
    },

    // 点击'保存'按钮
    save() {
      if (this.data.articleBrandFilters && this.data.articleBrandFilters.length === 0) {
        this.$message.warning('请选择涉及品牌标签');
        return false;
      }
      this.loading = true;
      // 默认都为 1
      // this.data.receiveArticleSwitchs = '1';
      this.data.shop = { id: this.getUser().shop.id };
      this.data.articleCategoryFilterSwitchs = this.data.articleCategoryFilterSwitchs ? '1' : '0';
      this.data.articleContentFilterSwitchs = this.data.articleContentFilterSwitchs ? '1' : '0';
      this.data.articleBrandFilterSwitchs = this.data.articleBrandFilterSwitchs ? '1' : '0';

      if (this.data.articleCategoryFilterSwitchs === '0') {
        this.data.articleCategoryFilters = [];
      }

      if (this.data.articleContentFilterSwitchs === '0') {
        this.data.articleContentFilters = [];
        this.curSelectedContentTags = [];
      }

      if (this.data.articleBrandFilterSwitchs === '0') {
        this.data.articleBrandFilters = [];
      }
      http
        .put(urls.shopRate.storeProfile, this.data)
        .then(data => {
          this.loading = false;
          this.$message.success('保存成功');
          this.$emit('operationSuccess');
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },

    // 查询店铺赋能信息
    query() {
      http
        .get(urls.shopRate.storeProfile, { shopId: this.getUser().shop.id || window.top.SHOP_ID || '' })
        .then(data => {
          this.data = Object.assign(this.getDefaultData(), data.data);
          this.data.articleCategoryFilterSwitchs = this.data.articleCategoryFilterSwitchs === '1';
          this.data.articleContentFilterSwitchs = this.data.articleContentFilterSwitchs === '1';
          this.data.articleBrandFilterSwitchs = this.data.articleBrandFilterSwitchs === '1';
          this.contentChange(this.data.articleContentFilters);
          this.brandChange(this.data.articleBrandFilters);
          this.categoryIds = this.getTagIdByName(this.data.articleCategoryFilters);
          this.getStoreTags();
        })
        .catch(errData => {
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        });
    },
    getTagIdByName(names) {
      let ary = [];
      this.categoryList.forEach(item => {
        names.forEach(element => {
          if (element === item.name) {
            ary.push(item.id);
          }
        });
      });
      return ary;
    },
    getStoreTagcategories() {
      let param = {
        categoryType: '资讯文章/内容分类',
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTagcategories, param)
        .then(data => {
          this.categoryList = data.content;
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    onClickContent() {
      this.getStoreTags();
    },
    onClickBrand() {
      this.getBrandTagList(this.contentTagName);
    },
    getBrandTagList(value = '') {
      let param = {
        categoryType: '商品/商品品牌',
        searchValue: value,
        shopId: this.getUser().shop.id || window.top.SHOP_ID || ''
      };
      http
        .get(urls.systemSetting.storeTags, param)
        .then(data => {
          this.brandTagInfoList = [];
          if (!value) {
            this.articleBrandTagList = data.content;
          }
          this.getTagList(data.content, this.brandTagInfoList);
          this.brandTagInfoList.sort(this.sortFun);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreTags() {
      let url;
      url =
        urls.systemSetting.storeTags + '?searchValue=' + this.brandTagName + '&shopId=' + this.getUser().shop.id ||
        window.top.SHOP_ID ||
        '';
      this.categoryIds.forEach(item => {
        url += '&categoryIds=' + item;
      });
      http
        .get(url)
        .then(data => {
          this.contentTaginfoList = [];
          this.getTagList(data.content, this.contentTaginfoList);
          if (!this.brandTagName) {
            this.articleContentTagList = data.content;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTagList(content, ary) {
      content.forEach(element => {
        let contains = false;
        ary.forEach(item => {
          if (item.label === element.tagCategory.name) {
            contains = true;
            return false;
          }
        });
        if (!contains) {
          ary.push({ label: element.tagCategory.name, content: [] });
        }
      });
      content.forEach((item, index) => {
        ary.forEach(element => {
          if (item.tagCategory.name === element.label && !this.containsItem(element.content, item)) {
            element.content.push(item);
            return false;
          }
        });
      });
    },
    sortFun(a, b) {
      let val1 = a.label;
      let val2 = b.label;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    },
    refresh() {
      this.query();
      this.getStoreTagcategories();
      this.getBrandTagList();
    }
  },
  created() {
    this.refresh();
  }
};
</script>

<style lang="scss">
.ability-with-select {
  .search-input {
    width: 40%;
    float: right;
    margin-bottom: 10px;
  }
  .el-dialog__header {
    text-align: center;
  }
  .tag-container {
    height: 400px;
    overflow: auto;
    margin-top: 10px;
    clear: both;

    .empty-tips {
      text-align: center;
      margin-top: 100px;
    }
    .brand-label {
      display: block;
      margin: 10px;
      font-size: 16px;
    }

    .tag-column {
      margin: 5px;
      border-radius: 0;
    }
    .el-checkbox-button__inner {
      border-left: 1px solid #dcdfe6;
      border-radius: 0;
      border-color: #dcdfe6;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner {
      border-color: #ff7300;
    }

    .tag-div {
      float: left;
      cursor: pointer;
      user-select: none;
    }
    .tag-style {
      margin: 0 5px 5px 0;
    }

    .isSelect {
      background-color: #ff7300;
      color: #ffffff;
    }
  }
}
.shop-ability-setting {
  .ability-selector {
    .el-tag {
      margin: 5px;
      // background-color: #ffffff;
      color: #606266;
      height: 32px;
      line-height: 32px;
    }
  }
  .biz-save-button {
    margin: 20px;
    justify-content: flex-start;
  }
}
</style>
