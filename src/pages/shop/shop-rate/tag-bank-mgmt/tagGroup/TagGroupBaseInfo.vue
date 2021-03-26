<template>
  <biz-grid class="tag-class-mgmt__base-info" v-loading="loading">
    <biz-save-button slot="top"
                     :operations="operations"
                     @operate="operateHandler"
                     >
    </biz-save-button>
    <el-form
      ref="form"
      size="small"
      label-width="110px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="标签组名称" prop="name">
        <el-input v-model="formModel.name" maxlength="20" placeholder="请输入标签组名称"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formModel.description" type="textarea" maxlength="200" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="标签数">
        <span>{{formModel.tags ? formModel.tags.length : 0}} 个</span>
      </el-form-item>
      <el-form-item label="标签" v-if="itemId.id">
        <el-tag
          closable
          v-for="tag in tagList"
          :key="tag.id"
          :disable-transitions="false"
          size="small"
          @click.native="handleTagClick(tag)"
          @close="handleTagDelete(tag.id)"
        >
          {{ tag.name }}
        </el-tag>
        <el-button class="button-new-tag" type="primary" size="small" @click="addTags">添加标签</el-button>
      </el-form-item>
      <el-card class="box-card" v-show="showCard">
        <h5>{{ selectedTag.id ? '编辑标签' : '新建标签' }}</h5>
        <el-form
          ref="tagEdit"
          size="small"
          label-width="110px"
          :model="selectedTag"
          :rules="innerRules"
          >
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="selectedTag.name" maxlength="20" placeholder="请输入标签名称"></el-input>
          </el-form-item>
        </el-form>
        <biz-save-button
          :operations="innerOperations"
          @operate="operateHandler"
          style="margin-right: 0;"
        ></biz-save-button>
      </el-card>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/shop-rate/TagGroupBaseInfo';
import tagService from '@/service/shop-rate/TagGroupTags';

export default {
  name: 'TagGroupBaseInfo',
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    itemId: {
      type: Object,
      default () {
        return { id: '' };
      }
    }
  },
  data () {
    return {
      // 标签列表
      tagList: [],
      selectedTag: {},
      showCard: false,
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      innerRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      },
      formModel: this.getDefaultModel(),
      innerOperations: [
        {
          label: '取消',
          name: 'cancelTagOperate'
        },
        {
          label: '保存',
          name: 'saveTagOperate',
          type: 'primary'
        }
      ]
    };
  },
  methods: {
    operateHandler(name) {
      this[name]();
    },
    query () {
      this.loading = true;
      service.query(
        {
          id: this.itemId.id,
          terminalTypeId: '2'
        },
        data => {
          let obj = Object.assign(this.getDefaultModel(), data.data);
          this.formModel = obj;

          this.$refs.form.resetFields();

          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.loading = false;
        }
      );
    },
    queryTagList() {
      tagService.query(
        {
          tagGroupId: this.itemId.id
        },
        data => {
          this.tagList = data.content;

          // reset
          this.selections = [];
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleTagDelete(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [id];
        tagService.delete(
          {
            ids: ids
          },
          data => {
            this.$message.success('删除成功');
            this.queryTagList();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      })
        .catch();
    },
    handleTagClick(tag) {
      this.selectedTag = Object.assign({}, tag);
      this.showCard = true;
    },
    addTags() {
      this.selectedTag = {};
      this.showCard = true;
    },
    cancelTagOperate() {
      this.selectedTag = {};
      this.showCard = false;
    },
    saveTagOperate() {
      this.$refs.tagEdit.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          let params = {
            id: this.selectedTag.id,
            name: this.selectedTag.name,
            tagGroupId: this.itemId.id
          };
          if (this.selectedTag.id) {
            tagService.update(
              params,
              data => {
                this.$message.success('保存成功');
                this.queryTagList();
                this.selectedTag = {};
                this.showCard = false;
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            tagService.add(
              params,
              data => {
                this.$message.success('保存成功');
                this.queryTagList();
                this.selectedTag = {};
                this.showCard = false;
                this.loading = false;
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
                this.loading = false;
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    getSaveParams () {
      return {
        id: this.formModel.id,
        name: this.formModel.name,
        description: this.formModel.description,
        tagCategoryId: this.$route.params.classId
      };
    },
    resetModel () {
      this.formModel = this.getDefaultModel();
      this.showCard = false;
      this.selectedTag = {};
    },
    getDefaultModel () {
      return {
        count: 0
      };
    },

    handleAddressChange(val) {
      this.formModel.address = val;
    },
    handleUploadSuccess(url) {
      this.formModel.cover = url;
    },
    handleAreaChanged(areaId) {
      this.formModel.area.id = areaId;
    },

    save () {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          if (this.formModel.id) {
            service.update(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.add(
              this.getSaveParams(),
              data => {
                this.$message.success('保存成功');

                this.$emit('operationSuccess');
              },
              // result_code 不是100的处理
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    itemId (nVal, oVal) {
      if (nVal && nVal.id) {
        this.query();
        this.queryTagList();
      } else {
        this.resetModel();

        this.$refs.form.resetFields();
        this.$refs.tagEdit.resetFields();
      }
    }
  },
  created() {
    if (this.itemId.id) this.query();
  }
};
</script>

<style lang="scss">
.tag-class-mgmt__base-info {
  padding-top: 20px;

  .biz-scroller {
  }
  .el-tag {
    margin-right: 5px;
    margin-bottom: 10px;
  }
  .button-new-tag {
    height: 24px;
    margin-top: -2px;
    margin-bottom: 10px;
    line-height: 22px;
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 4px;
    border: 1px solid rgba(249, 135, 0, 0.2);
    color: #ff7300;
    background-color: rgba(249, 135, 0, 0.1);
  }
  .box-card {
    margin-top: 20px;

    .el-card__body {
      padding: 20px 20px;

      h5 {
        margin: 10px 0 20px;
        text-align: center;
        color: #606266;
      }

      .biz-save-button {
        margin-bottom: 0;
      }
    }
  }
}
</style>
