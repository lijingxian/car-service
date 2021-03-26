<template>
  <div class="im-right-sidebar">
    <el-tabs type="border-card"
             v-model="tabName">
      <el-tab-pane label="基础画像"
                   name="base-info">
        <PersonInfo>
        </PersonInfo>
      </el-tab-pane>
      <!-- <el-tab-pane label="偏好画像"
                   name="portrait-info">
        <PortraitPreference @showProduct="showProduct">
        </PortraitPreference>
      </el-tab-pane>
      <el-tab-pane label="消费画像"
                   name="consum-info">
        <ConsumPreference @showOrder="showOrder">
        </ConsumPreference>
      </el-tab-pane> -->

      <el-tab-pane label="工单"
                   v-if="isClient"
                   name="work-sheet">
        <work-sheet>
        </work-sheet>
      </el-tab-pane>

      <el-tab-pane label="转出"
                   v-if="isClient && tabType === 'roll-out'"
                   name="zhuanchu">
        <roll-out>
        </roll-out>
      </el-tab-pane>
    </el-tabs>
    <!-- <biz-popup-tabs :open="openOrder" @close="openOrder = false" v-model="orderName">
      <el-tab-pane label="基本信息" name="info">
        <order-base-info :itemId="orderId" :isEdit="isEdit" ref="orderBaseInfo"></order-base-info>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="productinfo">
        <product-info :itemId="orderId" :isEdit="isEdit" ref="productinfo"></product-info>
      </el-tab-pane>
    </biz-popup-tabs>
    <biz-popup-tabs :open="openProduct" @close="openProduct = false" v-model="productName">
      <el-tab-pane label="基本信息" name="product">
        <product-base-info :id="id" :isEdit="isEdit" :baseInfo="baseInfo" ref="productBaseInfo"></product-base-info>
      </el-tab-pane>
    </biz-popup-tabs> -->
  </div>
</template>

<script>
import PersonInfo from './PersonInfo';
// import PortraitPreference from './PortraitPreference';
// import ConsumPreference from './ConsumPreference';
import { mapGetters } from 'vuex';
import WorkSheet from './CSWorkSheet';
import RollOut from './RollOut';
// import OrderBaseInfo from '@/pages/order/OrderMgmt/BaseInfo';
// import ProductInfo from '@/pages/order/OrderMgmt/ProductInfo';
// import ProductBaseInfo from '@/pages/shop/commodity/commodity-mgmt/BaseInfo';
// import { BizPopupTabs } from '@/components/BizPopup';

export default {
  name: 'ImRightSidebar',
  data() {
    return {
      tabName: 'base-info',
      openOrder: false,
      orderName: 'info',
      isEdit: true,
      baseInfo: {},
      orderId: '',
      id: '',
      productName: 'product',
      openProduct: false
    };
  },
  computed: {
    ...mapGetters('CustomService', ['activatedRoom', 'tabType']),
    isCs() {
      return this.activatedRoom.imType === 'cs';
    },
    isClient() {
      return this.activatedRoom.imType === 'client' || this.activatedRoom.imType === 'clientEnd';
    },
    isGroup() {
      return this.activatedRoom.imType === 'group';
    }
  },
  watch: {
    tabType(tabType) {
      if (tabType === 'roll-out') {
        this.$nextTick(() => {
          this.tabName = 'zhuanchu';
        });
      } else {
        this.$nextTick(() => {
          this.tabName = 'base-info';
        });
      }
    }
  },
  created() {},
  components: { PersonInfo, WorkSheet, RollOut },
  methods: {
    // showOrder(row) {
    //   this.orderId = String(row.id);
    //   this.isEdit = false;
    //   this.orderName = 'info';
    //   this.openOrder = true;
    // },
    // showProduct(row) {
    //   this.id = String(row.target_id);
    //   this.isEdit = false;
    //   this.productName = 'product';
    //   row.shopId = String(row.shop_id);
    //   this.baseInfo = row;
    //   this.openProduct = true;
    //   this.$nextTick(() => {
    //     this.$refs.productBaseInfo.getProductCategoryList();
    //     this.$refs.productBaseInfo.refresh();
    //   });
    // }
    // defriend() {
    //   this.tabName = 'work-sheet';
    // }
  }
};
</script>

<style lang="scss">
.im-right-sidebar {
  width: 339px;
  height: 520px;
  border-left: 1px solid #e2e2e2;
  .el-tabs {
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      padding: 10px 10px 10px 0;
      flex-grow: 1;
      .biz-scroller,
      .el-form {
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 5px;
          height: 12px;
        }
        &::-webkit-scrollbar-thumb {
          background: #c3c3c3;
          border-radius: 12px;
        }
      }
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
