<template>
  <div class="biz-tag-select">
    <div class="tag-content">
      <div class="tag-show-eara">
        <el-tag v-for="(tag,index) in curSelectedTags" :key="index" closable @close="onClose(tag, index)" class="sel-tag">
          {{tag.name?tag.name:tag}}
        </el-tag>
      </div>
      <div class="select-area">
        <div class="search-container">
          <el-input v-if="bAddTag" placeholder="请输入关键词，按回车添加新标签" v-model="tagName" @keyup.enter.native="handleInputConfirm">
          </el-input>
        </div>
        <div class="tag-container" v-if="tagList.length">
          <el-checkbox-group v-model="curSelectedTags" size="small" @change="onChange">
            <el-checkbox-button v-for="(tag, index) in curShowTags" :label="tag.name" :key="index" class="tag-column">{{tag.name}}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-button small @click="onMore" type="primary" v-show="showMore" class="more-btn">更多...</el-button>
        </div>
        <div v-else class="empty">暂无标签数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'biz-tag-select',
  data() {
    return {
      curSelectedTags: [],
      tagName: '',
      tagCatrgoryId: '',
      showMore: false,
      curShowTags: []
    };
  },
  props: {
    tagList: {
      type: Array
    },
    selectedTags: {
      type: Array
    },
    bAddTag: {
      type: Boolean,
      default: true
    },
    selectType: {
      type: String
    },
    categoryType: {
      type: String,
      default() {
        return '';
      }
    }
  },
  components: {},
  computed: {},
  watch: {
    selectedTags(newValue) {
      this.curSelectedTags = newValue.map(item => {
        return item.name ? item.name : item;
      });
    },
    tagList(newValue) {
      if (newValue && newValue.length) {
        this.curShowTags.splice(0, this.curShowTags.length);
        this.tagCatrgoryId = newValue[0].tagCategory.id;
        this.showMore = newValue.length > 6;
        newValue.forEach((item, index) => {
          if (index < 6) {
            this.curShowTags.push(item);
          }
        });
      }
    }
  },
  methods: {
    getCurSelectedTags(id) {
      let ary;
      let obj;
      // if (id) {
      //   ary = [];
      //   this.curSelectedTags.forEach(element => {
      //     this.tagList.forEach(item => {
      //       if (item.name === element) {
      //         obj = {};
      //         obj.id = item.id;
      //         obj.name = item.name;
      //         ary.push(obj);
      //       }
      //     });
      //   });
      // } else {
      //   ary = this.curSelectedTags;
      // }
      ary = [];
      this.curSelectedTags.forEach(element => {
        this.tagList.forEach(item => {
          if (item.name === element) {
            obj = {};
            obj.id = item.id;
            obj.name = item.name;
            ary.push(obj);
          }
        });
      });
      return ary;
    },
    onChange(value) {
      // 修改27984问题
      if (this.selectType === 'order' && this.curSelectedTags.length > 1) {
        this.curSelectedTags.pop();
        this.$message.warning('您已选择标签，如需要变更请先删除之前的选择');
      }
      this.$emit('change', value);
    },
    onClose(tag, index) {
      console.log(tag);
      this.curSelectedTags.splice(index, 1);
      // if (this.selectedTags.length > 0) {
      //   this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
      // }
    },
    handleInputConfirm() {
      this.tagName = this.tagName.replace(/\s+/g, '');
      if (!this.tagName) {
        return;
      }
      if (this.tagCatrgoryId) {
        this.addTag();
      } else {
        if (this.categoryType === '店铺特色') {
          this.getTagCatrgoryId();
        }
      }
    },
    getTagCatrgoryId() {
      let param = {
        categoryType: '店铺特色',
        isIncludeParent: '1'
      };
      http
        .get(urls.systemSetting.storeTagcategories, param)
        .then(data => {
          if (data.content.length) {
            this.tagCatrgoryId = data.content[0].id;
            this.addTag();
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    },
    addTag() {
      // let addTagName;
      let param = {
        name: this.tagName,
        hierarchy: '1',
        tagCategory: {
          id: this.tagCatrgoryId
        }
      };
      http
        .post(urls.systemSetting.deleteTag, param)
        .then(data => {
          this.$emit('addSuccess');
          // addTagName = this.tagName;
          console.log(this.curSelectedTags);
          // 34493 WEB：软文宣传，新增标签，回车添加，错误将已选标签清空显示
          // this.selectedTags.push(addTagName);
          this.tagName = '';
        })
        .catch(error => {
          this.$message.warning(error.errorMessage);
          console.log(error.errorMessage);
        });
    },
    onMore() {
      if (this.selectType === 'shopProfile') {
        this.$emit('showMore');
      } else {
        this.showMore = false;
        this.curShowTags = this.tagList;
      }
    }
  }
};
</script>

<style lang="scss">
.biz-tag-select {
  .tag-content {
    .tag-show-eara {
      .sel-tag {
        margin: 2px;
      }
    }

    .select-area {
      margin-top: 5px;
      padding: 10px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      position: relative;

      .search-container {
        display: flex;
        align-items: center;
        .icon {
          color: #dcdfe6;
          font-size: 16px;
          position: absolute;
          left: 5px;
          top: 14px;
        }
      }

      .empty {
        color: darkgray;
      }
      .tag-container {
        margin-top: 5px;

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

        .more-btn {
          margin: 5px;
        }
      }
    }
  }
}
</style>
