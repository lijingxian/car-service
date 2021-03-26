<template>
  <biz-grid class="approve-setting-mgmt" v-loading="loading">
    <div class="approve-setting-card">
      <a class="approve-item" v-for="(item, index) in dataList" :key="index" @click="handleClick(item, $event)">
        <div class="center-content">
          <div class="title-class">
            <span class="title-name">{{item.billName}}</span>
          </div>
          <el-switch
            v-model="item.enabled"
            active-color="#87d068"
            inactive-color="#d9d9d9"
            active-value="1"
            inactive-value="0"
            :active-text="item.enabled==='1'?'已启用':'已停用'"
            @change="stateChange(item)"
          ></el-switch>
        </div>
        <div class="content">
          <div class="count" :title="item.description">{{item.description}}</div>
        </div>
      </a>
    </div>
    <!-- 侧边弹出栏 -->
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="基本信息" name="first">
          <setting-bsae :idObject="idObject" @item-updated="refresh"></setting-bsae>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import SettingBsae from './ApproveSettingBsae';

export default {
  name: 'ApproveSettingMgmt',
  components: {
    BizPopupTabs,
    BizGrid,
    SettingBsae
  },
  props: {},
  data() {
    return {
      idObject: {
        id: ''
      },
      open: false,
      tabName: 'first',
      loading: false,
      // table checkbox 选项
      selections: [],
      dataList: [],
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
    this.refresh();
  },
  mounted() {},
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
          console.log(data);
          this.dataList = data.dataList;
          for (const item of this.dataList) {
            item.description = '';
            if (item.billName === '采购申请单') {
              item.description = '开启采购申请审批后，需按审批设置等待审批通过，通过后方可进行后续采购。';
            }
          }
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    stateChange(row) {
      this.loading = true;
      let params = {
        id: row.id || '',
        shopId: window.top.SHOP_ID || '',
        enabled: row.enabled
      };
      http
        .put(urls.invoicing.stateChange, params)
        .then(data => {
          this.$message.success('操作成功');
          this.loading = false;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    handleClick(row, event) {
      this.idObject = {
        id: row.id
      };
      this.open = true;
    }
  }
};
</script>

<style lang="scss">
.approve-setting-mgmt {
  .approve-setting-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5px;
    padding-top: 20px;
    height: 100%;
    overflow: auto;
    .approve-item-disabled {
      background: #f2f2f2;
    }
    .approve-item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 20px 25px;
      width: 320px;
      height: 188px;
      text-align: center;
      border-radius: 6px;
      border: #fff solid 1px;
      cursor: pointer;

      box-shadow: #bbb 2px 2px 8px;

      img {
        display: block;
        height: 48px;
        width: 48px;
        // margin: 0 auto;
        border-radius: 50%;
        text-align: center;
      }
      .center-content {
        display: flex;
        justify-content: space-between;
        .title-class {
          text-align: left;
          font-size: 14px;
          color: #3b3b3b;
          display: flex;
          font-weight: bold;
          justify-content: space-between;
          .title-name {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .font {
            font-size: 12px;
            color: #aaa;
            font-weight: normal;
            margin: 2px 0px 0px 5px;
          }
          img {
            display: block;
            height: 28px;
            width: 28px;
            // margin: 0 auto;
            border-radius: 50%;
            text-align: center;
          }
        }

        .content {
          margin-left: 10px;
          text-align: left;
        }
      }
      .shop-name {
        font-size: 12px;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
      .count {
        font-size: 12px;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        max-height: 50px;
        text-align: left;
        font-weight: normal;
        margin-bottom: 30px;
      }
      &:hover {
        .close {
          display: block;
        }

        border: #ff7300 solid 1px;
      }
    }
  }
}
</style>
