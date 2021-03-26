<template>
  <biz-grid class="category-mgmt__specification">
    <biz-save-button slot="top" :operations="operations" @operate="operateHandler" v-if="isEdit">
    </biz-save-button>
    <div class="des" style="font-size:12px">如您需要修改/新增当前商品的分类规格请至商品分类功能 <el-button type="text" style="font-size:12px" @click="editCategory">去编辑>></el-button></div>
    <el-form size="small" :disabled="!isEdit" :inline-message="true">
      <label size="small" style="margin-left: 10px">请选择商品规格：</label>
      <div style="margin: 15px;"></div>
      <el-form-item>
        <el-checkbox-group v-model="checkedIds" @change="handleCheckedChange" style="margin-left: 10px">
          <el-checkbox v-for="item in allSpecificationList" :label="item.id" :key="item.name">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-table :data="commodityList" style="width: 100%">
      <el-table-column v-for="specification in allSpecificationList" :label="specification.name" :key="specification.id" v-if="specification.checked">
        <template slot-scope="scope">
          <div v-for="valueItem in scope.row.specificationValueData" :label="valueItem.name" :key="valueItem.id">
            <el-select v-model="valueItem.id" placeholder="请选择" v-show="specification.id === valueItem.specificationId">
              <el-option v-for="opt in specification.options" :key="opt.id" :label="opt.name" :value="opt.id">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="showEditOperationColumn">
        <template slot-scope="scope" v-if="isEdit">
          <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';

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
          label: '增加规格商品',
          name: 'addSpecificationCommodityOperation',
          type: 'primary',
          disabled: true,
          auth: ['admin:PurchaseSaleStorage.product.edit']
        },
        {
          label: '保存',
          name: 'saveSpecificationEditOperation',
          type: 'primary',
          auth: ['admin:PurchaseSaleStorage.product.edit']
        }
      ],
      checkedIds: [],
      allSpecificationList: [],
      commodityList: []
    };
  },
  computed: {},
  props: {
    itemId: {
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
      default () {
        return true;
      }
    },
    categoryId: {
      type: String,
      default: ''
    }
  },
  watch: {
    tabSelection(val) {
      if (val === 'specification') {
        if (this.itemId !== '') {
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
      this.$router.push({ path: '/invoicing/base-data/category', query: { id: this.categoryId, from: 'specification' } });
    },
    query() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        id: this.itemId
      };
      SpecificationService.getSpecificationGroups(
        params,
        data => {
          this.allSpecificationList = this.getAllSpecificationList(
            data.categorySpecifications
          );

          if (this.allSpecificationList.length > 0) {
            this.operations[0].disabled = false;
          } else {
            this.operations[0].disabled = true;
          }
          this.commodityList = this.getCommodityList(
            data.allProductSpecifications
          );
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
          options: this.getSpecificationValueOptions(
            element.specificationValueData
          ),
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
          specificationValueData: this.getCommoditySpecificationValueData(
            element.specificationValueDatas
          )
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
          if (
            this.isSameSpecificationValueDatas(
              commodity1st.specificationValueDatas,
              commodity2nd.specificationValueDatas
            )
          ) {
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
          specificationValueDatas: this.getSpecificationValueDatasaParams(
            commodity.specificationValueData
          )
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
        let index = this.checkedIds.findIndex(
          id => id === specificationValue.specificationId
        );
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
              if (row.productId === this.itemId) {
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
        let index = this.allSpecificationList.findIndex(
          specification => specification.id === checkedId
        );
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
          specificationValue =>
            specificationValue.specificationId === newSpecification.id
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
    }
  }
};
</script>

<style lang="scss">
.category-mgmt__specification {
  .des {
    font-size: 14px;
    span {
      color: #ff7300;
      cursor: pointer;
    }
  }
  .biz-save-button {
    margin-top: 5px;
    justify-content: flex-start;
  }
}
</style>
