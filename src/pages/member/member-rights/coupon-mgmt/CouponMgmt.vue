<template>
  <biz-grid class="coupon-mgmt">
    <div slot="top" class="activity-mgmt-top">
      <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
    </div>
    <div class="content" ref="c-content" v-loading="loading">
      <coupon-item v-for="item of tableData" :item="item" :key="item.id" @query="query" @copy="copy" @delete-item="deleteItem"></coupon-item>
    </div>
    <div v-if="tableData.length === 0" :style="styleObject"></div>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="tabOpen" v-model="popupTabName" @close="tabOpen = false;">
        <el-tab-pane label="基本信息" name="baseinfo">
          <coupon-base-info @update="update" :idObj="idObj"></coupon-base-info>
        </el-tab-pane>
        <el-tab-pane label="发放记录" name="records" v-if="idObj.id">
          <records :idObj="idObj"></records>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>
<script>
import { BizPopupTabs } from '@/components/BizPopup';
import NoContent from '@/assets/images/emptyGray.png';
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import CouponItem from './CouponItem';
import CouponBaseInfo from './CouponBaseInfo';
import Records from './Records';
import { couponMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'CouponMgmt',
  data() {
    return {
      loading: false,
      refreshSign: true,
      popupTabName: 'baseinfo',
      tabOpen: false,
      idObj: {
        id: ''
      },
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:member.memberBenefits.coupon.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入卡券名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    BizHeader,
    BizPagination,
    BizGrid,
    CouponItem,
    CouponBaseInfo,
    Records
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
    operationSuccess(id) {
      this.getList();
    },
    createRights(rightsId) {
      this.rightsId = rightsId;
      this.getList();
    },
    getList() {
      let params = {
        type: '13',
        searchValue: this.filters[0].value,
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      this.loading = true;
      http
        .get(couponMgmt.list, params)
        .then(data => {
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(data => {})
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      this.tabOpen = true;
      this.idObj = { id: '' };
      this.popupTabName = 'baseinfo';
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.$refs['c-content'].parentNode.scrollTop = 0;
      this.refresh();
    },
    rightsIconHandeler(brandId, id) {
      this.popupTabName = 'baseinfo';
      this.rightsId = id;
      this.openRights = true;
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.refresh();
    },
    query(item) {
      this.popupTabName = 'baseinfo';
      this.tabOpen = true;
      this.idObj = {
        id: item.id
      };
    },
    copy(id) {
      if (!id) {
        return;
      }
      this.loading = true;
      let params = {
        id
      };
      http
        .post(couponMgmt.copy, params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '复制成功!'
          });
          this.refresh();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteItem(id) {
      if (!id) {
        return;
      }
      this.loading = true;
      let params = {
        ids: [id]
      };
      http
        .delete(couponMgmt.baseInfo, params)
        .then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.refresh();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    update() {
      this.refresh();
    }
  }
};
</script>

<style lang="scss">
.coupon-mgmt {
  .content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
