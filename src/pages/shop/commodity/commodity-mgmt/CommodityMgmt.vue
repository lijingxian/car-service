<template>
  <div class="commodity-mgmt">
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
      @closeDialogFilter = "closeDialogFilter"
      :tableData="tableData"
      :pagination="pagination"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @active-item-change="activeItemChange"
      @cascader-change="cascaderChange"
    >
      <!-- <el-table-column
        v-for="col of columns"
        :key="col.id"
        :label="col.name"
        :width="getWidth(col)"
        :sortable="getSortable(col)"
        :prop="getProp(col)"
      >
        <template slot-scope="scope">
          <div class="biz-two-column" v-if="col.id === '1'">
            <img :src="scope.row.image || defaultImg" :onerror="errorImg" />
            <div class="biz-two-row">
              <div style="margin-left: 10px;font-size:14px">{{scope.row.name}}</div>
              <div style="margin-left: 10px">编号：{{scope.row.sn}}</div>
              <div
                style="margin-left: 10px"
              >规格：{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
            </div>
          </div>
          <div v-else-if="col.id === '2'">{{scope.row.categoryName}}</div>
          <div v-else-if="col.id === '3'">{{scope.row.brandName}}</div>
          <div v-else-if="col.id === '4'">￥{{toPrice(scope.row.price)}}</div>
          <div v-else-if="col.id === '5'" class="biz-customcol">
            {{ scope.row.availableStock }}/
            <span :style="{color: stateColor(scope.row)}">{{ scope.row.stock }}</span>
          </div>
          <div v-else-if="col.id === '6'">{{scope.row.sales}}</div>
          <div v-else-if="col.id === '7'">{{getStatus(scope.row)}}</div>
          <div v-else-if="col.id === '8'">{{scope.row.shop.name}}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="shop.name" label="商品" min-width="220">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                  <img v-if="scope.row.image&&scope.row.image!==' '" :src="scope.row.image" :onerror="errorImg" />
                  <img v-else src="/resources/admin/images/default/product-default-100.png" />
                  <div class="wrapper">
                    <div class="titleClass" :title="scope.row.name">{{scope.row.sn}}</div>
                    <div class="overflow">{{scope.row.name}}</div>
                    <div class="overflow">{{scope.row.fullName&&scope.row.fullName.indexOf('[')!==-1?scope.row.fullName.split("[")[1].split("]")[0]:''}}</div>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="分类" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.categoryName}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="销售价" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              ￥{{toPrice(scope.row.price)}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="剩余库存/库存总数" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <span :style="{color: stateColor(scope.row)}">{{ scope.row.availableStock }}</span>/{{ scope.row.stock }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺" min-width="120">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name || '--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="销量" min-width="60">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.sales || '--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="状态" min-width="60">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              <span :style="{color: statusColor(scope.row)}">{{getStatus(scope.row)}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <!-- 注意，biz-column-operation里面需要使用v-if控制按钮显示逻辑 -->
          <biz-column-operation :row="scope.row">
            <el-button type="text" v-if="canOffsale(scope.row)&&hasAuthOff" size="mini" @click.stop="soldout(scope.row.id)">下架</el-button>
            <el-button type="text" size="mini" v-if="canOnsale(scope.row)&&hasAuthOn" @click.stop="putaway(scope.row.id)">上架</el-button>
            <el-button type="text" size="mini" v-if="canEdited(scope.row)&&hasAuthDel" @click.stop="deleteRecommend(scope.row.id)">删除</el-button>
            <el-button type="text" size="mini" v-if="canSubmited(scope.row)&&hasAuthEdit" @click.stop="auditTarget(scope.row)">提交</el-button>
            <el-button type="text" size="mini" v-if="canPassed(scope.row)&&hasAuthEdit" @click.stop="audit(scope.row,'1')">通过</el-button>
            <el-button type="text" size="mini" v-if="canCancel(scope.row)&&hasAuthEdit" @click.stop="audit(scope.row,'0')">取消</el-button>
            <el-button type="text" size="mini" v-if="canRevocationed(scope.row)&&hasAuthEdit" @click.stop="recallProduct(scope.row.id)">撤回</el-button>
          </biz-column-operation>
        </template>
        <!-- <template #header>
          <div class="custom-header">
            <div>操作</div>
            <i @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template> -->
      </el-table-column>
    </biz-flex-table>
    <Commodity-popup
      slot="float"
      :open="open"
      :id="addId"
      @close="open = false;addId = '';"
      :isEdit="isEdit"
      @operationSuccess="refresh"
      :baseInfo="rowBaseInfo"
      :categoryName="categoryName"
      :specName="specName"
      @createdProductSuccess="createdProductSuccess"
      :categoryType="categoryType"
      :categoryId="categoryId"
    ></Commodity-popup>
    <biz-popup-tabs :open="openimport" v-model="importtabName" @close="openimport = false;">
      <el-tab-pane label="导入商品" name="baseinfo">
        <ImportProduct
          :open="openimport"
          @operationSuccess="refresh"
          ref="openimport"
          :refreshSign="refreshSign"
          @openPoup="openPoup"
          @closePoup="closePoup"
        ></ImportProduct>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="createVehicle" v-model="createVehicleTabName" @close="createVehicle = false;">
      <el-tab-pane label="创建整车" name="createVehicle">
        <CreateVehicle :open="createVehicle" @operationSuccess="refresh"></CreateVehicle>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </div>
</template>
<script>
import { BizFlexTable } from '@/components/BizTable';
import ImportProduct from './ImportProduct';
import CommodityMgmtService from '@/service/commodity/commodity-mgmt/commodityMgmt';
import { mapGetters } from 'vuex';
import CommodityPopup from './CommodityPopup';
import { BizPopupTabs } from '@/components/BizPopup';
import CreateVehicle from './CreateVehicle';
import { global } from '@/common/urls';
import http from '@/common/http';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';

export default {
  name: 'CommodityMgmt',
  data() {
    return {
      tableId: '3',
      productCategoryId: '',
      categoryId: '',
      categoryName: '',
      rowBaseInfo: {},
      loading: false,
      defaultImg: '/resources/admin/images/default/product-default.png',
      errorImg: 'this.src="/resources/admin/images/default/product-default.png"',
      importtabName: 'baseinfo',
      createVehicleTabName: 'createVehicle',
      refreshSign: true,
      multipleSelection: [],
      editShopIds: [],
      addId: '',
      categoryType: '',
      open: false,
      isEdit: true,
      openimport: false,
      createVehicle: false,
      showRecommend: false,
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:product.add']
        },
        {
          disabled: true,
          label: '删除',
          name: 'del',
          type: '',
          auth: ['admin:product.delete']
        },
        {
          disabled: true,
          label: '批量上架',
          name: 'putaway',
          type: '',
          auth: ['admin:product.on']
        },
        {
          disabled: true,
          label: '批量下架',
          name: 'soldout',
          type: '',
          auth: ['admin:product.off']
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
          type: '',
          auth: ['admin:product.copy']
        },
        {
          label: '创建整车',
          name: 'creat',
          type: '',
          class: 'hidden'
        },
        {
          label: '导入',
          name: 'lead',
          type: '',
          auth: ['admin:product.import']
        }
      ],
      filters: [
        {
          type: 'cascader',
          label: '分类',
          name: 'category',
          filterable: false,
          value: [],
          class: 'hidden',
          options: []
        },
        // {
        //   type: 'select',
        //   label: '子分类',
        //   // name: 'category',
        //   value: '',
        //   options: []
        // },
        {
          type: 'checkBox',
          label: '品牌',
          // name: 'brand',
          value: [],
          checkAll: false,
          class: 'hidden',
          showMore: true,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '状态',
          // name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '店铺',
          // name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          showMore: true,
          isIndeterminate: true,
          options: []
        },
        {
          type: 'checkBox',
          label: '类型',
          // name: 'state',
          value: [],
          class: 'hidden',
          checkAll: false,
          isIndeterminate: true,
          options: [
            // { label: '全部', value: '' },
            { label: '普通商品', value: '0' },
            { label: '有价优惠券商品', value: '7' }
            // { label: 'sim充值', value: '3' },
            // { label: '平台服务', value: '4' },
            // { label: '短信服务', value: '5' },
            // { label: '维保', value: '6' }
          ]
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
      sortInfo: {},
      specName: ''
    };
  },
  components: {
    CommodityPopup,
    BizFlexTable,
    ImportProduct,
    BizPopupTabs,
    CreateVehicle
  },
  created() {
    this.getUser();
    this.refresh();
    this.queryFilters();
    this.getEditableStores();
    this.getDefalutImg();
    let msg = '维护店铺商品，编辑商品基本信息、详情、商品图片以及商品规格、属性等';
    this.$message({
      customClass: 'motorists-club-activity__kpi',
      showClose: true,
      message: msg,
      duration: 3000
    });
  },
  mounted() {
    this.filters[0].value = [''];
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:product.delete');
    },
    hasAuthOn() {
      // return true;
      return this.currentAuth.includes('admin:product.on');
    },
    hasAuthOff() {
      // return true;
      return this.currentAuth.includes('admin:product.off');
    },
    hasAuthEdit() {
      // return true;
      return this.currentAuth.includes('admin:product.edit');
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    ...mapGetters(['getUser']),
    closeDialogFilter(filter) {
      console.log(11);
      this.filters.map(item => {
        if (item.label === filter.label) {
          item.options = filter.options;
        }
      });
    },
    getWidth(col) {
      switch (col.id) {
        case '1':
          return '400';
        case '4':
          return '120';
        case '5':
          return '150';

        default:
          return '';
      }
    },
    getSortable(col) {
      switch (col.id) {
        case '4':
          return 'custom';
        case '5':
          return 'custom';
        case '6':
          return 'custom';

        default:
          return false;
      }
    },
    getProp(col) {
      switch (col.id) {
        case '4':
          return 'price';
        case '5':
          return 'stock';
        case '6':
          return 'sales';

        default:
          return '';
      }
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
      } else {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    // 可以提交审核操作
    canSubmited(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.deliverable === '1' : false) : false;
    },
    // 可以通过审核
    canPassed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.passable === '1' : false) : false;
    },
    // 可以取消审核
    canCancel(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.cancelable === '1' : false) : false;
    },
    // 可以上架
    canOnsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.onsaleable === '1' : false) : false;
    },
    // 可以下架
    canOffsale(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.offsaleable === '1' : false) : false;
    },
    // 可以撤回
    canRevocationed(row) {
      return row.unionConfig ? (row.unionConfig.auditConfig ? row.unionConfig.auditConfig.revocable === '1' : false) : false;
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
    createdProductSuccess(id, type) {
      this.addId = id;
      this.rowBaseInfo.productType = type;
    },
    rowClick(row) {
      this.refreshSign = !this.refreshSign;
      this.addId = row.id;
      this.categoryName = row.categoryName;
      this.categoryType = row.categoryType;
      this.categoryId = row.categoryId;
      this.specName = row.fullName.indexOf('[') !== -1 ? row.fullName.split('[')[1].split(']')[0] : '';
      if (row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.rowBaseInfo = row;
      this.open = true;
      console.log(this.specName);
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.availableStock < row.stock) {
        return '#f56c6c';
      } else {
        return '#333333';
      }
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
    getDefalutImg() {
      http
        .get('/admin/settings/settings.jhtml', {
          type: 'displaySetting'
        })
        .then(data => {
          if (data.settingList.defaultThumbnailProductImage) {
            if (data.settingList.defaultThumbnailProductImage) {
              this.defaultImg = data.settingList.defaultThumbnailProductImage;
            }
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    getList() {
      let params = {
        productCategoryId: this.productCategoryId,
        brandId: this.filters[1].value.join('&brandId='),
        state: this.filters[2].value.join('&state='),
        searchShopId: this.filters[3].value.join('&searchShopId='),
        productType: this.filters[4].value.join('&productType='),
        searchValue: this.filters[5].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        orderProperty: this.sortInfo.column || '',
        orderDirection: this.sortInfo.sort || ''
      };
      if (this.open !== true && this.openimport !== true && this.createVehicle !== true) {
        this.loading = true;
      }
      let paramsArr = [];
      for (let name in params) {
        paramsArr.push(`${name}=${params[name]}`);
      }
      http
        .get('/admin/product/union/productList.jhtml' + '?' + paramsArr.join('&'))
        .then(data => {
          this.tableData = data.content;
          // console.log(data);
          this.pagination.total = Number(data.total);
          // this.tableData = data.content;
          this.loading = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    filterDataChange(filters) {
      console.log(filters);
      this.pagination.currentPage = 1;
      this.refresh();
    },
    lead() {
      this.$refs.openimport.handleImportCar();
    },
    openPoup() {
      this.openimport = true;
    },
    closePoup() {
      this.openimport = false;
    },
    creat() {
      this.createVehicle = true;
    },
    add() {
      this.addId = '';
      this.isEdit = true;
      this.open = true;
    },
    cascaderChange(val) {
      if (val.length === 0) {
        this.productCategoryId = '';
        this.filters[0].value = [''];
      } else {
        this.productCategoryId = val[val.length - 1];
        if (val.length > 1 && this.productCategoryId === '') {
          this.productCategoryId = val[val.length - 2];
        }
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
    handleSelectionChange(val) {
      this.operations.map(item => {
        if (item.name === 'del' || item.name === 'putaway' || item.name === 'soldout' || item.name === 'clone') {
          item.disabled = true;
        }
      });
      if (val.length > 0 || this.getUser().roleLevel !== 'shop') {
        this.operations.map(item => {
          if (item.name === 'del' || item.name === 'putaway' || item.name === 'soldout' || item.name === 'clone') {
            item.disabled = false;
          }
        });
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
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          let params = {
            ids: ids
          };
          CommodityMgmtService.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
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
    del() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          for (const iterator of this.multipleSelection) {
            ids.push(iterator.id);
          }
          let params = {
            ids: ids
          };
          CommodityMgmtService.delete(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    audit(model, state) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            eventId: model.id,
            type: '2',
            unionStore: model.unionStore,
            mainStore: model.mainStore,
            state: state
          };
          CommodityMgmtService.audit(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    auditTarget(model) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            eventId: model.id,
            type: '2',
            unionStore: model.unionStore,
            mainStore: model.mainStore
          };
          CommodityMgmtService.auditTarget(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
    },
    recallProduct(id) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: id
          };
          CommodityMgmtService.recallProduct(
            params,
            data => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.refresh();
            },
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
              console.log(ErrorData);
            }
          );
        })
        .catch(() => {});
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
      CommodityMgmtService.cloneProduct(
        params,
        data => {
          this.$message({
            type: 'success',
            message: '克隆成功!'
          });
          this.refresh();
        },
        ErrorData => {
          console.log(ErrorData);
          this.$message.error(ErrorData.errorMessage);
        }
      );
    },
    statusColor(row) {
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
      let params = { shopId: window.top.SHOP_ID || '' };
      CommodityMgmtService.queryFilters(
        params,
        data => {
          this.categoryDatas = data.categoryDatas;
          this.setCategoryFilters();
          // this.setSubCategoryFilters();
          this.setBrandFilters(data.brandDatas);
          this.setStateFilters(data.states);
          this.setStoreFilters(data.storeDatas);
        },
        ErrorData => {
          if (ErrorData.errorMessage !== '') {
            this.$message.error(ErrorData.errorMessage);
          }
          console.log('获取过滤器失败', params);
        }
      );
    },
    handleSortChange(column) {
      console.log('column', column);
      this.sortInfo = {
        column: column.prop,
        sort: column.order ? (column.order === 'ascending' ? 'asc' : 'desc') : undefined
      };

      this.getList();
    },
    setCategoryFilters() {
      let options = [
        // {
        //   value: '',
        //   label: '全部'
        // }
      ];

      this.categoryDatas.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [{ label: '全部', value: '' }] });
      });

      this.filters[0].options = options;
    },
    setBrandFilters(brandDatas) {
      this.filters[1].options = brandDatas.map(brand => {
        return { value: brand.id, label: brand.name };
      });
      // this.filters[1].options.splice(0, 0, {
      //   value: '',
      //   label: '全部'
      // });
    },
    setStateFilters(states) {
      this.filters[2].options = states.map(state => {
        return { value: state.id, label: state.name };
      });
      // this.filters[2].options.splice(0, 0, {
      //   value: '',
      //   label: '全部'
      // });
    },
    setStoreFilters(storeDatas) {
      this.filters[3].options = storeDatas.map(store => {
        return { value: store.id, label: store.name };
      });
      // this.filters[3].options.splice(0, 0, {
      //   value: '',
      //   label: '全部'
      // });
    }
  }
};
</script>

<style lang="scss">
.commodity-mgmt {
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 18px;
    }
  }
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
}
</style>
