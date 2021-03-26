<template>
  <biz-grid class="process-p">
    <div align="center">
      <div class="image">
        <img :src="cglc" width="500px" />
        <div class="button1" @click="open=true;tabName='first'"></div>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="申请单审核" name="first">
          <process-setting-purchase-info :idObject="infoId" @item-updated="refresh"></process-setting-purchase-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import cglc from '@/assets/images/process/cglc.png';
import http from '@/common/http';
import urls from '@/common/urls';
import { BizPopupTabs } from '@/components/BizPopup';
import ProcessSettingPurchaseInfo from './ProcessSettingPurchaseInfo';
export default {
  name: 'ProcessSettingPurchase',
  components: {
    BizGrid,
    BizPopupTabs,
    ProcessSettingPurchaseInfo
  },
  data() {
    return {
      loading: false,
      open: false,
      cglc: cglc,
      tabName: 'first',
      infoId: { id: '' },
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
            if (item.billType === '1') {
              this.infoId = { id: item.id };
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
.process-p {
  position: relative;
  .image {
    width: 500px;
    position: relative;
  }
  .button1 {
    position: absolute;
    top: 288px;
    left: 94px;
    font-size: 14px;
    color: #ff7300;
    cursor: pointer;
    height: 50px;
    width: 180px;
  }
}
</style>
