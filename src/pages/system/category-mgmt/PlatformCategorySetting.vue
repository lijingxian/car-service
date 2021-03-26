<template>
  <biz-grid class="platform-category-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="productCategory" :rules="rules">
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="productCategory.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类:" prop="parentId">
        <el-select v-model="productCategory.parentId" placeholder="请选择上级分类" style="width: 100%;" :disabled="hasChild()" @change="changeParentId">
          <el-option v-for="item in productCategoryList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left;">{{ item.topCategory === true ? item.name : "" }}</span>
            <span style="float: right;">{{ item.topCategory === false ? item.name : "" }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="productCategory.type" placeholder="请选择类型" style="width: 100%;" :disabled="hasParent()">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="排序:" prop="sort">
        <el-input v-model="productCategory.sort" clearable placeholder="请输入排序"></el-input>
      </el-form-item> -->
      <el-form-item label="logo：" prop="logo">
        <BizAvatarUploaderNew v-model="productCategory.logo">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import service from '@/service/system-setting/category-mgmt/platformCategorySetting';

export default {
  name: 'PlatformCategorySetting',
  components: {
    BizAvatarUploaderNew,
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }],
        parentId: [
          { required: true, message: '请选择上级分类', trigger: ['blur', 'change'] }
        ],
        type: [{ required: true, message: '请选择类型', trigger: ['blur', 'change'] }]
      },

      productCategory: this.getDefaultProductCategory(),
      productCategoryList: [],
      allCategoryList: [],
      typeList: []
    };
  },
  props: {
    itemId: {
      type: String
    },
    open: {
      type: Boolean
    }
  },
  created() {
    // this.query();
  },
  methods: {
    query() {
      console.log('CategorySetting::query() itemId:', this.itemId);
      if (this.itemId) {
        this.queryWidthId(Number(this.itemId));
      } else {
        this.queryWidthOutId();
      }
    },
    queryWidthId(id) {
      let params = {
        id: id
      };
      service.getPlatformCategory(
        params,
        data => {
          this.allCategoryList = data.productCategoryTree;
          this.productCategoryList = this.getTopCategoryList(
            data.productCategoryTree
          );

          this.typeList = data.productCategoryType;

          let tmpproductCategory = data.productCategory;
          tmpproductCategory.parentId =
            data.productCategory.parentId === ''
              ? '-1'
              : data.productCategory.parentId;

          tmpproductCategory.sort =
            data.productCategory.sort === 'null'
              ? ''
              : data.productCategory.sort;

          this.productCategory = tmpproductCategory;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('queryWidthId', id);
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    queryWidthOutId() {
      let params = {
        id: ''
      };
      service.getPlatformCategory(
        params,
        data => {
          this.allCategoryList = data.productCategoryTree;
          this.productCategoryList = this.getTopCategoryList(
            data.productCategoryTree
          );

          this.typeList = data.productCategoryType;

          this.productCategory = this.getDefaultProductCategory();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log('queryWidthOutId');
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getDefaultProductCategory() {
      return {
        id: '',
        name: '',
        type: '',
        sort: '',
        parentId: '',
        topCategory: ''
      };
    },
    getDefaultTopCategory() {
      return {
        id: '-1',
        name: '顶级分类',
        type: '',
        sort: '',
        parentId: '-1',
        topCategory: true
      };
    },
    getTopCategoryList(allCategory) {
      let topCategoryList = [];

      topCategoryList.push(this.getDefaultTopCategory());
      for (const category of allCategory) {
        if (category.topCategory === true) {
          topCategoryList.push(category);
        }
      }

      return topCategoryList;
    },
    operateHandler(name) {
      this[name]();
    },
    save() {
      console.log('save:', this.productCategory);
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = this.getSaveParams();

          if (this.hasSameNameProductCategory(params)) {
            this.$message.warning('分类名称已存在');
            return false;
          }

          if (this.productCategory.id) {
            service.updatePlatformCategory(
              params,
              data => {
                this.$message.success('更新分类成功');
                this.$emit('operationSuccess');
                this.query();
              },
              // result_code 不是100的处理
              ErrorData => {
                console.log('更新分类失败 id:', this.productCategory.id);
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.savePlatformCategory(
              params,
              data => {
                this.$message.success('添加分类成功');
                this.$emit('operationSuccess');
                this.$emit('createdCategorySuccess', data.id);
              },
              // result_code 不是100的处理
              ErrorData => {
                console.log('添加分类失败');
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    getSaveParams() {
      return {
        id: this.productCategory.id === '-1' ? '' : this.productCategory.id,
        name: this.productCategory.name,
        type: this.productCategory.type,
        sort: this.productCategory.sort,
        logo: this.productCategory.logo,
        parentId:
          this.productCategory.parentId === '-1'
            ? ''
            : this.productCategory.parentId,
        topCategory: this.productCategory.topCategory
      };
    },
    hasSameNameProductCategory(params) {
      let index = this.allCategoryList.findIndex(
        item => item.name === params.name
      );

      // 没找到同名的
      if (index === -1) {
        return false;
      }

      // 和自己本身同名
      if (this.allCategoryList[index].id === params.id) {
        return false;
      }

      return true;
    },
    changeParentId(val) {
      this.allCategoryList.forEach(category => {
        if (category.id === val) {
          this.productCategory.type = category.type;
        }
      });
    },
    hasChild() {
      if (this.productCategory.id === '' || this.productCategory.id === '-1') {
        return false;
      }

      let index = this.allCategoryList.findIndex(
        category => category.parentId === this.productCategory.id
      );

      return index !== -1;
    },
    hasParent() {
      return (
        this.productCategory.parentId !== '-1' &&
        this.productCategory.parentId !== ''
      );
    }
  },
  computed: {},
  watch: {
    itemId(Val) {
      if (this.open === true) {
        this.query();
      }
    },
    open(val) {
      if (!val) {
        this.productCategory = this.getDefaultProductCategory();
        this.productCategoryList = [];
        this.typeList = [];
        this.allCategoryList = [];
      } else {
        if (this.itemId === '') {
          this.query();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.platform-category-setting {
  padding-top: 20px;
  .biz-save-button {
    justify-content: flex-start;
  }
  .biz-scroller {
  }
  .checkbox-group {
    font-size: 14px;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 100px;
    margin: 0;
    .checkbox-group-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .biz-list {
    margin-top: 10px;
  }
  .el-radio {
    width: 60px;
  }
}
</style>
