<template>
  <biz-grid class="category-mgmt__category-setting">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <el-form ref="form" size="small" label-width="110px" :model="productCategory" :rules="rules" :disabled="!isEdit">
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
      <!-- <el-form-item label="排序:" prop="sort">
        <el-input v-model="productCategory.sort" clearable placeholder="请输入排序"></el-input>
      </el-form-item> -->
      <el-form-item label="筛选品牌:" prop="shopBrands">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="productCategory.shopBrandIds" @change="handleCheckedBrandsChange">
          <div class="checkbox-group">
            <el-checkbox v-for="item in brands" :key="item.id" :label="item.id">
              <div class="checkbox-group-item">
                {{item.name}}
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
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
import { VueCropper } from '@/components/BizForm';
import service from '@/service/commodity/category-mgmt/categorySetting';
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
          type: 'primary',
          auth: ['admin:productCategory.edit']
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }],
        parentId: [{ required: true, message: '请选择上级分类', trigger: ['blur', 'change'] }],
        type: [{ required: true, message: '请选择类型', trigger: ['blur', 'change'] }]
      },
      checkAll: false,
      isIndeterminate: false,

      productCategory: this.getDefaultProductCategory(),
      brands: [],
      productCategoryList: [],
      allCategoryList: [],
      typeList: []
    };
  },
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    open: {
      type: Boolean
    }
  },
  created() {
    // this.query();
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
        id: id,
        shopId: window.top.SHOP_ID || ''
      };
      service.getProductCategory(
        params,
        data => {
          this.allCategoryList = data.productCategoryTree;
          this.productCategoryList = this.getTopCategoryList(data.productCategoryTree);

          this.brands = data.brands;
          this.typeList = data.productCategoryType;

          let tmpproductCategory = data.productCategory;
          tmpproductCategory.parentId = data.productCategory.parentId === '' ? '-1' : data.productCategory.parentId;

          tmpproductCategory.sort = data.productCategory.sort === 'null' ? '' : data.productCategory.sort;
          if (!tmpproductCategory.logo) {
            tmpproductCategory.logo = logo[tmpproductCategory.type];
          }
          this.productCategory = tmpproductCategory;

          this.checkAll =
            this.productCategory.shopBrandIds.length > 0 && this.productCategory.shopBrandIds.length === this.brands.length;

          this.isIndeterminate =
            this.productCategory.shopBrandIds.length > 0 && this.productCategory.shopBrandIds.length < this.brands.length;
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
        id: '',
        shopId: window.top.SHOP_ID || ''
      };
      service.getProductCategory(
        params,
        data => {
          this.allCategoryList = data.productCategoryTree;
          this.productCategoryList = this.getTopCategoryList(data.productCategoryTree);

          this.brands = data.brands;
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
    typeChange(val) {
      this.productCategory.logo = logo[val];
    },
    getDefaultProductCategory() {
      return {
        id: '',
        name: '',
        type: '',
        sort: '',
        parentId: '',
        shopBrandIds: [],
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
        shopBrandIds: [],
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
            service.updateProductCategory(
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
            service.saveProductCategory(
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
        parentId: this.productCategory.parentId === '-1' ? '' : this.productCategory.parentId,
        shopBrandIds: this.productCategory.shopBrandIds,
        topCategory: this.productCategory.topCategory
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
    handleCheckAllChange(val) {
      this.productCategory.shopBrandIds = val ? this.getAllShopBrandIds() : [];
      this.isIndeterminate = false;
    },
    handleCheckedBrandsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount > 0 && checkedCount === this.brands.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.brands.length;
    },
    getAllShopBrandIds() {
      let ids = [];
      this.brands.forEach(item => {
        ids.push(item.id);
      });
      return ids;
    },
    changeParentId(val) {
      this.allCategoryList.forEach(category => {
        if (category.id === val) {
          this.productCategory.type = category.type;
        }
      });
      this.productCategory.shopBrandIds = [];
      this.isIndeterminate = false;
      this.checkAll = false;
      if (!this.itemId && val !== '-1') {
        let params = {
          id: val,
          shopId: window.top.SHOP_ID || ''
        };
        service.getProductCategory(
          params,
          data => {
            this.productCategory.shopBrandIds = data.productCategory.shopBrandIds;

            this.checkAll =
              this.productCategory.shopBrandIds.length > 0 && this.productCategory.shopBrandIds.length === this.brands.length;

            this.isIndeterminate =
              this.productCategory.shopBrandIds.length > 0 && this.productCategory.shopBrandIds.length < this.brands.length;
          },
          // result_code 不是100的处理
          ErrorData => {
            console.log(ErrorData);
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      }
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
      if (this.open === true) {
        this.query();
      }
    },
    open(val) {
      if (!val) {
        this.productCategory = this.getDefaultProductCategory();
        this.brands = [];
        this.productCategoryList = [];
        this.typeList = [];
        this.allCategoryList = [];
        this.checkAll = false;
        this.isIndeterminate = false;
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
.category-mgmt__category-setting {
  padding-top: 20px;
  .biz-save-button {
    float: left;
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
