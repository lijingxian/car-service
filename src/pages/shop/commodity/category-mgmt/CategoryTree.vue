<template>
  <biz-grid class="category-tree">
    <div v-for="(treeData,index) in tableData" :key="index">
      <vue2-org-tree
          :data="treeData"
          :horizontal="true"
          collapsable
          :label-class-name="labelClassName"
          :render-content="renderContent"
          selected-class-name="bg-tomato"
          selected-key="selectedKey"
          @on-expand="onExpand"
          @on-node-click="onNodeClick"
        />
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import CategoryMgmtService from '@/service/commodity/category-mgmt/categoryMgmt';
import { mapGetters } from 'vuex';
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
  name: 'CategoryMgmt',
  data() {
    return {
      expandAll: true,
      tableData: [],
      treeDate: {}
    };
  },
  computed: {},
  components: {
    BizGrid
  },
  created() {
    this.refresh();
    this.toggleExpand(this.treeDate, true);
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    refresh() {
      this.getList();
    },
    labelClassName: function(data) {
      return 'label-class';
    },
    renderContent: function(h, data) {
      data.logo = logo[data.type];
      return (
        <span>
          <span>
            <div>
              <img src={data.logo} style="width:50px;height:50px"/>
              <div style="font-size:14px">{data.label.length > 4 ? data.label.substr(0, 4) + '...' : data.label}</div>
            </div>
          </span>
        </span>);
    },
    onExpand: function(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, 'expand', true);
      }
    },
    onNodeClick: function(e, data) {
      console.log('onNodeClick: %o', data);
      this.$set(data, 'selectedKey', !data.selectedKey);
    },
    collapse: function(list) {
      let _this = this;
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false;
        }
        child.children && _this.collapse(child.children);
      });
    },
    toggleExpand: function(data, val) {
      let _this = this;
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val);
          if (item.children) {
            _this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, 'expand', val);
        if (data.children) {
          _this.toggleExpand(data.children, val);
        }
      }
    },
    getList() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      if (this.open !== true && this.inputPopupOpen !== true) {
        this.loading = true;
      }
      CategoryMgmtService.getProductCategoryList(
        params,
        data => {
          this.tableData = data.ProductCategoryManage;
          this.tableData.forEach(item => {
            item.label = item.name;
            if (item.childrenProductCategoryDataList) {
              item.children = item.childrenProductCategoryDataList;
              for (const iterator of item.children) {
                iterator.label = iterator.name;
              }
            }
          });
          this.toggleExpand(this.tableData, true);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style lang="scss">
.org-tree-container {
  padding: 0px;
}
.horizontal .org-tree-node-label {
  width: 100px;
  height: 100px;
}
.category-tree {
}
</style>
