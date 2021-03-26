<template>
 <div class="shop-mgmt-nav">
   <biz-nav-card :cardData="cardData"></biz-nav-card>
 </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import http from '@/common/http';

export default {
  name: 'ShopMgmtNav',
  data () {
    return {
      navUrl: '/admin/product/queryNavigationKpi.jhtml',
      form: {
        shopBrandsCount: '0',
        productCategoryCount: '0',
        productCount: '0'
      }
    };
  },
  computed: {
    cardData: function () {
      return [
        [{
          link: '/operating/commodity-mgmt/brand',
          title: '创建商品品牌',
          tree: ['staffContent', 'staff', 'roleManage'],
          content: '维护品牌信息和该品牌的系列信息',
          bottom: [
            {
              content: '已维护品牌',
              value: this.form.shopBrandsCount,
              unit: '个'
            }
          ]
        }],
        [{
          link: '/operating/commodity-mgmt/category',
          title: '创建商品分类',
          tree: ['staffContent', 'staff', 'roleManage'],
          content: '维护商品分类，分类下的品牌，分类相关属性、参数、规格信息',
          bottom: [
            {
              content: '已维护分类',
              value: this.form.productCategoryCount,
              unit: '个'
            }
          ]
        }],
        [{
          link: '/operating/commodity-mgmt/commodity',
          title: '创建商品',
          tree: ['staffContent', 'staff', 'roleManage'],
          content: '维护店铺商品，编辑商品基本信息，详情页，商品图片以及商品规格、属性等。',
          bottom: [
            {
              content: '已有商品',
              value: this.form.productCount,
              unit: '个'
            }
          ]
        }]
      ];
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      http.get(this.navUrl, {
        shopId: window.top.SHOP_ID
      })
        .then(data => {
          Object.assign(this.form, data.data);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.shop-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
