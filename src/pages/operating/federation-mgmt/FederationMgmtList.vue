<template>
  <biz-grid class="federation-mgmt">
    <div slot="top" class="federation-mgmt-header">
      <el-radio-group v-model="showMode" size="small">
        <el-radio-button label="0">地图位置</el-radio-button>
        <el-radio-button label="1">列表信息</el-radio-button>
      </el-radio-group>
      <biz-header :operations="operations" @operate="operate" v-show="showMode === '1'" :filters="filters" @filterDataChange="filterDataChange"></biz-header>
    </div>
    <biz-store-map :value="tableData" v-show="showMode === '0'" @addClickHandler="rowOperationClickHandler" ref="map" :showMode="showMode"></biz-store-map>
    <expand-table
      ref="expandTable"
      v-show="showMode === '1'"
      :data="tableData"
      :loading="loading"
      @expand-change="expandChange"
      :isSearch="isSearch"
      @delete="handleDelete"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      @addOperator="addOperator"
      @addStore="addStore"
      style="height:95%;min-height:95%"
    ></expand-table>
    <biz-pagination :pagination="pagination"></biz-pagination>
    <div slot="float">
      <biz-popup-tabs :open="showStore" v-model="tabName" @close="showStore = false;">
        <el-tab-pane label="基础画像" name="federationmgmtInfo">
          <FederationMgmtInfo ref="baseInfo" :itemId="itemId" :type="type" :parent="parent" :parentType="parentType" @operationSuccess="operationSuccess"></FederationMgmtInfo>
        </el-tab-pane>
        <el-tab-pane label="推介画像" name="federationmgmtIntroduce" v-if="itemId">
          <FederationMgmtIntroduce :itemId="itemId" :type="type"></FederationMgmtIntroduce>
        </el-tab-pane>
        <el-tab-pane label="付款方式配置" name="federationmgmtPayment" v-if="itemId">
          <FederationMgmtPayment :itemId="itemId" :type="type"></FederationMgmtPayment>
        </el-tab-pane>
        <el-tab-pane label="展示画像" name="federationmgmtVr" v-if="itemId">
          <FederationMgmtVr :itemId="itemId" :type="type"></FederationMgmtVr>
        </el-tab-pane>
        <el-tab-pane label="评级画像" name="ShopEvaluation" v-if="itemId">
          <ShopEvaluation :itemId="itemIdObj" :type="type"></ShopEvaluation>
        </el-tab-pane>
        <el-tab-pane label="配送方式" name="distributor" v-if="itemId">
          <DistributorMgmt :itemId="itemIdObj" :type="type"></DistributorMgmt>
        </el-tab-pane>
        <el-tab-pane label="物流公司" name="logistics" v-if="itemId">
          <LogisticsMgmt :itemId="itemIdObj" :type="type"></LogisticsMgmt>
        </el-tab-pane>
        <el-tab-pane label="金融产品" name="fince" v-if="itemId && getUser.roleLevel==='platform'">
          <FederationFince :itemId="itemIdObj" :type="type"></FederationFince>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="showOperator" v-model="tabName" @close="showOperator = false;">
        <el-tab-pane label="运营商信息" name="federationmgmtOperatorInfo">
          <FederationMgmtOperatorInfo
            :itemId="itemId"
            ref="operatorInfo"
            :type="type"
            :parent="parent"
            :parentType="parentType"
            :parentName="parentName"
            @operationSuccess="operationSuccess"
          ></FederationMgmtOperatorInfo>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import ExpandTable from './federation/components/ExpandTable';
import { BizGrid } from '@/components/BizGrid';
import { BizStoreMap } from '@/components/BizStoreMap';
import FederationMgmtInfo from './federation/FederationMgmtInfo';
import FederationMgmtOperatorInfo from './federation/federationMgmtOperatorInfo';
import FederationMgmtIntroduce from './federation/FederationMgmtIntroduce';
import FederationFince from './federation/FederationFince';
import FederationMgmtPayment from './federation/FederationMgmtPayment';
import FederationMgmtVr from './federation/FederationMgmtVr';
import ShopEvaluation from '@/pages/shop/shop-rate/shop-evaluation/ShopEvaluation';
import federationMgmtService from '@/service/federation-mgmt/federationMgmt';
import DistributorMgmt from '@/pages/shop/shop-rate/distributor-setting/DistributorMgmt';
import LogisticsMgmt from '@/pages/order/logistics-mgmt/logistics-mgmt-shop/LogisticsMgmt';
import http from '@/common/http';
import { mapGetters } from 'vuex';
export default {
  name: 'FederationMgmt',
  data() {
    return {
      tabName: 'federationmgmtInfo',
      itemId: '',
      itemIdObj: {},
      currentRow: {},
      type: '',
      parent: '',
      parentType: '',
      parentName: '',
      showStore: false,
      showOperator: false,
      isSearch: true,
      flag: false,
      loading: false,
      showMode: '1',
      selections: [],
      operations: [
        {
          disabled: false,
          label: '添加一级运营商',
          name: 'addOperator',
          type: 'primary',
          auth: ['admin:union.manage.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '0',
              label: '停用'
            },
            {
              value: '1',
              label: '启用'
            }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入名称',
          name: 'searchValue',
          value: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 1000,
        pageSizes: [1000],
        currentPage: 1,
        total: 9
      }
    };
  },
  components: {
    BizPopupTabs,
    ExpandTable,
    BizGrid,
    BizStoreMap,
    FederationMgmtInfo,
    FederationMgmtOperatorInfo,
    FederationMgmtIntroduce,
    FederationMgmtPayment,
    FederationFince,
    FederationMgmtVr,
    ShopEvaluation,
    DistributorMgmt,
    LogisticsMgmt,
    BizHeader,
    BizPagination
  },
  created() {
    this.getList();
  },
  mounted() {
    if (this.getUser.roleLevel === 'shop') {
      document.querySelectorAll('.biz-header__operation-wrapper .el-button')[0].style.display = 'none';
    } else {
      document.querySelectorAll('.biz-header__operation-wrapper .el-button')[0].style.display = '';
    }
    if (this.$route.query.tabName && this.$route.query.tabName !== 'federationmgmtInfo') {
      this.itemId = this.$route.query.shopId;
      this.tabName = this.$route.query.tabName;
      this.showStore = true;
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    showMode(val) {
      if (val === '0') {
        this.listOperatorOrStoreMap();
      } else {
        this.$refs.expandTable.doLayout();
      }
    },
    itemId(val) {
      this.itemIdObj = { id: val };
    },
    tabName(nVal) {
      if (this.itemId) {
        switch (nVal) {
          case 'federationmgmtInfo':
            this.$message({
              showClose: true,
              message: ' 此处您可进行店铺名称、地址、电话、Logo等修改'
            });
            break;
          case 'federationmgmtIntroduce':
            this.$message({
              showClose: true,
              message: '您可以编辑店铺信息，越丰富的信息越有助于用户全方面了解您的店铺哦'
            });
            break;
          case 'federationmgmtPayment':
            this.$message({
              showClose: true,
              message: '您可以选择您想要的支付方式，记得别忘了填写相关信息'
            });
            break;
          case 'federationmgmtVr':
            this.$message({
              showClose: true,
              message: '店铺展示可帮助用户更好的了解店铺和产品，快去上传VR资源吧'
            });
            break;
          case 'ShopEvaluation':
            this.$message({
              showClose: true,
              message: '您可以编辑店铺信息，越丰富的信息越有助于用户全方面了解您的店铺哦'
            });
            break;
        }
      }
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.isSearch = true;
      this.tableData = [];
      this.flag = true;
      this.$refs.expandTable.maxLevel = '1';
      console.log(this.$refs.expandTable);
      this.getList();
    },
    addStore(row) {
      this.parent = row.id;
      this.parentType = row.userType;
      this.itemId = '';
      this.itemIdObj = { id: '' };
      this.showStore = true;
      this.tabName = 'federationmgmtInfo';
    },
    addOperator(row) {
      this.parent = row ? row.id : '';
      this.parentType = row ? row.userType : '';
      this.parentName = row ? row.name : '';
      this.itemId = '';
      this.itemIdObj = { id: '' };
      this.showOperator = true;
      this.tabName = 'federationmgmtOperatorInfo';
    },
    getKpi() {
      if (this.getUser.roleLevel === 'shop') {
        http
          .get('/admin/store/queryNavigationKpi.jhtml', {
            shopId: window.top.SHOP_ID || this.itemId || this.parent || ''
          })
          .then(data => {
            let msg = '共有店铺合计' + data.data.storeCount + '，其中启用状态' + data.data.enableStoreCount;
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: msg,
              duration: 3000
            });
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage || '操作出现错误');
          });
      } else {
        http
          .get('/admin/store/queryNavigationKpi.jhtml', {
            companyId: this.itemId || this.parent || ''
          })
          .then(data => {
            let msg = '共有运营商合计' + data.data.companyCount + '，其中启用状态' + data.data.enableCompanyCount;
            this.$message({
              customClass: 'motorists-club-activity__kpi',
              showClose: true,
              message: msg,
              duration: 3000
            });
          })
          .catch(ErrorData => {
            this.$message.warning(ErrorData.errorMessage || '操作出现错误');
          });
      }
    },
    operationSuccess(row) {
      this.flag = true;
      if (!this.itemId) {
        this.showStore = false;
        this.showOperator = false;
      }
      let params = {
        state: this.filters[0].value,
        searchValue: this.filters[1].value,
        id: row.id,
        pageNumber: this.pagination.currentPage,
        pageSize: 500,
        type: row.userType,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      federationMgmtService.list(
        params,
        data => {
          if (!row || !row.userType) {
            this.tableData = data.userList;
            this.pagination.total = Number(data.total);
            this.getKpi();
          } else {
            this.tableData.forEach(item => {
              if (item.id === row.id) {
                this.$set(item, 'hasChild', '1');
                item.childUsers = data.userList;
              } else if (item.childUsers) {
                this.setChildren(item.childUsers, row, data.userList);
              }
            });
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    listOperatorOrStoreMap() {
      this.flag = true;
      this.getListMap();
    },
    getListMap(row) {
      this.itemId = row ? row.id : '';
      this.itemIdObj = { id: this.itemId };
      this.type = row ? row.userType : '';
      this.parent = row ? row.parentId : '';
      this.parentType = row ? row.parentType : '';
      let params = {
        state: this.filters[0].value,
        searchValue: this.filters[1].value,
        id: this.itemId || this.parent,
        pageNumber: this.pagination.currentPage,
        pageSize: 500,
        type: this.itemId ? this.type : this.parentType,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      federationMgmtService.listMap(
        params,
        data => {
          if (!row) {
            this.tableData = data.userList;
            this.getKpi();
          } else {
            this.tableData.forEach(item => {
              if (item.id === row.id) {
                item.childUsers = data.userList;
              } else if (item.childUsers) {
                this.setChildren(item.childUsers, row, data.userList);
              }
            });
          }
          console.log(this.tableData);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    active(row) {
      federationMgmtService.active(
        { id: row.id, type: row.userType },
        data => {
          this.flag = true;
          this.$message.success('操作成功');
          this.getList();
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    rowOperationClickHandler(model, e, column) {
      if (column && column.label === '操作') return;
      this.itemId = String(model.id);
      this.type = model.userType;
      if (model.userType === 'operator') {
        this.showOperator = true;
        this.showStore = false;
        this.tabName = 'federationmgmtOperatorInfo';
      } else {
        this.showStore = true;
        this.showOperator = false;
        this.tabName = 'federationmgmtInfo';
      }
    },
    adminMgmt(model) {
      this.$router.push({
        path: '/oa/staff-mgmt/admin',
        query: { parentId: model.id, type: model.userType }
      });
    },
    expandChange(row) {
      this.currentRow = row;
      this.getList(row);
    },
    getList(row) {
      this.itemId = row ? row.id : '';
      this.itemIdObj = { id: this.itemId };
      this.type = row ? row.userType : '';
      this.parent = row ? row.parentId : '';
      this.parentType = row ? row.parentType : '';
      let params = {
        state: this.filters[0].value,
        searchValue: this.filters[1].value,
        id: this.itemId || this.parent,
        pageNumber: this.pagination.currentPage,
        pageSize: 500,
        type: this.itemId ? this.type : this.parentType,
        orderProperty: this.orderProperty,
        orderDirection: this.orderDirection
      };
      federationMgmtService.list(
        params,
        data => {
          if (!row) {
            this.tableData = data.userList;
            this.pagination.total = Number(data.total);
            this.getKpi();
          } else {
            this.tableData.forEach(item => {
              if (item.id === row.id) {
                this.$set(item, 'hasChild', '1');
                item.childUsers = data.userList;
              } else if (item.childUsers) {
                this.setChildren(item.childUsers, row, data.userList);
              }
            });
          }
          if (this.$route.query.tabName === 'federationmgmtInfo') {
            console.log(this.tableData[0]);
            this.rowClick(this.tableData[0]);
            // this.itemId = this.$route.query.shopId;
            // this.tabName = this.$route.query.tabName;
            // this.showStore = true;
          }
          console.log(this.tableData);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    setChildren(child, row, arr) {
      child.forEach((item, index) => {
        if (item.id === row.id) {
          this.$set(item, 'hasChild', '1');
          item.childUsers = arr;
        } else {
          this.setChildren(item.childUsers, row, arr);
        }
      });
    },
    // 状态/店铺名过滤
    filterHandler(value, row, column) {
      const property = column.property;
      if (property === 'isEnabled') {
        return row[property] === value;
      }
    },
    filterDataChange(filters) {
      if (filters[1].value === '') {
        this.isSearch = true;
        this.tableData = [];
        this.flag = true;
        this.$refs.expandTable.maxLevel = '1';
        console.log(this.$refs.expandTable);
        this.getList();
      } else {
        this.isSearch = false;
        this.tableData = [];
        this.flag = true;
        console.log(this.$refs.expandTable);
        this.getList();
      }
    },
    handleSelectionChange(val) {
      // this.operations[0].disabled = true;
      // this.operations[0].type = '';
      // if (val.length === 1) {
      //   this.operations[0].disabled = false;
      //   this.operations[0].type = 'primary';
      //   if (val[0].userType === 'operator') {
      //     this.operations[1].disabled = false;
      //     this.operations[1].type = 'primary';
      //   } else {
      //     this.operations[1].disabled = true;
      //     this.operations[1].type = '';
      //   }
      // }
      // if (val.length > 1) {
      //   this.operations[1].disabled = true;
      //   this.operations[1].type = '';
      // }
      this.selections = val;
    },
    rowClick(row) {
      this.itemId = String(row.id);
      this.itemIdObj = { id: this.itemId };
      this.type = row.userType;
      this.parent = row.parentId;
      this.parentType = row.parentType;
      if (row.userType === 'operator') {
        let timestamp = Math.round(new Date() / 1000);
        window.SHOP_ID = '';
        window.Company_ID = row.id;
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { id: row.id, type: 'operator', parent: row.parentId, parentType: row.parentType, timestamp: timestamp }
        });
        this.showOperator = true;
        this.showStore = false;
        this.tabName = 'federationmgmtOperatorInfo';
        this.parentName = '';
        this.$refs.operatorInfo.queryParentOperator(row.parentId);
      } else {
        window.SHOP_ID = row.id;
        let timestamp = Math.round(new Date() / 1000);
        this.$router.push({
          path: '/union/federation-mgmt/federation',
          query: { id: row.id, type: 'store', parent: row.parentId, parentType: row.parentType, timestamp: timestamp }
        });
        this.showStore = true;
        this.showOperator = false;
        this.tabName = 'federationmgmtInfo';
        let msg = ' 此处您可进行店铺名称、地址、电话、Logo等修改';
        this.$message({
          showClose: true,
          message: msg
        });
      }
    },
    handleSortChange(value) {
      const ORDER_DIRECTION = {
        ascending: 'asc',
        descending: 'desc'
      };
      this.orderProperty = value.column ? value.column.property : '';
      this.orderDirection = value.order ? ORDER_DIRECTION[value.order] : '';
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        federationMgmtService.delete(
          {
            ids: [row.userType + ';' + row.id],
            parentStoreId: this.parent,
            parentType: this.parentType
          },
          data => {
            this.$message.success('删除成功');
            this.operationSuccess({
              id: row.parentId,
              userType: row.parentType
            });
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    delete() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.userType + ';' + element.id);
        });
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          federationMgmtService.delete(
            {
              ids: ids,
              parentStoreId: this.parent,
              parentType: this.parentType
            },
            data => {
              this.$message.success('删除成功');
              this.operationSuccess();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
        });
      } else {
        this.$message('请选择一条数据');
      }
    },
    // 状态文字颜色
    stateColor(row) {
      if (row.isEnabled === '1') {
        // 启用
        return '#67c23a';
      } else {
        // 停用
        return '#f56c6c';
      }
    }
  }
};
</script>

<style lang="scss">
.federation-mgmt {
  .biz-icon-zhiding1 {
    color: #ff7300;
    font-size: 26px;
  }
  img {
    height: 100px;
    width: 100px;
  }
  .biz-two-column {
    display: flex;
    .biz-two-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .federation-mgmt-header {
    text-align: right;
  }
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-left: 10px;
    }
  }
  .el-tabs__content {
    overflow: auto;
  }
  .delete-btn {
    color: red;
  }
  .biz-pagination .el-pagination {
    .el-pagination__sizes {
      display: none;
    }
    .el-pagination__jump {
      display: none;
    }
  }
}
</style>
