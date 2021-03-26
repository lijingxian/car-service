<template>
  <biz-grid class="tag-class-base-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <div class="accused-info-item">
      <p class="item-left">
        <span style="color:red;">*</span>
        <span class="label">分类名称</span>
      </p>
      <el-input v-model="tagName" class="el-input" :maxlength="maxLength">
      </el-input>
    </div>
    <div class="accused-info-item">
      <p class="item-left">
        <span class="label">上级分类</span>
      </p>
      <el-cascader v-model="topClass" :options="options" :change-on-select="changeOnSelect" @change="changeHandle"></el-cascader>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'tag-class-base-info',
  data() {
    return {
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      tagName: '',
      topClass: [],
      topClassList: [],
      parentId: '',
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
      this.topClass = [];
      if (newValue.id) {
        this.getInfo();
      } else {
        this.tagName = '';
        this.getTagClassList(true); // 获取所有标签列表
      }
    }
  },
  methods: {
    changeHandle() {
      console.log(this.topClass);
    },
    operateHandler() {
      let param = {
        name: this.tagName
      };

      if (this.topClass.length) {
        param.parentId = this.topClass[this.topClass.length - 1];
      }

      if (this.itemId.id) {
        if (this.itemId.id === param.parentId) {
          this.$message.warning('上级分类不能选择自己');
          return;
        }

        param.id = this.itemId.id;
        this.loading = true;

        // 更新
        http
          .put(urls.systemSetting.deleteTagCategory, param)
          .then(data => {
            console.log(data);
            this.$emit('operationSuccess');
            this.loading = false;
            this.$message.success('更新成功');
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          })
          .finally();
      } else {
        // 创建
        http
          .post(urls.systemSetting.deleteTagCategory, param)
          .then(data => {
            console.log(data);
            this.$emit('operationSuccess');
            this.loading = false;
            this.$message.success('创建成功');
          })
          .catch(error => {
            this.loading = false;
            this.$message.warning(error.errorMessage);
          })
          .finally(() => {});
      }
    },
    topClassChange() {},
    getInfo() {
      this.loading = true;
      let param = {
        id: this.itemId.id
      };

      http
        .get(urls.systemSetting.deleteTagCategory, param)
        .then(data => {
          console.log(data);
          this.loading = false;
          this.tagName = data.data.name;
          this.parentId = data.data.parentId;
          this.getTagClassList(false);
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
                  });
                }
              });
            }
          });

          let parId;
          let id = this.parentId;
          this.topClass = [];
          while (id) {
            parId = this.getParentCategory(ary, id);
            id = parId;
          }

          if (add) {
            this.topClass.splice(0, this.topClass.length);
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
          this.topClass.unshift(element.id);
          return false;
        } else {
          element.children.forEach(element1 => {
            if (element1.id === id) {
              parentId = element1.parentId;
              this.topClass.unshift(element1.id);
              return false;
            } else {
              element1.children.forEach(element2 => {
                if (element2.id === id) {
                  parentId = element2.parentId;
                  this.topClass.unshift(element2.id);
                  return false;
                } else {
                  element2.children.forEach(element3 => {
                    if (element3.id === id) {
                      parentId = element3.parentId;
                      this.topClass.unshift(element3.id);
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
    },
    getTagsByCategory() {
      this.loading = true;
      let param = {
        tagCatrgoryId: this.topClass[0]
      };

      http
        .get(urls.systemSetting.getTagsByCategory, param)
        .then(data => {
          console.log('标签列表（根据分类）', data);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        })
        .finally(() => {});
    }
  },
  created() {
    this.getTagClassList(false);
  }
};
</script>

<style lang="scss">
.tag-class-base-info {
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

    .el-cascader,
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
