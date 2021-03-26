<template>
  <biz-grid class="process-s">
    <div align="center">
      <div class="image">
        <img :src="xslc" width="500px"/>
        <!-- <div class="button1">申请单审核</div> -->
        <div class="button2" @click="openOrder=true;tabName='second'"></div>
        <div class="button3" @click="openPurchase=true;tabName='third'"></div>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="申请单审核" name="first">
          <process-setting-sale-info :idObject="infoId" @item-updated="refresh"></process-setting-sale-info>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openOrder" @close="openOrder = false;" v-model="tabName">
        <el-tab-pane label="订单审核" name="second">
          <process-setting-sale-order :idObject="orderId" @item-updated="refresh"></process-setting-sale-order>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openPurchase" @close="openPurchase = false;" v-model="tabName">
        <el-tab-pane label="自动采购" name="third">
          <process-setting-sale-auto-purchase :idObject="purchaseId" @item-updated="refresh"></process-setting-sale-auto-purchase>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import xslc from '@/assets/images/process/xslc.png';
import http from '@/common/http';
import urls from '@/common/urls';
import { BizPopupTabs } from '@/components/BizPopup';
import ProcessSettingSaleInfo from './ProcessSettingSaleInfo';
import ProcessSettingSaleAutoPurchase from './ProcessSettingSaleAutoPurchase';
import ProcessSettingSaleOrder from './ProcessSettingSaleOrder';
export default {
  name: 'ProcessSettingSale',
  components: {
    BizGrid,
    BizPopupTabs,
    ProcessSettingSaleInfo,
    ProcessSettingSaleOrder,
    ProcessSettingSaleAutoPurchase
  },
  data() {
    return {
      tabName: 'first',
      loading: false,
      open: false,
      openOrder: false,
      openPurchase: false,
      infoId: { id: '' },
      orderId: { id: '' },
      purchaseId: { id: '' },
      xslc: xslc,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || ''
      };
      this.loading = true;
      http
        .get(urls.invoicing.approveSettingList, params)
        .then(data => {
          data.dataList.map(item => {
            if (item.billType === '3') {
              this.infoId = { id: item.id };
            }
            if (item.billType === '4') {
              this.orderId = { id: item.id };
            }
            if (item.billType === '5') {
              this.purchaseId = { id: item.id };
            }
          });

          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.process-s {
  position: relative;
  .image {
    width: 500px;
    position: relative;
  }
  .button1 {
    position: absolute;
    top: 222px;
    left: 190px;
    font-size: 14px;
    // color: #ff7300;
    cursor: pointer;
  }
  .button2 {
    position: absolute;
    top: 232px;
    left: 92px;
    font-size: 14px;
    color: #ff7300;
    cursor: pointer;
    height: 50px;
    width: 180px;
  }
  .button3 {
    position: absolute;
    top: 334px;
    left: 92px;
    font-size: 14px;
    color: #ff7300;
    cursor: pointer;
    height: 50px;
    width: 180px;
  }
}
</style>
