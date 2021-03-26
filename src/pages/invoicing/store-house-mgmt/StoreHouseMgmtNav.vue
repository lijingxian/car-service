<template>
  <div class="store-house-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import http from '@/common/http';

export default {
  name: 'StoreHouseMgmtNav',
  data() {
    return {
      navUrl: '/admin/invoicing/purchase/queryDepotKpi.jhtml',
      form: {
        currentDayCreatedOutDepot: 0,
        currentDayDepotInventories: 0,
        currentMonthDepotTransfer: 0,
        currentDayCreatedInDepot: 0,
        currentMonthInDepot: 0,
        currentMonthDepotInventories: 0,
        currentDayDepotTransfer: 0,
        currentMonthOutDepot: 0,
        barCodeRulesCount: 0
      },
      authorities: []
    };
  },
  computed: {
    cardData: function() {
      return [
        [
          {
            link: this.authorities.includes('admin:export') ? '/invoicing/store-house-mgmt/depot-out-mgmt' : '',
            title: '创建出库单',
            content: ['销售/采购退货/盘点/调拨需要从仓库出库时创建出库单作为出库凭证'],
            bottom: [
              {
                content: '今日新增出库单',
                value: this.form.currentDayCreatedOutDepot,
                unit: '个'
              },
              {
                content: '本月累计出库单',
                value: this.form.currentMonthOutDepot,
                unit: '个'
              }
            ]
          },
          {
            link: this.authorities.includes('admin:inport') ? '/invoicing/store-house-mgmt/depot-in-mgmt' : '',
            title: '创建入库单',
            content: ['采购/销售/盘点/调拨需要从仓库入库时创建入库单作为入库凭证'],
            bottom: [
              {
                content: '今日新增入库单',
                value: this.form.currentDayCreatedInDepot,
                unit: '个'
              },
              {
                content: '本月累计入库单',
                value: this.form.currentMonthInDepot,
                unit: '个'
              }
            ]
          },
          {
            link: this.authorities.includes('admin:check') ? '/invoicing/store-house-mgmt/inventory' : '',
            title: '库存盘点',
            content: ['定期盘点仓库的库存数量，保证系统记录的数据的准确性'],
            bottom: [
              {
                content: '今日新增盘点单',
                value: this.form.currentDayDepotInventories,
                unit: '个'
              },
              {
                content: '本月累计盘点单',
                value: this.form.currentMonthDepotInventories,
                unit: '个'
              }
            ]
          },
          {
            link: this.authorities.includes('admin:storage.transfer') ? '/invoicing/store-house-mgmt/allotted-mgmt' : '',
            title: '库存调拨',
            content: ['当仓库缺货时，可从其他仓库进行商品调拨'],
            bottom: [
              {
                content: '今日新增调拨单',
                value: this.form.currentDayDepotTransfer,
                unit: '个'
              },
              {
                content: '本月累计调拨单',
                value: this.form.currentMonthDepotTransfer,
                unit: '个'
              }
            ]
          },
          {
            link: this.authorities.includes('admin:storage.barCode') ? '/invoicing/store-house-mgmt/bar-code-mgmt' : '',
            title: '条码管理',
            content: ['创建条码规则，应用规则后可扫描条码识别商品，方便仓库业务操作'],
            bottom: [
              {
                content: '已有条码规则',
                value: this.form.barCodeRulesCount,
                unit: '个'
              }
            ]
          }
        ],
        [
          {
            link: this.authorities.includes('admin:purchaseStatistic') ? '/invoicing/store-house-mgmt/stock-statistics' : '',
            title: '数据洞察',
            content: ['分析各种商品的库存情况']
          }
        ]
      ];
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      http
        .get(this.navUrl, { shopId: window.top.SHOP_ID || '' })
        .then(data => {
          Object.assign(this.form, data.data);
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
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    }
  },
  mounted() {
    this.getNavInfo();
    this.listAuthority();
  }
};
</script>

<style lang="scss">
.store-house-mgmt-nav {
  height: 100%;
  overflow: auto;
}
</style>
