<template>
  <biz-grid class="class-info" v-loading="loading">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" label-width="155px" size="small" :model="form" :rules="rules">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称，如资讯文章"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parantClass">
        <el-cascader v-model="form.tagClass" :options="options" :change-on-select="true" @change="changeHandle"></el-cascader>
      </el-form-item>
      <el-form-item label="店铺是否可见分类" prop="isVisibleToStore" v-if="getUser.roleLevel==='platform'">
        <el-switch v-model="form.isVisibleToStore" inactive-color="#d9d9d9" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="店铺是否可编辑分类标签" prop="isTagEditableToStore" v-if="getUser.roleLevel==='platform'">
        <el-switch v-model="form.isTagEditableToStore" inactive-color="#d9d9d9" active-color="#87d068"></el-switch>
      </el-form-item>
      <el-form-item label="店铺是否可添加子分类" prop="isChildEditableToStore" v-if="getUser.roleLevel==='platform'">
        <el-switch v-model="form.isChildEditableToStore" inactive-color="#d9d9d9" active-color="#87d068"></el-switch>
      </el-form-item>
       <el-form-item label="分类说明" prop="description">
        <el-input v-model="form.description" type="textarea" rows="4" placeholder="请输入分类说明"></el-input>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { mapGetters } from 'vuex';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: '',
  data() {
    return {
      loading: false,
      parentId: '',
      options: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      form: {
        name: '',
        tagClass: [],
        isTagEditableToStore: false,
        isChildEditableToStore: false,
        isVisibleToStore: false,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      }
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
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    itemId(newValue) {
      this.$refs.form.resetFields();
      if (newValue.id) {
        this.getTagInfo();
      } else {
        this.getTagClassList(true);
      }
    }
  },
  methods: {
    clear(row) {
      this.parentId = row.id;
    },
    getTagClassList(add) {
      this.loading = true;
      let url;
      let param = {
        tagCatrgoryId: ''
      };

      if (this.getUser.roleLevel === 'platform') {
        url = urls.systemSetting.getTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.getShopTagCategories;
      }

      http
        .get(url, param)
        .then(data => {
          console.log('系统标签分类管理', data);
          this.loading = false;
          let ary = data.content;
          let obj;
          this.options = [];
          this.options.push({ label: '顶层分类', value: '' });
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
          let id = this.parentId;
          this.form.tagClass = [];
          while (id) {
            parId = this.getParentCategory(ary, id);
            id = parId;
          }

          if (add) {
            if (this.parentId) {
              this.form.tagClass.push(this.parentId);
            } else {
              this.form.tagClass.splice(0, this.form.tagClass.length);
            }
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
          this.form.tagClass.unshift(element.id);
          return false;
        } else {
          element.children.forEach(element1 => {
            if (element1.id === id) {
              parentId = element1.parentId;
              this.form.tagClass.unshift(element1.id);
              return false;
            } else {
              element1.children.forEach(element2 => {
                if (element2.id === id) {
                  parentId = element2.parentId;
                  this.form.tagClass.unshift(element2.id);
                  return false;
                } else {
                  element2.children.forEach(element3 => {
                    if (element3.id === id) {
                      parentId = element3.parentId;
                      this.form.tagClass.unshift(element3.id);
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
    changeHandle() {
      console.log('标签管理分类', this.form.tagClass);
      this.parentId = this.form.tagClass[this.form.tagClass.length - 1];
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.itemId.id) {
            this.updateInfo();
          } else {
            this.addTagClass();
          }
        }
      });
    },
    getTagInfo() {
      this.loading = true;
      let url;
      let params = {
        id: this.itemId.id
      };

      if (this.getUser.roleLevel === 'platform') {
        url = urls.systemSetting.createTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.createShopTagCategories;
      }

      http
        .get(url, params)
        .then(data => {
          let content = data.data;
          this.loading = false;
          console.log(data);
          this.form.name = content.name;
          this.form.isTagEditableToStore = content.isTagEditableToStore === '1';
          this.form.isChildEditableToStore = content.isChildEditableToStore === '1';
          this.form.isVisibleToStore = content.isVisibleToStore === '1';
          this.form.description = content.description;
          this.parentId = content.parentId;
          this.form.tagClass.push(this.parentId);
          this.getTagClassList(false);
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    updateInfo() {
      this.loading = true;
      let url;
      let params = {
        id: this.itemId.id,
        name: this.form.name,
        parentId: this.parentId,
        description: this.form.description
      };

      if (this.getUser.roleLevel === 'platform') {
        params.isChildEditableToStore = this.form.isChildEditableToStore ? '1' : '0';
        params.isVisibleToStore = this.form.isVisibleToStore ? '1' : '0';
        params.isTagEditableToStore = this.form.isTagEditableToStore ? '1' : '0';
        url = urls.systemSetting.createTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.createShopTagCategories;
      }

      http
        .put(url, params)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    addTagClass() {
      this.loading = true;
      let url;
      let params = {
        name: this.form.name,
        parentId: this.parentId,
        description: this.form.description
      };

      if (this.getUser.roleLevel === 'platform') {
        params.isChildEditableToStore = this.form.isChildEditableToStore ? '1' : '0';
        params.isVisibleToStore = this.form.isVisibleToStore ? '1' : '0';
        params.isTagEditableToStore = this.form.isTagEditableToStore ? '1' : '0';
        url = urls.systemSetting.createTagCategories;
      } else if (this.getUser.roleLevel === 'shop') {
        url = urls.systemSetting.createShopTagCategories;
      }

      http
        .post(url, params)
        .then(data => {
          this.loading = false;
          this.$message.success('创建成功');
          this.$emit('operationSuccess');
        })
        .catch(error => {
          this.loading = false;
          this.$message.warning(error.errorMessage);
        });
    },
    operateHandler(name) {
      this[name]();
    }
  }
};
</script>

<style lang="scss">
.class-info {
  padding: 10px 15px;
  .biz-save-button {
    justify-content: flex-start;
  }
}
</style>
