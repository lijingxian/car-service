<template>
  <div class="financial-mgmt">
    <div class="toggle-btn" @click="isShow">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      v-loading="loading"
      ref="table"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
    >
      <el-table-column label="金融方案" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">方案名称：{{scope.row.name||'--'}}</div>
            <div class="overflow">金融机构：{{scope.row.financialInstitutionName||'--'}}</div>
            <div class="overflow">金融分类：{{scope.row.categoryName||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="方案来源" min-width="80px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.planSource||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销售价" min-width="60px" sortable="custom">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.price||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="60px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow"><span :style="{color: stateColor(scope.row)}">{{getStatus(scope.row)}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" min-width="120px">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">{{scope.row.shop.name||'--'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <biz-column-operation :row="scope.row">
            <el-button type="text" v-if="canOffsale(scope.row)" size="mini" @click.stop="soldout(scope.row.id)">下架</el-button>
            <el-button type="text" size="mini" v-if="canOnsale(scope.row)" @click.stop="putaway(scope.row.id)">上架</el-button>
            <el-button type="text" size="mini" v-if="canEdited(scope.row)" @click.stop="deleteRecommend(scope.row.id)">删除</el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <financial-popup
      slot="float"
      :open="open"
      :id="addId"
      @close="open = false;addId = '';"
      :isEdit="isEdit"
      @operationSuccess="refresh"
      :baseInfo="rowBaseInfo"
      @createdProductSuccess="createdProductSuccess"
    ></financial-popup>
    <biz-popup-tabs :open="openFc" v-model="tabSelection" @close="close">
      <el-tab-pane label="金融机构" name="0">
        <finacial-company-mgmt></finacial-company-mgmt>
      </el-tab-pane>
    </biz-popup-tabs>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import FinacialCompanyMgmt from '@/pages/sales/financial-company-mgmt/financial-company/FinancialCompanyMgmt';
import { mapGetters } from 'vuex';
import FinancialPopup from './FinancialPopup';
import { global, membershipMgmt } from '@/common/urls';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'FinancialMgmt',
  data() {
    return {
      productCategoryId: '',
      tabSelection: '0',
      rowBaseInfo: {},
      loading: false,
      showRecommend: false,
      openFc: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      importtabName: 'baseinfo',
      createVehicleTabName: 'createVehicle',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      addId: '',
      open: false,
      isEdit: true,
      openimport: false,
      createVehicle: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          disabled: true,
          label: '批量上架',
          name: 'putaway',
          type: ''
        },
        {
          disabled: true,
          label: '批量下架',
          name: 'soldout',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          disabled: true,
          label: '克隆',
          name: 'clone',
          type: ''
        },
        {
          disabled: false,
          label: '金融机构',
          name: 'financialCompanyHandle',
          type: 'primary'
        }
      ],
      filters: [
        {
          type: 'select',
          label: '分类',
          name: 'category',
          class: 'hidden',
          value: [],
          options: []
        },
        {
          type: 'select',
          label: '金融机构',
          class: 'hidden',
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '方案来源',
          class: 'hidden',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '录入', label: '录入' },
            { value: '接收', label: '接收' }
          ]
        },
        {
          type: 'select',
          label: '状态',
          class: 'hidden',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '0', label: '已创建' },
            { value: '1', label: '已提交' },
            { value: '2', label: '已上架' },
            { value: '3', label: '已下架' }
          ]
        },
        {
          type: 'select',
          label: '店铺',
          class: 'hidden',
          value: '',
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入编号/名称',
          value: ''
        }
      ],
      tableData: [],
      categoryDatas: [],
      // topCategoryId: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      sortInfo: {}
    };
  },
  components: {
    BizFlexTable,
    FinancialPopup,
    BizPopupTabs,
    FinacialCompanyMgmt
  },
  mixins: [ColumnsMixin],
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  created() {
    this.getUser();
    this.refresh();
    this.getKpi();
    this.queryFinancialFilters();
    this.queryFilters();
    this.getEditableStores();
    this.queryShopList();
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    financialCompanyHandle() {
      this.openFc = true;
    },
    // 可以上架
    close() {
      this.openFc = false;
    },
    canOnsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.onsaleable === '1' : false) : false;
    },
    // 可以下架
    canOffsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.offsaleable === '1' : false) : false;
    },
    // 可以删除、更新
    canEdited(row) {
      return row.unionConfig ? row.unionConfig.editable === '1' : false;
    },
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    financialCompany() {

    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    getKpi() {
      http
        .get('/admin/financialProductPlanController/queryFinancialProductPlanCount.jhtml', { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `已创建金融方案${data.createdCount}个`,
            duration: 3000
          });
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    createdProductSuccess(id, type) {
      this.addId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.addId = row.id;
      if (row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.open = true;
      this.rowBaseInfo = row;
    },
    // 保留两位小数（四舍五入）
    toPrice(num) {
      num = parseFloat(num)
        .toFixed(2)
        .toString()
        .split('.');
      num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,');
      return num.join('.');
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '2'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        productCategoryId: this.filters[0].value,
        state: this.filters[3].value,
        searchShopId: this.filters[4].value,
        searchValue: this.filters[5].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        financialInstitutionId: this.filters[1].value,
        source: this.filters[2].value
      };
      this.loading = true;
      http
        .get('/admin/financialProductPlanController/financialProductPlanList.jhtml', params)
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    filterDataChange(filters) {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    add() {
      this.addId = '';
      this.isEdit = true;
      this.open = true;
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      this.operations[3].disabled = true;
      this.operations[2].disabled = true;
      this.operations[5].disabled = true;
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations[1].disabled = false;
        this.operations[3].disabled = false;
        this.operations[2].disabled = false;
        this.operations[5].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 快捷操作-删除
    deleteRecommend(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        ids.push(id);
        let params = {
          ids: ids
        };
        http
          .delete('/admin/shopProduct/shopProductItem.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    soldout(id) {
      this.$confirm('是否确认下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          if (id) {
            ids.push(id);
          } else {
            for (const iterator of this.multipleSelection) {
              ids.push(iterator.id);
            }
          }
          let params = {
            ids: ids,
            state: 'false'
          };
          CommodityMgmtService.soldoutAndPutaway(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '下架成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    putaway(id) {
      this.$confirm('是否确认上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          if (id) {
            ids.push(id);
          } else {
            for (const iterator of this.multipleSelection) {
              ids.push(iterator.id);
            }
          }
          let params = {
            ids: ids,
            state: 'true'
          };
          CommodityMgmtService.soldoutAndPutaway(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '上架成功!'
              });
              this.refresh();
            },
            ErrorData => {
              console.log(ErrorData);
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        })
        .catch(() => {});
    },
    // 批量操作-删除
    deleteList() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        for (const iterator of this.multipleSelection) {
          ids.push(iterator.id);
        }
        let params = {
          ids: ids
        };
        http
          .delete('admin/shopProduct/shopProductItem.jhtml', params)
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 批量操作-克隆
    clone() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      let params = {
        ids: ids
      };
      http
        .post('/admin/financialProductPlanController/cloneProduct.jhtml', params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '克隆成功!'
          });
          this.refresh();
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    stateColor(row) {
      if (row.state === '2') {
        return '#11AE17';
      } else {
        return '#FF7300';
      }
    },
    getStatus(row) {
      switch (row.state) {
        case '0':
          return '已创建';

        case '1':
          return '已提交';

        case '2':
          return '已上架';

        case '3':
          return '已下架';
        default:
          break;
      }

      return '';
    },
    filterChange(val) {
      this.$refs.table.doLayout();
    },
    // 查询过滤器
    queryFilters() {
      http
        .get('/admin/financialProductCategory/queryFinancialProductCategoryList.jhtml', { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          data.content.forEach(element => {
            if (element.type === 'finance') {
              this.filters[0].options.push({ value: element.id, label: element.name });
            }
          });
          this.filters[0].options.splice(0, 0, {
            value: '',
            label: '全部'
          });
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
    },
    queryFinancialFilters() {
      http
        .get('/admin/financialInstitution/queryFinancialInstitutionList.jhtml', { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          data.content.forEach(financial => {
            if (financial.type === '0') {
              this.filters[1].options.push({ value: financial.id, label: financial.name });
            }
          });
          this.filters[1].options.splice(0, 0, {
            value: '',
            label: '全部'
          });
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    queryShopList() {
      http
        .get(membershipMgmt.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '4'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[4], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    }
  }
};
</script>

<style lang="scss">
.financial-mgmt {
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  img {
    height: 100px;
    width: 100px;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .selection-column {
    text-align: center;
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 40px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
