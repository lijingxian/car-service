<template>
  <div class="store-vehicle-picker">
    <biz-dialog-selector
      slot="float"
      title="选择竞品"
      selectionMode="single"
      :visibility.sync="showDialog"
      :loading="dialogLoading"
      :tableData="tableData"
      :pagination="dialogPagination"
      :keyField="'id'"
      :selectionKeys="selectionKeys"
      :filters="dialogFilters"
      @confirmed="confirmedHandler"
      @open="openedHandler"
      @filterDataChange="dialogFilterDataChange"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      :isClear="false"
      @active-item-change="activeItemChange"
      @cascaderChange="cascaderChange"
    >
      <el-table-column prop="brandName" label="品牌"></el-table-column>
      <el-table-column prop="seriesName" label="系列"></el-table-column>
      <el-table-column prop="type" label="车型"></el-table-column>
    </biz-dialog-selector>
  </div>
</template>

<script>
import BizDialogSelector from './components/BizDialogSelector';
import { membershipMgmt as shop } from '@/common/urls';
import service from '@/service/vehicle-mgmt/Component';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'StoreVehiclePicker',
  components: {
    BizDialogSelector
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array
    },
    // fleetId: {
    //   type: String
    // },
    all: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      showDialog: false,
      dialogLoading: false,
      selectionKeys: [],
      tableData: [],
      brandId: '',
      seriesId: '',
      brandsData: [],
      seriesData: [],
      dialogPagination: {
        pageSize: 50,
        currentPage: 1,
        pageSizes: [50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'select',
          label: '店铺名称',
          name: 'shopName',
          value: '',
          options: [],
          class: 'hidden'
        },
        {
          type: 'cascader',
          label: '品牌系列',
          filterable: false,
          name: 'brandSeries',
          value: [],
          options: []
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    textComputed() {
      return '已选择 ' + this.value.length + ' 辆车';
    }
  },
  created() {
    this.queryShopList();
  },
  methods: {
    // getMotorcadeId() {
    //   return this.$route.params.groupId || this.fleetId;
    // },
    getBrand() {
      http
        .get('/admin/baseData/carType.jhtml', {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.brandsData = data.brands;
          this.setBrandFilters();
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    setBrandFilters() {
      let options = [
        {
          value: '',
          label: '全部'
        }
      ];

      this.brandsData.forEach(category => {
        options.push({ value: category.id, label: category.name, children: [] });
      });

      this.dialogFilters[1].options = options;
    },
    activeItemChange(val) {
      let param = {
        shopId: this.getUser.shop.id,
        brandId: val.toString()
      };
      http
        .get('/admin/baseData/carType/getSeries.jhtml', param)
        .then(data => {
          this.seriesData = data.serieses;
          // this.setBrandFilters();
          let curItem = [];
          this.dialogFilters[1].options.forEach(item => {
            if (item.value === val[0]) {
              item.children = [];
              curItem = item.children;
              data.serieses.forEach(element => {
                curItem.push({ value: element.id, label: element.name });
              });
            }
          });
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    cascaderChange(val) {
      this.brandId = val[val.length - 2];
      this.seriesId = val[val.length - 1];
      // if (val.length > 1 && this.brandId === '') {
      //   this.brandId = val[val.length - 2];
      // }
      if (this.seriesId === '') {
        this.queryVehicles(this.getDialogQueryParams());
      } else {
        this.querySeriesFilters();
      }
    },
    queryShopList() {
      http
        .get(shop.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: ''
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.dialogFilters[0].value = window.top.SHOP_ID || this.getUser.shop.id;
          this.$set(this.dialogFilters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          // if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    queryVehicles(params) {
      this.dialogLoading = true;

      service.queryVehicles(
        // '/admin/fleet/listAllFleetCar.jhtml',
        '/admin/baseData/carType/list.jhtml',
        params,
        data => {
          // this.tableData = data.carList;
          this.tableData = data.carTypeList;

          this.$set(this.dialogPagination, 'total', parseInt(data.total));

          this.dialogLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');

          this.dialogLoading = false;
        }
      );
    },
    // queryBrandFilters() {
    //   http
    //     .get('/admin/baseData/baseData.jhtml', {
    //       type: '1',
    //       brandId: this.brandId,
    //     })
    //     .then(data => {
    //       this.tableData = data.dataList;
    //     })
    //     .catch(errData => {
    //       if (errData.errorMessage) this.$message.warning(errData.errorMessage);
    //     });
    // },
    querySeriesFilters() {
      http
        .get('/admin/baseData/baseData.jhtml', {
          type: '2',
          brandId: this.brandId,
          seriesId: this.seriesId,
          pageNumber: this.dialogPagination.currentPage,
          pageSize: this.dialogPagination.pageSize
        })
        .then(data => {
          this.tableData = data.dataList;
          data.dataList.forEach(item => {
            for (const brand of this.brandsData) {
              if (brand.id === this.brandId) {
                item.brandName = brand.name;
              }
            }
            for (const series of this.seriesData) {
              if (series.id === this.seriesId) {
                item.seriesName = series.name;
              }
            }
            item.type = item.name;
          });
          this.$set(this.dialogPagination, 'total', parseInt(data.total));
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    clickHandler(e) {
      this.showDialog = true;
    },
    confirmedHandler(selectionKeys, selections) {
      this.showDialog = false;
      this.selectionKeys = selectionKeys;
      console.log('selectionKeys===' + selectionKeys);
      console.log('selections==' + selections[0].plateNumber);
      this.$emit('on-confirm', selectionKeys, selections[0]);
    },
    getDialogQueryParams() {
      return {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[2].value,
        // fleetId: this.all ? '' : this.getMotorcadeId(),
        shopId: this.dialogFilters[0].value || ''
      };
    },
    openedHandler() {
      this.dialogPagination.currentPage = 1;
      this.dialogFilters[2].value = '';
      this.dialogFilters[1].value = [];
      this.dialogFilters[0].value = window.top.SHOP_ID || this.getUser.shop.id;
      this.getBrand();
      this.queryVehicles(this.getDialogQueryParams());
    },
    dialogFilterDataChange(filters) {
      this.$set(this.dialogPagination, 'currentPage', 1);
      if (this.seriesId === '') {
        this.queryVehicles(this.getDialogQueryParams());
      } else {
        this.querySeriesFilters();
      }
    },
    dialogPageSizeChange(val) {
      this.$set(this.dialogPagination, 'pageSize', val);
      if (this.seriesId === '') {
        this.queryVehicles(this.getDialogQueryParams());
      } else {
        this.querySeriesFilters();
      }
    },
    dialogCurrentPageChange(val) {
      this.$set(this.dialogPagination, 'currentPage', val);
      if (this.seriesId === '') {
        this.queryVehicles(this.getDialogQueryParams());
      } else {
        this.querySeriesFilters();
      }
    }
  }
};
</script>

<style lang="scss">
</style>
