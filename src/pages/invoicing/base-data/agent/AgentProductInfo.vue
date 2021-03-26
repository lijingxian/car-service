<template>
  <div class="agent-product-info">
    <biz-grid>
      <biz-flex-table
        ref="table"
        :operations="operations"
        :filters="filters"
        :tableData="tableData"
        :loading="loading"
        :pagination="pagination"
        @operate="operatePw"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        @filter-data-change="handleFilterDataChange"
        @selection-change="handleSelectionChange"
        @active-item-change="activeItemChange"
        @cascader-change="cascaderChange"
      >
        <el-table-column label="商品名称" prop="fullName" min-width="130"></el-table-column>
        <el-table-column prop="barCode" label="条码"></el-table-column>
        <el-table-column prop="categoryName" label="分类" min-width="80"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="supplier.name" label="供应商">
          <template slot-scope="scope">{{scope.row.supplier?scope.row.supplier.name:''}}</template>
        </el-table-column>
        <el-table-column prop="grade" label="价格等级" :formatter="getGrade"></el-table-column>
        <el-table-column prop="tag" label="操作" width="60">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click.stop="rowClick(scope.row)" :disabled="!isEdit">编辑</el-button>
              <el-button type="text" size="mini" @click.stop="deleteLine(scope.row)" :disabled="!isEdit">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </biz-flex-table>
      <el-dialog :visible.sync="showProductAgentWay" center append-to-body custom-class="product-dialog" v-loading="loading">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px" size="small" v-loading="loading" :inline-message="true">
          <el-form-item label="商品价格等级" prop="grade">
            <el-radio v-model="form.grade" label="0">一级</el-radio>
            <el-radio v-model="form.grade" label="1">二级</el-radio>
            <el-radio v-model="form.grade" label="2">三级</el-radio>
          </el-form-item>
          <el-form-item label="代理商品范围" prop="productAgentWay" :error="errAdmit">
            <el-radio v-model="form.productAgentWay" label="0">全部</el-radio>
            <el-radio v-model="form.productAgentWay" label="2">按品牌</el-radio>
            <el-radio v-model="form.productAgentWay" label="1">按分类</el-radio>
            <el-radio v-model="form.productAgentWay" label="4">按供应商</el-radio>
            <el-radio v-model="form.productAgentWay" label="3">按商品</el-radio>
            <product-agent-way :productAgentWay="form.productAgentWay" v-model="selectedItems" :baseInfo="baseInfo"></product-agent-way>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="operationsPw" @operate="operatePw"></biz-save-button>
      </el-dialog>
      <el-dialog :visible.sync="showForm" center append-to-body width="500px">
        <el-form ref="formModel" :model="formModel" label-width="120px" size="small">
          <el-form-item label="商品名称" prop="productAgentWay">
            <el-input type="text" v-model="formModel.name" disabled />
          </el-form-item>
          <el-form-item label="商品价格等级" prop="grade">
            <el-radio v-model="formModel.grade" label="0">一级</el-radio>
            <el-radio v-model="formModel.grade" label="1">二级</el-radio>
            <el-radio v-model="formModel.grade" label="2">三级</el-radio>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="operationsEdit" @operate="operatePw"></biz-save-button>
      </el-dialog>
    </biz-grid>
  </div>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizFlexTable } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';
import productAgentWay from './components/ProductAgentWay.vue';
import http from '@/common/http';
import urls from '@/common/urls';
import comUrls from './components/urls.js';
import { mapGetters } from 'vuex';
import service from '@/service/activity-mgmt/promotion-mgmt/PromotionContent';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
// import urls from '@/common/urls';
import axios from 'axios';
export default {
  name: 'agentProductInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    grade: {
      type: String,
      default() {
        return '';
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      errAdmit: '',
      // 已选中商品列表
      selectedItems: [],
      tableData: [],
      selections: [],
      categoryDatas: [],
      showForm: false,
      rules: {
        productAgentWay: [{ required: true, message: '请选择代理商品范围', trigger: 'blur' }]
      },
      form: this.setOriginFormData(),
      baseInfo: {
        shop: {
          name: ''
        }
      },
      formModel: {
        name: '',
        grade: '0'
      },
      loading: false,
      showProductAgentWay: false,
      productCategoryId: '',
      operations: [
        {
          label: '选择商品',
          name: 'selectProduct',
          type: 'primary',
          class: 'hidden'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '导出',
          name: 'exportExcle',
          type: ''
        }
      ],
      operationsPw: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      operationsEdit: [
        {
          label: '保存',
          name: 'saveEdit',
          type: 'primary'
        },
        {
          label: '取消',
          name: 'cancle',
          type: ''
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '品牌',
          name: 'brand',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '供应商',
          name: 'supplier',
          value: '',
          options: []
        },
        {
          type: 'select',
          placeholder: '请选择价格等级',
          label: '价格等级',
          value: '',
          options: [
            { label: '全部', value: '' },
            { label: '一级', value: '0' },
            { label: '二级', value: '1' },
            { label: '三级', value: '2' }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称/条码',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  methods: {
    ...mapGetters(['getUser']),
    handleOperate(name) {
      this[name]();
    },
    operatePw(name) {
      this[name]();
    },
    setOriginFormData() {
      return {
        productAgentWay: '',
        grade: '0'
      };
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      this.selections = val;
      if (val.length > 0 && this.isEdit === true) {
        this.operations[1].disabled = false;
      }
    },
    clear() {
      this.form = this.setOriginFormData();
      this.$refs.form.resetFields();
    },
    cancle() {
      this.showForm = false;
    },
    getGrade(row) {
      switch (row.grade) {
        case '0':
          return '一级';
        case '1':
          return '二级';
        case '2':
          return '三级';
        default:
          break;
      }
    },
    queryFilters() {
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          this.setBrandFilters();
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    querySupplierList() {
      this.loading = true;
      let params = {
        shopId: window.top.SHOP_ID || '',
        cooperationType: '0',
        state: ''
      };
      http
        .get(urls.invoicing.supplierMgmt.shopSupplierList, params)
        .then(data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    cascaderChange(val) {
      this.productCategoryId = val[val.length - 1];
      if (val.length > 1 && this.productCategoryId === '') {
        this.productCategoryId = val[val.length - 2];
      }
      this.refresh();
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser().shop.id,
        parentId: val.toString()
      };
      http
        .get('/admin/shopProduct/productCategorys.jhtml', param)
        .then(data => {
          this.setCategoryFilters();
          let curItem;
          this.filters[0].options.forEach(item => {
            if (item.value === val[0]) {
              curItem = item.children;
            }
          });
          data.dateList.forEach(element => {
            curItem.push({ value: element.id, label: element.name });
          });
        })
        .catch(() => {});
    },
    setCategoryFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
      });

      this.filters[0].options = options;
    },
    setBrandFilters() {
      let params = {
        searchProperty: 'name',
        searchValue: '',
        pageNumber: 1,
        pageSize: 1000
      };
      http
        .get(comUrls.queryBrandList, params)
        .then(data => {
          this.filters[1].options = data.Brand.map(brand => {
            return { value: brand.id, label: brand.name };
          });
          this.filters[1].options.splice(0, 0, {
            value: '',
            label: '全部'
          });
        })
        .catch();
    },
    getSelectedBrandId() {
      return this.filters[1].value;
    },
    rowClick(row) {
      console.log(row);
      this.showForm = true;
      this.formModel.name = row.name;
      this.formModel.id = row.id;
      this.formModel.grade = row.grade;
    },
    refresh() {
      if (this.isEdit === true) {
        this.operations[0].class = 'show';
        this.operations[1].disabled = false;
        this.operations[2].disabled = false;
      } else {
        this.operations[0].class = 'hidden';
        this.operations[1].disabled = true;
        this.operations[2].disabled = true;
      }
      let params = {
        cooperationId: this.itemId.id,
        brandId: this.getSelectedBrandId(),
        supplierId: this.filters[2].value,
        productCategoryId: this.productCategoryId,
        grade: this.filters[3].value,
        searchValue: this.filters[4].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      http
        .get('/admin/invoicingProduct/productCooperations.jhtml', params)
        .then(data => {
          this.tableData = data.data.products;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async exportExcle() {
      let params = {
        shopId: this.getUser().shop.id,
        cooperationId: this.itemId.id,
        brandId: this.getSelectedBrandId(),
        supplierId: this.filters[2].value,
        productCategoryId: this.productCategoryId,
        grade: this.filters[3].value,
        searchValue: this.filters[4].value,
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage
      };
      try {
        let response = await axios.post('/admin/invoicingProduct/agentProducts/export.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        console.log(decodeURI(response.headers['content-disposition']));
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    saveEdit() {
      let params = {
        id: this.itemId.id,
        grade: this.formModel.grade,
        productAgentWay: '3',
        product: this.formModel.id
      };
      http
        .put('/admin/invoicingProduct/productCooperation.jhtml', params)
        .then(data => {
          this.refresh();
          this.$message.success('操作成功');
          this.showForm = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteLine(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          id: this.itemId.id,
          productAgentWay: '3',
          products: [row.id]
        };
        http
          .delete('/admin/invoicingProduct/productCooperation.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    delete() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        let params = {
          id: this.itemId.id,
          productAgentWay: '3',
          products: ids
        };
        http
          .delete('/admin/invoicingProduct/productCooperation.jhtml', params)
          .then(data => {
            this.refresh();
            this.$message.success('操作成功');
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    selectProduct() {
      console.log(this.grade);
      this.form.grade = this.grade;
      this.selectedItems = [];
      this.form.productAgentWay = '0';
      this.showProductAgentWay = true;
    },
    save() {
      if (
        this.form.productAgentWay &&
        this.form.productAgentWay !== '0' &&
        this.selectedItems &&
        this.selectedItems.length === 0
      ) {
        this.$message.warning('请选择代理商品范围');
        return;
      }
      this.errAdmit = '';
      this.$refs.form.validate(valid => {
        if (valid) {
          this.update();
        } else {
          return false;
        }
      });
    },
    update() {
      delete this.form.productCategories;
      delete this.form.products;
      delete this.form.shopBrands;
      delete this.form.suppliers;
      this.$set(this.form, 'id', this.itemId.id);
      let params = Object.assign(this.form, this.getSelectedItems(this.form), {});
      http
        .post('/admin/invoicingProduct/productCooperations.jhtml', params)
        .then(data => {
          this.$message.success({ message: '操作成功' });
          // this.$emit('operationSuccess');
          this.refresh();
          this.showProductAgentWay = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getBaseInfo() {
      service.queryBaseInfo(
        {},
        data => {
          this.baseInfo = data;
        },
        ErrorData => {
          console.log('ERR_GET_BASE_INFO: ', ErrorData);
          // this.$notify.warning({ message: ErrorData.errorMessage });
        }
      );
    },
    setSelectedItems(value) {
      switch (value.productAgentWay) {
        case '0':
          this.selectedItems = [];
          break;
        case '3':
          this.selectedItems = value.products || [];
          break;
        case '2':
          this.selectedItems = value.shopBrands;
          break;
        case '1':
          this.selectedItems = value.productCategories;
          break;
        default:
          this.selectedItems = [];
          break;
      }
    },
    getSelectedItems(value) {
      switch (value.productAgentWay) {
        case '0':
          return {};
        case '4':
          return {
            suppliers: this.selectedItems
          };
        case '3':
          return {
            products: this.selectedItems
            // shopBrands: [],
            // productCategories: []
          };
        case '2':
          return {
            // products: [],
            shopBrands: this.selectedItems
            // productCategories: []
          };
        case '1':
          return {
            // products: [],
            // shopBrands: [],
            productCategories: this.selectedItems
          };
        default:
          return {};
      }
    },
    clearSearchValue() {
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.filters[2].value = '';
    },
    handleFilterDataChange(val) {
      this.filters = val;
      this.pagination.currentPage = 1;
      this.refresh();
    },
    handlePageSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentPageChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  },
  mounted() {
    this.getBaseInfo();
    this.querySupplierList();
    this.itemId.id && this.refresh();
    this.queryFilters();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.queryFilters();
        this.querySupplierList();
        this.refresh();
      }
    }
  },
  components: {
    BizGrid,
    BizFlexTable,
    BizSaveButton,
    productAgentWay
  }
};
</script>

<style lang="scss">
.agent-product-info {
  .biz-grid {
    .biz-grid__content {
      .biz-scroller {
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }
  .biz-cascader {
    width: 100px !important;
  }
  .biz-pagination .el-pagination {
    .el-pagination__sizes {
      display: initial!important;
    }
  }
}
</style>
