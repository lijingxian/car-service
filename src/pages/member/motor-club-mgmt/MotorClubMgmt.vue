<template>
  <biz-grid class="motor-club-mgmt" v-loading="loading">
    <biz-header slot="top" :operations="operations" @operate="handleOperate">
    </biz-header>

    <motor-club-list :list="tableData" :editShopIds="editShopIds" @item-click="handleItemClick" @remove-item="handleRemoveItem"></motor-club-list>

    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>

    <right-popup slot="float" :open="open" :memberIds="memberIds" :itemId="itemId" :isEdit="isEdit" @close="open = false;" @hasMemberIds="hasMemberIds" @operationSuccess="handlePperationSuccess"></right-popup>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader, BizPagination } from '@/components/BizTable';
import MotorClubList from './Component/MotorClubList';

import { motorClubMgmt as service, global } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import rightPopup from './MotorClub/MotorClubPopup';

// 基础信息
const baseData = {
  data: {
    open: false,
    editShopIds: [],
    isEdit: true,
    memberIds: [],
    operations: [
      {
        label: '新增',
        name: 'add',
        type: 'primary',
        auth: ['admin:fleet.add']
      },
      {
        label: '刷新',
        name: 'refresh',
        type: ''
      }
    ],
    pagination: {
      pageSize: 20,
      currentPage: 1,
      total: 0
    },
    itemId: { id: '' }
  },
  methods: {
    add() {
      this.itemId = { id: '' };
      this.isEdit = true;
      this.open = true;
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          shopId: window.top.SHOP_ID || '',
          resourceType: '8'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    refresh() {
      this.query();
    },

    queryKpi() {
      this.query().then(data => {
        this.$message({
          customClass: 'motorists-club-activity__kpi',
          showClose: true,
          message: `当前车友会数量${data.fleetCount}个，车友会成员总数${data.memberTotalCount}人`,
          duration: 3000
        });
      });
    }
  },
  events: {
    handleOperate(name) {
      this[name]();
    },
    handleSizeChange(val) {
      this.$set(this.pagination, 'pageSize', val);
      this.$set(this.pagination, 'currentPage', 1);
      this.query();
    },
    handleCurrentChange(val) {
      this.$set(this.pagination, 'currentPage', val);
      this.query();
    },

    handlePperationSuccess() {
      // this.open = false;
      this.query();
    }
  }
};

// list相关
const dataList = {
  data: {
    loading: false,
    tableData: []
  },
  methods: {
    hasMemberIds(memberIds) {
      this.memberIds = memberIds;
    },
    // 查询
    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || '',

        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,

        fleetType: 'circle'
      };
    },
    query() {
      this.loading = true;
      return http
        .get(service.listPage.list, this.getQueryParams())
        .then(data => {
          this.tableData = data.content;

          this.$set(this.pagination, 'total', Number.parseInt(data.total));

          return data;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);

          return errData;
        })
        .finally(data => {
          this.loading = false;

          return data;
        });
    },

    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        // let params = urlUtil.toURLParams({ ids: ids });
        let params = {
          ids: ids
        };
        http
          .post(service.listPage.delete, params)
          .then(data => {
            this.$message.success('删除成功');
            this.query();
            // 刷新左侧菜单树
            window.top.postMessage({ method: 'setFleetTree' }, window.top.location.origin);
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  },
  events: {
    handleItemClick(model) {
      this.itemId = { id: model.id };
      if (model.unionConfig.editable === '0' && this.getUser.roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.open = true;
    },
    handleRemoveItem(model) {
      this.deleteItem([model.id]);
    }
  }
};

export default {
  name: 'MotorClubMgmt',
  components: {
    BizGrid,
    BizHeader,
    BizPagination,
    MotorClubList,

    rightPopup
  },
  data() {
    return {
      ...baseData.data,
      ...dataList.data
    };
  },
  methods: {
    ...dataList.methods,
    ...dataList.events,

    ...baseData.methods,
    ...baseData.events
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  mounted() {
    this.queryKpi();
    this.getEditableStores();
  }
};
</script>

<style lang="scss">
.motor-club-mgmt {
  .biz-popup .popup-content {
    width: 680px;
  }
}
</style>
