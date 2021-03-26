<template>
  <biz-grid class="tag-class-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <div class="accused-info-item">
      <p class="item-left">
        <span style="color:red;">*</span>
        <span class="label">标签名称</span>
      </p>
      <el-input v-model="tagName" class="el-input" :maxlength="maxLength">
      </el-input>
    </div>
    <div class="accused-info-item">
      <p class="item-left">
        <span style="color:red;">*</span>
        <span class="label">标签类型</span>
      </p>
      <el-select v-model="tagType" placeholder="请选择" filterable style="width: 100%;" @change="tagTypeChange">
        <el-option v-for="(item,index) in tagTypeList" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="accused-info-item">
      <p class="item-left">
        <span class="label">标签分类</span>
      </p>
      <el-cascader v-model="tagClass" :options="options" :change-on-select="changeOnSelect" @change="changeHandle"></el-cascader>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'tag-class-info',
  data() {
    return {
      loading: false,
      tagName: '',
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      tagType: '文本型',
      tagTypeList: ['文本型', '数值型', '浮点型'],
      tagClass: [],
      tagClassList: [],
      tagCategoryId: '',
      tagId: '',
      type: '0',
      options: [],
      changeOnSelect: true,
      maxLength: 10
    };
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
  components: { BizGrid, BizSaveButton },
  computed: {},
  watch: {
    itemId(newValue, oldValue) {
      if (newValue.id) {
        this.checkPlateformTag();
      } else {
        this.tagName = '';
        this.tagType = '文本型';
        this.getTagClassList(true); // 获取所有标签列表
      }
    }
  },
  methods: {
    changeHandle() {
      console.log('标签管理分类', this.tagClass);
      this.tagCategoryId = this.tagClass[this.tagClass.length - 1];
    },
    tagTypeChange() {
      switch (this.tagType) {
        case '文本型':
          this.type = '0';
          break;
        case '数值型':
          this.type = '1';
          break;
        case '浮点型':
          this.type = '2';
          break;
      }
    },
    updatePlatFormTag() {
      this.loading = true;
      let param = {
        id: this.itemId.id,
        type: this.type,
        tagCategoryId: this.tagCategoryId,
        name: this.tagName
      };

      http
        .put(urls.systemSetting.updatePlatFormTag, param)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    checkPlateformTag() {
      this.loading = true;
      let param = {
        id: this.itemId.id
      };
      this.tagClass.splice(0, this.tagClass.length);
      http
        .get(urls.systemSetting.updatePlatFormTag, param)
        .then(data => {
          console.log(data);
          this.loading = false;
          this.tagName = data.data.name;
          this.tagType = data.data.type ? this.tagTypeList[parseInt(data.data.type)] : '文本型';
          this.tagCategoryId = data.data.tagCategory.id;
          this.tagClass.push(this.tagCategoryId);
          this.getTagClassList(false); // 获取所有标签列表
        })
        .catch(() => {})
        .finally(() => {});
    },
    addPlatformTag() {
      this.loading = true;
      let param = {
        id: '',
        name: this.tagName,
        tagCategoryId: this.tagClass[this.tagClass.length - 1],
        type: this.type
      };

      http
        .post(urls.systemSetting.updatePlatFormTag, param)
        .then(data => {
          this.loading = false;
          console.log(data);
          this.$message.success('创建成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {});
    },
    operateHandler() {
      if (this.itemId.id) {
        this.updatePlatFormTag(); // 更新
      } else {
        this.addPlatformTag(); // 创建
      }
    },
    getAllTags() {
      let param = {};

      http
        .get(urls.systemSetting.getPlatformTags, param)
        .then(data => {
          console.log('系统标签列表', data);
          this.tagClassList = data.content;
        })
        .catch(() => {})
        .finally(() => {});
    },
    getTagClassList(add) {
      this.loading = true;
      let param = {
        tagCatrgoryId: ''
      };

      http
        .get(urls.systemSetting.getTagCategories, param)
        .then(data => {
          console.log('系统标签分类管理', data);
          this.loading = false;
          let ary = data.content;
          let obj;
          this.options = [];
          ary.forEach(element => {
            obj = {};
            obj.label = element.name;
            obj.value = element.id;
            this.options.push(obj);

            if (element.children && element.children.length) {
              obj.children = [];
              element.children.forEach(elementOne => {
                let objOne = {};
                objOne.label = elementOne.name;
                objOne.value = elementOne.id;
                obj.children.push(objOne);

                if (elementOne.children && elementOne.children.length) {
                  objOne.children = [];
                  elementOne.children.forEach(elementTwo => {
                    let objTwo = {};
                    objTwo.label = elementTwo.name;
                    objTwo.value = elementTwo.id;
                    objOne.children.push(objTwo);

                    if (elementTwo.children && elementTwo.children.length) {
                      objTwo.children = [];
                      elementTwo.children.forEach(elementThree => {
                        let objThree = {};
                        objThree.label = elementThree.name;
                        objThree.value = elementThree.id;
                        objTwo.children.push(objThree);
                      });
                    }
                  });
                }
              });
              console.log(this.options);
            }
          });

          let parId;
          let id = this.tagCategoryId;
          this.tagClass = [];
          while (id) {
            parId = this.getParentCategory(ary, id);
            id = parId;
          }

          if (add) {
            this.tagClass.splice(0, this.tagClass.length);
          }
        })
        .catch(() => {})
        .finally(() => {});
    },
    getParentCategory(ary, id) {
      let parentId = '';
      ary.forEach((element, index) => {
        if (element.id === id) {
          parentId = element.parentId;
          this.tagClass.unshift(element.id);
          return false;
        } else {
          element.children.forEach(element1 => {
            if (element1.id === id) {
              parentId = element1.parentId;
              this.tagClass.unshift(element1.id);
              return false;
            } else {
              element1.children.forEach(element2 => {
                if (element2.id === id) {
                  parentId = element2.parentId;
                  this.tagClass.unshift(element2.id);
                  return false;
                } else {
                  element2.children.forEach(element3 => {
                    if (element3.id === id) {
                      parentId = element3.parentId;
                      this.tagClass.unshift(element3.id);
                      return false;
                    }
                  });
                }
              });
            }
          });
        }
      });

      return parentId;
    }
  },
  created() {
    this.getTagClassList(false);
  }
};
</script>

<style lang="scss">
.tag-class-info {
  padding: 20px 40px 20px 20px;
  font-size: 14px;
  color: #606266;

  .accused-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .item-left {
      width: 95px;
      display: block;
      text-align: right;
      .label {
        text-align: right;
        margin-right: 10px;
      }
    }

    .el-select,
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }

    .el-cascader {
      width: 100%;
    }
  }
}
</style>
