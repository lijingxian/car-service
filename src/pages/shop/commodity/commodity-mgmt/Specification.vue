<template>
  <biz-grid class="category-mgmt__specification">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit"></biz-save-button>
    <div class="des" style="font-size:12px">如您需要修改/新增当前商品的分类规格请至商品分类功能 <el-button type="text" style="font-size:12px" @click="editCategory">去编辑>></el-button></div>
    <el-form size="small" :disabled="!isEdit">
      <label size="small" style="margin-left: 10px">请选择商品规格：</label>
      <div style="margin: 15px;"></div>
      <el-form-item>
        <el-checkbox-group v-model="checkedIds" @change="handleCheckedChange" style="margin-left: 10px">
          <el-checkbox v-for="item in allSpecificationList" :label="item.id" :key="item.name">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-table :data="commodityList" style="width: 100%">
      <el-table-column v-for="specification in allSpecificationList" :label="specification.name" :key="specification.id" v-if="specification.checked">
        <template slot-scope="scope">
          <div v-for="valueItem in scope.row.specificationValueData" :label="valueItem.name" :key="valueItem.id">
            <el-select v-model="valueItem.id" placeholder="请选择" v-show="specification.id === valueItem.specificationId">
              <el-option v-for="opt in specification.options" :key="opt.id" :label="opt.name" :value="opt.id"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="showEditOperationColumn">
        <template slot-scope="scope" v-if="isEdit">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <biz-save-button :operations="editOperations" @operate="operateHandler" v-if="isEdit"></biz-save-button>
    <el-dialog :visible.sync="dialogVisiable" title="规格同步" append-to-body custom-class="spec-dialog">
      <div class="dialog-div">
        <div style="padding:0px 20px 10px 20px">您可将当前规格商品的数据同步给其他规格，同步后其他规格的数据与当前一致。同步前请仔细核对需要同步的规格和数据！</div>
        <el-form label-width="110px" size="small" ref="formPass" :model="formSpec" :inline-message="true">
          <el-form-item label="当前规格：" prop="currentSpec">
            <span class="form-static">{{formSpec.currentSpec}}</span>
          </el-form-item>
          <el-form-item label="同步规格：" prop="spec" class="isRequired">
            <el-checkbox v-model="allSpec" @change="handleCheckAllSpec" :indeterminate="isIndeterminateSpec">全选</el-checkbox>
            <el-checkbox-group v-model="specs" style="display: grid;" @change="handleSpeChange">
              <el-checkbox v-for="(spec,index) in specList" :key="index" :label="spec.id">{{spec.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="同步数据：" prop="item" class="isRequired">
            <div style="display:flex;border: 1px solid rgb(245, 245, 245);margin-top: 10px;">
              <div style="padding-right: 10px;padding-left: 10px;border-right: 1px solid rgb(245, 245, 245);min-width:100px">
                <el-checkbox v-model="categoryBase" @change="handleCheckAllCategoryBase" :indeterminate="isIndeterminateCategoryBase">基本信息</el-checkbox>
              </div>
              <div style="padding-left:10px">
                <el-checkbox-group v-model="itemsBase" @change="handleBaseChange">
                  <el-checkbox v-for="(item,index) in itemBaseList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div style="display:flex;border: 1px solid rgb(245, 245, 245);">
              <div style="padding-right: 10px;padding-left: 10px;border-right: 1px solid rgb(245, 245, 245);min-width:100px">
                <el-checkbox v-model="categoryParm" @change="handleCheckAllCategoryParm" :indeterminate="isIndeterminateCategoryParm">参数</el-checkbox>
              </div>
              <div style="padding-left:10px">
                <el-checkbox-group v-model="itemsParm" @change="handleParmChange">
                  <el-checkbox v-for="(item,index) in itemParmList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div style="display:flex;border: 1px solid rgb(245, 245, 245);">
              <div style="padding-right: 10px;padding-left: 10px;border-right: 1px solid rgb(245, 245, 245);min-width:100px">
                <el-checkbox v-model="categoryDetail" @change="handleCheckAllCategoryDetail" :indeterminate="isIndeterminateCategoryDetail">详情</el-checkbox>
              </div>
              <div style="padding-left:10px">
                <el-checkbox-group v-model="itemsDetail" @change="handleDetailChange">
                  <el-checkbox v-for="(item,index) in itemDetailList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div style="display:flex;border: 1px solid rgb(245, 245, 245);">
              <div style="padding-right: 10px;padding-left: 10px;border-right: 1px solid rgb(245, 245, 245);min-width:100px">
                <el-checkbox v-model="categoryPicture" @change="handleCheckAllCategoryPicture" :indeterminate="isIndeterminateCategoryPicture">图片</el-checkbox>
              </div>
              <div style="padding-left:10px">
                <el-checkbox-group v-model="itemsPicture" @change="handlePictureChange">
                  <el-checkbox v-for="(item,index) in itemPictureList" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiable = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmByDialog" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import http from '@/common/http';
import SpecificationService from '@/service/commodity/commodity-mgmt/specification';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';

export default {
  name: 'Specification',
  components: {
    BizSaveButton,
    BizGrid
  },
  data() {
    return {
      showEditOperationColumn: false,
      operations: [
        {
          label: '规格同步',
          name: 'specSync',
          type: '',
          disabled: false
        },
        {
          label: '新增',
          name: 'addSpecificationCommodityOperation',
          type: 'primary',
          disabled: true
        }
      ],
      editOperations: [
        {
          label: '确定',
          name: 'saveSpecificationEditOperation',
          type: 'primary',
          auth: ['admin:product.edit']
        },
        {
          label: '取消',
          name: 'cancelSpecificationEditOperation',
          type: 'primary',
          auth: ['admin:product.edit']
        }
      ],
      checkedIds: [],
      allSpecificationList: [],
      commodityList: [],
      formSpec: {
        currentSpec: ''
      },
      dialogVisiable: false,
      isIndeterminateSpec: false,
      isIndeterminateCategoryBase: false,
      isIndeterminateCategoryParm: false,
      isIndeterminateCategoryDetail: false,
      isIndeterminateCategoryPicture: false,
      specList: [],
      allSpec: true,
      categoryBase: true,
      categoryParm: true,
      categoryDetail: true,
      categoryPicture: true,
      specs: [],
      itemsBase: [],
      itemsParm: [],
      itemsDetail: [],
      itemsPicture: [],
      itemBaseList: [
        { value: '0', label: '名称' },
        { value: '1', label: '品牌' },
        { value: '2', label: '系列' },
        { value: '3', label: '销售价' },
        { value: '4', label: '指导价' },
        { value: '5', label: '支付方式' },
        { value: '6', label: '配送方式' },
        { value: '7', label: '关键词' },
        { value: '8', label: '营销标签' },
        { value: '9', label: '缩略图' }
      ],
      itemParmList: [],
      itemDetailList: [
        { value: '10', label: '商品介绍' },
        { value: '11', label: '购买须知' },
        { value: '12', label: '产品售后' },
        { value: '13', label: '语音播报介绍' },
        { value: '14', label: '商品亮点' },
        { value: '15', label: '商品竞品' }
      ],
      itemPictureList: [
        { value: '16', label: '轮播主图' },
        { value: '17', label: 'VR资源' },
        { value: '18', label: '视频' },
        { value: '19', label: '内饰图片' },
        { value: '20', label: '空间图片' },
        { value: '21', label: '图解资源' },
        { value: '22', label: '车身图片' },
        { value: '23', label: '360图片' }
      ]
    };
  },
  computed: {},
  props: {
    id: {
      type: String,
      required: true
    },
    tabSelection: {
      type: String
    },
    open: {
      type: Boolean
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    specName: {
      type: String
    },
    categoryId: {
      type: String,
      default: ''
    },
    categoryName: {
      type: String
    }
  },
  watch: {
    tabSelection(val) {
      if (val === 'specification') {
        if (this.id !== '') {
          this.query();
        }
      }
    },
    open(val) {
      if (!val) {
        this.checkedIds = [];
        this.allSpecificationList = [];
        this.commodityList = [];
        this.showEditOperationColumn = false;
      }
    }
  },
  created() {},
  methods: {
    refresh() {
      this.query();
    },
    editCategory() {
      this.$router.push({ path: '/operating/commodity-mgmt/category', query: { id: this.categoryId, from: 'specification' } });
    },
    handleCheckAllSpec(val) {
      this.specs = val
        ? this.specList.map(item => {
          return item.id;
        })
        : [];
      this.isIndeterminateSpec = false;
    },
    handleSpeChange(val) {
      let checkedCount = val.length;
      this.allSpec = checkedCount === this.specList.length;
      this.isIndeterminateSpec = checkedCount > 0 && checkedCount < this.specList.length;
    },
    specSync() {
      this.specList = [];
      this.formSpec.currentSpec = this.specName;
      for (const iterator of this.commodityList) {
        let specNew = '';
        iterator.specificationValueData.forEach((spec, index) => {
          if (iterator.specificationValueData.length - 1 > index) {
            specNew += spec.name + ',';
          } else {
            specNew += spec.name;
          }
        });
        this.specList.push({ name: specNew, id: iterator.productId });
      }
      if (this.categoryName === '整车') {
        this.itemDetailList = [
          { value: '10', label: '商品介绍' },
          { value: '11', label: '购买须知' },
          { value: '12', label: '产品售后' },
          { value: '13', label: '语音播报介绍' },
          { value: '14', label: '商品亮点' },
          { value: '15', label: '商品竞品' }
        ];
      } else {
        this.itemDetailList = [
          { value: '10', label: '商品介绍' },
          { value: '11', label: '购买须知' },
          { value: '12', label: '产品售后' },
          { value: '13', label: '语音播报介绍' }
        ];
      }
      this.specs = this.specList
        ? this.specList.map(item => {
          return item.id;
        })
        : [];
      this.itemsBase = this.itemBaseList
        ? this.itemBaseList.map(item => {
          return item.value;
        })
        : [];
      this.itemsParm = this.itemParmList
        ? this.itemParmList.map(item => {
          return item.value;
        })
        : [];
      this.itemsDetail = this.itemDetailList
        ? this.itemDetailList.map(item => {
          return item.value;
        })
        : [];
      this.itemsPicture = this.itemPictureList
        ? this.itemPictureList.map(item => {
          return item.value;
        })
        : [];
      this.categoryBase = true;
      this.categoryParm = true;
      this.categoryDetail = true;
      this.categoryPicture = true;
      this.dialogVisiable = true;
    },
    handleCheckAllCategoryBase(val) {
      this.itemsBase = val
        ? this.itemBaseList.map(item => {
          return item.value;
        })
        : [];
      this.isIndeterminateCategoryBase = false;
    },
    handleBaseChange(val) {
      let checkedCount = val.length;
      this.categoryBase = checkedCount === this.itemBaseList.length;
      this.isIndeterminateCategoryBase = checkedCount > 0 && checkedCount < this.itemBaseList.length;
    },
    handleCheckAllCategoryParm(val) {
      this.itemsParm = val
        ? this.itemParmList.map(item => {
          return item.value;
        })
        : [];
      this.isIndeterminateCategoryParm = false;
    },
    handleParmChange(val) {
      let checkedCount = val.length;
      this.categoryParm = checkedCount === this.itemParmList.length;
      this.isIndeterminateCategoryParm = checkedCount > 0 && checkedCount < this.itemParmList.length;
    },
    handleCheckAllCategoryDetail(val) {
      this.itemsDetail = val
        ? this.itemDetailList.map(item => {
          return item.value;
        })
        : [];
      this.isIndeterminateCategoryDetail = false;
    },
    handleDetailChange(val) {
      let checkedCount = val.length;
      this.categoryDetail = checkedCount === this.itemDetailList.length;
      this.isIndeterminateCategoryDetail = checkedCount > 0 && checkedCount < this.itemDetailList.length;
    },
    handleCheckAllCategoryPicture(val) {
      this.itemsPicture = val
        ? this.itemPictureList.map(item => {
          return item.value;
        })
        : [];
      this.isIndeterminateCategoryPicture = false;
    },
    handlePictureChange(val) {
      let checkedCount = val.length;
      this.categoryPicture = checkedCount === this.itemPictureList.length;
      this.isIndeterminateCategoryPicture = checkedCount > 0 && checkedCount < this.itemPictureList.length;
    },
    confirmByDialog() {
      let flg = true;
      if (this.specs.length === 0) {
        this.$message.warning('请选择同步规格');
        flg = false;
      }
      if (
        this.itemsBase.length === 0 &&
        this.categoryParm === false &&
        this.itemsDetail.length === 0 &&
        this.itemsPicture.length === 0
      ) {
        this.$message.warning('请选择同步数据');
        flg = false;
      }
      if (flg) {
        let categoryItems = [];
        if (this.categoryBase === true || this.itemsBase.length > 0) {
          this.categoryBase = '0';
          categoryItems.push({ category: this.categoryBase, items: this.itemsBase });
        }
        if (this.categoryParm === true || this.itemsParm.length > 0) {
          this.categoryParm = '1';
          categoryItems.push({ category: this.categoryParm, items: this.itemsParm });
        }
        if (this.categoryDetail === true || this.itemsDetail.length > 0) {
          this.categoryDetail = '2';
          categoryItems.push({ category: this.categoryDetail, items: this.itemsDetail });
        }
        if (this.categoryPicture === true || this.itemsPicture.length > 0) {
          this.categoryPicture = '3';
          categoryItems.push({ category: this.categoryPicture, items: this.itemsPicture });
        }
        for (const item of categoryItems) {
          if (item.category === '0') {
            this.categoryBase = true;
          } else if (item.category === '1') {
            this.categoryParm = true;
          } else if (item.category === '2') {
            this.categoryDetail = true;
          } else if (item.category === '3') {
            this.categoryPicture = true;
          } else {
          }
        }
        let params = {
          id: this.id,
          ids: this.specs,
          items: categoryItems
        };
        http
          .put('/admin/shopProduct/specificationsSynchronization.jhtml', params)
          .then(data => {
            this.dialogVisiable = false;
            this.$message.success('规格同步成功');
            this.$emit('operationSuccess');
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          });
      } else {
        return false;
      }
    },
    query() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.id
      };
      SpecificationService.getSpecificationGroups(
        params,
        data => {
          this.allSpecificationList = this.getAllSpecificationList(data.categorySpecifications);

          if (this.allSpecificationList.length > 0) {
            this.operations[1].disabled = false;
          } else {
            this.operations[1].disabled = true;
          }
          this.commodityList = this.getCommodityList(data.allProductSpecifications);
          if (data.allProductSpecifications[0].specificationValueDatas.length === 0) {
            this.operations[0].disabled = true;
          } else {
            this.operations[0].disabled = false;
          }
          this.checkedIds = this.sortCheckedIds();
          this.handleCheckedChange(this.checkedIds);
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getAllSpecificationList(categorySpecifications) {
      let table = [];
      categorySpecifications.forEach((element, i) => {
        table.push({
          id: element.id,
          name: element.name,
          type: element.type,
          sort: element.sort,
          options: this.getSpecificationValueOptions(element.specificationValueData),
          checked: false
        });
      });
      return table;
    },
    getSpecificationValueOptions(specificationValueData) {
      let table = [];
      specificationValueData.forEach((element, i) => {
        table.push({
          id: element.id,
          name: element.name,
          sort: element.sort,
          image: element.image,
          specificationId: element.specificationId
        });
      });
      return table;
    },
    getCommodityList(allProductSpecifications) {
      let table = [];
      allProductSpecifications.forEach((element, i) => {
        table.push({
          productId: element.productData.id,
          specificationValueData: this.getCommoditySpecificationValueData(element.specificationValueDatas)
        });
      });
      return table;
    },
    getCommoditySpecificationValueData(specificationValueDatas) {
      let table = [];
      specificationValueDatas.forEach((element, i) => {
        this.addCheckedIds(element.specificationId);
        table.push({
          id: element.id,
          name: element.name,
          sort: element.sort,
          image: element.image,
          specificationId: element.specificationId
        });
      });
      return table;
    },
    addCheckedIds(specificationId) {
      let index = this.checkedIds.findIndex(id => id === specificationId);
      if (index === -1) {
        this.checkedIds.push(specificationId);
      }
    },
    sortCheckedIds() {
      let table = [];
      this.allSpecificationList.forEach((specification, i) => {
        let index = this.checkedIds.findIndex(id => id === specification.id);
        if (index !== -1) {
          table.push(this.checkedIds[index]);
        }
      });
      return table;
    },
    update() {
      let param = this.getAllProductSpecificationsParams();
      if (this.hasProductWithSameSpecification(param)) {
        this.$message.warning('不能创建相同的商品规格');
        return;
      }
      SpecificationService.updateSpecificationGroups(
        param,
        data => {
          this.$message.success('更新商品规格成功');
          this.query();
          this.$emit('operationSuccess');
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    hasProductWithSameSpecification(param) {
      let isSame = false;
      param.forEach((commodity1st, i) => {
        if (isSame === true) {
          return;
        }
        param.forEach((commodity2nd, i) => {
          if (isSame === true) {
            return;
          }
          if (commodity1st.productData.id === commodity2nd.productData.id) {
            return;
          }
          if (this.isSameSpecificationValueDatas(commodity1st.specificationValueDatas, commodity2nd.specificationValueDatas)) {
            isSame = true;
          }
        });
      });
      return isSame;
    },
    isSameSpecificationValueDatas(orgArray, dstArray) {
      let isSame = true;
      orgArray.forEach((org, i) => {
        let index = dstArray.findIndex(dst => dst.id === org.id);
        if (index === -1) {
          isSame = false;
        }
      });
      return isSame;
    },
    getAllProductSpecificationsParams() {
      let table = [];
      this.commodityList.forEach((commodity, i) => {
        table.push({
          productData: this.getProductDataParams(commodity.productId),
          specificationValueDatas: this.getSpecificationValueDatasaParams(commodity.specificationValueData)
        });
      });
      return table;
    },
    getProductDataParams(productId) {
      return {
        id: productId,
        parameterGroups: [],
        productImages: [],
        productImageDatas: [],
        reviews: [],
        specificationGroups: []
      };
    },
    getSpecificationValueDatasaParams(specificationValueData) {
      let table = [];
      specificationValueData.forEach((specificationValue, i) => {
        let index = this.checkedIds.findIndex(id => id === specificationValue.specificationId);
        if (index !== -1) {
          table.push({
            id: specificationValue.id,
            name: specificationValue.name,
            image: specificationValue.image,
            sort: specificationValue.sort,
            specificationId: specificationValue.specificationId
          });
        }
      });
      return table;
    },
    operateHandler(name) {
      this[name]();
    },
    rowDeleteClickHandler(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(row.productId);
          let params = {
            ids: ids
          };
          this.commodityList.splice(this.commodityList.indexOf(row), 1);
          CommodityMgmtService.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('operationSuccess');
              if (row.productId === this.id) {
                this.$emit('close');
              } else {
                this.query();
              }
            },
            ErrorData => {
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    addSpecificationCommodityOperation() {
      if (!this.showEditOperationColumn) {
        this.$message.warning('请选择商品规格');
        return false;
      }
      let newCommodity = {
        productId: '',
        specificationValueData: this.getNewSpecificationValueList()
      };
      this.commodityList.push(newCommodity);
    },
    getNewSpecificationValueList() {
      // 只增加当前选中的规格值
      let specificationValueList = [];
      this.checkedIds.forEach((checkedId, i) => {
        let index = this.allSpecificationList.findIndex(specification => specification.id === checkedId);
        if (index !== -1) {
          specificationValueList.push({
            id: '',
            name: '',
            image: '',
            sort: '',
            specificationId: this.allSpecificationList[index].id
          });
        }
      });
      return specificationValueList;
    },
    handleCheckedChange(checkedIds) {
      this.allSpecificationList.forEach((specification, i) => {
        let index = checkedIds.findIndex(id => id === specification.id);
        if (index === -1) {
          this.allSpecificationList[i].checked = false;
        } else {
          this.allSpecificationList[i].checked = true;

          // 如果当前商品中没有新增列，对所有商品追加新增列
          this.AddNewColumn2Commodity(this.allSpecificationList[i]);
          return true;
        }
      });
      this.showEditOperationColumn = this.hasCheckedSpecification();
    },
    hasCheckedSpecification() {
      let hasChecked = false;
      this.allSpecificationList.forEach((item, i) => {
        if (item.checked) {
          hasChecked = true;
        }
      });
      return hasChecked;
    },
    AddNewColumn2Commodity(newSpecification) {
      this.commodityList.forEach((commodity, i) => {
        let index = commodity.specificationValueData.findIndex(
          specificationValue => specificationValue.specificationId === newSpecification.id
        );
        if (index === -1) {
          commodity.specificationValueData.push({
            id: '',
            name: '',
            image: '',
            sort: '',
            specificationId: newSpecification.id
          });
        }
      });
    },
    saveSpecificationEditOperation() {
      this.update();
    },
    cancelSpecificationEditOperation() {
      this.checkedIds = [];
      this.commodityList = [];
      this.showEditOperationColumn = false;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__specification {
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
}
.spec-dialog {
  width: 700px;
  .dialog-div {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
    .el-form-item.isRequired .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .el-dialog__header {
    text-align: center;
  }
}
</style>
