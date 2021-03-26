<template>
  <biz-grid class="map-mgmt">
    <!-- <biz-flex-table ref="table" :operations="operations" @operate="handleOperate" :tableData="tableData" :loading="loading"
      :pagination="pagination" @rowClick="rowClick" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
      <el-table-column prop="store" label="店铺">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="path" label="资源路径">
      </el-table-column>
    </biz-flex-table> -->
    <div slot="top">
      <biz-header :operations="operations" @operate="handleOperate"></biz-header>
    </div>
    <div style="position:relative;height:80%">
      <img :src="path" @click="ptsetting" class="map-img">
      <div v-if="path===''" :style="styleObject"></div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="open" v-model="tabName" @close="open = false;">
        <el-tab-pane label="点位设置" name="info">
          <PtSetting :itemId="mapId" @created="refresh">
          </PtSetting>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import http from '@/common/http';
import { customerService } from '@/common/urls';
import PtSetting from './PtSetting';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'MapMgmt',
  data() {
    return {
      tabName: 'info',
      itemId: '',
      mapId: '',
      defaultTab: '0',
      loading: false,
      open: false,
      selections: [],
      tableData: [],
      path: '',
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      operations: [
        {
          label: '点位设置',
          name: 'ptsetting',
          type: 'primary'
        }
      ],
      filters: []
    };
  },
  components: {
    BizPopupTabs,
    BizGrid,
    PtSetting,
    BizHeader
  },
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  created() {
    this.getList();
  },
  mounted() {},
  watch: {
    $route(nweVal, oldVal) {
      this.getList();
    }
  },
  methods: {
    handleOperate(name) {
      this[name]();
    },
    refresh() {
      this.getList();
    },
    operationSuccess() {
      this.getList();
    },
    ptsetting() {
      this.open = true;
    },
    getList() {
      this.loading = true;
      http
        .get(customerService.smartReception.robotMapList, {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
          this.mapId = data.data.length > 0 ? data.data[0].id : '';
          this.path = data.data.length > 0 ? data.data[0].path : '';
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.map-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  padding-left: 10px;
  .map-img {
    margin-left: 100px;
  }
  .federation-mgmt-header {
    text-align: right;
    padding: 5px 15px;
  }
  .biz-customcol {
    display: -webkit-box !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
}
</style>
