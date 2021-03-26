<template>
  <biz-grid class="category-mgmt__category-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="productCategory" :rules="rules">
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="productCategory.name" placeholder="请输入1-20字分类名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分类:" prop="parentId">
        <el-select v-model="productCategory.parentId" placeholder="请选择上级分类" style="width: 100%;" :disabled="hasChild()"
          @change="changeParentId">
          <el-option v-for="item in productCategoryList" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left;">{{ item.topCategory === true ? item.name : "" }}</span>
            <span style="float: right;">{{ item.topCategory === false ? item.name : "" }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="productCategory.type" placeholder="请选择类型" style="width: 100%;" :disabled="hasParent()"
          @change="typeChange">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="logo：" prop="logo">
        <BizAvatarUploaderNew v-model="productCategory.logo" @uploadSuccess="uploadSuccess">
        </BizAvatarUploaderNew>
      </el-form-item>
    </el-form>
    <VueCropper :open="openV" :picUrl="picUrl" @close="close" @handelSuccess="handelSuccess"></VueCropper>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { VueCropper } from '@/components/BizForm';
const logo = {
  agriculturalPurchasing: '/resources/admin/images/productCategory/agriculturalPurchasing.jpg',
  car: '/resources/admin/images/productCategory/car.jpg',
  carProduct: '/resources/admin/images/productCategory/carProduct.jpg',
  carService: '/resources/admin/images/productCategory/carService.jpg',
  departmentMarket: '/resources/admin/images/productCategory/departmentMarket.jpg',
  eatGoodFood: '/resources/admin/images/productCategory/eatGoodFood.jpg',
  flowerBirdEntertainment: '/resources/admin/images/productCategory/flowerBirdEntertainment.jpg',
  footwearBags: '/resources/admin/images/productCategory/footwearBags.jpg',
  homeApplianceOffice: '/resources/admin/images/productCategory/homeApplianceOffice.jpg',
  homeTextile: '/resources/admin/images/productCategory/homeTextile.jpg',
  jewelryAccessories: '/resources/admin/images/productCategory/jewelryAccessories.jpg',
  lifeService: '/resources/admin/images/productCategory/lifeService.jpg',
  moreService: '/resources/admin/images/productCategory/moreService.jpg',
  motherBabySupplies: '/resources/admin/images/productCategory/motherBabySupplies.jpg',
  outdoorSport: '/resources/admin/images/productCategory/outdoorSport.jpg',
  phoneDigital: '/resources/admin/images/productCategory/phoneDigital.jpg',
  skinMakeup: '/resources/admin/images/productCategory/skinMakeup.jpg',
  womenWear: '/resources/admin/images/productCategory/womenWear.jpg'
};

export default {
  name: 'CategorySetting',
  components: {
    BizAvatarUploaderNew,
    BizSaveButton,
    BizGrid,
    VueCropper
  },
  data() {
    return {
      openV: false,
      picUrl: '',
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级分类', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      },
      productCategory: this.getDefaultProductCategory(),
      brands: [],
      productCategoryList: [],
      allCategoryList: [],
      typeList: [],
      options: []
    };
  },
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    open: {
      type: Boolean
    }
  },
  created() {
    this.getCategory();
  },
  methods: {
    uploadSuccess(url) {
      console.log('uploadSuccess');
      this.picUrl = url;
      this.openV = true;
    },
    close() {
      this.openV = false;
    },
    handelSuccess(url) {
      this.productCategory.logo = url;
    },
    ...mapGetters(['getUser']),
    getCategory() {
      let params = {
        id: this.itemId,
        shopId: this.getUser().shop.id || window.top.SHOP_ID || ''
      };
      http
        .get('/admin/financialProductCategory/financialCategoryQuery.jhtml', params)
        .then(data => {
          this.allCategoryList = data.productCategoryTree;
          this.productCategoryList = this.getTopCategoryList(data.productCategoryTree);
          this.typeList = data.productCategoryType;

          let tmpproductCategory = data.productCategory;
          tmpproductCategory.parentId = data.productCategory.parentId === '' ? '-1' : data.productCategory.parentId;
          if (!tmpproductCategory.logo) {
            tmpproductCategory.logo = logo[tmpproductCategory.type];
          }
          this.productCategory = tmpproductCategory;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    query() {
      let params = {
        id: this.itemId
      };
      http
        .get('/admin/financialProductCategory/queryFinancialProductCategory.jhtml', params)
        .then(data => {
          let tmpproductCategory = data.productCategory;
          tmpproductCategory.parentId = data.productCategory.parentId === '' ? '-1' : data.productCategory.parentId;
          if (!tmpproductCategory.logo) {
            tmpproductCategory.logo = logo[tmpproductCategory.type];
          }
          this.productCategory = tmpproductCategory;
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    typeChange(val) {
      this.productCategory.logo = logo[val];
    },
    getDefaultProductCategory() {
      return {
        id: '',
        name: '',
        type: '',
        parentId: '',
        topCategory: ''
      };
    },
    getDefaultTopCategory() {
      return {
        id: '-1',
        name: '顶级分类',
        type: '',
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
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = this.getSaveParams();
          if (this.hasSameNameProductCategory(params)) {
            this.$message.warning('分类名称已存在');
            return false;
          }
          if (this.productCategory.id) {
            http
              .put('/admin/financialProductCategory/updateFinancialProductCategory.jhtml', params)
              .then(data => {
                this.$message.success('更新分类成功');
                this.$emit('operationSuccess');
                this.query();
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            http
              .post('/admin/financialProductCategory/createFinancialProductCategory.jhtml', params)
              .then(data => {
                this.$message.success('添加分类成功');
                this.$emit('operationSuccess');
                this.$emit('createdCategorySuccess', data.id);
              })
              .catch(errData => {
                console.log(errData);
                console.log('code错误');
                if (errData.errorMessage) this.$message.warning(errData.errorMessage);
              })
              .finally(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    getSaveParams() {
      return {
        id: this.productCategory.id,
        name: this.productCategory.name,
        type: this.productCategory.type,
        logo: this.productCategory.logo,
        parentId: this.productCategory.parentId
      };
    },
    hasSameNameProductCategory(params) {
      let index = this.allCategoryList.findIndex(item => item.name === params.name);

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

      let index = this.allCategoryList.findIndex(category => category.parentId === this.productCategory.id);

      return index !== -1;
    },
    hasParent() {
      return this.productCategory.parentId !== '-1' && this.productCategory.parentId !== '';
    }
  },
  computed: {},
  watch: {
    itemId(Val) {
      if (Val) {
        this.query();
      } else {
        this.productCategory = this.getDefaultProductCategory();
      }
    },
    open(val) {
      if (!val) {
        this.productCategory = this.getDefaultProductCategory();
        this.getCategory();
        this.productCategoryList = [];
        this.typeList = [];
        this.allCategoryList = [];
      }
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__category-setting {
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
    width: 150px;
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
