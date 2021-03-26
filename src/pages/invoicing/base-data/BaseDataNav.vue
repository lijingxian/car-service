<template>
  <div class="base-data-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
    <div class="biz-nav-card" style="margin-top:-30px;">
      <div class="nav-card-row">
        <div class="card-group" v-for="(cardGroupSec, index) in cardDataSec" :key="cardGroupSec.index">
          <div class="upper-content">
            <div class="card-box">
              <div class="nav-card" v-for="card in cardGroupSec" :key="card.index" @click="routeChange(card.link, card.tree)"
                v-show="card.show">
                <div class="step">{{ (Array(2).join(0) + (index + 1)).slice(-2) }}</div>
                <div class="title">{{ card.title }}</div>
                <div class="content">
                  <p v-for="content in cardContent(card.content)" :key="content.index">{{ content }}</p>
                </div>
                <div class="bottom-content">
                  <div class="bottom" v-for="item in card.bottom" :key="item.index" @click.stop="routeChange(item.link)">
                    {{ item.content }}:
                    <div class="count">{{ item.value || '0' }}{{ item.unit }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';

export default {
  name: 'BaseDataNav',
  data() {
    return {
      navUrl: '/admin/invoicing/purchase/queryBaseDataKpi.jhtml',
      form: {
        productCategoryCount: 0,
        shopBrandsCount: 0,
        productCount: 0,
        supplierCount: 0,
        agentCount: 0,
        currentDepotCount: 0
      },
      authorities: [],
      cardDataSec: []
    };
  },
  computed: {
    cardData: function() {
      let arr = [];
      if (this.authorities.includes('admin:PurchaseSaleStorage.brand')) {
        arr.push([{
          link: this.authorities.includes('admin:PurchaseSaleStorage.brand') ? '/invoicing/base-data/brand' : '',
          title: '创建商品品牌',
          content: ['维护品牌信息和该品牌的系列信息'],
          show: this.authorities.includes('admin:PurchaseSaleStorage.brand'),
          bottom: [
            {
              content: '已维护品牌',
              value: this.form.shopBrandsCount,
              unit: '个'
            }
          ]
        }]);
      }
      if (this.authorities.includes('admin:PurchaseSaleStorage.productCategory')) {
        arr.push([{
          link: this.authorities.includes('admin:PurchaseSaleStorage.productCategory') ? '/invoicing/base-data/category' : '',
          title: '创建商品分类',
          content: ['新建、导入、维护商品分类，以及分类下的参数、属性、规格信息'],
          show: this.authorities.includes('admin:PurchaseSaleStorage.productCategory'),
          bottom: [
            {
              content: '已维护分类',
              value: this.form.productCategoryCount,
              unit: '个'
            }
          ]
        }]);
      }
      if (this.authorities.includes('admin:PurchaseSaleStorage.product')) {
        arr.push([{
          link: this.authorities.includes('admin:PurchaseSaleStorage.product') ? '/invoicing/base-data/product' : '',
          title: '创建商品',
          content: ['新建、导入、维护商品的基本信息、图文详情、参数、属性、规格'],
          show: this.authorities.includes('admin:PurchaseSaleStorage.product'),
          bottom: [
            {
              content: '已有商品',
              value: this.form.productCount,
              unit: '个'
            }
          ]
        }]);
      }
      return arr;
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      http
        .get(this.navUrl, {})
        .then(data => {
          this.form = data.data;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          this.authorities = data.authorities;
          this.cardDataSec = [
            [
              {
                link: this.authorities.includes('admin:Warehouse') ? '/invoicing/base-data/store-house' : '',
                title: '创建仓库',
                content: ['新建、维护仓库，创建仓库后您可进行仓库的出入库管理、库存盘点和库存调拨业务'],
                bottom: [
                  {
                    content: '已有仓库',
                    value: this.form.currentDepotCount,
                    unit: '个'
                  }
                ],
                show: this.authorities.includes('admin:Warehouse')
              },
              {
                link: '/invoicing/base-data/agent',
                title: '创建代理商',
                content: ['创建代理商后，代理商可以登录您门店的商城进行货品采购'],
                show: this.authorities.includes('admin:agent'),
                bottom: [
                  {
                    content: '已有代理商',
                    value: this.form.agentCount,
                    unit: '个'
                  }
                ]
              },
              {
                link: this.authorities.includes('admin:Supplier') ? '/invoicing/base-data/supplier' : '',
                title: '创建供应商',
                content: ['创建供应商后，供应商可以维护所提供的供应商商品数据，在此基础上您可向供应商进行采购'],
                show: this.authorities.includes('admin:Supplier'),
                bottom: [
                  {
                    content: '已有供应商',
                    value: this.form.supplierCount,
                    unit: '个'
                  }
                ]
              }
            ]
          ];
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    cardContent(content) {
      if (Array.isArray(content)) {
        return content;
      } else if (typeof content === 'string') {
        return [content];
      }
    },
    cardClick(link) {
      if (link) {
        this.$router.push(link);
      }
    },
    routeChange(link, tree) {
      if (link) {
        this.$router.push({ path: link });
      }
      // tree: [当前级别菜单id, 上级菜单id, 当前类别id]
      // tree[1]
      // |-tree[0]
      //   |-tree[2]
      if (tree && tree[0]) {
        if (
          parent.window.document.getElementById(tree[0]) &&
          parent.window.document.getElementById(tree[0]).style.display === 'none'
        ) {
          if (tree[1] && parent.window.document.getElementById(tree[1])) {
            parent.window.document.getElementById(tree[1]).click();
          }
          if (tree[2] && parent.window.document.getElementById(tree[2])) {
            parent.window.document.getElementById(tree[2]).click();
          }
        } else {
          if (tree[2] && parent.window.document.getElementById(tree[2])) {
            parent.window.document.getElementById(tree[2]).click();
          }
        }
      }
    }
  },
  mounted() {
    this.getNavInfo();
    setTimeout(() => {
      this.listAuthority();
    }, 500);
  }
};
</script>

<style lang="scss">
.base-data-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
  .biz-nav-card {
    .nav-card-row {
      display: -webkit-inline-box;
    }
  }
  .nav-card-row {
    justify-content: space-around;
    &:nth-child(even) {
      flex-direction: row-reverse;
    }
  }
  .card-group {
    min-width: 337px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upper-content {
    display: flex;
    align-items: center;
  }
  .nav-card {
    width: 282px;
    min-height: 217px;
    margin: 35px 28.5px;
    border-radius: 2px;
    box-shadow: 0px 0px 5px 1px #e5e5e5;
    position: relative;
    cursor: pointer;
    .title {
      width: 286px;
      padding: 20px 38px 0 28px;
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .step {
      width: 46px;
      height: 46px;
      border-radius: 50px;
      border: 5px solid #ff7300;
      color: #ff7300;
      background-color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 36px;
      position: absolute;
      top: -20px;
      left: -20px;
      display: none;
    }
    .content {
      padding: 10px 20px 10px 28px;
      color: #666;
      font-size: 12px;
      word-wrap: break-word;
      height: 70px;
      p {
        margin: 0;
      }
    }
    .line {
      width: 222px;
      height: 1px;
      background-color: #e5e5e5;
      margin: 0 auto;
      margin-left: 15px;
    }
    .bottom-content {
      background: #fafafa;
      height: 135px;
    }
    .bottom {
      padding: 10px 20px 0 28px;
      font-size: 12px;
      justify-content: space-between;
      display: flex;
      color: #666;
    }
    .count {
      color: #ff7300;
    }
  }
  .biz-nav-card .nav-card {
    min-height: 37px;
  }
  .biz-nav-card .nav-card {
    min-height: 37px;
  }
  .biz-nav-card-isFourLine .nav-card {
    min-height: 37px;
  }
}
</style>
