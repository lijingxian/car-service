<template>
  <biz-grid class="shipping-setting">
    <div slot="top">
      <div class="slot-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"
          :views="views" @onSwitch="onViewSwitch">
        </biz-header>
        <div class="model">
          <div class="font">发货流程模版</div>
          <img :src="fhlc" height="150">
        </div>
      </div>
    </div>
    <biz-flex-table ref="table" :tableData="tableData" :loading="loading" :pagination="pagination" v-show="!showList"
      @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @row-click="handleRowClick">
      <el-table-column label="流程名称" prop="name" min-width="180"></el-table-column>
      <el-table-column label="流程" min-width="700">
        <div class="process">
          <img :src="fhlc" height="150" align="center">
        </div>
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="handleDeleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-flex-table ref="table" :tableData="tableData" :loading="loading" :pagination="pagination" v-show="showList"
      @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" @selection-change="handleSelectionChange"
      @row-click="handleRowClick">
      <el-table-column label="流程名称" prop="name" min-width="180"></el-table-column>
      <el-table-column label="提交订单" min-width="100">
        <template slot-scope="scope">
          <div>
            <div v-for="item in scope.row.configs[1].items" :key="item.id">
              {{item.shop.name}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发货" min-width="100">
        <template slot-scope="scope">
          {{scope.row.configs[1].way==='0'?'付款前发货':'付款后发货'}}
        </template>
      </el-table-column>
      <el-table-column label="流程描述" prop="memo" min-width="100">
      </el-table-column>
      <el-table-column prop="tag" label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="handleDeleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <biz-popup-tabs :open="open" @close="open = false;" v-model="tabName">
        <el-tab-pane label="设置" name="first">
          <shipping-setting-info :idObject="infoId" @item-updated="refresh"></shipping-setting-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import fhlc from '@/assets/images/process/06.png';
import http from '@/common/http';
import urls from '@/common/urls';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizHeader, BizFlexTable } from '@/components/BizTable';
import ShippingSettingInfo from './ShippingSettingInfo';
export default {
  name: 'ProcessSettingSale',
  components: {
    BizGrid,
    BizPopupTabs,
    ShippingSettingInfo,
    BizFlexTable,
    BizHeader
  },
  data() {
    return {
      tabName: 'first',
      loading: false,
      open: false,
      showList: false,
      infoId: { id: '' },
      orderId: { id: '' },
      purchaseId: { id: '' },
      selections: [],
      tableData: [],
      fhlc: fhlc,
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary'
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      views: [
        {
          actived: true,
          class: 'iconfont biz-icon-qiapianshitu',
          title: '流程视图',
          name: 'card'
        },
        {
          actived: false,
          class: 'iconfont biz-icon-liebiaoshitu',
          title: '列表视图',
          name: 'list'
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入流程名称',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ]
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
    onViewSwitch(name) {
      if (name === 'card') {
        this.views[0].actived = true;
        this.views[1].actived = false;
        this.showList = false;
      } else {
        this.views[1].actived = true;
        this.views[0].actived = false;
        this.showList = true;
      }
    },
    filterDataChange() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    handlePageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleCurrentPageChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selections = val;
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
    },
    create() {
      this.infoId = { id: '' };
      this.open = true;
    },
    handleRowClick(row) {
      this.infoId = { id: row.id };
      this.open = true;
    },
    // 删除
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete(urls.invoicing.shopApprovalFlow, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一条数据');
      }
    },
    handleDeleteClick(model) {
      this.deleteItem([model.id]);
    },
    refresh() {
      this.getList();
    },
    getList() {
      let params = {
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        shopId: window.top.SHOP_ID || '',
        searchValue: this.filters[0].value,
        type: '3'
      };
      this.loading = true;
      http
        .get(urls.invoicing.shopApprovalFlows, params)
        .then(data => {
          this.tableData = data.dataList;

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
.shipping-setting {
  .model {
    display: flex;
    background: #f9f9f9;
    font-size: 12px;
    .font {
      padding: 30px 90px;
    }
  }
  .biz-flex-table {
    padding: 0px !important;
  }
  position: relative;
  .image {
    position: relative;
  }
  .process {
    position: relative;
    .step1 {
      position: absolute;
      top: 90px;
      left: 100px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
    .step11 {
      position: absolute;
      top: 80px;
      left: 100px;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
    .step2 {
      position: absolute;
      top: 90px;
      left: 275px;
    }
    .step22 {
      position: absolute;
      top: 80px;
      left: 275px;
    }
    .step3 {
      position: absolute;
      top: 90px;
      left: 425px;
    }
    .step4 {
      position: absolute;
      top: 90px;
      left: 575px;
    }
  }
}
</style>
